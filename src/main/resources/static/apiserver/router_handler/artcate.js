//导入数据库操作模块
const db = require('../db/db');

//获取文章分类
exports.getArticleCates = (req, res) => {
    //根据分类的状态，获取所有没有被删除的分类列表数据
    //is_delete 为0时候表示没有被标记为删除
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc';
    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        if (results.length <= 0) return res.cc({ msg: '分类列表为空！' });
        res.send({
            status: 0,
            msg: '获取文章分类列表成功！',
            data: results
        })
    })
}

//根据id获取文章分类数据
exports.getArticleCatesById = (req, res) => {
    //删除的数据就不用了
    sql = 'select * from ev_article_cate where id=? and is_delete<>1';
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length === 1) {
            return res.send({
                status: 0,
                msg: '获取文章分类数据成功！',
                data: results[0]
            })
        }
        if (results.length === 0)
            return res.cc('找不到该文章分类');
        return res.cc('获取文章分类数据失败');

    })
}

//新增文章分类
exports.addArticleCates = (req, res) => {
    //定义查询语句
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 0) {
            //定义查询语句
            const sql = 'insert into ev_article_cate (name,alias) values (?,?)';
            db.query(sql, [req.body.name, req.body.alias], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) {
                    return res.cc('添加文章分类失败！')
                }
                res.cc('OK', 0);
            })
        } else {
            if (req.body.name === results[0].name && req.body.alias === results[0].alias)
                return res.cc('分类目录与别名已存在！')
            if (req.body.name == results[0].name)
                return res.cc('分类目录已存在！')
            if (req.body.alias == results[0].alias)
                return res.cc('别名已存在！')
        }
    })

}

//删除文章分类
exports.deleteArticleCates = (req, res) => {
    //需要查询
    const sql = 'select * from ev_article_cate where id=? and is_delete=0';
    db.query(sql, req.params.id, (err, results) => {
            if (err) return res.cc(err);
            if (results.length === 0) return res.cc('找不到需要删除的数据');
            //以下为查找成功
            const sql = 'update ev_article_cate set ? where id=?';
            db.query(sql, [{ is_delete: 1 }, req.params.id], (err, results) => {
                if (err) return res.cc(err);
                if (results.affectedRows === 1) {
                    return res.cc('ok', 0);
                }
                return res.cc('删除文章分类失败！');
            })

        })
        //res.send(req.params.id + '');
}

//更新现有文章分类
exports.updateArticleCates = (req, res) => {
    //查重
    const sql = 'select * from ev_article_cate where id<>? and (name=? or alias=?) and is_delete=0';
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err);
        if (results.length === 0) {
            //开始更新
            const sql = 'update ev_article_cate set ? where id=?';
            db.query(sql, [{ name: req.body.name, alias: req.body.alias }, req.body.id], (err, results) => {
                if (err) return res.cc(err);
                if (results.affectedRows === 0) return res.cc('没有找到该id下的文章分类');
                res.cc('更新分类信息成功！', 0);
            })
        } else {
            if (results.length === 2)
                return res.cc('分类目录与别名已存在！')
            if (req.body.name == results[0].name)
                return res.cc('分类目录已存在！')
            if (req.body.alias == results[0].alias)
                return res.cc('别名已存在！')
        }
    })
}
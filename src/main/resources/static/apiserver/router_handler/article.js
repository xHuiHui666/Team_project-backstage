//导入数据库操作模块
const db = require('../db/db');

// 配置multer 以便于解析 multipart/from-data 格式的数据
const multer = require('multer');
//导入处理路径的模块
const path = require('path');
const { query } = require('express');

//创建multer的实例对象，使用 dest 属性来指定文件的存放路径
const uploads = multer({
    dest: path.join(__dirname, '../uploads')
})
exports.uploads = uploads;

//添加文章
exports.addArticle = (req, res) => {
    //先判断是否上传了文章的封面
    //Fieldname 是表单上传的文件中指定的键名
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面是必选参数！');
    }
    //验证表单数据的合法性
    const articleInfo = {
            //标题 内容 状态 所属分类id
            //解构赋值
            ...req.body,
            //文章封面上传服务端时候所存放的路径
            cover_img: path.join('/uploads', req.file.filename),
            //文章发布时间
            pub_date: new Date(),
            //文章作者的id,直接解析token就行了
            author_id: req.auth.id
        }
        //定义文章发布的查询语句
    const sql = 'insert into ev_article set ?';

    //开查
    db.query(sql, articleInfo, (err, results) => {

        //执行sql语句失败
        if (err) return res.cc(err)

        //执行 SQL 语句成功，但是影响行数不是1
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')

        //发布文章成功
        res.cc('发布文章成功！', 0)
    })
}

//获取文章列表数据
exports.listArticle = (req, res) => {
    //查询数据库中的所有数据,使用 INNER JOIN 内连接 只显示两表联结字段相等的行
    /*
    内连接
    inner join(等值连接)：只显示两表联结字段相等的行，(很少用到，最好别用)；
    
    外连接
    left join：以左表为基础,显示左表中的所有记录,不管是否与关联条件相匹配,而右表中的数据只显示与关联条件相匹配的记录,不匹配的记录以NULL字符填充
     */
    /* 
    SELECT
        表1.字段1,
        表2.字段1,
        表1.字段2,
        ...
    FROM
        表1
    LEFT JOIN
        表2
    ON 表1.字段=表2.字段
    WHERE
        相关条件（如表1.字段1 = xxx）
    ORDER BY
        排序条件等（如 oder by 表2.字段1）
    */
    let sql = 'SELECT a.id,a.title,a.pub_date,a.state,b.NAME AS cate_name FROM ev_article AS a LEFT JOIN ev_article_cate AS b ON a.cate_id = b.id WHERE a.is_delete = 0 AND b.is_delete = 0';
    //判断传入的参数有无cateid state
    const cate_id = req.query.cate_id,
        state = req.query.state;

    if (cate_id && cate_id !== '') {
        sql += ` AND b.id=${cate_id}`;
    }
    if (state && state !== '') {
        sql += ` AND a.state='${state}'`;
    }

    db.query(sql, (err, results) => {
        if (err || sql.length === 0) return res.cc('获取文章列表失败');
        //成功
        res.send({
            status: 0,
            msg: '获取文章列表成功！',
            data: pagination(req.query.pagenum, req.query.pagesize, results),
            total: results.length
        })
    })
}

//数组分页函数
function pagination(pageNo, pageSize, array) {
    var offset = (pageNo - 1) * pageSize
    return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize)
}

//根据id删除文章数据
exports.deleteArticle = (req, res) => {
    //创建sql语句
    const sql = 'update ev_article set is_delete=1 where id=?';
    db.query(sql, req.params.id, (err, results) => {
        if (err || results.affectedRows !== 1) return res.cc('删除文章失败！');
        res.cc('删除文章成功！', 0)

    })
}

//根据id获取文章详情
exports.getArticle = (req, res) => {
    const sql = 'select * from ev_article where id=? and is_delete=0';
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc('获取文章失败！');
        if (results.length === 0) return res.cc('找不到该文章,可能已被删除！');
        //成功
        res.send({
            status: 0,
            msg: '获取文章成功！',
            data: results[0]
        })
    })
}

//根据文章id更新文章信息
exports.editArticle = (req, res) => {
    //先判断是否上传了文章的封面
    //Fieldname 是表单上传的文件中指定的键名
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面是必选参数！');
    }
    //验证表单数据的合法性
    const articleInfo = {
            //标题 内容 状态 所属分类id
            //解构赋值
            ...req.body,
            //文章封面上传服务端时候所存放的路径
            cover_img: path.join('/uploads', req.file.filename),
            //文章发布时间
            pub_date: new Date(),
            //文章作者的id,直接解析token就行了
            author_id: req.auth.id
        }
        //定义文章发布的查询语句
    const sql = 'update ev_article set ? where id=?';

    //开查
    db.query(sql, [articleInfo, req.body.id], (err, results) => {

        //执行sql语句失败
        if (err) return res.cc(err)

        //执行 SQL 语句成功，但是影响行数不是1
        if (results.affectedRows !== 1) return res.cc('修改文章失败！');

        //发布文章成功
        res.cc('修改文章成功！', 0)
    })
}

//统计文章数量
exports.totalArticle = (req, res) => {
    const sql = 'select count(*) as count from ev_article where is_delete=0';
    db.query(sql, (err, results) => {
        if (err) res.cc('请求失败');
        res.send({
            status: 0,
            msg: 'ok',
            count: results[0].count
        })
    })

}
//导入数据库操作模块
const db = require('../db/db');

//获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    //定义sql语句
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?';
    //执行查询，这里的id在登录之后返回的token里面已经有了，可以直接用
    //req.auth express-jwt模块默认会把用户信息挂载到auth上
    db.query(sql, req.auth.id, (err, results) => {
        //执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        //执行sql语句成功，但是查到的条数不是1
        if (results.length !== 1) {
            return res.cc('获取用户数据失败！');
        }
        //响应用户信息给客户端
        res.send({
            status: 0,
            msg: '获取用户基本信息成功！',
            data: results[0]
        })
    })
}

//更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    const sql = 'update ev_users set ? where id=?';
    //查询
    db.query(sql, [req.body, req.body.id], (err, results) => {
        //失败
        if (err) {
            return res.cc(err);
        }
        //行数不是1
        if (results.affectedRows !== 1) {
            return res.cc('用户数据提交失败');

        }
        //成功
        return res.cc('修改用户信息成功！', 0)
    });
}

const bcrypt = require('bcryptjs');
//重置密码的处理函数
exports.updatePassword = (req, res) => {
    const sql = 'select * from ev_users where id=?';
    //查询用户是否存在
    db.query(sql, req.auth.id, (err, results) => {
        //失败
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('用户不存在');

        //判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) return res.cc('原密码错误');

        //加密新密码，存入数据库
        const updateSql = 'update ev_users set password=? where id=?';
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(updateSql, [newPwd, results[0].id], (err, results) => {
            //失败
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更改密码失败！');
            return res.cc('ok!', 0);
        })

    })
}

//更换头像的函数
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic=? where id=?';
    db.query(sql, [req.body.avatar, req.auth.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更新头像失败');
        //成功
        return res.cc('ok', 0);
    })
}
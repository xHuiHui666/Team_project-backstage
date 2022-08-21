//导入数据库操作模块
const db = require('../db/db');

//导入密码处理模块，进行密码加密存储
const bcrypt = require('bcryptjs');

//导入token生成模块
const jwt = require('jsonwebtoken');

//导入配置文件
const config = require('../\.env');

//注册处理函数
exports.regUser = (req, res) => {
    //获取用户信息
    const userInfo = req.body;

    //定义SQL语句
    const queryStr = 'select * from ev_users where username=?';
    const insertStr = 'insert into ev_users set ?';
    console.log(userInfo);

    //查询
    db.query(queryStr, userInfo.username, (err, results) => {
        if (err) {
            return res.cc(err)
        }
        //判断用户名是否呗占用
        if (results.length > 0) {
            return res.cc('用户名被占用，请重新输入')
        }
        //如果用户名是可以使用的
        //10表示salt的长度
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);

        //插入新用户
        db.query(insertStr, { username: userInfo.username, password: userInfo.password }, function(err, results) {
            if (err) {
                return res.cc(err)
            }
            //老样子，判断影响行数
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败,请重试!');
            }
            return res.cc('注册成功!', 0);
        })

    });


}

//登录的处理函数
exports.login = (req, res) => {
    //接收表单数据
    const userInfo = req.body;
    //定义sql语句
    const queryStr = 'select * from ev_users where username=?';

    //执行sql语句，查询用户的数据
    db.query(queryStr, userInfo.username, function(err, results) {
        //失败
        if (err) {
            return res.cc(err);
        }
        //查询少于1条或者多余1条都算错误
        if (results.length !== 1) {
            return res.cc('用户名不存在');
            //判断用户输入的登录密码是否和数据库中的密码一致
        }
        //用户传入的密码，和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password);
        if (!compareResult) {
            return res.cc('密码输入错误');
        }

        //在服务器端生成token字符串(包含id),覆盖掉password与头像，因为是敏感信息
        const user = {...results[0], password: '', user_pic: '' };

        //对用户信息加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });

        //响应token给客户端
        res.send({
            status: 0,
            msg: 'ok',
            //加上前缀，前端请求更方便
            token: 'Bearer ' + tokenStr
        })
    })

}
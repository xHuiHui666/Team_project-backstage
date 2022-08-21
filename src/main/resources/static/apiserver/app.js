//导入模块
const express = require('express');
const app = express();
const Joi = require('joi');

//导入配置文件
const config = require('./.env');

//配置 cors中间件
const cors = require('cors');
app.use(cors());

//解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));


//封装res.send全局中间件
app.use(function(req, res, next) {
    //0成功1失败，默认1
    res.cc = function(msg, status = 1) {
        res.send({
            status,
            //判断msg类型
            msg: msg instanceof Error ? msg.message : msg
        })
    }
    next();
})

//静态资源文件托管
app.use('/uploads', express.static('./uploads'));

//解析token的中间件
var { expressjwt: jwt } = require("express-jwt");

//使用中间件，排除api目录
app.use(jwt({ algorithms: ["HS256"], secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));

//导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter);


//导入并展示用户信息的路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);

//导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter);

//导入并使用发布文章的路由模块
const articleRouter = require('./router/article');
app.use('/my/article', articleRouter)

//错误级别的中间件
app.use(function(msg, req, res, next) {
    //数据验证失败
    if (msg instanceof Joi.ValidationError) {
        return res.cc(msg);
    }
    //未登录
    if (msg.name === 'UnauthorizedError') {
        return res.cc('未登录，请登录');
    }
    res.cc(msg);

})

//启动服务器
app.listen(3007, () => {
    console.log('api server is running at http://127.0.0.1:3007')
})
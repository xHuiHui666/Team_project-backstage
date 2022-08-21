const express = require('express');

//用户路由处理函数模块
const userHandler = require('../router_handler/user');

//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

//导入规则对象(es6 解构对象 语法)
const Joi = require('joi');
const { reg_login_schema } = require('../schema/user');

//创建路由对象
const router = express.Router();

//注册用户
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser);

//登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login);


//共享模块
module.exports = router;
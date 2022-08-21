//导入express
const express = require('express');
const userinfo_handler = require('../router_handler/userinfo');
const update_userinfo = require('../schema/user');
//验证合法性的中间件
const expressJoi = require('@escook/express-joi');

//导入验证规则对象
const { update_userinfo_schema, update_pasword_schema, update_avatar_schema } = require('../schema/user');
const Joi = require('joi');

//创建路由对象
const router = express.Router();

//获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo);

//更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

//重置密码的路由
router.post('/updatepwd', expressJoi(update_pasword_schema), userinfo_handler.updatePassword);

//更换头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar);

module.exports = router;
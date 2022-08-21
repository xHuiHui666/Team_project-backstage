//导入express
const express = require('express');

//创建路由对象
const router = express.Router();
const article_handle = require('../router_handler/article');

//导入数据验证中间件
const expressJoi = require('@escook/express-joi');
const { add_article_schema, list_article_schema, delete_article_schema, get_article_schema, edit_article_schema } = require('../schema/article');
const Joi = require('joi');

//发布新文章
// req.file 是 `avatar` 文件的信息
// req.body 将具有文本域数据，如果存在的话
//注意，两个中间件顺序不要反了
router.post('/add', article_handle.uploads.single('cover_img'), expressJoi(add_article_schema), article_handle.addArticle);

//获取文章列表数据
router.get('/list', expressJoi(list_article_schema), article_handle.listArticle);

//根据id删除文章数据
router.get('/delete/:id', expressJoi(delete_article_schema), article_handle.deleteArticle)

//根据id获取文章详情
router.get('/:id', expressJoi(get_article_schema), article_handle.getArticle)

//根据 Id 更新文章信息
router.post('/edit', article_handle.uploads.single('cover_img'), expressJoi(edit_article_schema), article_handle.editArticle)

//求总文章数量
router.get('/get/total', article_handle.totalArticle)

//向外部共享路由对象
module.exports = router
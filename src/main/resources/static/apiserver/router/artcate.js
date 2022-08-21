//导入express
const express = require('express');

//创建路由对象
const router = express.Router();
const artcate_handle = require('../router_handler/artcate');

//导入数据验证中间件
const expressJoi = require('@escook/express-joi');

//导入文章分类验证模块
const { add_cate_schema, id_cate_schema, update_cate_schema } = require('../schema/artcate');

//获取文章分类列表数据
router.get('/cates', artcate_handle.getArticleCates);

//根据id获取文章分类数据
router.get('/cates/:id', expressJoi(id_cate_schema), artcate_handle.getArticleCatesById);

//新增文章分类数据
router.post('/addcates', expressJoi(add_cate_schema), artcate_handle.addArticleCates);

//删除文章分类数据
//这里的id是一个动态获取的参数，可以通过 req.params获取
router.get('/deletecate/:id', expressJoi(id_cate_schema), artcate_handle.deleteArticleCates);

//更新文章分类数据
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handle.updateArticleCates)

//向外部共享路由对象
module.exports = router
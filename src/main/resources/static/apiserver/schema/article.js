//导入自定义验证规则模块
const Joi = require('joi');

//标题 分类id 内容 发布状态的验证规则
const title = Joi.string().required();
const cate_id = Joi.number().integer().min(1).required();
const content = Joi.string().required().allow('');
//valid表示只允许这两种状态
const state = Joi.string().valid('已发布', '草稿').required();

//页码，数据
const pagenum = Joi.number().integer().min(1).required();
const pagesize = Joi.number().integer().min(1).required();

//id
const id = Joi.number().integer().min(1).required();


//发布文章的验证规则对象
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

//获取文章列表的验证规则对象
exports.list_article_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id: Joi.number().integer().min(1).empty(''),
        state: Joi.string().valid('已发布', '草稿').empty('')
    }
}

exports.delete_article_schema = {
    params: {
        id
    }
}

exports.get_article_schema = {
    params: {
        id
    }
}

exports.edit_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        state
    }
}
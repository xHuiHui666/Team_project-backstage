//导入数据验证规则的模块
const Joi = require('joi');

//数据规则
const name = Joi.string().required();
const alias = Joi.string().alphanum().required();
const id = Joi.number().integer().min(1).required();
//导出规则
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

exports.id_cate_schema = {
    params: {
        id
    }
}

exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}
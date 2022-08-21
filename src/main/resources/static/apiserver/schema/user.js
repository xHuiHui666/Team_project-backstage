const Joi = require('joi');
/**
 * string()必须是字符串
 * alphanume()必须是字母或者数字
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值不能空
 * pattern(正则) 值必须符合正则表达式的规则
 */

//用户名验证规则
const username = Joi.string().alphanum().min(1).max(10).required();

//密码的验证规则 六到十二位，不包含空格
const password = Joi.string().pattern(/^[\S]{6,12}$/).required();

//id的验证规则
const id = Joi.number().integer().min(1).required();

//昵称
const nickname = Joi.string().required();

//邮箱
const email = Joi.string().email().required();

//头像
//dataUri 表示的是像base64那样的数据
const avatar = Joi.string().dataUri().required();


//导出注册和登录表单的验证对象
exports.reg_login_schema = {
    //表示需要对 req.body 总的数据进行验证
    body: {
        username,
        password
    }
}

//导出更新用户基本信息的对象
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}

//重置密码
exports.update_pasword_schema = {
    body: {
        //使用password这个规则，验证oldpwd的值
        oldPwd: password,
        //concat表示合并两条验证规则
        //ref表示oldPwd和newPwd一样
        //not(joi.ref('oldPwd') 表示不能一样
        newPwd: Joi.not(Joi.ref('oldPwd')).concat(password)
    }
}

exports.update_avatar_schema = {
    body: {
        avatar
    }
}
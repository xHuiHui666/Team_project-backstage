package com.wolf.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wolf.controller.utils.MD5Util;
import com.wolf.controller.utils.Result;
import com.wolf.domain.User;
import com.wolf.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @PostMapping
    public Result<User> save(@RequestBody User user){
        // 设置创建时间
        user.setCreateTime(new Date().toString());
        // 密码加密
        String p = MD5Util.mdtEncoding(user.getPwd());
        String d = MD5Util.mdtEncoding(MD5Util.pwdEncode);
        String s = p+d;
        user.setPwd(s);
        boolean b = userService.save(user);// 保存用户
        return new Result(b,b?"注册成功^_^!" : "注册失败-_-!");
    }

    @PostMapping("/login")
    public Result<User> login(HttpServletRequest request, @RequestBody User user){
        // 1. 密码加密
        String p = MD5Util.mdtEncoding(user.getPwd()); // 密码加密
        String d = MD5Util.mdtEncoding(MD5Util.pwdEncode);
        String s = p+d;
        // 设置密码给当前用户
        user.setPwd(s);

        // 2.根据name 查询该用户
        LambdaQueryWrapper<User> queryMapper = new LambdaQueryWrapper<>();
        queryMapper.eq(User::getName,user.getName());
        User usr = userService.getOne(queryMapper);

        // 3.没有查询到返回登陆失败结果
        if (usr == null){
           return new Result("登录失败-_-!");
        }

        // 4.密码不相同返回登陆失败
        if (!(usr.getPwd().equals(user.getPwd()))){
            return new Result("登录失败-_-!");
        }

        // 5.登陆成功
        request.getSession().setAttribute("user",user);

        return new Result(true,user,"登陆成功^_^!");
    }

}

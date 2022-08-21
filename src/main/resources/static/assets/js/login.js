$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
        // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
            // 2. 发起Ajax的POST请求
        var data = {
            name: $('#form_reg [name=username]').val(),
            pwd: $('#form_reg [name=password]').val(),
            realName: $('#form_reg [name=realname]').val(),
            phone: $('#form_reg [name=phone]').val()
        }
        var jsonStr = JSON.stringify(data);
        console.log("data === " + jsonStr);

        $.ajax({
            url: "/users",
            type: 'POST',
            contentType: "application/json;charset=utf-8",
            dataType: 'json',
            data: jsonStr,
            success: function (res) {
                layer.msg(res.msg);
            },
            error: function (res) {
                layer.msg(res.msg);
            }
        });

    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()

        var data = {
            name: $('#form_login [name=username]').val(),
            pwd: $('#form_login [name=password]').val()
        }

        var jsonStr = JSON.stringify(data);
        $.ajax({
            url: '/users/login',
            method: 'POST',
            // 快速获取表单中的数据
            contentType: "application/json;charset=utf-8",
            data: jsonStr,
            success: function(res) {
                layer.msg('登录成功！', { time: 1000 }, function() {
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                    localStorage.setItem('token', res.token)
                        // 跳转到后台主页
                    location.href = '/index.html'
                })

            },
            error:function(res){
                layer.msg('登录失败！', { time: 1000 }, function() {
                    // 跳转到登录页面
                    location.href = '/login.html'
                })
            }
        })
    })
})


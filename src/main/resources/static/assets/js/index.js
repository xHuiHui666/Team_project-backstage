//存储菜单信息
var MENU_LIST = [];
layui.use('element', function() {
    var element = layui.element;
    //事件
    element.on('nav()', function(data) {
        //console.log($(data).find('.text').html()); //当前Tab标题所在的原始DOM元素
        //console.log($(data).parent().hasClass('layui-nav-item')); //当前Tab标题所在的原始DOM元素

        //调用函数
        var floor = 0;
        //如果点击的不是首页
        if (!$(data).parent().hasClass('home')) {
            if ($(data).parent().hasClass('layui-nav-item')) {
                floor = 1
            } else
            if ($(data).parents('.layui-nav-item')) {
                show_meun(1, $(data).parents('.layui-nav-item').find('.text').html())
                floor = 2
            }
            show_meun(floor, $(data).find('.text').html())
        } else {
            $('#tiptit').empty()
        }
        //保存状态
        var breadtab = $('.breadcrumb').html();
        sessionStorage.setItem('breadtab', breadtab);
    });
});


//显示菜单(层级，名字)
function show_meun(level, name) {
    //循环对比相同层级是否有重复数据，并删除
    for (var i = 0; i < MENU_LIST.length; i++) {
        if (MENU_LIST[i].level == level) {
            MENU_LIST.splice(i, MENU_LIST.length - (i));
        }
    }

    let ob = {};
    ob.level = level;
    ob.name = name;
    MENU_LIST.push(ob);

    //渲染
    var show_txt = '';
    let separator = '<span lay-separator>' + $('#crumb').attr('lay-separator') + '</span>';
    for (var i = 0; i < MENU_LIST.length; i++) {
        show_txt += separator + MENU_LIST[i].name;
    }
    $('#tiptit').html(show_txt);
}

$(function() {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();

    var layer = layui.layer

    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something

            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')

            // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    //先隐藏主页面内容
    $('.layui-body').hide();
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                layui.layer.msg('获取用户信息失败,即将跳转到登录页...', { time: 1000 }, function() {
                    location.href = '/login.html'
                });
                return false;
            } else {
                $('.layui-body').show();
                // 调用 renderAvatar 渲染用户的头像
                renderAvatar(res.data)
            }
        },
        // 不论成功还是失败，最终都会调用 complete 回调函数
        complete: function(res) {
            // console.log('执行了 complete 回调：')
            console.log(res)
                // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 || res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空 token
                localStorage.removeItem('token')
                    // 2. 强制跳转到登录页面
                location.href = '/login.html'
            }
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username
        // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}

//记住导航栏选择项目
$('#nav a[target=fm]').click(function() {
    //保存
    var clicklink = $(this).attr('href');
    $('iframe[name=fm]').attr('src', clicklink);
    //存到会话存储中
    sessionStorage.setItem('clickhref', clicklink);
    //console.log(sessionStorage.getItem('clickhref'));
})


$('document').ready(function() {
    //初始化面包屑
    $('.breadcrumb').html(sessionStorage.getItem('breadtab'))
        //显示上一次的页面
    if (sessionStorage.getItem('clickhref')) {
        let href = sessionStorage.getItem('clickhref');
        $('iframe[name=fm]').attr('src', href);
        $('#nav a').each((index, ele) => {
            if ($(ele).attr('href') == href) {
                $(ele).parent().addClass('layui-this');
                $(ele).parents('.layui-nav-item').addClass('layui-nav-itemed')
            }
        })
    }
})
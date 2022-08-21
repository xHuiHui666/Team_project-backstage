$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    initArtCateList()

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 5, // 每页显示几条数据，默认每页显示5条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);

                var total = 10;
                // 调用 laypage.render() 方法来渲染分页的结构
                laypage.render({
                    elem: 'pageBox', // 分页容器的 Id
                    count: total, // 总数据条数
                    limit: q.pagesize, // 每页显示几条数据
                    curr: q.pagenum, // 设置默认被选中的分页
                    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                    limits: [2, 3, 5, 10],
                    // 分页发生切换的时候，触发 jump 回调
                    // 触发 jump 回调的方式有两种：
                    // 1. 点击页码的时候，会触发 jump 回调
                    // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
                    jump: function(obj, first) {
                        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                        // 如果 first 的值为 true，证明是方式2触发的
                        // 否则就是方式1触发的
                        console.log(first)
                        console.log(obj.curr)
                            // 把最新的页码值，赋值到 q 这个查询参数对象中
                        q.pagenum = obj.curr
                            // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                        q.pagesize = obj.limit
                            // 根据最新的 q 获取对应的数据列表，并渲染表格
                            // initTable()
                        if (!first) {
                            // initTable()
                        }
                    }
                })
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加教室',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增失败！')
                }
                initArtCateList()
                layer.msg('新增成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改项目',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }
                layer.msg('更新数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    });
    //渲染日期选择框
    layui.use('laydate', function() {
        var laydate = layui.laydate;

        //执行一个laydate实例
        laydate.render({
            elem: '#date_end' //指定元素
        });
        laydate.render({
            elem: '#date_start' //指定元素
        });
    });
})
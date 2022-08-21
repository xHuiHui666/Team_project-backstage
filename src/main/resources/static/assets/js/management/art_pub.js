$(function() {
    var layer = layui.layer
    var form = layui.form
    var isEditMode = false
    initCate();
    // 初始化富文本编辑器
    initEditor()

    //0.如果有id的话，就获取id
    var editid = sessionStorage.getItem('_editid');
    if (editid) {
        //销毁
        sessionStorage.removeItem('_editid');
        console.log('修改id：' + editid);
        autoFill(editid)
        isEditMode = true;
    } else {

        imageCropperInit();
    }
    //定义自动填充文章分类的方法
    function autoFill(id) {
        $.ajax({
            method: 'GET',
            url: `/my/article/${id}`,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章内容失败！');
                    isEditMode = false
                }

                $('#image').attr('src', '/apiserver/' + res.data.cover_img);


                imageCropperInit();
                setTimeout(() => {
                    //填充内容
                    $('#article_title').val(res.data.title);
                    $(`dd[lay-value=${res.data.cate_id}]`).click();
                    tinymce.activeEditor.setContent(res.data.content);

                }, 500);

                //initEditor(res.data.content);
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        //图片编辑器初始化
    function imageCropperInit() {
        // 1. 初始化图片裁剪器
        var $image = $('#image')



        // 3. 初始化裁剪区域
        $image.cropper(options);
        window.cropperImgElement = $image;
    }

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        window.cropperImgElement
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
            // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
            // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
            // 4. 将封面裁剪过后的图片，输出为一个文件对象
        window.cropperImgElement
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                    //这里判断一下是发布文章还是修改文章
                if (isEditMode) {
                    console.log("是编辑器模式");
                    fd.append('id', editid)
                    updateArticle(fd);
                } else {
                    console.log('不是编辑器模式');
                    publishArticle(fd)
                }
            })
    })

    //定义一个更新文章的方法
    function updateArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            //可以通过append()方法来追加数据 formdata.append("name","laotie")
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
            }
        })
    }
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
            }
        })
    }
})
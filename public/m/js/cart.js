var letao;

$(function () {
    //实例化Letao对象
    letao = new Letao();
    letao.initScroll();
    letao.queryCart();
    letao.deleteProduct();
    letao.editeProduct();
    letao.totalMoney();

})


//创建一个Letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function () {

}

//初始化对象的方法
Letao.prototype = {

    //初始化区域滚动函数
    initScroll: function () {
        var options = {
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: true, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        }
        mui('.mui-scroll-wrapper').scroll(options);
    },

    //查询购物车
    queryCart: function () {
        $.ajax({
            url: '/cart/queryCart',
            success: function (data) {
                console.log(data);
                if (data.error) {
                    window.location.href = './login.html'
                } else {
                    // 渲染到页面
                    var html = template('productTmp', data);
                    $('.product-list').html(html);

                    // 5. 渲染完后后把所有复选框选中
                    $('input[type="checkbox"]').prop('checked', true);

                    letao.totalMoney();

                }

            }
        })
    },

    totalMoney: function () {
        getSum();

        $('input[type="checkbox"]').on('change', function () {
            getSum();
        })

        function getSum() {
            // 2. 获取所有选中的复选框
            var checkeds = $('input[type="checkbox"]:checked');

            var sum = 0;
            $(checkeds).each(function (i, e) {
                // console.log(e);
                var price = $(e).data('price');
                var num = $(e).data('num');
                var money = price * num;
                sum += money;
            });
            sum = sum.toFixed(2);
            $('.order p span').html(sum);
        }
    },

    //删除
    deleteProduct: function () {
        $('.product-list').on('tap', '.delete', function () {
            var id = $(this).parent().parent().data('id');
            // console.log(id);
            $.ajax({
                url: '/cart/deleteCart',
                data: {
                    id: id
                },
                success: function (data) {
                    // console.log(data);
                    if (data.success) {
                        console.log('删除成功');
                        //刷新页面
                        letao.queryCart();
                    } else {
                        window.location.href = './login.html';
                    }
                }
            })
        })
    },

    //3.显示选中尺码
    selectSize: function () {
        $("body").on("tap", ".edit-size .btn-size", function () {
            console.log(8);
            $(this)
                .addClass("active")
                .siblings()
                .removeClass("active");
        });
    },

    //编辑
    editeProduct: function () {
        $('.product-list').on('tap', '.edite', function () {

            var obj = {
                id: $(this).parent().parent().data('id'),
                size: $(this).parent().parent().data('size'),
                num: $(this).parent().parent().data('num'),
                productSize: $(this).parent().parent().data('product-size'),
                productNum: $(this).parent().parent().data('product-num'),
            };
            // console.log(obj);

            // 获取尺码
            var startSize = obj.productSize.split("-")[0];
            var endSize = obj.productSize.split("-")[1];
            var productSize = [];
            for (var i = startSize; i <= endSize; i++) {
                productSize.push(i - 0);
            }
            // console.log(productSize);
            obj.productSize = productSize;

            var html = template('editeTmp', obj);
            //去除换行
            html = html.replace(/(\r)?\n/g, "");
            // console.log(html);

            mui.confirm(html, '编辑商品', ['是', '否'], function (e) {
                if(e.index == 0){
                    //获取修改后的值
                    size = $('.btn-size.active').data('size');
                    console.log(size);
                    num = mui('.mui-numbox').numbox().getValue();

                    //更新购物车
                    $.ajax({
                        url: '/cart/updateCart',
                        type: 'post',
                        data: {
                            'id': obj.id,
                            'size': size,
                            'num': num
                        },
                        success: function (data) {  
                            if(data.success){
                                letao.queryCart();
                            }
                        }
                    })
                }else if(e.index == 1){
                    console.log('继续购物');
                }
            });

            // 渲染完毕后去初始化数字框
            mui('.mui-numbox').numbox();

            // 初始化尺码选择
            letao.selectSize();

        })
    }

}
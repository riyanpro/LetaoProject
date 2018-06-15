var letao;
var search;
var page = 1;

$(function () {
    //实例化Letao对象
    letao = new Letao();
    //调用区域滚动的方法
    letao.initScroll();
    //调用下拉刷新和上拉加载的方法
    letao.pullRefresh();
    //查询商品数据  渲染页面
    letao.searchProductList();
    //获取搜索页面传来的url参数
    search = letao.getQueryString('search');
    //第一次进入页面  渲染商品内容
    letao.getProductData({proName: search},function (data) {  
        var html = template('productListTem',data);
        $('.mui-content .mui-row').html(html);

        $('.search-input').val(search);
    })
    //调用排序的方法
    letao.productSort();
})


//创建一个Letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function () {

}


//初始化对象的方法
Letao.prototype = {

    //1.初始化区域滚动函数
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

    //2.初始化下拉刷新和上拉加载函数
    pullRefresh: function () {
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", //下拉刷新容器
                down: {
                    // height: 50, //可选,默认50.触发下拉刷新拖动距离,
                    // contentdown: "下拉可以刷新", //可选，下拉显示的标题内容
                    // contentover: "释放立即刷新", //可选，释放时，显示的标题内容
                    // contentrefresh: "正在刷新...", //可选，正在刷新时，显示的标题内容
                    callback: function () {
                        //必选，刷新函数
                        //设置延时器  一定时间后停止刷新
                        setTimeout(function () {
                            //刷新  根据搜索的内容查询商品的数据
                            letao.getProductData({
                                proName: search,
                            }, function (data) {
                                var html = template('productListTem', data);
                                //因下拉刷新与上拉加载的渲染不同  此处不能写死
                                $('.mui-content .mui-row').html(html);

                                console.log('下拉刷新完毕');
                                //结束下拉刷新
                                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                                //重置上拉加载功能，并把page的值设为1
                                //注意：refresh()中需传入true
                                mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                                page = 1;
                            });
                        }, 1000)
                    }
                },
                up: {
                    callback: function () {
                        setTimeout(function () {
                            letao.getProductData({
                                proName: search,
                                page: ++page
                            }, function (data) {
                                var html = template('productListTem', data);
                                //因下拉刷新与上拉加载的渲染不同  此处不能写死
                                $('.mui-content .mui-row').append(html);

                                console.log('上拉加载完毕');
                                if (data.data.length != 0) {
                                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                                } else {
                                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                                }
                            })
                        }, 1000)
                    }
                }
            }
        });
    },

    //3.查询商品数据
    searchProductList: function () {
        //给搜索按钮添加点击事件
        //mui的影响  搜索click事件不生效  用tap事件
        $('.search-btn').on('tap', function () {
            search = $('.search-input').val();
            // console.log(search);
            //调用函数  获取商品数据  渲染页面
            letao.getProductData({
                proName: search,
                // pageSize: 4
            }, function (data) {
                var html = template('productListTem', data);
                $('.mui-content .mui-row').html(html);
            });
        })
    },

    //4.封装获取商品数据的请求代码，渲染页面
    getProductData: function (obj, callback) {
        $.ajax({
            url: '/product/queryProduct',
            data: {
                page: obj.page || 1,
                pageSize: obj.pageSize || 2,
                proName: obj.proName,
                price: obj.price,
                num: obj.num
            },
            success: function (data) {
                console.log(data);

                //有回调函数的话  就执行
                if (callback) {
                    //在数据渲染完后 再停止刷新和加载
                    callback(data);
                }
            }
        });
    },

    //5.网上比较经典的js获取url中的参数的方法
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        } else {
            return null;
        }
    },

    //6.排序
    productSort: function () {  
        //设置点击事件
        $('.productlist .title').on('tap','a',function () {  
            var type = $(this).data('sort-type');
            var sort = $(this).data('sort');
            if(sort == 1) {
                sort = 2;
            }else {
                sort = 1;
            }
            $(this).attr('data-sort',sort);
            // console.log(sort);
            if(type == 'price'){
                letao.getProductData({
                    proName: search,
                    price: sort,
                },function (data) {  
                    var html = template('productListTem', data);
                    $('.mui-content .mui-row').html(html);
                });
            }else if(type == 'num') {
                letao.getProductData({
                    proName: search,
                    num: sort
                },function (data) {  
                    var html = template('productListTem', data);
                    $('.mui-content .mui-row').html(html);
                });
            }
        })
    }

}
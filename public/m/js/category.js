$(function () {
    //实例化Letao对象
    var leTao = new Letao();

    //调用获取左侧导航数据的方法
    leTao.getLeftData();
    //获取右侧商标数据
    leTao.getRightData();
})



//创建一个Letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function () {

}

//初始化对象的方法
Letao.prototype = {
    //获取左侧导航列表数据
    getLeftData: function () { 
        $.ajax({
            url:'/category/queryTopCategory',
            success: function (data) { 
                //渲染页面
                var html = template('categoryListTem',data);
                $('.category-left ul').html(html);

            }
        })
    },

    //获取右侧商标数据
    getRightData: function (id) { 
        //页面一打开自动获取第一个数据
        getData(1);

        //注册点击事件  获取右侧商标数据
        $('.category-left ul').on('click','a',function () { 
            $(this).parent().addClass('active').siblings().removeClass('active');
            var id = $(this).data('id');
            // console.log(id);
            //传入id  调用获取右侧数据函数
            getData(id);
        })


        //局部封装获取右侧数据的函数
        function getData(id) { 
            //根据传入的id请求数据
            $.ajax({
                url: '/category/querySecondCategory',
                data: {
                    id: id
                },
                success: function (data) {
                    // console.log(data);
                    var html = template('categoryNavTem',data);
                    if(html){
                        $('.category-right .mui-row').html(html);
                    }else{
                        $('.category-right .mui-row').html('<h5>暂无数据！</h5>')
                    }
                }
            })
        }
    }
}
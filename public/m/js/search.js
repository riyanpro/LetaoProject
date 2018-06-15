// 将实例化letao对象作为全局变量
var letao;
$(function () {
    //实例化letao对象
    letao = new Letao();
    //调用获取历史记录的方法
    letao.addHistory();
    //调用查询历史记录的方法
    letao.queryHistory();
    //调用删除历史记录的方法
    letao.deleteHistory();
    // 调用清空历史记录的方法
    letao.clearHistory();
})


//创建一个letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function () {

}

//初始化对象的方法
Letao.prototype = {

    //1.添加历史记录
    addHistory: function () {
        //点击搜索按钮
        $('.search-btn').on('click', function () {
            //获取输入的内容
            var search = $('.search-input').val();
            //判断内容不为空  triim()去除两侧的所有空格
            if(!search.trim()) {
                //为空，提示用户
                alert('请输入要搜索的商品！');
                return false;
            }
            //获取已经存储的内容
            var arr = window.localStorage.getItem('searchData');
            //初始id为0
            var id = 0;
            if (arr && JSON.parse(arr).length) {
                //如果有值，就将获取到的字符串转为数组  转换后才可以push方法
                arr = JSON.parse(arr);
                //设置id
                var id = arr[arr.length - 1].id + 1;
            } else {
                //没有值就设置一个空数组
                arr = [];
                //如果数组为空  则id的值为0
                id = 0;
            }
            //如果输入的内容跟记录不重复，将输入的内容添加到数组中
            //假设不重复
            var flag = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].search == search) {
                    flag = true;
                }
            }
            //如果flag仍为false  表示不重复 可以添加到数组里
            if (flag == false) {
                arr.push({
                    'search': search,
                    'id': id
                });
            }
            //将数组转换为JSON的字符串格式 保存在本地
            window.localStorage.setItem('searchData', JSON.stringify(arr));
            //搜索后  自动刷新页面  将记录渲染到页面
            letao.queryHistory();
            //跳转到搜索页面
            window.location.href = "productlist.html?search="+search;
        })
    },

    //2.查询历史记录 渲染页面
    queryHistory: function () {
        //获取本地数据
        //获取已经存储的内容
        var arr = window.localStorage.getItem('searchData');
        if (arr && JSON.parse(arr).length) {
            //如果有值，就将获取到的字符串转为数组  转换后才可以push方法
            arr = JSON.parse(arr);
            //设置id
            var id = arr[arr.length - 1].id + 1;
        } else {
            //没有值就设置一个空数组
            arr = [];
            //如果数组为空  则id的值为0
            id = 0;
        }
        //调用模版引擎方法  渲染到页面
        var html = template('searchHistoryTem',{'rows':arr});
        $('.content').html(html);
    },

    //3.删除历史记录
    deleteHistory: function () {  
        //委托事件  绑定删除事件
        $('.content').on('click','.delete',function () {  
            //获取id
            var id = $(this).siblings().data('id');
            // console.log(id);
            //获取数组
            var arr = window.localStorage.getItem('searchData');
            arr = JSON.parse(arr);
            //遍历数组  如果 数组元素的id与获取的id相等   删除该元素
            for (var  i = 0; i < arr.length; i++) { 
                if(arr[i].id == id) {
                    arr.splice(i,1);
                }
            }
            //将删除后的数组转为字符串，存在本地
            arr = JSON.stringify(arr);
            window.localStorage.setItem('searchData',arr);
            //刷新页面
            letao.queryHistory();
        })
    },

    //4.清空历史记录
    clearHistory: function () {  
        //点击清空删除所有记录
        $('.clear').on('click',function () {  
            window.localStorage.setItem('searchData','');
            //刷新页面
            letao.queryHistory();
        });
    },


}
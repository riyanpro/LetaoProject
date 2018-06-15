
var letao;

$(function() {
  //实例化Letao对象
  letao = new Letao();

});

//创建一个Letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function() {};

//初始化对象的方法
Letao.prototype = {
    //渲染用户信息
    getUserinfo: function () {  
        $.ajax({
            url: '/user/queryUserMessage',
            success: function (data) {  
                // console.log(data);
            }
        })
    }
    
}

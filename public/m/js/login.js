
var letao;

$(function () {
    //实例化Letao对象
    letao = new Letao();
    
    letao.login();

})


//创建一个Letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function () {

}

//初始化对象的方法
Letao.prototype = {
    login: function () {  
        // 点击登录
        $('#main .login').on('tap',function () {  
            var userName = $('.userName').val();
            var password = $('.password').val();
            //判断用户名  密码是否为空
            if(!userName){
                mui.toast('用户名不能为空',{ duration:'short', type:'div' }) 
                return;
            }
            if(!password){
                mui.toast('请输入密码',{ duration:'short', type:'div' }) ;
                return;
            }

            $.ajax({
                url:'/user/login',
                type:'POST',
                data:{
                    "username":userName,
                    "password":password
                },
                success: function (data) {  
                    if(data.error){
                        //失败 弹框提示
                        mui.confirm('返回登录', data.message, ['是'] );
                    }else{
                        //登录成功 返回上一页
                        // console.log('成功');
                        // window.history.back();
                        window.location.href='./user.html';

                    }
                }
            })


        })
    }

    
}



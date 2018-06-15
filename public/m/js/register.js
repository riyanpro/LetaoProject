var letao;
var vCode;

$(function() {
  //实例化Letao对象
  letao = new Letao();

  //获取验证码
  letao.getVcode();
  //注册
  letao.register();
});

//创建一个Letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function() {};

//初始化对象的方法
Letao.prototype = {
  //获取验证码
  getVcode: function() {
    $("#main .code .getcode").on("tap", function() {
      $.ajax({
        url: "/user/vCode",
        success: function(data) {
          vCode = data.vCode;
          console.log(vCode);
        }
      });
    });
  },

  //点击注册事件
  register: function() {
    $("#main .login").on("tap", function() {
      var username = $(".username").val();
      if (!username) {
          mui.toast('请输入用户名', { duration: 'short', type:   'div' });
          return;
      }
      var mobile = $(".mobile").val();
      if(!mobile){
        mui.toast('请输入手机号',{ duration:'short', type:'div' });
        return;
      }
      var password1 = $(".password1").val();
      if(!password1) {
        mui.toast('请输入密码',{ duration:'short', type:'div' });
        return;
      }
      var password2 = $(".password2").val();
      if(!password1) {
        mui.toast('请确认密码',{ duration:'short', type:'div' });
        return;
      }
      if(password1 != password2) {
        mui.toast('两次输入的密码不一致',{ duration:'short', type:'div' });
        return;
      }
      var incode = $(".incode").val();
      if(!incode) {
        mui.toast('请输入验证码',{ duration:'short', type:'div' });
        return;
      }else if(incode != vCode) {
        mui.toast('验证码有误',{ duration:'short', type:'div' });
        return;
      }
      //获取是否同意协议的状态
      var checked = $(".checkbox").prop("checked");
      if(!checked) {
        mui.toast('是否同意协议',{ duration:'short', type:'div' });
        return;
      }

      //注册
      $.ajax({
        url: '/user/register',
        type: 'post',
        data: {
            'username': username,
            'password': password1,
            'mobile': mobile,
            'vCode': vCode
        },
        success: function (data) {  
            // console.log(data);
            if(data.success) {
                window.location.href = 'login.html';
            }else{
                mui.toast(data.message,{ duration:'short', type:'div' });
            }
        }
      })
    });
  }
};

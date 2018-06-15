var letao;
var productid;

$(function() {
  //实例化Letao对象
  letao = new Letao();

  productid = letao.getQueryString("productid");
  //获取商品数据
  letao.getProductData();
  //显示选中尺码
  letao.selectSize();
  //添加到购物车
  letao.addCart();
});

//创建一个Letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function() {};

//初始化对象的方法
Letao.prototype = {
  //1.初始化轮播图函数
  initSlider: function() {
    var gallery = mui(".mui-slider");
    gallery.slider({
      interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
  },

  //2.获取商品数据，并渲染页面
  getProductData: function() {
    //获取地址栏传来的id
    // id = letao.getQueryString('productid');

    $.ajax({
      url: "/product/queryProductDetail",
      data: {
        id: productid
      },
      success: function(data) {
        //获取尺码
        var startSize = data.size.split("-")[0];
        var endSize = data.size.split("-")[1];
        var size = [];
        for (var i = startSize; i <= endSize; i++) {
          size.push(i - 0);
        }
        // console.log(size);
        data.size = size;
        console.log(data);

        //渲染页面
        var html = template("productListTmp", data);
        $(".content").html(html);

        var sliderHtml = template("sliderTmp", data);
        $(".mui-slider").html(sliderHtml);

        //调用轮播图的方法
        //轮播图渲染完毕后再调用，保证轮播图可以轮播
        letao.initSlider();

        mui(".content").numbox();
      }
    });
  },

  //3.显示选中尺码
  selectSize: function() {
    $(".content").on("tap", ".size span", function() {
      $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
    });
  },

  //4.添加到购物车
  addCart: function() {
    $(".add-cart a").on("tap", function() {
      //判断是否选中尺码和数量
      var size = $(".size span.active").data("size");
      if (!size) {
        // console.log('选择尺码');
        mui.toast("请选择尺码", { duration: "short", type: "div" });
        return;
      }
      var num = mui(".num")
        .numbox()
        .getValue();
      if (!num) {
        // console.log('输入数量');
        mui.toast("请选择数量", { duration: "short", type: "div" });
        return;
      }

      //添加到购物车
      $.ajax({
        url: "/cart/addCart",
        type: "POST",
        data: {
          productId: productid,
          num: num,
          size: size
        },
        success: function(data) {
          // console.log(data);
          if (data.success) {

            mui.confirm(
              "添加成功，去购物车看看",
              "温馨提示",
              ["是", "否"],
              function(e) {
                if (e.index == 0) {
                  console.log("正在进入购物车");

                  window.location.href = "./login.html";

                } else if(e.index == 1) {
                  console.log("继续购物");
                }
              });
          } else {
              //添加失败  表示未登录？？？
            // console.log("???");

            window.location.href="./login.html";
          }
        }
      });
    });
  },

  //网上比较经典的js获取url中的参数的方法
  getQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    } else {
      return null;
    }
  }
};

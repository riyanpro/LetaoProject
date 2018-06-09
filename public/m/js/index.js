$(function () {
    //实例化Letao对象
    var leTao = new Letao();

    //调用轮播图的方法
    leTao.initSlider();
    //调用区域滚动的方法
    leTao.initScroll();


})



//创建一个Letao构造函数，将所有的功能性JS代码作为这个构造函数原型的方法
var Letao = function () {

}

//初始化对象的方法
Letao.prototype = {
    //初始化轮播图函数
    initSlider: function () {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },

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
}
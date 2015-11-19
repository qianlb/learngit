function myScroll() {
    /*
        clientHeight : 当前浏览器高度
        clientWidth : 当前浏览器宽度
        logoEnvHeight ： logo高度
        menuTitleHeight ： menuTitle 的高度
        scrollLeftConHeight : 左侧滚动区域的自身高度
        rightScrollConHeight ： 右侧滚动区域的自身高度
        visitHeight :  浏览器的高度 - 头部的高度
        leftFinalHeight : 经过计算，左侧最终的高度
        rightFinalHeight : 右侧最终高度
    */
    $(".leftScrollCon").height("auto");
    $(".rightScrollCon").height("auto");

    var clientHeight = $(window).height(),
        clientWidth = $(window).width();
    logoEnvHeight = $(".logo-env").height(),
    menuTitleHeight = 0;
    scrollLeftConHeight = 0,
    rightScrollConHeight = 0;

    var visitHeight = 0,
        leftFinalHeight = 0,
        rightFinalHeight = 0;
    if (clientWidth > 767) {
        $("body").scrollTop("0px");
        $("body").css("overflow", "hidden")
        $(".leftScrollCon").removeClass("hide");


        menuTitleHeight = $("#menuTitle").height();
        scrollLeftConHeight = $(".leftScrollCon").height();
        rightScrollConHeight = $(".rightScrollCon").height();

        visitHeight = clientHeight - logoEnvHeight - menuTitleHeight;
        leftFinalHeight = scrollLeftConHeight > visitHeight ? visitHeight : scrollLeftConHeight;
        rightFinalHeight = rightScrollConHeight > visitHeight ? visitHeight : rightScrollConHeight;

        $(".rightScrollCon").height(rightFinalHeight);

        //if (scrollLeftConHeight > visitHeight) {
            $(".leftScrollCon").height(leftFinalHeight).perfectScrollbar();
        //}
    } else {
        $("body").css("overflow", "auto")
        $(".leftScrollCon").addClass("hide");
        $(".rightScrollCon").height("auto");
        $(".leftScrollCon").height("auto");
        if ($(".ps-container").length) {
            $(".leftScrollCon").perfectScrollbar('destroy');
        }
    }
}
function myToggleClick() {
    var sliderMenu = $(".sidebar-menu"),
        pageContainer = $(".page-container"),
        toggleBtn = $("#leftSliderToggle");
        speed = 0;
    if ($(window).width() > 767) {
        toggleBtn.removeClass("hide");
        if (toggleBtn.attr("status") == "aarowRight") {
            $(".sublogo").removeClass("hide")
            pageContainer.css("padding-left", "0px");
            sliderMenu.css("margin-left", "-275px");
        } else {
            $(".sublogo").addClass("hide")
            pageContainer.css("padding-left", "275px");
            sliderMenu.css("margin-left", "0px");
        }
        toggleBtn.unbind('click').bind('click', function () {
            var _this = $(this);
            if (_this.attr("status") == "aarowRight") {
                $(".sublogo").addClass("hide")
                _this.attr("status", "aarowLeft")
                speed = -25;
            } else {
                $(".sublogo").removeClass("hide")
                _this.attr("status", "aarowRight")
                speed = 25;
            }
            myToggleSlider(sliderMenu, pageContainer, speed);
            $(window).resize();
        })
    } else {
        $(".sublogo").addClass("hide")
        toggleBtn.addClass("hide");
        sliderMenu.css("margin-left", "0px");
        pageContainer.css("padding-left", "0px");
    }
}
function myToggleSlider(sliderMenu, pageContainer, speed) {
    var timeInterval = null;
    timeInterval = setInterval(function () {
        var leftPartMargin = parseInt(sliderMenu.css("margin-left"));
        contentPart = parseInt(pageContainer.css("padding-left"));
        if ((speed > 0 && contentPart <= 275 && contentPart > 0) || (speed < 0 && contentPart >= 0 && contentPart < 275)) {
            sliderMenu.css("margin-left", leftPartMargin - speed + 'px')
            pageContainer.css("padding-left", contentPart - speed + 'px')
        } else {
            clearInterval(timeInterval);
        }
    }, 30)
}
$(function () {
    $(".facestBtn").click(function () {
        $(".leftScrollCon").toggleClass("hide");
    })
    if ($(window).width() <= 767) {
        $(".leftScrollCon").addClass("hide")
    } else {
        $(".leftScrollCon").removeClass("hide")
    }
    setTimeout("myScroll()", 100);
    myToggleClick();
    $(window).resize(function () {
        setTimeout("myScroll()", 100);
        myToggleClick();
    });
})
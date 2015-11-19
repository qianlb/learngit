$(function () {
    var arrow = $('<span class="sidebar-arrow"></span>')
    $(".submenu > li").live("click", function () {
        var _this = $(this);
        _this.find(".sidebar-arrow").removeClass("hide").end().addClass("active");
        _this.siblings().removeClass("active").find(".sidebar-arrow").addClass("hide")
    })
})
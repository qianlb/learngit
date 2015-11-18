$("span.showAll").unbind('click').bind('click', function () {
    var _this = $(this);
    if (_this.parent().children("td .hideCheckbox:hidden").length) {
        _this.parent().children("td .hideCheckbox").slideDown();
        _this.find("[name='show']").hide();
        _this.find("[name='hide']").show();
        _this.find("span").last().removeClass("icon-chevron-down").addClass("icon-chevron-up");
    } else {
        _this.parent().children("td .hideCheckbox").slideUp();
        _this.find("[name='show']").show();
        _this.find("[name='hide']").hide();
        _this.find("span").last().removeClass("icon-chevron-up").addClass("icon-chevron-down");
    }
})
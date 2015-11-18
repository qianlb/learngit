$(function () {
    var arrow = $('<span class="sidebar-arrow"></span>');
    $(".detailLeftItem").live("click", function () {
        var _this = $(this);
        if (_this.is("#ClinicalTrialDetail")) {
            $(".filterCon").removeClass('hide');
        } else {
            $(".filterCon").addClass("hide");
        }
        _this.find(".sidebar-arrow").removeClass("hide").end().addClass("active");
        _this.siblings().removeClass("active").find(".sidebar-arrow").addClass("hide");
    });
    if (TsTool.HttpContext.Request("TabType") !== undefined) {
        var cachedTabType = TsTool.HttpContext.Request("TabType");
        $(".collapse.navbar-collapse.submenu li a").each(function(index,value) {
            if ($(this).data("tabtype") && ($(this).data("tabtype").toUpperCase() === cachedTabType.toUpperCase())) {
                $(this).click();
                return;
            }
        });
    }
})
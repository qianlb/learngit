$(function () {
    var arrow = $('<span class="sidebar-arrow"></span>')
    $(".detailLeftItem").live("click", function () {
        var _this = $(this);
        if (_this.is("#ClinicalTrialDetail")) {
            $(".filterCon").removeClass('hide');
            $(".filterCon").find(".checkbox").removeClass("checked").find("input").removeAttr("checked");
            //$(".tagsinput").removeClass("hide");
            //$(".oprateTags").removeClass("hide");
        } else {
            $(".filterCon").addClass("hide");
            $(".tagsinput").addClass("hide").find("span.tag").remove();
            $(".oprateTags").addClass("hide");
        }
        _this.find(".sidebar-arrow").removeClass("hide").end().addClass("active");
        _this.siblings().removeClass("active").find(".sidebar-arrow").addClass("hide");
    });
})
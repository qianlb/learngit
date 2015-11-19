$(function () {
    $(".Top5Applications >div > a").live("click", function () {
        var _this = $(this);
        _this.find(".col-sm-4").removeClass("hide").end().addClass("active");
        _this.siblings().removeClass("active").find(".col-sm-4").addClass("hide")

        $(".table-responsive > div").each(function (index, element) {
            $(element).removeClass("active").addClass("hide");
        });
        $($(".table-responsive > div")[_this.index()]).removeClass("hide").addClass("active");
    });
    $(".table-responsive > div").each(function (index, element) {
        $(element).removeClass("active").addClass("hide");
    });
    $(".table-responsive > div:eq(0)").removeClass("hide").addClass("active");
})
$(function () {
    $(".icon-bookmark2").bind("click", function () {
        var _this = $(this),
            bookmarkid = _this.attr("bookmarkid"),
            bookmarktype = _this.attr("bookmarktype"),
            bookmarklink = _this.attr("bookmarklink");
        bookMark(bookmarktype, bookmarkid,bookmarklink, $(this))
    })
    $(".icon-alarm").bind("click", function () {
        var _this = $(this),
            trackid = _this.attr("trackid"),
            tracktype = _this.attr("tracktype"),
            trackname = _this.attr("trackname");
        track(tracktype,trackid,trackname,$(this))
    })
})

function bookMark(moduleName, bookmarkID,bookmarkLink, container) {
    $.ajax({
        type: "post",
        async: true,
        url: "/SaveUserBookMark/SaveUserBookMark",
        data: { moduleName: moduleName, bookMarkId: bookmarkID, bookMarkLink: bookmarkLink },
        success: function (flag) {
            if (flag == "1") {
                //alert("Add bookmark successful.");
                container.addClass("text-warning");
                $("span[bookmarkid=" + bookmarkID + "][bookmarktype=" + moduleName + "]").addClass("text-warning");
            } else {
                //alert("Deleted this bookmark")
                container.removeClass("text-warning");
                $("span[bookmarkid=" + bookmarkID + "][bookmarktype=" + moduleName + "]").removeClass("text-warning");
            }
        }
    })
}

function track(moduleName, trackID,trackname, container) {
    $.ajax({
        type: "post",
        url: "/Saved/SaveUserTracking",
        data: { moduleName: moduleName, titleId: trackID, trackingName: trackname },
        dataType: "json",
        async: true,
        success: function (data) {
            if (data == "1") {
                container.addClass("text-warning");
                $("span[trackid=" + trackID + "][tracktype=" + moduleName + "]").addClass("text-warning");
            } else {
                container.removeClass("text-warning");
                $("span[trackid=" + trackID + "][tracktype=" + moduleName + "]").removeClass("text-warning");
            }
        }
    })
}
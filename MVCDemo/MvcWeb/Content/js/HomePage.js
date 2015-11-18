facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.parameter.tab = $(".savedType.active > a");
        _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
        _this.parameter.tabContent = $(_this.parameter.tableContainer);
        this.setBookmarkListener();
        this.setsavedTypeListener();
        this.setAccessRight();
        this.pageInit();
        return this;
    },

    pageInit: function () {
        $(".savedType.active > a").click();
    },
    setsavedTypeListener: function () {
        var _this = this;
        $(".savedType > a").bind("click", function () {
            $(this).parent().addClass("active").siblings().removeClass("active")
            var type = $(this).attr("type");
            switch (type) {
                case "savedSearch":
                    _this.parameter.tableUrl = "/Saved/GetHomePageSavedSearch";
                    _this.parameter.tab = $(this);
                    $(".tabCon>div").addClass("hide").eq(_this.parameter.tab.index()).removeClass("hide");
                    _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
                    _this.parameter.tabContent = _this.parameter.tableContainer;
                    _this.getTabContent();
                    break;
                case "bookMark":
                    _this.parameter.tableUrl = "/Saved/GetHomePageBookmarks";
                    _this.parameter.tab = $(this);
                    $(".tabCon>div").addClass("hide").eq(_this.parameter.tab.index()).removeClass("hide");
                    _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
                    _this.parameter.tabContent = _this.parameter.tableContainer;
                    _this.getTabContent();
                    break;
                case "tracking":
                    _this.parameter.tableUrl = "/Saved/GetHomePageAlert";
                    _this.parameter.tab = $(this);
                    $(".tabCon>div").addClass("hide").eq(_this.parameter.tab.index()).removeClass("hide");
                    _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
                    _this.parameter.tabContent = _this.parameter.tableContainer;
                    _this.getTabContent();
                    break;
            }

        })
    },
    getTabContent: function () {
        var _this = this;
        $.ajax({
            url: _this.parameter.tableUrl,
            type: "post",
            async: true,
            dateType: "json",
            success: function (partialView) {
                _this.parameter.tabContent.html(partialView);
                //根据不同的tab绑定事件
                switch (_this.parameter.tableUrl) {
                    case "/Saved/GetHomePageAlert":
                        _this.setAlertBtnEvent();
                        break;
                    case "/Saved/GetHomePageSavedSearch":
                        _this.setSavedAlertListener();
                        _this.setSavedSearchBtnEvent();
                        break;
                    case "/Saved/GetHomePageBookmarks":
                        _this.setBookmarkBtnEvent();
                        break;
                }
            },
            error: function () {
            }
        });
        return this;
    },
    setAlertBtnEvent: function () {
        var _this = this;
        $("#alertBtn").unbind("click").bind("click", function () {
            window.location.href = "/Saved/Index?tabindex=3";
        });
    },
    setBookmarkBtnEvent: function () {
        var _this = this;
        $("#bookmarkBtn").unbind("click").bind("click", function () {
            window.location.href = "/Saved/Index?tabindex=2";
        });
    },
    setSavedSearchBtnEvent: function () {
        var _this = this;
        $("#saveSearchBtn").unbind("click").bind("click", function () {
            window.location.href = "/Saved/Index";
        });
    },
    setSavedAlertListener: function () {
        $("span.icon-alarm").unbind("click").bind("click", function () {
            var _this = $(this);
            trackid = _this.attr("trackid"),
            tracktype = _this.attr("tracktype"),
            trackname = _this.attr("trackname");
            $.ajax({
                type: "post",
                url: "/Saved/SaveUserTrackingViaSearch",
                data: { moduleName: tracktype, titleId: trackid, trackingName: trackname },
                dataType: "json",
                async: true,
                success: function (data) {
                    if (data.Flag == "1") {
                        _this.addClass("text-warning");
                        $("span[trackid=" + trackid + "][tracktype=" + tracktype + "]").addClass("text-warning");
                        $(".savedType > a[type='tracking'] >> .count").text(data.AlertCount);
                    } else {
                        _this.removeClass("text-warning");
                        $("span[trackid=" + trackid + "][tracktype=" + tracktype + "]").removeClass("text-warning");
                        $(".savedType > a[type='tracking'] >> .count").text(data.AlertCount);
                    }
                }
            })
        })
    },
    //set bookmark listener
    setBookmarkListener: function () {
        var _this = this;
        $("span.icon-bookmark2").bind("click", function () {
            bookmarkid = $(this).attr("bookmarkid"),
            bookmarktype = $(this).attr("bookmarktype"),
            bookmarklink = $(this).attr("bookmarklink");
            _this.bindingBookmarkEvent(bookmarktype, bookmarkid, bookmarklink, $(this));

        })
    },
    //BindingBookmarkEvent
    bindingBookmarkEvent: function (moduleName, bookmarkID, bookmarkLink, container) {
        var _this = this;
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
                //refresh bookmark
                var contains = $(".savedType > a[type='bookMark']");
                if ($(".savedType > a[type='bookMark']").parent().hasClass("active"))
                    $(".savedType.active > a").click();
            }
        })
    },
    setAccessRight: function () {
        var _this = this;
        var _per = $("#sourcePer").val();
        var _totalRights = $("#sourceAllRights div.chart-pill").length;
        $("#sourceAllRights div.chart-pill").slice(0, Math.floor(_per * _totalRights)).addClass("success");
    },
})

facetsSearch.prototype.init.prototype = facetsSearch.prototype

$(function () {
    var obj = facetsSearch({
        tableUrl: "/Saved/GetHomePageAlert",
    });
})
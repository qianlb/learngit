facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
        this.pageInit();   //init
        this.setInputEventListener();    //input search
        this.setFilterSlideListener();   //filter events
        this.pageDataHander(_this.parameter.pageSize, 1);   //page
        this.setOptionColumnLinstener(this.parameter.saveSearch.editchooseColumnUrl);   //OptionColumnLinstener
        this.setOrderHeader();   //order
        this.setStoreUpListener(); //clearTag
        this.setAddSaveSearchListener(); //addSaveSearch
        this.createFilter();  //createFliter
        this.createHistory();  // createHistory
        this.getRecentSearch(); //recentSearch
        this.setExportListener();
        return this;
    },
    //getRequestParam: function () {
    //    var json = {},
    //            filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch input.date,#facetsSearch #formulation select"),
    //            param = {}, paramStr = [],
    //            keywordTag;
    //    filters.each(function (i, e) {
    //        if ($(e).attr("requestkey") == "interval") {
    //            param[$(e).attr("parentkey")] = param[$(e).attr("parentkey")] ? param[$(e).attr("parentkey")] : [];
    //            if ($(e).is(".startDate")) {
    //                var timeStr = $(e).val(), startTime = timeStr.split("/").map(function (i, e) {
    //                    return parseInt(i);
    //                });
    //                param[$(e).attr("parentkey")][0] = timeStr.length ? startTime[2] + "-" + startTime[0] + "-" + startTime[1] : "";
    //            } else {
    //                var timeStr = $(e).val(), endTime = timeStr.split("/").map(function (i, e) {
    //                    return parseInt(i);
    //                });
    //                param[$(e).attr("parentkey")][1] = timeStr.length ? endTime[2] + "-" + endTime[0] + "-" + endTime[1] : "";
    //            }
    //            if (!param[$(e).attr("parentkey")][0] && !param[$(e).attr("parentkey")][1]) {
    //                delete param[$(e).attr("parentkey")];
    //            }
    //        }
    //        else if ($(e).attr("requestkey") == "ephcode") {
    //            if ($(e).val()) {
    //                param["ephcode"] ? param["ephcode"].push($(e).val()) : param["ephcode"] = [$(e).val()];
    //            }
    //        } else if ($(e).attr("requestkey") == "whocode") {
    //            if ($(e).val()) {
    //                param["whocode"] ? param["whocode"].push($(e).val()) : param["whocode"] = [$(e).val()];
    //            }
    //        }
    //        else if ($(e).attr("requestkey") == "formulation") {
    //            if ($(e).val()) {
    //                param["formulation"] ? param["formulation"].push($(e).val()) : param["formulation"] = [$(e).val()];
    //            }
    //        }
    //        else {
    //            if ($(e).val()) {
    //                var key = $(e).attr("requestkey");
    //                param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
    //            }
    //        }
    //    });
    //    //page
    //    if ($(".pageBox .customPage").val()) {
    //        json["page"] = (parseInt($(".pageBox .customPage").val()) <= parseInt($(".next").prev().attr("totalpage"))) ? $(".pageBox .customPage").val() : $(".next").prev().attr("totalpage")
    //    } else {
    //        json["page"] = $(".pageBox .active > a").attr("pageid") || 1;
    //    }
    //    json["filter"] = facetsSearch.isEmptyObject(param) ? JSON.stringify(param) : "";
    //    json["keyword"] = $(".searchInput").val().trim();
    //    json["order"] = this.order.orderAt ? "{\"" + this.order.orderAt + "\":\"" + this.order.filed + "\"}" : "";
    //    return json;
    //},
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        })
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#companyType");
        this.setFilterEventListener("#gmpsite");
        this.setFilterEventListener("#indication");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
    },
    setExportListener: function () {
        var _this = this;
        $("#export").live('click', function () {
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var searchCount = parseInt($("#recount").val());
            if (parseInt(validCountJson) > 0 && searchCount <= parseInt(validCountJson)) {
                window.location.href = "/Company/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + searchCount;
            } else if (parseInt(validCountJson) > 0 && searchCount > parseInt(validCountJson)) {
                var alterInfo = "You have selected " + searchCount + " lines of data to export. GBI terms and conditions allow up to 500 lines of data to be exported per day. You have exported " + (500 - parseInt(validCountJson)).toString() + " lines of data within the last 24 hours. Are you sure you want to export the first " + validCountJson + " data records";
                var statu = confirm(alterInfo);
                if (!statu) {
                    return false;
                } else {
                    window.location.href = "/Company/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + validCountJson;
                }
            } else {
                alert("You have exceeded the daily data export limit within the last 24 hours. GBI terms and conditions allow up to 500 lines of data to be exported per day. For more information, please click OK button to contact GBI Support Team, or to cancel this data export request please click CANCEL button")
            }
        })
    },
    setValidCount: function () {
        var jsonString = {};
        $.ajax({
            url: "/Account/GetValidCount",
            type: "post",
            async: false,
            dateType: "json",
            data: {},
            success: function (json) {
                jsonString = json;
            },
            error: function () {
                //alert("数据获取失败");
            }
        });
        return jsonString;
    },
})
facetsSearch.prototype.init.prototype = facetsSearch.prototype
$(function () {
    var obj = facetsSearch({
        tableUrl: "/Company/GetCompanyList",
        tableContainer: "#companyList",
        filterUrl: "/Company/GetFacetedSearch",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumsForCompany",
            savedsearchModuleId: 7,
            optionColumnsModuleId: 5
        }
    });
});



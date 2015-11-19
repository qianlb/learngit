facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
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
        this.pageInit();   //init
        return this;
    },
    //getRequestParam: function () {
    //    var json = {},
    //            filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch input.date,#facetsSearch #formulation select,#facetsSearch #Amount"),
    //            param = {}, paramStr = [],
    //            keywordTag
    //    _this = this;
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
    //        else {
    //            if ($(e).val()) {
    //                var key = $(e).attr("requestkey");
    //                param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
    //            }
    //        }
    //    });
    //    //page
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
    //getSaveSearchParam: function () {
    //    var json = {},
    //        filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,#facetsSearch #statusDate input,#facetsSearch #announceDate input,#facetsSearch #formulation select,#facetsSearch #Amount"),
    //        param = {}, paramStr = [], paramStrFor, paramStrDate,
    //        keywordTag, keyword = $(".searchInput").val().trim();
    //    filters.each(function (i, e) {
    //        if ($(e).attr("requestkey") == "interval") {
    //            param[$(e).attr("parentkey")] = param[$(e).attr("parentkey")] ? param[$(e).attr("parentkey")] : [];
    //            if ($(e).is(".startDate")) {
    //                var timeStr = $(e).val(), startTime = timeStr.split("/").map(function (i, e) {
    //                    return parseInt(i);
    //                });
    //                param[$(e).attr("parentkey")][0] = timeStr.length ? startTime[2] + "-" + startTime[0] + "-" + startTime[1] : "";
    //                if (param[$(e).attr("parentkey")][0]) {
    //                    paramStr.push(param[$(e).attr("parentkey")][0])
    //                }
    //            } else {
    //                var timeStr = $(e).val(), endTime = timeStr.split("/").map(function (i, e) {
    //                    return parseInt(i);
    //                });
    //                param[$(e).attr("parentkey")][1] = timeStr.length ? endTime[2] + "-" + endTime[0] + "-" + endTime[1] : "";
    //                if (param[$(e).attr("parentkey")][1]) {
    //                    paramStr.push(param[$(e).attr("parentkey")][1])
    //                }
    //            }
    //            if (!param[$(e).attr("parentkey")][0] && !param[$(e).attr("parentkey")][1]) {
    //                delete param[$(e).attr("parentkey")];
    //            }
    //        }
    //        else {
    //            var key = $(e).attr("requestkey");
    //            param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
    //            paramStr.push($(e).attr("showvalue"));
    //        }
    //    });
    //    if (paramStrFor) {
    //        paramStr.push(paramStrFor);
    //    }
    //    if (keyword) {
    //        param["keyword"] = [keyword];
    //        paramStr.push(keyword);
    //    }
    //    paramStrDate ? paramStr.push(paramStrDate) : "";
    //    return { saveName: paramStr.join(" + "), moduleId: this.parameter.saveSearch.savedsearchModuleId, searchFilter: JSON.stringify(param), resultCount: $(".count").attr("totalnum"), searchSaveMode: "1" };
    //},
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        });
        this.setFilterEventListener("#status");
        this.setFilterEventListener("#drugType");
        this.setFilterEventListener("#formulationADR");
        this.setFilterEventListener("#resultADR");
        this.setFilterEventListener("#effect");
        //this.setFilterEventListener("#tree_atc_code");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
    },
    pageInit: function () {
        $(".searchInput").val();
        var _this = this;
        _this.getSaveSearchData();
        var savedSearchId = parseInt($("#savedSearchId").val());
        if (savedSearchId) {
            $("#saveSearch").find("a[savedsearchid = " + savedSearchId + "]").click();
        }
        var url = location.search;
        if (url.indexOf("?") !== -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            var keyWords = strs[0].split("=");
            if (keyWords[0] === "keyword") {
                $(".searchInput").val(decodeURI(keyWords[1]));
            }
        };
    }
});
facetsSearch.prototype.init.prototype = facetsSearch.prototype;
$(function () {
    var obj = facetsSearch({
        tableUrl: "/ADR/GetADRInfoList",
        tableContainer: "#ADRList",
        filterUrl: "/ADR/GetADRInfoFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumnsForADRInformation",
            savedsearchModuleId: 27,
            optionColumnsModuleId: 27
        }
    });
});


















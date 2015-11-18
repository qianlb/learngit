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
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked:not('.noeinfilter')>input, #facetsSearch .checkbox.checked>input, .facetsSearch .checkbox.checked>input, #facetsSearch label.checked >input ,.facetsSearch .checkbox.checked>input, #facetsSearch #dateofbidopening input,#facetsSearch #dateofpurchasingcyclebeginning input,#facetsSearch #dateofpurchasingcycleend input, #facetsSearch #formulation select"),
                param = {}, paramStr = [],
                keywordTag;
        filters.each(function (i, e) {
            if ($(e).attr("requestkey") == "interval") {
                param[$(e).attr("parentkey")] = param[$(e).attr("parentkey")] ? param[$(e).attr("parentkey")] : [];
                if ($(e).is(".startDate")) {
                    var timeStr = $(e).val(), startTime = timeStr.split("/").map(function (i, e) {
                        return parseInt(i);
                    });
                    param[$(e).attr("parentkey")][0] = timeStr.length ? startTime[2] + "-" + startTime[0] + "-" + startTime[1] : "";
                } else {
                    var timeStr = $(e).val(), endTime = timeStr.split("/").map(function (i, e) {
                        return parseInt(i);
                    });
                    param[$(e).attr("parentkey")][1] = timeStr.length ? endTime[2] + "-" + endTime[0] + "-" + endTime[1] : "";
                }
                if (!param[$(e).attr("parentkey")][0] && !param[$(e).attr("parentkey")][1]) {
                    delete param[$(e).attr("parentkey")];
                }
            }
            else if ($(e).attr("requestkey") == "ephcode") {
                if ($(e).val()) {
                    param["ephcode"] ? param["ephcode"].push($(e).val()) : param["ephcode"] = [$(e).val()];
                }
            } else if ($(e).attr("requestkey") == "whocode") {
                if ($(e).val()) {
                    param["whocode"] ? param["whocode"].push($(e).val()) : param["whocode"] = [$(e).val()];
                }
            }
            else if ($(e).attr("requestkey") == "formulation") {
                if ($(e).val()) {
                    param["formulation"] ? param["formulation"].push($(e).val()) : param["formulation"] = [$(e).val()];
                }
            }
            else {
                if ($(e).val()) {
                    var key = $(e).attr("requestkey");
                    param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
                }
            }
        });
        var edlProject = {};
        var edlProjectCon = $("#facetsSearch .checkbox.checked.noeinfilter>input");
        edlProjectCon.each(function () {
            var _this = $(this);
            if (_this.parent().is(".level1")) {
                edlProject[_this.val()] = [];
            }
            if (_this.parent().is(".level2")) {
                // if (!_this.closest(".plm").prev().is(".checked")) {
                var secondLevel = _this.closest(".plm").prev().find("input").val();
                if (edlProject[secondLevel]) {
                    edlProject[secondLevel].push(_this.val());
                } else {
                    edlProject[secondLevel] = [];
                    edlProject[secondLevel].push(_this.val());
                }

                // }
            }
        })
        json["edlproject"] = facetsSearch.isEmptyObject(edlProject) ? JSON.stringify(edlProject) : ""
        //page
        if ($(".pageBox .customPage").val()) {
            json["page"] = (parseInt($(".pageBox .customPage").val()) <= parseInt($(".next").prev().attr("totalpage"))) ? $(".pageBox .customPage").val() : $(".next").prev().attr("totalpage")
        } else {
            json["page"] = $(".pageBox .active > a").attr("pageid") || 1;
        }
        json["filter"] = facetsSearch.isEmptyObject(param) ? JSON.stringify(param) : "";
        json["keyword"] = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        json["order"] = this.order.orderAt ? "{\"" + this.order.orderAt + "\":\"" + this.order.filed + "\"}" : "";
        return json;
    },
    getFilterData: function (filter, param) {
        var _this = this,
            reqeustParam = $.extend(this.getRequestParam(filter), param);
        $.ajax({
            url: _this.parameter.filterUrl,
            type: "post",
            async: true,
            dateType: "json",
            data: reqeustParam,
            success: function (partialView) {
                $("#filter-condition").children('li').not('.calendar-li').remove();
                $("#filter-condition").prepend(partialView);
                _this.setFilterSlideListener();
                _this.createFilter();
                _this.createHistory();
                $(window).resize();
            },
            global: false
        });
        return this;
    },
    getSaveSearchParam: function () {
        var json = {},
            filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch input.date,#facetsSearch #formulation select"),
            param = {}, paramStr = [], sub_edlproject = {}, paramStrFor, paramStrDate,
            keywordTag, keyword = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";   //,#ephmra_atc_code select,#ephmra_atc_code select
        filters.each(function (i, e) {
            if ($(e).attr("requestkey") == "interval") {
                param[$(e).attr("parentkey")] = param[$(e).attr("parentkey")] ? param[$(e).attr("parentkey")] : [];
                if ($(e).is(".startDate")) {
                    var timeStr = $(e).val(), startTime = timeStr.split("/").map(function (i, e) {
                        return parseInt(i);
                    });
                    param[$(e).attr("parentkey")][0] = timeStr.length ? startTime[2] + "-" + startTime[0] + "-" + startTime[1] : "";
                    if (param[$(e).attr("parentkey")][0]) {
                        paramStr.push(param[$(e).attr("parentkey")][0])
                    }
                } else {
                    var timeStr = $(e).val(), endTime = timeStr.split("/").map(function (i, e) {
                        return parseInt(i);
                    });
                    param[$(e).attr("parentkey")][1] = timeStr.length ? endTime[2] + "-" + endTime[0] + "-" + endTime[1] : "";
                    if (param[$(e).attr("parentkey")][1]) {
                        paramStr.push(param[$(e).attr("parentkey")][1])
                    }
                }
                if (!param[$(e).attr("parentkey")][0] && !param[$(e).attr("parentkey")][1]) {
                    delete param[$(e).attr("parentkey")];
                }
            } else if ($(e).attr("requestkey") == "formulation") {
                if ($(e).val()) {
                    param["formulation"] ? param["formulation"].push($(e).val()) : param["formulation"] = [$(e).val()];
                    paramStrFor = $(e).attr("showvalue");
                }
            } else if ($(e).attr('requestkey') == 'sub-edlproject') {
                if ($(e).val()) {
                    var _value = $(this).closest('.plm').prev().find('input').val();
                    sub_edlproject[_value] ? sub_edlproject[_value].push($(e).val()) : sub_edlproject[_value] = [$(e).val()];
                    param["sub-edlproject"] = [JSON.stringify(sub_edlproject)];
                }
            } else {
                var key = $(e).attr("requestkey");
                if (param[key]) {
                    param[key].push($(e).val());
                    param[key] = param[key].unique();
                } else {
                    param[key] = [$(e).val()];
                }
                paramStr.push($(e).attr("showvalue"));
            }
        });
        if (paramStrFor) {
            paramStr.push(paramStrFor);
        }
        if (keyword) {
            param["keyword"] = [keyword];
            paramStr.push(keyword);
        }

        paramStrDate ? paramStr.push(paramStrDate) : "";
        var save_search_param = { saveName: paramStr.join(" + "), moduleId: this.parameter.saveSearch.savedsearchModuleId, searchFilter: JSON.stringify(param), resultCount: $(".count").attr("totalnum") };
        return save_search_param;
    },
    setSaveSearchListener: function () {
        var _this = this, filter = $("#facetsSearch"), checked = [];
        $("#saveSearch a").live("click", function () {
            var paramStr = $(this).attr("data");
            var obj = $.parseJSON(paramStr) || [], param = { filter: {}, edlproject: "" };
            for (var i = 0, len = obj.length; i < len; i++) {
                if (obj[i]["Key"] == "keyword") {
                    $(".searchInput").val(obj[i]["Value"]);
                } else if (obj[i]["Key"] == "Amount") {
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                } else if (obj[i]["Key"] == "whocode" || obj[i]["Key"] == "ephcode" || obj[i]["Key"] == "scope") {
                    var atcArr = obj[i]["Value"];
                    for (var j = 0, len1 = atcArr.length; j < len1; j++) {
                        $(".facetsSearch input[requestkey='" + obj[i]["Key"] + "'][value = '" + atcArr[j] + "']").attr("checked", "checked").parent().addClass("checked")
                    }
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                } else if (obj[i]["Key"] === "edlproject") {
                    param.edlproject = obj[i]["Value"].toString().replace(/{/g, "");
                    param.edlproject = param.edlproject.toString().replace(/}/g, "");
                    param.edlproject = "{" + param.edlproject + "}";

                }
                else {
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                }
            }
            delete param["filter"]["keyword"];
            $('input.date').each(function () {
                var _this = $(this);
                var key = _this.attr('parentkey');
                if (param.filter[key]) {
                    if (_this.is('.startDate')) {
                        _this.val(param.filter[key][0] ? date_translate(param.filter[key][0]) : '');
                        var _maxDate = param.filter[key][1] ? date_translate(param.filter[key][1]) : '';
                        _this.datepicker('option', 'maxDate', _maxDate);

                    } else {
                        _this.val(param.filter[key][1] ? date_translate(param.filter[key][1]) : '');
                        var _minDate = param.filter[key][0] ? date_translate(param.filter[key][0]) : '';
                        _this.datepicker('option', 'minDate', _minDate);
                    }
                }
            });
            //shoudl be improved
            //tbd
            param["filter"] = JSON.stringify(param["filter"]);
            _this.getFilterData({}, param).getTableData({}, param);
        });
        $("#saveSearch>a.phm").click(function (e) {
            $(this).parent().toggleClass("opened").children("ul.submenu-nav").slideToggle();
            e.stopPropagation();
        });
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
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            keyWords = strs[0].split("=");
            if (keyWords[0] == 'keyword') {
                $(".searchInput").val(decodeURI(keyWords[1]));
            }
        };
    },
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        })
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#region");
        this.setFilterEventListener("#edl-project");
        this.setFilterEventListener("#year");
        this.setFilterEventListener("#projectstatus");
        this.setFilterEventListener("#dateofbidopening");
        this.setFilterEventListener("#dateofpurchasingcyclebeginning");
        this.setFilterEventListener("#dateofpurchasingcycleend");

    },
    setExportListener: function () {
        var _this = this;
        $("#export").live('click', function () {
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var searchCount = parseInt($("#recount").val());
            if (parseInt(validCountJson) > 0 && searchCount <= parseInt(validCountJson)) {
                window.location.href = "/Tendering/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + searchCount + "&edlProject=" + para.edlproject;
            } else if (parseInt(validCountJson) > 0 && searchCount > parseInt(validCountJson)) {
                var alterInfo = "You have selected " + searchCount + " lines of data to export. GBI terms and conditions allow up to 500 lines of data to be exported per day. You have exported " + (500 - parseInt(validCountJson)).toString() + " lines of data within the last 24 hours. Are you sure you want to export the first " + validCountJson + " data records";
                var statu = confirm(alterInfo);
                if (!statu) {
                    return false;
                } else {
                    window.location.href = "/Tendering/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + validCountJson + "&edlProject=" + para.edlproject;
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
        tableUrl: "/Tendering/GetTenderSchedulingList",
        tableContainer: "#TenderSchedulingList",
        filterUrl: "/Tendering/GetTenderSchedulingFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            savedsearchModuleId: 15,
        }
    });
});



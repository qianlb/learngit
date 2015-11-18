facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
        this.drawAmount();  //amount
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
    //get RequestParam
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch input.date,#facetsSearch #formulation select,#facetsSearch #Amount"),
                param = {}, paramStr = [],
                keywordTag
        _this = this;
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
            else if ($(e).attr("requestkey") == "Amount") {
                var InitMaxMin = _this.getInitMaxMin(), Range = _this.getRange();
                if (InitMaxMin && Range) {
                    if (InitMaxMin[0] != Range[0] || InitMaxMin[1] != Range[1]) {
                        param["Amount"] = param["Amount"] ? param["Amount"] : [];
                        param["Amount"][0] = _this.getRange()[0];
                        param["Amount"][1] = _this.getRange()[1];
                    }
                }
            }
            else {
                if ($(e).val()) {
                    var key = $(e).attr("requestkey");
                    param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
                }
            }
        });
        //page
        //page
        //if ($(".pageBox .customPage").val()) {
        //    json["page"] = (parseInt($(".pageBox .customPage").val()) <= parseInt($(".next").prev().attr("totalpage"))) ? $(".pageBox .customPage").val() : $(".next").prev().attr("totalpage")
        //} else {
        //    json["page"] = $(".pageBox .active > a").attr("pageid") || 1;
        //}
        json["filter"] = facetsSearch.isEmptyObject(param) ? JSON.stringify(param) : "";
        json["keyword"] = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        json["order"] = this.order.orderAt ? "{\"" + this.order.orderAt + "\":\"" + this.order.filed + "\"}" : "";
        return json;
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
    getSaveSearchParam: function () {
        var json = {},
            filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,#facetsSearch #statusDate input,#facetsSearch #announceDate input,#facetsSearch #formulation select,#facetsSearch #Amount"),
            param = {}, paramStr = [], paramStrFor, paramStrDate,
            keywordTag, keyword = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
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
            }
            else if ($(e).attr("requestkey") == "Amount") {
                var InitMaxMin = _this.getInitMaxMin(), Range = _this.getRange();
                if (InitMaxMin && Range) {
                    if (InitMaxMin[0] != Range[0] || InitMaxMin[1] != Range[1]) {
                        param["Amount"] = param["Amount"] ? param["Amount"] : [];
                        param["Amount"][0] = _this.getRange()[0];
                        param["Amount"][1] = _this.getRange()[1];
                        if (_this.getLanguage() == "USD") {
                            paramStr.push("Amount:" + "$" + param["Amount"][0] + "-" + "$" + param["Amount"][1]);
                        } else {
                            paramStr.push("Amount:" + param["Amount"][0] + "-" + param["Amount"][1]);
                        }
                    }
                }
            }
            else {
                var key = $(e).attr("requestkey");
                param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
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
        return { saveName: paramStr.join(" + "), moduleId: this.parameter.saveSearch.savedsearchModuleId, searchFilter: JSON.stringify(param), resultCount: $(".count").attr("totalnum"), searchSaveMode: "1" };
    },
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        })
        this.setFilterEventListener("#companyType");
        this.setFilterEventListener("#drugType");
        this.setFilterEventListener("#marketingStatus");
        this.setFilterEventListener("#onlineStore");
        //this.setFilterEventListener("#tree_atc_code");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
    },
    setStoreUpListener: function () {
        var _this = this;
        $("#clearTag").click(function () {
            $(".oprateTags").addClass('hide');
            $(".tagsinput>.tag").remove();
            $("#facetsSearch .checkbox").removeClass("checked").find("input").removeAttr("checked");
            $("#facetsSearch label.radio").removeClass("checked").find("input").removeAttr("checked");
            $(".searchInput").val("");
            $("#facetsSearch .startDate,#facetsSearch .endDate").val("");
            $("#facetsSearch .startDate,#facetsSearch .endDate").datepicker("option" , {minDate: null, maxDate: null});
            _this.setRange(null);
            _this.getTableData().getFilterData();
        });
    },

    getFilterData: function (filter, param) {
        var _this = this,
            reqeustParam = $.extend(this.getRequestParam(filter), param);
        $.ajax({
            url: "/Epharmacy/GetEpharmacyFilters",
            type: "post",
            async: true,
            dateType: "json",
            data: reqeustParam,
            success: function (partialView) {
                $("#facetsSearch").html(partialView);
                _this.drawAmount();
                _this.createFilter();
                _this.createHistory();
                $(window).resize();
            },
            global: false
        });
        return this;
    },
})
facetsSearch.prototype.init.prototype = facetsSearch.prototype

$(function () {
    var obj = facetsSearch({
        tableUrl: "/Epharmacy/GetEpharmacyList",
        tableContainer: "#EpharmacyList",
        filterUrl: "/Epharmacy/GetEpharmacyFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumsForEpharmacyView",
            savedsearchModuleId: 21,
            optionColumnsModuleId: 21
        }
    });
});
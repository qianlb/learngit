facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData(); //getSavedSearch
        this.pageInit(); //init
        this.setInputEventListener(); //input search
        this.setFilterSlideListener(); //filter events
        this.pageDataHander(_this.parameter.pageSize, 1); //page
        this.setOptionColumnLinstener(_this.parameter.saveSearch.editchooseColumnUrl); //OptionColumnLinstener
        this.setOrderHeader(); //order
        this.setStoreUpListener(); //clearTag
        this.setAddSaveSearchListener(); //addSaveSearch
        this.createFilter(); //createFliter
        this.createHistory(); // createHistory
        this.getRecentSearch(); //recentSearch
        this.setExportListener(); // 2015-8-25 by Aaron
        return this;
    },
    getRequestParam: function () {
        var json = {},
            filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch input.date,#facetsSearch #formulation select,#facetsSearch #drugInsertSource select"),
            param = {},
            paramStr = [],
            keywordTag;
        filters.each(function (i, e) {
            if ($(e).attr("requestkey") == "interval") {
                param[$(e).attr("parentkey")] = param[$(e).attr("parentkey")] ? param[$(e).attr("parentkey")] : [];
                if ($(e).is(".startDate")) {
                    var timeStr = $(e).val(),
                        startTime = timeStr.split("/").map(function (i, e) {
                            return parseInt(i);
                        });
                    param[$(e).attr("parentkey")][0] = timeStr.length ? startTime[2] + "-" + startTime[0] + "-" + startTime[1] : "";
                } else {
                    var timeStr = $(e).val(),
                        endTime = timeStr.split("/").map(function (i, e) {
                            return parseInt(i);
                        });
                    param[$(e).attr("parentkey")][1] = timeStr.length ? endTime[2] + "-" + endTime[0] + "-" + endTime[1] : "";
                }
                if (!param[$(e).attr("parentkey")][0] && !param[$(e).attr("parentkey")][1]) {
                    delete param[$(e).attr("parentkey")];
                }
            } else if ($(e).attr("requestkey") == "formulation") {
                if ($(e).val()) {
                    param["formulation"] ? param["formulation"].push($(e).val()) : param["formulation"] = [$(e).val()];
                }
            } else if ($(e).attr("requestkey") == "drugInsertSource") {
                if ($(e).val()) {
                    param["drugInsertSource"] ? param["drugInsertSource"].push($(e).val()) : param["drugInsertSource"] = [$(e).val()];
                }
            } else {
                var key = $(e).attr("requestkey");
                param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
            }
        });
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
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        });
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#productType");
        this.setFilterEventListener("#companyType");
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#drugInsertSource");

        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
    }
});
facetsSearch.prototype.init.prototype = facetsSearch.prototype;

$(function () {
    var obj = facetsSearch({
        tableUrl: "/DrugInsert/GetDrugInsertIndexList",
        tableContainer: "#drugInsertList",
        filterUrl: "/DrugInsert/GetDrugInsertIndexFilter",
        ExportURL: "/DrugInsert/ExportDrugInsertList",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumsForDrugInsert",
            savedsearchModuleId: 11,
            optionColumnsModuleId: 9
        }
    });
});



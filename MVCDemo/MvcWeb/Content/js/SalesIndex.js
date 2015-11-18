facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
        this.setInputEventListener();    //搜索框点击事件
        this.setFilterSlideListener();   //facetd search 点击事件
        this.pageDataHander(_this.parameter.pageSize, 1);   //设置分页
        this.setOptionColumnLinstener(_this.parameter.saveSearch.editchooseColumnUrl);
        this.setOrderHeader();   //order
        this.setStoreUpListener(); //clearTag
        this.setAddSaveSearchListener(); //addSaveSearch
        this.createFilter();  //createFliter
        this.createHistory();  // createHistory
        this.getRecentSearch(); //recentSearch
        this.pageInit();
        return this;
    },
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        })
        this.setFilterEventListener("#sales_year");
        this.setFilterEventListener("#drug_type");
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#specification");
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
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            keyWords = strs[0].split("=");
            if (keyWords[0] == 'keyword') {
                $(".searchInput").val(decodeURI(keyWords[1]));
            }
        };
    }
    //getRequestParam: function () {
    //    var json = {},
    //            filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch #formulation select"),
    //            param = {}, paramStr = [],
    //            keywordTag;
    //    filters.each(function (i, e) {
    //        if ($(e).attr("requestkey") == "ephcode") {
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
    //}
})

facetsSearch.prototype.init.prototype = facetsSearch.prototype
$(function () {
    var obj = facetsSearch({
        tableUrl: "/Sales/GetSalesList",
        tableContainer: "#sales_list",
        filterUrl: "/Sales/GetFacetedSearch",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumnsForSales",
            savedsearchModuleId: 28,
            optionColumnsModuleId: 68
        }
    });
})
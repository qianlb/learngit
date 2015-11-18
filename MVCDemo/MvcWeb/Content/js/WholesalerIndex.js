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
        //var con = $(".facetsSearch li.root-level > ul > li div");
        var con = $(".facetsSearch_all li.root-level > ul > li div")
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        })
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#region");
        this.setFilterEventListener("#gsp_validity");
        this.setFilterEventListener("#latest_gsp_approval_date");
        this.setFilterEventListener("#gsp_expiration_date");
        this.setFilterEventListener("#scope");
    },
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch #latest_gsp_approval_date input,#facetsSearch #gsp_expiration_date input,#facetsSearch #formulation select,#ephmra_atc_code select,#ephmra_atc_code select"),
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
            } else if ($(e).attr("requestkey") == "ephcode") {
                if ($(e).val()) {
                    param["ephcode"] ? param["ephcode"].push($(e).val()) : param["ephcode"] = [$(e).val()];
                }
            } else if ($(e).attr("requestkey") == "whocode") {
                if ($(e).val()) {
                    param["whocode"] ? param["whocode"].push($(e).val()) : param["whocode"] = [$(e).val()];
                }
            } else if ($(e).attr("requestkey") == "formulation") {
                if ($(e).val()) {
                    param["formulation"] ? param["formulation"].push($(e).val()) : param["formulation"] = [$(e).val()];
                }
            } else {
                if ($(e).val()) {
                    var key = $(e).attr("requestkey");
                    param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
                }
            }

        });
        // 其它页面搜索
        var candidateid = $("#candidateid").val(),
           companyid = $("#companyid").val();
        if (candidateid) {
            param["candidateid"] = [candidateid];
        }
        if (companyid) {
            param["companyid"] = [companyid];
        }
        //GMP 页面
        var certificateNumber = $("#certificatenumber").val();
        if (certificateNumber) {
            param["approvedcertificationnumber"] = [certificateNumber];
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
})

facetsSearch.prototype.init.prototype = facetsSearch.prototype
$(function () {
    var obj = facetsSearch({
        tableUrl: "/Wholesaler/GetWholesalerList",
        tableContainer: "#wholesaler_list",
        filterUrl: "/Wholesaler/GetFacetedSearch",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumnsForWholesaler",
            savedsearchModuleId: 24,
            optionColumnsModuleId: 64
        }
    });
})
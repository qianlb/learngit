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
        this.track();
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
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#region");
        this.setFilterEventListener("#category");
        this.setFilterEventListener("#drug_type");
        this.setFilterEventListener("#effective_date");
        this.setFilterEventListener("#supplemental_product");
        this.setFilterEventListener("#supplemental_formulation");
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
        this.setFilterEventListener("#present_in_both_version");
        this.setFilterEventListener("#reimbursement_type");
        this.setFilterEventListener("#is_national_rdl");
    },
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch #effective_date input,#facetsSearch #formulation select,#ephmra_atc_code select,#ephmra_atc_code select"),
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
        //page
        //if ($(".pageBox .customPage").val()) {
        //    json["page"] = (parseInt($(".pageBox .customPage").val()) <= parseInt($(".next").prev().attr("totalpage"))) ? $(".pageBox .customPage").val() : $(".next").prev().attr("totalpage")
        //} else {
        //    json["page"] = $(".pageBox .active > a").attr("pageid") || 1;
        //}
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
    track: function () {
        $(".icon-alarm").bind("click", function () {
            var _this = $(this);
            var tracktype = _this.attr("tracktype");
            var parameter = facetsSearch.prototype.getRequestParam();
            $.ajax({
                type: "post",
                url: "/Saved/SaveUserTrackingByBatch",
                data: { moduleName: tracktype, keyword: parameter.keyword, filter: parameter.filter },
                dataType: "json",
                async: true,
                success: function (data) {
                    if ($(".icon-alarm").hasClass("text-warning")) {
                        $(".icon-alarm").removeClass("text-warning");
                    } else {
                        $(".icon-alarm").addClass("text-warning");
                    }
                }
            })
        })
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
        tableUrl: "/RDL/GetRDLList",
        tableContainer: "#rdl_list",
        filterUrl: "/RDL/GetFacetedSearch",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumnsForRDL",
            savedsearchModuleId: 26,
            optionColumnsModuleId: 66
        }
    });
})
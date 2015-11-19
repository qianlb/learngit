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
        this.setExportListener();
        return this;
    },
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch #executionDate input,#facetsSearch #formulation select"),
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
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        });
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
        this.setFilterEventListener("#indication_tree_atc_code");
        this.setFilterEventListener("#region");
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#executionDate");
        this.setFilterEventListener("#drugType");
        this.setFilterEventListener("#viewByTabs");
        this.setFilterEventListener("#validity");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");

    },
    setBodyFilterListener: function () {
        var _this = this;
        $("td a.bodyFilter").live('click', function () {
            var requestKey = $(this).attr("requestkey"),
                requestValue = $(this).attr("value").trim(),
                container = requestKey == 'whocode' ? '#who_tree_atc_code' : '#ephmra_tree_atc_code';
            $(container).find("input[requestkey='" + requestKey + "'][value = '" + requestValue + "']").attr("checked", "checked").parent("label").addClass("checked");
            _this.getTableData().getFilterData().addRecentSearch();
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
    setInputEventListener: function () {
        var inputObj = { inputBtn: ".searchBtn", inputText: ".searchInput" }, inputButton = inputObj.inputBtn, inputText = inputObj.inputText, dictionaryKey = inputObj.dictionary, requestKey = inputObj.requestKey, _this = this;
        if (inputButton && inputText) {
            function createSearchTag() {
                if ($(".searchInput").val().trim()) {
                    _this.getTableData().getFilterData().addRecentSearch();
                }
            }

            $(inputButton).bind("click", createSearchTag);
            $(inputText).bind("keydown", function (e) {
                if (e.keyCode == 13) {
                    createSearchTag();
                }
            });
        }
    },
    setFilterEventListener: function (selector) {
        var _this = this,
            parent = $("#facetsSearch " + selector),
            checkeds = parent.find(".checked"),
            btn_level = $(".facetsSearch " + selector).find(".btn_level"),
            showAll = $(".facetsSearch " + selector).find(".showAll");
        if (checkeds.length) {
            showAll.find("[name='show']").hide();
            showAll.find("[name='hide']").show();
        }
        showAll.unbind('click').bind('click', function () {
            var _this = $(this);
            if (_this.parent().children("div.hideCheckbox:hidden").length) {
                _this.parent().children("div.hideCheckbox").slideDown();
                _this.find("[name='show']").hide();
                _this.find("[name='hide']").show();
                _this.find("span").last().removeClass("icon-chevron-down").addClass("icon-chevron-up");

            } else {
                _this.parent().children("div.hideCheckbox").slideUp();
                _this.find("[name='show']").show();
                _this.find("[name='hide']").hide();
                _this.find("span").last().removeClass("icon-chevron-up").addClass("icon-chevron-down");

            }
            return false;
        });
        $("#facetsSearch " + selector + " div.checkbox").unbind("click").bind('click', function (e) {
            if (!$(this).is(".disabled")) {
                var input = $(this).find(":checkbox"), siblingsCheck = $(this).parent().children(".checked");
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked").find("input").removeAttr("checked");
                } else {
                    $(this).addClass("checked").find("input").attr("checked", "checked");
                }
                _this.getTableData().getFilterData().addRecentSearch();
            }
            e.stopPropagation();
        });
        $("#facetsSearch " + selector + ">label.radio").unbind("click").bind('click', function (e) {
            if (!$(this).is(".disabled")) {
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked");
                } else {
                    $(this).addClass("checked").siblings().removeClass("checked");
                }
                if ($(this).parent("div").data("iskeywordextension") && (!$("#search input").val())) {
                    return false;
                }
                _this.getTableData().getFilterData().addRecentSearch();
            }
            return false;
        })
        $("#facetsSearch " + selector + " input.startDate").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function( selectedDate ) {
                $("#facetsSearch " + selector + " input.endDate").datepicker( "option", "minDate", selectedDate );
                _this.createHistory().getTableData().getFilterData();
            }
        });
        $("#facetsSearch " + selector + " input.endDate").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function( selectedDate ) {
                $("#facetsSearch " + selector + " input.startDate").datepicker( "option", "maxDate", selectedDate );
                _this.createHistory().getTableData().getFilterData();
            }
        });
        $("#facetsSearch " + selector + " select").change(function () {
            var select = $(this);
            select.attr("showValue", select.find("option:selected").html());
            select.parent().nextAll().hide();
            $(".tagsinput").find("[requestkey='" + select.attr("requestkey") + "']").remove();
            _this.getTableData().getFilterData().addRecentSearch();
        });
        btn_level.unbind('click').bind('click', function () {
            var _this = $(this);
            if (_this.find("span").is(".icon-plus-circle")) {
                _this.find("span").removeClass("icon-plus-circle").addClass("icon-minus-circle");
                _this.next().next("div").slideDown();
            } else {
                _this.find("span").removeClass("icon-minus-circle").addClass("icon-plus-circle");
                _this.next().next("div").slideUp();
            }
        });
        $(".facetsSearch " + selector + " label.checkbox").unbind("click").bind('click', function (e) {
            if (!$(this).is(".disabled")) {
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked").find("input").removeAttr("checked");
                    $(this).next(".hideLabel").find("label").removeClass("checked").find("input").removeAttr("checked");
                    _this.getTableData().getFilterData().addRecentSearch();
                } else {
                    $(this).addClass("checked").find("input").attr("checked", "checked");
                    $(this).next("div").find("label.checkbox").addClass("checked").find("input").attr("checked", "checked");
                    _this.getTableData().getFilterData().addRecentSearch();
                }
            }
            e.stopPropagation();
        });
        $(_this.parameter.tableContainer).off("click", selector + " ul li a").on("click", selector + " ul li a", function (e) {
            $($(this).parent("li")).addClass("active").siblings().removeClass("active");
            _this.getTableData(null, { page: 1, order: null });
            e.stopPropagation();
            e.preventDefault();
        });
    },
    getTableData: function (filter, param, page) {
        var _this = this,
            reqeustParam = $.extend(this.getRequestParam(filter), param);
        var jsonWithPage = {};
        jsonWithPage = reqeustParam;
        if (!page) {
            jsonWithPage["page"] = 1;
        } else {
            jsonWithPage["page"] = page;
        }
        $.ajax({
            url: _this.parameter.getTableUrl(),
            type: "post",
            async: true,
            dateType: "json",
            data: jsonWithPage,
            success: function (partialView) {
                $(_this.parameter.tableContainer).html("").html(partialView);
                $(".baseItemCount").html(facetsSearch.formatNumber($("#baseitemcount").val()));
                _this.pageDataHander(_this.parameter.pageSize, jsonWithPage.page);
                _this.setOrderHeader();
            },
            error: function () {
                //alert("数据获取失败");
            }
        });
        return this;
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
    setFilterSlideListener: function () {
        function slideToggle(e) {
            $(this).parent().toggleClass("opened").children("ul.submenu-nav").slideToggle();
            e.stopPropagation();
        }

        $(".sidebar-menu a.phm").unbind("click").click(slideToggle);
    },
    setExportListener: function () {
        var _this = this;
        $("#export").live('click', function () {
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var searchCount = $("#viewByTabs >ul >li.active >a >b").text();
            if (searchCount.length > 3) {
                searchCount = parseInt(String(searchCount).replace(",", ""));
            }
            else {
                searchCount = parseInt(searchCount);
            }
            var type = $("#viewByTabs >ul >li.active").attr("type");
            var href = "";
            switch (type) {
                case "product":
                    href = "/Pricing/ExportLowPricingProduct?keyword=" + para.keyword + "&filter=" + para.filter;
                    break;
                case "region":
                    href = "/Pricing/ExportLowPricingRegion?keyword=" + para.keyword + "&filter=" + para.filter;
                    break;
                case "policy":
                    href = "/Pricing/ExportLowPricingPolicy?keyword=" + para.keyword + "&filter=" + para.filter;
                    break;
                default:
                    href = "/Pricing/ExportLowPricingIndex?keyword=" + para.keyword + "&filter=" + para.filter;
                    break;
            }
            if (parseInt(validCountJson) > 0 && searchCount <= parseInt(validCountJson)) {
                 window.location.href = href + "&validCount=" + searchCount;
            } else if (parseInt(validCountJson) > 0 && searchCount > parseInt(validCountJson)) {
                var alterInfo = "You have selected " + searchCount + " lines of data to export. GBI terms and conditions allow up to 500 lines of data to be exported per day. You have exported " + (500 - parseInt(validCountJson)).toString() + " lines of data within the last 24 hours. Are you sure you want to export the first " + validCountJson + " data records";
                var statu = confirm(alterInfo);
                if (!statu) {
                    return false;
                } else {
                     window.location.href = href + "&validCount=" + validCountJson;
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
    }
});
facetsSearch.prototype.init.prototype = facetsSearch.prototype

$(function () {
    var obj = facetsSearch({
        getTableUrl: function () { return $("#viewByTabs li.active a").attr("href") },
        tableContainer: "#pricingList",
        filterUrl: "/Pricing/GetLowPriceDrugPricingIndexFilter",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumsForLowPriceDrugPricing",
            savedsearchModuleId: 18,
            optionColumnsModuleId: 30
        }
    });
});
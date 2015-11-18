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
        this.setOptionColumnLinstener(_this.parameter.saveSearch.editchooseColumnUrl);   //OptionColumnLinstener
        this.setOrderHeader();   //order
        this.setStoreUpListener(); //clearTag
        this.setAddSaveSearchListener(); //addSaveSearch
        this.createFilter();  //createFliter
        this.createHistory();  // createHistory
        this.getRecentSearch(); //recentSearch
        this.setExportListener();
        this.track();
        return this;
    },
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch #approvaldate input,#facetsSearch #expirationdate input,#facetsSearch #formulation select"),
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
        $("#candidateid").val() ? param["candidateid"] = [$("#candidateid").val()] : "";
        $("#companyid").val() ? param["companyid"] = [$("#companyid").val()] : "";
        $("#origin").val() ? param["origin"] = [$("#origin_domestic").val()] : "";

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
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        });
        this.setFilterEventListener("#drugType");
        this.setFilterEventListener("#origin");
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#validity");
        this.setFilterEventListener("#expirationdate");
        this.setFilterEventListener("#approvaldate");
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
                window.location.href = "/Registration/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + searchCount;
            } else if (parseInt(validCountJson) > 0 && searchCount > parseInt(validCountJson)) {
                var alterInfo = "You have selected " + searchCount + " lines of data to export. GBI terms and conditions allow up to 500 lines of data to be exported per day. You have exported " + (500 - parseInt(validCountJson)).toString() + " lines of data within the last 24 hours. Are you sure you want to export the first " + validCountJson + " data records";
                var statu = confirm(alterInfo);
                if (!statu) {
                    return false;
                } else {
                    window.location.href = "/Registration/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + validCountJson;
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
    setFilterEventListener: function (selector) {
        var _this = this,
            parent = $(".facetsSearch " + selector),
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
        });
        $(".facetsSearch " + selector + " div.checkbox").unbind("click").bind('click', function (e) {
            if (!$(this).is(".disabled")) {
                var input = $(this).find(":checkbox"), siblingsCheck = $(this).parent().children(".checked");
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked").find("input").removeAttr("checked");
                    _this.getTableData().getFilterData().addRecentSearch();
                } else {
                    $(this).addClass("checked").find("input").attr("checked", "checked");
                    _this.getTableData().getFilterData().addRecentSearch();
                }
            }
            e.stopPropagation();
        });
        $(".facetsSearch " + selector + ">label.radio").unbind("click").bind('click', function (e) {
            if (!$(this).is(".disabled")) {
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked");
                    _this.getTableData().getFilterData().addRecentSearch();
                } else {
                    $(this).addClass("checked").siblings().removeClass("checked");
                    _this.getTableData().getFilterData().addRecentSearch();
                }
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
        $(".facetsSearch " + selector + " select").change(function () {
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
                    //  if (data == "1") {

                        // $("span[trackid=" + trackid + "][tracktype=" + tracktype + "]").addClass("text-warning");
                    //} else {

                    //    // $("span[trackid=" + trackid + "][tracktype=" + tracktype + "]").removeClass("text-warning");
                    //}
                }
            })
        })
    }
})
facetsSearch.prototype.init.prototype = facetsSearch.prototype
$(function () {
    var obj = facetsSearch({
        tableUrl: "/Registration/GetRegistrationList",
        tableContainer: "#registrationList",
        filterUrl: "/Registration/GetRegistrationFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumsForRegistrationView",
            savedsearchModuleId: 1,
            optionColumnsModuleId: 1
        }
    });
});



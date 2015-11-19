facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.parameter.tab = $(".clinicalTrialType > li.active");
        _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
        _this.parameter.tabContent = $(_this.parameter.tableContainer).children().eq(0);
        _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
        _this.parameter.pageSize = 10;
        _this.tabInit();
        this.pageInit();
        this.setOrderHeader();
        this.pageDataHander(_this.parameter.pageSize, 1);
        this.setStoreUpListener();
        this.setOptionColumnLinstener();
        this.setFilterSlideListener();
        this.createFilter();  //create Filter
        this.createHistory();  //create Filter
        this.setInputEventListener();
        this.setAddSaveSearchListener();
        this.getRecentSearch(); //recentSearch
        this.setCTTypeListener();
        this.setBodyFilterListener();
        this.setExportListener();
       // this.setAtcCodeListener();
        return this;
    },
    setExportListener: function () {
        var _this = this;
        $("#export").live('click', function () {
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var searchCount = parseInt($("#TotalRecord").val());
            if (parseInt(validCountJson) > 0 && searchCount <= parseInt(validCountJson)) {
                window.location.href = "/ClinicalTrial/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + searchCount;
            } else if (parseInt(validCountJson) > 0 && searchCount > parseInt(validCountJson)) {
                var alterInfo = "You have selected " + searchCount + " lines of data to export. GBI terms and conditions allow up to 500 lines of data to be exported per day. You have exported " + (500 - parseInt(validCountJson)).toString() + " lines of data within the last 24 hours. Are you sure you want to export the first " + validCountJson + " data records";
                var statu = confirm(alterInfo);
                if (!statu) {
                    return false;
                } else {
                    window.location.href = "/ClinicalTrial/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + validCountJson;
                }
            } else {
                alert("You have exceeded the daily data export limit within the last 24 hours. GBI terms and conditions allow up to 500 lines of data to be exported per day. For more information, please click OK button to contact GBI Support Team, or to cancel this data export request please click CANCEL button")
            }
            e.stopPropagation();
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
    tabInit: function () {
        var _this = this;
        _this.getSaveSearchData();
        var savedSearchId = parseInt($("#savedSearchId").val());
        if (savedSearchId) {
            $("#saveSearch").find("a[savedsearchid = " + savedSearchId + "]").click();
        }
    },
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch #startDate input,#facetsSearch #completionDate input,#facetsSearch #formulation select"),
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
        //bodyFilter
        if ($("#tagsinput span.bodyFilter").length) {
            var bodyrequestKey = $("#tagsinput span.bodyFilter").attr("requestkey"),
            bodyrequestvalue = $("#tagsinput span.bodyFilter").attr("requestvalue").trim();
            if (bodyrequestKey == 'latestsubcandidate' || bodyrequestKey == 'latestsubapplicant') {
                var dateVal = bodyrequestvalue.split("and");
                param[bodyrequestKey] = dateVal;
            } else {
                param[bodyrequestKey] = [bodyrequestvalue];
            }
        }
        //page
        //if (this.parameter.tabPage.find(".customPage").val()) {
        //    json["page"] = (parseInt(this.parameter.tabPage.find(".customPage").val()) <= parseInt(this.parameter.tabPage.find(".next").prev().attr("totalpage"))) ? this.parameter.tabPage.find(".customPage").val() : this.parameter.tabPage.find(".next").prev().attr("totalpage")
        //} else {
        //    json["page"] = this.parameter.tabPage.find(".active > a").attr("pageid") || 1;
        //}
        json["filter"] = facetsSearch.isEmptyObject(param) ? JSON.stringify(param) : "";
        json["keyword"] = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        json["order"] = this.order.orderAt ? "{\"" + this.order.orderAt + "\":\"" + this.order.filed + "\"}" : "";
        return json;
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
            url: _this.parameter.tableUrl,
            type: "post",
            async: true,
            dateType: "json",
            data: jsonWithPage,
            success: function (partialView) {
                _this.parameter.tabContent.html(partialView);
                $("#loadingDiv").addClass("hide");
                _this.parameter.tableContainer.removeClass("hide");
                UTCToLocal(_this.parameter.tableContainer);
                _this.pageDataHander(_this.parameter.pageSize, jsonWithPage.page);
                _this.setOrderHeader();
                _this.setBodyFilterListener();
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
            url: "/ClinicalTrial/GetClinicalTrialFilters",
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
    setAtcCodeListener: function(){
        var _this = this;
        $('.first-hidelabel').each(function (i, e) {
            var _this = $(this);
            var html_id = 'atc-level' + i;
            var template_id = 'atc-level-template' + i;
            _this.attr('id', html_id);
            _this.children('script').attr('id', template_id);
        });
        $.ajax({
            url: '/ClinicalTrial/GetWHOAtcCodeData',
            type: 'get', 
            dataType: 'json',
            success: function(result){
                $('#atc-level0').html(template('atc-level-template0', {data: result}));
                $('#atc-level0').find('input').attr('requestkey', $('#atc-level0').data('requestkey'));
                _this.setFilterSlideListener();
                _this.createFilter();
            }
        });
        $.ajax({
            url: '/ClinicalTrial/GetEphmraAtcCodeData',
            type: 'get', 
            dataType: 'json',
            success: function(result){
                $('#atc-level1').html(template('atc-level-template1', {data: result}));
                $('#atc-level1').find('input').attr('requestkey', $('#atc-level1').data('requestkey'));
                _this.setFilterSlideListener();
                _this.createFilter();
            }
        });
    },
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        })
        con.find("select").each(function () {
            $(this).attr("showValue", $(this).find("option:selected").html());
        });
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#phase");
        this.setFilterEventListener("#country");
        this.setFilterEventListener("#gender");
        this.setFilterEventListener("#studyType");
        this.setFilterEventListener("#status");
        this.setFilterEventListener("#startDate");
        this.setFilterEventListener("#completionDate");
        this.setFilterEventListener("#category");
        this.setFilterEventListener("#drugType");
        this.setFilterEventListener("#sponsorType");
        this.setFilterEventListener("#region");
        // this.setFilterEventListener("#tree_atc_code");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
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
                    _this.getTableData().getFilterData();
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
                    _this.getTableData().getFilterData();
                } else {
                    $(this).addClass("checked").siblings().removeClass("checked");
                    _this.getTableData().getFilterData().addRecentSearch();
                }
            }
            return false;
        });
        $("#facetsSearch " + selector + " input.startDate").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function (selectedDate) {
                $("#facetsSearch " + selector + " input.endDate").datepicker("option", "minDate", selectedDate);
                _this.createHistory().getTableData().getFilterData();
            }
        });
        $("#facetsSearch " + selector + " input.endDate").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function (selectedDate) {
                $("#facetsSearch " + selector + " input.startDate").datepicker("option", "maxDate", selectedDate);
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
        $(selector).off('click').on('click', '.btn_level', function () {
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
                    _this.getTableData().getFilterData();
                } else {
                    $(this).addClass("checked").find("input").attr("checked", "checked");
                    $(this).next("div").find("label.checkbox").addClass("checked").find("input").attr("checked", "checked");
                    _this.getTableData().getFilterData().addRecentSearch();
                }
            }
            e.stopPropagation();
        });
    },
    setBodyFilterListener: function () {
        var _this = this;
        $("td a.bodyFilter").unbind('click').bind('click', function () {
            var requestKey = $(this).attr("requestkey"),
                requestValue = $(this).attr("value").trim(),
                 showValue = $(this).attr("showvalue"),
            container = '#tree_atc_code';
            filter = {};
            _this.parameter.tableUrl = "/ClinicalTrial/GetClinicalTrialList";
            _this.parameter.tab = $(".clinicalTrialType > li[type='clinicalTrial']");
            _this.parameter.tab.addClass("active").siblings().removeClass("active").find("span").addClass("hide");
            $(".tabCon>div").addClass("hide");
            $("#loadingDiv").removeClass("hide");
            _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
            _this.parameter.tabContent = _this.parameter.tableContainer.children().eq(0);
            _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
            _this.order = { "filed": null, "orderAt": null };
            if (requestKey != 'ephcode' && requestKey != 'whocode') {
                filter = { "requestKey": requestKey, "value": requestValue };
                _this.createBodyFilterHis(filter, showValue);
            } else {
                $(container).find("input[requestkey='" + requestKey + "'][value = '" + requestValue + "']").attr("checked", "checked").parent("label").addClass("checked");
            }
            _this.getTableData().getFilterData().addRecentSearch();
        });
    },
    createBodyFilterHis: function (filter, showValue) {
        var $this = this, history = $(".tagsinput"), requestKey = filter.requestKey, value = filter.value, shows;
        if (showValue) {
            shows = showValue;
        } else {
            shows = filter.value;
        }
        history.find(".bodyFilter").remove();
        var historylist = $('<span class="tag bodyFilter" requestkey="' + requestKey + '" requestvalue="' + value + '" title="' + requestKey + ":" + value + '" ><span>' + shows + '</span><a class="tagsinput-remove-link closeTag"></a></span>');
        historylist.find(".closeTag").bind("click", (function (historylist) {
            return function () {
                historylist.remove();
                $this.getFilterData().getTableData();
            };
        })(historylist));
        history.append(historylist);
    },
    createPage: function (totalNum, currentPage, pageSize) {
        if (!totalNum) {
            $(".tabCon>div").not(".hide").find(".pageBox").html("");
            return false;
        }
        var _curpage = parseInt(currentPage),
            _totalPage = Math.ceil(totalNum / pageSize),
            _showPages = 7,
            _startPage = 0,
            _endPage = 0,
            _pageHtml = "<div class='pagination pagenum'><ul>";
        maxPage = _totalPage;
        if (_showPages >= _totalPage) {
            _startPage = 1;
            _endPage = _totalPage;
        } else {
            if (parseInt(_curpage) <= _showPages / 2) {
                _startPage = 1;
                _endPage = _showPages;
            } else if ((parseInt(_curpage) + _showPages / 2) > _totalPage) {
                _startPage = _totalPage - _showPages + 1;
                _endPage = _totalPage;
            } else {
                _startPage = parseInt(_curpage) - (_showPages - 1) / 2;
                _endPage = parseInt(_curpage) + _showPages / 2;
            }
        }
        _startPage = _startPage;
        _endPage = Math.floor(_endPage);
        if (_curpage > 1) {
            _pageHtml += " <li class='prevPage'><a href='javascript:void(0)' pageId=\"" + (_curpage - 1) + "\"  class='icon-arrow-left3 prevPage'></a></li> ";
        }
        for (var i = _startPage, len = _endPage; i <= len; i++) {
            var curPageStyle = (i == _curpage ? "class=\"active\"" : "");
            _pageHtml += "<li " + curPageStyle + "><a href='javascript:void(0)' pageId=\"" + i + "\" >" + i + "</a></li>";
        }
        if (_curpage < _totalPage) {
            _pageHtml += "<li class='nextPage'><a href='javascript:void(0)' pageId=\"" + (_curpage + 1) + "\" class='icon-arrow-right3 nextPage'></a></li>";
        }
        var pageBox = $(".tabCon>div").not(".hide").find(".pageBox").html("").html(_pageHtml + '</ul></div><div class="pagination"><ul><li class="pagination-input"><input type="number" min="1" value="" placeholder="..." class="form-control flat input-sm customPage"></li><li totalpage=' + _totalPage + '>&nbsp;&nbsp;' + facetsSearch.formatNumber(_totalPage) + '&nbsp;&nbsp;</li> <li class="next"><a href="javascript:void(0)" class="icon-arrow-right3 pageGo">&nbsp;&nbsp;GO</a></li></ul></div>');
        this.setCount(totalNum);
        this.setPageEventListener(pageBox.find(".pageGo"), pageBox.find("a[pageid]").parent("li"));
    },
    pageDataHander: function (rows, page) {
        //$(".count").html(facetsSearch.formatNumber(parseInt($(".tabCon > div:not('.hide')").find("input#TotalRecord").val())));
        var _totalNum = parseInt($(".tabCon > div:not('.hide')").find("input#TotalRecord").val());
        this.createPage(_totalNum, page, rows);
        $(".clinicalTrialType > li.active span").removeClass("hide").find("b").html(facetsSearch.formatNumber(_totalNum));
    },
    setCount: function (totalNum) {
        $(".count").attr("totalNum", totalNum);
    },
    setCTTypeListener: function () {
        var _this = this;
        $(".clinicalTrialType > li").click(function () {
            $(this).addClass("active").siblings().removeClass("active").find("span").addClass("hide");
            var type = $(this).attr("type");
            switch (type) {
                case "clinicalTrial":
                    _this.parameter.tableUrl = "/ClinicalTrial/GetClinicalTrialList";
                    _this.parameter.saveSearch.optionColumnsModuleId = 12;
                    break;
                case "product":
                    _this.parameter.tableUrl = "/ClinicalTrial/GetLinkctProductList";
                    _this.parameter.saveSearch.optionColumnsModuleId = 13;
                    break;
                case "sponsor":
                    _this.parameter.tableUrl = "/ClinicalTrial/GetLinkctSponsorList";
                    _this.parameter.saveSearch.optionColumnsModuleId = 14;
                    break;
            }
            _this.parameter.tab = $(this);
            $(".tabCon>div").addClass("hide");
            $("#loadingDiv").removeClass("hide");
            _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
            _this.parameter.tabContent = _this.parameter.tableContainer.children().eq(0);
            _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
            _this.order = { "filed": null, "orderAt": null };
            if (type == "product") {
                _this.getTableData();
            } else if (type == "sponsor") {
                _this.getTableData();
            } else {
                _this.getTableData().getFilterData();
            }
        })
    },
    setOptionColumnLinstener: function () {
        var _this = this;
        var tabType,
            modelID,
            url;
        $("#TableOptionModal .modal-body label.checkbox").live("click", function (e) {
            if ($(this).hasClass("checked")) {
                $(this).addClass("checked").find("input").attr("checked", "checked");
            } else {
                $(this).removeClass("checked").find("input").removeAttr("checked");
            }
            var checkboxLen = $("#TableOptionModal .modal-body label.checkbox").length,
                checkedLen = $("#TableOptionModal .modal-body label.checked").length;

            if (checkboxLen != checkedLen) {
                $("#checkAllColumnOption").removeClass("checked");
            } else {
                $("#checkAllColumnOption").addClass("checked");
            }
            e.stopPropagation();
        });
        $("#optionColumn").click(function () {
            tabType = _this.parameter.tab.attr("type");
            switch (tabType) {
                case "clinicalTrial":
                    modelID = 12;
                    url = "/OptionalColum/GetOptionalColumnsForClinicalTrialView";
                    break;
                case "product":
                    modelID = 13;
                    url = "/OptionalColum/GetOptionalColumnsForLinkctProductView";
                    break;
                case "sponsor":
                    modelID = 14;
                    url = "/OptionalColum/GetOptionalColumnsForLinkctSponsorView";
                    break;
            }
            $.ajax({
                url: url,
                type: "post",
                async: false,
                dateType: "json",
                data: { modelID: modelID },
                success: function (html) {
                    $("#TableOptionModal .modal-body").html(html);
                    var checkboxLen = $("#TableOptionModal .modal-body label.checkbox").length,
                        checkedLen = $("#TableOptionModal .modal-body label.checked").length;
                    if (checkboxLen != checkedLen) {
                        $("#checkAllColumnOption").removeClass("checked");
                    } else {
                        $("#checkAllColumnOption").addClass("checked");
                    }
                    var body = $("#TableOptionModal .modal-body");
                    body.find("#checkAllColumnOption").click(function (e) {
                        if ($(this).hasClass("checked")) {
                            $(this).removeClass("checked").parents(".row").eq(0).nextAll(".option").find("label").removeClass("checked").find("input").removeAttr("checked");
                        } else {
                            $(this).addClass("checked").parents(".row").eq(0).nextAll(".option").find("label").addClass("checked").find("input").attr("checked", "checked");
                        }
                        e.stopPropagation();
                    });
                    body.find(".toDown,.toUp").click(function () {
                        var parent = $(this).parents(".option");
                        if ($(this).hasClass("toDown")) {
                            parent.next(".option").after(parent);
                        } else {
                            parent.prev(".option").before(parent);
                        }
                        var parents = body.find(".option");
                        parents.find(".toDown,.toUp").show();
                        parents.first().find(".toUp").hide();
                        parents.last().find(".toDown").hide();
                    });
                }
            });
        });
        $("#TableOptionModal .submitOptionColumn").click(function () {
            var checks = $("#TableOptionModal .option"),
                paramStr = {};
            checks.each(function () {
                paramStr[$(this).find("input").attr("requestkey")] = $(this).find(".checked").length ? true : false;
            });
            $.ajax({
                url: "/OptionalColum/SaveOptionalColums",
                type: "post",
                async: false,
                dateType: "json",
                data: { modelID: modelID, optionalColums: JSON.stringify(paramStr) },
                success: function () {
                    $("#TableOptionModal [data-dismiss='modal']").click();
                    _this.getTableData();
                }
            });
        });
    }
});
facetsSearch.prototype.init.prototype = facetsSearch.prototype;
$(function () {

    var obj = facetsSearch({
        tableUrl: "/ClinicalTrial/GetClinicalTrialList",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            savedsearchModuleId: 12,
            optionColumnsModuleId: 12
        }
    });
});

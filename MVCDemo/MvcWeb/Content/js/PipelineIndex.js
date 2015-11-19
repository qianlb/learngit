facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.parameter.tab = $(".pipelineType > li.active");
        _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
        _this.parameter.tabContent = $(_this.parameter.tableContainer).children().eq(0);
        _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
        _this.parameter.pageSize = 10;
        _this.tabInit();
        this.setOrderHeader();
        this.pageDataHander(_this.parameter.pageSize, 1);
        this.setStoreUpListener();
        this.setOptionColumnLinstener();
        this.setFilterSlideListener();
        this.createFilter();  //create Filter
        this.createHistory();  //create Filter
        this.setBodyFilterListener();
        this.setInputEventListener();
        this.setBooleanSaerchListener();
        this.setAddSaveSearchListener();
        this.getRecentSearch(); //recentSearch
        this.setpipelineTypeListener();
        this.track();
        this.setExportListener();
        //this.getFilterData();
        UTCToLocal($("#applicationList"));
        return this;
    },
    tabInit: function () {
        var _this = this;
        _this.getSaveSearchData();
        var savedSearchId = parseInt($("#savedSearchId").val());
        if (savedSearchId) {
            $("#saveSearch").find("a[savedsearchid = " + savedSearchId + "]").click();
        }
    },
    getRequestParam: function (filter) {
        /*add booleanSearch*/
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input, .facetsSearch label.checked >input, #facetsSearch #cdestatusdate input, #facetsSearch #cdeacceptancedate input, #facetsSearch #formulation select,#ephmra_atc_code select,#ephmra_atc_code select"),
                param = {}, paramStr = [],
                booleanSearchId = $("#booleanSearchBody"), booleanSearch = [],
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
            } else if ($(e).attr("requestkey") == "registrationcategory") {
                var key = $(e).attr("requestkey");
                param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
            } else if ($(e).attr("requestkey") == "ephcode") {
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
            } else {
                var key = $(e).attr("requestkey");
                param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
            }
        });

        $("#candidateid").val() ? param["candidateid"] = [$("#candidateid").val()] : "";
        $("#companyid").val() ? param["companyid"] = [$("#companyid").val()] : "";  //Added by aaron 2015-3-5
        $("#timelinesupplemental").val() ? param["timelinesupplemental"] = [$("#timelinesupplemental").val()] : "";
        $("#timelineinitial").val() ? param["timelineinitial"] = [$("#timelineinitial").val()] : "";
        //bodyFilter
        $("#tagsinput span.bodyFilter").each(function (i, e) {
            var bodyrequestKey = $(e).attr("requestkey"),
                bodyrequestvalue = $(e).attr("requestvalue").trim();
            if (bodyrequestKey == 'latestsubcandidate' || bodyrequestKey == 'latestsubapplicant') {
                var dateVal = bodyrequestvalue.split("and");
                param[bodyrequestKey] = dateVal;
            } else {
                param[bodyrequestKey] = [bodyrequestvalue];
            }
        });

        booleanSearchId.find(".advancedsearch-line").each(function (index) {
            var advancedsearchLine = {}, _that = $(this);
            if (index == 0) {
                advancedsearchLine["bind"] = "";
                _that.children("div:eq(1)").find("b").each(function (subIndex1) {
                    var _thata = $(this).find("select");
                    if (subIndex1 == 0) {
                        advancedsearchLine["name"] = _thata.val() || "";
                    } else if (subIndex1 == 1) {
                        advancedsearchLine["operator"] = _thata.val() || "";
                    } else if (subIndex1 == 2) {
                        _thata = $(this).find("input");
                        advancedsearchLine["value"] = _thata.val() || "";
                    }
                })
            } else {
                advancedsearchLine["bind"] = _that.children("div:eq(0)").find("select").val();
                _that.children("div:eq(1)").find("b").each(function (subIndex2) {
                    var _thatb = $(this).find("select");
                    if (subIndex2 == 0) {
                        advancedsearchLine["name"] = _thatb.val() || "";
                    } else if (subIndex2 == 1) {
                        advancedsearchLine["operator"] = _thatb.val() || "";
                    } else if (subIndex2 == 2) {
                        _thatb = $(this).find("input");
                        advancedsearchLine["value"] = _thatb.val() || "";
                    }
                })
            }
            booleanSearch.push(advancedsearchLine);
        })
        /*registrationcategory去重*/
        param["registrationcategory"] ? param["registrationcategory"] = param["registrationcategory"].unique() : [];
        //page
        //if (this.parameter.tabPage.find(".customPage").val()) {
        //    json["page"] = (parseInt(this.parameter.tabPage.find(".customPage").val()) <= parseInt(this.parameter.tabPage.find(".next").prev().attr("totalpage"))) ? this.parameter.tabPage.find(".customPage").val() : this.parameter.tabPage.find(".next").prev().attr("totalpage")
        //} else {
        //    json["page"] = this.parameter.tabPage.find(".active > a").attr("pageid") || 1;
        //}
        var post_filter = $.parseJSON(get_urlparam('filter')) ? $.parseJSON(get_urlparam('filter')) : '';
        if (post_filter) {
            for (var k in post_filter) {
                if (!param['date'] || !param['cde_acceptance_date']) {
                    param[k] ? param[k].concat(post_filter[k]).unique() : param[k] = post_filter[k];
                }
            }
        }

        json["filter"] = facetsSearch.isEmptyObject(param) ? JSON.stringify(param) : "";
        //  json["booleanSearch"] = facetsSearch.isEmptyObject(booleanSearch) ? JSON.stringify(booleanSearch) : "";
        json["booleanSearch"] = "";
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
            }
        });
        return this;
    },
    getFilterData: function (filter, param) {

        var _this = this,
            _HistoryList = _this.getHistoryList(),
            reqeustParam = $.extend(this.getRequestParam(filter), param);
        $.ajax({
            url: "/Pipeline/GetFacetedSearch",
            type: "post",
            async: true,
            dateType: "json",
            data: reqeustParam,
            success: function (partialView) {
                $("#filter-condition").children('li').not('.calendar-li').remove();
                $("#filter-condition").prepend(partialView);
                _this.setChecked();
                _this.setFilterSlideListener();
                _this.createFilter();
                _this.createHistory({ HistoryList: _HistoryList });
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
        })
        con.find("select").each(function () {
            $(this).attr("showValue", $(this).find("option:selected").html());
        });
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#origin");
        this.setFilterEventListener("#registrationcategory");
        this.setFilterEventListener("#applicationtype");
        this.setFilterEventListener("#inspectiongroup");
        // this.setFilterEventListener("#companyType");
        this.setFilterEventListener("#ispipeline");
        this.setFilterEventListener("#cdereviewstatus");
        this.setFilterEventListener("#cdeopinion");
        this.setFilterEventListener("#cdeprocess");
        this.setFilterEventListener("#cfdareviewstatus");
        this.setFilterEventListener("#cdestatusdate");
        this.setFilterEventListener("#cdeacceptancedate");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
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
            _pageHtml += " <li class='prevPage'><a href='javascript:void(0)' pageId=\"" + (_curpage - 1) + "\"  class='icon-arrow-left3 prevPage'></a></li> "
        }
        for (var i = _startPage, len = _endPage; i <= len; i++) {
            var curPageStyle = (i == _curpage ? "class=\"active\"" : "");
            _pageHtml += "<li " + curPageStyle + "><a href='javascript:void(0)' pageId=\"" + i + "\" >" + i + "</a></li>"
        }
        if (_curpage < _totalPage) {
            _pageHtml += "<li class='nextPage'><a href='javascript:void(0)' pageId=\"" + (_curpage + 1) + "\" class='icon-arrow-right3 nextPage'></a></li>"
        }
        var pageBox = $(".tabCon>div").not(".hide").find(".pageBox").html("").html(_pageHtml + '</ul></div><div class="pagination"><ul><li class="pagination-input"><input type="number" min="1" value="" placeholder="..." class="form-control flat input-sm customPage"></li><li totalpage=' + _totalPage + '>&nbsp;&nbsp;' + facetsSearch.formatNumber(_totalPage) + '&nbsp;&nbsp;</li> <li class="next"><a href="javascript:void(0)" class="icon-arrow-right3 pageGo">&nbsp;&nbsp;GO</a></li></ul></div>');
        this.setCount(totalNum);
        this.setPageEventListener(pageBox.find(".pageGo"), pageBox.find("a[pageid]").parent("li"));
    },
    pageDataHander: function (rows, page) {
        //$(".count").html(facetsSearch.formatNumber(parseInt($(".tabCon > div:not('.hide')").find("input.TotalRecord").val())));
        var _totalNum = parseInt($(".tabCon > div:not('.hide')").find("input.TotalRecord").val());
        this.createPage(_totalNum, page, rows);
        $(".pipelineType > li.active span").removeClass("hide").find("b").html(facetsSearch.formatNumber(_totalNum));
    },
    setCount: function (totalNum) {
        $(".count").attr("totalNum", totalNum);
    },
    setBodyFilterListener: function () {
        var _this = this;
        $("td a.bodyFilter").click(function () {
            var requestKey = $(this).attr("requestkey"),
                value1 = $(this).attr("value1"),
                value2 = $(this).attr("value2"),
                showValue = $(this).attr("showvalue") ? $(this).attr("showvalue").replace(/<br>/, " ") : "";
            filter = {};
            _this.parameter.tableUrl = "/Pipeline/GetPipelineListByApplication"
            _this.parameter.tab = $(".pipelineType > li[type='application']");
            _this.parameter.tab.addClass("active").siblings().removeClass("active").find("span").addClass("hide");
            $(".tabCon>div").addClass("hide");
            $("#loadingDiv").removeClass("hide");
            _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
            _this.parameter.tabContent = _this.parameter.tableContainer.children().eq(0);
            _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
            _this.order = { "filed": null, "orderAt": null };
            if (!value2) {
                filter = { "requestKey": requestKey, "value": value1 }
            } else {
                filter = { "requestKey": requestKey, "value": value1 + " and " + value2 }
                showValue = showValue + " , " + $(this).text();
            }
            _this.createBodyFilterHis(filter, showValue);
            _this.getTableData().getFilterData();
        });
    },
    createBodyFilterHis: function (filter, showValue) {
        var $this = this, history = $(".tagsinput"), requestKey = filter.requestKey, value = filter.value, shows;
        if (showValue) {
            shows = showValue;
        } else {
            shows = filter.value;
        }
        var historylist = $('<span class="tag bodyFilter" requestkey="' + requestKey + '" requestvalue="' + value + '" title="' + requestKey + ":" + value + '" ><span>' + shows + '</span><a class="tagsinput-remove-link closeTag"></a></span>');
        historylist.find(".closeTag").bind("click", (function (historylist) {
            return function () {
                historylist.remove();
                $this.getFilterData().getTableData();
            }
        })(historylist));
        $(".tag.bodyFilter").each(function () {  /*判断是否已选择了相同的条件*/
            if ($(this).attr("requestkey") == requestKey) {
                $(this).remove();
            }
        });
        history.append(historylist);
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
        $("#facetsSearch " + selector + " label.radio").unbind('click').bind('click', function (e) {
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
        });
        $("#facetsSearch " + selector + " input.startDate").datepicker({
            changeMonth: true,
            changeYear: true,
            onClose: function (selectedDate) {
                $("#facetsSearch " + selector + " input.endDate").datepicker("option", "minDate", selectedDate);
                _this.createHistory().getTableData().getFilterData();
            }
        });
        $("#facetsSearch " + selector + " input.endDate").datepicker({
            changeMonth: true,
            changeYear: true,
            onClose: function (selectedDate) {
                $("#facetsSearch " + selector + " input.startDate").datepicker("option", "maxDate", selectedDate);
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
                var input = $(this).find(":checkbox"), siblingsCheck = $(this).parent().children(".checked");
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked").find("input").removeAttr("checked");
                    $(this).next("div").find("label.checkbox").removeClass("checked").find("input").removeAttr("checked");
                    if ($(this).attr("level") == "level3") {
                        $(this).parent().parent().prev().removeClass("checked").find("input").removeAttr("checked")
                        $(this).parent().parent().prev().parent().parent().prev().removeClass("checked").find("input");
                    } else if ($(this).attr("level") == "level2") {
                        $(this).parent().parent().prev().removeClass("checked").find("input").removeAttr("checked");
                    }
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
    setChecked: function () {
        var checkArr = $("#CheckedPrevious").val(), input = $("#registrationcategory label.checkbox").find("input");
        checkArr = (checkArr && JSON.parse(checkArr).length) ? (JSON.parse(checkArr))[0]["Value"] : [];
        for (var i = 0, len = checkArr.length; i < len; i++) {
            input.each(function () {
                var _this = $(this)
                if (_this.val() == checkArr[i]) {
                    _this.attr("checked", "checked").parent().addClass("checked")
                }
            })
        }

    },
    setBooleanSaerchListener: function () {
        var _this = this; booleanSearchCon = $("#booleanSearchBody");
        booleanSearchCon.find(".addBooleanSearch").live("click", function () {
            var booleanSearchHtml = $('<div class="row advancedsearch-line"><div class="col-sm-2"><select name="small" class="select-block multiple"><option value="and" selected="selected">And</option><option value="or">Or</option><option value="not">Not</option></select></div><div class="col-sm-8"><b><select name="small" class="select-block multiple"><option selected="selected" value="Candidate name">Candidate name</option><option value="Candidate name(raw)">Candidate name(raw)</option><option value="Applicant">Applicant</option></select></b><b><select name="small" class="select-block multiple"><option value="is">is</option><option value="contains">contains</option><option selected="selected" value="isNot">is not</option></select></b><b><input class="form-control input-sm" placeholder="Enter a term" type="text" value=""></b></div><div class="col-sm-2"><a href="javascript:;" class="mts pull-right"><span class="icon-plus-circle addBooleanSearch"></span></a><a href="javascript:;" class="mts pull-right"><span class="icon-minus-circle cutBooleanSearch"></span></a></div></div>');
            booleanSearchCon.append(booleanSearchHtml);
            booleanSearchHtml.find(".multiple").selectpicker({ style: 'btn-default', menuStyle: 'dropdown-inverse' });
        })
        booleanSearchCon.find(".cutBooleanSearch").live("click", function () {
            var _that = $(this), removeItem = _that.parent().parent().parent(".advancedsearch-line");
            removeItem.remove();
        })
        $("#booleanSearch").click(function () {
            _this.getTableData();
        })
    },
    setpipelineTypeListener: function () {
        var _this = this;
        $(".pipelineType > li").click(function () {
            $(this).addClass("active").siblings().removeClass("active").find("span").addClass("hide");
            var type = $(this).attr("type");
            switch (type) {
                case "application":
                    _this.parameter.tableUrl = "/Pipeline/GetPipelineListByApplication";
                    _this.parameter.saveSearch.optionColumnsModuleId = 2;
                    break;
                case "candidate":
                    _this.parameter.tableUrl = "/Pipeline/GetPipelineListByCandidate";
                    _this.parameter.saveSearch.optionColumnsModuleId = 3;
                    break;
                case "applicant":
                    _this.parameter.tableUrl = "/Pipeline/GetPipelineListByApplicant";
                    _this.parameter.saveSearch.optionColumnsModuleId = 4;
                    break;
            }
            _this.parameter.tab = $(this);
            $(".tabCon>div").addClass("hide");
            $("#loadingDiv").removeClass("hide");
            _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
            _this.parameter.tabContent = _this.parameter.tableContainer.children().eq(0);
            _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
            _this.order = { "filed": null, "orderAt": null };
            _this.getTableData().getFilterData();
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
        })
        $("#optionColumn").click(function () {
            tabType = _this.parameter.tab.attr("type");
            switch (tabType) {
                case "application":
                    modelID = 2;
                    url = "/OptionalColum/GetOptionalColumnsForPipelineViewApplication";
                    break;
                case "candidate":
                    modelID = 3;
                    url = "/OptionalColum/GetOptionalColumnsForPipelineViewCandidate";
                    break;
                case "applicant":
                    modelID = 4;
                    url = "/OptionalColum/GetOptionalColumnsForPipelineViewApplicant";
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
                    var body = $("#TableOptionModal .modal-body")
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
                    })
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
    setStoreUpListener: function () {
        var _this = this;
        $("#clearTag").unbind('click').bind('click', function () {
            $(".oprateTags").addClass('hide');
            $(".tagsinput>.tag").remove();
            $('#trackBell').addClass('hide');   //registration
            $(".facetsSearch .checkbox,#facetsSearch .checkbox").removeClass("checked").find("input").removeAttr("checked");
            $("#facetsSearch label.radio").removeClass("checked").find("input").removeAttr("checked");
            $(".searchInput").val("");
            $("#facetsSearch .startDate,#facetsSearch .endDate").val("");
            $(".facetsSearch option,#facetsSearch option").removeAttr("selected");
            $("#facetsSearch .startDate,#facetsSearch .endDate").datepicker("option", { minDate: null, maxDate: null });
            if (window.location.pathname == '/Pipeline/DirectToPipeline') {
                // location.href = "/Pipeline/DirectToPipeline";
                history.pushState({}, "GBI SOURCE", "/Pipeline/DirectToPipeline");
            }
            _this.getTableData().getFilterData();
        });
    },
    setExportListener: function () {
        var _this = this;
        $("#export").live('click', function () {
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var searchCount = parseInt($(".mhl").children("span").attr("totalnum"));
            var type = $(this).parent().parent().parent("div").attr("type");
            var href = "";
            switch (type) {
                case "application":
                    href = "/Pipeline/ExportApplicate?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order;
                    break;
                case "candidate":
                    href = "/Pipeline/ExportCandidate?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order;
                    break;
                case "applicant":
                    href = "/Pipeline/ExportApplicant?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order;
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
})
facetsSearch.prototype.init.prototype = facetsSearch.prototype
$(function () {
    var obj = facetsSearch({
        tableUrl: "/Pipeline/GetPipelineListByApplication",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            savedsearchModuleId: 3,
            optionColumnsModuleId: 2
        }
    });
})
//创建构造函数
var facetsSearch = window.facetsSearch = function (option) {
    return new facetsSearch.prototype.init(option);
}
//设置原型
facetsSearch.fn = facetsSearch.prototype = {
    parameter: null,
    dictionary: null,
    order: { orderAt: null, filed: null },
    //初始化函数
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.getSaveSearchData();   //getSavedSearch
        _this.parameter.pageSize = 10;
        this.pageInit();   //init
        this.setInputEventListener();    //input search
        this.setFilterSlideListener();   //filter events
        this.pageDataHander(_this.parameter.pageSize, 1);   //page
        this.setOrderHeader();   //order
        this.setStoreUpListener(); //clearTag
        this.setAddSaveSearchListener(); //addSaveSearch
        this.createFilter();  //createFliter
        this.createHistory();  // createHistory
        return this;
    },
    pageInit: function () {
        var _this = this;
        var savedSearchId = parseInt($("#savedSearchId").val());
        if (savedSearchId) {
            $("#saveSearch").find("a[savedsearchid = " + savedSearchId + "]").click();
        }
        var origin_domestic = $("#origin_domestic").val();
        if (origin_domestic) {
            $("#origin").find("input[requestkey = 'origin'][value='" + origin_domestic + "']").attr("checked", "checked").parent("div").addClass("checked");
        }
    },
    //Amount Range
    setRange: function (rangeObj) {
        this.range = rangeObj;
    },
    getRange: function (rangeObj) {
        return this.range;
    },
    //Amount maxMin
    setInitMaxMin: function (InitrangeMaxMin) {
        this.InitmaxMin = InitrangeMaxMin;
    },
    getInitMaxMin: function () {
        return this.InitmaxMin;
    },
    //Amount language
    setLanguage: function (language) {
        this.language = language;
    },
    getLanguage: function () {
        return this.language;
    },
    //在页面上获取请求参数
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch input.date,#facetsSearch #formulation select,#ephmra_atc_code select,#ephmra_atc_code select"),
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
    getSaveSearchParam: function () {
        var json = {},
            filters = $("#facetsSearch .checkbox.checked>input,.facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch input.date,#facetsSearch #formulation select,#facetsSearch #drugInsertSource select"),
            param = {}, paramStr = [], paramStrFor, paramStrDate,
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
            }
            else if ($(e).attr("requestkey") == "formulation") {
                if ($(e).val()) {
                    param["formulation"] ? param["formulation"].push($(e).val()) : param["formulation"] = [$(e).val()];
                    paramStrFor = $(e).attr("showvalue");
                }
            } else if ($(e).attr("requestkey") == "drugInsertSource") {
                if ($(e).val()) {
                    param["drugInsertSource"] ? param["drugInsertSource"].push($(e).val()) : param["drugInsertSource"] = [$(e).val()];
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
        return { saveName: paramStr.join(" + "), moduleId: this.parameter.saveSearch.savedsearchModuleId, searchFilter: JSON.stringify(param), resultCount: $(".count").attr("totalnum") };
    },
    //
    createFormulation: function (json, selectBox) {
        var html = "<option value=''>" + $('#ALL').val + "</option>", json = $.parseJSON(json), selectBox = selectBox ? selectBox : $("#formulation>div:eq(0)");
        for (var i = 0, len = json.length; i < len; i++) {
            html += "<option value='" + json[i]["Key"] + "'>" + json[i]["Value"] + "</option>"
        }
        selectBox.find("select").html(html);
        selectBox.show();
    },
    //获取tableData

    getTableData: function (filter, param, page) {
        var _this = this;
        var reqeustParam = $.extend(this.getRequestParam(filter), param);
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
                $(_this.parameter.tableContainer).html(partialView);
                _this.pageDataHander(_this.parameter.pageSize, jsonWithPage.page);
                _this.setOrderHeader();
            },
            error: function () {
                //alert("数据获取失败");
            }
        });
        return this;
    },

    //获取filter数据
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
                $("#facetsSearch").html(partialView);
                _this.setFilterSlideListener();
                _this.createFilter();
                _this.createHistory();
                $(window).resize();
            },
            global: false
        });
        return this;
    },
    //获取saveSearch数据
    getSaveSearchData: function () {
        var _this = this;
        $.ajax({
            url: _this.parameter.saveSearch.saveSearchUrl,
            type: "post",
            async: false,
            dateType: "json",
            data: { moduleId: _this.parameter.saveSearch.savedsearchModuleId },
            success: function (json) {
                _this.createSaveSearch(json);
            },
            error: function () {
                //alert("数据获取失败");
            }
        });
        return this;
    },


    //创建saveSearch
    createSaveSearch: function (json) {
        var saveSearch = $("#saveSearch");
        $("#saveSearch").html(json);
        this.setSaveSearchListener();
    },
    //给saveSearch添加点击事件请求ajax
    setSaveSearchListener: function () {
        var _this = this, filter = $("#facetsSearch"), checked = [];
        $("#saveSearch a").live("click", function () {
            var paramStr = $(this).attr("data");
            var obj = $.parseJSON(paramStr) || [], param = { filter: {} };
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
                } else {
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                }
            }
            delete param["filter"]["keyword"];
            $('input.date').each(function () {
                var _this = $(this);
                var key = _this.attr('parentkey');
                if(param.filter[key]){
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
    //给recentSearch添加点击事件
    setRecentSearchListener: function () {
        var _this = this, filter = $("#facetsSearch"), checked = [];
        $("#recentSearch>ul a").click(function () {
            var paramStr = $(this).attr("data");
            var obj = $.parseJSON(paramStr) || [], param = { filter: {} };
            for (var i = 0, len = obj.length; i < len; i++) {
                if (obj[i]["Key"] == "keyword") {
                    $(".searchInput").val(obj[i]["Value"]);
                } else if (obj[i]["Key"] == "Amount") {
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                    _this.setRangeEventListener(obj[i]["Value"][0], obj[i]["Value"][1], _this.getInitMaxMin()[0], _this.getInitMaxMin()[1], _this.getLanguage())
                } else if (obj[i]["Key"] == "whocode" || obj[i]["Key"] == "ephcode") {
                    var atcArr = obj[i]["Value"];
                    for (var j = 0, len1 = atcArr.length; j < len1; j++) {
                        $(".facetsSearch input[requestkey='" + obj[i]["Key"] + "'][value = '" + atcArr[j] + "']").attr("checked", "checked").parent("label").addClass("checked")
                    }
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                }
                else {
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                }
            }
            param["filter"] = JSON.stringify(param["filter"]);
            _this.getFilterData({}, param).getTableData({}, param);
        });
        $("#recentSearch>a.phm").click(function (e) {
            $(this).parent().toggleClass("opened").children("ul.submenu-nav").slideToggle();
            e.stopPropagation();
        });
    },
    //排序
    setOrderHeader: function () {
        var order = this.order, _this = this,
        orderElm = $(this.parameter.tableContainer).find("[orderat='" + order.orderAt + "']");
        orderElm.addClass("active").siblings("th").removeClass("active")
        if (orderElm.length && order.filed === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
        } else if (orderElm.length && order.filed === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
        }
        var orderElms = $(this.parameter.tableContainer).find("[orderat]");
        orderElms.off().on('click', function(){
            $('.popover').remove();
            var $this = $(this);
            $this.addClass("active").siblings().removeClass("active").find("span.icon-sort-down,span.icon-sort-up,span.icon-unsorted").attr("class", "icon-unsorted");
            if ($this.find("span.icon-sort-down").length) {
                $this.find("span").attr("class", "icon-sort-up");
                _this.order.orderAt = $this.attr("orderat");
                _this.order.filed = "asc";
            } else {
                $this.find("span").attr("class", "icon-sort-down");
                _this.order.orderAt = $this.attr("orderat");
                _this.order.filed = "desc";
            }
            _this.getTableData();
        }).css("cursor", "pointer");
    },
    //
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
        this.setFilterEventListener("#approvaldate");
        this.setFilterEventListener("#expirationdate");
        this.setFilterEventListener("#validity");
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
        /*$(".facetsSearch " + selector + " input.startDate,#facetsSearch " + selector + " input.endDate").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function () {
                _this.getTableData().getFilterData().addRecentSearch();
            }
        });*/
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
    getHistoryList: function () {
        var _this = [];
        $(".facetsSearch .checkbox.checked input,#facetsSearch .checkbox.checked input").each(function () {
            //处理level层级关系（除去level1，其它只需siblings节点的个数和siblings checked节点的个数不一样就需要显示）
            var $this = $(this), level = $this.attr("level");

            function handleTreeFilter() {
                var siblingLen = $this.closest("div.plm").siblings().children("label.checkbox").length;
                var siblingCheckLen = $this.closest("div.plm").siblings().children("label.checked").length;
                if (level == "level1") {
                    _this.push($this);
                    return;
                }
                else if (siblingLen != siblingCheckLen) {
                    _this.push($this);
                    return;
                }

                var patchList = [{ p: 'J02', c: 'J02A' }];


                patchList.map(function (patch) {
                    if (
                        (!$(".facetsSearch .checkbox.checked input[value='" + patch.p + "']").length)
                            &&
                            $(".facetsSearch .checkbox.checked input[value='" + patch.c + "']").length
                    ) {
                        _this.push($this);
                    }
                });
                return;


            }

            if (level) {
                handleTreeFilter();
                //else {
                //    _this.push($(this));
                //}
            } else {
                _this.push($(this));
            }
        });
        $("#facetsSearch .radio.checked input,#facetsSearch .radio.checked input").each(function () {
            if ($(this).val()) {
                _this.push($(this));
            }
        });
        $("#facetsSearch .startDate,#facetsSearch .endDate").each(function () {
            if ($(this).val()) {
                _this.push($(this));
            }
        });
        $("#facetsSearch #formulation,#facetsSearch #drugInsertSource").each(function () {
            var $_this = $(this), LastSelect;
            $_this.find('select').each(function () {
                if ($(this).val()) {
                    LastSelect = $(this);
                }
            });
            if (LastSelect) {
                _this.push(LastSelect);
            }
        });
        return _this;
    }
    ,
    compareDom: function (dom1, dom2) {
        return dom1.outerHTML === dom2.outerHTML;
    }
    ,
    createHistory: function (paras) {
        var _this = ((paras && paras.HistoryList) ? paras.HistoryList : this.getHistoryList()), LastSelect;

        //patch for merge, should be removed
        _this = this.getHistoryList();

        var $this = this, history = $(".tagsinput");
        //特殊处理amount和pipeline的bodyFilter
        history.find(".tag:not(.bodyFilter)").remove();
        for (var i = 0, len = _this.length; i < len; i++) {
            if (_this[i].is(".startDate,.endDate")) {
                var begin = $("#facetsSearch .startDate"), end = $("#facetsSearch .endDate"), key = begin.attr("parentKey"), requestKey = begin.attr("requestKey"), titleVal = "";
                if (_this[i].attr("requestkey") == "interval") {
                    begin = $("#facetsSearch .startDate[parentkey='" + _this[i].attr("parentkey") + "']");
                    end = $("#facetsSearch .endDate[parentkey='" + _this[i].attr("parentkey") + "']");
                    key = begin.attr("parentKey");
                    requestKey = begin.attr("requestKey");
                    titleVal = begin.parent().parent().parent().attr("titleVal") || begin.parents("li.phm").attr("titleVal");
                }
                if (history.length) {
                    history.find("span[parentkey='" + key + "']").remove();
                    var historylist = $('<span class="tag" parentkey = "' + key + '" requestkey="' + begin.attr("requestKey") + '" requestvalue="' + begin.val() + ' - ' + end.val() + '" title="' + titleVal + ":&nbsp:;" + begin.val() + ' - ' + end.val() + '" ><span>' + titleVal + ":&nbsp" + begin.val() + ' - ' + end.val() + '</span><a class="tagsinput-remove-link closeTag"></a></span>');
                    
                    historylist.find(".closeTag").bind("click", (function (historylist) {
                        return function () {
                            $(begin.selector).val("");
                            $(end.selector).val("");
                            historylist.remove();
                            $this.hideClearAndSaveIfNoTags();
                            $this.createHistory().getFilterData().getTableData();
                        }
                    })(historylist));
                    history.append(historylist);
                }
            } else {
                var parentKey = _this[i].attr("parentkey"),
                requestKey = _this[i].attr("requestkey"),
                titleVal = _this[i].parents('.filter-group').attr("titleval") || _this[i].parents("li.phm").attr("titleVal"),
                value = _this[i].val(),
                name = _this[i].attr("showValue");
                if (_this[i].attr("requestkey") == "formulation" || _this[i].attr("requestkey") == "drugInsertSource") {
                    name = _this[i].find("option:selected").text();
                }
                if (history.length) {
                    var historylist="";
                    if (requestKey == "ephcode" || requestKey == "whocode") {
                        historylist = $('<span class="tag" requestkey="' + requestKey + '" requestvalue="' + value + '" title="' + titleVal + ":" + name + '" ><span>' + titleVal + ":&nbsp(" + value + ")&nbsp;" + name + '</span><a class="tagsinput-remove-link closeTag"></a></span>');
                    }
                    else {
                        historylist = $('<span class="tag" requestkey="' + requestKey + '" requestvalue="' + value + '" title="' + titleVal + ":" + name + '" ><span>' + titleVal + ":&nbsp" + name + '</span><a class="tagsinput-remove-link closeTag"></a></span>');
                    }
                    
                    historylist.find(".closeTag").bind("click", (function (filter, historylist) {
                        return function () {
                            if (filter.is("input[type='checkbox']")) {
                                //处理level层级关系
                                if (filter.attr("level")) {
                                    filter.parent().next(".hideLabel").find("label.checkbox").removeClass("checked").find("input").removeAttr("checked");
                                }
                                $("input[requestkey='" + filter.attr("requestkey") + "'][value='" + filter.attr("value") + "']").removeAttr("checked").parent().removeClass("checked")
                            } else if (filter.is("select[requestkey='formulation']")) {
                                $("[requestkey='formulation'] option:selected").removeAttr("selected");
                                $("[requestkey='formulation'] option:first-child").attr("selected", "selected");
                            }
                            else if (filter.is("select[requestkey='drugInsertSource']")) {
                                $("[requestkey='drugInsertSource'] option:selected").removeAttr("selected");
                                $("[requestkey='drugInsertSource'] option:first-child").attr("selected", "selected");

                            }
                            else if (filter.is("input[type='radio']")) {
                                $("input[requestkey='" + filter.attr("requestkey") + "'][value='" + filter.attr("value") + "']").removeAttr("checked").parent().removeClass("checked")
                            }
                            historylist.remove();
                            $this.hideClearAndSaveIfNoTags();
                            $this.createHistory().getTableData().getFilterData();
                        }
                    })(_this[i], historylist));
                    history.append(historylist);
                }
            }
        }
        var keyword = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        if (keyword) {
            var sratchTitle = $(".sratchTitle").text();
            var historylist = $('<span class="tag" requestkey="keyword" requestvalue="' + keyword + '" title="' + sratchTitle + ':' + keyword + '" ><span>' + sratchTitle + ":&nbsp" + keyword + '</span><a class="tagsinput-remove-link closeTag"></a></span>');
            historylist.find(".closeTag").bind("click", (function (historylist) {
                return function () {
                    $(".searchInput").val("");
                    historylist.remove();
                    $this.hideClearAndSaveIfNoTags();
                    $this.createHistory().getTableData().getFilterData();
                }
            })(historylist));
            history.append(historylist);
        }
        this.hideClearAndSaveIfNoTags();
        return this;
    },
    pageDataHander: function (rows, page) {
        $(".count").html(facetsSearch.formatNumber(parseInt($("#recount").val())))
        this.createPage(parseInt($("#recount").val()), page, rows);
    },
    createPage: function (totalNum, currentPage, pageSize) {
        if (!totalNum) {
            $(".pageBox").html("");
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
        var pageBox = $(".pageBox").html("").html(_pageHtml + '</ul></div><div class="pagination"><ul><li class="pagination-input"><input type="number" min="1" value="" placeholder="..." class="form-control flat input-sm customPage"></li><li totalpage="' + _totalPage + '">&nbsp;&nbsp;' + facetsSearch.formatNumber(_totalPage) + '&nbsp;&nbsp;</li> <li class="next"><a href="javascript:void(0)" class="icon-arrow-right3 pageGo">&nbsp;&nbsp;GO</a></li></ul></div>');
        this.setCount(totalNum);
        this.setPageEventListener(pageBox.find(".pageGo"), pageBox.find("a[pageid]").parent("li"));
    },
    setCount: function (totalNum) {
        $(".count").html("").html(facetsSearch.formatNumber(totalNum) + "").attr("totalNum", totalNum);
    },
    setPageEventListener: function (pageGo, pageid, tableSelector) {
        var _this = this, pageBox = $(".pageBox");
        pageGo.click(function () {
            _this.getTableData(undefined, undefined, facetsSearch.page());
        });
        pageid.click(function () {
            if ($(this).hasClass("prevPage")) {
                curLink = pageBox.find(".active").prev();
            } else if ($(this).hasClass("nextPage")) {
                curLink = pageBox.find(".active").next();
            } else {
                curLink = $(this);
            }
            curLink.addClass("active").siblings().removeClass("active");

            _this.getTableData(undefined, undefined, facetsSearch.page());
        });
    },
    setInputEventListener: function () {
        var inputObj = { inputBtn: ".searchBtn", inputText: ".searchInput" }, inputButton = inputObj.inputBtn, inputText = inputObj.inputText, dictionaryKey = inputObj.dictionary, requestKey = inputObj.requestKey, _this = this;
        if (inputButton && inputText) {
            function createSearchTag() {
                if ($(".searchInput").val().trim()) {
                    _this.getTableData().getFilterData();
                }
            }
            $(inputButton).bind("click", createSearchTag);
            $(inputText).bind("keydown", function (e) {
                if (e.keyCode == 13) {
                    this.blur();
                    createSearchTag();
                }
            });
        }
        //autocomplete
        $(".searchInput").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/Product/GetKeywordInfo",
                    dataType: "json",
                    data: {
                        keyword: request.term.stripscript()
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                value: item.keyword
                            }
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                $(".searchInput").val(ui.item.value);
            }
        });
    },
    //When there is no tags, Clear and Save buttons shouldn’t be displayed.
    hideClearAndSaveIfNoTags: function () {
        if ($('.tagsinput>.tag').length) {
            $('.oprateTags').removeClass('hide');
            $('#tagsinput').removeClass('hide');
            $('#trackBell').removeClass('hide');  //registration
        }
        else {
            $('.oprateTags').addClass('hide');
            $('#tagsinput').addClass('hide');
            $('#trackBell').addClass('hide');  //registration
        }
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
            _this.getTableData().getFilterData();
        });
    },
    setFilterSlideListener: function () {

        function slideToggle(e) {
            $(this).parent().toggleClass("opened").children("ul.submenu-nav").slideToggle();
            e.stopPropagation();
        }
        $(".sidebar-menu a.phm").unbind("click").click(slideToggle);
    },
    setOptionColumnLinstener: function (optionColumnUrl) {
        var _this = this, url = "/OptionalColum/" + optionColumnUrl;
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
            $.ajax({
                url: url,
                type: "post",
                async: false,
                dateType: "json",
                data: { modelID: _this.parameter.saveSearch.optionColumnsModuleId },
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
                data: { modelID: _this.parameter.saveSearch.optionColumnsModuleId, optionalColums: JSON.stringify(paramStr) },
                success: function () {
                    $("#TableOptionModal [data-dismiss='modal']").click();
                    _this.getTableData();
                }
            });
        });
    },
    setAddSaveSearchListener: function () {
        var $this = this;
        $("#saveTag").click(function () {
            $("#AdvancedSaveModal .modal-body").html('<div class="controls"><input type="text" id="saveText" class="form-control"></div>');
            $("#AdvancedSaveModal .modal-footer").html('<button type="button" class="btn btn-link" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="saveBtn">Save</button>');
            if (!$(".tagsinput>.tag").length) {
                $("#AdvancedSaveModal .modal-body").html("filter can not be empty!!");
                $("#AdvancedSaveModal .modal-footer").html('<button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>');
            } else {
                var param = $this.getSaveSearchParam();
                $("#saveText").keyup(function () {
                    var saveName = $('#saveText').val().trim();
                    if (saveName != "" && saveName.length < 100) {
                        $('#saveText').parent().removeClass('has-warning');
                    } else {
                        $('#saveText').parent().addClass('has-warning');
                    }
                })
                $('#saveBtn').click(function () {
                    param.saveName = $('#saveText').val().trim();
                    if (param.saveName == "" || param.saveName.length > 100) {
                        return false;
                    }
                    else {
                        $.ajax({
                            url: "/SaveSearch/AddSaveSearch",
                            type: "post",
                            async: true,
                            dateType: "json",
                            data: param,
                            success: function (flag) {
                                if (flag) {
                                    $("#AdvancedSaveModal .modal-body").html("Save success.");
                                    $("#AdvancedSaveModal .modal-footer").html('<button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>');
                                    $this.getSaveSearchData();
                                } else {
                                    $("#AdvancedSaveModal .modal-body").html("Save fail.");
                                    $("#AdvancedSaveModal .modal-footer").html('<button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>');
                                }
                            },
                            error: function () {
                                $("#AdvancedSaveModal .modal-body").html("Save fail.");
                                $("#AdvancedSaveModal .modal-footer").html('<button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>');
                            }
                        });
                    }
                })
            }
        });
    },

    //****************RecentSearch Strat**********************//
    addRecentSearch: function () {
        var _this = this,
             reqeustParam = this.getSaveSearchParam();
        $.ajax({
            url: "/RecentSearch/AddRecentSearch",
            type: "post",
            async: true,
            dateType: "json",
            data: reqeustParam,
            success: function () {
                _this.getRecentSearch();
            },
            global:false
        });
        return this;
    },
    //get RecentSearch
    getRecentSearch: function () {
        var _this = this,
             reqeustParam = this.getRequestParam();
        $.ajax({
            url: "/RecentSearch/GetRecentSearch",
            type: "post",
            async: true,
            dateType: "json",
            data: { moduleId: _this.parameter.saveSearch.savedsearchModuleId },
            success: function (particalView) {
                _this.createRecentSearch(particalView);
            },
            error: function () {
                //alert("数据获取失败");
            }
        });
        return this;
    },
    //cretae recentSearch
    createRecentSearch: function (json) {
        var saveSearch = $("#recentSearch");
        saveSearch.html(json);
        if ($("#recentSearch").is(".opened")) {
            $("#recentSearch").find("ul").addClass("visible")
        } else {
            $("#recentSearch").find("ul").removeClass("visible")
        }
        this.setRecentSearchListener();
    },
    //****************RecentSearch end**********************//
    //****************Amount start**********************//
    drawAmount: function () {
        var _this = this,
            AmountMin = parseInt($("#Amount").attr("amountmin")),
            AmountMax = parseInt($("#Amount").attr("amountmax")),
            AmountRangeStart = parseInt($("#Amount").attr("amountrangestart")),
            AmountRangeEnd = parseInt($("#Amount").attr("amountrangeend")),
            AmountCurrency = $("#Amount").attr("amountcurrency");
        _this.setInitMaxMin([AmountMin, AmountMax]);
        _this.setLanguage(AmountCurrency);
        if (AmountRangeStart != 0 && AmountRangeEnd != 0) {
            _this.setRange([AmountRangeStart, AmountRangeEnd]);
        }
        var Amount = [];
        Amount["min"] = AmountMin;
        Amount["max"] = AmountMax;
        _this.paymentRangeHander(Amount, AmountCurrency);
    },
    //Amount Rangedata Hander
    paymentRangeHander: function (stats, language) {
        var range = [];
        range.push(Math.ceil(stats && stats.min || 0));
        range.push(Math.floor(stats && stats.max || 0));
        this.createPaymentRange(range, language);
    },
    //create Amount Range
    createPaymentRange: function (rangeData, language) {
        var _this = this, nowRange = _this.getRange() || rangeData, rangeFather = $('<div class="checkbox_list range"></div>');
        // _this.setInitMaxMin(rangeData);
        if (!$("#Amount").find(".range").length) {
            $("#Amount").append(rangeFather);
        }
        rangeFather.html('<div id="slider-range" style="margin:10px 20px 0;float:left;position:relative;width:' + (rangeFather.innerWidth() - 40) + 'px;" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"></div><span class="range-amount"></span>');
        if (language == "USD") {
            _this.sliderObj = $("#facetsSearch #Amount #slider-range").slider({
                orientation: "horizontal",
                range: true,
                min: _this.getInitMaxMin()[0],
                max: _this.getInitMaxMin()[1],
                values: nowRange,
                slide: function (event, ui) {
                    $("#facetsSearch #Amount .range-amount").html("<span class='ui-slider-value first'>" + "$" + facetsSearch.formatNumber(ui.values[0]) + "</span><span class='ui-slider-value laset'> $" + facetsSearch.formatNumber(ui.values[1])) + "</span>";
                },
                stop: function (event, ui) {
                    _this.setRange(ui.values);
                    //  _this.setRangeEventListener(ui.values[0], ui.values[1], rangeData[0], rangeData[1], language);
                    _this.getTableData().getFilterData().addRecentSearch();
                }
            });
            $("#facetsSearch .range-amount").html("<span class='ui-slider-value first'>" + "$" + facetsSearch.formatNumber(nowRange[0]) + "</span><span class='ui-slider-value laset'>$" + facetsSearch.formatNumber(nowRange[1])) + "</span>";
        } else {
            _this.sliderObj = $("#facetsSearch #Amount #slider-range").slider({
                range: true,
                min: _this.getInitMaxMin()[0],
                max: _this.getInitMaxMin()[1],
                values: nowRange,
                slide: function (event, ui) {
                    $("#facetsSearch #Amount .range-amount").html(" ").html("<span class='ui-slider-value first'>" + facetsSearch.formatNumber(ui.values[0]) + "</span><span class='ui-slider-value laset'> " + facetsSearch.formatNumber(ui.values[1])) + "</span>";
                },
                stop: function (event, ui) {
                    _this.setRange(ui.values);
                    //  _this.setRangeEventListener(ui.values[0], ui.values[1], rangeData[0], rangeData[1], language);
                    _this.getTableData().getFilterData().addRecentSearch();
                }
            });
            $("#facetsSearch #Amount .range-amount").html(" ").html("<span class='ui-slider-value first'>" + facetsSearch.formatNumber(nowRange[0]) + "</span><span class='ui-slider-value laset'>" + facetsSearch.formatNumber(nowRange[1])) + "</span>";
        }
        if ($("#Amount").attr("amountrangestart") == "0" && $("#Amount").attr("amountrangeend") == "0") {
            _this.setRangeEventListener($("#Amount").attr("amountrangestart"), $("#Amount").attr("amountrangeend"), _this.getInitMaxMin()[0], _this.getInitMaxMin()[1], _this.getLanguage())
        } else {
            _this.setRangeEventListener($("#Amount").attr("amountrangestart"), $("#Amount").attr("amountrangeend"), _this.getInitMaxMin()[0], _this.getInitMaxMin()[1], _this.getLanguage())
        }

    },
    //set Amount Range change 
    setRangeEventListener: function (min, max, startMin, startMax, language) {
        var history = '', _this = this;
        if (min == "0" && max == "0") {
            $(".tagsinput .tag[requestkey='Amount']").remove();
        } else {
            if (language == "USD") {
                history = '<span class="tag bodyFilter" requestkey="Amount" requestvalue="$' + facetsSearch.formatNumber(min) + ' - $' + facetsSearch.formatNumber(max) + '" title="' + $("#Amount").attr("titleval") + ':$' + facetsSearch.formatNumber(min) + ' - $' + facetsSearch.formatNumber(max) + '"><span>' + $("#Amount").attr("titleval") + ': $' + facetsSearch.formatNumber(min) + ' - $' + facetsSearch.formatNumber(max) + '</span><a class="tagsinput-remove-link closeTag"></a></span>';
            } else {
                history = '<span class="tag bodyFilter" requestkey="Amount" requestvalue="' + facetsSearch.formatNumber(min) + ' - ' + facetsSearch.formatNumber(max) + '" title="' + $("#Amount").attr("titleval") + ' : ' + facetsSearch.formatNumber(min) + ' - ' + facetsSearch.formatNumber(max) + '"><span>' + $("#Amount").attr("titleval") + ' : ' + facetsSearch.formatNumber(min) + ' - ' + facetsSearch.formatNumber(max) + '</span><a class="tagsinput-remove-link closeTag"></a></span>';
            }
            var range = $(history);
            range.find(".closeTag").bind("click", function () {
                $(this).parent().remove();
                _this.setRange(null);
                _this.hideClearAndSaveIfNoTags();
                _this.getTableData().getFilterData();
            })
            $(".tagsinput .tag[requestkey='Amount']").remove();
            $(".tagsinput").append(range);
        }
    },
    //********************Amount end*************************//
    setExportListener: function () {
        var _this = this;
        $("#export").click(function () {
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var searchCount = parseInt($("#recount").val());
            if (parseInt(validCountJson) > 0 && searchCount <= parseInt(validCountJson)) {
                window.location.href = _this.parameter.ExportURL + "?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + searchCount;
            } else if (parseInt(validCountJson) > 0 && searchCount > parseInt(validCountJson)) {
                var alterInfo = "You have selected " + searchCount + " lines of data to export. GBI terms and conditions allow up to 500 lines of data to be exported per day. You have exported " + (500 - parseInt(validCountJson)).toString() + " lines of data within the last 24 hours. Are you sure you want to export the first " + validCountJson + " data records";
                var statu = confirm(alterInfo);
                if (!statu) {
                    return false;
                } else {
                    window.location.href = _this.parameter.ExportURL + "?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + validCountJson;
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
};

facetsSearch.prototype.init.prototype = facetsSearch.prototype;
facetsSearch.page = function () {
    var Cpage = $(".tabCon>div").not(".hide").find(".pageBox .customPage");
    if (Cpage.length > 0) {
        if (Cpage.val()) {
            page = (parseInt(Cpage.val()) <= parseInt(Cpage.parent().parent().find(".next").prev().attr("totalpage"))) ? Cpage.val() : Cpage.parent().parent().find(".next").prev().attr("totalpage")
        } else {
            page = $(".tabCon>div").not(".hide").find(".active > a").attr("pageid") || 1;
        }
    } else {
        if ($(".pageBox .customPage").val()) {
            page = (parseInt($(".pageBox .customPage").val()) <= parseInt($(".next").prev().attr("totalpage"))) ? $(".pageBox .customPage").val() : $(".next").prev().attr("totalpage")
        } else {
            page = $(".pageBox .active > a").attr("pageid") || 1;
        }
    }
    return page;
}

facetsSearch.formatNumber = function (num) {
    var b = parseInt(num).toString();
    var len = b.length;
    if (len <= 3) { return b; }
    var r = len % 3;
    return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
}
facetsSearch.isEmptyObject = function (obj) {
    for (var name in obj) {
        return true;
    }
    return false;
}
facetsSearch.cloneObj = function (obj) {
    var objClone = new obj.constructor();
    for (var key in obj) {
        if (objClone[key] != obj[key]) {
            if (typeof (obj[key]) == 'object') {
                objClone[key] = facetsSearch.cloneObj(obj[key]);
            } else {
                objClone[key] = obj[key];
            }
        }
    }
    if (!objClone || ('' + objClone) == '') {
        return (new String(obj) + objClone) ? obj : objClone;
    } else {
        objClone.toString = obj.toString;
        return objClone;
    }
}
/*
    11/7/2014 To 2014-11-7
**/
facetsSearch.TimeToDate = function (timeStr) {
    var timeStr = timeStr, timeStr = timeStr.split("/").map(function (i, e) {
        return parseInt(i);
    });
    return timeStr.length ? timeStr[2] + "-" + timeStr[0] + "-" + timeStr[1] : "";
}
/*
      2014-11-7 To  11/7/2014
**/
facetsSearch.DateToTime = function (timeStr) {
    var timeStr = timeStr, timeStr = timeStr.split("-").map(function (i, e) {
        return parseInt(i);
    });
    return timeStr.length ? timeStr[2] + "/" + timeStr[0] + "/" + timeStr[1] : "";
}
//facetsSearch.UTCToLocal = function (date) {
//    var dateObj = new Date(),
//        timeOffset = dateObj.getTimezoneOffset();
//    dateObj.setTime(date.getTime() + timeOffset);
//    return dateObj;
//}

Array.prototype.unique = function () {
    var n = {}, r = []; //n为hash表，r为临时数组
    for (var i = 0; i < this.length; i++) //遍历当前数组
    {
        if (!n[this[i]]) //如果hash表中没有当前项
        {
            n[this[i]] = true; //存入hash表
            r.push(this[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
}
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
}

String.prototype.stripscript = function () {//防注入
    var pattern = new RegExp("[`~!@#$^&*()=|{}';',\\[\\]<>?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < this.length; i++) {
        rs = rs + this.substr(i, 1).replace(pattern, '');
    }
    return rs;
}
function UnixToDate(unixTime, isFull, timeZone) {
    if (typeof (timeZone) == 'number')
    {
        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime * 1000);
    var ymdhis = "";
    ymdhis += time.getUTCMonth() + "/";
    ymdhis += (time.getUTCDate()+1) + "/";
    ymdhis += time.getUTCFullYear();
    if (isFull === true)
    {
        ymdhis += " " + time.getUTCHours() + ":";
        ymdhis += time.getUTCMinutes() + ":";
        ymdhis += time.getUTCSeconds();
    }
    return ymdhis;
}
function date_translate(date) {
    var date_array = date.split('-');
    return date_array[1] + '/' + date_array[2] + '/' + date_array[0];
}
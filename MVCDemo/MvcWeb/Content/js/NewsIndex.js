facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.parameter.tab = $(".card-tabs>.nav-tabs>li.active");
        _this.parameter.dataTab = $(".newsList>div>label.active");
        _this.parameter.tabContainer = $(".card>.row").eq(_this.parameter.tab.index());
        _this.parameter.tabContent = $(_this.parameter.tableContainer).eq(_this.parameter.tab.index());
        _this.parameter.tabCount = _this.parameter.tab.find(".count");
        _this.parameter.pageSize = 20;
        this.pageInit();
        this.setInputEventListener();  //Input框事件
        this.setBooleanSaerchListener();    //booleanSearch  事件
        this.BooleanSearchEventListener();    //booleanSearch按钮点击事件
        this.getCountryData();
        this.setStoreUpListener();    //  clearTag点击事件
        this.setAddSaveSearchListener();   //增加saveSearch事件
        this.setFilterSlideListener();   //filterslider事件
        this.setTabListener();   //tab点击事件
        this.setDataTabListener();   //subTab点击事件
        this.setTrendingTopicsListener();   //trendTopic点击事件
        this.createFilter();   //创建filter
        this.setNewsSubscriptListener($(".news"));  //页面spoolish点击
        this.pageDataHander(_this.parameter.pageSize, 1);   //分页
        this.createHistory();    //创建历史tag
        this.setExceedLimitListener();  //upgrade限制条数
        UTCToLocal($(".news"));  //转换UTC时间
        this.setExportListener();
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
        //$.ajax({
        //    url: '/News/GetUserUpgradeInfo',
        //    type: "post",
        //    async: true,
        //    dateType: "json",
        //    success: function (data) {
        //        $("form#upgrade").html(data)
        //    }
        //});
    },
    //获取页面参数
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked:not('.noeinfilter')>input,#facetsSearch #publicationDate input,#facetsSearch #formulation select"),
                param = {}, paramStr = [],
                 booleanSearchId = $("#booleanSearchTag .booleanSearchTag"), booleanSearch = [],
                keywordTag;
        filters.each(function (i, e) {
            if ($(e).attr("requestkey") == "interval") {
                param[$(e).attr("parentkey")] = param[$(e).attr("parentkey")] ? param[$(e).attr("parentkey")] : [];
                if ($(e).is(".startDate")) {
                    var timeStr = $(e).val();
                    param[$(e).attr("parentkey")][0] = timeStr.length ? LocalToUTC(timeStr) : "";
                } else {
                    var timeStr = $(e).val();
                    timeStr = timeStr + " 23:59:59";
                    param[$(e).attr("parentkey")][1] = timeStr.length ? LocalToUTC(timeStr) : "";
                }
                if (!param[$(e).attr("parentkey")][0] && !param[$(e).attr("parentkey")][1]) {
                    delete param[$(e).attr("parentkey")];
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
        if ($('#dropdownMenu1 .country-name').data('id')) {
            param['country'] =[$('#dropdownMenu1 .country-name').data('id')];
        }
        /*********获取booleanSearch的参数**************/
        var booleanItem = [];
        booleanSearchId.each(function () {
            var $_this = $(this), booleanSecondItem = [];
            $_this.find("span.tag").each(function (index) {
                var $_that = $(this), bind = "", name = "", operator = "", value = "", tag = {};
                if (index == 0) {
                    tag["bind"] = "";
                } else {
                    tag["bind"] = $_that.attr("bind").trim();
                }
                tag["name"] = $_that.attr("name").trim();
                tag["value"] = $_that.attr("value").trim();
                booleanSecondItem.push(tag);
            })
            booleanItem.push(booleanSecondItem);
        })
        /***********************/
        json["filter"] = facetsSearch.isEmptyObject(param) ? JSON.stringify(param) : "";
        //edl-project
        var edlProject = {};
        var edlProjectCon = $("#facetsSearch .checkbox.noeinfilter.level1>input");
        edlProjectCon.each(function () {
            var _this = $(this);
            if (_this.parent().is(".checked")) {
                edlProject[_this.val()] = [];
            } else {
                var level2 = _this.parent().next().find(".checkbox.checked");
                if (level2.length) {
                    edlProject[_this.val()] = [];
                    level2.each(function () {
                        var leve2_this = $(this).find("input").val();
                        edlProject[leve2_this].push(leve2_this);
                    })
                }
            }
        })
        json["extra"] = facetsSearch.isEmptyObject(edlProject) ? JSON.stringify(edlProject) : ""
        // json["booleanSearch"] = facetsSearch.isEmptyObject(booleanItem) ? JSON.stringify(booleanItem) : "";
        json["booleanSearch"] = "";
        //json["page"] = $(".card.news > div:not(.hide)").find(".pageBox .customPage").val() || $(".card.news > div:not(.hide)").find(".pageBox .active > a").attr("pageid") || 1;
        json["page"] = 1;
        json["keyword"] = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        json["newsType"] = this.parameter.tab.attr("type");
        json["dataType"] = this.parameter.dataTab.attr("type") || "";
        return json;
    },
    getSaveSearchParam: function () {
        var json = {},
            filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch input.date,#facetsSearch #formulation select"),
            param = {}, paramStr = [], paramStrFor, paramStrDate,
            keywordTag, keyword = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        filters.each(function (i, e) {
            if ($(e).attr("requestkey") == "interval") {
                param[$(e).attr("parentkey")] = param[$(e).attr("parentkey")] ? param[$(e).attr("parentkey")] : [];
                if ($(e).is(".startDate")) {
                    var timeStr = $(e).val();
                    param[$(e).attr("parentkey")][0] = timeStr.length ? LocalToUTC(timeStr) : "";
                } else {
                    var timeStr = $(e).val();
                    timeStr = timeStr + " 23:59:59";
                    param[$(e).attr("parentkey")][1] = timeStr.length ? LocalToUTC(timeStr) : "";
                }
                if (!param[$(e).attr("parentkey")][0] && !param[$(e).attr("parentkey")][1]) {
                    delete param[$(e).attr("parentkey")];
                }
            } else {
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
        var newsActive = this.parameter.tab, dataActive = this.parameter.dataTab;
        param["newsType"] = [newsActive.attr("type")];
        param["dataType"] = [dataActive.attr("type")];
        var count;
        if (this.parameter.tab.index() == 0) {
            count = $("div[type='news'] label.active").find(".count")
        } else {
            count = $("div[type='rawNews'] label.active").find(".count")
        }
        return { saveName: paramStr.join(" + "), moduleId: this.parameter.saveSearch.savedsearchModuleId, searchFilter: JSON.stringify(param), resultCount: count.attr("resultcount") };
    },
    setExceedLimitListener: function () {
        var targetUrl = '', option;

        /****Subscribe 订阅***/
        $.ajax({
            url: '/News/GetUserUpgradeInfo',
            type: "post",
            async: true,
            dateType: "json",
            success: function (data) {
                $("form#upgrade").html(data)
            }
        });


        $(".exceedLimit").unbind('click').bind('click', function () {
            var newsID = $(this).attr("newsid"),
                newstype = $(this).attr("newstype");
            isFromReport = $(this).attr("isfromreport") == "1";   //isfromreport  1 means true
            targetUrl = $(this).attr("targeturl");
            $("#slide1").css("display", "block");
            $("#slide2").css("display", "none").find("label.checkbox").removeClass("checked");
            $("#slide3").css("display", "none");
            $.ajax({
                url: '/News/CheckFreeLimit',
                type: "post",
                async: true,
                dateType: "json",
                data: { newsID: newsID, newsType: newstype, isFromReport: isFromReport },
                success: function (limitNum) {
                    option = limitNum.Flag;
                    if (option && limitNum.RemainingLimit == 5) {
                        $("#ExceedModal").modal('show');
                        $("#laterBtn").removeClass("hide");
                    } else if (!option) {
                        $(".limitNum").text('0');
                        $("#ExceedModal").modal('show');
                        $("#laterBtn").addClass("hide");
                    } else {
                        window.open(targetUrl);
                    }
                }
            });
        });

        $(".interestedIn label.checkbox").unbind('click').bind('click', function (e) {
            if ($(this).hasClass("checked")) {
                $(this).removeClass("checked").find("input").removeAttr("checked");
            } else {
                $(this).addClass("checked").find("input").attr("checked", "checked");
            }
            e.stopPropagation();
            return false;
        })
        $("#laterBtn").unbind('click').bind('click', function () {
            location.href = targetUrl;
        })
    },
    setTabShow: function (newsType) {
        var tab = $(".card-tabs>.nav-tabs>li[type='" + newsType + "']");
        tab.addClass("active").siblings().removeClass("active").find(".count").text("").attr("totalnum", "");
        if (newsType == "raw") {
            $("#facetsSearch #type,#facetsSearch #categorie,#facetsSearch #spotlight").each(function () {
                $(this).parents("li").eq(1).hide();
            })
        } else {
            $("#facetsSearch #type,#facetsSearch #categorie,#facetsSearch #spotlight").each(function () {
                $(this).parents("li").eq(1).show();
            })
        }
        $(".card>.row").eq(tab.index()).removeClass("hide").siblings().addClass("hide");
    },
    getTableData: function (filter, param) {
        var _this = this,
            reqeustParam = $.extend(this.getRequestParam(filter), param);
        _this.setTabShow(reqeustParam["newsType"]);
        $.ajax({
            url: "/News/GetNewsList",
            type: "post",
            async: true,
            dateType: "json",
            data: reqeustParam,
            success: function (partialView) {
                _this.parameter.tabContent.html(partialView);
                UTCToLocal(_this.parameter.tabContent);
                _this.setNewsSubscriptListener();
                _this.pageDataHander(_this.parameter.pageSize, reqeustParam.page);
                _this.setOrderHeader();
                _this.setBookMarkListener(_this.parameter.tabContent);
                _this.setExceedLimitListener();
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
                //UTCToLocalVal($("#facetsSearch"));
                _this.setFilterSlideListener();
                _this.createFilter();
                _this.createHistory();
                _this.getCountryData();
                $(window).resize();
            },
        global: false
        });
        return this;
    },
    //country-template   by angie
    getCountryData: function(){
        var _this = this;
        var data = {};
        data.country_data = [];
        if(!$('#country .checkbox:not(.disabled) > input').length){
            $('#dropdownMenu1').addClass('disabled');
            return;
        }
        $('#dropdownMenu1').removeClass('disabled');
        $('#country .checkbox:not(.disabled) > input').each(function(){
            var _json = {};
            _json['id'] = $(this).attr('value');
            _json['showvalue'] = $(this).attr('showvalue');
            data.country_data.push(_json);
            
        });
        if (!data.length) {
            $('#dropdownMenu1 .country-name').text('Multicountry').data('id', '')
        }
        $('#country-template li:not(:first)').remove();
        $('#country-template').append(template('country-list-template', data));
        $('#country-template li a').on('click', function () {
            $('#dropdownMenu1 .country-name').text($(this).text()).data('id', $(this).data('id'));
            _this.getFilterData().getTableData();
        });
        if($('#dropdownMenu1 .country-name').text() == 'Multicountry'){
            $('#dropdownMenu1 .country-name').data('id', '');
        }
    },
    setBookMarkListener: function (elm) {
        elm.find(".icon-bookmark2").bind('click', function () {
            var _this = $(this),
               bookmarkid = _this.attr("bookmarkid"),
               bookmarktype = _this.attr("bookmarktype"),
               bookmarklink = _this.attr("bookmarklink");
            bookMark(bookmarktype, bookmarkid, bookmarklink, $(this))
        })
    },
    setSaveSearchListener: function () {
        var _this = this, filter = $("#facetsSearch"), checked = [];
        $("#saveSearch>ul a").click(function () {
            var paramStr = $(this).attr("data");
            $("#facetsSearch").find(".checkbox").removeAttr("checked", "checked").closest(".checkbox").removeClass("checked");
            var obj = $.parseJSON(paramStr), param = { filter: {}, newsType: null };
            for (var i = 0, len = obj.length; i < len; i++) {
                if (obj[i]["Key"] == "keyword") {
                    $(".searchInput").val(obj[i]["Value"]);
                } else if (obj[i]["Key"] == "newsType") {
                    param[obj[i]["Key"]] = obj[i]["Value"][0];
                } else if (obj[i]["Key"] == "dataType") {
                    param[obj[i]["Key"]] = obj[i]["Value"][0];
                } else if (obj[i]["Key"] === "type" || obj[i]["Key"] === "sub-type") {
                    for (var j = 0, len1 = obj[i]["Value"].length; j < len1; j++) {
                        $("#facetsSearch").find(".checkbox.noeinfilter").find("input[requestkey = " + obj[i]["Key"] + "][value = " + obj[i]["Value"][j] + "]").attr("checked", "checked").closest(".checkbox").addClass("checked")
                    }
                } else {
                    $(".searchInput").val("");
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                }
            }
            $('input.date').each(function () {
                var _this = $(this);
                var key = _this.attr('parentkey');
                if(param.filter[key]){
                    if (_this.is('.startDate')) {
                        _this.val(param.filter[key][0] ? UnixToDate(param.filter[key][0] / 1000) : '');
                        var _maxDate = param.filter[key][1] ? UnixToDate(param.filter[key][1] / 1000) : '';
                        _this.datepicker('option', 'maxDate', _maxDate);

                    } else {
                        _this.val(param.filter[key][1] ? UnixToDate(param.filter[key][1] / 1000) : '');
                        var _minDate = param.filter[key][0] ? UnixToDate(param.filter[key][0] / 1000) : '';
                        _this.datepicker('option', 'minDate', _minDate);
                    }
                }
                
            });
            param["filter"] = JSON.stringify(param["filter"]);
            if (param["newsType"]) {
                _this.parameter.tab = $(".card-tabs>.nav-tabs>li[type='" + param["newsType"] + "']");;
                _this.parameter.tabContainer = $(".card>.row").eq(_this.parameter.tab.index());
                _this.parameter.tabContent = $(_this.parameter.tableContainer).eq(_this.parameter.tab.index());
                _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
                _this.parameter.tabCount = _this.parameter.tab.find(".count");
            }
            _this.getFilterData("", param).getTableData("", param);
            // _this.createHistory();   //由于getFilterData方法中_this.createHistory();被注释了，原因不明，这里单独加上
        });
        $("#saveSearch>a.phm").click(function (e) {
            $(this).parent().toggleClass("opened").children("ul.submenu-nav").slideToggle();
            e.stopPropagation();
        });
    },
    pageDataHander: function (rows, page) {
        this.createPage(parseInt($(".news>div").not(".hide").find("label.active>small>i").attr("resultcount")), page, rows);
    },
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        })
        this.setFilterEventListener("#spotlight");
        this.setFilterEventListener("#type");
        this.setFilterEventListener("#categorie");
        this.setFilterEventListener("#industry");
        this.setFilterEventListener("#country");
        this.setFilterEventListener("#publicationDate");
    },
    setTabListener: function () {
        var _this = this;
        $(".card-tabs>.nav-tabs>li").click(function () {
            var type = $(this).attr("type");
            _this.parameter.tab = $(this);
            _this.parameter.dataTab = $(".newsList>div>label").eq(0);
            _this.parameter.tabContainer = $(".card>.row").eq(_this.parameter.tab.index());
            _this.parameter.tabContent = $(_this.parameter.tableContainer).eq(_this.parameter.tab.index());
            _this.parameter.tabCount = _this.parameter.tab.find(".count");
            _this.getFilterData("", { page: 1 }).getTableData("", { page: 1 });
        });
    },
    setDataTabListener: function () {
        var _this = this;
        $(".newsList>div>label").live("click", function () {
            var type = $(this).attr("type");
            _this.parameter.dataTab = $(this);
            _this.parameter.tabContainer = $(".card>.row").eq(_this.parameter.tab.index());
            _this.parameter.tabContent = $(_this.parameter.tableContainer).eq(_this.parameter.tab.index());
            _this.parameter.tabCount = _this.parameter.tab.find(".count");
            _this.getTableData("", { page: 1 }).getFilterData("", { page: 1 });
        })
    },
    setTrendingTopicsListener: function () {
        var _this = this;
        $(".trendingTopics .tags a").live("click", function () {
            $(".searchInput").val($(this).text());
            _this.createHistory().getFilterData().getTableData();
        })
    },
    setNewsSubscriptListener: function (container) {
        (container || this.parameter.tabContent).find("a[requestkey][value]").click(function () {
            if ($(this).attr("requestkey") === "spotlight") {
                //level2 value = 1 hardcode
                var input = $("#facetsSearch").find(".level2").find("input[value='" + $(this).attr("value") + "']");
                if (!input.is(":checked")) {
                    input.parent().click();
                }
            } else {
                var input = $("#facetsSearch").find("input[requestkey='" + $(this).attr("requestkey") + "'][value='" + $(this).attr("value") + "']");
                if (!input.is(":checked")) {
                    input.parent().click();
                }
            }
        });
    },
    setCount: function (totalNum) {
        this.parameter.tabCount.html("").html(facetsSearch.formatNumber(totalNum) + "").attr("totalNum", totalNum);
    },
    setFilterEventListener: function (selector) {
        //news doesn't have recent Search,If news need recent search,remove this function
        var _this = this,
            parent = $("#facetsSearch " + selector),
            checkeds = parent.find(".checked"),
            showAll = $("#facetsSearch " + selector).find(".showAll");
        if (checkeds.length) {
            showAll.find("[name='show']").hide();
            showAll.find("[name='hide']").show();
        }
        showAll.bind('click', function () {
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
        $("#facetsSearch " + selector + " div.checkbox").unbind("click").bind('click', function (e) {
            if (!$(this).is(".disabled")) {
                var input = $(this).find(":checkbox"), siblingsCheck = $(this).parent().children(".checked");
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked").find("input").removeAttr("checked");
                    if ($(this).parent().is(".plm") && $(this).parent().children(".checkbox").length == siblingsCheck.length) {
                        $(this).parent().prev().removeClass("checked").find("input").removeAttr("checked");
                    }
                    _this.createHistory().getTableData().getFilterData();
                } else {
                    if(selector == '#country'){
                        $('#dropdownMenu1 .country-name').text('Multicountry').data('id', '');
                    }
                    $(this).addClass("checked").find("input").attr("checked", "checked").end().next(".plm").find(".checkbox").addClass("checked").find("input").attr("checked", "checked");
                    _this.createHistory().getTableData().getFilterData();
                }
            }
            e.stopPropagation();
        });
        $("#facetsSearch " + selector + ">label.radio").unbind("click").bind('click', function (e) {
            if (!$(this).is(".disabled")) {
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked");
                    _this.createHistory().getTableData().getFilterData();
                } else {
                    $(this).addClass("checked").siblings().removeClass("checked");
                    _this.createHistory().getTableData().getFilterData();
                }
            }
            return false;
        });
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
            $("#tagsinput").find("[requestkey='" + select.attr("requestkey") + "']").remove();
            _this.createHistory().getTableData().getFilterData();
        });

    },
    //page
    createPage: function (totalNum, currentPage, pageSize) {
        if (!totalNum) {
            $(".news>div").not(".hide").find(".pageBox").html("");
            return false;
        }
        var _curpage = parseInt(currentPage),
            _totalPage = Math.ceil(totalNum / pageSize),
            _showPages = 5,
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
        var pageBox = $(".news>div").not(".hide").find(".pageBox").html("").html(_pageHtml + '</ul></div><div class="pagination"><ul><li class="pagination-input"><input type="number" min="1" value="" placeholder="..." class="form-control flat input-sm customPage"></li><li totalpage="' + _totalPage + '">&nbsp;&nbsp;' + facetsSearch.formatNumber(_totalPage) + '&nbsp;&nbsp;</li> <li class="next"><a href="javascript:void(0)" class="icon-arrow-right3 pageGo">&nbsp;&nbsp;GO</a></li></ul></div>');
        this.setPageEventListener(pageBox.find(".pageGo"), pageBox.find("a[pageid]").parent("li"));
    },
    setPageEventListener: function (pageGo, pageid, tableSelector) {
        var _this = this, pageBox = $(".pageBox");
        pageGo.click(function () {
            var Inputpage = parseInt($(".card.news > div:not(.hide)").find(".pageBox .customPage").val()) || 1,
                maxPage = parseInt($(".card.news > div:not(.hide)").find(".next").prev().attr("totalpage").trim());
            var page = (Inputpage <= maxPage) ? Inputpage : maxPage;
            _this.getTableData("", { page: page });
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
            _this.getTableData("", { page: parseInt($(this).find("a").attr("pageid")) });
        });
    },

    /***************BooleanSearch****************/
    setBooleanSaerchListener: function () {
        var _this = this; booleanSearchCon = $("#booleanSearchBody");
        booleanSearchCon.find(".addBooleanSearch").live("click", function () {
            var booleanSearchHtml = $('<div class="row advancedsearch-line"><div class="col-sm-2"><select name="small" class="select-block multiple"><option value="And" selected="selected">And</option><option value="Or">Or</option><option value="Not">Not</option></select></div><div class="col-sm-8"><b><select name="form" class="select-block multiple"><option value="title">Title</option><option value="body">Body</option></select></b><b class="pvs phm">contains</b><b><input class="form-control input-sm" placeholder="Enter a term" type="text" value=""></b></div><div class="col-sm-2"><a href="javascript:;" class="mts pull-right"><span class="icon-plus-circle addBooleanSearch"></span></a><a href="javascript:;" class="mts pull-right"><span class="icon-minus-circle cutBooleanSearch"></span></a></div></div>');
            booleanSearchCon.append(booleanSearchHtml);
            booleanSearchHtml.find(".multiple").selectpicker({ style: 'btn-default', menuStyle: 'dropdown-inverse' });
        })
        booleanSearchCon.find(".cutBooleanSearch").live("click", function () {
            var _that = $(this), removeItem = _that.parent().parent().parent(".advancedsearch-line");
            removeItem.remove();
        })
        $("#booleanSearch").click(function () {
            $("#booleanSearchTag").css("display", "block");
            var booleanSearchData = _this.getBooleanSearchParam();
            _this.createBooleanSearchTag(booleanSearchData);

        });

        $("#AdvancedSearchModal .close").click(function () {
            var booleanSearchHtml = $('<div class="row advancedsearch-line"><div class="col-sm-2"></div><div class="col-sm-8"><b><select name="form" class="select-block multiple"><option value="title">Title</option><option value="body">Body</option></select></b><b class="pvs phm">contains</b><b><input class="form-control input-sm" type="text" placeholder="Enter a Term"></b></div><div class="col-sm-2"><a href="javascript:;" class="mts pull-right"><span class="icon-plus-circle addBooleanSearch"></span></a></div></div>')
            $("#booleanSearchBody").html("").append(booleanSearchHtml);
            booleanSearchHtml.find(".multiple").selectpicker({ style: 'btn-default', menuStyle: 'dropdown-inverse' });
        })
    },
    createBooleanSearchTag: function (booleanSearchData) {
        var _this = this;
        var tagHtml = '<div class="booleanSearchTag tag-group"><button type="button" class="close icon-times closeItem"></button>';
        for (var i = 0, len = booleanSearchData.length; i < len; i++) {
            if (booleanSearchData[i].bind) {
                tagHtml += '<i class="mls mrm">' + booleanSearchData[i].bind + '</i>'
            }
            if (booleanSearchData[i].bind == 'Not') {
                tagHtml += '<span class="tag tag-important"  bind="' + booleanSearchData[i].bind + '" value="' + booleanSearchData[i].value + '" name="' + booleanSearchData[i].name + '"><small class="text-lighter">' + booleanSearchData[i].name + ' : </small><span><del>' + booleanSearchData[i].value + '&nbsp;&nbsp;</del></span><a class="tagsinput-remove-link closeTag"></a></span>'
            } else {
                tagHtml += '<span class="tag"  bind="' + booleanSearchData[i].bind + '" value="' + booleanSearchData[i].value + '" name="' + booleanSearchData[i].name + '"><span><small class="text-lighter">' + booleanSearchData[i].name + ' : </small>' + booleanSearchData[i].value + '&nbsp;&nbsp;</span><a class="tagsinput-remove-link closeTag"></a></span>';
            }
        }
        tagHtml += '</div>'
        $("#booleanSearchTag").append($(tagHtml));
        _this.getTableData().getFilterData();
    },
    BooleanSearchEventListener: function () {
        var _this = this;
        $("#booleanSearchTag .closeTag").live("click", function () {
            if ($(this).parent().attr("bind")) {
                $(this).parent(".tag").prev().remove();
            } else {
                $(this).parent(".tag").next().remove();
            }
            $(this).parent(".tag").remove();
            $(".booleanSearchTag").each(function () {
                var _that = $(this);
                if (!_that.find(".tag").length) {
                    _that.remove();
                }
            })
            _this.getTableData().getFilterData();
        });

        $(".closeItem").live("click", function () {
            var $_that = $(this);
            $_that.parent().remove();
            _this.getTableData().getFilterData();
        })
    },
    getBooleanSearchParam: function () {
        var booleanSearchId = $("#booleanSearchBody"), booleanSearch = [];
        booleanSearchId.find(".advancedsearch-line").each(function (index) {
            var advancedsearchLine = {}, _that = $(this);
            if (index == 0) {
                advancedsearchLine["bind"] = "";
                _that.children("div:eq(1)").find("b").each(function (subIndex1) {
                    var _thata = $(this).find("select");
                    if (subIndex1 == 0) {
                        advancedsearchLine["name"] = _thata.val() || "";
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
                    } else if (subIndex2 == 2) {
                        _thatb = $(this).find("input");
                        advancedsearchLine["value"] = _thatb.val() || "";
                    }
                })

            }
            if (advancedsearchLine["value"]) {
                booleanSearch.push(advancedsearchLine);
            }
        });
        return booleanSearch;
    },
    /***************************/
    setExportListener: function () {
        var _this = this;
        $("#export").live('click', function () {
            var _freelayer = $('#freelayer').val();
            if (_freelayer != 'False') {
                alert("Export rights for this account type is disabled. GBI terms and conditions for trial users does not permit the export of data. To view the available account upgrade options, please visit the catalog.");
                return false;
            }
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var type = para["newsType"];
           // var searchCount = $("li[type=" + type + "]").parent().parents("div.card");
            var searchCount = $(".card.news > div:not(.hide) .newsList > div > label.active i.count").attr("resultcount");
            var href = "/News/ExportNews?keyword=" + para.keyword + "&filter=" + para.filter + "&newsType=" + para.newsType
            + "&extra=" + para.extra + "&booleanSearch=" + para.booleanSearch;
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
        tableUrl: "/News/GetNewsList",
        tableContainer: ".newsList",
        filterUrl: "/News/GetFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            savedsearchModuleId: 2,
        }
    });
});


jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    easeInQuint: function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }
})
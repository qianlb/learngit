facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.orderContainer = $("#orderHead");
        _this.parameter.tableContainer = $("#dealsList");
        _this.parameter.pageSize = 10;
        this.drawAmount();  //amount
        this.getSaveSearchData(); // saveSearch
        this.pageInit();
        this.setDealsSubscriptListener();
        this.setInputEventListener();    //Input search
        this.setFilterSlideListener();   //Filter event
        this.createFilter();  //create Filter
        this.createHistory();  //create tag
        this.pageDataHander(_this.parameter.pageSize, 1) //page
        this.setAddSaveSearchListener();  //addsavedSearch
        this.setStoreUpListener(); //clearTag
        this.setOrderHeader();  //order
        this.getRecentSearch(); //recentSearch
        this.setExportListener(); // 2015-8-25 by Aaron
        return this;
    }, 
    //get RequestParam
    getRequestParam: function () {
        var json = {},
            filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,#facetsSearch #statusDate input,#facetsSearch #announceDate input,#facetsSearch #formulation select,#facetsSearch #Amount"),
            param = {},
            paramStr = [],
            keywordTag;
        _this = this;
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
            else if ($(e).attr("requestkey") == "Amount") {
                var InitMaxMin = _this.getInitMaxMin(), Range = _this.getRange();
                if (InitMaxMin && Range) {
                    if (InitMaxMin[0] != Range[0] || InitMaxMin[1] != Range[1]) {
                        param["Amount"] = param["Amount"] ? param["Amount"] : [];
                        param["Amount"][0] = _this.getRange()[0];
                        param["Amount"][1] = _this.getRange()[1];
                    }
                }
            }
            else {
                if ($(e).val()) {
                    var key = $(e).attr("requestkey");
                    param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
                }
            }
        });
        //page
        //page
        //if ($(".pageBox .customPage").val()) {
        //    json["page"] = (parseInt($(".pageBox .customPage").val()) <= parseInt($(".next").prev().attr("totalpage"))) ? $(".pageBox .customPage").val() : $(".next").prev().attr("totalpage")
        //} else {
        //    json["page"] = $(".pageBox .active > a").attr("pageid") || 1;
        //}
        json["filter"] = facetsSearch.isEmptyObject(param) ? JSON.stringify(param) : "";
        json["keyword"] = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        json["order"] = this.order.orderAt ? "{\"" + this.order.orderAt + "\":\"" + this.order.filed + "\"}" : "";
        return json;
    },
    getSaveSearchParam: function () {
        var json = {},
            filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,#facetsSearch #statusDate input,#facetsSearch #announceDate input,#facetsSearch #formulation select,#facetsSearch #Amount"),
            param = {}, paramStr = [], paramStrFor, paramStrDate,
            keywordTag, keyword = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
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
            else if ($(e).attr("requestkey") == "Amount") {
                var InitMaxMin = _this.getInitMaxMin(), Range = _this.getRange();
                if (InitMaxMin && Range) {
                    if (InitMaxMin[0] != Range[0] || InitMaxMin[1] != Range[1]) {
                        param["Amount"] = param["Amount"] ? param["Amount"] : [];
                        param["Amount"][0] = _this.getRange()[0];
                        param["Amount"][1] = _this.getRange()[1];
                        if (_this.getLanguage() == "USD") {
                            paramStr.push("Amount:" + "$" + param["Amount"][0] + "-" + "$" + param["Amount"][1]);
                        } else {
                            paramStr.push("Amount:" + param["Amount"][0] + "-" + param["Amount"][1]);
                        }
                    }
                }
            }
            else {
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
        paramStrDate ? paramStr.push(paramStrDate) : "";
        return { saveName: paramStr.join(" + "), moduleId: this.parameter.saveSearch.savedsearchModuleId, searchFilter: JSON.stringify(param), resultCount: $(".count").attr("totalnum"), searchSaveMode: "1" };
    },
    setBookMarkListener: function (container) {
        container.find(".icon-bookmark2").bind('click', function () {
            var _this = $(this),
               bookmarkid = _this.attr("bookmarkid"),
               bookmarktype = _this.attr("bookmarktype"),
               bookmarklink = _this.attr("bookmarklink");
            bookMark(bookmarktype, bookmarkid, bookmarklink, $(this))
        })
    },
    setStoreUpListener: function () {
        var _this = this;
        $("#clearTag").click(function () {
            $(".oprateTags").addClass('hide');
            $(".tagsinput>.tag").remove();
            $("#facetsSearch .checkbox").removeClass("checked").find("input").removeAttr("checked");
            $("#facetsSearch label.radio").removeClass("checked").find("input").removeAttr("checked");
            $(".searchInput").val("");
            $("#facetsSearch .startDate,#facetsSearch .endDate").val("");
            $("#facetsSearch .startDate,#facetsSearch .endDate").datepicker("option" , {minDate: null, maxDate: null});
            _this.setRange(null);
            _this.getTableData().getFilterData();
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
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#dealType");
        this.setFilterEventListener("#dealStatus");
        this.setFilterEventListener("#dealBuyerType");
        this.setFilterEventListener("#dealTargetType");
        this.setFilterEventListener("#announceDate");
        this.setFilterEventListener("#statusDate");
    },
    //deals 的表头不放在particalview里
    setOrderHeader: function () {
        var order = this.order, _this = this,
        orderElm = $(this.parameter.orderContainer).find("[orderat='" + order.orderAt + "']");
        orderElm.addClass("active").siblings("th").removeClass("active")
        if (orderElm.length && order.filed === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
        } else if (orderElm.length && order.filed === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
        }
        var orderElms = $(this.parameter.orderContainer).find("[orderat]");
        orderElms.click(function () {
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
                _this.parameter.tableContainer.html(partialView);
                _this.setDealsSubscriptListener();
                _this.pageDataHander(_this.parameter.pageSize, jsonWithPage.page);
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
            url: "/Deals/GetDealsFilters",
            type: "post",
            async: true,
            dateType: "json",
            data: reqeustParam,
            success: function (partialView) {
                $("#filter-condition").children('li').not('.calendar-li').remove();
                $("#filter-condition").prepend(partialView);
                _this.drawAmount();
                _this.setFilterSlideListener();
                _this.createFilter();
                _this.createHistory();
                $(window).resize();
            },
            global: false
        });
        return this;
    },
    setDealsSubscriptListener: function (container) {
        (container || this.parameter.tableContainer).find("a[requestkey][value]").click(function () {
            var input = $("#facetsSearch").find("input[requestkey='" + $(this).attr("requestkey") + "'][value='" + $(this).attr("value") + "']");
            if (!input.is(":checked")) {
                input.parent().click();
            }
            return false;
        });
    },
    pageDataHander: function (rows, page) {
        $(".count").html(facetsSearch.formatNumber(parseInt($("#recount").val())))
        this.createPage(parseInt($("#recount").val()), page, rows);
    },
})

facetsSearch.prototype.init.prototype = facetsSearch.prototype

$(function () {
    var obj = facetsSearch({
        tableUrl: "/Deals/GetDealist",
        ExportURL: "/Deals/ExportDealsList",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            savedsearchModuleId: 4
        }
    })
})


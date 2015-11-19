facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.parameter.tab = $(".tenderingResultType > li.active");
        _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index()).children().eq(0);
       // _this.parameter.tabContent = $(_this.parameter.tableContainer).children().eq(0);
        _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
        this.setInputEventListener();    //input search
        this.setFilterSlideListener();   //filter events
        this.pageDataHander(_this.parameter.pageSize, 1);   //page
        this.setOptionColumnLinstener(_this.parameter.saveSearch.editchooseColumnUrl);   //OptionColumnLinstener
        this.setOrderHeader();   //order
        this.setStoreUpListener(); //clearTag
        this.setAddSaveSearchListener(); //addSaveSearch
        this.createFilter();  //createFliter
        this.createHistory();  // createHistory
        this.getRecentSearch();
        this.pageInit();
        this.setExportListener();
        this.setTenderingResultTypeListener();
        return this;
    },
    pageInit: function () {
        var _this = this;
        var savedSearchId = parseInt($("#savedSearchId").val());
        if (savedSearchId) {
            $("#saveSearch").find("a[savedsearchid = " + savedSearchId + "]").click();
        }
        if ($("#tab").val() === 'overview') {
            var filter = $("#filter").val();
            $(".tenderingResultType li[type='overview']").addClass("active").siblings().removeClass("active");
            _this.parameter.tableUrl = "/Tendering/GetResultByList";
            _this.parameter.saveSearch.optionColumnsModuleId = 41;
            _this.parameter.tab = $(".tenderingResultType > li[type='overview']");
            $(".tabCon>div").addClass("hide").eq(1).removeClass("hide");
            _this.parameter.tableContainer = $(".tabCon>div").eq(1).children().eq(0);
            _this.parameter.tabPage = $(".pageBox").eq(1);
            _this.order = { "filed": null, "orderAt": null };
            _this.getTableData(filter).getFilterData(filter);
        }
    },
    getRequestParam: function (filterCon) {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked:not('.noeinfilter')>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch #cdestatusdate input,#facetsSearch #formulation select"),
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
            } else {
                var key = $(e).attr("requestkey");
                param[key] ? param[key].push($(e).val()) : param[key] = [$(e).val()];
            }
        });
        $("#companyid").val() ? param["companyid"] = [$("#companyid").val()] : "";
        $("#year").val() ? param["year"] = [$("#year").val()] : "";
        $("#drug").val() ? param["drug"] = [$("#drug").val()] : "";
        $("#region").val() ? param["region"] = [$("#region").val()] : "";
        $("#tendertitle").val() ? param["title"] = [$("#tendertitle").val()] : "";
        //edl-project
        var edlProject = {};
        var edlProjectCon = $("#facetsSearch .checkbox.checked.noeinfilter>input");
        edlProjectCon.each(function () {
            var _this = $(this);
            if (_this.parent().is(".level1")) {
                    edlProject[_this.val()] = [];
            }

            if (_this.parent().is(".level2")) {
                var secondLevel = _this.closest(".plm").prev().find("input").val();
                edlProject[secondLevel].push(_this.val());
            }
        })
        json["edlproject"] = facetsSearch.isEmptyObject(edlProject) ? JSON.stringify(edlProject) : ""

        //page
        if (this.parameter.tabPage.find(".customPage").val()) {
            json["page"] = (parseInt(this.parameter.tabPage.find(".customPage").val()) <= parseInt(this.parameter.tabPage.find(".next").prev().attr("totalpage"))) ? this.parameter.tabPage.find(".customPage").val() : this.parameter.tabPage.find(".next").prev().attr("totalpage")
        } else {
            json["page"] = this.parameter.tabPage.find(".active > a").attr("pageid") || 1;
        }
        json["filter"] = facetsSearch.isEmptyObject(param) ? JSON.stringify(param) : (filterCon || "");
        json["booleanSearch"] = "";
        json["keyword"] = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        json["order"] = this.order.orderAt ? "{\"" + this.order.orderAt + "\":\"" + this.order.filed + "\"}" : "";
        return json;
    },
    setSaveSearchListener: function () {
        var _this = this, filter = $("#facetsSearch"), checked = [];
        $("#saveSearch a").live("click", function () {
            var paramStr = $(this).attr("data");
            var obj = $.parseJSON(paramStr) || [], param = { filter: {}};
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
                } else if (obj[i]["Key"] === "edlproject") {
                    for (var j = 0, len1 = obj[i]["Value"].length; j < len1; j++) {
                        $("#facetsSearch").find(".checkbox.noeinfilter").find("input[requestkey = " + obj[i]["Key"] + "][value = " + obj[i]["Value"][j] + "]").attr("checked", "checked").closest(".checkbox").addClass("checked")
                    }
                }
                else {
                    param["filter"] = param["filter"] ? param["filter"] : {};
                    param["filter"][obj[i]["Key"]] = obj[i]["Value"];
                }
            }
            delete param["filter"]["keyword"];
            $('input.date').each(function () {
                var _this = $(this);
                var key = _this.attr('parentkey');
                if (param.filter[key]) {
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
        this.setFilterEventListener("#region");
        this.setFilterEventListener("#projectstatus");
        this.setFilterEventListener("#edl_project");
        this.setFilterEventListener("#year");
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#specification");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
    },
    setTenderingResultTypeListener: function () {
        var _this = this;
        $(".tenderingResultType > li").click(function () {
            $(this).addClass("active").siblings().removeClass("active").find("span").addClass("hide");
            //$(".tenderingResultType > li span").addClass("hide");
            var type = $(this).attr("type");
            switch (type) {
                case "overview":
                    _this.parameter.tableUrl = "/Tendering/GetResultByList";
                    _this.parameter.saveSearch.optionColumnsModuleId = 40;
                    break;
                case "product":
                    _this.parameter.tableUrl = "/Tendering/GetResultByProduct";
                    _this.parameter.saveSearch.optionColumnsModuleId = 41;
                    break;
                case "project":
                    _this.parameter.tableUrl = "/Tendering/GetResultByProject";
                    _this.parameter.saveSearch.optionColumnsModuleId =42;
                    break;
                case "region":
                    _this.parameter.tableUrl = "/Tendering/GetResultByRegion";
                    _this.parameter.saveSearch.optionColumnsModuleId = 43;
                    break;
            }
            _this.parameter.tab = $(this);
            $(".tabCon>div").addClass("hide").eq(_this.parameter.tab.index()).removeClass("hide");
            _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index()).children().eq(0);;
            _this.parameter.tabPage = $(".pageBox").eq(_this.parameter.tab.index());
            _this.order = { "filed": null, "orderAt": null };
            _this.getTableData().getFilterData();
        })
    },
    pageDataHander: function (rows, page) {
        var _TotalRecord = parseInt($(".tabCon > div:not('.hide')").find("input#TotalRecord").val());
        this.createPage(_TotalRecord, page, rows);
        $(".count").html(facetsSearch.formatNumber(parseInt($(".tabCon > div:not('.hide')").find("input#TotalTenderRecord").val())));
        $(".tenderingResultType > li.active span").removeClass("hide").find("b").html(facetsSearch.formatNumber(_TotalRecord));
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
                case "overview":
                    modelID = 40;
                    url = "/OptionalColum/GetOptionalColumnsForTenderingResultView";
                    break;
                case "product":
                    modelID = 41;
                    url = "/OptionalColum/GetOptionalColumnsForTenderingResultProductView";
                    break;
                case "project":
                    modelID = 42;
                    url = "/OptionalColum/GetOptionalColumnsForTenderingResultProjectView";
                    break;
                case "region":
                    modelID = 43;
                    url = "/OptionalColum/GetOptionalColumnsForTenderingResultRegionView";
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
    setExportListener: function () {
        var _this = this;
        $("#export").live('click', function () {
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var searchCount = $(".tenderingResultType >li.active >a >span >b").text();
            if (searchCount.length>3) {
                searchCount =parseInt(String(searchCount).replace(",",""));
            }
            else {
                searchCount = parseInt(searchCount);
            }
            var type = $(this).parent().parent().parent("div").attr("type");
            var href = "";
            switch (type) {
                case "overview":
                    href = "/Tendering/ExportResultView?keyword=" + para.keyword + "&filter=" + para.filter + "&edlProject=" + para.edlproject;
                    break;
                case "product":
                    href = "/Tendering/ExportResultProduct?keyword=" + para.keyword + "&filter=" + para.filter + "&edlProject=" + para.edlproject;
                    break;
                case "project":
                    href = "/Tendering/ExportResultProject?keyword=" + para.keyword + "&filter=" + para.filter + "&edlProject=" + para.edlproject;
                    break;
                case "region":
                    href = "/Tendering/ExportResultRegion?keyword=" + para.keyword + "&filter=" + para.filter + "&edlProject=" + para.edlproject;
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
        tableUrl: "/Tendering/GetResultByList",
        tableContainer: "#tender-result-overview",
        filterUrl: "/Tendering/GetResultFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            savedsearchModuleId: 16,
        }
    });



    
});


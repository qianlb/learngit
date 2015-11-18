facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
        this.setInputEventListener();    //input search
        this.setFilterSlideListener();   //filter events
        this.pageDataHander(_this.parameter.pageSize, 1);   //page
        this.setOrderHeader();   //order
        this.setStoreUpListener(); //clearTag
        this.setAddSaveSearchListener(); //addSaveSearch
        this.createFilter();  //createFliter
        this.createHistory();  // createHistory
        this.getRecentSearch();
        this.setOptionColumnLinstener();
        this.pageInit();
        return this;
    },
    pageInit: function () {
        var _this = this;
        var savedSearchId = parseInt($("#savedSearchId").val());
        if (savedSearchId) {
            $("#saveSearch").find("a[savedsearchid = " + savedSearchId + "]").click();
        }
    },
    getRequestParam: function () {
        var json = {},
                filters = $("#facetsSearch .checkbox.checked>input,#facetsSearch label.checked >input,.facetsSearch .checkbox.checked>input,#facetsSearch #acceptancedate input,#facetsSearch #inspectionstartdate input,#facetsSearch #formulation select,#ephmra_atc_code select,#ephmra_atc_code select"),
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
    setOptionColumnLinstener: function () {
        var _this = this;
        var tabType,
            modelID=11,
            url = "/OptionalColum/GetOptionalColumnsForGMPViewApplications";
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
        this.setFilterEventListener("#companytype");
        this.setFilterEventListener("#province");
        this.setFilterEventListener("#currentstatus");
        this.setFilterEventListener("#acceptancedate");
        this.setFilterEventListener("#inspectionstartdate");
    }
})
facetsSearch.prototype.init.prototype = facetsSearch.prototype
$(function () {
    var obj = facetsSearch({
        tableUrl: "/GMP/GetApplicationList",
        tableContainer: "#GmpApplicationCon",
        filterUrl: "/GMP/GetApplicationFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            savedsearchModuleId: 10,
        }
    });
});



$(function () {
    $("._navbar").live("click", function () {
        var _this = $(this);
        _this.find(".sidebar-arrow").removeClass("hide").end().addClass("active");
        _this.siblings().removeClass("active").find(".sidebar-arrow").addClass("hide");

        /*清空关键字，时间控件上旧的值*/
        ClearScreen();

        if ($("li.active").attr("type") == "statusOne") {
            $("#statsTwoTop5").addClass("hide");
            $("#statsOneTitle").removeClass("hide");
        }
        else {
            $("#statsTwoTop5").removeClass("hide");
            $("#statsOneTitle").addClass("hide");
        }
    });
    //页面加载时清空文本框
    ClearScreen();

    $("input.startDate").datepicker({
        changeMonth: true,
        changeYear: true,
        onSelect: function (selectedDate) {
            $("input.endDate").datepicker("option", "minDate", selectedDate);
            var obj = getParamObject();
            SearchPiplineStatus(obj);
        }
    });
    $("input.endDate").datepicker({
        changeMonth: true,
        changeYear: true,
        onSelect: function (selectedDate) {
            $("input.startDate").datepicker("option", "maxDate", selectedDate);
            var obj = getParamObject();
            SearchPiplineStatus(obj);
        }
    });

    $("#keyword").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/PipelineStats/GetKeywordAutocomplete",
                dataType: "json",
                data: { keyword: request.term },
                success: function (val) {
                    var cache = [];
                    for (var i = 0; i < val.length; i++) {
                        cache.push({ label: val[i].Description, value: val[i].Description, raw: val[i] })
                    }
                    response(cache);
                    if (val.length < 1) {
                        $('#keyword').attr('searchfield', "");
                        $('#keyword').attr('searchid', "");
                    }
                }
            });
        },
        autoFocus: true,
        //focus: function (event, ui) {
        //    $('#keyword').attr('searchfield', ui.item.raw.FiledName);
        //    $('#keyword').attr('searchid', ui.item.raw.ID);
        //    event.preventDefault();
        //    var obj = getParamObject();
        //    SearchPiplineStatus(obj);
        //},
        select: function (event, ui) {
            $('#keyword').attr('searchfield', ui.item.raw.FiledName);
            $('#keyword').attr('searchid', ui.item.raw.ID);
            var obj = getParamObject();
            SearchPiplineStatus(obj);
        }
    });
    $("#keyword").on('input propertychange', function () {
        var _this = $(this);
        if (_this.val() == '') {
            var obj = getParamObject();
            SearchPiplineStatus(obj);
        }
    });
    //搜索关键字按钮
    //$("button[class='btn btn-default']").live("click", function () {
    //    var obj = getParamObject();
    //    SearchPiplineStatus(obj);
    //})

    $("label[class='btn btn-default']").live("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        var obj = getParamObject();
        //if (obj.cfda_approval_date == undefined && obj.cde_acceptance == undefined) {
        //    return;
        //}
        //else {
        SearchPiplineStatus(obj);
        // }
    })
})
//piplineStatus 搜索公共方法
function getParamObject() {
    var obj = {};
    var searchfield = $("input[type='search']").attr("searchfield");
    var searchid = $("input[type='search']").attr("searchid");
    var dateForm = $("#dateFrom").val();
    var dateTo = $("#dateTo").val();
    var date = $("label[class='btn btn-default active']").attr("type");
    if ($("input[type='search']").val() != "" && searchfield != "" && searchfield != undefined) {
        if (searchfield == "companyname") {
            obj["company"] = [searchid];
        }
        else {
            obj["product"] = [searchid];
        }
    }
    if (date != undefined && date != "") {
        if (dateForm != "" && dateForm != undefined) {
            obj[date] = [dateForm];
            if (dateTo != "" && dateTo != undefined) {
                if (obj[date].length > 0) {
                    obj[date].push(dateTo);
                }
            }
            else {
                obj[date].push("");
            }
        }
        else if (dateForm == "" && dateTo != "") {
            //obj[date] = [""].push(dateTo);
            obj[date] = [];
            obj[date].push("");
            obj[date].push(dateTo);
        }
    }
    return obj;
}

function SearchPiplineStatus(obj) {
    var url = "";
    //判断是StatusOne还是StatusTwo
    if ($("li.active").attr("type") == "statusOne") {
        url = "/PipelineStats/GetPipelineStatsOneIndex";
    }
    else {
        url = "/PipelineStats/GetPipelineStatusTwo";
    }
    $.ajax({
        type: "POST",
        url: url,
        data: { filter: JSON.stringify(obj) },
        dateType: "json",
        success: function (partialView) {
            $("#content").html(partialView);
        }
    });
}

var ClearScreen = function () {
    $("input[type='search']").val("");
    $('#keyword').attr('searchfield', "");
    $('#keyword').attr('searchid', "");
    $("#dateFrom").val("");
    $("#dateTo").val("");
}

$(function () {
    var pageSize = 10;
    var companyADR = function (url) {
        var param = getRequestParam();
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            success: function (htmlStr) {
                $("#company_adrInfo_list").html(htmlStr);
                var total = $("#recount").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
                createPage(totalpage, current, pageSize, companyADR, url);
            }
        });
    }

    var url = "/ADR/GetCompanyADRInfoList";
    var total = parseInt($("#recount").val()), current = parseInt($("#currentpage").val() || 1), totalpage = parseInt(total);
    createPage(totalpage, current, pageSize, companyADR, url);


    function getRequestParam() {
        var pageIndex = $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        var json = {};
        json["pageIndex"] = pageIndex;
        json["companyId"] = $("#companyId").val();
        json["productId"] = $("#drugId").val();
        json["pageSize"] = pageSize;
        return json;
    }

    $(".card-nav a").bind('click', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass("active");
        if (_this.is("#view_by_report_tab")) {
            $('#viewbyInfo').hide();
            $('#viewbyReport').show();
            $.ajax({
                type: "POST",
                url: '/ADR/GetCompanyADRReportList',
                data: { companyId: $("#companyId").val(), productId: $("#drugId").val() },
                success: function (htmlStr) {
                    $("#viewbyReport").html(htmlStr);
                }
            });
        } else {
            $('#viewbyInfo').show();
            $('#viewbyReport').hide();
        }
    })
})
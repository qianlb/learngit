$(function () {
    GetTenderingProductTrendGraph();

    var pageSize = 10;
    var companyTrending = function (url) {
        var param = getRequestParam();
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            success: function (htmlStr) {
                $("#company_tender_product_list").html(htmlStr);
                var total = $("#recount").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
                createPage(totalpage, current, pageSize, companyTrending, url);
            }
        });
    }

    var url = "/Company/GetCompanyTenderingCountOfRegionCoveredByProduct";
    var total = parseInt($("#recount").val()), current = parseInt($("#currentpage").val() || 1), totalpage = parseInt(total);
    createPage(totalpage, current, pageSize, companyTrending, url);


    function getRequestParam() {

        var pageIndex = $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;

        var json = {};
        json["pageIndex"] = pageIndex;
        json["companyId"] = $("#companyId").val();
        json["pageSize"] = pageSize;
        return json;
    }

    function GetTenderingProductTrendGraph() {

        var companyId = $("#companyId").val();
        $.ajax({
            type: 'post',
            async: true,
            url: '/Company/GetTenderingProductTrendGraphData',
            data: { companyID: companyId },
            success: function (json) {
                if (!json || json.length < 1) {
                    $("#graphic").html("No data available").css({margin: 0}).removeClass("div-response");
                }
                else {
                    var testData = {};
                    testData["year"] = [];
                    testData["productcount"] = [];
                    for (var i = 0; i < json.length; i++) {
                        testData.year.push(json[i].Year);
                        testData.productcount.push(parseInt(json[i].ProductCount));
                    }
                    CreateRegistrationTrendsWithCFDAGraph(testData)
                }
            }
        });
    }

    function CreateRegistrationTrendsWithCFDAGraph(data) {
        var myChart2 = echarts.init(document.getElementById('graphic'));
        option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                borderWidth: 0
            },
            calculable: true,
            xAxis: [
               {
                   type: 'category',
                   data: data.year,
                   splitLine: false
               }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: [
                {
                    name: 'Products',
                    type: 'line',
                    data: data.productcount
                }
            ]
        };
        myChart2.setOption(option);
        window.onresize = myChart2.resize;
    }
    $(".card-nav a").bind('click', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass("active");
        if (_this.is("#view_by_region_tab")) {
            $('#viewbyproduct').hide();
            $('#viewbyregion').show();
            $.ajax({
                type: "POST",
                url: '/Company/GetCompanyTenderingViewByRegionData',
                data: { companyId: $("#companyId").val() },
                success: function (htmlStr) {
                    $("#viewbyregion").html(htmlStr);
                }
            });
        } else {
            $('#viewbyproduct').show();
            $('#viewbyregion').hide();
        }
    })
})
$(function () {
    GetChartData();
    var pageSize = 10;
    var productTrending = function (url, paremeter) {
        var param = getRequestParam(paremeter);
        $.ajax({
            type: "POST",
            url: url,
            async: true,
            data: param,
            success: function (htmlStr) {
                $("#bidding_manufacturer_list").html(htmlStr);
                var totalpage = $("#recount").val(), current = parseInt($("#currentpage").val() || 1);
                setOrderHeader();
                createPage(totalpage, current, pageSize, productTrending, url); 
            }
        });
    }
    var url = "/Product/GetBiddingManafacturer";
    var totalpage = parseInt($("#recount").val()), current = parseInt($("#currentpage").val() || 1);
    createPage(totalpage, current, pageSize, productTrending, url);
    setOrderHeader();
    function getRequestParam(paremeter) {
        var pageIndex = (paremeter && paremeter.pageIndex) ? paremeter.pageIndex : $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        var json = {}, order = $("#orderat");
        json["prodcutId"] = $("#drugId").val();
        json["delivery"] = $('#product_tendering_delivery').children(".checked").children("input[name=delivery]").val();
        json["formulation"] = $("select[name=most_common_formulation_specification]").find("option:selected").attr("formulation");
        json["specification"] = $("select[name=most_common_formulation_specification]").find("option:selected").attr("specification");
        json["tenderingYear"] = $("select[name=tendering_year]").find("option:selected").val();
        json["pageIndex"] = pageIndex;
        json["pageSize"] = pageSize;
        json["order"] = order.attr("name") != 'orderat' ? "{\"" + order.attr("name") + "\":\"" + order.val() + "\"}" : "";
        return json;
    }
    function GetChartData() {
        var chartdata = eval($('#ChartDataJson').val());

        var testdata = {};

        for (var i = 0; i < chartdata.length; i++) {
            testdata["companyname"] ? testdata["companyname"].push(chartdata[i].BbreviationName) : testdata["companyname"] = [chartdata[i].BbreviationName];
            testdata["averageprice"] ? testdata["averageprice"].push(parseFloat(chartdata[i].AveragePrice)) : testdata["averageprice"] = [parseFloat(chartdata[i].AveragePrice)];
            testdata["maxprice"] ? testdata["maxprice"].push(chartdata[i].MaxPrice) : testdata["maxprice"] = [chartdata[i].MaxPrice];
            testdata["minprice"] ? testdata["minprice"].push(chartdata[i].MinPrice) : testdata["minprice"] = [chartdata[i].MinPrice];
        }

        CreateRegistrationTrendsWithCFDAGraph(testdata)
    }

    function CreateRegistrationTrendsWithCFDAGraph(data) {
        if ('minprice' in data) {
            $("#bidding_result_of_formulation_chart").css("margin", "-40px -50px -30px")
        } else {
            $("#bidding_result_of_formulation_chart").css("margin", "0px")
        }
        var myChart2 = echarts.init(document.getElementById('bidding_result_of_formulation_chart'));
        option = {
            noDataLoadingOption: {
                effect: 'whirling'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Average', 'Maximum', 'Minimum'],
                x: "center",
                y: "bottom"
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: data.companyname
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Average',
                    type: 'bar',
                    data: data.averageprice,
                },
                {
                    name: 'Maximum',
                    type: 'bar',
                    data: data.maxprice
                },
                {
                    name: 'Minimum',
                    type: 'bar',
                    data: data.minprice
                }
            ]
        };
        myChart2.setOption(option);
        window.onresize = myChart2.resize;
    }

    $('#product_tendering_delivery input[name=delivery]').click(function () {
        var _this = $(this);
        if (!$(this).parent().hasClass("checked"))
        {
            _this.parent().addClass('checked').siblings().removeClass("checked");
            $.ajax({
                type: "POST",
                async: true,
                url: "/Product/GetTheChartOfTenderingPrice",
                data: { prodcutId: $("#drugId").val(), delivery: $(this).val() },
                success: function (htmlStr)
                {
                    $(this).parent("label").addClass("checked").siblings().removeClass("checked");
                    $('#Average_maximum_minimum_bidding_results').html("").html(htmlStr);
                    GetChartData();
                }
            });
            $.ajax({
                type: "POST",
                async: true,
                url: "/Product/GetMostCommomFormulationSpecAndTenderYear",
                data: { prodcutId: $("#drugId").val(), delivery: $(this).val() },
                success: function (htmlStr) {
                    $('#most_common_formulation_specification_year').html("").html(htmlStr);
                    $("select[name='most_common_formulation_specification'],select[name='tendering_year']").unbind('change').bind('change', function () {
                        productTrending(url)
                    })
                    productTrending(url)
                }
            });
        }
    })

    $("select[name='most_common_formulation_specification'],select[name='tendering_year']").unbind('change').bind('change', function () {
        productTrending(url)
    })

    //detail排序
    function setOrderHeader() {
        var order = $("#orderat"),
        orderElm = $("#bidding_manufacturer_list").find("[orderat='" + order.attr("name") + "']");
        if (orderElm.length && order.val() === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
            orderElm.addClass("active")
        } else if (orderElm.length && order.val() === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
            orderElm.addClass("active")
        }
        var orderElms = $("#bidding_manufacturer_list").find("[orderat]");
        orderElms.unbind('click').bind('click', function () {
            var $this = $(this);
            $this.addClass("active").siblings().removeClass("active");
            $this.siblings().find("span.icon-sort-down,span.icon-sort-up,span.icon-unsorted").attr("class", "icon-unsorted");
            if ($this.find("span.icon-sort-up").length) {
                $this.find("span").attr("class", "icon-sort-down");
                order.attr("name", $this.attr("orderat"));
                order.val("desc");
            } else {
                $this.find("span").attr("class", "icon-sort-up");
                order.attr("name", $this.attr("orderat"));
                order.val("asc");
            }
            productTrending(url)
        }).css("cursor", "pointer");
    }
})
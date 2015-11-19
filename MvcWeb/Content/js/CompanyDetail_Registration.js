$(function () {
    GetRegistrationTrendsWithCFDAGraph();

    var companyResCon = function (paras) {
        var param = GetRequestParameter(paras);
        $.ajax({
            type: "post",
            url: "/Company/GetRegistrationValidInvalidList",
            data: param,
            success: function (htmlStr) {
                $("#validInvalidRegistration").html(htmlStr);
                setOrderHeader();
                var currentPageIndex = $('#currentpage').val(), totalPage = parseInt($("#recount").val());
                createPage(totalPage, parseInt(currentPageIndex), 10, companyResCon);
            }
        });
    }
    setOrderHeader();
    var currentPageIndex = $('#currentpage').val() || 1, totalPage = parseInt($("#recount").val());
    createPage(totalPage, parseInt(currentPageIndex), 10, companyResCon);
    //$("select[name='registration_category']").change(function () {
    //    companyResCon();
    //})

    $("select[name='registration_category").unbind('change').bind('change', function () {
        companyResCon();
    });

    $("label").unbind('click').bind('click', function () { //Click Valid Invalid
        $(this).addClass("active").siblings().removeClass("active");
        companyResCon({ pageIndex: 1 });
    })

    function GetRequestParameter(paras) {
        var isCFDA = "cfda";
        var parameter = {};
        var order = $("#orderat");
        pageIndex = (paras && paras.pageIndex) ? paras.pageIndex : $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        parameter["companyId"] = $("#companyId").val();
        parameter["isValid"] = $("label.active").attr("values");
        parameter["registration"] = $("select[name='registration_category']").val();
        parameter["pageIndex"] = pageIndex;
        parameter["pageSize"] = 10;
        parameter["orderBy"] = order.attr("name") != 'orderat' ? "{\"" + order.attr("name") + "\":\"" + order.val() + "\"}" : "";
        parameter["isCFDA"] = isCFDA;
        return parameter;
    }
    function setOrderHeader() {
        var order = $("#orderat"),
        orderElm = $("#validInvalidRegistration").find("[orderat='" + order.attr("name") + "']");
        if (orderElm.length && order.val() === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
            orderElm.addClass("active")
        } else if (orderElm.length && order.val() === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
            orderElm.addClass("active")
        }
        var orderElms = $("#validInvalidRegistration").find("[orderat]");
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
            companyResCon();
        }).css("cursor", "pointer");
    }

    function GetRegistrationTrendsWithCFDAGraph() {

        //var companyId = window.location.href.split("=")[1];
        var companyId = $("#companyId").val();
        $.ajax({
            type: 'post',
            async: true,
            url: '/Company/GetRegistrationTrendWithCDFAGraphData',
            data: { companyID: companyId, isCFDA: "" },
            success: function (json) {
                if (!json.Year || json.Year.length < 1 || !json.Year[0]) {
                    $("#registration_trend").html("No data available").removeClass("div-response");
                }
                else {
                    CreateRegistrationTrendsWithCFDAGraph(json)
                }
            }
        });
    }

    function CreateRegistrationTrendsWithCFDAGraph(data) {
        var myChart2 = echarts.init(document.getElementById('registration_trend'));
        option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                borderWidth: 0
            },
            calculable: true,
            legend: {
                x: 'center',
                y: 'bottom',
                padding: 10,
                data: ['Accumulative products', 'Product by year', 'Accumulative brand']
            },
            xAxis: [
               {
                   type: 'category',
                   data: data.Year,
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
                    name: 'Accumulative products',
                    type: 'line',
                    data: data.AccumalativeProduct
                },
              {
                  name: 'Product by year',
                  type: 'bar',
                  data: data.ProductByYear
              },
                {
                    name: 'Accumulative brand',
                    type: 'line',
                    data: data.AccumalativeBrand
                }
            ]
        };
        myChart2.setOption(option);
        window.onresize = myChart2.resize;
    }
});

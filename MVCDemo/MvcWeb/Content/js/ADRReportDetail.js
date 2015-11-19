$(function () {
    $("#CompanyIcon").live("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#CompanyGraph").show();
        $("#ProductGraph").hide();
    });
    var reportId = $("#reportID").val();
    $.ajax({
        url: "/ADR/GetADRDetailClassDescription",
        type: "post",
        async: true,
        dateType: "json",
        data: { reportID: reportId },
        success: function (partialView) {
            var container = $("#classDescription");
            container.html(partialView);
            if (partialView.length > 100) {
                container.show();
            } else {
                container.hide();
            }
        },
        error: function () {
            //alert("数据获取失败");
        }
    });

    $("#ProductIcon").live("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#ProductGraph").show();
        $("#CompanyGraph").hide();

        //产品默认
        var productId = $("#ProductGraph .nav-list li").eq(0).attr("id");
        $("#ProductGraph .nav-list li").eq(0).addClass("active").siblings().removeClass("active");
        GetProductChart(productId);
    });
    //公司默认
    var companyId = $("#CompanyGraph .nav-list li").eq(0).attr("id");
    var type = $("#CompanyGraph .checked input").val();
    $("#CompanyGraph .nav-list li").eq(0).addClass("active").siblings().removeClass("active");
    GetCompanyChart(companyId, type);
    //点击公司
    $("#CompanyGraph .nav-list li").live("click", function () {
        var _this = $(this);
        $(this).addClass("active").siblings().removeClass("active");
        var companyId = _this.attr("id");
        var type = $("#CompanyGraph .checked input").val();
        GetCompanyChart(companyId, type);
        $("#CompanyGraph lable").eq(0).addClass("checked").siblings().removeClass("checked");
    });
    //点击公司的类别
    $("#CompanyGraph .radio").live("click", function () {

        var type = $("input[type='radio']:checked").val();
        //$("input[type='radio']:checked").each(function () {
        //    var _this = $(this)
        //    type = _this.val()
        //})
        var companyId = $("#CompanyGraph li[class=active]").attr("id");
        GetCompanyChart(companyId, type);
    }); //点击产品
    $("#ProductGraph .nav-list li").live("click", function () {
        var _this = $(this);
        $(this).addClass("active").siblings().removeClass("active");
        var productId = _this.attr("id");
        GetProductChart(productId);
    });
});

function GetCompanyChart(companyId, type) {
    $("#companyChart").html("");
    $.ajax({
        type: "post",
        async: true,
        url: "/News/AnalyticsSnapshotCompany",
        data: { mncid: companyId, type: type },
        success: function (json) {
            if (json === "") {
                $("#companyChart").html("No data available").removeClass("div-response");
            } else {
                $("#companyChart").addClass("div-response");
                var legendData = [], seriesData = [];
                for(var i = 0, len = json.length; i < len; i++){
                    legendData.push(json[i].Code);
                    seriesData.push({value: json[i].CodeCount, name: json[i].Code});
                }
                var mychart = echarts.init(document.getElementById("companyChart"));
                var myoption = {
                    legend: {
                        orient : "horizontal",
                        x : "center",
                        itemHeight:10,
                        padding:[20,80,0,0],
                        data:legendData
                    },
                    tooltip : {
                        trigger: "item",
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: "{b} : {c} ({d}%)"
                    },
                    calculable : false,
                    series : [
                        {
                            type:"pie",
                            radius : "55%",
                            data: seriesData
                        }
                    ]
                };
                
                mychart.setOption(myoption);
                window.onresize = function () {
                    mychart.resize();
                };
                /*var chartData = json;
                var chart = new GBIChart.PieChart();
                chart.data = chartData;
                chart.categoryField = "Code";
                //chart.top = 10;
                //chart.bottom = 10;
                //chart.left = 60;
                //chart.right = 120;
                chart.top = 10;
                chart.bottom = 10;
                chart.left = 60;
                chart.right = 120;
                //chart.width = $("#companyChart")[0].clientWidth;
                //chart.height = $("#companyChart")[0].clientHeight;
                chart.width = 350;
                chart.height = 220;
                chart.color = ["#FF0F00", "#FF6600", "#FF9E01", "#FCD202", "#F8FF01", "#B0DE09"];
                chart.title = "";
                chart.selector = "#companyChart";
                chart.tipTextCallBack = function (d) {
                    return d.data[categoryField] + ": " + (Math.round((d.data[valueField] / d.data.sum) * 10000) / 100) + "%";
                }
                chart.write("createPieChart");*/
            }
        }
    });
}

function GetProductChart(productId) {
    $.ajax({
        type: "post",
        async: true,
        url: "/News/AnalyticsSnapshotProduct",
        data: { productid: productId },
        dataType: "json",
        success: function (jsonString) {
            if (jsonString === "" || jsonString.ChartData === "[]") {
                $("#productChart").html("No data available").removeClass("div-response");;
            } else {
                $("#productChart").addClass("div-response");
                var valueJson = jsonString.ChartData;
                var json = $.parseJSON(valueJson);
                var chartData = json;
                var yearData = [], seriesData0 = [], seriesData1 = [];
                for(var i = 0, len = chartData.length; i < len; i++){
                    yearData.push(chartData[i].year);
                    seriesData0.push(chartData[i]["Company with valid brand names"]);
                    seriesData1.push(chartData[i]["Company with valid registrations"]);
                }
                var productChart = echarts.init(document.getElementById("productChart"));
                var option = {
                    tooltip : {
                        trigger: "axis",
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    legend: {
                        data:["Company with valid brand names","Company with valid registrations"]
                    },
                    xAxis : [
                        {
                            type : "category",
                            boundaryGap : false,
                            data : yearData
                        }
                    ],
                    yAxis : [
                        {
                            type : "value"
                        }
                    ],
                    series : [{
                        name: "Company with valid brand names",
                        type: "line",
                        data: seriesData0
                    },{
                        name: "Company with valid registrations",
                        type: "line",
                        data: seriesData1
                    }]
                };
                productChart.setOption(option);
                window.onresize = function () {
                    productChart.resize();
                };
                /*var chart = new GBIChart.GroupedLineChart();
                chart.dataProvider = chartData;
                chart.categoryField = "year";
                chart.yPoint = 0;
                chart.yFormat = "d";
                //chart.spacing=10;
                chart.top = 30;
                chart.right = 30;
                chart.left = 50;
                chart.bottom = 120;
                chart.width = 360;
                chart.height = 300;
                chart.graticule = "reseau";  //网格线
                chart.optimize = "interval"; //年份为斜体
                chart.xAxisInterval = 2;
                chart.color = ["#4684EE", "#DC3912"];
                chart.interpolate = "linear";
                //chart.yOffset=1;
                chart.tipTextCallBack = function (d) {
                    return "<span style='color:#fff ;font-size:12px'>" + d.x + " : " + d.y + "</span>";
                };
                chart.write("#productChart");*/
            }
        }
    });
}
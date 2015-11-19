$(function () {
    var DealsTitle = $("#DealsTitle").val();
    var url = window.location.href;

    $.ajax({
        url: "/Home/ShareUrl",
        type: "post",
        async: false,
        success: function (result) {
            if (result != null) {
                url = result;
            }
        },
        error: function () {
            //alert("数据获取失败");
        }
    });

    var emailHref = $("#share span.btn-social-email a").attr("href");
    emailHref = emailHref + url;
    $("#share span.btn-social-email a").attr("href", emailHref);


    $("#share button").bind('click', function () {
        var shareToPlatform = $(this).attr("name");
        share(url, DealsTitle, "", shareToPlatform);
    });
    //init
    var mncid = $("#CompanyGraph li.active").attr("companyid"),
        type = $("#CompanyGraph >label.checked >input").val();
    GetCompanyChart(mncid, type);

    //amount 3位一撇
    $(".Amount").each(function () {
        var value = facetsSearch.formatNumber(parseInt($(this).text()));
        $(this).html("").html(value);
    });
    //Company,product switch
    $("#CompanyIcon").live("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#CompanyGraph").show();
        $("#ProductGraph").hide();
        var mncid = $("#CompanyGraph li.active").attr("companyid"),
            type = $("#CompanyGraph >label.checked >input").val();
        if (mncid) {
            GetCompanyChart(mncid, type);
        } else {
            $("#companyChart").html("").html('No data available').removeClass("div-response");
        }
    })
    $("#ProductIcon").live("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#ProductGraph").show();
        $("#CompanyGraph").hide();
        var productId = $("#ProductGraph li.active").attr("productid");
        if (productId) {
            GetProductChart(productId);
        } else {
            $("#productChart").html('No data available').removeClass("div-response");
        }

    })
    //company click
    $("#CompanyGraph li").live("click", function () {
        var _this = $(this);
        $("#CompanyGraph li").removeClass("active");
        _this.addClass("active");
        var mncid = $("#CompanyGraph li.active").attr("companyid"),
        type = $("#CompanyGraph >label.checked >input").val();
        GetCompanyChart(mncid, type);
    })

    //radioButton click
    $("#CompanyGraph .radio").live('click', function () {
        var type = $("input[type='radio']:checked").val();
        var companyId = $("#CompanyGraph li.active ").attr("companyid");
        GetCompanyChart(companyId, type);
    })
    //product click
    $("#ProductGraph li").live('click', function () {
        var _this = $(this);
        $(this).addClass("active").siblings().removeClass("active");
        var productId = _this.attr("productid");
        GetProductChart(productId);
    })

    //draw chart function
    function GetCompanyChart(mncid, type) {
        $.ajax({
            url: "/Deals/AnalyticsSnapshotCompany",
            type: "post",
            async: true,
            dateType: "json",
            data: { mncid: mncid, type: type },
            success: function (chartData) {
                $("#companyChart").html("");
                if (chartData == "") {
                    $("#companyChart").html("").html('No data available').removeClass("div-response");
                    $("#Description").hide();
                } else {
                    $("#Description").show();
                    $("#companyChart").addClass("div-response");
                    var legend_data = [], series_data = [];
                    for(var i = 0, len = chartData.length; i < len; i++){
                        legend_data.push(chartData[i].Code);
                        series_data.push({value: chartData[i].CodeCount, name: chartData[i].Code});
                    }
                    var mychart = echarts.init(document.getElementById('companyChart'));
                    var myoption = {
                        legend: {
                            orient : 'horizontal',
                            x : 'center',
                            itemHeight:10,
                            padding:[20,80,0,0],
                            data:legend_data
                        },
                        tooltip : {
                            trigger: 'item',
                            textStyle: {
                                fontSize: 12
                            },
                            formatter: "{b} : {c} ({d}%)"
                        },
                        calculable : false,
                        series : [
                            {
                                type:'pie',
                                radius : '55%',
                                data: series_data
                            }
                        ]
                    };
                    
                    mychart.setOption(myoption);
                    window.onresize = function () {
                        mychart.resize();
                    };
                    /*var chart = new GBIChart.PieChart();
                    chart.data = chartData;
                    chart.categoryField = "Code";
                    //chart.top = 3;
                    //chart.left =50;
                    //chart.right = 120;
                    //chart.width = $("#companyChart")[0].clientWidth;
                    //chart.height = 220;
                    chart.top = 10;
                    chart.bottom = 10;
                    chart.left = 100;
                    chart.right = 120;
                    chart.width = 350;
                    chart.height = 220;
                    chart.color = ["#FF0F00", "#FF6600", "#FF9E01", "#FCD202", "#F8FF01", "#B0DE09"];
                    chart.title = "";
                    chart.selector = "#companyChart";
                    chart.write("createPieChart");*/
                }
            },
            error: function () {
                alert("数据获取失败");
            }
        });
    }

    function GetProductChart(productid) {
        $.ajax({
            type: "post",
            async: false,
            url: "/Deals/AnalyticsSnapshotProduct",
            data: { productid: productid },
            datatype: "json",
            success: function (jsonString) {
                $("#productChart").html("");
                var valueJson = jsonString.ChartData;
                var json = $.parseJSON(valueJson);
                var chartData = json;
                if (chartData.length == 0) {
                    $("#productChart").html('no data available').removeClass("div-response");
                } else {
                    $("#productChart").addClass("div-response");
                    var chartData = json;
                    var year_data = [], series_data0 = [], series_data1 = [];
                    for(var i = 0, len = chartData.length; i < len; i++){
                        year_data.push(chartData[i].year);
                        series_data0.push(chartData[i]['Company with valid brand names']);
                        series_data1.push(chartData[i]['Company with valid registrations']);
                    }
                    var product_chart = echarts.init(document.getElementById('productChart'));
                    var option = {
                        tooltip : {
                            trigger: 'axis',
                            textStyle: {
                                fontSize: 12
                            }
                        },
                        legend: {
                            data:['Company with valid brand names','Company with valid registrations']
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : year_data
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [{
                            name: 'Company with valid brand names',
                            type: 'line',
                            data: series_data0
                        },{
                            name: 'Company with valid registrations',
                            type: 'line',
                            data: series_data1
                        }]
                    };
                    product_chart.setOption(option);
                    window.onresize = function () {
                        product_chart.resize();
                    };
                    /*var chart = new GBIChart.GroupedLineChart();
                    chart.dataProvider = chartData;
                    chart.categoryField = "year";
                    chart.yPoint = 0;
                    //chart.top = 30;
                    //chart.right = 30;
                    //chart.left = 0;
                    //chart.bottom = 20;
                    //chart.width = $("#productChart")[0].clientWidth;
                    //chart.height = 200;
                    chart.top = 30;
                    chart.right = 30;
                    chart.left = 50;
                    chart.bottom = 20;
                    chart.width = 360;
                    chart.height = 200;
                    //chart.graticule = "reseau";  //网格线
                    chart.optimize = "interval"; //年份为斜体
                    chart.xAxisInterval = 2;
                    chart.color = ["#4684EE", "#DC3912"];
                    chart.interpolate = "linear";
                    chart.tipTextCallBack = function (d) {
                        return "<span style='color:#fff ;font-size:12px'>" + d.x + " : " + d.y + "</span>";
                    };
                    chart.write("#productChart");*/
                }
            }
        });
    }
})
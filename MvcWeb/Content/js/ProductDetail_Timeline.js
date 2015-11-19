$(function () {
    var productId = $("#productid").val();

    var clickDate = "";

    //timeline-list scrollbar
    $("#product-timeline-list").height(400).perfectScrollbar();

    var requestData = function (url, param, callback) {
        $("#graphicLoading").removeClass("hide");
        $("#recounttype").parent().hide();
        $("#graphic").html("");
        $.ajax({
            type: "post",
            async: true,
            url: url,
            data: param,
            success: function (json) {
                var displaycontent = $(".productsType label[id=" + param.chartType + "]").text();
                $("#recounttype").html(displaycontent);
                callback(json);
                $("#graphicLoading").addClass("hide");
                $("#recounttype").parent().show();
            }
        })
    }

    var GetTimeLineDataCon = function (paras) {
        $.ajax({
            type: "post",
            url: "/Product/GetTimelineList",
            data: GetParameter(paras),
            success: function (htmlStr) {
                $("#tableContent").html(htmlStr);
                $("span.totalcount").html($("#totalcount").val());
                var totalPage = parseInt($("#Total").val()), currentPageIndex = parseInt($("#CurrentPageIndex").val());
                createPage(totalPage, currentPageIndex, 10, GetTimeLineDataCon);
            }
        });
    }

    var GetParameter = function (paras) {
        var parameter = {};
        parameter["productId"] = productId;
        parameter["chartType"] = $(".productsType label.checked").attr("id");
        parameter["date"] = clickDate;
        parameter["pageIndex"] = (paras && paras.pageIndex) ? paras.pageIndex : $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        parameter["keyWord"] = $(".searchInput").val() || 0 ? $(".searchInput").val().trim().stripscript() : "";
        return parameter;
    }

    var drawTimelineChart = function (json) {
        if (!json) {
            $("#graphic").html("NO DATA")
            return false;
        }
        var myChart = echarts.init(document.getElementById('graphic'));
        //myChart.showLoading({
        //    text: ' ',
        //    effect:'spin'
        //});
        var date = [];
        var registrationcount = [];
        var manufactuercount = [];
        var bargraphcount = [];
        for (var i = 0, len = json["Info"].length; i < len; i++) {
            date.push(json["Info"][i]["Date"]);
            registrationcount.push(json["Info"][i]["RegistrationLineCount"]);
            manufactuercount.push(json["Info"][i]["ManufacturerLineCount"]);
            bargraphcount.push(json["Info"][i]["BargraphCount"]);
        }
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 'right',
                y: 'top',
                data: [json["Legend"]["BargraphCount"], json["Legend"]["ManufacturerLineCount"], json["Legend"]["RegistrationLineCount"]]
            },

            calculable: true,
            dataZoom: {
                show: true,
                realtime: true,
                //y: 30,
                start: 0,
                end: 100
            },

            color: ['#F7B565', '#B9DD7C', '#E46662'],

            xAxis: [
                {
                    axisLine: false,
                    splitLine: { show: false },
                    type: 'category',
                    boundaryGap: true,
                    data: date
                }
            ],
            yAxis: [
                {
                    axisLine: false,
                    splitLine: false,
                    type: 'value'
                },
                {
                    axisLine: false,
                    type: 'value'
                }
            ],
            series: [
                {
                    name: json["Legend"]["BargraphCount"],
                    type: 'bar',
                    data: bargraphcount,
                },
                {
                    name: json["Legend"]["RegistrationLineCount"],
                    type: 'line',
                    yAxisIndex: 1,
                    data: registrationcount
                },
                {
                    name: json["Legend"]["ManufacturerLineCount"],
                    type: 'line',
                    yAxisIndex: 1,
                    data: manufactuercount
                },

            ]
        };
        
        myChart.setOption(option);
        window.onresize = myChart.resize;
        myChart.on(echarts.config.EVENT.CLICK, function (param) {
            clickDate = param.name
            GetTimeLineDataCon();
        })
    }

    var getTimelineListdata = function (particalview) {
        $("#product-timeline-list ul").html("").html(particalview);
    }

    //init timelineChart
    var labels = $(".productsType label");
    if (labels.length > 0) {
        var _this = labels.eq(0);
        _this.addClass("checked").siblings().removeClass("checked");
        requestData("/Product/GetTimelineChartData", { productId: productId, chartType: _this.attr("id") }, drawTimelineChart);
        GetTimeLineDataCon({ pageIndex: 1 })
    }

    //radio click
    $(".productsType label").unbind('click').bind('click', function () {
        var _this = $(this), productType = _this.attr("id");
        _this.addClass("checked").siblings().removeClass("checked");
        requestData("/Product/GetTimelineChartData", { productId: productId, chartType: productType }, drawTimelineChart);
        clickDate = "";
        $(".searchInput").val("")
        GetTimeLineDataCon({ pageIndex: 1})
        return false;
    })

    //search click
    $(".searchBtn").unbind('click').bind('click', function () {
        GetTimeLineDataCon({ pageIndex: 1 })
    })
});

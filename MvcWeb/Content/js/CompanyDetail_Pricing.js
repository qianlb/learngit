function GetContentByTab(url, companyId, pageIndex, pageSize) {
    $.ajax({
        type: "POST",
        url: url,
        data: { companyId: companyId, pageIndex: pageIndex, pageSize: pageSize },
        success: function (htmlStr) {
            $("#contentList").html(htmlStr);
        }
    });
};
$(function () {
    var myChart3 = echarts.init(document.getElementById("chart3"));
    var myChart1 = echarts.init(document.getElementById("chart1"));
    //init data
    var _PricedByNational = $("#PricedByNational").text(),
        _PricedByNationalValue = $("#PricedByNational").parent().next().children().eq(0).data("value"),
        _NoPricedByNational = $("#NoPricedByNational").text(),
        _NoPricedByNationalValue = $("#NoPricedByNational").parent().next().children().eq(0).data("value"),
        _GeneralPrice = $("#GeneralPrice").text(),
        _GeneralPriceValue = $("#GeneralPrice").parent().next().children().eq(0).data("value"),
        _SeparatePrice = $("#SeparatePrice").contents().text(),
        _SeparatePriceValue = $("#SeparatePrice").parent().next().children().eq(0).data("value"),
        _IncludedInLowPrice = $("#IncludedInLowPrice").text(),
        _IncludedInLowPriceValue = $("#IncludedInLowPrice").parent().next().children().eq(0).data("value"),
        _ExcludedInLowPrice = $("#ExcludedInLowPrice").text(),
        _ExcludedInLowPriceValue = $("#ExcludedInLowPrice").parent().next().children().eq(0).data("value");
    // 图表使用 3-------------------
    var option3 = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}%"
        },
        calculable: false,
        series: [
            {
                type: 'pie',
                selectedMode: 'single',
                radius: [0, 70],
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                               '#99cc33', '#ee9b36', '#fb9847', '#e0853a', '#b5723c', '#f7b565', '#f7b565'
                            ];
                            return colorList[params.dataIndex]
                        },
                        label: {
                            position: 'inner'
                        },
                        labelLine: {
                            show: false
                        },
                    }

                },
                data: [
                  { value: _NoPricedByNationalValue, name: _NoPricedByNational },
                  { value: _PricedByNationalValue, name: _PricedByNational }
                ]
            },
            {
                type: 'pie',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            // build a color map as your need.
                            var colorList = [
                             '#b6dd86', '#fbac6c', '#fbc497', '#fbd4b5', '#c9e3aa', '#d8edc0'
                            ];
                            return colorList[params.dataIndex]
                        },
                        borderColor: '#fff'
                    }

                },
                radius: [100, 140],
                data: [
              { value: _NoPricedByNationalValue, name: _NoPricedByNational },
              { value: _GeneralPriceValue, name: _GeneralPrice },
              { value: _SeparatePriceValue, name: _SeparatePrice }
                ]
            }
        ]
    };

    // pie
    var option1 = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}%"
        },
        calculable: false,
        series: [
            {
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: _IncludedInLowPriceValue, name: _IncludedInLowPrice },
                    { value: _ExcludedInLowPriceValue, name: _ExcludedInLowPrice }
                ]
            }
        ]
    };

    myChart3.setOption(option3);
    myChart1.setOption(option1);
    window.onresize = function () {
        myChart3.resize();
        myChart1.resize();
    }

    //show tad data
    var companyId = $("#companyId").val();

    $(".nav-pills li").bind('click', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass("active");
        if (_this.is("#NationalMaxPrice")) {
            GetContentByTab("/Company/GetMaxPriceList", companyId, 1, 10);
        } else {
            GetContentByTab("/Company/GetLowPriceList", companyId, 1, 10);
        }
    })
    //init
    $("#NationalMaxPrice").click();
})
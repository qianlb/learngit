$(function () {
    var pricingId = $("#pricingId").val();
    GetMapAndBarchart(pricingId);
    window.onresize = function () {
        myChart1.resize();
        myChart2.resize();
    }
})


function GetMapAndBarchart(pricingId) {
    var arr = [];
    $.ajax({
        type: "post",
        async: false,
        url: "/Pricing/GetMaxRetailPricingChartData",
        data: { pricingId: pricingId },
        datatype: "json",
        success: function (jsonString) {
            for (var i = 0; i < jsonString.length; i++) {
                var obj = {};
                obj.name = jsonString[i].Region;
                obj.value = jsonString[i].Pricing;
                arr.push(obj);
            }
        }
    })
    
    var myChart1 = echarts.init(document.getElementById('mapCon'));
    myChart1.setOption({
        color: {},
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>￥{c}'
        },
        dataRange: {
            orient: 'horizontal', // 'vertical'
            color: ['#6f5a37', '#c6af7e', '#e8d8ae', '#fff6da'],
            splitNumber: 0,
            text: ['Max', 'Min'],            // 文本，默认为数值文本
            min: 0,
            max: 2000
        },
        series: [
            {
                type: 'map',
                mapType: 'china',
                selectedMode: 'single',
                roam: false,
                itemStyle: {
                    normal: { label: { show: false } },
                    emphasis: { label: { show: false } }
                },
                data: [{ name: '安徽省', id: 111, value: 1141.56 }, { name: '北京市', id: 111, value: 2000 }, { name: '重庆', value: 1141 }, { name: '福建', value: 1141 }, { name: '甘肃', value: 1141 }, { name: '广东', value: 1141 }, { name: '广西', value: 1141 }, { name: '贵州', value: 1141 }, { name: '海南', value: 1141 }, { name: '河北', value: 1141 }, { name: '黑龙江', value: 1141 }, { name: '河南', value: 1141 }, { name: '湖北', value: 900 }, { name: '湖南', value: 1141 }, { name: '内蒙古', value: 1141 }, { name: '江苏', value: 1141 }, { name: '江西', value: 1141 }, { name: '吉林', value: 1141 }, { name: '辽宁', value: 0 }, { name: '宁夏', value: 900 }, { name: '青海', value: 1141 }, { name: '陕西', value: 1141 }, { name: '山东', value: 1141 }, { name: '上海', value: 2000 }, { name: '山西', value: 1141 }, { name: '四川', value: 1141 }, { name: '天津', value: 1141 }, { name: '西藏', value: 2000 }, { name: '新疆', value: 900 }, { name: '云南', value: 1141 }, { name: '浙江', value: 1141 }],
            }
        ]
    });
    myChart1.on(echarts.config.EVENT.MAP_SELECTED, function (param) {
        var selected = param.selected;
        var str = '';
        for (var p in selected) {
            if (selected[p]) {
                str += p;
            }
        }
        var url = "#" + str;

        window.top.location = url
    })

    var myChart2 = echarts.init(document.getElementById('proviceCon'));
    var itemStyle = {
        normal: {
            color: function (params) {
                // build a color map as your need.
                var colorList = [
                  '#B9DD7C', '#f7b565', '#e46662', '#d299c8',
                  '#9295ca', '#4279BA', '#37597a', '#B9DD7C', '#f7b565', '#e46662', '#d299c8',
                  '#9295ca', '#4279BA', '#37597a', '#B9DD7C', '#f7b565', '#e46662', '#d299c8',
                  '#9295ca', '#4279BA', '#37597a',
                   '#B9DD7C', '#f7b565', '#e46662', '#d299c8',
                  '#9295ca', '#4279BA', '#37597a',

                ];
                return colorList[params.dataIndex]
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{b}\n{c}'
            }
        }
    };
    // 图表使用-------------------
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        calculable: true,
        grid: {
            borderWidth: 0,
            backgroundColor: '#fff'
        },
        xAxis: [
            {
                axisLine: false,
                splitLine: { show: false },
                type: 'category',
                data: []
            }
        ],
        yAxis: [
            {
                axisLine: false,
                type: 'value'
            }
        ],
        series: [
            {
                name: '2010',
                type: 'bar',
                itemStyle: itemStyle,
                data: [],
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            }
        ]
    };
    myChart2.setOption(option);
}


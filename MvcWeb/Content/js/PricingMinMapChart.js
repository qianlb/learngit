$(function () {
    var pricingId = $("#pricingId").val();
    formulationCode = "1"
    GetPricingMinMapChart(pricingId, formulationCode);
    //单击单选按钮
    $(".formulations label").unbind('click').bind('click', function () {
        var _this = $(this);
        _this.addClass("checked").siblings().removeClass("checked");
        var formulationId = _this.find('input').val();
        GetPricingMinMapChart(pricingId, formulationId);
        GetPricingMinMapTable(pricingId, formulationId);
        return false
    })
});

function GetPricingMinMapTable(pricingId, formulationCode) {
    $.ajax({
        type: "post",
        async: false,
        url: "/Pricing/GetPricingMinDetailMapTableData",
        data: { pricingId: pricingId, formulationCode: formulationCode },
        dataType: "text",
        success: function (data) {
            if (data == "") {
                $("#table-responsive").html("").html('No data available').removeClass("div-response");
            }
            else {
                $(".pricingTable").html(data)
            }
        },
        error: function (e) {
            console.log(e)
        }
    })
}

function GetPricingMinMapChart(pricingId, formulationCode) {
    $.ajax({
        type: "post",
        async: true,
        url: "/Pricing/GetPricingMinDetailMapChartData",
        data: { pricingId: pricingId, formulationCode: formulationCode },
        dataType: "json",
        success: function (jsonString) {
            console.log(jsonString);
            var Arry = [];
            if (jsonString == "" || jsonString.ChartData == "[]") {
                $("#mapCon").html('No data available').removeClass("div-response");
            }
            else {// --- 地图 ---
                for (var i = 0; i < jsonString.length; i++) {
                    var flag = "";
                    var obj = {};
                    obj.name = jsonString[i].Region;
                    var DrugName = jsonString[i].DrugName.split(", ");
                    var Formulation = jsonString[i].Formulation.split(", ");
                    for (var j = 0; j < DrugName.length; j++)
                    {
                        if (flag == "") {
                            flag = DrugName[j] + "; " + Formulation[j];
                        } else {
                            flag = flag + "<br/>" + DrugName[j] + "; " + Formulation[j];
                        }
                    }
                    obj.flag = flag == "; " ? " N/A" : flag;
                    obj.value = jsonString[i].Value;
                    obj.id = jsonString[i].PricingId;
                    Arry.push(obj);
                }
                var _language = $('.lanVal').text();
                if(_language == '中文'){
                    var province_map = {
                        '安徽': '安徽省',
                        '新疆': '新疆维吾尔自治区',
                        '甘肃': '甘肃省',
                        '青海': '青海省',
                        '西藏': '西藏自治区',
                        '宁夏': '宁夏回族自治区',
                        '陕西': '陕西省',
                        '四川': '四川省',
                        '重庆': '重庆市',
                        '云南': '云南省',
                        '贵州': '贵州省',
                        '湖南': '湖南省',
                        '广西': '广西壮族自治区',
                        '广东': '广东省',
                        '海南': '海南省',
                        '澳门': '澳门特别行政区',
                        '香港': '香港特别行政区',
                        '台湾': '台湾省',
                        '福建': '福建省',
                        '江西': '江西省',
                        '湖北': '湖北省',
                        '浙江': '浙江省',
                        '上海': '上海市',
                        '江苏': '江苏省',
                        '河南': '河南省',
                        '山西': '山西省',
                        '山东': '山东省',
                        '河北': '河北省',
                        '天津': '天津市',
                        '北京': '北京市',
                        '辽宁': '辽宁省',
                        '吉林': '吉林省',
                        '内蒙古': '内蒙古自治区',
                        '黑龙江': '黑龙江省'
                    };
                }else if(_language == 'English'){
                    var province_map = {
                        '安徽': 'Anhui',
                        '新疆': 'Xinjiang',
                        '甘肃': 'Gansu',
                        '青海': 'Qinghai',
                        '西藏': 'Tibet',
                        '宁夏': 'Ningxia',
                        '陕西': 'Shaanxi',
                        '四川': 'Sichuan',
                        '重庆': 'Chongqing',
                        '云南': 'Yunnan',
                        '贵州': 'Guizhou',
                        '湖南': 'Hunan',
                        '广西': 'Guangxi',
                        '广东': 'Guangdong',
                        '海南': 'Hainan',
                        '澳门': 'Macau',
                        '香港': 'Hong Kong',
                        '台湾': 'Taiwan',
                        '福建': 'Fujian',
                        '江西': 'Jiangxi',
                        '湖北': 'Hubei',
                        '浙江': 'Zhejiang',
                        '上海': 'Shanghai',
                        '江苏': 'Jiangsu',
                        '河南': 'Henan',
                        '山西': 'Shanxi',
                        '山东': 'Shandong',
                        '河北': 'Hebei',
                        '天津': 'Tianjin',
                        '北京': 'Beijing',
                        '辽宁': 'Liaoning',
                        '吉林': 'Jilin',
                        '内蒙古': 'Inner Mongolia',
                        '黑龙江': 'Heilongjiang'
                    };
                }
                
                var myChart1 = echarts.init(document.getElementById('mapCon'));
                myChart1.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (b) {
                            return b["1"] + "<br/>" + b["5"].flag
                        }
                    },
                    dataRange: {
                        orient: 'horizontal', // 'vertical'
                        color: ['#59B370', '#BBED93'],
                        splitNumber: 0,
                        text: ['Low-price drug', 'No low-price drug'],            // 文本，默认为数值文本
                        min: 0,
                        max: 1,
                    },
                    series: [
                        {
                            type: 'map',
                            mapType: 'china',
                            selectedMode: 'single',
                            roam: false,
                            itemStyle: {
                                normal: { label: { show: false }, areaStyle: { color: '#BBED93' } },
                                emphasis: { label: { show: false } }
                            },
                            data: Arry,
                            nameMap: province_map
                        }
                    ]
                });
                myChart1.on(echarts.config.EVENT.MAP_SELECTED, function (param) {
                    var selected = param.target,
                        targetId;
                    for (var i = 0, len = Arry.length; i < len; i++) {
                        if (Arry[i]["name"] === selected) {
                            targetId = Arry[i]["id"];
                        }
                    }
                    if (targetId) {
                        window.top.location = '/Pricing/PricingMinDetail?pricingId=' + targetId;
                    }
                })
                window.onresize = myChart1.resize;
                $("[data-toggle='popover']").popover({
                    html: true
                });
                window.onresize = myChart1.resize;
            }
        }
    })
}

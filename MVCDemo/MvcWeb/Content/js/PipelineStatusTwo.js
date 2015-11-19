$(function () {
    var datas = $.parseJSON($("#chardata2").val());
    var candidateId = "";
    // 图表使用-------------------
    var dataChemName = [];
    var dataChemCount = [];
    if (datas.Chem.ChartData.length > 0) {
        for (var i = 0; i < datas.Chem.ChartData.length; i++) {
            dataChemName.push(datas.Chem.ChartData[i].Key)
            dataChemCount.push(datas.Chem.ChartData[i].Value);
        }
        dataChemName.reverse();
        dataChemCount.reverse();
        datas.Chem.Id.reverse();
        var chemChart = echarts.init(document.getElementById("chart5"));
        var chemOption = {
            tooltip: {
                trigger: 'item'
            },
            calculable: true,
            xAxis: [
                {
                    type: 'value',
                    axisLine: true,
                    axisLabel: { show: true },
                    splitLine: { show: false },
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: dataChemName,
                    axisLine: true,
                    axisLabel: { show: true },
                    splitLine: { show: true },
                }
            ],
            series: [
                {
                    type: 'bar',
                    data: dataChemCount,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                   '#B9DD7C', '#f7b565', '#e46662', '#d299c8', '#9295ca', '#4279BA',
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        };
        chemChart.setOption(chemOption);
        window.onresize = function () {
            chemChart.resize();
        }
        chemChart.on(echarts.config.EVENT.CLICK, function (param) {
            candidateId = datas.Chem.Id[param.dataIndex];
            getPipelineLocation(candidateId, 8);

        })
    }
    var dataBioName = [];
    var dataBioCount = [];
    if (datas.Bio.ChartData.length > 0) {
        for (var i = 0; i < datas.Bio.ChartData.length; i++) {
            dataBioName.push(datas.Bio.ChartData[i].Key)
            dataBioCount.push(datas.Bio.ChartData[i].Value);
        }
        dataBioName.reverse();
        dataBioCount.reverse();
        datas.Bio.Id.reverse();
        var myChart6 = echarts.init(document.getElementById("chart6"));
        var option6 = {
            tooltip: {
                trigger: 'item'
            },
            calculable: true,
            xAxis: [
                {
                    type: 'value',
                    axisLine: true,
                    axisLabel: { show: true },
                    splitLine: { show: false },
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: dataBioName,
                    axisLine: true,
                    axisLabel: { show: true },
                    splitLine: { show: true },
                }
            ],
            series: [
                {
                    type: 'bar',
                    data: dataBioCount,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                   '#B9DD7C', '#f7b565', '#e46662', '#d299c8', '#9295ca', '#4279BA',
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                }
            ]
        };
        myChart6.setOption(option6);
        window.onresize = function () {
            myChart6.resize();
        }
        myChart6.on(echarts.config.EVENT.CLICK, function (param) {
            candidateId = datas.Bio.Id[param.dataIndex];
            getPipelineLocation(candidateId, 7);

        })
    }
    var dataTcmName = [];
    var dataTcmCount = [];
    if (datas.Tcm.ChartData.length > 0) {
        for (var i = 0; i < datas.Tcm.ChartData.length; i++) {
            dataTcmName.push(datas.Tcm.ChartData[i].Key)
            dataTcmCount.push(datas.Tcm.ChartData[i].Value);
        }
        dataTcmName.reverse();
        dataTcmCount.reverse();
        datas.Tcm.Id.reverse();
        var myChart7 = echarts.init(document.getElementById("chart7"));
        var option7 = {
            tooltip: {
                trigger: 'item'
            },
            calculable: true,
            xAxis: [
                {
                    type: 'value',
                    axisLine: true,
                    axisLabel: { show: true },
                    splitLine: { show: false },
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: dataTcmName,
                    axisLine: true,
                    axisLabel: { show: true },
                    splitLine: { show: true },
                }
            ],
            series: [
                {
                    type: 'bar',
                    data: dataTcmCount,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                   '#B9DD7C', '#f7b565', '#e46662', '#d299c8', '#9295ca', '#4279BA',
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                }
            ]
        };
        myChart7.setOption(option7);
        window.onresize = function () {
            myChart7.resize();
        }
        myChart7.on(echarts.config.EVENT.CLICK, function (param) {
            candidateId = datas.Tcm.Id[param.dataIndex];
            getPipelineLocation(candidateId, 42);
        })
    }
})
var paramDefault = "";
function Filter(paramDefault, paramObj, filterObj) {
    if (paramObj.cfda_approval_date != undefined) {
        filterObj["date"] = paramObj.cfda_approval_date;
        // paramDefault = "Filter=" + JSON.stringify(filterObj);
    }
    if (paramObj.cde_acceptance != undefined) {
        filterObj["cde_acceptance_date"] = paramObj.cde_acceptance;
        //  paramDefault = "Filter=" + JSON.stringify(filterObj);
    }
    paramDefault = "filter=" + escape(JSON.stringify(filterObj));
    return paramDefault;

}

function getPipelineLocation(indidationGroupId, dr_register_type) {
    var paramObj = getParamObject();
    var filterObj = {};
    filterObj["inspectiongroup"] = [indidationGroupId];
    filterObj["registrationtype1"] = [dr_register_type];
    if (paramObj != null) {
        //If according to product query
        if (paramObj.product != undefined) {
            filterObj["candidateid"] = paramObj.product;
            paramDefault = Filter(paramDefault, paramObj, filterObj);
        }
        //If according to company query
        if (paramObj.company != undefined) {
            filterObj["companyid"] = paramObj.company;
            paramDefault = Filter(paramDefault, paramObj, filterObj);
        }
        if (paramObj.product == undefined && paramObj.company == undefined) {
            paramDefault = Filter(paramDefault, paramObj, filterObj);
        }
    }
    //window.location.href = "/Pipeline/DirectToPipeline?" + paramDefault;
    window.open("/Pipeline/DirectToPipeline?" + paramDefault);
}
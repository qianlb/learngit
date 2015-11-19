$(function () {
    GetCombinatinAnalysisData();
    GetApplicationTypeData();

    $('.tcm_bic_change').live("click", function () {
        $(this).removeClass("active").siblings().addClass("active");

        var registerType = $(this).find("input").val().trim();

        GetPipelineApplicationStatistics(registerType);
    });

    $('#pipeline_application_statistic').off().on('click', '.btn_level', function () {
        var _this = $(this);
        var registerId = _this.attr("registerid");
        if (_this.is('.icon-minus-circle')) { //收缩
            _this.removeClass("icon-minus-circle").addClass("icon-plus-circle");
            $('tr[parentid=' + registerId + ']').slideUp();
            if (_this.hasClass('level_1')) {
                $('.level_3').addClass("hidden").slideUp();
                $('.btn_level').removeClass("icon-minus-circle icon-plus-circle").addClass("icon-plus-circle");
            }
        }
        else { //展开
            _this.removeClass("icon-plus-circle").addClass("icon-minus-circle");
            $('tr[parentid=' + registerId + ']').removeClass('hidden').slideDown();
        }
    });
    $('#pipeline_application_statistic a').live('click', function () {
        var param = GetParameter();
        var registerId1 = $(this).attr("registerid1"); //register category level 1
        var registerId2 = $(this).attr("registerid2"); //register category level 2
        var registerId3 = $(this).attr("registerid3"); //register category level 3
        var applicationType = $(this).attr("applicationtype");
        var originId = $(this).attr("origin");

        //处理unknown的链接
        if ($(this).parent().siblings().eq(0).text().indexOf("unknown") > 0) {
            var registerId = $(this).parent().parent().attr("parentid");
            if (registerId) {
                param["registrationcategory"] = [registerId];
            }
        } else {
            if (registerId1)
                param["registrationtype1"] = [registerId1];
            if (registerId2)
                param["registerid2"] = [registerId2];
            if (registerId3)
                param["registerid3"] = [registerId3];
        }

        if (applicationType && applicationType.toString() == "0") {
            param["applicationother"] = [applicationType];
        } else if (applicationType && applicationType.toString() != "0") {
            param["applicationType"] = [applicationType];
        }

        if (originId)
            param["origin"] = [originId];
        SetWindowsLocation(param);
    })
})


function GetCombinatinAnalysisData() {
    var param = getParamObject();

    $.ajax({
        url: "/PipelineStats/GetCombinationAnalysisData",
        async: true,
        dataType: "json",
        data: { filter: JSON.stringify(param) },
        success: function (json) {

            var combination_analysis_chart = echarts.init(document.getElementById("combination_analysis"));
            var option = {
                tooltip: {
                    trigger: 'item',
                    //formatter: "{b} : {d}%"
                    formatter: "{b} : {c} ({d}%)"
                },
                calculable: false,
                series: [
                    {
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, 70],
                        itemStyle: {
                            normal: {
                                borderColor: '#FFF',
                                borderWidth: 0.3,
                                color:function(param)
                                {
                                    var colorList = ['#FFAA01', '#7DCBDF']
                                    return colorList[param.dataIndex];
                                },
                                label: {
                                    position: 'inner'
                                },
                                labelLine: {
                                    show: false
                                }
                            }

                        },
                        data: json.Origin
                    },
                    {
                        type: 'pie',
                        radius: [100, 140],
                        itemStyle: {
                            normal: {
                                borderColor: '#FFF',
                                borderWidth: 0.3,
                                color:function(param)
                                {
                                    var colorList = ['#FFD279', '#FFBE3D',
                                    '#FFAA00', '#E19600', '#B8D7DF', '#62C6DF', '#07B3DF', '#479DDF']
                                    return colorList[param.dataIndex];
                                }
                                
                            }

                        },
                        data: json.DrugType
                    }
                ]
            };

            combination_analysis_chart.setOption(option);

            window.onresize = function () {
                combination_analysis_chart.resize();
            }

            //combination_analysis_chart.on(echarts.config.EVENT.CLICK, function (param) {
            //    var origin = "", registerTypeId = "";
            //    if (param.seriesIndex == 0) { //Origin
            //        $(json.OriginDictionary).each(function () {
            //            if (this.Key == param.name) {
            //                origin = this.Value; return;
            //            }
            //        })
            //    }
            //    else { //Register category
            //        $(json.RegisterTypeDictionary).each(function () {
            //            if (this.Key == param.name) {
            //                registerTypeId = this.Value; return;
            //            }
            //        })
            //    }
            //    var parameter = GetParameter();
            //    if (origin) {
            //        parameter["origin"] = [origin];
            //    }
            //    if (registerTypeId.toString() == "0") {
            //        parameter["registrationtypeother"] = [registerTypeId];
            //    } else if (registerTypeId && registerTypeId.toString() != "0") {
            //        parameter["registrationtype1"] = [registerTypeId];
            //    }
            //    SetWindowsLocation(parameter);
            //})
        }
    });
}

function GetApplicationTypeData() {
    var param = getParamObject();

    $.ajax({
        url: "/PipelineStats/GetApplicationTypeData",
        async: true,
        dataType: "json",
        data: { filter: JSON.stringify(param) },
        success: function (json) {

            var application_type_chart = echarts.init(document.getElementById("application_type"));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                calculable: false,
                series: [
                    {
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, 70],
                        itemStyle: {
                            normal: {
                                borderColor: '#FFF',
                                borderWidth: 0.3,
                                color: function (param) {
                                    var colorList = ['#FFD439', '#FC0264',
                                    '#B0DC00', '#FFAA01', '#7DCBDF']
                                    return colorList[param.dataIndex];
                                },
                                label: {
                                    position: 'outter',
                                    rotate: 10
                                },
                                labelLine: {
                                    show: true,
                                    length: 0
                                },
                            }

                        },
                        data: json.ApplicationType
                    },
                    {
                        type: 'pie',
                        radius: [100, 140],
                        itemStyle: {
                            normal: {
                                borderColor: '#FFF',
                                borderWidth: 0.3,
                                color: function (param) {
                                    var colorList = ['#FFE893', '#FFDB57',
                                    '#FFC800', '#C39900', '#FF81B3', '#FF428C', '#FF2279', '#DC0056',
                                    '#D7DC6A', '#BBDC35', '#78DC35', '#00DC09', '#FFD279', '#FFBE3D',
                                    '#FFAA00', '#E19600', '#B8D7DF', '#62C6DF', '#07B3DF', '#479DDF']
                                    return colorList[param.dataIndex];
                                }

                            }

                        },
                        data: json.DrugType
                    }
                ]
            };

            application_type_chart.setOption(option);

            window.onresize = function () {
                application_type_chart.resize();
            }

            //application_type_chart.on(echarts.config.EVENT.CLICK, function (param) {
            //    var applicationTypeId = "", registerTypeId = "";
            //    if (param.seriesIndex == 0) { //Application type
            //        $(json.ApplicationTypeDic).each(function () {
            //            if (this.Key == param.name) {
            //                applicationTypeId = this.Value;
            //                return;
            //            }
            //        })
            //    }
            //    else { //Register category
            //        $(json.RegisterTypeDic).each(function () {
            //            if (this.Key == param.name) {
            //                registerTypeId = this.Value;
            //                return;
            //            }
            //        })
            //    }
            //    var parameter = GetParameter();
            //    if (applicationTypeId.toString() == "0") {
            //        parameter["applicationother"] = [applicationTypeId];
            //    } else if (applicationTypeId && applicationTypeId.toString() != "0") {
            //        parameter["applicationType"] = [applicationTypeId];
            //    }

            //    if (registerTypeId.toString() == "0") {
            //        parameter["registrationtypeother"] = [registerTypeId];
            //    } else if (registerTypeId && registerTypeId.toString() != "0") {
            //        parameter["registrationtype1"] = [registerTypeId];
            //    }
            //    SetWindowsLocation(parameter);
            //})
        }
    });
}

function GetPipelineApplicationStatistics(registerType) {
    var param = getParamObject();
    $.ajax({
        url: '/PipelineStats/GetPipelineApplicationStatistic',
        async: false,
        dataType: "html",
        data: { filters: JSON.stringify(param), drugType: registerType },
        success: function (result) {
            $("#pipeline_application_statistic").html("").html(result);
        }
    });
}

function SetWindowsLocation(parameter) {
    //window.location.href = "/Pipeline/DirectToPipeline?filter=" + escape(JSON.stringify(parameter));
    var url = "/Pipeline/DirectToPipeline?filter=" + escape(JSON.stringify(parameter));
    window.open(url, "_blank");
    e.stopPropagation();
}

function GetParameter() {
    var filterObj = getParamObject();
    var param = {};
    if (filterObj != null) {
        if (filterObj.cfda_approval_date != undefined) {
            param["date"] = filterObj.cfda_approval_date;
        }
        if (filterObj.cde_acceptance != undefined) {
            param["cde_acceptance_date"] = filterObj.cde_acceptance;
        }
        if (filterObj.product != undefined) {
            param["candidateid"] = filterObj.product;
        }
        if (filterObj.company != undefined) {
            param["companyid"] = filterObj.company;
        }
    }

    return param;
}
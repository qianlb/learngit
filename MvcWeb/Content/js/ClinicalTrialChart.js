$(function () {
    var mncid = $("#CompanyGraph .nav-list li").eq(1).attr("id");
    //$("#CompanyGraph .nav-list li").eq(1).addClass("active").siblings().removeClass("active");
    GetCompanyChart(mncid);
});

$("#CompanyGraph .nav-list li").live('click', function () {
    var _this = $(this);
    $(this).addClass("active").siblings().removeClass("active");
    var mncid = _this.attr("id");
    GetCompanyChart(mncid);
})
//UTCToLocal($('.container-fluid'));


function GetCompanyChart(mncid) {
    $.ajax({
        type: "post",
        async: true,
        url: "/ClinicalTrial/AnalyticsSnapshotCompany",
        data: { mncid: mncid },
        dataType: "json",
        success: function (jsonString) {
            if (jsonString == "" || jsonString.ChartData == "[]") {
                $("#companyChart").html('No data available').removeClass("div-response");;
            } else
            {
                chartdata = $.parseJSON(jsonString.ChartData)
                var year="";
                var CTStartCount = "";
                var CTComplationCount = "";
                var testData = "";

                $.each(chartdata, function (index, d) {
                    year = ((year == "") ? d.year : year + ',' + d.year)
                    CTStartCount = ((CTStartCount == "") ? d.CTStartCount : CTStartCount + ',' + d.CTStartCount)
                    CTComplationCount = ((CTComplationCount == "") ? d.CTComplationCount : CTComplationCount + ',' + d.CTComplationCount)
                  
                })
                testData = '{"year":[' + year + '],"CTStartCount":[' + CTStartCount + '],"CTComplationCount":[' + CTComplationCount + ']}';
               
                testData = eval('(' + testData + ')');
                var myChart2 = echarts.init(document.getElementById('companyChart'));
                var option = {
                    tooltip: {
                        show :false,
                        trigger: 'axis'
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: ['# CT Start', '# CT Completion']
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: testData.year
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: ''
                            }
                        }
                    ],
                    series: [
                        {
                            name: '# CT Start',
                            type: 'line',
                            data: testData.CTStartCount,
                           
                        },
                        {
                            name: '# CT Completion',
                            type: 'line',
                            data: testData.CTComplationCount,
                            
                        }
                    ]

                };
                myChart2.setOption(option);
                window.onresize = myChart2.resize;
            }

            
        }
    });
}



$(function () {
    function DrawChart() {
        var myChart = echarts.init(document.getElementById('graphic'));
        var tenderid = $("#tenderid").val();
        $.ajax({
            type: "post",
            async: true,
            url: "/Tendering/TenderResultDetailProductTrendByID",
            data: { tenderResultID: tenderid },
            success: function (json) {
                if (json == "") {
                    $("#graphic").html('No data available').addClass('chart');
                } else {
                    // 图表使用-------------------
                    var year = [];
                    var price = [];
                    for (var i = 0, len = json.length; i < len; i++) {
                        year.push(json[i]["Year"]);
                        price.push(json[i]["TenderPrice"]);
                    }
                    var option = {
                        tooltip: {
                            trigger: 'axis',
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: year
                               
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                type: 'line',
                                data: price
                                
                                
                            }
                        ]
                    };
                    myChart.setOption(option);
                    window.onresize = myChart.resize;
                }
            }
        });
        
    }
    DrawChart()
})

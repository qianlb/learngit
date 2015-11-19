$(function () {
    var drawGraphic = function (id, count, name) {
        //  var _countJson = $.parseJSON("[" + count + "]");
        // srcipt标签式引入
        var myChart = echarts.init(document.getElementById(id));
        // 图表使用-------------------
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: false
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    //  data: eval("["+name+"]")
                    data: name
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            dataZoom: {
                show: true,
                realtime: true,
                height: 20,
                start: 0,
                end: 100
            },
            series: [
                {
                    type: 'line',
                    //  data: [56, 98, 120, 678, 56, 57, 90, 156, 76, 359, 388, 470]
                    data: count
                }
            ]
        };

        myChart.setOption(option);
        window.onresize = myChart.resize;
    }
   
    $(".application-timeline ul li").each(function (index) {
        var _this = $(this);
        _this.click(function () {
            $("#tab" + (index + 1)).addClass("active").siblings().removeClass("active")
            var countSet = [];
            var dateSet = [];
            if (index === 1) {
                var jsonGraphic1 = $.parseJSON($("#JsonGraphic1").val());
                for (var i = 0; i < jsonGraphic1.length; i++) {
                    countSet.push(jsonGraphic1[i].Count);
                    dateSet.push(jsonGraphic1[i].Date);
                }
                drawGraphic("Graphic1", countSet, dateSet);
            } else if (index === 2) {
                //加载图表
                var jsonGraphic2 = $.parseJSON($("#JsonGraphic2").val());
                for (var i = 0; i < jsonGraphic2.length; i++) {
                    countSet.push(jsonGraphic2[i].Count);
                    dateSet.push(jsonGraphic2[i].Date);
                }
                drawGraphic("Graphic2", countSet, dateSet);
            }
        })
    })
    //set completed and line 
    var lastItem = $(".application-timeline li").last();
    var a = lastItem.prev().find("span.icon-check");
    var b = lastItem.find("span.icon-check");
    var completedCount, totalCount = $(".application-timeline li").length;

    if (b.length == 0) {
        if (a.length > 0) {
            lastItem.addClass("completed");
            completedCount = lastItem.prevAll().length + 1;
        }
        else {
            completedCount = lastItem.prevAll().length;
        }
    }
    else
    {
        completedCount = $(".application-timeline li").length;
    }
    var percent = (completedCount - 1) / (totalCount - 1);
    $(".application-timeline div.progress-indicator").css("width", percent*100 + "%");
})

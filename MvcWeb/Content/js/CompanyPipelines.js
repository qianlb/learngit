$(function () {
    var tableContent = function () {
        var companyID = window.location.href.split("=")[1];
        $.ajax({
            type: "POST",
            url: "/Company/GetCompanyPipelineTable",
            data: { companyID: companyID, page: $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1 },
            success: function (htmlData) {
                $("#tableContent").html(htmlData);
                var totalPage = parseInt($("#Total").val()), currentPage = parseInt($("#CurrentPageIndex").val());
                createPage(totalPage, currentPage, 10, tableContent);
            }
        });
    }
    //create chart start
    var pipelineTrendsData = $("#pipelineTrendsData").val();
    var pipelineTrendsArr = [];
    pipelineTrendsData = JSON.parse(pipelineTrendsData);
    for (var key in pipelineTrendsData) {
        var item = {};
        item["name"] = key;
        item["y"] = pipelineTrendsData[key];
        pipelineTrendsArr.push(item);
    }
    createPipelineTrendsChart(pipelineTrendsArr);
    //create chart end

    //cretae page
    var totalPage = parseInt($("#Total").val()), currentPage = parseInt($("#CurrentPageIndex").val());
    createPage(totalPage, currentPage, 10, tableContent);
})

function createPipelineTrendsChart(pipelineTrendsArr) {
    //$('#pipelineTrends>*').remove();
    //if (!pipelineTrendsArr || !pipelineTrendsArr.length) {
    //    return;
    //}
    //var barChart = new GBIChart.BarChart();
    //barChart.selector = "#pipelineTrends";
    //barChart.data = pipelineTrendsArr;
    //barChart.yPoint = 0;
    //barChart.spacing = 0.4;
    //barChart.color = ["#f7b565", "#60c191", "#4279BA", "#e46662", "#d299c8", "#37597a", "#B9DD7C", "#9295ca", "#F2F4F7", " #BDC1C3"];
    //barChart.top = 30;
    //barChart.right = 10;
    //barChart.left = 120;
    //barChart.bottom = 100;
    //barChart.width = 350;
    //barChart.height = 350;
    //barChart.optimize = true;
    //barChart.categoryField = "name";
    //barChart.tipTextCallBack = function (d, data) {
    //    return "<span style='color:white'>"+ parseInt(d.value) + "</span>";
    //};
    //barChart.write("createRotateBarChart");
    var catedata = [], data = [];
    for (var i = 0, len = pipelineTrendsArr.length; i < len; i++) {
        catedata.push(pipelineTrendsArr[i]['name']);
        data.push(pipelineTrendsArr[i]['y']);
    }
    data.reverse();
    var myChart = echarts.init(document.getElementById('pipelineTrends'));
    var itemStyle = {
        normal: {
            color: function (params) {
                // build a color map as your need.
                var colorList = [
                  '#B9DD7C', '#f7b565', '#e46662', '#d299c8',
                  '#9295ca', '#4279BA', '#37597a', '#B9DD7C', '#f7b565', '#e46662', '#d299c8'
                ];
                return colorList[params.dataIndex]
            }
        }
    };
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        xAxis: [
            {
                axisLine: false,
                type: 'value'
            }
        ],
        yAxis: [
            {
                axisLine: false,
                splitLine: { show: false },
                type: 'category',
                data: ['E','D','C','B','A']
                //data: ['A', 'B', 'C', 'D', 'E']
            }
        ],
        series: [
            {
                type: 'bar',
                itemStyle: itemStyle,
                data: data
            }

        ]
    };

    myChart.setOption(option);
    window.onresize = myChart.resize;


    var htmls = $('<tr><td align="center">A</td><td>' + catedata[0] + '</td></tr>'
        + '<tr><td align="center">B</td><td>' + catedata[1] + '</td></tr>'
       + '<tr><td align="center">C</td><td>' + catedata[2] + '</td></tr>'
       + '<tr><td align="center">D</td><td>' + catedata[3] + '</td></tr>'
       + '<tr><td align="center">E</td><td>' + catedata[4] + '</td></tr>')
    $("#description tbody").find("tr:not('#firstont')").remove()
    $("#description tbody").append(htmls);
}


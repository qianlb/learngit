$(function () {
    var json = {};
    var Lang = $("#Lang").val();
    GetTopTenProductGraph(1);

    //$("#productType, #productSort").unbind("change").bind("change", function () {
    //    GetTopTenProductGraph(1);
    //});

    //$(".pageBoxProduct a").unbind("click").bind("click", function () {
    //    var currentPage = $(".pageBoxProduct .customPage").val() || $(this).attr("pageid") || 1;
    //    GetTopTenProductGraph(currentPage);
    //})

    $("#productType, #productSort").delegate("select","change", function () {
        GetTopTenProductGraph(1);
    });

    $(".pageBoxProduct").delegate("a","click", function () {
        var currentPage = $(".pageBoxProduct .customPage").val() || $(this).attr("pageid") || 1;
        GetTopTenProductGraph(currentPage);
    })


    function GetLastLevelCode() {
        var _this = $("#level select");
        var arr = [];
        for (var i = 0; i < _this.length; i++) {
            var select = _this.eq(i);
            if (select.val() != "0") {
                arr.push(select.val());
            }
        }
        if (arr.length > 0) {
            code = arr[arr.length - 1];
        } else {
            code = "";
        }
        return code;
    }
    function getRequestParam() {

        json["code"] = GetLastLevelCode();
        json["type"] = $("#productType select").val() != "0" ? $("#productType select").val() : "";
        //json["pageIndex"] = $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        json["order"] = $("#productSort select").val() != "0" ? $("#productSort select").val() : "";
        return json;
    }
    function GetOrderString() {
        var orderString = "";
        var param = getRequestParam();
        switch (param.order) {
            
            case "registration":
                orderString = GetCNEN(" (按照有效注册公司数排序)", " with valid registrations");
                break;
            case "IND":
                orderString = GetCNEN(" (按照临床申请公司数排序)", " with IND applications");
                break;
            case "NDA":
                orderString = GetCNEN(" (按照新药申请 (上市申请)公司数排序)", " with NDA applications");
                break;
            case "Generics":
                orderString = GetCNEN(" (按照仿制药申请公司数排序)", " with Generics applications");
                break;
            default:
                orderString = GetCNEN(" (按照有效注册公司数排序)", " with valid registrations");
                break;
        }
        return orderString;
    }
    function GetLastLevelName() {
        var _this = $("#level select");
        var arr = [];
        for (var i = 0; i < _this.length; i++) {
            var select = _this.eq(i);
            if (select.val() != "0") {
                arr.push(select.find("option:selected").text());
            }
        }
        if (arr.length > 0) {
            levelName = arr[arr.length - 1];
        } else {
            levelName = "";
        }
        return levelName;
    }
    function GetCNEN(cn, en) {
        var CNENString = "";
        if (Lang == "cn") {
            CNENString = cn;
        } else {
            CNENString = en;
        }
        return CNENString;
    }
    function GetTitleString() {
        var titleString = "";
        var param = getRequestParam();
        if (param.code == "0" || param.code == "") {
            if (Lang == "cn") {
                titleString = "所有ATC层级下的前十产品 " + GetOrderString();
            } else {
                titleString = "Top 10 products in all ATC levels rank by number of products " + GetOrderString();
            }
        } else {
            if (Lang == "cn") {
                titleString = "关于" + GetLastLevelName() + "的前十产品 " + GetOrderString();
            } else {
                titleString = "Top 10 products of " + GetLastLevelName() + " rank by number of products " + GetOrderString();
            }
        }
        return titleString;
    }

    function GetTopTenProductGraph(page) {
        
        $(".productTitle").html(GetTitleString());
        var param = getRequestParam();
        json["pageIndex"] = page;
        $.ajax({
            type: 'post',
            async: false,
            url: '/Tools/GetViewByProductChart',
            data: param,
            success: function (json) {
                if (!json || json.length < 1) {
                    $("#graphic").html("No data available").removeClass("div-response");
                }
                else {
                    var chartData = {};
                    chartData["categoryForChart"] = [];
                    chartData["category"] = [];
                    chartData["registration"] = [];
                    chartData["ind"] = [];
                    chartData["nda"] = [];
                    chartData["generics"] = [];
                    var html = "";
                    for (var i = 0; i < json.ChartData.length; i++) {
                        if ($('#navbar-collapse-01 .dropdown > a').text() == 'English') {
                            chartData.categoryForChart.push(json.ChartData[i].ProductNameForChart.split('\n')[0]);
                        } else {
                            chartData.categoryForChart.push(json.ChartData[i].ProductNameForChart.split('\n')[1]);
                        }

                        chartData.category.push(json.ChartData[i].ProductName);
                        chartData.registration.push((json.ChartData[i].RegistrationCount));
                        chartData.ind.push((json.ChartData[i].INDCount));
                        chartData.nda.push((json.ChartData[i].NDACount));
                        chartData.generics.push((json.ChartData[i].GenericsCount));
                    }
                    for (var j = 0; j < json.TableData.length ; j++) {
                        html += "<tr><td><a href='/Product/ProductDetail?productId=" + json.TableData[j].ProductId + "'>" + json.TableData[j].ProductName + "</a></td><td>" + formatNumber(json.TableData[j].RegistrationCount) + "</td><td>" + formatNumber(json.TableData[j].INDCount) + "</td><td>" + formatNumber(json.TableData[j].NDACount) + "</td><td>" + formatNumber(json.TableData[j].GenericsCount) + "</td></tr>";
                    }
                    $("#tableList").html(html);
                    setPage(json.TotalCount, param.pageIndex, 10, $(".pageBoxProduct"));
                    CreateChart(chartData);
                }
            }
        });
    }
    function setPage(totalNum, currentPage, pageSize, outputDiv) {
        if (!totalNum) {
            $(".pageBoxProduct").html("");
            return false;
        }
        var _curpage = parseInt(currentPage),
            _totalPage = Math.ceil(totalNum / pageSize),
            _showPages = 7,
            _startPage = 0,
            _endPage = 0,
            _pageHtml = "<div class='pagination pagenum'><ul>";
        maxPage = _totalPage;
        if (_showPages >= _totalPage) {
            _startPage = 1;
            _endPage = _totalPage;
        } else {
            if (parseInt(_curpage) <= _showPages / 2) {
                _startPage = 1;
                _endPage = _showPages;
            } else if ((parseInt(_curpage) + _showPages / 2) > _totalPage) {
                _startPage = _totalPage - _showPages + 1;
                _endPage = _totalPage;
            } else {
                _startPage = parseInt(_curpage) - (_showPages - 1) / 2;
                _endPage = parseInt(_curpage) + _showPages / 2;
            }
        }
        _startPage = _startPage;
        _endPage = Math.floor(_endPage);
        if (_curpage > 1) {
            _pageHtml += " <li class='prevPage'><a href='javascript:void(0)' pageId=\"" + (_curpage - 1) + "\"  class='icon-arrow-left3 prevPage'></a></li> ";
        }
        for (var i = _startPage, len = _endPage; i <= len; i++) {
            var curPageStyle = (i == _curpage ? "class=\"active\"" : "");
            _pageHtml += "<li " + curPageStyle + "><a href='javascript:void(0)' pageId=\"" + i + "\" >" + i + "</a></li>";
        }
        if (_curpage < _totalPage) {
            _pageHtml += "<li class='nextPage'><a href='javascript:void(0)' pageId=\"" + (_curpage + 1) + "\" class='icon-arrow-right3 nextPage'></a></li>";
        }

        var pageBox = $(".pageBoxProduct").html("").html('' + _pageHtml + '</ul></div><div class="pagination"><ul><li class="pagination-input"><input type="number" min="1" value="" placeholder="..." class="form-control flat input-sm customPage"></li><li>&nbsp;&nbsp;' + formatNumber(_totalPage) + '&nbsp;&nbsp;</li> <li class="next"><a href="javascript:void(0)" class="icon-arrow-right3 pageGo">&nbsp;&nbsp;GO</a></li></ul></div>');

        $(".count > span").html("").html(formatNumber(totalNum) + "");
    }
    function CreateChart(chartData) {
        var myChart1 = echarts.init(document.getElementById("chart2"));
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (param) {
                    var s = param[0].name + '<br>';
                    for (var i = param.length - 1; i >= 0; i--) {
                        s += param[i].seriesName + ':' + param[i].value + '<br>';
                    }
                    return s;
                }
            },
            grid: {
                x2: 2
            },
            legend: {
                data: [GetCNEN("注册", "Registration"), GetCNEN("临床申请", "IND"), GetCNEN("新药申请", "NDA"), GetCNEN("仿制药申请", "Generics")],
                y: 'bottom'
            },

            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: chartData.categoryForChart,
                    axisLine: { show: false },
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: 10,
                        margin: 0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: { show: false }
                }
            ],
            series: [
                {
                    name: GetCNEN("注册", "Registration"),
                    type: 'bar',
                    stack: 'Product',
                    data: chartData.registration
                },
                {
                    name: GetCNEN("临床申请", "IND"),
                    type: 'bar',
                    stack: 'Product',
                    data: chartData.ind
                },
                {
                    name: GetCNEN("新药申请", "NDA"),
                    type: 'bar',
                    stack: 'Product',
                    data: chartData.nda
                },
                {
                    name: GetCNEN("仿制药申请", "Generics"),
                    type: 'bar',
                    stack: 'Product',
                    data: chartData.generics
                },
            ]
        };
        myChart1.setOption(option);
        window.onresize = function () {
            myChart1.resize();
        }
    }
})
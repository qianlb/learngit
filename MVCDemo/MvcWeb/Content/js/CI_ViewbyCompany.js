$(function () {
    (function () {
        var json = {};
        var Lang = $("#Lang").val();
        var currentPage = $(".pageBoxCompany .customPage").val() || $(this).attr("pageid") || 1;
        GetTopTenCompaniesGraph(currentPage);

        //$("#companyType, #companySort").unbind("change").bind("change", function () {
        //    GetTopTenCompaniesGraph(1);
        //});

        //$(".pageBoxCompany a").unbind("click").bind("click", function () {
        //    var currentPage = $(".pageBoxCompany .customPage").val() || $(this).attr("pageid") || 1;
        //    GetTopTenCompaniesGraph(currentPage);
        //})

        $("#companyType, #companySort").delegate("select", "change", function () {
            GetTopTenCompaniesGraph(1);
        });

        $(".pageBoxCompany").delegate("a","click", function () {
            var currentPage = $(".pageBoxCompany .customPage").val() || $(this).attr("pageid") || 1;
            GetTopTenCompaniesGraph(currentPage);
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
        function getRequestParamViewByCompany() {

            json["code"] = GetLastLevelCode();
            json["type"] = $("#companyType select").val() != "0" ? $("#companyType select").val() : "";
            //json["pageIndex"] = $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
            json["order"] = $("#companySort select").val() != "0" ? $("#companySort select").val() : "";
            return json;
        }


        function GetOrderString() {
            var orderString = "";
            var param = getRequestParamViewByCompany();
            switch (param.order) {
                case "registration":
                    orderString = GetCNEN(" (按照有效注册产品数排序)", " with valid registrations");
                    break;
                case "IND":
                    orderString = GetCNEN(" (按照临床申请产品数排序)", " with IND applications");
                    break;
                case "NDA":
                    orderString = GetCNEN(" (按照新药申请 (上市申请)产品数排序)", " with NDA applications");
                    break;
                case "Generics":
                    orderString = GetCNEN(" (按照仿制药申请产品数排序)", " with Generics applications");
                    break;
                default:
                    orderString = GetCNEN(" (按照有效注册产品数排序)", " with valid registrations");
                    break;
            }
            return orderString;
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
            var param = getRequestParamViewByCompany();
            if (param.code == "0" || param.code == "") {
                if (Lang == "cn") {
                    titleString = "所有ATC层级下的前十公司" + GetOrderString();
                } else {
                    titleString = "Top 10 companies in all ATC levels rank by number of companies" + GetOrderString();
                }
            } else {
                if (Lang == "cn") {
                    titleString = "关于" + GetLastLevelName() + "的前十公司" + GetOrderString();
                } else {
                    titleString = "Top 10 companies of " + GetLastLevelName() + " rank by number of companies" + GetOrderString();
                }
            }
            return titleString;
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

        function GetTopTenCompaniesGraph(page) {
            $(".companyTitle").html(GetTitleString());
            var param = getRequestParamViewByCompany();
            json["pageIndex"] = page;
            $.ajax({
                type: 'post',
                async: false,
                url: '/Tools/GetViewByCompanyChart',
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
                                chartData.categoryForChart.push(json.ChartData[i].CompanyNameForChart.split('\n')[0]);
                            } else {
                                chartData.categoryForChart.push(json.ChartData[i].CompanyNameForChart.split('\n')[1]);
                            }
                            chartData.category.push(json.ChartData[i].CompanyName);
                            chartData.registration.push((json.ChartData[i].RegistrationCount));
                            chartData.ind.push((json.ChartData[i].INDCount));
                            chartData.nda.push((json.ChartData[i].NDACount));
                            chartData.generics.push((json.ChartData[i].GenericsCount));
                        }
                        for (var j = 0; j < json.TableData.length ; j++) {
                            html += "<tr><td><a href='/Company/CompanyDetail?companyID=" + json.TableData[j].CompanyId + "'>" + json.TableData[j].CompanyName + "</a></td><td>" + formatNumber(json.TableData[j].RegistrationCount) + "</td><td>" + formatNumber(json.TableData[j].INDCount) + "</td><td>" + formatNumber(json.TableData[j].NDACount) + "</td><td>" + formatNumber(json.TableData[j].GenericsCount) + "</td></tr>";
                        }
                        $("#tableList").html(html);
                        setPage(json.TotalCount, param.pageIndex, 10, $(".pageBoxCompany"));
                        CreateChart(chartData);
                    }
                }
            });
        }
        function setPage(totalNum, currentPage, pageSize, outputDiv) {
            if (!totalNum) {
                $(".pageBoxCompany").html("");
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

            var pageBox = $(".pageBoxCompany").html("").html('' + _pageHtml + '</ul></div><div class="pagination"><ul><li class="pagination-input"><input type="number" min="1" value="" placeholder="..." class="form-control flat input-sm customPage"></li><li>&nbsp;&nbsp;' + formatNumber(_totalPage) + '&nbsp;&nbsp;</li> <li class="next"><a href="javascript:void(0)" class="icon-arrow-right3 pageGo">&nbsp;&nbsp;GO</a></li></ul></div>');

            $(".count > span").html("").html(formatNumber(totalNum) + "");
        }
        function CreateChart(chartData) {
            var myChart1 = echarts.init(document.getElementById("chart1"));
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
                        //console.log(param[0].value);
                        return s;
                    }
                },
                grid: {
                    x2: 2
                },
                legend: {
                    data: [GetCNEN("注册", "Registration"), GetCNEN("临床申请", "IND"), GetCNEN("新药申请", "NDA"), GetCNEN("仿制药申请", "Generics")],
                    y: 'top'
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
                        stack: 'Company',
                        data: chartData.registration
                    },
                    {
                        name: GetCNEN("临床申请", "IND"),
                        type: 'bar',
                        stack: 'Company',
                        data: chartData.ind
                    },
                    {
                        name: GetCNEN("新药申请", "NDA"),
                        type: 'bar',
                        stack: 'Company',
                        data: chartData.nda
                    },
                    {
                        name: GetCNEN("仿制药申请", "Generics"),
                        type: 'bar',
                        stack: 'Company',
                        data: chartData.generics
                    },

                ]
            };
            myChart1.setOption(option);
            window.onresize = function () {
                myChart1.resize();
            }
        }
    })()
})
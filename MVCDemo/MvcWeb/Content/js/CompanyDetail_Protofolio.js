$(function () {
    (function () {
        if (!window.Cache) {
            window.Cache = {}
        }
        if (!window.Cache.OrderMapping) {
            window.Cache.OrderMapping = {
                "icon-sort-up": "ASC",
                "icon-sort-down": "DESC",
                "icon-unsorted": null,
                "ASC": "icon-sort-up",
                "DESC": "icon-sort-down",
                "null": "icon-unsorted",
                "": "icon-unsorted"
            }
        }
    })();

    $(".isvalid").each(function (index) {
        var _this = $(this);
        _this.bind('click', function (e) {
            _this.addClass("active").siblings().removeClass("active");
            $(".isShowTab").eq(index).show().siblings(".isShowTab").hide();
            ValidApplicationClickCallback({ pageIndex: 1 });
        });
    });

    $($(".nav.nav-list-primary li")[0]).addClass("active");

    var createCompanyPortfolioPieChart = function (para1) {
        cretaePieChart(JSON.parse($("#GraphicData").val()).map(function (value, index) {
            return {
                name: value.AtcCode, value: value[$(".radio.radio-inline.checked").data("graph")], selected:
                    (((para1 === undefined) ? (index === 0) : (value.AtcCode === para1)) ? true : undefined)
            };
        }));
    }

    createCompanyPortfolioPieChart();

    $(".needClick").click(function () {
        $(this).parent().addClass("active").siblings().removeClass("active");
        createCompanyPortfolioPieChart($(this).children("span").text());
        ValidApplicationClickCallback({ pageIndex: 1, orderBy: null, orderSeq: null });
        NewApplicationClickCallback({ pageIndex: 1, orderBy: null, orderSeq: null });

    });

    $(".radio.radio-inline").click(function () {
        $(this).addClass("checked").siblings().removeClass("checked");
        createCompanyPortfolioPieChart();
        $("#ValidApplication,#NewApplication").hide();
        $($(this).data("relatedselecto")).show();
    });

});

function cretaePieChart(dataResult) {
    // 图表实例化------------------
    // srcipt标签式引入
    var myChart = echarts.init(document.getElementById('graphic'));
    // 图表使用-------------------
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a}{b} : {c} ({d}%)"
        },
        animation: false,
        toolbox: {
            show: true,
            feature: {
                magicType: {
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'center',
                            max: 1548
                        }
                    }
                }
            }
        },
        calculable: false,
        series: [
            {
                type: 'pie',
                radius: ['50%', '70%'],
                //selectedMode: 'single',
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'center',
                            formatter: function (a) {
                                if (a.data.selected)
                                    return a.percent + "%";
                            },
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: {
                        label: {
                            show: false,
                            formatter: "{d}%",
                            position: 'center',
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    }
                },
                data: dataResult
            }
        ]
    };
    myChart.setOption(option);
    window.onresize = myChart.resize;
}
function createPage(totalNum, currentPage, pageSize, pageContainer, tableSelector, url) {
    if (!totalNum) {
        $(pageContainer).html("");
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
        _pageHtml += " <li class='prevPage'><a href='javascript:void(0)' pageId=\"" + (_curpage - 1) + "\"  class='icon-arrow-left3 prevPage'></a></li> "
    }
    for (var i = _startPage, len = _endPage; i <= len; i++) {
        var curPageStyle = (i == _curpage ? "class=\"active\"" : "");
        _pageHtml += "<li " + curPageStyle + "><a href='javascript:void(0)' pageId=\"" + i + "\" >" + i + "</a></li>"
    }
    if (_curpage < _totalPage) {
        _pageHtml += "<li class='nextPage'><a href='javascript:void(0)' pageId=\"" + (_curpage + 1) + "\" class='icon-arrow-right3 nextPage'></a></li>"
    }

    var pageBox = $(pageContainer).html("").html('' + _pageHtml + '</ul></div><div class="pagination"><ul><li class="pagination-input"><input type="number" min="1" value="" placeholder="..." class="form-control flat input-sm customPage"></li><li>&nbsp;&nbsp;' + formatNumber(_totalPage) + '&nbsp;&nbsp;</li> <li class="next"><a href="javascript:void(0)" class="icon-arrow-right3 pageGo">&nbsp;&nbsp;GO</a></li></ul></div>');

    $(pageContainer).children(".count > span").html("").html(formatNumber(totalNum) + "");
    setPageEventListener(pageBox.find(".pageGo"), pageBox.find("a[pageid]").parent("li"), pageContainer, tableSelector, url);
}
function setPageEventListener(pageGo, pageid, pageContainer, tableSelector, url) {
    var _this = this, pageBox = $(".pageBox");
    pageGo.unbind('click').bind('click', function () {
        //getPartialViewData();
        tableSelector(url)
    });
    pageid.unbind('click').bind('click', function () {
        if ($(this).hasClass("prevPage")) {
            curLink = pageBox.find(".active").prev();
        } else if ($(this).hasClass("nextPage")) {
            curLink = pageBox.find(".active").next();
        } else {
            curLink = $(this);
        }
        curLink.addClass("active").siblings().removeClass("active");
        //getPartialViewData();
        tableSelector(url)
    });
}
var ValidApplicationClickCallbackOrderBind = function () {
    if ($("#ValidApplicationPageContent").data("orderby") && $("#ValidApplicationPageContent").data("orderseq")) {
        $("#ValidApplication").find("[orderat='" + $("#ValidApplicationPageContent").data("orderby") + "']").addClass("active").find("span").attr("class", window.Cache.OrderMapping[$("#ValidApplicationPageContent").data("orderseq")]);
    }
    var orderElms = $("#ValidApplication").find("[orderat]");
    orderElms.unbind('click').bind('click', function () {
        var $this = $(this);
        $this.addClass("active").siblings().removeClass("active");
        $this.siblings().find("span.icon-sort-down,span.icon-sort-up,span.icon-unsorted").attr("class", "icon-unsorted");
        if ($this.find("span.icon-sort-up").length) {
            $this.find("span").attr("class", "icon-sort-down");
        } else {
            $this.find("span").attr("class", "icon-sort-up");
        }
        ValidApplicationClickCallback({ pageIndex: 1 });
    }).css("cursor", "pointer");
}
var ValidApplicationClickCallback = function (paras) {
    $.post("/Company/PortfolioValidRegistration"
        , {
            companyId: (paras && paras.companyID) ? paras.companyID : $("#companyId").val()
            , atcCode: $(".nav.nav-list-primary li.active span").text()
            , isValid: $(".isvalid.active").data("type")
            , pageIndex: (paras && paras.pageIndex) ? paras.pageIndex : ($("#ValidApplicationPageContent .customPage").val() || $("#ValidApplicationPageContent .active > a").attr("pageid") || 1)
            , pageSize: $("#ValidApplicationPageContent").data("pagesize")
            , orderBy: (paras && paras.orderBy !== undefined) ? paras.orderBy : $("#ValidApplication th.active").attr("orderat")
            , orderSeq: (paras && paras.orderSeq !== undefined) ? paras.orderSeq : window.Cache.OrderMapping[$("#ValidApplication th.active span").attr("class")]
        }
        , function (data) {
            $("#ValidApplication").children().first().siblings().remove();
            $("#ValidApplication").append(data);
            ValidApplicationClickCallbackOrderBind();
        });
}
var NewApplicationClickCallbackOrderBind = function () {
    if ($("#NewApplicationPageContent").data("orderby") && $("#NewApplicationPageContent").data("orderseq")) {
        $("#NewApplication").find("[orderat='" + $("#NewApplicationPageContent").data("orderby") + "']").addClass("active").find("span").attr("class", window.Cache.OrderMapping[$("#NewApplicationPageContent").data("orderseq")]);
    }
    var orderElms = $("#NewApplication").find("[orderat]");
    orderElms.unbind('click').bind('click', function () {
        var $this = $(this);
        $this.addClass("active").siblings().removeClass("active");
        $this.siblings().find("span.icon-sort-down,span.icon-sort-up,span.icon-unsorted").attr("class", "icon-unsorted");
        if ($this.find("span.icon-sort-up").length) {
            $this.find("span").attr("class", "icon-sort-down");
        } else {
            $this.find("span").attr("class", "icon-sort-up");
        }
        NewApplicationClickCallback({ pageIndex: 1 });
    }).css("cursor", "pointer");
}
var NewApplicationClickCallback = function (paras) {
    $.post("/Company/PortfolioNewApplication"
        , {
            companyId: (paras && paras.companyID) ? paras.companyID : $("#companyId").val()
            , atcCode: $(".nav.nav-list-primary li.active span").text()
            , pageIndex: (paras && paras.pageIndex) ? paras.pageIndex : ($("#NewApplicationPageContent .customPage").val() || $("#NewApplicationPageContent .active > a").attr("pageid") || 1)
            , pageSize: $("#NewApplicationPageContent").data("pagesize")
            , orderBy: (paras && paras.orderBy !== undefined) ? paras.orderBy : $("#NewApplication th.active").attr("orderat")
            , orderSeq: (paras && paras.orderSeq !== undefined) ? paras.orderSeq : window.Cache.OrderMapping[$("#NewApplication th.active span").attr("class")]
        }
        , function (data) {
            $("#NewApplication").html(data);
            NewApplicationClickCallbackOrderBind();
        });
}


$(function () {
    //Nation EDL/Reginal EDL/NRMC EDL information
    nationalEdlInit();
})

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
var Edl2012ClickCallback = function (paras) {
    $.post("/Product/GetRegionalEDL_Provincial2012"
        , {
            productId: $("#productId").val()
            , pageIndex: (paras && paras.pageIndex) ? paras.pageIndex : ($("#Edl2012PageContent .customPage").val() || $("#Edl2012PageContent .active > a").attr("pageid") || 1)
        }
        , function (data) {
            $("#version2012").html(data);
        });
}
var Edl2009ClickCallback = function (paras) {
    $.post("/Product/GetRegionalEDL_Provincial2009"
        , {
            productId: $("#productId").val()
            , pageIndex: (paras && paras.pageIndex) ? paras.pageIndex : ($("#Edl2009PageContent .customPage").val() || $("#Edl2009PageContent .active > a").attr("pageid") || 1)
        }
        , function (data) {
            $("#version2009").html(data);
        });
}
var ProvincialNrmcCallback = function (paras) {
    $.post("/Product/GetRegionalEDL_ProvincialNRMC"
        , {
            productId: $("#productId").val()
            , pageIndex: (paras && paras.pageIndex) ? paras.pageIndex : ($("#ProvincialNrmcPageContent .customPage").val() || $("#ProvincialNrmcPageContent .active > a").attr("pageid") || 1)
        }
        , function (data) {
            $("#ProvincialNRMC").html(data);
        });
}
function nationalEdlInit() {
    $(".card-nav a").bind('click', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass("active");
        if (_this.is("#view_by_regionaledl_tab")) {
            $('#viewbynationalEDL').hide();
            $('#viewbyregionalEDL').show();

            $.ajax({
                type: "POST",
                url: '/Product/GetRegionalEDL_Provincial',
                data: { productId: $("#productId").val(), pageIndex: 1 },
                success: function (htmlStr) {
                    $("#viewbyregionalEDL").html(htmlStr);
                }
            });
        } else {
            $('#viewbynationalEDL').show();
            $('#viewbyregionalEDL').hide();
        }
    });
}
var regionalEdlInit = function () {
    $(".nav-pills li").bind('click', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass("active");
        if (_this.is("#ProvincialEDL")) {
            $('#version2012').show();
            $('#version2009').show();
            $('#ProvincialNRMC').hide();
            $('#EDLReleasingSummary').hide();

        } else if (_this.is("#ProvincialNRMCEDL")) {
            $('#version2012').hide();
            $('#version2009').hide();
            $('#ProvincialNRMC').show();
            $('#EDLReleasingSummary').hide();
            $.ajax({
                type: "POST",
                url: '/Product/GetRegionalEDL_ProvincialNRMC',
                data: { productId: $("#productId").val(), pageIndex: 1 },
                success: function (htmlStr) {
                    $("#ProvincialNRMC").html(htmlStr);
                }
            });
        } else if (_this.is("#ReleasingSummary")) {
            $('#version2012').hide();
            $('#version2009').hide();
            $('#ProvincialNRMC').hide();
            $('#EDLReleasingSummary').show();
            $.ajax({
                type: "POST",
                url: '/Product/GetRegionalEDL_ReleasingSummary',
                success: function (htmlStr) {
                    $("#EDLReleasingSummary").html(htmlStr);
                }
            });
        }
    })
}
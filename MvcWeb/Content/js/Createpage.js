var createPage = function (totalNum, currentPage, pageSize, tableSelector, url) {
    if (!totalNum) {
        $(".pageBox").html("");
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

    var pageBox = $(".pageBox").html("").html('' + _pageHtml + '</ul></div><div class="pagination"><ul><li class="pagination-input"><input type="number" min="1" value="" placeholder="..." class="form-control flat input-sm customPage"></li><li>&nbsp;&nbsp;' + formatNumber(_totalPage) + '&nbsp;&nbsp;</li> <li class="next"><a href="javascript:void(0)" class="icon-arrow-right3 pageGo">&nbsp;&nbsp;GO</a></li></ul></div>');

    $(".count > span").html("").html(formatNumber(totalNum) + "");
    setPageEventListener(pageBox.find(".pageGo"), pageBox.find("a[pageid]").parent("li"), tableSelector, url);
}
var setPageEventListener = function (pageGo, pageid, tableSelector, url) {
    var _this = this, pageBox = $(".pageBox");
    pageGo.unbind('click').bind('click', function () {
        //getPartialViewData();
        tableSelector(url, { pageIndex: $(this).parent().siblings(".pagination-input").find("input").val() })
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
        tableSelector(url, { pageIndex: $(this).find("a").attr("pageid") });
    });
}

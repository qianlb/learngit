$(function () {
    var order = { orderAt: null, filed: null };
    setOrderHeader();
    var total = $("#TotalRecord").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
    createPage(totalpage, current, 5);
})

function createPage(totalNum, currentPage, pageSize) {
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
    setPageEventListener(pageBox.find(".pageGo"), pageBox.find("a[pageid]").parent("li"));
}
function setPageEventListener(pageGo, pageid, tableSelector) {
    var _this = this, pageBox = $(".pageBox");
    pageGo.click(function () {
        getPartialViewData();
    });
    pageid.click(function () {
        if ($(this).hasClass("prevPage")) {
            curLink = pageBox.find(".active").prev();
        } else if ($(this).hasClass("nextPage")) {
            curLink = pageBox.find(".active").next();
        } else {
            curLink = $(this);
        }
        curLink.addClass("active").siblings().removeClass("active");
        getPartialViewData();
    });
}
function getPartialViewData() {
    var param = getRequestParam();
    $.ajax({
        type: "POST",
        url: "/Registration/RelevantApplications",
        data: param,
        success: function (jsonStr) {
            $("#content").html(jsonStr).fadeIn();
            //setOrderHeader();
            //var total = $("#TotalRecord").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
            //createPage(totalpage, current, 5);
        }
    });
}
function getRequestParam() {
    var json = {}, order = $("#orderat");
    json["page"] = $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
    json["regID"] = $("#userid").val();
    json["order"] = order.attr("name") != 'orderat' ? "{\"" + order.attr("name") + "\":\"" + order.val() + "\"}" : "";
    return json;
}
function formatNumber(num) {
    var b = parseInt(num).toString();
    var len = b.length;
    if (len <= 3) { return b; }
    var r = len % 3;
    return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
}
function setOrderHeader() {
    var order = $("#orderat"),
    orderElm = $("#content").find("[orderat='" + order.attr("name") + "']");
    if (orderElm.length && order.val() === "asc") {
        orderElm.find("span").attr("class", "icon-sort-up");
        orderElm.addClass("active")
    } else if (orderElm.length && order.val() === "desc") {
        orderElm.find("span").attr("class", "icon-sort-down");
        orderElm.addClass("active")
    }
    var orderElms = $("#content").find("[orderat]");
    orderElms.unbind('click').bind('click', function () {
        var $this = $(this);
        $this.addClass("active").siblings().removeClass("active");
        $this.siblings().find("span.icon-sort-down,span.icon-sort-up,span.icon-unsorted").attr("class", "icon-unsorted");
        if ($this.find("span.icon-sort-up").length) {
            $this.find("span").attr("class", "icon-sort-down");
            order.attr("name", $this.attr("orderat"));
            order.val("desc");
        } else {
            $this.find("span").attr("class", "icon-sort-up");
            order.attr("name", $this.attr("orderat"));
            order.val("asc");
        }
        getPartialViewData();
    }).css("cursor", "pointer");
}
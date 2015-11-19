$(function () {
    Init();
    //createPage($("#rdl_2009_page_content").data("totalcount"), $("#rdl_2009_page_content").data("currentpage"), $("#rdl_2009_page_content").data("pagesize"), "#rdl_2009_page_content", Rdl2009ClickCallback);
    //createPage($("#rdl_2004_page_content").data("totalcount"), $("#rdl_2004_page_content").data("currentpage"), $("#rdl_2004_page_content").data("pagesize"), "#rdl_2004_page_content", Rdl2004ClickCallback);

    createPage(100, 1, 10, "#rdl_2009_page_content", Rdl2009ClickCallback);
    createPage(100, 1, 10, "#rdl_2004_page_content", Rdl2004ClickCallback);
    //createPage($("#rdl_2004_page_content").data("totalcount"), $("#rdl_2004_page_content").data("currentpage"), $("#rdl_2004_page_content").data("pagesize"), "#rdl_2004_page_content", Rdl2004ClickCallback);
})
function Init() {
    $(".card-nav a").unbind('click').bind('click', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass("active");
        if (_this.is("#regional_reimbursement")) {
            $('#national_reimbursement_tab').hide();
            $('#regional_reimbursement_tab').show();

            $.ajax({
                type: "POST",
                url: '/Product/GetRDLRegionalReimbursementIndex',
                data: { productId: $("#productId").val(), pageIndex: 1 },
                success: function (htmlStr) {
                    $("#regional_reimbursement_tab").html(htmlStr);
                }
            });
        } else {
            $('#national_reimbursement_tab').show();
            $('#regional_reimbursement_tab').hide();
        }
    })
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
        tableSelector(url)
    });
}

var Rdl2004ClickCallback = function (paras) {
    $.post("/Product/GetRDLRegionalReimbursementList2004"
        , {
            productId: $("#productId").val()
            , pageIndex: (paras && paras.pageIndex) ? paras.pageIndex : ($("#rdl_2004_page_content .customPage").val() || $("#rdl_2004_page_content .active > a").attr("pageid") || 1)
        }
        , function (data) {
            $("#reimbursement_2004_list").html(data);
        });
}
var Rdl2009ClickCallback = function (paras) {
    $.post("/Product/GetRDLRegionalReimbursementList2009"
        , {
            productId: $("#productId").val()
            , pageIndex: (paras && paras.pageIndex) ? paras.pageIndex : ($("#rdl_2009_page_content .customPage").val() || $("#rdl_2009_page_content .active > a").attr("pageid") || 1)
        }
        , function (data) {
            $("#reimbursement_2009_list").html(data);
        });
}
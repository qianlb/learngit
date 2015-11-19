function DrugInsertSharedDetailSubmit(paras) {
    var cache = viewContext();
    $.post(cache.request, {
        id: cache.id,
        orderBy: (paras && paras.orderby) ? paras.orderby : cache.orderby,
        orderSeq: (paras && paras.orderseq) ? paras.orderseq : cache.orderseq,
        pageIndex: (paras && paras.pageindex) ? paras.pageindex : ($(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1),
        type: JSON.stringify((paras && paras.type) ? paras.type : cache.type),
        pageSize: cache.pagesize
    }, function (data) {
        $(cache.parentselector).html(data);
    });
}

function viewContext() {
    return {
        totalrecord: $("#drugInsertHidden").data("totalrecord"),
        pageindex: $("#drugInsertHidden").data("pageindex"),
        pagesize: $("#drugInsertHidden").data("pagesize"),
        orderby: $("#drugInsertHidden").data("orderby"),
        orderseq: $("#drugInsertHidden").data("orderseq"),
        request: $("#drugInsertHidden").data("request"),
        id: $($("#drugInsertHidden").data("idselector")).val(),
        parentselector: $("#drugInsertHidden").data("parentselector"),
        type: (function () {
            var type = {};
            $($("#drugInsertHidden").data("parentselector") + ' label.checked').each(function () {
                $(this).data("key").forEach(function (element) {
                    type[element] = "";
                });
            });
            return Object.keys(type);
        })()
    };
}


$(function () {
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
            //getPartialViewData();
            tableSelector(url)
        });
    }
    var cache = viewContext();
    var focusedColumnHeader = $(cache.parentselector + " table th[orderat='" + cache.orderby + "']");
    if (focusedColumnHeader.length) {
        $(focusedColumnHeader).addClass("active").siblings().removeAttr('class').find('span').attr('class', 'icon-unsorted');
        $(focusedColumnHeader).find("span").attr('class', cache.orderseq.toUpperCase() === 'ASC' ? 'icon-sort-up' : 'icon-sort-down');
    }
    createPage(cache.totalrecord, cache.pageindex, cache.pagesize, ".pageBox", DrugInsertSharedDetailSubmit);

    $(cache.parentselector + " label").unbind("click").bind("click", function () {
        DrugInsertSharedDetailSubmit({
            pageindex: 1,
            type: (function (needKeep, rawArray, eventArray) {
                var result = {}, resultArr = [];
                rawArray.forEach(function (e) {
                    result[e] = true;
                });
                eventArray.forEach(function (e) {
                    result[e] = needKeep;
                });
                for (var i = 0, len = Object.keys(result).length; i < len; i++) {
                    if (result[Object.keys(result)[i]]) {
                        resultArr.push(Object.keys(result)[i]);
                    }
                }
                return resultArr;
            })(($(this).attr("class").indexOf("checked") === -1), cache.type, $(this).data("key"))
        });
    });
    $(cache.parentselector + " table th[orderat][orderat!='']").unbind("click").bind("click", function () {
        DrugInsertSharedDetailSubmit({
            orderby: $(this).attr("orderat"),
            orderseq: $(this).find("span").attr("class") === "icon-sort-down" ? "ASC" : "DESC",
            pageindex: 1
        });
    });

})
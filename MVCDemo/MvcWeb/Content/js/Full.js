function FullHelper(paras) {
    var onToolTipResizing = function () {
        $((paras && paras.moreSelector) ? paras.moreSelector : "span.more").each(function () {
            if (
                ($(this).prev("div").prev("div").length && $(this).prev("div").prev("div").text() !== "" && $(this).prev("div").prev("div")[0].scrollWidth > $(this).parents("div")[0].clientWidth)
                || ($(this).prev("div")[0].scrollWidth > $(this).parents("div")[0].clientWidth)
                ) {
                $(this).show();
                $(this).prev("div").width($(this).parents("div")[0].clientWidth - this.scrollWidth-3);
            } else {
                $(this).hide();
                $(this).prev("div").width($(this).parents("div")[0].clientWidth);
            }
        });
    }
    window.onresize = function () {
        onToolTipResizing();
    }
    $('[data-toggle="tooltip"]').tooltip({ html: true });
    onToolTipResizing();
    $((paras && paras.fullSelector) ? paras.fullSelector : '.table-responsive').on('shown.bs.tooltip', function () {
        var shownedToolTipInner = $(arguments[0].target).next("div").children(".tooltip-inner");
        if ((!(paras && paras.disableOptimize)) && $(shownedToolTipInner)[0].scrollWidth > 400) {
            var rawText = $(arguments[0].target).data("original-title"), actualWidth = $(shownedToolTipInner)[0].scrollWidth, displayWidth = 215, splitLen = Math.ceil(rawText.length / (actualWidth / displayWidth)), resultArr = [];
            for (var i = 0, len = rawText.length; i < len; i = i + splitLen) {
                resultArr.push(rawText.substring(i, i+splitLen));
            }
            shownedToolTipInner.html(resultArr.join("<br/>"));
        }
        shownedToolTipInner.css({
            "text-align": "left",
            width: (shownedToolTipInner[0].scrollWidth+1) + "px",
            "max-width": (shownedToolTipInner[0].scrollWidth+1) + "px"
        });
    });

    $((paras && paras.fullSelector) ? paras.fullSelector : '.table-responsive').unbind("DOMSubtreeModified").bind("DOMSubtreeModified", function () {
        FullHelper(paras);
    });

}

$(function () {
    setTimeout(function () {
        if (!window.onresize) {
            FullHelper();
        }
    }, 500);
});

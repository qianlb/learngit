$(function () {
    $(".Amount").each(function () {
        var value = formatNumber(parseInt($(this).text()));
        $(this).html("").html(value);
    });
    UTCToLocal($(".relatedNews"));
    UTCToLocal($(".list-table"));
})
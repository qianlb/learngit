$(function () {
    $("div>img.pal").each(function () {
        var _this = $(this);
        var img = _this[0];
        if (hasDimensions(img))
            _this.css("max-width", img.naturalWidth);
    })
})

function hasDimensions(img) {
    return !!((img.complete && typeof img.naturalWidth !== "undefined") || img.width);
}
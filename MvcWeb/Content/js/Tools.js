Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function UTCToLocalVal(container) {
    container.find(".date").each(function () {
        if ($(this).val() != "" && $(this).val() != null) {
            var localDate = new Date(Number($(this).val()));
            $(this).val(localDate.Format("MM/dd/yyyy"));
        }
    });
}

function UTCToLocal(container) {
    container.find(".date").each(function () {
        if ($(this).html().trim() != "" && $(this).html().trim() != null && $(this).html().trim() != "0") {
            var localDate = new Date(Number($(this).html()));
            $(this).html(localDate.Format("MM/dd/yyyy"));
        } else {
            $(this).html("");
        }
    });
}
function UTCToLocalTime(container) {
    container.find(".date").each(function () {
        if ($(this).html().trim() != "" && $(this).html().trim() != null && $(this).html().trim() != "0") {
            var localDate = new Date(Number($(this).html()));
            $(this).html(localDate.Format("yyyy-MM-dd"));
        } else {
            $(this).html("");
        }
    });
}
//修改savedSearch时间
function UTCToLocalSavedSearch(container) {
    container.find("span[requestkey = 'publicationdate']").each(function () {
        if ($(this).attr("value") != "" && $(this).attr("value") != null) {
            var localDate = new Date(Number($(this).attr("value").trim()));
            $(this).html(localDate.Format("MM/dd/yyyy")+'&nbsp;&nbsp;');
        }
    });
}
function LocalToUTC(date)
{
    var d = new Date(date);
    var ticks = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    return ticks;
}

/*UTC to MM/dd/yyyy*/
function UTCToFormate(date) {
    var d = new Date(date);
    return d.Format("MM/dd/yyyy");
}

//格式化数字
function formatNumber(num) {
    var b = parseInt(num).toString();
    var len = b.length;
    if (len <= 3) { return b; }
    var r = len % 3;
    return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
}


//获取链接参数
function get_urlparam(name){
    var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}


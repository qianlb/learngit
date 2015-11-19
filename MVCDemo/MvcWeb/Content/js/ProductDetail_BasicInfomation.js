$(function () {
    UTCToLocal($(".relatedNews"));
    //amount 3位一撇
    $(".Amount").each(function () {
        var value = formatNumber(parseInt($(this).text()));
        $(this).html("").html(value);
    });
    setOrderHeader();
    var total = parseInt($("#TotalRecord").val()), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
    createPage(totalpage, current, 10, otcContent);
    var otcContent = function () {
        var param = getRequestParam();
        $.ajax({
            type: "POST",
            url: "/Product/GetOTCApprovalByProductId",
            data: param,
            success: function (jsonStr) {
                $("#otcContent").html(jsonStr);
                setOrderHeader();
                var total = $("#TotalRecord").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
                createPage(totalpage, current, 10, otcContent);
            }
        });
    }
    function getRequestParam() {
        var json = {}, order = $("#orderat");
        json["pageIndex"] = $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        json["productId"] = $("#drugId").val().trim();
        json["order"] = order.attr("name") != 'orderat' ? "{\"" + order.attr("name") + "\":\"" + order.val() + "\"}" : "";
        return json;
    }
    //detail排序
    function setOrderHeader() {
        var order = $("#orderat"),
        orderElm = $("#otcContent").find("[orderat='" + order.attr("name") + "']");
        if (orderElm.length && order.val() === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
            orderElm.addClass("active")
        } else if (orderElm.length && order.val() === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
            orderElm.addClass("active")
        }
        var orderElms = $("#otcContent").find("[orderat]");
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
            otcContent();
        }).css("cursor", "pointer");
    }
});


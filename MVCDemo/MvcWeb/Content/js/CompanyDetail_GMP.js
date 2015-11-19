$(function () {
    var pageSize = 10;
    $("#companygmp label").live("click", function () {
        var _this = $(this);
        var url = "";
        switch (_this.index()) {
            case 0:
                url = "/Company/GMPCertificationList";
                $("#orderat").attr("name", "orderat");
                break;
            case 1:
                url = "/Company/GMPApplicationList";
                $("#orderat").attr("name", "orderat");
                break;
        }
        companyGMPCon(url, { pageIndex: 1 });
    })

    var companyGMPCon = function (url, paremeter) {
        var param = getRequestParam(paremeter);

        $.ajax({
            type: "POST",
            url: url,
            data: param,
            success: function (htmlStr) {
                $("#certification").html(htmlStr);
                setOrderHeader(url);
                var total = $("#TotalRecord").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
                createPage(totalpage, current, pageSize, companyGMPCon, url);
            }
        });
    }

    var url = "/Company/GMPCertificationList";
    setOrderHeader(url);
    var total = parseInt($("#TotalRecord").val()), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
    createPage(totalpage, current, pageSize, companyGMPCon, url);

    function getRequestParam(paremeter) {

        var pageIndex = (paremeter && paremeter.pageIndex) ? paremeter.pageIndex : $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;

        var json = {}, order = $("#orderat");
        json["pageIndex"] = pageIndex;
        json["companyId"] = $("#companyId").val();
        json["order"] = order.attr("name") != 'orderat' ? "{\"" + order.attr("name") + "\":\"" + order.val() + "\"}" : "";
        json["pageSize"] = pageSize;
        return json;
    }

    function setOrderHeader(url) {
        var order = $("#orderat"),
        orderElm = $("#certification").find("[orderat='" + order.attr("name") + "']");
        if (orderElm.length && order.val() === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
            orderElm.addClass("active")
        } else if (orderElm.length && order.val() === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
            orderElm.addClass("active")
        }
        var orderElms = $("#certification").find("[orderat]");
        orderElms.click(function () {
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
            companyGMPCon(url);
        }).css("cursor", "pointer");
    }
});
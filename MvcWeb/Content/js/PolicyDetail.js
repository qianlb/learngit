
$(function () {

    var url = window.location.href;
    $.ajax({
        url: "/Home/ShareUrl",
        type: "post",
        async: false,
        success: function (result) {
            if (result != null) {
                url = result;
            }
        },
        error: function () {
            //alert("数据获取失败");
        }
    });
   
    var PolicyTitle = $("#PolicyTitle").val();

    var emailHref = $("#share span.btn-social-email a").attr("href");
    emailHref = emailHref + url;
    $("#share span.btn-social-email a").attr("href", emailHref);

    $("#share button").bind('click', function () {
        var shareToPlatform = $(this).attr("name");
        share(url, PolicyTitle, "", shareToPlatform);
    });

    var PolicyRelated = function (paras) {
        var param = getRequestParam(paras);
        $.ajax({
            type: "POST",
            url: "/Policy/GetPolicyDetailRelatedPolicy",
            data: param,
            success: function (jsonStr) {
                $("#PolicyRelated").html(jsonStr);
                setOrderHeader();
                var total = $("#TotalRecord").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
                createPage(totalpage, current, 5, PolicyRelated);
            }
        });
    }
    setOrderHeader();
    //createPage
    var totalPage = parseInt($("#TotalRecord").val()), currentPage = parseInt($("#currentpage").val());
    //createPage(totalPage, currentPage, 5, PolicyRelated);



    function getRequestParam(paras) {
        var json = {}, order = $("#orderat");
        pageIndex = (paras && paras.pageIndex) ? paras.pageIndex : $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        json["policyId"] = $("#policyId").val();
        json["pageIndex"] = pageIndex;
        json["order"] = order.length && order.attr("name") != 'orderat' ? "{\"" + order.attr("name") + "\":\"" + order.val() + "\"}" : "";

        return json;
    }
    //detail排序
    function setOrderHeader() {
        var order = $("#orderat"),
        orderElm = $("#PolicyRelated").find("[orderat='" + order.attr("name") + "']");
        if (orderElm.length && order.val() === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
            orderElm.addClass("active")
        } else if (orderElm.length && order.val() === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
            orderElm.addClass("active")
        }
        var orderElms = $("#PolicyRelated").find("[orderat]");
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
            PolicyRelated();
        }).css("cursor", "pointer");
    }


})

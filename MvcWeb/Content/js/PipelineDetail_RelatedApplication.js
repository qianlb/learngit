$(function () {
    $(".relatedApplication>div > a").live("click", function () {
        var _this = $(this);
        _this.find(".col-sm-4").removeClass("hide").end().addClass("active");
        _this.siblings().removeClass("active").find(".col-sm-4").addClass("hide")
        var url="/Pipeline/";
        switch(_this.index())
        {
            case 0:
                url = url + "GetRelatedApplicationsByIND";
                $("#orderat").attr("name", "orderat")
                break;
            case 1:
                url = url + "GetRelatedApplicationsByNDA";
                $("#orderat").attr("name", "orderat")
                break;
            case 2:
                url = url + "GetRelatedApplicationsByGenerics";
                $("#orderat").attr("name", "orderat")
                break;
        }
        relatedApplicationContent(url)
        //setOrderHeader();
        //var total = parseInt($("#TotalRecord").val()), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
        //createPage(totalpage, current, 10, relatedApplicationContent(url));
    
    });
    
    var relatedApplicationContent = function (url) {
        var param = getRequestParam();
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            success: function (jsonStr) {
                $("#RelatedApplicationsContent").html(jsonStr);
                setOrderHeader(url);
                var total = $("#TotalRecord").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
                createPage(totalpage, current, 10, relatedApplicationContent, url);
            }
        });
    }
    var url="/Pipeline/GetRelatedApplicationsByIND"
    setOrderHeader(url);
    var total = parseInt($("#TotalRecord").val()), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
    createPage(totalpage, current, 10, relatedApplicationContent, url);
    function getRequestParam() {
        var json = {}, order = $("#orderat");
        json["pageIndex"] = $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        json["ApplicationNum"] = $("#ApplicationNum").val();
        json["order"] = order.attr("name") != 'orderat' ? "{\"" + order.attr("name") + "\":\"" + order.val() + "\"}" : "";
        return json;
    }
    function setOrderHeader(url) {
        var order = $("#orderat"),
        orderElm = $("#RelatedApplicationsContent").find("[orderat='" + order.attr("name") + "']");
        if (orderElm.length && order.val() === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
            orderElm.addClass("active")
        } else if (orderElm.length && order.val() === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
            orderElm.addClass("active")
        }
        var orderElms = $("#RelatedApplicationsContent").find("[orderat]");
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
            relatedApplicationContent(url);
        }).css("cursor", "pointer");
    }
})

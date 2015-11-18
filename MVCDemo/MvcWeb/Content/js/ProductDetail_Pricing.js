function GetContentByTab(url, productid, pageIndex, pageSize) {
    $.ajax({
        type: "POST",
        url: url,
        data: { productId: productid, pageIndex: pageIndex, pageSize: pageSize },
        success: function (htmlStr) {
            $("#contentList").html(htmlStr);
        }
    });
};

$(function () {
    var productid = $("#productId").val()

    $(".card-nav a").bind('click', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass("active");
        if (_this.is("#lowprice_tab")) {
            $("#nationlowprice").addClass('active').siblings().removeClass("active");
            $('#contentMenu').addClass("hidden");
            $('#viewbylowpriceMenu').removeClass("hidden");
            $("#maxpriceexplain").addClass("hidden");
            GetContentByTab("/Product/GetProductPricingDetailNational", productid, 1, 10);
        }
        else {
            $("#NationalGeneralPrice").addClass('active').siblings().removeClass("active");
            $('#contentMenu').removeClass("hidden");
            $('#viewbylowpriceMenu').addClass("hidden");
            $("#maxpriceexplain").removeClass("hidden");
            GetContentByTab("/Product/GetProductDetail_Pricing_NationalGeneralList", productid, 1, 10);
        }
    });

    $(".nav-pills li").bind('click', function () {
        var _this = $(this);
        _this.addClass('active').siblings().removeClass("active");

        if (_this.is("#NationalGeneralPrice")) {
            GetContentByTab("/Product/GetProductDetail_Pricing_NationalGeneralList", productid, 1, 10);
        } else if (_this.is("#NationalSeparatePrice")) {
            GetContentByTab("/Product/GetProductDetail_Pricing_NationalSeparateList", productid, 1, 10);
        } else if (_this.is("#OriginalDrugPrice")) {
            GetContentByTab("/Product/GetProductDetail_Pricing_OriginalDrugList", productid, 1, 10);
        } else if (_this.is("#nationlowprice")) {
            GetContentByTab("/Product/GetProductPricingDetailNational", productid, 1, 10);
        } else if (_this.is("#regionalloawprice")) {
            GetContentByTab("/Product/GetProductPricingDetailRegional", productid, 1, 10);
        }
    })



})

$(function () {
    GetSelectProducts();
    // 获取所有的参数
    function GetParam() {
        var json = {};
        json["keyword"] = $("#name").attr("keyword") ? $("#name").attr("keyword") : "";
        json["mncId"] = $("#detail").attr("mncid") ? $("#detail").attr("mncid") : "";
        json["productId"] = $("#detail").attr("productid") ? $("#detail").attr("productid") : "";
        json["brandEn"] = $("#brandname").attr("branden") ? $("#brandname").attr("branden") : "";
        json["brandCn"] = $("#brandname").attr("brandcn") ? $("#brandname").attr("brandcn") : "";
        json["formulation"] = $("#detail").attr("formulation") ? $("#detail").attr("formulation") : "";
        json["specification"] = $("#Specification div button").attr("title") ? $("#Specification div button").attr("title") : "";
        return json;
    }

    //获取用户的select products列表
    function GetSelectProducts() {
        $.ajax({
            data: {},
            url: "/BMT/GetUserSelectedBrands",
            type: 'post',
            dataType: "json",
            success: function (json) {
                var _html = " ";
                for (var i = 0; i < json.length; i++) {
                    _html += "<label id='" + json[i].Id + "'><span class='tag brandproduct' bmtid='" + json[i].Id + "' branden='" + json[i].BrandNameEN + "' brandcn='" + json[i].BrandNameCN + "' mncid='" + json[i].MncId + "' productid='" + json[i].ProductId + "' formulation='" + json[i].Formulation + "' specification='" + json[i].Specification + "'><span>" + json[i].BrandNameEN + "&nbsp;&nbsp;" + json[i].BrandNameCN + "</span><a class='tagsinput-remove-link'></a></span></label>";
                }
                $("#BMTselectallproduct").html(_html);
                $("#BMTselectallproductsssss").html(_html);
            }
        });
    }

    //Frequency下拉框onchange事件
    $("#BMTFrequency").change(function () {
        var thisval = this.options[this.selectedIndex].value;
        $.ajax({
            data: {
                action: "Update",
                frequency: thisval
            },
            url: "/BMT/UpdateBMTFrequency",
            type: 'post',
            dataType: "json",
            success: function (json) {
                alert("更新成功！\nUpdate successfully!");
            }
        });
    })

    //select products add事件
    $("#BMTselectoneproduct").live('click', function () {
        var param = GetParam();
        boolean = GetBoolSelect();
        if ($('#specification').val() == null) {
            alert('请选择规格！\nPlease select specification!');
            return;
        }
        if (boolean) {
            html = "<label><span  class='tag brandproduct' branden='" + param.brandEn + "' brandcn='" + param.brandCn + "' mncid='" + param.mncId + "' productid='" + param.productId + "' formulation='" + param.formulation + "' specification='" + param.specification + "'><span>" + param.brandEn + "&nbsp;&nbsp;" + param.brandCn + "</span><a class='tagsinput-remove-link'></a></span></label>";
            $("#BMTselectallproductsssss").append(html);

        } else {
            alert("对不起，该条数据已经出现在列表中！\nSorry, data already exist!");
        }
    });

    //delete事件
    $("#Clear").live('click', function () {
        $.ajax({
            data: { BMTid: " " },
            url: "/BMT/GetBMTBrand",
            type: 'post',
            dataType: "json",
            success: function (json) {
                window.location.reload();
            }
        });
    });

    $(".tagsinput-remove-link").live('click', function () {
        var _this = $(this);
        var _this_container = _this.closest('div').attr('id');
        _this.closest('label').remove();

        bmtid = $(this).parent().attr("bmtid");
        if (bmtid != "" && bmtid != undefined) {
            $.ajax({
                data: { BMTid: bmtid },
                url: "/BMT/GetBMTBrand",
                type: 'post',
                dataType: "json",
                success: function (json) {
                    console.log(_this_container)
                    if (_this_container == 'BMTselectallproduct') {
                        window.location.reload();
                    }
                }
            });
        }

    });

    //查找是否存在此select products
    function GetBoolSelect() {
        var boolean = true;
        var param = GetParam();
        var $this = $(".brandproduct");
        for (var i = 0; i < $this.length; i++) {
            if (param.brandCn == $($this[i]).attr("brandcn") && param.brandEn == $($this[i]).attr("branden") && param.mncId == $($this[i]).attr("mncid") && param.productId == $($this[i]).attr("productid") && param.formulation == $($this[i]).attr("formulation") && param.specification == $($this[i]).attr("specification")) {
                boolean = false;
            }
        }
        return boolean;
    }

    //add to the tools
    $("#BMTAdd").live('click', function () {
        var $bid = $('#BMTselectallproductsssss label');
        if ($bid.length <= 0) {
            alert('请添加产品！\nPlease add product!');
            return;
        } else if ($bid.length > 10) {
            alert("对不起. 您关注的商品名超过10条的上限, 请删除部分后再添加。\nSorry,the number of your tracked brands have exceeded max 10. Please delete some before adding");
            return;
        } else {
            var json = [];
            for (var i = 0; i < $bid.length; i++) {
                json[i] = {};
                json[i]["brandnamecn"] = $($bid[i].childNodes).attr("brandcn");
                json[i]["brandnameen"] = $($bid[i].childNodes).attr("branden");
                json[i]["mncid"] = $($bid[i].childNodes).attr("mncid");
                json[i]["productid"] = $($bid[i].childNodes).attr("productid");
                json[i]["formulation"] = $($bid[i].childNodes).attr("formulation");
                json[i]["specification"] = $($bid[i].childNodes).attr("specification");
            }
            $.ajax({
                data: { filter: JSON.stringify(json) },
                url: "/BMT/AddBMTbrand",
                type: 'post',
                dataType: "json",
                success: function (json) {
                    alert("增加成功！\nAdd successfully!");
                    window.location.href = "/BMT/BMTDetail";
                },
                error: function () {
                    alert("增加失败！\nAdd failed!");
                }
            });
        }
    });

    $("#name").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/BMT/GetKeywordInfo",
                dataType: "json",
                data: {
                    keyword: request.term
                },
                success: function (val) {
                    var cache = [];
                    for (var i = 0; i < val.length; i++) {
                        cache.push({ label: val[i].keyword, value: val[i].keyword, raw: val[i] })
                    }
                    response(cache);
                }
            });
        },
        select: function (event, ui) {
            $("#name").attr("keyword", ui.item.raw.keyword);
            $("#name").attr("source", ui.item.raw.source);
            $("#name").attr("mncid", ui.item.raw.mncid);
            $("#name").attr("productid", ui.item.raw.productid);
            $("#Brandname").show().val("Click and add more data");
        }
    });

    $("#name").click(function () {
        $("#name").val("");
        $("#brandname").val("");
        $(".brandnameLayer").val("")
        $("#Brandname,#Detail,#Specification,#addtionlayer").hide();
        $("#Detail").val("");
    })

    $("#brandname").on("click", function (e) {
        e.stopPropagation();
        keyword = $("#name").attr("keyword");
        source = $("#name").attr("source");
        mncid = $("#name").attr("mncid");
        productid = $("#name").attr("productid");
        if (source == "productname")
            keywordID = productid
        else if (source == "companyname")
            keywordID = mncid
        else if (source == "brandname")
            keywordID = keyword
        $("#Detail,#Specification,#addtionlayer").hide();
        $(this).val("");
        $("#detail").val("");
        $("#Specification").val("");
        if ($("#name").attr("keyword") == "" || $("#name").attr("source") == "") {
            alert("请录入相关名称！\nPlease enter the related name！")
        } else {
            $.ajax({
                data: {
                    source: source,
                    keywordId: keywordID,
                },
                url: "/BMT/GetBmtBrandName",
                type: 'post',
                success: function (val) {
                    var html = "";
                    for (var i = 0; i < val.length; i++) {
                        var branden = val[i].BrandNameEN;
                        var brandcn = val[i].BrandNameCN;
                        html += "<li class='ui-menu-item brand'>" + branden + " " + brandcn + "</li>"
                    }
                    $("#brandname").next().html(html);
                    if ($("#Detail").css("display") != "block") {
                        $(".brandnameLayer").show();
                    }
                    $("#brandname").attr("source", source);
                    $("#brandname").attr("mncid", mncid);
                    $("#brandname").attr("productid", productid);
                }
            });
        }
    })
        .focusout(function () {
        })

    $(".brandnameLayer").on('click', ".brand", function () {
        var brandName = $(this).text();
        $("#brandname").val(brandName);
        var brand = brandName.split(" ")

        $("#brandname").attr("branden", brand[0]);
        $("#brandname").attr("brandcn", brand[1]);

        $(".brandnameLayer").hide();
        $("#Detail").show();
    })

    $("#brandname").click(function () {
        $("#brandname").val("");
        $(".branddetailLayer").html(" ");
        $("#specification").next().find(".filter-option").html($("#detail").attr("placeholder"));
    })

    $("#detail").live('click', function (e) {
        D_brandEN = $("#brandname").attr("branden");
        D_brandCN = $("#brandname").attr("brandcn");
        D_mncid = $("#brandname").attr("mncid");
        D_productid = $("#brandname").attr("productid");
        D_source = $("#brandname").attr("source");
        e.stopPropagation();
        $("#Specification,#addtionlayer").hide();

        $(this).val("");
        $("#Specification").val("");
        $("#specification").next().find(".filter-option").html($("#detail").attr("placeholder"));

        if ($("#brandname").attr("branden") == "" && $("#brandname").attr("brandcn") == "" && $("#brandname").attr("mncid") == "" && $("#brandname").attr("productid") == "") {
            alert("Please enter the related name！")
        } else {
            $.ajax({
                data: {
                    brandnameen: D_brandEN,
                    brandnamecn: D_brandCN,
                    mncid: D_mncid,
                    productid: D_productid,
                    source: D_source,
                },
                url: "/BMT/GetBrandDetailInfo",
                type: 'post',
                success: function (val) {
                    var detailhtml = "";
                    for (var i = 0; i < val.length; i++) {
                        var ProductName = val[i].ProductName;
                        var CompanyName = val[i].CompanyName;
                        var Formulation = val[i].Formulation;
                        var MncId = val[i].Mncid;
                        var Productid = val[i].Productid;

                        $("#detail:eq(" + i + ")").attr("branden", D_brandEN);
                        $("#detail:eq(" + i + ")").attr("brandcn", D_brandCN);
                        $("#detail:eq(" + i + ")").attr("source", D_source);
                        $("#detail:eq(" + i + ")").attr("mncid", val[i].Mncid);
                        $("#detail:eq(" + i + ")").attr("productid", Productid);

                        detailhtml += "<li class='branddetail'><span class='branddetailspan'>" + ProductName + ", " + Formulation + ", " + CompanyName + "</span></li>"
                    }
                    $("#detail").next().html(detailhtml);
                    if ($("#Specification").css("display") != "block") {
                        $(".branddetailLayer").show();
                    }

                    if (val.length <= 0) {
                        var detailhtml = "";
                        detailhtml += "<div style='cursor: pointer; color: rgb(51, 51, 51);'>" + "No related data, please go back to the last level to search." + "</div>"
                        $("#detail").next().html(detailhtml);
                    }
                }
            });
        }
    })
        .focusout(function () {
        })

    $(document).on('click', function (e) { $('.brandnameLayer, .branddetailLayer').hide() });

    $(".branddetail").live('click', function () {
        var _this = $(this);
        var brandDetail = _this.children().text();
        $("#detail").val(brandDetail);

        var branddetail = brandDetail.split(", ")
        $("#detail").attr("formulation", branddetail[1]);

        $(".branddetailLayer").hide();
        $("#Specification").show();
        $("#specification").val("");

        S_brandEN = $("#detail").attr("branden");
        S_brandCN = $("#detail").attr("brandcn");
        S_mncid = $("#detail").attr("mncid");
        S_productid = $("#detail").attr("productid");
        S_source = $("#detail").attr("source");
        S_formulation = $("#detail").attr("formulation");

        $.ajax({
            data: {
                brandnameen: S_brandEN,
                brandnamecn: S_brandCN,
                mncid: S_mncid,
                productid: S_productid,
                source: S_source,
                formulation: S_formulation,
            },
            url: "/BMT/GetSpecificationList",
            type: 'post',
            success: function (val) {
                var Specification = "";
                var Specificationhtml = "";
                var SpecificationhtmlInnerLi = "";
                if (val.length <= 0) {
                    SpecificationhtmlInnerLi += "<li style='padding:5px; background-color:#fff;'>" + "No related data, please go back to the last level to search." + "</li>"
                } else {
                    for (var i = 0; i < val.length; i++) {
                        Specificationinfo = val[i].Specification;
                        Specificationhtml += "<option value='" + i + "'>" + Specificationinfo + "</option>";
                        SpecificationhtmlInnerLi += "<li data-original-index='" + i + "' class=''><a tabindex='" + i + "' data-tokens='null'><span class='text'>" + Specificationinfo + "</span><span class='glyphicon glyphicon-ok check-mark'></span></a></li>"
                    }
                }
                $("#specification").html(Specificationhtml);
                $(".inner").html(SpecificationhtmlInnerLi);
                $(".inner li").bind('click', function () {
                    if ($(this).attr("class") == "") {
                        $(this).attr("class", "selected");
                    } else {
                        $(this).attr("class", "");
                    }
                })
                $("#addtionlayer").show();
            }
        });
    })

    $("#BMTCancel").click(function () {
        $("#name").val("");
        $("#Brandname,#Detail,#Specification,.#addtionlayer").hide();
    });

    function bgCss(obj) {
        obj.find("li:odd").css({ "background": "#eee" })

    }

    function hegCtrl(obj, heg) {
        if (obj.height() > heg) {
            obj.css({ "height": heg + "px", "overflow": "scroll" })
        }
    }

    function pointerCSS(obj) {
        obj.css({ "cursor": "pointer" })
    }
});

facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
        this.setFilterSlideListener();   //filter events
        this.pageDataHander(_this.parameter.pageSize, 1);   //page
        this.setOptionColumnLinstener(this.parameter.saveSearch.editchooseColumnUrl);   //OptionColumnLinstener
        this.setAddSaveSearchListener(); //addSaveSearch
        this.setOrderHeader();   //order

        return this;
    }
});
facetsSearch.prototype.init.prototype = facetsSearch.prototype;

$(function () {
    var obj = facetsSearch({
        tableUrl: "/BMT/GetBMTInfo",
        tableContainer: "#bmtdetail",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumsForBMTView",
            savedsearchModuleId: 28,
            optionColumnsModuleId: 28
        }
    });
});

$(function () {
    var ProductResCon = function (paras) {
        var param = getRequestParam(paras);
        $.ajax({
            type: "POST",
            url: "/Product/GetProductDetail_Registration_VaildOrInvaild",
            data: param,
            success: function (jsonStr) {
                $("#productResCon").html(jsonStr);
                setOrderHeader();
                var total = $("#TotalRecord").val(), current = parseInt($("#currentpage").val()), totalpage = parseInt(total);
                createPage(totalpage, current, 10, ProductResCon);
            }
        });
    };
    setOrderHeader();
    //createPage
    var totalPage = parseInt($("#TotalRecord").val()), currentPage = parseInt($("#currentpage").val());
    createPage(totalPage, currentPage, 10, ProductResCon);

    $("select[name='registrationFlag']").change(function () {
        if ($(this).find("option:selected").index() === 0) {
            $("select[name='Formulation']").show();
        } else {
            $("select[name='Formulation']").hide();
        }
        ProductResCon();
    });
    $("select[name='Formulation']").change(function () {
        ProductResCon();
    });
    $("label").bind('click', function (e) {
        $(this).addClass("active").siblings().removeClass("active");
        ProductResCon({ isValid: $(this).attr('values'),pageIndex:1});
        e.stopPropagation();
    });

    var productId = $("#drugId").val();
    if (productId) {
        GetProductChart(productId);
    } else {
        $("#RegistrationChart_CFDA").html('No data available').removeClass("div-response");
    }
    function getRequestParam(paras) {
        var json = {}, order = $("#orderat");
        var isCFDA = "cfda",
        isVaild = ((paras && paras.isValid) ? paras.isValid : $("label.active").attr("values")),
            registrationFlag = $("select[name='registrationFlag']").val(),
            Formulation = $("select[name='Formulation']").val();
        pageIndex = (paras && paras.pageIndex)?paras.pageIndex:$(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        json["productId"] = $("#drugId").val();
        json["pageIndex"] = pageIndex;
        json["order"] = order.attr("name")!='orderat' ? "{\"" + order.attr("name") + "\":\"" + order.val() + "\"}" : "";
        json["isCFDA"] = isCFDA;
        json["isVaild"] = isVaild;
        json["registrationFlag"] = registrationFlag;
        json["Formulation"] = Formulation;
        return json;
    }
    //detail排序
    function setOrderHeader() {
        var order = $("#orderat"),
        orderElm = $("#productResCon").find("[orderat='" + order.attr("name") + "']");
        if (orderElm.length && order.val() === "asc") {
            orderElm.find("span").attr("class", "icon-sort-up");
            orderElm.addClass("active");
        } else if (orderElm.length && order.val() === "desc") {
            orderElm.find("span").attr("class", "icon-sort-down");
            orderElm.addClass("active");
        }
        var orderElms = $("#productResCon").find("[orderat]");
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
            ProductResCon();
        }).css("cursor", "pointer");
    }

    function GetProductChart(productId) {
        $.ajax({
            type: "post",
            async: false,
            url: "/Product/GetRegistrationByProductId",
            data: { productId: productId },
            datatype: "json",
            success: function (jsonString) {
                $("#RegistrationChart_CFDA").html("");
                var json = eval(jsonString);
                if (json && json.length) {
                    //$("#RegistrationChart_CFDA").addClass("div-response")
                    var year_data = [], series_data0 = [], series_data1 = [];
                    for(var i = 0, len = json.length; i < len; i++){
                        year_data.push(json[i].date);
                        series_data0.push(json[i]['Company with valid brand names']);
                        series_data1.push(json[i]['Company with valid registrations']);
                    }
                    var product_chart = echarts.init(document.getElementById('RegistrationChart_CFDA'));
                    var option = {
                        tooltip : {
                            trigger: 'axis',
                            textStyle: {
                                fontSize: 12
                            }
                        },
                        legend: {
                            data:['Company with valid brand names','Company with valid registrations']
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : year_data
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [{
                            name: 'Company with valid brand names',
                            type: 'line',
                            data: series_data0
                        },{
                            name: 'Company with valid registrations',
                            type: 'line',
                            data: series_data1
                        }]
                    };
                    product_chart.setOption(option);
                    window.onresize = function () {
                        product_chart.resize();
                    };
                    /*var chart = new GBIChart.GroupedLineChart();
                    chart.dataProvider = json;
                    chart.categoryField = "date";
                    chart.yPoint = 0;
                    chart.yFormat = "d";
                    //chart.spacing=10;
                    chart.top = 30;
                    chart.right = 30;
                    chart.left = 50;
                    chart.bottom = 20;
                    chart.width = 600;
                    chart.height = 300;
                    // chart.graticule = "reseau";  //网格线
                    chart.optimize = "interval"; //年份为斜体
                    chart.xAxisInterval = 2;
                    chart.color = ["#4684EE", "#DC3912"];
                    chart.interpolate = "linear";
                    //chart.yOffset=1;
                    chart.tipTextCallBack = function (d) {
                        console.log(d);
                        return "<strong>" + d.name + ":</strong> <span style='color:red'>" + d.y + "</span>";
                    };
                    chart.write("#RegistrationChart_CFDA");*/
                } else {
                    $("#RegistrationChart_CFDA").html('no data available').removeClass("div-response");
                }
            }
        });
    }
});
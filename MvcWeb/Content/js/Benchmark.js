var benchmark = window.benchmark = function (option) {
    return new benchmark.prototype.init(option);
};
benchmark.fn = benchmark.prototype = {
    parameter: null,
    init: function () {
        var _this = this;
        _this.setFilterSlideListener();
        _this.createFilter();
        _this.SearchByKeyword();
        _this.setAddBenchmarkListener();
    },
    SearchByKeyword: function () {
        $("#keyword").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/Benchmark/GetKeywordAutocomplete",
                    dataType: "json",
                    data: { keyword: request.term },
                    success: function (val) {
                        var cache = [];
                        for (var i = 0; i < val.length; i++) {
                            cache.push({ label: val[i].Description, value: val[i].Description, raw: val[i] });
                        }
                        response(cache);
                        /*if (val.length < 1) {
                            $('#keyword').attr('searchfield', "");
                            $('#keyword').attr('searchid', "");
                        }*/
                    }
                });
            },
            select: function (event, ui) {
                var searchfield = ui.item.raw.FiledName;
                var searchid = ui.item.raw.ID;
                var keyword = ui.item.value;
                var str1 = "<span class=\"tag\" searchfield=\"" + searchfield + "\" searchid=\"" + searchid + "\"><span>";
                var str2 = "&nbsp;&nbsp;</span><a class=\"tagsinput-remove-link\"></a></span>";
                var tagsGroup = $("#tags-group");
                if($(tagsGroup).children(".tag").length >= 3){
                    alert("最多只能输入三个公司\nOnly three companies!");
                    return;
                }
                if($(tagsGroup).children(".tag").length){
                    var b = true;
                    $(tagsGroup).children(".tag").each(function(){
                        var _this = $(this);
                        if(_this.text().trim() === keyword){
                            alert("该条件已存在\nThis condition already exists!");
                            b = false;
                        }
                        return b;
                    });
                    if(b){
                       tagsGroup.append(str1 + keyword + str2); 
                    }
                }else{
                    $(".tagsinput").removeClass("hide");
                    tagsGroup.append(str1 + keyword + str2);
                }

                getTableData();

            },
            close: function(){
                $("#keyword").val("");//清空搜索框
            },
            position: {
                my: "left bottom",
                at: "left bottom"
            }
        });
    },

    GetFormulation: function () {
        var _this = this;
        $.ajax({
            url: "/Benchmark/GetFormulationFilter",
            data: _this.getSelectedFormulation(),
            async: false,
            type: "post",
            success: function (result) {
                $(_this.type_id).html(result);
                _this.setFilterSlideListener();
                _this.createFilter();
            }
        });
    },
    setFilterSlideListener: function () {
        function slideToggle(e) {
            $(this).parent().toggleClass("opened").children("ul.submenu-nav").slideToggle();
            e.stopPropagation();
        }
        $(".sidebar-menu a.phm").unbind("click").click(slideToggle);
    },
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        });
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#formulation01");
        this.setFilterEventListener(".origin");
        this.setFilterEventListener(".registrationcategory");
        this.setFilterEventListener(".applicationtype");
        this.setFilterEventListener(".inspectiongroup");
        this.setFilterEventListener(".ispipeline");
        this.setFilterEventListener(".cdereviewstatus");
        this.setFilterEventListener(".cdeopinion");
        this.setFilterEventListener(".cdeprocess");
        this.setFilterEventListener(".cfdareviewstatus");
        this.setFilterEventListener(".cdestatusdate");
        this.setFilterEventListener(".cdeacceptancedate");
    },
    setFilterEventListener: function (selector) {
        var _this = this,
            parent = $(".facetsSearch " + selector),
            checkeds = parent.find(".checked"),
            btnLevel = $(".facetsSearch " + selector).find(".btn_level"),
            showAll = $(".facetsSearch " + selector).find(".showAll");

        if (checkeds.length) {
            showAll.find("[name='show']").hide();
            showAll.find("[name='hide']").show();
        }
        showAll.unbind("click").bind("click", function () {
            var _this = $(this);
            if (_this.parent().children("div.hideCheckbox:hidden").length) {
                _this.parent().children("div.hideCheckbox").slideDown();
                _this.find("[name='show']").hide();
                _this.find("[name='hide']").show();
                _this.find("span").last().removeClass("icon-chevron-down").addClass("icon-chevron-up");
            } else {
                _this.parent().children("div.hideCheckbox").slideUp("fast");
                _this.find("[name='show']").show();
                _this.find("[name='hide']").hide();
                _this.find("span").last().removeClass("icon-chevron-up").addClass("icon-chevron-down");
            }
        });
        $(".facetsSearch " + selector + " div.checkbox").unbind("click").bind("click", function (e) {
            if (!$(this).is(".disabled")) {
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked").find("input").removeAttr("checked");
                    getTableData();
                } else {
                    $(this).addClass("checked").find("input").attr("checked", "checked");
                    getTableData();
                }
            }
            e.stopPropagation();
        });
        $(".facetsSearch " + selector + " label.checkbox").unbind("click").bind("click", function (e) {
            if (!$(this).is(".disabled")) {
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked").find("input").removeAttr("checked");
                    $(this).next(".hideLabel").find("label").removeClass("checked").find("input").removeAttr("checked");
                    getTableData();
                } else {
                    $(this).addClass("checked").find("input").attr("checked", "checked");
                    $(this).next("div").find("label.checkbox").addClass("checked").find("input").attr("checked", "checked");
                    getTableData();
                }
            }
            e.stopPropagation();
        });
        $(".facetsSearch " + selector + " select").change(function () {
            _this.type_id = selector;
            var select = $(this);
            select.attr("showValue", select.find("option:selected").html());
            select.parent().nextAll().hide();
            _this.GetFormulation();
            getTableData();
        });
        btnLevel.unbind("click").bind("click", function () {
            var _this = $(this);
            if (_this.find("span").is(".icon-plus-circle")) {
                _this.find("span").removeClass("icon-plus-circle").addClass("icon-minus-circle");
                _this.next().next("div").slideDown();
            } else {
                _this.find("span").removeClass("icon-minus-circle").addClass("icon-plus-circle");
                _this.next().next("div").slideUp();
            }
        });
    },
    setAddBenchmarkListener: function () {
        var _this = this;
        $("#addbenchmark").one("click", function () {
            $(".benchmarktwo").removeClass("hidden");
            $(this).hide();
            $.ajax({
                url: "/Benchmark/CreateBenchmarkFilter",
                type: "post",
                success: function (data) {
                    $("#facetsSearch_benchmark2").html(data);
                    $("#facetsSearch_benchmark2 #formulation").attr("id", "formulation01");
                    _this.createFilter();
                    getTableData();
                }
            });
        });
    },
    getSelectedFormulation: function () {
        var _this = this;
        var json = {},
                filters = $(_this.type_id + " select"),
                param = {};
        filters.each(function (i, e) {
            if ($(e).attr("requestkey") === "formulation") {
                if ($(e).val()) {
                    param["formulation"] ? param["formulation"].push($(e).val()) : param["formulation"] = [$(e).val()];
                }
            }
        });
        json["filter"] = benchmark.isEmptyObject(param) ? JSON.stringify(param) : "";
        return json;
    }
};
benchmark.prototype.init.prototype = benchmark.prototype;

benchmark.isEmptyObject = function (obj) {
    for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
            return true;
        }
    }
    return false;
};
String.prototype.stripscript = function () {//防注入
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    var rs = "";
    for (var i = 0; i < this.length; i++) {
        rs = rs + this.substr(i, 1).replace(pattern, "");
    }
    return rs;
};
/*数组去重*/
Array.prototype.unique = function () {
    var n = {}, r = []; //n为hash表，r为临时数组
    for (var i = 0; i < this.length; i++) //遍历当前数组
    {
        if (!n[this[i]]) //如果hash表中没有当前项
        {
            n[this[i]] = true; //存入hash表
            r.push(this[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
};
//get the data of table
var getTableData = function(){
    var json = {},
        benchmarkOneFilter = {},
        param = {},
        benchmarkTwoFilter = {},
        filters = $("#facetsSearch_benchmark1 .checkbox.checked > input, #facetsSearch_benchmark2 .checkbox.checked > input, #facetsSearch_benchmark1 select, #facetsSearch_benchmark2 select, #tags-group .tag");
    filters.each(function(i, e){
        var index = $(this).index() + 1;
        if ($(e).attr("requestkey") === "formulation") {
            if ($(e).val()) {
                if($(this).closest(".facetsSearch").attr("id") === "facetsSearch_benchmark1"){
                    benchmarkOneFilter["formulation"] ? benchmarkOneFilter["formulation"].push($(e).val()) : benchmarkOneFilter["formulation"] = [$(e).val()];
                }else{
                    benchmarkTwoFilter["formulation"] ? benchmarkTwoFilter["formulation"].push($(e).val()) : benchmarkTwoFilter["formulation"] = [$(e).val()];
                }
            }
        }else if($(e).hasClass("tag")){
            param[$(e).attr("searchfield") + index] ? param[$(e).attr("searchfield") + index].push($(e).attr("searchid")) : param[$(e).attr("searchfield") + index] = [$(e).attr("searchid")];
        }else {
            if ($(e).val()) {
                var key = $(e).attr("requestkey");
                if($(this).closest(".facetsSearch").attr("id") === "facetsSearch_benchmark1"){
                    if(benchmarkOneFilter[key]){
                        benchmarkOneFilter[key].push($(e).val());
                        benchmarkOneFilter[key] = benchmarkOneFilter[key].unique();
                    }else{
                        benchmarkOneFilter[key] = [$(e).val()];
                    }
                }else{
                    if(benchmarkTwoFilter[key]){
                        benchmarkTwoFilter[key].push($(e).val());
                        benchmarkTwoFilter[key] = benchmarkTwoFilter[key].unique();
                    }else{
                        benchmarkTwoFilter[key] = [$(e).val()];
                    }
                }
            }
        }
    });
    json["benchmarkOneFilter"] = benchmark.isEmptyObject(benchmarkOneFilter) ? JSON.stringify(benchmarkOneFilter) : "";
    if($("#addbenchmark").css("display") === "none"){
        json["benchmarkTwoFilter"] = benchmark.isEmptyObject(benchmarkTwoFilter) ? JSON.stringify(benchmarkTwoFilter) : "";
    }else{
        json["benchmarkTwoFilter"] = benchmark.isEmptyObject(benchmarkTwoFilter) ? JSON.stringify(benchmarkTwoFilter) : undefined;
    }

    json["keyword"] = benchmark.isEmptyObject(param) ? JSON.stringify(param) : "";
    json["dataType"] = $("#tab-graphic .active").data("value");
    $.ajax({
        url: "/Benchmark/GetBenchmarkStastics",
        type: "post",
        data: json,
        success: function(result){
            $("#table-data").html(result);
            var href = {};
            var str = "/Pipeline/DirectToPipeline?filter=";
            $("#table-data .table-responsive").each(function(){
                $(this).find("td").not(":first-child").on("click", "a", function(){
                    var _this = $(this);
                    if (_this.closest(".table-responsive").prev().attr("id") === "benchmark_one") {
                        href = benchmarkOneFilter;
                    }else{
                        href = benchmarkTwoFilter;
                    }
                    href[json["dataType"]] = [_this.attr("starttime"), _this.attr("endtime")];
                    href["isable"] = ["3"];//从benchmark到pipeline的必要条件
                    window.open(str + escape(JSON.stringify(href)));
                });
            });
            $(".sample-icon").each(function(){
                var _this = $(this);
                _this.find("td:first-child").on("click", function(){
                    if(_this.hasClass("sample-color")){
                        _this.removeClass("sample-color").siblings(".show-me").addClass("hide");
                    }else{
                        _this.addClass("sample-color").siblings(".show-me").removeClass("hide");
                    }
                });
            });
        }
    });
    //draw the graphic
    $.ajax({
        url: "/Benchmark/GetReviewDaysGraph",
        type: "post",
        data: json,
        success: function(result){
            var myChart1 = echarts.init(document.getElementById("graphic"));
            var xaxisArray = result.AllQuarters;
            var list = [], i = 1, xaxisData = [];
            for(var j = 0, len = xaxisArray.length; j < len; j++){
                list[2 * (i++)] = xaxisArray[j];
            }
            for(var j = 0, len = (list.length - 1); j < len;j++ ){
                xaxisData.push(j);
            }
            var legendData = [
                {
                    name: $("#benchamrk").val() + " I",
                    icon:"/Content/images/k1.png",
                    textStyle:{color:"#B9DD7C"}
                }
            ];
            var color = ["#e46662", "#e46eee", "#2212f0"];
            var currentData = [], benchmarkoneData = [], benchmarktwoData = [], currentData2 = [];
            //set value into 0
            var defaultData = {
                value: [0, 0, 0, 0],
                itemStyle: {
                    normal: {
                        color: "transparent",
                        color0: "transparent",         // 阴线填充颜色
                        lineStyle: {
                            width: 0,
                            color: "transparent",
                            color0: "transparent"      // 阴线边框颜色
                        }
                    },
                    emphasis: {
                        color: "transparent",
                        color0: "transparent",
                        lineStyle: {
                            width: 0,
                            color: "transparent",
                            color0: "transparent"      // 阴线填充颜色
                        }
                    }
                }
            }; //fill in benchmarkone's data
            for(var i = 0, len = result.BenchmarkOne.length; i < len; i++){
                currentData.push(result.BenchmarkOne[i].Value);
            }
            for(var i = 0, len = currentData.length * 2; i < len; i++){
                i % 2 === 0 ? benchmarkoneData.push(currentData[Math.floor(i / 2)]) : benchmarkoneData.push(defaultData);
            }
            //fill in benchmarktwo's data
            for(var i = 0, len = result.BenchmarkTwo.length; i < len; i++){
                currentData2.push(result.BenchmarkTwo[i].Value);
            }
            for(var i = 0, len = currentData2.length * 2; i < len; i++){
                i % 2 === 0 ? benchmarktwoData.push(defaultData) : benchmarktwoData.push(currentData2[Math.floor(i / 2)]);
            }
            var seriesData = [
                {
                    name: $("#benchamrk").val() + " I",
                    type: "k",
                    itemStyle: {
                        normal: {
                            color: "#B9DD7C",
                            color0: "#B9DD7C",
                            lineStyle: {
                                color: "#B9DD7C",
                                color0: "#B9DD7C"
                            }
                        }
                    },
                    xAxisIndex: 0,
                    data: benchmarkoneData
                }
            ];
            var seriesDataTwo = {
                name: $("#benchamrk").val() + " II",
                type: "k",
                itemStyle: {
                    normal: {
                        color: "#f7b565",
                        color0: "#f7b565",
                        lineStyle: {
                            color: "#f7b565",
                            color0: "#f7b565"
                        }
                    }
                },
                xAxisIndex: 0,
                data: benchmarktwoData
            };
            if($("#addbenchmark").css("display") === "none"){
                var benchmarktwo = {
                    name: $("#benchamrk").val() + " II",
                    icon:"/Content/images/k2.png",
                    textStyle:{color:"#f7b565"}
                };
                legendData.push(benchmarktwo);
                seriesData.push(seriesDataTwo);
            }
            //fill in company's data
            
            for(var i = 0, len = result.ProcessingDayForCompanyProduct.length; i < len; i++){
                var companyJson = {
                    name: "",
                    type: "scatter",
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            return "<p style=\"padding: 5px 10px 0 10px;\">" + params.value[1] + "</p>";
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: ""
                        }
                    },
                    xAxisIndex: 1,
                    symbol: "circle",
                    symbolSize: 3,
                    data: []
                };
                var companyName = {
                    name: "",
                    textStyle: {
                        color: ""
                    }
                };
                companyJson.name = $("#tags-group .tag").eq(i).text().trim();
                companyJson.itemStyle.normal.color = color[i];
                companyJson.data = result.ProcessingDayForCompanyProduct[i];
                companyName.name = $("#tags-group .tag").eq(i).text().trim();
                companyName.textStyle.color = color[i];
                seriesData.push(companyJson);
                legendData.push(companyName);
            }
            var option1 = {
                tooltip: {
                    trigger: "item",
                    padding: 0,
                    axisPointer: {
                        type: "none"
                    },
                    formatter : function (params) {
                        var s;
                        if(params.data[0] != undefined){
                            var enOrCh = $("#quantile").val();
                            s = "<p style=\"padding: 5px 10px 0 10px;\">" + params.seriesName+"<br/>"+
                           (list[params[1] + 1] || 0 ? list[params[1] + 1] : list[params[1] + 2]) 
                           + "<br/><b>12.5% " + enOrCh + ":</b>" + (params.data[0] || 0 ? params.data[0] : 0) +
                           ";<b style=\"padding-left: 5px;\">25% " + enOrCh + ":</b>" +
                           (params.data[1] || 0 ? params.data[1] : 0) + ";<br/><b>75% " + enOrCh + ":</b>" + 
                           (params.data[2] || 0 ? params.data[2] : 0) +
                           ";<b style=\"padding-left: 5px;\">87.5% " + enOrCh + ":</b>" + (params.data[3] || 0 ? params.data[3] : 0) + "</p>";
                        }else{
                            s = "";
                        }
                        return s;
                    }
                },
                grid: {
                    borderWidth: 0,
                    x:100,
                    y:90,
                    y2: 120
                },
                legend:{
                    x:"right",
                    selectedMode: true,
                    itemHeight:10,
                    padding:[20,80,0,0],
                    data:legendData
                    
                },
                dataZoom : {
                    show : true,
                    start: 20,
                    end: 50,
                    showDetail: false
                },
                xAxis: [
                    {
                        axisTick: {
                            inside: true,
                            onGap: false
                        },
                        axisLine: {show: false},
                        splitLine: { show: false },
                        type: "category",
                        data: xaxisData,
                        axisLabel:{
                            formatter:function(v){
                                return list[v + 2] == undefined ? "" : list[v + 2];
                            },
                            textStyle:{
                                fontSize:9
                            },
                            interval: 0,
                            rotate: 45
                        }
                    },
                    {
                        axisTick: {
                            inside: true,
                            onGap:false
                        },
                        axisLine: {show: false},
                        splitLine: { show: false },
                        type: "category",
                        data: xaxisData,
                        axisLabel:{
                            formatter:function(v){
                                return list[v + 1] == undefined ? "" : list[v + 1];
                            },
                            textStyle:{
                                fontSize:9
                            },
                            interval: 0,
                            rotate: 45
                        }
                    }
                ],
                yAxis: [
                    {
                        axisLine: {show: false},
                        axisLabel: { show: true },
                        splitLine: { show: true },
                        type: "value"
                    }
                ],
                animation: false,
                series: seriesData
            };
            myChart1.setOption(option1);
            window.onresize = function () {
                myChart1.resize();
            };
        }
    });
};
$(function () {
    var obj = benchmark({});
    /*$('#search-btn').on('click', function(){
        var keyword = $('#keyword').val() || 0 ? $('#keyword').val().trim().stripscript() : '';
        var str1 = '<span class="tag" searchfield="' + $('#keyword').attr('searchfield') + '" searchid="' + $('#keyword').attr('searchid') + '"><span>';
        var str2 = '&nbsp;&nbsp;</span><a class="tagsinput-remove-link"></a></span>';
        var tags_group = $('#tags-group');
        if(!keyword){
            return;
        }
        if($(tags_group).children('.tag').length >= 3){
            alert('最多只能输入三个公司\nOnly three companies!');
            return;
        }
        if($(tags_group).children('.tag').length){
            var b = true;
            $(tags_group).children('.tag').each(function(){
                var _this = $(this);
                if(_this.text().trim() == keyword){
                    alert('该条件已存在\nThis condition already exists!');
                    b = false;
                }
                return b;
            });
            if(b){
               tags_group.append(str1 + keyword + str2); 
            }
        }else{
            $('.tagsinput').removeClass('hide');
            tags_group.append(str1 + keyword + str2);
        }
        getTableData();

    });*/
    $("#clear-tags").on("click", function(){
        $("#tags-group .tag").remove();
        $(".tagsinput").addClass("hide");
        getTableData();
    });
    $("#tags-group").on("click", ".tagsinput-remove-link", function(){
        var _this = $(this);
        _this.closest(".tag").remove();
        if($("#tags-group").children(".tag").length < 1){
            $(".tagsinput").addClass("hide");
        }
        getTableData();
    });
    //open or close filter
    $(".first-tree").on("click", function(){
        var _this = $(this);
        if(_this.hasClass("opened")){
            _this.removeClass("opened").next().hide();
        }else{
            _this.addClass("opened").next().show();
        }
    });
    //tab
    $("#tab-graphic label").on("click", function(){
        var _this = $(this);
        _this.addClass("active").siblings().removeClass("active");
        $("#graphic-txt div").eq(_this.index()).show().siblings().hide();
        getTableData();
    });
    getTableData();
});
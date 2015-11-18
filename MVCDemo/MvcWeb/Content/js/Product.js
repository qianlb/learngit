facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
        this.pageInit();   //init
        this.setInputEventListener();    //input search
        this.setFilterSlideListener();   //filter events
        this.pageDataHander(_this.parameter.pageSize, 1);   //page
        this.setOptionColumnLinstener(this.parameter.saveSearch.editchooseColumnUrl);   //OptionColumnLinstener
        this.setOrderHeader();   //order
        this.setStoreUpListener(); //clearTag
        this.setAddSaveSearchListener(); //addSaveSearch
        this.createFilter();  //createFliter
        this.createHistory();  // createHistory
        this.getRecentSearch(); //recentSearch
        this.setBodyFilterListener();
        this.setExportListener();
        return this;
    },
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        })
        this.setFilterEventListener("#quickFilter");
        this.setFilterEventListener("#productType");
        this.setFilterEventListener("#productStatus");
        this.setFilterEventListener("#formulation");
        this.setFilterEventListener("#firstRegistrationDate");
        this.setFilterEventListener("#who_tree_atc_code");
        this.setFilterEventListener("#ephmra_tree_atc_code");
    },
    setBodyFilterListener: function () {
        var _this = this;
        $("td a.bodyFilter").live('click',function () {
            var requestKey = $(this).attr("requestkey"),
                requestValue = $(this).attr("value").trim(),
                container = requestKey == 'whocode' ? '#who_tree_atc_code' : '#ephmra_tree_atc_code';
            $(container).find("input[requestkey='" + requestKey + "'][value = '" + requestValue + "']").attr("checked", "checked").parent("label").addClass("checked");
            _this.getTableData().getFilterData().addRecentSearch();
        });
    },

    setExportListener: function () {
        var _this = this;
        $("#export").live('click', function () {
            var para = _this.getRequestParam();
            var validCountJson = {};
            validCountJson = _this.setValidCount();
            var searchCount = parseInt($("#recount").val());
            if (parseInt(validCountJson) > 0 && searchCount <= parseInt(validCountJson)) {
                window.location.href = "/Product/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + searchCount;
            } else if (parseInt(validCountJson) > 0 && searchCount > parseInt(validCountJson)) {
                var alterInfo = "You have selected " + searchCount + " lines of data to export. GBI terms and conditions allow up to 500 lines of data to be exported per day. You have exported " + (500 - parseInt(validCountJson)).toString() + " lines of data within the last 24 hours. Are you sure you want to export the first " + validCountJson + " data records";
                var statu = confirm(alterInfo);
                if (!statu) {
                    return false;
                }else{
                    window.location.href = "/Product/Export?keyword=" + para.keyword + "&filter=" + para.filter + "&order=" + para.order + "&validCount=" + validCountJson;
                }
            } else {
                alert("You have exceeded the daily data export limit within the last 24 hours. GBI terms and conditions allow up to 500 lines of data to be exported per day. For more information, please click OK button to contact GBI Support Team, or to cancel this data export request please click CANCEL button")
            }
        })
    },
    setValidCount: function () {
        var jsonString = {};
            $.ajax({
                url: "/Account/GetValidCount",
                type: "post",
                async: false,
                dateType: "json",
                data: {},
                success: function (json) {
                    jsonString= json;
                },
                error: function () {
                    //alert("数据获取失败");
                }
            });
            return jsonString;
    }
})
facetsSearch.prototype.init.prototype = facetsSearch.prototype
$(function () {
    var obj = facetsSearch({
        tableUrl: "/Product/GetProductList",
        tableContainer: "#productList",
        filterUrl: "/Product/GetProductFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            editchooseColumnUrl: "GetOptionalColumsForProductView",
            savedsearchModuleId: 6,
            optionColumnsModuleId :6
        }
    });    
});
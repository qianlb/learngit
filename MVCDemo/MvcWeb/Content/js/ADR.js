facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.range = null;
        _this.InitmaxMin = null;
        _this.language = null;
        _this.parameter.pageSize = 10;
        _this.getSaveSearchData();   //getSavedSearch
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
        this.pageInit();   //init
        return this;
    },
    createFilter: function () {
        var con = $(".facetsSearch li.root-level > ul > li > div");
        con.each(function () {
            var _this = $(this), len = _this.find(".checked").length;
            if (len) {
                _this.find(".hideCheckbox").css("display", "block");
            }
        });
        this.setFilterEventListener("#Issuer");
        this.setFilterEventListener("#ReportType");
        this.setFilterEventListener("#IssueDate");
    }
});
facetsSearch.prototype.init.prototype = facetsSearch.prototype;
$(function () {
    var obj = facetsSearch({
        tableUrl: "/ADR/GetADRreportList",
        tableContainer: "#ADRList",
        filterUrl: "/ADR/GetADRreportFilters",
        saveSearch: {
            saveSearchUrl: "/SaveSearch/GetSaveSearch",
            //editchooseColumnUrl: "GetOptionalColumsForClinicalPathwayView",
            savedsearchModuleId: 29,
            optionColumnsModuleId: 29
        }
    });
});


















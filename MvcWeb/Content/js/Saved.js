facetsSearch.prototype = $.extend(facetsSearch.prototype, {
    init: function (option) {
        var _this = this;
        _this.parameter = option;
        _this.parameter.tab = $(".savedType > a.active");
        _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
        _this.parameter.tabContent = $(_this.parameter.tableContainer).children().eq(0);
        this.setSavedSearchDeleteListener();
        this.setSavedSearchEditListener();
        this.setSavedSearchHistoryListener();
        this.setSavedAlertListener();
        this.setsavedTypeListener();
        this.setNotificationEditListener();
        this.pageInit();
        return this;
    },

    pageInit: function () {
        if ($('#tabindex').val() == 3) {
            $(".savedType > a[type='tracking']").click();
        };
        if ($('#tabindex').val() == 2) {
            $(".savedType > a[type='bookMark']").click();
        }
    },

    //获取数据
    getFilterData: function () {
        var filter = $("span.tag > span"),
            json = {};
        filter.each(function () {
            var filterItem = {}, _this = $(this), reauestKey = _this.attr("requestkey");
            if (reauestKey == "keyword" || reauestKey == "newsType" || reauestKey == "dataType") {
                json[reauestKey] = [_this.attr("value") || ""];
            } else if (_this.attr("requestkey") in json) {
                json[reauestKey].push(_this.attr("value") || "")
            } else {
                json[reauestKey] = [_this.attr("value") || ""];
            }
        })
        json = facetsSearch.isEmptyObject(json) ? JSON.stringify(json) : "";
        return json;
    },
    //savedSearchDelete
    setSavedSearchDeleteListener: function () {
        var _this = this;
        $(".DeleteSaveSearch").unbind("click").bind("click", function () {
            var savedSearchDeleteId = $(this).parent().parent().attr("saveSearchId");
            $("#savedSearchDeleId").html(savedSearchDeleteId)
        });
        //Linda
        $("#savedSearchDeleBtn").unbind("click").bind("click", function () {
            var savedSearchDeleteId = $("#savedSearchDeleId").text();
            $.ajax({
                url: "/Saved/DeleteSaveSearch",
                type: "post",
                async: true,
                dateType: "json",
                data: { saveSearchId: savedSearchDeleteId },
                success: function (data) {
                    $(".savedSearchDeleDismiss").click();
                    $(".savedType > a[type='tracking'] >> .count").text(data.AlertCount);
                    _this.getTabContent();
                },
                error: function () {
                    //alert("删除savedSearch失败");
                }
            });
        })
    },
    //savedSearchEdit
    setSavedSearchEditListener: function () {
        var _this = this;
        $(".EditSaveSearch").unbind('click').bind('click', function () {
            var savedSearchEditId = $(this).parent().parent().attr("savesearchid"),
                moduleId = $(this).parent().parent().attr("moduleid");
            $.ajax({
                url: "/Saved/GetSavedSearchById",
                type: "post",
                async: true,
                dateType: "json",
                data: { savedSearchId: savedSearchEditId },
                success: function (partical) {
                    $("#savedSearchEditBody").html(partical);
                    //转换UTC时间
                    UTCToLocalSavedSearch($("#savedSearchEditBody"));
                    //去掉空白时间
                    var removeTag = $("#savedSearchEditBody").find("span[requestkey = 'date'],span[requestkey = 'approvaldate'],span[requestkey = 'expiredate']");
                    removeTag.each(function () {
                        if (!$(this).attr("value")) {
                            $(this).parent("span.tag").hide();
                        }
                    })

                    _this.savedSearchBindEvent(savedSearchEditId, moduleId);
                },
                error: function () {
                    //alert("获取editSavedSearch内容失败");
                }
            });

        })
    },
    savedSearchBindEvent: function (savedSearchId, moduleId) {
        var _this = this;
        $(".tagClose").unbind("click").bind("click", function () {
            $(this).parent(".tag").remove();
        });
        $(".addItem").bind("click", function () {
            var addItemVal = $(".addItemVal").val().trim();
            if (addItemVal) {
                var keyWord = $(".tag > span[requestkey = 'keyword']");
                if (keyWord.length) {
                    var keyName = keyWord.attr("value");
                    keyWord.html(addItemVal + "&nbsp;&nbsp;");
                    keyWord.attr("value", addItemVal);
                } else {
                    var tagItem = $('<span class="tag"><span requestkey="keyword" value="' + addItemVal + '">' + addItemVal + '&nbsp;&nbsp;</span><a class="tagsinput-remove-link tagClose"></a></span>');
                    tagItem.find(".tagClose").click(function () {
                        $(this).parent(".tag").remove();
                        $(".addItemVal").val("");
                    })
                    $(".tagsinput").append(tagItem);
                }
            }
        });
        $("#savedSearchEditBtn").unbind("click").bind("click", function () {
            var savedSearchName = $("#recipient-name").val(),
                resultCount = $(".resultCount").text().trim().replace(",","");
            var filter = _this.getFilterData();
            if ($("span.tag").length) {
                $.ajax({
                    url: "/Saved/UpdateSavedSearch",
                    type: "post",
                    async: true,
                    dateType: "json",
                    data: { savedSearchId: savedSearchId, filter: filter, savedSearchName: savedSearchName, resultCount: resultCount },
                    success: function () {
                        _this.getTabContent();
                        $(".close").click();
                    },
                    error: function () {
                        //alert("获取editSavedSearch内容失败");
                    }
                });
            } else {
                //alert("tag不能为空");
            }
        })

        $("#TestSavedSearch").bind("click", function () {
            var filter = _this.getFilterData();
            if ($("span.tag").length) {
                $.ajax({
                    url: "/Saved/TestSavedSearch",
                    type: "post",
                    async: true,
                    dateType: "json",
                    data: { moduleId: moduleId, filter: filter },
                    success: function (count) {
                        $(".resultCount").html(parseFloat(count).toLocaleString());
                    },
                    error: function () {
                        //alert("TestSavedSearch内容失败");
                    }
                });
            } else {
                //alert("tag不能为空");
            }
        })
    },
    setSavedSearchHistoryListener: function () {
        var _this = this;
        $(".SaveSearchHistory").unbind("click").bind("click", function () {
            var savedSearchHistoryId = $(this).parent().parent().attr("savesearchid"),
                productName = $(this).parent().siblings(".productIcon").children("span").attr("productname"),
                productIcon = $(this).parent().siblings(".productIcon").children("span").attr("class");
            $.ajax({
                url: "/Saved/GetSavedSearchLogBySavedSearchId",
                type: "post",
                async: true,
                //dateType: "json",
                data: { saveSearchId: savedSearchHistoryId },
                success: function (partical) {
                    $("#savedSearchHistoryBody").html(partical);
                    $(".historyIcon").removeClass().addClass(productIcon);
                    $(".historyName").html(productName);
                },
                error: function () {
                    //alert("获取savedSearchHistoryBody内容失败");
                }
            });
        })
    },
    //获取内容
    getTabContent: function () {
        var _this = this;
        $.ajax({
            url: _this.parameter.tableUrl,
            type: "post",
            async: true,
            dateType: "json",
            success: function (partialView) {
                _this.parameter.tabContent.html(partialView);
                _this.parameter.tab.find(".count").html(_this.parameter.tabContent.find("#count").val());
                //根据不同的tab绑定事件
                switch (_this.parameter.tableUrl) {
                    case "/Saved/GetSavedSeachList":
                        _this.setSavedSearchBindEvent();
                        break;
                    case "/Saved/GetBookMarkList":
                        _this.setBookMarkBindEvent();
                        break;
                }
            },
            error: function () {
                //alert("数据获取失败");
            }
        });
        return this;
    },
    //绑定savedSearch事件
    setSavedSearchBindEvent: function () {
        var _this = this;
        _this.setSavedSearchDeleteListener();
        _this.setSavedSearchHistoryListener();
        _this.setSavedSearchEditListener();
        _this.setSavedAlertListener();
    },

    setBookMarkBindEvent: function () {
        var _this = this;
        $(".DeleteBookmark").unbind("click").bind("click", function () {
            var bookmarkDeleteId = $(this).parent().parent().attr("bookmarkid");
            $("#bookMarkDeleId").html(bookmarkDeleteId)
        });
        $("#bookMarkDeleBtn").unbind("click").bind("click", function () {
            var bookMarkDeleteId = $("#bookMarkDeleId").text();
            $.ajax({
                url: "/Saved/DeleteBookMark",
                type: "post",
                async: true,
                dateType: "json",
                data: { bookmarkId: bookMarkDeleteId },
                success: function () {
                    $(".bookMarkDeleDismiss").click();
                    _this.getTabContent();
                },
                error: function () {
                    //alert("删除bookAMrk失败");
                }
            });
        })
    },
    setTrackingBindEvent: function () {
        var _this = this;
        _this.parameter.tab.find(".count").html($("#alertContent").find("#count").val());
        $("#alertMenu >> li.active[type=items] >> i").html($("#alertContent").find("#subcount").val());
        $(".DeleteTracking").unbind("click").bind("click", function () {
            var trackingDeleteId = $(this).parent().parent().attr("trackingid");
            $("#trackingDeleId").html(trackingDeleteId)
        });
        $("#trackingDeleBtn").unbind("click").bind("click", function () {
            var trackingDeleteId = $("#trackingDeleId").text(),
                _sectionName = $("#sectionName").val();
            $.ajax({
                url: "/Saved/DeleteTracking",
                type: "post",
                async: true,
                dateType: "json",
                data: { trackingId: trackingDeleteId, sectionName: _sectionName },
                success: function (json) {
                    $(".trackingDeleDismiss").click();
                    $("#alertContent").html(json);
                    _this.setTrackingBindEvent();
                },
                error: function () {
                    //alert("删除tracking失败");
                }
            });
        });
        _this.setNotificationEditListener();
    },
    setNotificationEditListener: function () {
        var _this = this;
        $('.EditNotification').unbind('click').bind('click', function () {
            var notificationId = $(this).parent().parent().attr('trackingid');
            var notificationNameOld = $(this).parent().siblings("#trackingName").text();
            $('#trackingNameForUpdate').val(notificationNameOld);
            var href = $(this).parent().siblings("#trackingName").children("a").attr("href");
            _this.setNotificationEditPageBindEvent(notificationId,href);
        })
    },

    setNotificationEditPageBindEvent: function (notificationId,href) {
        var _this = this;
        $("#notificationEditBtn").unbind('click').bind("click", function () {
            var notificationName = $('#trackingNameForUpdate').val().trim();
            if (!notificationName || notificationName.length > 100) {
                return false;
            }
            $.ajax({
                url: '/Saved/UpdateNotification',
                type: "post",
                data: { trackingId: notificationId, trackingName: notificationName },
                async: true,
                success: function (json) {
                    $("#alertContent").find('tr[trackingid=' + notificationId + ']').children('#trackingName').html("<a target=\"_blank\" href=" + href + ">" + notificationName + "</a>");
                    $(".close").click();
                },
                error: function () {
                    //alert("修改Tracking失败")
                }
            });
        });
    },

    setsavedTypeListener: function () {
        var _this = this;
        $(".savedType > a").bind("click", function () {
            $(this).addClass("active").siblings().removeClass("active")
            var type = $(this).attr("type");
            switch (type) {
                case "savedSearch":
                    _this.parameter.tableUrl = "/Saved/GetSavedSeachList";
                    _this.parameter.tab = $(this);
                    $(".tabCon>div").addClass("hide").eq(_this.parameter.tab.index()).removeClass("hide");
                    _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
                    _this.parameter.tabContent = _this.parameter.tableContainer.children().eq(0);
                    _this.getTabContent();
                    break;
                case "bookMark":
                    _this.parameter.tableUrl = "/Saved/GetBookMarkList";
                    _this.parameter.tab = $(this);
                    $(".tabCon>div").addClass("hide").eq(_this.parameter.tab.index()).removeClass("hide");
                    _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
                    _this.parameter.tabContent = _this.parameter.tableContainer.children().eq(0);
                    _this.getTabContent();
                    break;
                case "tracking":
                    _this.parameter.tab = $(this);
                    $(".tabCon>div").addClass("hide").eq(_this.parameter.tab.index()).removeClass("hide");
                    _this.parameter.tableContainer = $(".tabCon>div").eq(_this.parameter.tab.index());
                    _this.parameter.tabContent = _this.parameter.tableContainer.children().eq(0);
                    _this.getTrackingCon();
                    break;
            }

        })
    },
    getTrackingCon: function () {
        var _this = this;
        //$.ajax({
        //    url: '/Saved/GetDailyDose',
        //    type: "post",
        //    async: true,
        //    success: function (json) {
        //        $("#dailyDoesCon").html(json);
        //        _this.setDailyDoseListener();
        //    },
        //    error: function () {
        //        alert("修改Tracking失败")
        //    }
        //});
        $.ajax({
            url: '/Saved/GetAlertMenu',
            type: "post",
            async: false,
            success: function (json) {
                $("#alertMenu").html(json);
                _this.parameter.tab.find(".count").html($("#alertMenu").find("#muneCount").val());
                _this.setAlertMenuListener();
            },
            error: function () {
                //alert("修改Tracking失败")
            }
        });
        $("#alertMenu >> li.active >  a").click();
    },
    setDailyDoseListener: function () {
        var _this = this;
        $("#alertContent").find("label.checkbox").addClass("disabled").unbind('click').bind('click', function () {
            var $this = $(this);
            if ($this.is(".disabled"))
                return false;
            if ($this.is(".checked")) {
                $this.removeClass("checked");
            } else {
                $this.addClass("checked");
            }
            return false;
        })
        //edit setting
        $("#dailyedit").unbind('click').bind("click", function () {
            $(this).parent().addClass("hidden").siblings().removeClass("hidden");
            $("#alertContent").find("label.checkbox").removeClass("disabled");
            return false;
        })
        //cancel
        $("#dailycancel").unbind('click').bind("click", function () {
            $(this).parent().addClass("hidden").siblings().removeClass("hidden");
            $("#alertMenu >> li.active >  a").click();
            return false;
        })
        //save
        $("#dailysave").unbind('click').bind("click", function () {
            $(this).parent().addClass("hidden").siblings().removeClass("hidden");
            $("#alertContent").find("label.checkbox").addClass("disabled");
            _this.updateDailyDoes();
            return false;
        })
    },
    setAlertMenuListener: function () {
        var _this = this;
        $("#alertMenu").find("li[type=frequency] > a").unbind('click').bind('click', function () {
            $(this).parent().addClass("active").siblings().removeClass("active");
            $.ajax({
                url: '/Saved/GetAlertFrequency',
                type: "post",
                async: true,
                success: function (json) {
                    $("#alertContent").html(json);
                    _this.setFrequencyBindEvent();
                },
                error: function () {
                    //alert("修改Tracking失败")
                }
            });
            return false;
        })
        $("#alertMenu").find("li[type=content] > a").unbind('click').bind('click', function () {
            $(this).parent().addClass("active").siblings().removeClass("active");
            $.ajax({
                url: '/Saved/GetDailyDose',
                type: "post",
                async: true,
                success: function (json) {
                    $("#alertContent").html(json);
                    _this.setDailyDoseListener();
                },
                error: function () {
                    //alert("修改Tracking失败")
                }
            });
            return false;
        })
        $("#alertMenu").find("li[type=items] > a").unbind('click').bind('click', function () {
            var _sectionName = $(this).attr("value").trim();
            $(this).parent().addClass("active").siblings().removeClass("active");
            $.ajax({
                url: '/Saved/GetTrackingList',
                type: "post",
                data: { sectionName: _sectionName },
                async: true,
                success: function (json) {
                    $("#alertContent").html(json);
                    _this.setTrackingBindEvent();
                },
                error: function () {
                    //alert("修改Tracking失败")
                }
            });
            return false;
        })
    },
    updateDailyDoes: function () {
        var _this = this, json = {}, counry = [], category = [], industry = [];
        $("#TrackingCounry").find("label.checked input").each(function () {
            counry.push($(this).val())
        })
        $("#TrackingCategory").find("label.checked input").each(function () {
            category.push($(this).val())
        })
        $("#TrackingIndustry").find("label.checked input").each(function () {
            industry.push($(this).val())
        });
        counry = JSON.stringify(counry);
        category = JSON.stringify(category);
        industry = JSON.stringify(industry);
        $.ajax({
            url: '/Saved/UpdateDailyDose',
            type: "post",
            data: { counry: counry, category: category, industry: industry },
            async: true,
            success: function () {
                //alert("success")
            },
            error: function () {
                //alert("error")
            }
        });
    },
    setSavedAlertListener: function () {
        //Linda
        $("span.icon-alarm").bind("click", function () {
            var _this = $(this);
            trackid = _this.attr("trackid"),
            tracktype = _this.attr("tracktype"),
            trackname = _this.attr("trackname");
            $.ajax({
                type: "post",
                url: "/Saved/SaveUserTrackingViaSearch",
                data: { moduleName: tracktype, titleId: trackid, trackingName: trackname },
                dataType: "json",
                async: true,
                success: function (data) {
                    if (data.Flag == "1") {
                        _this.addClass("text-warning");
                        $("span[trackid=" + trackid + "][tracktype=" + tracktype + "]").addClass("text-warning");
                        $(".savedType > a[type='tracking'] >> .count").text(data.AlertCount);
                    } else {
                        _this.removeClass("text-warning");
                        $("span[trackid=" + trackid + "][tracktype=" + tracktype + "]").removeClass("text-warning");
                        $(".savedType > a[type='tracking'] >> .count").text(data.AlertCount);
                    }
                }
            })
        })
    },
    setFrequencyBindEvent: function () {
        var _this = this;
        //add disabled style
        $("#alertContent select").attr("disabled", true);
        //checkbox click
        $("#alertContent").find("label.checkbox").addClass("disabled").unbind('click').bind('click', function () {
            var $this = $(this);
            if ($this.is(".disabled"))
                return false;
            if ($this.is(".checked")) {
                $this.removeClass("checked");
            } else {
                $this.addClass("checked");
            }
            return false;
        })
        //edit setting
        $("#frequencyedit").unbind('click').bind("click", function () {
            var _this = $(this);
            _this.parent().addClass("hidden").siblings().removeClass("hidden");
            $("#alertContent select").attr("disabled", false);
            $("#alertContent").find("label.checkbox").removeClass("disabled");
            return false;
        })
        //cancel
        $("#frequencycancel").unbind('click').bind("click", function () {
            var _this = $(this);
            _this.parent().addClass("hidden").siblings().removeClass("hidden");
            $("#alertMenu >> li.active >  a").click();
            return false;
        })
        //save
        $("#frequencysave").unbind('click').bind("click", function () {
            var _this = $(this),
                isReceive_DailyDose,
                frequency_DailyDose,
                sendTime_DailyDose,
                isReceive_Tracking,
                frequency_Tracking,
                sendTime_Tracking,
                _dailyDoseContains = $("#alertContent div[type=dailyDose]"),
                _trackingContains = $("#alertContent div[type=tracking]");
            //init
            isReceive_DailyDose = _dailyDoseContains.find("#isReceive").hasClass("checked");
            frequency_DailyDose = _dailyDoseContains.find("#frequency").find("option:selected").val();
            sendTime_DailyDose = _dailyDoseContains.find("#sendTime").find("option:selected").val();
            isReceive_Tracking = _trackingContains.find("#isReceive").hasClass("checked");
            frequency_Tracking = _trackingContains.find("#frequency").find("option:selected").val();
            sendTime_Tracking = _trackingContains.find("#sendTime").find("option:selected").val();
            $.ajax({
                url: '/Saved/UpdateAlertFrequency',
                type: "post",
                data: { isReceive_DailyDose: isReceive_DailyDose, frequency_DailyDose: frequency_DailyDose, sendTime_DailyDose: sendTime_DailyDose, isReceive_Tracking: isReceive_Tracking, frequency_Tracking: frequency_Tracking, sendTime_Tracking: sendTime_Tracking },
                async: false,
                success: function (json) {
                    //add disabled style
                    $("#alertContent select").attr("disabled", true);
                    _this.parent().addClass("hidden").siblings().removeClass("hidden");
                    $("#alertContent").find("label.checkbox").addClass("disabled");
                },
                error: function () {
                    //alert("修改Tracking失败")
                }
            });
            return false;
        })
    },
})
facetsSearch.prototype.init.prototype = facetsSearch.prototype

$(function () {
    var obj = facetsSearch({
        tableUrl: "/Saved/GetSavedSeachList",
    });
})
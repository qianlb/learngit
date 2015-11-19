$(function () {
    $("#MailBtn").click(function () {
        var feedbackContent = $.trim($("#feedbackcontent").val());
        if (feedbackContent) {
            $("#feedbackSuccessInfo").removeClass("hide");
            $("#feedbackcontent").val("");
            $.ajax({
                url: "/Mail/Feedback",
                type: "post",
                data: { content: feedbackContent },
                async: false,
                dataType: "json",
                success: function () {
                },
                error: function () {
                    $("#feedbackSuccessInfo").addClass("hide");
                }
            });
            return false;
        }
        else {
            alert("Please fill in the feedback information, Thanks!");
        }
        return false;
    });
    $(".ep_navigator").click(function () {
        $(this).parent("li").removeClass("active").addClass("active").siblings().removeClass("active");
    });

    $("#logout").click(function () {
        window.location.href = "/Account/Logout";
    });

    var currentLan = $(".languageList > li >.isCurrnet").length;
    var currVal = "";
    if (currentLan) {
        currVal = $(".languageList > li >.isCurrnet").text();
        $(".languageList > li >.isCurrnet").parent().remove();
    } else {
        currVal = $(".languageList > li >.language").eq(0).text();
        $(".languageList > li >.language").eq(0).parent().remove();
    }
    currVal += "<b class=\"caret\"></b>";
    $(".lanVal").html(currVal);


    //request Training
    $("#requestTrainingBtn").live("click", function () {
        $("#RequestTrainingModal .mvm").hide("fast");
        $("#RequestTrainingModal label.checkbox").removeClass("checked");
        $("#requestTrainingSuccessInfo").addClass("hide");
    });
    $("#RequestTrainingModal .mbs").click(function () {
        $(this).next(".mvm").show("normal").siblings(".mvm").hide("normal");
    });

    function requestTraining(condition, des) {
        $("#requestTrainingSuccessInfo").removeClass("hide");
        $.ajax({
            url: "/Mail/TrainingRequest",
            type: "post",
            data: { condition: condition, description: des },
            dataType: "json",
            success: function () {
            },
            error: function () {
                $("#requestTrainingSuccessInfo").addClass("hide");
            }
        });
    }

    $("#requestSysInfo").click(function () {
        var _this = $(this), condition = {}, des = "";
        condition["title"] = [_this.attr("title")];
        condition["checkbox"] = [];
        condition = JSON.stringify(condition);
        requestTraining(condition, des);
    });
    $("#explainMore").click(function () {
        var condition = {}, des = "";
        condition["title"] = ["I want to"];
        condition["checkbox"] = [];
        $(".explainMore").each(function () {
            if ($(this).is(".checked")) {
                condition["checkbox"].push($(this).find("input").val());
            }
        });
        condition = JSON.stringify(condition);
        requestTraining(condition, des);
    });
    $("#learanMore").click(function () {
        var condition = {}, des = $("#RequestTrainingComment").val();
        condition["title"] = ["Interested in learning more about"];
        condition["checkbox"] = [];
        $(".learanMore").each(function () {
            if ($(this).is(".checked")) {
                condition["checkbox"].push($(this).find("input").val());
            }
        });
        condition = JSON.stringify(condition);
        requestTraining(condition, des);
    });
    $("#unauthorized_upgrade").click(function () {

        $.ajax({
            url: "/News/GetUserUpgradeInfo",
            type: "post",
            async: false,
            dateType: "json",
            success: function (data) {
                $("form#upgrade").html(data);
            }
        });

        $("#slide1").css("display", "none");
        $("#slide2").css("display", "block").find("label.checkbox:not('first')").removeClass("checked");
        $("#slide3").css("display", "none");
        $("#ExceedModal").modal("show");
        $(".interestedIn label.checkbox").unbind("click").bind("click", function (e) {
            if ($(this).hasClass("checked")) {
                $(this).removeClass("checked").find("input").removeAttr("checked");
            } else {
                $(this).addClass("checked").find("input").attr("checked", "checked");
            }
            e.stopPropagation();
            return false;
        });
    });
    $("#subScribe").click(function () {
        $("#slide1").css("display", "none");
        $("#slide2").css("display", "block").find("label.checkbox:not('first')").removeClass("checked");
        $("#slide3").css("display", "none");
        $("#ExceedModal").modal("show");
        $(".interestedIn label.checkbox").unbind("click").bind("click", function (e) {
            if ($(this).hasClass("checked")) {
                $(this).removeClass("checked").find("input").removeAttr("checked");
            } else {
                $(this).addClass("checked").find("input").attr("checked", "checked");
            }
            e.stopPropagation();
            return false;
        });
    });
    $("#upgradeBtn").unbind("click").bind("click", function () {
        $("#slide2").hide();
        $("#slide3").show();
        $.ajax({
            url: "/News/SendUpgrade",
            type: "post",
            async: true,
            data: $("#upgrade").serialize(),
            success: function () {
                
            }
        });
    });
    $("#showSecond").unbind("click").bind("click", function () {
        $("#slide1").slideUp({
            easing: "easeInOutCirc",
            duration: 800
        });
        $("#slide2").show({
            easing: "easeInOutCirc",
            duration: 800
        });
    }); /*点击 Privacy Policy， 获取其内容*/
    $("#PrivacyModal").on("show.bs.modal", function () {
        $.ajax({
            url: "/Home/GetPrivacyContent",
            type: "get",
            dataType: "html",
            axync: true,
            success: function (result) {
                $("#PrivacyModal").html(result);
            }
        });
    });

    /*点击  Terms of Service ， 获取其内容*/
    $("#TermsModal").on("show.bs.modal", function () {
        $.ajax({
            url: "/Home/GetTermsContent",
            type: "get",
            dataType: "html",
            axync: true,
            success: function (result) {
                $("#TermsModal").html(result);
            }
        });
    });
});

$(document).ajaxError(function (e, xhr) {
    if (xhr.status === 401) {
        window.location.reload();
    }
    else if (xhr.status === 404)
        window.location.href = "/Home/Error404";
    else if (xhr.status === 408) {

    } else
        window.location.href = "/Home/Error";
});

String.prototype.stripscript = function () {//防注入
    var pattern = new RegExp("[`~!@#$^&*()=|{}';',\\[\\]<>?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    var rs = "";
    for (var i = 0; i < this.length; i++) {
        rs = rs + this.substr(i, 1).replace(pattern, "");
    }
    return rs;
};
var formatNumber = function (num) {
    var b = parseInt(num).toString();
    var len = b.length;
    if (len <= 3) { return b; }
    var r = len % 3;
    return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
};
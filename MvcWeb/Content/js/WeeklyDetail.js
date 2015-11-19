$(function (){
    var WeeklyTitle = $("#WeeklyTitle").val();
    var Url = window.location.href;
    $.ajax({
        url: "/Home/ShareUrl",
        type: "post",
        async: false,
        success: function (result) {
            if (result != null) {
                Url = result;
            }
        },
        error: function () {
            //alert("数据获取失败");
        }
    });

    var emailHref = $("#share span.btn-social-email a").attr("href");
    emailHref = emailHref + Url;
    $("#share span.btn-social-email a").attr("href", emailHref);

    $("#share button").bind('click', function () {
        var shareToPlatform = $(this).attr("name");
        share(Url, WeeklyTitle, "", shareToPlatform);
    });
    UTCToLocal($('.container-fluid'));
    $(".media-body > hr").first().remove();
})
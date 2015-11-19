$(function () {
    var InterviewTitle = $("#InterviewTitle").val();
    var url = window.location.href;
    $.ajax({
        url: "/Home/ShareUrl",
        type: "post",
        async: false,
        success: function (result) {
            if (result != null) {
                url = result;
            }
        },
        error: function () {
            //alert("数据获取失败");
        }
    });

    var emailHref = $("#share span.btn-social-email a").attr("href");
    emailHref = emailHref + url;
    $("#share span.btn-social-email a").attr("href", emailHref);

    $("#share button").bind('click', function () {
        var shareToPlatform = $(this).attr("name");
        share(url, InterviewTitle, "", shareToPlatform);
    });
    UTCToLocal($('.container-fluid'));
    $( 'audio' ).audioPlayer();
});
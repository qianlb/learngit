function share(url, title, summary, sns) {
    var shareURL = "";
    var width = 626;
    var height = 436;
    title = encodeURIComponent(title);
    summary = encodeURIComponent(summary);
    if (sns == "renren") {
        // grab page title and page description
        shareURL = 'http://share.renren.com/share/buttonshare.do?link=' + url + '&title=' + title;
    } else if (sns == "douban") {
        // allow title, url, summary
        shareURL = 'http://www.douban.com/recommend/?url=' + url + '&title=' + title + '&comment=' + summary;
    } else if (sns == "sina") {
        // one box
        shareURL = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url;
    } else if (sns == "t163") {
        // one box
        var source = 'quamnet.com';
        shareURL = 'http://t.163.com/article/user/checkLogin.do?link=' + url + 'source=' + source + '&info=' + title + ' ' + url;
    } else if (sns == "kaixin") {
        // allow title, url, summary
        width = 1050;
        height = 600;
        shareURL = 'http://www.kaixin001.com/~repaste/repaste.php?&rurl=' + url + '&rtitle=' + title + '&rcontent=' + summary;
    } else if (sns == "tqq") {
        var pic = "http://www.quamnet.com/images/sns_quamnet.jpg";
        pic = encodeURIComponent(pic.replace(/\|\|/gi, "&"));
        // one box
        shareURL = 'http://v.t.qq.com/share/share.php?title=' + title + '&pic=' + pic + '&url=' + url;
    } else if (sns == "twitter") {
        // one box
        width = 800;
        height = 515;
        shareURL = 'http://twitter.com/home?status=' + title + ' ' + url;
    } else if (sns == "facebook") {
        // grab page title and page description
        shareURL = 'http://www.facebook.com/sharer.php?u=' + url + '&t=' + title;
    } else if (sns == "linkedin") {
        // allow title, url, summary but images?
        shareURL = 'http://www.linkedin.com/shareArticle?mini=true&source=Quamnet.com&url=' + url + '&title=' + title + '&summary=' + summary;
    }
    
    if (shareURL != '' && url != '' && title != '') {
        if (!document.all)
            window.open(shareURL, "Quamnet.com sns share", 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=' + width + ',height=' + height);
        else
            window.open(shareURL);
    }
}


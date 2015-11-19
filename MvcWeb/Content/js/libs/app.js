$(document).ready(function() {
    // show sidebar and overlay
    function showSidebar() {
        sidebar.css('margin-left', '0');

        overlay.show(0, function() {
            overlay.fadeTo('500', 0.8);
        });

        sidebar.find('.btn-group').removeClass('open');
    }

    // hide sidebar and overlay
    function hideSidebar() {
        sidebar.css('margin-left', sidebar.width() * -1 + 'px');

        overlay.fadeTo('500', 0, function() {
            overlay.hide();
        });
    }

    // selectors
    var sidebar = $('[data-sidebar]');
    var button = $('[data-sidebar-button]');
    var overlay = $('[data-sidebar-overlay]');

    // add height to content area
    overlay.parent().css('min-height', 'inherit');

    // hide sidebar on load
    sidebar.css('margin-left', sidebar.width() * -1 + 'px');

    sidebar.show(0, function() {
        sidebar.css('transition', 'all 0.5s ease');
    });

    // toggle sidebar on click
    button.click(function() {
        if (overlay.is(':visible')) {
            hideSidebar();
        } else {
            showSidebar();
        }
        return false;
    });

    // hide sidebar on overlay click
   /* overlay.click(function() {
        hideSidebar();
    });*/
//点击空白区域隐藏sidebar新增代码
    $(".btn-group > .dropdown-toggle").dropdown('toggle');
    sidebar.click(function (e) {
        e.stopPropagation();
    });
    $(document).on('click', function(e){
        hideSidebar();
    });
});
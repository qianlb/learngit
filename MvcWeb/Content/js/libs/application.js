// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
};

(function ($) {

    // Add segments to a slider
    $.fn.addSliderSegments = function (amount, orientation) {
        return this.each(function () {
            if (orientation == "vertical") {
                var output = ''
                  , i;
                for (i = 1; i <= amount - 2; i++) {
                    output += '<div class="ui-slider-segment" style="top:' + 100 / (amount - 1) * i + '%;"></div>';
                };
                $(this).prepend(output);
            } else {
                var segmentGap = 100 / (amount - 1) + "%"
                  , segment = '<div class="ui-slider-segment" style="margin-left: ' + segmentGap + ';"></div>';
                $(this).prepend(segment.repeat(amount - 2));
            }
        });
    };

    $(function () {

        // jQuery UI Sliders
        var $slider3 = $("#slider3")
          , slider3ValueMultiplier = 1000000
          , slider3Options;

        if ($slider3.length > 0) {
            $slider3.slider({
                min: 1,
                max: 5,
                values: [3, 4],
                orientation: "horizontal",
                range: true,
                slide: function (event, ui) {
                    $slider3.find(".ui-slider-value:first")
                      .text("$" + ui.values[0] * slider3ValueMultiplier)
                      .end()
                      .find(".ui-slider-value:last")
                      .text("$" + ui.values[1] * slider3ValueMultiplier);
                }
            });

            slider3Options = $slider3.slider("option");
            $slider3.addSliderSegments(slider3Options.max)
              .find(".ui-slider-value:first")
              .text("$" + slider3Options.values[0] * slider3ValueMultiplier)
              .end()
              .find(".ui-slider-value:last")
              .text("$" + slider3Options.values[1] * slider3ValueMultiplier);
        }

        // Placeholders for input/textarea
        $(":text, textarea").placeholder();

        // Make pagination demo work
        $(".pagination").on('click', "a", function () {
            $(this).parent().siblings("li").removeClass("active").end().addClass("active");
        });

        $(".btn-group").on('click', "a", function () {
            $(this).siblings().removeClass("active").end().addClass("active");
        });

        // Disable link clicks to prevent page scrolling
        $(document).on('click', 'a[href="javascript:void(0)"]', function (e) {
            e.preventDefault();
        });


        // Focus state for append/prepend inputs
        $('.input-group').on('focus', '.form-control', function () {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function () {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });

        // Table: Toggle all checkboxes
        $('.table .toggle-all').on('click', function () {
            var ch = $(this).find(':checkbox').prop('checked');
            $(this).closest('.table').find('tbody :checkbox').checkbox(!ch ? 'check' : 'uncheck');
        });

        // Table: Add class row selected
        $('.table.table-select tbody :checkbox').on('check uncheck toggle', function (e) {
            var $this = $(this)
              , check = $this.prop('checked')
              , toggle = e.type == 'toggle'
              , checkboxes = $('.table tbody :checkbox')
              , checkAll = checkboxes.length == checkboxes.filter(':checked').length

            $this.closest('tr')[check ? 'addClass' : 'removeClass']('selected-row');
            if (toggle) $this.closest('.table').find('.toggle-all :checkbox').checkbox(checkAll ? 'check' : 'uncheck');
        });

        // make code pretty on the documentation
        window.prettyPrint && prettyPrint();
    });
})(jQuery);

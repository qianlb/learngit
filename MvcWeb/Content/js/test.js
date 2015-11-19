$(function(){
    'use strict';
    
    var input = $('[data-keyword]');
        var button = function(el){
            $(el).on('click', this.search);
        };
        button.prototype.search = function(e){
            var _this = $(this);
            var table_url = _this.data('table_url');
            var filter_url = _this.data('filter_url');
            var _target = _this.data('target');
            var input_value = input.value();
            var requestkey = _this.data('requestkey');
            var requestvalue = _this.data('requestvalue');
            
        };
        input.focus(function(){
            var _this = $(this);
            if(_this.data('event') === 'autocomplete'){
                _this.autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: _this.data('url'),
                            dataType: "json",
                            data: {
                                keyword: request.term.stripscript()
                            },
                            success: function (data) {
                                response($.map(data, function (item) {
                                    return {
                                        value: item.keyword
                                    }
                                }));
                            }
                        });
                    },
                    minLength: 1,
                    select: function (event, ui) {
                        _this.val(ui.item.value);
                    }
                });
            }
        }); 
        $('.leftScrollCon').on('click.slidetoggle', '.phm', function(){
            var _this = $(this);
            var _parent = _this.closest('li');
            if(_parent.hasClass('opened')){
                _parent.removeClass('opened');
                _this.next().slideUp(300);
            }else{
                _parent.addClass('opened');
                _this.next().slideDown(300);
            }
        });
        $('.leftScrollCon').on('click.showall', '.showAll', function(){
            var _this = $(this);
            if(_this.children('span[name="show"]').is(':visible')){
                _this.prev().slideDown(300);
                _this.children('span[name="show"]').hide();
                _this.children('span[name="hide"]').show();
                _this.children('span:last').removeClass('icon-chevron-up').addClass('icon-chevron-up');
            }else{
                _this.prev().slideUp(300);
                _this.children('span[name="show"]').show();
                _this.children('span[name="hide"]').hide();
                _this.children('span:last').addClass('icon-chevron-up').removeClass('icon-chevron-up');
            }
        });
});


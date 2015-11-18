/**
 *	Neon Main JavaScript File
 *
 *	Theme by: www.laborator.co
 **/

var public_vars = public_vars || {};

;(function($, window, undefined){
	
	"use strict";
	
	$(document).ready(function()
	{
		// Sidebar Menu var
		public_vars.$body	 	 	= $("body");
		public_vars.$pageContainer  = public_vars.$body.find(".page-container");
		public_vars.$chat 			= public_vars.$pageContainer.find('#chat');
		public_vars.$horizontalMenu = public_vars.$pageContainer.find('header.navbar');
		public_vars.$sidebarMenu	= public_vars.$pageContainer.find('.sidebar-menu');
		public_vars.$mainMenu	    = public_vars.$sidebarMenu.find('.submenu');
		public_vars.$mainContent	= public_vars.$pageContainer.find('.main-content');
		public_vars.$sidebarUserEnv = public_vars.$sidebarMenu.find('.sidebar-user-info');
		public_vars.$sidebarUser 	= public_vars.$sidebarUserEnv.find('.user-link');
		
		
		public_vars.$body.addClass('loaded');
		
		// Just to make sure...
		$(window).on('error', function(ev)
		{	
			// Do not let page without showing if JS fails somewhere
			init_page_transitions();
		});
				
		
		// Sidebar Menu Setup
		setup_sidebar_menu();
				
		
		// Horizontal Menu Setup
		setup_horizontal_menu();
		
		
		
		// Sidebar Collapse icon
		public_vars.$sidebarMenu.find(".sidebar-collapse-icon").on('click', function(ev)
		{
			ev.preventDefault();
			
			var with_animation = $(this).hasClass('with-animation');
			
			toggle_sidebar_menu(with_animation);
		});
				
		
		
		// Mobile Horizontal Menu Collapse icon
		public_vars.$horizontalMenu.find(".horizontal-mobile-menu a").on('click', function(ev)
		{
			ev.preventDefault();
			
			var $menu = public_vars.$horizontalMenu.find('.navbar-nav'),
				with_animation = $(this).hasClass('with-animation');
			
			if(with_animation)
			{
				$menu.stop().slideToggle('normal', function()
				{
					$menu.attr('height', 'auto');
					
					if($menu.css('display') == 'none')
					{
						$menu.attr('style', '');
					}
				});
			}
			else
			{
				$menu.toggle();
			}
		});
			
			
		// Scrollable
		if($.isFunction($.fn.slimScroll))
		{
			$(".scrollable").each(function(i, el)
			{
				var $this = $(el),
					height = attrDefault($this, 'height', $this.height());
				
				if($this.is(':visible'))
				{	
					$this.removeClass('scrollable');
					
					if($this.height() < parseInt(height, 10))
					{
						height = $this.outerHeight(true) + 10;
					}
					
					$this.addClass('scrollable');
				}
				
				$this.css({maxHeight: ''}).slimScroll({
					height: height,
					position: attrDefault($this, 'scroll-position', 'right'),
					color: attrDefault($this, 'rail-color', '#000'),
					size: attrDefault($this, 'rail-width', 6),
					borderRadius: attrDefault($this, 'rail-radius', 3),
					opacity: attrDefault($this, 'rail-opacity', .3),
					alwaysVisible: parseInt(attrDefault($this, 'autohide', 1), 10) == 1 ? false : true
				});
			});
		}
				
				
		// jQuery Knob
		if($.isFunction($.fn.knob))
		{		
			$(".knob").knob({
				change: function (value) {
				},
				release: function (value) {
				},
				cancel: function () {
				},
				draw: function () {
				
					if (this.$.data('skin') == 'tron') {
				
						var a = this.angle(this.cv) // Angle
							,
							sa = this.startAngle // Previous start angle
							,
							sat = this.startAngle // Start angle
							,
							ea // Previous end angle
							, eat = sat + a // End angle
							,
							r = 1;
				
						this.g.lineWidth = this.lineWidth;
				
						this.o.cursor && (sat = eat - 0.3) && (eat = eat + 0.3);
				
						if (this.o.displayPrevious) {
							ea = this.startAngle + this.angle(this.v);
							this.o.cursor && (sa = ea - 0.3) && (ea = ea + 0.3);
							this.g.beginPath();
							this.g.strokeStyle = this.pColor;
							this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
							this.g.stroke();
						}
				
						this.g.beginPath();
						this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
						this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
						this.g.stroke();
				
						this.g.lineWidth = 2;
						this.g.beginPath();
						this.g.strokeStyle = this.o.fgColor;
						this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
						this.g.stroke();
				
						return false;
					}
				}
			});
		}
		
		
		
		
		// Fit main content height
		fit_main_content_height();
		
		var fmch = 0,
			fmch_fn = function(){
			
			window.clearTimeout(fmch);
			fit_main_content_height();
			
			fmch = setTimeout(fmch_fn, 800);
		};
		
		fmch_fn();

		
		// Apply Page Transition
		onPageAppear(init_page_transitions);
		
	});



	// Enable/Disable Resizable Event
	var wid = 0;
	
	$(window).resize(function() {
		clearTimeout(wid);
		wid = setTimeout(trigger_resizable, 200);
	});

	
	
})(jQuery, window);


/* Functions */
function fit_main_content_height()
{
	var $ = jQuery;
	
	if(public_vars.$sidebarMenu.length && public_vars.$sidebarMenu.hasClass('fixed') == false)
	{
		public_vars.$sidebarMenu.css('min-height', '');
		public_vars.$mainContent.css('min-height', '');
		
		if(isxs())
		{	
			if(typeof reset_mail_container_height != 'undefined')
				reset_mail_container_height();
			return;
			
			if(typeof fit_calendar_container_height != 'undefined')
				reset_calendar_container_height();
			return;
		}
		
		var sm_height  = public_vars.$sidebarMenu.outerHeight(),
			mc_height  = public_vars.$mainContent.outerHeight(),
			doc_height = $(document).height(),
			win_height = $(window).height(),
			sm_height_real = 0;
		
		if(win_height > doc_height)
		{
			doc_height = win_height;
		}
			
		if(public_vars.$horizontalMenu.length > 0)
		{
			var hm_height = public_vars.$horizontalMenu.outerHeight();
			
			doc_height -= hm_height;
			sm_height -= hm_height;
		}
		
		public_vars.$mainContent.css('min-height', doc_height);
		public_vars.$sidebarMenu.css('min-height', doc_height);
		public_vars.$chat.css('min-height', doc_height);
		
		if(typeof fit_mail_container_height != 'undefined')
			fit_mail_container_height();
		
		if(typeof fit_calendar_container_height != 'undefined')
			fit_calendar_container_height();
	}
}


// Sidebar Menu Setup
function setup_sidebar_menu()
{
	var $ = jQuery,
		$items_with_submenu	  = public_vars.$sidebarMenu.find('li:has(ul)'),
		submenu_options		  = {
			submenu_open_delay: 0.5,
			submenu_open_easing: Sine.easeInOut,
			submenu_opened_class: 'opened'
		},
		root_level_class 	  = 'root-level',
		is_multiopen 		  = public_vars.$mainMenu.hasClass('multiple-expanded');
	
	public_vars.$mainMenu.find('> li').addClass(root_level_class);
	
	$items_with_submenu.each(function(i, el)
	{
		var $this = $(el),
			$link = $this.find('> a'),
			$submenu = $this.find('> ul');
		
		$this.addClass('has-sub');
		
		$link.click(function(ev)
		{
			ev.preventDefault();
			
			if( ! is_multiopen && $this.hasClass(root_level_class))
			{
				var close_submenus = public_vars.$mainMenu.find('.' + root_level_class).not($this).find('> ul');
				
				close_submenus.each(function(i, el)
				{
					var $sub = $(el);
					menu_do_collapse($sub, $sub.parent(), submenu_options);
				});
			}
			
			if( ! $this.hasClass(submenu_options.submenu_opened_class))
			{
				var current_height;
				
				if( ! $submenu.is(':visible'))
				{
					menu_do_expand($submenu, $this, submenu_options);
				}
			}
			else
			{
				menu_do_collapse($submenu, $this, submenu_options);
			}
			
			fit_main_content_height();
		});

	});
	
	// Open the submenus with "opened" class
	public_vars.$mainMenu.find('.'+submenu_options.submenu_opened_class+' > ul').addClass('visible');
	
	// Well, somebody may forgot to add "active" for all inhertiance, but we are going to help you (just in case) - we do this job for you for free :P!
	if(public_vars.$mainMenu.hasClass('auto-inherit-active-class'))
	{
		menu_set_active_class_to_parents( public_vars.$mainMenu.find('.active') );
	}
	
	// Search Input
	var $search_input = public_vars.$mainMenu.find('#search input[type="text"]'),
		$search_el = public_vars.$mainMenu.find('#search');
		
	public_vars.$mainMenu.find('#search form').submit(function(ev)
	{
		var is_collapsed = public_vars.$pageContainer.hasClass('sidebar-collapsed');
		
		if(is_collapsed)
		{
			if($search_el.hasClass('focused') == false)
			{
				ev.preventDefault();
				$search_el.addClass('focused');
				
				$search_input.focus();
				
				return false;
			}
		}
	});
	
	$search_input.on('blur', function(ev)
	{
		var is_collapsed = public_vars.$pageContainer.hasClass('sidebar-collapsed');
		
		if(is_collapsed)
		{
			$search_el.removeClass('focused');
		}
	});
	
	
	// Collapse Icon (mobile device visible)
	var show_hide_menu = $('');
	
	public_vars.$sidebarMenu.find('.logo-env').append(show_hide_menu);
}


function menu_do_expand($submenu, $this, options)
{
	$submenu.addClass('visible').height('');
	current_height = $submenu.outerHeight();
	
	var props_from = {
		opacity: .2, 
		height: 0, 
		top: -20
	},
	props_to = {
		height: current_height, 
		opacity: 1, 
		top: 0
	};
	
	if(isxs())
	{
		delete props_from['opacity'];
		delete props_from['top'];
		
		delete props_to['opacity'];
		delete props_to['top'];
	}
	
	TweenMax.set($submenu, {css: props_from});

	$this.addClass(options.submenu_opened_class);
	
	TweenMax.to($submenu, options.submenu_open_delay, {css: props_to, ease: options.submenu_open_easing, onComplete: function()
	{
		$submenu.attr('style', '');
		fit_main_content_height();
	}});
}


function menu_do_collapse($submenu, $this, options)
{
	if(public_vars.$pageContainer.hasClass('sidebar-collapsed') && $this.hasClass('root-level'))
	{
		return;
	}
	
	$this.removeClass(options.submenu_opened_class);
	
	TweenMax.to($submenu, options.submenu_open_delay, {css: {height: 0, opacity: .2}, ease: options.submenu_open_easing, onComplete: function()
	{
		$submenu.removeClass('visible');
		fit_main_content_height();
	}});
}


function menu_set_active_class_to_parents($active_element)
{
	if($active_element.length)
	{
		var $parent = $active_element.parent().parent();
		
		$parent.addClass('active');
		
		if(! $parent.hasClass('root-level'))
			menu_set_active_class_to_parents($parent)
	}
}



// Horizontal Menu Setup
function setup_horizontal_menu()
{
	var $					  = jQuery,
		$nav_bar_menu		  = public_vars.$horizontalMenu.find('.navbar-nav'),
		$items_with_submenu	  = $nav_bar_menu.find('li:has(ul)'),
		$search				  = public_vars.$horizontalMenu.find('li#search'),
		$search_submit		  = $search.find('form'),
		root_level_class 	  = 'root-level'
		is_multiopen 		  = $nav_bar_menu.hasClass('multiple-expanded'),
		submenu_options		  = {
			submenu_open_delay: 0.5,
			submenu_open_easing: Sine.easeInOut,
			submenu_opened_class: 'opened'
		};
	
	$nav_bar_menu.find('> li').addClass(root_level_class);
	
	$items_with_submenu.each(function(i, el)
	{
		var $this = $(el),
			$link = $this.find('> a'),
			$submenu = $this.find('> ul');
		
		$this.addClass('has-sub');
		
		setup_horizontal_menu_hover($this, $submenu);
		
		// xs devices only
		$link.click(function(ev)
		{
			if(isxs())
			{
				ev.preventDefault();
				
				if( ! is_multiopen && $this.hasClass(root_level_class))
				{
					var close_submenus = $nav_bar_menu.find('.' + root_level_class).not($this).find('> ul');
					
					close_submenus.each(function(i, el)
					{
						var $sub = $(el);
						menu_do_collapse($sub, $sub.parent(), submenu_options);
					});
				}
				
				if( ! $this.hasClass(submenu_options.submenu_opened_class))
				{
					var current_height;
					
					if( ! $submenu.is(':visible'))
					{
						menu_do_expand($submenu, $this, submenu_options);
					}
				}
				else
				{
					menu_do_collapse($submenu, $this, submenu_options);
				}
				
				fit_main_content_height();
			}
		});
		
	});

}

jQuery(public_vars, {
	hover_index: 4
});

function setup_horizontal_menu_hover($item, $sub)
{
	var del = 0.5,
		trans_x = -10,
		ease = Quad.easeInOut;
	
	TweenMax.set($sub, {css: {autoAlpha: 0, transform: "translateX("+trans_x+"px)"}});
	
	$item.hoverIntent({
		over: function()
		{
			if(isxs())
				return false;
			
			if($sub.css('display') == 'none')
			{
				$sub.css({display: 'block', visibility: 'hidden'});
			}
			
			$sub.css({zIndex: ++public_vars.hover_index});
			TweenMax.to($sub, del, {css: {autoAlpha: 1, transform: "translateX(0px)"}, ease: ease});
		},
		
		out: function()
		{
			if(isxs())
				return false;
				
			TweenMax.to($sub, del, {css: {autoAlpha: 0, transform: "translateX("+trans_x+"px)"}, ease: ease, onComplete: function()
			{
				TweenMax.set($sub, {css: {transform: "translateX("+trans_x+"px)"}});
				$sub.css({display: 'none'});
			}});
		},
		
		timeout: 300,
		interval: 50
	});
	
}


// Test function
function callback_test()
{
	alert("Callback function executed! No. of arguments: " + arguments.length + "\n\nSee console log for outputed of the arguments.");
	
	console.log(arguments);
}


// Root Wizard Current Tab
function setCurrentProgressTab($rootwizard, $nav, $tab, $progress, index)
{
	$tab.prevAll().addClass('completed');
	$tab.nextAll().removeClass('completed');
	
	var items      	  = $nav.children().length,
		pct           = parseInt((index+1) / items * 100, 10),
		$first_tab    = $nav.find('li:first-child'),
		margin        = (1/(items*2) * 100) + '%';//$first_tab.find('span').position().left + 'px';
	
	if( $first_tab.hasClass('active'))
	{
		$progress.width(0);
	}
	else
	{
		if(rtl())
		{
			$progress.width( $progress.parent().outerWidth(true) - $tab.prev().position().left - $tab.find('span').width()/2 );
		}
		else
		{
			$progress.width( ((index-1) /(items-1)) * 100 + '%' ); //$progress.width( $tab.prev().position().left - $tab.find('span').width()/2 );
		}
	}
	
	
	$progress.parent().css({
		marginLeft: margin,
		marginRight: margin
	});
	
	/*var m = $first_tab.find('span').position().left - $first_tab.find('span').width() / 2;
	
	$rootwizard.find('.tab-content').css({
		marginLeft: m,
		marginRight: m
	});*/
}

// Scroll to Bottom
function scrollToBottom($el)
{
	var $ = jQuery;
	
	if(typeof $el == 'string')
		$el = $($el);
		
	$el.get(0).scrollTop = $el.get(0).scrollHeight;
}


// Check viewport visibility (entrie element)
function elementInViewport(el) 
{	
	var top = el.offsetTop;
	var left = el.offsetLeft;
	var width = el.offsetWidth;
	var height = el.offsetHeight;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}

	return (
		top >= window.pageYOffset &&
		left >= window.pageXOffset &&
		(top + height) <= (window.pageYOffset + window.innerHeight) &&
		(left + width) <= (window.pageXOffset + window.innerWidth)
	);
}

// X Overflow
function disableXOverflow()
{
	public_vars.$body.addClass('overflow-x-disabled');
}

function enableXOverflow()
{
	public_vars.$body.removeClass('overflow-x-disabled');
}


// Page Transitions
function init_page_transitions()
{
	fit_main_content_height();
	
	var transitions = ['page-fade', 'page-left-in', 'page-right-in', 'page-fade-only'];
	
	for(var i in transitions)
	{
		var transition_name = transitions[i];
		
		if(public_vars.$body.hasClass(transition_name))
		{
			public_vars.$body.addClass(transition_name + '-init')
			
			setTimeout(function()
			{
				public_vars.$body.removeClass(transition_name + ' ' + transition_name + '-init');
				
			}, 850);
			
			return;
		}
	}
}


// Page Visibility API
function onPageAppear(callback) 
{

	var hidden, state, visibilityChange;
	
	if (typeof document.hidden !== "undefined") 
	{
		hidden = "hidden";
		visibilityChange = "visibilitychange";
		state = "visibilityState";
	} 
	else if (typeof document.mozHidden !== "undefined") 
	{
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
		state = "mozVisibilityState";
	} 
	else if (typeof document.msHidden !== "undefined") 
	{
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
		state = "msVisibilityState";
	} 
	else if (typeof document.webkitHidden !== "undefined") 
	{
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
		state = "webkitVisibilityState";
	}
	
	if(document[state] || typeof document[state] == 'undefined')
	{
		callback();
	}
	
	document.addEventListener(visibilityChange, callback, false);
}
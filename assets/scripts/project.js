/**
 * This script adds the accessibility-ready responsive menus Genesis Framework child themes.
 *
 * @author StudioPress
 * @link https://github.com/copyblogger/responsive-menus
 * @version 1.1.3
 * @license GPL-2.0+
 */

( function ( document, $, undefined ) {

	'use strict';

	$('body').removeClass('no-js');

	var genesisMenuParams      = typeof genesis_responsive_menu === 'undefined' ? '' : genesis_responsive_menu,
		genesisMenusUnchecked  = genesisMenuParams.menuClasses,
		genesisMenus           = {},
		menusToCombine         = [];

	/**
	 * Validate the menus passed by the theme with what's being loaded on the page,
	 * and pass the new and accurate information to our new data.
	 * @param {genesisMenusUnchecked} Raw data from the localized script in the theme.
	 * @return {array} genesisMenus array gets populated with updated data.
	 * @return {array} menusToCombine array gets populated with relevant data.
	 */
	$.each( genesisMenusUnchecked, function( group ) {

		// Mirror our group object to populate.
		genesisMenus[group] = [];

		// Loop through each instance of the specified menu on the page.
		$.each( this, function( key, value ) {

			var menuString = value,
				$menu      = $(value);

			// If there is more than one instance, append the index and update array.
			if ( $menu.length > 1 ) {

				$.each( $menu, function( key, value ) {

					var newString = menuString + '-' + key;

					$(this).addClass( newString.replace('.','') );

					genesisMenus[group].push( newString );

					if ( 'combine' === group ) {
						menusToCombine.push( newString );
					}

				});

			} else if ( $menu.length == 1 ) {

				genesisMenus[group].push( menuString );

				if ( 'combine' === group ) {
					menusToCombine.push( menuString );
				}

			}

		});

	});

	// Make sure there is something to use for the 'others' array.
	if ( typeof genesisMenus.others == 'undefined' ) {
		genesisMenus.others = [];
	}

	// If there's only one menu on the page for combining, push it to the 'others' array and nullify our 'combine' variable.
	if ( menusToCombine.length == 1 ) {
		genesisMenus.others.push( menusToCombine[0] );
		genesisMenus.combine = null;
		menusToCombine = null;
	}

	var genesisMenu         = {},
		mainMenuButtonClass = 'menu-toggle',
		subMenuButtonClass  = 'sub-menu-toggle',
		responsiveMenuClass = 'genesis-responsive-menu';

	// Initialize.
	genesisMenu.init = function() {

		// Exit early if there are no menus to do anything.
		if ( $( _getAllMenusArray() ).length == 0 ) {
			return;
		}

		var menuIconClass     = typeof genesisMenuParams.menuIconClass !== 'undefined' ? genesisMenuParams.menuIconClass : 'dashicons-before dashicons-menu',
			subMenuIconClass  = typeof genesisMenuParams.subMenuIconClass !== 'undefined' ? genesisMenuParams.subMenuIconClass : 'dashicons-before dashicons-arrow-down-alt2',
			toggleButtons     = {
				menu : $( '<button />', {
					'class' : mainMenuButtonClass,
					'aria-expanded' : false,
					'aria-pressed' : false,
					'role'			: 'button',
					} )
					.append( $( '<span />', {
						'class' : 'screen-reader-text',
						'text' : genesisMenuParams.mainMenu
					} ) ),
				submenu : $( '<button />', {
					'class' : subMenuButtonClass,
					'aria-expanded' : false,
					'aria-pressed'  : false,
					'text'			: ''
					} )
					.append( $( '<span />', {
						'class' : 'screen-reader-text',
						'text' : genesisMenuParams.subMenu
					} ) )
			};

		// Add the responsive menu class to the active menus.
		_addResponsiveMenuClass();

		// Add the main nav button to the primary menu, or exit the plugin.
		_addMenuButtons( toggleButtons );

		// Setup additional classes.
		$( '.' + mainMenuButtonClass ).addClass( menuIconClass );
		$( '.' + subMenuButtonClass ).addClass( subMenuIconClass );
		$( '.' + mainMenuButtonClass ).on( 'click.genesisMenu-mainbutton', _mainmenuToggle ).each( _addClassID );
		$( '.' + subMenuButtonClass ).on( 'click.genesisMenu-subbutton', _submenuToggle );
		$( window ).on( 'resize.genesisMenu', _doResize ).triggerHandler( 'resize.genesisMenu' );
	};

	/**
	 * Add menu toggle button to appropriate menus.
	 * @param {toggleButtons} Object of menu buttons to use for toggles.
	 */
	function _addMenuButtons( toggleButtons ) {

		// Apply sub menu toggle to each sub-menu found in the menuList.
		$( _getMenuSelectorString( genesisMenus ) ).find( '.sub-menu' ).before( toggleButtons.submenu );


		if ( menusToCombine !== null ) {

			var menusToToggle = genesisMenus.others.concat( menusToCombine[0] );

		 	// Only add menu button the primary menu and navs NOT in the combine variable.
		 	$( _getMenuSelectorString( menusToToggle ) ).before( toggleButtons.menu );

		} else {

			// Apply the main menu toggle to all menus in the list.
			$( _getMenuSelectorString( genesisMenus.others ) ).before( toggleButtons.menu );

		}

	}

	/**
	 * Add the responsive menu class.
	 */
	function _addResponsiveMenuClass() {
		$( _getMenuSelectorString( genesisMenus ) ).addClass( responsiveMenuClass );
	}

	/**
	 * Execute our responsive menu functions on window resizing.
	 */
	function _doResize() {
		var buttons   = $( 'button[id^="genesis-mobile-"]' ).attr( 'id' );
		if ( typeof buttons === 'undefined' ) {
			return;
		}
		_maybeClose( buttons );
		_superfishToggle( buttons );
		_changeSkipLink( buttons );
		_combineMenus( buttons );
	}

	/**
	 * Add the nav- class of the related navigation menu as
	 * an ID to associated button (helps target specific buttons outside of context).
	 */
	function _addClassID() {
		var $this = $( this ),
			nav   = $this.next( 'nav' ),
			id    = 'class';

		$this.attr( 'id', 'genesis-mobile-' + $( nav ).attr( id ).match( /nav-\w*\b/ ) );
	}

	/**
	 * Combine our menus if the mobile menu is visible.
	 * @params buttons
	 */
	function _combineMenus( buttons ){

		// Exit early if there are no menus to combine.
		if ( menusToCombine == null ) {
			return;
		}

		// Split up the menus to combine based on order of appearance in the array.
		var primaryMenu   = menusToCombine[0],
			combinedMenus = $( menusToCombine ).filter( function(index) { if ( index > 0 ) { return index; } });

		// If the responsive menu is active, append items in 'combinedMenus' object to the 'primaryMenu' object.
		if ( 'none' !== _getDisplayValue( buttons ) ) {

			$.each( combinedMenus, function( key, value ) {
				$(value).find( '.menu > li' ).addClass( 'moved-item-' + value.replace( '.','' ) ).appendTo( primaryMenu + ' ul.genesis-nav-menu' );
			});
			$( _getMenuSelectorString( combinedMenus ) ).hide();

		} else {

			$( _getMenuSelectorString( combinedMenus ) ).show();
			$.each( combinedMenus, function( key, value ) {
				$( '.moved-item-' + value.replace( '.','' ) ).appendTo( value + ' ul.genesis-nav-menu' ).removeClass( 'moved-item-' + value.replace( '.','' ) );
			});

		}

	}

	/**
	 * Action to happen when the main menu button is clicked.
	 */
	function _mainmenuToggle() {
		var $this = $( this );
		_toggleAria( $this, 'aria-pressed' );
		_toggleAria( $this, 'aria-expanded' );
		$this.toggleClass( 'activated' );
		$this.next( 'nav' ).slideToggle( 'fast' );
	}

	/**
	 * Action for submenu toggles.
	 */
	function _submenuToggle() {

		var $this  = $( this ),
			others = $this.closest( '.menu-item' ).siblings();
		_toggleAria( $this, 'aria-pressed' );
		_toggleAria( $this, 'aria-expanded' );
		$this.toggleClass( 'activated' );
		$this.next( '.sub-menu' ).slideToggle( 'fast' );

		others.find( '.' + subMenuButtonClass ).removeClass( 'activated' ).attr( 'aria-pressed', 'false' );
		others.find( '.sub-menu' ).slideUp( 'fast' );

	}

	/**
	 * Activate/deactivate superfish.
	 * @params buttons
	 */
	function _superfishToggle( buttons ) {
		var _superfish = $( '.' + responsiveMenuClass + ' .js-superfish' ),
			$args      = 'destroy';
		if ( typeof _superfish.superfish !== 'function' ) {
			return;
		}
		if ( 'none' === _getDisplayValue( buttons ) ) {
			$args = {
				'delay': 0,
				'animation': {'opacity': 'show'},
				'speed': 300,
				'disableHI': true
			};
		}
		_superfish.superfish( $args );
	}

	/**
	 * Modify skip link to match mobile buttons.
	 * @param buttons
	 */
	function _changeSkipLink( buttons ) {

		// Start with an empty array.
		var menuToggleList = _getAllMenusArray();

		// Exit out if there are no menu items to update.
		if ( ! $( menuToggleList ).length > 0 ) {
			return;
		}

		$.each( menuToggleList, function ( key, value ) {

			var newValue  = value.replace( '.', '' ),
				startLink = 'genesis-' + newValue,
				endLink   = 'genesis-mobile-' + newValue;

			if ( 'none' == _getDisplayValue( buttons ) ) {
				startLink = 'genesis-mobile-' + newValue;
				endLink   = 'genesis-' + newValue;
			}

			var $item = $( '.genesis-skip-link a[href="#' + startLink + '"]' );

			if ( menusToCombine !== null && value !== menusToCombine[0] ) {
				$item.toggleClass( 'skip-link-hidden' );
			}

			if ( $item.length > 0 ) {
				var link  = $item.attr( 'href' );
					link  = link.replace( startLink, endLink );

				$item.attr( 'href', link );
			} else {
				return;
			}

		});

	}

	/**
	 * Close all the menu toggles if buttons are hidden.
	 * @param buttons
	 */
	function _maybeClose( buttons ) {
		if ( 'none' !== _getDisplayValue( buttons ) ) {
			return true;
		}

		$( '.' + mainMenuButtonClass + ', .' + responsiveMenuClass + ' .sub-menu-toggle' )
			.removeClass( 'activated' )
			.attr( 'aria-expanded', false )
			.attr( 'aria-pressed', false );

		$( '.' + responsiveMenuClass + ', .' + responsiveMenuClass + ' .sub-menu' )
			.attr( 'style', '' );
	}

	/**
	 * Generic function to get the display value of an element.
	 * @param  {id} $id ID to check
	 * @return {string}     CSS value of display property
	 */
	function _getDisplayValue( $id ) {
		var element = document.getElementById( $id ),
			style   = window.getComputedStyle( element );
		return style.getPropertyValue( 'display' );
	}

	/**
	 * Toggle aria attributes.
	 * @param  {button} $this     passed through
	 * @param  {aria-xx} attribute aria attribute to toggle
	 * @return {bool}           from _ariaReturn
	 */
	function _toggleAria( $this, attribute ) {
		$this.attr( attribute, function( index, value ) {
			return 'false' === value;
		});
	}

	/**
	 * Helper function to return a comma separated string of menu selectors.
	 * @param {itemArray} Array of menu items to loop through.
	 * @param {ignoreSecondary} boolean of whether to ignore the 'secondary' menu item.
	 * @return {string} Comma-separated string.
	 */
	function _getMenuSelectorString( itemArray ) {

		var itemString = $.map( itemArray, function( value, key ) {
			return value;
		});

		return itemString.join( ',' );

	}

	/**
	 * Helper function to return a group array of all the menus in
	 * both the 'others' and 'combine' arrays.
	 * @return {array} Array of all menu items as class selectors.
	 */
	function _getAllMenusArray() {

		// Start with an empty array.
		var menuList = [];

		// If there are menus in the 'menusToCombine' array, add them to 'menuList'.
		if ( menusToCombine !== null ) {

			$.each( menusToCombine, function( key, value ) {
				menuList.push( value.valueOf() );
			});

		}

		// Add menus in the 'others' array to 'menuList'.
		$.each( genesisMenus.others, function( key, value ) {
			menuList.push( value.valueOf() );
		});

		if ( menuList.length > 0 ) {
			return menuList;
		} else {
			return null;
		}

	}

	$(document).ready(function () {

		if ( _getAllMenusArray() !== null ) {

			genesisMenu.init();

		}

	});


})( document, jQuery );

/*!
 * headroom.js v0.9.4 - Give your page some headroom. Hide your header until you need it
 * Copyright (c) 2017 Nick Williams - http://wicky.nillia.ms/headroom.js
 * License: MIT
 */

!function(a,b){"use strict";"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b():a.Headroom=b()}(this,function(){"use strict";function a(a){this.callback=a,this.ticking=!1}function b(a){return a&&"undefined"!=typeof window&&(a===window||a.nodeType)}function c(a){if(arguments.length<=0)throw new Error("Missing arguments in extend function");var d,e,f=a||{};for(e=1;e<arguments.length;e++){var g=arguments[e]||{};for(d in g)"object"!=typeof f[d]||b(f[d])?f[d]=f[d]||g[d]:f[d]=c(f[d],g[d])}return f}function d(a){return a===Object(a)?a:{down:a,up:a}}function e(a,b){b=c(b,e.options),this.lastKnownScrollY=0,this.elem=a,this.tolerance=d(b.tolerance),this.classes=b.classes,this.offset=b.offset,this.scroller=b.scroller,this.initialised=!1,this.onPin=b.onPin,this.onUnpin=b.onUnpin,this.onTop=b.onTop,this.onNotTop=b.onNotTop,this.onBottom=b.onBottom,this.onNotBottom=b.onNotBottom}var f={bind:!!function(){}.bind,classList:"classList"in document.documentElement,rAF:!!(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame)};return window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,a.prototype={constructor:a,update:function(){this.callback&&this.callback(),this.ticking=!1},requestTick:function(){this.ticking||(requestAnimationFrame(this.rafCallback||(this.rafCallback=this.update.bind(this))),this.ticking=!0)},handleEvent:function(){this.requestTick()}},e.prototype={constructor:e,init:function(){if(e.cutsTheMustard)return this.debouncer=new a(this.update.bind(this)),this.elem.classList.add(this.classes.initial),setTimeout(this.attachEvent.bind(this),100),this},destroy:function(){var a=this.classes;this.initialised=!1;for(var b in a)a.hasOwnProperty(b)&&this.elem.classList.remove(a[b]);this.scroller.removeEventListener("scroll",this.debouncer,!1)},attachEvent:function(){this.initialised||(this.lastKnownScrollY=this.getScrollY(),this.initialised=!0,this.scroller.addEventListener("scroll",this.debouncer,!1),this.debouncer.handleEvent())},unpin:function(){var a=this.elem.classList,b=this.classes;!a.contains(b.pinned)&&a.contains(b.unpinned)||(a.add(b.unpinned),a.remove(b.pinned),this.onUnpin&&this.onUnpin.call(this))},pin:function(){var a=this.elem.classList,b=this.classes;a.contains(b.unpinned)&&(a.remove(b.unpinned),a.add(b.pinned),this.onPin&&this.onPin.call(this))},top:function(){var a=this.elem.classList,b=this.classes;a.contains(b.top)||(a.add(b.top),a.remove(b.notTop),this.onTop&&this.onTop.call(this))},notTop:function(){var a=this.elem.classList,b=this.classes;a.contains(b.notTop)||(a.add(b.notTop),a.remove(b.top),this.onNotTop&&this.onNotTop.call(this))},bottom:function(){var a=this.elem.classList,b=this.classes;a.contains(b.bottom)||(a.add(b.bottom),a.remove(b.notBottom),this.onBottom&&this.onBottom.call(this))},notBottom:function(){var a=this.elem.classList,b=this.classes;a.contains(b.notBottom)||(a.add(b.notBottom),a.remove(b.bottom),this.onNotBottom&&this.onNotBottom.call(this))},getScrollY:function(){return void 0!==this.scroller.pageYOffset?this.scroller.pageYOffset:void 0!==this.scroller.scrollTop?this.scroller.scrollTop:(document.documentElement||document.body.parentNode||document.body).scrollTop},getViewportHeight:function(){return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight},getElementPhysicalHeight:function(a){return Math.max(a.offsetHeight,a.clientHeight)},getScrollerPhysicalHeight:function(){return this.scroller===window||this.scroller===document.body?this.getViewportHeight():this.getElementPhysicalHeight(this.scroller)},getDocumentHeight:function(){var a=document.body,b=document.documentElement;return Math.max(a.scrollHeight,b.scrollHeight,a.offsetHeight,b.offsetHeight,a.clientHeight,b.clientHeight)},getElementHeight:function(a){return Math.max(a.scrollHeight,a.offsetHeight,a.clientHeight)},getScrollerHeight:function(){return this.scroller===window||this.scroller===document.body?this.getDocumentHeight():this.getElementHeight(this.scroller)},isOutOfBounds:function(a){var b=a<0,c=a+this.getScrollerPhysicalHeight()>this.getScrollerHeight();return b||c},toleranceExceeded:function(a,b){return Math.abs(a-this.lastKnownScrollY)>=this.tolerance[b]},shouldUnpin:function(a,b){var c=a>this.lastKnownScrollY,d=a>=this.offset;return c&&d&&b},shouldPin:function(a,b){var c=a<this.lastKnownScrollY,d=a<=this.offset;return c&&b||d},update:function(){var a=this.getScrollY(),b=a>this.lastKnownScrollY?"down":"up",c=this.toleranceExceeded(a,b);this.isOutOfBounds(a)||(a<=this.offset?this.top():this.notTop(),a+this.getViewportHeight()>=this.getScrollerHeight()?this.bottom():this.notBottom(),this.shouldUnpin(a,c)?this.unpin():this.shouldPin(a,c)&&this.pin(),this.lastKnownScrollY=a)}},e.options={tolerance:{up:0,down:0},offset:0,scroller:window,classes:{pinned:"headroom--pinned",unpinned:"headroom--unpinned",top:"headroom--top",notTop:"headroom--not-top",bottom:"headroom--bottom",notBottom:"headroom--not-bottom",initial:"headroom"}},e.cutsTheMustard="undefined"!=typeof f&&f.rAF&&f.bind&&f.classList,e});
/*
 Original Plugin by Osvaldas Valutis, www.osvaldas.info
 http://osvaldas.info/drop-down-navigation-responsive-and-touch-friendly
 Available for use under the MIT License
 */
/**
 * jquery-doubleTapToGo plugin
 * Copyright 2017 DACHCOM.DIGITAL AG
 * @author Marco Rieser
 * @author Volker Andres
 * @author Stefan Hagspiel
 * @version 3.0.2
 * @see https://github.com/dachcom-digital/jquery-doubletaptogo
 */
(function ($, window, document, undefined) {
    'use strict';
    var pluginName = 'doubleTapToGo',
        defaults = {
            automatic: true,
            selectorClass: 'doubletap',
            selectorChain: 'li:has(ul)'
        };

    function DoubleTapToGo (element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(DoubleTapToGo.prototype, {
        preventClick: false,
        currentTap: $(),
        init: function () {
            $(this.element)
                .on('touchstart', '.' + this.settings.selectorClass, this._tap.bind(this))
                .on('click', '.' + this.settings.selectorClass, this._click.bind(this))
                .on('remove', this._destroy.bind(this));

            this._addSelectors();
        },

        _addSelectors: function () {
            if (this.settings.automatic !== true) {
                return;
            }
            $(this.element)
                .find(this.settings.selectorChain)
                .addClass(this.settings.selectorClass);
        },

        _click: function (event) {
            if (this.preventClick) {
                event.preventDefault();
            } else {
                this.currentTap = $();
            }
        },

        _tap: function (event) {
            var $target = $(event.target).closest('li');
            if (!$target.hasClass(this.settings.selectorClass)) {
                this.preventClick = false;
                return;
            }
            if ($target.get(0) === this.currentTap.get(0)) {
                this.preventClick = false;
                return;
            }
            this.preventClick = true;
            this.currentTap = $target;
            event.stopPropagation();
        },

        _destroy: function () {
            $(this.element).off();
        },

        reset: function () {
            this.currentTap = $();
        }
    });

    $.fn[pluginName] = function (options) {
        var args = arguments,
            returns;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new DoubleTapToGo(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            this.each(function () {
                var instance = $.data(this, pluginName),
                    methodName = (options === 'destroy' ? '_destroy' : options);
                if (instance instanceof DoubleTapToGo && typeof instance[methodName] === 'function') {
                    returns = instance[methodName].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
})(jQuery, window, document);

// jQuery RoyalSlider plugin. Custom build. Copyright 2011-2015 Dmitry Semenov http://dimsemenov.com 
// http://dimsemenov.com/private/home.php?build=bullets_animated-blocks_auto-height_active-class 
// jquery.royalslider v9.5.8
(function(n){function v(b,f){var c,a=this,e=window.navigator,g=e.userAgent.toLowerCase();a.uid=n.rsModules.uid++;a.ns=".rs"+a.uid;var d=document.createElement("div").style,h=["webkit","Moz","ms","O"],k="",l=0,q;for(c=0;c<h.length;c++)q=h[c],!k&&q+"Transform"in d&&(k=q),q=q.toLowerCase(),window.requestAnimationFrame||(window.requestAnimationFrame=window[q+"RequestAnimationFrame"],window.cancelAnimationFrame=window[q+"CancelAnimationFrame"]||window[q+"CancelRequestAnimationFrame"]);window.requestAnimationFrame||
(window.requestAnimationFrame=function(a,b){var c=(new Date).getTime(),d=Math.max(0,16-(c-l)),e=window.setTimeout(function(){a(c+d)},d);l=c+d;return e});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});a.isIPAD=g.match(/(ipad)/);a.isIOS=a.isIPAD||g.match(/(iphone|ipod)/);c=function(a){a=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||0>a.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||
[];return{browser:a[1]||"",version:a[2]||"0"}}(g);h={};c.browser&&(h[c.browser]=!0,h.version=c.version);h.chrome&&(h.webkit=!0);a._a=h;a.isAndroid=-1<g.indexOf("android");a.slider=n(b);a.ev=n(a);a._b=n(document);a.st=n.extend({},n.fn.royalSlider.defaults,f);a._c=a.st.transitionSpeed;a._d=0;!a.st.allowCSS3||h.webkit&&!a.st.allowCSS3OnWebkit||(c=k+(k?"T":"t"),a._e=c+"ransform"in d&&c+"ransition"in d,a._e&&(a._f=k+(k?"P":"p")+"erspective"in d));k=k.toLowerCase();a._g="-"+k+"-";a._h="vertical"===a.st.slidesOrientation?
!1:!0;a._i=a._h?"left":"top";a._j=a._h?"width":"height";a._k=-1;a._l="fade"===a.st.transitionType?!1:!0;a._l||(a.st.sliderDrag=!1,a._m=10);a._n="z-index:0; display:none; opacity:0;";a._o=0;a._p=0;a._q=0;n.each(n.rsModules,function(b,c){"uid"!==b&&c.call(a)});a.slides=[];a._r=0;(a.st.slides?n(a.st.slides):a.slider.children().detach()).each(function(){a._s(this,!0)});a.st.randomizeSlides&&a.slides.sort(function(){return.5-Math.random()});a.numSlides=a.slides.length;a._t();a.st.startSlideId?a.st.startSlideId>
a.numSlides-1&&(a.st.startSlideId=a.numSlides-1):a.st.startSlideId=0;a._o=a.staticSlideId=a.currSlideId=a._u=a.st.startSlideId;a.currSlide=a.slides[a.currSlideId];a._v=0;a.pointerMultitouch=!1;a.slider.addClass((a._h?"rsHor":"rsVer")+(a._l?"":" rsFade"));d='<div class="rsOverflow"><div class="rsContainer">';a.slidesSpacing=a.st.slidesSpacing;a._w=(a._h?a.slider.width():a.slider.height())+a.st.slidesSpacing;a._x=Boolean(0<a._y);1>=a.numSlides&&(a._z=!1);a._a1=a._z&&a._l?2===a.numSlides?1:2:0;a._b1=
6>a.numSlides?a.numSlides:6;a._c1=0;a._d1=0;a.slidesJQ=[];for(c=0;c<a.numSlides;c++)a.slidesJQ.push(n('<div style="'+(a._l?"":c!==a.currSlideId?a._n:"z-index:0;")+'" class="rsSlide "></div>'));a._e1=d=n(d+"</div></div>");var m=a.ns,k=function(b,c,d,e,f){a._j1=b+c+m;a._k1=b+d+m;a._l1=b+e+m;f&&(a._m1=b+f+m)};c=e.pointerEnabled;a.pointerEnabled=c||e.msPointerEnabled;a.pointerEnabled?(a.hasTouch=!1,a._n1=.2,a.pointerMultitouch=Boolean(1<e[(c?"m":"msM")+"axTouchPoints"]),c?k("pointer","down","move","up",
"cancel"):k("MSPointer","Down","Move","Up","Cancel")):(a.isIOS?a._j1=a._k1=a._l1=a._m1="":k("mouse","down","move","up"),"ontouchstart"in window||"createTouch"in document?(a.hasTouch=!0,a._j1+=" touchstart"+m,a._k1+=" touchmove"+m,a._l1+=" touchend"+m,a._m1+=" touchcancel"+m,a._n1=.5,a.st.sliderTouch&&(a._f1=!0)):(a.hasTouch=!1,a._n1=.2));a.st.sliderDrag&&(a._f1=!0,h.msie||h.opera?a._g1=a._h1="move":h.mozilla?(a._g1="-moz-grab",a._h1="-moz-grabbing"):h.webkit&&-1!=e.platform.indexOf("Mac")&&(a._g1=
"-webkit-grab",a._h1="-webkit-grabbing"),a._i1());a.slider.html(d);a._o1=a.st.controlsInside?a._e1:a.slider;a._p1=a._e1.children(".rsContainer");a.pointerEnabled&&a._p1.css((c?"":"-ms-")+"touch-action",a._h?"pan-y":"pan-x");a._q1=n('<div class="rsPreloader"></div>');e=a._p1.children(".rsSlide");a._r1=a.slidesJQ[a.currSlideId];a._s1=0;a._e?(a._t1="transition-property",a._u1="transition-duration",a._v1="transition-timing-function",a._w1=a._x1=a._g+"transform",a._f?(h.webkit&&!h.chrome&&a.slider.addClass("rsWebkit3d"),
a._y1="translate3d(",a._z1="px, ",a._a2="px, 0px)"):(a._y1="translate(",a._z1="px, ",a._a2="px)"),a._l?a._p1[a._g+a._t1]=a._g+"transform":(h={},h[a._g+a._t1]="opacity",h[a._g+a._u1]=a.st.transitionSpeed+"ms",h[a._g+a._v1]=a.st.css3easeInOut,e.css(h))):(a._x1="left",a._w1="top");var p;n(window).on("resize"+a.ns,function(){p&&clearTimeout(p);p=setTimeout(function(){a.updateSliderSize()},50)});a.ev.trigger("rsAfterPropsSetup");a.updateSliderSize();a.st.keyboardNavEnabled&&a._b2();a.st.arrowsNavHideOnTouch&&
(a.hasTouch||a.pointerMultitouch)&&(a.st.arrowsNav=!1);a.st.arrowsNav&&(e=a._o1,n('<div class="rsArrow rsArrowLeft"><div class="rsArrowIcn"></div></div><div class="rsArrow rsArrowRight"><div class="rsArrowIcn"></div></div>').appendTo(e),a._c2=e.children(".rsArrowLeft").click(function(b){b.preventDefault();a.prev()}),a._d2=e.children(".rsArrowRight").click(function(b){b.preventDefault();a.next()}),a.st.arrowsNavAutoHide&&!a.hasTouch&&(a._c2.addClass("rsHidden"),a._d2.addClass("rsHidden"),e.one("mousemove.arrowshover",
function(){a._c2.removeClass("rsHidden");a._d2.removeClass("rsHidden")}),e.hover(function(){a._e2||(a._c2.removeClass("rsHidden"),a._d2.removeClass("rsHidden"))},function(){a._e2||(a._c2.addClass("rsHidden"),a._d2.addClass("rsHidden"))})),a.ev.on("rsOnUpdateNav",function(){a._f2()}),a._f2());if(a.hasTouch&&a.st.sliderTouch||!a.hasTouch&&a.st.sliderDrag)a._p1.on(a._j1,function(b){a._g2(b)});else a.dragSuccess=!1;var r=["rsPlayBtnIcon","rsPlayBtn","rsCloseVideoBtn","rsCloseVideoIcn"];a._p1.click(function(b){if(!a.dragSuccess){var c=
n(b.target).attr("class");if(-1!==n.inArray(c,r)&&a.toggleVideo())return!1;if(a.st.navigateByClick&&!a._h2){if(n(b.target).closest(".rsNoDrag",a._r1).length)return!0;a._i2(b)}a.ev.trigger("rsSlideClick",b)}}).on("click.rs","a",function(b){if(a.dragSuccess)return!1;a._h2=!0;setTimeout(function(){a._h2=!1},3)});a.ev.trigger("rsAfterInit")}n.rsModules||(n.rsModules={uid:0});v.prototype={constructor:v,_i2:function(b){b=b[this._h?"pageX":"pageY"]-this._j2;b>=this._q?this.next():0>b&&this.prev()},_t:function(){var b;
b=this.st.numImagesToPreload;if(this._z=this.st.loop)2===this.numSlides?(this._z=!1,this.st.loopRewind=!0):2>this.numSlides&&(this.st.loopRewind=this._z=!1);this._z&&0<b&&(4>=this.numSlides?b=1:this.st.numImagesToPreload>(this.numSlides-1)/2&&(b=Math.floor((this.numSlides-1)/2)));this._y=b},_s:function(b,f){function c(b,c){c?g.images.push(b.attr(c)):g.images.push(b.text());if(h){h=!1;g.caption="src"===c?b.attr("alt"):b.contents();g.image=g.images[0];g.videoURL=b.attr("data-rsVideo");var d=b.attr("data-rsw"),
e=b.attr("data-rsh");"undefined"!==typeof d&&!1!==d&&"undefined"!==typeof e&&!1!==e?(g.iW=parseInt(d,10),g.iH=parseInt(e,10)):a.st.imgWidth&&a.st.imgHeight&&(g.iW=a.st.imgWidth,g.iH=a.st.imgHeight)}}var a=this,e,g={},d,h=!0;b=n(b);a._k2=b;a.ev.trigger("rsBeforeParseNode",[b,g]);if(!g.stopParsing)return b=a._k2,g.id=a._r,g.contentAdded=!1,a._r++,g.images=[],g.isBig=!1,g.hasCover||(b.hasClass("rsImg")?(d=b,e=!0):(d=b.find(".rsImg"),d.length&&(e=!0)),e?(g.bigImage=d.eq(0).attr("data-rsBigImg"),d.each(function(){var a=
n(this);a.is("a")?c(a,"href"):a.is("img")?c(a,"src"):c(a)})):b.is("img")&&(b.addClass("rsImg rsMainSlideImage"),c(b,"src"))),d=b.find(".rsCaption"),d.length&&(g.caption=d.remove()),g.content=b,a.ev.trigger("rsAfterParseNode",[b,g]),f&&a.slides.push(g),0===g.images.length&&(g.isLoaded=!0,g.isRendered=!1,g.isLoading=!1,g.images=null),g},_b2:function(){var b=this,f,c,a=function(a){37===a?b.prev():39===a&&b.next()};b._b.on("keydown"+b.ns,function(e){if(!b.st.keyboardNavEnabled)return!0;if(!(b._l2||(c=
e.keyCode,37!==c&&39!==c||f))){if(document.activeElement&&/(INPUT|SELECT|TEXTAREA)/i.test(document.activeElement.tagName))return!0;b.isFullscreen&&e.preventDefault();a(c);f=setInterval(function(){a(c)},700)}}).on("keyup"+b.ns,function(a){f&&(clearInterval(f),f=null)})},goTo:function(b,f){b!==this.currSlideId&&this._m2(b,this.st.transitionSpeed,!0,!f)},destroy:function(b){this.ev.trigger("rsBeforeDestroy");this._b.off("keydown"+this.ns+" keyup"+this.ns+" "+this._k1+" "+this._l1);this._p1.off(this._j1+
" click");this.slider.data("royalSlider",null);n.removeData(this.slider,"royalSlider");n(window).off("resize"+this.ns);this.loadingTimeout&&clearTimeout(this.loadingTimeout);b&&this.slider.remove();this.ev=this.slider=this.slides=null},_n2:function(b,f){function c(c,f,g){c.isAdded?(a(f,c),e(f,c)):(g||(g=d.slidesJQ[f]),c.holder?g=c.holder:(g=d.slidesJQ[f]=n(g),c.holder=g),c.appendOnLoaded=!1,e(f,c,g),a(f,c),d._p2(c,g,b),c.isAdded=!0)}function a(a,c){c.contentAdded||(d.setItemHtml(c,b),b||(c.contentAdded=
!0))}function e(a,b,c){d._l&&(c||(c=d.slidesJQ[a]),c.css(d._i,(a+d._d1+p)*d._w))}function g(a){if(l){if(a>q-1)return g(a-q);if(0>a)return g(q+a)}return a}var d=this,h,k,l=d._z,q=d.numSlides;if(!isNaN(f))return g(f);var m=d.currSlideId,p,r=b?Math.abs(d._o2-d.currSlideId)>=d.numSlides-1?0:1:d._y,t=Math.min(2,r),w=!1,v=!1,u;for(k=m;k<m+1+t;k++)if(u=g(k),(h=d.slides[u])&&(!h.isAdded||!h.positionSet)){w=!0;break}for(k=m-1;k>m-1-t;k--)if(u=g(k),(h=d.slides[u])&&(!h.isAdded||!h.positionSet)){v=!0;break}if(w)for(k=
m;k<m+r+1;k++)u=g(k),p=Math.floor((d._u-(m-k))/d.numSlides)*d.numSlides,(h=d.slides[u])&&c(h,u);if(v)for(k=m-1;k>m-1-r;k--)u=g(k),p=Math.floor((d._u-(m-k))/q)*q,(h=d.slides[u])&&c(h,u);if(!b)for(t=g(m-r),m=g(m+r),r=t>m?0:t,k=0;k<q;k++)t>m&&k>t-1||!(k<r||k>m)||(h=d.slides[k])&&h.holder&&(h.holder.detach(),h.isAdded=!1)},setItemHtml:function(b,f){var c=this,a=function(){if(!b.images)b.isRendered=!0,b.isLoaded=!0,b.isLoading=!1,d(!0);else if(!b.isLoading){var a,f;b.content.hasClass("rsImg")?(a=b.content,
f=!0):a=b.content.find(".rsImg:not(img)");a&&!a.is("img")&&a.each(function(){var a=n(this),c='<img class="rsImg" src="'+(a.is("a")?a.attr("href"):a.text())+'" />';f?b.content=n(c):a.replaceWith(c)});a=f?b.content:b.content.find("img.rsImg");k();a.eq(0).addClass("rsMainSlideImage");b.iW&&b.iH&&(b.isLoaded||c._q2(b),d());b.isLoading=!0;if(b.isBig)n("<img />").on("load.rs error.rs",function(a){n(this).off("load.rs error.rs");e([this],!0)}).attr("src",b.image);else{b.loaded=[];b.numStartedLoad=0;a=function(a){n(this).off("load.rs error.rs");
b.loaded.push(this);b.loaded.length===b.numStartedLoad&&e(b.loaded,!1)};for(var g=0;g<b.images.length;g++){var h=n("<img />");b.numStartedLoad++;h.on("load.rs error.rs",a).attr("src",b.images[g])}}}},e=function(a,c){if(a.length){var d=a[0];if(c!==b.isBig)(d=b.holder.children())&&1<d.length&&l();else if(b.iW&&b.iH)g();else if(b.iW=d.width,b.iH=d.height,b.iW&&b.iH)g();else{var e=new Image;e.onload=function(){e.width?(b.iW=e.width,b.iH=e.height,g()):setTimeout(function(){e.width&&(b.iW=e.width,b.iH=
e.height);g()},1E3)};e.src=d.src}}else g()},g=function(){b.isLoaded=!0;b.isLoading=!1;d();l();h()},d=function(){if(!b.isAppended&&c.ev){var a=c.st.visibleNearby,d=b.id-c._o;f||b.appendOnLoaded||!c.st.fadeinLoadedSlide||0!==d&&(!(a||c._r2||c._l2)||-1!==d&&1!==d)||(a={visibility:"visible",opacity:0},a[c._g+"transition"]="opacity 400ms ease-in-out",b.content.css(a),setTimeout(function(){b.content.css("opacity",1)},16));b.holder.find(".rsPreloader").length?b.holder.append(b.content):b.holder.html(b.content);
b.isAppended=!0;b.isLoaded&&(c._q2(b),h());b.sizeReady||(b.sizeReady=!0,setTimeout(function(){c.ev.trigger("rsMaybeSizeReady",b)},100))}},h=function(){!b.loadedTriggered&&c.ev&&(b.isLoaded=b.loadedTriggered=!0,b.holder.trigger("rsAfterContentSet"),c.ev.trigger("rsAfterContentSet",b))},k=function(){c.st.usePreloader&&b.holder.html(c._q1.clone())},l=function(a){c.st.usePreloader&&(a=b.holder.find(".rsPreloader"),a.length&&a.remove())};b.isLoaded?d():f?!c._l&&b.images&&b.iW&&b.iH?a():(b.holder.isWaiting=
!0,k(),b.holder.slideId=-99):a()},_p2:function(b,f,c){this._p1.append(b.holder);b.appendOnLoaded=!1},_g2:function(b,f){var c=this,a,e="touchstart"===b.type;c._s2=e;c.ev.trigger("rsDragStart");if(n(b.target).closest(".rsNoDrag",c._r1).length)return c.dragSuccess=!1,!0;!f&&c._r2&&(c._t2=!0,c._u2());c.dragSuccess=!1;if(c._l2)e&&(c._v2=!0);else{e&&(c._v2=!1);c._w2();if(e){var g=b.originalEvent.touches;if(g&&0<g.length)a=g[0],1<g.length&&(c._v2=!0);else return}else b.preventDefault(),a=b,c.pointerEnabled&&
(a=a.originalEvent);c._l2=!0;c._b.on(c._k1,function(a){c._x2(a,f)}).on(c._l1,function(a){c._y2(a,f)});c._z2="";c._a3=!1;c._b3=a.pageX;c._c3=a.pageY;c._d3=c._v=(f?c._e3:c._h)?a.pageX:a.pageY;c._f3=0;c._g3=0;c._h3=f?c._i3:c._p;c._j3=(new Date).getTime();if(e)c._e1.on(c._m1,function(a){c._y2(a,f)})}},_k3:function(b,f){if(this._l3){var c=this._m3,a=b.pageX-this._b3,e=b.pageY-this._c3,g=this._h3+a,d=this._h3+e,h=f?this._e3:this._h,g=h?g:d,d=this._z2;this._a3=!0;this._b3=b.pageX;this._c3=b.pageY;"x"===
d&&0!==a?this._f3=0<a?1:-1:"y"===d&&0!==e&&(this._g3=0<e?1:-1);d=h?this._b3:this._c3;a=h?a:e;f?g>this._n3?g=this._h3+a*this._n1:g<this._o3&&(g=this._h3+a*this._n1):this._z||(0>=this.currSlideId&&0<d-this._d3&&(g=this._h3+a*this._n1),this.currSlideId>=this.numSlides-1&&0>d-this._d3&&(g=this._h3+a*this._n1));this._h3=g;200<c-this._j3&&(this._j3=c,this._v=d);f?this._q3(this._h3):this._l&&this._p3(this._h3)}},_x2:function(b,f){var c=this,a,e="touchmove"===b.type;if(!c._s2||e){if(e){if(c._r3)return;var g=
b.originalEvent.touches;if(g){if(1<g.length)return;a=g[0]}else return}else a=b,c.pointerEnabled&&(a=a.originalEvent);c._a3||(c._e&&(f?c._s3:c._p1).css(c._g+c._u1,"0s"),function h(){c._l2&&(c._t3=requestAnimationFrame(h),c._u3&&c._k3(c._u3,f))}());if(c._l3)b.preventDefault(),c._m3=(new Date).getTime(),c._u3=a;else if(g=f?c._e3:c._h,a=Math.abs(a.pageX-c._b3)-Math.abs(a.pageY-c._c3)-(g?-7:7),7<a){if(g)b.preventDefault(),c._z2="x";else if(e){c._v3(b);return}c._l3=!0}else if(-7>a){if(!g)b.preventDefault(),
c._z2="y";else if(e){c._v3(b);return}c._l3=!0}}},_v3:function(b,f){this._r3=!0;this._a3=this._l2=!1;this._y2(b)},_y2:function(b,f){function c(a){return 100>a?100:500<a?500:a}function a(a,b){if(e._l||f)h=(-e._u-e._d1)*e._w,k=Math.abs(e._p-h),e._c=k/b,a&&(e._c+=250),e._c=c(e._c),e._x3(h,!1)}var e=this,g,d,h,k;g=-1<b.type.indexOf("touch");if(!e._s2||g)if(e._s2=!1,e.ev.trigger("rsDragRelease"),e._u3=null,e._l2=!1,e._r3=!1,e._l3=!1,e._m3=0,cancelAnimationFrame(e._t3),e._a3&&(f?e._q3(e._h3):e._l&&e._p3(e._h3)),
e._b.off(e._k1).off(e._l1),g&&e._e1.off(e._m1),e._i1(),!e._a3&&!e._v2&&f&&e._w3){var l=n(b.target).closest(".rsNavItem");l.length&&e.goTo(l.index())}else{d=f?e._e3:e._h;if(!e._a3||"y"===e._z2&&d||"x"===e._z2&&!d)if(!f&&e._t2){e._t2=!1;if(e.st.navigateByClick){e._i2(e.pointerEnabled?b.originalEvent:b);e.dragSuccess=!0;return}e.dragSuccess=!0}else{e._t2=!1;e.dragSuccess=!1;return}else e.dragSuccess=!0;e._t2=!1;e._z2="";var q=e.st.minSlideOffset;g=g?b.originalEvent.changedTouches[0]:e.pointerEnabled?
b.originalEvent:b;var m=d?g.pageX:g.pageY,p=e._d3;g=e._v;var r=e.currSlideId,t=e.numSlides,w=d?e._f3:e._g3,v=e._z;Math.abs(m-p);g=m-g;d=(new Date).getTime()-e._j3;d=Math.abs(g)/d;if(0===w||1>=t)a(!0,d);else{if(!v&&!f)if(0>=r){if(0<w){a(!0,d);return}}else if(r>=t-1&&0>w){a(!0,d);return}if(f){h=e._i3;if(h>e._n3)h=e._n3;else if(h<e._o3)h=e._o3;else{m=d*d/.006;l=-e._i3;p=e._y3-e._z3+e._i3;0<g&&m>l?(l+=e._z3/(15/(m/d*.003)),d=d*l/m,m=l):0>g&&m>p&&(p+=e._z3/(15/(m/d*.003)),d=d*p/m,m=p);l=Math.max(Math.round(d/
.003),50);h+=m*(0>g?-1:1);if(h>e._n3){e._a4(h,l,!0,e._n3,200);return}if(h<e._o3){e._a4(h,l,!0,e._o3,200);return}}e._a4(h,l,!0)}else l=function(a){var b=Math.floor(a/e._w);a-b*e._w>q&&b++;return b},p+q<m?0>w?a(!1,d):(l=l(m-p),e._m2(e.currSlideId-l,c(Math.abs(e._p-(-e._u-e._d1+l)*e._w)/d),!1,!0,!0)):p-q>m?0<w?a(!1,d):(l=l(p-m),e._m2(e.currSlideId+l,c(Math.abs(e._p-(-e._u-e._d1-l)*e._w)/d),!1,!0,!0)):a(!1,d)}}},_p3:function(b){b=this._p=b;this._e?this._p1.css(this._x1,this._y1+(this._h?b+this._z1+0:
0+this._z1+b)+this._a2):this._p1.css(this._h?this._x1:this._w1,b)},updateSliderSize:function(b){var f,c;if(this.slider){if(this.st.autoScaleSlider){var a=this.st.autoScaleSliderWidth,e=this.st.autoScaleSliderHeight;this.st.autoScaleHeight?(f=this.slider.width(),f!=this.width&&(this.slider.css("height",e/a*f),f=this.slider.width()),c=this.slider.height()):(c=this.slider.height(),c!=this.height&&(this.slider.css("width",a/e*c),c=this.slider.height()),f=this.slider.width())}else f=this.slider.width(),
c=this.slider.height();if(b||f!=this.width||c!=this.height){this.width=f;this.height=c;this._b4=f;this._c4=c;this.ev.trigger("rsBeforeSizeSet");this.ev.trigger("rsAfterSizePropSet");this._e1.css({width:this._b4,height:this._c4});this._w=(this._h?this._b4:this._c4)+this.st.slidesSpacing;this._d4=this.st.imageScalePadding;for(f=0;f<this.slides.length;f++)b=this.slides[f],b.positionSet=!1,b&&b.images&&b.isLoaded&&(b.isRendered=!1,this._q2(b));if(this._e4)for(f=0;f<this._e4.length;f++)b=this._e4[f],b.holder.css(this._i,
(b.id+this._d1)*this._w);this._n2();this._l&&(this._e&&this._p1.css(this._g+"transition-duration","0s"),this._p3((-this._u-this._d1)*this._w));this.ev.trigger("rsOnUpdateNav")}this._j2=this._e1.offset();this._j2=this._j2[this._i]}},appendSlide:function(b,f){var c=this._s(b);if(isNaN(f)||f>this.numSlides)f=this.numSlides;this.slides.splice(f,0,c);this.slidesJQ.splice(f,0,n('<div style="'+(this._l?"position:absolute;":this._n)+'" class="rsSlide"></div>'));f<=this.currSlideId&&this.currSlideId++;this.ev.trigger("rsOnAppendSlide",
[c,f]);this._f4(f);f===this.currSlideId&&this.ev.trigger("rsAfterSlideChange")},removeSlide:function(b){var f=this.slides[b];f&&(f.holder&&f.holder.remove(),b<this.currSlideId&&this.currSlideId--,this.slides.splice(b,1),this.slidesJQ.splice(b,1),this.ev.trigger("rsOnRemoveSlide",[b]),this._f4(b),b===this.currSlideId&&this.ev.trigger("rsAfterSlideChange"))},_f4:function(b){var f=this;b=f.numSlides;b=0>=f._u?0:Math.floor(f._u/b);f.numSlides=f.slides.length;0===f.numSlides?(f.currSlideId=f._d1=f._u=
0,f.currSlide=f._g4=null):f._u=b*f.numSlides+f.currSlideId;for(b=0;b<f.numSlides;b++)f.slides[b].id=b;f.currSlide=f.slides[f.currSlideId];f._r1=f.slidesJQ[f.currSlideId];f.currSlideId>=f.numSlides?f.goTo(f.numSlides-1):0>f.currSlideId&&f.goTo(0);f._t();f._l&&f._p1.css(f._g+f._u1,"0ms");f._h4&&clearTimeout(f._h4);f._h4=setTimeout(function(){f._l&&f._p3((-f._u-f._d1)*f._w);f._n2();f._l||f._r1.css({display:"block",opacity:1})},14);f.ev.trigger("rsOnUpdateNav")},_i1:function(){this._f1&&this._l&&(this._g1?
this._e1.css("cursor",this._g1):(this._e1.removeClass("grabbing-cursor"),this._e1.addClass("grab-cursor")))},_w2:function(){this._f1&&this._l&&(this._h1?this._e1.css("cursor",this._h1):(this._e1.removeClass("grab-cursor"),this._e1.addClass("grabbing-cursor")))},next:function(b){this._m2("next",this.st.transitionSpeed,!0,!b)},prev:function(b){this._m2("prev",this.st.transitionSpeed,!0,!b)},_m2:function(b,f,c,a,e){var g=this,d,h,k;g.ev.trigger("rsBeforeMove",[b,a]);k="next"===b?g.currSlideId+1:"prev"===
b?g.currSlideId-1:b=parseInt(b,10);if(!g._z){if(0>k){g._i4("left",!a);return}if(k>=g.numSlides){g._i4("right",!a);return}}g._r2&&(g._u2(!0),c=!1);h=k-g.currSlideId;k=g._o2=g.currSlideId;var l=g.currSlideId+h;a=g._u;var n;g._z?(l=g._n2(!1,l),a+=h):a=l;g._o=l;g._g4=g.slidesJQ[g.currSlideId];g._u=a;g.currSlideId=g._o;g.currSlide=g.slides[g.currSlideId];g._r1=g.slidesJQ[g.currSlideId];var l=g.st.slidesDiff,m=Boolean(0<h);h=Math.abs(h);var p=Math.floor(k/g._y),r=Math.floor((k+(m?l:-l))/g._y),p=(m?Math.max(p,
r):Math.min(p,r))*g._y+(m?g._y-1:0);p>g.numSlides-1?p=g.numSlides-1:0>p&&(p=0);k=m?p-k:k-p;k>g._y&&(k=g._y);if(h>k+l)for(g._d1+=(h-(k+l))*(m?-1:1),f*=1.4,k=0;k<g.numSlides;k++)g.slides[k].positionSet=!1;g._c=f;g._n2(!0);e||(n=!0);d=(-a-g._d1)*g._w;n?setTimeout(function(){g._j4=!1;g._x3(d,b,!1,c);g.ev.trigger("rsOnUpdateNav")},0):(g._x3(d,b,!1,c),g.ev.trigger("rsOnUpdateNav"))},_f2:function(){this.st.arrowsNav&&(1>=this.numSlides?(this._c2.css("display","none"),this._d2.css("display","none")):(this._c2.css("display",
"block"),this._d2.css("display","block"),this._z||this.st.loopRewind||(0===this.currSlideId?this._c2.addClass("rsArrowDisabled"):this._c2.removeClass("rsArrowDisabled"),this.currSlideId===this.numSlides-1?this._d2.addClass("rsArrowDisabled"):this._d2.removeClass("rsArrowDisabled"))))},_x3:function(b,f,c,a,e){function g(){var a;h&&(a=h.data("rsTimeout"))&&(h!==k&&h.css({opacity:0,display:"none",zIndex:0}),clearTimeout(a),h.data("rsTimeout",""));if(a=k.data("rsTimeout"))clearTimeout(a),k.data("rsTimeout",
"")}var d=this,h,k,l={};isNaN(d._c)&&(d._c=400);d._p=d._h3=b;d.ev.trigger("rsBeforeAnimStart");d._e?d._l?(d._c=parseInt(d._c,10),c=d._g+d._v1,l[d._g+d._u1]=d._c+"ms",l[c]=a?n.rsCSS3Easing[d.st.easeInOut]:n.rsCSS3Easing[d.st.easeOut],d._p1.css(l),a||!d.hasTouch?setTimeout(function(){d._p3(b)},5):d._p3(b)):(d._c=d.st.transitionSpeed,h=d._g4,k=d._r1,k.data("rsTimeout")&&k.css("opacity",0),g(),h&&h.data("rsTimeout",setTimeout(function(){l[d._g+d._u1]="0ms";l.zIndex=0;l.display="none";h.data("rsTimeout",
"");h.css(l);setTimeout(function(){h.css("opacity",0)},16)},d._c+60)),l.display="block",l.zIndex=d._m,l.opacity=0,l[d._g+d._u1]="0ms",l[d._g+d._v1]=n.rsCSS3Easing[d.st.easeInOut],k.css(l),k.data("rsTimeout",setTimeout(function(){k.css(d._g+d._u1,d._c+"ms");k.data("rsTimeout",setTimeout(function(){k.css("opacity",1);k.data("rsTimeout","")},20))},20))):d._l?(l[d._h?d._x1:d._w1]=b+"px",d._p1.animate(l,d._c,a?d.st.easeInOut:d.st.easeOut)):(h=d._g4,k=d._r1,k.stop(!0,!0).css({opacity:0,display:"block",
zIndex:d._m}),d._c=d.st.transitionSpeed,k.animate({opacity:1},d._c,d.st.easeInOut),g(),h&&h.data("rsTimeout",setTimeout(function(){h.stop(!0,!0).css({opacity:0,display:"none",zIndex:0})},d._c+60)));d._r2=!0;d.loadingTimeout&&clearTimeout(d.loadingTimeout);d.loadingTimeout=e?setTimeout(function(){d.loadingTimeout=null;e.call()},d._c+60):setTimeout(function(){d.loadingTimeout=null;d._k4(f)},d._c+60)},_u2:function(b){this._r2=!1;clearTimeout(this.loadingTimeout);if(this._l)if(!this._e)this._p1.stop(!0),
this._p=parseInt(this._p1.css(this._h?this._x1:this._w1),10);else{if(!b){b=this._p;var f=this._h3=this._l4();this._p1.css(this._g+this._u1,"0ms");b!==f&&this._p3(f)}}else 20<this._m?this._m=10:this._m++},_l4:function(){var b=window.getComputedStyle(this._p1.get(0),null).getPropertyValue(this._g+"transform").replace(/^matrix\(/i,"").split(/, |\)$/g),f=0===b[0].indexOf("matrix3d");return parseInt(b[this._h?f?12:4:f?13:5],10)},_m4:function(b,f){return this._e?this._y1+(f?b+this._z1+0:0+this._z1+b)+this._a2:
b},_k4:function(b){this._l||(this._r1.css("z-index",0),this._m=10);this._r2=!1;this.staticSlideId=this.currSlideId;this._n2();this._n4=!1;this.ev.trigger("rsAfterSlideChange")},_i4:function(b,f){var c=this,a=(-c._u-c._d1)*c._w;if(0!==c.numSlides&&!c._r2)if(c.st.loopRewind)c.goTo("left"===b?c.numSlides-1:0,f);else if(c._l){c._c=200;var e=function(){c._r2=!1};c._x3(a+("left"===b?30:-30),"",!1,!0,function(){c._r2=!1;c._x3(a,"",!1,!0,e)})}},_q2:function(b,f){if(!b.isRendered){var c=b.content,a="rsMainSlideImage",
e,g=n.isFunction(this.st.imageAlignCenter)?this.st.imageAlignCenter(b):this.st.imageAlignCenter,d=n.isFunction(this.st.imageScaleMode)?this.st.imageScaleMode(b):this.st.imageScaleMode,h;b.videoURL&&(a="rsVideoContainer","fill"!==d?e=!0:(h=c,h.hasClass(a)||(h=h.find("."+a)),h.css({width:"100%",height:"100%"}),a="rsMainSlideImage"));c.hasClass(a)||(c=c.find("."+a));if(c){var k=b.iW,l=b.iH;b.isRendered=!0;if("none"!==d||g){a="fill"!==d?this._d4:0;h=this._b4-2*a;var q=this._c4-2*a,m,p,r={};"fit-if-smaller"===
d&&(k>h||l>q)&&(d="fit");if("fill"===d||"fit"===d)m=h/k,p=q/l,m="fill"==d?m>p?m:p:"fit"==d?m<p?m:p:1,k=Math.ceil(k*m,10),l=Math.ceil(l*m,10);"none"!==d&&(r.width=k,r.height=l,e&&c.find(".rsImg").css({width:"100%",height:"100%"}));g&&(r.marginLeft=Math.floor((h-k)/2)+a,r.marginTop=Math.floor((q-l)/2)+a);c.css(r)}}}}};n.rsProto=v.prototype;n.fn.royalSlider=function(b){var f=arguments;return this.each(function(){var c=n(this);if("object"!==typeof b&&b){if((c=c.data("royalSlider"))&&c[b])return c[b].apply(c,
Array.prototype.slice.call(f,1))}else c.data("royalSlider")||c.data("royalSlider",new v(c,b))})};n.fn.royalSlider.defaults={slidesSpacing:8,startSlideId:0,loop:!1,loopRewind:!1,numImagesToPreload:4,fadeinLoadedSlide:!0,slidesOrientation:"horizontal",transitionType:"move",transitionSpeed:600,controlNavigation:"bullets",controlsInside:!0,arrowsNav:!0,arrowsNavAutoHide:!0,navigateByClick:!0,randomizeSlides:!1,sliderDrag:!0,sliderTouch:!0,keyboardNavEnabled:!1,fadeInAfterLoaded:!0,allowCSS3:!0,allowCSS3OnWebkit:!0,
addActiveClass:!1,autoHeight:!1,easeOut:"easeOutSine",easeInOut:"easeInOutSine",minSlideOffset:10,imageScaleMode:"fit-if-smaller",imageAlignCenter:!0,imageScalePadding:4,usePreloader:!0,autoScaleSlider:!1,autoScaleSliderWidth:800,autoScaleSliderHeight:400,autoScaleHeight:!0,arrowsNavHideOnTouch:!1,globalCaption:!1,slidesDiff:2};n.rsCSS3Easing={easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)"};n.extend(jQuery.easing,{easeInOutSine:function(b,
f,c,a,e){return-a/2*(Math.cos(Math.PI*f/e)-1)+c},easeOutSine:function(b,f,c,a,e){return a*Math.sin(f/e*(Math.PI/2))+c},easeOutCubic:function(b,f,c,a,e){return a*((f=f/e-1)*f*f+1)+c}})})(jQuery,window);
// jquery.rs.bullets v1.0.1
(function(c){c.extend(c.rsProto,{_i5:function(){var a=this;"bullets"===a.st.controlNavigation&&(a.ev.one("rsAfterPropsSetup",function(){a._j5=!0;a.slider.addClass("rsWithBullets");for(var b='<div class="rsNav rsBullets">',e=0;e<a.numSlides;e++)b+='<div class="rsNavItem rsBullet"><span></span></div>';a._k5=b=c(b+"</div>");a._l5=b.appendTo(a.slider).children();a._k5.on("click.rs",".rsNavItem",function(b){a._m5||a.goTo(c(this).index())})}),a.ev.on("rsOnAppendSlide",function(b,c,d){d>=a.numSlides?a._k5.append('<div class="rsNavItem rsBullet"><span></span></div>'):
a._l5.eq(d).before('<div class="rsNavItem rsBullet"><span></span></div>');a._l5=a._k5.children()}),a.ev.on("rsOnRemoveSlide",function(b,c){var d=a._l5.eq(c);d&&d.length&&(d.remove(),a._l5=a._k5.children())}),a.ev.on("rsOnUpdateNav",function(){var b=a.currSlideId;a._n5&&a._n5.removeClass("rsNavSelected");b=a._l5.eq(b);b.addClass("rsNavSelected");a._n5=b}))}});c.rsModules.bullets=c.rsProto._i5})(jQuery);
// jquery.rs.animated-blocks v1.0.7
(function(l){l.extend(l.rsProto,{_p4:function(){function m(){var g=a.currSlide;if(a.currSlide&&a.currSlide.isLoaded&&a._t4!==g){if(0<a._s4.length){for(b=0;b<a._s4.length;b++)clearTimeout(a._s4[b]);a._s4=[]}if(0<a._r4.length){var f;for(b=0;b<a._r4.length;b++)if(f=a._r4[b])a._e?(f.block.css(a._g+a._u1,"0s"),f.block.css(f.css)):f.block.stop(!0).css(f.css),a._t4=null,g.animBlocksDisplayed=!1;a._r4=[]}g.animBlocks&&(g.animBlocksDisplayed=!0,a._t4=g,a._u4(g.animBlocks))}}var a=this,b;a._q4={fadeEffect:!0,
moveEffect:"top",moveOffset:20,speed:400,easing:"easeOutSine",delay:200};a.st.block=l.extend({},a._q4,a.st.block);a._r4=[];a._s4=[];a.ev.on("rsAfterInit",function(){m()});a.ev.on("rsBeforeParseNode",function(a,b,d){b=l(b);d.animBlocks=b.find(".rsABlock").css("display","none");d.animBlocks.length||(b.hasClass("rsABlock")?d.animBlocks=b.css("display","none"):d.animBlocks=!1)});a.ev.on("rsAfterContentSet",function(b,f){f.id===a.slides[a.currSlideId].id&&setTimeout(function(){m()},a.st.fadeinLoadedSlide?
300:0)});a.ev.on("rsAfterSlideChange",function(){m()})},_v4:function(l,a){setTimeout(function(){l.css(a)},6)},_u4:function(m){var a=this,b,g,f,d,h,e,n;a._s4=[];m.each(function(m){b=l(this);g={};f={};d=null;var c=b.attr("data-move-offset"),c=c?parseInt(c,10):a.st.block.moveOffset;if(0<c&&((e=b.data("move-effect"))?(e=e.toLowerCase(),"none"===e?e=!1:"left"!==e&&"top"!==e&&"bottom"!==e&&"right"!==e&&(e=a.st.block.moveEffect,"none"===e&&(e=!1))):e=a.st.block.moveEffect,e&&"none"!==e)){var p;p="right"===
e||"left"===e?!0:!1;var k;n=!1;a._e?(k=0,h=a._x1):(p?isNaN(parseInt(b.css("right"),10))?h="left":(h="right",n=!0):isNaN(parseInt(b.css("bottom"),10))?h="top":(h="bottom",n=!0),h="margin-"+h,n&&(c=-c),a._e?k=parseInt(b.css(h),10):(k=b.data("rs-start-move-prop"),void 0===k&&(k=parseInt(b.css(h),10),isNaN(k)&&(k=0),b.data("rs-start-move-prop",k))));f[h]=a._m4("top"===e||"left"===e?k-c:k+c,p);g[h]=a._m4(k,p)}c=b.attr("data-fade-effect");if(!c)c=a.st.block.fadeEffect;else if("none"===c.toLowerCase()||
"false"===c.toLowerCase())c=!1;c&&(f.opacity=0,g.opacity=1);if(c||e)d={},d.hasFade=Boolean(c),Boolean(e)&&(d.moveProp=h,d.hasMove=!0),d.speed=b.data("speed"),isNaN(d.speed)&&(d.speed=a.st.block.speed),d.easing=b.data("easing"),d.easing||(d.easing=a.st.block.easing),d.css3Easing=l.rsCSS3Easing[d.easing],d.delay=b.data("delay"),isNaN(d.delay)&&(d.delay=a.st.block.delay*m);c={};a._e&&(c[a._g+a._u1]="0ms");c.moveProp=g.moveProp;c.opacity=g.opacity;c.display="none";a._r4.push({block:b,css:c});a._v4(b,
f);a._s4.push(setTimeout(function(b,d,c,e){return function(){b.css("display","block");if(c){var g={};if(a._e){var f="";c.hasMove&&(f+=c.moveProp);c.hasFade&&(c.hasMove&&(f+=", "),f+="opacity");g[a._g+a._t1]=f;g[a._g+a._u1]=c.speed+"ms";g[a._g+a._v1]=c.css3Easing;b.css(g);setTimeout(function(){b.css(d)},24)}else setTimeout(function(){b.animate(d,c.speed,c.easing)},16)}delete a._s4[e]}}(b,g,d,m),6>=d.delay?12:d.delay))})}});l.rsModules.animatedBlocks=l.rsProto._p4})(jQuery);
// jquery.rs.auto-height v1.0.3
(function(b){b.extend(b.rsProto,{_w4:function(){var a=this;if(a.st.autoHeight){var b,c,e,f=!0,d=function(d){e=a.slides[a.currSlideId];(b=e.holder)&&(c=b.height())&&void 0!==c&&c>(a.st.minAutoHeight||30)&&(a._c4=c,a._e||!d?a._e1.css("height",c):a._e1.stop(!0,!0).animate({height:c},a.st.transitionSpeed),a.ev.trigger("rsAutoHeightChange",c),f&&(a._e&&setTimeout(function(){a._e1.css(a._g+"transition","height "+a.st.transitionSpeed+"ms ease-in-out")},16),f=!1))};a.ev.on("rsMaybeSizeReady.rsAutoHeight",
function(a,b){e===b&&d()});a.ev.on("rsAfterContentSet.rsAutoHeight",function(a,b){e===b&&d()});a.slider.addClass("rsAutoHeight");a.ev.one("rsAfterInit",function(){setTimeout(function(){d(!1);setTimeout(function(){a.slider.append('<div style="clear:both; float: none;"></div>')},16)},16)});a.ev.on("rsBeforeAnimStart",function(){d(!0)});a.ev.on("rsBeforeSizeSet",function(){setTimeout(function(){d(!1)},16)})}}});b.rsModules.autoHeight=b.rsProto._w4})(jQuery);
// jquery.rs.active-class v1.0.1
(function(c){c.rsProto._o4=function(){var b,a=this;if(a.st.addActiveClass)a.ev.on("rsOnUpdateNav",function(){b&&clearTimeout(b);b=setTimeout(function(){a._g4&&a._g4.removeClass("rsActiveSlide");a._r1&&a._r1.addClass("rsActiveSlide");b=null},50)})};c.rsModules.activeClass=c.rsProto._o4})(jQuery);

/*!
 * jQuery Smooth Scroll - v2.2.0 - 2017-05-05
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2017 Karl Swedberg
 * Licensed MIT
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {

  var version = '2.2.0';
  var optionOverrides = {};
  var defaults = {
    exclude: [],
    excludeWithin: [],
    offset: 0,

    // one of 'top' or 'left'
    direction: 'top',

    // if set, bind click events through delegation
    //  supported since jQuery 1.4.2
    delegateSelector: null,

    // jQuery set of elements you wish to scroll (for $.smoothScroll).
    //  if null (default), $('html, body').firstScrollable() is used.
    scrollElement: null,

    // only use if you want to override default behavior
    scrollTarget: null,

    // automatically focus the target element after scrolling to it
    autoFocus: false,

    // fn(opts) function to be called before scrolling occurs.
    // `this` is the element(s) being scrolled
    beforeScroll: function() {},

    // fn(opts) function to be called after scrolling occurs.
    // `this` is the triggering element
    afterScroll: function() {},

    // easing name. jQuery comes with "swing" and "linear." For others, you'll need an easing plugin
    // from jQuery UI or elsewhere
    easing: 'swing',

    // speed can be a number or 'auto'
    // if 'auto', the speed will be calculated based on the formula:
    // (current scroll position - target scroll position) / autoCoeffic
    speed: 400,

    // coefficient for "auto" speed
    autoCoefficient: 2,

    // $.fn.smoothScroll only: whether to prevent the default click action
    preventDefault: true
  };

  var getScrollable = function(opts) {
    var scrollable = [];
    var scrolled = false;
    var dir = opts.dir && opts.dir === 'left' ? 'scrollLeft' : 'scrollTop';

    this.each(function() {
      var el = $(this);

      if (this === document || this === window) {
        return;
      }

      if (document.scrollingElement && (this === document.documentElement || this === document.body)) {
        scrollable.push(document.scrollingElement);

        return false;
      }

      if (el[dir]() > 0) {
        scrollable.push(this);
      } else {
        // if scroll(Top|Left) === 0, nudge the element 1px and see if it moves
        el[dir](1);
        scrolled = el[dir]() > 0;

        if (scrolled) {
          scrollable.push(this);
        }
        // then put it back, of course
        el[dir](0);
      }
    });

    if (!scrollable.length) {
      this.each(function() {
        // If no scrollable elements and <html> has scroll-behavior:smooth because
        // "When this property is specified on the root element, it applies to the viewport instead."
        // and "The scroll-behavior property of the … body element is *not* propagated to the viewport."
        // → https://drafts.csswg.org/cssom-view/#propdef-scroll-behavior
        if (this === document.documentElement && $(this).css('scrollBehavior') === 'smooth') {
          scrollable = [this];
        }

        // If still no scrollable elements, fall back to <body>,
        // if it's in the jQuery collection
        // (doing this because Safari sets scrollTop async,
        // so can't set it to 1 and immediately get the value.)
        if (!scrollable.length && this.nodeName === 'BODY') {
          scrollable = [this];
        }
      });
    }

    // Use the first scrollable element if we're calling firstScrollable()
    if (opts.el === 'first' && scrollable.length > 1) {
      scrollable = [scrollable[0]];
    }

    return scrollable;
  };

  var rRelative = /^([\-\+]=)(\d+)/;

  $.fn.extend({
    scrollable: function(dir) {
      var scrl = getScrollable.call(this, {dir: dir});

      return this.pushStack(scrl);
    },
    firstScrollable: function(dir) {
      var scrl = getScrollable.call(this, {el: 'first', dir: dir});

      return this.pushStack(scrl);
    },

    smoothScroll: function(options, extra) {
      options = options || {};

      if (options === 'options') {
        if (!extra) {
          return this.first().data('ssOpts');
        }

        return this.each(function() {
          var $this = $(this);
          var opts = $.extend($this.data('ssOpts') || {}, extra);

          $(this).data('ssOpts', opts);
        });
      }

      var opts = $.extend({}, $.fn.smoothScroll.defaults, options);

      var clickHandler = function(event) {
        var escapeSelector = function(str) {
          return str.replace(/(:|\.|\/)/g, '\\$1');
        };

        var link = this;
        var $link = $(this);
        var thisOpts = $.extend({}, opts, $link.data('ssOpts') || {});
        var exclude = opts.exclude;
        var excludeWithin = thisOpts.excludeWithin;
        var elCounter = 0;
        var ewlCounter = 0;
        var include = true;
        var clickOpts = {};
        var locationPath = $.smoothScroll.filterPath(location.pathname);
        var linkPath = $.smoothScroll.filterPath(link.pathname);
        var hostMatch = location.hostname === link.hostname || !link.hostname;
        var pathMatch = thisOpts.scrollTarget || (linkPath === locationPath);
        var thisHash = escapeSelector(link.hash);

        if (thisHash && !$(thisHash).length) {
          include = false;
        }

        if (!thisOpts.scrollTarget && (!hostMatch || !pathMatch || !thisHash)) {
          include = false;
        } else {
          while (include && elCounter < exclude.length) {
            if ($link.is(escapeSelector(exclude[elCounter++]))) {
              include = false;
            }
          }

          while (include && ewlCounter < excludeWithin.length) {
            if ($link.closest(excludeWithin[ewlCounter++]).length) {
              include = false;
            }
          }
        }

        if (include) {
          if (thisOpts.preventDefault) {
            event.preventDefault();
          }

          $.extend(clickOpts, thisOpts, {
            scrollTarget: thisOpts.scrollTarget || thisHash,
            link: link
          });

          $.smoothScroll(clickOpts);
        }
      };

      if (options.delegateSelector !== null) {
        this
        .off('click.smoothscroll', options.delegateSelector)
        .on('click.smoothscroll', options.delegateSelector, clickHandler);
      } else {
        this
        .off('click.smoothscroll')
        .on('click.smoothscroll', clickHandler);
      }

      return this;
    }
  });

  var getExplicitOffset = function(val) {
    var explicit = {relative: ''};
    var parts = typeof val === 'string' && rRelative.exec(val);

    if (typeof val === 'number') {
      explicit.px = val;
    } else if (parts) {
      explicit.relative = parts[1];
      explicit.px = parseFloat(parts[2]) || 0;
    }

    return explicit;
  };

  var onAfterScroll = function(opts) {
    var $tgt = $(opts.scrollTarget);

    if (opts.autoFocus && $tgt.length) {
      $tgt[0].focus();

      if (!$tgt.is(document.activeElement)) {
        $tgt.prop({tabIndex: -1});
        $tgt[0].focus();
      }
    }

    opts.afterScroll.call(opts.link, opts);
  };

  $.smoothScroll = function(options, px) {
    if (options === 'options' && typeof px === 'object') {
      return $.extend(optionOverrides, px);
    }
    var opts, $scroller, speed, delta;
    var explicitOffset = getExplicitOffset(options);
    var scrollTargetOffset = {};
    var scrollerOffset = 0;
    var offPos = 'offset';
    var scrollDir = 'scrollTop';
    var aniProps = {};
    var aniOpts = {};

    if (explicitOffset.px) {
      opts = $.extend({link: null}, $.fn.smoothScroll.defaults, optionOverrides);
    } else {
      opts = $.extend({link: null}, $.fn.smoothScroll.defaults, options || {}, optionOverrides);

      if (opts.scrollElement) {
        offPos = 'position';

        if (opts.scrollElement.css('position') === 'static') {
          opts.scrollElement.css('position', 'relative');
        }
      }

      if (px) {
        explicitOffset = getExplicitOffset(px);
      }
    }

    scrollDir = opts.direction === 'left' ? 'scrollLeft' : scrollDir;

    if (opts.scrollElement) {
      $scroller = opts.scrollElement;

      if (!explicitOffset.px && !(/^(?:HTML|BODY)$/).test($scroller[0].nodeName)) {
        scrollerOffset = $scroller[scrollDir]();
      }
    } else {
      $scroller = $('html, body').firstScrollable(opts.direction);
    }

    // beforeScroll callback function must fire before calculating offset
    opts.beforeScroll.call($scroller, opts);

    scrollTargetOffset = explicitOffset.px ? explicitOffset : {
      relative: '',
      px: ($(opts.scrollTarget)[offPos]() && $(opts.scrollTarget)[offPos]()[opts.direction]) || 0
    };

    aniProps[scrollDir] = scrollTargetOffset.relative + (scrollTargetOffset.px + scrollerOffset + opts.offset);

    speed = opts.speed;

    // automatically calculate the speed of the scroll based on distance / coefficient
    if (speed === 'auto') {

      // $scroller[scrollDir]() is position before scroll, aniProps[scrollDir] is position after
      // When delta is greater, speed will be greater.
      delta = Math.abs(aniProps[scrollDir] - $scroller[scrollDir]());

      // Divide the delta by the coefficient
      speed = delta / opts.autoCoefficient;
    }

    aniOpts = {
      duration: speed,
      easing: opts.easing,
      complete: function() {
        onAfterScroll(opts);
      }
    };

    if (opts.step) {
      aniOpts.step = opts.step;
    }

    if ($scroller.length) {
      $scroller.stop().animate(aniProps, aniOpts);
    } else {
      onAfterScroll(opts);
    }
  };

  $.smoothScroll.version = version;
  $.smoothScroll.filterPath = function(string) {
    string = string || '';

    return string
      .replace(/^\//, '')
      .replace(/(?:index|default).[a-zA-Z]{3,4}$/, '')
      .replace(/\/$/, '');
  };

  // default options
  $.fn.smoothScroll.defaults = defaults;

}));

/*! modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-dataset-flexbox-flexboxlegacy-touchevents-setclasses !*/
!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,s,i,a;for(var l in x)if(x.hasOwnProperty(l)){if(e=[],t=x[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,s=0;s<e.length;s++)i=e[s],a=i.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),C.push((o?"":"no-")+a.join("-"))}}function s(e){var t=S.className,n=Modernizr._config.classPrefix||"";if(w&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),w?S.className.baseVal=t:S.className=t)}function i(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):w?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function a(e,t){return!!~(""+e).indexOf(t)}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function u(e,t){return function(){return e.apply(t,arguments)}}function f(e,t,n){var o;for(var s in e)if(e[s]in t)return n===!1?e[s]:(o=t[e[s]],r(o,"function")?u(o,n||t):o);return!1}function c(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(t,n,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,t,n);var s=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(s){var i=s.error?"error":"log";s[i].call(s,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!n&&t.currentStyle&&t.currentStyle[r];return o}function p(){var e=t.body;return e||(e=i(w?"svg":"body"),e.fake=!0),e}function m(e,n,r,o){var s,a,l,u,f="modernizr",c=i("div"),d=p();if(parseInt(r,10))for(;r--;)l=i("div"),l.id=o?o[r]:f+(r+1),c.appendChild(l);return s=i("style"),s.type="text/css",s.id="s"+f,(d.fake?d:c).appendChild(s),d.appendChild(c),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(t.createTextNode(e)),c.id=f,d.fake&&(d.style.background="",d.style.overflow="hidden",u=S.style.overflow,S.style.overflow="hidden",S.appendChild(d)),a=n(c,e),d.fake?(d.parentNode.removeChild(d),S.style.overflow=u,S.offsetHeight):c.parentNode.removeChild(c),!!a}function v(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];o--;)s.push("("+c(t[o])+":"+r+")");return s=s.join(" or "),m("@supports ("+s+") { #modernizr { position: absolute; } }",function(e){return"absolute"==d(e,null,"position")})}return n}function h(e,t,o,s){function u(){c&&(delete j.style,delete j.modElem)}if(s=r(s,"undefined")?!1:s,!r(o,"undefined")){var f=v(e,o);if(!r(f,"undefined"))return f}for(var c,d,p,m,h,y=["modernizr","tspan","samp"];!j.style&&y.length;)c=!0,j.modElem=i(y.shift()),j.style=j.modElem.style;for(p=e.length,d=0;p>d;d++)if(m=e[d],h=j.style[m],a(m,"-")&&(m=l(m)),j.style[m]!==n){if(s||r(o,"undefined"))return u(),"pfx"==t?m:!0;try{j.style[m]=o}catch(g){}if(j.style[m]!=h)return u(),"pfx"==t?m:!0}return u(),!1}function y(e,t,n,o,s){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+z.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?h(a,t,o,s):(a=(e+" "+P.join(i+" ")+i).split(" "),f(a,t,n))}function g(e,t,r){return y(e,n,n,t,r)}var C=[],x=[],b={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){x.push({name:e,fn:t,options:n})},addAsyncTest:function(e){x.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=b,Modernizr=new Modernizr;var S=t.documentElement,w="svg"===S.nodeName.toLowerCase();Modernizr.addTest("dataset",function(){var e=i("div");return e.setAttribute("data-a-b","c"),!(!e.dataset||"c"!==e.dataset.aB)});var _=b._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];b._prefixes=_;var T="Moz O ms Webkit",z=b._config.usePrefixes?T.split(" "):[];b._cssomPrefixes=z;var P=b._config.usePrefixes?T.toLowerCase().split(" "):[];b._domPrefixes=P;var E={elem:i("modernizr")};Modernizr._q.push(function(){delete E.elem});var j={style:E.elem.style};Modernizr._q.unshift(function(){delete j.style});var N=b.testStyles=m;Modernizr.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var r=["@media (",_.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");N(r,function(e){n=9===e.offsetTop})}return n}),b.testAllProps=y,b.testAllProps=g,Modernizr.addTest("flexbox",g("flexBasis","1px",!0)),Modernizr.addTest("flexboxlegacy",g("boxDirection","reverse",!0)),o(),s(C),delete b.addTest,delete b.addAsyncTest;for(var k=0;k<Modernizr._q.length;k++)Modernizr._q[k]();e.Modernizr=Modernizr}(window,document);
(function (document, window, $) {

	'use strict';

	// Open external links in new window (exclue scv image maps, email, tel and foobox)

	$('a').not('svg a, [href*="mailto:"], [href*="tel:"], [class*="foobox"]').each(function () {
		var isInternalLink = new RegExp('/' + window.location.host + '/');
		if ( ! isInternalLink.test(this.href) ) {
			$(this).attr('target', '_blank');
		}
	});
	
    

}(document, window, jQuery));


(function (document, window, $) {

	'use strict';
    
    // Scroll up show header

	var $site_header =  $('.site-header');

	// clone header
	var $sticky = $site_header.clone()
							   .prop('id', 'masthead-fixed' )
							   .attr('aria-hidden','true')
							   .addClass('fixed')
							   .insertBefore('#masthead');
            
    $sticky.each(function () {
        var $win = $(window), 
            $self = $(this),
            isShow = false,
            delta = 300, // distance from top where its active
            lastScrollTop = 0;
    
        $win.on('scroll', function () {
          
          // don't show below sticky menu
          if( $('#section-menu .wrap').hasClass('is-stuck') ) {
              return;
          }
          
          var scrollTop = $win.scrollTop();
          var offset = scrollTop - lastScrollTop;
          lastScrollTop = scrollTop;
          
    
    
          // min-offset, min-scroll-top
          if (offset < 0 && scrollTop > delta ) {
            if (!isShow ) {
              $self.addClass('fixed-show');
              isShow = true;
            }
          } else if (offset > 0 || offset < lastScrollTop ) {
            if (isShow) {
              $self.removeClass('fixed-show');
              isShow = false;
            }
          }
        });
    });
    

}(document, window, jQuery));
(function (document, window, $) {

	'use strict';

	// Load Foundation
	$(document).foundation();
    
    
    $(window).on('load changed.zf.mediaquery', function(event, newSize, oldSize) {
        
        $( '.nav-primary' ).doubleTapToGo();
        
        if( ! Foundation.MediaQuery.atLeast('xlarge') ) {
          $( '.nav-primary' ).doubleTapToGo( 'destroy' );
        }
        
        // need to reset sticky on resize. Otherwise ti breaks
        if( ! Foundation.MediaQuery.atLeast('xxlarge') ) {
            $(document).foundation();
        }
        
        
                
    });
    
    // Toggle menu
    
    $('li.menu-item-has-children > a').on('click',function(e){
        
        var $toggle = $(this).parent().find('.sub-menu-toggle');
        
        if( $toggle.is(':visible') ) {
            $toggle.trigger('click');
        }
        
        e.preventDefault();

    });
    
    if( $('.masonry-layout').size() ) {
        var $grid = $('.masonry-layout').isotope({
          itemSelector: '.grid-item',
          percentPosition: true,
          masonry: {
            // use outer width of grid-sizer for columnWidth
            columnWidth: '.grid-sizer'
          }
        });
        
        // filter items on button click
        $('.filter-button-group').on( 'click', 'button', function() {
            $('.filter-button-group button').removeClass("active");
            $(this).addClass("active");  
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
        });
    }
    
}(document, window, jQuery));

(function (document, window, $) {

	'use strict';

	// Replace all SVG images with inline SVG (use as needed so you can set hover fills)

        $('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

		$.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var $svg = jQuery(data).find('svg');

			// Add replaced image's ID to the new SVG
			if(typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if(typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass+' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');

			// Replace image with new SVG
			$img.replaceWith($svg);

		}, 'xml');

	});

    

}(document, window, jQuery));


(function (document, window, $) {

	'use strict';

	// Responsive video embeds
	var $all_oembed_videos = $("iframe[src*='youtube'], iframe[src*='vimeo']");

	$all_oembed_videos.each(function() {

		var _this = $(this);

		if (_this.parent('.embed-container').length === 0) {
		  _this.wrap('<div class="embed-container"></div>');
		}

		_this.removeAttr('height').removeAttr('width');

 	});
    

}(document, window, jQuery));


(function($) {
	
	'use strict';	
	
	// Hero Options  
	var slider_opts = {
		transitionType: 'move',
		controlNavigation:'bullets',
        controlsInside: true,
        navigateByClick: false,
		imageScaleMode: 'fill',
		imageAlignCenter:false,
		arrowsNav: true,
		arrowsNavAutoHide: false,
		sliderTouch: false,
		addActiveClass: true,
		sliderDrag:false,
		fullscreen: false,
		loop: true,
		autoHeight: true,
		slidesSpacing: 0,
		transitionSpeed: 500,
        autoScaleSlider: true, 
		autoScaleSliderWidth: 1440,     
		autoScaleSliderHeight: 536,
        
		autoPlay: {
				// autoplay options go gere
				enabled: true,
				pauseOnHover: false,
				delay: 5000
			}
	  };
          
      
    // Testimonials Options  
	var testimonials_opts = {
		transitionType: 'move',
		controlNavigation:'none',
		imageAlignCenter:false,
        navigateByClick: false,
		arrowsNav: true,
		arrowsNavAutoHide: false,
		sliderTouch: false,
		addActiveClass: true,
		sliderDrag:false,
		fullscreen: false,
		loop: true,
		autoHeight: true,
		slidesSpacing: 0,
		transitionSpeed: 500,
        
		autoPlay: {
				// autoplay options go gere
				enabled: true,
				pauseOnHover: false,
				delay: 5000
			}
	  };
      
        
    var $slider = $(".element-slideshow .royalSlider");
    $slider.royalSlider( slider_opts );
    
    if ( $slider.data('royalSlider') && $slider.data('royalSlider').numSlides <= 1 ) { 
        $slider.find('.rsNav').hide();
        $slider.find('.rsArrow').hide();
    }
    
    var $testimonials = $(".section-testimonials .royalSlider");
    $testimonials.royalSlider( testimonials_opts );
      
    if ( $testimonials.data('royalSlider') && $testimonials.data('royalSlider').numSlides <= 1 ) { 
        $testimonials.find('.rsNav').hide();
    }
    else {
        $testimonials.find('.rsArrow').appendTo('.section-testimonials .royalSlider');
    }
        
	
})(jQuery);
(function (document, window, $) {

	'use strict';
    
    var scrollnow = function(e) {
        
        var target;
                        
        // if scrollnow()-function was triggered by an event
        if (e) {
            e.preventDefault();
            target = this.hash;
        }
        // else it was called when page with a #hash was loaded
        else {
            target = location.hash;
        }

        // same page scroll
        $.smoothScroll({
            scrollTarget: target,
            beforeScroll: function() {
                
            },
            afterScroll: function() {
                 
            },
            
        });
    };

    // if page has a #hash
    if (location.hash) {
        $('html, body').scrollTop(0).show();
        // smooth-scroll to hash
        scrollnow();
    }

    // for each <a>-element that contains a "/" and a "#"
    $('a[href*="/"][href*=#]').each(function(){
        // if the pathname of the href references the same page
        if (this.pathname.replace(/^\//,'') === location.pathname.replace(/^\//,'') && this.hostname === location.hostname) {
            // only keep the hash, i.e. do not keep the pathname
            $(this).attr("href", this.hash);
        }
    });

    // select all href-elements that start with #
    // including the ones that were stripped by their pathname just above
    $('body').on('click', 'a[href^=#]:not([href=#])', scrollnow );

}(document, window, jQuery));


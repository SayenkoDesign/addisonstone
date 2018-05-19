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
    
    $('.footer-widgets .vertical.menu  .sub-menu').each( function() {
        $(this).addClass('menu vertical nested');
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
    
    
    if( $('.page-template-faq .accordion').size() ) {
        
        Isotope.Item.prototype._create = function() {
          // assign id, used for original-order sorting
          this.id = this.layout.itemGUID++;
          // transition objects
          this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
          };
          this.sortData = {};
        };
        
        Isotope.Item.prototype.layoutPosition = function() {
          this.emitEvent( 'layout', [ this ] );
        };
        
        Isotope.prototype.arrange = function( opts ) {
          // set any options pass
          this.option( opts );
          this._getIsInstant();
          // just filter
          this.filteredItems = this._filter( this.items );
          // flag for initalized
          this._isLayoutInited = true;
        };
        
        // layout mode that does not position items
        Isotope.LayoutMode.create('none');
        
        
        
        var $accordion = $('.accordion').isotope({
          itemSelector: '.accordion-item',
          layoutMode: 'none'
        });
        
        // filter items on button click
        $('.filter-button-group').on( 'click', 'button', function() {
            $('.filter-button-group button').removeClass("active");
            $(this).addClass("active");  
            var filterValue = $(this).attr('data-filter');
            $accordion.isotope({ 
                filter: filterValue
            });
        });
    }
    
    
}(document, window, jQuery));

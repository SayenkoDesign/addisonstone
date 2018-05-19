<?php
get_header(); ?>

<?php
if( ! class_exists( 'Hero_Section' ) ) {
    class Hero_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
            
            // Render the section
            $this->render();
            
            // print the section
            $this->print_element();        
        }
              
        // Add default attributes to section        
        protected function _add_render_attributes() {
            
            // use parent attributes
            parent::_add_render_attributes();
    
            $this->add_render_attribute(
                'wrapper', 'class', [
                     $this->get_name() . '-hero'
                ]
            );
        }
        
        
        // Add content
        public function render() {
                        
            $heading = get_the_title();
            
            $heading  = _s_format_string( $heading, 'h1' );
               
            return sprintf( '<div class="row align-middle"><div class="column"><div class="caption">%s</div></div></div>', $heading );
        }
    }
}
   
new Hero_Section; 
?>

<div id="primary" class="content-area">

	<?php
    // breadcrumbs
    
    breadcrumbs();
    function breadcrumbs() {
        $treatments_ID = 425;
        $term = _s_get_treatment_term();
        $title = get_the_title();  
                
        $breadcrumbs = [];
        
        $breadcrumbs[] = sprintf( '<a href="%s">%s</a>', get_permalink( $treatments_ID ), get_the_title( $treatments_ID ) ); 
        
        $breadcrumbs[] = sprintf( '<a href="%s">%s</a>', get_term_link( $term ), $term->name ); 
        
        $breadcrumbs[] = sprintf( '%s', get_the_title() ); 
        
        $out = sprintf( '%s', join( '<span> > </span>', $breadcrumbs ) );
        
        printf( '<div class="breadcrumbs"><div class="column row">%s</div></div>', $out );
    }
    ?>
    
    <main id="main" class="site-main" role="main">
	<?php    
 	page_builder();
	function page_builder() {
	
		global $post;
        
        // Cache meta, helps speed things up a little
        $meta = get_post_meta( $post->ID );
        
        $data = array();
          		
		if ( have_rows('sections') ) {
		
			while ( have_rows('sections') ) { 
			
				the_row();
                			
				$row_layout = str_replace( '_section', '', get_row_layout() );
                
                // dissalow certain sections
                if( in_array( $row_layout, array( 'projects' ) ) ) {
                    continue;
                }
                
                // Use custom template part function so we can pass data
                _s_get_template_part( 'template-parts/section', $row_layout, array( 'data' => $data ) );
  					
			} // endwhile have_rows('sections')
			
 		
		} // endif have_rows('sections')
	
	
	}
		
	?>
	</main>


</div>

<?php
get_footer();

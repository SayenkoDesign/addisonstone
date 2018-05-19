<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * @link http://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */

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
                        
            $heading = single_term_title( false, false );
            
            $heading  = _s_format_string( $heading, 'h1' );
               
            return sprintf( '<div class="row align-middle"><div class="column"><div class="caption">%s</div></div></div>', $heading );
        }
    }
}
   
new Hero_Section; 



?>


 <div id="primary" class="content-area">

    <main id="main" class="site-main" role="main">
        <?php
        
        global $wp_query;
        
        if ( have_posts() ) : ?>
               
           <?php
            while ( have_posts() ) :

                the_post();
                     
                //$title = sprintf( '<h2><a href="%s">%s</a></h2>', get_permalink(), get_the_title() );
                $title = the_title( '<h2>', '</h2>', false );
                
                $thumbnail = sprintf( '<div class="thumbnail">%s</div>',  get_the_post_thumbnail( get_the_ID(), 'large' ) );
                
                $excerpt = _s_get_the_excerpt();
                
                $button = sprintf( '<p><a href="%s" class="button blue arrow">read more</a></p>', get_permalink() );
                
                $left = ' small-order-1';
                $right = ' small-order-2';
                
                $current = $wp_query->current_post;
                
                            
                if( $wp_query->current_post % 2 == 0 ) {
                     $left = ' small-order-1 large-order-2';
                     $right = ' small-order-2 large-order-1';
                }
                
                $columns = '';
                
                $columns .= sprintf( '<div class="column column-block%s">%s</div>', $left, $thumbnail );
                
                $columns .= sprintf( '<div class="column column-block%s"><div class="entry-content">%s%s%s</div></div>', $right, $title, $excerpt, $button );
                
                printf( '<article><div class="row">%s</div></article>', $columns );
                    
            endwhile;
            
         else :

            get_template_part( 'template-parts/content', 'none' );

        endif; ?>

    </main>

</div>
  

<?php
get_footer();

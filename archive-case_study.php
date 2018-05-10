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
                        
            $heading = 'Case Studies';
            
            $heading  = _s_format_string( $heading, 'h1' );
               
            return sprintf( '<div class="row align-middle"><div class="column"><div class="caption">%s</div></div></div>', $heading );
        }
    }
}
   
new Hero_Section; 



?>

<div class="column row">

     <div id="primary" class="content-area">
    
        <main id="main" class="site-main" role="main">
            <?php
             
            if ( have_posts() ) : ?>
            
               <?php
               case_study_filters();
               ?>
    
               <div class="masonry-layout">
               
               <?php
                while ( have_posts() ) :
    
                    the_post();
                         
                    echo _case_study_item();
                        
                endwhile;
                
                echo '<div class="grid-sizer"></div>';
                ?>
                </div>
                <?php
                
             else :
    
                get_template_part( 'template-parts/content', 'none' );
    
            endif; ?>
    
        </main>
    
    </div>
  
</div>

<?php
get_footer();

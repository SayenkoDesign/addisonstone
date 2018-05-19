<?php
/*
Template Name: FAQ
*/


get_header(); ?>

<?php
get_template_part( 'template-parts/section', 'hero' );
?>

<div id="primary" class="content-area">

	<main id="main" class="site-main" role="main">
	<?php
    faq_filters();
    function faq_filters() {
	
        $taxonomies = array( 
            'faq_cat',
        );
    
        $args = array(
            'orderby'           => 'id', 
            'order'             => 'ASC',
            'hide_empty'        => true
        ); 
    
        $terms = get_terms( $taxonomies, $args );
        
        ?>
        
        <!-- Categories Filter -->
        <div class="filter-button-group">
            <div class="wrap">
            <button data-filter="*" class="active"><?php _e('All', '_s'); ?></button>
            <?php 
            foreach ( $terms as $term ) : 
                printf( '<button data-filter=".%s">%s</button>', sanitize_title( $term->name ), $term->name );
            endforeach;
            ?>
            </div>	
        </div>
        <?php
        
    }

    
    
 	// Default
	section_default();
	function section_default() {
				
		global $post;
		
		$attr = array( 'class' => 'section default' );
		
		$args = array(
            'html5'   => '<section %s>',
            'context' => 'section',
            'attr' => $attr,
        );
        
        _s_markup( $args );
        
        _s_structural_wrap( 'open' );
		
		print( '<div class="column row">' );
		            
            $loop = new WP_Query( array(
                'post_type' => 'faq',
                'order' => 'ASC',
                'orderby' => 'menu_order title',
                'posts_per_page' => -1,
              
            ) );
            
            
            if ( $loop->have_posts() ) : 
            
                $fa = new Foundation_Accordion;
                            
                while ( $loop->have_posts() ) : $loop->the_post(); 
                
                    $filters = '';
                    
                    $terms = wp_get_post_terms( get_the_ID(), 'faq_cat' );
    
                    $term_filters = [];
                    
                    if( !is_wp_error( $terms ) && !empty( $terms ) ) {
                        foreach( $terms as $term ) {
                            $term_filters[] = sanitize_title( $term->name );
                        }
                    }
                    
                    $filters = join( ' ', $term_filters );
                                          
                    $fa->add_item( get_the_title(), apply_filters( 'the_content', get_the_content() ), false, array( 'accordion_title_classes' => $filters ) );
                      
                endwhile;
                
                echo $fa->get_accordion();
                
            endif;
            wp_reset_postdata();
            
            
            
		print( '</div>' );
        
		_s_structural_wrap( 'close' );
	    echo '</section>';
	}
	?>
	</main>


</div>

<?php
get_footer();

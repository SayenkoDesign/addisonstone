<?php
/*
Template Name: Contact
*/


get_header(); ?>

<div id="primary" class="content-area">

	<main id="main" class="site-main" role="main">
	<?php
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
		
		print( '<div class="row large-unstack">' );
		
		while ( have_posts() ) :

			the_post();
            
                $map = wpgmaps_tag_pro( array( 'id' => 1 ) );
                printf( '<div class="column small-order-2 large-order-1"><div class="map-container">%s</div></div>', $map );
                
                print( '<div class="column small-order-1 large-order-2">' );
                            
                echo '<div class="entry-content">';
                
                the_content();
                
                echo '</div>';
            
            echo '</div>';
            				
		endwhile;
		
		print( '</div>' );
        
		_s_structural_wrap( 'close' );
	    echo '</section>';
	}
	?>
	</main>


</div>

<?php
get_footer();

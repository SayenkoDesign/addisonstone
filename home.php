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
// Hero
$args = array(
	'post_type'      => 'page',
	'p'				 => get_option('page_for_posts'),
	'posts_per_page' => 1,
	'post_status'    => 'publish'
);

// Use $loop, a custom variable we made up, so it doesn't overwrite anything
$loop = new WP_Query( $args );

// have_posts() is a wrapper function for $wp_query->have_posts(). Since we
// don't want to use $wp_query, use our custom variable instead.
if ( $loop->have_posts() ) : 
	while ( $loop->have_posts() ) : $loop->the_post(); 
	
		get_template_part( 'template-parts/hero', 'blog' );
 
	endwhile;
endif;

// We only need to reset the $post variable. If we overwrote $wp_query,
// we'd need to use wp_reset_query() which does both.
wp_reset_postdata();

?>

<div class="row column">

    <div id="primary" class="content-area">
    
        <main id="main" class="site-main" role="main">
            <?php 
            if( function_exists( 'facetwp_display' ) ) {
                
                $reset = "<div><button class=\"button blue-alt\" onclick=\"FWP.reset()\">Reset</button></div>";
                
                printf( '<div class="filters">%s%s%s</div>', 
                facetwp_display( 'facet', 'categories' ),
                facetwp_display( 'sort' ),
                $reset
                );
            }
            ?>

            <?php
             
            if ( have_posts() ) : ?>
                
               <?php
               echo '<div class="row small-up-1 medium-up-2 large-up-3 facetwp-template" data-equalizer data-equalize-on="medium" id="posts-grid">';
               
                while ( have_posts() ) :
    
                    the_post();
                    
                    echo '<div class="column">';
    
                    get_template_part( 'template-parts/content', 'post-column' );
                    
                    echo '</div>';
    
                endwhile;
                
                echo '</div>';
                
                if( function_exists( 'facetwp_display' ) ) {
                    echo facetwp_display( 'pager' );
                }
                else {
                    $previous = sprintf( '%s<span class="screen-reader-text">%s</span>', 
                                     get_svg( 'arrow' ), __( 'Previous Post', '_s') );
                
                    $next = sprintf( '%s<span class="screen-reader-text">%s</span>', 
                                         get_svg( 'arrow' ), __( 'Next Post', '_s') );
                    
                    the_posts_navigation( array( 'prev_text' => $previous, 'next_text' => $next ) );
                }
                
            else :
    
                get_template_part( 'template-parts/content', 'none' );
    
            endif; ?>
    
        </main>
    
    </div>

</div>
    

<?php
get_footer();

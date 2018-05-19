<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _s
 */
?>

</div><!-- #content -->

<?php
get_template_part( 'template-parts/section', 'footer-cta' );
  
?>


<div class="footer-widgets">

    <div class="wrap">
        <div class="row align-justify large-unstack">
        
            <div class="column column-block small-order-2 large-order-1">
            <?php
            $phone = get_field( 'phone', 'options' );
            if( ! empty( $phone ) ) {
                $phone_number = _s_format_telephone_url( $phone );
                printf( '<div class="widget"><a href="%s">%s</a></div>', $phone_number, $phone );
            }
            
            $locations = get_field( 'locations', 'options' );
            
            if( !empty( $locations ) ) {
                
                $fa = new Foundation_Accordion( array( 'data' => array( 'data-accordion' => 'true', 'data-allow-all-closed' => 'true' ) ) );
                
                foreach( $locations as $location ) {
                    $fa->add_item( $location['heading'], $location['details'] );
                }
                
                printf( '<div class="widget">%s</div>',  $fa->get_accordion() );
            }
            ?>
            </div>
            
            <div class="column column-block small-order-1 large-order-2">
            <?php
            if( is_active_sidebar( 'footer-2') ){
                dynamic_sidebar( 'footer-2' );
            }
            ?>
            </div>
            
            <div class="column column-block small-order-3 large-order-3">
            <?php
            if( is_active_sidebar( 'footer-3') ){
                dynamic_sidebar( 'footer-3' );
            }
            ?>
            </div>
        
        </div>
    </div>

</div>

<footer id="colophon" class="site-footer" role="contentinfo">
     <div class="wrap">
        
        <div class="column row text-center">
                
                <hr />
                
                <?php
                printf( '<p>&copy; %s Addison Stone. All rights reserved.</p>', 
                date( 'Y' ) );
                
                printf( '<p><a href="%1$s">Seattle Web Design</a> by <a href="%1$s" target="_blank">Sayenko Design</a></p>', 
                        'https://www.sayenkodesign.com' );
                
                ?>
		</div>
	</div>
    
 </footer><!-- #colophon -->

<?php 
 
wp_footer(); 
?>
</body>
</html>

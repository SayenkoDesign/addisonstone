<?php

/****************************************
	Enqueue theme stylesheet
	*****************************************/

function _s_enqueue_stylesheet() {

	$version = defined( 'THEME_VERSION' ) && THEME_VERSION ? THEME_VERSION : '1.0';
	$handle  = defined( 'THEME_NAME' ) && THEME_NAME ? sanitize_title_with_dashes( THEME_NAME ) : 'theme';

	//$stylesheet = SCRIPT_DEBUG === true ? 'style.css' : 'style.min.css';
	$stylesheet = 'style.css';

	wp_enqueue_style( $handle, trailingslashit( THEME_URL ) . $stylesheet, false, $version );
 }

add_action( 'wp_enqueue_scripts', '_s_enqueue_stylesheet', 15 );


/****************************************
	Image Sizes
	*****************************************/

add_image_size( 'hero', 1600, 999 );
add_image_size( 'quote', 500, 500, true );

// Photos copping
add_image_size( 'large-top', 1200, 1200, array( 'center', 'top' ) );
add_image_size( 'large-center', 1200, 1200, array( 'center', 'center' ) );
add_image_size( 'large-bottom', 1200, 1200, array( 'center', 'bottom' ) );
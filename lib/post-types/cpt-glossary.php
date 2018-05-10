<?php
// Query filters and template includes at bottom of page

/**
 * Create new CPT - Glossary
 */
class Glossary_CPT extends CPT_Core {

    /**
     * Register Custom Post Types. See documentation in CPT_Core, and in wp-includes/post.php
     */
    public function __construct() {

        $this->post_type = 'glossary';
		
		// Register this cpt
        // First parameter should be an array with Singular, Plural, and Registered name
        parent::__construct(
        
        	array(
				__( 'Glossary Term', '_s' ), // Singular
				__( 'Glossary', '_s' ), // Plural
				$this->post_type // Registered name/slug
			),
			array( 
				'public'             => true,
				'publicly_queryable' => true,
				'query_var'          => true,
				'capability_type'    => 'page',
				'has_archive'        => false,
				'hierarchical'       => false,
				'show_ui' 			 => true,
				'show_in_menu' 		 => true,
				'show_in_nav_menus'  => false,
				'exclude_from_search' => false,
				'rewrite' => false,
				'supports' => array( 'title', 'editor', 'revisions' ),
				 )

        );
		
		add_filter('pre_get_posts', array( $this, 'query_filter' ) );
		
		add_action( 'template_redirect', array( $this, 'redirect_single_post' ) );
     }
	 
	 
	 function query_filter($query) {
						
 	    $post_type = $query->get('post_type');
		
		if ( $query->is_main_query() && is_admin() && $post_type == 'glossary' ) {
			
			// Order By
			$query->set( 'orderby', 'title' );
			$query->set( 'order', 'ASC' );
			
		}
			
		return $query;
	}
	
	 public function redirect_single_post()
	{
		if ( ! is_singular( 'glossary' ) )
			return;
		
		global $post;
			
		$url = get_permalink( 83 ); // Glossary page
		
		$title = get_the_title();
		
		$first = strtolower( $title[0] );
		
		$hash = $first;
						
		wp_redirect( sprintf( '%s#letter-%s', $url, $hash ), 301 );
		exit;
	}
 
}

new Glossary_CPT();


$alphabet = array(
    __( 'Letter', '_s' ), // Singular
    __( 'Letters', '_s' ), // Plural
    'letter_cat' // Registered name
);

register_via_taxonomy_core( $alphabet, 
	array(
		//'rewrite' => array('slug'=> 'event-category' )
	), 
	array( 'glossary' ) 
);
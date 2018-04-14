<?php
 
/**
 * Create new CPT - Treatment
 */
 
class CPT_Treatment extends CPT_Core {

    const POST_TYPE = 'treatment';
	const TEXTDOMAIN = '_s';
	
	/**
     * Register Custom Post Types. See documentation in CPT_Core, and in wp-includes/post.php
     */
    public function __construct() {

 		
		// Register this cpt
        // First parameter should be an array with Singular, Plural, and Registered name
        parent::__construct(
        
        	array(
				__( 'Treatment', self::TEXTDOMAIN ), // Singular
				__( 'Treatments', self::TEXTDOMAIN ), // Plural
				self::POST_TYPE // Registered name/slug
			),
			array( 
				'public'              => true,
				'publicly_queryable'  => true,
				'show_ui'             => true,
				'query_var'           => true,
				'capability_type'     => 'post',
				'has_archive'         => true,
				'hierarchical'        => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => true,
				'exclude_from_search' => false,
				//'rewrite'             => array( 'slug' => 'treatments' ),
				'supports' => array( 'title', 'editor', 'thumbnail', 'revisions' ),
			)

        );
		        
     }
 
}

new CPT_Treatment();


$treatment_categories = array(
    __( 'Treatment Category', CPT_Treatment::TEXTDOMAIN ), // Singular
    __( 'Treatments Categories', CPT_Treatment::TEXTDOMAIN ), // Plural
    'treatment_cat' // Registered name
);

register_via_taxonomy_core( $treatment_categories, 
	array(
		'hierarchical' => true,
        'show_in_nav_menus'   => true,
        'rewrite' => array( 'slug' => 'treatment-category' ),
	), 
	array( CPT_Treatment::POST_TYPE ) 
);

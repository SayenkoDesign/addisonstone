<?php
 
/**
 * Create new CPT - Team
 */
 
class CPT_Team extends CPT_Core {

    const POST_TYPE = 'team';
	const TEXTDOMAIN = '_s';
	
	/**
     * Register Custom Post Types. See documentation in CPT_Core, and in wp-includes/post.php
     */
    public function __construct() {

 		
		// Register this cpt
        // First parameter should be an array with Singular, Plural, and Registered name
        parent::__construct(
        
        	array(
				__( 'Team', self::TEXTDOMAIN ), // Singular
				__( 'Team', self::TEXTDOMAIN ), // Plural
				self::POST_TYPE // Registered name/slug
			),
			array( 
				'public'              => true,
				'publicly_queryable'  => true,
				'show_ui'             => true,
				'query_var'           => true,
				'capability_type'     => 'post',
				'has_archive'         => false,
				'hierarchical'        => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => false,
				'exclude_from_search' => true,
				//'rewrite'             => array( 'slug' => 'teams' ),
				'supports' => array( 'title', 'editor', 'thumbnail', 'revisions' ),
			)

        );
		        
     }
 
}

new CPT_Team();
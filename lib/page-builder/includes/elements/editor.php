<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


class Element_Editor extends Element_Base {

	static public $count;
    
    /**
	 * Get widget name.
	 *
	 * Retrieve button widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'editor';
	}
    
	
	/**
	 * Render button widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
                                
		$fields = $this->get_fields();
                                                                
        if ( ! isset( $fields['editor'] ) || empty( $fields['editor'] ) ) {
            return;
        }
        
        $editor = $fields['editor'];
        
        $this->add_render_attribute( 'wrapper', 'class', 'element-editor' );
		$this->add_render_attribute( 'wrapper', 'class', 'entry-content' );
                                        
        return sprintf( '<div %s>%s</div>', $this->get_render_attribute_string( 'wrapper' ), $editor );
	}
    
    
    public function __construct( array $data = [], array $args = null ) {
        parent::__construct( $data );
	}
    	
}

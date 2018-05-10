<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


class Element_Button extends Element_Base {

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
		return 'button';
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
                                                                
        if ( ! isset( $fields['button'] ) || empty( $fields['button'] ) ) {
            return;
        }
        
        $button = $fields['button'];
        
		if ( ! empty( $button['url'] ) ) {
			$this->add_render_attribute( 'wrapper', 'href', $button['url'] );
		}
        
        if( 'Button' == $button['button_type'] ) {
            $this->add_render_attribute( 'wrapper', 'class', 'button' ); 
            $this->add_render_attribute( 'wrapper', 'class', 'blue' ); 
            $this->add_render_attribute( 'wrapper', 'class', 'arrow' ); 
        }
        else {
            $this->add_render_attribute( 'wrapper', 'class', 'button-link' ); 
        }
                                        
        return sprintf( '<a %s>%s</a>', $this->get_render_attribute_string( 'wrapper' ), $button['text'] );
	}
    	
}

<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


class Element_Column extends Element_Base {

	static public $count = 0;
    
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
		return 'column';
	}    
    
    /**
	 * Get default data.
	 *
	 * Retrieve the default data. Used to reset the data on initialization.
	 *
	 * @since 1.4.0
	 * @access protected
	 *
	 * @return array Default data.
	 */
	protected function get_default_data() {
		        
        $default_data = parent::get_default_data();
        
        self::$count++;
        
        return [
			'id' => self::$count,
			'settings' => [],
            'fields' => [],
		];
	}
    
    
    protected function _add_render_attributes() {
		parent::_add_render_attributes();
        
        $id = $this->get_id();

		$this->add_render_attribute(
			'wrapper', 'class', [
				'column',
                $this->get_name() . '-' . $id
			]
		);
        
        
        // Generate column classes
        $count = self::$count;
        
        $column_width = $this->get_settings( 'column_widths' );
                                
        $width = 6; // 50/50 default
        
        if( isset( $column_width ) && !empty( $column_width ) ) {
            $width = (  absint( $column_width ) / 100 ) * 12; 
        }   
                
        $this->add_render_attribute( 'wrapper', 'class', sprintf( 'small-12 large-%s', $width ) );        
    }
	
	/**
	 * Before section rendering.
	 *
	 * Used to add stuff before the section element.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function before_render() {
        return sprintf( '<div %s>', $this->get_render_attribute_string( 'wrapper' ) );
	}

	/**
	 * After section rendering.
	 *
	 * Used to add stuff after the section element.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function after_render() {
        return '</div>';
	}
    
    public function render() {}
    
    public function __construct( array $data = [], array $args = null ) {
        parent::__construct( $data );
        
        // Add default settings
        //$this->set_fields( array( 'class' => 'button', 'is_external' => '', 'nofollow' => '' ) );
	}
    	
}

<?php

/*
Hero
		
*/


if( ! class_exists( 'Hero_Section' ) ) {
    class Hero_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
                        
            $fields = get_field( 'hero' );            
            $this->set_fields( $fields );
            
            $settings = [];
            $this->set_settings( $settings );
            
            // Render the section
            $this->render();
            
            // print the section
            $this->print_element();        
        }
              
        // Add default attributes to section        
        protected function _add_render_attributes() {
            
            // use parent attributes
            parent::_add_render_attributes();
    
            $this->add_render_attribute(
                'wrapper', 'class', [
                     $this->get_name() . '-hero'
                ]
            );
        }
        
        public function before_render() {
            $this->add_render_attribute( 'wrap', 'class', 'wrap' ); 
            return sprintf( '<section %s><div %s>', $this->get_render_attribute_string( 'wrapper' ), $this->get_render_attribute_string( 'wrap' ) );
        }
        
        public function after_render() {
        
            $wave = sprintf( '<div class="wave">%s</div>', '' );
                
            return sprintf( '</div>%s</section>', $wave );
        }
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields(); 
            
            $heading = $this->get_fields( 'heading' );
            
            if( empty( $heading ) ) {
                $fields['heading'] = get_the_title();
            }
            
            //$header = new Element_Header( ['fields' => $fields ] );  
            //$header = $header->get_element();  
            
            $heading        = _s_format_string( $this->get_fields( 'heading' ), 'h1' );
            $subheading     = '';
            if( !empty( $this->get_fields( 'subheading' ) ) ) {
                $subheading = _s_format_string( sprintf( '<strong>%s</strong>', _s_wrap_string( $this->get_fields( 'subheading' ) ) ), 'h1' );
            }
            
            $description    = _s_format_string( $this->get_fields( 'description' ), 'p' );
            
            $background_image       = $this->get_fields( 'background_image' );
            $background_position_x  = $this->get_fields( 'background_position_x' );
            $background_position_y  = strtolower( $this->get_fields( 'background_position_y' ) );
            $background_overlay     = strtolower( $this->get_fields( 'background_overlay' ) );
            
            if( ! empty( $background_image ) ) {
                $background_image = _s_get_acf_image( $background_image, 'hero', true );
                $this->add_render_attribute( 'wrapper', 'class', 'hero-background' );
                
                $this->add_render_attribute( 'wrap', 'style', sprintf( 'background-image: url(%s);', $background_image ) );
                
                $this->add_render_attribute( 'wrap', 'style', sprintf( 'background-image: url(%s);', $background_image ) );
                $this->add_render_attribute( 'wrap', 'style', sprintf( 'background-position: %s %s;', 
                                                                          $background_position_x, $background_position_y ) );
                
                if( true == $background_overlay ) {
                     $this->add_render_attribute( 'wrap', 'class', 'background-overlay' ); 
                }
                                                                          
            }              
               
            return sprintf( '<div class="row align-middle"><div class="column"><div class="caption">%s%s%s</div></div></div>', $heading, $subheading, $description );
        }
    }
}
   
new Hero_Section; 
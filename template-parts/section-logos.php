<?php

/*
Logos
		
*/    
    
if( ! class_exists( 'Logos_Section' ) ) {
    class Logos_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
            
            $fields = [];
            $fields['heading'] = get_sub_field( 'logos_heading' );
            $fields['logos'] = get_sub_field( 'logos' );
            $this->set_fields( $fields );
            
            $settings = get_sub_field( 'logos_settings' );
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
                     $this->get_name() . '-logos',
                     $this->get_name() . '-logos' . '-' . $this->get_id(),
                ]
            );
        }
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields();
            
            $settings = $this->get_settings();
                        
            $heading = _s_format_string( $fields['heading'], 'h2' );
            if( !empty( $heading ) ) {
                $heading = sprintf( '<header class="column row header"><span>%s</span></header>', $heading );
            }
            
            $columns = '';
            
            $rows = $fields['logos'];
            
            if( empty( $rows ) ) {
                return false;
            }
                        
            foreach( $rows as $row ) {
                $attachment_id = $row['image'];
                $url = $row['url'];
                $image = wp_get_attachment_image( $attachment_id, 'medium' );
                $tag = 'span';
                if( !empty( $url ) ) {
                    $tag = 'a';
                    $this->add_render_attribute( 'anchor', 'href', $url, true );
                }
                $columns .= sprintf( '<div class="column column-block"><%1$s %2$s>%3$s</%1$s></div>', 
                                    $tag, 
                                    $this->get_render_attribute_string( 'anchor' ), 
                                    $image );                
            }       
               
            return sprintf( '<div class="row column">%s<div class="row small-up-1 medium-up-2 large-up-4 align-middle align-center grid">%s</div></div>', 
                            $heading, 
                            $columns );
        }
    }
}
   
new Logos_Section;

    
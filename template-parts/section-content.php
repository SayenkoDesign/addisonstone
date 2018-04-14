<?php

/*
Section - Content
		
*/

if( ! function_exists( 'section_content' ) ) {
 
    function section_content() {
                
        $output = '';
              
        $prefix = 'content';
        $prefix = set_field_prefix( $prefix );
        
        $fields = get_sub_field( sprintf( '%ssection', $prefix ) );
        
        $settings = get_sub_field( sprintf( '%ssettings', $prefix ) );
        
        // Markup attributes              
        $attributes = new Markup_Attributes( $settings );
        $attributes->set( 'class', 'section-content-block' );
        $attr = $attributes->get();
                      
        $heading 		        = $fields['heading'];
        $editor	                = $fields['editor'];
        $photo	                = $fields['photo'];
        $photo_alignment	    = strtolower( $fields['photo_alignment'] );
        $button                 = $fields['button'];
                  
        $content = '';
        
        $row_class = '';
         
        if( !empty( $photo ) ) {
            $left = ' small-order-1';
            $right = ' small-order-2';
            $attachment_id = $photo;
            $size = 'large';
            $photo = wp_get_attachment_image( $attachment_id, $size );
            
            if( 'right' == $photo_alignment ) {
                 $left = ' small-order-1 large-order-2';
                 $right = ' small-order-2 large-order-1';
            }
            
            $row_class = ' two-column';
            
            $photo = sprintf( '<div class="column column-block%s">%s</div>', $left, $photo );
        }
        
        if( !empty( $heading ) ) {
            $content .= _s_get_heading( $heading, 'h2', array( 'class' => 'text-left' ) );
        }
        
        if( !empty( $editor ) ) {
            $content .= $editor;
         }

        if( !empty( $button ) ) {
            $content .= sprintf( '<p>%s</p>', pb_get_cta_button( $button, array( 'class' => 'button blue' ) ) );
        }        
                 
        $content = sprintf( '<div class="columns%s"><div class="entry-content">%s</div></div>', $right, $content );
        
        
        $output = sprintf( '<div class="row large-unstack%s">%s%s</div>', $row_class, $photo, $content );
        
        // Do not change
                 
        _s_section( $output, $attr );
            
    }
    
}

// section_content();



if( ! class_exists( 'Content_Section' ) ) {
    class Content_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
            
            $fields = get_sub_field( 'content_section' );
            $this->set_fields( $fields );
            
            $settings = get_sub_field( 'content_settings' );
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
                     $this->get_name() . '-content',
                     $this->get_name() . '-content' . '-' . $this->get_id(),
                ]
            );
        }
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields();
            
            $settings = $this->get_settings();
                        
            // Editor
            $editor = new Element_Editor(); // set fields from Constructor
            $editor->set_fields( $fields );
            $editor = $editor->get_element();
            
            // Button
            $button = new Element_Button(); // set fields from Constructor
            $button->set_fields( $fields );
            $button = $photo->get_element();
            
            return sprintf( '<div class="column row">%s%s</div>', $editor, $button );
                                     
        }
        
    }
}
   
new Content_Section;

    
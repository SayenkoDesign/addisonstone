<?php
// Columns

if( ! class_exists( 'Staff_Section' ) ) {
    class Staff_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
            
            $fields = [];
            $fields['staff'] = get_sub_field( 'staff' );
            $this->set_fields( $fields );
                        
            $settings = get_sub_field( 'staff_settings' );
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
                     $this->get_name() . '-staff',
                     $this->get_name() . '-staff' . '-' . $this->get_id(),
                ]
            );            
            
        } 
        
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields();
            
            $settings = $this->get_settings();
            
            $rows = $this->get_fields( 'staff' );
            
            $columns = '';
            
            if( !empty( $rows ) ) {
                
                foreach( $rows as $key => $row ) {
                    
                    $post_id = $row->ID;
                                        
                    $title = sprintf( '<h3>%s</h3>', $row->post_title );
                    
                    $position = _s_format_string( get_field( 'position', $post_id ), 'p' );
                    
                    $heading = sprintf( '<header>%s%s</header>', $title, $position );
                    
                    $content = '';
                    $content = sprintf( '<div class="entry-content">%s</div>', apply_filters( 'the_content', $row->post_content ) );
                    
                    
                    $photo = get_post_thumbnail_id( $post_id );
                    if( !empty( $photo ) ) {
                        $element['photo'] = [ 'image' => $photo, 'shape' => true ];
                        $photo = new Element_Photo( [ 'fields' => $element ]  ); // set fields from Constructor
                        $photo = $photo->get_element();
                    }
                    
                    
                    
                    $columns .= sprintf( '<div class="column column-block">%s%s%s</div>', 
                                          $photo, $heading, $content );
                    
                }
            }
            
            return sprintf( '<div class="row column"><div class="row small-up-1 medium-up-2 align-center grid">%s</div></div>', 
                            $columns );
            
        }
        
    }
}
   
new Staff_Section;
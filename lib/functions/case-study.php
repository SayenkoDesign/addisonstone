<?php

function _s_case_study_template_redirect( $template ) {
    if ( is_tax( 'case_study_cat' ) ) {
		$template_found = locate_template( 'archive-case_study.php' );
        
        if( !empty( $template_found ) ) {
            $template = $template_found;
        }
    }
	return $template;
}
add_filter( 'template_include', '_s_case_study_template_redirect' );


function case_study_filters() {

	
	$taxonomies = array( 
	    'case_study_cat',
	);

	$args = array(
	    'orderby'           => 'id', 
	    'order'             => 'ASC',
	    'hide_empty'        => true
	); 

	$terms = get_terms( $taxonomies, $args );
	
	?>
	
	<!-- Categories Filter -->
	<div class="filter-button-group">
        <div class="wrap">
		<button data-filter="*"><?php _e('All', '_s'); ?></button>
		<?php 
        foreach ( $terms as $term ) : 
		    printf( '<button data-filter=".%s">%s</button>', sanitize_title( $term->name ), $term->name );
        endforeach;
		?>
		</div>	
	</div>
	<?php
	
}

function _case_study_item( $index = 0 ) {
    global $post;
    $more = sprintf( '<a href="%s" class="plus"></a>', get_permalink() );
    $thumbnail = get_the_post_thumbnail( get_the_ID(), 'case-study-thumbnail' );
    
    $title = the_title( '<h3>', '</h3>', false );
    
    $cats = _s_get_post_terms( get_the_ID() ); // do we want to remove this on the archives?
    
    $terms = wp_get_post_terms( get_the_ID(), 'case_study_cat' );
    
    $term_filters = [];
    
    if( !is_wp_error( $terms ) && !empty( $terms ) ) {
        foreach( $terms as $term ) {
            $term_filters[] = sanitize_title( $term->name );
        }
    }
    
    return sprintf( '<article id="post-%s" class="%s %s"><div class="image">%s<div class="hover"><div>%s%s%s</div></div></div></article>', 
                           get_the_ID(), join( ' ', get_post_class( 'grid-item case-study' ) ), join( ' ', $term_filters ),
                           $thumbnail, $more, $title, $cats );   
}



function _s_case_study_terms() {
 	
	$taxonomy     = 'case_study_cat';
	$orderby      = 'name'; 
	$show_count   = 0;      // 1 for yes, 0 for no
	$pad_counts   = 0;      // 1 for yes, 0 for no
	$hierarchical = 1;      // 1 for yes, 0 for no
	$title        = '';

	$args = array(
	  'echo'		 => FALSE,
	  'hide_empty'   => FALSE, 
	  'taxonomy'     => $taxonomy,
	  'orderby'      => $orderby,
	  'show_count'   => $show_count,
	  'pad_counts'   => $pad_counts,
	  'hierarchical' => $hierarchical,
	  'title_li'     => $title
	);
    
     
	return sprintf('<ul>%s</ul>', wp_list_categories( $args ) );
	
}


function _s_get_post_terms( $post_id ) {
    $taxonomy = 'case_study_cat';
    $terms = wp_get_post_terms( $post_id, $taxonomy );
    if( !is_wp_error( $terms ) && !empty( $terms ) ) {
        $out = '';
        foreach( $terms as $term ) {
            $term_class = sanitize_title( $term->name );
        $out .= sprintf( '<li><a href="%s" class="term-link %s">%s<span>%s</span></a></li>', get_term_link( $term->slug, $taxonomy ), $term_class, get_svg( $term_class ), $term->name );
        }
        
        return sprintf( '<ul class="post-categories">%s</ul>', $out );
        
    }
    
}



function _case_study_term_list() {
    
    global $post;
    
    $terms = get_the_terms( get_the_ID(), 'case_study_cat' );
                         
    if ( $terms && ! is_wp_error( $terms ) ) {
     
        $list = array();
     
        foreach ( $terms as $term ) {
            $list[] = $term->name;
        }
                             
        return join( ', ', $list );   
    }
}

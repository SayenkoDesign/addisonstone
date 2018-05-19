<?php
/*
Template Name: Glossary
*/

get_header(); ?>

<?php
// Hero
get_template_part( 'template-parts/section', 'hero' );
?>

<div id="primary" class="content-area">

	<main id="main" class="site-main" role="main">
	<?php			
	
	// Glossary
	section_glossary();
	function section_glossary() {
        
        $permalink = get_permalink();
		
		$terms = get_terms( array(
			'taxonomy' => 'letter_cat',
			'hide_empty' => true,
		) );
	
		$term_names_array = wp_list_pluck( $terms, 'name' );
					
		$loop = new WP_Query( array(
			'post_type' => 'glossary',
			'order' => 'ASC',
			'orderby' => 'title',
			'posts_per_page' => -1
		) );
		
		$letters = array();
		
		$letter_links = '';
					
		if ( $loop->have_posts() ) : 
			
			while ( $loop->have_posts() ) : $loop->the_post();	
 							
				$glossary_terms = wp_get_post_terms( get_the_ID(), 'letter_cat' );
				
				if ( !empty( $glossary_terms ) && !is_wp_error( $glossary_terms ) ) {
					
					$gt = strtolower( $glossary_terms[0]->name );
					$title = sprintf( '<h4>%s</h4>', get_the_title() );
					$content = sprintf( '<div class="entry-content">%s</div>', apply_filters( 'pb_the_content', get_the_content() ) );
                    
                    $link = '';
                    
                    if( is_user_logged_in() ) {
                        $url = sprintf( '%s#%s', $permalink, sanitize_title( $title ) );
                        $link = sprintf( '<input type="text" value="%s">', $url );
                    }
					 
					$letters[$gt][] = sprintf( '%s<div class="anchor" id="%s"></div><div class="glossary-definition">%s%s</div>', $link, sanitize_title( $title ), $title, $content );
					 
				 }
	
			endwhile; 
		endif;
			
		// Reset things, for good measure
		wp_reset_postdata();
		
		if( empty( $letters ) ) {
			return false;
		}
		
		$alphabet = range( 'A', 'Z' );
		
		foreach( $alphabet as $key ) {
			
			$link_before = $link_after  = '';
			
			if( in_array( $key, $term_names_array ) ) {
				$link_before = sprintf( '<a href="#letter-%s">', strtolower( $key) );
				$link_after = '</a>';
			}
			
			$letter_links .= sprintf( '<li>%s%s%s</li><li class="spacer"><span></span></li>', $link_before, $key, $link_after );
		}
		
 		$letter_links = sprintf( '<ul class="alphabet">%s</ul>', $letter_links );
		
		$attr = array( 'class' => 'section section-glossary-terms' );
		_s_section_open( $attr );
		
			printf( '<div class="column row"><div class="entry-content">%s</div></div>', $letter_links );
			
			print( '<div class="column row">' );
			
			foreach( $terms as $term ) {
				
				$id = strtolower( $term->name );
				
				if( isset( $letters[$id] ) && !empty( $letters[$id] ) ) {
					
					printf( '<div id="letter-%s" class="glossary-term"><h3>%s</h3></div>', $id, $term->name );
					
					foreach( $letters[$id] as $def ) {
						echo $def;	
					}
				}
			}
		
			echo '</div>';
		_s_section_close();	
	}
	
	/**
	* Get posts and group by taxonomy terms.
	* @param string $posts Post type to get.
	* @param string $terms Taxonomy to group by.
	* @param integer $count How many post to show per taxonomy term.
	*/
	function list_glossary_terms_by_letter( $posts, $terms, $count = -1 ) {
	$tax_terms = get_terms( $terms, 'orderby=name');
	foreach ( $tax_terms as $term ) {
	echo '<h2>' . $term->name . '</h2> <ul>';
	
		$args = array(
		'posts_per_page' => $count,
		 $terms => $term->slug,
		'post_type' => $posts,
		 );
		$tax_terms_posts = get_posts( $args );
		foreach ( $tax_terms_posts as $post ) {
			echo '<li><a href="' . get_permalink( $post->ID ) . '">' . $post->post_title . '</a></li>';
		}
	echo '</ul>';
	}
	wp_reset_postdata();
	}
	
	?>
	</main>


</div>

<?php
get_footer();

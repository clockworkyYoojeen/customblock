<?php

/*
  Plugin Name: Posts from Categories
  Version: 1.0
  Author: Yoojeen
  Author URI: https://wordpress.org
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class StartBoilerplate {
  function __construct() {
    add_action('init', array($this, 'onInit'));
    add_action('rest_api_init', array($this, 'yoojeen_route'));
  }
  function yoojeen_route(){
    register_rest_route('ybc/v1', 'my-route/(?P<cat_id>\d+)', array(
      'methods' => 'GET',
      'callback' => array($this, 'myfunc')
    ));
  }

  function myfunc($request){
    $cat_id = $request['cat_id'];
    $args = array('post_type' => 'post', 'category' => $cat_id);
    $posts = get_posts($args);
    $results = array();
    // check posts array!
    if($posts){
      foreach($posts as $key => $obj){
        $results[$key]['post_title'] = $obj->post_title;
        $results[$key]['post_url'] = $obj->guid;
        }
    }
    return $results;
  }


  function onInit() {
    wp_register_script('editorjs', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'));
    wp_register_style('editorcss', plugin_dir_url(__FILE__) . 'build/index.css');

    // prepare some COMMON data for frontend
    $categories = get_categories();
    $cat_result = array();

    // check categories array!
    if(count($categories)){
      foreach($categories as $key => $obj){
        $cat_result[$key]['cat_name'] = $obj->name; 
        $cat_result[$key]['cat_id'] = $obj->term_id; 
    }
    }
    // pass some COMMON variables to the frontend
    wp_localize_script('editorjs', 'catinfo', $cat_result);
  
    register_block_type('ybc/yoojeenblock', array(
      'render_callback' => array($this, 'renderCallback'),
      'editor_script' => 'editorjs',
      'editor_style' => 'editorcss'
    ));
  }

  function renderCallback($attributes) {
      wp_enqueue_script('frontendjs', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element', 'wp-components'));
      wp_enqueue_style('frontendcss', plugin_dir_url(__FILE__) . 'build/frontend.css');
    ob_start(); ?>
    <div class="boilerplate-update-me"><pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre></div>
    <?php return ob_get_clean();
    
  }
}

$startBoilerplate = new StartBoilerplate();
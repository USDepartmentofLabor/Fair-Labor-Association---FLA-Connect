<?php

/**
 * @file
 * RESTful web services module integration for views.
 */

/**
 * Controller for entity-bases resources.
 */
class ViewsResourceController implements RestWSResourceControllerInterface {

  public $view_name;

  public function __construct($name, $info) {
    $view_name = $info['view_name'];
    $this->view_name = $view_name;
  }
  
  /**
   * Returns the property info for the given resource.
   *
   * @return array
   *   An array structured as hook_entity_property_info() is structured for an
   *   entity type.
   */
  public function propertyInfo() {
    
  }

  /**
   * Returns a metadata wrapper for the resource with the given id.
   *
   * @return array
   *   
   */
  public function wrapper($display_id) {
    $view_name = $this->view_name;

    $view = views_get_view($view_name);
    
    //If display doesn't exists
    if (!in_array($display_id, array_keys($view->display))) {
      throw new RestWSException('The display: ' . $display_id . ' doesn\'t exists.', 404);
    }
    
    $args = isset($_GET['args']) ? $_GET['args'] : array();
    $filters = isset($_GET['filters']) ? $_GET['filters'] : array();

    $view->set_display($display_id);
    $view->set_arguments($args);
    $view->exposed_data = $filters;
    $view->set_exposed_input($filters);
    $view->pre_execute();
    $view->execute($display_id);
    
    return $view;
  }

  /**
   * Create a new resource.
   *
   * @param array $values
   *   Array of values for properties of the resource, keyed by property
   *   name. At least for all required properties values have to be given.
   *
   * @return int|string
   *   The id of the newly created resource.
   */
  public function create(array $values) {
    
  }

  /**
   * Returns an existing resource.
   *
   * @param int|string $id
   *   The id of the resource that should be returned.
   *
   * @return
   *   The internal representation of the resource.
   */
  public function read($id) {
    
  }

  /**
   * Update an existing resource.
   *
   * @param int|string $id
   *   The id of the resource that should be updated.
   * @param array $values
   *   An array of values for the properties to be updated, keyed by property
   *   name.
   */
  public function update($id, array $values) {
    
  }

  /**
   * Delete an existing resource.
   *
   * @param int|string $id
   *   The id of the resource that should be deleted.
   */
  public function delete($id) {
    
  }

  /**
   * Determines access for a given operation and resource.
   *
   * @param string $op
   *   Either 'create', 'view' (= read), 'update' or 'delete'.
   * @param int|string $id
   *   The id of the resource.
   *
   * @see entity_access()
   */
  public function access($op, $id) {
    return TRUE;
  }

  /**
   * Returns the name of the resource.
   */
  public function resource() {
    
  }
}

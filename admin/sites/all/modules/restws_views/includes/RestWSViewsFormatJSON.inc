<?php

/**
 * @file
 * RESTful web services module integration for views.
 */
class RestWSViewsFormatJSON extends RestWSFormatJSON {

  public function viewResource($resourceController, $display_id) {
    $values = $this->getData($resourceController->wrapper($display_id));

    return $this->serialize($values);
  }

  public function getData($view) {
    $values = array();

    foreach ($view->result as $index => $row) {
      $new_item = new stdClass();
      foreach ($view->field as $field_key => $field) {
        if (isset($row->{$field->field_alias})) {
          if (!empty($field->options['label']) && preg_match('/^[0-9a-z_-]*$/', $field->options['label'])) {
            $new_item->{$field->options['label']} = $row->{$field->field_alias};
          }
          else {
            $new_item->{$field->field_alias} = $row->{$field->field_alias};
          }
        }

        $f_key = 'field_' . $field_key;
        if (isset($row->$f_key)) {
          $target_key = $field_key;

          if (isset($field->options['exclude']) && $field->options['exclude'] == TRUE) {
            continue;
          }

          if (isset($field->options['label']) && !empty($field->options['label'])) {
            $target_key = $field->options['label'];
          }

          $new_item->$target_key = array();
          $obj = &$new_item->$target_key;

          foreach ($row->$f_key as $idx => $res) {

            if (isset($res['rendered'])) {
              $data = $res['rendered'];

              if (isset($data['#access']) && $data['#access'] == TRUE) {
                $obj[$idx] = render($data);
              }
              else {
                $obj[$idx] = array('error' => t('Access denied or format unknown on field.'));
              }
            }
          }

          if ($field->field_info['cardinality'] == 1 && count($obj) == 1) {
            $obj = $obj[$idx];
          }
        }
      }

      if (!empty($new_item)) {
        $values[] = $new_item;
      }
    }

    return $values;
  }

}

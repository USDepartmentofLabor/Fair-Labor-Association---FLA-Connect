<?php

/**
 * @file
 * RESTful web services module integration for views.
 */
class RestWSViewsFormatXML extends RestWSViewsFormatJSON {

  public function viewResource($resourceController, $display_id) {
    $values = $this->getData($resourceController->wrapper($display_id));

    $doc = new DOMDocument('1.0', 'utf-8');
    $root = $doc->createElement('view');
    $doc->appendChild($root);

    $this->xmlRecursive($doc, $root, $values);

    return $doc->saveXML();
  }

  private function xmlRecursive(&$doc, &$parent, $data) {
    if (is_object($data)) {
      $data = get_object_vars($data);
    }

    if (is_array($data)) {
      $assoc = FALSE || empty($data);
      foreach ($data as $key => $value) {
        if (is_numeric($key)) {
          $key = 'item';
        }
        else {
          $assoc = TRUE;
          $key = preg_replace('/[^A-Za-z0-9_]/', '_', $key);
          $key = preg_replace('/^([0-9]+)/', '_$1', $key);
        }
        $element = $doc->createElement($key);
        $parent->appendChild($element);
        $this->xmlRecursive($doc, $element, $value);
      }

      if (!$assoc) {
        $parent->setAttribute('is_array', 'true');
      }
    }
    elseif ($data !== NULL) {
      $parent->appendChild($doc->createTextNode($data));
    }
  }

}

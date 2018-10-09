<?php

function firebase_admin_settings($form) {
  $form['firebase_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Firebase Settings'),
    '#collapsible' => FALSE,
  );
  $form['firebase_settings']['firebase_url'] = array(
    '#type' => 'textfield',
    '#title' => t('Firebase URL'),
    '#description' => t('Your firebase URL under which all data should be stored. For example "http://yourcompany.firebase.com/yoursite.com/drupal"'),
    '#default_value' => variable_get('firebase_url'),
  );
  $form['firebase_settings']['firebase_secret'] = array(
    '#type' => 'textfield',
    '#title' => t('Database Secret'),
    '#description' => t('Database auth token.'),
    '#default_value' => variable_get('firebase_secret'),
  );

  $form['firebase_entity_types'] = array(
    '#type' => 'fieldset',
    '#title' => t('Firebase Entities'),
    '#collapsible' => FALSE,
  );
  // Get entity specific settings
  foreach (entity_get_info() as $entity_type => $entity_info) {
    $view_options = array('<none>' => '- None - ');
    if (!empty($entity_info['view modes'])) {
      //kpr($entity_info['view modes']);
      foreach ($entity_info['view modes'] as $view_key => $view_mode) {
        $view_options[$view_key] = $view_mode['label'];
      }

      $form['firebase_entity_types']['firebase_view_mode_' . $entity_type] = array(
        '#type' => 'select',
        '#title' => $entity_info['label'],
        '#description' => t($entity_info['label'] . ' view mode to use with Firebase.'),
        '#options' => $view_options,
        '#default_value' => variable_get('firebase_view_mode_' . $entity_type,  '<none>'),
      );
    }
  }

  
  $form = system_settings_form($form);
  return $form;
}

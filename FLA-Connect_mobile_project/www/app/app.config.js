;
(function () {
  'use strict';


  angular
  .module('flaMobileApp.config', ['d7-services.commons.configurations', 'd7-services.commons.http.configurations'])
  .config(configFunction);

  configFunction.$inject = ['DrupalApiConstant'];

  /** @ngInject */
  function configFunction(DrupalApiConstant) {
    //drupal services configurations
    DrupalApiConstant.drupal_instance = 'http://fla.heartproject.io/admin/';
    DrupalApiConstant.api_endpoint += '';
  }

})();
(function() {
  "use strict";

  angular
    .module("flaMobileApp.giris.controller", ["ngStorage"])
    .controller("GirisController", GirisController);

  GirisController.$inject = [
    "$scope",
    "$state",
    "$ionicModal",
    "$localStorage",
    "$ionicSideMenuDelegate",
    "DrupalHelperService",
    "$http",
    "$sce"
  ];

  /** @ngInject */
  function GirisController(
    $scope,
    $state,
    $ionicModal,
    $localStorage,
    $ionicSideMenuDelegate,
    DrupalHelperService,
    $http,
    $sce
  ) {
    // jshint validthis: true
    var vm = this;
    $scope.translate = $language.translate;

    vm.options = {
      loop: false,
      effect: "fade",
      speed: 500
    };

    $ionicModal
      .fromTemplateUrl("templates/modal-video.html", {
        scope: $scope
      })
      .then(function(modalVideo) {
        $scope.modalVideo = modalVideo;
      });

    $ionicModal
      .fromTemplateUrl("templates/modal.html", {
        scope: $scope
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    init();

    function init() {
      $scope.$on("$ionicView.enter", function() {
        $ionicSideMenuDelegate.canDragContent(false);
      });
      $scope.$on("$ionicView.leave", function() {
        $ionicSideMenuDelegate.canDragContent(true);
      });
    }
  }
})();

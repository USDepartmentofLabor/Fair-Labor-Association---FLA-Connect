(function() {
  "use strict";

  angular
    .module("flaMobileApp.app.controller", [])
    .controller("AppController", AppController);

  AppController.$inject = [
    "$scope",
    "$state",
    "$ionicModal",
    "$ionicSideMenuDelegate",
    "AuthenticationServiceConstant",
    "AuthenticationService",
    "$ionicLoading",
    "$timeout",
    "$ionicHistory",
    "UserResource"
  ];

  /** @ngInject */
  function AppController(
    $scope,
    $state,
    $ionicModal,
    $ionicSideMenuDelegate,
    AuthenticationServiceConstant,
    AuthenticationService,
    $ionicLoading,
    $timeout,
    $ionicHistory,
    UserResource
  ) {
    // jshint validthis: true
    var vm = this;
    $scope.translate = $language.translate;
    vm.$state = $state;
    vm.accessLevels = AuthenticationServiceConstant.accessLevels;
    vm.loggingOut = false;

    vm.resetForm = resetForm;
    vm.doLogout = doLogout;
    //vm.currentUser = AuthenticationService.getCurrentUser();
    // $scope.goBack = function() {
    //   console.log('Going back');
    //   $ionicHistory.goBack();
    // }

    $ionicHistory.nextViewOptions({
      disableAnimate: false,
      disableBack: false
    });

    function resetForm(form) {
      form.$setPristine();
      form.$setUntouched();
    }

    function doLogout() {
      vm.loggingOut = true;

      AuthenticationService.logout()
        .then(function(data) {
          $ionicSideMenuDelegate.toggleLeft();
          vm.$state.go("app.login");
        })
        .finally(function() {
          vm.loggingOut = false;
        });
    }

    $scope.goToProfilePage = function() {
      var currentUser = AuthenticationService.getCurrentUser();
      console.log(currentUser);
      if (currentUser && currentUser.uid > 0) {
        $state.go("app.profile");
      } else {
        $state.go("app.register");
      }
    };
  }
})();

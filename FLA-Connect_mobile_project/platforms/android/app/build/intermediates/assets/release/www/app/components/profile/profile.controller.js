(function() {
  "use strict";

  angular
    .module("flaMobileApp.profile.controller", ["flaMobileApp.profile.service"])
    .controller("ProfileController", ProfileController);

  ProfileController.$inject = ["$scope", "$state", "ProfileService"];

  function ProfileController($scope, $state, ProfileService) {
    var vm = this;
    vm.isLoading = true;
    $scope.translate = $language.translate;
    $scope.$on("$ionicView.enter", function() {
      ProfileService.getProfile()
        .then(function(profile) {
          console.log(profile);
          profile.createdon = moment(profile.created * 1000).format(
            "D.MM.YYYY"
          );
          angular.extend(vm, profile);
        })
        .finally(function() {
          vm.isLoading = false;
        });
    });

    $scope.logOut = function() {
      ProfileService.logOut();
      $state.go("app.giris");
    };
    ////////////////
  }
})();

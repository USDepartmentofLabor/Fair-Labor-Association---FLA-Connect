(function() {
  "use strict";

  angular
    .module("flaMobileApp.login.controller", [
      "ngMessages",
      "commons.validation.setValidAfterChange"
    ])
    .controller("LoginController", LoginController);

  LoginController.$inject = ["$scope", "AuthenticationService", "UserResource"];
  function LoginController($scope, AuthenticationService, UserResource) {
    // jshint validthis: true
    var vm = this;
    $scope.translate = $language.translate;
    vm.serverErrors = [];

    //data for vm.loginForm
    vm.loginData = {
      username: "",
      password: "123456"
    };

    vm.forgetPassData = {
      username: "",
      mail: ""
    };

    vm.loginIsPending = false;

    vm.doLogin = doLogin;
    vm.goToRegister = goToRegister;
    vm.doForgetPassword = doForgetPassword;
    ///////////////

    function doForgetPassword() {
      console.log(UserResource.requestNewPassword);
      UserResource.requestNewPassword({uid:98,name:'test.test04',mail:'mail@mail.com'})
        .success(function(data) {
          console.log(data);
        })
        .catch(function(error) {
          console.log(error);
          //defer.reject(error);
        });
      // console.log(
      //   UserResource.index({
      //     param: {
      //       page: 0,
      //       pagesize: 0,
      //       fields: ""
      //     }
      //   })
      // );
    }

    function goToRegister() {
      $scope.app.resetForm(vm.loginForm);
      $scope.app.$state.go("app.register");
    }

    function doLogin() {
      if (vm.loginForm.$valid) {
        vm.loginIsPending = true;
        vm.serverErrors = [];

        AuthenticationService.login(vm.loginData)
          .then(
            function(data) {
              $scope.app.resetForm(vm.loginForm);
              $scope.app.$state.go("app.giris");
            },
            //error
            function(errorResult) {
              if (errorResult.status >= 400 && errorResult.status < 500) {
                vm.serverErrors.push(errorResult.data[0]);
              } else {
                vm.serverErrors.push(errorResult.statusText);
              }
            }
          )
          .finally(function() {
            vm.loginIsPending = false;
          });
      }
    }
  }
})();

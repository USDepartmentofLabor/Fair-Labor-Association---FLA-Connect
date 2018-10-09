(function() {
  "use strict";

  angular
    .module("flaMobileApp.complaint.controller", [
      "commons.validation.setValidAfterChange",
      "ngStorage",
      "ngMessages"
    ])
    .controller("ComplaintController", ComplaintController);

  ComplaintController.$inject = [
    "$scope",
    "$localStorage",
    "$ionicSideMenuDelegate",
    "$ionicSlideBoxDelegate",
    "NodeResource",
    "DrupalApiConstant",
    "NodeResourceConstant",
    "BaseResource",
    "NodeChannel"
  ];
  // ['$scope', '$localStorage','$ionicSideMenuDelegate', '$ionicSlideBoxDelegate'];
  /** @ngInject */
  function ComplaintController(
    $scope,
    $localStorage,
    $ionicSideMenuDelegate,
    $ionicSlideBoxDelegate,
    NodeResource,
    DrupalApiConstant,
    NodeResourceConstant,
    BaseResource,
    NodeChannel,
    $ionicPopup
  ) {
    // jshint validthis: true
    var vm = this;
    $scope.translate = $language.translate;
    vm.serverErrors = [];

    vm.complaintIsPending = false;

    vm.resetForm = resetForm;
    vm.showSuccess = false;

    ///////////////////////

    function resetForm(form) {
      form.$setPristine();
      form.$setUntouched();
    }

    vm.complaintData = {
      title: ""
    };

    vm.doComplaint = doComplaint;

    $scope.activeIndex = "0";

    vm.options = {
      initialSlide: 0,
      loop: false,
      speed: 500,
      effect: "slide",
      onSlideChangeStart: function(swiper) {
        $scope.activeIndex = swiper.activeIndex;
        console.log($scope.activeIndex);
      }
    };

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
      if ($scope.activeIndex > 0) {
        return true;
      }
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
      $scope.activeIndex = data.slider.activeIndex;
      $scope.previousIndex = data.slider.previousIndex;
    });

    $scope.next = function() {
      $scope.slider.slideNext();
    };

    $scope.prev = function() {
      $scope.slider.slidePrev();
    };

    $scope.prev = function() {
      $scope.slider.slidePrev();
    };

    function doComplaint($scope, complaintData, complaintForm, response, data) {
      var title = vm.complaintData.title;
      var name = vm.complaintData.name;
      var number = vm.complaintData.number;
      var email = vm.complaintData.email;
      var date = vm.complaintData.date;
      var who = vm.complaintData.who;
      var phone = vm.complaintData.phone;
      // var il = vm.complaintData.il
      // var ilce = vm.complaintData.ilce
      var koy = vm.complaintData.koy;
      var title = vm.complaintData.title;
      var description = vm.complaintData.description;

      if (
        koy == "Küçükkarasu" ||
        koy == "Aziziye" ||
        koy == "Kuzuluk" ||
        koy == "Resuller" ||
        koy == "Küçükboğaz" ||
        koy == "Taşlıgeçit" ||
        koy == "Kızılcık"
      ) {
        var il = "Sakarya";
        var ilce = "Karasu";
        var organization = ["53"];
      } else if (
        koy == "Beyören" ||
        koy == "Melenağzı" ||
        koy == "Balatlı" ||
        koy == "Demiraçma" ||
        koy == "Altunçay"
      ) {
        var il = "Düzce";
        var ilce = "Akçakoca";
        var organization = ["49"];
      }

      var createPath =
          DrupalApiConstant.drupal_instance +
          DrupalApiConstant.api_endpoint +
          NodeResourceConstant.resourcePath,
        complaintData = {
          type: "pmissue",
          title: title,
          field_ad_soyad: {
            und: [
              {
                value: name
              }
            ]
          },
          field_telefon_numarasi_text: {
            und: [
              {
                value: number
              }
            ]
          },
          field_e_posta_adresi: {
            und: [
              {
                email: email
              }
            ]
          },
          field_tarih: {
            und: [
              {
                value: date
              }
            ]
          },
          field_calisilan_il: {
            und: [
              {
                value: il
              }
            ]
          },
          field_calisilan_ilce: {
            und: [
              {
                value: ilce
              }
            ]
          },
          pmproject_parent: {
            und: organization
          },
          field_calisilan_koy: {
            und: [
              {
                value: koy
              }
            ]
          },
          field_sikayet_kisi: {
            und: [
              {
                value: who
              }
            ]
          },
          body: {
            und: [
              {
                value: description
              }
            ]
          }
        };

      if (vm.complaintForm.$valid) {
        vm.complaintIsPending = true;
        vm.serverErrors = [];
        return BaseResource.create(
          complaintData,
          createPath,
          NodeChannel.pubCreateConfirmed,
          NodeChannel.pubCreateFailed
        )
          .then(
            function(data) {
              resetForm(vm.complaintForm);
              vm.showSuccess = true;
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
            vm.complaintIsPending = false;
          });
      }
    }
  }
})();

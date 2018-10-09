;
(function () {
  'use strict';


  angular
    .module('flaMobileApp.tour.controller', ['ngStorage'])
    .controller('TourController', TourController);

  TourController.$inject = ['$scope', '$localStorage', '$ionicSideMenuDelegate', '$ionicSlideBoxDelegate'];

  /** @ngInject */
  function TourController($scope, $localStorage, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {

    // jshint validthis: true
    var vm = this;
    $scope.translate = $language.translate;
    $scope.activeIndex = '0';

    vm.options = {
      initialSlide: 0,
      loop: false,
      speed: 500,
      effect: 'slide',
      onSlideChangeStart: function (swiper) {
        $scope.activeIndex = swiper.activeIndex;
        console.log($scope.activeIndex);
       
      }
    }


    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {

      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
      if ($scope.activeIndex > 0) {
        return true;
      }
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
      // note: the indexes are 0-based
      $scope.activeIndex = data.slider.activeIndex;
      $scope.previousIndex = data.slider.previousIndex;

    });

    $scope.next = function () {
      $scope.slider.slideNext();
    };

    $scope.prev = function () {
      $scope.slider.slidePrev();
    };

    $scope.prev = function () {
      $scope.slider.slidePrev();
    };

    function start() {
      $localStorage.firstVisit = true;
    }


  };

})();
(function () {
	'use strict';


	angular
	.module('flaMobileApp.support.controller', ['ngStorage'])
	.controller('SupportController', SupportController);
	SupportController.$inject = ['$scope', '$state', '$localStorage', '$timeout'];

	function SupportController($scope, $ionicModal, $ionicNavBarDelegate, $timeout) {
$scope.translate = $language.translate;

		
		$scope.$watch('$viewContentLoaded', function(){

		});

	};

})();

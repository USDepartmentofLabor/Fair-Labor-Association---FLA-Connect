(function () {
	'use strict';


	angular
	.module('flaMobileApp.rights.controller', ['ngStorage'])
	.controller('RightsController', RightsController);

	RightsController.$inject = ['$scope', '$ionicModal', '$state', '$localStorage', '$timeout'];

	function RightsController($scope, $ionicModal, $lcalStorage, $ionicNavBarDelegate, $timeout) {
		$scope.translate = $language.translate;
	};

})();

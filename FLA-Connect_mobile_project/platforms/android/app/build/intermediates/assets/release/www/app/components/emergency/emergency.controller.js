(function () {
	'use strict';


	angular
	.module('flaMobileApp.livechat.controller', ['ngStorage'])
	.controller('LivechatController', LivechatController);

	function LivechatController($scope, $ionicModal, $ionicNavBarDelegate, $timeout) {

$scope.translate = $language.translate;
		$scope.openModal = function() {
			$scope.modal.show();
		};

		$ionicModal.fromTemplateUrl('templates/modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
		});

		$timeout(function(){
			$scope.openModal();
		});

		$timeout(function(){
			$scope.modal.hide();
		}, 5000);




		$ionicNavBarDelegate.showBackButton(true)
		$scope.$watch('$viewContentLoaded', function(){
			
			// $scope.modal = true;
			// $scope.loginAlertMessage = false;
			// $timeout(function() {
			// 	$scope.loginAlertMessage = true;
			// 	// $scope.modal.show = false;
			// }, 3000);
			// console.log("now")
			// $scope.modal.show = false;


		});

	};

})();

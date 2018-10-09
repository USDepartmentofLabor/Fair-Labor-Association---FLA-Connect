;
(function () {
    'use strict';


    angular
        .module('flaMobileApp.language.controller', ['ngStorage'])
        .controller('LanguageController', LanguageController);

   LanguageController.$inject = ['$scope', '$http','$q'];

     /** @ngInject */
     function LanguageController($scope, $http, $q) {
       // jshint validthis: true

            var vm = this;
            var platform = 'android';

            var postUrl = "http://fla.heartproject.io/admin/api/push_notifications/";
            var token = localStorage.getItem('token');
            var deleteToken = function(token) {
              var deleteUrl = postUrl + token;
              var deferred = $q.defer();
              var promise = deferred.promise;
              $http({
                method: "DELETE",
                url: deleteUrl,
                data: {}
              }).then(
                function successCallback(response) {
                  deferred.resolve(response);
                },
                function errorCallback(response) {
                  deferred.reject(response);
                }
              );

              promise.success = function(fn) {
                promise.then(fn);
                return promise;
              };
              promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
              };
              return promise;
            };

var postToken = function (payload) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    method: 'POST',
                    url: postUrl,
                    data: payload
                }).then(function successCallback(response) {
                    deferred.resolve(response);
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {

                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }

        $scope.translate = $language.translate;

        var selectedLanguage = window.localStorage['language'];
        if (selectedLanguage == null) {
            selectedLanguage = 'en';
            window.localStorage['language'] = selectedPeriod;
        }

        $scope.selectedLanguage = selectedLanguage;

        $scope.serverSideList = [
            { text: $scope.translate('English'), value: 'en' },
            { text: $scope.translate('Turkish'), value: 'tr' },
        ];
        $scope.serverSideChange = function (item) {
            window.localStorage['language'] = item.value;
            $language.dictionary = window[item.value];
            window.location.reload();
            deleteToken(token);
            console.log('token deleted after language change')
            var param = { token: token, type: platform, language: isLangSelected };
            postToken(param).success(function (params) {
                        console.log('token posted after language change');
                    }).error(function name(params) {
                        console.log('token post failed with new language');
                        
                     //   alert($language.translate('Please close and reopen FLA Connect for changes to take effect.'));
                    });

        };

    };

})();

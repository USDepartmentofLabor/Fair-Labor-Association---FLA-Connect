(function() {
  "use strict";

  angular
    .module("flaMobileApp", [
      "ionic",
      "ngCordova",
      "d7-services",
      "flaMobileApp.config",
      "flaMobileApp.routes",
      "ionic-material",
      "ionic.wizard",
      "ngAnimate"
    ])
    .run(runFunction);

  runFunction.$inject = ["$ionicPlatform", "$http", "$q"];

  /** @ngInject */
  function runFunction($ionicPlatform, $http, $q) {
    $ionicPlatform.ready(function() {
      console.log("started");
      document.addEventListener(
        "resume",
        function() {
          console.log("resume"); // Fired sometimes and that too after few seconds of ready console.
        },
        false
      );

      document.addEventListener(
        "pause",
        function() {
          console.log("pause"); // This works. Prints all time when I close that app or switch to different app.
        },
        false
      );

      var platform = "android";
      var isLangSelected = window.localStorage["language"];
      //var isIPad = ionic.Platform.isIPad();
      //var isIOS = ionic.Platform.isIOS();
      //var isAndroid = ionic.Platform.isAndroid();

      //if (isIPad || isIOS) {
      //	platform = 'android';
      //} else if (isAndroid) {
      //	platform = 'android';
      //}

      var postUrl = "http://fla.heartproject.io/admin/api/push_notifications/";

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

      var postToken = function(payload) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http({
          method: "POST",
          url: postUrl,
          data: payload
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

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(false);

        StatusBar.overlaysWebView(false);
        StatusBar.styleLightContent();
        StatusBar.backgroundColorByHexString("#102027");
      }
      if (window.StatusBar) {
        StatusBar.styleBlackTranslucent();
      }
      if (window.FirebasePlugin) {
        window.FirebasePlugin.grantPermission();
        //	window.FirebasePlugin.getToken(function (token) {
        //		console.log(token);
        //		var param = { token: token, type: platform, language: isLangSelected };
        //		postToken(param).success(function (params) {
        //			console.log('firebase-token sending');
        //		}).error(function name(params) {
        //			console.log('error0');
        //		});
        //	}, function (error) {
        //		console.log('error1');
        //	});
        window.FirebasePlugin.onTokenRefresh(
          function(token) {
            console.log(token);
            localStorage.setItem("token", token);
            var param = {
              token: token,
              type: platform,
              language: isLangSelected
            };
            deleteToken(token);
            postToken(param)
              .success(function(params) {
                console.log("firebase-token refresh");
              })
              .error(function name(params) {
                console.log("firebase-token refresh failed");
              });
          },
          function(error) {
            console.log("error1");
          }
        );
        window.FirebasePlugin.onNotificationOpen(function(data) {
          localStorage.setItem("pushdata", JSON.stringify(data));
          console.log("notification saved2");
          var target = JSON.parse(localStorage.getItem("pushdata"));
          if (data.wasTapped) {
            //Notification was received on device tray and tapped by the user.

            window.location.href = target.url;
            window.FirebasePlugin.setBadgeNumber(0);
          } else {
            //Notification was received in foreground. Maybe the user needs to be notified.

            //alert("Not tapped");
            window.location.href = target.url;
            window.FirebasePlugin.setBadgeNumber(0);
          }
        });
      }
    });
    $ionicPlatform.on("resume", function(event) {
      console.log("resuming...");

      window.FirebasePlugin.onNotificationOpen(function(data) {
        localStorage.getItem("push_data");
        var target = JSON.parse(localStorage.getItem("pushdata"));
        if (data.wasTapped) {
          //Notification was received on device tray and tapped by the user.
          window.location.href = target.url;
          window.FirebasePlugin.setBadgeNumber(0);
        } else {
          //Notification was received in foreground. Maybe the user needs to be notified.
          //alert("Not tapped");
          window.location.href = target.url;
          window.FirebasePlugin.setBadgeNumber(0);
        }
      });
    });
  }
})();

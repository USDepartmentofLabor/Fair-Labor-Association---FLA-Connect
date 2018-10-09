(function() {
  "use strict";

  angular
    .module("flaMobileApp.routes", [
      "ngStorage",
      "ngAnimate",
      "flaMobileApp.app.controller",
      "flaMobileApp.tour.controller",
      "flaMobileApp.giris.controller",
      "flaMobileApp.rights.controller",
      "flaMobileApp.register.controller",
      "flaMobileApp.complaint.controller",
      "flaMobileApp.login.controller",
      "flaMobileApp.profile.controller",
      "flaMobileApp.articleFeed.controller",
      "flaMobileApp.blog.controller",
      "flaMobileApp.blog.blogDetail.controller",
      "flaMobileApp.blog.service",
      "flaMobileApp.support.controller",
      "flaMobileApp.livechat.controller",
      "flaMobileApp.pollPage.controller",
      "flaMobileApp.pollPage.service",
      "flaMobileApp.articleFeed.articleDetail.controller",
      "flaMobileApp.articleFeed.service",
      "flaMobileApp.language.controller"
    ])
    .config(configFunction)
    .run(runFunction);

  configFunction.$inject = [
    "$stateProvider",
    "$urlRouterProvider",
    "$localStorageProvider",
    "AuthenticationServiceConstant",
    "$ionicConfigProvider",
    "$sceDelegateProvider"
  ];

  /** @ngInject */
  function configFunction(
    $stateProvider,
    $urlRouterProvider,
    $localStorageProvider,
    AuthenticationServiceConstant,
    $ionicConfigProvider,
    $sceDelegateProvider
  ) {
    $sceDelegateProvider.resourceUrlWhitelist([
      "self",
      new RegExp("^(http[s]?)://(w{3}.)?youtube.com/.+$")
    ]);

    $ionicConfigProvider.backButton.text(null);
    $ionicConfigProvider.backButton.previousTitleText(false);

    $ionicConfigProvider.navBar.alignTitle("center");

    $ionicConfigProvider.views.maxCache(0);

    // http://angular-ui.github.io/ui-router/site/#/api/ui.router.router.$urlRouterProvider#methods_deferintercept
    // Prevent $urlRouter from automatically intercepting URL changes;
    // this allows you to configure custom behavior in between location changes and route synchronization
    //
    //We use this in the in the modules .run function
    $urlRouterProvider.deferIntercept();

    //routing configurations

    //set default URL
    // if (!$localStorageProvider.get('isRegistered')) {
    //   $urlRouterProvider.otherwise('app/register');
    // }
    // else {
    //   $urlRouterProvider.otherwise('app/login');
    // }
    $urlRouterProvider.otherwise("app/giris");

    //set states
    $stateProvider

      .state("app", {
        url: "/app",
        abstract: true,
        cache: false,
        templateUrl: "app/app.view.html",
        controller: "AppController as app",
        config: {
          statusbarPadding: false
        }
      })
      .state("app.language", {
        url: "/language",
        cache: false,
        views: {
          menuContent: {
            templateUrl: "app/components/language/language.view.html",
            controller: "LanguageController as language"
          }
        }
      })
      .state("app.howto", {
        url: "/nasil-kullanabilirim",
        cache: false,
        views: {
          menuContent: {
            templateUrl: "app/components/tour/tour.view.html",
            controller: "TourController as tour"
          }
        }
      })

      .state("app.giris", {
        url: "/giris",
        views: {
          menuContent: {
            templateUrl: "app/components/giris/giris.view.html",
            controller: "GirisController as giris"
          }
        }
        // resolve: {
        //   actualBlog: function (BlogService, $rootScope) {
        //     $rootScope.$broadcast('loading:show', {loading_settings: {template: "<p><ion-spinner icon='lines' class='spinner-energized'></ion-spinner><br/>İçerik yükleniyor...</p>"}});
        //     return BlogService.getAll().finally(function () {
        //       $rootScope.$broadcast('loading:hide');
        //     });
        //   }
        // }
      })

      .state("app.login", {
        url: "/login",
        views: {
          menuContent: {
            templateUrl: "app/components/login/login.view.html",
            controller: "LoginController as login"
          }
        }
      })

      .state("app.forget", {
        url: "/forget/password",
        views: {
          menuContent: {
            templateUrl: "app/components/login/forget.password.html",
            controller: "LoginController as login"
          }
        }
      })

      .state("app.register", {
        url: "/register",
        views: {
          menuContent: {
            templateUrl: "app/components/register/register.view.html",
            controller: "RegisterController as register"
          }
        }
      })

      .state("app.complaint", {
        url: "/sikayetim-var",
        views: {
          menuContent: {
            templateUrl: "app/components/complaint/complaint.view.html",
            controller: "ComplaintController as complaint"
          }
        }
        // data: {
        //   'access': AuthenticationServiceConstant.accessLevels.user
        // }
      })

      .state("app.profile", {
        url: "/profile",
        views: {
          menuContent: {
            templateUrl: "app/components/profile/profile.view.html",
            controller: "ProfileController as profile"
          }
        },
        resolve: {
          actualPolls: function(ProfileService, $rootScope) {
            $rootScope.$broadcast("loading:show", {
              loading_settings: {
                template:
                  "<p><ion-spinner icon='lines' class='spinner-energized'></ion-spinner><br/>" +
                  $language.translate("Loading Profile Informations...") +
                  "</p>"
              }
            });
            return ProfileService.getProfile().finally(function() {
              $rootScope.$broadcast("loading:hide");
            });
          }
        }
      })

      .state("app.livechat", {
        url: "/canli-yardim",
        cache: false,
        views: {
          menuContent: {
            templateUrl: "app/components/livechat/livechat.view.html",
            controller: "LivechatController as livechat"
          }
        }
      })

      .state("app.support", {
        url: "/destek",
        views: {
          menuContent: {
            templateUrl: "app/components/support/support.view.html",
            controller: "SupportController as support"
          }
        }
      })

      .state("app.rights", {
        url: "/onemli-bilgiler",
        views: {
          menuContent: {
            templateUrl: "app/components/rights/rights.view.html",
            controller: "RightsController as rights"
          }
        }
      })

      .state("app.emergency", {
        url: "/acil-aramalar",
        views: {
          menuContent: {
            templateUrl: "app/components/emergency/emergency.view.html"
          }
        }
      })

      .state("app.poll", {
        url: "/anketler",
        cache: false,
        views: {
          menuContent: {
            templateUrl: "app/components/poll/poll.view.html",
            controller: "PollPageController as pollPage"
          }
        },
        resolve: {
          actualPolls: function(PollPageService, $rootScope) {
            $rootScope.$broadcast("loading:show", {
              loading_settings: {
                template:
                  "<p><ion-spinner icon='lines' class='spinner-energized'></ion-spinner><br/>" +
                  $language.translate("Loading Surveys...") +
                  "</p>"
              }
            });
            return PollPageService.getAll().finally(function() {
              $rootScope.$broadcast("loading:hide");
            });
          }
        }
      })

      .state("app.blogDetail", {
        url: "/blog/:nid?title",
        cache: false,
        views: {
          menuContent: {
            templateUrl: "app/components/blog/blogDetail/blogDetail.view.html",
            controller: "BlogDetailController as blogDetail"
          }
        },
        resolve: {
          blogDetail: function(BlogService, $stateParams) {
            return BlogService.get({ nid: $stateParams.nid });
          }
        }
      })

      .state("app.blog", {
        cache: false,
        url: "/blog",
        views: {
          menuContent: {
            templateUrl: "app/components/blog/blog.view.html",
            controller: "BlogController as blog"
          }
        },
        resolve: {
          actualBlog: function(BlogService, $rootScope) {
            $rootScope.$broadcast("loading:show", {
              loading_settings: {
                template:
                  "<p><ion-spinner icon='lines' class='spinner-energized'></ion-spinner><br/>" +
                  $language.translate("Loading Headlines...") +
                  "</p>"
              }
            });
            return BlogService.getAll().finally(function() {
              $rootScope.$broadcast("loading:hide");
            });
          }
        }
      })

      .state("app.articleDetail", {
        url: "/icerik/:nid?title",
        cache: false,
        views: {
          menuContent: {
            templateUrl:
              "app/components/articleFeed/articleDetail/articleDetail.view.html",
            controller: "ArticleDetailController as articleDetail"
          }
        },
        resolve: {
          articleDetail: function(ArticleFeedService, $stateParams) {
            return ArticleFeedService.get({ nid: $stateParams.nid });
          },
          actualArticles: function(ArticleFeedService, $rootScope) {
            $rootScope.$broadcast("loading:show", {
              loading_settings: {
                template:
                  "<p><ion-spinner icon='lines' class='spinner-energized'></ion-spinner><br/>" +
                  $language.translate("Loading Details...") +
                  "</p>"
              }
            });
            return ArticleFeedService.getAll().finally(function() {
              $rootScope.$broadcast("loading:hide");
            });
          }
        }
      });
  }

  runFunction.$inject = [
    "$rootScope",
    "AuthenticationService",
    "$state",
    "$localStorage",
    "DrupalApiConstant",
    "$urlRouter",
    "$ionicLoading",
    "$ionicPlatform",
    "$cordovaStatusbar"
  ];

  /** @ngInject */
  function runFunction(
    $rootScope,
    AuthenticationService,
    $state,
    $localStorage,
    DrupalApiConstant,
    $urlRouter,
    $ionicLoading,
    $ionicPlatform,
    $cordovaStatusbar
  ) {
    //  $ionicPlatform.ready(function() {
    //   StatusBar.hide();
    // });

    $rootScope.$on("loading:show", loadingShowCallback);

    $rootScope.$on("loading:hide", loadingHideCallback);

    //http://angular-ui.github.io/ui-router/site/#/api/ui.router.router.$urlRouterProvider#methods_deferintercept
    //location change logic => before any view is rendered
    $rootScope.$on("$locationChangeStart", locationChangeStartCallback);

    //state change logic
    //$rootScope.$on("$stateChangeStart", stateChangeStartCallback);

    ////////////

    // show ionicLoading overlay with args of event
    function loadingShowCallback(event, args) {
      $ionicLoading.show(
        args && "loading_settings" in args ? args.loading_settings : {}
      );
    }

    // hide ionicLoading overlay
    function loadingHideCallback(event, args) {
      $ionicLoading.hide();
    }

    //we need this to have out current auth state before any other thing in router happens
    function locationChangeStartCallback(e) {
      if (AuthenticationService.getLastConnectTime() > 0) {
        //sync the current URL to the router

        $urlRouter.sync();
        return;
      }

      // Prevent $urlRouter's default handler from firing
      e.preventDefault();
      $rootScope.$broadcast("loading:show", {
        loading_settings: {
          template:
            "<p><ion-spinner icon='lines' class='spinner-energized'></ion-spinner><br/>" +
            $language.translate("Loading...") +
            "</p>"
        }
      });
      // init or refresh Authentication service connection
      AuthenticationService.refreshConnection()
        .then(function(success) {
          $rootScope.$broadcast("loading:hide");

          //sync the current URL to the router
          $urlRouter.sync();
        })
        .catch(function(error) {
          $rootScope.$broadcast("loading:hide");
          //sync the current URL to the router
          $urlRouter.sync();
        });

      // Configures $urlRouter's listener *after* your custom listener
      //$urlRouter.listen();
    }

    function stateChangeStartCallback(
      event,
      toState,
      toParams,
      fromState,
      fromParams
    ) {
      // var input = document.getElementById("saveServer");
      // localStorage.setItem("server", input.value);

      // var storedValue = localStorage.getItem("server");

      // if its the users first visit to the app show the apps tour

      if (toState.name !== "app.howto") {
        if (!$localStorage.firstVisit) {
          event.preventDefault();
          $state.go("app.howto");
          return;
        }
      }

      //redirects for logged in user away from login or register and show its profile instead
      if (toState.name == "app.login" || toState.name == "app.register") {
        if (AuthenticationService.getConnectionState()) {
          event.preventDefault();
          $state.go("app.profile");
          return;
        }
      }

      //redirect if user is unauthorized
      if (
        "data" in toState &&
        "access" in toState.data &&
        !AuthenticationService.isAuthorized(toState.data.access)
      ) {
        event.preventDefault();
        if ($localStorage.isRegistered) {
          $state.go("app.login");
        } else {
          $state.go("app.register");
        }

        return;
      }
    }
  }
})();

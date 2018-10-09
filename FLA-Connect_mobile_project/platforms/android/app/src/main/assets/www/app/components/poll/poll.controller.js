  ;
  (function () {

    angular.module('flaMobileApp.pollPage.controller', ['commons.directives.toggleByOwnUid', 'flaMobileApp.pollPage.service'])
    .controller('PollPageController', PollPageController);

    PollPageController.$inject = ['$q', '$scope', '$state', '$filter', '$localStorage', '$window', '$ionicListDelegate', '$ionicModal', 'DrupalHelperService', 'PollPageService', 'AuthenticationService', 'actualPolls',  'DrupalApiConstant', 'NodeResourceConstant', 'BaseResource', 'NodeChannel']

    function PollPageController($q, $scope, $state, $filter, $localStorage, $window, $ionicListDelegate,  $ionicModal, DrupalHelperService, PollPageService, AuthenticationService, actualPolls, DrupalApiConstant, NodeResourceConstant, BaseResource, NodeChannel) {

      var vm = this;
      $scope.translate = $language.translate;
      vm.deleteVisible = false;
      vm.loadingDetail = false;
      vm.polls = actualPolls;
      vm.clickedBefore = false;
      vm.pollIsPending = true;

      //functions
      vm.doRefresh = doRefresh;
      vm.loadMore = loadMore;
      vm.openDetail = openDetail;
      vm.sendVote = sendVote;
      vm.sendNid = sendNid;

      vm.pollIsPending = false;


      $scope.everythingIsHidden = function() {
        return $scope.pollPage.polls.every((poll, index) => $scope.getCheck(index));
      }

      $scope.updateThemaLocalStorage = function ($index) {
        $window.localStorage.setItem( $index, actualPolls[$index].checked );
      };

      $scope.output = $window.localStorage;

      $scope.getCheck = function ($index) {
        return $window.localStorage[ $index ];
      };


      function start() {
        $localStorage.firstVisit = true;
        $scope.app.$state.go('app.giris');
      }


      //hide loading spinner on route change
      $scope.$on("$stateChangeSuccess", function () {
        vm.loadingDetail = false;
      });

      
      $scope.pollNid = 0;
      $scope.setPollNid = function(index) {
        $scope.pollNid = index;
        console.log(index);
      }


      function sendNid (data, nid) {
        vm.nid = data.nid;   
      }  

      $scope.showVoted = false;
      var i = null;


      $scope.checkStorage = function ()
      {
        return localStorage.getItem('isClicked') !== 'isClicked'; 
        vm.clickVote = true;
      }


      // $scope.clickVote = function() {
      //   $ionicLoading.show({
      //     template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
      //   });
      // };

      $scope.hide = function(){
        $ionicLoading.hide();
      }; 




      function sendVote(data, nid, vote, advpoll_choice, title, element) {

        var pollPath = DrupalApiConstant.drupal_instance + DrupalApiConstant.api_endpoint + 'votingapi/set_votes',
        sendPoll  = {
          votes: [
          {
            entity_id: vm.nid,
            tag: data.choice_id,
            value: "1"
          }
          ]

        };
        vm.pollIsPending = true;
        return BaseResource.create( sendPoll, pollPath, NodeChannel.pubCreateConfirmed, NodeChannel.pubCreateFailed)
        .then(function(response) {
          localStorage.setItem('isClicked', 'Yes');
          var i = +localStorage.key("nid");
          var nidId = 'nid' + localStorage.length;
          localStorage.setItem(vm.nid, 'isClicked');

        })
        .catch(function(response) {
        })
        .finally(function() {
         vm.pollIsPending = false
       });


      };


      function doRefresh(data) {
        console.log(data);
        PollPageService.loadRecent().then(
          function (allNodes) {
            vm.polls = allNodes;
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          },
          function (data) {
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      };

      function loadMore() {
        PollPageService.loadMore().then(
          function (allNodes) {
            vm.polls = allNodes;
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (data) {
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
      };

      function openDetail(pollToOpen) {
        vm.loadingDetail = pollToOpen.nid;

        $state.go('app.pollDetail', {
          nid: pollToOpen.nid,
          title: pollToOpen.title
        });
      };

      /*Create Modal*/
      vm.deletingPoll = false;
      vm.saveingPoll = false;
      vm.openCreateModal = openCreateModal;
      vm.closeCreateModal = closeCreateModal;
      vm.takeImage = takeImage,
      vm.saveArtilce = saveArtilce;
      vm.deletePoll = deletePoll;

      //new node
      vm.newImage = {};
      vm.newPoll = {};

      // init the createModal
      $ionicModal.fromTemplateUrl('app/components/poll/templates/create.modal.html',
        function (modal) {
          vm.createModal = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up'
        }
        );

      
      function takeImage(options) {

        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 500,
          targetHeight: 500,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };

        ionic.Platform.ready(function () {

          navigator.camera.getPicture(
            function (result) {
              vm.newPoll.field_image.base64 = result;
              $scope.$apply();
            },
            function (err) {
            },
            options
            );

        });

      }

      // Open our new task modal
      function openCreateModal(poll, linstIndex) {
        vm.newPoll = {};
        vm.pollModalMode = 'create';

        //setup drupal field structure
        vm.newPoll = angular.extend(vm.newPoll, {
          type: 'poll',
          title: 'Title...',
          body: DrupalHelperService.structureField({'value': 'full', 'summary': 'summ'}),
          field_image: {base64: false}
        }
        );

        vm.createModal.show();
      };

      // Close the new task modal
      function closeCreateModal() {
        vm.createModal.hide();
      };

      function saveArtilce(poll) {

        vm.savingPoll = true;
        PollPageService
        .saveArtilce(poll)
        .then(
          function (data) {
            vm.doRefresh();
          }
          )
        .finally(
          function (findata) {

            //update view
            vm.newPoll.field_image.base64 = false;
            vm.createModal.hide();
            vm.savingPoll = false;
          }
          );

      }

      function deletePoll(poll, linstIndex) {

        vm.deletingPoll = poll.nid;
        PollPageService
        .deletePoll(poll)
        .then(
          function (data) {
            vm.polls.splice(linstIndex, 1)
          }
          )
        .finally(function () {
          vm.deletingPoll = false;
        });

      }
    }






  })();

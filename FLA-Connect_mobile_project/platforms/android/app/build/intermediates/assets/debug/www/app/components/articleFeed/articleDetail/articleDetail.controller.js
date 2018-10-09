;
(function () {

  angular
  .module('flaMobileApp.articleFeed.articleDetail.controller', [])
  .controller('ArticleDetailController', ArticleDetailController);

  ArticleDetailController.$inject = ['$scope', '$stateParams', 'UserResource', 'NodeResource', 'DrupalHelperService', 'articleDetail', '$ionicSideMenuDelegate', '$localStorage', '$ionicLoading']

  function ArticleDetailController($scope, $stateParams, UserResource, NodeResource, DrupalHelperService, articleDetail, $ionicSideMenuDelegate, $localStorage, $ionicLoading, $http) {

   var vm = this;

   vm.start = start;

   vm.options = {
    loop: false,
    effect: 'fade',
    speed: 500,
  };

  init();

    ///////////////////////

    function init(){
      $scope.$on('$ionicView.enter', function(){
        $ionicSideMenuDelegate.canDragContent(false);
      });
      $scope.$on('$ionicView.leave', function(){
        $ionicSideMenuDelegate.canDragContent(true);
      });
    }


    function start() {
      $localStorage.firstVisit = true;
      
    }


    // var list = document.getElementsByClassName('item-body p');
    // var value = list[0].value;


    // console.log(value);

    


    // $scope.response = { text: [list] };

    // $scope.test = $scope.response.text[0].innerHTML;

    // console.log($scope.response);


    // $scope.groups = [{
    //   name: 'test',
    //   items: [1,2,3]},
    //   {
    //     name: "Torso Measures",
    //     items: [1,2,3]},
    //     {
    //       name: "Extra measures",
    //       items: [1,2,3,4,5],
    //     }
    //     ];


  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
   $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };




  vm.viewTitle = $stateParams.title;
  vm = angular.extend(vm, articleDetail);
  vm.pathToImg = false;

    //vm.user = undefined;
    vm.pathToUserImg = false;

    //vm.comments = [];

    // vm.pathToImg = (articleDetail.field_image.und) ? DrupalHelperService.getPathToImgByStyle('large') + articleDetail.field_image.und[0].uri.split('//')[1] : false;

   //  if(vm.article.uid) {
   //   UserResource.retrieve(vm.article.uid).then(
   //   function(user) {
   //   if(user.picture !== null && user.picture.filename !== null) {
   //   vm.user = user;
   //   vm.pathToUserImg = vm.pathToCms + '/sites/default/files/styles/thumbnail/public/pictures/' + user.picture.filename;
   //   }
   //   },
   //   //error loading user
   //   function() {}
   //   );
   // }

   vm.loadingComments = false;
   vm.loadComments = function (numOfNodes) {
     if(numOfNodes > 0) {
       vm.loadingComments = true;
       NodeResource.comments(vm.article.uid).then(
         function(newComments) {
           vm.loadingComments = false;
           vm.comments = newComments;
         },
     //error loading user
     function() {
       vm.loadingComments = false;
     }
     );
     }
   }

   vm.createComment = function(nid, cid) {

   }

 };
  /*
   authedTabsNodeDemoControllers.controller('NodeEditCtrl', function(vm, $state, NodeResource, NodeResourceChannel, nodeObj) {
   vm.nid = nodeObj.nid;
   delete nodeObj.nid;

   vm.dirtyPage = nodeObj;
   vm.editServerErrors = [];

   NodeResourceChannel.onNodeUpdateConfirmed(vm, function(node) {

   });

   vm.updatePage = function() {

   NodeResource.update(vm.nid, vm.dirtyPage).then(
   //success
   function(data) {
   $state.go('app.authed-tabs.node-list');
   },
   //error
   function(data) {
   vm.editServerErrors.push(data);
   }
   );
   }
   }
   */





 })();



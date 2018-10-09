;
(function () {

  angular
  .module('flaMobileApp.blog.blogDetail.controller', [])
  .controller('BlogDetailController', BlogDetailController);

  BlogDetailController.$inject = ['$scope', '$stateParams', 'UserResource', 'NodeResource', 'DrupalHelperService', 'blogDetail']

  function BlogDetailController($scope, $stateParams, UserResource, NodeResource, DrupalHelperService, blogDetail) {

    var vm = this;

    vm.viewTitle = $stateParams.title;
    vm = angular.extend(vm, blogDetail);
    vm.pathToImg = false;

    //vm.user = undefined;
    vm.pathToUserImg = false;

    //vm.comments = [];

    vm.pathToImg = (blogDetail.field_yazi_resmi.und) ? DrupalHelperService.getPathToImgByStyle('large') + blogDetail.field_yazi_resmi.und[0].filename : false;


    /*if(vm.article.uid) {
     UserResource.retrieve(vm.article.uid).then(
     function(user) {
     if(user.picture !== null && user.picture.filename !== null) {
     vm.user = user;
     vm.pathToUserImg = vm.pathToCms + '/sites/default/files/styles/thumbnail/public/pictures/' + user.picture.filename;
     }
     },
     //error loading user
     function() {}
     );
   }*/

    /*vm.loadingComments = false;
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

     }*/

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




angular.module('famicity').controller('UserCommentsController', function(
  $rootScope, $scope, $stateParams, ModalManager, $location,
  Album, Permission, oldPermissionService, me) {
  'use strict';
  $scope.init = function() {
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.objectId = $stateParams.user_id;
    $scope.objectType = 'user';
    $scope.showCommentsView = true;
    $scope.user = {
      last_comments: []
    };
  };
});

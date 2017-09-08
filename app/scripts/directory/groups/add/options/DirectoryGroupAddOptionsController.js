angular.module('famicity')
  .controller('DirectoryGroupAddOptionsController', function($scope, $modalInstance, $state) {
    'use strict';

    $scope.goGroupAdd = function() {
      $modalInstance.close();
      $state.go('u.directory.user-group-add', {
        group_id: $scope.group.id
      });
    };

    $scope.goDirectoryAdd = function() {
      $modalInstance.close();
      $state.go('u.directory.add', {
        user_id: $scope.viewedUserId
      });
    };
  });

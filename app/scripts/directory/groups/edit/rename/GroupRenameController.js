angular.module('famicity')
  .controller('GroupRenameController', function(
    $scope, $modalInstance, $location, notification, groupService) {
    'use strict';

    $scope.renameGroupFormsubmitted = false;
    $scope.formInProgress = false;
    $scope.formHolder = {
      renameFormGroupName: angular.copy($scope.group.group_name)
    };

    $scope.submitGroupRenameForm = function() {
      const promises = [];
      $scope.renameGroupFormsubmitted = true;
      if ($scope.formHolder.groupRenameForm.$valid) {
        promises.push(groupService.updateGroup($scope.userId, $scope.group.id, {
          group_name: $scope.formHolder.renameFormGroupName
        }, $scope.$parent));
        $modalInstance.close();
      } else {
        notification.add('GROUP_NAME_EMPTY_ERROR_MSG');
      }
      return promises;
    };
  });

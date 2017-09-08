angular.module('famicity')
  .controller('GroupEditController', (
    $scope, ModalManager, $modalInstance, $state,
    yesnopopin, notification, Group) => {
      'use strict';

      $scope.goToAddMembers = function() {
        $modalInstance.close();
        $state.go('u.directory.user-group-add', {
          group_id: $scope.group.id
        });
      };

      $scope.goToRenameGroup = function() {
        $modalInstance.close();
        ModalManager.open({
          templateUrl: '/scripts/directory/groups/edit/rename/GroupRename.html',
          controller: 'GroupRenameController',
          scope: $scope.$parent
        });
      };

      $scope.goToDeleteMembers = function() {
        $modalInstance.close();
        $state.go('u.directory.user-group-remove', {group_id: $scope.group.id});
      };

      $scope.goToDeleteGroup = function() {
        $modalInstance.close();
        yesnopopin.open('DELETE_GROUP_CONFIRMATION_POPUP_TITLE').then(function() {
          Group.delete({user_id: $scope.userId, group_id: $scope.group.id}).$promise.then(function() {
            notification.add('GROUP_DELETED_SUCCESS_MSG');
            $state.go('u.directory.list', {user_id: $scope.userId}, {reload: true});
          });
        });
      };
    });

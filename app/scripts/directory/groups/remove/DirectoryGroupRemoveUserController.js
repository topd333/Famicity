angular.module('famicity')
  .controller('DirectoryGroupUserRemoveController', function(
    $scope, directoryManagerService, $stateParams, ModalManager, notification,
    Group, $state, group, users, Directory) {
    'use strict';

    $scope.groupId = $stateParams.group_id;
    $scope.data = directoryManagerService.data;

    $scope.group = group.group;
    $scope.users = users;

    if (!users.length) {
      $scope.emptyUsers = true;
    }

    $scope.loadMore = function(page, search) {
      const promise = Directory.get({
        q: search,
        group_id: $scope.group.id,
        page
      }).$promise;
      promise.then((directory) => {
        $scope.users = page === 1 ? directory.users : $scope.users.concat(directory.users);
      });
      return promise;
    };

    $scope.sendMultipleDelete = function() {
      const usersToDelete = $scope.users.filter(user => user.selected).map(user => user.id);
      const usersToDeleteString = usersToDelete.join(',');

      new Group({
        user_id: $scope.userId,
        id: $scope.group.id,
        members: usersToDeleteString
      }).$remove_members()
        .then((response) => {
          notification.add('MEMBERS_REMOVED_SUCCESS_MSG');
          if ($scope.$parent && $scope.$parent.getGroups) {
            $scope.$parent.getGroups();
          }
          $scope.users = response.group.users;
          $state.go('u.directory.user-group', {group_id: $scope.group.id}, {reload: true});
        });
    };

    $scope.openGroupAddOptionsPopup = function() {
      ModalManager.open({
        templateUrl: '/views/popup/popup_group_add_options.html',
        controller: 'GroupAddOptionsPopupController',
        scope: $scope
      });
    };
  });

angular.module('famicity.directory')
  .controller('DirectoryGroupShowController', function(
    $scope, $rootScope, $stateParams, ModalManager, $q,
    notification, LoadingAnimationUtilService, me, Group, Directory, group) {
    'use strict';

    $scope.userId = me.id;
    $scope.me = me;
    $scope.groupId = $stateParams.group_id;

    $scope.group = group.group;
    $scope.users = group.group.users;

    if (!$scope.users.length) {
      $scope.emptyUsers = true;
    }
    LoadingAnimationUtilService.validateList();

    $scope.loadMore = function(page, search) {
      let promise;
      if (search) {
        promise = Directory.get({
          page,
          q: search,
          group_id: $scope.group.id
        }).$promise;
        promise.then(function(directory) {
          $scope.users = page === 1 ? directory.users : $scope.users.concat(directory.users);
        });
      } else {
        promise = $q.resolve([]);
      }
      // Disabled for now, enable when the call handles infinite scroll
      /* else {
        const lastUserId = $scope.users.length ? $scope.users[$scope.users.length - 1].id : null;
        promise = Group.get({
          last_object_id: lastUserId,
          q: search,
          group_id: $scope.group.id,
          user_id: me.id
        }).$promise;
        promise.then(function(response) {
          $scope.users = page === 1 ? response.group.users : $scope.users.concat(response.group.users);
        });
      } */
      return promise;
    };
  });

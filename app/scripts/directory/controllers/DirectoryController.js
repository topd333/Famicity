
angular.module('famicity')
  .controller('DirectoryController', function(
    $scope, $rootScope, ModalManager, $stateParams,
    $location, notification, LoadingAnimationUtilService, receivedInvitations,
    numberOfActives, me, directory, Directory) {
    'use strict';

    $scope.numberOfInvitations = receivedInvitations.length;
    $scope.numberOfActives = numberOfActives;
    $scope.me = me;
    $scope.users = directory.users;
    $scope.filter = null;
    if (!directory.users.length) {
      $scope.emptyUsers = true;
    }

    $scope.loadMore = function(page, search, invitable) {
      const promise = Directory.get({
        q: search,
        page,
        invitable
      }).$promise;
      promise.then(function(directory) {
        $scope.users = page === 1 ? directory.users : $scope.users.concat(directory.users);
      });
      return promise;
    };
  });

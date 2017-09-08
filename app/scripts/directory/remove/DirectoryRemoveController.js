angular.module('famicity')
  .controller('DirectoryRemoveController', function(
  $scope, $state, User, me, notification, Directory) {
  'use strict';

  $scope.selected = [];
  $scope.users = [];

  $scope.loadMore = function(page, search) {
    const promise = Directory.get({
      page,
      q: search,
      global_state: 'directory',
      deletable: true
    }).$promise;
    promise.then(function(directory) {
      if (page === 1) {
        $scope.users = directory.users;
      } else {
        $scope.users = $scope.users.concat(directory.users);
      }
    });
    return promise;
  };

  $scope.loadMore();

  $scope.destroy = function() {
    const toDestroy = $scope.selected.map(el => el.id).toString();
    User.destroyMultiple({user_id: me.id, user_ids: toDestroy}).$promise.then(function() {
      if (toDestroy.length) {
        notification.add('DIRECTORY.SUCCESSFULY_REMOVED');
      }
      $state.go('u.directory.list');
    });
  };
});

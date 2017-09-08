angular.module('famicity').directive('fcOtherUsersLinks', function(
  ModalManager, $location, pendingFormsManagerService, notification,
  $state, Invitation, yesnopopin, userService, Directory) {
  'use strict';
  return {
    replace: true,
    templateUrl: '/views/internal/other_users_links.html',
    link($scope) {
      $scope.basicProfile = $scope.basicProfile || $scope.user;
      $scope.invite = function(user) {
        if (user.email !== null) {
          new Invitation({user_concerned_id: user.id}).$save({user_id: $scope.userId}).then(function() {
            $state.go($state.$current, null, {reload: true});
            notification.add('INVITATION_SENT_SUCCESS_MSG');
          });
        } else {
          $state.go('u.directory.send-invitation', {invitation_id: user.id});
        }
      };
      $scope.allowSeeHisProfile = function() {
        return $state.current.name !== 'u.profile';
      };
      $scope.block = function(user) {
        yesnopopin.open('BLOCK_USER_CONFIRMATION_TITLE').then(function() {
          userService.blockUser(user.id).then(function() {
            $state.go('u.profile', {user_id: user.id}, {reload: true});
          });
        });
      };
      $scope.openDeleteDirectoryUserAlert = function() {
        yesnopopin.open('DIRECTORY_USER_CONFIRMATION_POPUP_TITLE').then(function() {
          Directory.destroyFromDirectory({user_id: $scope.basicProfile.id}).$promise.then(function() {
            notification.add('CONTACT_DELETED_SUCCESS_MSG');
            $state.go('u.directory.list', {user_id: $scope.userId});
          });
        });
      };
    }
  };
});

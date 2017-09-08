angular.module('famicity')
  .controller('ProfilePhotoCropController', function(
    $scope, navigation, $rootScope, $location, $stateParams,
    profileService, avatarService, LoadingAnimationUtilService, notification,
    configuration, me, avatar) {
    'use strict';

    $scope.userId = me.id;
    $scope.me = me;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.coordinates = null;
    $scope.photoId = $stateParams.photo_id;
    $scope.locationType = 'profile';
    $scope.avatar = avatar;
    profileService.get($scope.viewedUserId, $scope);

    $scope.crop = function() {
      if ($scope.coordinates) {
        LoadingAnimationUtilService.activate();
        avatarService.crop($scope.viewedUserId, $scope.photoId, $scope.coordinates, $scope, function(response) {
          LoadingAnimationUtilService.deactivate();
          $scope.avatar = response.avatar;
        });
      }
    };

    $scope.validate = function() {
      if ($scope.coordinates) {
        LoadingAnimationUtilService.activate();
        return avatarService.crop($scope.viewedUserId, $scope.photoId, $scope.coordinates, $scope, function() {
          if (!$scope.avatar.used_avatar) {
            avatarService.setAsProfileImage($scope.viewedUserId, $scope.photoId, $scope).then(function() {
              navigation.go('u.profile-photos', {user_id: $scope.viewedUserId});
              LoadingAnimationUtilService.deactivate();
            });
          } else {
            navigation.go('u.profile-photos', {user_id: $scope.viewedUserId});
            LoadingAnimationUtilService.deactivate();
          }
        });
      } else if (!$scope.avatar.used_avatar) {
        avatarService.setAsProfileImage($scope.viewedUserId, $scope.photoId, $scope).then(function() {
          navigation.go('u.profile-photos', {user_id: $scope.viewedUserId});
          LoadingAnimationUtilService.deactivate();
        });
      } else {
        navigation.go('u.profile-photos', {user_id: $scope.viewedUserId});
        LoadingAnimationUtilService.deactivate();
      }
    };
  });

angular.module('famicity')
  .controller('ProfilePhotosController', function(
    $scope, $state, $rootScope, $stateParams,
    ModalManager, profileService, avatarService, notification,
    configuration, me, profile, PUBSUB, pubsub) {
    'use strict';

    $scope.profile = profile;

    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.locationType = 'profile';
    this.avatarService = avatarService;
    this.avatarService.getAvatars($scope.viewedUserId, $scope);
    // profileService.get($scope.viewedUserId, $scope);
    profileService.getBasicProfile($scope.viewedUserId, 'short', $scope);
    $scope.uploadOngoing = false;
    $scope.uploadId = null;
    $scope.uploadPercent = null;

    $scope.startSlideshow = function() {
      $state.go('u.profile-photos-item-fullscreen', {user_id: $scope.viewedUserId, photo_id: $scope.avatars[0].id});
    };
    pubsub.subscribe(PUBSUB.PROFILE.SHOW.PHOTO.SLIDE_SHOW, $scope.startSlideshow, $scope);
  });

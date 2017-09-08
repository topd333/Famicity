angular.module('famicity')
  .controller('ProfilePhotoLikesController', function(
    $scope, $state, $stateParams, $location, $translate,
    LoadingAnimationUtilService, ModalManager, Avatar, Like, me, menuBuilder) {
    'use strict';

    menuBuilder.newMenu().build();

    LoadingAnimationUtilService.resetPromises();
    // TODO: Remove
    $scope.userId = me.id;
    $scope.user = $scope.me = me;

    $scope.viewedUserId = $stateParams.user_id;

    $scope.avatarId = $stateParams.photo_id;
    $scope.photoId = $stateParams.photo_id;
    const object_type = 'avatar';
    $scope.likesList = Like.query({
      object_id: $scope.avatarId,
      object_type
    });
    if ($scope.viewedUserId === $scope.userId) {
      $scope.likeText = 'LIKED_YOUR_AVATAR';
    } else {
      $scope.likeText = 'LIKED_OTHER_AVATAR';
    }
    $scope.listPageUrl = $state.href('user-avatars-likes', {
      user_id: $scope.viewedUserId,
      photo_id: $stateParams.photo_id
    });
    $scope.avatar = Avatar.get({user_id: $scope.viewedUserId, avatar_id: $scope.avatarId});

    $scope.setAsProfileImage = function() {
      $state.go('u.profile-photos-crop', {user_id: $scope.viewedUserId, photo_id: $scope.avatarId});
    };
    $scope.openAvatarPhotoDescriptionPopup = function() {
      ModalManager.open({
        templateUrl: '/views/popup/popup_avatar_photo_description.html',
        controller: 'AvatarPhotoDescriptionPopupController',
        scope: $scope
      });
    };
  });

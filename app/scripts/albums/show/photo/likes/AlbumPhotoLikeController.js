angular.module('famicity')
  .controller('AlbumPhotoLikesController', function(
    $state, $rootScope, $scope, $stateParams,
    $translate, ModalManager, LoadingAnimationUtilService, Like, Photo,
    Album, me, navigation) {
    'use strict';

    const object_type = 'photo';
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    LoadingAnimationUtilService.resetPromises();
    $scope.albumId = $stateParams.album_id;
    $scope.photoId = $stateParams.photo_id;
    $scope.album = Album.get({
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId
    });
    $scope.likesList = Like.query({
      object_type: object_type,
      object_id: $scope.photoId
    });
    $scope.likesView = true;
    if ($scope.viewedUserId === $scope.userId) {
      $scope.likeText = 'LIKED_YOUR_PHOTO';
    } else {
      $scope.likeText = 'LIKED_OTHER_PHOTO';
    }
    $scope.listPageUrl = navigation.href('u.albums-photos-likes', {
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId,
      photo_id: $scope.photoId
    });
    Photo.get({
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId,
      photo_id: $scope.photoId
    }).$promise.then(function(photo) {
        $scope.photo = photo;
        $scope.object = photo;
      });

    $scope.setAsProfileImage = function() {
      Photo.set_as_avatar({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: $scope.photoId
      }).$promise.then(function(response) {
          navigation.go('u.profile-photos-crop', {user_id: $scope.viewedUserId, photo_id: response.avatar.id});
        });
    };
    $scope.openPhotoDescriptionPopup = function() {
      var modalInstance = ModalManager.open({
        templateUrl: '/scripts/albums/controllers/PopupAlbumsPhotosUpdate.html',
        controller: 'PopupAlbumsPhotosUpdateController',
        scope: $scope
      });
      modalInstance.result.then(function(result) {
        if (result) {
          $scope.photo = result;
        }
      });
    };
  });

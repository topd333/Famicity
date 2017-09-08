// @flow weak

angular.module('famicity')
  .controller('AlbumShowController', function(
    $rootScope, $scope, $state, $stateParams, ModalManager,
    $location, sessionManager, Album, Photo, ImageUploader,
    configuration, LoadingAnimationUtilService, Permission, oldPermissionService, me, album,
    yesnopopin, notification, pubsub, PUBSUB) {
    'use strict';

    let index = 0;
    LoadingAnimationUtilService.resetPromises();
    LoadingAnimationUtilService.activate();
    // TODO: Remove
    $scope.userId = me.id;
    $scope.user = me;

    $scope.viewedUserId = $stateParams.user_id;
    $scope.albumId = album.id;
    $scope.listPageUrl = $state.href('u.albums-likes', {
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId
    });
    if (oldPermissionService.isInit() === false) {
      oldPermissionService.init('album', 'show', $stateParams.album_id);
    }
    $scope.album = album;
    $scope.object = album;

    // LoadingAnimationUtilService.addPromises($scope.album);
    LoadingAnimationUtilService.addPromises(Photo.query({
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId
    }).$promise.then(function(response) {
        $scope.photos = response;
      }));

    Permission.get({
      object_type: 'album',
      object_id: $stateParams.album_id
    }).$promise.then(function(result) {
        $scope.permissions = result.permissions.user_permissions.concat(result.permissions.group_permissions);
        $scope.exclusions = result.permissions.user_exclusions.concat(result.permissions.group_exclusions);
      });

    ImageUploader.reset();
    const unbind = pubsub.subscribe(PUBSUB.UPLOADER.ON_SUBMITTED, function() {
      log('image upload submitted');
      $state.go('u.albums-upload', {user_id: $scope.viewedUserId, album_id: $scope.albumId}, {reload: true});
      unbind();
    }, $scope);
    const uploadId = Date.now();
    ImageUploader.setParams({
      button: angular.element('#photoUploadBtnMobile')[0],
      extraButtons: [
        {
          element: angular.element('#photoUploadBtn')[0]
        }
      ],
      maxConnections: 3,
      cors: {
        expected: true
      },
      validation: {
        acceptFiles: '.png, .jpg, .jpeg, .gif, .tiff',
        allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'tiff']
      },
      request: {
        endpoint: configuration.api_url + '/users/' + $scope.viewedUserId + '/albums/' + $scope.albumId + '/photos',
        customHeaders: {
          Authorization: 'Bearer ' + sessionManager.getToken()
        },
        params: {
          from: 'upload',
          upload_id: uploadId,
          index: () => index++
        }
      }
    });
    $scope.sharedAlbums = Album.get_list_shared_albums({
      user_id: $scope.userId
    });

    LoadingAnimationUtilService.validateList();

    $scope.startSlideshow = function() {
      $state.go('u.albums-photos-show-fullscreen', {
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: $scope.photos[0].id,
        root: true
      });
    };
    pubsub.subscribe(PUBSUB.ALBUM.SHOW.SLIDE, $scope.startSlideshow, $scope);

    $scope.openAddPhotoOptionsPopup = function() {
      ModalManager.open({
        templateUrl: '/scripts/albums/add/AlbumAddPhotos.html',
        controller: 'AlbumAddPhotosController',
        scope: $scope
      });
    };

    $scope.goToEditRightsPage = function() {
      $state.go('u.albums-update', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
    };

    $scope.$on('$destroy', function() {
      oldPermissionService.resetAll();
    });
  });

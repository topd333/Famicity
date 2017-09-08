angular.module('famicity')
  .controller('AlbumsUploadController', function(
    $rootScope, $scope, $stateParams, ModalManager, Album,
    Permission, Photo, ImageUploader, notification,
    me, $timeout, pubsub, PUBSUB, navigation) {
    'use strict';
    const log = debug('fc-photo-upload-controller');

    log('init');

    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.albumId = $stateParams.album_id;

    $scope.album = Album.get({
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId
    });

    log('init upload');
    $scope.totalProgressPercent = 0;
    $scope.uploadingImagesList = ImageUploader.getUploads();
    // redirect to the album if there is no pending upload
    if (!$scope.uploadingImagesList || !$scope.uploadingImagesList.length) {
      navigation.go('u.albums-show', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
      return;
    }

    Permission.get({
      object_type: 'album',
      object_id: $stateParams.album_id
    }).$promise.then(function(result) {
        $scope.permissions = result.permissions.user_permissions.concat(result.permissions.group_permissions);
        $scope.exclusions = result.permissions.user_exclusions.concat(result.permissions.group_exclusions);
      });

    $scope.init = function() {
      pubsub.subscribe(PUBSUB.UPLOADER.ON_PROGRESS, function(event, args) {
        const percent = (args.uploadedBytes / args.totalBytes * 100).toFixed(2);
        $scope.updateImagePercent(args.id, percent);
      }, $scope);

      pubsub.subscribe(PUBSUB.UPLOADER.ON_STATUS_CHANGE, function(event, args) {
        $scope.updateImageStatus(args.id, args.newStatus);
      }, $scope);

      pubsub.subscribe(PUBSUB.UPLOADER.ON_TOTAL_PROGRESS, function(event, args) {
        let maxPercentPerImg;
        let nbPending;
        const tempUploadingImagesList = ImageUploader.getUploads();
        // log('tempUploadingImagesList: %o', tempUploadingImagesList);
        nbPending = 0;
        angular.forEach(tempUploadingImagesList, function(img) {
          if (img.status === 'queued' || img.status === 'submitting' || img.status === 'uploading') {
            nbPending += 1;
          }
        });
        maxPercentPerImg = 100 / tempUploadingImagesList.length;
        if (args.totalBytes !== 0) {
          $scope.totalProgressPercent =
            (args.totalUploadedBytes / args.totalBytes * (100 - nbPending * maxPercentPerImg)).toFixed(2);
        }
        log('pending: %o, totalProgress: %o percent', nbPending, $scope.totalProgressPercent);
      }, $scope);

      pubsub.subscribe(PUBSUB.UPLOADER.ON_COMPLETE, function(event, args) {
        angular.forEach($scope.uploadingImagesList, function(value) {
          const responseJSON = args.responseJSON;
          if (responseJSON.success) {
            if (value.id === args.id) {
              const photo = responseJSON.photo;
              value.thumbnailElement = photo.url_thumb;
              value.finalId = photo.id;
            }
          } else {
            notification.add('PHOTO_UPLOAD_FAILED', {warn: true});
          }
        });
        const unbind = pubsub.subscribe(PUBSUB.UPLOADER.ON_SUBMITTED, function(event, photo) {
          log('image upload submitted');
          if (photo.id === 0) {
            navigation.go('u.albums-upload', {user_id: $scope.viewedUserId, album_id: $scope.albumId}, {reload: true});
          }
          unbind();
        }, $scope);
      }, $scope);

      pubsub.subscribe(PUBSUB.UPLOADER.ON_ALL_COMPLETE, function() {
        $scope.totalProgressPercent = 100;
        notification.add('ALBUM_UPLOAD_SUCCESS_MSG');
      }, $scope);
    };

    $scope.cancelAll = function() {
      ImageUploader.cancelAll();
      // $timeout(function() {
      $scope.canceled = true;
      // });
    };
    $scope.updateImagePercent = function(id, percent) {
      angular.forEach($scope.uploadingImagesList, function(value) {
        if (id === value.id) {
          $timeout(function() {
            log('--- id: %o, percent: %o', id, percent);
            value.percent = percent;
          });
        }
      });
    };
    $scope.updateImageStatus = function(id, status) {
      log('updateImageStatus, id: %o, status: %o', id, status);
      angular.forEach($scope.uploadingImagesList, function(value) {
        if (id === value.id) {
          $timeout(function() {
            value.status = status;
          });
        }
      });
    };

    $scope.updatePhoto = function(photo) {
      photo.editing = false;
      photo = new Photo(photo);
      return photo.$update({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: photo.finalId
      }).then(function() {
        notification.add('PHOTO_UPDATED_SUCCESS_MSG');
      });
    };
    $scope.openAddPhotoOptionsPopup = function() {
      ModalManager.open({
        templateUrl: '/scripts/albums/add/AlbumAddPhotos.html',
        controller: 'AlbumAddPhotosController',
        scope: $scope
      });
    };
    $scope.editDescription = function($event) {
      this.image.editing = true;
      $timeout(function() {
        angular.element($event.target).parents('.upload-file-block').find('textarea').focus();
      });
    };
  });

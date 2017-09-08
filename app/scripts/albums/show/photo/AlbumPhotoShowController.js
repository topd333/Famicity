angular.module('famicity')
  .controller('AlbumPhotoShowController', function(
    $state, $rootScope, $scope, $stateParams,
    $window, ModalManager, $q, $document, Album,
    Photo, rotationUtilService, LoadingAnimationUtilService, me,
    album, photo, yesnopopin, notification, pubsub, PUBSUB, navigation) {
    'use strict';

    const rotate0 = function() {
      return rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };

    $scope.rotation = 0;
    angular.element('#rotated-img')[0].onload = function() {
      return rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };
    // TODO: Remove
    $scope.objectType = 'photo';
    // TODO: Remove
    $scope.userId = me.id;
    $scope.user = me;

    $scope.viewedUserId = $stateParams.user_id;
    // TODO: Remove
    $scope.albumId = album.id;
    // TODO: Remove
    $scope.photoId = photo.id;

    $scope.album = album;
    $scope.photo = photo;
    $scope.photo.type = 'photo';
    $scope.object = $scope.photo;

    $scope.root = $stateParams.root != null && $stateParams.root !== '';
    $scope.listPageUrl = $state.href('u.albums-photos-likes', {
      user_id: $scope.viewedUserId,
      album_id: album.id,
      photo_id: photo.id
    });
    angular.element($window).bind('resize', rotate0);
    $scope.$on('$destroy', function() {
      angular.element($window).off('resize', rotate0);
      return $document.off('keyup');
    });
    $scope.showCommentsView = $state.current.name === 'u.albums-photos-comments';
    if ($state.current.name === 'u.albums-photos-show-fullscreen') {
      $scope.slideshowMode = true;
      $document.off('keyup');
      $document.on('keyup', function(e) {
        if (e.originalEvent.keyCode === 27) {
          $scope.closeSlideshowMode();
        }
      });
      Album.load_slideshow({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId
      }).$promise.then(function(response) {
          let slidesString = '';
          let startSlideIndex = null;
          angular.forEach(response, function(value, key) {
            slidesString += '<a class="rsImg" href="' + value.url_original + '">';
            if (value.description) {
              slidesString += value.description;
            }
            slidesString += '</a>';
            if (value.id === $scope.photoId) {
              startSlideIndex = key;
            }
          });
          const royalSlider = angular.element('.royalSlider');
          royalSlider.royalSlider({
            fullscreen: {
              enabled: true,
              nativeFS: false
            },
            autoPlay: {
              enabled: true,
              pauseOnHover: false,
              stopAtAction: false,
              delay: 6000
            },
            controlNavigation: 'none',
            autoScaleSlider: true,
            loop: true,
            globalCaption: true,
            startSlideId: startSlideIndex,
            numImagesToPreload: 2,
            keyboardNavEnabled: true,
            fadeinLoadedSlide: true,
            autoScaleSliderWidth: '100%',
            autoScaleSliderHeight: '100%',
            sliderDrag: false,
            sliderTouch: false,
            slides: slidesString,
            navigateByClick: false,
            usePreloader: true
          });
          $scope.response = response;
          $scope.slider = royalSlider.data('royalSlider');
          $scope.slider.ev.on('rsAfterSlideChange', function() {
            if ($scope.slideshowMode) {
              if (!$scope.$$phase) {
                return $scope.$apply();
              }
            }
          });
        });
      angular.element('#prevSlide')[0].addEventListener('click', function() {
        $scope.slider.prev();
      }, false);
      angular.element('#nextSlide')[0].addEventListener('click', function() {
        $scope.slider.next();
      }, false);
      angular.element('#playSlide')[0].addEventListener('click', function() {
        $scope.slider.startAutoPlay();
        angular.element('#playSlide')[0].style.display = 'none';
        angular.element('#pauseSlide')[0].style.display = 'inline-block';
      }, false);
      angular.element('#pauseSlide')[0].addEventListener('click', function() {
        $scope.slider.stopAutoPlay();
        angular.element('#playSlide')[0].style.display = 'inline-block';
        angular.element('#pauseSlide')[0].style.display = 'none';
      }, false);
    } else {
      $document.off('keyup');
      $document.on('keyup', function(e) {
        if (!ModalManager.isOpen()) {
          if (e.originalEvent.keyCode === 37) {
            $scope.goPreviousPhoto();
          }
          if (e.originalEvent.keyCode === 39) {
            return $scope.goNextPhoto();
          }
        }
      });
      $scope.slideshowMode = false;
    }

    $scope.setAsProfileImage = function() {
      return Photo.set_as_avatar({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: $scope.photoId
      }).$promise.then(function(response) {
          navigation.go('u.profile-photos-crop', {user_id: $scope.viewedUserId, photo_id: response.avatar.id});
        });
    };

    $scope.goPreviousPhoto = function() {
      return Photo.get_previous_photo({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: $scope.photoId
      }).$promise.then(function(photo) {
          navigation.go('u.albums-photos-show', {
            user_id: $scope.viewedUserId,
            album_id: $scope.albumId,
            photo_id: photo.id
          });
        });
    };
    pubsub.subscribe(PUBSUB.ALBUM.SHOW.PHOTO.PREVIOUS, $scope.goPreviousPhoto, $scope);

    $scope.goNextPhoto = function() {
      return Photo.get_next_photo({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: $scope.photoId
      }).$promise.then((photo) => {
          navigation.go('u.albums-photos-show', {
            user_id: $scope.viewedUserId,
            album_id: $scope.albumId,
            photo_id: photo.id
          });
        });
    };
    pubsub.subscribe(PUBSUB.ALBUM.SHOW.PHOTO.NEXT, $scope.goNextPhoto, $scope);

    $scope.goPreviousFullscreenPhoto = function() {
      return Photo.get_previous_photo({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: $scope.photoId
      }).$promise.then((photo) => {
        navigation.go('u.albums-photos-show-fullscreen', {
          user_id: $scope.viewedUserId,
          album_id: $scope.albumId,
          photo_id: photo.id
        });
      });
    };

    $scope.goNextFullscreenPhoto = function() {
      return Photo.get_next_photo({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: $scope.photoId
      }).$promise.then((photo) => {
        navigation.go('u.albums-photos-show-fullscreen', {
          user_id: $scope.viewedUserId,
          album_id: $scope.albumId,
          photo_id: photo.id
        });
      });
    };

    $scope.openSlideshowMode = () => {
      navigation.go('u.albums-photos-show-fullscreen', {
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId,
        photo_id: $scope.photoId
      });
    };
    pubsub.subscribe(PUBSUB.ALBUM.SHOW.PHOTO.SLIDE_SHOW, $scope.openSlideshowMode, $scope);

    $scope.closeSlideshowMode = function() {
      let photoId;
      $scope.slider.destroy();
      if ($scope.root != null && $scope.root === true) {
        navigation.go('u.albums-show', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
      } else {
        photoId = $scope.response[$scope.slider.currSlideId].id;
        navigation.go('u.albums-photos-show', {
          user_id: $scope.viewedUserId,
          album_id: $scope.albumId,
          photo_id: photoId
        });
      }
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.rotateLeft = function() {
      $scope.rotation = ($scope.rotation - 90) % 360;
      rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };
    pubsub.subscribe(PUBSUB.ALBUM.SHOW.PHOTO.ROTATE_LEFT, $scope.rotateLeft, $scope);

    $scope.rotateRight = function() {
      $scope.rotation = ($scope.rotation + 90) % 360;
      rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };
    pubsub.subscribe(PUBSUB.ALBUM.SHOW.PHOTO.ROTATE_RIGHT, $scope.rotateRight, $scope);

    $scope.validateRotation = function() {
      LoadingAnimationUtilService.activate();
      rotationUtilService.validateRotation($scope, $scope.rotation);
    };

    $scope.cancelRotation = function() {
      $scope.rotation = 0;
      rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };

    $scope.openPhotoDescriptionPopup = function() {
      const modalInstance = ModalManager.open({
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

    $scope.openDeletePhotoPopup = function() {
      yesnopopin.open('DELETE_PHOTO_CONFIRMATION_TITLE').then(function() {
        Photo.delete({user_id: $scope.viewedUserId, album_id: $scope.albumId, photo_id: $scope.photoId})
          .$promise.then(function() {
            notification.add('PHOTO_DELETED_SUCCESS_MSG');
            navigation.go('u.albums-show', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
          });
      });
    };

    pubsub.subscribe(PUBSUB.ALBUM.SHOW.PHOTO.DELETE, $scope.openDeletePhotoPopup, $scope);

    $scope.openPhotosMobileOptionsPopup = function() {
      ModalManager.open({
        templateUrl: '/scripts/albums/controllers/PopupAlbumsPhotosMobileOptions.html',
        controller: 'PopupAlbumsPhotosMobileOptionsController',
        scope: $scope
      });
    };
  });

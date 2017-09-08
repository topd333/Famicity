angular.module('famicity')
  .controller('ProfilePhotosItemController', function(
    $scope, $state, $rootScope, $location, $stateParams,
    ModalManager, $window, $document, LoadingAnimationUtilService,
    profileService, avatarService, rotationUtilService, notification,
    configuration, me, avatar, yesnopopin, Avatar, pubsub, PUBSUB) {
    'use strict';

    const rotate0 = function() {
      return rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };

    if ($state.current.name === 'u.profile-photos-item-comments') {
      $scope.showCommentsView = true;
      $rootScope.header = 'profile-photos-item-comment';
    } else {
      $scope.showCommentsView = false;
      $rootScope.header = 'profile-photos-item';
    }
    angular.element($window).bind('resize', rotate0);

    $scope.$on('$destroy', function() {
      return angular.element($window).off('resize', rotate0);
    });

    $scope.rotation = 0;

    angular.element('#rotated-img')[0].onload = function() {
      return rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };

    $scope.locationType = 'profile';
    $scope.objectType = 'avatar';

    $scope.user = $scope.me = me;

    $scope.viewedUserId = $stateParams.user_id;
    $scope.photoId = $stateParams.photo_id;
    $scope.objectId = $stateParams.photo_id;
    $scope.root = $stateParams.root != null && $stateParams.root !== '';

    $scope.listPageUrl = $state.href('user-avatars-likes', {
      user_id: $scope.viewedUserId,
      photo_id: $stateParams.photo_id
    });

    $scope.avatar = avatar;

    if ($state.current.name === 'u.profile-photos-item-fullscreen') {
      $scope.slideshowMode = true;
      $document.off('keyup');
      $document.on('keyup', function(e) {
        if (e.originalEvent.keyCode === 27) {
          $scope.closeSlideshowMode();
        }
      });
      avatarService.loadSlideshow($scope.viewedUserId, $scope, function(response) {
        const avatars = response.avatars;
        let slidesString = '';
        let slideStartKey = 0;
        angular.forEach(avatars, function(value, key) {
          if (value.id === parseInt($scope.photoId, 10)) {
            slideStartKey = key;
          }
          slidesString += '<a class="rsImg" href="' + value.url_original + '">';
          if (value.description) {
            slidesString += value.description;
          }
          slidesString += '</a>';
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
          startSlideId: slideStartKey,
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
        if (e.originalEvent.keyCode === 37) {
          $scope.goPreviousAvatar();
        }
        if (e.originalEvent.keyCode === 39) {
          return $scope.goNextAvatar();
        }
      });
      $scope.slideshowMode = false;
    }

    $scope.setAsProfileImage = function() {
      $state.go('u.profile-photos-crop', {user_id: $scope.viewedUserId, photo_id: $scope.photoId});
    };

    $scope.addComment = function(comment) {
      return $scope.avatar.comments.push(comment);
    };

    $scope.editComment = function(comment) {
      return angular.forEach($scope.avatar.comments, function(value, key) {
        if (value.id === comment.id) {
          $scope.avatar.comments[key] = comment;
        }
      });
    };

    $scope.deleteComment = function(commentId) {
      return angular.forEach($scope.avatar.comments, function(value, key) {
        if (value.id === commentId) {
          delete $scope.avatar.comments[key];
          return $scope.avatar.comments.splice(key, 1);
        }
      });
    };

    $scope.rotateLeft = function() {
      $scope.rotation = ($scope.rotation - 90) % 360;
      rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };
    pubsub.subscribe(PUBSUB.PROFILE.SHOW.PHOTO.ROTATE_LEFT, $scope.rotateLeft, $scope);

    $scope.rotateRight = function() {
      $scope.rotation = ($scope.rotation + 90) % 360;
      rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };
    pubsub.subscribe(PUBSUB.PROFILE.SHOW.PHOTO.ROTATE_RIGHT, $scope.rotateRight, $scope);

    $scope.validateRotation = function() {
      let rotation = 0;
      console.log('validateRotation');
      LoadingAnimationUtilService.activate();
      switch ($scope.rotation) {
        case 90:
        case -270:
          rotation = 1;
          break;
        case 180:
        case -180:
          rotation = 2;
          break;
        case 0:
        case -0:
          rotation = 0;
          break;
        case 270:
        case -90:
          rotation = 3;
          break;
        default:
          rotation = 1;
          break;
      }
      avatarService.update($scope.viewedUserId, $scope.photoId, {rotation}, $scope, function(response) {
        $scope.avatar = response.avatar;
        $scope.rotation = 0;
        LoadingAnimationUtilService.deactivate();
      });
    };

    $scope.cancelRotation = function() {
      $scope.rotation = 0;
      rotationUtilService.rotate(angular.element('#photo-wrapper')[0], angular.element('#rotated-img')[0], $scope.rotation);
    };

    $scope.goPreviousAvatar = function() {
      avatarService.getPreviousAvatar($scope.viewedUserId, $scope.photoId, $scope, function(avatar) {
        $state.go('u.profile-photos-item', {user_id: $scope.viewedUserId, photo_id: avatar.id});
      });
    };
    pubsub.subscribe(PUBSUB.PROFILE.SHOW.PHOTO.PREVIOUS, $scope.goPreviousAvatar, $scope);

    $scope.goNextAvatar = function() {
      avatarService.getNextAvatar($scope.viewedUserId, $scope.photoId).then(function(avatar) {
        $state.go('u.profile-photos-item', {user_id: $scope.viewedUserId, photo_id: avatar.id});
      });
    };
    pubsub.subscribe(PUBSUB.PROFILE.SHOW.PHOTO.NEXT, $scope.goNextAvatar, $scope);

    $scope.goPreviousFullscreenAvatar = function() {
      avatarService.getPreviousAvatar($scope.viewedUserId, $scope.photoId, $scope, function(avatar) {
        $state.go('u.profile-photos-item-fullscreen', {user_id: $scope.viewedUserId, photo_id: avatar.id});
      });
    };

    $scope.goNextFullscreenAvatar = function() {
      avatarService.getNextAvatar($scope.viewedUserId, $scope.photoId).then(function(avatar) {
        $state.go('u.profile-photos-item-fullscreen', {user_id: $scope.viewedUserId, photo_id: avatar.id});
      });
    };

    $scope.openSlideshowMode = function() {
      $state.go('u.profile-photos-item-fullscreen', {
        user_id: $scope.viewedUserId,
        photo_id: $scope.photoId}
      );
    };
    pubsub.subscribe(PUBSUB.PROFILE.SHOW.PHOTO.SLIDE_SHOW, $scope.openSlideshowMode, $scope);

    $scope.closeSlideshowMode = function() {
      let photoId;
      $scope.slider.destroy();
      if ($scope.root != null && $scope.root === true) {
        $state.go('u.profile-photos', {user_id: $scope.viewedUserId});
      } else {
        photoId = $scope.response.avatars[$scope.slider.currSlideId].id;
        $state.go('u.profile-photos-item', {user_id: $scope.viewedUserId, photo_id: photoId});
      }
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.openAvatarPhotoDescriptionPopup = function() {
      ModalManager.open({
        templateUrl: '/views/popup/popup_avatar_photo_description.html',
        controller: 'AvatarPhotoDescriptionPopupController',
        scope: $scope
      });
    };

    $scope.openDeleteAvatarPopup = function() {
      yesnopopin.open('DELETE_PHOTO_CONFIRMATION_TITLE').then(function() {
        Avatar.delete({user_id: $scope.viewedUserId, avatar_id: $scope.avatar.id}).$promise.then(function() {
          notification.add('AVATAR_DELETED_SUCCESS_MSG');
          $state.go('u.profile-photos', {user_id: $scope.viewedUserId});
        });
      });
    };

    pubsub.subscribe(PUBSUB.PROFILE.SHOW.PHOTO.DELETE, $scope.openDeleteAvatarPopup, $scope);

    $scope.openPhotosMobileOptionsPopup = function() {
      ModalManager.open({
        templateUrl: '/scripts/albums/controllers/PopupAlbumsPhotosMobileOptions.html',
        controller: 'AvatarsMobileOptionsPopupController',
        scope: $scope
      });
    };
  });

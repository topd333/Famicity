angular.module('famicity').controller('WizardProfileController', function(
  $scope, $state, $filter, $stateParams, $hello,
  $timeout, userService, sessionManager, $translate, $location,
  notification, configuration, pubsub, PUBSUB, ROUTE, $moment, $q) {
  'use strict';

  const log = debug('fc-WizardProfileController');

  $scope.submitted = false;
  $scope.locale = $translate.use();
  $scope.formInProgress = false;

  const dbg = false;

  const userAgent = navigator.userAgent.toUpperCase();
  log('userAgent=%o', userAgent);
  const isChrome = userAgent.indexOf('CHROME') >= 0;
  log('isChrome=%o', isChrome);
  const isAndroid = userAgent.indexOf('ANDROID') >= 0;
  log('isAndroid=%o', isAndroid);
  const isSafari = !isChrome && userAgent.indexOf('SAFARI') >= 0;
  log('isSafari=%o', isSafari);
  const isAppleDevice = isMobile.apple.device;
  log('isAppleDevice=%o', isAppleDevice);
  $scope.photoEnabled = dbg || isAndroid || !(isAppleDevice || isSafari);
  log('photoEnabled=%o', $scope.photoEnabled);
  // $scope.photoEnabled = true;

  const today = new Date();
  const minDay = new Date(today);
  // const ageMax = 150;
  // var yearMin = today.getFullYear() - ageMax;
  const yearMin = 0;
  minDay.setYear(yearMin);
  const yearMax = today.getFullYear();

  $scope.validYear = function(year) {
    if (!angular.isNumber(year)) {
      year = parseInt(year, 10);
    }
    if (year < today.getFullYear() - 2000) {
      year = 2000 + year;
    }
    if (year < today.getFullYear() - 1900) {
      year = 1900 + year;
    }
    if (year >= yearMin && year <= yearMax) {
      return year;
    }
  };

  $scope.submit = function() {
    const promise = $q((resolve, reject) => {
      $scope.submitted = true;

      userService.initialUpdate({
        email: $scope.user.email || null,
        sex: $scope.user.sex,
        first_name: $scope.user.first_name,
        last_name: $scope.user.last_name,
        birth_date: $scope.user.birth_date ? $moment($scope.user.birth_date).forServer() : null
      })
        .then(function(response) {
          $scope.user = response.user;
          sessionManager.setGlobalState(response.user.global_state);
          $scope.uploadPhoto()
          .then(() => {
            resolve();
            $scope.nextStep();
          })
          .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

    return [promise];
  };

  let photoUploader = null;

  $scope.uploaded = function(uploader) {
    photoUploader = uploader;
  };

  $scope.uploadPhoto = function() {
    if (photoUploader) {
      return $q((resolve) => {
        pubsub.subscribe(PUBSUB.UPLOADER.ON_COMPLETE, resolve, $scope);
        photoUploader.setEndpoint(configuration.api_url + '/users/' + sessionManager.getUserId() + '/avatars');
        photoUploader.uploadStoredFiles();
      });
    } else {
      return $q.resolve();
    }
  };
  $scope.formStatus = {
    cropping: false
  };

  const invitation = sessionManager.getInvitation();

  function getObjectUrl(invitation) {
    switch (invitation.type) {
      case 'album':
        return $state.href('u.albums-show', {user_id: invitation.user.id, album_id: invitation.id});
      case 'album_bio':
        return $state.href('u.albums-show', {user_id: invitation.user_bio.id, album_id: invitation.id});
      case 'biography':
        return $state.href('u.blog.get', {user_id: invitation.user.id, post_id: invitation.id});
      case 'message':
        return $state.href(ROUTE.MESSAGE.GET, {message_id: invitation.id});
      case 'profile':
        return $state.href('u.profile', {user_id: invitation.user.id});
      case 'tree':
        return $state.href('u.tree', {user_id: $scope.user.id});
      case 'event':
        return $state.href('u.event-show', {user_id: invitation.user.id, event_id: invitation.id});
      case 'post':
        return $state.href('u.blog.get', {user_id: invitation.user.id, post_id: invitation.id});
      default:
        return $state.href('u.profile', {user_id: invitation.id});
    }
  }

  $scope.nextStep = function() {
    if (invitation && (!invitation.type || invitation.type !== 'invitation')) {
      const url = getObjectUrl(invitation);
      $location.path(url);
      sessionManager.remove('invitation');
      pubsub.publish(PUBSUB.USER.ACTIVATED);
    } else {
      $scope.goToNextStep();
    }
  };
});

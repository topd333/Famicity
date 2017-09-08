angular.module('famicity')
  .controller('InternalWizardAbstractController', function($scope, userManager, profile, sessionManager) {
    'use strict';

    const log = debug('fc-InternalWizardAbstractController');
    $scope.$parent.menuDisabled = true;

    $scope.$parent.menuDisabled = true;
    $scope.enableMenu = function() {
      $scope.$parent.menuDisabled = false;
    };

    $scope.user = profile || {};
    $scope.provider = profile.provider || null;

    $scope.showWizardGedcomStep = userManager.getWizardGedcomStep();
    log('profile.received_invitation=%o', profile.received_invitation);
    $scope.showInvitationStep = profile.received_invitation && !$scope.showWizardGedcomStep;
    const invitation = sessionManager.getInvitation();
    log('invitation=%o', invitation);
    $scope.fromInvitation = invitation && (!invitation.type || invitation.type !== 'invitation');
    log('show gedcom step: %o', $scope.showWizardGedcomStep);
    log('show invitations step: %o', $scope.showInvitationStep);
  });

angular.module('famicity').controller('InternalWizardProfileController', function(
  $scope, $state, $filter, $stateParams, $hello,
  $timeout, userService, sessionManager, $translate) {
  'use strict';

  $scope.submitted = false;
  $scope.locale = $translate.use();
  $scope.init = function() {
    $scope.userId = sessionManager.getUserId();
  };
  $scope.submit = function() {
    $scope.submitted = true;
    userService.initialUpdate({
      email: $scope.user.email || null,
      sex: $scope.user.sex,
      first_name: $scope.user.first_name,
      last_name: $scope.user.last_name,
      birth_date: $filter('date')($scope.user.birth_date, 'yyyy-MM-dd')
    }).then(function(response) {
      sessionManager.setGlobalState(response.user.global_state);
      $state.go('wizard-avatar');
    });
  };
});

angular.module('famicity')
  .controller('InternalWizardAvatarController', function(
    $scope, $state, $location, sessionManager, userManager,
    notification, configuration, pubsub, PUBSUB, ROUTE, me) {
    'use strict';

    let uploader = null;
    const invitation = sessionManager.getInvitation();
    $scope.uploadOngoing = false;
    $scope.uploadId = null;
    $scope.uploadPercent = null;
    $scope.userId = me.id;
    uploader = new qq.FineUploaderBasic({
      button: document.getElementById('photo-add-local'),
      multiple: false,
      cors: {
        expected: true
      },
      validation: {
        acceptFiles: '.png, .jpg, .jpeg, .gif, .tiff',
        allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'tiff']
      },
      scaling: {
        sendOriginal: false,
        includeExif: true,
        orient: true,
        sizes: [
          {
            name: 'original',
            maxSize: 2400
          }
        ]
      },
      request: {
        endpoint: configuration.api_url + '/users/' + sessionManager.getUserId() + '/avatars',
        customHeaders: {
          Authorization: 'Bearer ' + sessionManager.getToken()
        },
        params: {
          from: 'upload'
        }
      },
      callbacks: {
        onUpload(id) {
          $scope.uploadOngoing = true;
          $scope.uploadId = id;
        },
        onProgress(id, name, uploadedBytes, totalBytes) {
          $scope.$applyAsync(function() {
            $scope.uploadPercent = (uploadedBytes / totalBytes * 100).toFixed(2);
          });
        },
        onComplete() {
          $scope.uploadOngoing = false;
          notification.add('UPLOAD_FINISHED');
          $scope.nextStep();
        },
        onCancel() {
          $scope.uploadOngoing = false;
          $scope.uploadId = null;
          $scope.uploadPercent = null;
        },
        onError(id, name, errorReason, xhr) {
          log('error, id: %o, name: %o, errorReason: %o, xhr: %o', id, name, errorReason, xhr);
          if (!xhr || xhr.status !== 200) {
            $scope.uploadOngoing = false;
            notification.add('UPLOAD_FINISHED');
            $scope.nextStep();
          }
          if (/invalid extension/.test(errorReason)) {
            notification.add('INCORRECT_FILE_FORMAT', {warn: true});
          }
        }
      }
    });

    $scope.init = function() {
    };

    $scope.cancelUpload = function() {
      if ($scope.uploadOngoing) {
        uploader.cancel($scope.uploadId);
      }
    };

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
          return $state.href('u.tree', {user_id: $scope.userId});
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
      } else if ($scope.showInvitationStep) {
        $state.go('wizard-received-invitations');
      } else if ($scope.showWizardGedcomStep) {
        $state.go('wizard-gedcom');
      } else {
        $state.go('wizard-find-friends');
      }
    };
    $scope.$on('$destroy', function() {
      uploader = null;
    });
  });

angular.module('famicity').controller('InternalWizardFindFriendsController', function($scope, $state, $interval, me) {
  'use strict';

  $scope.init = function() {
    $scope.userId = me.id;
  };
  $scope.nextStep = function() {
    $state.go('wizard-tree-info');
  };
});

angular.module('famicity').controller('InternalWizardInviteStepController', function(
  $scope, $location, Directory, Invitation, LoadingAnimationUtilService, me, $state) {
  'use strict';

  $scope.init = function() {
    LoadingAnimationUtilService.resetPromises();
    $scope.selectedMatch = [];
    $scope.selectedNoMatch = [];
    $scope.userId = me.id;
    $scope.me = me;
    $scope.search = {criteria: ''};
    $scope.customSearchCriteria = '';
    Directory.forInvitation({user_id: $scope.userId}).$promise.then(function(response) {
      $scope.match = $scope.selectedMatch = response.match;
      $scope.noMatch = response.no_match;
      LoadingAnimationUtilService.deactivate();
      if ($scope.match.length === 0 && $scope.noMatch.length === 0) {
        $scope.nextStep();
      }
    });
  };

  $scope.launchInvitation = function() {
    const usersToInvite = $scope.selectedMatch.concat($scope.selectedNoMatch).map(function(user) {
      return user.id;
    });
    Invitation.sendMultiple({
      user_id: $scope.userId,
      user_ids: usersToInvite
    }).$promise.then(function() {
        $scope.nextStep();
      });
  };

  $scope.nextStep = function() {
    $state.go('wizard-tree-info');
  };
});

angular.module('famicity').controller('InternalWizardGedcomController', function(
  $scope, $location, $timeout, ModalManager, sessionManager,
  userService, gedcomUploadService, configuration, pubsub, $state,
  yesnopopin, me, PUBSUB) {
  'use strict';
  var log = debug('fc-InternalWizardGedcomController');

  $scope.userId = me.id;

  $scope.init = function() {
    this.userService = userService;
    $scope.preloaded_file = null;
    $scope.upload_settings = {
      priority_to: true,
      erase_tree: true
    };
    this.userService.optionsToShow(sessionManager.getUserId()).then(function(response) {
      log('optionsToShow=%o', response);
      $scope.optionsToShow = response.option_to_show;
    });
    $scope.$on('gedcomUploaderOnStatusChange', function(event, args) {
      if (args.newStatus === 'submitted') {
        $scope.$applyAsync(function() {
          $scope.preloaded_file = gedcomUploadService.getFile(args.id);
        });
      }
    });
    return gedcomUploadService.setParams(document.getElementById('uploadBtn'), configuration.api_url + '/users/' + sessionManager.getUserId() + '/gedcom_imports');
  };

  $scope.deletePreloadedFile = function() {
    gedcomUploadService.cancelAll();
    $scope.preloaded_file = null;
  };
  $scope.nextStep = function() {
    yesnopopin.open('SKIP_WIZARD_GEDCOM_ALERT').then(function() {
      pubsub.publish(PUBSUB.USER.ACTIVATED);
      $scope.$parent.$parent.menuDisabled = false;
      $state.go('u.tree', {user_id: $scope.userId});
    });
  };
  $scope.startUpload = function() {
    let tmp_priority_to;
    if ($scope.preloaded_file) {
      if ($scope.optionsToShow.priority_to) {
        tmp_priority_to = 'gedcom';
        if (!$scope.upload_settings.priority_to) {
          tmp_priority_to = 'famicity';
        }
        gedcomUploadService.addParams({
          priority_to: tmp_priority_to
        });
      }
      if ($scope.optionsToShow.erase_tree) {
        gedcomUploadService.addParams({
          erase_tree: $scope.upload_settings.erase_tree
        });
      }
      pubsub.publish(PUBSUB.USER.ACTIVATED);
      $state.go('u.gedcom-upload', {user_id: sessionManager.getUserId()});
    }
  };
});

angular.module('famicity').controller('InternalWizardTreeInfoController', function(
  $scope, $rootScope, WizardService, notification, pubsub,
  $location, $state, sessionManager, PUBSUB) {
  'use strict';

  $scope.init = function() {
  };
  $scope.nextStep = function(is_mobile) {
    if (is_mobile) {
      $state.go('u.home');
    } else {
      $state.go('u.tree', {user_id: sessionManager.getUserId()});
    }
    pubsub.publish(PUBSUB.USER.ACTIVATED);
  };
});

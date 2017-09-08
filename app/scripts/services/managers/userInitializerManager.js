angular.module('famicity').service('userInitializerManager',
function($http, pubsub, sessionManager, NotificationService, userManager,
  $q, $timeout, counters, PUBSUB, Refresher, ModalLauncher) {
  'use strict';
  const log = debug('fc-initializer');

  const userInitializerManager = {};
  let initialized = false;
  let userInformation;

  function parseCounters(counts) {
    counts.message = counts.message || 0;
    counts.notification = counts.notification || 0;
    counts.invitation = counts.invitation || 0;
    counts.tree_user_match = counts.tree_user_match || 0;
    $timeout(function() {
      counters.setUnreadMessages(counts.message);
      counters.setUnreadInvitations(counts.invitation);
      counters.setUnreadNotifications(counts.notification);
      counters.setTreeMatchings(counts.tree_user_match);
    }, 500);
  }

  function invitationTutorialModal() {
    return {
      templateUrl: '/scripts/directory/invitations/received/tutorial/popup_invite_tutorial.html'
    };
  }
  ModalLauncher.register('invitation', invitationTutorialModal);

  function invitationReceivedModal(info) {
    return {
      templateUrl: '/scripts/directory/invitations/received/reminder/popup_received_invitation.html',
      controller: /*@ngInject*/ function($scope) {
        $scope.users = info.popins.received_invitations;
        //  var invitationService = InvitationService;
        //  var invitationIds = $scope.users.map((invitation) => invitation.id);
        //
        //  $scope.acceptMultiple = function() {
        //    invitationService.acceptMultiple(invitationIds).$promise.then(function() {
        //      notification.add('INVITATIONS_ACCEPTED_SUCCESS_MSG');
        //      $modalInstance.close();
        //    });
        //  };
      }
      // scope: $scope
    };
  }
  ModalLauncher.register('received_invitations', invitationReceivedModal);

  userInitializerManager.initialize = function() {
    return $q((resolve, reject) => {
      if (!userInformation) {
        const sessionUser = sessionManager.getUser();
        if (sessionUser.globalState === 'active') {
          log('initializing with userId: %o', sessionUser.userId);

          NotificationService.getAllNotifications().then(function(allNotifications) {
            pubsub.publish(PUBSUB.USER.CONNECT);
            pubsub.publish(PUBSUB.CHAT.CONNECT, sessionUser.userId, {pooled: true});
            userInformation = allNotifications.user;
            parseCounters(userInformation.pastilles);
            initialized = true;
            resolve(userInformation);
            if (Refresher.isChatConnectRequired()) {
              pubsub.publish(PUBSUB.CHAT.CONNECT, sessionUser.userId);
            }
            if (Refresher.isPopupsRequired()) {
              pubsub.publish(PUBSUB.HELP.POPINS, userInformation);
            }
            pubsub.publish(PUBSUB.PUSH.CONNECT, {
              userId: sessionUser.userId
            }, {pooled: true});
            Refresher.refreshed();
          }).catch(function(ex) {
            reject(ex);
          });
        } else {
          reject('User %o is not activated', sessionUser);
        }
      } else {
        initialized = true;
        resolve(userInformation);
      }
    });
  };

  userInitializerManager.updateAvatar = function(userId, avatarUrl) {
    if (userInformation.infos.id === userId) {
      userInformation.infos.avatar_url = avatarUrl;
    }
  };

  userInitializerManager.isInitialized = function() {
    return initialized;
  };

  /**
   * Force to refresh user info
   */
  userInitializerManager.invalidate = function() {
    userInformation = null;
    initialized = false;
  };

  pubsub.subscribe(PUBSUB.USER.ACTIVATED, function() {
    Refresher.delayPopups();
    Refresher.delayChatConnect();
    userInitializerManager.initialize(true);
  });

  pubsub.subscribe(PUBSUB.USER.DISCONNECT, function() {
    initialized = false;

    pubsub.publish(PUBSUB.NOTIFICATIONS.DISCONNECT);
    pubsub.publish(PUBSUB.NOTIFICATIONS.DISABLE);
    pubsub.publish(PUBSUB.CHAT.DISCONNECT);
    // pubsub.publish(PUBSUB.CHAT.DISABLE);

    sessionManager.remove('user');

    userManager.resetUserParameterInfo();
    userInformation = null;
    delete $http.defaults.headers.common.Authorization;

    // add afklImageContainer for presentation lazy load
    const scroll = angular.element('#scroll');
    scroll.data('afklImageContainer', scroll);
  });

  return userInitializerManager;
});

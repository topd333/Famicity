angular.module('famicity')
  .controller('UnsubscribeController', function(
    $scope, $state, $http, sessionManager, pubsub,
    profileService, userService, settingsService, userManager, LoadingAnimationUtilService,
    notification, Provider, $hello, me, PUBSUB) {
    'use strict';
    const log = debug('fc-UnsubscribeController');

    $scope.userId = $scope.viewedUserId = me.id;
    $scope.settingsId = me.settings.id;

    LoadingAnimationUtilService.resetPromises();
    profileService.getBasicProfile($scope.userId, 'short', $scope);
    $scope.isSettingsPage = true;
    $scope.reason = null;
    $scope.formInProgress = false;

    $scope.deleteAccount = function() {
      const promises = [];
      if ($scope.unsubscriptionForm.$valid) {
        promises.push(userService.destroy($scope.userId, {
          reason: $scope.reason
        }).then(function() {
          const providers = Provider.query(function() {
            log('providers: %o', providers);
            for (let provider of providers) {
              $hello.revokePermissions(provider.name);
            }
          });
          sessionManager.remove('loginEmail');
          pubsub.publish(PUBSUB.USER.DISCONNECT);
          notification.add('UNSUBSCRIBED_SUCCESS_MSG');
          $state.go('public.base');
        }));
      } else {
        notification.add('INVALID_FORM', {warn: true});
      }
      return promises;
    };
  });

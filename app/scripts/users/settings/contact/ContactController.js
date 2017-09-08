angular.module('famicity')
  .controller('ContactController', function(
    $scope, $state, $location, $stateParams, profileService,
    LoadingAnimationUtilService, Message, notification, me, ROUTE) {
    'use strict';
    $scope.userId = $scope.viewedUserId = me.id;
    $scope.settingsId = me.settings.id;

    LoadingAnimationUtilService.resetPromises();
    profileService.getBasicProfile($scope.userId, 'short', $scope);
    $scope.isSettingsPage = true;
    $scope.formInProgress = false;

    $scope.submit = function() {
      var message, messagePromise, promises;
      promises = [];
      if ($scope.contactForm.$valid) {
        message = new Message({
          message: {
            subject: $scope.message.title,
            body: $scope.message.body
          },
          is_team: '1'
        });
        messagePromise = message.$save({
          user_id: $scope.userId
        }).then(function() {
          $state.go(ROUTE.MESSAGE.GET, {
            message_id: message.message.id
          });
          $scope.message = {};
        });
        promises.push(messagePromise);
      } else {
        notification.add('INVALID_FORM');
      }
      return promises;
    };
  });

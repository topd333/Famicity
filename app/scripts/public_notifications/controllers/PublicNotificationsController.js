angular.module('famicity')
  .controller('PublicNotificationsController', function(
    $scope, $rootScope, $stateParams, notification, PublicNotification) {
    'use strict';

    $scope.init = function() {
      $scope.submitted = false;
      $scope.notifications = PublicNotification.get({
        user_id: $stateParams.user_id,
        token: $stateParams.token
      });
    };

    $scope.submit = function() {
      $scope.submitted = true;
      PublicNotification.update({
        user_id: $stateParams.user_id,
        token: $stateParams.token
      }, $scope.notifications).$promise.then(function() {
          notification.add('SETTINGS_UPDATED_SUCCESS_MSG');
        });
    };
  });

angular.module('famicity')
  .controller('SettingsTermsController', function(
    $scope, $state, $location, $stateParams, profileService,
    settingsService, LoadingAnimationUtilService, me) {
    'use strict';
    $scope.userId = $scope.viewedUserId = me.id;
    $scope.settingsId = me.settings.id;
    $scope.init = function() {
      LoadingAnimationUtilService.resetPromises();
      profileService.getBasicProfile($scope.userId, 'short', $scope);
      $scope.isSettingsPage = true;
    };
  });

angular.module('famicity')
  .controller('SettingsPrivacyController', function(
    $scope, $state, $location, $stateParams, profileService,
    LoadingAnimationUtilService, me) {
    'use strict';
    $scope.userId = $scope.viewedUserId = me.id;
    $scope.settingsId = me.settings.id;

    LoadingAnimationUtilService.resetPromises();
    profileService.getBasicProfile($scope.userId, 'short', $scope);
    $scope.isSettingsPage = true;
  });

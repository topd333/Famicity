angular.module('famicity')
.controller('SettingsPrivacySearchEngineController', function(
$scope, $state, $location, $stateParams, profileService,
settingsService, LoadingAnimationUtilService, me, menuBuilder) {
  'use strict';
  $scope.userId = $scope.viewedUserId = me.id;
  $scope.settingsId = me.settings.id;

  LoadingAnimationUtilService.resetPromises();
  profileService.getBasicProfile($scope.userId, 'short', $scope);
  $scope.isSettingsPage = true;

  settingsService.showSettings($scope.userId, $scope.settingsId, 'is_in_search_engine').$promise.then(function(response) {
    $scope.isInSearchEngine = response.setting.is_in_search_engine;
  });

  $scope.submit = function() {
    settingsService.updateSettings($scope.userId, $scope.settingsId, {
      is_in_search_engine: $scope.isInSearchEngine
    });
  };
  menuBuilder.bind('submitAction', $scope.submit, $scope);
});

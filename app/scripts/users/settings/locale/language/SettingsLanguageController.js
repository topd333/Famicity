angular.module('famicity')
.controller('SettingsLanguageController', function(
$scope, $state, $location, $stateParams, profileService,
settingsService, userManager, LoadingAnimationUtilService, me, menuBuilder, userInitializerManager, NotificationService) {
  'use strict';
  $scope.userId = $scope.viewedUserId = me.id;
  $scope.settingsId = me.settings.id;

  LoadingAnimationUtilService.resetPromises();
  profileService.getBasicProfile($scope.userId, 'short', $scope);
  settingsService.showSettings($scope.userId, $scope.settingsId, 'default_language').$promise.then(function(response) {
    $scope.selectedLanguage = response.setting.default_language;
  });
  $scope.isSettingsPage = true;
  $scope.status = {isopen: false};

  $scope.toggleDropdown = function() {
    $scope.selectedLanguage = $scope.selectedLanguage === 'fr' ? 'en' : 'fr';
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.submit = () => {
    settingsService.updateSettings($scope.userId, $scope.settingsId, {default_language: $scope.selectedLanguage})
    .then(() => {
      userManager.changeLanguage($scope.selectedLanguage);
      userInitializerManager.invalidate();
      NotificationService.invalidate();
    });
  };
  menuBuilder.bind('submitAction', $scope.submit, $scope);
});

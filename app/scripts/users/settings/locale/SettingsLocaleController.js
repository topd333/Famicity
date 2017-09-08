angular.module('famicity')
.controller('SettingsLocaleController', function(
$scope, $state, $location, $locale, $stateParams,
profileService, settingsService, LoadingAnimationUtilService, me, menuBuilder) {
  'use strict';

  $scope.userId = $scope.viewedUserId = me.id;
  $scope.settingsId = me.settings.id;
  LoadingAnimationUtilService.resetPromises();
  profileService.getBasicProfile($scope.userId, 'short', $scope);
  $scope.isSettingsPage = true;
  $scope.weekDays = $locale.DATETIME_FORMATS.DAY;

  settingsService.showSettings($scope.userId, $scope.settingsId, 'default_language,first_day_of_week').$promise.then(function(response) {
    $scope.defaultLanguage = response.setting.default_language;
    $scope.firstDayOfWeek = response.setting.first_day_of_week;
  });
});

angular.module('famicity')
.controller('SettingsCalendarController', function(
$scope, $state, $location, $locale, $stateParams,
profileService, settingsService, LoadingAnimationUtilService, userManager,
me, menuBuilder) {
  'use strict';

  $scope.userId = $scope.viewedUserId = me.id;
  $scope.settingsId = me.settings.id;

  LoadingAnimationUtilService.resetPromises();
  profileService.getBasicProfile($scope.userId, 'short', $scope);
  settingsService.showSettings($scope.userId, $scope.settingsId, 'first_day_of_week').$promise.then(function(response) {
    $scope.firstDayOfWeek = response.setting.first_day_of_week;
  });
  $scope.isSettingsPage = true;
  $scope.weekDays = $locale.DATETIME_FORMATS.DAY;
  $scope.status = {
    isopen: false
  };

  $scope.selectDay = function(key) {
    $scope.firstDayOfWeek = key;
  };

  $scope.toggleDropdown = function() {
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.submit = function() {
    settingsService.updateSettings($scope.userId, $scope.settingsId, {
      first_day_of_week: $scope.firstDayOfWeek
    }).then(function() {
      userManager.setFirstDay($scope.firstDayOfWeek);
    });
  };
  menuBuilder.bind('submitAction', $scope.submit, $scope);
});

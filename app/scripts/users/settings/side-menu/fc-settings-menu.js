angular.module('famicity')
  .directive('fcSettingsMenu', function($location, sessionManager) {
  'use strict';
  return {
    restrict: 'E',
    scope: true,
    templateUrl: '/scripts/users/settings/side-menu/fc-settings-menu.html',
    link($scope, element, attrs) {
      $scope.settingsId = sessionManager.getSettingsId();
      $scope.userId = sessionManager.getUserId();
      $scope.currentSection = attrs['currentSection'];
    }
  };
});

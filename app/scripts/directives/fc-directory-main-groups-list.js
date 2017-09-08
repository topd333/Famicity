angular.module('famicity')
  .directive('fcDirectoryMainGroupsList', function(configuration, sessionManager) {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      groups: '=ngModel',
      selectionMode: '='
    },
    templateUrl: '/views/internal/select_group_list.html',
    link($scope) {
      // TODO: remove?
      $scope.userId = sessionManager.getUserId();
      $scope.selectionMode = $scope.selectionMode || false;
    }
  };
});

angular.module('famicity').directive('fcTooltipPopup', function() {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/scripts/common/tooltip-popup/views/fc-tooltip-popup.html',
    link($scope) {
      $scope.closed = false;
      $scope.close = function() {
        $scope.closed = true;
      };
    }
  };
});

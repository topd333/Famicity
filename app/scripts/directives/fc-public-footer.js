angular.module('famicity')
  .directive('fcPublicFooter', function() {
    'use strict';
    return {
      restrict: 'EA',
      templateUrl: '/views/public_footer.html',
      scope: {
        locale: '@'
      },
      link($scope) {
        var _ref;
        $scope.locale = (_ref = $scope.locale) != null ? _ref : null;
        window.log($scope.locale);
      }
    };
  });

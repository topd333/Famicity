angular.module('famicity')
  .directive('fcLeftColumnBlockHeader', function() {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        showBtn: '=?',
        action: '&?'
      },
      templateUrl: '/views/internal/left_column_block_header.html',
      link($scope, element, attrs) {
        $scope.showBtn = $scope.showBtn || false;
        attrs.$observe('styleApply', function(value) {
          if (value) {
            $scope.classApply = value;
          }
        });
      }
    };
  });

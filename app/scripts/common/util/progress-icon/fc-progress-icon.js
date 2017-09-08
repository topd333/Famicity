angular.module('famicity')
  .directive('fcProgressIcon', function() {
    'use strict';
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        iconClass: '@'
      },
      require: 'ngModel',
      templateUrl: '/scripts/common/util/progress-icon/fc-progress-icon.html',
      link(scope, elem, attrs, modelCtrl) {
        var update = function(value) {
          scope.progressStyle = {
            height: value / 100 + 'em'
          };
        };
        modelCtrl.$render = function() {
          update(modelCtrl.$viewValue);
        };
      }
    };
  });

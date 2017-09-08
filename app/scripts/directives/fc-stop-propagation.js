angular.module('famicity')
  .directive('fcStopPropagation', function() {
    'use strict';
    return {
      restrict: 'A',
      link(scope, element, attr) {
        element.bind(attr.stopPropagation, function(e) {
          e.stopPropagation();
        });
      }
    };
  });

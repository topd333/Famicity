angular.module('famicity').directive('fcAutosize', function() {
  'use strict';
  return {
    restrict: 'A',
    link(scope, element) {
      element.autosize();
    }
  };
});

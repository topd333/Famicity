angular.module('famicity').directive('fcAutoScrollBottom', function($window, $timeout, scrollService) {
  'use strict';
  return {
    restrict: 'A',
    link(scope, element) {
      if (scope.$last === true) {
        const scroll = $('#scroll')[0];
        $timeout(() => scrollService.scrollTo(element[0], 500, scroll), 100);
      }
    }
  };
});

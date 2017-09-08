angular.module('famicity').filter('startFrom', function() {
  'use strict';
  return function(input, start) {
    if (input) {
      start = Number(start);
      return input.slice(start);
    }
  };
});

angular.module('famicity').filter('multiplicationOp', function() {
  'use strict';
  return function(input, value, decimal) {
    var res;
    if (input) {
      res = (parseFloat(input) * value).toFixed(decimal);
    }
    return res;
  };
});

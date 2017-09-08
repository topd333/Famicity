angular.module('famicity').filter('capitalize', function() {
  'use strict';
  return function(stringToCapitalize) {
    var res;
    if (stringToCapitalize) {
      res = stringToCapitalize.substr(0, 1).toUpperCase() + stringToCapitalize.substr(1);
    }
    return res;
  };
});

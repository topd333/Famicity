angular.module('famicity').filter('timeOrDatePrefixFilter', function($filter) {
  'use strict';
  return function(dateTimestamp) {
    var date, today;
    today = new Date();
    date = new Date(dateTimestamp);
    if (today.getUTCDate() === date.getUTCDate() && today.getUTCMonth() === date.getUTCMonth() && today.getUTCFullYear() === date.getUTCFullYear()) {
      return $filter('translate')('AT');
    } else {
      return $filter('translate')('THE');
    }
  };
});

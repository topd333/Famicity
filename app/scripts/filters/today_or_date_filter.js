angular.module('famicity').filter('todayOrDateFilter', function(userManager, $filter) {
  'use strict';
  return function(dateTimestamp) {
    var date, today;
    today = new Date();
    date = new Date(dateTimestamp);
    if (today.getUTCDate() === date.getUTCDate() && today.getUTCMonth() === date.getUTCMonth() && today.getUTCFullYear() === date.getUTCFullYear()) {
      return $filter('translate')('TODAY');
    } else {
      return $filter('date')(dateTimestamp, 'shortDate');
    }
  };
});

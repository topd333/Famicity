angular.module('famicity').filter('timeOrDateFilter', function($filter, $translate) {
  'use strict';
  return function(dateTimestamp, prefix) {
    const today = new Date();
    const date = new Date(dateTimestamp);
    let value;
    prefix = typeof prefix !== 'undefined' && prefix !== null ? prefix : false;
    const isToday = today.getUTCDate() === date.getUTCDate() && today.getUTCMonth() === date.getUTCMonth() && today.getUTCFullYear() === date.getUTCFullYear();
    if (dateTimestamp) {
      if (isToday) {
        if (prefix) {
          value = $translate.instant('AT_SMALL_DATE', {
            date: $filter('date')(dateTimestamp, 'shortTime')
          });
        } else {
          value = $filter('date')(dateTimestamp, 'shortTime');
        }
      } else if (!isToday) {
        if (prefix) {
          value = $translate.instant('THE_SMALL_DATE', {
            date: $filter('date')(dateTimestamp, 'shortDate')
          });
        } else {
          value = $filter('date')(dateTimestamp, 'shortDate');
        }
      }
    } else {
      value = dateTimestamp;
    }
    return value;
  };
});

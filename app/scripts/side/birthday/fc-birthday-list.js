angular.module('famicity')
  .directive('fcBirthdayList', function($moment) {
    'use strict';
    return {
      scope: true,
      templateUrl: '/scripts/side/birthday/fc-birthday-list.html',
      restrict: 'E',
      link(scope) {
        scope.isToday = function(date) {
          return $moment.fromServer(date).isSame($moment(), 'day');
        };
      }
    };
  });

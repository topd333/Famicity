angular.module('famicity.calendar')
  .directive('fcEventsList', function() {
    'use strict';
    return {
      scope: true,
      templateUrl: '/scripts/side/events/fc-events-list.html',
      restrict: 'E'
    };
  });

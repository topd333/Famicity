angular.module('famicity')
  .directive('fcFeedEmpty', function() {
    'use strict';
    return {
      restrict: 'EA',
      scope: true,
      templateUrl: '/scripts/feed/fc-feed-empty.html'
    };
  });

angular.module('famicity')
  .directive('fcFeedHeader', function() {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        object: '='
      },
      templateUrl: '/scripts/feed/fc-feed-header.html'
    };
  });

angular.module('famicity.story')
  .directive('fcStoryList', function() {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/scripts/blog/directives/fc-story-list.html',
      scope: {
        stories: '='
      },
      link() {
      }
    };
  });

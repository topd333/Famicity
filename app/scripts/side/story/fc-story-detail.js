angular.module('famicity.story')
  .directive('fcStoryDetail', function(navigation, $timeout) {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/scripts/side/story/fc-story-detail.html',
      scope: {
        story: '='
      },
      link(scope) {
        scope.participate = function() {
          navigation.go('u.story.get', {id: scope.story.id})
            .then(() =>
              $timeout(() => angular.element('.inline-text:first').click())
          );
        };
      }
    };
  });

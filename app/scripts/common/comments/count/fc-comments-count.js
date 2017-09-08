angular.module('famicity')
  .directive('fcCommentsCount', () => {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/scripts/common/comments/count/fc-comments-count.html',
      scope: {
        object: '='
      }
    };
  });

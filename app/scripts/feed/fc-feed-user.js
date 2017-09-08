angular.module('famicity')
  .directive('fcFeedUser', function($state, ROUTE) {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        object: '=',
        user: '='
      },
      templateUrl: '/scripts/feed/fc-feed-user.html',
      link($scope) {
        $scope.ROUTE = ROUTE;
        $scope.object.type = 'user';
        $scope.listPageUrl = $state.href('user-likes', {user_id: $scope.object.user_id});
        $scope.showMoreComments = function() {
          $state.go('u.profile-comments', {user_id: $scope.object.user_id, show_comments: true});
        };
      }
    };
  });

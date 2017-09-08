angular.module('famicity')
  .directive('fcFeedAvatar', function($state) {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        feedAvatar: '=',
        user: '='
      },
      templateUrl: '/scripts/feed/avatar/fc-feed-avatar.html',
      controller: function($scope) {
        $scope.feedAvatar.type = 'avatar';
        $scope.listPageUrl = $state.href('user-avatars-likes', {
          user_id: $scope.feedAvatar.author_id,
          photo_id: $scope.feedAvatar.id
        });
        $scope.showMoreComments = function() {
          $state.go('u.profile-photos-item', {
            user_id: $scope.feedAvatar.author_id,
            photo_id: $scope.feedAvatar.id,
            show_comments: true
          });
        };
      }
    };
  });

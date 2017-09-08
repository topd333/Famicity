angular.module('famicity')
  .directive('fcFeedAlbum', function($state) {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        object: '=',
        user: '=',
        index: '='
      },
      templateUrl: '/scripts/feed/fc-feed-album.html',
      controller($scope) {
        $scope.object.type = 'album';
        $scope.listPageUrl = $state.href('u.albums-likes', {
          user_id: $scope.object.author_id,
          album_id: $scope.object.id
        });
        $scope.showMoreComments = function() {
          $state.go('u.albums-comments', {
            user_id: $scope.object.author_id,
            album_id: $scope.object.id,
            show_comments: true
          });
        };
      }
    };
  });

angular.module('famicity')
  .directive('fcLike', function(Like, notification) {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        object: '=',
        viewMode: '@',
        // Used in template, don't remove
        listPageUrl: '=?listPage'
      },
      templateUrl: '/scripts/common/likes/directives/fc-like.html',
      controller: function($scope) {
        let toggleLike;

        if ($scope.object) {
          $scope.object.pendingLike = false;
        }

        $scope.toggleLike = function() {
          if (!$scope.object.pendingLike) {
            $scope.object.pendingLike = true;
            return Like.like({
              object_type: $scope.object.type,
              object_id: $scope.object.id
            }).$promise.then(function() {
              $scope.object.pendingLike = false;
              toggleLike($scope.object.is_liked_by_me);
            }, function() {
              $scope.object.pendingLike = false;
            });
          }
        };

        toggleLike = function(likes) {
          if (likes) {
            $scope.object.is_liked_by_me = false;
            $scope.object.likes_count--;
            notification.add('UNLIKE_SUCCESS_MSG');
          } else {
            $scope.object.is_liked_by_me = true;
            $scope.object.likes_count++;
            notification.add('LIKE_SUCCESS_MSG');
          }
        };
      }
    };
  });

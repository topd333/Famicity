angular.module('famicity')
  .directive('fcFeedList', function(userService) {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        user: '=',
        elements: '=',
        hasNoContact: '='
      },
      templateUrl: '/scripts/feed/fc-feed-list.html',
      controller($scope, util) {
        $scope.me = $scope.user;
        $scope.infiniteScrollLoading = false;
        $scope.infiniteScrollDisabled = false;

        function unwrap(elementsWrappers) {
          const unwrapped = [];
          for (var i = 0; i < elementsWrappers.length; i++) {
            unwrapped.push(elementsWrappers[i].element);
          }
          return unwrapped;
        }

        $scope.elements = unwrap($scope.elements);

        $scope.addPost = function(post) {
          $scope.elements.unshift({post: post});
        };

        $scope.removePost = function(postId) {
          var elements = $scope.elements;
          elements.forEach(function(element, index) {
            if (element.post && element.post.id === postId) {
              delete elements[index];
              elements.splice(index, 1);
            }
          });
        };

        $scope.loadMoreElementsUnthrottled = function() {
          var lastObjectId, lastObjectType;
          if ($scope.elements.length > 0) {
            var element = $scope.elements[$scope.elements.length - 1];
            if (element.avatar) {
              lastObjectId = element.avatar.id;
              lastObjectType = 'avatar';
            } else if (element.album) {
              lastObjectId = element.album.id;
              lastObjectType = 'album';
            } else if (element.post) {
              lastObjectId = element.post.id;
              lastObjectType = 'post';
            } else if (element.event) {
              lastObjectId = element.event.id;
              lastObjectType = 'event';
            } else if (element.user) {
              lastObjectId = element.user.id;
              lastObjectType = 'user';
            }

            $scope.infiniteScrollLoading = true;

            userService.feed({user_id: $scope.user.id, last_object_id: lastObjectId, last_object_type: lastObjectType}).then(function(response) {
              var elementsWrappers = response.elements;
              $scope.elements = $scope.elements.concat(unwrap(elementsWrappers));
              if (elementsWrappers.length <= 0) {
                $scope.infiniteScrollDisabled = true;
              }
              $scope.infiniteScrollLoading = false;
            });
          }
        };

        $scope.loadMoreElements =
          util.throttle($scope.loadMoreElementsUnthrottled, 500, {leading: false, trailing: false});
      }
    };
  });

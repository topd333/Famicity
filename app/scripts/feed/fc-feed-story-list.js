angular.module('famicity')
  .directive('fcFeedStoryList', function() {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        user: '=',
        elements: '=',
        story: '='
      },
      templateUrl: '/scripts/feed/fc-feed-list.html',
      controller($scope, Story, util) {
        $scope.infiniteScrollLoading = false;
        $scope.infiniteScrollDisabled = false;

        $scope.addPost = function(post) {
          delete post.story;
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
          if ($scope.elements.length > 0) {

            $scope.infiniteScrollLoading = true;

            const lastId = $scope.elements[$scope.elements.length - 1].post.id;

            Story.getPosts({id: $scope.story.id, last_object_id: lastId}).$promise
              .then(function(response) {
                if (response && response.length) {
                  const posts = response.map(function(el) {
                    el.type = 'story';
                    return {post: el};
                  });
                  $scope.elements = $scope.elements.concat(posts);
                } else {
                  $scope.infiniteScrollDisabled = true;
                }
              })
              .finally(() => $scope.infiniteScrollLoading = false);
          }
        };

        $scope.loadMoreElements =
          util.throttle($scope.loadMoreElementsUnthrottled, 500, {leading: false, trailing: false});

      }
    };
  });

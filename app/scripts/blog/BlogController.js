angular.module('famicity')
  .controller('BlogController', function(
    $scope, $state, $location, $stateParams, Post,
    LoadingAnimationUtilService, me, $translate, profile,
    $timeout, breadcrumbTitle, menu) {
    'use strict';

    if (profile.sex) {
      profile.sex = profile.sex.toLowerCase();
    }
    $scope.basicProfile = profile;

    $scope.breadcrumbTitle = breadcrumbTitle;

    $scope.init = function() {

      LoadingAnimationUtilService.resetPromises();
      LoadingAnimationUtilService.activate();

      $scope.userId = me.id;  // TODO: Remove
      $scope.user = me;
      $scope.me = me;

      $scope.viewedUserId = parseInt($stateParams.user_id, 10);
      $scope.viewedUser = profile;
      $scope.isCurrentUser = $scope.userId === $scope.viewedUserId;
      $scope.isShowLeftMenu = false;
      $scope.infiniteScrollLoading = false;
      $scope.infiniteScrollDisabled = false;
      $scope.order = '';
      $scope.orderCriteria = '';
      $scope.currentTab = 'blog';
      var promise = Post.query({
        user_id: $scope.viewedUserId,
        p: $scope.orderCriteria,
        s: $scope.order
      }).$promise;
      LoadingAnimationUtilService.addPromises(promise);
      $scope.formStatus = {};
      promise.then(function(response) {
        $scope.hasPost = response.posts.length > 0;
        $scope.posts = $scope.hasPost ? response.posts : [];
        $scope.formStatus.isEditing = !$scope.hasPost;
      });
      $scope.createPost = false;
      return LoadingAnimationUtilService.validateList();
    };

    $scope.addPost = function(post) {
      $scope.posts.unshift(post); // TODO: Unify data structures (from backend?) so we could use the same code as in feed-list
      $scope.hasPost = true;
    };

    $scope.removePost = function(postId) { // TODO: Unify data structures (from backend?) so we could use the same code as in feed-list
      var elements = $scope.posts;
      elements.forEach(function(element, index) {
        if (element.id === postId) {
          delete elements[index];
          elements.splice(index, 1);
        }
      });
      if (!elements || !elements.length) {
        $scope.hasPost = false;
      }
    };

    $scope.loadMorePosts = function() {
      if ($scope.posts.length) {
        var lastObjectId = $scope.posts[$scope.posts.length - 1].id;
        $scope.infiniteScrollLoading = true;
        Post.query({
          user_id: $scope.viewedUserId,
          last_object_id: lastObjectId,
          p: $scope.orderCriteria,
          s: $scope.order
        }).$promise.then(function(response) {
            if (response.posts.length > 0) {
              $scope.posts = $scope.posts.concat(response.posts);
            }
            if (response.posts.length === 0) {
              $scope.infiniteScrollDisabled = true;
            }
            $scope.infiniteScrollLoading = false;
          });
      }
    };

    $scope.switchOrderCriteria = function() {
      if ($scope.orderCriteria === 'l') {
        $scope.orderCriteria = 'c';
      } else {
        $scope.orderCriteria = 'l';
      }
      return Post.query({
        user_id: $scope.viewedUserId,
        p: $scope.orderCriteria,
        s: $scope.order
      }).$promise.then(function(response) {
          $scope.posts = response.posts;
        });
    };
    $scope.switchOrder = function() {
      if ($scope.order === 'd') {
        $scope.order = 'a';
      } else {
        $scope.order = 'd';
      }
      return Post.query({
        user_id: $scope.viewedUserId,
        p: $scope.orderCriteria,
        s: $scope.order
      }).$promise.then(function(response) {
          $scope.posts = response.posts;
        });
    };
  });

angular.module('famicity').controller('InternalUserPostsLikesController', function(
  $scope, $stateParams, $translate, Like, LoadingAnimationUtilService, me) {
  'use strict';
  $scope.init = function() {
    LoadingAnimationUtilService.resetPromises();

    $scope.userId = me.id;  // TODO: Remove
    $scope.user = $scope.me = me;

    $scope.viewedUserId = parseInt($stateParams.user_id, 10);

    $scope.postId = $stateParams['post_id'];
    if (!$scope.object) {
      $scope.object = {
        id: $scope.postId   // TODO: Remove postId
      };
    } else {
      $scope.object.id = $scope.postId;
    }

    var object_type = 'post';
    $scope.likesList = Like.query({
      object_type: object_type,
      object_id: $scope.object.id
    });
    if ($scope.viewedUserId === $scope.userId) {
      $scope.likeText = 'LIKED_YOUR_POST';
    } else {
      $scope.likeText = 'LIKED_OTHER_POST';
    }
  };
});

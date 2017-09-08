angular.module('famicity')
  /*@ngInject*/
  .controller('BlogPostShowController', function($scope, $state, $stateParams, Post, me, post, breadcrumbTitle) {
    'use strict';

    function isVowel(c) {
      return ['a', 'e', 'i', 'o', 'u', 'y'].indexOf(c) !== -1;
    }

    if (post && post.month) {
      post.month = post.month.toLowerCase();
      if (isVowel(post.month[0])) {
        post.vowel = true;
      }
    }

    $scope.breadcrumbTitle = breadcrumbTitle;

    $scope.userId = me.id;
    $scope.user = $scope.me = me;
    $scope.post = post;
    $scope.author = {id: post.author_id};
    $scope.viewedUserId = $stateParams.user_id;
    $scope.isCurrentUser = $scope.userId === $scope.viewedUserId;
    $scope.isShowLeftMenu = false;
    $scope.showComments = $stateParams.show_comments || false;
    $scope.objectType = 'post';
    $scope.listPageUrl =
      $state.href('u.user-posts-likes', {user_id: $scope.viewedUserId, post_id: $stateParams.post_id});

    $scope.goToEditPage = function() {
      $state.go('u.user-blog-edit-post', {user_id: $scope.userId, post_id: $scope.post.id});
    };
  });

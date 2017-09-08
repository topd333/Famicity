angular.module('famicity')
  .controller('BlogPostAddController', function(
    $scope, $state, me) {
    'use strict';

    $scope.me = me;

    $scope.posted = function() {
      $state.go('u.feed');
    };
  });

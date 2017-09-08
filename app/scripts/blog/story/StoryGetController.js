angular.module('famicity.story')
  .controller('StoryGetController', function($scope, story, me, lastStories, posts) {
    'use strict';
    $scope.me = me;
    $scope.elements = posts;
    $scope.story = story;
    $scope.lastStories = lastStories;
  });

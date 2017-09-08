angular.module('famicity.story')
  .controller('StoryListController', function($scope, stories) {
  'use strict';
  $scope.stories = stories;
});

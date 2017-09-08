angular.module('famicity')
  .controller('MessagesEmptyController', function($scope) {
    'use strict';

    $scope.$parent.showMode = true;
    $scope.$parent.currentId = null;
  });

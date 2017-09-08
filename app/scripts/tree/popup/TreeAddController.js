angular.module('famicity.tree')
  .controller('TreeAddController', function($scope, someForm) {
    'use strict';
    $scope.currentForm = angular.extend($scope.currentForm || {}, someForm);
  });

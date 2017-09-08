angular.module('famicity')
  .controller('WizardFindFriendsController', function($scope) {
    'use strict';
    $scope.importStatus = {
      started: false
    };
    $scope.$parent.canSkip = false;
  });

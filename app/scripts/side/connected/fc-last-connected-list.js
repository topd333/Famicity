angular.module('famicity')
  .directive('fcLastConnectedList', function() {
    'use strict';
    return {
      scope: true,
      templateUrl: '/scripts/side/connected/fc-last-connected-list.html',
      restrict: 'E'
    };
  });

angular.module('famicity')
  .directive('fcSideBar', function() {
    'use strict';
    return {
      restrict: 'EA',
      templateUrl: '/scripts/side/fc-side-bar.html'
    };
  });

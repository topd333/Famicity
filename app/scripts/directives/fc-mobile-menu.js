angular.module('famicity')
  .directive('fcMobileMenu', function() {
    'use strict';
    return {
      scope: true,
      templateUrl: '/scripts/directives/fc-mobile-menu.html',
      restrict: 'E'
    };
  });

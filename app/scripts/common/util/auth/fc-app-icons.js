angular.module('famicity')
  .directive('fcAppIcons', function() {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        locale: '@'
      },
      templateUrl: '/scripts/common/util/auth/fc-app-icons.html'
    };
  });

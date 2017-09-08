angular.module('famicity')
  .directive('fcPermission', function() {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        permission: '=',
        allowed: '=',
        onRemove: '&?',
        details: '@?'
      },
      replace: true,
      templateUrl: '/scripts/common/permission/list/single/fc-permission.html'
    };
  });

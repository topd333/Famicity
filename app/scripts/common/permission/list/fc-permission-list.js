angular.module('famicity')
  .directive('fcPermissionList', function() {
    'use strict';

    return {
      restrict: 'AE',
      templateUrl: '/scripts/common/permission/list/fc-permission-list.html',
      scope: {
        permissions: '=',
        allowed: '='
      },
      replace: true,
      link(scope) {

        scope.remove = function(permissionToRemove) {
          var indexToRemove = scope.permissions.indexOf(permissionToRemove);
          scope.permissions.splice(indexToRemove, 1);
        };
      }
    };
  });

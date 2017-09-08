angular.module('famicity')
  .directive('fcPermissions', function(
    $http, $templateCache, $compile, $location, $state, permissionService, Permission) {
    'use strict';

    return {
      restrict: 'AE',
      templateUrl: '/scripts/common/permission/fc-permissions.html',
      scope: {
        author: '=',
        permissions: '=',
        allow: '=?',
        disallow: '=?'
      },
      replace: true,
      link(scope) {
        scope.allow = scope.allow || true;
        scope.disallow = scope.disallow || false;

        //permissionService.getAll(scope.author).then(function (allPermissions) {
        //  scope.allPermissions = permissionService.toPermissionProposals(allPermissions);
        //});

        if (!scope.permissions) {
          Permission.getDefault({user_id: scope.author.id}).$promise.then(function(defaultPermissions) {
            scope.permissions = permissionService.toPermissionList(defaultPermissions);
          }).catch(function(error) {
            log('Could not get default permissions');
          });
        }

        scope.allowAddAllowed = function(group) {
          return !permissionService.existsIn(scope.permissions.disallowed, group);
        };

        scope.allowAddExcluded = function(group) {
          return !permissionService.existsIn(scope.permissions.allowed, group);
        };
      }
    };
  });

angular.module('famicity')
  .directive('fcPermissionEdit', function() {
    'use strict';

    var always = function() {
      return true;
    };
    return {
      restrict: 'EA',
      scope: {
        /**
         * The existing selected permissions, before edition
         */
        selectedPermissions: '=',
        /**
         * A static list of permissions to choice among, if any
         */
        //allPermissions: '=',
        /**
         * Boolean: If the permission list to build is about "allowed" permissions or not.
         */
        allowed: '=',
        allowAdd: '&?'/*,
         allowRemove: '&?'*/
      },
      templateUrl: '/scripts/common/permission/edit/fc-permission-edit.html',
      replace: true,
      link(scope, elem, attrs) {
        if (!attrs.allowAdd) {
          scope.allowAdd = always;
        }

        elem.on('click', function() {
          elem.find('input').focus();
        });

        //if (!scope.allowRemove) {
        //  scope.allowAdd = always;
        //}

        scope.add = function(group) {
          if (scope.allowAdd({group: group})) {
            scope.selectedPermissions.push(group);
            scope.focused = false;
          }
          return scope.selectedPermissions;
        };

        scope.remove = function(group) {
          var permissionsToRemoveFrom = scope.selectedPermissions;
          if (!group && permissionsToRemoveFrom.length) {
            group = permissionsToRemoveFrom[permissionsToRemoveFrom.length - 1];
          }
          //if (scope.allowRemove({group:group})) {
          var groupIndex = permissionsToRemoveFrom.indexOf(group);
          permissionsToRemoveFrom.splice(groupIndex, 1);
          //} else {
          //  log('Did not allow removal of group %o', group);
          //}
          return scope.selectedPermissions;
        };
      }
    };
  });

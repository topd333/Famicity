angular.module('famicity')
  .service('permissionService', function(Permission, $q, Group) {
    'use strict';

    var log = debug('fc-permissionService');

    var mapGroup = groupPerm => {
      return {
        id: groupPerm.id,
        name: groupPerm.group_name,
        type: 'group'
      };
    };

    var mapUser = userPerm => {
      return {
        id: userPerm.id,
        name: userPerm.user_name,
        email: userPerm.email,
        type: 'user'
      };
    };

    function isUserPermission(permission) {
      return permission.type === 'user';
    }

    function isGroupPermission(permission) {
      return permission.type === 'group';
    }

    return {
      getAll: (user) => $q((resolve) => Group.query({user_id: user.id}).$promise.then((groups) => {
        resolve(groups);
      })),
      getFormattedPermissions: (userPermissionsList, groupPermissionsList) => {
        var formattedString = '';
        for (var i = 0; i < userPermissionsList.length; i++) {
          var userPermission = userPermissionsList[i];
          formattedString += 'u' + userPermission.id + ',';
        }
        for (var j = 0; j < groupPermissionsList.length; j++) {
          var groupPermission = groupPermissionsList[j];
          formattedString += 'g' + groupPermission.id + ',';
        }
        return formattedString.slice(0, -1);
      },
      getInvitations: function(allowedPermissions) {
        var mails = [];
        if (allowedPermissions && allowedPermissions.constructor === Array) {
          for (var i = 0; i < allowedPermissions.length; i++) {
            var permission = allowedPermissions[i];
            if (!(isGroupPermission(permission) || isUserPermission(permission))) {
              mails.push(permission.id);
            }
          }
        }
        return mails;
      },
      getHeterogeneousFormattedPermissions: function(permissionsList) {
        var formattedString = '';
        var separator = '';
        if (permissionsList && permissionsList.constructor === Array) {
          for (var i = 0; i < permissionsList.length; i++) {
            var permission = permissionsList[i];
            let permissionType;
            if (isUserPermission(permission)) {
              permissionType = 'u';
            } else if (isGroupPermission(permission)) {
              permissionType = 'g';
            } else {
              continue;
            }
            formattedString += separator + permissionType + permission.id;
            separator = ',';
          }
        }
        return formattedString;
      },
      toPermissionProposals: function(allGroups) {
        return allGroups.map(mapGroup);
      },
      /**
       * Concatenate all permission types in two "allowed"/"disallowed" groups
       * @param permissions
       */
      toPermissionList: function(permissions) {
        return angular.extend(permissions, {
          allowed: permissions.group_permissions.map(mapGroup)
            .concat(permissions.user_permissions.map(mapUser)),
          disallowed: permissions.group_exclusions.map(mapGroup)
            .concat(permissions.user_exclusions.map(mapUser))
        });
      },
      update: function(object, permissions) {
        let deferred = $q.defer();
        if (permissions) {
          let allowed = this.getHeterogeneousFormattedPermissions(permissions.allowed);
          let excluded = this.getHeterogeneousFormattedPermissions(permissions.disallowed);
          let invited = this.getInvitations(permissions.allowed);
          new Permission({
            permissions: allowed,
            exclusions: excluded,
            invitations: invited
          }).$save({
              object_type: object.type,
              object_id: object.id
            }).then(function() {
              log('update: ok');
              deferred.resolve();
            }).catch(function(error) {
              log('update: failed ' + error);
              deferred.reject();
            });
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      },
      isSame: function(proposal, selectedPerm) {
        return proposal.id && (
          proposal.id === selectedPerm.id ||  // Same user/group
          proposal.id === selectedPerm.name ||  // free email is user email
          proposal.id === selectedPerm.email);        // free email is user email
      },
      existsIn: function(selected, proposal) {
        var found = false;
        for (var j = 0; j < selected.length; j++) {
          if (this.isSame(proposal, selected[j])) {
            found = true;
            break;
          }
        }
        return found;
      },
      getPermissions: (objectType, objectId) => $q((resolve) => Permission.get({
        object_type: objectType,
        object_id: objectId
      }).$promise.then((response) => {
        const permissions = response.permissions;
        log('Permission;get: ok %o', permissions);
        resolve(permissions);
      }))
    };
  });

angular.module('famicity')
  .factory('oldPermissionService', function($injector) {
    'use strict';
    const oldPermissionService = {};
    let userPermissions = [];
    let userExclusions = [];
    let groupPermissions = [];
    let groupExclusions = [];
    let hasPermissions = false;
    let hasExclusions = false;
    let objectType = '';
    let objectId = '';
    let backAction = '';
    let object = {};
    oldPermissionService.init = function(type, action, id) {
      objectType = type;
      backAction = action;
      if (id) {
        objectId = id;
      }
    };
    oldPermissionService.isInit = function() {
      return Boolean(objectType !== '' && backAction !== '');
    };
    oldPermissionService.getInit = function($scope) {
      $scope.objectType = objectType;
      $scope.backAction = backAction;
    };
    oldPermissionService.getObjectType = function() {
      return objectType;
    };
    oldPermissionService.getObjectId = function() {
      return objectId;
    };
    oldPermissionService.setObject = function($scope) {
      if (backAction === 'add') {
        object = $scope[objectType];
      } else {
        object = $scope[objectType + 'EditCopy'];
      }
      return console.log(object);
    };
    oldPermissionService.getObject = function() {
      return object;
    };
    oldPermissionService.hasObject = function() {
      return object !== {};
    };
    oldPermissionService.setSelectedPermissions = function(users, groups) {
      if (hasPermissions === false) {
        hasPermissions = true;
      }
      userPermissions = users;
      groupPermissions = groups;
    };
    oldPermissionService.setSelectedExclusions = function(users, groups) {
      if (hasExclusions === false) {
        hasExclusions = true;
      }
      userExclusions = users;
      groupExclusions = groups;
    };
    oldPermissionService.setPermissions = function(permissions) {
      userPermissions = permissions.user_permissions;
      userExclusions = permissions.user_exclusions;
      groupPermissions = permissions.group_permissions;
      groupExclusions = permissions.group_exclusions;
      if (permissions.user_permissions.length > 0 || permissions.group_permissions.length > 0) {
        hasPermissions = true;
      }
      if (permissions.user_exclusions.length > 0 || permissions.group_exclusions.length > 0) {
        hasExclusions = true;
      }
    };

    oldPermissionService.deletePermissionElement = function(idx, objectType, $scope) {
      if (objectType === 'group') {
        groupPermissions.splice(idx, 1);
        $scope.groupPermissions = groupPermissions;
      } else {
        userPermissions.splice(idx, 1);
        $scope.userPermissions = userPermissions;
      }
    };

    oldPermissionService.deleteExclusionElement = function(idx, objectType, $scope) {
      if (objectType === 'group') {
        groupExclusions.splice(idx, 1);
        $scope.groupExclusions = groupExclusions;
      } else {
        userExclusions.splice(idx, 1);
        $scope.userExclusions = userExclusions;
      }
    };
    oldPermissionService.getPermissions = function($scope) {
      $scope.userPermissions = userPermissions;
      $scope.groupPermissions = groupPermissions;
    };
    oldPermissionService.getExclusions = function($scope) {
      $scope.userExclusions = userExclusions;
      $scope.groupExclusions = groupExclusions;
    };
    oldPermissionService.setHasPermissions = function($scope) {
      $scope.hasPermissions = hasPermissions;
      $scope.hasExclusions = hasExclusions;
    };

    oldPermissionService.hasPermissions = function() {
      return hasPermissions;
    };

    oldPermissionService.hasExclusions = function() {
      return hasExclusions;
    };

    oldPermissionService.getFormattedPermissions = function() {
      let formattedString = userPermissions.reduce(function(permissions, permission) {
        permissions.push('u' + permission.id);
        return permissions;
      }, []);
      formattedString = groupPermissions.reduce(function(permissions, group) {
        permissions.push('g' + group.id);
        return permissions;
      }, formattedString);
      return formattedString.join(',');
    };

    oldPermissionService.getFormattedExclusions = function() {
      let formattedString = userExclusions.reduce(function(permissions, permission) {
        permissions.push('u' + permission.id);
        return permissions;
      }, []);
      formattedString = groupExclusions.reduce(function(permissions, group) {
        permissions.push('g' + group.id);
        return permissions;
      }, formattedString);
      return formattedString.join(',');
    };

    oldPermissionService.showPermission = function($scope, action) {
      if ($scope) {
        if (action === true) {
          $scope.tabActive = 'permission';
        }
        oldPermissionService.setHasPermissions($scope);
        if (oldPermissionService.hasPermissions()) {
          oldPermissionService.getPermissions($scope);
        }
        if (oldPermissionService.hasExclusions()) {
          return oldPermissionService.getExclusions($scope);
        }
      }
    };

    oldPermissionService.concatPermission = function($scope) {
      const concatPermissions = groupPermissions.concat(userPermissions);
      const concatExclusions = groupExclusions.concat(userExclusions);
      $scope.permissions = concatPermissions;
      $scope.exclusions = concatExclusions;
    };

    oldPermissionService.resetAll = function() {
      const ImageUploader = $injector.get('ImageUploader');
      if (objectType === 'post') {
        ImageUploader.reset();
      }
      groupExclusions = [];
      userExclusions = [];
      userPermissions = [];
      groupPermissions = [];
      hasExclusions = false;
      hasPermissions = false;
      backAction = '';
      objectType = '';
      objectId = '';
      object = {};
    };
    return oldPermissionService;
  });

angular.module('famicity')
.controller('PrivacyDefaultRightsController', function(
$scope, $state, $location, $stateParams, profileService,
Permission, pendingFormsManagerService, LoadingAnimationUtilService, me, permissionService, menuBuilder) {
  'use strict';

  $scope.userId = $scope.viewedUserId = me.id;
  $scope.settingsId = me.settings.id;

  LoadingAnimationUtilService.resetPromises();
  profileService.getBasicProfile($scope.userId, 'short', $scope);
  $scope.isSettingsPage = true;
  $scope.formKey = 'default_rights';
  $scope.formData = pendingFormsManagerService.getForm($scope.formKey);
  if (!$scope.formData.permissions) {
    Permission.getDefault({
      user_id: $scope.userId
    }).$promise.then(function(permissions) {
      $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'permissions', permissions);
    });
  }
  $scope.locationType = 'default';

  $scope.submit = function() {
    const permissions =
    permissionService.getFormattedPermissions($scope.formData.permissions.user_permissions, $scope.formData.permissions.group_permissions);
    const exclusions =
    permissionService.getFormattedPermissions($scope.formData.permissions.user_exclusions, $scope.formData.permissions.group_exclusions);
    return Permission.set_default({
      user_id: $scope.userId
    }, {
      permissions,
      exclusions
    }).$promise.then(function() {
      pendingFormsManagerService.removeForm($scope.formKey);
      $state.go('u.settings-privacy');
    });
  };
  menuBuilder.bind('submitAction', $scope.submit, $scope);
});

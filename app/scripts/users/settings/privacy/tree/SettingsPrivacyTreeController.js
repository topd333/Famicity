angular.module('famicity')
.controller('SettingsPrivacyTreeController', function(
$scope, $state, $location, $stateParams, profileService,
Permission, pendingFormsManagerService, LoadingAnimationUtilService, notification, me, permissionService, menuBuilder) {
  'use strict';
  $scope.userId = $scope.viewedUserId = me.id;
  $scope.settingsId = me.settings.id;

  LoadingAnimationUtilService.resetPromises();
  profileService.getBasicProfile($scope.userId, 'short', $scope);
  $scope.isSettingsPage = true;
  $scope.formKey = 'tree_rights';
  $scope.formData = pendingFormsManagerService.getForm($scope.formKey);
  if (!$scope.formData.permissions) {
    Permission.get_tree_permissions({
      user_id: $scope.userId
    }).$promise.then(function(response) {
      $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'permissions', response.permissions);
    });
  }
  $scope.locationType = 'tree';

  $scope.submit = function() {
    const permissions =
    permissionService.getFormattedPermissions($scope.formData.permissions.user_permissions, $scope.formData.permissions.group_permissions);
    const exclusions =
    permissionService.getFormattedPermissions($scope.formData.permissions.user_exclusions, $scope.formData.permissions.group_exclusions);
    const invitations = pendingFormsManagerService.getFormattedInvitations($scope.formData.permissions.email_permissions);
    return Permission.set_tree_permissions({
      user_id: $scope.userId
    }, {
      permissions,
      exclusions,
      invitations
    }).$promise.then(function() {
      notification.add('DEFAULT_RIGHTS_UPDATED_SUCCESS_MSG');
      pendingFormsManagerService.removeForm($scope.formKey);
      $state.go('u.settings-privacy');
    });
  };
  menuBuilder.bind('submitAction', $scope.submit, $scope);
});

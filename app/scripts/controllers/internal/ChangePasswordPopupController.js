angular.module('famicity').controller('ChangePasswordPopupController', function(
  $scope, userService, $modalInstance, notification) {
  'use strict';
  $scope.init = function() {
    $scope.submitted = false;
    $scope.user = {};
    $scope.formHolder = {};
    $scope.formInProgress = false;
  };
  $scope.submit = function() {
    const promises = [];
    $scope.submitted = true;
    if ($scope.formHolder.passwordChangeForm.$valid) {
      promises.push(userService.changePassword($scope.userId, $scope.user).then(function() {
        return $modalInstance.close();
      }));
    } else {
      notification.add('INVALID_FORM', {warn: true});
    }
    return promises;
  };
});

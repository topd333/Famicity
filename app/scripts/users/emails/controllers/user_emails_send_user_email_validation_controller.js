angular.module('famicity').controller('UserEmailsSendUserValidationController', function(
  $scope, $modalInstance, notification, UserEmail, $location, mailFormMode, mailId) {
  'use strict';
  $scope.mailFormMode = mailFormMode;
  $scope.mailId = mailId;
  $scope.init = function() {
    $scope.formHolder = {};
    $scope.mail = {};
    $scope.mail = UserEmail.edit({
      user_id: $scope.userId,
      email_id: $scope.mailId
    });
  };
  $scope.submit = function() {
    return UserEmail.send_user_email_validation({
      user_id: $scope.userId,
      email_id: $scope.mailId
    }).$promise.then(function() {
        notification.add('VALIDATION_EMAIL_SENT');
        $modalInstance.close();
      });
  };
});

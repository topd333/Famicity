angular.module('famicity').controller('UserEmailsController', function(
  $scope, $modalInstance, $location, $q, notification, UserEmail, mailFormMode, mailId) {
  'use strict';
  $scope.formInProgress = false;
  $scope.mailFormMode = mailFormMode;
  $scope.mailId = mailId;
  $scope.submitted = false;
  $scope.mailTypeList = [
    {id: 0, key: 'perso'},
    {id: 1, key: 'pro'},
    {id: 2, key: 'other'},
    {id: 3, key: 'custom'}
  ];
  $scope.formHolder = {};
  $scope.mail = {};
  $scope.selected_type = 0;
  if ($scope.mailFormMode === 'edit') {
    $scope.mail = UserEmail.edit({
      user_id: $scope.viewedUserId,
      email_id: $scope.mailId
    });
  }
  $scope.selectMailType = function(mailType) {
    $scope.mail['email_type'] = $scope.mailTypeList[mailType].key;
  };
  $scope.submit = function() {
    var promises;
    promises = [];
    if ($scope.formHolder.mailForm.$valid) {
      $scope.submitted = true;
      if ($scope.mailFormMode === 'add') {
        promises.push(UserEmail.save({
          user_id: $scope.viewedUserId
        }, $scope.mail).$promise.then(function() {
            notification.add('EMAIL_ADDED_SUCCESS_MSG');
            $modalInstance.close();
          }));
      } else if ($scope.mailFormMode === 'edit') {
        promises.push(UserEmail.update({
          user_id: $scope.viewedUserId,
          email_id: $scope.mail.id
        }, $scope.mail).$promise.then(function() {
            notification.add('EMAIL_EDITED_SUCCESS_MSG');
            $modalInstance.close();
          }));
      }
    } else {
      notification.add('INVALID_FORM', {warn: true});
    }
    return promises;
  };
  $scope.deleteMail = function() {
    UserEmail.delete({
      user_id: $scope.viewedUserId,
      email_id: $scope.mail.id
    }).$promise.then(function() {
        notification.add('EMAIL_DELETED_SUCCESS_MSG');
        $modalInstance.close();
      });
  };
});

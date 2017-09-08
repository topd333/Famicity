angular.module('famicity').controller('UserEmailsUseForAuthenticateController', function(
  $scope, UserEmail, notification, $modalInstance) {
  'use strict';
  $scope.init = function() {
    $scope.emailsList = null;
    $scope.formHolder = {};
    return UserEmail.query({
      user_id: $scope.viewedUserId
    }).$promise.then(function(response) {
        $scope.emailsList = {};
        return angular.forEach(response.user_emails, function(subList, type) {
          var newSubList;
          newSubList = [];
          angular.forEach(subList, function(val) {
            if (val.user_email.is_valid_email || val.user_email.is_used_for_authenticate) {
              newSubList.push(val);
            }
            if (val.user_email.is_used_for_authenticate) {
              $scope.formHolder.currentEmail = val.user_email.id;
            }
          });
          if (newSubList.length > 0) {
            $scope.emailsList[type] = newSubList;
          }
        });
      });
  };
  $scope.submit = function() {
    if ($scope.formHolder.currentEmail) {
      return UserEmail.use_for_authenticate({
        user_id: $scope.userId,
        email_id: $scope.formHolder.currentEmail
      }).$promise.then(function() {
          notification.add('EMAIL_SET_AS_IDENTIFIER');
          return $modalInstance.close();
        });
    } else {
      notification.add('CHOOSE_AN_EMAIL', {warn: true});
    }
  };
});

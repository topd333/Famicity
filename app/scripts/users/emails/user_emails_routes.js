angular.module('famicity').config(function($stateProvider) {
  'use strict';
  return $stateProvider.state('user-emails-validation', {
    url: '/users/:user_id/user_emails/validation/:token',
    views: {
      '@': {
        templateUrl: '/scripts/users/emails/views/user_emails_validation.html',
        controller: 'UserEmailsValidationController'
      }
    },
    data: {
      stateClass: 'forgotten-password-s2'
    }
  });
});

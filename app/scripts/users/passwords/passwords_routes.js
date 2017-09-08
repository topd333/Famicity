angular.module('famicity')
  .config(function($stateProvider) {
    'use strict';
    $stateProvider.state('forgotten-password-s2', {
      url: '/forgotten-password-s2',
      views: {
        '@': {
          templateUrl: '/scripts/users/passwords/forgotten-password-s2.html'
        }
      },
      data: {
        stateClass: 'forgotten-password-s2'
      }
    }).state('reset_password', {
      url: '/reset_password/:user_id/:token',
      views: {
        '@': {
          templateUrl: '/scripts/users/passwords/reset-password-s1.html',
          controller: 'PasswordController'
        }
      },
      resolve: {
        locale: function() {
          return null;
        }
      },
      data: {
        stateClass: 'reset-password-s1'
      }
    })
      .state('u.reset_password', {
        url: '/reset_password/:token?email',
        views: {
          '@': {
            templateUrl: '/scripts/users/passwords/reset-password-s1-private.html',
            controller: 'PasswordController'
          }
        },
        resolve: {
          locale: function() {
            return null;
          }
        },
        data: {
          hideCmBar: true,
          stateClass: 'reset-pwd-internal'
        }
      });
  });

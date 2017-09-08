angular.module('famicity')
  .config(function($stateProvider) {
    'use strict';
    return $stateProvider.state('notifications', {
      url: '/notifications/:user_id/:token',
      views: {
        '@': {
          templateUrl: '/scripts/public_notifications/views/public_notifications.html',
          controller: 'PublicNotificationsController'
        }
      },
      data: {
        stateClass: 'public notifications'
      }
    });
  });

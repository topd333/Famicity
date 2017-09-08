angular.module('famicity').config(function($stateProvider) {
  'use strict';
  return $stateProvider.state('tickets', {
    url: '/view_ticket/:ticket_id/:token',
    views: {
      '@': {
        templateUrl: '/scripts/tickets/controllers/TicketsIndex.html',
        controller: 'TicketsIndexController'
      }
    },
    data: {
      stateClass: 'contact-us-s3'
    }
  });
});

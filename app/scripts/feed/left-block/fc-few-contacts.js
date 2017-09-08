angular.module('famicity')
  .directive('fcFewContacts', function() {
    'use strict';
    return {
      scope: true,
      templateUrl: '/scripts/feed/left-block/fc-few-contacts.html',
      restrict: 'E'
    };
  });

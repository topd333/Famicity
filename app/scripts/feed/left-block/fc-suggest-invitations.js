angular.module('famicity')
  .directive('fcSuggestInvitations', function() {
    'use strict';
    return {
      scope: true,
      templateUrl: '/scripts/feed/left-block/fc-suggest-invitations.html',
      restrict: 'E'
    };
  });

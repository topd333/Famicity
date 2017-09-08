angular.module('famicity.tree')
  .directive('fcReviveInvite', function() {
    'use strict';
    return {
      restrict: 'EA',
      scope: true,
      templateUrl: '/scripts/tree/popup/fc-revive-invite.html'
    };
  });

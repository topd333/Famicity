angular.module('famicity').controller('SentInvitationsController', function(
  $scope, sentInvitations, me) {
  'use strict';
  $scope.me = me;
  $scope.sentInvitations = sentInvitations.map(function(el) {
    el.avatar_url = el.user.avatar_url;
    return el;
  });
});

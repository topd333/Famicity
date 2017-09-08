angular.module('famicity.directory')
  .directive('fcDirectorySideMenu', function($state) {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/scripts/directory/side-menu/fc-directory-side-menu.html',
      link(scope) {
        scope.selectReceivedInvitation = function(invitation) {
          if (!invitation.declined) {
            $state.go('u.directory.received-invitations');
          }
        };
        scope.selectSentInvitation = function(invitation) {
          if (!invitation.declined) {
            $state.go('u.directory.resend-invitation', {invitation_id: invitation.id});
          }
        };
      }
    };
  });

angular.module('famicity')
  .controller('WizardInviteEmailsController', function($scope, InvitationService, notification, sessionManager) {
    'use strict';
    var invitationService = InvitationService;

    $scope.formData = {
      email: undefined,
      invited: []
    };

    var inviterId = sessionManager.getUserId();
    $scope.$parent.canSkip = false;

    $scope.invite = function() {
      var emailToInvite = $scope.formData.email;
      if (emailToInvite) {
        var invitation = null;
        invitationService.createFromEmails(inviterId, invitation, emailToInvite).$promise.then(function() {
          $scope.formData.invited.push(emailToInvite);
          $scope.formData.email = null;
          notification.add('WIZARD.invite-emails.NOTIFICATION');
        });
      } else {
        notification.add('WIZARD.invite-emails.CANNOT_BE_EMPTY', {warn: true});
      }
    };
  });

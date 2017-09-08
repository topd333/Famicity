angular.module('famicity')
  .controller('WizardSignUpController', function(
    $scope, userManager, profile, sessionManager, $state, wizardService, pubsub, WIZARD_SERVICE) {
    'use strict';

    const log = debug('fc-WizardSignUpController');

    $scope.$parent.menuDisabled = true;

    $scope.user = profile || {};
    $scope.provider = profile.provider || null;

    $scope.showWizardGedcomStep = userManager.getWizardGedcomStep();
    log('profile.received_invitation=%o', profile.received_invitation);
    $scope.showInvitationStep = profile.received_invitation && !$scope.showWizardGedcomStep;
    var invitation = sessionManager.getInvitation();
    $scope.fromInvitation = invitation && (!invitation.type || invitation.type !== 'invitation');

    wizardService.start();
    wizardService.addStep('wizard-profile');
    if (!$scope.fromInvitation) {
      if ($scope.showInvitationStep) {
        wizardService.addStep('wizard-received-invitations');
      }
      if ($scope.showWizardGedcomStep) {
        wizardService.addStep('gedcom-import-wizard');
      } else {
        const inviteStep = wizardService.addStep('wizard-invite-menu');
        wizardService.addStep('wizard-invite-emails', inviteStep.index);
        wizardService.addStep('wizard-find-friends', inviteStep.index);
        wizardService.addStep('wizard-import-after', inviteStep.index);
        inviteStep.canSkip = true;

        wizardService.addStep('wizard-tree-info');
      }
    }
    // else go directly to invitation-related object

    const signupNextStep = function() {
      return wizardService.nextStep();
    };

    $scope.goToNextStep = function() {
      $state.go(signupNextStep().name);
    };

    pubsub.subscribe(WIZARD_SERVICE.msgUpdated, function() {
      var currentStep = wizardService.getCurrentStep();
      if (currentStep) {
        $scope.canSkip = currentStep.canSkip;
      }
    }, $scope);

    $scope.skip = function() {
      if ($scope.canSkip) {
        $state.go(wizardService.nextMainStep().name);
      }
    };

    $scope.goToNextStep();  // Start: go to 1st step
  });

const oldWizardAbstract = {
  templateUrl: '/views/internal/wizard-abstract.html',
  controller: 'InternalWizardAbstractController'
};
const newWizardSignUp = {
  templateUrl: '/scripts/wizard/WizardSignUp.html',
  controller: 'WizardSignUpController'
};
const oldWizardProfile = {
  templateUrl: '/views/internal/wizard-profile.html',
  controller: 'InternalWizardProfileController'
};
const newWizardProfile = {
  templateUrl: '/scripts/wizard/profile/WizardProfile.html',
  controller: 'WizardProfileController'
};
const wizardInviteMenu = {
  templateUrl: '/scripts/wizard/invite-menu/WizardInviteMenu.html',
  controller: 'WizardInviteMenuController'
};
const wizardInviteEmails = {
  templateUrl: '/scripts/wizard/invite-emails/WizardInviteEmails.html',
  controller: 'WizardInviteEmailsController'
};
const oldWizardTree = {
  templateUrl: '/views/internal/wizard-tree-info.html',
  controller: 'InternalWizardTreeInfoController'
};
const newWizardTree = {
  templateUrl: '/scripts/wizard/tree/WizardTree.html',
  controller: 'WizardTreeController'
};
const oldFindFriends = {
  templateUrl: '/views/internal/wizard-find-friends.html',
  controller: 'InternalWizardFindFriendsController'
};
const newFindFriends = {
  templateUrl: '/scripts/wizard/find-friends/WizardFindFriends.html',
  controller: 'WizardFindFriendsController'
};
const newReceivedInvitationsWizard = {
  templateUrl: '/scripts/wizard/received-invitation/ReceivedInvitationWizard.html',
  controller: 'ReceivedInvitationWizardController'
};
const oldImportServicesTemplateUrl = '/scripts/directory/views/import_services_buttons.html';
const newImportServicesTemplateUrl = '/scripts/common/import-services/fc-import-services.html';

angular.module('famicity')
  .constant('wizardAppConfig', {
    wizard: {
      signUp: newWizardSignUp,
      profile: newWizardProfile,
      inviteMenu: wizardInviteMenu,
      inviteEmails: wizardInviteEmails,
      tree: newWizardTree,
      findFriends: newFindFriends,
      receivedInvitations: newReceivedInvitationsWizard
      //gedcom: newGedcomWizard
    },
    importServices: {
      templateUrl: newImportServicesTemplateUrl
    }
  })
  .config(function($stateProvider, wizardAppConfig) {
    'use strict';
    $stateProvider
      .state('wizard-sign-up', {
        parent: 'u',
        views: {
          '@': wizardAppConfig.wizard.signUp
        },
        resolve: {
          profile: (me, UserResource) => UserResource.infos_for_profile_step({user_id: me.id}).$promise
        },
        data: {
          stateClass: 'wizard sign-up'
        }
      })
      .state('wizard-profile', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/profile',
        views: {
          'content': wizardAppConfig.wizard.profile
        },
        data: {
          hideCmBar: true
        }
      })
      .state('wizard-avatar', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/avatar',
        views: {
          'content': {
            templateUrl: '/views/internal/wizard-avatar.html',
            controller: 'InternalWizardAvatarController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('wizard-received-invitations', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/received-invitations',
        views: {
          'content': wizardAppConfig.wizard.receivedInvitations
        },
        resolve: {
          wizardInvitations: (me, Invitation) => Invitation.received({user_id: me.id, type: 'short'}).$promise
        },
        data: {
          hideCmBar: true
        }
      })
      .state('wizard-find-friends', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/find_friends',
        views: {
          'content': wizardAppConfig.wizard.findFriends
        },
        data: {
          hideCmBar: true
        }
      })
      .state('wizard-import-after', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/import-after?redirect&cancel&formKey',
        views: {
          'content': {
            templateUrl: '/scripts/directory/invite/import/after/InviteAfterImport.html',
            controller: 'InviteAfterImportController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('wizard-invite-menu', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/invite-menu',
        views: {
          'content': wizardAppConfig.wizard.inviteMenu
        },
        data: {
          hideCmBar: true
        }
      })
      .state('wizard-invite-emails', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/invite-emails',
        views: {
          'content': wizardAppConfig.wizard.inviteEmails
        },
        data: {
          hideCmBar: true
        }
      })
      .state('wizard-invite-step', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/invite-step',
        views: {
          'content': {
            templateUrl: '/views/internal/wizard-invite-step.html',
            controller: 'InternalWizardInviteStepController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('wizard-tree-info', {
        parent: 'wizard-sign-up',
        url: '/internal/wizard/tree_info',
        views: {
          'content': wizardAppConfig.wizard.tree
        },
        data: {
          hideCmBar: true
        }
      });
  });

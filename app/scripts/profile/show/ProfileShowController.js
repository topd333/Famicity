angular.module('famicity').controller('ProfileShowController', function(
  $scope, $state, $rootScope, $stateParams, ModalManager,
  profileService, userService, notification, LoadingAnimationUtilService,
  $location, InvitationService, $moment, me,
  Invitation, profile) {
  'use strict';

  $scope.user = profile;

  $scope.isUpdatable = profile.permissions && profile.permissions.is_updatable;

  $rootScope.header = 'profile-view';
  $scope.userId = me.id;
  $scope.viewedUserId = parseInt($stateParams.user_id, 10);
  $scope.locationType = 'profile';
  $scope.currentTab = 'profile';
  $scope.$moment = $moment;
  // LoadingAnimationUtilService.resetPromises();
  // LoadingAnimationUtilService.activate();
  // const userPromise = profileService.get($scope.viewedUserId, $scope);
  // userPromise.then(function(user) {
  //   $scope.isUpdatable = user.permissions.is_updatable;
  // });
  // LoadingAnimationUtilService.addPromises(userPromise);
  // LoadingAnimationUtilService.addPromises(profileService.getBasicProfile($scope.viewedUserId, 'short', $scope));
  // return LoadingAnimationUtilService.validateList();

  $scope.refresh = function() {
    return profileService.get($scope.viewedUserId)
      .then(function(user) {
        $scope.user = user;
        $scope.isUpdatable = user.permissions && user.permissions.is_updatable;
      });
  };
  $scope.openChangeLoginMailPopup = function() {
    return ModalManager.open({
      templateUrl: '/scripts/users/emails/views/popup_user_emails_use_for_authenticate.html',
      controller: 'UserEmailsUseForAuthenticateController',
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openValidateMailPopup = function(id) {
    return ModalManager.open({
      templateUrl: '/scripts/users/emails/views/popup_user_emails_send_user_email_validation.html',
      controller: 'UserEmailsSendUserValidationController',
      scope: $scope,
      resolve: {
        mailFormMode() {
          return 'validate';
        },
        mailId() {
          return id;
        }
      }
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openAddPhonePopup = function() {
    return ModalManager.open({
      templateUrl: '/scripts/users/phones/views/popup_user_phone.html',
      controller: 'UserPhonesController',
      resolve: {
        phoneFormMode() {
          return 'add';
        },
        phoneId() {
          return null;
        }
      },
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openEditPhonePopup = function(id) {
    return ModalManager.open({
      templateUrl: '/scripts/users/phones/views/popup_user_phone.html',
      controller: 'UserPhonesController',
      resolve: {
        phoneFormMode() {
          return 'edit';
        },
        phoneId() {
          return id;
        }
      },
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openAddWebSitePopup = function() {
    return ModalManager.open({
      templateUrl: '/scripts/users/web_sites/views/popup_user_web_site.html',
      controller: 'UserWebSitesController',
      resolve: {
        webSiteFormMode() {
          return 'add';
        },
        webSiteId() {
          return null;
        }
      },
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openEditWebSitePopup = function(id) {
    return ModalManager.open({
      templateUrl: '/scripts/users/web_sites/views/popup_user_web_site.html',
      controller: 'UserWebSitesController',
      resolve: {
        webSiteFormMode() {
          return 'edit';
        },
        webSiteId() {
          return id;
        }
      },
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openAddMailPopup = function() {
    return ModalManager.open({
      templateUrl: '/scripts/users/emails/views/popup_user_emails.html',
      controller: 'UserEmailsController',
      resolve: {
        mailFormMode() {
          return 'add';
        },
        mailId() {
          return null;
        }
      },
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openEditMailPopup = function(id) {
    return ModalManager.open({
      templateUrl: '/scripts/users/emails/views/popup_user_emails.html',
      controller: 'UserEmailsController',
      resolve: {
        mailFormMode() {
          return 'edit';
        },
        mailId() {
          return id;
        }
      },
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openAddAddressPopup = function() {
    return ModalManager.open({
      templateUrl: '/scripts/users/addresses/views/popup_user_address.html',
      controller: 'UserAddressesController',
      resolve: {
        addressFormMode() {
          return 'add';
        },
        addressId() {
          return null;
        }
      },
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.openEditAddressPopup = function(id) {
    return ModalManager.open({
      templateUrl: '/scripts/users/addresses/views/popup_user_address.html',
      controller: 'UserAddressesController',
      resolve: {
        addressFormMode() {
          return 'edit';
        },
        addressId() {
          return id;
        }
      },
      scope: $scope
    }).result.then(function() {
        return $scope.refresh();
      });
  };
  $scope.authorizeUser = function() {
    return userService.authorizeUser($scope.viewedUserId).then(function() {
      $state.go($state.$current, null, {
        reload: true
      });
    });
  };
  $scope.invite = function(user) {
    if (user.email !== null) {
      new Invitation({user_concerned_id: user.id}).$save({user_id: $scope.userId}).then(function() {
        $state.go($state.$current, null, {reload: true});
        notification.add('INVITATION_SENT_SUCCESS_MSG');
      });
    } else {
      $state.go('u.directory.send-invitation', {invitation_id: user.id});
    }
  };
  $scope.accept = function(user) {
    new Invitation({id: user.received_invitation.id}).$accept({user_id: $scope.userId})
      .then(function() {
        $state.go('u.profile', {user_id: user.id}, {reload: true});
      });
  };
  $scope.destroyInvitation = function(user) {
    Invitation.remove({invitation_id: user.id, user_id: $scope.userId})
      .$promise.then(function() {
        notification.add('INVITATION_DELETED_SUCCESS_MSG');
        $state.go($state.$current, null, {
          reload: true
        });
      });
  };
});

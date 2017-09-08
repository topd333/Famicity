angular.module('famicity').controller('InternalUserDirectoryHeaderController', function($scope) {
  'use strict';
  $scope.init = function() {};
});

angular.module('famicity').controller('InternalUserDirectoryInviteGroupsListHeaderController', function(
  $scope, $window, $stateParams, $location, notification, $state,
  InvitationService, directoryManagerService, invitationsManager, pendingFormsManagerService) {
  'use strict';
  $scope.init = function() {
    $scope.formKey = $stateParams.form_key;
    $scope.type = $stateParams.type;
    $scope.data = directoryManagerService.data;
    $scope.formData = pendingFormsManagerService.getForm($scope.formKey);
  };
  $scope.submit = function() {
    // See below
  };
});

angular.module('famicity').controller('InternalUserDirectoryInviteGroupsListController', function(
  $scope, $window, $rootScope, $location,
  directoryService, groupService, directoryManagerService, pendingFormsManagerService, ModalManager,
  $stateParams, notification, LoadingAnimationUtilService, InvitationService, $state,
  me) {
  'use strict';
  $scope.init = function() {
    $scope.userId = me.id;
    $scope.type = $stateParams.type;
    $scope.formKey = $stateParams.form_key;
    if ($scope.type !== 'accept') {
      $scope.formData = pendingFormsManagerService.getForm($scope.formKey);
    }
    this.groupService.getGroups($scope.userId, $scope).then(function() {
      $scope.data = directoryManagerService.data;
      LoadingAnimationUtilService.validateList();

      if ($scope.type !== 'accept' && $scope.formData.invitation.in_groups) {
        const selectedGroupIds = $scope.formData.invitation.in_groups.map(group => group.id);
        $scope.groups = $scope.groups.map(function(group) {
          if (selectedGroupIds.indexOf(group.id) >= 0) {
            group.selected = true;
          }
          return group;
        });
      }
      $scope.data.groups.list = $scope.groups;
    });
    $scope.$parent.hideLeftColumnBlock = true;
    const stateChangeStartEvent = $scope.$on('$stateChangeStart', function(event, toState) {
      if (toState.data && toState.data.hideLeftColumnBlock === false) {
        $scope.$parent.hideLeftColumnBlock = false;
      }
      return stateChangeStartEvent();
    });
    $scope.$on('$stateChangeStart', function() {
      if (pendingFormsManagerService.getForm($scope.formKey)) {
        if ($scope.type !== 'accept') {
          $scope.formData.invitation.recipientsToDisplay = '';
          $scope.formData.invitation.recipients = '';
          if ($scope.formData.invitation.in_groups) {
            angular.forEach($scope.formData.invitation.in_groups, function(value) {
              $scope.formData.invitation.recipientsToDisplay += value.group_name + ', ';
              $scope.formData.invitation.recipients += value.id + ',';
            });
            $scope.formData.invitation.recipientsToDisplay =
              $scope.formData.invitation.recipientsToDisplay.slice(0, -2);
            $scope.formData.invitation.recipients = $scope.formData.invitation.recipients.slice(0, -1);
          }
          return pendingFormsManagerService.addForm($scope.formKey, 'invitation', $scope.formData.invitation);
        }
      }
    });
  };
  $scope.submit = function() {
    const invitationService = InvitationService;
    if ($scope.type === 'accept') {
      $scope.invitationId = $stateParams.invitationId;
      $scope.inviterUserId = $stateParams.inviterUserId;
      const groups = $scope.data.groups.list.reduce(function(groups, group) {
        if (group.selected) {
          groups += group.id + ',';
        }
        return groups;
      }, '');
      $scope.group_ids = groups.slice(0, -1);
      invitationService.acceptUserInvitation($scope.userId, $scope.invitationId).then(function() {
        notification.add('INVITATION_ACCEPTED_SUCCESS_MSG');
        $state.go('u.profile', {user_id: $scope.inviterUserId});
      });
    } else {
      $scope.formData.invitation.in_groups = $scope.data.groups.list.filter(function(group) {
        return group.selected;
      });
      $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'invitation', $scope.formData.invitation);
      $window.history.back();
    }
  };
});

angular.module('famicity').controller('InternalUserDirectoryMobileInvitationsMenuHeaderController', function() {
  'use strict';
});

angular.module('famicity').controller('InternalUserDirectoryMobileInvitationsMenuController', function(
  $scope, $rootScope, InvitationService, ModalManager, $stateParams,
  invitationManagerService, notification,
  receivedInvitations, sentInvitations) {
  'use strict';
  $scope.data = invitationManagerService.data;
  $scope.receivedInvitations = receivedInvitations;
  $scope.sentInvitations = sentInvitations;
});

angular.module('famicity').controller('InternalUserDirectorySentInvitationsHeaderController', function($scope) {
  'use strict';
  $scope.init = function() {};
});

angular.module('famicity').controller('InternalUserDirectoryReceivedInvitationsHeaderController', function($scope) {
  'use strict';
  $scope.init = function() {};
});

angular.module('famicity').controller('InternalUserImportHeaderController', function($scope) {
  'use strict';
  $scope.init = function() {};
});

angular.module('famicity').controller('InternalUserImportController', function(
  $scope, $rootScope, $stateParams, notification, LoadingAnimationUtilService) {
  'use strict';
  $scope.init = function() {
    LoadingAnimationUtilService.validateList();
  };
});

angular.module('famicity').controller('InternalUserGroupsHeaderController', function($scope, ModalManager) {
  'use strict';
  $scope.init = function() {};
  $scope.openAddGroupPopup = function() {
    ModalManager.open({
      templateUrl: '/views/popup/popup_add_group.html',
      controller: 'AddGroupPopupController',
      scope: $scope
    });
  };
});

angular.module('famicity').controller('InternalUserGroupHeaderController', function($scope, $stateParams, ModalManager) {
  'use strict';
  $scope.groupId = $stateParams.group_id;
  $scope.init = function() {

  };
  $scope.openGroupAddOptionsPopup = function() {
    ModalManager.open({
      templateUrl: '/views/popup/popup_group_add_options.html',
      controller: 'GroupAddOptionsPopupController',
      scope: $scope
    });
  };
  $scope.openGroupAddBasicOptionsPopup = function() {
    ModalManager.open({
      templateUrl: '/views/popup/popup_group_add_basic_options.html',
      controller: 'GroupAddBasicOptionsPopupController',
      scope: $scope
    });
  };
});

angular.module('famicity').controller('InternalUserGroupAddHeaderController', function(
  $scope, $stateParams, directoryManagerService, groupService, me) {
  'use strict';
  $scope.init = function() {
    $scope.data = directoryManagerService.data;
    $scope.userId = me.id;
    $scope.groupId = $stateParams.group_id;
  };
  $scope.sendMultipleAdd = function() {
    const selectedUsers = $scope.data.group.users.reduce(function(users, user) {
      if (user.selected) {
        users.push(user.id);
      }
      return users;
    }, []).join(',');
    this.groupService.addMembers($scope.userId, $scope.groupId, selectedUsers, $scope.$parent);
  };
});

angular.module('famicity').controller('InternalUserGroupRemoveHeaderController', function(
  $scope, $stateParams, directoryManagerService, groupService, me) {
  'use strict';
  $scope.init = function() {
    $scope.userId = me.id;
    $scope.groupId = $stateParams.group_id;
    $scope.data = directoryManagerService.data;
  };
  $scope.sendMultipleDelete = function() {
    const selectedUsers = $scope.data.group.users.reduce(function(users, user) {
      if (user.selected) {
        users.push(user.id);
      }
      return users;
    }, []).join(',');
    this.groupService.removeMembers($scope.userId, $scope.groupId, selectedUsers, $scope.$parent);
  };
});

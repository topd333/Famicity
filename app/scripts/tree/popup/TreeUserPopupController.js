angular
  .module('famicity.tree')
  .controller('TreeUserPopupController', function(
    $scope, $rootScope, $moment, ModalManager,
    $location, $state, userService,
    notification, $q, Invitation, $translate,
    yesnopopin, $timeout, viewedUser, tree, User,
    FORMS, me, sessionManager) {

    'use strict';

    var log = debug('fc-TreeUserPopupController');
    $scope.FORMS = FORMS;
    $scope.locale = sessionManager.getLocale();
    $scope.currentForm = {};  // Must exist in abstract scope to be visible in all sibling child scopes
    $scope.childForm = {};  // Must exist in abstract scope to be visible in all sibling child scopes

    //var selectParent = function (childSex) {
    //  var parentForm = $scope.FORMS.SELECT_SECOND_PARENT;
    //  var aChild;
    //  var hisChild;
    //  if (childSex === 'Male') {
    //    aChild = 'fc-add-relative.CHILD_TYPE.A_SON';
    //    hisChild = 'fc-add-relative.CHILD_TYPE.HIS_SON';
    //  } else {
    //    aChild = 'fc-add-relative.CHILD_TYPE.A_DAUGHTER';
    //    hisChild = 'fc-add-relative.CHILD_TYPE.HIS_DAUGHTER';
    //  }
    //  parentForm.aChild = $translate.instant(aChild);
    //  parentForm.hisChild = $translate.instant(hisChild);
    //  return showForm(parentForm);
    //};

    $scope.userId = parseInt($state.params.user_id, 10);
    $scope.viewedUserId = viewedUser.id;
    $scope.treeUserProfile = viewedUser;
    $scope.tree_content = tree.tree_content;
    $scope.treeType = sessionManager.getTreeType();

    $scope.$moment = $moment;
    var isAnonymous = $scope.treeUserProfile.global_state === 'unknown';
    $scope.isAnonymous = function() {
      return isAnonymous;
    };
    $scope.isReadable = function() {
      return $scope.treeUserProfile.permissions.is_readable;
    };

    $scope.isDeletable = function() {
      return $scope.treeUserProfile.is_deletable && !isCreating();
    };
    var treeIsLocked = $scope.tree_content.tree_is_lock;
    $scope.isTreeLocked = function() {
      return treeIsLocked;
    };
    $scope.isMyTree = $scope.tree_content.current_user_tree_id === $scope.treeUserProfile.tree_id;
    $scope.isTreeBlockedByMe = function() {
      return $scope.treeUserProfile.is_blocked_by_me;
    };
    $scope.isInvitedByMe = function() {
      return $scope.treeUserProfile.is_invited_by_me;
    };
    $scope.isMe = function() {
      return $scope.treeUserProfile.id === me.id;
    };

    $scope.isManagedUser = function() {
      return $scope.treeUserProfile.global_state === 'managed';
    };

    function isCreating() {
      return !$scope.currentForm.isUpdate;
    }

    var formEnd = function(action, params, reload) {
      action = action || 'u.tree';
      if (action === 'u.tree') {
        $timeout(() => $state.go(action, params, {reload: reload}));
      } else {
        $state.go(action, params);
      }
    };

    $scope.success = function(params) {
      formEnd($scope.currentForm.onSuccess, params, true);
    };

    $scope.cancel = function(params) {
      formEnd($scope.currentForm.onCancel, params, false);
    };

    $scope.fail = function(params) {
      formEnd($scope.currentForm.onFail, params, false);
    };

    $rootScope.formModel = {};

    $scope.showReviveInvitationForm = false;
    //$scope.invitationFormHolder = {};
    $scope.reviveInvitationFormHolder = {};
    if ($scope.treeUserProfile.concerned_invitation) {
      $scope.reviveInvitationFormHolder.mail_address = $scope.treeUserProfile.concerned_invitation.mail_address;
    }
    $scope.form = {};
    $scope.submitted = false;
    $scope.reviveFormSubmitted = false;

    $scope.blockUser = function() {
      yesnopopin.open('BLOCK_USER_CONFIRMATION_TITLE').then(function() {
        User.block({id: $scope.treeUserProfile.id}).$promise
          .then(() => $state.go('u.tree.detail.add', {
            user_id: $scope.userId,
            viewedUserId: $scope.viewedUserId
          }, {reload: true}));
      });
    };

    $scope.authorizeUser = function() {
      User.authorize({id: $scope.treeUserProfile.id}).$promise
        .then(() => $state.go('u.tree.detail.add', {
          user_id: $scope.userId,
          viewedUserId: $scope.viewedUserId
        }, {reload: true}));
    };

    $scope.goToEditProfile = function() {
      //$modalInstance.close();
      $state.go('u.profile-edit', {user_id: $scope.treeUserProfile.id});
    };

    $scope.destroyUser = function(warningMessage, actionMessage) {
      yesnopopin.open(warningMessage, {
        yes: actionMessage,
        yesClass: 'btn-danger',
        yesOptions: {firstName: $scope.treeUserProfile.first_name},
        messageOptions: {firstName: $scope.treeUserProfile.first_name},
        no: 'CANCEL'
      })
        .then(function() {
          userService.destroyUserFromTree($scope.treeUserProfile.id, function() {
            if ($scope.treeUserProfile.id !== $scope.viewedUserId) {
              $state.go($state.$current, null, {reload: true});
            } else {
              $state.go('u.tree', {user_id: $scope.userId}, {reload: true});
            }
          });
        })
        .catch(function(error) {
          if (error !== 'cancel') {
            log('destroyUser failed: ', error);
            notification.add('RELATIVE_DELETE_FAILURE', {warn: true});
          }
        });
    };

    $scope.onErase = function() {
      $scope.destroyUser('USER_ERASE_WARNING_MSG', 'ERASE_FIRST_NAME');
    };

    $scope.onDelete = function() {
      $scope.destroyUser('USER_DELETE_WARNING_MSG', 'DELETE_FIRST_NAME');
    };

    $scope.invite = function() {
      $state.go('u.tree.detail.invite', {user_id: $scope.userId, viewedUserId: $scope.treeUserProfile.id});
    };

    // Default displayed tab
    if (!treeIsLocked) {
      $rootScope.formModel.isUpdate = isAnonymous;
      //if (isAnonymous) {
      //$state.go('u.tree.detail.updateAnonymous');
      //} else {
      //  if ($scope.isMyTree) {
      //    $state.go('u.tree.detail.add');
      //  }
      //}
    }
  });

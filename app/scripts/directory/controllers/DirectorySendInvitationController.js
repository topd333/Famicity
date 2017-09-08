// @flow weak

angular.module('famicity')
  .controller('DirectorySendInvitationController', function(
    $scope, $q, $window, $rootScope, $state,
    profileService, pendingFormsManagerService,
    ModalManager, $stateParams, $location, notification, LoadingAnimationUtilService,
    me, Invitation) {
    'use strict';

    $scope.me = me;
    $scope.invitation = {};

    $scope.init = function() {
      $scope.submitted = false;
      $scope.invitationId = $stateParams.invitation_id;
      profileService.get($scope.invitationId, $scope);
      $scope.userId = me.id;
      LoadingAnimationUtilService.validateList();
      // $scope.formKey = 'send_invitation';
      // $scope.formData = pendingFormsManagerService.getForm($scope.formKey);
      // if (!$scope.formData.invitation) {
      // groupService = new groupService();
      // groupService.getFamilyGroup($scope.userId).then(function(result) {
      //   $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'invitation', {
      //     in_groups: [result.group]
      //   });
      //   $scope.formData.invitation.mail_address = $stateParams['email'];
      //   $scope.formData.invitation.recipientsToDisplay = '';
      //   $scope.formData.invitation.recipients = '';
      //   if ($scope.formData.invitation.in_groups) {
      //     angular.forEach($scope.formData.invitation.in_groups, function(value) {
      //       $scope.formData.invitation.recipientsToDisplay += value.group_name + ', ';
      //       return $scope.formData.invitation.recipients += value.id + ',';
      //     });
      //     $scope.formData.invitation.recipientsToDisplay = $scope.formData.invitation.recipientsToDisplay.slice(0, -2);
      //     $scope.formData.invitation.recipients = $scope.formData.invitation.recipients.slice(0, -1);
      //   }
      // });
      // }
      profileService.getShortProfile($stateParams['invitation_id']).then(function(shortUser) {
        $scope.invitedUser = shortUser;
      });
      $scope.$on('$stateChangeStart', function() {
        if (pendingFormsManagerService.getForm($scope.formKey)) {
          pendingFormsManagerService.addForm($scope.formKey, 'invitation', $scope.formData.invitation);
        }
      });
    };
    $scope.submit = function() {
      let invitation;
      let _ref;
      let type;
      $scope.submitted = true;
      if ($scope.invitationsForm.$valid && ((_ref =
          $scope.invitedUser) != null ? _ref.global_state : undefined) !== 'active') {
        invitation = {
          mail_address: $scope.invitation.mail_address,
          comment: $scope.invitation.comment
        };
        if ($scope.invitationId) {
          invitation.user_concerned_id = $scope.invitationId;
        }
        type = 'I';
      } else if ($scope.invitationsForm.$valid) {
        invitation = {
          group_ids: $scope.invitation.recipients,
          comment: $scope.invitation.comment
        };
        if ($scope.invitationId) {
          invitation.other_user_id = $scope.invitationId;
        }
        type = 'R';
      } else {
        notification.add('INVALID_FORM', {warn: true});
      }
      new Invitation({invitation, type}).$save({user_id: $scope.userId}).then(function() {
        pendingFormsManagerService.removeForm($scope.formKey);
        $window.history.back();
        notification.add('INVITATION_SENT_SUCCESS_MSG');
      });
    };
    $scope.goToGroupsListPage = function() {
      $state.go('u.directory.invitations-groups-list', {
        user_id: $scope.viewedUserId,
        form_key: $scope.formKey
      });
    };
  });

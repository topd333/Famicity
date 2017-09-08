angular.module('famicity.tree').controller('InviteFromTreeController',
  function($scope, Invitation, notification, viewedUser, me, someForm) {
    'use strict';

    $scope.treeUserProfile = viewedUser;
    angular.extend($scope.currentForm, someForm);

    $scope.revive = function() {
      var promise;
      if ($scope.treeUserProfile.concerned_invitation && $scope.treeUserProfile.concerned_invitation.id) {
        promise = new Invitation({
          id: $scope.treeUserProfile.concerned_invitation.id,
          mail_address: $scope.treeUserProfile.concerned_invitation.mail_address,
          comment: $scope.treeUserProfile.concerned_invitation.comment
        }).$resend({
            invitation_id: $scope.treeUserProfile.concerned_invitation.id,
            user_id: me.id
          });
        promise.then(function() {
          $scope.success({user_id: me.id, viewedUserId: $scope.treeUserProfile.id});
          notification.add('INVITATION_RESENT_SUCCESS_MSG');
        });
      } else {
        var invitation = {
          mail_address: $scope.treeUserProfile.concerned_invitation.mail_address,
          user_concerned_id: $scope.treeUserProfile.id,
          comment: $scope.treeUserProfile.concerned_invitation.comment
        };
        promise = new Invitation({invitation, type: 'I'}).$save({user_id: me.id});
        promise.then(function(result) {
          $scope.treeUserProfile.concerned_invitation.id = result.id;
          $scope.treeUserProfile.is_invited_by_me = true;
          $scope.success({user_id: me.id, viewedUserId: $scope.treeUserProfile.id});
          notification.add('INVITATION_SENT_SUCCESS_MSG');
          angular.element('#tr-com-' + $scope.treeUserProfile.id + ' .tr-te span').css('color', '#EDA331');
        });
      }

      return [promise];
    };

    $scope.cancelInvitation = function() {
      $scope.cancel({user_id: me.id, viewedUserId: $scope.treeUserProfile.id});
    };

  });

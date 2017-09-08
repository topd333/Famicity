angular.module('famicity')
  .directive('fcUserListItem', function(
    $moment, $parse, $http, $compile, $templateRequest,
    yesnopopin, Invitation, notification, $state, User,
    InvitationService, pubsub, PUBSUB) {
    'use strict';

    const invite = function(user, me) {
      if (user.email || user.type && user.type === 'famicity' || user.is_linked_to_member) {
        yesnopopin.open('DIRECTORY.CONFIRM_INVITE').then(function() {
          new Invitation({invitation: {user_concerned_id: user.id}, type: 'I'})
            .$save({user_id: me.id}).then(function(invitation) {
              user.invitation = invitation;
              user.is_invited_by_me = true;
              notification.add('INVITATION_SENT_SUCCESS_MSG');
            });
        });
      } else {
        $state.go('u.directory.send-invitation', {invitation_id: user.id});
      }
    };

    const authorize = function(user) {
      yesnopopin.open('DIRECTORY.CONFIRM_UNBLOCK').then(function() {
        User.authorize({id: user.id}).$promise.then(function() {
          notification.add('RELATIVE_UNBLOCKED_SUCCESS_MSG');
          user.is_blocked_by_me = false;
        });
      });
    };

    const destroyInvitation = function(invitation, me) {
      invitation.pending = true;
      yesnopopin.open('DIRECTORY.CONFIRM_DELETE_INVITATION').then(function() {
        InvitationService.remove(invitation.id, me.id)
        .then(() => invitation.declined = true)
        .finally(() => invitation.pending = false);
      });
    };

    const acceptUserInvitation = function(invitation, me) {
      invitation.pending = true;
      InvitationService.accept(me.id, invitation.id, invitation.user)
      .then(() => invitation.accepted = true)
      .finally(() => invitation.pending = false);
    };

    return {
      scope: {
        me: '=?',
        user: '=',
        mode: '=?',
        selectionMode: '=?',
        onClick: '=?',
        checkboxTriggered: '=?',
        template: '@?'
      },
      restrict: 'E',
      templateUrl: '/scripts/common/user-list/item/fc-user-list-item.html',
      link(scope, element, attrs) {
        scope.invite = invite;
        scope.authorize = authorize;
        scope.destroyInvitation = destroyInvitation;
        scope.acceptUserInvitation = acceptUserInvitation;

        scope.$moment = $moment;
        scope.ROUTE = scope.$parent.ROUTE;

        const template = $parse(attrs.template)(scope.$parent);

        if (template) {
          const tplUrl = template || '/scripts/common/user-list/item/fc-user-list-item.html';
          $templateRequest(tplUrl).then(function(tplContent) {
            $compile(tplContent.trim())(scope, function(clonedElement) {
              element.replaceWith(clonedElement);
            });
          });
        }
      }
    };
  });

// @flow weak

angular.module('famicity')
  .controller('DirectoryInviteController', function(
    $scope, $rootScope, pendingFormsManagerService, directoryManagerService,
    ModalManager, $stateParams, $location, $state, notification,
    LoadingAnimationUtilService, me, InvitationService, $q, usersToInvite,
    Directory, pubsub, PUBSUB) {
    'use strict';

    const invitationService = InvitationService;

    let _results;
    $scope.userId = me.id;
    $scope.data = directoryManagerService.data;
    $scope.selectionMode = true;
    $scope.selectedUsers = $scope.selectedUsers || [];
    $scope.data.invitations.users = usersToInvite;
    $scope.formKey = 'multiple_invitations';
    $scope.formData = pendingFormsManagerService.getForm($scope.formKey);
    $scope.isCurrentTabDirectory = true;
    $scope.isCurrentTabEmail = false;
    LoadingAnimationUtilService.validateList();
    if ($scope.formData.emails) {
      $scope.data.invitations.emails = $scope.formData.emails;
      _results = [];
      while ($scope.data.invitations.emails.length < 3) {
        _results.push($scope.addMailField());
      }
      return _results;
    } else {
      $scope.data.invitations.emails = [
        {email: ''},
        {email: ''},
        {email: ''}
      ];
    }

    $scope.init = function() { };

    $scope.addMailField = function() {
      return $scope.data.invitations.emails.push({
        email: ''
      });
    };
    $scope.removeMailField = function(index) {
      if (index > -1) {
        return $scope.data.invitations.emails.splice(index, 1);
      }
    };
    // $scope.getDirectory = function() {
    //   //TODO Nico: use /users/:id/directory_for_invitation?
    //   return LoadingAnimationUtilService.addPromises(directoryService.getCustomDirectory({
    //     user_id: $scope.userId,
    //     global_state: 'directory',
    //     is_invited_by_me: 0
    //   }).$promise.then(function(response) {
    //     $scope.data.invitations.users = response.users;
    //   }));
    // };

    $scope.sendMultipleInvite = function() {
      var invitationsFromDirectory = $scope.selectedUsers.map(function(user) {
        return user.id;
      });
      var invitationsByEmail = $scope.data.invitations.emails.reduce(function(list, mailField) {
        if (mailField.email) {
          list.push(mailField.email);
        }
        return list;
      }, []);
      if (!invitationsFromDirectory.length && !invitationsByEmail.length) {
        notification.add('MULTIPLE_INVITATION_EMPTY_ERROR', {warn: true});
      } else {
        var promises = [];
        if (invitationsByEmail.length) {
          promises.push(invitationService.createFromEmails($scope.userId, null, invitationsByEmail.join(',')).$promise);
        }
        if (invitationsFromDirectory.length) {
          promises.push(invitationService.createFromUsers($scope.userId, null, invitationsFromDirectory.join(',')).$promise);
        }
        $q.all(promises).then(function() {
          $state.go('u.directory.list', {user_id: $scope.userId}, {reload: true});
          notification.add('INVITATIONS_SENT_SUCCESS_MSG');
        });
      }
    };
    pubsub.subscribe(PUBSUB.DIRECTORY.INVITATIONS.SUBMIT, $scope.sendMultipleInvite, $scope);

    $scope.directoryTabSelected = function() {
      $scope.currentTab = 'directory';
    };
    $scope.directoryTabDeselected = function() {};
    $scope.mailTabSelected = function() {
      $scope.currentTab = 'email';
      $scope.isCurrentTabDirectory = false;
      $scope.isCurrentTabEmail = true;
    };
    $scope.mailTabDeselected = function() {
      $scope.isCurrentTabDirectory = true;
      $scope.isCurrentTabEmail = false;
    };

    $scope.loadMore = function(page, search) {
      var promise = Directory.get({
        page: page,
        q: search,
        to_invite: true
      }).$promise;
      promise.then(function(response) {
        if (page === 1) {
          $scope.data.invitations.users = response.users;
        } else {
          $scope.data.invitations.users = $scope.data.invitations.users.concat(response.users);
        }
        //if (($scope.selectedUsers != null) && $scope.selectedUsers.length) {
        //  $scope.data.invitations.users = $scope.data.invitations.users.map(function (user) {
        //  var _ref;
        //  if (($scope.selectedUsers != null) && (_ref = user.id, [].indexOf.call($scope.selectedUsers.map(function(user) {
        //    return user.id;
        //  }), _ref) >= 0)) {
        //    user.selected = true;
        //  }
        //  return user;
        //});
        //}
      });
      return promise;
    };
  });

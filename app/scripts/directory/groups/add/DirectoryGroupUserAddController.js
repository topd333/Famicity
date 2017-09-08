angular.module('famicity')
  .controller('DirectoryGroupUserAddController', function(
    $scope, $rootScope, $location, $stateParams, $timeout,
    $q, ModalManager, directoryService, groupService, directoryManagerService,
    notification, LoadingAnimationUtilService, me, navigation,
    pubsub, PUBSUB) {
    'use strict';

    $scope.showAlertPopup = function(user) {
      $scope.alertInviteUser = user;
      $scope.alertInviteShown = true;
      $scope.emptyUsers = false;
      ModalManager.open({
        templateUrl: '/views/popup/popup_invitation_alert.html',
        controller: 'InvitationAlertPopupController',
        scope: $scope
      });
    };
    $scope.userId = me.id;
    $scope.data = directoryManagerService.data;
    $scope.alertInviteShown = false;
    $scope.groupId = $stateParams.group_id;
    $scope.selectionMode = true;
    $scope.selectedUsers = [];

    $scope.getGroupMembers = function() {
      const groupPromise = groupService.getGroupDetails($scope.userId, $scope.groupId).$promise;
      LoadingAnimationUtilService.addPromises(groupPromise);
      return groupPromise;
    };

    LoadingAnimationUtilService.validateList();
    $scope.getDirectory = function() {
      LoadingAnimationUtilService.addPromises(directoryService.getCustomDirectory({
        user_id: $scope.userId
      }).$promise.then(function(response) {
        let getGroupMembersQ;
        let tempUsers;
        tempUsers = [];
        if (!response.users.length) {
          $scope.emptyUsers = true;
        } else {
          tempUsers = response.users;
          getGroupMembersQ = $q.defer();
        }
        if ($scope.groupMembers == null) {
          $scope.getGroupMembers().then(function(response) {
            $scope.groupMembers = response.group.users;
            return getGroupMembersQ.resolve();
          });
        } else {
          getGroupMembersQ.resolve();
        }
        return getGroupMembersQ.promise.then(function() {
          tempUsers = tempUsers.filter(function(user) {
            const groupMembersIds = $scope.groupMembers.map(groupMember => groupMember.id);
            return groupMembersIds.indexOf(user.id) < 0;
          });
          $scope.data.group.users = tempUsers;
        });
      }));
    };

    $scope.getDirectory();
    $scope.getGroupMembers().then(function(response) {
      $scope.group = response.group;
      $scope.groupName = response.group.group_name;
      $scope.groupMembers = response.group.users;
    });

    $scope.sendMultipleAdd = function() {
      const usersToAdd = $scope.data.group.users.filter(user => user.selected).map(user => user.id).join(',');
      // var usersToAddString;
      // usersToAddString = usersToAdd;
      if (usersToAdd.length > 0) {
        groupService.addMembers($scope.userId, $scope.groupId, usersToAdd, $scope.$parent)
        .then(() => navigation.go('u.directory.user-group', {group_id: $scope.groupId}, {reload: true}));
      } else {
        notification.add('EMPTY_SELECT_CONTACT', {warn: true});
      }
    };
    pubsub.subscribe(PUBSUB.DIRECTORY.GROUPS.ADD_USERS, $scope.sendMultipleAdd, $scope);

    $scope.openAddContactsOptionsPopup = function() {
      return ModalManager.open({
        templateUrl: '/views/popup/popup_add_contacts_options.html',
        controller: 'AddContactsOptionsPopupController',
        scope: $scope
      });
    };

    $scope.loadMore = function(page, search) {
      var promise;
      promise = directoryService.getCustomDirectory({
        user_id: $scope.userId,
        q: search,
        page
      }).$promise;
      promise.then(function(response) {
        let getGroupMembersQ;
        let tempUsers = [];
        if (page === 1) {
          tempUsers = response.users;
        } else {
          tempUsers = $scope.data.group.users.concat(response.users);
        }
        if ($scope.selectedUsers != null && $scope.selectedUsers.length) {
          tempUsers = tempUsers.map(function(user) {
            const selectedUsers = $scope.selectedUsers.map(user => user.id);
            if ($scope.selectedUsers != null && selectedUsers.indexOf(user.id) >= 0) {
              user.selected = true;
            }
            return user;
          });
        }
        getGroupMembersQ = $q.defer();
        if ($scope.groupMembers == null) {
          $scope.getGroupMembers().then(function(response) {
            $scope.groupMembers = response.group.users;
            return getGroupMembersQ.resolve();
          });
        } else {
          getGroupMembersQ.resolve();
        }
        return getGroupMembersQ.promise.then(function() {
          tempUsers = tempUsers.filter(function(user) {
            const groupMembers = $scope.groupMembers.map(user => user.id);
            return groupMembers.indexOf(user.id) < 0;
          });
          $scope.data.group.users = tempUsers;
        });
      });
      return promise;
    };
  });

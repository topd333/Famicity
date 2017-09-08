angular.module('famicity')
  .controller('InternalUserGroupsController', function(
    $scope, $rootScope, ModalManager, directoryService, notification,
    LoadingAnimationUtilService, me) {
    'use strict';

    $scope.userId = me.id;
    $scope.getDirectory();
    $scope.selectionMode = false;
    $scope.mode = 'multipleInvitations';
    $scope.filter = null;
    LoadingAnimationUtilService.validateList();

    $scope.getDirectory = function() {
      return LoadingAnimationUtilService.addPromises(directoryService.getCustomDirectory({
        user_id: $scope.userId
      }).$promise);
    };

    $scope.multipleInviteMode = function() {
      if (!$scope.selectionMode) {
        $scope.selectionMode = true;
        $scope.filter = {
          global_state: 'directory'
        };
      } else {
        $scope.selectionMode = false;
        $scope.filter = null;
      }
    };
    $scope.sendMultipleInvite = function() {
      var user, usersToInvite, usersToInviteString, _i, _len, _ref;
      usersToInvite = [];
      _ref = $scope.users;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        user = _ref[_i];
        if (user.selected) {
          usersToInvite.push(user.email);
        }
      }
      usersToInviteString = usersToInvite.join(',');
      console.log(usersToInviteString);
    };
    $scope.openGroupAddBasicOptionsPopup = function() {
      ModalManager.open({
        templateUrl: '/views/popup/popup_group_add_basic_options.html',
        controller: 'GroupAddBasicOptionsPopupController',
        scope: $scope
      });
    };
    $scope.openAddGroupPopup = function() {
      ModalManager.open({
        templateUrl: '/views/popup/popup_add_group.html',
        controller: 'AddGroupPopupController',
        scope: $scope
      });
    };
    $scope.openAddContactsOptionsPopup = function() {
      ModalManager.open({
        templateUrl: '/views/popup/popup_add_contacts_options.html',
        controller: 'AddContactsOptionsPopupController',
        scope: $scope
      });
    };
  });

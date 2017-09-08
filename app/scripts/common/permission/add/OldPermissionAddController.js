angular.module('famicity')
  .controller('OldPermissionAddController', function(
$scope, $location, $state, $stateParams, $modal,
userManager, notification, directoryService, groupService,
pendingFormsManagerService, me, ROUTE, pubsub, PUBSUB) {
    'use strict';

    $scope.addMailField = function() {
      $scope.emailInputs.push({email: ''});
    };

    $scope.formData = pendingFormsManagerService.getForm($stateParams.form_key);
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.isCurrentUser = $scope.userId === $scope.viewedUserId;
    $scope.isShowLeftMenu = false;
    $scope.permission_type = $stateParams.permission_type;
    const translationData = {
      object_type: $stateParams.location_type
    };
    $scope.selectionMode = true;
    $scope.selectedUsers = $scope.selectedUsers || [];
    $scope.checkboxTriggered = function(user) {
      if (!$scope.alertInviteShown) {
        if (user.global_state !== 'active') {
          return $scope.showAlertPopup(user);
        }
      }
    };
    $scope.pageTitle = '';
    $scope.parentState = '';
    $scope.introductionTextKey = '';
    $scope.emailInputs = [];
    if ($scope.permission_type === 'permissions') {
      if ($scope.formData.permissions.email_permissions) {
        $scope.emailInputs = $scope.formData.permissions.email_permissions;
        while ($scope.emailInputs.length < 3) {
          $scope.addMailField();
        }
      } else {
        $scope.emailInputs = [{email: ''}, {email: ''}, {email: ''}];
      }
    }

    if (translationData.object_type === 'message') {
      $scope.pageTitleKey = 'RECIPIENTS_CHOICE_TITLE';
      $scope.parentState = 'user-message-add';
      $scope.introductionTextKey = 'RECIPIENTS_CHOICE_INSTRUCTIONS';
    } else if (translationData.object_type === 'calendar' && $scope.permission_type === 'permissions') {
      $scope.pageTitleKey = 'INVITATIONS_TITLE';
      $scope.parentState = '';
      $scope.introductionTextKey = 'EVENT_PERMISSIONS_INSTRUCTIONS';
    } else if (translationData.object_type === 'calendar' && $scope.permission_type === 'exclusions') {
      $scope.pageTitleKey = 'INVITATIONS_TITLE';
      $scope.parentState = '';
      $scope.introductionTextKey = 'EVENT_EXCLUSIONS_INSTRUCTIONS';
    } else {
      $scope.pageTitleKey = 'RIGHTS_TITLE';
      $scope.parentState = '';
      if (translationData.object_type === 'albums' && $scope.permission_type === 'permissions') {
        $scope.introductionTextKey = 'ALBUM_PERMISSIONS_INSTRUCTIONS';
      } else if (translationData.object_type === 'albums' && $scope.permission_type === 'exclusions') {
        $scope.introductionTextKey = 'RECIPIENTS_CHOICE_INSTRUCTIONS';
      } else if (translationData.object_type === 'blog' && $scope.permission_type === 'permissions') {
        $scope.introductionTextKey = 'POST_PERMISSIONS_INSTRUCTIONS';
      } else if (translationData.object_type === 'blog' && $scope.permission_type === 'exclusions') {
        $scope.introductionTextKey = 'POST_EXCLUSIONS_INSTRUCTIONS';
      } else if (translationData.object_type === 'default' && $scope.permission_type === 'permissions') {
        $scope.introductionTextKey = 'DEFAULT_PERMISSIONS_INSTRUCTIONS';
      } else if (translationData.object_type === 'default' && $scope.permission_type === 'exclusions') {
        $scope.introductionTextKey = 'DEFAULT_EXCLUSIONS_INSTRUCTIONS';
      } else if (translationData.object_type === 'tree' && $scope.permission_type === 'permissions') {
        $scope.introductionTextKey = 'TREE_PERMISSIONS_INSTRUCTIONS';
      } else if (translationData.object_type === 'tree' && $scope.permission_type === 'exclusions') {
        $scope.introductionTextKey = 'TREE_EXCLUSIONS_INSTRUCTIONS';
      }
    }

    $scope.$watch('users', function(newValue) {
      if (newValue) {
        if ($stateParams.permission_type === 'permissions') {
          $scope.users.forEach(function(user) {
            const permissionsIds = $scope.formData.permissions.user_permissions.map(e => e.id);
            if (permissionsIds.indexOf(user.id) >= 0) {
              user.selected = true;
              $scope.selectedUsers = $scope.selectedUsers || [];
            }
          });
          $scope.selectedUsers = $scope.formData.permissions.user_permissions;
        } else {
          $scope.users.forEach(function(user) {
            const exclusionIds = $scope.formData.permissions.user_exclusions.map(e => e.id);
            if (exclusionIds.indexOf(user.id) >= 0) {
              user.selected = true;
              $scope.selectedUsers = $scope.selectedUsers || [];
            }
          });
          $scope.selectedUsers = $scope.formData.permissions.user_exclusions;
        }
      }
    });

    $scope.getDirectory = function() {
      directoryService.getCustomDirectory({user_id: $scope.userId, invitable: 1}).$promise
        .then(function(response) {
          $scope.users = response.users;
        });
    };

    $scope.getCounters = function() {
      return directoryService.counters({
        state: 'active'
      });
    };

    $scope.loadMore = function(page, search) {
      const promise = directoryService.getCustomDirectory({
        user_id: $scope.userId,
        invitable: 1,
        q: search,
        page
      }).$promise;
      promise.then(function(response) {
        if (page === 1) {
          $scope.users = response.users;
        } else {
          $scope.users = $scope.users.concat(response.users);
        }
        if ($scope.selectedUsers && $scope.selectedUsers.length) {
          const userIds = $scope.selectedUsers.map(user => user.id);
          $scope.users = $scope.users.map(function(user) {
            if ($scope.selectedUsers && userIds.indexOf(user.id) >= 0) {
              user.selected = true;
            }
            return user;
          });
        }
      });
      return promise;
    };

    $scope.getGroups = function() {
      $scope.$watch('groups', function(newValue) {
        if (newValue) {
          if ($stateParams.permission_type === 'permissions') {
            const _results = [];
            const groupPermissionIds = $scope.formData.permissions.group_permissions.map(group => group.id);
            $scope.groups.forEach(function(group) {
              if (groupPermissionIds.indexOf(group.id) > -1) {
                _results.push(group.selected = true);
              } else {
                _results.push(undefined);
              }
            });
            return _results;
          } else if ($stateParams.permission_type !== 'permissions') {
            const _results1 = [];
            const groupExclusionsIds = $scope.formData.permissions.group_exclusions.map(group => group.id);
            $scope.groups.forEach(function(group) {
              if (groupExclusionsIds.indexOf(group.id) > -1) {
                _results1.push(group.selected = true);
              } else {
                _results1.push(undefined);
              }
            });
            return _results1;
          }
        }
      });
      groupService.getGroups($scope.userId).then((groups) => $scope.groups = groups);
    };

    $scope.submitPermission = function() {
      let selectedUsers = [];
      let selectedGroups = [];
      if ($scope.hasOwnProperty('users') === true) {
        selectedUsers = $scope.selectedUsers;
      }
      if ($scope.hasOwnProperty('groups') === true) {
        selectedGroups = $scope.groups.reduce(function(arr, group) {
          if (group.selected) {
            arr.push(group);
          }
          return arr;
        }, []);
      }
      if ($stateParams.permission_type === 'permissions') {
        $scope.formData.permissions.user_permissions = selectedUsers;
        $scope.formData.permissions.group_permissions = selectedGroups;
        $scope.formData.permissions.email_permissions = [];
        $scope.emailInputs.forEach(function(email) {
          if (email.email) {
            $scope.formData.permissions.email_permissions.push({
              email: email.email
            });
          }
        });
      } else {
        $scope.formData.permissions.user_exclusions = selectedUsers;
        $scope.formData.permissions.group_exclusions = selectedGroups;
      }
      pendingFormsManagerService.addForm($stateParams.form_key, 'permissions', $scope.formData.permissions);

      if ($stateParams.form_key === 'add_event') {
        $state.go('u.event-add', {tab: 'permission'}, {reload: true});
      } else if ($stateParams.form_key === 'edit_event') {
        $state.go('u.event-edit', {event_id: $scope.formData.config.objectId, tab: 'permission'}, {reload: true});
      } else if ($stateParams.form_key === 'add_msg') {
        $state.go(ROUTE.MESSAGE.CREATE);
      } else if ($stateParams.form_key.indexOf('add') === 0) {
        $location.url(
          '/users/' + $scope.viewedUserId +
          '/' + $stateParams.location_type + '/add').search({tab: 'permission', ts: Date.now()});
      } else if ($stateParams.location_type === 'blog') {
        $state.go('u.user-blog-edit-post', {
          user_id: $scope.viewedUserId,
          post_id: $scope.formData.config.objectId,
          tab: 'permission'
        }, {reload: true});
      } else if ($stateParams.location_type === 'default') {
        $state.go('u.settings-privacy-default_rights', {reload: true});
      } else if ($stateParams.location_type === 'tree') {
        $state.go('u.settings-privacy-tree_rights', {reload: true});
      } else if ($stateParams.form_key === 'edit_album') {
        $state.go('u.albums-update', {
          user_id: $scope.viewedUserId,
          album_id: $scope.formData.config.objectId,
          tab: 'permission'
        }, {reload: true});
      } else {
        $location.url(
          '/users/' + $scope.viewedUserId +
          '/' + $stateParams.location_type +
          '/' + $scope.formData.config.objectId + '/edit').search({tab: 'permission'});
      }
    };
    pubsub.subscribe(PUBSUB.PERMISSION.ADD.SUBMIT, () => $scope.submitPermission());
  });

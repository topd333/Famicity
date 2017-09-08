angular.module('famicity')
  .controller('MessageAddController', function(
    $scope, $stateParams, $location, $state, $q,
    notification, Message, pendingFormsManagerService,
    story, defaultPermissions, users, groups, $translate, ROUTE) {
    'use strict';

    const setRecipients = function() {
      if ($scope.formData.permissions.user_permissions || $scope.formData.permissions.group_permissions || $scope.formData.permissions.email_permissions) {
        $scope.formData.message.recipients = '';
        $scope.formData.message.recipientsToDisplay = '';
        angular.forEach($scope.formData.permissions.user_permissions, function(value) {
          $scope.formData.message.recipients += 'u' + value.id + ',';
          $scope.formData.message.recipientsToDisplay += value.user_name + ', ';
        });
        angular.forEach($scope.formData.permissions.group_permissions, function(value) {
          $scope.formData.message.recipients += 'g' + value.id + ',';
          $scope.formData.message.recipientsToDisplay += value.group_name + ', ';
        });
        angular.forEach($scope.formData.permissions.email_permissions, function(value) {
          $scope.formData.message.recipientsToDisplay += value.email + ', ';
        });
        $scope.formData.message.recipients = $scope.formData.message.recipients.slice(0, -1);
        $scope.formData.message.recipientsToDisplay = $scope.formData.message.recipientsToDisplay.slice(0, -2);
      }
    };

    $scope.$parent.showMode = true;
    $scope.$parent.currentId = null;
    $scope.submitted = false;
    $scope.messagesListControl = {};
    $scope.formKey = 'add_msg';
    $scope.formInProgress = false;
    $scope.formData = pendingFormsManagerService.getForm($scope.formKey);

    if (!$scope.formData.message) {
      $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'message', {
        recipients: '',
        recipientsToDisplay: ''
      });
    }
    if (!$scope.formData.permissions) {
      $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'permissions', {
        email_permissions: [],
        group_permissions: [],
        user_permissions: [],
        group_exclusions: [],
        user_exclusions: []
      });
    }

    if (story) {
      const href = $state.href('u.story.get', {id: story.id}, {absolute: true});
      $scope.formData.message.subject = $translate.instant('STORY.MESSAGE.TITLE');
      $scope.formData.message.body = $translate.instant('STORY.MESSAGE.TEXT', {link: href});
    }
    if (users) {
      $scope.formData.permissions.user_permissions = users;
    }
    if (groups) {
      $scope.formData.permissions.group_permissions = groups;
    }
    if (defaultPermissions) {
      $scope.formData.permissions.user_permissions = defaultPermissions.user_permissions;
      $scope.formData.permissions.group_permissions = defaultPermissions.group_permissions;
    }

    setRecipients();
    $scope.locationType = 'message';

    $scope.$watch('$scope.formKey', function() {
      if (pendingFormsManagerService.getForm($scope.formKey)) {
        pendingFormsManagerService.addForm($scope.formKey, 'message', $scope.formData.message);
        pendingFormsManagerService.addForm($scope.formKey, 'permissions', $scope.formData.permissions);
      }
    });

    $scope.addPermission = function() {
      $state.go('permission-object', {
        user_id: $scope.userId,
        location_type: $scope.locationType,
        permission_type: 'permissions',
        form_key: $scope.formKey
      }, {location: false});
    };

    $scope.submit = function() {
      var invitations, message, promises, savePromise;
      promises = [];
      $scope.submitted = true;
      if ($scope.addMessageForm.$valid && $scope.formData.message.recipientsToDisplay) {
        invitations = pendingFormsManagerService.getFormattedInvitations($scope.formData.permissions.email_permissions);
        message = new Message({
          recipients: $scope.formData.message.recipients,
          message: {
            body: $scope.formData.message.body,
            subject: $scope.formData.message.subject
          },
          invitations: invitations
        });
        savePromise = message.$save({
          user_id: $scope.userId
        });
        promises.push(savePromise);
        savePromise.then(function(response) {
          notification.add('MESSAGE_CREATED_SUCCESS_MSG');
          pendingFormsManagerService.removeForm($scope.formKey);
          $state.go(ROUTE.MESSAGE.GET, {
            message_id: response.message.id
          }, {
            reload: true
          });
        });
      } else {
        notification.add('INVALID_FORM', {warn: true});
      }
      return promises;
    };
  });

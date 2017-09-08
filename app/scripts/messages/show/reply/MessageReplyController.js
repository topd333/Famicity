angular.module('famicity')
  .controller('MessageReplyController', function(
    $scope, $modalInstance, $q, Message, notification, pendingFormsManagerService) {
    'use strict';

    $scope.formInProgress = false;
    $scope.submitted = false;
    $scope.formHolder = {};
    $scope.reply = {};

    $scope.submit = function() {
      const promises = [];
      $scope.submitted = true;
      const message = new Message({
        message: {
          parent_id: $scope.messageId,
          body: $scope.reply.body
        }
      });
      const savePromise = message.$save({
        user_id: $scope.userId
      });
      promises.push(savePromise);
      savePromise.then(function(response) {
        notification.add('MESSAGE_CREATED_SUCCESS_MSG');
        pendingFormsManagerService.removeForm($scope.formKey);
        $scope.childrenMessages.push(response.content);
        $scope.messages = $scope.messages.map(function(message) {
          if (message.id === $scope.messageId) {
            message.messages_count++;
          }
          return message;
        });
      }).finally(function() {
        $modalInstance.close();
      });
      return promises;
    };
  });

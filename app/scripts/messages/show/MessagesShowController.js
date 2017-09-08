angular.module('famicity')
  .controller('MessagesShowController', function(
    $scope, $stateParams, ModalManager, $location, $state,
    Message, LoadingAnimationUtilService, yesnopopin, notification,
    ROUTE, message, pubsub, PUBSUB) {
    'use strict';

    LoadingAnimationUtilService.resetPromises();
    LoadingAnimationUtilService.activate();

    $scope.message = message;
    $scope.messageId = message.id;
    $scope.showContactDetails = false;

    const childrenPromise = Message.messages_children({
      user_id: $scope.userId,
      message_id: $scope.messageId
    }).$promise;

    LoadingAnimationUtilService.addPromises(childrenPromise);

    $scope.$parent.currentId = $scope.message.id;

    childrenPromise.then((response) => {
      $scope.childrenMessages = response.messages;
    });

    $scope.$parent.showMode = true;
    LoadingAnimationUtilService.validateList();

    $scope.loadMoreChildrenMessages = () => {
      $scope.childrenMessagesLoading = true;
      return Message.messages_children({
        user_id: $scope.userId,
        message_id: $scope.messageId,
        last_object_id: $scope.childrenMessages[0].id
      }).$promise.then(function(response) {
          $scope.childrenMessages = response.messages.concat($scope.childrenMessages);
        }).finally(function() {
          $scope.childrenMessagesLoading = false;
        });
    };

    $scope.$parent.openReplyMessagePopup = () => ModalManager.open({
      templateUrl: '/scripts/messages/show/reply/MessageReply.html',
      controller: 'MessageReplyController',
      scope: $scope
    });
    pubsub.subscribe(PUBSUB.MESSAGES.SHOW.REPLY, $scope.$parent.openReplyMessagePopup, $scope);

    $scope.toggleShowContactDetails = () => {
      $scope.showContactDetails = !$scope.showContactDetails;
    };

    pubsub.subscribe(PUBSUB.MESSAGES.SHOW_DISCUSSION_PARTICIPANTS, $scope.toggleShowContactDetails, $scope);
  });

angular.module('famicity').directive('fcChatWindow', function(
  pubsub, $moment, $interval, $timeout, PUBSUB) {
  'use strict';

  return {
    restrict: 'E',
    replace: false,
    templateUrl: '/scripts/directives/chat/fc-chat-window.html',
    link($scope, element) {
      let defaultInterval;
      let interval;
      $scope.conversation.conversationElement = element.find('.chat-conversation');
      $scope.conversation.inputElement = element.find('textarea');
      $scope.conversation.inputElement.on('input.autosize', function() {
        return $(this).parents('form').scrollTop($(this).parents('form')[0].scrollHeight); // eslint-disable-line
      });
      $scope.conversation.hasFocus = false;
      $scope.$moment = $moment;
      defaultInterval = $moment.duration(1, 'minutes').asMilliseconds();
      $scope.interval = defaultInterval;
      interval = $interval(function() {
        //if (!$scope.$$phase) {
        //  $scope.$apply();
        //}
        $scope.conversation.sentAgo = $moment($scope.conversation.messages[$scope.conversation.messages.length - 1].timestamp).fromNow();
      }, $scope.interval);
      $scope.$on('$destroy', function() {
        $interval.cancel(interval);
      });
      $scope.keydown = function($event) {
        if ($event.keyCode === 13 && !$event.shiftKey) {
          $scope.speak();
          $event.preventDefault();
          return false;
        }
      };
      $scope.speak = function() {
        if ($scope.text === '') {
          return;
        }
        pubsub.publish(PUBSUB.CHAT.SEND, {
          userId: $scope.conversation.user.userId,
          senderId: $scope.userId,
          text: $scope.text
        });
        $scope.text = '';
        $scope.conversation.inputElement.val('').trigger('autosize.resize');
      };
      $scope.setFocus = function() {
        $timeout(function() {
          $scope.conversation.inputElement.focus();
        });
      };
      $scope.focused = function() {
        $scope.conversation.hasFocus = true;
        $scope.conversation.unread = 0;
        $scope.PageTitle.updateChatUnread($scope.getUnread());
        $timeout(function() {
          $scope.conversation.conversationElement.scrollTop($scope.conversation.conversationElement[0].scrollHeight);
        });
      };
      $scope.blurred = function() {
        $scope.conversation.hasFocus = false;
      };
      $scope.toggleHideWindow = function() {
        if ($scope.conversation.hidden) {
          $scope.conversation.hidden = false;
          $scope.setFocus();
        } else {
          $scope.conversation.hidden = true;
        }
      };
    }
  };
});

angular.module('famicity').directive('fcMessagesList', function(Message, $state, pubsub, PUBSUB, ROUTE) {
  'use strict';
  return {
    replace: true,
    scope: {
      messages: '=',
      currentId: '=',
      showMessage: '=',
      control: '=',
      userId: '='
    },
    templateUrl: '/scripts/messages/list/fc-message-list.html',
    link($scope) {

      $scope.control = $scope.control || {};
      $scope.control.lastCalledIndex = {
        type: '',
        id: ''
      };

      pubsub.subscribe(PUBSUB.MESSAGES.UNREADCOUNT, function() {
        if ($scope.messages) {
          $scope.messages[0].is_unread = false;
        }
      }, $scope);

      $scope.goPrevPage = function() {
        Message.query({
          user_id: $scope.userId,
          first_object_id: $scope.messages[0].id
        }).$promise.then(function(response) {
            $scope.messages = response.messages;
            $scope.control.lastCalledIndex = {
              type: 'prev',
              id: $scope.messages[0].id
            };
          });
      };

      $scope.selectDiscussion = function(discussion) {
        discussion.is_unread = false;
        $state.go(ROUTE.MESSAGE.GET, {
          'message_id': discussion.id
        });
        $state.go(ROUTE.MESSAGE.GET, {
          'message_id': discussion.id
        }, {
          reload: discussion.is_unread
        });
      };

      $scope.goNextPage = function() {
        Message.query({
          user_id: $scope.userId,
          last_object_id: $scope.messages[$scope.messages.length - 1].id
        }).$promise.then(function(response) {
            $scope.messages = response.messages;
            $scope.control.lastCalledIndex = {
              type: 'next',
              id: $scope.messages[$scope.messages.length - 1].id
            };
          });
      };
    }
  };
});

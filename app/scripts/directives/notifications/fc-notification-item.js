angular.module('famicity').directive('fcNotificationItem', function($moment, sessionManager) {
  'use strict';
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: '/views/internal/fc-notification-item.html',
    scope: {
      avatarUrl: '=',
      userId: '=',
      numberOfUsers: '=',
      userName: '=',
      text: '=?',
      textKey: '=?',
      type: '=',
      unread: '=',
      date: '=',
      disableUserLink: '=',
      clickable: '='
    },
    link($scope) {
      $scope.$moment = $moment;
      $scope.currentUserId = sessionManager.getUserId();
      if ($scope.textKey && $scope.currentUserId === $scope.userId) {
        $scope.textKey = 'YOU_' + $scope.textKey;
      }
    }
  };
});

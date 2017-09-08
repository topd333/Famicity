angular.module('famicity').controller('UserNotificationsController', function(
$scope, $window, $moment, $state, $location, $translate,
$translateMessageFormatInterpolation, sessionManager, NotificationsManager, pubsub,
me, PUBSUB, Notifications) {
  'use strict';

  const publishUnreadCount = function() {
    const unreadCount = $scope.userNotifications.reduce(function(count, user) {
      if (user.unread) {
        count += 1;
      }
      return count;
    }, 0);
    pubsub.publish(PUBSUB.NOTIFICATIONS.UNREADCOUNT, unreadCount);
  };

  $scope.userId = me.id;
  $scope.isEnabled = true;
  $scope.isConnected = true;
  $scope.displayPanel = true;
  $scope.userNotifications = [];
  $scope.$moment = $moment;
  $scope.page = 1;
  $scope.infiniteScrollLoading = false;
  $scope.infiniteScrollDisabled = true;

  $scope.loadMoreElements = function() {
    $scope.infiniteScrollLoading = true;
    $scope.page += 1;
    const userId = $scope.userId;
    const lastId = $scope.userNotifications && $scope.userNotifications.length < 1 ? null : $scope.userNotifications[$scope.userNotifications.length - 1].id;
    Notifications.query({
      user_id: userId,
      last_object_id: lastId
    }).$promise.then(function(notifications) {
      $scope.infiniteScrollLoading = false;
      if (notifications.length === 0) {
        $scope.infiniteScrollDisabled = true;
      } else {
        $scope.infiniteScrollDisabled = false;
        $scope.userNotifications = $scope.userNotifications.concat(notifications.map(function(notification) {
          const properties = NotificationsManager.buildProperties(notification, $scope.userId);
          notification.href = properties.href;
          notification.text = properties.text;
          notification.icon = properties.icon;
          return notification;
        }));
      }
      $scope.$applyAsync(function() {
        publishUnreadCount();
      });
    });
  };

  $scope.loadMoreElements();

  $scope.openNotification = function(notification) {
    $location.url(notification.href);
  };

  pubsub.subscribe(PUBSUB.PUSH.CONNECT, function() {
    $scope.loadMoreElements();
  }, $scope);
});

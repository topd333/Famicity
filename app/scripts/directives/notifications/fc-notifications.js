angular.module('famicity')
  .directive('fcNotifications', function(
    $window, $timeout, $moment, $state, $location,
    $translate, $translateMessageFormatInterpolation, pubsub, sessionManager, Notifications,
    NotificationsManager, yesnopopin, PUBSUB, $q) {
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/views/internal/fc-notifications.html',
      // scope: true
      link($scope) {
        const log = debug('fc-push');
        let lastId = null;

        $scope.isEnabled = true;
        $scope.isConnected = true;
        $scope.displayPanel = false;
        $scope.userNotifications = [];
        $scope.$moment = $moment;
        $scope.page = 1;
        $scope.infiniteScrollLoading = false;
        $scope.infiniteScrollDisabled = true;
        $scope.userNotifications = [];

        const publishUnreadCount = function() {
          // return if newValue.length is oldValue.length
          const unreadCount = $scope.userNotifications
            .filter(notification => notification.unread)
            .length;
          pubsub.publish(PUBSUB.NOTIFICATIONS.UNREADCOUNT, unreadCount);
        };

        const setUnreadTimer = function(time) {
          if (!time) {
            time = 0;
          }
          publishUnreadCount();
          $timeout(function() {
            $scope.userNotifications = $scope.userNotifications.map(function(notification) {
              notification.unread = false;
              return notification;
            });
            publishUnreadCount();
          }, time * 1000);
        };

        $scope.openNotification = function(notification) {
          $location.url(notification.href);
        };

        const connect = function(userId) {
          log('connect with userId: %o', userId);
          $scope.isConnected = true;
          $scope.userId = userId;
          // parseNotifications(notifications);
          pubsub.publish(PUBSUB.PUSH.SOCKET.CONNECT, userId);
        };

        pubsub.subscribe(PUBSUB.NOTIFICATIONS.TOGGLE, function() {
          pubsub.publish(PUBSUB.TREE.SEARCH.CLOSE);
          pubsub.publish(PUBSUB.TREE.MATCHING.CLOSE);
          if ($scope.isConnected && $scope.userId) {
            if ($scope.displayPanel === false) {
              $scope.displayPanel = true;
              // if ($scope.userNotifications.length === 0) {
              $scope.loadMoreElements();
              // }
              $scope.$applyAsync(function() {
                setUnreadTimer(2);
              });
            } else {
              $scope.displayPanel = false;
            }
          } else {
            Bugsnag.notify('NotificationInitialization', 'An error occured during notification initialization.');
            yesnopopin.open('NOTIFICATIONS.RETRIEVE_ERROR', {yes: 'REFRESH'}).then(function() {
              $window.location.reload();
            });
          }
        }, $scope);

        pubsub.subscribe(PUBSUB.NOTIFICATIONS.CLOSE, function() {
          $scope.displayPanel = false;
        }, $scope);

        pubsub.subscribe(PUBSUB.NOTIFICATIONS.ENABLE, function() {
          $scope.isEnabled = true;
        }, $scope);

        pubsub.subscribe(PUBSUB.NOTIFICATIONS.DISABLE, function() {
          $scope.isEnabled = false;
        }, $scope);

        pubsub.subscribe(PUBSUB.PUSH.CONNECT, function(event, response) {
          connect(response.userId, response.notifications);
        }, $scope);

        pubsub.subscribe(PUBSUB.NOTIFICATIONS.RECEIVE, function(event, notification) {
          const properties = NotificationsManager.buildProperties(notification, $scope.userId);
          notification.href = properties.href;
          notification.text = properties.text;
          notification.icon = properties.icon;
          if (notification.object && notification.author &&
              // No duplicate
            !$scope.userNotifications.some(notif => notif.id === notification.id)) {
            $scope.userNotifications.push(notification);
          }
          $scope.$applyAsync(function() {
            if ($scope.displayPanel) {
              setUnreadTimer(6);
            } else {
              publishUnreadCount();
            }
          });
        }, $scope);

        pubsub.subscribe(PUBSUB.NOTIFICATIONS.REMOVE, function(event, notificationId) {
          $scope.userNotifications = $scope.userNotifications.filter(function(notification) {
            return notification.id !== notificationId;
          });
          // if (!$scope.$$phase) {
          //  $scope.$apply();
          // }
        }, $scope);

        // Subscribe to chat disconnect
        pubsub.subscribe(PUBSUB.NOTIFICATIONS.DISCONNECT, function() {
          log('disconnect');
          $scope.userNotifications = [];
          $scope.displayPanel = false;
          $scope.isConnected = false;
          pubsub.publish(PUBSUB.NOTIFICATIONS.DISCONNECT_SOCKET);
        }, $scope);
        $scope.hideNotifications = function() {
          $scope.displayPanel = false;
        };

        function parseNotifications(userNotifications) {
          $scope.infiniteScrollLoading = false;
          if (userNotifications.length === 0) {
            $scope.infiniteScrollDisabled = true;
          } else {
            $scope.infiniteScrollDisabled = false;
            $scope.userNotifications =
              $scope.userNotifications.concat(userNotifications.reduce(function(notifications, notification) {
                const properties = NotificationsManager.buildProperties(notification, $scope.userId);
                notification.href = properties.href;
                notification.text = properties.text;
                notification.icon = properties.icon;
                if (notification.object && notification.author && !$scope.userNotifications.some(
                      n => n.id === notification.id)) {
                  notifications.push(notification);
                }
                return notifications;
              }, []));
          }
        }

        $scope.loadMoreElements = function() {
          $scope.infiniteScrollLoading = true;
          $scope.page += 1;
          // lastId = $scope.userNotifications.length < 1 ? null : $scope.userNotifications[$scope.userNotifications.length - 1].id;

          // NotificationService.getNotifications(userId, lastId).then(function (notifications) {
          Notifications.query({user_id: $scope.userId, last_object_id: lastId}).$promise
            .then(function(notifications) {
              if (notifications && notifications.length && notifications[0].error) {
                return $q.reject(notifications[0].error);
              }
              if (notifications && notifications.length) {
                lastId = notifications[notifications.length - 1].id;
              }
              parseNotifications(notifications);
              $scope.$applyAsync(function() {
                publishUnreadCount();
              });
            })
            .catch(function() {
              $scope.displayPanel = false;
              yesnopopin.open('NOTIFICATIONS.RETRIEVE_ERROR', {yes: 'REFRESH'}).then(function() {
                $window.location.reload();
              });
            });
        };
      }
    };
  });

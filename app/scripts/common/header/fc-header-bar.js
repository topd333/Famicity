angular.module('famicity')
  .directive('fcHeaderBar', function($window, $location, $state, pubsub, counters, PUBSUB) {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        userId: '='
      },
      templateUrl: '/scripts/common/header/fc-header-bar.html',
      transclude: true,
      link(scope) {
        scope.showNotificationsIcon = isMobile.phone && $state.current.name === 'u.home';
        scope.unreadNotifications = counters.getUnreadNotifications();
        return pubsub.subscribe(PUBSUB.NOTIFICATIONS.UNREADCOUNT, function(event, unreadCount) {
          scope.unreadNotifications = unreadCount;
        }, scope);
      }
    };
  });

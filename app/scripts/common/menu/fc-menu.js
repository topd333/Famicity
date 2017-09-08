angular.module('famicity')
  .directive('fcMenu', function($window, $location, $state, pubsub, counters, PUBSUB, menuBuilder, MENU_CHANGE_EVENT) {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        userId: '='
      },
      priority: 1,
      bindToController: true,
      controllerAs: 'header',
      templateUrl: '/scripts/common/menu/fc-menu.html',
      controller($scope) {
        this.menu = {};
        this.showNotificationsIcon = isMobile.phone && $state.current.name === 'u.home';
        this.unreadNotifications = counters.getUnreadNotifications();
        pubsub.subscribe(PUBSUB.NOTIFICATIONS.UNREADCOUNT, (event, unreadCount) => {
          this.unreadNotifications = unreadCount;
        }, $scope);

        menuBuilder.onChange(MENU_CHANGE_EVENT, (msg, newMenu) => {
          this.menu = newMenu;
          pubsub.poolOk(MENU_CHANGE_EVENT);
        });
      }
    };
  });

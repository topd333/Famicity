angular.module('famicity').factory('windowSizeNotification', function($rootScope, $window, pubsub, util, PUBSUB) {
  'use strict';
  let isMobileView;
  let isTabletView;
  let removeEvent;
  isMobileView = false;
  isTabletView = false;

  const windowChange = function() {
    $rootScope.$broadcast(PUBSUB.WINDOW.DEVICE, {
      mobile: isMobileView,
      tablet: isTabletView
    });
    pubsub.publish(PUBSUB.WINDOW.RESIZE, {
      width: $window.innerWidth,
      height: $window.innerHeight
    });
  };

  return {
    initChanel() {
      const self = this;
      removeEvent = $rootScope.$on('$viewContentLoaded', function() {
        return self.setResolutionView();
      });
      return angular.element($window).bind('resize', function() {
        return self.debouncedSetResolutionView();
      });
    },
    debouncedSetResolutionView: util.debounce(function() {
      if ($window.matchMedia('(max-width: 767px)').matches === true) {
        isMobileView = true;
        isTabletView = false;
      } else if ($window.matchMedia('(max-width: 992px)').matches === true && $window.matchMedia('(min-width: 768px)').matches === true) {
        isTabletView = true;
        isMobileView = false;
      } else {
        isTabletView = false;
        isMobileView = false;
      }
      windowChange();
    }, 250),
    setResolutionView() {
      if ($window.matchMedia('(max-width: 767px)').matches === true) {
        isMobileView = true;
        isTabletView = false;
      } else if ($window.matchMedia('(max-width: 992px)').matches === true && $window.matchMedia('(min-width: 768px)').matches === true) {
        isTabletView = true;
        isMobileView = false;
      } else {
        isTabletView = false;
        isMobileView = false;
      }
      return this.windowChange();
    },
    windowChange,
    onWindowChange($scope, handler) {
      return $scope.$on(PUBSUB.WINDOW.DEVICE, function(event, message) {
        return handler(message);
      });
    },
    isMobile() {
      return isMobileView;
    },
    deleteChanel() {
      angular.element($window).off('resize');
      removeEvent();
    }
  };
});

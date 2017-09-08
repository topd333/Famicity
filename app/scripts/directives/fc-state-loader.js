angular.module('famicity').directive('fcStateLoader', function($state) {
  'use strict';
  return {
    restrict: 'A',
    scope: {},
    link(scope, element) {
      scope.$on('$stateChangeStart', function() {
        var complexRoute = $state.current.data && $state.current.data.authorizedFormRoutes && $state.current.data.authorizedFormRoutes.length;
        var doNotHideOnLoad = $state.current.data && $state.current.data.doNotHideOnLoad && $state.current.data.doNotHideOnLoad;
        if (!complexRoute && !doNotHideOnLoad) {
          element.addClass('loading-state');
        }
      });
      scope.$on('$stateChangeSuccess', function() {
        element.removeClass('loading-state');
      });
      scope.$on('$stateChangeError', function() {
        element.removeClass('loading-state');
      });
      scope.$on('$stateChangeInterrupted', function() {
        element.removeClass('loading-state');
      });
    }
  };
});

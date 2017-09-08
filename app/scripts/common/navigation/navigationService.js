angular.module('famicity')
.service('navigation', function(navigationImpl, $rootScope, sessionManager) {
  'use strict';

  const go = (
  stateName, businessParams, technicalOptions) => navigationImpl.go(stateName, businessParams, technicalOptions);
  const href = (
  stateName, businessParams, technicalOptions) => navigationImpl.href(stateName, businessParams, technicalOptions);
  const getCurrent = () => navigationImpl.getCurrent();
  const getStatesChain = () => navigationImpl.getStatesChain();
  const cancel = (navigationEvent) => navigationImpl.cancel(navigationEvent);
  const navigateRequest = (navigationEvent) => navigationImpl.navigateRequest(navigationEvent);

  function navigationToScope(newNavigation) {
    // TODO keep those properties in navigationData instead of $rootScope
    if (newNavigation.pageType) {
      $rootScope.pageType = newNavigation.pageType;
    }
    if (newNavigation.showLoading) {
      $rootScope.showLoading = newNavigation.showLoading;
    }
    if (newNavigation.pageId) {
      $rootScope.pageId = newNavigation.pageId;
    }
  }

  function scopeToNavigation(navigationEvent) {
    // TODO keep those properties in navigationData instead of $rootScope
    navigationEvent.pageType = $rootScope.pageType;
  }

  $rootScope.$on('$stateChangeStart',
  function(event, toState, toParams, fromState, fromParams) {
    const navigationEvent = {
      event,
      toState,
      toParams,
      fromState,
      fromParams,
      isSignedIn: sessionManager.getToken()
    };
    scopeToNavigation(navigationEvent);
    const newNavigation = navigateRequest(navigationEvent);
    if (newNavigation.changed /* || !angular.equals(navigationEvent.toState, newNavigation.toState)*/) {
      cancel(navigationEvent);
      go(newNavigation.toState, newNavigation.toParams, newNavigation.options);
    }
    navigationToScope(newNavigation);
  });

  return {
    go,
    href,
    getCurrent,
    getStatesChain
  };
});

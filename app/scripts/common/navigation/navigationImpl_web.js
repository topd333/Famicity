angular.module('famicity')
/**
 * The implementation of navigationImpl for websites
 */
.service('navigationImpl', ($rootScope, $state, $breadcrumb, NavigationToPublicChecker) => {
  'use strict';
  const log = debug('fc-navigationImpl_web');

  const navigationChecker = {
    check: (navigationEvent) => NavigationToPublicChecker.check(navigationEvent)
  };

  // UI-Router implem, to be provided by a factory configured for web
  return {
    go: (stateName, businessParams, technicalOptions) => $state.go(stateName, businessParams, technicalOptions),
    getCurrent: () => $state.current,
    href: (stateName, businessParams, technicalOptions) => $state.href(stateName, businessParams, technicalOptions),
    getStatesChain: () => $breadcrumb.getStatesChain(),
    cancel(navigationEvent) {
      navigationEvent.event.preventDefault();
      $rootScope.$broadcast('$stateChangeInterrupted');
    },
    navigateRequest(navigationEvent) {
      return navigationChecker.check(navigationEvent);
    }
  };
});

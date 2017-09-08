angular.module('famicity')
.config(function($stateProvider, ROUTE) {
  'use strict';

  let authenticationProvidersMenu;
  function getAuthenticationProvidersMenu(menuBuilder) {
    if (!authenticationProvidersMenu) {
      authenticationProvidersMenu = menuBuilder.newMenu().getMenu();
    }
    return menuBuilder.changedTo(authenticationProvidersMenu);
  }

  return $stateProvider
  .state(ROUTE.SETTINGS.AUTHENTICATION_PROVIDERS, {
    url: '/settings/providers',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/auth-providers/SettingsAuthProviders.html',
        controller: 'SettingsAuthProvidersController'
      }
    },
    resolve: {
      menu: (menuBuilder) => getAuthenticationProvidersMenu(menuBuilder)
    },
    data: {
      stateClass: 'settings social'
    },
    ncyBreadcrumb: {
      label: '{{ \'SOCIAL_NETWORKS\' | translate }}'
    }
  });
});

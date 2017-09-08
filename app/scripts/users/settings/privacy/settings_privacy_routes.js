angular.module('famicity')
.config(function($stateProvider, ROUTE) {
  'use strict';

  let privacyMenu;
  function getPrivacyMenu(menuBuilder) {
    if (!privacyMenu) {
      privacyMenu = menuBuilder.newMenu().getMenu();
    }
    return menuBuilder.changedTo(privacyMenu);
  }

  let defaultRightsMenu;
  function getDefaultRightsMenu(MENU, menuBuilder) {
    if (!defaultRightsMenu) {
      const submitAction = MENU[ROUTE.SETTINGS.PRIVACY.DEFAULT_RIGHTS].actions.submitAction;
      defaultRightsMenu = menuBuilder.newMenu().withAction(submitAction).getMenu();
    }
    return menuBuilder.changedTo(defaultRightsMenu);
  }

  let searchEngineMenu;
  function getSearchEngineMenu(MENU, menuBuilder) {
    if (!searchEngineMenu) {
      const submitAction = MENU[ROUTE.SETTINGS.PRIVACY.SEARCH_ENGINE].actions.submitAction;
      searchEngineMenu = menuBuilder.newMenu().withAction(submitAction).getMenu();
    }
    return menuBuilder.changedTo(searchEngineMenu);
  }

  let treeRightsMenu;
  function getTreeRightsMenu(MENU, menuBuilder) {
    if (!treeRightsMenu) {
      const submitAction = MENU[ROUTE.SETTINGS.PRIVACY.TREE_RIGHTS].actions.submitAction;
      treeRightsMenu = menuBuilder.newMenu().withAction(submitAction).getMenu();
    }
    return menuBuilder.changedTo(treeRightsMenu);
  }

  $stateProvider
  .state(ROUTE.SETTINGS.PRIVACY.STATE, {
    url: '/settings/privacy',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/privacy/SettingsPrivacy.html',
        controller: 'SettingsPrivacyController'
      }
    },
    data: {
      stateClass: 'settings privacy'
    },
    resolve: {
      menu: (menuBuilder) => getPrivacyMenu(menuBuilder)
    },
    ncyBreadcrumb: {
      label: '{{ \'PRIVACY\' | translate }}'
    }
  })
  .state(ROUTE.SETTINGS.PRIVACY.DEFAULT_RIGHTS, {
    url: '/settings/privacy/default_rights',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/privacy/default-rights/PrivacyDefaultRights.html',
        controller: 'PrivacyDefaultRightsController'
      }
    },
    resolve: {
      menu: (menuBuilder, MENU) => getDefaultRightsMenu(MENU, menuBuilder)
    },
    ncyBreadcrumb: {
      parent: ROUTE.SETTINGS.PRIVACY.STATE,
      label: '{{ \'DEFAULT_RIGHTS\' | translate }}'
    },
    data: {
      stateClass: 'settings privacy default-rights',
      authorizedFormRoutes: ['default_rights']
    }
  })
  .state(ROUTE.SETTINGS.PRIVACY.SEARCH_ENGINE, {
    url: '/settings/privacy/search_engine',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/privacy/search-engine/SettingsPrivacySearchEngine.html',
        controller: 'SettingsPrivacySearchEngineController'
      }
    },
    resolve: {
      menu: (menuBuilder, MENU) => getSearchEngineMenu(MENU, menuBuilder)
    },
    data: {
      stateClass: 'settings privacy search-engine'
    },
    ncyBreadcrumb: {
      parent: ROUTE.SETTINGS.PRIVACY.STATE,
      label: '{{ \'SEARCH_ENGINE_RIGHTS_PAGE_TITLE\' | translate }}'
    }
  })
  .state(ROUTE.SETTINGS.PRIVACY.TREE_RIGHTS, {
    url: '/settings/privacy/tree_rights',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/privacy/tree/SettingsPrivacyTree.html',
        controller: 'SettingsPrivacyTreeController'
      }
    },
    resolve: {
      menu: (menuBuilder, MENU) => getTreeRightsMenu(MENU, menuBuilder)
    },
    ncyBreadcrumb: {
      parent: ROUTE.SETTINGS.PRIVACY.STATE,
      label: '{{ \'TREE_RIGHTS_PAGE_TITLE\' | translate }}'
    },
    data: {
      stateClass: 'settings privacy tree',
      authorizedFormRoutes: ['tree_rights']
    }
  });
});


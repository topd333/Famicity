angular.module('famicity')
.config(function($stateProvider, ROUTE) {
  'use strict';

  let accountMenu;
  function getAccountMenu(menuBuilder) {
    if (!accountMenu) {
      accountMenu = menuBuilder.newMenu().getMenu();
    }
    return menuBuilder.changedTo(accountMenu);
  }

  let termsMenu;
  function getTermsMenu(menuBuilder) {
    if (!termsMenu) {
      termsMenu = menuBuilder.newMenu().getMenu();
    }
    return menuBuilder.changedTo(termsMenu);
  }

  let contactMenu;
  function getContactMenu(menuBuilder) {
    if (!contactMenu) {
      contactMenu = menuBuilder.newMenu().getMenu();
    }
    return menuBuilder.changedTo(contactMenu);
  }

  let unsubscribeMenu;
  function getUnsubscribeMenu(menuBuilder) {
    if (!unsubscribeMenu) {
      unsubscribeMenu = menuBuilder.newMenu().getMenu();
    }
    return menuBuilder.changedTo(unsubscribeMenu);
  }

  let notificationsMenu;
  function getNotificationsMenu(menuBuilder, MENU) {
    if (!notificationsMenu) {
      const submitAction = MENU[ROUTE.SETTINGS.NOTIFICATIONS].actions.submitAction;
      notificationsMenu = menuBuilder.newMenu().withAction(submitAction).getMenu();
    }
    return menuBuilder.changedTo(notificationsMenu);
  }

  $stateProvider
  .state('u.settings', {
    url: '/settings',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/account/SettingsAccount.html',
        controller: 'SettingsAccountController'
      }
    },
    resolve: {
      menu: (menuBuilder) => menuBuilder.newMenu().build()
    },
    ncyBreadcrumb: {
      label: '{{ \'MY_ACCOUNT\' | translate }}'
    }
  })
  .state(ROUTE.SETTINGS.ACCOUNT, {
    url: '/settings/account',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/account/SettingsAccount.html',
        controller: 'SettingsAccountController'
      }
    },
    resolve: {
      menu: (menuBuilder) => getAccountMenu(menuBuilder)
    },
    ncyBreadcrumb: {
      label: '{{ \'MY_ACCOUNT\' | translate }}'
    },
    data: {
      stateClass: 'settings account'
    }
  })
  .state(ROUTE.SETTINGS.NOTIFICATIONS, {
    url: '/settings/notifications',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/notifications/SettingsNotifications.html',
        controller: 'SettingsNotificationsController'
      }
    },
    resolve: {
      menu: (menuBuilder, MENU) => getNotificationsMenu(menuBuilder, MENU)
    },
    ncyBreadcrumb: {
      label: '{{ \'NOTIFICATIONS_SETTINGS_PAGE_TITLE\' | translate }}'
    },
    data: {
      stateClass: 'settings notifications'
    }
  })
  .state(ROUTE.SETTINGS.TERMS, {
    url: '/settings/terms',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/terms/SettingsTerms.html',
        controller: 'SettingsTermsController'
      }
    },
    resolve: {
      menu: (menuBuilder) => getTermsMenu(menuBuilder)
    },
    ncyBreadcrumb: {
      label: '{{ \'TERMS_OF_USE_LINK\' | translate }}'
    }
  })
  .state(ROUTE.SETTINGS.UNSUBSCRIBE, {
    url: '/settings/unsubscription',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/unsubscribe/Unsubscribe.html',
        controller: 'UnsubscribeController'
      }
    },
    resolve: {
      menu: (menuBuilder) => getUnsubscribeMenu(menuBuilder)
    },
    ncyBreadcrumb: {
      label: '{{ \'DELETE_MY_ACCOUNT\' | translate }}'
    }
  })
  .state(ROUTE.SETTINGS.CONTACT, {
    url: '/settings/contact',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/contact/Contact.html',
        controller: 'ContactController'
      }
    },
    resolve: {
      menu: (menuBuilder) => getContactMenu(menuBuilder)
    },
    ncyBreadcrumb: {
      label: '{{ \'CONTACT_US_LINK\' | translate }}'
    }
  });
});

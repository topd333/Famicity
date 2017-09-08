angular.module('famicity')
.config(function($stateProvider, ROUTE) {
  'use strict';

  let localeMenu;
  function getLocaleMenu(MENU, menuBuilder) {
    if (!localeMenu) {
      localeMenu = menuBuilder.newMenu().getMenu();
    }
    return menuBuilder.changedTo(localeMenu);
  }

  let languageMenu;
  function getLanguageMenu(MENU, menuBuilder) {
    if (!languageMenu) {
      const submitAction = MENU[ROUTE.SETTINGS.LOCALE.LANGUAGE].actions.submitAction;
      languageMenu = menuBuilder.newMenu().withAction(submitAction).getMenu();
    }
    return menuBuilder.changedTo(languageMenu);
  }

  let calendarMenu;
  function getCalendarMenu(MENU, menuBuilder) {
    if (!calendarMenu) {
      const submitAction = MENU[ROUTE.SETTINGS.LOCALE.CALENDAR].actions.submitAction;
      calendarMenu = menuBuilder.newMenu().withAction(submitAction).getMenu();
    }
    return menuBuilder.changedTo(calendarMenu);
  }

  $stateProvider
  .state(ROUTE.SETTINGS.LOCALE.STATE, {
    url: '/settings/locale',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/locale/Locale.html',
        controller: 'SettingsLocaleController'
      }
    },
    resolve: {
      menu: (menuBuilder, MENU) => getLocaleMenu(MENU, menuBuilder)
    },
    ncyBreadcrumb: {
      label: '{{ \'MY_SETTINGS\' | translate }}'
    },
    data: {
      stateClass: 'settings locale'
    }
  })
  .state(ROUTE.SETTINGS.LOCALE.LANGUAGE, {
    url: '/settings/locale/language',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/locale/language/SettingsLanguage.html',
        controller: 'SettingsLanguageController'
      }
    },
    resolve: {
      menu: (menuBuilder, MENU) => getLanguageMenu(MENU, menuBuilder)
    },
    ncyBreadcrumb: {
      parent: ROUTE.SETTINGS.LOCALE.STATE,
      label: '{{ \'LANGUAGE\' | translate }}'
    },
    data: {
      stateClass: 'settings locale language'
    }
  })
  .state(ROUTE.SETTINGS.LOCALE.CALENDAR, {
    url: '/settings/locale/calendar',
    views: {
      '@': {
        templateUrl: '/scripts/users/settings/locale/calendar/SettingsCalendar.html',
        controller: 'SettingsCalendarController'
      }
    },
    resolve: {
      menu: (menuBuilder, MENU) => getCalendarMenu(MENU, menuBuilder)
    },
    ncyBreadcrumb: {
      parent: ROUTE.SETTINGS.LOCALE.STATE,
      label: '{{ \'CALENDAR\' | translate }}'
    },
    data: {
      stateClass: 'settings locale calendar'
    }
  });
});

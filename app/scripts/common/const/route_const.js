angular.module('famicity').constant('ROUTE', {
  MESSAGE: {
    ABSTRACT: 'u.messages',
    GET: 'u.messages.show',
    CREATE: 'u.messages.add',
    WELCOME: 'u.messages.welcome',
    EMPTY: 'u.messages.empty'
  },
  BLOG: {
    GET: 'u.blog.query'
  },
  SETTINGS: {
    ACCOUNT: 'u.settings-account',
    LOCALE: {
      STATE: 'u.settings-locale',
      LANGUAGE: 'u.settings-locale-language',
      CALENDAR: 'u.settings-locale-calendar'
    },
    PRIVACY: {
      STATE: 'u.settings-privacy',
      DEFAULT_RIGHTS: 'u.settings-privacy-default_rights',
      SEARCH_ENGINE: 'u.settings-privacy-search_engine',
      TREE_RIGHTS: 'u.settings-privacy-tree_rights'
    },
    AUTHENTICATION_PROVIDERS: 'u.settings-providers',
    NOTIFICATIONS: 'u.settings-notifications',
    TERMS: 'u.settings-terms',
    CONTACT: 'u.settings-contact',
    UNSUBSCRIBE: 'u.settings-unsubscription'
  },
  TREE: {
    DETAIL: {
      CREATE_CHILD: {
        CREATE_SECOND_PARENT: 'u.tree.detail.createChildSecondParent'
      }
    }
  }
});

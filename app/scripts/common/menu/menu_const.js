angular.module('famicity')
.factory('MENU', (PUBSUB, ROUTE) => {
  'use strict';
  const menu = {};
  menu['u.directory.invite'] = {
    actions: {
      submitAction: {
        label: 'Ok',
        style: 'action-submit'
        // onActive: () => $scope.sendMultipleInvite()
      }
    }
  };
  menu[ROUTE.SETTINGS.LOCALE.LANGUAGE] = {
    actions: {
      submitAction: {
        label: 'Ok',
        style: 'action-submit',
        event: PUBSUB.SETTINGS.LOCALE.LANGUAGE.SUBMIT
      }
    }
  };
  menu[ROUTE.SETTINGS.LOCALE.CALENDAR] = {
    actions: {
      submitAction: {
        label: 'Ok',
        style: 'action-submit',
        event: PUBSUB.SETTINGS.LOCALE.CALENDAR.SUBMIT
      }
    }
  };
  menu[ROUTE.SETTINGS.PRIVACY.DEFAULT_RIGHTS] = {
    actions: {
      submitAction: {
        label: 'Ok',
        style: 'action-submit',
        event: PUBSUB.SETTINGS.PRIVACY.DEFAULT_RIGHTS.SUBMIT
      }
    }
  };
  menu[ROUTE.SETTINGS.PRIVACY.SEARCH_ENGINE] = {
    actions: {
      submitAction: {
        label: 'Ok',
        style: 'action-submit',
        event: PUBSUB.SETTINGS.PRIVACY.SEARCH_ENGINE.SUBMIT
      }
    }
  };
  menu[ROUTE.SETTINGS.PRIVACY.TREE_RIGHTS] = {
    actions: {
      submitAction: {
        label: 'Ok',
        style: 'action-submit',
        event: PUBSUB.SETTINGS.PRIVACY.TREE_RIGHTS.SUBMIT
      }
    }
  };
  menu[ROUTE.SETTINGS.NOTIFICATIONS] = {
    actions: {
      submitAction: {
        label: 'Ok',
        style: 'action-submit',
        event: PUBSUB.SETTINGS.NOTIFICATIONS.SUBMIT
      }
    }
  };
  return menu;
});

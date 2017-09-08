angular.module('famicity')
  .service('settingsService', function(
    Settings, $location, $filter, notification) {
    'use strict';

    const showSettings = function(user_id, settings_id, need_keys) {
      return Settings.show_settings({
        user_id,
        settings_id,
        need: need_keys
      }, function(response) {
        log('showSettings success');
        log(response);
      });
    };

    const updateSettings = function(user_id, settings_id, attrs) {
      return new Settings({
        setting: attrs
      }).$update_settings({
          user_id,
          settings_id
        }, function() {
          notification.add('SETTINGS_UPDATED_SUCCESS_MSG');
        });
    };

    return {
      showSettings,
      updateSettings
    };
  });

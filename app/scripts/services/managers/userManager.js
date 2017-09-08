angular.module('famicity').factory('userManager', function(
  $injector, $translate, $moment, sessionManager, userService, tmhDynamicLocale, pubsub, PUBSUB) {
  'use strict';

  const userManager = {};
  let userInfo = {};
  let userParametersInfo = {};
  let showWizardGedcomStep = false;

  userManager.getWizardGedcomStep = function() {
    return showWizardGedcomStep;
  };
  userManager.setWizardGedcomStep = function(param) {
    showWizardGedcomStep = param;
  };
  userManager.setUserInfo = function(user) {
    userInfo = user;
  };
  userManager.getUserInfo = function() {
    return userInfo;
  };
  userManager.getName = function() {
    return userInfo.user_name;
  };
  userManager.resetUserParameterInfo = function() {
    userParametersInfo = {};
  };
  userManager.setLocale = function(locale) {
    sessionManager.setLocale(locale);
    $translate.use(locale);
    $moment.locale(locale);
    pubsub.publish(PUBSUB.USER.UPDATE_LOCALE, locale);
  };

  userManager.setUserParametersInfo = function() {
    let shouldMakeCall;
    const self = this;
    if (!userParametersInfo.locale || !userParametersInfo.settingsId || $translate.use() !== userParametersInfo.locale || !userParametersInfo.startWeekDay) {
      shouldMakeCall = false;
      if (!sessionManager.getSettingsId()) {
        if (sessionManager.getToken()) {
          shouldMakeCall = true;
        }
      } else {
        userParametersInfo.settingsId = sessionManager.getSettingsId();
      }
      if (!sessionManager.getFirstDay()) {
        if (sessionManager.getToken()) {
          shouldMakeCall = true;
        }
      } else {
        userParametersInfo.firstDay = sessionManager.getFirstDay();
      }
      if (!sessionManager.getLocale()) {
        if (sessionManager.getToken()) {
          shouldMakeCall = true;
        } else {
          this.setLocale('fr');
        }
      } else {
        userParametersInfo.locale = sessionManager.getLocale();
        if (userParametersInfo.locale === 'fr') {
          tmhDynamicLocale.set('fr');
        }
        if (userParametersInfo.locale === 'en') {
          tmhDynamicLocale.set('en-us');
        }
        this.setLocale(sessionManager.getLocale());
      }
      if (shouldMakeCall) {
        userService.userEnvironment(sessionManager.getUserId(), function(response) {
          if (response.setting) {
            userParametersInfo.locale = response.setting.default_language;
            userParametersInfo.settingsId = response.setting.id;
            userParametersInfo.firstDay = response.setting.first_day_of_week;
            if (userParametersInfo.locale === 'fr') {
              tmhDynamicLocale.set('fr');
            }
            if (userParametersInfo.locale === 'en') {
              tmhDynamicLocale.set('en-us');
            }
            sessionManager.setLocale(response.setting.default_language);
            sessionManager.setSettingsId(response.setting.id);
            sessionManager.setFirstDay(response.setting.first_day_of_week);
            self.setLocale(response.setting.default_language);
          }
        });
      }
    }
  };
  userManager.getUserParametersInfo = function() {
    return userParametersInfo;
  };
  userManager.getLocale = function() {
    return userParametersInfo.locale;
  };
  userManager.getSettingsId = function() {
    return userParametersInfo.settingsId;
  };
  userManager.getFirstDay = function() {
    return userParametersInfo.firstDay;
  };
  userManager.setFirstDay = function(day) {
    userParametersInfo.firstDay = day;
    return sessionManager.setFirstDay(day);
  };
  userManager.changeLanguage = function(locale) {
    if (locale === 'fr') {
      tmhDynamicLocale.set('fr');
    }
    if (locale === 'en') {
      tmhDynamicLocale.set('en-us');
    }
    this.setLocale(locale);
  };

  return userManager;
});


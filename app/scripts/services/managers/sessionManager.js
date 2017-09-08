angular.module('famicity')
.service('sessionManager', function(configuration, $cookies) {
  'use strict';

  const log = debug('fc-sessionManager');
  const defaultExpiration = 60;

  const addDays = function(numberOfDays) {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + numberOfDays);
    return date;
  };
  const put = function(key, value, expiration = defaultExpiration) {
    return $cookies.put(key, value, {expires: addDays(expiration), path: '/', secure: true});
  };
  const putObject = function(key, value, expiration = defaultExpiration) {
    return $cookies.putObject(key, value, {expires: addDays(expiration), path: '/', secure: true});
  };
  const get = function(key) {
    return $cookies.get(key);
  };
  const getObject = function(key) {
    return $cookies.getObject(key);
  };
  const remove = function(key) {
    return $cookies.remove(key, {path: '/'});
  };
  const REFRESH_PREFIX = 'refresh.';
  const REFRESH_POPUP = REFRESH_PREFIX + 'popup';
  const REFRESH_CHAT_CONNECT = REFRESH_PREFIX + 'chat-connect';

  return {
    /**
     * setters
     */
    setToken(token) {
      const user = this.getUser() || {};
      user.accessToken = token;
      this.setUser(user);
      this.setCookie();
    },
    setEmail(email) {
      put('loginEmail', email, 120);
    },
    setVersion(version) {
      return put('version', version);
    },
    setRefreshPopups(refresh) {
      return put(REFRESH_POPUP, refresh);
    },
    setRefreshChatConnect(refresh) {
      return put(REFRESH_CHAT_CONNECT, refresh);
    },
    setLocale(locale) {
      put('locale', locale);
    },
    setSettingsId(settingsId) {
      const user = this.getUser() || {};
      user.settingsId = settingsId;
      this.setUser(user);
    },
    setUserId(id) {
      const user = this.getUser() || {id};
      this.setUser(user);
    },
    setFirstDay(firstDay) {
      put('first_day', firstDay);
    },
    setUser(user) {
      const id = user.id || user.userId;
      user.id = user.userId = id;
      putObject('user', user);
    },
    setCookie() {
      put('cookie', true, 365);
    },
    setReferral(referral) {
      putObject('referral', referral);
    },
    setGlobalState(globalState) {
      const user = getObject('user');
      user.globalState = globalState;
      return this.setUser(user, user.remember);
    },
    setInvitation(invitation) {
      log('setInvitation(%o)', invitation);
      putObject('invitation', invitation);
    },
    setTreeType(treeType) {
      const user = getObject('user');
      user.treeType = treeType;
      return this.setUser(user);
    },
    /**
     * getters
     */
    getToken() {
      const user = getObject('user') || {};
      return user.accessToken || null;
    },
    getEmail() {
      return get('loginEmail');
    },
    getLocale() {
      return get('locale');
    },
    getSettingsId() {
      const user = getObject('user') || {};
      return user.settingsId || null;
    },
    getFirstDay() {
      return get('first_day');
    },
    getUser() {
      return getObject('user');
    },
    getUserId() {
      const user = this.getUser() || {};
      if (user.userId) {
        return user.userId;
      } else if (user.id) {
        return user.id;
      }
      return null;
    },
    getVersion() {
      return get('version') || configuration.version;
    },
    getRefreshPopups() {
      return get(REFRESH_POPUP);
    },
    getRefreshChatConnect() {
      return get(REFRESH_CHAT_CONNECT);
    },
    getCookie() {
      return get('cookie');
    },
    getReferral() {
      return getObject('referral');
    },
    getFastAnimation() {
      return get('fast_animation') || false;
    },
    getInvitation() {
      return getObject('invitation');
    },
    getTreeType() {
      const user = this.getUser() || {};
      return user.treeType || null;
    },
    /**
     * remove
     */
    remove(name) {
      return remove(name);
    }
  };
});

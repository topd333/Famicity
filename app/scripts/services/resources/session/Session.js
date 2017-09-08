angular.module('famicity').factory('Session', function(
$resource, $window, $http,
$hello, notification, sessionManager, userManager, pubsub, auth,
$q, $translate, PUBSUB) {
  'use strict';

  const log = debug('fc-auth');

  const login = (attrs, locale) => $q((resolve, reject) => {
    auth.signIn({session: attrs, parameters: {locale}}).then(function(response) {
      response = response.data;
      log('login success');
      $http.defaults.headers.common.Authorization = 'Bearer ' + response.access_token;
      notification.add('CONNEXION_SUCCESS_MSG');
      sessionManager.setUserId(response.user_id, Boolean(attrs.remember_me));
      sessionManager.setToken(response.access_token, Boolean(attrs.remember_me));
      sessionManager.setEmail(attrs.email);
      userManager.setLocale(response.locale);

      const sessionUser = {};
      [sessionUser.accessToken, sessionUser.globalState, sessionUser.settingsId, sessionUser.userId] =
      [response.access_token, response.global_state, response.setting_id, response.user_id];

      sessionUser.id = response.user_id;
      sessionManager.setUser(sessionUser, attrs.remember_me);
      notification.removeByType('alert-cookie');
      resolve();
    }).catch(function(error) {
      reject(error);
    });
  });

  const logout = function($scope) {
    return $q((resolve, reject) => auth.signOut().then(function() {
      log('logout');
      notification.add('LOGOUT_SUCCESS_MSG');
      pubsub.publish(PUBSUB.USER.DISCONNECT);
      $hello.logout();
      resolve();
    }).catch(function(response) {
      if ($scope) {
        log(response);
        $scope.errorSession = response;
      }
      reject();
    }));
  };

  return {
    login,
    logout
  };
});

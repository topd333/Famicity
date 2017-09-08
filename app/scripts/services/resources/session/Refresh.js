angular.module('famicity').factory('Refresh', function(
  $http, $injector, navigation, $stateParams, $location,
  $rootScope, HttpBuffer, configuration, LoadingAnimationUtilService, notification,
  pubsub, sessionManager, PUBSUB) {
  'use strict';
  let refresh_count = 0;
  const refreshService = {};
  refreshService.refreshToken = function(attrs) {
    log('invoke refresh');
    $rootScope.$broadcast('refreshStart');
    sessionManager = $injector.get('sessionManager');
    refresh_count += 1;
    if (attrs.token) {
      return $http.post(configuration.oauth_url + '/auth/refresh', {
        session: attrs
      }).success(function(result) {
        sessionManager.setToken(result.access_token, result.remember_me);
        $http.defaults.headers.common.Authorization = 'Bearer ' + result.access_token;
        HttpBuffer.retryAllRequest(result.access_token);
        refresh_count = 0;
        $rootScope.$broadcast('refreshSuccess');
      }).error(function() {
        refresh_count = 0;
        LoadingAnimationUtilService.deactivate();
        $rootScope.$broadcast('refreshError');
        const current = $location.path();
        navigation.go('public.base.sign-in', {
          locale: sessionManager.getLocale() || 'fr',
          redirect: current
        });
        notification.add('SESSION_EXPIRED', {warn: true});
        pubsub.publish(PUBSUB.USER.DISCONNECT);
      });
    }
  };
  refreshService.getRefreshCount = function() {
    return refresh_count;
  };

  return refreshService;
});

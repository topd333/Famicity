angular.module('famicity')
  .factory('errorsInterceptor', function(
    $location, $q, $injector, ServiceErrorHandler, LoadingAnimationUtilService, notification) {
    'use strict';

    const log = debug('fc-error-interceptor');
    return {
      responseError(rejection) {
        log('error %o: %o', rejection.status, rejection);
        const Refresh = $injector.get('Refresh');
        const HttpBuffer = $injector.get('HttpBuffer');
        const sessionManager = $injector.get('sessionManager');
        const $state = $injector.get('$state');
        const deferred = $q.defer();

        // Handle non blocking calls: do nothing but return the rejection
        // which is caught by the response interceptor
        if (rejection.config && rejection.config.type && (rejection.config.type === 'cm' || rejection.config.type === 'cmA') &&
          (rejection.status === 0 || rejection.status === 401 || rejection.status === 404 || rejection.status === 500)) {
          if (rejection.status === 404 || rejection.status === 500) {
            Bugsnag.notify('Non blocking failure', `Received ${rejection.status} from server`, {rejection}, 'error');
          }
          return rejection;
        }

        switch (rejection.status) {
          case 401:
            if (sessionManager.getToken()) {
              HttpBuffer.append(rejection.config, deferred);
              if (Refresh.getRefreshCount() === 0) {
                Refresh.refreshToken({
                  token: sessionManager.getToken()
                });
              }
              return deferred.promise;
            }
            break;
          case 500:
            if (sessionManager.getToken()) {
              $state.go('u.500', {user_id: sessionManager.getUserId()}, {location: false});
            } else {
              $state.go('500');
            }
            Bugsnag.notify('500', 'Received 500 from server', {rejection}, 'error');
            break;
          case 403:
            notification.add('COMMON.RIGHTS.NO_ACCESS', {warn: true});
            $state.go('u.profile', {user_id: sessionManager.getUserId()});
            break;
          case 406:
          case 400:
            LoadingAnimationUtilService.deactivate();
            if (rejection.data) {
              ServiceErrorHandler.errorModelHandler(rejection.data.errors);
            }
            break;
          case 404:
            if (sessionManager.getToken()) {
              $state.go('u.404', {user_id: sessionManager.getUserId()}, {location: false});
            } else {
              window.location.href = '/404';
            }
            Bugsnag.notify('404', 'Received 404 from server', {rejection}, 'info');
            break;
          case 302:
            if (rejection.data.reason) {
              if (rejection.data.reason === 'profile') {
                $state.go('wizard-profile');
              } else if (rejection.data.reason === 'no_invitation') {
                $state.go('public.base', {locale: sessionManager.getLocale() || 'fr'});
                notification.add('DIRECTORY.INVITATION.NO_MORE');
                sessionManager.remove('invitation');
              }
              return rejection;
            }
            break;
          case 502:
            notification.add('ERROR_SERVER_DOWN', {warn: true});
            break;
          default:
            return rejection;
        }
        return $q.reject(rejection);
      }
    };
  });

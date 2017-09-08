function areCookiesEnabled() {
  'use strict';
  document.cookie = '__verify=1'; // eslint-disable-line
  var supportsCookies = document.cookie.length >= 1 && document.cookie.indexOf('__verify=1') !== -1; // eslint-disable-line
  const thePast = new Date(1976, 8, 16);
  document.cookie = '__verify=1;expires=' + thePast.toUTCString(); // eslint-disable-line
  return supportsCookies;
}
if (!areCookiesEnabled()) {
  const url = window.location.href; // eslint-disable-line
  const arr = url.split('/');
  const result = arr[0] + '//' + arr[2];
  if (!/cookies/.test(window.location.href)) { // eslint-disable-line
    var language = (window.navigator.userLanguage || window.navigator.language).substring(0, 2); // eslint-disable-line
    window.location.replace(result + '/' + language + '/cookies'); // eslint-disable-line
  }
}
angular.module('famicity')
  .directive('fcCookies', function(sessionManager, $rootScope, pubsub, PUBSUB, $translate, notification, $timeout) {
    'use strict';
    return {
      restrict: 'EA',
      templateUrl: '/scripts/welcome/cookies/fc-cookies.html',
      link(scope) {
        scope.cookieMessage = null;
        scope.hideCookieMessage = function() {
          scope.cookieMessage = null;
          // Async to hide cookie message asap
          $timeout(function() {
            sessionManager.setCookie();
          });
        };

        pubsub.subscribe(PUBSUB.COOKIE.CHECK, function() {
          const notifiedAboutCookies = notification.getByType('alert-cookie');
          if (!sessionManager.getCookie() && !sessionManager.getUserId() && !notifiedAboutCookies.length) {
            scope.cookieMessage = $translate.instant('COOKIES_NOTIFICATION');
          }
        });
      }
    };
  });

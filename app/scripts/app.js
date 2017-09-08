// @flow weak

window.configuration = {};

window.configuration.version = Date.now();

window.log = debug('spam-app');

window.deprecated = debug('deprecated');

$.fn.innerText = function() {
  'use strict';
  return document.body.innerText ? this[0].innerText : this[0].innerHTML.replace(/&amp;lt;br&amp;gt;/gi, 'n').replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, '');
};

angular.module('famicity', [
  // Angular modules
  'ngResource', 'ngSanitize', 'ngAnimate', 'ngCookies',
  // External modules
  'ui.router', 'ui.router.util',
  'pascalprecht.translate', 'ui.sortable', 'ui.bootstrap', 'infinite-scroll',
  'tmh.dynamicLocale', 'ncy-angular-breadcrumb', 'ngImgCrop', 'afkl.lazyImage',
  // Famicity modules
  'famicity.config', 'famicity.directory', 'famicity.views', 'famicity.tree', 'famicity.album', 'famicity.gedcom',
  'famicity.fusions', 'famicity.calendar', 'famicity.story'
])
  .run(function(
    $window, $rootScope, $http, $state, oldPermissionService, userManager, $translate, $moment, $q, chat,
    push, windowSizeNotification, sessionManager, $timeout, notification, $analytics, PageTitle, pubsub, PUBSUB,
    uiUtil, navigation) {
    'use strict';

    const documentRoot = $('html');

    function setRootClass(check, clazz) {
      const oppositeClass = 'no-' + clazz;
      if (check) {
        documentRoot.addClass(clazz);
        documentRoot.removeClass(oppositeClass);
      } else {
        documentRoot.addClass(oppositeClass);
        documentRoot.removeClass(clazz);
      }
    }

    $rootScope.isTouch = isMobile.tablet || isMobile.phone;
    setRootClass($rootScope.isTouch, 'touch');
    $rootScope.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    $rootScope.noPermanentScrollbar = $rootScope.isTouch || $rootScope.isMac;
    documentRoot.toggleClass('permanent-scrollbars', !$rootScope.noPermanentScrollbar);

    let deregister;
    let translateLoaded;
    let updateTitleAndDescription;
    const sessionUser = sessionManager.getUser();
    if (sessionUser && sessionUser.accessToken) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + sessionUser.accessToken;
    }
    userManager.setUserParametersInfo();
    let initialPage = null;
    chat.initialize();
    push.initialize();

    // Handle error routing
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      let locale;
      let params;
      if (error && error.cause) {
        event.preventDefault();
        params = toParams;
        switch (error.cause) {
          case 'incorrect-locale':
            locale = error.params.locale;
            params.locale = locale;
            $state.go(toState, toParams, {notify: true, reload: true});
            break;
          case 'missing-locale':
            locale = error.params.locale;
            params.locale = locale;
            $state.go(error.params.state, toParams, {notify: true, reload: true, location: 'replace'});
            break;
          case 'not-authenticated':
            $state.go('sign-in', {redirect: $state.href(toState.name, toParams)});
            break;
          case 'pendingform':
          case 'redirect':
          default:
            break;
        }
      } else {
        return console.error('$stateChangeError: ', toState, error);
      }
    });

    translateLoaded = $q.defer();

    $rootScope.$on('$translateChangeSuccess', function() {
      translateLoaded.resolve();
      updateTitleAndDescription($state.current.name);
      pubsub.publish(PUBSUB.COOKIE.CHECK);
    });

    updateTitleAndDescription = function(state) {
      if (state === '') {
        return;
      }
      const titleKey = 'TITLE.' + state.toUpperCase();
      const descriptionKey = 'DESCRIPTION.' + state.toUpperCase();
      translateLoaded.promise.then(function() {
        $translate([titleKey, descriptionKey]).then(function(translations) {
          if (translations[titleKey] === titleKey) {
            return $q.reject(translations);
          }
          PageTitle.setTitle('Famicity - ' + translations[titleKey]);
          $rootScope.description = translations[descriptionKey];
        }).catch(function() {
          if (/public/.test(state) && !/public\.helps/.test(state)) {
            PageTitle.setTitle('Famicity - ' + $translate.instant('TITLE.PUBLIC.BASE.SIGNUP'));
            $rootScope.description = $translate.instant('WELCOME.BASELINE_START_STORY_1') + ' ' +
              $translate.instant('WELCOME.BASELINE_START_STORY_2');
          } else if (!/public\.helps/.test(state)) {
            PageTitle.setTitle('Famicity');
            $rootScope.description = $translate.instant('WELCOME.BASELINE_START_STORY_1') + ' ' +
              $translate.instant('WELCOME.BASELINE_START_STORY_2');
          }
        }).finally(function() {
          if (!/public\.helps/.test(state)) {
            $window.prerenderReady = true;
          }
        });
      });
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
      $state.previous = fromState;
      if (!initialPage) {
        initialPage = toState.name;
        $analytics.trackEvent('page', 'first', [toState.name, document.referrer]);
      }
      $analytics.trackEvent('page', 'change', [toState.name, fromState.name || '']);
      $analytics.trackPageView(toState.name);

      updateTitleAndDescription(toState.name);

      $rootScope.showLoading = false;
      $rootScope.homepage = toState.name === 'public.base' ? $state.href('base', null, {absolute: true}) : false;
      $rootScope.pageId = toState.data && toState.data.stateClass ? toState.data.stateClass : null;

      const privateZone = angular.element('.private')[0];
      if (privateZone) {
        const scrollBarWidth = uiUtil.getScrollBarWidthOf(privateZone);
        uiUtil.updateForScrollBarWidth(scrollBarWidth);
      }
    });

    $rootScope.$on('$stateChangeInterrupted', function() {
      $rootScope.showLoading = false;
    });

    // Fastclick initialization (does not depend on angular)
    FastClick.attach(document.body);

    // Add a smartbanner to download the app on android and iOs devices
    deregister = $rootScope.$on('$translateChangeSuccess', function() {
      $.smartbanner({
        author: $translate.instant('FAMICITY'),
        price: $translate.instant('FREE'),
        inAppStore: $translate.instant('IN_APP_STORE'),
        inGooglePlay: $translate.instant('IN_GOOGLE_PLAY'),
        button: $translate.instant('SEE'),
        appStoreLanguage: 'fr',
        layer: true,
        iOSUniversalApp: true,
        icon: '/application_icon_152.png'
      });
      deregister();
    });
    return windowSizeNotification.initChanel();
  });

window.onload = function() {
  'use strict';
  const url = window.location.href;
  const arr = url.split('/');
  const result = arr[0] + '//' + arr[2];
  if (!document.addEventListener || !('withCredentials' in new XMLHttpRequest())) {
    return window.location.replace(result + '/browser.html');
  } else if (/famicity\.com/.test(document.domain)) {
    angular.bootstrap(document.documentElement, ['famicity'], {
      strictDi: true
    });
  }
};

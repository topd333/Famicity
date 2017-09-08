angular.module('famicity')
.service('NavigationToPublicChecker', function(sessionManager, yesnopopin, pubsub, PUBSUB, Refresher, ModalLauncher, Session) {
  'use strict';

  function disconnectModal(info, $scope) {
    return {
      templateUrl: '/views/popup/popup_disconnect.html',
      controller: /*@ngInject*/ function($scope) {
        const popins = info.popins;
        const disconnectInfo = popins.disconnect;
        $scope.continue = function() {
          Session.logout().then(function() {
            location.href = disconnectInfo.destinationUrl;
          });
        };
      }
    };
  }
  ModalLauncher.register('disconnect', disconnectModal);

  const check = function(navigationEvent) {
    const newNavigation = angular.extend({}, navigationEvent);

    var toState = navigationEvent.toState;
    const toStateData = toState.data || null;
    const toStateName = toState.name || null;

    const isTowardPublicPage = toStateData && !toStateData.auth;

    const isTowardDevelopmentPage = /dev.*/.test(toStateName);
    const allowedPublicPagesFromPrivate = [
      'public.base.sign-in', '404', 'user-emails-validation', 'user-emails-validation'
    ];
    const isAllowedFromPrivate = allowedPublicPagesFromPrivate.indexOf(toStateName) >= 0 || isTowardDevelopmentPage;

    if (isTowardPublicPage && navigationEvent.isSignedIn && !isAllowedFromPrivate) {
      newNavigation.changed = true;
      const userId = sessionManager.getUserId();
      // redirect public help to private help
      if (toState.name === 'helps-answer' || toState.name === 'public.helps-answer') {
        navigationEvent.toParams.user_id = userId;
        newNavigation.toState = 'u.helps-answer-private';
        newNavigation.pageType = 'private';
        return newNavigation;
      } else if (toState.name === 'helps-category' || toState.name === 'public.helps-category') {
        navigationEvent.toParams.user_id = userId;
        newNavigation.toState = 'u.helps-category-private';
        newNavigation.pageType = 'private';
        return newNavigation;
      } else if (toState.name === 'terms' || toState.name === 'public.terms') {
        newNavigation.toState = 'u.settings-terms';
        newNavigation.pageType = 'private';
        return newNavigation;
      } else {
        if (toState.name.indexOf('landing') === 0) {
          Refresher.delayPopups();
          pubsub.publish(PUBSUB.HELP.POPINS, {
            info: sessionManager.getUser(),
            popins: {
              disconnect: {
                destinationUrl: location.href
              }
            }
          });
        }
        // redirect to main private page
        newNavigation.toState = 'u.home';
      }
    }
    newNavigation.pageType = toStateData && toStateData.auth ? 'private' : 'public';
    newNavigation.pageType = toStateData && toStateData.dev ? '' : newNavigation.pageType;
    Bugsnag.metaData = Bugsnag.metaData || {};
    Bugsnag.metaData.state = {
      name: toState.name,
      url: toState.url,
      views: toState.views
    };
    if (toState.resolve) {
      newNavigation.showLoading = true;
    }

    newNavigation.pageId = toStateData && toStateData.stateClass ? toState.data.stateClass : null;
    return newNavigation;
  };

  return {
    check: (navigationEvent) => check(navigationEvent)
  };
});

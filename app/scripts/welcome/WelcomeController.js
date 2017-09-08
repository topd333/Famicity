angular.module('famicity')
.controller('WelcomeController', function($scope, $rootScope, notification, locale, navigation) {
  'use strict';
  const log = debug('fc-WelcomeController');

  $rootScope.notifications = notification.list;
  $scope.locale = locale;
  log('welcome locale=' + $scope.locale);
  const currentState = navigation.getCurrent();
  if (currentState.name === 'public.base' || currentState.name === 'public.welcome') {
    const welcomeState = isMobile.phone ? 'public.base.sign-in' : 'public.base.signUp';
    navigation.go(welcomeState, {locale});
  }
});

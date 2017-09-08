angular.module('famicity')
  .directive('fcLanguageSwitcher', function($translate, $state, $stateParams, sessionManager, $window) {
    'use strict';
    function otherLanguage(than) {
      return than === 'fr' ? 'en' : 'fr';
    }

    return {
      templateUrl: '/scripts/directives/lang/fc-language-switcher.html',
      restrict: 'EA',
      link($scope, element) {
        let language = sessionManager.getLocale();
        if (!language) {
          const browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
          if (browserLanguage.indexOf('en') === 0) {
            language = 'en';
          } else if (browserLanguage.indexOf('fr') === 0) {
            language = 'fr';
          } else {
            language = 'en';
          }
        }
        $scope.language = $translate.use() || language;
        $scope.otherLanguage = otherLanguage($scope.language);
        element.bind('click', function() {
          $scope.language = otherLanguage($translate.use());
          $scope.otherLanguage = otherLanguage($scope.language);
          $translate.use($scope.language).then(function() {
            log('writing cookie  %o', $scope.language);
            sessionManager.setLocale($scope.language);
            const params = angular.copy($stateParams);
            params.locale = $scope.language;
            log('going to %s with params %o', $state.current.name, params);
            $state.go($state.current.name, params, {notify: true, reload: true});
          });
        });
      }
    };
  });

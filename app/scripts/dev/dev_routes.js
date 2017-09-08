angular.module('famicity')
  .config(function($stateProvider) {
    'use strict';

    $stateProvider
      .state('dev', {
        url: '/dev',
        views: {
          '@': {
            templateUrl: '/scripts/dev/dev.html',
            controller: 'DevController'
          }
        },
        data: {
          dev: true
        }
      })
      .state('dev.styleguide', {
        url: '/style/guide',
        views: {
          '@': {
            templateUrl: '/scripts/dev/style/guide/style-guide.html',
            controller: 'StyleGuideController',
            controllerAs: 'style'
          }
        },
        ncyBreadcrumb: {
          parent: 'dev',
          label: 'Style guide'
        }
      })
      .state('dev.routes', {
        url: '/routes',
        views: {
          '@': {
            templateUrl: '/scripts/dev/routes/routes.html',
            controller: ($scope, $state) => $scope.routes = $state.get()
          }
        }
      });
  });

angular.module('famicity')
  .config(function($stateProvider) {
    'use strict';

    const categories = (Help) => Help.categories({locale: 'fr'}).$promise;

    $stateProvider
      .state('u.helps-private', {
        url: '/users/:user_id/helps',
        views: {
          '@': {
            templateUrl: '/scripts/helps/Helps.html',
            controller: 'HelpsController'
          }
        },
        resolve: {
          locale: me => me.settings.locale,
          categories
        },
        ncyBreadcrumb: {
          label: '{{ \'HELP_CENTER\' | translate }}'
        },
        data: {
          stateClass: 'private help'
        }
      })
      .state('u.helps-category-private', {
        url: '/users/:user_id/helps/:category_id/page',
        views: {
          '@': {
            templateUrl: '/scripts/helps/Helps.html',
            controller: 'HelpsController'
          }
        },
        resolve: {
          locale: me => me.settings.locale,
          categories
        },
        data: {
          stateClass: 'private help'
        }
      })
      .state('u.helps-answer-private', {
        url: '/users/:user_id/helps/:answer_id',
        views: {
          '@': {
            templateUrl: '/scripts/helps/Helps.html',
            controller: 'HelpsController'
          }
        },
        resolve: {
          locale: me => me.settings.locale,
          categories
        },
        data: {
          stateClass: 'private help'
        }
      }).state('u.helps-search-private', {
        url: '/users/:user_id/helps-search/:search_string',
        views: {
          '@': {
            templateUrl: '/scripts/helps/Helps.html',
            controller: 'HelpsController'
          }
        },
        resolve: {
          locale: me => me.settings.locale,
          categories
        },
        data: {
          stateClass: 'private help'
        }
      });
  });

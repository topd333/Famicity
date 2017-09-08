angular.module('famicity.fusions', [])
  .config(function($stateProvider) {
    'use strict';

    $stateProvider
      .state('u.fusions-index', {
        parent: 'u.tree',
        url: '/fusions',
        views: {
          '@': {
            templateUrl: '/scripts/tree/fusions/controllers/FusionsIndex.html',
            controller: 'FusionsIndexController'
          }
        },
        resolve: {
          fusions: (me, fusionService) => fusionService.query({userId: me.id, limit: 50}),
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: () => 'u.tree({ts: ' + Date.now() + '})',
          label: '{{ \'FUSIONS\' | translate }}'
        },
        data: {
          stateClass: 'tree fusions received'
        }
      })
      //.state('u.fusions-sent', {
      //  parent: 'u.tree',
      //  url: '/fusions/sent',
      //  views: {
      //    '@': {
      //      templateUrl: '/scripts/tree/fusions/controllers/fusions-sent.html',
      //      controller: 'FusionsSentController'
      //    }
      //  },
      //  resolve: {
      //    sentInProgress: (me, fusionService) => fusionService.getSentInProgress({userId: me.id, limit: 10}),
      //    sentComplete: (me, fusionService) => fusionService.getSentComplete({userId: me.id, limit: 10}),
      //    menu: (menuBuilder) => menuBuilder.newMenu().build()
      //  },
      //  ncyBreadcrumb: {
      //    parent: () => 'u.tree({ts: ' + Date.now() + '})',
      //    label: '{{ \'SENT_FUSIONS\' | translate }}'
      //  },
      //  data: {
      //    stateClass: 'tree fusions sent'
      //  }
      //})
      .state('fusions-confirm', {
        url: '/users/:userId/fusions/confirm/:token',
        resolve: {
          confirm: (Fusion, $stateParams) => Fusion.confirm({userId: $stateParams.userId, token: $stateParams.token}),
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        views: {
          '@': {
            templateUrl: '/scripts/tree/fusions/views/fusions_confirm.html',
            controller() {}
          }
        },
        ncyBreadcrumb: {
          parent: () => 'u.tree({ts: ' + Date.now() + '})',
          label: '{{ \'SENT_FUSIONS\' | translate }}'
        },
        data: {
          stateClass: 'tree fusions confirm'
        }
      });
  });


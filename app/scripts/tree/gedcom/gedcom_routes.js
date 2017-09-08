angular.module('famicity.gedcom', [])
  .config(function($stateProvider) {
    'use strict';

    // New routes
    $stateProvider
      .state('gedcom-import-wizard', {
        parent: 'u.tree',
        url: '/gedcom/import',
        views: {
          '@': {
            templateUrl: '/scripts/tree/gedcom/import/GedcomImport.html',
            controller: 'GedcomImportController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('gedcom-import-wizard.file', {
        parent: 'gedcom-import-wizard',
        url: '/file',
        views: {
          content: {
            templateUrl: '/scripts/tree/gedcom/import/file/GedcomFile.html',
            controller: 'GedcomFileController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('gedcom-import-wizard.options', {
        parent: 'gedcom-import-wizard',
        url: '/options',
        views: {
          content: {
            templateUrl: '/scripts/tree/gedcom/import/options/GedcomOptions.html',
            controller: 'GedcomOptionsController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('gedcom-import-wizard.steps', {
        parent: 'gedcom-import-wizard',
        url: '/steps',
        views: {
          content: {
            templateUrl: '/scripts/tree/gedcom/import/steps/GedcomSteps.html',
            controller: 'GedcomStepsController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('gedcom-import-wizard.steps.uploading', {
        parent: 'gedcom-import-wizard.steps',
        url: '/uploading',
        views: {
          stepView: {
            templateUrl: '/scripts/tree/gedcom/import/steps/uploading/GedcomUploading.html',
            controller: 'GedcomUploadingController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('gedcom-import-wizard.steps.status', {
        parent: 'gedcom-import-wizard.steps',
        url: '/status',
        views: {
          stepView: {
            templateUrl: '/scripts/tree/gedcom/import/steps/status/GedcomStatus.html',
            controller: 'GedcomStatusController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('gedcom-import-wizard.steps.success', {
        parent: 'gedcom-import-wizard.steps',
        url: '/success',
        views: {
          stepView: {
            templateUrl: '/scripts/tree/gedcom/import/steps/success/GedcomSuccess.html',
            controller: 'GedcomSuccessController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
      .state('gedcom-import-wizard.steps.error', {
        parent: 'gedcom-import-wizard.steps',
        url: '/error',
        views: {
          stepView: {
            templateUrl: '/scripts/tree/gedcom/import/steps/error/GedcomError.html',
            controller: 'GedcomErrorController'
          }
        },
        data: {
          hideCmBar: true
        }
      })
    ;

    // Old routes
    $stateProvider
      .state('u.gedcom-index', {
        parent: 'u.tree',
        url: '/gedcom/index',
        views: {
          '@': {
            templateUrl: '/views/gedcom/gedcom-index.html',
            controller: 'GedcomIndexController'
          }
        },
        data: {
          stateClass: 'gedcom index'
        },
        resolve: {
          gedcoms: ($stateParams, Gedcom) => Gedcom.index({user_id: $stateParams.user_id}).$promise,
          redirect($rootScope, $state, $q, me, gedcoms) {
            if (gedcoms.length === 0) {
              $state.go('gedcom-import-wizard', {user_id: me.id});
              // The loader has to be removed manually, since we're possibly not really changing states
              // if we go from u.gedcom-import to u.gedcom-import
              $rootScope.showLoading = false;
              return $q.reject({cause: 'redirect'});
            } else {
              return false;
            }
          },
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: () => 'u.tree({ts: ' + Date.now() + '})',
          label: '{{ \'MY_GEDCOM_SPACE\' | translate }}'
        }
      })
      .state('u.gedcom-details', {
        parent: 'u.tree',
        url: '/gedcom/:gedcom_id/details',
        views: {
          '@': {
            templateUrl: '/scripts/tree/gedcom/details/GedcomDetails.html',
            controller: 'GedcomDetailsController'
          }
        },
        resolve: {
          detail: (gedcomService, $stateParams) => gedcomService.details($stateParams.gedcom_id),
          profile: (profileService, detail) => profileService.getBasicProfile(detail.owner.id, 'short'),
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        data: {
          stateClass: 'gedcom details'
        },
        ncyBreadcrumb: {
          parent: () => 'u.tree({ts: ' + Date.now() + '})',
          label: '{{ \'DETAILS\' | translate }}'
        }
      });
  });

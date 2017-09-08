angular.module('famicity')
  .directive('fcImportServicesButtons', function(
    $rootScope, $interval, $state, $translate, ContactsImportService,
    ModalManager, pendingFormsManagerService, sessionManager, $timeout) {
    'use strict';
    const log = debug('fc-imports-directive');

    var capitalize = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return {
      templateUrl: '/scripts/directory/invite/import/buttons/fc-import-services-buttons.html',
      scope: {
        showIntro: '=?',
        status: '=?'
      },
      restrict: 'E',
      link($scope) {
        if ($scope.showIntro == null) {
          $scope.showIntro = true;
        }
        $scope.loading = false;
        $scope.loaded = 0;
        $scope.imported = 0;
        let interval = null;
        let interrupted = null;
        let pendingImportCall = false;
        $scope.userId = sessionManager.getUserId();

        let getImports = function() {
          if (pendingImportCall) {
            return;
          }
          $scope.loading = true;
          $scope.error = '';
          pendingImportCall = true;
          ContactsImportService.getExternalImport()
            .then(function(response) {
              const status = response.status;
              const contacts_count = response.contacts_count;
              const total_contacts_count = response.total_contacts_count;
              $scope.status = status;
              log('status: %o, contacts_count: %o, total_contacts_count: %o', status, contacts_count, total_contacts_count);
              pendingImportCall = false;
              if (!status || status === 'error') {
                log('import error, canceling');
                $scope.error = $translate.instant('IMPORT_ERROR');
                $scope.cancel();
              } else if (status === 'sync_finished') {
                interrupted();
                $interval.cancel(interval);
                pendingFormsManagerService.removeForm('contact-import');
                var cancelState = $state.href($state.current.name, $state.current.params);
                var redirect;
                if ($state.current.name === 'wizard-find-friends') {
                  redirect = $state.href('wizard-tree-info');
                  $state.go('wizard-import-after', {
                    redirect,
                    cancel: cancelState,
                    formKey: $scope.form_key || null
                  });
                } else {
                  if ($state.current.name === 'u.directory.import-from-services') {
                    redirect = $state.href('u.directory.list', {user_id: $scope.userId});
                  } else {
                    redirect = cancelState;
                  }
                  $state.go('u.directory.invite-after-import', {
                    redirect,
                    cancel: cancelState,
                    formKey: $scope.form_key || null
                  });
                }
              } else {
                $timeout(() => {
                  $scope.contacts_count = contacts_count;
                  $scope.total_contacts_count = total_contacts_count;
                });
              }
            })
            .catch(function() {
              log('request error, canceling');
              $scope.error = $translate.instant('IMPORT_ERROR');
              return $scope.cancel();
            });
        };

        $scope.startExternalImport = function(provider) {
          log('start');
          $scope.provider = capitalize(provider.toLowerCase());
          interrupted = $rootScope.$on('$stateChangeSuccess', function() {
            return $interval.cancel(interval);
          });
          ContactsImportService.startExternalImport($scope.userId, provider)
            .then(function() {
              pendingFormsManagerService.addForm('contact-import');
              getImports();
              interval = $interval(getImports, 2000);
              if ($scope.status) {
                $scope.status.started = true;
              }
            })
            .catch(function(err) {
              $scope.error = $translate.instant('IMPORT_MUST_ACCEPT');
              log(err);
            });
        };
        $scope.cancel = function() {
          log('canceled');
          if (interrupted) {
            interrupted();
          }
          $interval.cancel(interval);
          $scope.loading = false;
          $scope.loaded = 0;
        };
      }
    };
  });

angular.module('famicity.gedcom')
  .controller('GedcomIndexController', function(
    $scope, $state, profileService, gedcomService,
    notification, me, gedcoms, pubsub, PUBSUB, $timeout,
    $moment, $stateParams) {
    'use strict';
    const log = debug('fc-GedcomIndexController');

    $scope.$moment = $moment;

    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    profileService.getBasicProfile($scope.viewedUserId, 'short', $scope);
    $scope.imports = gedcoms;

    pubsub.subscribe(PUBSUB.TREE.GEDCOM.STATUS, function(ev, status) {
      $scope.imports.map(pendingImport => {
        if (pendingImport.id === parseInt(status.id, 10)) {
          $timeout(() => {
            if (status.step) {
              pendingImport.state = 'in_progress';
            } else if (status.error) {
              pendingImport.state = 'error';
            } else if (status.success) {
              pendingImport.state = 'finish';
            }
          });
        }
      });
    }, $scope);

    $scope.goToCreateMessage = function() {
      $state.go('u.settings-contact');
    };

    $scope.cancel = function(importId) {
      log('cancelling import #%o', importId);
      gedcomService.cancelImport($scope.userId, importId).then(function() {
        log('canceled successfuly import #%o', importId);
        notification.add('GEDCOM.IMPORT.CANCEL.SUCCESS');
      }).catch(function(error) {
        log('could not import #%o', error);
        notification.add('GEDCOM.IMPORT.CANCEL.FAILED', {warn: true});
      }).finally(function() {
        $state.reload();
      });
    };

    $scope.continue = function(importId) {
      $state.go('gedcom-import-wizard', {
        user_id: $scope.userId,
        import_id: importId
      });
    };

  });

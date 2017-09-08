angular.module('famicity.gedcom')
  .controller('GedcomStatusController',
  function(
    $scope, $state, pubsub, PUBSUB, $timeout, gedcomService, notification) {
    'use strict';
    var log = debug('fc-GedcomStatusController');

    function dismissPopup() {
      if ($scope.popup) {
        $scope.popup.dismiss('finished');
        $scope.popup = null;
      }
    }

    function stepError(stepStatus) {
      $scope.setGedcomStatus('error');
      dismissPopup();
      $scope.gedcomImport.errors = stepStatus.data.map(function(elem) {
        return elem.message;
      });
      $state.go('gedcom-import-wizard.steps.error');
    }

    function stepSuccess(stepStatus) {
      $scope.setGedcomStatus('success');
      dismissPopup();
      angular.extend($scope.gedcomImport, stepStatus);  // Collect stats
      $scope.progress = 100;
      $state.go('gedcom-import-wizard.steps.success');
    }

    var stepsCount = 7;

    function stepProgress(stepStatus) {
      log('progress %o' + stepStatus);
      $scope.setGedcomStatus('in_progress');
      var stepIndex = stepStatus.step - 1;
      if (stepIndex > 0) {
        var importStep = $scope.importSteps[stepIndex - 1];
        importStep.status = 'done';
      }
      $scope.importSteps[stepIndex].status = 'running';
      $scope.progress = stepStatus.step * 100 / stepsCount;
    }

    function defaultProgress() {
      stepProgress({
        step: 1
      });
    }

    if ($scope.hasGedcom()) {
      $scope.importSteps = [];
      var type = $scope.gedcomImport.options.priorityTo === 'erase' ? 0 : 1;
      for (var i = 1; i <= stepsCount; i++) {
        $scope.importSteps.push({
          label: 'GEDCOM.IMPORT.DETAILS.STATUS.TYPE_' + type + '.' + i,
          status: undefined
        });
      }

      pubsub.subscribe(PUBSUB.TREE.GEDCOM.STATUS, function(event, stepStatus) {
        log('received %o with id=%o', stepStatus, stepStatus.id);
        $timeout(function() {
          stepStatus.id = parseInt(stepStatus.id, 10);
          if ($scope.gedcomImport.id === stepStatus.id) {
            if (stepStatus.error) {
              stepError(stepStatus);
            } else if (stepStatus.success) {
              stepSuccess(stepStatus);
            } else {
              stepProgress(stepStatus);
            }
          }
        });
      }, $scope);

      const maxWait = 10 * 60 * 1000;
      $timeout(function() {
        $scope.gedcomImport.status = 'wait';   // Will display "too long, we will notify you"
        $scope.progress = 0;
      }, maxWait);

      gedcomService.launchImport($scope.userId, $scope.gedcomImport.id).then(function(importResponse) {
        $scope.importValidated = true;
        $scope.gedcomImport.status = importResponse.gedcom_import.state;
        notification.add('GEDCOM_IMPORT_LAUNCHED_SUCCESS_MSG');

        gedcomService.getPositionInQueue($scope.userId, $scope.gedcomImport.id).then(function(positionResponse) {
          var position = positionResponse.gedcom_import.position;
          log('position in queue=%o', position);
          if (!position) {
            gedcomService.details($scope.gedcomImport.id).then(function(response) {
              log('import state=%o', response);
              $timeout(function() {
                switch (response.state) {
                  case 'error':
                    stepError(response);
                    break;
                  case 'finish':
                    stepSuccess(response);
                    break;
                  default:
                    if ($scope.gedcomImport.status !== 'in_progress') {
                      defaultProgress();
                    }
                }
              });
            });
          }
          if (position > 1) {
            $scope.gedcomImport.status = 'wait';
          }
        });
      });
    }
  });

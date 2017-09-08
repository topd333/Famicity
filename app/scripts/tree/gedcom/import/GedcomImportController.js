angular.module('famicity.gedcom')
  .controller('GedcomImportController',
  function(
    $scope, wizardService, $state, $timeout, pubsub, PUBSUB, gedcomService, notification, WIZARD_SERVICE, yesnopopin,
    me, $q, $rootScope) {
    'use strict';
    const log = debug('fc-GedcomImportController');

    var fileStep;
    var optionsStep;
    var stepsStep;
    var uploadingStep;
    var statusStep;
    var successStep;
    var errorStep;

    const gedcomIndexState = $state.get('u.gedcom-index');

    $scope.userId = me.id;

    function isFinished() {
      const status = $scope.gedcomImport.status;
      return status === 'success' || status === 'error';
    }

    function hasSomethingToCancel() {
      const status = $scope.gedcomImport.status;
      return !(!status || status === 'initiate' || isFinished(status) || status === 'cancelling' || status === 'canceled' || status === 'wait');
    }

    $scope.hasGedcom = function() {
      return $scope.gedcomImport && $scope.gedcomImport.id;
    };

    const cancelImport = function() {
      if ($scope.hasGedcom() && hasSomethingToCancel()) {
        $scope.setGedcomStatus('cancelling');
        // gedcomService.cancelImport($scope.userId, $scope.gedcomImport.id).then(function() {
        //  $scope.setGedcomStatus('canceled');
        //  notification.add('GEDCOM.IMPORT.CANCEL.SUCCESS');
        //  wizardService.end();
        // }).catch(function(error) {
        //  log('Could not cancel gedcom import: %o', error);
        //  notification.add('GEDCOM.IMPORT.CANCEL.FAILED');
        // });
        $scope.setGedcomStatus('canceled');
        log('Gedcom import cancelling has been disabled in this version');
      } else {
        log('Nothing to cancel');
      }
    };

    const checkCancel = function() {
      // $scope.popup = yesnopopin.openPromise('GEDCOM.IMPORT.CANCEL.TITLE', {
      //  yes: 'GEDCOM.IMPORT.CANCEL.YES',
      //  yesClass: 'btn-danger',
      //  no: 'GEDCOM.IMPORT.CANCEL.NO'
      // });
      // return $scope.popup.result;
      return $q(function(resolve) {
        resolve();
      });
    };

    const rootStateName = 'gedcom-import-wizard';

    const unlockUser = function() {
      if ($scope.fromAnotherWizard) {
        pubsub.publish(PUBSUB.USER.ACTIVATED);
      }
    };

    function enableToReceiveFromPush() {
      pubsub.publish(PUBSUB.PUSH.CONNECT, {
        userId: $scope.userId
      }, {pooled: true});
    }

    // To receive import progress
    enableToReceiveFromPush();

    $scope.setGedcomStatus = function(newStatus) {
      if ($scope.hasGedcom()) {
        $scope.gedcomImport.status = newStatus;
        log('Gedcom import %o is now %o', $scope.gedcomImport.id, $scope.gedcomImport.status);
      }
    };

    function init() {
      log('init');

      const previousRouterState = $state.previous;
      log('previousRouterState=%o', previousRouterState);

      $scope.gedcomImport = {
        id: null,
        preloaded_file: null,
        status: null
      };

      const stepChanger = function(fromStep, toStep, isBackStep, event, toState, toParams, fromState, fromParams, $q) {
        // function preventBack(fromState) {
        //  notification.add('GEDCOM.IMPORT.BACK.CANNOT_ONCE_FINISHED', {warn: true});
        //  return fromState;
        // }

        function canExit(toState, fromState) {
          return $q(function(resolve, reject) {
            if (hasSomethingToCancel()) {
              checkCancel()
                .then(function() {
                  cancelImport();
                  resolve(isBackStep ? gedcomIndexState : toState);
                }).catch(function() {
                  log('Staying here as cancelled cancellation');
                  reject(fromState);
                });
            } else {
              resolve(isBackStep ? gedcomIndexState : toState);
            }
          });
        }

        function exit(toState, fromState) {
          return $q(function(resolve, reject) {
            const isBackFromStart = toState.name === rootStateName && previousRouterState;
            if (isBackFromStart) {
              resolve(previousRouterState);
            } else {
              canExit(toState, fromState)
                .then(function(canExitState) {
                  resolve(canExitState);
                })
                .catch(function(cannotExitState) {
                  reject(cannotExitState);
                });
            }
          });
        }

        return $q(function(resolve, reject) {
          function checkExit(toState, fromState, resolve, reject, isBackStep) {
            exit(toState, fromState, isBackStep)
              .then(function(exitState) {
                $rootScope.previousWizard = null;
                unlockUser();
                resolve(exitState);
              }).catch(function(cannotExitState) {
                reject(cannotExitState);
              });
          }

          if (wizardService.getStepsCount()) {
            // Did recognize toState.name as matching a wizard step name
            const targetInsideWizard = Boolean(toStep);
            if (targetInsideWizard) {
              if (isBackStep) {
                log('Navigating back from %o to %o', fromStep, toStep);
                switch (fromStep) {
                  case fileStep:
                    checkExit(toState, fromState, resolve, reject, isBackStep);
                    break;
                  case optionsStep:
                    // No restriction
                    resolve(toState);
                    break;
                  default:
                    // if (isFinished()) {
                    //  log('Staying here as finished');
                    //  reject(preventBack(event));
                    // } else {
                    checkExit(toState, fromState, resolve, reject, isBackStep);
                    // }
                    break;
                }
              } else {
                resolve(toState);
              }
            } else {
              checkExit(toState, fromState, resolve, reject, isBackStep);
            }
          }
        });
      };

      $scope.fromAnotherWizard = wizardService.join('wizard-tree-info');

      fileStep = wizardService.addStep('gedcom-import-wizard.file');
      fileStep.canSkip = $scope.fromAnotherWizard;
      fileStep.changeHandlers.push(stepChanger);

      optionsStep = wizardService.addStep('gedcom-import-wizard.options');
      optionsStep.changeHandlers.push(stepChanger);
      stepsStep = wizardService.addStep('gedcom-import-wizard.steps');
      stepsStep.changeHandlers.push(stepChanger);
      uploadingStep = wizardService.addStep('gedcom-import-wizard.steps.uploading', stepsStep.index);
      uploadingStep.changeHandlers.push(stepChanger);
      statusStep = wizardService.addStep('gedcom-import-wizard.steps.status', stepsStep.index);
      statusStep.changeHandlers.push(stepChanger);
      successStep = wizardService.addStep('gedcom-import-wizard.steps.success', stepsStep.index);
      successStep.changeHandlers.push(stepChanger);
      errorStep = wizardService.addStep('gedcom-import-wizard.steps.error', stepsStep.index);
      errorStep.changeHandlers.push(stepChanger);

      wizardService.restart(fileStep.index - 1);
    }

    const gedcomNextStep = function() {
      if (!fileStep) {
        init();
      }
      return wizardService.nextStep();
    };

    let startingState;
    $scope.goToNextStep = function() {
      $timeout(function() {
        const nextStep = gedcomNextStep();
        $state.go(nextStep.name).then(function(newState) {
          if (!startingState) {
            startingState = newState;
          }
        });
      });
    };

    $scope.skip = function() {
      if ($scope.canSkip) {
        yesnopopin.open('SKIP_WIZARD_GEDCOM_ALERT').then(function() {
          pubsub.publish(PUBSUB.USER.ACTIVATED);
          $state.go('u.tree', {user_id: $scope.userId});
        });
      }
    };

    pubsub.subscribe(WIZARD_SERVICE.msgUpdated, function() {
      const currentStep = wizardService.getCurrentStep();
      if (currentStep) {
        $scope.canSkip = currentStep.canSkip;
      }
    }, $scope);

    // Go to 1st step
    $scope.goToNextStep();
  });

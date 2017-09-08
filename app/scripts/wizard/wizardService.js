angular.module('famicity')
  .constant('preventsChangeWizardHandler', function(
    fromStep, toStep, isBackStep, event, toState, toParams, fromState, fromParams, $q) {
    'use strict';
    return $q(function(resolve, reject) {
      reject();
    });
  })
  .constant('nopChangeHandler', function(
    fromStep, toStep, isBackStep, event, toState, toParams, fromState, fromParams, $q) {
    'use strict';
    return $q(function(resolve, reject) {
      resolve(toState);  // No change
    });
  })
  .constant('WIZARD_SERVICE', {
    msgUpdated: 'msg-updated'
  })
  .service('wizardService', function($rootScope, pubsub, WIZARD_SERVICE, nopChangeHandler, $q, $urlRouter, $state, LoadingAnimationUtilService) {
    'use strict';
    const log = debug('fc-wizardService');

    var steps;
    var currentStepIndex;

    function newStep(name, index) {
      return {
        index: index || steps.length + 1,
        name: name,
        changeHandlers: [nopChangeHandler]
      };
    }

    function updated() {
      pubsub.publish(WIZARD_SERVICE.msgUpdated);
    }

    function setCurrentStepIndex(newIndex) {
      if (newIndex != null) {
        currentStepIndex = newIndex;
        updated();
      }
    }

    function setCurrentStep(newStep) {
      if (newStep != null) {
        setCurrentStepIndex(newStep.index);
      }
    }

    function findStepByName(stepName) {
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        if (step.name === stepName) {
          return step;
        }
      }
      return null;
    }

    function indexOf(step) {
      return steps.indexOf(step);
    }

    var wizard;

    function getFinalState(resolvedStates, toState) {
      var finalState;
      for (var i = resolvedStates.length - 1; i >= 0; --i) {
        finalState = resolvedStates[i];
        if (finalState && finalState.name) {
          break;
        }
      }
      if (!finalState) {
        finalState = toState;
      }
      return finalState;
    }

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        log('Navigating from %o to %o', fromState, toState);
        var toStep = findStepByName(toState.name);
        if (toState.data.fromWizardService) {       // The $state.go() comes from the wizard service itself (see else)?
          toState.data.fromWizardService = false;     // Toggle the flag for next time and let carry on toward the decided toState
        } else {
          var fromStep = findStepByName(fromState.name);
          if (fromStep) {
            event.preventDefault();                   // Cancel transition until changeHandlers have voted
            LoadingAnimationUtilService.deactivate();
            var isBackStep = toStep && indexOf(toStep) < indexOf(fromStep);
            var changePromises = [];
            fromStep.changeHandlers.forEach(function(changeHandler) {
              changePromises.push(changeHandler(fromStep, toStep, isBackStep, event, toState, toParams, fromState, fromParams, $q));
            });
            $q.all(changePromises).then(function(resolvedStates) {
              var finalState = getFinalState(resolvedStates, toState);
              if (!finalState.data) {
                finalState.data = {};
              }
              finalState.data.fromWizardService = true;
              toStep = findStepByName(finalState.name);
              if (!toStep) {  // exit
                wizard.exit();
              }
              $state.go(finalState.name, toParams); // TODO: toParams should come with finalState
            });
          }
        }
        setCurrentStep(toStep);
      });

    wizard = {
      restart(index) {
        setCurrentStepIndex(index || 0);
      },
      reset() {
        steps = [];
        wizard.restart();
      },
      end() {
        this.reset();
      },
      exit() {
        $rootScope.previousWizard = {   // Save finished wizard state for possible join with another upcoming wizard
          steps: steps,
          currentStepIndex: currentStepIndex
        };
        this.end();
      },
      start() {
        this.reset();
      },
      join(latestStateName) {
        var previousWizard = $rootScope.previousWizard;
        var joined = previousWizard && previousWizard.steps[previousWizard.currentStepIndex - 1].name === latestStateName;
        if (joined) {
          steps = previousWizard.steps.concat(steps);
          setCurrentStepIndex(previousWizard.currentStepIndex);
          $rootScope.previousWizard = null;
        } else {
          this.start();
        }
        return joined ? previousWizard : null;
      },
      addStep(stepName, index) {
        var aStep = newStep(stepName, index);
        steps.push(aStep);
        return aStep;
      },
      getStepsCount() {
        return steps.length;
      },
      getStep(index) {
        return steps[index - 1];
      },
      getCurrentStep() {
        return this.getStep(currentStepIndex);
      },
      nextStepFrom(someStep, main) {
        function refreshCurrentState() {
          if (someStep) {
            currentStepIndex = steps.indexOf(someStep) + 1;
          } else {
            wizard.restart();
          }
        }

        refreshCurrentState();
        var foundNextStep;
        currentStepIndex++;
        foundNextStep = steps[currentStepIndex - 1];
        if (main) {
          let nextMainStepIndex = currentStepIndex;
          while (foundNextStep && foundNextStep.index <= currentStepIndex) {
            foundNextStep = steps[nextMainStepIndex - 1];
            nextMainStepIndex++;
          }
          currentStepIndex = nextMainStepIndex;
        }
        updated();
        if (!foundNextStep) {
          log('No step found after %o', someStep);
        }
        return foundNextStep;
      },
      nextStep() {
        return wizard.nextStepFrom(wizard.getCurrentStep());
      },
      nextMainStep() {
        return wizard.nextStepFrom(wizard.getCurrentStep(), true);
      }
    };
    wizard.reset();
    return wizard;
  });

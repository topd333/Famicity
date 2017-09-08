angular.module('famicity')
  .directive('fcWizardStep', function(wizardService, pubsub, WIZARD_SERVICE) {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/scripts/wizard/fc-step/fc-wizard-step.html',
      controller: function($scope) {
        var updateSteps = function() {
          $scope.steps = [];
          var lastStepIndex;
          var stepsCount = wizardService.getStepsCount();
          for (var i = 1; i <= stepsCount; i++) {
            var step = wizardService.getStep(i);
            var stepIndex = step.index;
            if (stepIndex !== lastStepIndex) {
              $scope.steps.push(step);
            }
            lastStepIndex = stepIndex;
          }
          $scope.currentStep = wizardService.getCurrentStep();
        };
        updateSteps();
        pubsub.subscribe(WIZARD_SERVICE.msgUpdated, updateSteps);
      }
    };
  });

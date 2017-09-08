describe('Wizard service', function() {
  'use strict';

  var wizardService;
  var $rootScope;

  // load module
  beforeEach(module('famicity'));

  // load module
  beforeEach(module('famicity', function($provide) {
    // Fake locale setting to avoid locale script loading failure
    $provide.provider('tmhDynamicLocale', function() {
      this.$get = function() {
        return {
          set: function(locale) {
            //console.log('Locale set to ' + locale);
          }
        };
      };
    });
  }));

  beforeEach(function() {
    inject(function(_wizardService_, _$rootScope_) {
      wizardService = _wizardService_;
      $rootScope = _$rootScope_;
    });
  });

  it('counts number of steps', inject(function(nopChangeHandler) {

    expect(wizardService.getStepsCount()).toEqual(0);

    wizardService.addStep('step1');
    expect(wizardService.getStepsCount()).toEqual(1);
    var step2 = wizardService.addStep('step2');
    expect(wizardService.getStepsCount()).toEqual(2);

    // Step forward
    wizardService.nextStep();
    expect(wizardService.getCurrentStep()).toEqual({index: 1, name: 'step1', changeHandlers: [nopChangeHandler]});
    expect(wizardService.getStepsCount()).toEqual(2); // Stepping forward has not changed the count
    wizardService.nextStep();
    expect(wizardService.getCurrentStep()).toEqual({index: 2, name: 'step2', changeHandlers: [nopChangeHandler]});

    // Add steps after forward
    var step3 = wizardService.addStep('step3');
    expect(wizardService.getStepsCount()).toEqual(3);
    wizardService.addStep('step4');
    expect(wizardService.getStepsCount()).toEqual(4);

    // Step forward again
    wizardService.nextStep();
    expect(wizardService.getCurrentStep()).toEqual({index: 3, name: 'step3', changeHandlers: [nopChangeHandler]});
    expect(wizardService.getStepsCount()).toEqual(4);
    wizardService.nextStep();
    expect(wizardService.getCurrentStep()).toEqual({index: 4, name: 'step4', changeHandlers: [nopChangeHandler]});

    // Step from given state
    wizardService.nextStepFrom(step3);
    expect(wizardService.getCurrentStep()).toEqual({index: 4, name: 'step4', changeHandlers: [nopChangeHandler]});

    wizardService.nextStepFrom(step2);
    expect(wizardService.getCurrentStep()).toEqual({index: 3, name: 'step3', changeHandlers: [nopChangeHandler]});

    var unknownStep = {index: 12, name: 'unknownStep'};
    wizardService.nextStepFrom(unknownStep);
    expect(wizardService.getCurrentStep()).toEqual({index: 1, name: 'step1', changeHandlers: [nopChangeHandler]});
    var latestStep = wizardService.getCurrentStep();

    wizardService.exit();

    var joined = wizardService.join(latestStep.name);
    expect($rootScope.previousWizard).toEqual(null);
    expect(joined.steps).toBeDefined();
    expect(joined.currentStepIndex).toBeDefined();

    var newStep1 = wizardService.addStep('newStep1');
    expect(wizardService.getStepsCount()).toEqual(joined.steps.length + 1);
    expect(wizardService.getCurrentStep()).toEqual(wizardService.getStep(latestStep.index));

    wizardService.restart(newStep1.index);
    expect(wizardService.getCurrentStep()).toEqual(newStep1);

    wizardService.reset();
    expect(wizardService.getStepsCount()).toEqual(0);
  }));
});

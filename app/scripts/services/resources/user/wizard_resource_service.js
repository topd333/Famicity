angular.module('famicity').service('WizardService', function(
  $resource, $location, $translate, sessionManager, notification, configuration) {
  'use strict';

  function WizardService(errorHandler) {
    this.service = $resource(configuration.api_url, {}, {
      put_wizard: {
        method: 'PUT',
        params: {
          step_id: '@step_id'
        },
        url: configuration.api_url + '/wizard/:step_id'
      }
    });
    this.errorHandler = errorHandler;
  }

  WizardService.prototype.put_wizard = function(step_id, attrs) {
    return new this.service({
      user: attrs
    }).$put_wizard({
        step_id: step_id
      }, function(response) {
        return $location.path('/internal/wizard/' + response.step);
      });
  };

  return WizardService;

});

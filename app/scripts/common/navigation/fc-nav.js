angular.module('famicity')
/**
 * Abstraction of ui-sref
 */
  .directive('fc-nav', navigation => {
    'use strict';
    return {
      restrict: 'A',
      link(scope, elem, attrs) {
        const spec = attrs['fc-nav'] || attrs['data-fc-nav'];
        let stateName;
        let businessParams;
        const paramsPos = spec.indexOf('(');
        if (paramsPos > 0) {
          stateName = spec.substring(0, paramsPos);
          let businessParamsString = spec.substring(paramsPos + 1, spec.length - 1);
          businessParams = angular.fromJson(businessParamsString);
        } else {
          stateName = spec;
        }
        let technicalOptions;
        elem.click(() => navigation.go(stateName, businessParams, technicalOptions));
      }
    };
  });

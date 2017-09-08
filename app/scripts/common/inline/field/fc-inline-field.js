angular.module('famicity')
  .directive('fcInlineField', function() {
    'use strict';

    var log = debug('fc-inline-field');

    return {
      restrict: 'E',
      scope: {
        object: '=',
        key: '@',
        label: '@',
        labelValues: '@?',
        labelIcon: '@',
        formStatus: '=',
        required: '=?',
        scopeId: '@?'
      },
      templateUrl: '/scripts/common/inline/field/fc-inline-field.html',
      link(scope) {
        scope.id = (scope.scopeId || scope.$id) + '-' + scope.key;
      }
    };
  });


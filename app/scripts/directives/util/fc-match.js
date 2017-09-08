
angular.module('famicity').directive('fcMatch', function($parse) {
  'use strict';
  return {
    restrict: 'A',
    require: '?ngModel',
    link(scope, elem, attrs, ctrl) {
      var validator;
      if (!ctrl) {
        return;
      }
      if (!attrs['fcMatch']) {
        return;
      }
      validator = function(value) {
        var firstPassword, temp, v;
        firstPassword = $parse(attrs.fcMatch);
        temp = firstPassword(scope);
        v = value === temp;
        ctrl.$setValidity('match', v);
        return value;
      };
      ctrl.$parsers.unshift(validator);
      ctrl.$formatters.push(validator);
      attrs.$observe('fcMatch', function() {
        validator(ctrl.$viewValue);
      });
    }
  };
});

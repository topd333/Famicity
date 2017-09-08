angular.module('famicity')
.directive('fcGenderInput', function() {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/scripts/common/gender/fc-gender-input.html',
      scope: {
        user: '=',
        formName: '@'
      },
      link(scope) {
        if (!scope.user.sex) {
          scope.user.sex = 'Male';  // Default gender
        }
      }
    };
  });

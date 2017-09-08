angular.module('famicity').directive('fcAutoFocus', function($timeout, $parse) {
  'use strict';
  return {
    link($scope, element, attrs) {
      var model;
      model = $parse(attrs.fcAutoFocus);
      $scope.$watch(model, function() {
        $timeout(function() {
          element[0].focus();
        });
      });
    }
  };
});

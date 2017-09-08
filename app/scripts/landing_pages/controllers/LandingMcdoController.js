angular.module('famicity').controller('LandingMcdoController', function($scope, $location, sessionManager) {
  'use strict';
  $scope.init = function() {
    sessionManager.setReferral({
      landing: $location.path()
    });
  };
});

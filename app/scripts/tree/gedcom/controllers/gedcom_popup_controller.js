angular.module('famicity.gedcom').controller('CancelGedcomAlertPopupController', function($scope) {
  'use strict';
  $scope.submit = function() {};
});

angular.module('famicity.gedcom').controller('ExitGedcomUploadAlertPopupController', function(
  $scope, $state, $modalInstance, gedcomUploadService) {
  'use strict';
  $scope.init = function() {};
  $scope.confirm = function() {
    if ($scope.uploadSuccess) {
      $scope.cancelImport(false);
    } else {
      $scope.cancelUpload(false);
    }
    gedcomUploadService.cancelAll();
    $modalInstance.close();
    $state.go($scope.stateChangeDetails.toState.name, $scope.stateChangeDetails.toParams);
  };
  $scope.cancel = function() {
    $scope.stateChangeDetails.toState = null;
    $scope.stateChangeDetails.toParams = null;
    $modalInstance.close();
  };
});

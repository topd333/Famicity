
angular.module('famicity').controller('PopupAlbumsPhotosMobileOptionsController', function($scope, $modalInstance) {
  'use strict';
  $scope.openEditPhotoPopup = function() {
    $modalInstance.close();
    $scope.openPhotoDescriptionPopup();
  };
  $scope.openDeletePhotoPopup = function() {
    $modalInstance.close();
    $scope.openDeletePhotoAlertPopup();
  };
  $scope.rotateLeftOption = function() {
    $scope.rotateLeft();
    $modalInstance.close();
  };
  $scope.rotateRightOption = function() {
    $scope.rotateRight();
    $modalInstance.close();
  };
});

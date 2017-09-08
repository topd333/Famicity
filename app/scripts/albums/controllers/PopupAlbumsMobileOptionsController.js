
angular.module('famicity').controller('PopupAlbumsMobileOptionsController', function($scope, $modalInstance, $state) {
  'use strict';
  $scope.goToEditAlbum = function() {
    $modalInstance.close();
    $state.go('u.albums-update', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
  };
  $scope.openDeleteAlbumPopup = function() {
    $modalInstance.close();
    $scope.openDeleteAlbumAlertPopup();
  };
});

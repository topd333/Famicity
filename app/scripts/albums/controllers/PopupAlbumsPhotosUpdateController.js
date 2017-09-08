
angular.module('famicity').controller('PopupAlbumsPhotosUpdateController', function(
  $scope, $modalInstance, $moment, Photo, sessionManager) {
  'use strict';

  $scope.init = function() {
    $scope.formInProgress = false;
    $scope.locale = sessionManager.getLocale();
    $scope.photoEditCopy = Photo.edit({
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId,
      photo_id: $scope.photoId
    });
    $scope.photoEditCopy.dateIsValid = null;
  };
  $scope.submitDescriptionForm = function() {
    const promises = [];
    let photoDate = null;
    if ($scope.photoEditCopy.dateIsValid === false) {
      photoDate = 'Invalid date';
    } else if ($scope.photoEditCopy.photo_date) {
      photoDate = $moment($scope.photoEditCopy.photo_date).forServer();
    }
    const photo = new Photo({
      description: $scope.photoEditCopy.description,
      photo_date: photoDate
    });
    const promise = photo.$update({
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId,
      photo_id: $scope.photoId
    });
    promise.then(function() {
      $modalInstance.close(photo);
    });
    promises.push(promise);
    return promises;
  };
});

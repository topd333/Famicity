angular.module('famicity')
  .controller('ProfilePhotoAddController', function($scope, $modalInstance, $state) {
    'use strict';
    $scope.addPhotoFromWebcam = function() {
      $modalInstance.close();
      $state.go('u.profile-photos-webcam');
    };
    $scope.addPhotoFromGallery = function() {
      $modalInstance.close();
      $state.go('u.profile-photos-gallery');
    };
    $scope.closePopup = function() {
      $modalInstance.close();
    };
  });

angular.module('famicity').controller('AvatarPhotoDescriptionPopupController', function(
  $scope, $modalInstance, $location, Avatar, $moment,
  $timeout) {
  'use strict';

  $scope.avatar.dateIsValid = null;

  $scope.init = function() {
    $scope.formInProgress = false;
    Avatar.edit({
      user_id: $scope.viewedUserId,
      id: $scope.photoId
    })
      .$promise.then(function(avatar) {
        if (avatar.taken_at) {
          avatar.taken_at = $moment.fromServer(avatar.taken_at).toDate();
        }
        $scope.photoEditCopy = avatar;
      });
  };
  $scope.submit = function() {
    const promises = [];

    let takenAt;
    if ($scope.avatar.dateIsValid === false) {
      takenAt = 'Invalid date';
    } else {
      takenAt = $scope.photoEditCopy.taken_at ? $moment($scope.photoEditCopy.taken_at).forServer() : null;
    }

    const promise = new Avatar({
      user_id: $scope.viewedUserId,
      id: $scope.photoId,
      description: $scope.photoEditCopy.description,
      taken_at: takenAt
    }).$update();

    promise.then(function() {
      $timeout(() => {
        $scope.avatar.description = $scope.photoEditCopy.description;
        $scope.avatar.taken_at = $scope.photoEditCopy.taken_at;
      });
      $modalInstance.close();
    });

    promises.push(promise);
    return promises;
  };
});

angular.module('famicity').controller('AvatarsMobileOptionsPopupController', function($scope, $modalInstance) {
  'use strict';
  $scope.openEditPhotoPopup = function() {
    $modalInstance.close();
    $scope.openAvatarPhotoDescriptionPopup();
  };
  $scope.openDeletePhotoPopup = function() {
    $modalInstance.close();
    $scope.openAvatarDeletePhotoAlertPopup();
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

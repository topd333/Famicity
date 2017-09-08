
angular.module('famicity')
  .controller('AlbumAddPhotosController', function(
    $scope, $modalInstance, $state, ImageUploader,
    sessionManager, configuration) {
    'use strict';

    let index = 0;
    const uploadId = Date.now();
    ImageUploader.reset();

    $scope.init = function() {
      const uploadButtonElement = document.getElementById('popupPhotoUploadBtn');

      ImageUploader.setParams({
        button: uploadButtonElement,
        maxConnections: 3,
        cors: {
          expected: true
        },
        validation: {
          acceptFiles: '.png, .jpg, .jpeg, .gif, .tiff',
          allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'tiff']
        },
        request: {
          endpoint: configuration.api_url + '/users/' + $scope.viewedUserId + '/albums/' + $scope.albumId + '/photos',
          customHeaders: {
            Authorization: 'Bearer ' + sessionManager.getToken()
          },
          params: {
            from: 'upload',
            upload_id: uploadId,
            index: () => index++
          }
        }
      });
    };

    $scope.closePopup = function() {
      $modalInstance.close();
    };
  });

angular.module('famicity')
  .directive('fcPhotoUpload', function(
    $stateParams, ImageUploader, sessionManager, Post, notification, yesnopopin, $timeout) {
    'use strict';
    const log = debug('fc-photo-upload');
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: '/scripts/blog/directives/fc-photo-upload.html',
      link(scope, elem) {
        scope.thumbnailElement = elem.find('.qq-thumbnail-selector')[0];
        scope.object.uploader = newUploader();

        function reset() {
          $timeout(function() {
            scope.object.uploader.reset();
            scope.formStatus.isShowPhoto = scope.formStatus.isCreating ? false : !scope.object.photo_url_thumb;
          });
        }

        function clear() {
          scope.object.photo_id = null;
          scope.object.photo_url_thumb = null;
          scope.object.photo_url_normal = null;
          scope.object.photo_url_original = null;
          reset();
        }

        if (!scope.object.photo_id) {
          clear();
        } else {
          scope.formStatus.isShowPhoto = true;
        }

        scope.deletePostPhoto = function() {
          clear();
        };

        scope.deletePhoto = function() {
          yesnopopin.open('DELETE_PHOTO_CONFIRMATION_TITLE')
            .then(function() {
              return Post.delete_photo({
                user_id: scope.user.id,
                post_id: scope.object.id,
                id: scope.object.photo_id
              }).$promise.then(function() {
                  notification.add('PHOTO_DELETED_SUCCESS_MSG');
                  reset();
                });
            });
        };

        scope.getInfo = function(id) {
          const size = scope.object.uploader.getSize(id) / 1000;
          return {
            name: scope.object.uploader.getName(id),
            size
          };
        };

        function newUploader() {
          return new qq.FineUploaderBasic({
            button: scope.uploadButton,
            multiple: false,
            itemLimit: 1,
            autoUpload: false,
            validation: {
              acceptFiles: '.png, .jpg, .jpeg, .gif, .tiff',
              allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'tiff']
            },
            request: {
              endpoint: '',
              customHeaders: {
                Authorization: 'Bearer ' + sessionManager.getToken()
              }
            },
            scaling: {
              sendOriginal: false,
              includeExif: true,
              orient: true,
              sizes: [
                {
                  name: 'original',
                  maxSize: 2400
                }
              ]
            },
            callbacks: {
              onAllComplete() {
                reset();
              },
              onStatusChange(uploadId, oldStatus, newStatus) {
                log('statusChange(' + uploadId + ', ' + oldStatus + ', ' + newStatus + ')');
                $timeout(function() {
                  switch (newStatus) {
                    case 'submitting':
                      if (scope.formStatus.isCreating) {
                        scope.edit();
                      }
                      break;
                    case 'submitted':
                      scope.formStatus.isShowPhoto = true;
                      scope.object.uploader.drawThumbnail(uploadId, scope.thumbnailElement, 200, false);
                      scope.postPhotoInfo = scope.getInfo(uploadId);
                      scope.postPhoto = scope.object.uploader.getFile(uploadId);
                      scope.formStatus.isUploadedPhoto = true;
                      if (uploadId > 0) {
                        // Remove previous
                        scope.object.uploader.cancel(uploadId - 1);
                      }
                      break;
                    default:
                  }
                });
              },
              onError(id, name, errorReason, xhr) {
                log('error, id: %o, name: %o, errorReason: %o, xhr: %o', id, name, errorReason, xhr);
                if (/invalid extension/.test(errorReason)) {
                  notification.add('INCORRECT_FILE_FORMAT', {warn: true});
                }
              }
            }
          });
        }
      }
    };
  });

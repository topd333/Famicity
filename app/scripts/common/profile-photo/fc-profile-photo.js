angular.module('famicity')
  .directive('fcProfilePhoto', function(sessionManager, $timeout, notification, avatarService, pubsub, PUBSUB) {
    'use strict';
    const log = debug('fc-profile-photo');
    const dbg = false;
    return {
      restrict: 'E',
      scope: {
        onUpload: '&',
        cropping: '=?',
        thumbnail: '=?'
      },
      templateUrl: '/scripts/common/profile-photo/fc-profile-photo.html',
      link(scope, elem) {
        scope.isUploadedPhoto = Boolean(scope.thumbnail);
        scope.uploadOngoing = false;
        scope.uploadId = null;
        scope.uploadPercent = null;
        scope.canUpload = true;
        scope.cropDetails = '';

        scope.cropMode = scope.cropping != null;
        if (!dbg) {
          if (typeof FileReader === 'undefined') {
            log('Disabled cropping as FileReader is not supported');
            scope.canUpload = false;
            scope.cropMode = false;
          }
          if (!angular.isFunction(Blob)) {
            log('Disabled cropping as Blob API is not supported');
            scope.cropMode = false;
          }
          // if (!URL || URL.createObjectURL) {
          //  log('Disabled cropping as URL is not supported');
          //  scope.cropMode = false;
          // }
        }
        scope.cropping = false;
        scope.cropped = false;

        scope.toggleCropping = function() {
          if (scope.cropMode) {
            scope.cropping = !scope.cropping;
          }
        };

        let uploader;

        function registerForUpload(imgData, fileName) {
          const croppedBlob = qq.dataUriToBlob(imgData);
          // Will call submitted() callback
          uploader.addFiles([{blob: croppedBlob, name: fileName}]);
        }

        scope.cropIt = function() {
          // Cancel previous upload (uncropped or original)
          uploader.cancel(scope.uploadId);
          scope.cropped = true;
          // registerForUpload(scope.photoCropped, scope.fileName);
          registerForUpload(scope.photoToCrop, scope.fileName);
          scope.cropping = false;
          log('crop details=%o', scope.cropDetails);
          scope.onUpload({uploader});
        };

        scope.cancel = function() {
          scope.cropping = false;
        };

        if (!scope.photoToCrop) {
          scope.photoToCrop = '';
        }
        if (!scope.photoCropped) {
          scope.photoCropped = '';
        }
        scope.submitted = function(file) {
          log('submitted');
          if (file.name) {
            scope.fileName = file.name;
          }

          // Get image size
          // if (!scope.cropped) {
          //  var originalUrl = URL.createObjectURL(file);
          //  var originalImage = new Image();
          //  originalImage.onload = function() {
          //    scope.originalWidth = this.width;
          //  };
          //  originalImage.src = originalUrl;
          // }

          let reader;
          if (dbg) {
            let FakeReader;
            if (typeof FileReader === 'undefined') {
              FakeReader = function() {
                return {
                  readAsDataURL() {
                    const evt = {
                      target: {
                        result: 'data:image/jpeg;base64,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'
                      }
                    };
                    this.onload(evt);
                  }
                };
              };
              reader = new FakeReader();
            } else {
              reader = new FileReader();
            }
          } else {
            reader = new FileReader();
          }
          reader.onload = function(evt) {
            $timeout(function() {
              const submittedImage = evt.target.result;
              if (scope.cropped) {
                scope.thumbnail = scope.photoCropped;
              } else {
                scope.photoToCrop = submittedImage;
              }
              scope.photoCropped = submittedImage;
              if (scope.cropMode && !scope.cropped) {
                scope.photoToCrop = scope.photoCropped;
                scope.cropping = true;
              } else {
                scope.onUpload({uploader});
              }
              scope.cropped = false;
            });
          };
          reader.readAsDataURL(file);
        };

        scope.$watch('cropping', function() {
          if (scope.cropping) {
            // Wait for the crop-zone to display before we can set its size
            $timeout(function() {
              elem.find('.img-crop').css('height', '100%');
            }, 200);
          }
        });

        scope.deleteRelativePhoto = function() {
          scope.isUploadedPhoto = false;
          scope.photoOriginal = null;
          uploader.reset();
        };

        scope.cancelUpload = function() {
          if (scope.uploadOngoing) {
            uploader.cancel(scope.uploadId);
          }
        };

        uploader = new qq.FineUploaderBasic({
          button: elem.find('.upload-button')[0],
          multiple: false,
          autoUpload: false,
          validation: {
            acceptFiles: '.png, .jpg, .jpeg, .gif, .tiff',
            allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'tiff']
          },
          request: {
            // Expected to be set in onUpload() callback implementation
            endpoint: '',
            customHeaders: {
              Authorization: 'Bearer ' + sessionManager.getToken()
            },
            params: {
              from: 'upload'
            }
          },
          callbacks: {
            onStatusChange(id, oldStatus, newStatus) {
              const file = uploader.getFile(scope.uploadId);
              scope.uploadId = id;
              if (newStatus === 'submitted') {
                if (scope.cropped) {
                  scope.thumbnail = scope.photoCropped;
                  scope.cropped = false;
                } else {
                  $timeout(function() {
                    scope.isUploadedPhoto = true;
                    log('onStatusChange submitted #%o', scope.uploadId);
                    scope.submitted(file);
                  });
                }
              }
            },
            onUpload(id) {
              scope.uploadOngoing = true;
              scope.uploadId = id;
              log('onUpload %o', scope.uploadId);
            },
            onProgress(id, name, uploadedBytes, totalBytes) {
              $timeout(function() {
                scope.uploadPercent = (uploadedBytes / totalBytes * 100).toFixed(2);
              });
            },
            onComplete(id, name, responseJSON) {
              const photoId = responseJSON.avatar.id;
              const cropDetails = scope.cropDetails;

              /* cropDetails.image.width / cropDetails.canvas.width; */
              const f = 1;
              const scaleFactor = 1 / f;

              const vx = cropDetails.x - cropDetails.size / 2;
              const vy = cropDetails.y - cropDetails.size / 2;
              const vw = cropDetails.size;
              const vh = cropDetails.size;

              const sx = vx * f;
              const sy = vy * f;
              const sw = vw * f;
              const sh = vh * f;

              log('width scale factor=%o', scaleFactor);
              const coordinates = {
                x: Math.floor(sx),
                y: Math.floor(sy),
                width: Math.floor(sw),
                height: Math.floor(sh)
              };
              log('coordinates=%o', coordinates);
              avatarService.crop(sessionManager.getUserId(), photoId, coordinates, scope, function(response) {
                scope.thumbnail = response.avatar;
              });
              scope.uploadOngoing = false;
              // notification.add('UPLOAD_FINISHED');
              uploader = null;
              pubsub.publish(PUBSUB.UPLOADER.ON_COMPLETE);
            },
            onCancel() {
              scope.uploadOngoing = false;
              scope.uploadId = null;
              log('uploader onCancel %o', scope.uploadId);
              scope.uploadPercent = null;
            },
            onError(id, name, errorReason, xhr) {
              log('error, id: %o, name: %o, errorReason: %o, xhr: %o', id, name, errorReason, xhr);
              if (/invalid extension/.test(errorReason)) {
                notification.add('INCORRECT_FILE_FORMAT');
              }
              if (xhr && xhr.status !== 200) {
                scope.uploadOngoing = false;
                notification.add('UPLOAD_FAILED', {warn: true});
              }
            }
          },
          scaling: {
            sendOriginal: false,
            includeExif: true,
            orient: true,
            sizes: {
              name: 'original',
              maxSize: 2400
            }
          }
        });
      }
    };
  })
;

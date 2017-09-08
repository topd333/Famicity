angular.module('famicity')
  .factory('ImageUploader', function(pubsub, PUBSUB, notification) {
    'use strict';
    const log = debug('fc-imageuploader');
    let uploader;
    const events = {
      onProgress(id, name, uploadedBytes, totalBytes) {
        pubsub.publish(PUBSUB.UPLOADER.ON_PROGRESS, {
          id,
          name,
          uploadedBytes,
          totalBytes
        });
      },
      onTotalProgress(totalUploadedBytes, totalBytes) {
        pubsub.publish(PUBSUB.UPLOADER.ON_TOTAL_PROGRESS, {
          totalUploadedBytes,
          totalBytes
        });
      },
      onStatusChange(id, oldStatus, newStatus) {
        pubsub.publish(PUBSUB.UPLOADER.ON_STATUS_CHANGE, {
          id,
          oldStatus,
          newStatus
        });
      },
      onComplete(id, name, responseJSON, xhr) {
        pubsub.publish(PUBSUB.UPLOADER.ON_COMPLETE, {
          id,
          name,
          responseJSON,
          xhr
        });
      },
      onAllComplete(succeeded, failed) {
        pubsub.publish(PUBSUB.UPLOADER.ON_ALL_COMPLETE, {
          succeeded,
          failed
        });
      },
      onCancel() {
        // NOT USED
        // pubsub.publish('imageUploaderOnCancel', {
        //   id: id,
        //   name: name
        // });
      },
      onError(id, name, errorReason, xhr) {
        log('error, id: %o, name: %o, errorReason: %o, xhr: %o', id, name, errorReason, xhr);
        if (/invalid extension/.test(errorReason)) {
          notification.add('INCORRECT_FILE_FORMAT', {warn: true});
        }
      },
      onSubmitted(id, name) {
        pubsub.publish(PUBSUB.UPLOADER.ON_SUBMITTED, {
          id,
          name
        });
      }
    };
    return {
      setParams(params) {
        params.callbacks = {
          onUpload: events.onUpload,
          onProgress: events.onProgress,
          onStatusChange: events.onStatusChange,
          onTotalProgress: events.onTotalProgress,
          onComplete: events.onComplete,
          onAllComplete: events.onAllComplete,
          onCancel: events.onCancel,
          onError: events.onError,
          onSubmitted: events.onSubmitted
        };
        if (!params.scaling) {
          params.scaling = {
            sendOriginal: false,
            includeExif: true,
            orient: true,
            sizes: [
              {
                name: 'original',
                maxSize: 2400
              }
            ]
          };
        }
        uploader = new qq.FineUploaderBasic(params);
        log('uploader initialized, params: %o, uploader: %o', params, uploader);
      },
      getUploads() {
        let uploads;
        if (uploader && uploader.getUploads().length > 0) {
          uploads = uploader.getUploads();
        } else {
          uploads = null;
        }
        return uploads;
      },
      reset() {
        if (uploader) {
          uploader.reset();
        }
      },
      cancelAll() {
        if (uploader) {
          uploader.cancelAll();
        }
      },
      getInfo(id) {
        let info;
        let size;
        if (uploader) {
          size = uploader.getSize(id) / 1000;
          info = {
            name: uploader.getName(id),
            size
          };
        }
        return info;
      },
      getFile(id) {
        if (uploader) {
          return uploader.getFile(id);
        }
      },
      drawThumbnail(id, element) {
        if (uploader) {
          uploader.drawThumbnail(id, element, 200, false);
        }
      },
      setEndpoint(url) {
        if (uploader) {
          uploader.setEndpoint(url);
        }
      },
      uploadStoredFiles() {
        if (uploader) {
          uploader.uploadStoredFiles();
        }
      },
      onUpload() {
        // NOT USED
        // pubsub.publish('imageUploaderOnUpload', {
        //   id: id,
        //   name: name
        // });
      }
    };
  });

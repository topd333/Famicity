angular.module('famicity')
  .service('gedcomUploadService', function($rootScope, $location, sessionManager, notification) {
    'use strict';
    const log = debug('fc-gedcomUploadService');
    let uploader;

    const events = {
      onUpload(id, name) {
        log('onUpload');
        $rootScope.$broadcast('gedcomUploaderOnUpload', {
          id,
          name
        });
      },
      onProgress(id, name, uploadedBytes, totalBytes) {
        log('onProgress');
        $rootScope.$broadcast('gedcomUploaderOnProgress', {
          id,
          name,
          uploadedBytes,
          totalBytes
        });
      },
      onTotalProgress(totalUploadedBytes, totalBytes) {
        log('onTotalProgress');
        $rootScope.$broadcast('gedcomUploaderOnTotalProgress', {
          totalUploadedBytes,
          totalBytes
        });
      },
      onStatusChange(id, oldStatus, newStatus) {
        log('onStatusChange');
        $rootScope.$broadcast('gedcomUploaderOnStatusChange', {
          id,
          oldStatus,
          newStatus
        });
      },
      onComplete(id, name, responseJSON, xhr) {
        log('onComplete');
        $rootScope.$broadcast('gedcomUploaderOnComplete', {
          id,
          name,
          responseJSON,
          xhr
        });
      },
      onAllComplete(succeeded, failed) {
        log('onAllComplete');
        $rootScope.$broadcast('gedcomUploaderOnAllComplete', {
          succeeded,
          failed
        });
      },
      onCancel(id, name) {
        log('onCancel');
        $rootScope.$broadcast('gedcomUploaderOnCancel', {
          id,
          name
        });
      },
      onError(id, name, errorReason, xhr) {
        log('error, id: %o, name: %o, errorReason: %o, xhr: %o', id, name, errorReason, xhr);
        $rootScope.$broadcast('gedcomUploaderOnError', {
          id,
          name,
          errorReason,
          xhr
        });
        if (/invalid extension/.test(errorReason)) {
          notification.add('INCORRECT_FILE_FORMAT', {warn: true});
        }
      }
    };

    return {
      /**
       * Reset the uploader with new parameters.
       *
       * @param button
       * @param endPointUrl
       */
      setParams(button, endPointUrl) {
        log('setParams(%o,%o)', button, endPointUrl);
        const params = {
          autoUpload: false,
          maxConnections: 1,
          cors: {
            expected: true
          },
          request: {
            endpoint: endPointUrl,
            customHeaders: {
              Authorization: 'Bearer ' + sessionManager.getToken()
            }
          },
          validation: {
            acceptFiles: '.ged',
            allowedExtensions: ['ged'],
            itemLimit: 1
          },
          callbacks: {
            onUpload: events.onUpload,
            onProgress: events.onProgress,
            onStatusChange: events.onStatusChange,
            onTotalProgress: events.onTotalProgress,
            onComplete: events.onComplete,
            onAllComplete: events.onAllComplete,
            onCancel: events.onCancel,
            onError: events.onError
          },
          button
        };
        uploader = new qq.FineUploaderBasic(params);
        log('Created uploader %o', uploader);
      },
      addParams(params) {
        if (uploader) {
          return uploader.setParams(params);
        }
      },
      getUploads() {
        const uploads = uploader && uploader.getUploads().length > 0 ? uploader.getUploads() : null;
        log('getUploads = %o', uploads);
        return uploads;
      },
      reset() {
        log('reset');
        if (uploader) {
          uploader.reset();
        } else {
          log.warn('No uploader to reset');
        }
      },
      cancelAll() {
        if (uploader) {
          log('cancelAll');
          uploader.cancelAll();
        } else {
          log.warn('No uploader for cancelling all');
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
        let file;
        if (uploader) {
          file = uploader.getFile(id);
          log('getFile(%o)=%o', id, file);
        } else {
          log.warn('No uploader for getting file');
        }
        return file;
      },
      uploadStoredFiles() {
        if (uploader) {
          log('uploading stored files');
          uploader.uploadStoredFiles();
        } else {
          log.warn('No uploader for uploadings stored files');
        }
      }
    };
  });


angular.module('famicity')
  .service('photoService', function($q, configuration) {
    'use strict';
    var log = debug('photoService');

    return {
      upload: function(uploader, userId, postId) {
        var deferredPhoto = $q.defer();
        if (uploader) {
          if (uploader.getUploads().length) {
            uploader._options.callbacks.onComplete = function(id, name, responseJSON, xhrOrXdr) {
              let succeeded = responseJSON.success;
              if (succeeded) {
                log('uploadPhoto: ok %o', responseJSON);
                deferredPhoto.resolve(responseJSON);
              } else {
                log('uploadPhoto: failed ' + xhrOrXdr);
                deferredPhoto.reject(xhrOrXdr);
              }
            };
            uploader.setEndpoint(`${configuration.api_url}/users/${userId}/posts/${postId}` + '/post_photos');  // TODO: Wait for JSCS fix
            uploader.uploadStoredFiles();
          } else {
            log('uploadPhoto: no files');
            deferredPhoto.resolve();  // It's ok to not upload any file
          }
        } else {
          log('uploadPhoto: none');
          deferredPhoto.resolve();    // It's ok to not upload
        }
        return deferredPhoto.promise;
      }
    };
  });

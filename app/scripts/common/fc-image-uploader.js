angular.module('famicity').directive('fcImageUploader', function(
  sessionManager, configuration, $state, userInitializerManager, notification) {
  'use strict';
  const log = debug('fc-image-uploader');

  return {
    restrict: 'A',
    scope: true,
    link(scope, element) {
      log('init on %o', element[0]);
      return new qq.FineUploaderBasic({
        button: element[0],
        multiple: false,
        cors: {
          expected: true
        },
        validation: {
          acceptFiles: '.png, .jpg, .jpeg, .gif, .tiff',
          allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'tiff']
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
        request: {
          endpoint: configuration.api_url + '/users/' + scope.viewedUserId + '/avatars',
          customHeaders: {
            Authorization: 'Bearer ' + sessionManager.getToken()
          },
          params: {
            from: 'upload'
          }
        },
        callbacks: {
          onUpload() {
            log('onUpload');
            log(scope);
          },
          onProgress() {
            log('onProgress');
            log(scope);
          },
          onComplete(id, name, response) {
            log('onComplete');
            log(scope);
            userInitializerManager.updateAvatar(scope.viewedUserId, response.avatar.url_thumb);
            $state.go('u.profile-photos-crop', {user_id: scope.viewedUserId, photo_id: response.avatar.id});
          },
          onCancel() {},
          onError(id, name, errorReason, xhr) {
            log('error, id: %o, name: %o, errorReason: %o, xhr: %o', id, name, errorReason, xhr);
            if (/invalid extension/.test(errorReason)) {
              notification.add('INCORRECT_FILE_FORMAT', {warn: true});
            }
          }
        }
      });
    }
  };
});

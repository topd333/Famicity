angular.module('famicity')
  .service('postService', function(Post, permissionService, $q, $moment, yesnopopin, notification, util) {
    'use strict';
    const log = debug('postService');

    return {
      /**
       * Strip html from contenteditable
       * @param str
       * @returns {*}
       */
      htmlToText: function(str) {
        var text = str;
        if (text) {
          text = util.htmlToUTFChars(text);
          text = text.replace(/<br>/g, '\n')
            .replace(/<a href="([^ ]*)" (.*)>.*<\/a>/g, '$1');
          // Keep it after all tags removal, since it assumes lack of tags inside <p></p>
          text = util.htmlToUTFParagraphs(text);
        }
        return text;
      },
      /**
       * Replaces line feeds by <br>.
       * This is a workaround for bug-12092 (edit request returns line feeds)
       * @param str
       * @returns {*}
       */
      textToHTML: function(str) {
        let html;
        if (!str) {
          html = str;
        } else {
          html = str
            .replace(/\n/g, '<br>')
            .replace(/<p>(.*)<\/p>/, '$1\n');
        }
        return html;
      },
      warnAbout: function(post, required) {
        const deferred = $q.defer();
        const aliases = {
          // TODO: remove by unifying property names
          text: 'textValue'
        };
        const aliased = function(property) {
          const alias = aliases[property];
          return alias || property;
        };
        const isProvided = function(post, property) {
          let value = post[property];
          if (property === 'uploader') {
            const uploader = value;
            const uploadsCount = post && uploader && uploader.getUploads() ? uploader.getUploads().length : undefined;
            // var postContent = post != null ? post.textValue : undefined;
            value = uploadsCount >= 0;
          }
          return Boolean(value);
        };
        let missingField = false;
        if (required) {
          Object.keys(required).some(function(requiredProperty) {
            const aliasedProp = aliased(requiredProperty);
            const missing = !isProvided(post, aliasedProp);
            if (missing) {
              missingField = required[requiredProperty];
            }
            return missing;
          });
        }
        if (missingField) {
          notification.add(missingField);
          deferred.reject();
        } else {
          const permissions = post.permissions;
          if (permissions.allowed.length <= 0) {
            yesnopopin.open('EMPTY_PERMISSIONS_ALERT', {
              yes: 'ADD_PERMISSIONS',
              no: 'DO_NOT_ADD_PERMISSIONS'
            }).then(function() {
              deferred.reject();
            }).catch(function() {
              deferred.resolve(post);
            });
          } else {
            deferred.resolve(post);
          }
        }
        return deferred.promise;
      },
      get: (postId, userId) => Post.get({
        post_id: postId,
        user_id: userId
      }).$promise,
      /**
       * Get an editable copy of a post.
       *
       * @param objectId The post id
       * @param userId The editing user id
       * @return a promise for an editCopy which will also contain permissions.
       */
      edit: (objectId, userId) => $q((resolve) => {
        Post.edit({
          // TODO: Remove once removed on backend
          user_id: userId,
          post_id: objectId
        }).$promise.then((response) => {
          const editCopy = response.post;
          log('editPost: ok %o', editCopy);
          if (editCopy.event_date) {
            editCopy.event_date = $moment.fromServer(editCopy.event_date).toDate();
          }
          if (editCopy.uploader != null) {
            editCopy.uploader = null;
          }
          permissionService.getPermissions('post', objectId).then((permissions) => {
            editCopy.send_notifications = false;
            editCopy.permissions = permissionService.toPermissionList(permissions);
            resolve(editCopy);
          });
        });
      })
    };
  });

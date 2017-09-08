angular.module('famicity')
  .directive('fcFeedPost', function(postService) {
    'use strict';
    const log = debug('fc-feed-post');

    const authorOf = (post) => {
      return {
        id: post.author_id,
        user_name: post.author_name,
        avatar_url: post.author_avatar_url
      };
    };

    return {
      restrict: 'E',
      scope: {
        post: '=',
        /**
         * Editing user
         */
        user: '=',
        showIcon: '=?',
        showComments: '=?',
        story: '=?',
        onRemove: '&?',
        index: '='
      },
      templateUrl: '/scripts/blog/directives/fc-feed-post.html',
      controller: /*ngInject*/ function(
        $scope, $element, $state, $location, $stateParams, $modal, $q, permissionService, $document, $timeout,
        yesnopopin, Post, notification, $moment, Permission, photoService, postService) {
          $scope.post.type = 'post';
          $scope.slideshowMode = false;
          $scope.author = authorOf($scope.post);

          $scope.$watch('post', () => {
            if ($scope.post) {
              $scope.listLikesPage = $state.href('u.user-posts-likes', {
                user_id: $scope.post.author_id,
                post_id: $scope.post.id
              });
            }
          });

          if ($state.current.name !== 'u.blog.get') {
            $scope.showMoreComments = function() {
              $state.go('u.blog.get', {
                user_id: $scope.post.author_id,
                post_id: $scope.post.id,
                show_comments: true
              });
            };
          }

          /**
           * Start editing a post.
           *
           * @param objectId The id of the post
           * @param userId  The id of the editing user
           * @returns {*}
           */
          $scope.editPost = function(objectId, userId) {
            return $q((resolve) => {
              postService.edit(objectId, userId).then((editCopy) => {
                log('editPost: ok %o', editCopy);
                if (editCopy.photo_id !== null) {
                  $scope.isShowPhoto = true;
                  $scope.isUploadedPhoto = false;
                } else {
                  $scope.isShowPhoto = false;
                }
                resolve({object: editCopy});
              });
            });
          };

          /**
           * Commits a post edition.
           *
           * @param inlineData
           * @param textVal
           * @param userId
           * @param required
           * @returns {*}
           */
          $scope.updatePost = function(inlineData, textVal, userId, required) {
            const deferred = $q.defer();
            $scope.submitted = true;
            const post = {
              id: inlineData.id,
              textValue: textVal,
              title: inlineData.title,
              send_notifications: inlineData.send_notifications,
              event_date: inlineData.event_date && $moment(inlineData.event_date).forServer(),
              permissions: inlineData.permissions,
              type: 'post'
            };
            if ($scope.story && $scope.story.id) {
              post.story_id = $scope.story.id;
            }
            const postId = post.id;
            postService.warnAbout(post, required).then(function(post) {
              post.content = post.textValue;  // TODO: Unify properties
              $q.all([
                Post.update({user_id: userId, post_id: postId}, post).$promise,
                photoService.upload(inlineData.uploader, userId, postId),
                permissionService.update(post, inlineData.permissions)
              ]).then(function(results) {
                const postResponse = results[0];
                const updatedPost = postResponse.post;
                log('Post.update: ok %o', updatedPost);
                updatedPost.htmlValue = updatedPost.content_html;

                const photoResults = results[1];
                if (photoResults) {
                  updatedPost.photo_id = photoResults.photo_id;
                  updatedPost.photo_url_normal = photoResults.photo_url_normal;
                  updatedPost.photo_url_original = photoResults.photo_url_original;
                  updatedPost.photo_url_thumb = photoResults.photo_url_thumb;
                }

                // const permissionResponse = results[2];
                inlineData.permissions = angular.extend(inlineData.permissions, post.permissions);

                notification.add('fc-feed-post.EDIT_SUCCEEDED');
                deferred.resolve(updatedPost);
              }).catch(function(errors) {
                log('updatePost: failed %o', errors);
                notification.add('fc-feed-post.EDIT_FAILED', {warn: true});
                deferred.reject(errors);
              });
            }).catch(function(error) {
              deferred.reject();
            });
            return deferred.promise;
          };

          /**
           * Commits a post deletion.
           */
          $scope.deletePost = function() {
            yesnopopin.open('DELETE_POST_CONFIRMATION_POPUP.TITLE', {
              yes: 'DELETE_POST_CONFIRMATION_POPUP.SUBMIT',
              yesClass: 'btn-danger'
            }).then(function() {
              var postId = $scope.post.id;
              Post.delete({
                user_id: $scope.user.id,
                post_id: postId
              }).$promise.then(function() {
                  log('deletePost ok');
                  notification.add('fc-feed-post.DELETE_SUCCEEDED');
                  if ($scope.onRemove) {
                    $scope.onRemove({postId: postId});
                  }
                }).catch(function(error) {
                  log('deletePost failed %o', error);
                  notification.add('fc-feed-post.DELETE_FAILED');
                });
            });
          };

          $scope.cancelPostEdition = function() {
            // Nop
          };
        }
    };
  });

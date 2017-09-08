angular.module('famicity')
  .directive('fcPostAdd', function() {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        user: '=',
        me: '=?',
        story: '=?',
        onAdd: '&?',
        author: '=?',
        formStatus: '=?'
      },
      templateUrl: '/scripts/feed/fc-post-add.html',
      controller: function(
        $scope, $q, $filter, $location, $state,
        Post, Permission,
        notification, ModalManager, $moment,
        permissionService, photoService, postService) {

        var log = debug('fc-post-add');

        $scope.submitted = false;
        $scope.isShowLeftMenu = false;
        $scope.showOptions = false;
        $scope.locationType = 'blog';
        $scope.requiredFields = {
          text: 'fc-post.REQUIRED.TEXT'
        };

        var savePost = function(post) {
          var defer = $q.defer();
          var postData = {
            content: post.textValue,
            title: post.title,
            send_notifications: post.postAlert,
            event_date: post.event_date && $moment(post.event_date).forServer()
          };
          if ($scope.story && $scope.story.id) {
            postData.story_id = $scope.story.id;
          }
          new Post(postData).$save({
            user_id: $scope.user.id
          }).then(function(response) {
            log('Post save: ok');
            postData = response.post;
            postData.type = 'post';

            $q.all([
              photoService.upload(post.uploader, $scope.user.id, postData.id),
              permissionService.update(postData, post.permissions)
            ]).then(function(results) {
              var photoResults = results[0];
              if (photoResults) {
                postData.photo_url_normal = photoResults.photo_url_normal;
                postData.photo_url_original = photoResults.photo_url_original;
              }
              postData.permissions = angular.extend(postData.permissions, post.permissions);
              post.htmlValue = postData.content_html;  // Update the read-only part
              defer.resolve(postData);
            }).catch(function(errors) {
              log('savePost: photo/permissions failed ' + errors);
              notification.add('UPLOAD_FAILED_MSG', {warn: true});
            });
          }).catch(function(errors) {
            log('savePost: failed ' + errors);
            defer.reject();
          });
          return defer.promise;
        };

        $scope.createPost = function(object, required) {
          let deferred = $q.defer();
          $scope.submitted = true;
          postService.warnAbout(object, required).then(function(post) {
            savePost(post).then(function(postData) {
              $scope.onAdd({post: postData});
              deferred.resolve(postData);
              notification.add('POST_CREATED_SUCCESS_MSG');
            }).catch(error => deferred.reject(error));
          }).catch(error => deferred.reject(error));
          return deferred.promise;
        };

        $scope.cancelPostCreation = function() {
          // Nop
        };
      }
    };
  });

angular.module('famicity')
  .directive('fcCommentList', function(
    ModalManager, $document, Comment, $q,
    $stateParams, notification, sessionManager, yesnopopin) {
    'use strict';
    const log = debug('fcCommentList');

    function setTypeAsComment(comments) {
      if (comments) {
        // Set object type for each comment
        for (let i = 0; i < comments.length; i++) {
          comments[i].type = 'comment';
        }
      }
    }

    return {
      restrict: 'E',
      scope: {
        object: '=',
        user: '='
      },
      templateUrl: '/scripts/common/comments/list/fc-comment-list.html',
      link(scope) {
        function setComments(comments) {
          scope.object.comments = comments;
          setTypeAsComment(comments);
        }

        if (!scope.showMoreComments) {
          scope.showMoreComments = function() {
            Comment.query({
              user_id: scope.user.id,
              object_type: scope.object.type,
              object_id: scope.object.id
            })
              .$promise.then(function(response) {
                setComments(response.comments);
              })
              .catch(function(ex) {
                log(ex);
              });
          };
        }

        setComments(scope.object.comments);
        if (!scope.object.last_comments) {
          // Minimum to push into
          scope.object.last_comments = [];
        } else {
          setTypeAsComment(scope.object.last_comments);
        }

        // TODO: Should not work anymore, since scope is now isolated
        if (scope[scope.object.type + 'Id'] && scope.object.type !== 'user') {
          scope.object.id = scope[scope.object.type + 'Id'];
        }

        if (scope.object.type && (!scope.object.last_comments || $stateParams.show_comments === 'true')) {
          scope.showMoreComments();
        }

        // $scope.unwatch = $scope.$watch($scope.object.type, function (newVal) {
        //   if (newVal) {
        //     $scope.object = newVal;
        //     if ($scope.object.type && (!$scope.object.last_comments || $stateParams['show_comments'] === 'true')) {
        //       $scope.showMoreComments();
        //     }
        //     return $scope.unwatch();
        //   }
        // }, true);

        scope.editComment = function(commentId, userId) {
          return $q((resolve) => {
            Comment.edit({
              // TODO: Remove once removed on backend
              user_id: userId,
              comment_id: commentId
            }).$promise.then(function(editedComment) {
                resolve({
                  object: editedComment,
                  // No permissions on comments as of today
                  permissions: null
                });
              });
          });
        };

        scope.updateComment = function(editCopy, textVal, userId, required) {
          return $q((resolve) => {
            editCopy.body = textVal;
            log('edit: %o', textVal);
            editCopy.$update({
              // TODO: Remove once removed on backend
              user_id: userId
            }).then(function(post) {
              resolve(post);
              notification.add('COMMENT_EDITED_SUCCESS_MSG');
            });
          });
        };

        scope.deleteComment = function(commentId) {
          function removeFromCommentsList(commentId) {
            const commentList = scope.object.comments ? scope.object.comments : scope.object.last_comments;
            commentList.forEach(function(comment, index) {
              if (comment.id === commentId) {
                delete commentList[index];
                commentList.splice(index, 1);
              }
            });
          }

          yesnopopin.open('COMMENTS.DELETE_CONFIRM.TITLE', {
            yes: 'COMMENTS.DELETE_CONFIRM.SUBMIT',
            yesClass: 'btn-danger'
          }).then(() => {
            new Comment({id: commentId}).$delete({
              user_id: scope.user.id
            }).then(function() {
              const promises = [];
              notification.add('COMMENT_DELETED_SUCCESS_MSG');
              scope.object.comments_count--;
              if (scope.object.comments_count < 0) {
                scope.object.comments_count = 0;
              }
              removeFromCommentsList(commentId);
              return promises;
            });
          });
        };

        scope.addComment = function(commentText) {
          const promises = [];
          const comment = new Comment({
            object_type: scope.object.type,
            object_id: scope.object.id,
            comment: {
              body: commentText
            }
          });
          const commentPromise = comment.$save({
            user_id: scope.user.id
          });
          promises.push(commentPromise);
          commentPromise.then(function(response) {
            notification.add('COMMENT_ADDED_SUCCESS_MSG');
            const createdComment = response.comment;
            createdComment.type = 'comment';
            scope.object.comments_count++;
            if (scope.object.comments) {
              scope.object.comments.push(createdComment);
            } else {
              scope.object.last_comments.push(createdComment);
            }
          });
          return promises;
        };
      }
    };
  });

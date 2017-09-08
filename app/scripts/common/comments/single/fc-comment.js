angular.module('famicity')
  .directive('fcComment', function(Comment, notification, yesnopopin, $timeout, $state) {
    'use strict';

    function unescape(html) {
      if (html) {
        html = html
          //.replace(/&gt;/g, '>')
          //.replace(/&lt;/g, '<')
          //.replace(/&nbsp;/g, ' ')
          .trim();
      }
      return html;
    }

    return {
      restrict: 'EA',
      scope: {
        /**
         * The editing user
         */
        user: '=',
        listPage: '=',
        onDelete: '&?',
        onEdit: '&?',
        onUpdate: '&?',
        onCreate: '&?',
        editLabel: '@?',
        /**
         * The edited object (a post, a comment), if any (i.e. not one to create)
         */
        object: '='
      },
      replace: true,
      templateUrl: '/scripts/common/comments/single/fc-comment.html',
      link(scope, elem) {
        var log = debug('fc-comment');

        scope.formHolder = {};
        scope.submitted = false;
        scope.formInProgress = false;
        scope.isEditing = false;
        scope.isCreating = Boolean(elem.attr('data-on-create')) || Boolean(elem.attr('on-create'));
        scope.isValid = true;

        var textField = function() {
          return elem.find('.editor');
        };

        function textValue() {
          return unescape(textField().val());
        }

        if (!scope.isCreating) {
          scope.formHolder.htmlValue = unescape(scope.object.body_html);
          scope.formHolder.textValue = unescape(scope.object.body);
        }

        scope.submit = function() {
          scope.submitted = true;
          var textVal = unescape(textValue());
          if (scope.isCreating) {
            scope.onCreate({text: textVal, required: {text: true}});
            log('create: %o', textVal);
            scope.cancel();
          } else {
            scope.onUpdate({editCopy: scope.editCopy, textVal: textVal, userId: scope.user.id}).then(function(post) {
              scope.formHolder.htmlValue = post.body_html;
              scope.formHolder.textValue = post.body;
              endEdition();
            });
          }
        };

        function readyToEdit() {
          scope.isEditing = true;
          $timeout(function() {
            textField().focus();
          }, 100);
        }

        scope.edit = function() {
          if (scope.isCreating) {
            $timeout(function() {
              readyToEdit();
            });
          } else {
            scope.onEdit({commentId: scope.object.id, userId: scope.user.id}).then(function(response) {
              scope.editCopy = response.object;
              log('onEdit: ok %o', scope.editCopy.body);
              scope.formHolder.textValue = scope.editCopy.body;
              scope.formHolder.htmlValue = scope.editCopy.body_html;
              readyToEdit();
            });
          }
        };

        function endEdition() {
          scope.isEditing = false;
          // Force to loose text editor focus
          elem.find('button').focus();
          textField().trigger('autosize.resize');
        }

        scope.cancel = function() {
          if (scope.isCreating) {
            scope.formHolder.textValue = null;
            textField().val('');
          } else {
            scope.formHolder.textValue = scope.editCopy.body;
            scope.formHolder.htmlValue = scope.editCopy.body_html;
          }
          endEdition();
        };

        scope.likesUrl = function(comment) {
          return $state.href('comment-likes', {
            user_id: comment.author_id,
            comment_id: comment.id
          });
        };
      }
    };
  });

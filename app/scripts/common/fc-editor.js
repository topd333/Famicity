angular.module('famicity')
  .directive('fcEditor', function($timeout) {
    'use strict';
    const log = debug('fc-editor');
    return {
      restrict: 'E',
      scope: {
        submit: '&',
        cancel: '&',
        check: '=',
        required: '=?',
        isEditing: '=?',
        model: '=',
        rows: '=?',
        id: '@?'
      },
      templateUrl: '/scripts/common/fc-editor.html',
      link(scope, element) {
        let firstEdit = true;
        scope.singleLine = element.hasClass('single-line');
        scope.rows = scope.rows || 1;

        const textField = element.find('.editor');

        function moveCaretToEnd() {
          const val = textField.val();
          textField.val('').val(val);
        }

        scope.onFocus = function() {
          log('onFocus()');
          $timeout(function() {
            if (scope.model.textValue) {
              textField.trigger('autosize.resizeIncludeStyle');
            }
          });
        };

        scope.$watch('model', function() {
          if (scope.isEditing && scope.model.textValue) {
            log('model changed');
            // Once the text is inserted inside the textfield, we may need to increase height or display scroll bars.
            textField.trigger('autosize.resizeIncludeStyle');
          }
        });

        const callback = scope.$watch('isEditing', function(newValue) {
          if (newValue && newValue === true) {
            if (scope.model.textValue) {
              textField.trigger('autosize.resize');
            }

            textField.on('keyup', function(keyEvent) {
              switch (keyEvent.keyCode) {
                // Left arrow
                case 37:
                // Up arrow
                case 38:
                // Right arrow
                case 39:
                // Down arrow
                case 40:
                  keyEvent.stopPropagation();
                  break;
                default:
              }
            });
            textField.on('keydown', function(keyEvent) {
              if (keyEvent.ctrlKey || keyEvent.shiftKey) {
                if (keyEvent.keyCode === 13) {
                  keyEvent.preventDefault();
                  scope.submit();
                }
              } else {
                switch (keyEvent.keyCode) {
                  case 13:
                    if (scope.singleLine) {
                      keyEvent.preventDefault();
                    }
                    break;
                  case 27:
                    scope.cancel();
                    break;
                  // Left arrow
                  case 37:
                  // Up arrow
                  case 38:
                  // Right arrow
                  case 39:
                  // Down arrow
                  case 40:
                    keyEvent.stopPropagation();
                    break;
                  default:
                }
              }
            });

            textField[0].onfocus = function() {
              $timeout(function() {
                scope.isEditing = true;
                if (firstEdit) {
                  moveCaretToEnd();
                  firstEdit = false;
                }
              });
            };
          } else {
            textField.off('blur keyup change keydown');
          }
        });

        scope.$on('$destroy', callback);
      }
    };
  });

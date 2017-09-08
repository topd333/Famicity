angular.module('famicity')
  .directive('fcInline', function(
    $q, $document, Comment, sessionManager, notification, $timeout) {
    'use strict';

    const log = debug('fc-inline');

    function unescape(html) {
      if (html) {
        html = html
          // .replace(/&gt;/g, '>')
          // .replace(/&lt;/g, '<')
          // .replace(/&nbsp;/g, ' ')
          .trim();
      }
      return html;
    }

    return {
      restrict: 'EA',
      scope: {
        /**
         * The edited object (a post, a comment), if any (i.e. not one to create)
         */
        object: '=?',
        editCopy: '=?',
        /**
         * The editing user
         */
        user: '=',
        me: '=?',
        /**
         * The message keys for fields' labels
         */
        labels: '=',
        listLikesPage: '=',
        /**
         * The object author, if different than the user
         */
        required: '=?',
        author: '=?',
        onDelete: '&?',
        onEdit: '&?',
        onUpdate: '&?',
        onCreate: '&?',
        onCancel: '&?',
        editLabel: '@?',
        showOptions: '=?',
        options: '=?',
        formStatus: '=?',
        /**
         * Field to focus first by default
         */
        focus: '@?',
        /**
         * The associated story, if any.
         */
        story: '=?',
        locale: '@?',
        noLazy: '=?'
      },
      replace: true,
      templateUrl: '/scripts/common/inline/fc-inline.html',
      link(scope, elem) {
        scope.showOptions = scope.showOptions || false;
        // TODO: do not use sessionManager
        if (scope.me) {
          scope.locale = scope.locale || scope.me.settings.locale;
        } else {
          scope.locale = scope.locale || scope.user.settings.locale;
        }

        function hasCallback(attrName) {
          return Boolean(elem.attr('data-' + attrName)) || Boolean(elem.attr(attrName));
        }

        const defaultFormStatus = {
          isEditing: false,
          isCreating: hasCallback('on-create'),
          isCancellable: hasCallback('on-cancel'),
          isValid: true,
          isUploadedPhoto: false,
          show: {
            formTypes: true,
            photo: true,
            permissions: true
          },
          validity: {}
        };
        const formStatus = {};
        angular.extend(formStatus, defaultFormStatus);
        if (scope.formStatus && scope.formStatus.show) {
          scope.formStatus.show = angular.extend(formStatus.show, scope.formStatus.show);
        }
        scope.formStatus = angular.extend(formStatus, scope.formStatus);

        // var titleValidity = true;
        // var textValidity;
        scope.checkValidity = function(element, text) {
          // $timeout(function() {
          //  if (element.hasClass('inline-title')) {
          //    titleValidity = text === undefined || text == null || text.length <= 1000;
          //    if (!titleValidity) {
          //      scope.validateInfo = $translate.instant('fc-inline.SUBMIT.TITLE_INVALID');
          //    }
          //  } else if (element.hasClass('inline-text')) {
          //    textValidity = !!text && text.length >= 2 && text.length <= 4000;
          //    if (!textValidity) {
          //      scope.validateInfo = $translate.instant('fc-inline.SUBMIT.CONTENT_INVALID');
          //    }
          //  }
          //  scope.formStatus.isValid = titleValidity && textValidity;
          //  if (scope.formStatus.isValid) {
          //    scope.validateInfo = '';
          //  }
          // });
          log('checkValidity(%o, %o)=%o', element.length, text, scope.formStatus.isValid);
          return scope.formStatus.isValid;
        };

        scope.uploadButton = elem.find('.upload-button')[0];

        // Either the (uneditable) post is from someone else, or from yourself (editable/creating or not)
        scope.author = scope.author || scope.user;

        // Editing existing object?
        if (scope.object) {
          angular.extend(scope.object, {
            // TODO: Unify properties (direcly on back end?)
            htmlValue: scope.object.body_html || scope.object.content_html,
            // TODO: Unify properties (direcly on back end?)
            textValue: scope.object.body || scope.object.content
          });
          // Add new object
        } else {
          scope.object = {
            postAlert: true,
            textValue: '',
            htmlValue: '',
            event_date: null
          };
        }

        scope.object.postAlert = true;
        scope.object.isPickingDate = false;
        scope.pickADate = function() {
          $timeout(function() {
            scope.object.isPickingDate = true;
          });
        };

        scope.thumbnailElement = elem.find('.upload-picture')[0];

        scope.submitted = false;
        scope.formInProgress = false;

        function checkFormValidity() {
          scope.formStatus.isValid = true;
          // scope.checkValidity(elem.find('.inline-title'), scope.object.title);
          // scope.checkValidity(elem.find('.inline-text'), scope.object.textValue);
          if (scope.formStatus.validity && scope.formStatus.validity.date === false) {
            notification.add('fc-date-input.DATE_INVALID');
            scope.formStatus.isValid = false;
          }
        }

        function editNop() {
          const deffered = $q.defer();
          deffered.resolve(scope.object);
          return deffered.promise;
        }

        if (!hasCallback('on-edit')) {
          scope.onEdit = editNop;
        }

        const textField = function() {
          return elem.find('.inline-text .editor');
        };

        function textValue() {
          return unescape(textField().val());
        }

        const currentUser = sessionManager.getUser();
        scope.isMe = currentUser ? currentUser.userId === parseInt(scope.author.id, 10) : false;

        function validate(textVal) {
          scope.object.title = unescape(scope.object.title);
          scope.object.textValue = unescape(textVal);
        }

        scope.submit = function() {
          const promises = [];
          const defer = $q.defer();
          promises.push(defer.promise);

          scope.submitted = true;
          const textVal = textValue();
          validate(textVal);
          checkFormValidity();
          if (scope.formStatus.isValid) {
            if (scope.formStatus.isCreating) {
              scope.onCreate({object: scope.object}).then(function(createdPost) {
                // Update the read-only part
                if (createdPost) {
                  scope.object.htmlValue = createdPost.content_html;
                }
                reset();
                defer.resolve();
                endEdition();
              }).catch(function(error) {
                log('Could not create post: %o', error);
                defer.reject(error);
              });
            } else {
              angular.extend(scope.editCopy, scope.object);
              scope.editCopy.textValue = textVal;
              scope.onUpdate({
                editCopy: scope.editCopy,
                userId: scope.user.id,
                textVal
              }).then(function(updatedPost) {
                // Update the read-only part
                scope.object.htmlValue = scope.object.content_html = updatedPost.content_html;
                // Update the read-only part
                scope.object.photo_url_normal = updatedPost.photo_url_normal;
                defer.resolve();
                endEdition();
              }).catch(function(error) {
                log('Could not update post: %o', error);
                defer.reject(error);
              });
            }
          } else {
            defer.reject();
          }
          return promises;
        };

        let firstEdit = true;

        function readyToEdit() {
          // Ready to edit now. fc-editor will take focus by watching this property change.
          scope.formStatus.isEditing = true;
          scope.formStatus.isShowPhoto = scope.formStatus.isShowPhoto || Boolean(scope.object.photo_id);
          if (firstEdit) {
            $timeout(function() {
              firstEdit = false;
              let fieldToFocus;
              if (scope.focus) {
                fieldToFocus = elem.find('#' + scope.$id + '-' + scope.focus);
              } else {
                fieldToFocus = textField();
              }
              fieldToFocus.focus();
            }, 100);
          }
        }

        scope.edit = function() {
          if (scope.isMe) {
            if (scope.formStatus.isCreating) {
              $timeout(function() {
                readyToEdit();
              });
            } else {
              scope.onEdit({objectId: scope.object.id, userId: scope.user.id}).then(function(response) {
                angular.extend(scope.object, response.object);
                scope.object.textValue = scope.object.content;
                scope.object.htmlValue = scope.object.content_html;
                scope.editCopy = angular.extend({}, scope.object);
                // Show all fields when editing existing object
                scope.formStatus.showOptions = true;
                readyToEdit();
              });
            }
          }
        };

        const autoEdit = scope.formStatus.isEditing;
        if (autoEdit) {
          scope.edit();
        }

        function resetUpload() {
          log('resetUpload');
          if (scope.object.uploader) {
            scope.object.uploader.reset();
          }
          scope.formStatus.isShowPhoto = false;
          scope.formStatus.isUploadedPhoto = false;
        }

        function endEdition() {
          $timeout(function() {
            scope.formStatus.isEditing = false;
            resetUpload();
            const theTextField = textField();
            theTextField.css('height', '1em');
            theTextField.css('overflow', 'auto');
            // Force to loose text editor focus
            elem.find('button').focus();
          });
        }

        scope.setPostType = function(postType) {
          scope.postType = postType;
          if (!scope.formStatus.isEditing) {
            scope.edit();
          }
        };

        function reset() {
          log('reset');
          scope.object.title = null;
          scope.object.textValue = null;
          scope.object.htmlValue = null;
          scope.object.event_date = null;
          scope.object.permissions = null;
          scope.formStatus.isShowPhoto = false;
          textField().empty();
        }

        scope.cancel = function() {
          if (scope.formStatus.isCreating) {
            reset();
          } else {
            scope.object = scope.editCopy;
          }
          endEdition();
          scope.onCancel();
        };

        const photoCloseListener = function(e) {
          // ESCape key
          if (e.originalEvent.keyCode === 27) {
            $timeout(function() {
              return scope.closeSlideshowMode();
            });
          }
        };

        scope.closeSlideshowMode = function() {
          scope.slideshowMode = false;
          $document.off('keyup', 'body', photoCloseListener);
        };

        scope.formStatus.showOptions = !scope.showOptions ? false : scope.showOptions;
        scope.options = scope.options || {
            title: true,
            date: true,
            location: false
          };
        scope.setOptions = function(showThem) {
          scope.formStatus.showOptions = showThem;
          if (scope.formStatus.showOptions) {
            angular.extend(scope.formStatus.show, scope.options);
            scope.formStatus.toggleOptionsLabel = 'HIDE_OPTIONS';
          } else {
            angular.extend(scope.formStatus.show, {
              title: false,
              date: false,
              location: false
            });
            scope.formStatus.toggleOptionsLabel = 'DISPLAY_OPTIONS';
          }
        };
        scope.setOptions(scope.formStatus.showOptions);

        scope.openFullScreenImage = function() {
          $document.on('keyup', 'body', photoCloseListener);
          const photoURL = scope.object.photo_url_original;
          const royalSlider = elem.find('.royalSlider');
          if (photoURL) {
            scope.slideshowMode = true;
            royalSlider.royalSlider('destroy').empty().royalSlider({
              fullscreen: {
                enabled: true,
                nativeFS: false
              },
              controlNavigation: 'none',
              autoScaleSlider: true,
              loop: true,
              globalCaption: true,
              fadeinLoadedSlide: true,
              autoScaleSliderWidth: '100%',
              autoScaleSliderHeight: '100%',
              sliderDrag: false,
              sliderTouch: false,
              slides: ['<a class="rsImg" href="' + photoURL + '"></a>'],
              navigateByClick: false,
              usePreloader: true
            });
            $timeout(function() {
              return royalSlider.royalSlider('updateSliderSize', true);
            });
          }
        };
      }
    };
  });

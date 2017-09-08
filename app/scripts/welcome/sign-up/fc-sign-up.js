angular.module('famicity')
  .directive('fcSignUp', function(
    $stateParams, userService, notification, userManager, util,
    $translate, $rootScope, $timeout, navigation, $q, HttpBuffer) {
    'use strict';
    const log = debug('fc-sign-up');

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        isLandingPage: '@?',
        inviterFirstName: '=?',
        btnText: '@',
        introText: '@?',
        introText2: '@?',
        showSpamMsg: '=?',
        locale: '@',
        showcase: '=?',
        appIcons: '=?',
        showLogo: '=?',
        pageScrolling: '=?'
      },
      templateUrl: '/scripts/welcome/sign-up/fc-sign-up.html',
      compile: function compile() {
        return {
          // We use pre link function because we want to set input parameters for child directives (i.e. avoid deep-first)
          pre: function preLink(scope, elem) {
            scope.signUp = {};
            log('locale=%o', scope.locale);
            scope.canUploadFile = !isMobile.phone && !isMobile.apple.tablet;
            if (scope.appIcons !== false) {
              scope.showAppIcons = true;
            }
            if (scope.pageScrolling !== false) {
              scope.pageScrolling = true;
            }
            if (scope.showLogo !== false) {
              scope.showLogo = true;
            }
            if (!scope.isLandingPage) {
              scope.isLandingPage = false;
            }
            if (!scope.btnText) {
              // Keep it here or you won't have its dynamic part in conditions
              scope.btnText = 'START_STORY';
            }
            function updateButton() {
              elem.find('#form-button').html(scope.btnText);
            }

            $rootScope.$on('$translateChangeSuccess', function() {
              if (!scope.btnText) {
                // Keep it here or you won't have its dynamic part in conditions
                scope.btnText = 'START_STORY';
              }
              if (scope.btnText.indexOf('_') >= 0) {
                $timeout(function() {
                  scope.btnText = $translate.instant(scope.btnText);
                  updateButton();
                });
              }
            });
            if (scope.btnText.indexOf('_') >= 0) {
              $translate(scope.btnText).then(function(translatedValue) {
                $timeout(function() {
                  scope.btnText = translatedValue;
                  updateButton();
                });
              });
            }
            if (!scope.introText) {
              scope.introText = null;
            }
            if (!scope.showSpamMsg) {
              scope.showSpamMsg = false;
            }
            scope.formInProgress = false;
            scope.passwordTooltip = 'PASSWORD_TOOLTIP';
            if ($stateParams.email) {
              scope.signUp.sessionUsername = $stateParams.email || '';
            }
            if ($stateParams.password) {
              scope.signUp.sessionPass = $stateParams.password;
            }
            if (scope.signUp.sessionUsername != null && scope.signUp.sessionUsername !== '') {
              angular.element('#login-password').focus();
            } else {
              angular.element('#login-email').focus();
            }
            scope.submitted = false;
            scope.submit = function(showGedcomStep) {
              const promises = [];
              userManager.setWizardGedcomStep(showGedcomStep);
              scope.submitted = true;
              if (scope.loginForm.$valid && util.validateEmail(scope.signUp.sessionUsername)) {
                const registerUser = userService.register({
                  email: scope.signUp.sessionUsername,
                  password: scope.signUp.sessionPass
                }, $stateParams.token_id, scope);
                registerUser.then(function(responseType) {
                  switch (responseType) {
                    case 'sign_up':
                      navigation.go('wizard-profile');
                      notification.add('REGISTER_SUCCESS_MSG');
                      break;
                    case 'sign_in':
                      if (HttpBuffer.getLocationCount() === 0 || HttpBuffer.getBufferLocation() === '/sign-in') {
                        navigation.go('u.home');
                      } else {
                        HttpBuffer.retryLocation();
                      }
                      break;
                    default:
                      Bugsnag.notify('Sign up error', 'Unexpected registration type', responseType);
                  }
                });
                promises.push(registerUser);
              } else {
                notification.add('INVALID_EMAIL', {warn: true});
                promises.push($q.reject());
              }
              return promises;
            };
            scope.checkCaps = function(e) {
              const s = String.fromCharCode(e.which);
              const capsOn = s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey;
              scope.passwordTooltip = capsOn ? 'CAPSLOCK_WARNING' : 'PASSWORD_TOOLTIP';
            };
            // scope.signUp = function () {
            //  scope.signUpForm = true;
            // };
          }
        };
      }
    };
  });

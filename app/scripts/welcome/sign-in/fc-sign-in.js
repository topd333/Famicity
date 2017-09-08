angular.module('famicity')
.directive('fcSignIn', function(
$stateParams, userService, notification, userManager, util,
Session, $q, HttpBuffer, sessionManager, $location, navigation, $document) {
  'use strict';
  const log = debug('fc-sign-in');

  return {
    restrict: 'EA',
    replace: true,
    scope: {
      isLandingPage: '@?',
      inviterFirstName: '=?',
      btnText: '=?',
      introText: '=?',
      showSpamMsg: '=?',
      locale: '@'
    },
    templateUrl: '/scripts/welcome/sign-in/fc-sign-in.html',
    link($scope) {
      $scope.signIn = {};
      log('locale=%o', $scope.locale);
      $scope.signIn.remember_me = false;
      if (!$scope.isLandingPage) {
        $scope.isLandingPage = false;
      }
      if (!$scope.introText) {
        $scope.introText = null;
      }
      if (!$scope.showSpamMsg) {
        $scope.showSpamMsg = false;
      }
      $scope.formInProgress = false;
      $scope.passwordTooltip = 'PASSWORD_TOOLTIP';
      if ($stateParams.email) {
        $scope.signIn.sessionUsername = $stateParams.email;
      } else {
        $scope.signIn.sessionUsername = sessionManager.getEmail() || '';
      }
      if ($stateParams.password) {
        $scope.signIn.sessionPass = $stateParams.password;
      }
      const toFocus = $scope.signIn.sessionUsername != null && $scope.signIn.sessionUsername !== '' ? '#login-password' : '#login-email';
      angular.element(toFocus).focus();
      $scope.submitted = false;

      $scope.createSession = function() {
        const promises = [];
        $scope.submitted = true;
        const redirect = $stateParams.redirect;
        if ($scope.loginForm.$valid && util.validateEmail($scope.signIn.sessionUsername)) {
          const loginPromise = Session.login({
            email: $scope.signIn.sessionUsername,
            password: $scope.signIn.sessionPass,
            remember_me: $scope.signIn.remember_me
          }, $scope.locale).then(function() {
            if (redirect != null) {
              $location.url(redirect);
            } else if (HttpBuffer.getLocationCount() === 0 || HttpBuffer.getBufferLocation() === '/sign-in') {
              navigation.go('u.home');
            } else {
              HttpBuffer.retryLocation();
            }
          });
          promises.push(loginPromise);
          loginPromise.then(function() {
            delete $scope.signIn.sessionUsername;
          }).finally(function() {
            delete $scope.signIn.sessionPass;
          }).catch(function() {
            $document[0].getElementById('login-password').focus();
          });
        } else {
          notification.add('INVALID_EMAIL', {warn: true});
          promises.push($q.reject());
        }
        return promises;
      };

      $scope.checkCaps = function(e) {
        const s = String.fromCharCode(e.which);
        const capsOn = s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey;
        $scope.passwordTooltip = capsOn ? 'CAPSLOCK_WARNING' : 'PASSWORD_TOOLTIP';
      };

      // $scope.signUp = function () {
      //  $scope.signUpForm = true;
      // };
    }
  };
});

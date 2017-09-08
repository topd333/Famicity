angular.module('famicity')
  .directive('fcHello', function(
    $window, $http, $hello, $state, $stateParams, $timeout, auth, sessionManager, pubsub, notification) {
    'use strict';
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: '/scripts/common/util/auth/fc-hello.html',
      link($scope) {

        var setUserData = function(userData, signUp) {
          var user;
          if (signUp) {
            user = {
              userId: userData.user_id,
              accessToken: userData.access_token,
              globalState: userData.user.global_state,
              settingsId: userData.user.setting.id
            };
          } else {
            user = {
              userId: userData.user_id,
              accessToken: userData.access_token,
              globalState: userData.global_state,
              settingsId: userData.settings_id
            };
          }
          $http.defaults.headers.common.Authorization = 'Bearer ' + userData.access_token;
          sessionManager.setUserId(user.userId);
          sessionManager.setToken(user.accessToken);
          sessionManager.setUser(user);
          sessionManager.setSettingsId(userData.settings_id);
          return user;
        };

        $scope.login = function(provider) {
          var me = null;
          $hello.loginAndMe(provider).then(function(response) {
            var referral, session;
            session = $hello.getLoginInfo(response.login);
            me = $hello.getUserInfo(response.me, provider);
            session.uid = me.uid;
            delete me.shown_account_url;
            delete me.uid;
            referral = sessionManager.getReferral();
            auth.externalAuth(session).then(function(authResponse) {
              var user;
              if (referral) {
                sessionManager.remove('referral');
              }
              user = setUserData(authResponse.data);
              $state.go('u.home');
              notification.add('CONNEXION_SUCCESS_MSG');
            }).catch(function(error) {
              var invitation;
              auth.log('error: %o', error);
              if (error.status === 406) {
                auth.log('register');
                invitation = $stateParams.token_id;
                auth.externalSignUp(session, me, referral, invitation).then(function(authResponse) {
                  var user;
                  user = setUserData(authResponse.data, true);
                  $state.go('wizard-sign-up');
                  $window.google_trackConversion({
                    google_conversion_id: 1034498349,
                    google_conversion_language: 'en',
                    google_conversion_format: '3',
                    google_conversion_color: 'ffffff',
                    google_conversion_label: 'DQuPCKfJgFgQreKk7QM',
                    google_remarketing_only: false
                  });
                });
              }
            });
          }).catch(function() {
            hello.logout(provider);
            notification.add('FACEBOOK_CONNECT_FAILED', {warn: true});
          });
        };
      }
    };
  });

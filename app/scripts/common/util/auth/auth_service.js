angular.module('famicity').factory('auth', function($http, configuration) {
  'use strict';
  var externalAuth, externalSignUp, signIn, signOut, log;
  log = debug('fc-auth');
  externalAuth = function(session) {
    return $http.post(configuration.oauth_url + '/auth/sign_in_external', {
      session: session
    });
  };
  externalSignUp = function(session, user, referral, invitation) {
    return $http.post(configuration.oauth_url + '/sign_up_external', {
      session: session,
      user: user,
      referral: referral,
      invitation: invitation
    });
  };
  signIn = function(params) {
    return $http.post(configuration.oauth_url + '/auth/sign_in', params);
  };
  signOut = function() {
    return $http.delete(configuration.api_url + '/auth/sign_out');
  };
  return {
    log: log,
    signIn: signIn,
    signOut: signOut,
    externalAuth: externalAuth,
    externalSignUp: externalSignUp
  };
});

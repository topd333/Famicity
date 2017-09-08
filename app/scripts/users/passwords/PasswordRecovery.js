angular.module('famicity').factory('PasswordRecovery', function($resource, configuration) {
  'use strict';
  var PasswordRecovery;
  PasswordRecovery = $resource(configuration.api_url + '/password_recoveries', null, {
    password_recovery: {
      method: 'POST'
    },
    get_reset: {
      method: 'GET',
      url: configuration.api_url + '/reset_password/:user_id/:token'
    },
    put_reset: {
      method: 'PUT',
      params: {
        user_id: '@user_id',
        token: '@token'
      },
      url: configuration.api_url + '/reset_password/:user_id/:token'
    }
  });
  return PasswordRecovery;
});

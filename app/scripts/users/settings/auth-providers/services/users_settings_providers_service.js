angular.module('famicity').factory('providersService', function($q, $hello, Provider) {
  'use strict';
  var disable, enable, log;
  log = debug('spam-providers');
  disable = function(provider) {
    var defer, providerName;
    providerName = provider.name;
    defer = $q.defer();
    provider.$remove().then(function(provider) {
      provider.name = providerName;
      $hello.revokePermissions(provider.name).then(function() {
        defer.resolve(provider);
      }).catch(function(error) {
        log('error on unlink: %o', error);
        defer.reject(error);
      });
    }).catch(function(error) {
      defer.reject(error);
    });
    return defer.promise;
  };
  enable = function(provider) {
    var defer;
    defer = $q.defer();
    $hello.loginAndMe(provider.name).then(function(response) {
      var me, providerInfo;
      providerInfo = $hello.getLoginInfo(response.login);
      providerInfo.oauth_token = providerInfo.token;
      delete providerInfo.token;
      me = $hello.getUserInfo(response.me, provider.name);
      providerInfo.uid = me.uid;
      providerInfo.account_url = me.account_url;
      provider = new Provider(providerInfo);
      provider.$save().then(function() {
        provider.shown_account_url = me.shown_account_url;
        defer.resolve(provider);
      }).catch(function(error) {
        return defer.reject(error);
      });
    }).catch(function(error) {
      defer.reject(error);
    });
    return defer.promise;
  };
  return {
    enable: enable,
    disable: disable
  };
});

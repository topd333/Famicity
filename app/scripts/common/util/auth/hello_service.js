angular.module('famicity').factory('$hello', function(configuration, $moment, $q) {
  'use strict';
  const capitaliseFirstLetter = function(string) {
    if (!string) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  // From modernizr
  const localStorageEnabled = function() {
    const mod = 'modernizr';
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  };
  hello.log = debug('fc-hello');
  if (localStorageEnabled()) {
    hello.init({
      facebook: configuration.oauthClients.facebook
    }, {
      scope: 'email'
    });
    hello.on('auth.logout', function() {
      hello.log('logout');
    });
  } else {
    log('localstorage not available, hello is not enabled');
  }
  hello.beautifyUrl = function(url) {
    return url.replace(/http(?:s)?:\/\/(?:www)?\./, '').replace(/\/$/, '');
  };
  hello.loginIfNeeded = function(provider) {
    const defer = $q.defer();
    let session = hello.session(provider);
    if (session) {
      hello.log('already in: %o', session);
      session.authResponse = session;
      defer.resolve(session);
    } else {
      hello(provider).login().then(function(loginResponse) {
        return defer.resolve(loginResponse);
      }).then(null, function(error) {
        return defer.reject(error);
      });
    }
    return defer.promise;
  };
  hello.loginAndMe = function(provider) {
    const defer = $q.defer();
    let response = {};
    hello.loginIfNeeded(provider).then(function(loginResponse) {
      hello.log('login: %o', loginResponse);
      response.login = loginResponse;
      hello(provider).api('me').then(function(meResponse) {
        hello.log('me: %o', meResponse);
        response.me = meResponse;
        defer.resolve(response);
      }).then(null, function(error) {
        hello.log('me error: %o', error);
        defer.reject(error);
      });
    }).then(null, function(error) {
      hello.log('login error: %o', error);
      defer.reject(error);
    });
    return defer.promise;
  };
  hello.revokePermissions = function(provider) {
    const defer = $q.defer();
    hello(provider).api('me/permissions', 'delete').then(function(response) {
      if (response.success) {
        hello.log('successful unlink');
        hello.logout(provider).then(function() {
          return defer.resolve(response);
        }).then(null, function(error) {
          return hello.log('error on logout: %o', error);
        });
      } else {
        hello.log('unsuccessful unlink: %o', response);
        defer.reject(response);
      }
    }).then(null, function(error) {
      hello.log('unlink error: %o', error);
      defer.reject(error);
    });
    return defer.promise;
  };
  hello.session = function(provider) {
    let currentTime;
    let session = hello(provider).getAuthResponse();
    currentTime = $moment().unix();
    if (session && session.access_token && session.expires > currentTime) {
      return session;
    }
    return null;
  };
  hello.getLoginInfo = function(response) {
    switch (response.network) {
      default:
      case 'facebook':
        return {
          provider: response.network,
          token: response.authResponse.access_token,
          expiration_date: response.authResponse.expires
        };
    }
  };
  hello.getUserInfo = function(user, provider) {
    switch (provider) {
      default:
      case 'facebook':
        return {
          uid: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          sex: capitaliseFirstLetter(user.gender),
          account_url: user.link,
          shown_account_url: hello.beautifyUrl(user.link)
        };
    }
  };
  return hello;
});

angular.module('famicity')
  .controller('SettingsAuthProvidersController', function(
    $scope, $hello, $timeout, $q, $translate, $state, me, Provider, providersService) {
    'use strict';
    const log = debug('spam-providers');

    var providers;
    $scope.language = $translate.use();
    $scope.userId = me.id;
    $scope.settingsId = me.settings.id;
    $scope.providers = [];
    providers = Provider.query(function() {
      var provider, tProvider, _i, _len, _ref;
      log('providers: %o', $scope.providers);
      _ref = ['facebook'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        if ([].indexOf.call(getProviderNames(providers), provider) >= 0) {
          tProvider = filterProvidersByName(providers, provider)[0];
          tProvider.shown_account_url = $hello.beautifyUrl(tProvider.account_url);
          tProvider.enabled = true;
        } else {
          tProvider = new Provider({
            name: provider,
            enabled: false
          });
        }
        $scope.providers.push(tProvider);
      }
    });

    function getProviderNames(providers) {
      return providers.map(function(p) {
        return p.name;
      });
    }

    function filterProvidersByName(providers, name) {
      return providers.filter(function(p) {
        return p.name === name;
      });
    }

    $scope.toggle = function() {
      this.provider.enabled = !this.provider.enabled;
      if ($scope.loading) {
        return;
      }
      log('toggle: %o', this.provider.name);
      $scope.loading = true;
      if (this.provider.enabled === true) {
        providersService.disable(this.provider).then((function(_this) {
          return function(provider) {
            log('disabled: %o', provider);
            if (provider.new_password_required) {
              $state.go('u.reset_password', {
                token: provider.password_token,
                email: provider.email
              });
            }
            _this.provider = provider;
            _this.provider.enabled = false;
          };
        })(this)).catch((function(_this) {
          return function(error) {
            log('disable error: %o', error);
            _this.provider.enabled = true;
          };
        })(this)).finally(function() {
          $scope.loading = false;
        });
      } else {
        providersService.enable(this.provider).then((function(_this) {
          return function(provider) {
            _this.provider = provider;
            _this.provider.enabled = true;
          };
        })(this)).catch((function(_this) {
          return function(error) {
            log('enable error: %o', error);
            _this.provider.enabled = false;
          };
        })(this)).finally(function() {
          $scope.loading = false;
        });
        return;
      }
    };
  });

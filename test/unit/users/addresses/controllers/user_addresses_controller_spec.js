describe('UserAddressesController', function() {
  'use strict';

  // load module
  beforeEach(module('famicity', function($provide) {
    // Fake locale setting to avoid locale script loading failure
    $provide.provider('tmhDynamicLocale', function() {
      this.$get = function() {
        return {
          set: function(locale) {
            //console.log('Locale set to ' + locale);
          }
        };
      };
    });
  }));

  var scope;
  var ctrl;

  var modalInstance = {                    // Create a mock object using spies
    close: jasmine.createSpy('modalInstance.close'),
    dismiss: jasmine.createSpy('modalInstance.dismiss'),
    result: {
      then: jasmine.createSpy('modalInstance.result.then')
    }
  };

  var addressFormMode =
        function() {
          return "edit";
        };

  var id = "12";
  var addressId = function() {
    return id;
  };

  beforeEach(inject(function($rootScope, $controller, _$location_, _$filter_, _notification_, _UserAddress_) {
    scope = $rootScope.$new();
    ctrl = $controller('UserAddressesController', {
      $scope: scope,
      $modalInstance: modalInstance,
      $location: _$location_,
      $filter: _$filter_,
      notification: _notification_,
      UserAddress: _UserAddress_,
      addressFormMode: addressFormMode,
      addressId: addressId
    });
  }));

  it('should init scope', function() {
    //expect(scope.formInProgress).toBe(false);  // TODO
  });
});

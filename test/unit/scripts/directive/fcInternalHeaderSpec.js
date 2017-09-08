describe('FcInternalHeader', function() {
  'use strict';

  var element, scope;

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

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    element = '<fc-header>';

    element = $compile(element)(scope);
    scope.$digest();
  }));
});

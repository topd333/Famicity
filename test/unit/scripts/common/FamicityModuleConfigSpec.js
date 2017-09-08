/*
 * If we assume that the philosophy of a provider is only configuration then it makes more sense in most
 *     cases to test that "it" is configured. As the "it" in this case is the resulting service, using
 *     module to do the configuration and then inject to test that the configuration worked seems to make sense.
 * The trick to understanding these tests is to realize that the function passed to module() does not get called until inject() does it's thing.
 * So assigning to a closure variable in the module initialization function ensures that the Provider is defined before control passes to the injected function.
 * Then you're free to interact with the Provider's configuration interface. The technique is a little bit broken in that the Provider has already provided it's Service.
 * But, if you can tolerate that limitation it works.
 *
 * Most of this I learned from https://github.com/angular/angular.js/issues/2274
 *
 * There are multiple describe() suites and it() tests, just to help us trace what's going on.
 * Hopefully, that makes this spec a good learning tool.
 */

describe('Famicity Module', function() {
  'use strict';

  describe('config', function() {

    var httpProvider;
    var config;

    beforeEach(module('famicity', function($httpProvider, configuration) {
      httpProvider = $httpProvider;
      config = configuration;
    }));

    it('should have added interceptors (inject calls module callback before run test)', inject(function() {
      expect(httpProvider.interceptors).toContain('responseInterceptor');
      expect(httpProvider.interceptors).toContain('requestErrorHttpInterceptor');
      expect(httpProvider.interceptors).toContain('errorsInterceptor');
      expect(httpProvider.interceptors).toContain('htmlInterceptor');
    }));

    it('should have set version header', function() {
      expect(httpProvider.defaults.headers.common['Desktop-App-Version']).toBe(config.version);
    });

  });

});

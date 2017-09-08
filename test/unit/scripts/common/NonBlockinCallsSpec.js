describe('Non blocking calls', function() {
  'use strict';
  var $compile, $rootScope, config;

  beforeEach(module('famicity', function(configuration) {
    config = configuration;
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    Bugsnag.notifyException = function(a) {
      console.log(a);
    };
  }));

  var $httpBackend;
  var dummyCallRequestHandler;

  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/languages/fr.json?v=' + config.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + config.version);
    // backend definition common for all tests
    dummyCallRequestHandler = $httpBackend.when('GET', 'https://localapi.famicity.com/dummycall');
    $httpBackend.expectGET('https://localapi.famicity.com/dummycall');

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
  }));

  it('test standard success behaviour', inject(function($http) {
    dummyCallRequestHandler.respond({dummy: true});

    $http.get('https://localapi.famicity.com/dummycall')
      .success(function(response) {
        expect(response).toEqual({dummy: true});
      });

  }));

  it('test standard failure behaviour', inject(function($http) {
    dummyCallRequestHandler.respond(500, 'Error');

    $http.get('https://localapi.famicity.com/dummycall');

    $httpBackend.when('GET', 'https://devstatic1.famicity.com/views/500.html?v=' + config.version).respond('');
    $httpBackend.expectGET('https://devstatic1.famicity.com/views/500.html?v=' + config.version);

  }));

  it('test object non blocking call failure behaviour', inject(function($http) {
    dummyCallRequestHandler.respond(500, 'Error');

    var status = null;

    $http({
      url: 'https://localapi.famicity.com/dummycall',
      method: 'GET',
      type: 'cm'
    })
      .success(function(response, responseStatus) {
        expect(response).toEqual({error: {status: 200, statusText: ''}});
        status = responseStatus;
      })
      .error(function() {
        expect(false).toBe(true);
      });

  }));

  it('test array non blocking call failure behaviour', inject(function($http) {
    dummyCallRequestHandler.respond(500, 'Error');

    var status = null;

    $http({
      url: 'https://localapi.famicity.com/dummycall',
      method: 'GET',
      type: 'cmA'
    })
      .success(function(response, responseStatus) {
        expect(response).toEqual([{error: {status: 200, statusText: ''}}]);
        status = responseStatus;
      })
      .error(function() {
        expect(false).toBe(true);
      });

  }));

});

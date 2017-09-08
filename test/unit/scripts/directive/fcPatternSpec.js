describe('FcPattern', function() {
  'use strict';

  var element;
  var scope;
  var configuration;
  var compile;
  var datePatterns = [
    {
      pattern: 'second',
      locales: ['en'],
      matches: function(value) {
        return value === 'true' && ['second'];
      }
    },
    {
      pattern: 'third',
      locales: [],
      matches: function(value) {
        return value === 'true' && ['third'];
      }
    },
    {
      pattern: 'forth',
      locales: ['en', 'fr'],
      matches: function(value) {
        return value === 'true' && ['forth'];
      }
    },
    {
      pattern: 'first',
      locales: ['fr'],
      matches: function(value) {
        return value === 'true' && ['first'];
      }
    }
  ];

  var testMatch = function(locale, date, result, placeholder) {
    scope.value = date;
    scope.datePatterns = datePatterns;
    scope.locale = locale;
    scope.readOnly = false;

    element =
      '<label fc-pattern="datePatterns" locale="{{locale}}" input-type="text" value="{{value}}" on-change="test" read-only="readOnly"></label>';
    element = compile(element)(scope);
    scope.$digest();
    element.isolateScope().update();
    scope.$digest();
    var matches = element.isolateScope().match.map(function(mat) {
      return mat.values[0];
    });
    expect(matches).toEqual(result);
    expect(element.isolateScope().inputPlaceHolder).toBe(placeholder);
  };

  angular.module('famicity.config', []).constant('configuration', {
    api_url: '@@api_url',
    oauth_url: '@@oauth_url',
    push_url: '@@push_url',
    static1Url: '@@static1_url',
    static2Url: '@@static2_url',
    static3Url: '@@static3_url',
    oauthClients: {
      facebook: '@@oauthClients.facebook'
    },
    development: true,
    version: '1'
  });

  beforeEach(module('famicity', function(_configuration_) {
    configuration = _configuration_;
    configuration.development = true;
  }));

  beforeEach(inject(function($rootScope, $compile, $injector) {
    scope = $rootScope.$new();

    compile = $compile;
    var $httpBackend = $injector.get('$httpBackend');
    var configuration = $injector.get('configuration');
    $httpBackend.when('GET', configuration.static3Url + '/languages/fr.json?v=' + configuration.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + configuration.version);
  }));

  it('should with return matches correct pattern', function() {
    // trued = true (entered value) + d, end of pattern
    testMatch('fr', 'true', ['third', 'forth', 'first'], 'trued');
  });

  it('should not match with a wrong locale', function() {
    testMatch('en', 'true', ['second', 'third', 'forth'], 'truend');
  });

  it('should chose the pattern with the least locales', function() {
    datePatterns.splice(1, 1);
    testMatch('fr', 'true', ['forth', 'first'], 'truet');
  });

});

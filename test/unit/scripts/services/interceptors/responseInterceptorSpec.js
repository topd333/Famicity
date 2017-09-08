describe('responseInterceptor', function() {
  'use strict';

  var $rootScope;
  var responseInterceptor;
  var Refresher;
  var Version;
  // var config;
  var backVersion = '1.14.2';

  beforeEach(module('famicity'));

  beforeEach(inject(function(
  _$rootScope_, $httpBackend, $q, _responseInterceptor_, _Version_, _Refresher_) {
    // $httpBackend.when('GET', config.static3Url + '/languages/fr.json?v=' + config.version).respond('');
    // $httpBackend.expectGET('/languages/fr.json?v=' + config.version);
    $rootScope = _$rootScope_;
    responseInterceptor = _responseInterceptor_;
    Refresher = _Refresher_;
    Version = _Version_;
    spyOn(Version, 'update').and.returnValue(backVersion);
    spyOn(Refresher, 'refreshForVersion');
  }));

  it('refreshes in case of a new version', function() {
    var getResponse = {
      status: 200,
      headers: function(key) {
        var value;
        switch (key) {
          case 'Api-Desktop-App-Version':
            value = backVersion;
            break;
          default:
            value = undefined;
        }
        return value;
      }
    };
    expect(responseInterceptor.response(getResponse)).toBe(getResponse);

    expect(Version.update).toHaveBeenCalled();
    expect(Refresher.refreshForVersion).toHaveBeenCalled();
  });
});

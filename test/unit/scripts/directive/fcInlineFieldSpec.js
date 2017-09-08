describe('fc-inline-field', function() {
  'use strict';

  var $compile, scope;

  // Load module
  beforeEach(module('famicity', function($translateProvider) {
    $translateProvider.translations('fr', { // TODO: Load actual translations ; see http://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
      'TEST': 'This is a {test}.'
    });
  }));

  beforeEach(inject(function($injector, configuration) {
    var $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/languages/fr.json?v=' + configuration.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + configuration.version);
  }));

  beforeEach(inject(function(_$compile_, $rootScope) {
    $compile = _$compile_;
    scope = $rootScope.$new();
  }));

  it('should generate input with correct information', inject(function() {
    scope.object = {testKey: null};
    scope.labelValues = {test: 'test'};
    scope.formStatus = {isEditing: true};
    var elem = $compile('<fc-inline-field object="object" label="TEST" label-values="{{ labelValues }}" key="testKey" ' +
      'data-label-icon="fa-map-marker fa-fw" form-status="formStatus"></fc-inline-field>')(scope);
    scope.$digest();

    expect(elem.find('input').length).toBe(1);
    expect(elem.find('input').attr('ng-model')).toBe('object[key]');
    expect(elem.find('i').prop('class')).toBe('fa fa-map-marker fa-fw');
    expect(elem.find('label').hasClass('ng-hide')).toBe(false);
    expect(elem.find('label').text()).toContain('This is a test.');
  }));

  it('should add * to the label if required', inject(function() {
    scope.object = '';
    var elem = $compile('<fc-inline-field object="object" label="test" key="testKey" required="true"></fc-inline-field>')(scope);
    scope.$digest();

    expect(elem.find('label').text()).toContain('test*');
  }));

  it('should be hidden when formStatus is isEditing', inject(function() {
    scope.object = '';
    scope.formStatus = {isEditing: false};
    var elem = $compile('<fc-inline-field object="object" label="test" key="testKey" required="true" form-status="formStatus"></fc-inline-field>')(scope);
    scope.$digest();

    expect(elem.find('label').hasClass('ng-hide')).toBe(true);
  }));

});

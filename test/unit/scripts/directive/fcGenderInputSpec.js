describe('fc-gender-input', function() {
  'use strict';

  var $compile, scope;

  // Load module
  beforeEach(module('famicity'));

  beforeEach(inject(function($injector, configuration) {
    var $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', configuration.static3Url + '/languages/fr.json?v=' + configuration.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + configuration.version);
  }));

  beforeEach(inject(function(_$compile_, $rootScope) {
    $compile = _$compile_;
    scope = $rootScope.$new();
  }));

  it('should display Male and Female radio buttons', inject(function() {
    scope.user = {};
    var elem = $compile('<fc-gender-input user="user" form-name="test_form"></fc-gender-input>')(scope);
    scope.$digest();

    expect(elem.find('label').length).toBe(2);
    expect(elem.find('label')[0].innerHTML).toBe('MAN*');
    expect(elem.find('label')[1].innerHTML).toBe('WOMAN*');
  }));

  it('should default to Male', inject(function() {
    scope.user = {};
    var elem = $compile('<fc-gender-input user="user" form-name="test_form"></fc-gender-input>')(scope);
    scope.$digest();

    expect(scope.user.sex).toBe('Male');
    expect(elem.find('#male').is(':checked')).toBe(true);
    expect(elem.find('#female').is(':checked')).toBe(false);
  }));

  it('should select gender when it is defined', inject(function() {
    scope.user = {sex: 'Male'};
    var elem = $compile('<fc-gender-input user="user" form-name="test_form"></fc-gender-input>')(scope);
    scope.$digest();
    expect(elem.find('label').length).toBe(2);
    expect(elem.find('#male').is(':checked')).toBe(true);
    expect(elem.find('#female').is(':checked')).toBe(false);

    scope.user = {sex: 'Female'};
    elem = $compile('<fc-gender-input user="user" form-name="test_form"></fc-gender-input>')(scope);
    scope.$digest();
    expect(elem.find('label').length).toBe(2);
    expect(elem.find('#male').is(':checked')).toBe(false);
    expect(elem.find('#female').is(':checked')).toBe(true);
  }));

  it('should update model when clicking on radio input', inject(function() {
    scope.user = {};
    var elem = $compile('<fc-gender-input user="user" form-name="test_form"></fc-gender-input>')(scope);
    scope.$digest();

    // Click twice: https://github.com/angular/angular.js/issues/3470
    elem.find('#female').click().click();
    scope.$digest();
    expect(scope.user.sex).toBe('Female');
    expect(elem.find('#male').is(':checked')).toBe(false);
    expect(elem.find('#female').is(':checked')).toBe(true);

    elem.find('#male').click().click();
    scope.$digest();
    expect(scope.user.sex).toBe('Male');
    expect(elem.find('#male').is(':checked')).toBe(true);
    expect(elem.find('#female').is(':checked')).toBe(false);
  }));

});

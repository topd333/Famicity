
describe('fc-editor', function() {
  'use strict';

  var $compile, scope;

  // Load module
  beforeEach(module('famicity', function($translateProvider) {
    $translateProvider.translations('fr', {
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

  it('should generate textarea with correct information', inject(function() {
    scope.model = {textValue: ''};
    var elem = $compile('<fc-editor model="model"></fc-editor>')(scope);
    scope.$digest();

    expect(elem.find('textarea').length).toBe(1);
    expect(elem.find('textarea').attr('ng-model')).toBe('model.textValue');
  }));

  xit('should submit on Ctrl + Enter or Shift + Enter', inject(function() {
    scope.model = {textValue: ''};
    scope.submit = function() {};
    spyOn(scope, 'submit');
    var elem = $compile('<fc-editor model="model" submit="submit()"></fc-editor>')(scope);
    scope.$digest();

    var e = $.Event('keydown', {keyCode: 13, which: 13, ctrlKey: true});
    elem.find('textarea').triggerHandler('focus');
    elem.find('textarea').triggerHandler(e);
    scope.$digest();
    expect(scope.submit).toHaveBeenCalled();

    e = $.Event('keydown', {keyCode: 13, which: 13, shiftlKey: true});
    elem.find('textarea').triggerHandler('focus');
    elem.find('textarea').triggerHandler(e);
    scope.$digest();
    expect(scope.submit.calls.count()).toBe(2);
  }));

  xit('should cancel on Escape', inject(function() {
    scope.model = {textValue: ''};
    scope.cancel = function() {};
    spyOn(scope, 'cancel');
    var elem = $compile('<fc-editor model="model" cancel="cancel()"></fc-editor>')(scope);
    scope.$digest();

    //var e = $.Event('keydown', {keyCode: 27, which: 27});
    var a = window.crossBrowser_initKeyboardEvent('keydown', {key: 27});
    elem.find('textarea').triggerHandler('focus');
    elem.find('textarea').triggerHandler({type: 'keydown', which: 27, keyCode: 27});
    scope.$digest();
    expect(scope.cancel).toHaveBeenCalled();

  }));

});

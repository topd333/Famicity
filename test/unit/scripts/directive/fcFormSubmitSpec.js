describe('FcFormSubmit', function() {
  'use strict';

  var element;
  var scope;
  var configuration;
  var compile;
  var $timeout;

  beforeEach(module('famicity', function(_configuration_) {
    configuration = _configuration_;
  }));

  beforeEach(inject(function($rootScope, $compile, $injector, $timeout, $q) {
    scope = $rootScope.$new();
    scope.formInProgress = false;
    scope.submit = function() {
      return [
        $q(function(resolve, reject) {
          $timeout(function() {
            if (scope.success) {
              resolve('ok');
            } else {
              reject('ko');
            }
          }, 1000);
        })
      ];
    };

    compile = $compile;
    var $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', configuration.static3Url + '/languages/fr.json?v=' + configuration.version).respond('');
    $httpBackend.expectGET(configuration.static3Url + '/languages/fr.json?v=' + configuration.version);
  }));

  element = '<form fc-form-submit data-submit-method="submit()" form-in-progress="formInProgress"> ' +
  '<button fc-form-submit form-in-progress="formInProgress" type="submit">TEXT</button>' +
  '</form>';

  it('button should have default text', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    element = compile(element)(scope);
    scope.$digest();
    expect(element.find('button').text()).toBe('TEXT');
  });

  it('should display loading text when clicking on the button', function() {
    element.find('button').click();
    scope.$digest();
    expect(element.find('button').html()).toBe('LOADING');
  });

  it('should restore button text on fail', function() {
    scope.success = false;
    $timeout.flush();
    scope.$digest();
    expect(element.find('button').html()).toBe('TEXT');
  });

  it('should not restore button text on success', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    var element = '<form fc-form-submit data-submit-method="submit()" form-in-progress="formInProgress"> ' +
    '<button fc-form-submit form-in-progress="formInProgress" type="submit">TEXT</button>' +
    '</form>';
    element = compile(element)(scope);
    scope.success = true;
    element.find('button').click();
    $timeout.flush();
    scope.$digest();
    expect(element.find('button').html()).toBe('LOADING');
  });

  it('should restore button text on success if specified', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    var element = '<form fc-form-submit data-submit-method="submit()" form-in-progress="formInProgress" activate-on-then="true"> ' +
    '<button fc-form-submit form-in-progress="formInProgress" type="submit">TEXT</button>' +
    '</form>';
    element = compile(element)(scope);
    scope.success = true;
    element.find('button').click();
    $timeout.flush();
    scope.$digest();
    expect(element.find('button').html()).toBe('TEXT');
  });

  it('should have the same behaviour on form submit', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    var element = '<form fc-form-submit data-submit-method="submit()" form-in-progress="formInProgress"> ' +
    '<button fc-form-submit form-in-progress="formInProgress" type="submit">TEXT</button>' +
    '</form>';
    element = compile(element)(scope);
    scope.success = false;
    scope.$digest();
    element.triggerHandler('submit');
    expect(element.find('button').html()).toBe('LOADING');
    $timeout.flush();
    expect(element.find('button').html()).toBe('TEXT');
  });

  it('should disable all submit buttons on submit', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    var element = '<form fc-form-submit data-submit-method="submit()" form-in-progress="formInProgress"> ' +
    '<button id="btn1" fc-form-submit form-in-progress="formInProgress" type="submit">TEXT1</button>' +
    '<button id="btn2" fc-form-submit form-in-progress="formInProgress" type="submit">TEXT2</button>' +
    '</form>';
    element = compile(element)(scope);
    scope.success = false;
    scope.$digest();
    element.triggerHandler('submit');
    expect(element.find('#btn1').html()).toBe('LOADING');
    expect(element.find('#btn2').html()).toBe('LOADING');
    $timeout.flush();
    expect(element.find('#btn1').html()).toBe('TEXT1');
    expect(element.find('#btn2').html()).toBe('TEXT2');
  });

  it('should re-enable immediatly if no promise is given', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    scope.submit = function() {
      return [];
    };
    var element = '<form fc-form-submit data-submit-method="submit()" form-in-progress="formInProgress"> ' +
    '<button fc-form-submit form-in-progress="formInProgress" type="submit">TEXT</button>' +
    '</form>';
    element = compile(element)(scope);
    scope.$digest();
    element.triggerHandler('submit');
    scope.$digest();
    expect(element.find('button').html()).toBe('TEXT');
  });

});

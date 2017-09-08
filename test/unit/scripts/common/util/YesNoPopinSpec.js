describe('YesNoPopin', function() {
  'use strict';

  var configuration;
  var $rootScope;
  var yesnopopin;
  var callbacks;

  // load module
  beforeEach(module('famicity', function(_configuration_) {
    configuration = _configuration_;
  }));

  beforeEach(function() {
    callbacks = {
      resolve: function() {},
      reject: function() {}
    };
    spyOn(callbacks, 'reject');
    spyOn(callbacks, 'resolve');
  });

  beforeEach(inject(function(_yesnopopin_, _$rootScope_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    yesnopopin = _yesnopopin_;

    var $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', configuration.static3Url + '/languages/fr.json?v=' + configuration.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + configuration.version);
  }));

  it('should open', function() {
    yesnopopin.open();
    $rootScope.$digest();
    expect(angular.element('.yes-no-popin').length).toBe(1);
    expect(angular.element('.yes-no-popin .btn-primary').html()).toBe('VALIDATE');
    expect(angular.element('.yes-no-popin .btn-secondary').html()).toBe('CANCEL');
    expect(angular.element('.yes-no-popin .popin-dialog').html()).toContain('COMMON.POPIN.ARE_YOU_SURE');
    angular.element('.yes-no-popin .btn-secondary').triggerHandler('click');
  });

  xit('should close on cancel', function() {
    yesnopopin.open();
    $rootScope.$digest();
    angular.element('.yes-no-popin .btn-secondary').triggerHandler('click');
    expect(angular.element('.yes-no-popin').length).toBe(0);
  });

  xit('should close on validate', function() {
    yesnopopin.open();
    $rootScope.$digest();
    angular.element('.yes-no-popin .btn-primary').triggerHandler('click');
    expect(angular.element('.yes-no-popin').length).toBe(0);
  });

  it('should be customizable', function() {
    yesnopopin.open('TEST', {yes: 'YES', no: 'NO', yesClass: 'yes-class', noClass: 'no-class'});
    $rootScope.$digest();
    expect(angular.element('.yes-no-popin').length).toBe(2);
    expect(angular.element('.yes-no-popin:last .yes-class').html()).toBe('YES');
    expect(angular.element('.yes-no-popin:last .no-class').html()).toBe('NO');
    expect(angular.element('.yes-no-popin:last .popin-dialog').html()).toContain('TEST');
    angular.element('.yes-no-popin .yes-class').triggerHandler('click');
  });

  it('should resolve promise on validate', function() {
    yesnopopin.open()
    .then(callbacks.resolve)
    .catch(callbacks.reject);
    $rootScope.$digest();
    angular.element('.yes-no-popin:last .btn-primary').triggerHandler('click');
    $rootScope.$digest();
    expect(callbacks.resolve).toHaveBeenCalled();
    expect(callbacks.reject).not.toHaveBeenCalled();
  });

  it('should reject promise on validate', function() {
    yesnopopin.open()
    .then(callbacks.resolve)
    .catch(callbacks.reject);
    $rootScope.$digest();
    angular.element('.yes-no-popin:last .btn-secondary').triggerHandler('click');
    $rootScope.$digest();
    expect(callbacks.resolve).not.toHaveBeenCalled();
    expect(callbacks.reject).toHaveBeenCalled();
  });
});

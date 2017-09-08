describe('Home route', function() {
  'use strict';
  var $rootScope, $state, $injector;
  var homeState = 'u.home';

  beforeEach(function() {

    module('famicity');

    inject(function(_$rootScope_, _$state_, _$injector_) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
    });
  });

  it('should respond to URL', function() {
    expect($state.href(homeState)).toEqual('/home');
  });

  it('does not provide feed on mobile', function() {
    //isMobile.phone = true;

    $state.go(homeState);
    //$rootScope.$digest();
    //expect($state.current.name).toBe(homeState);
  });
});

describe('Avatar directive', function() {
  'use strict';

  var $compile;
  var $rootScope;

  // Load cached templates
  beforeEach(module('famicity.views'));
  // Load module
  beforeEach(module('famicity', function($provide, $translateProvider) {
    // TODO: Load actual translations ; see http://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
    $translateProvider.translations('fr', {
      AVATAR: {
        SEE_PROFILE_OF: 'Voir le profil de {{user}}'
      }
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    Bugsnag.notifyException = function(a, b, c) {
      console.log(a);
    };
  }));

  it('supports active user', inject(function() {
    $rootScope.activeUser = {
      id: 1234,
      avatar_url: 'http://host/isac-tive.png',
      user_name: 'Isaac Tive'
    };
    var elem = $compile('<fc-avatar data-user="activeUser"></fc-avatar>')($rootScope);
    $rootScope.$digest();

    var image = elem.find('img');
    var wrapper = elem.find('.avatar-rounded');
    expect(image.attr('alt')).toBe('Avatar');
    expect(wrapper.attr('title')).toBe('Voir le profil de Isaac Tive');
    expect(image.attr('src')).toBe('http://host/isac-tive.png');
    expect(wrapper.hasClass('avatar-rounded avatar-border-green')).toBe(true);
  }));

  it('supports invited user', inject(function() {
    $rootScope.invitedUser = {
      id: 2345,
      avatar_url: 'http://host/micheline-vited.png',
      user_name: 'Micheline Vited',
      is_invited_by_me: true
    };
    var invitedElem = $compile('<fc-avatar data-user="invitedUser"></fc-avatar>')($rootScope);
    $rootScope.$digest();

    var invitedImage = invitedElem.find('img');
    var wrapper = invitedElem.find('.avatar-rounded');
    expect(invitedImage.attr('alt')).toBe('Avatar');
    expect(wrapper.attr('title')).toBe('Voir le profil de Micheline Vited');
    expect(invitedImage.attr('src')).toBe('http://host/micheline-vited.png');
    expect(wrapper.hasClass('avatar-rounded avatar-border-orange')).toBe(true);

    // Test that the invited state has a higher priority
    $rootScope.managedButInvitedUser = {
      id: 2345,
      avatar_url: 'http://host/micheline-vited.png',
      user_name: 'Micheline Vited',
      global_state: 'managed',
      is_invited_by_me: true
    };
    var elem = $compile('<fc-avatar data-user="managedButInvitedUser"></fc-avatar>')($rootScope);
    $rootScope.$digest();

    var image = elem.find('img');
    wrapper = elem.find('.avatar-rounded');
    expect(image.attr('alt')).toBe('Avatar');
    expect(wrapper.attr('title')).toBe('Voir le profil de Micheline Vited');
    expect(image.attr('src')).toBe('http://host/micheline-vited.png');
    expect(wrapper.hasClass('avatar-rounded avatar-border-orange')).toBe(true);
  }));

  it('supports managed user', inject(function() {
    $rootScope.managedUser = {
      id: 3456,
      avatar_url: 'http://host/manha-ged.png',
      user_name: 'Manh-ha Ged',
      global_state: 'managed'
    };
    var elem = $compile('<fc-avatar data-user="managedUser"></fc-avatar>')($rootScope);
    $rootScope.$digest();

    var image = elem.find('img');
    var wrapper = elem.find('.avatar-rounded');
    expect(image.attr('alt')).toBe('Avatar');
    expect(wrapper.attr('title')).toBe('Voir le profil de Manh-ha Ged');
    expect(image.attr('src')).toBe('http://host/manha-ged.png');
    expect(wrapper.hasClass('avatar-rounded avatar-border-gray')).toBe(true);
  }));

  it('supports blocked user', inject(function() {
    $rootScope.blockedUser = {
      id: 5678,
      avatar_url: 'http://host/myprofileimage.png',
      user_name: 'Jérôme Beau',
      is_blocked_by_me: true
    };
    var elem = $compile('<fc-avatar data-user="blockedUser"></fc-avatar>')($rootScope);
    $rootScope.$digest();

    var image = elem.find('img');
    var wrapper = elem.find('.avatar-rounded');
    expect(image.attr('alt')).toBe('Avatar');
    expect(wrapper.attr('title')).toBe('Voir le profil de Jérôme Beau');
    expect(image.attr('src')).toBe('http://host/myprofileimage.png');
    expect(wrapper.hasClass('avatar-rounded avatar-border-gray')).toBe(true);
  }));
});

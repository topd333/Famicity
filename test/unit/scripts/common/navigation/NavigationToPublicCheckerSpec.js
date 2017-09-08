describe('NavigationToPublicChecker', function() {
/*  'use strict';

  var $rootScope;
  var NavigationChecker;
  var NotificationService;
  var sessionManager;
  var Refresher;
  var pubsub;
  var PUBSUB;
  var config;

  var sessionUser = {
    globalState: 'active',
    userId: 12
  };
  var userInformation = {
    infos: {},
    pastilles: {}
  };
  var popupSpy;

  // load module
  beforeEach(module('famicity', function($provide, configuration) {
    config = configuration;
  }));

  beforeEach(inject(function(
  _$rootScope_, $httpBackend, _sessionManager_, $q, _userInitializerManager_, _NotificationService_, _Refresher_,
  _pubsub_, _PUBSUB_) {
    $httpBackend.when('GET', config.static3Url + '/languages/fr.json?v=' + config.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + config.version);
    $rootScope = _$rootScope_;
    sessionManager = _sessionManager_;
    NavigationChecker = _userInitializerManager_;
    NotificationService = _NotificationService_;
    Refresher = _Refresher_;
    pubsub = _pubsub_;
    PUBSUB = _PUBSUB_;
    spyOn(Refresher, 'refreshed');
    spyOn(pubsub, 'publish');
    spyOn(sessionManager, 'getUser').and.returnValue(sessionUser);
    popupSpy = spyOn(Refresher, 'isPopupsRequired');
    spyOn(Refresher, 'isChatConnectRequired').and.returnValue(true);
    spyOn(NotificationService, 'getAllNotifications').and.returnValue($q(function(resolve) {
      var allNotifications = {
        user: userInformation
      };
      resolve(allNotifications);
    }));
  }));

  it('enables user, chat, popups and push', function() {
    popupSpy.and.returnValue(true);
    NavigationChecker.initialize().then(function() {});
    // Promises are resolved/dispatched only on next $digest cycle
    $rootScope.$digest();

    expect(Refresher.isPopupsRequired).toHaveBeenCalled();
    expect(Refresher.isChatConnectRequired).toHaveBeenCalled();
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.USER.CONNECT);
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.CHAT.CONNECT, sessionUser.userId, {pooled: true});
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.CHAT.CONNECT, sessionUser.userId);
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.HELP.POPINS, userInformation);
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.PUSH.CONNECT, {userId: sessionUser.userId}, {pooled: true});
    expect(Refresher.refreshed).toHaveBeenCalled();
  });

  it('can avoid popups', function() {
    popupSpy.and.returnValue(false);
    NavigationChecker.initialize().then(function() {});
    // Promises are resolved/dispatched only on next $digest cycle
    $rootScope.$digest();

    expect(Refresher.isPopupsRequired).toHaveBeenCalled();
    expect(Refresher.isChatConnectRequired).toHaveBeenCalled();
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.USER.CONNECT);
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.CHAT.CONNECT, sessionUser.userId, {pooled: true});
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.CHAT.CONNECT, sessionUser.userId);
    expect(pubsub.publish).not.toHaveBeenCalledWith();
    expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.PUSH.CONNECT, {userId: sessionUser.userId}, {pooled: true});
    expect(Refresher.refreshed).toHaveBeenCalled();
  });*/
});

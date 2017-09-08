describe('Refresher', function() {
  'use strict';

  var Refresher;

  var POPUPS_DEFAULT;
  var CHAT_CONNECT_DEFAULT;

  var refreshPopups;
  var refreshChatConnect;

  beforeEach(module('famicity'));

  beforeEach(inject(function(_Refresher_, _sessionManager_, _Refresher_POPUPS_DEFAULT_, _Refresher_CHAT_CONNECT_DEFAULT_) {
    Refresher = _Refresher_;
    POPUPS_DEFAULT = _Refresher_POPUPS_DEFAULT_;
    CHAT_CONNECT_DEFAULT = _Refresher_CHAT_CONNECT_DEFAULT_;
    refreshPopups = POPUPS_DEFAULT;
    refreshChatConnect = CHAT_CONNECT_DEFAULT;
    spyOn(Refresher, 'refresh');
    spyOn(_sessionManager_, 'getRefreshPopups').and.callFake(function() {
      return refreshPopups;
    });
    spyOn(_sessionManager_, 'getRefreshChatConnect').and.callFake(function() {
      return refreshChatConnect;
    });
    spyOn(_sessionManager_, 'setRefreshPopups').and.callFake(function(refresh) {
      refreshPopups = refresh;
    });
    spyOn(_sessionManager_, 'setRefreshChatConnect').and.callFake(function(refresh) {
      refreshChatConnect = refresh;
    });
  }));

  it('has expected defaults', function() {
    expect(POPUPS_DEFAULT).toBe(true);
    expect(CHAT_CONNECT_DEFAULT).toBe(true);
  });

  it('refreshes for the first time', function() {
    expect(Refresher.isChatConnectRequired()).toBe(POPUPS_DEFAULT);
    expect(Refresher.isPopupsRequired()).toBe(CHAT_CONNECT_DEFAULT);
    Refresher.refresh();
    expect(Refresher.isChatConnectRequired()).toBe(POPUPS_DEFAULT);
    expect(Refresher.isPopupsRequired()).toBe(CHAT_CONNECT_DEFAULT);
    Refresher.refreshed();
    expect(Refresher.isChatConnectRequired()).toBe(true);
    expect(Refresher.isPopupsRequired()).toBe(true);
  });

  it('refreshes with setting', function() {
    // Disable chat connect
    Refresher.delayChatConnect();
    Refresher.refresh();
    expect(Refresher.isChatConnectRequired()).toBe(false);
    expect(Refresher.isPopupsRequired()).toBe(CHAT_CONNECT_DEFAULT);
    Refresher.refreshed();
    expect(Refresher.isChatConnectRequired()).toBe(CHAT_CONNECT_DEFAULT);
    expect(Refresher.isPopupsRequired()).toBe(POPUPS_DEFAULT);
  });

  it('disables popups when refresh is triggered for version change', function() {
    Refresher.refreshForVersion();
    expect(Refresher.refresh).toHaveBeenCalled();
    expect(Refresher.isPopupsRequired()).toBe(false);
    Refresher.refreshed();
    expect(Refresher.isChatConnectRequired()).toBe(CHAT_CONNECT_DEFAULT);
    expect(Refresher.isPopupsRequired()).toBe(POPUPS_DEFAULT);
  });
});

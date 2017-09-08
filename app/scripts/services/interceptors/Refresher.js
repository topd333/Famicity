angular.module('famicity')
.constant('Refresher_POPUPS_DEFAULT', true)
.constant('Refresher_CHAT_CONNECT_DEFAULT', true)
.factory('Refresher', function(sessionManager, $window, Refresher_POPUPS_DEFAULT, Refresher_CHAT_CONNECT_DEFAULT) {
  'use strict';

  const POPUPS_DEFAULT = Refresher_POPUPS_DEFAULT;
  const CHAT_CONNECT_DEFAULT = Refresher_CHAT_CONNECT_DEFAULT;

  return {
    refresh() {
      $window.location.reload();
    },
    /**
     * What to do when the refresh is triggered by a new version.
     */
    refreshForVersion() {
      this.delayPopups();
      this.refresh();
    },
    refreshed() {
      sessionManager.setRefreshPopups(POPUPS_DEFAULT);
      sessionManager.setRefreshChatConnect(CHAT_CONNECT_DEFAULT);
    },
    /**
     * Ask to avoid showing popups for the next refresh.
     */
    delayPopups() {
      sessionManager.setRefreshPopups(false);
    },
    delayChatConnect() {
      sessionManager.setRefreshChatConnect(false);
    },
    isPopupsRequired: () => {
      let refresh = sessionManager.getRefreshPopups();
      if (refresh == null) {
        refresh = POPUPS_DEFAULT;
      }
      return refresh;
    },
    isChatConnectRequired: () => {
      let refresh = sessionManager.getRefreshChatConnect();
      if (refresh == null) {
        refresh = CHAT_CONNECT_DEFAULT;
      }
      return refresh;
    }
  };
});

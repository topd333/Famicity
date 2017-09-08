angular.module('famicity')
  .factory('Version', function(sessionManager, configuration, util) {
    'use strict';
    const log = debug('fc-Version');

    const isOutdated = function(backVersion) {
      const currentVersion = sessionManager.getVersion();
      return backVersion && (!currentVersion || util.semVerCompare(currentVersion, backVersion) <= -1);
    };

    const setVersion = function(backVersion) {
      log('Upgrading to %o', backVersion);
      sessionManager.setVersion(backVersion);
      return backVersion;
    };

    return {
      update: (backVersion) => isOutdated(backVersion) ? setVersion(backVersion) : null
    };
  });

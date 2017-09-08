angular.module('famicity').factory('ContactsImportService', function(
  $location, $q, $interval, InvitationService) {
  'use strict';
  const log = debug('fc-imports-service');
  const PopupCenter = function(url, title, w, h) {
    const dualScreenLeft = typeof window.screenLeft !== 'undefined' && window.screenLeft !== null ? window.screenLeft : screen.left;
    const dualScreenTop = typeof window.screenTop !== 'undefined' && window.screenTop !== null ? window.screenTop : screen.top;
    let width;
    let height;
    if (window.innerWidth) {
      width = window.innerWidth;
    } else {
      width = document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    }
    if (window.innerWidth) {
      height = window.innerHeight;
    } else {
      height = document.documentElement.innerHeight ? document.documentElement.clientHeight : screen.height;
    }
    const left = width / 2 - w / 2 + dualScreenLeft;
    const top = height / 2 - h / 2 + dualScreenTop;
    const newWindow =
      window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    if (window.focus) {
      newWindow.focus();
    }
    return newWindow;
  };

  const startExternalImport = function(userId, provider) {
    let popup;
    let resolved;
    let width = 0;
    let height = 0;
    log('popup open');
    const defer = $q.defer();
    resolved = false;
    [width, height] = (() => {
      switch (provider) {
        case 'FACEBOOK':
          return [481, 269];
        case 'YAHOO':
          return [560, 519];
        case 'WINDOWSLIVE':
          return [500, 560];
        case 'TWITTER':
          return [495, 645];
        case 'GMAIL':
        default:
          return [452, 633];
      }
    })();
    popup = new PopupCenter('', '_blank', width, height);
    InvitationService.getExternalImportUrl(userId, provider).$promise.then(function(response) {
      popup.location = response.url;
      const popupInterval = $interval(function() {
        try {
          if (popup.document.domain === document.domain && /import_id/.test(popup.location)) {
            log('start');
            popup.close();
            defer.resolve(response);
            resolved = true;
          }
        } catch (err) {
          // Do nothing
        }
        if (popup.closed) {
          log('popup closed');
          $interval.cancel(popupInterval);
          if (!resolved) {
            defer.reject('canceled');
          }
        }
      }, 50);
    });
    return defer.promise;
  };
  const getExternalImport = function() {
    return InvitationService.getExternalImportUsers().$promise;
  };
  return {
    startExternalImport,
    getExternalImport
  };
});

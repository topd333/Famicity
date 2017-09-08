angular.module('famicity').factory('$analytics', function($window, $rootScope, $state, configuration) {
  'use strict';
  var trackEvent, trackPageView, u, _paq;
  u = '//analytics.famicity.com/';
  _paq = $window._paq || [];
  _paq.push(['enableLinkTracking']);
  _paq.push(['setTrackerUrl', u + 'piwik.php']);
  _paq.push(['setSiteId', configuration.piwikAppId]);
  trackEvent = function(category, action, name, value) {
    _paq.push(['trackEvent', category, action, name, value]);
  };
  trackPageView = function(customTitle) {
    _paq.push(['trackPageView', customTitle]);
  };
  return {
    trackEvent: trackEvent,
    trackPageView: trackPageView
  };
});

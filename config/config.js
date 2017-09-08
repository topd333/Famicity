'use strict'; // jshint ignore:line

angular.module('famicity.config', [])
  .constant('configuration', {
    api_url: '@@api_url',
    oauth_url: '@@oauth_url',
    push_url: '@@push_url',
    static1Url: '@@static1_url',
    static2Url: '@@static2_url',
    static3Url: '@@static3_url',
    environment: '@@environment',
    api_key_monitoring: '@@api_key_monitoring',
    piwikAppId: '@@piwikAppId',
    oauthClients: {
      facebook: '@@oauthClients.facebook'
    },
    development: @@development,
    version: '@@version'
  });

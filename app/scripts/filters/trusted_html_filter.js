angular.module('famicity').filter('trustedHtml', function($sce) {
  'use strict';
  return function(text) {
    return $sce.trustAsHtml(text);
  };
});

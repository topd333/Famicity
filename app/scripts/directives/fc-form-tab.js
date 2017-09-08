angular.module('famicity').directive('fcFormTab', function(
  $http, $templateCache, $compile, $stateParams, oldPermissionService) {
  'use strict';

  const getTemplate = function(contentType) {
    const baseUrl = '/views/internal/';
    const template = {
      'default': 'form_tab.html',
      eventCreate: 'form_tab_event.html',
      eventShow: 'form_tab_event_show.html'
    };
    const templateUrl = baseUrl + template[contentType];
    const templateLoader = $http.get(templateUrl, {
      cache: $templateCache
    });
    return templateLoader;
  };
  const compileTemplate = function(scope, element, template) {
    const loader = getTemplate(template);
    loader.success(function(newHtml) {
      element.html(newHtml);
    }).then(function() {
      element.html($compile(element.html())(scope));
    });
  };
  return {
    restrict: 'AE',
    replace: true,
    link(scope, element, attrs) {
      if (attrs.template) {
        compileTemplate(scope, element, attrs.template);
      } else {
        compileTemplate(scope, element, 'default');
      }
      oldPermissionService.showPermission(scope, false);
      scope.showPermission = function() {
        return oldPermissionService.showPermission(scope, true);
      };
      scope.showFormContent = function(tab) {
        scope.tabActive = tab || 'info';
      };
    }
  };
});

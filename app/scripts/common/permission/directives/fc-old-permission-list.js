angular.module('famicity')
  .directive('fcOldPermissionList', function($http, $templateCache, $compile, $location, $state) {
    'use strict';

    const getTemplate = function(contentType) {
      const baseUrl = '/scripts/common/permission/directives/';
      const template = {
        default: 'fc-old-permission-list.html',
        event_template: 'fc-old-permission-list_event.html'
      };
      const templateUrl = baseUrl + template[contentType];
      const templateLoader = $http.get(templateUrl, {
        cache: $templateCache
      });
      return templateLoader;
    };

    const compileTemplate = function(scope, element, template) {
      const loader = getTemplate(template);
      return loader.success(function(newHtml) {
        return element.html(newHtml);
      }).then(function() {
        return element.html($compile(element.html())(scope));
      });
    };

    return {
      restrict: 'AE',
      replace: true,
      link(scope, element, attrs) {
        if (attrs.template === 'event_template') {
          compileTemplate(scope, element, attrs.template);
        } else {
          compileTemplate(scope, element, 'default');
        }

        scope.addPermission = function() {
          $state.go('permission-object', {
            user_id: scope.viewedUserId,
            location_type: scope.locationType,
            permission_type: 'permissions',
            form_key: scope.formKey
          }, {location: false});
        };

        scope.addExclusion = function() {
          $state.go('permission-object', {
            user_id: scope.viewedUserId,
            location_type: scope.locationType,
            permission_type: 'exclusions',
            form_key: scope.formKey
          }, {location: false});
        };

        scope.deletePermissionElement = function(idx, objectType) {
          if (objectType === 'group') {
            return scope.formData.permissions.group_permissions.splice(idx, 1);
          } else if (objectType === 'user') {
            return scope.formData.permissions.user_permissions.splice(idx, 1);
          } else if (objectType === 'email') {
            scope.formData.permissions.email_permissions.splice(idx, 1);
          }
        };

        scope.deleteExclusionElement = function(idx, objectType) {
          console.log('deleteExclusionElement');
          if (objectType === 'group') {
            scope.formData.permissions.group_exclusions.splice(idx, 1);
            console.log(scope.formData);
          } else {
            scope.formData.permissions.user_exclusions.splice(idx, 1);
          }
        };
      }
    };
  });

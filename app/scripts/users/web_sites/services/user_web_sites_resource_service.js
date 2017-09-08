angular.module('famicity').factory('UserWebSite', function(
  $resource, configuration, resourceTransformer) {
  'use strict';
  var UserWebSite;
  UserWebSite = $resource(configuration.api_url + '/users/:user_id/user_web_sites/:web_site_id', {
    user_id: '@user_id',
    web_site_id: '@web_site_id'
  }, {
    edit: {
      url: configuration.api_url + '/users/:user_id/user_web_sites/:web_site_id/edit',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'user_website', status)
    },
    save: {
      method: 'POST',
      transformRequest: function(data) {
        var attrs;
        attrs = {};
        attrs.user_website = angular.copy(data);
        return angular.toJson(attrs);
      }
    },
    update: {
      method: 'PUT',
      transformRequest: function(data) {
        var attrs;
        attrs = {};
        attrs.user_website = angular.copy(data);
        delete attrs.user_website.type;
        delete attrs.user_website.id;
        return angular.toJson(attrs);
      }
    }
  });
  return UserWebSite;
});

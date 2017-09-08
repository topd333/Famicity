angular.module('famicity').factory('UserAddress', function($resource, configuration) {
  'use strict';
  var UserAddress;
  UserAddress = $resource(configuration.api_url + '/users/:user_id/user_addresses/:address_id', {
    'address_id': '@id'
  }, {
    query: {
      isArray: false
    },
    edit: {
      url: configuration.api_url + '/users/:user_id/user_addresses/:address_id/edit',
      transformResponse: function(data) {
        data = angular.fromJson(data);
        if (data.user_address.country) {
          data.user_address.country = 'COUNTRY_' + data.user_address.country;
        }
        return data;
      }
    },
    update: {
      method: 'PUT',
      transformRequest: function(data) {
        var attrs, tmp;
        attrs = angular.copy(data);
        if (attrs.country) {
          tmp = attrs.country.split('_');
          attrs.country = tmp[1];
        }
        return angular.toJson(attrs);
      }
    },
    save: {
      method: 'POST',
      transformRequest: function(data) {
        var attrs, tmp;
        attrs = angular.copy(data);
        if (attrs.country) {
          tmp = attrs.country.split('_');
          attrs.country = tmp[1];
        }
        return angular.toJson(attrs);
      }
    }
  });
  return UserAddress;
});

angular.module('famicity')
  .factory('UserResource', function(configuration, $resource, resourceTransformer) {
    'use strict';
    return $resource(configuration.api_url, {user_id: '@user_id'}, {
      register: {method: 'POST', url: configuration.oauth_url + '/sign_up'},
      change_password: {
        method: 'PUT',
        url: configuration.api_url + '/users/:user_id/change_password'
      },
      destroy: {
        method: 'POST',
        url: configuration.api_url + '/users/:user_id/unsubscription'
      },
      feed: {
        url: configuration.api_url + '/users/:user_id/feed'
      },
      user_environment: {
        url: configuration.api_url + '/users/environment'
      },
      infos_for_profile_step: {
        url: configuration.api_url + '/users/:user_id/infos_for_profile_step',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'user', status)
      },
      is_tree_blocked: {
        url: configuration.api_url + '/users/:user_id/is_tree_blocked'
      },
      options_to_show: {
        url: configuration.api_url + '/users/:user_id/options_to_show'
      },
      popup_gedcom: {
        method: 'POST',
        url: configuration.api_url + '/users/:user_id/popup_gedcom'
      },
      last_connected: {
        url: configuration.api_url + '/users/:user_id/last_connected',
        type: 'cm'
      },
      last_articles: {
        url: configuration.api_url + '/users/:user_id/last_articles'
      },
      next_birthdays: {
        url: configuration.api_url + '/users/:user_id/next_birthdays',
        type: 'cm'
      },
      year_birthdays: {
        params: {user_id: '@user_id', page: '@page'},
        url: configuration.api_url + '/users/:user_id/year_birthdays'
      },
      today_birthdays: {
        url: configuration.api_url + '/users/:user_id/today_birthdays'
      },
      next_events: {
        url: configuration.api_url + '/users/:user_id/next_events',
        type: 'cm'
      },
      block_user: {method: 'POST', params: {id: '@id'}, url: configuration.api_url + '/users/:id/block'},
      authorize_user: {method: 'POST', params: {id: '@id'}, url: configuration.api_url + '/users/:id/authorize'},
      destroy_from_tree: {
        method: 'DELETE',
        params: {id: '@id'},
        url: configuration.api_url + '/users/:id/destroy_from_tree'
      },
      create_from_tree: {
        method: 'POST',
        params: {id: '@id'},
        url: configuration.api_url + '/users/new/create_from_tree',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'user', status)
      },
      change_group_membership: {
        method: 'POST',
        url: configuration.api_url + '/users/:user_id/change_group_membership'
      },
      ask_contacts: {
        method: 'POST',
        url: configuration.api_url + '/users/:user_id/ask_contacts',
        type: 'cm'
      },
      initial_update: {method: 'PUT', url: configuration.api_url + '/users/initial_update'},
      tree_autocomplete: {isArray: true, url: configuration.api_url + '/users/tree/autocomplete'},
      invitation_suggestions: {
        isArray: true,
        url: configuration.api_url + '/users/invitation/suggestions'
      }
    });
  });

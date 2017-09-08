angular.module('famicity').service('userService',
function(
$location, $q, $http, $timeout, $translate, pubsub, notification,
sessionManager, UserResource, $injector, $moment) {
  'use strict';
  return {
    /**
     * Register user
     * @param attrs
     * @param token
     * @param $scope
     * @returns {*}
     */
    register: (attrs, token, $scope) => $q((resolve, reject) => {
      const referral = sessionManager.getReferral();
      const locale = $translate.use() || sessionManager.getLocale();
      const registerPromise = new UserResource({
        user: attrs,
        invitation: token,
        parameters: {locale, referral}
      }).$register();
      registerPromise.then(function(response) {
        let sessionUser;
        if (response.type === 'sign_up') {
          if (referral) {
            sessionManager.remove('referral');
          }
          sessionManager.setToken(response.access_token);
          $http.defaults.headers.common.Authorization = 'Bearer ' + response.access_token;
          sessionManager.setUserId(response.user.id);
          sessionUser = {
            accessToken: response.access_token,
            globalState: response.user.global_state,
            settingsId: response.user.setting.id,
            userId: response.user.id
          };
          sessionManager.setUser(sessionUser);
          resolve(response.type);
          sessionManager.setEmail(attrs.email);
          if (window.google_trackConversion) {
            window.google_trackConversion({
              google_conversion_id: 1034498349,
              google_conversion_language: 'en',
              google_conversion_format: '3',
              google_conversion_color: 'ffffff',
              google_conversion_label: 'DQuPCKfJgFgQreKk7QM',
              google_remarketing_only: false
            });
          }
        } else if (response.type === 'sign_in') {
          $scope.sessionUsername = null;
          $scope.sessionPass = null;
          $http.defaults.headers.common.Authorization = 'Bearer ' + response.access_token;
          notification.add('CONNEXION_SUCCESS_MSG');
          sessionManager.setUserId(response.user_id, Boolean(attrs.remember_me));
          sessionManager.setToken(response.access_token, Boolean(attrs.remember_me));
          sessionManager.setEmail(attrs.email);
          const userManager = $injector.get('userManager');
          userManager.setLocale(response.locale);
          sessionUser = {
            accessToken: response.access_token,
            globalState: response.global_state,
            settingsId: response.setting_id,
            userId: response.user_id
          };
          sessionManager.setUser(sessionUser, attrs.remember_me);
          resolve('sign_in');
        }
      }).catch(err => reject(err));
      return registerPromise;
    }),
    /**
     * Change user password
     * @param user_id
     * @param attrs
     * @returns {*}
     */
    changePassword(user_id, attrs) {
      return new UserResource({user: attrs}).$change_password({user_id}, function() {
        notification.add('PASSWORD_CHANGE_SUCCESS_MSG');
      });
    },
    /**
     * Return user environment
     * @param user_id
     * @param successCallback
     * @returns {*|{url}}
     */
    userEnvironment(user_id, successCallback) {
      return UserResource.user_environment({}, function(response) {
        if (successCallback) {
          return successCallback(response);
        }
      });
    },
    /**
     * Block user
     * @param id
     * @returns {*}
     */
    blockUser(id) {
      return new UserResource().$block_user({id}, function(response) {
        notification.add('RELATIVE_BLOCKED_SUCCESS_MSG');
        return response;
      });
    },
    /**
     * Authorize blocked user
     * @param user_to_authorize
     * @returns {*}
     */
    authorizeUser(user_to_authorize) {
      return new UserResource().$authorize_user({
        id: user_to_authorize
      }, function(response) {
        notification.add('RELATIVE_UNBLOCKED_SUCCESS_MSG');
        return response;
      });
    },
    /**
     * Destroy user from tree
     * @param id
     * @param successCallback
     * @returns {*}
     */
    destroyUserFromTree(id, successCallback) {
      return new UserResource().$destroy_from_tree({id}, function(response) {
        notification.add('RELATIVE_DELETED_SUCCESS_MSG');
        if (successCallback) {
          return successCallback(response);
        }
      });
    },
    /**
     * Create user from tree.
     *
     * @param parent_link The relationship kind
     * @param user_from_id The relative id
     * @param user
     * @param autocomplete_user_id
     * @returns {deferred.$promise|{then}|$promise|*|promise|g}
     */
    createFromTree(parent_link, user_from_id, user, autocomplete_user_id) {
      user = angular.copy(user, {});
      if (user.birthDateValid === false) {
        user.birth_date = 'Invalid date';
      } else if (user.birth_date) {
        user.birth_date = $moment(user.birth_date).forServer();
      }
      if (user.deathDateValid === false) {
        user.death_date = 'Invalid date';
      } else if (user.death_date) {
        user.death_date = $moment(user.death_date).forServer();
      }
      delete user.birthDateValid;
      delete user.deathDateValid;
      return UserResource.create_from_tree({
        user,
        parent_link,
        user_from_id,
        autocomplete_user_id
      }).$promise;
    },

    /**
     * Destroy user
     * @param user_id
     * @param attrs
     */
    destroy: (user_id, attrs) => new UserResource({unsubscription: attrs}).$destroy({user_id}),

    /**
     * Get user feed
     * @param params
     */
    feed: params => UserResource.feed(params).$promise,

    /**
     * Get options to show
     * @param user_id
     */
    optionsToShow: (user_id) => UserResource.options_to_show({user_id}).$promise,

    /**
     * Get gedcom popup
     * @param user_id
     */
    popupGedcom: (user_id) => UserResource.popup_gedcom({user_id}).$promise,

    /**
     * Get last connected users
     * @param user_id
     */
    lastConnected: (user_id) => UserResource.last_connected({user_id}).$promise,

    /**
     * Get coming birthdays
     * @param user_id
     */
    nextBirthdays: (user_id) => UserResource.next_birthdays({user_id}).$promise,

    /**
     * Get coming birthdays for this year
     * @param user_id
     * @param page
     */
    yearBirthdays: (user_id, page) => UserResource.year_birthdays({user_id, page}),

    /**
     * Get today's birthdays
     * @param user_id
     */
    todayBirthdays: (user_id) => UserResource.today_birthdays({user_id}),

    /**
     * Get coming events
     * @param user_id
     */
    nextEvents: (user_id) => UserResource.next_events({user_id}).$promise,

    /**
     * Change group membership
     * @param userId
     * @param groups
     */
    changeGroupMembership: (userId, groups) => UserResource.change_group_membership({
      user_id: userId,
      group_ids: groups
    }),

    /**
     * Ask for chat contacts
     * @param userId
     */
    askContacts: (user_id) => UserResource.ask_contacts({user_id}),

    /**
     * Initial update
     * @param attrs
     */
    initialUpdate: (attrs) => new UserResource({user: attrs}).$initial_update(),

    /**
     * Autocomplete for tree popups
     * @param q
     * @param field
     */
    treeAutocomplete: (q, field) => UserResource.tree_autocomplete({q, field}),

    /**
     * Get invitation suggestions
     */
    invitationSuggestions: () => UserResource.invitation_suggestions()
  };
});

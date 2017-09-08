angular.module('famicity')
  .service('profileService', function($location, $filter, $moment, Profile, $q) {
    'use strict';
    var log = debug('fc-profileService');
    return {
      get: function(user_id, $scope) {
        const defer = $q.defer();
        Profile.get({user_id: user_id})
          .$promise.then(function(profile) {
            if (profile.sex) {
              profile.sex = profile.sex.toLowerCase();
            }
            if (profile.permissions.is_readable) {
              if (profile.user_emails) {
                Object.keys(profile.user_emails).forEach(function(key) {
                  profile.user_emails[key].forEach(function(val) {
                    if (val.user_email.is_used_for_authenticate) {
                      profile.currentEmail = val.user_email;
                    }
                  });
                });
              }
              profile.emptyPassions =
                !profile.user_info.activity && !profile.user_info.music && !profile.user_info.tvmovie && !profile.user_info.movie && !profile.user_info.book && !profile.user_info.about_me;
              profile.personalInfos = [];
              if (Boolean(profile.user_info.middle_name)) {
                profile.personalInfos.push({label: 'MIDDLE_NAME', value: profile.user_info.middle_name});
              }
              if (profile.sex === 'female') {
                if (Boolean(profile.user_info.maiden_name)) {
                  profile.personalInfos.push({label: 'MAIDEN_NAME', value: profile.user_info.maiden_name});
                }
              }
              if (profile.is_deceased) {
                if (Boolean(profile.death_date)) {
                  profile.personalInfos.push({
                    label: 'DEATH_DATE',
                    value: $moment.fromServer(profile.death_date).format('L')
                  });
                }
                if (Boolean(profile.user_info.death_place)) {
                  profile.personalInfos.push({label: 'DEATH_PLACE', value: profile.user_info.death_place});
                }
              } else {
                if (Boolean(profile.user_info.company)) {
                  profile.personalInfos.push({label: 'COMPANY', value: profile.user_info.company});
                }
                if (Boolean(profile.user_info.job)) {
                  profile.personalInfos.push({label: 'CURRENT_POSITION', value: profile.user_info.job});
                }
              }
            }
            if ($scope) {
              $scope.user = profile;
              $scope.currentEmail = profile.currentEmail;
            }
            defer.resolve(profile);
          }).catch((error) => defer.reject(error));
        return defer.promise;
      },
      getShortProfile: function(user_id, $scope) {
        return this.getBasicProfile(user_id, 'short', $scope);
      },
      getBasicProfile: function(user_id, type, $scope) {
        const promise = type === 'short' ? Profile.getShort({
          user_id: user_id,
          type: type
        }).$promise : Profile.get({
          user_id: user_id,
          type: type
        }).$promise;

        promise.then(function(user) {
          if (user != null ? user.sex : undefined) {
            user.sex = user.sex.toLowerCase();
          }
          if ($scope != null) {
            // TODO: Use the promise result from outside! Don't update scope here
            $scope.basicProfile = user;
          }
        });
        return promise;
      },
      getTreeProfile: function(user_id) {
        log('getTreeProfile(%o)', user_id);
        return Profile.get({
          user_id: user_id,
          type: 'tree'
        }).$promise;
      },
      updateProfile: function(user_id, attrs) {
        attrs = angular.copy(attrs);
        if (attrs.user.birthDateValid === false) {
          attrs.user.birth_date = 'Invalid date';
        } else if (attrs.user.birth_date) {
          attrs.user.birth_date = $moment(attrs.user.birth_date).forServer();
        }
        if (attrs.user.deathDateValid === false) {
          attrs.user.death_date = 'Invalid date';
        } else if (attrs.user.death_date) {
          attrs.user.death_date = $moment(attrs.user.death_date).forServer();
        }
        delete attrs.user.birthDateValid;
        delete attrs.user.deathDateValid;
        return new Profile(attrs).$update_profile({user_id: user_id});
      }
    };
  });

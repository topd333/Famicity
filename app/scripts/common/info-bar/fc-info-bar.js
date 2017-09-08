angular.module('famicity')
  .directive('fcInfoBar', function(
    $rootScope, $interval, $moment, $translate, $q,
    CommunityManagement, $analytics, $state, pubsub,
    userInitializerManager, PUBSUB) {
    'use strict';
    const log = debug('fc-info-bar');

    return {
      restrict: 'E',
      templateUrl: '/scripts/common/info-bar/fc-info-bar.html',
      link($scope, element) {
        let interval = null;
        let activity = null;
        let started = false;
        let locale = $translate.use();

        const getActivity = function(trusted) {
          if (trusted == null) {
            trusted = false;
          }
          const currentStateData = $state.current.data;
          if (!trusted && ((currentStateData != null ? currentStateData.hideCmBar : undefined) || currentStateData == null || !currentStateData.auth)) {
            return;
          }
          CommunityManagement.next_sentence().$promise
            .then(function(response) {
              activity = response;

              if (!response.sentence) {
                $interval.cancel(interval);
                $scope.content = '';
                return;
              }

              $scope.ref = activity.ref || '';
              $scope.content = activity.sentence || '';
              $scope.link = activity.link || '';

              const base = $translate.instant('CLICK_HERE');
              const lastCharacter = $scope.content[$scope.content.length - 1];
              if ($scope.content.length === 0) {
                $scope.linkText = '';
              } else if (['.', '!', '?', ':', ';'].indexOf(lastCharacter) > -1) {
                $scope.linkText = base;
              } else {
                $scope.linkText = base.toLowerCase();
              }
            })
            .catch(function(response) {
              $scope.content = '';
              log('error retrieving activity: %o', response);
            });
        };

        $scope.start = function(trusted) {
          var _ref;
          if (trusted == null) {
            trusted = false;
          }
          if (trusted || !((_ref = $state.current.data) != null ? _ref.hideCmBar : undefined)) {
            $interval.cancel(interval);
            log('start');
            getActivity(trusted);
            interval = $interval(getActivity, $moment.duration(1, 'minutes').asMilliseconds());
          }
        };

        $scope.dismiss = function() {
          log('dismiss');
          $analytics.trackEvent('cm-bar', 'dismiss', $scope.ref);
          $interval.cancel(interval);
          CommunityManagement.update({ref: activity.ref}, {});
          getActivity();
          $scope.start();
        };
        element.find('.info-bar-link').on('click', function() {
          $analytics.trackEvent('cm-bar', 'see', $scope.ref);
          return true;
        });

        const connect = function() {
          if (!isMobile.phone) {
            log('start');
            started = true;
            $scope.start();
          }
        };

        if (userInitializerManager.isInitialized() === true) {
          // $scope.isEnabled = true;
          connect();
        }
        pubsub.subscribe(PUBSUB.USER.CONNECT, function() {
          connect();
        }, $scope);

        const stateChangeEvent = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
          if (!started) {
            return;
          }
          var _ref = toState.data;
          var _ref1 = toState.data;
          if ((_ref != null ? _ref.hideCmBar : undefined) || !(_ref1 != null ? _ref1.auth : undefined)) {
            log('stop');
            $scope.content = '';
            $interval.cancel(interval);
          } else if ($scope.content == null || $scope.content === '') {
            log('restart');
            $scope.start(true);
          }
        });

        $scope.$on('$destroy', function() {
          started = false;
          stateChangeEvent();
        });

        $rootScope.$on('$translateChangeSuccess', function() {
          if (!started || $translate.use() === locale) {
            return;
          }
          log('language changed, restart');
          locale = $translate.use();
          $scope.content = '';
          $interval.cancel(interval);
          $scope.start();
        });
      }
    };
  });

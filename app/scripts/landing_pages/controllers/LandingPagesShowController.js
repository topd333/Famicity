angular.module('famicity')
  .controller('LandingPagesShowController', function(
    $scope, $stateParams, $location, $moment, $state,
    $analytics, LandingPage, sessionManager) {
    'use strict';
    const log = debug('fc-LandingPagesShowController');

    const token_id = $stateParams.token_id;
    const object_id = $stateParams.object_id;
    const object_type = $stateParams.object_type;
    $scope.invitation_data = {};
    $scope.$moment = $moment;
    $scope.locale = sessionManager.getLocale();

    return LandingPage.get_shared_informations({token_id, object_id, object_type}).$promise
      .then(function(response) {
        $scope.object_type = response.landing_page;
        if ($scope.object_type) {
          $state.go('landing.' + $scope.object_type, {notify: false})
            .then(function() {
              $analytics.trackPageView($location.path());
              return sessionManager.setReferral({
                landing: $location.path()
              });
            });
          $scope.invitation_data = (function() {
            log('$scope.object_type=%o', $scope.object_type);
            switch ($scope.object_type) {
              case 'album':
                return response.Album;
              case 'album_bio':
                return response.Album;
              case 'biography':
                return response.Post;
              case 'message':
                return response.Message;
              case 'profile':
                return response.Profile;
              case 'tree':
                return response.User;
              case 'event':
                return response.Event;
              case 'post':
                return response.Post;
              default:
                return response.User;
            }
          })();
          $scope.invitation_data.type = $scope.object_type;
          log('sessionManager.setInvitation(%o)', $scope.invitation_data);
          sessionManager.setInvitation($scope.invitation_data);
        } else {
          return sessionManager.setReferral({
            landing: $location.path()
          });
        }
      });
  });

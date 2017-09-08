angular.module('famicity')
  .controller('EventLikesController', function(
    $scope, $state, $stateParams, navigation, $location, $translate,
    Like, EventResourceService, me, $moment) {
    'use strict';
    $scope.$moment = $moment;
    // TODO: Remove
    $scope.userId = me.id;
    $scope.user = me;

    $scope.viewedUserId = $stateParams.user_Id;

    $scope.objectId = $stateParams.event_id;
    if (!$scope.object) {
      $scope.object = {
        // TODO: Remove postId
        id: $scope.objectId
      };
    } else {
      $scope.object.id = $scope.objectId;
    }

    const object_type = 'event';
    $scope.object.type = object_type;
    $scope.likesList = Like.query({
      object_type: $scope.object.type,
      object_id: $scope.object.id
    });
    $scope.likeText = $scope.object.author_id === $scope.user.id ? 'LIKED_YOUR_EVENT' : 'LIKED_OTHER_EVENT';
    this.eventService = new EventResourceService();
    this.eventService.showEvent($scope.user.id, $stateParams.event_id, $scope);
    $scope.listPageUrl = navigation.href('u.event-likes', {
      event_id: $stateParams.event_id
    });
    $scope.gotoEditEvent = function(tab) {
      navigation.go('u.event-edit', {
        event_id: $scope.object.id,
        tab
      });
    };
  });

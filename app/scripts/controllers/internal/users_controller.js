angular.module('famicity').controller('UserLikesController', function(
  $scope, $translate, $stateParams, Like, profileService,
  LoadingAnimationUtilService, me) {
  'use strict';

  $scope.init = function() {
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    const object_type = 'user';
    profileService.getShortProfile($scope.viewedUserId, $scope).then(function(shortUser) {
      $scope.user = shortUser;
    });
    $scope.likesList = Like.query({
      object_type,
      object_id: $stateParams.user_id
    });
    $scope.likeText = $scope.viewedUserId === $scope.userId ? 'LIKED_YOUR_ARRIVAL' : 'LIKED_OTHER_ARRIVAL';
  };
});

angular.module('famicity')
  .controller('CommentLikesController', function(
    $scope, $translate, $stateParams, Like, me) {
    'use strict';
    $scope.init = function() {
      $scope.userId = me.id;
      $scope.viewedUserId = $stateParams.user_id;
      const object_type = 'comment';
      $scope.likesList = Like.query({
        object_type,
        object_id: $stateParams.comment_id
      });
      if ($scope.viewedUserId === $scope.userId) {
        $scope.likeText = 'LIKED_YOUR_COMMENT';
      } else {
        $scope.likeText = 'LIKED_OTHER_COMMENT';
      }
    };
  });

angular.module('famicity').controller('InternalDeleteUserController', function(
  $scope, $rootScope, $stateParams, userService) {
  'use strict';
  $scope.submitted = false;
  $scope.init = function() {
    userService.destroy($stateParams.user_id, {reason: 'test'});
  };
  $scope.submit = function() {
    $scope.submitted = true;
  };
});

angular.module('famicity')
  .controller('MessagesAbstractController', function(
    $scope, $q, profileService, Message, LoadingAnimationUtilService,
    windowSizeNotification, me) {
    'use strict';
    $scope.isMobile = null;

    LoadingAnimationUtilService.resetPromises();
    LoadingAnimationUtilService.activate();

    $scope.showMode = false;
    $scope.childrenMessagesLoading = false;
    $scope.messagesListControl = {};
    $scope.childrenMessages = {};
    $scope.currentId = '';
    $scope.isReady = $q.defer();
    $scope.userId = me.id;

    function loadDiscussions() {
      const messagesPromise = Message.query({
        user_id: $scope.userId
      }).$promise;
      LoadingAnimationUtilService.addPromises(messagesPromise);
      messagesPromise.then(function(response) {
        $scope.messages = response.messages;
        $scope.isReady.resolve();
      });
    }

    const onChangeResolution = function(message) {
      if ($scope.isMobile === message.mobile) {
        return;
      }
      loadDiscussions();
      $scope.isMobile = message.mobile;
    };

    windowSizeNotification.onWindowChange($scope, onChangeResolution);
    $scope.openReplyMessagePopup = null;
    LoadingAnimationUtilService.addPromises(profileService.getBasicProfile($scope.userId, 'short', $scope));
    LoadingAnimationUtilService.validateList();

    // pubsub.subscribe(PUBSUB.MESSAGES.UNREADCOUNT, function (event, unreadCount) {
    //  loadDiscussions();
    // }, $scope);
  });

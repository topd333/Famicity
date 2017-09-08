angular.module('famicity')
.controller('SettingsNotificationsController', function(
$scope, $state, $location, $stateParams, profileService,
settingsService, LoadingAnimationUtilService, me, menuBuilder) {
  'use strict';
  $scope.userId = $scope.viewedUserId = me.id;
  $scope.settingsId = me.settings.id;

  LoadingAnimationUtilService.resetPromises();
  profileService.getBasicProfile($scope.userId, 'short', $scope);
  let neededSettings = 'newsletter_mails,birthday_reminder_mails,community_mails,new_post_mails,new_album_mails,';
  neededSettings +=
  'comment_answer_all_mails,new_message_mails,subscribe_invitation_mails,event_invitation_mails,event_accept_mails,event_update_mails,';
  neededSettings += 'event_destroy_mails,week_report_mails,like_mails,avatar_mails,event_reminder_mails';
  settingsService.showSettings($scope.userId, $scope.settingsId, neededSettings).$promise.then(function(response) {
    $scope.notifications = response.setting;
  });
  $scope.isSettingsPage = true;

  $scope.submit = function() {
    return settingsService.updateSettings($scope.userId, $scope.settingsId, $scope.notifications);
  };
  menuBuilder.bind('submitAction', $scope.submit, $scope);
});

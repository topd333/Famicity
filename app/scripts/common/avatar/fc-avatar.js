class AvatarController {
  constructor(configuration) {
    this.user = this.user || {};
    this.lazy = this.user.avatar_url &&
    this.user.avatar_url.indexOf('/images/unknown_m.png') < 0 &&
    this.user.avatar_url.indexOf('/images/unknown_f.png') < 0;
    this.user.avatar_url = this.user.avatar_url || configuration.static1Url + '/images/unknown_m.png';
  }

  getStatus() {
    let circleColor;
    if (this.user && (this.user.global_state && this.user.global_state !== 'active' && !this.user.is_invited_by_me) || this.user && this.user.is_blocked_by_me) {
      circleColor = 'gray';
    } else if (this.user && this.user.is_invited_by_me && this.user.is_invited_by_me === true) {
      circleColor = 'orange';
    } else {
      circleColor = 'green';
    }
    return circleColor;
  }
}

angular.module('famicity')
.directive('fcAvatar', function() {
  'use strict';
  return {
    templateUrl: '/scripts/common/avatar/fc-avatar.html',
    replace: true,
    restrict: 'E',
    controllerAs: 'avatar',
    scope: true,
    bindToController: {
      user: '=',
      linkDisabled: '=?'
    },
    controller: AvatarController
  };
});

describe('fc-received-invitation directive', function() {
  'use strict';

  var $compile;
  var $rootScope;

  // Load cached templates
  beforeEach(module('famicity.views'));
  // Load module
  beforeEach(module('famicity', function($provide, $translateProvider) {
    // TODO: Load actual translations ; see http://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
    $translateProvider.translations('fr', {
      AVATAR: {
        SEE_PROFILE_OF: 'Voir le profil de {{user}}'
      }
    });
  }));

  var InvitationService;
  var notification;

  beforeEach(inject(function(_$compile_, _$rootScope_, _InvitationService_, $q, _notification_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    InvitationService = _InvitationService_;
    notification = _notification_;
    spyOn(InvitationService, 'acceptUserInvitation').and.returnValue($q.when());
    spyOn(notification, 'add');
    Bugsnag.notifyException = function(a, b, c) {
      console.log(a);
    };
  }));

  it('supports active user', inject(function() {
    var $scope = $rootScope.$new();
    var user1 = {
      id: 1,
      avatar_url: 'http://host/isac-tive.png',
      user_name: 'Isaac Tive'
    };
    var user2 = {
      id: 2,
      avatar_url: 'http://host/isac-tive.png',
      user_name: 'Isaac Tive'
    };
    $scope.users = [
      user1, user2
    ];
    var finished;
    $scope.itIsFinished = function() {
      finished = true;
    };
    var elem = $compile('<fc-invitations-received data-invitations="users" finished="itIsFinished()"></fc-invitations-received>')($scope);
    $scope.$digest();

    var acceptAll = elem.find('.accept-all');
    var invitationsList = elem.find('.invitations-all-user-list');
    expect(acceptAll).toBeDefined();
    expect(invitationsList).toBeDefined();

    //acceptAll.click();
    //expect(InvitationService.acceptMultiple).toHaveBeenCalled();
    //expect(notification.add).toHaveBeenCalled();
    //expect(finished).toBe(true);
  }));
});

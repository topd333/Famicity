describe('User list item', function() {
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
  var yesnopopin;
  var pubsub;
  var PUBSUB;

  beforeEach(inject(function(_$compile_, _$rootScope_, _InvitationService_, $q, _notification_, _yesnopopin_, _pubsub_, _PUBSUB_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    InvitationService = _InvitationService_;
    notification = _notification_;
    yesnopopin = _yesnopopin_;
    pubsub = _pubsub_;
    PUBSUB = _PUBSUB_;
    spyOn(InvitationService, 'accept').and.returnValue($q.when());
    spyOn(yesnopopin, 'open').and.returnValue($q.when());
    spyOn(notification, 'add');
    Bugsnag.notifyException = function(a, b, c) {
      console.log(a);
    };
  }));

  it('display user', inject(function() {
    var $scope = $rootScope.$new();
    var user1 = {
      id: 101,
      avatar_url: 'http://host/img1.png',
      last_name: 'Beau',
      user_name: 'Jérôme Beau'
    };
    $scope.user = user1;
    var elem = $compile('<fc-user-list-item data-user="user"></fc-user-list-item>')($scope);
    $scope.$digest();

    var userLink = elem.find('a');
    expect(userLink.attr('href')).toBe('/profile/' + user1.id);
    var avatar = userLink.find('img');
    expect(avatar.attr('src')).toBe(user1.avatar_url);
  }));

  var $scope;
  var invitation;
  var me;
  var buttons;

  beforeEach(function() {
    $scope = $rootScope.$new();
    var user = {
      avatar_url: 'http://host/inviter.png',
      email: 'john.inviter@famicity.com',
      first_name: 'John',
      id: 105,
      last_name: 'Inviter',
      sex: 'Male',
      user_name: 'John Inviter'
    };
    invitation = {
      created_date: 1441629779,
      id: 1255004,
      user: user
    };
    me = {
      id: 101,
      avatar_url: 'http://host/img1.png',
      last_name: 'Beau',
      user_name: 'Jérôme Beau'
    };
    $scope.invitation = invitation;
    $scope.me = me;
    $scope.mode = 'received_invit';
    var elem = $compile('<fc-user-list-item user="invitation" me="me" mode="mode"></fc-user-list-item>')($scope);
    $scope.$digest();

    var actions = elem.find('.actions');
    var invitationDate = actions.find('.invitation-date');
    expect(invitationDate).toBeDefined();
    buttons = actions.find('.directory-item-table-cell-invit-buttons');
  });

  it('allows to accept a received invitation', inject(function() {
    var acceptButton = buttons.find('.button-invitations.accept');
    acceptButton.click();
    expect(InvitationService.accept).toHaveBeenCalledWith(me.id, invitation.id, invitation.user);
    $scope.$digest();
    expect(invitation.accepted).toBe(true);
  }));

  it('allows to decline a received sinvitation', inject(function() {
    var declineButton = buttons.find('.button-invitations.decline');
    //declineButton.click();
    //expect(yesnopopin.open).toHaveBeenCalledWith('DIRECTORY.CONFIRM_DELETE_INVITATION');
    //$scope.$digest();
    //expect(InvitationService.remove).toHaveBeenCalledWith(invitation.id, me.id);
    //$scope.$digest();
    //expect(pubsub.publish).toHaveBeenCalledWith(PUBSUB.INVITATIONS.DECLINED, invitation.id);
    //expect(invitation.declined).toBe(true);
  }));
});

describe('Permission service', function() {
  'use strict';

  var $provide;

  // load module
  beforeEach(module('famicity'));

  beforeEach(module(function(_$provide_) {
    $provide = _$provide_;
  }));

  beforeEach(inject(function() {
    // Fake locale setting to avoid locale script loading failure
    $provide.provider('tmhDynamicLocale', function() {
      this.$get = function() {
        var mockedTmhDynamicLocale = {
          set: function(locale) {
            //console.log('Locale set to ' + locale);
          }
        };
        return mockedTmhDynamicLocale;
      };
    });
  }));

  var dummyDefaultPermissions = {
    group_exclusions: [
      {
        id: 11,
        group_name: 'Bad guys'
      }
    ],
    group_permissions: [
      {
        id: 21,
        group_name: 'Family'
      },
      {
        id: 22,
        group_name: 'Friends'
      }
    ],
    user_exclusions: [
      {
        id: 31,
        user_name: 'Bad guy 1'
      },
      {
        id: 32,
        user_name: 'Bad guy 2'
      },
      {
        id: 33,
        user_name: 'Bad guy 3'
      }
    ],
    user_permissions: [
      {
        id: 41,
        user_name: 'Good guy 1',
        avatar_url: 'https://devfront.famicity.com/images/unknown.png',
        email: 'aa@mail.com',
        first_name: 'aa',
        last_name: 'aa',
        is_blocked_by_me: false,
        is_invited_by_me: true,
        group_ids: []
      },
      {
        id: 42,
        user_name: 'Good guy 2'
      },
      {
        id: 43,
        user_name: 'Good guy 3'
      },
      {
        id: 44,
        user_name: 'Good guy 4'
      }
    ]
  };

  beforeEach(inject(function() {
    $provide.provider('Permission', function() {
      this.$get = function() {
        var mockedPermission = {
          get_default: function() {
            var deferred;
            //deferred = $q.defer();
            //deferred.resolve(dummyPermissions);
            //deferred.$promise = deferred.promise;
            deferred = {
              $promise: {
                then: function(callback) {
                  callback(dummyDefaultPermissions);
                }
              }
            };
            return deferred;
          }
        };
        return mockedPermission;
      };
    });
  }));

  var $rootScope;
  var permissionService;

  beforeEach(function() {
    inject(function(_$rootScope_, _permissionService_) {
      $rootScope = _$rootScope_;
      permissionService = _permissionService_;
    });
  });

  it('formats typed permissions', function() {
    var userPermissions = [
      {
        id: 123
      },
      {
        id: 456
      }
    ];
    var groupPermissions = [
      {
        id: 789
      },
      {
        id: 101112
      }
    ];
    expect(permissionService.getFormattedPermissions(userPermissions, groupPermissions)).toEqual('u123,u456,g789,g101112');
  });

  var permissionsSample = [
    {
      id: 123,
      email: 'truc@truc.com',
      type: 'user'
    },
    {
      id: 456,
      email: 'bidule@bid.fr',
      avatar_url: 'http://example.com/img.png',
      type: 'user'
    },
    {
      id: 789,
      name: 'My group',
      type: 'group'
    },
    {
      id: 'email@invite.fr',
      name: 'email@invite.fr'
    },
    {
      id: 1111,
      name: 'email@invite.fr',
      email: 'email@invite.fr',
      type: 'user'
    },
    {
      id: 101112,
      name: 'Other group',
      type: 'group'
    },
    {
      id: 'email2@invite.fr',
      name: 'email2@invite.fr'
    }
  ];

  it('formats heterogeneous permissions', function() {
    expect(permissionService.getHeterogeneousFormattedPermissions(permissionsSample))
      .toEqual('u123,u456,g789,u1111,g101112');
  });

  it('formats invitations', function() {
    expect(permissionService.getInvitations(permissionsSample)).toEqual(['email@invite.fr', 'email2@invite.fr']);
  });

  /*  it('maps permissions', function () {
   var allPermissions = permissionDirective.permissionList(dummyDefaultPermissions);
   var allowed = allPermissions.allowed;
   expect(allowed[0]).toEqual({
   id: 21,
   name: 'Family',
   type: 'allow'
   });
   expect(allowed[1]).toEqual({
   id: 22,
   name: 'Friends',
   type: 'allow'
   });
   expect(allowed[2]).toEqual({
   id: 41,
   name: 'Good guy 1',
   type: 'allow'
   });
   expect(allowed[3]).toEqual({
   id: 42,
   name: 'Good guy 2',
   type: 'allow'
   });
   expect(allowed[4]).toEqual({
   id: 43,
   name: 'Good guy 3',
   type: 'allow'
   });
   expect(allowed[5]).toEqual({
   id: 44,
   name: 'Good guy 4',
   type: 'allow'
   });
   var disallowed = allPermissions.disallowed;
   expect(disallowed[0]).toEqual({
   id: 11,
   name: 'Bad guys',
   type: 'disallow'
   });
   expect(disallowed[1]).toEqual({
   id: 31,
   name: 'Bad guy 1',
   type: 'disallow'
   });
   expect(disallowed[2]).toEqual({
   id: 32,
   name: 'Bad guy 2',
   type: 'disallow'
   });
   expect(disallowed[3]).toEqual({
   id: 33,
   name: 'Bad guy 3',
   type: 'disallow'
   });
   });*/
});

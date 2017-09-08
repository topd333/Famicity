describe('User list', function() {
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

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    Bugsnag.notifyException = function(a, b, c) {
      console.log(a);
    };
  }));

  /**
   * @param item
   * @see fcUserListItemSpec.js for user item contents checking
   */
  function checkUser(item) {
    expect(item.hasClass('removable-item')).toBe(true);
    var userListItem = item.find('fc-user-list-item');
    expect(userListItem[0]).toBeDefined();
  }

  function checkSeparator(sep, letter) {
    expect(sep.hasClass('separator')).toBe(true);
    var sepLetter = sep.find('.directory-listing-letter');
    expect(sepLetter.text()).toBe(letter);
  }

  it('split users according to their last names', inject(function() {
    var $scope = $rootScope.$new();
    var user1 = {
      id: 101,
      avatar_url: 'http://host/img1.png',
      last_name: 'Beau',
      user_name: 'Jérôme Beau'
    };
    var user2 = {
      id: 102,
      avatar_url: 'http://host/img2.png',
      last_name: 'Barbotte',
      user_name: 'Nicolas Barbotte'
    };
    var user3 = {
      id: 103,
      avatar_url: 'http://host/img3.png',
      last_name: 'Lanoix',
      user_name: 'Pascal Lanoix'
    };
    $scope.invitations = [
      user1, user2, user3
    ];
    var elem = $compile('<fc-user-list ng-model="invitations" display-capital="true" load-more="null" filter="filter" disable-search-field="true" selection-mode="false" mode="received_invit" show-alert="false" selected-users="selectedUsers" me="me" display-capital="true"></fc-user-list>')($scope);
    $scope.$digest();

    var filterForm = elem.find('#directory-search-form');
    expect(filterForm).toBeDefined();

    var userList = elem.find('.user-list');
    var items = userList.find('.directory-item');
    // 'B' and 'L'
    var separatorsCount = 2;
    expect(items.length).toBe($scope.invitations.length + separatorsCount);

    checkSeparator($(items[0]), user1.last_name.charAt(0));
    checkUser($(items[1]));
    checkUser($(items[2]));
    checkSeparator($(items[3]), user3.last_name.charAt(0));
    checkUser($(items[4]));

    filterForm.click();
    // TODO: test filtering
  }));
});

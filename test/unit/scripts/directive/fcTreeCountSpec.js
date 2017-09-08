describe('fc-tree-count directive', function() {
  'use strict';
  var $compile,
      $rootScope,
      config;

  // load the tabs code
  // Load module
  beforeEach(module('famicity', function($provide, $translateProvider, configuration) {
    config = configuration;
    $translateProvider.translations('fr', { // TODO: Load actual translations ; see http://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
      'PRESENTATION': {
        'SLIDE_FUSION': {
          'BOTTOM_LINE': '<h2>L’arbre le plus important de Famicity<br>compte déjà <em>{{count|number}}</em> personnes !</h2>'
        },
        'SLIDE_ENGAGE': {
          'TITLE': '<em>{{count|number}}</em><br>familles nous font confiance !'
        }
      }
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    Bugsnag.notifyException = function(a) {
      console.log(a);
    };
  }));

  var $httpBackend;
  var treeCountRequestHandler;

  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    treeCountRequestHandler = $httpBackend.when('GET', config.api_url + '/tree_counters');

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
  }));

  it('displays tree statistics', inject(function() {
    treeCountRequestHandler.respond({'trees_count': 58153, 'max_tree_users_count': '3532'});
    $httpBackend.expectGET(config.api_url + '/tree_counters');  // We expect a single request to satisfy the two directives instantiations below

    var maxTreeUsersCount = $compile('<fc-trees-count key="PRESENTATION.SLIDE_FUSION.BOTTOM_LINE" data-prop="max_tree_users_count"></fc-trees-count>')($rootScope);
    $rootScope.$digest();
    $httpBackend.flush(); // Sends back-end response

    var directiveContents = maxTreeUsersCount.find('h2');
    expect(directiveContents.html()).toBe('L’arbre le plus important de Famicity<br>compte déjà <em>3&nbsp;532</em> personnes&nbsp;!');

    // We do not expect a second request when invoking a second instance of the directive
    var treesCountResult = $compile('<fc-trees-count key="PRESENTATION.SLIDE_ENGAGE.TITLE" data-prop="trees_count"></fc-trees-count>')($rootScope);
    $rootScope.$digest();

    expect(treesCountResult.html()).toBe('<em>58&nbsp;153</em><br>familles nous font confiance&nbsp;!');
  }));

  it('do not display anything in case of a server 500', inject(function() {
    treeCountRequestHandler.respond(500, '');
    $httpBackend.expectGET(config.api_url + '/tree_counters');  // We expect a single request to satisfy the two directives instantiations below

    var maxTreeUsersCount = $compile('<fc-trees-count key="PRESENTATION.SLIDE_FUSION.BOTTOM_LINE" data-prop="max_tree_users_count"></fc-trees-count>')($rootScope);
    $rootScope.$digest();
    $httpBackend.flush(); // Sends back-end response

    expect(maxTreeUsersCount.html()).toBe('');

    // We do not expect a second request when invoking a second instance of the directive
    var treesCountResult = $compile('<fc-trees-count key="PRESENTATION.SLIDE_ENGAGE.TITLE" data-prop="trees_count"></fc-trees-count>')($rootScope);
    $rootScope.$digest();

    expect(treesCountResult.html()).toBe('');
  }));
  it('do not display anything in case of a server 404', inject(function() {
    treeCountRequestHandler.respond(404, '');
    $httpBackend.expectGET(config.api_url + '/tree_counters');  // We expect a single request to satisfy the two directives instantiations below

    var maxTreeUsersCount = $compile('<fc-trees-count key="PRESENTATION.SLIDE_FUSION.BOTTOM_LINE" data-prop="max_tree_users_count"></fc-trees-count>')($rootScope);
    $rootScope.$digest();
    $httpBackend.flush(); // Sends back-end response

    expect(maxTreeUsersCount.html()).toBe('');

    // We do not expect a second request when invoking a second instance of the directive
    var treesCountResult = $compile('<fc-trees-count key="PRESENTATION.SLIDE_ENGAGE.TITLE" data-prop="trees_count"></fc-trees-count>')($rootScope);
    $rootScope.$digest();

    expect(treesCountResult.html()).toBe('');
  }));

});

describe('fc-story-detail directive', function() {
  'use strict';
  var $compile,
      $rootScope;

  // load the tabs code
  // Load module
  beforeEach(module('famicity', function($provide, $translateProvider) {
    $translateProvider.translations('fr', { // TODO: Load actual translations ; see http://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
      'STORY': {
        'LEFT_BLOCK': {
          'TITLE': 'Histoire {vowel, select, true{d\'} other{de }}{ month }',
          'I_PARTICIPATE': 'Je participe à l\'histoire',
          'CLOSES_PARTICIPATED': 'De vos proches (voir)',
          'FAMICITY_PARTICIPATED': 'Membres de Famicity',
          'READ_MORE': 'Lire la suite',
          'THEY_PARTICIPATED': 'Ils ont participé : ',
          'ALL_STORIES': 'Toutes les histoires',
          'SEE_ALL_STORIES': 'Voir toutes les histoires'
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

  beforeEach(inject(function($injector) {
    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
  }));

  it('displays current story info', inject(function() {
    var story = {
      id: 1,
      month: 'Month',
      photo_url: 'https:\/\/photo.com/photo.jpg',
      title: 'Title',
      description: 'Description',
      blog_link: 'https:\/\/blog.com',
      users_participation_count: 2,
      closes_participation_count: 1
    };

    $rootScope.story = story;

    // We do not expect a second request when invoking a second instance of the directive
    var storyDetail = $compile('<fc-story-detail data-story="story"></fc-story-detail>')($rootScope);
    $rootScope.$digest();

    expect(storyDetail.find('h3').html()).toBe('Histoire de ' + story.month);
    expect(storyDetail.find('.story-details .pull-right').html()).toContain(story.description);
    expect(storyDetail.find('.story-details .pull-right').html()).toContain(story.blog_link);
    expect(storyDetail.find('.not-closes .count').html()).toBe(story.users_participation_count.toString());
    expect(storyDetail.find('.closes .count').html()).toBe(story.closes_participation_count.toString());
  }));

  it('does not display anything if there is no story', function() {
    var story = {};
    $rootScope.story = story;

    // We do not expect a second request when invoking a second instance of the directive
    var storyDetail = $compile('<fc-story-detail data-story="story"></fc-story-detail>')($rootScope);
    $rootScope.$digest();

    expect(storyDetail.html()).toContain('<!-- ngIf: ::story.id -->');

    story = null;
    $rootScope.story = story;

    // We do not expect a second request when invoking a second instance of the directive
    storyDetail = $compile('<fc-story-detail data-story="story"></fc-story-detail>')($rootScope);
    $rootScope.$digest();

    expect(storyDetail.html()).toContain('<!-- ngIf: ::story.id -->');
  });

  it('does not display anything if there is an error', function() {
    $rootScope.story = {
      error: {
        status: 200,
        statusText: 'Not Found'
      }
    };

    // We do not expect a second request when invoking a second instance of the directive
    var storyDetail = $compile('<fc-story-detail data-story="story"></fc-story-detail>')($rootScope);
    $rootScope.$digest();

    expect(storyDetail.html()).toContain('<!-- ngIf: ::story.id -->');
  });

});

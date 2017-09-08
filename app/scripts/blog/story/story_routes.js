angular.module('famicity.story', []).config(function(
  $stateProvider) {
  'use strict';

  const lastStoriesPromise = (Story) => Story.query({include_current: false}).$promise;
  const storyPromise = (Story, $stateParams) => Story.get({id: $stateParams.id}).$promise;

  $stateProvider
    .state('u.story', {
      url: '/story',
      abstract: true
    })
    .state('u.story.list', {
      url: '',
      views: {
        '@': {
          templateUrl: '/scripts/blog/story/list/StoryList.html',
          controller: 'StoryListController'
        }
      },
      resolve: {
        stories: (Story) => Story.query().$promise
      }
    })
    .state('u.story.get', {
      url: '/:id',
      views: {
        '@': {
          templateUrl: '/scripts/blog/story/StoryGet.html',
          controller: 'StoryGetController'
        }
      },
      resolve: {
        posts: (Story, $stateParams, $q) => $q((resolve) => {
          Story.getPosts({id: $stateParams.id}).$promise.then(function(posts) {
            posts = posts.map(function(el) {
              el.type = 'story';
              return {post: el};
            });
            resolve(posts);
          });
        }),
        story: storyPromise,
        lastStories: lastStoriesPromise,
        menu: (menuBuilder) => menuBuilder.newMenu().build()
      },
      data: {
        stateClass: 'story-page'
      }
    })
    .state('u.story.create', {
      url: '/add',
      views: {
        '@': {
          templateUrl: '',
          controller: ''
        }
      }
    }).state('u.story.edit', {
      url: '/edit',
      views: {
        '@': {
          templateUrl: '',
          controller: ''
        }
      }
    });

});

angular.module('famicity').config(function($stateProvider) {
  'use strict';
  return $stateProvider
    .state('landing', {
      url: '/landing?token_id&object_id&object_type&email',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_page.html',
          controller: 'LandingPagesShowController'
        }
      },
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-album'
      }
    })
    .state('landing.album', {
      url: '/album',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-album'
      }
    })
    .state('landing.album_bio', {
      url: '/album_bio',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-album_bio'
      }
    })
    .state('landing.biography', {
      url: '/biography',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-biography'
      }
    }).state('landing.message', {
      url: '/message',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-message'
      }
    }).state('landing.profile', {
      url: '/profile',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-profile'
      }
    }).state('landing.tree', {
      url: '/tree',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-tree'
      }
    }).state('landing.event', {
      url: '/event',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-event'
      }
    }).state('landing.post', {
      url: '/post',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-post'
      }
    })
    .state('landing.invitation', {
      url: '/invitation',
      data: {
        stateClass: 'public-content invited-landing-page invited-landing-page-invitation'
      }
    })
    .state('landing-mcdo-redirection', {
      url: '/search-your-ancestors',
      views: {
        '@': {
          controller($state) {
            $state.go('landing-mcdo');
          }
        }
      }
    }).state('landing-share-pictures', {
      url: '/landing/share-pictures',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_share_pictures.html',
          controller: 'LandingSharePicturesController'
        }
      },
      data: {
        stateClass: 'news-feed share-picture parallax-page'
      }
    }).state('landing-share-pictures-ab', {
      url: '/landing/share-pictures/:version',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_share_pictures.html',
          controller: 'LandingSharePicturesController'
        }
      },
      data: {
        stateClass: 'news-feed share-picture parallax-page'
      }
    }).state('landing-share-history', {
      url: '/landing/share-history',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_share_history.html',
          controller: 'LandingShareHistoryController'
        }
      },
      data: {
        stateClass: 'news-feed share-history parallax-page'
      }
    }).state('landing-share-history-ab', {
      url: '/landing/share-history/:version',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_share_history.html',
          controller: 'LandingShareHistoryController'
        }
      },
      data: {
        stateClass: 'news-feed share-history parallax-page'
      }
    }).state('landing-share-memories', {
      url: '/landing/share-memories',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_share_memories.html',
          controller: 'LandingShareMemoriesController'
        }
      },
      data: {
        stateClass: 'family-tree share-memories parallax-page'
      }
    }).state('landing-share-memories-ab', {
      url: '/landing/share-memories/:version',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_share_memories.html',
          controller: 'LandingShareMemoriesController'
        }
      },
      data: {
        stateClass: 'family-tree share-memories parallax-page'
      }
    }).state('landing-my-story', {
      url: '/landing/my-story',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_my_story.html',
          controller: 'LandingMyStoryController'
        }
      },
      data: {
        stateClass: 'famicity-presentation my-story parallax-page'
      }
    })
    .state('landing-my-story-ab', {
      url: '/landing/my-story/:version',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_my_story.html',
          controller: 'LandingMyStoryController'
        }
      },
      data: {
        stateClass: 'famicity-presentation my-story parallax-page'
      }
    })
    .state('landing-my-feed', {
      url: '/landing/my-feed',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_my_feed.html',
          controller: 'LandingMyFeedController'
        }
      },
      data: {
        stateClass: 'famicity-presentation my-feed parallax-page'
      }
    }).state('landing-my-feed-ab', {
      url: '/landing/my-feed/:version',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_my_feed.html',
          controller: 'LandingMyFeedController'
        }
      },
      data: {
        stateClass: 'famicity-presentation my-feed parallax-page'
      }
    }).state('landing-my-memories', {
      url: '/landing/my-memories',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_my_memories.html',
          controller: 'LandingMyMemoriesController'
        }
      },
      data: {
        stateClass: 'famicity-presentation my-memories parallax-page'
      }
    }).state('landing-my-memories-ab', {
      url: '/landing/my-memories/:version',
      views: {
        '@': {
          templateUrl: '/scripts/landing_pages/views/landing_my_memories.html',
          controller: 'LandingMyMemoriesController'
        }
      },
      data: {
        stateClass: 'famicity-presentation my-memories parallax-page'
      }
    });
});

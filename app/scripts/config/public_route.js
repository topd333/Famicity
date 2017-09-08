angular.module('famicity')
  .config(function($stateProvider, $urlRouterProvider, $i18nUrlMatcherFactoryProvider) {
    'use strict';

    const localeRegex = '[a-z]{2}(?:-[a-z]{2})?';
    const log = debug('fc-i18n');

    const setLocale = [
      '$rootScope', '$q', '$state', '$stateParams', 'userManager', 'sessionManager',
      function($rootScope, $q, $state, $stateParams, userManager, sessionManager) {
        let params;
        const defer = $q.defer();
        let locale = $stateParams.locale;
        // let prepend = $state.current.data && $state.current.data && $state.current.data.prepend ? $state.current.data.prepend : '';
        const prepend = this.self.resolve.prepend ? this.self.resolve.prepend() : ''; // eslint-disable-line
        log('route: %o, locale: %o', this.self.name, locale); // eslint-disable-line
        // If the locale is not en or fr
        if (locale && (locale !== 'fr' && locale !== 'en' && locale !== 'default')) {
          log('incorrect locale: %o, use %o', locale, 'fr');
          locale = 'fr';
          userManager.setLocale(locale);
          defer.reject({
            cause: 'incorrect-locale',
            params: {
              locale
            }
          });
        }
        // If the locale is not defined in the route
        if (locale === 'default' || !locale) {
          locale = sessionManager.getLocale();
          if (!locale) {
            locale = 'fr';
            sessionManager.setLocale(locale);
          }
          if (this.parent.self.name !== 'public') { // eslint-disable-line
            params = $stateParams ? $stateParams : {};
            params.locale = locale;
            defer.reject({
              cause: 'missing-locale',
              params: {
                state: 'public.' + prepend + this.self.name, // eslint-disable-line
                locale
              }
            });
            log('missing locale, redirect to %o with locale: %o', 'public.' +
              prepend + this.self.name, params.locale); // eslint-disable-line
          }
        }
        if (locale !== sessionManager.getLocale()) {
          userManager.setLocale(locale);
        }
        $rootScope.locale = locale;
        defer.resolve(locale);
        return defer.promise;
      }
    ];

    const categories = (Help) => Help.categories({locale: 'fr'}).$promise;

    return $stateProvider
      .state('public', {})
      .state('base', {
        url: '/?email&password',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.base', {
        url: '/{locale:' + localeRegex + '}?email&password',
        views: {
          '@': {
            template: '<div ui-view="signForm"></div>',
            controller: 'WelcomeController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'homepage'
        }
      })
      .state('public.base.signUp', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/sign-up?email&password&redirect',
          fr: '/{locale:' + localeRegex + '}/inscrivez-vous?email&password&redirect'
        }),
        views: {
          signForm: {
            template: `<fc-sign-up
            class="sign-up"
            showcase="true"
            data-page-scrolling="false"
            data-app-icons="false"
            data-locale="{{locale}}"
            data-intro-text="WELCOME.BASELINE_START_STORY_1"
            data-intro-text-2="WELCOME.BASELINE_START_STORY_2"></fc-sign-up>`
          }
        },
        data: {
          stateClass: 'homepage'
        }
      })
      .state('404', {
        url: '/unknown',
        views: {
          '@': {
            templateUrl: '/views/404.html',
            controller: 'Error404Controller'
          }
        },
        data: {
          stateClass: 'error404'
        }
      }).state('500', {
        url: '/500',
        views: {
          '@': {
            templateUrl: '/views/500.html',
            controller: 'Error500Controller'
          }
        },
        data: {
          stateClass: 'error500'
        }
      }).state('public.welcome', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/welcome?email&password',
          fr: '/{locale:' + localeRegex + '}/bienvenue?email&password'
        }),
        views: {
          '@': {
            template: '<div ui-view="signForm"></div>',
            controller: 'WelcomeController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'homepage'
        }
      }).state('welcome', {
        url: '/welcome?email&password',
        resolve: {
          locale: setLocale
        }
      }).state('public.base.sign-in', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/sign-in?email&password&redirect',
          fr: '/{locale:' + localeRegex + '}/connectez-vous?email&password&redirect'
        }),
        views: {
          signForm: {
            template: '<fc-sign-in data-locale="{{locale}}" data-page-scrolling="false"></fc-sign-in>'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'signin'
        }
      })
      .state('sign-in', {
        url: '/sign-in?email&password&redirect',
        resolve: {
          locale: setLocale,
          prepend: () => 'base.'
        }
      })
      .state('public.cookies', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/cookies',
          fr: '/{locale:' + localeRegex + '}/cookies'
        }),
        views: {
          '@': {
            templateUrl: '/views/cookies.html',
            controller: 'CookiesController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'cookies public-content'
        }
      })
      .state('cookies', {
        url: '/cookies',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.economical-model', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/economical-model',
          fr: '/{locale:' + localeRegex + '}/modele-economique'
        }),
        views: {
          '@': {
            templateUrl: '/views/economical-model.html',
            controller: 'EconomicalModelController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'economical-model parallax-page'
        }
      }).state('economical-model', {
        url: '/economical-model',
        resolve: {
          locale: setLocale
        }
      }).state('public.album', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/album',
          fr: '/{locale:' + localeRegex + '}/album'
        }),
        views: {
          '@': {
            templateUrl: '/views/album.html',
            controller: 'AlbumController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'album parallax-page'
        }
      }).state('album', {
        url: '/album',
        resolve: {
          locale: setLocale
        }
      }).state('public.directory', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/directory',
          fr: '/{locale:' + localeRegex + '}/annuaire'
        }),
        views: {
          '@': {
            templateUrl: '/views/directory.html',
            controller: 'DirectoryPresentationController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'directory parallax-page'
        }
      }).state('directory', {
        url: '/directory',
        resolve: {
          locale: setLocale
        }
      }).state('public.calendar', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/calendar',
          fr: '/{locale:' + localeRegex + '}/calendrier'
        }),
        views: {
          '@': {
            templateUrl: '/views/calendar.html',
            controller: 'CalendarController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'calendar parallax-page'
        }
      }).state('calendar', {
        url: '/calendar',
        resolve: {
          locale: setLocale
        }
      }).state('public.mail', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/mail',
          fr: '/{locale:' + localeRegex + '}/messagerie'
        }),
        views: {
          '@': {
            templateUrl: '/views/mail.html',
            controller: 'MailModelController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'mail parallax-page'
        }
      })
      .state('mail', {
        url: '/mail',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.news-feed', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/news-feed',
          fr: '/{locale:' + localeRegex + '}/actualites'
        }),
        views: {
          '@': {
            templateUrl: '/views/news-feed.html',
            controller: 'NewsFeedController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'news-feed parallax-page'
        }
      })
      .state('news-feed', {
        url: '/news-feed',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.famicity-presentation', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/famicity-presentation',
          fr: '/{locale:' + localeRegex + '}/presentation-famicity'
        }),
        views: {
          '@': {
            templateUrl: '/views/famicity-presentation.html',
            controller: 'FamicityPresentationController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'famicity-presentation parallax-page'
        }
      })
      .state('famicity-presentation', {
        url: '/famicity-presentation',
        resolve: {
          locale: setLocale
        }
      }).state('public.profile', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/profile',
          fr: '/{locale:' + localeRegex + '}/profil'
        }),
        views: {
          '@': {
            templateUrl: '/views/profile.html',
            controller: 'ProfileController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'profile parallax-page'
        }
      })
      .state('profile', {
        url: '/profile',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.privacy', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/privacy',
          fr: '/{locale:' + localeRegex + '}/vie-privee'
        }),
        views: {
          '@': {
            templateUrl: '/views/privacy.html',
            controller: 'PrivacyController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'privacy parallax-page'
        }
      })
      .state('privacy', {
        url: '/privacy',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.family-tree', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/family-tree',
          fr: '/{locale:' + localeRegex + '}/arbre-genealogique'
        }),
        views: {
          '@': {
            templateUrl: '/views/family-tree.html',
            controller: 'FamilyTreeController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'family-tree parallax-page'
        }
      })
      .state('family-tree', {
        url: '/family-tree',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.terms', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/terms',
          fr: '/{locale:' + localeRegex + '}/conditions'
        }),
        views: {
          '@': {
            templateUrl: '/views/terms.html',
            controller: 'TermsController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'terms public-content'
        }
      })
      .state('terms', {
        url: '/terms',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.about', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/about',
          fr: '/{locale:' + localeRegex + '}/a-propos'
        }),
        views: {
          '@': {
            templateUrl: '/views/about.html',
            controller: 'AboutController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'about public-content'
        }
      })
      .state('about', {
        url: '/about',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.helps', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/help',
          fr: '/{locale:' + localeRegex + '}/aide'
        }),
        views: {
          '@': {
            templateUrl: '/scripts/helps/Helps.html',
            controller: 'HelpsController'
          }
        },
        resolve: {
          locale: setLocale,
          categories
        },
        data: {
          stateClass: 'help public-content'
        }
      })
      .state('helps', {
        url: '/helps',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.helps-category', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/help/:category_id/page',
          fr: '/{locale:' + localeRegex + '}/aide/:category_id/page'
        }),
        views: {
          '@': {
            templateUrl: '/scripts/helps/Helps.html',
            controller: 'HelpsController'
          }
        },
        resolve: {
          locale: setLocale,
          categories
        },
        data: {
          stateClass: 'help public-content'
        }
      })
      .state('helps-category', {
        url: '/helps/:category_id/page',
        resolve: {
          locale: setLocale
        }
      }).state('public.helps-answer', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/help/:answer_id',
          fr: '/{locale:' + localeRegex + '}/aide/:answer_id'
        }),
        views: {
          '@': {
            templateUrl: '/scripts/helps/Helps.html',
            controller: 'HelpsController'
          }
        },
        resolve: {
          locale: setLocale,
          categories
        },
        data: {
          stateClass: 'help public-content'
        }
      })
      .state('helps-answer', {
        url: '/helps/:answer_id',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.helps-search', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/help-search/:search_string',
          fr: '/{locale:' + localeRegex + '}/aide-recherche/:search_string'
        }),
        views: {
          '@': {
            templateUrl: '/scripts/helps/Helps.html',
            controller: 'HelpsController'
          }
        },
        resolve: {
          locale: setLocale,
          categories
        },
        data: {
          stateClass: 'help public-content'
        }
      }).state('helps-search', {
        url: '/helps-search/:search_string',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.contact', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/contact',
          fr: '/{locale:' + localeRegex + '}/contact'
        }),
        views: {
          '@': {
            templateUrl: '/scripts/tickets/controllers/TicketsCreate.html',
            controller: 'TicketsCreateController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'contact-us-s1'
        }
      })
      .state('contact', {
        url: '/contact',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.password_recoveries', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/password_recoveries?email',
          fr: '/{locale:' + localeRegex + '}/mot_de_passe_oublie?email'
        }),
        views: {
          '@': {
            templateUrl: '/scripts/users/passwords/forgotten-password-s1.html',
            controller: 'PasswordController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'reset-password-s1'
        }
      })
      .state('password_recoveries', {
        url: '/password_recoveries?email',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.landing-mcdo', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/landing/search-your-ancestors',
          fr: '/{locale:' + localeRegex + '}/landing/cherche-tes-ancetres'
        }),
        views: {
          '@': {
            templateUrl: '/scripts/landing_pages/views/landing_mcdo.html',
            controller: 'LandingMcdoController'
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'public-content landing-page-mcdo'
        }
      })
      .state('landing-mcdo', {
        url: '/landing/search-your-ancestors',
        resolve: {
          locale: setLocale
        }
      })
      .state('public.sign-out', {
        url: $i18nUrlMatcherFactoryProvider.compile({
          en: '/{locale:' + localeRegex + '}/sign-out',
          fr: '/{locale:' + localeRegex + '}/deconnexion'
        }),
        views: {
          '@': {
            templateUrl: '/scripts/common/util/auth/views/sign-out.html',
            controller: ($scope, locale) => $scope.locale = locale
          }
        },
        resolve: {
          locale: setLocale
        },
        data: {
          stateClass: 'public-content sign-out'
        }
      })
      .state('sign-out', {
        url: '/sign-out',
        resolve: {
          locale: setLocale
        }
      });
  });

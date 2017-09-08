'use strict';

describe('Public routes', function() {
  it('should be internationalized', function() {
    var launchTests = function(urls) {
      urls.forEach(function(url) {
        browser.get(url.replace('https://www.famicity.com', '')).then(function() {
          browser.getTitle().then(function(title) {
            if (!/Famicity - .+/.test(title)) {
              console.log('----Missing i18n data----\n' + url);
              console.log(title);
              $('meta[name="description"]').getAttribute('content').then(function(content) {
                console.log(content);
              });
            }
          });

          expect(browser.getTitle()).toMatch(/Famicity - .+/);
          expect(browser.getCurrentUrl()).toMatch(/\/[a-z]{2}(?:-[a-z]{2})?(?:\/.*)?\/?$/);
          expect($('meta[name="description"]').getAttribute('content')).not.toBe('');
          expect($('link[rel="alternate"]').isPresent()).toBe(true);
        });
      });
    };

    browser.driver.get(browser.baseUrl + '/sitemap.xml').then(function() {
      browser.driver.findElements(by.css('loc')).then(function(locations) {
        var total = locations.length;
        var urls = [];
        var done = 0;
        var helpsDone = false;
        locations.forEach(function(location) {
          location.getInnerHtml().then(function(url) {
            if (!/\/helps\/\d+/.test(url) || !helpsDone) {
              urls.push(url);
              if (/\/helps\/\d+/.test(url)) {
                helpsDone = true;
              }
            }
            done++;
            if (done === total) {
              expect(urls.length).toBeGreaterThan(0);
              launchTests(urls);
            }
          });
        });
      });
    });
  });
});

describe('Routes from emails and CM bar', function() {
  it('should be valid', function() {
    var currentRoutes = [
      // tree
      '/users/:user_id/tree',
      // user
      '/users/:user_id/profile',
      '/users/:user_id/directory',
      // messages
      '/messages',
      '/messages/:message_id',
      '/messages/add',
      // directory
      '/u/directory',
      // posts
      '/users/:user_id/blog',
      '/users/:user_id/blog/posts/:post_id/show',
      '/users/:user_id/blog/add',
      // albums
      '/users/:user_id/albums',
      '/users/:user_id/albums/:album_id/show',
      '/users/:user_id/albums/:album_id/photos/:photo_id',
      // avatars
      '/users/:user_id/profile/photos',
      '/users/:user_id/profile/photos/item/:photo_id',
      // events
      '/users/:user_id/calendar/:event_id/show',
      '/users/:user_id/calendar',
      // gedcom import
      '/tree/:user_id/gedcom/import',
      // tickets
      '/view_ticket/:ticket_id/:token',
      // fusions
      '/tree/:user_id/fusions/received',
      // user parameters
      '/reset_password/:user_id/:token',
      '/notifications/:user_id/:token',
      // help
      '/users/:user_id/helps/:help_id'
    ];

    var oldRoutes = [
      // messages
      '/users/:user_id/messages/add',
      // directory
      '/users/:user_id/directory',
      // fusions
      '/users/:user_id/fusions/received',
      // gedcom
      '/users/:user_id/gedcom/index',
      '/users/:user_id/gedcom/import',
      '/users/:user_id/gedcom/upload',
      '/users/:user_id/gedcom/:gedcom_id/details',
      // tree
      '/users/:user_id/tree',
      // profile
      '/users/:user_id/profile'
    ];

    var routes = currentRoutes.concat(oldRoutes);

    routes.forEach(function(url) {
      url = url
        .replace(':user_id', 6252)
        .replace(':message_id', 1842)
        .replace(':post_id', 874001)
        .replace(':album_id', 766188)
        .replace(':photo_id', 19699328)
        .replace(':event_id', 13391)
        .replace(':help_id', 961)
        .replace(':ticket_id', 0)
        .replace(':token', 0)
        .replace(':gedcom_id', 123);
      browser.get(url);
      expect(browser.getCurrentUrl()).not.toContain('404');
    });
  });

  it('should have a redirect param when not signed in', function() {
    browser.get('/messages');
    expect(browser.getCurrentUrl()).toContain('redirect=');
  });
});

describe('Old routes', function() {
  it('should redirect to new ones', function() {
    var routes = [
      // messages
      '/users/:user_id/messages/add',
      '/users/:user_id/messages',
      // home & feed
      '/users/:user_id/home',
      '/users/:user_id/feed',
      // settings
      '/users/:user_id/settings/:settings_id',
      '/users/:user_id/settings/:settings_id/account',
      '/users/:user_id/settings/:settings_id/locale',
      '/users/:user_id/settings/:settings_id/locale/language',
      '/users/:user_id/settings/:settings_id/locale/calendar',
      '/users/:user_id/settings/:settings_id/privacy',
      '/users/:user_id/settings/:settings_id/privacy/default_rights/edit',
      '/users/:user_id/settings/:settings_id/privacy/search_engine',
      '/users/:user_id/settings/:settings_id/privacy/tree_rights/edit',
      '/users/:user_id/settings/:settings_id/notifications',
      '/users/:user_id/settings/:settings_id/terms',
      '/users/:user_id/settings/:settings_id/unsubscription',
      '/users/:user_id/settings/:settings_id/contact'
    ];

    routes.forEach(function(url) {
      url = url
        .replace(':user_id', 6252)
        .replace(':message_id', 1842)
        .replace(':post_id', 874001)
        .replace(':album_id', 766188)
        .replace(':photo_id', 19699328)
        .replace(':settings_id', 123456)
        .replace(':event_id', 13391)
        .replace(':ticket_id', 0)
        .replace(':token', 0);
      browser.get(url);
      expect(browser.getCurrentUrl()).not.toContain('404');
    });
  });
});

describe('Unknown routes', function() {
  it('should return a 404 page', function() {
    ['/messages/id/123', '/incorrect'].forEach(function(url) {
      browser.get(url);
      // expect(browser.getCurrentUrl()).toContain('404');
      browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
          return /404/.test(url);
        });
      }).then(function(answer) {
        expect(answer).toBe(true);
      });
    });
  });
});

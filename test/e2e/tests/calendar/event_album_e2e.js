'use strict';

var helper = require('../../helper');
var calendar = require('../../pages/CalendarPage')();
var header = require('../../pages/HeaderComponent')();
var moment = require('moment');
var faker = require('faker');
var ev;
var albumPage = require('../../pages/AlbumPage')();
var feed = require('../../pages/FeedPage')();

moment.locale('fr');

describe('Event album', function() {

  var numberOfPictures = browser.browserName === 'chrome' ? 2 : 1;

  it('user sign up', function() {
    helper.createUser();
  });

  it('create an event', function() {
    var eventName = faker.lorem.sentence().slice(0, 20);
    var start = moment()
      .year(faker.random.number({min: 1900, max: 2500}))
      .month(faker.random.number({min: 1, max: 12}))
      .day(faker.random.number({min: 1, max: 29}))
      .hour(faker.random.number({min: 0, max: 12}))
      .minutes(faker.random.number({min: 0, max: 59}));
    var end = start.clone()
      .hour(faker.random.number({min: 13, max: 23}))
      .minutes(faker.random.number({min: 0, max: 59}));
    var eventLocation = faker.lorem.sentence().slice(0, 20);
    var reminder = false;
    var description = faker.lorem.paragraph();
    var color = faker.random.array_element([null, 'green', 'blue', 'purple']);

    ev = {
      name: eventName, start: start, end: end, location: eventLocation, allDay: false,
      reminder: reminder, description: description, color: color
    };

    calendar.get();
    calendar.addEventButton.click();
    calendar.write(ev);
  });

  it('add an album', function() {
    calendar.showAlbums.click();
    $('.hidden-xs .btn-primary.btn-lg').click();
    albumPage = require('../../pages/AlbumPage')();
    var title = faker.lorem.sentence().slice(0, 49);
    var description = faker.lorem.paragraph();
    albumPage.createAlbum({title: title, description: description});
    albumPage.hasEventLink();
    albumPage.get();
    albumPage.hasAlbum(title);
    // TODO: check the album is present in the event page
  });

  it('the album is not present in the feed', function() {
    feed.get();
    feed.hasAlbum(false);
  });

  it('add picture', function() {
    albumPage.get();
    browser.element.all(by.repeater('album in albums')).get(0).click();
    albumPage.addPictures(numberOfPictures);
    $('a[ui-sref="u.albums-show({user_id: viewedUserId, album_id: albumId})"].button-inserted-right').click();
    expect(albumPage.photos.count()).toBe(numberOfPictures);
  });

  it('the album is present in the feed', function() {
    feed.get();
    feed.hasAlbum();
  });

  it('sign out', function() {
    header.signOut();
  });
});

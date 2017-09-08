'use strict';

var helper = require('../../helper');
var faker = require('faker');
var albumPage = require('../../pages/AlbumPage')();
var header = require('../../pages/HeaderComponent')();
var feed = require('../../pages/FeedPage')();
var title;
var description;

describe('Album', function() {
  var numberOfPictures = browser.browserName === 'chrome' ? 2 : 1;

  it('user sign up', function() {
    helper.createUser();
  });

  it('initiate album creation', function() {
    albumPage.get();
    albumPage.initiateCreation();
  });

  it('create an album', function() {
    title = faker.lorem.sentence().slice(0, 49);
    description = faker.lorem.paragraph();
    albumPage.createAlbum({title: title, description: description});
    albumPage.get();
    albumPage.hasAlbum(title);
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

  it('edit the picture information', function() {
    var date = helper.dateFr(faker.date.past());
    var description = faker.lorem.sentence().slice(0, 49);
    var leftBlock = $('.col-sm-4.hidden-xs');
    albumPage.photos.get(0).click();
    expect(leftBlock.getText()).toContain('Vous n\'avez pas encore ajouté d\'informations à cette photo.');
    $('a[ng-click="openPhotoDescriptionPopup()"].green-link-color').click();
    browser.element(by.model('photoEditCopy.description')).sendKeys(description);
    browser.element(by.model('value')).sendKeys(date);
    $('.popin-dialog .btn-primary').click();
    expect(leftBlock.getText()).toContain(description);
    expect(leftBlock.getText()).toContain(date);
  });

  it('the album is present in the feed', function() {
    feed.get();
    feed.hasAlbum();
  });

  it('sign out', function() {
    header.signOut();
  });
});

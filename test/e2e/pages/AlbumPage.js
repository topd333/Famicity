'use strict';

var helper = require('../helper');
var Page = require('../helpers/Page');

function AlbumPage(browser) {
  Page.apply(this, arguments);
  this.browser = browser;

  this.createButton = this.browser.$$('.left-column-block-header.btn-primary').get(0);
  this.albums = this.browser.element(by.repeater('album in albums'));
  this.photos = this.browser.element.all(by.repeater('photo in ::photos'));
}

AlbumPage.prototype = Object.create(Page.prototype);
AlbumPage.prototype.constuctor = AlbumPage;

AlbumPage.prototype.get = function() {
  return this.header.get('albums');
};

AlbumPage.prototype.initiateCreation = function() {
  this.createButton.click();
  expect(this.browser.getCurrentUrl()).toMatch(/\/users\/\d*\/albums\/add/);
};

AlbumPage.prototype.fillForm = function(album) {
  album.title &&
  this.browser.$('[data-key="title"] input').clear().sendKeys(album.title);
  album.description &&
  this.browser.element(by.model('model.textValue')).clear().sendKeys(album.description);
  album.location &&
  this.browser.element(by.model('formData.album.location')).clear().sendKeys(album.location);
  album.event_date &&
  this.browser.$('div[data-key="location"] input').clear().sendKeys(album.event_date);
};

AlbumPage.prototype.createAlbum = function(album) {
  this.fillForm(album);
  this.browser.$('.btn-primary').click();
  helper.hasSuccess('L\'album a été créé avec succès.', this.browser);
  album.title &&
  expect(this.browser.$('p[ng-show="album.title"] .ng-binding').getText()).toBe(album.title.trim());
  // album.description &&
  //  expect(this.browser.$('p[ng-show="album.description"] .ng-binding').getText()).toBe(album.description.trim());
  album.location &&
  expect(this.browser.$('p[ng-show="album.location"] .ng-binding').getText()).toBe(album.location);
  album.event_date &&
  expect(this.browser.$('p[ng-show="album.event_date"] .ng-binding').getText()).toBe(album.event_date);
  album.pictures &&
  this.addPictures(album.pictures);
};

AlbumPage.prototype.hasEventLink = function() {
  expect(this.browser.$('a[ng-show="album.event_id"]').isPresent()).toBe(true);
};

AlbumPage.prototype.hasAlbum = function(name) {
  // Name is trimmed and cut when too long
  name = name.trim().slice(0, 10);
  expect(this.albums.getText()).toContain(name);
};

AlbumPage.prototype.addPictures = function(number) {
  number = number || 1;
  var absolutePath = '';
  for (var i = 0; i < number; i++) {
    absolutePath += helper.imgPath + '\n';
  }
  absolutePath = absolutePath.replace(/\n$/, '');
  var uploader = this.browser.$('#photoUploadBtn');
  uploader.$('input[type="file"]').sendKeys(absolutePath);
  // wait for the banner to appear
  var self = this;
  this.browser.wait(function() {
    return self.browser.$('.alert.alert-success').isPresent().then(function(present) {
      return present;
    });
  }, number * 5000);
  helper.hasSuccess('Vos photos ont bien été ajoutées !', this.browser);
};

module.exports = function(customBrowser) {
  return new AlbumPage(customBrowser || browser);
};

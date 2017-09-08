'use strict';

var helper = require('./../../helper');
var header = require('./../../pages/HeaderComponent')();
var profile = require('./../../pages/ProfilePage')();

describe('Profile Avatar', function() {
  it('[user signs up]', function() {
    helper.createUser();
  });

  it('[user goes to his profile page]', function() {
    profile.get();
  });

  it('should show the default avatar', function() {
    expect(profile.avatar.getAttribute('src')).toContain('images/unknown_m.png');
  });

  it('clicking on the avatar should open the empty avatar album', function() {
    profile.avatar.click();
    expect(browser.getCurrentUrl()).toMatch(/profile\/\d+\/photos/);
    expect(browser.$('div[ng-show="avatars.length == 0"]').isDisplayed()).toBe(true);
  });

  it('add a picture', function() {
    profile.fileInput.sendKeys(helper.imgPath);
    browser.sleep(3000);
  });

  // The crop step has been disabled for now
  xit('go through the crop step', function() {
    expect(browser.getCurrentUrl()).toMatch(/profile\/\d+\/photos\/crop\/\d+/);
    browser.$('a[ng-click="validate()"]').click();
    expect(browser.getCurrentUrl()).toMatch(/profile\/\d+\/photos/);
  });

  it('the avatar has been added', function() {
    expect(browser.element.all(by.repeater('avatar in avatars')).count()).toBe(1);
  });

  it('[user signs out]', function() {
    header.signOut();
  });
});

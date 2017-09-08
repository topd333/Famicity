'use strict';

var email;
var user;
var helper = require('./../../helper');
var header = require('./../../pages/HeaderComponent')();

describe('Profile', function() {
  it('signs up', function() {
    user = helper.createUser();
  });

  it('can visit his profile page', function() {
    header.get('profile');
  });

  it('can update his personal data', function() {
    $$('.btn-icon-primary').get(0).click();
    expect(browser.getCurrentUrl()).toMatch(/\/profile\/\d*\/edit/);
    browser.element(by.model('user.first_name')).clear().sendKeys('first_name');
    browser.element(by.model('user.last_name')).clear().sendKeys('last_name');
    browser.element(by.model('user.middle_name')).clear().sendKeys('middle_name');
    browser.element(by.model('user.birth_date')).element(by.model('value')).clear().sendKeys(helper.dateFr(new Date(2000, 0, 1)));
    browser.element(by.model('user.birth_place')).clear().sendKeys('birth_place');
    browser.element(by.model('user.company')).clear().sendKeys('company');
    browser.element(by.model('user.job')).clear().sendKeys('job');
    $('.green-button-standard').click();
    helper.hasSuccess();
    expect(browser.getCurrentUrl()).toMatch(/\/profile\/\d*\/?$/);
    expect($$('.profile-top-block-info h2').get(0).getText()).toBe('First_name LAST_NAME');
    expect($$('.left-block-profile-details span').get(0).getText()).toContain('01/01/2000');
    expect($('.profile-top-block-info h3:nth-child(3)').getText()).toBe('birth_place');
    var personalInfo = browser.element.all(by.repeater('(key, info) in user.personalInfos'));
    expect(personalInfo.get(0).getText()).toContain('middle_name');
    expect(personalInfo.get(2).getText()).toContain('company');
    expect(personalInfo.get(4).getText()).toContain('job');
  });

  it('has a identifier email address', function() {
    expect($('.view-profile-holder>div:nth-child(2) .view-profile-editable-email').getText()).toBe(user.email.toLowerCase());
  });

  it('has a personnal email address, which is not validated', function() {
    var emailList = element.all(by.repeater('user.user_emails'));
    expect(emailList.get(0).$('.view-profile-editable-value').getText()).toBe(user.email.toLowerCase());
    expect(emailList.get(0).$('.fa-exclamation-triangle').isDisplayed()).toBe(true);
  });

  it('cannot delete the email address since there is only one', function() {
    expect($$('a[ng-click="openEditMailPopup(email.user_email.id, subList.length > 1)"]:not(.ng-hide)').count()).toBe(0);
  });

  it('can add an email address', function() {
    email = 'test' + (new Date()).getTime() + '@famicity.com';
    $$('.btn-icon-primary').get(1).click();
    $('#email').sendKeys(email + '\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(2)').getText()).toContain(email);
  });

  it('cannot use an existing email address', function() {
    email = browser.params.user.email;
    $$('.btn-icon-primary').get(1).click();
    element(by.model('mail[\'email\']')).clear().sendKeys(email + '\n');
    // TODO: the email field should be cleaned on failure
    helper.hasFailure();
    $('button.btn-secondary').click();
  });

  it('can edit his email address', function() {
    email = 'test' + (new Date()).getTime() + '@famicity.com';
    $$('a[ng-click="openEditMailPopup(email.user_email.id)"]').get(0).click();
    element(by.model('mail[\'email\']')).clear().sendKeys(email + '\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(2)').getText()).toContain(email);
  });

  it('can delete his email address', function() {
    $$('a[ng-click="openEditMailPopup(email.user_email.id)"]').get(0).click();
    $('.btn-danger').click();
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(2)').getText()).not.toContain(email);
  });

  it('can add a phone number', function() {
    $$('.btn-icon-primary').get(2).click();
    $('#phone').sendKeys('0651178088\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(3)').getText()).toContain('0651178088');
  });

  it('can add another phone number', function() {
    $$('.btn-icon-primary').get(2).click();
    $('#phone').sendKeys('06546546545\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(3)').getText()).toContain('06546546545');
  });

  it('can edit his phone number', function() {
    $$('a[ng-click="openEditPhonePopup(phone.user_phone.id)"]').get(0).click();
    $('#phone').clear().sendKeys('0146630703\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(3)').getText()).toContain('0146630703');
  });

  it('can delete his phone number', function() {
    $$('a[ng-click="openEditPhonePopup(phone.user_phone.id)"]').get(0).click();
    $('.btn-danger').click();
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(3)').getText()).not.toContain('0146630703');
  });

  it('can add an address', function() {
    $$('.btn-icon-primary').get(3).click();
    $('#address').sendKeys('address');
    $('#address2').sendKeys('address2');
    $('#post_code').sendKeys('post_code');
    $('#city').sendKeys('city\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(4)').getText()).toContain('address');
    expect($('.view-profile-holder>div:nth-child(4)').getText()).toContain('address2');
    expect($('.view-profile-holder>div:nth-child(4)').getText()).toContain('post_code');
    expect($('.view-profile-holder>div:nth-child(4)').getText()).toContain('city');
  });

  it('can edit his address', function() {
    $('a[ng-click="openEditAddressPopup(address.user_address.id)"]').click();
    $('#address').clear().sendKeys('address2');
    $('#address2').clear().sendKeys('address3');
    $('#post_code').clear().sendKeys('post_code2');
    $('#city').clear().sendKeys('city2\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(4)').getText()).toContain('address2');
    expect($('.view-profile-holder>div:nth-child(4)').getText()).toContain('address3');
    expect($('.view-profile-holder>div:nth-child(4)').getText()).toContain('post_code2');
    expect($('.view-profile-holder>div:nth-child(4)').getText()).toContain('city2');
  });

  it('can delete his address', function() {
    $('a[ng-click="openEditAddressPopup(address.user_address.id)"]').click();
    $('.btn-danger').click();
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(4)').getText()).not.toContain('address2');
  });

  it('can add a website', function() {
    browser.executeScript('window.scrollTo(0, document.body.scrollHeight);').then(function() {
      $$('.btn-icon-primary').get(4).click();
    });
    $('#website').sendKeys('barbotte.net/SFL-Heritage\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(5)').getText()).toContain('barbotte.net/SFL-Heritage');
  });

  it('can edit his website', function() {
    $('a[ng-click="openEditWebSitePopup(website.user_website.id)"]').click();
    $('#website').clear().sendKeys('barbotte.net/moment-revolution\n');
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(5)').getText()).toContain('barbotte.net/moment-revolution');
  });

  it('can delete his website', function() {
    $('a[ng-click="openEditWebSitePopup(website.user_website.id)"]').click();
    $('.btn-danger').click();
    helper.hasSuccess();
    expect($('.view-profile-holder>div:nth-child(5)').getText()).not.toContain('barbotte.net/moment-revolution');
  });

  it('signs out', function() {
    header.signOut();
  });
});

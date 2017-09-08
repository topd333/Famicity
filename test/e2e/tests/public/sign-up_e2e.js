'use strict';

var header = require('./../../pages/HeaderComponent')();
var home = require('./../../pages/HomePage')();
var wizard = require('./../../pages/WizardPage')();
var helper = require('./../../helper');
var feed = require('./../../pages/FeedPage')();
var moment = require('moment');

describe('User - Sign up', function() {
  var user;

  it('can sign-up', function() {
    user = helper.user.generate();
    user.avatar = true;
    home.get();
    home.signUp(user.email, user.password);
  });

  it('should fill all profile fields', function() {
    wizard.fillProfile({firstName: user.firstName, birthDate: user.birthDate});
    wizard.profile.validateButton.click();
    helper.hasFailure('Le nom entré n\'est pas accepté (2-50 caractères).');
    wizard.fillProfile({lastName: user.lastName, birthDate: user.birthDate});
    wizard.profile.validateButton.click();
    helper.hasFailure('Le prénom entré n\'est pas accepté (2-50 caractères).');
    wizard.fillProfile({lastName: user.lastName, firstName: user.firstName});
    wizard.profile.validateButton.click();
    helper.hasFailure('La date de naissance n\'est pas valide !');
  });

  it('should fill a valid date', function() {
    var date = moment().year(moment().year() - 151);
    wizard.fillProfile({firstName: user.firstName, lastName: user.lastName, birthDate: date.toDate()});
    wizard.profile.validateButton.click();
    helper.hasFailure('La date de naissance est trop éloignée de la date actuelle !');
    date = moment().day(moment().day() + 1);
    wizard.fillProfile({firstName: user.firstName, lastName: user.lastName, birthDate: date.toDate()});
    wizard.profile.validateButton.click();
    helper.hasFailure('La date de naissance doit être antérieure à aujourd\'hui.');
  });

  it('can fill the wizard', function() {
    wizard.goThrough(user);
  });

  it('the avatar has been set', function() {
    feed.get();
    expect(feed.avatars.count()).toBe(1);
    expect($('fc-post-add div[ng-if="::avatar.user.avatar_url"] img').isDisplayed()).toBe(true);
  });

  it('has correct feed data', function() {
    feed.isInitial(user);
  });

  it('signs out', function() {
    header.signOut();
  });
});

'use strict';

var tree = require('./../../pages/TreePage')();
var header = require('./../../pages/HeaderComponent')();
var helper = require('./../../helper');

describe('Tree', function() {
  var userId;
  var user;

  it('signs up', function() {
    user = helper.createUser();
  });

  it('can visit his tree page', function() {
    tree.get().then(function(url) {
      userId = url.match(/\/tree\/(\d*)/)[1];
    });
  });

  it('a tooltip introduces the tree features', function() {
    expect($('h3[data-translate="TREE_INTRO_POPUP_TITLE"]').isDisplayed()).toBe(true);
    $('img[ng-click="removeIntroPopup()"]').click();
  });

  it('a tooltip informs the user he can import a GEDCOM file', function() {
    var noButton = $('a[ng-click="removeGedcomPopup(false)"]');
    expect(noButton.isDisplayed()).toBe(true);
    noButton.isDisplayed().click();
  });

  it('can open his tree popin', function() {
    browser.wait(function() {
      return browser.element(by.id('c-co')).isPresent();
    }, 3000).then(function() {
      tree.openTreePopin(userId);
      expect($('.add-row-middle-center').getText()).toContain(user.firstName + ' ' + user.lastName.toUpperCase());
    });
  });

  it('can close his tree popin', function() {
    tree.closeTreePopin();
  });

  it('can add a brother to his tree', function() {
    tree.openTreePopin(userId);
    $('a[ui-sref="u.tree.detail.addBrother"]').click();
    expect(browser.element(by.model('currentForm.user.last_name')).getAttribute('value')).toBe(user.lastName);
    expect(browser.element(by.id('male')).isSelected()).toBe(true);
    tree.fillAddRelativeForm(
    {firstName: 'Brother', birthDate: new Date(1988, 2, 29)}, {
      title: 'Compléter les infos du frère de ' + user.firstName, button: 'Créer le frère de ' + user.firstName,
      url: new RegExp('/tree/' + userId + '/detail/' + userId + '/addBrother')
    });
  });

  it('can add a sister to his tree', function() {
    tree.openTreePopin(userId);
    $('a[ui-sref="u.tree.detail.addSister"]').click();
    expect(browser.element(by.model('currentForm.user.last_name')).getAttribute('value')).toBe(user.lastName);
    expect(browser.element(by.id('female')).isSelected()).toBe(true);
    tree.fillAddRelativeForm({firstName: 'Sister', birthDate: new Date(1988, 2, 29)}, {
      title: 'Compléter les infos de la sœur de ' + user.firstName, button: 'Créer la sœur de ' + user.firstName,
      url: new RegExp('/tree/' + userId + '/detail/' + userId + '/addSister')
    });
  });

  it('can add a wife to his tree', function() {
    tree.openTreePopin(userId);
    $('a[ui-sref="u.tree.detail.addWife"]').click();
    expect(browser.element(by.id('female')).isSelected()).toBe(true);
    tree.fillAddRelativeForm({
      firstName: 'Wife',
      lastName: user.lastName,
      maidenName: 'Maiden',
      birthDate: new Date(1985, 2, 29)
    }, {
      title: 'Compléter les infos de la conjointe de ' + user.firstName, button: ' la conjointe de ' + user.firstName,
      url: new RegExp('/tree/' + userId + '/detail/' + userId + '/addWife')
    });
  });

  it('can add a son made with his wife', function() {
    tree.openTreePopin(userId);
    $('a[ui-sref="u.tree.detail.addSon"]').click();
    var wife = $('.tree-popup-second-parent .tile-holder figure:nth-child(1)');
    expect(wife.$('figcaption').getText()).toContain('Wife ' + user.lastName.toUpperCase());
    wife.click();
    expect(browser.element(by.id('male')).isSelected()).toBe(true);
    tree.fillAddRelativeForm({firstName: 'Son', birthDate: new Date(2000, 2, 29)}, {
      title: 'Compléter les infos du fils de ' + user.firstName, button: 'Créer le fils de ' + user.firstName,
      url: new RegExp('/tree/' + userId + '/detail/' + userId + '/createChild\\d*')
    });
  });

  it('can add a daughter made with his mistress', function() {
    tree.openTreePopin(userId);
    $('a[ui-sref="u.tree.detail.addDaughter"]').click();
    var mistress = $('.tree-popup-second-parent .tile-holder figure:nth-child(3)');
    mistress.click();
  });

  it('can fill his mistress information', function() {
    // $('.tr-us-un[style*="top:0"]').click();
    tree.fillAddRelativeForm({
      firstName: 'Mistress',
      lastName: 'Mistress',
      sex: 'F',
      birthDate: new Date(1980, 2, 29),
      isStep: true
    }, {
      title: 'Compléter les infos du second parent', button: 'Créer le second parent',
      url: new RegExp('/tree/' + userId + '/detail/\\d*/createChildSecondParent')
    });
  });

  it('fills his daughter information', function() {
    expect(browser.element(by.id('female')).isSelected()).toBe(true);
    tree.fillAddRelativeForm({firstName: 'Daughter', birthDate: new Date(2000, 2, 29)}, {
      title: 'Compléter les infos de la fille de ' + user.firstName, button: 'Créer la fille de ' + user.firstName,
      url: new RegExp('/tree/' + userId + '/detail/\\d*/createChild/\\d*')
    });
    // Check that no unknown parent has been created
    expect($('.tr-us-un[style*="top:0px"]').isPresent()).toBe(false);
  });

  it('can go back to his tree', function() {
    tree.openTreePopin(userId);
    $('.links div a:nth-child(4)').click();
    browser.getCurrentUrl().then(function(url) {
      expect(url).toMatch(/\/tree\/\d*/);
      var currentUserId = url.match(/\/tree\/(\d*)/)[1];
      expect(currentUserId).toBe(userId);
    });
  });

  it('can fill his father information', function() {
    tree.openTreePopin(userId);
    $('a[ui-sref="u.tree.detail.createFirstParent"]').click();
    expect(browser.element(by.model('currentForm.user.last_name')).getAttribute('value')).toBe(user.lastName);
    tree.fillAddRelativeForm({firstName: 'Father', birthDate: new Date(1970, 2, 29), sex: 'M'}, {
      title: 'Compléter les infos du premier parent', button: 'Créer le premier parent',
      url: new RegExp('/tree/' + userId + '/detail/\\d*/createFirstParent')
    });
  });

  it('can fill his mother information', function() {
    tree.openTreePopin(userId);
    $('a[ui-sref="u.tree.detail.createSecondParent"]').click();
    expect(browser.element(by.model('currentForm.user.last_name')).getAttribute('value')).toBe(user.lastName);
    tree.fillAddRelativeForm({firstName: 'Mother', birthDate: new Date(1970, 2, 29), sex: 'F'}, {
      title: 'Compléter les infos du second parent', button: 'Créer le second parent',
      url: new RegExp('/tree/' + userId + '/detail/\\d*/createSecondParent')
    });
  });

  it('can fill his grand-father information', function() {
    $$('#c-co .tr-us-ma[style*="top:-120px"]').get(0).click();
    $('a[ui-sref="u.tree.detail.createFirstParent"]').click();
    expect(browser.element(by.model('currentForm.user.last_name')).getAttribute('value')).toBe(user.lastName);
    tree.fillAddRelativeForm({
      firstName: 'Grandfather',
      birthDate: new Date(1940, 2, 29),
      sex: 'M',
      email: 'grand_papa@famicity.com'
    }, {
      title: 'Compléter les infos du premier parent', button: 'Créer le premier parent',
      url: new RegExp('/tree/\\d*/detail/\\d*/createFirstParent')
    });
  });

  it('can fill his grand-mother information', function() {
    $$('#c-co .tr-us-un[style*="top:-120px"]').get(0).click();
    tree.fillAddRelativeForm({
      firstName: 'Grandmother',
      lastName: user.lastName,
      maidenName: 'GrandMother Maiden',
      birthDate: new Date(1940, 2, 29),
      sex: 'F'
    }, {
      title: 'Compléter les infos du profil inconnu', button: 'Créer le profil',
      url: new RegExp('/tree/\\d*/detail/\\d*/fillAnonymous')
    });
  });

  it('the invitation has been sent', function() {
    var directory = require('./../../pages/DirectoryPage')();
    directory.get();
    $('.fa-eye').click();
    expect(browser.getCurrentUrl()).toMatch(/\/u\/directory\/sent-invitations/);
    var invitedUsers = browser.element.all(by.repeater('user in formattedUsers'));
    var currentYear = new Date().getFullYear();
    expect(invitedUsers.get(0).getText()).toContain('Grandfather ' + user.lastName.toUpperCase());
    expect(invitedUsers.get(0).getText()).toContain('grand_papa@famicity.com');
    expect(invitedUsers.get(0).getText()).toContain(currentYear);
  });

  it('signs out', function() {
    header.signOut();
  });
});

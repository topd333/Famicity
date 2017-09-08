'use strict';

var directory = require('./../../pages/DirectoryPage')();
var header = require('./../../pages/HeaderComponent')();
var helper = require('./../../helper');
var user1;
var user2;
var user3;

describe('User', function() {
  it('signs up', function() {
    user1 = helper.user.generate(1);
    user2 = helper.user.generate(2);
    user3 = helper.user.generate(3);
    helper.createUser(user1);
  });

  it('visits his directory page', function() {
    directory.get();
  });

  it('can invite a user', function() {
    // $('.header-main-icons-row .table-cell:nth-child(5)').click();
    directory.get();
    directory.menu.click(2);
    directory.invite(user2.firstName, user2.lastName, user2.email);
    var sentLeftBlock = browser.element.all(by.repeater('invitation in ::sentInvitations | limitTo : 2'));
    expect(sentLeftBlock.get(0).getText()).toContain(user2.firstName + ' ' + user2.lastName.toUpperCase());
    expect(sentLeftBlock.get(0).getText()).toContain(user2.email);
  });

  it('can invite another user, providing valid user information', function() {
    directory.get();
    directory.menu.click(2);

    directory.tryInvite(user3.firstName, user3.lastName, '');
    helper.hasFailure('L\'email doit être rempli !');
    directory.tryInvite('', '', user3.email);
    helper.hasFailure('Le nom ou le prénom doit être rempli.');
    directory.tryInvite(user2.firstName, user2.lastName, user2.email);
    helper.hasFailure('Vous avez déjà invité cette personne.');
    directory.invite(user3.firstName, user3.lastName, user3.email);
    var sentLeftBlock = browser.element.all(by.repeater('invitation in ::sentInvitations | limitTo : 2')).get(1);
    expect(sentLeftBlock.getText()).toContain(user3.firstName + ' ' + user3.lastName.toUpperCase());
    expect(sentLeftBlock.getText()).toContain(user3.email);
  });

  it('can see all invited users', function() {
    $('.fa-eye').click();
    expect(browser.getCurrentUrl()).toMatch(/\/u\/directory\/sent-invitations/);
    var invitedUsers = browser.element.all(by.repeater('user in formattedUsers'));
    var currentYear = new Date().getFullYear();
    expect(invitedUsers.get(0).getText()).toContain(user2.firstName + ' ' + user2.lastName.toUpperCase());
    expect(invitedUsers.get(0).getText()).toContain(user2.email);
    expect(invitedUsers.get(0).getText()).toContain(currentYear);
    expect(invitedUsers.get(1).getText()).toContain(user3.firstName + ' ' + user3.lastName.toUpperCase());
    expect(invitedUsers.get(1).getText()).toContain(user3.email);
    expect(invitedUsers.get(1).getText()).toContain(currentYear);
  });
});

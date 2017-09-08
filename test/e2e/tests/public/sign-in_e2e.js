'use strict';

var user = browser.params.user;
var helper = require('./../../helper');
var signIn = require('./../../pages/SignInPage')();
var home = require('./../../pages/HomePage')();
var header = require('./../../pages/HeaderComponent')();

describe('User', function() {
  it('can sign-in from the sign-in page', function() {
    signIn.get();
    signIn.signIn(user.email, user.password);
    $$('#invitation-alert-modal .fc-close').count().then(function(count) {
      if (count !== 0) {
        $('#invitation-alert-modal .fc-close').click();
      }
    });
  });

  it('can sign-out', function() {
    header.signOut();
  });

  describe('can sign-in from the sign-up page', function() {
    it('must provide all information', function() {
      browser.get('/fr').then(function() {
        home.trySignUp('', user.password);
        helper.hasFailure('Cet email n\'est pas valide. Merci de vérifier votre saisie.');
        home.trySignUp(user.email, '');
        // TODO: update when right message is sent
        helper.hasFailure('Cet email est déjà utilisé par un membre mais ce mot de passe est incorrect.');
        // helper.hasFailure('Le mot de passe doit être rempli.');
      });
    });

    // TODO: 'email@example' is not accepted by the server, but the message is not the same as on client side
    it('must provide a valid email', function() {
      [
        'plainaddress', '#@%^%#$@#$@#.com',
        '@example.com', 'Joe Smith <email@example.com>',
        'email.example.com', 'email@example@example.com',
        'あいうえお@example.com', 'email@example.com (Joe Smith)',
        'email@-example.com', 'email@example..com', 'email.@example.com',
        '.email@example.com', 'email..email@example.com', 'email@111.222.333.44444',
        'Abc..123@example.com', 'email@example', 'much.”more\\ unusual”@example.com',
        'very.unusual.”@”.unusual.com@example.com', 'very.”(),:;<>[]”.VERY.”very@\\ "very”.unusual@strange.example.com'
      ].forEach(function(email) {
          home.trySignUp(email, user.password);
          helper.hasFailure('Cet email n\'est pas valide. Merci de vérifier votre saisie.');
        });
    });

    it('can provide weirdy emails', function() {
      ['_test@youpi.com'].forEach(function(email) {
        home.trySignUp(email.replace('@', '@' + Date.now()), '');
        helper.hasFailure('Le mot de passe doit être rempli.');
      });
    });

    it('is logged in if everything is correct', function() {
      home.signIn(user.email, user.password);
      header.signOut();
    });
  });
});

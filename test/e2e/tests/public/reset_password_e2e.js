'use strict';

var signIn = require('../../pages/SignInPage')();
var reset = require('../../pages/ResetPasswordPage')();
var faker = require('faker');
var helper = require('../../helper');

describe('Reset password', function() {
  it('is accessible from the sign-in form', function() {
    helper.deleteCookie('loginEmail');
    signIn.get();
    reset.get();
  });

  it('should set email when it is set in the sign-in form', function() {
    var email = faker.internet.email();
    signIn.get();
    signIn.trySignIn(email);
    reset.get();
    expect(browser.getCurrentUrl()).toContain('/fr/mot_de_passe_oublie?email=' + email);
    expect(reset.email.getAttribute('value')).toBe(email);
  });

  it('should not validate when all fields are not properly entered', function() {
    reset.email.clear();
    reset.validateButton.click();
    helper.hasFailure('Cet email n\'est pas valide. Merci de vérifier votre saisie.');

    reset.fillForm(faker.internet.email());
    reset.validateButton.click();
    helper.hasFailure('L\'adresse que vous avez entré ne correspond à aucun compte utilisateur de Famicity.');
  });

  it('should validate and display message when everything looks right', function() {
    reset.write(browser.params.user.email);
  });
});

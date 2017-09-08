'use strict';

var home = require('../../pages/HomePage')();
var contact = require('../../pages/PublicContactPage')();
var faker = require('faker');
var helper = require('../../helper');

describe('Public contact', function() {
  it('is accessible from the public footer', function() {
    home.get();
    expect($('footer').getText()).toContain('Contactez-nous');
    contact.get();
  });

  it('should not validate when all fields are not properly entered', function() {
    contact.fillForm({message: faker.lorem.paragraph()});
    contact.validateButton.click();
    helper.hasFailure('L\'adresse mail n\'est pas valide !');

    contact.fillForm({email: faker.internet.email()});
    contact.validateButton.click();
    helper.hasFailure('Votre message n\'est pas valide ! (20-1000 caractères)');

    contact.fillForm({email: faker.internet.email(), message: faker.lorem.paragraph().slice(0, 10)});
    contact.validateButton.click();
    helper.hasFailure('Votre message n\'est pas valide ! (20-1000 caractères)');
  });

  it('should validate and redirect to home when everything looks right', function() {
    contact.write({email: faker.internet.email(), message: faker.lorem.paragraph()});
  });
});

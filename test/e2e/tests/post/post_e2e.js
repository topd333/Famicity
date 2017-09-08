/* global protractor */

'use strict';

var helper = require('../../helper');
var faker = require('faker');
var feed = require('../../pages/FeedPage')();
var PostFormComponent = require('../../pages/PostFormComponent');
var header = require('../../pages/HeaderComponent')();
var content;
var title;
var postForm;

describe('User', function() {
  it('signs up', function() {
    helper.createUser();
  });

  it('the create post form is present on the feed page', function() {
    feed.get();
    postForm = new PostFormComponent($('fc-post-add'));
    postForm.isPresent();
  });

  it('the user can start writing a post', function() {
    postForm.initiateCreation();
  });

  it('the post has default permissions', function() {
    postForm.hasDefaultPermissions();
  });

  it('content size expands when typing long text', function() {
    postForm.content.getSize().then(function(size) {
      var height = size.height;
      postForm.fillForm({content: '\n\n\n\n\n\n', title: ''});
      postForm.content.getSize().then(function(expendedSize) {
        expect(expendedSize.height).toBeGreaterThan(height);
      });
    });
  });

  it('content and title can have weird characters', function() {
    var fullFunkyText = '?,;.\n:/!/\\$€@éèêëàâäôöîïùûü';
    var funkyText = '?,;.:/!/\\$€@éèêëàâäôöîïùûü';

    postForm.fillForm({content: fullFunkyText, title: funkyText});
    expect(postForm.validateButton.isEnabled()).toBe(true);
    expect(postForm.content.getAttribute('value')).toBe(fullFunkyText);
    expect(postForm.title.getAttribute('value')).toBe(funkyText);
  });

  it('can remove default permissions', function() {
    postForm.content.clear();
    postForm.permissions.click();
    postForm.permissionsInput.sendKeys(protractor.Key.BACK_SPACE);
    postForm.hasNoPermission();
    postForm.permissionsInput.sendKeys(protractor.Key.ESCAPE);
  });

  it('receives a warning if no permission is set', function() {
    content = faker.lorem.paragraph();
    title = faker.lorem.sentence().slice(0, 49);
    postForm.permissionsInput.sendKeys(protractor.Key.ESCAPE);
    postForm.fillForm({content: content, title: title});
    postForm.validateButton.click();
    expect(browser.$('.yes-no-popin').isDisplayed()).toBe(true);
    browser.$('.yes-no-popin .btn-primary').click();
    postForm.fillForm({content: '', title: ''});
  });

  describe('can add an email permission', function() {
    var email = faker.internet.email();
    beforeEach(function() {
      postForm.permissions.click();
      postForm.permissionsInput.sendKeys(protractor.Key.BACK_SPACE);
      postForm.permissionsInput.sendKeys(email);
    });
    afterEach(function() {
      postForm.hasPermission(email);
    });
    it('using tab', function() {
      postForm.permissionsInput.sendKeys(protractor.Key.TAB);
    });
    it('using enter', function() {
      postForm.permissionsInput.sendKeys(protractor.Key.ENTER);
    });
    it('using space', function() {
      postForm.permissionsInput.sendKeys(protractor.Key.SPACE);
    });
    // Sending ; is not possible
    xit('using semicolon', function() {
      postForm.permissionsInput.sendKeys(';');
    });
  });

  describe('can add a group permission', function() {
    beforeEach(function() {
      postForm.permissions.click();
      postForm.permissionsInput.sendKeys(protractor.Key.BACK_SPACE);
      postForm.permissionsInput.sendKeys(protractor.Key.ESCAPE);
      postForm.permissionsInput.sendKeys('mes a');
      browser.wait(function() {
        return postForm.permissionsProposals.isDisplayed();
      }, 3000).then(function() {
        browser.sleep(500);
        postForm.permissionsInput.sendKeys(protractor.Key.ARROW_DOWN);
      });
    });
    afterEach(function() {
      postForm.hasPermission('Mes amis');
      postForm.permissionsInput.sendKeys(protractor.Key.ESCAPE);
    });
    it('using tab', function() {
      postForm.permissionsInput.sendKeys(protractor.Key.TAB);
    });
    it('using enter', function() {
      postForm.permissionsInput.sendKeys(protractor.Key.ENTER);
    });
    it('using space', function() {
      postForm.permissionsInput.sendKeys(protractor.Key.SPACE);
    });
    it('using click', function() {
      postForm.permissionsProposals.$$('.proposal').get(0).click();
    });
  });

  describe('Create post', function() {
    it('can create the post', function() {
      postForm.permissionsInput.sendKeys(protractor.Key.ESCAPE);
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 49);
      postForm.write({content: content, title: title});
    });

    it('once created, the post is added to the feed', function() {
      var post = feed.firstElement;
      expect(post.isDisplayed()).toBe(true);
    });

    it('and the blog', function() {
      var blog = require('../../pages/BlogPage')();
      blog.get();
      var post = blog.firstElement;
      expect(post.isDisplayed()).toBe(true);
    });

    it('the title and content are as expected', function() {
      feed.get();
      var post = feed.firstElement;
      var contentText = post.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = post.$('.title.center-text').getText();

      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
    });

    it('title and content are trimmed', function() {
      postForm.initiateCreation();
      content = faker.lorem.paragraph() + '  ';
      title = faker.lorem.sentence().slice(0, 20) + '     ';
      postForm.write({content: content, title: title});

      var post = feed.firstElement;
      var contentText = post.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = post.$('.form-fields .center-text').getText();

      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
    });

    it('add a picture', function() {
      postForm.initiateCreation();
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 20);
      postForm.write({content: content, title: title, picture: true});

      var post = feed.firstElement;
      var contentText = post.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = post.all(by.css('.form-fields .center-text')).get(0).getText();

      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
      expect(post.$('.max-sized-full img').isDisplayed()).toBe(true);
    });

    it('remove the picture', function() {
      helper.scrollToBottom();
      var post = new PostFormComponent(feed.firstElement);
      post.element.$('.fa-pencil-square-o:not(.pointer)').click();
      post.element.$('a[ng-click="formStatus.isUploadedPhoto ? deletePostPhoto() : deletePhoto()"]').click();
      $('.popin-dialog .btn-primary').click();
      helper.hasSuccess('La photo a été supprimée avec succès.');
      post.element.$$('.end .btn-primary').get(0).click();

      helper.hasSuccess('La nouvelle a été modifiée');
      post = feed.firstElement;
      var contentText = post.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = post.all(by.css('.form-fields .center-text')).get(0).getText();

      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
      expect(post.$('img.max-sized-full').isPresent()).toBe(false);
    });
  });

  describe('Edit post', function() {
    beforeEach(function() {
      helper.scrollToBottom();
      var post = new PostFormComponent(feed.firstElement);
      post.element.$('.fa-pencil-square-o:not(.pointer)').click();
      postForm =
        new PostFormComponent(browser.element.all(by.repeater('element in elements')).get(0).$('.inline.editing'));
    });

    it('with standard content', function() {
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 20);
      postForm.write({content: content, title: title}, true);

      var editedPost = feed.firstElement;
      var contentText = editedPost.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = editedPost.$('.form-fields .center-text').getText();

      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
    });

    it('with funky content', function() {
      content = '?,;.\n":/!/<\\$€@\'éèêë<p></p>à âä<ôö\nîï&ù û&nbsp;ü';
      title = '?,;.":/!/<\\$€@\'éèêë<p></p>à âä<ôöîï&ù û&nbsp;ü';
      postForm.write({content: content, title: title}, true);

      var editedPost = feed.firstElement;
      var contentText = editedPost.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = editedPost.$('.form-fields .center-text').getText();

      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
    });

    it('with javascript content', function() {
      content = '<script>alert(\'test\');</script>';
      title = '<script>alert(\'test\');</script>';
      postForm.write({content: content, title: title}, true);

      var editedPost = feed.firstElement;
      var contentText = editedPost.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = editedPost.$('.form-fields .center-text').getText();

      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
    });
  });

  it('sign out', function() {
    header.signOut();
  });
});

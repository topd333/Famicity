'use strict';

var gUtil = require('gulp-util');

var urls = {
  development: 'https://devfront.famicity.com',
  staging: 'https://staging.famicity.com',
  production: 'https://www.famicity.com'
};

var target = gUtil.env.target || 'development';
var dir = gUtil.env.dir || 'build';
var url = urls[target];
var version = gUtil.env.version || Date.now();

var conf = {
  build: {dir: dir, target: target, url: url, version: version},
  src: {
    js: ['app/scripts/**/*.js'],
    sassBuilds: ['app/styles/sass/famicity.scss', 'app/styles/sass/base.scss'],
    sass: 'app/**/*.scss',
    styleGuide: 'app/scripts/dev/style/guide',
    bowerComponents: 'bower_components',
    cachedTemplates: [
      'app/scripts/blog/directives/fc-feed-post.html',
      'app/scripts/blog/directives/fc-photo-upload.html',
      'app/scripts/common/comments/list/fc-comment-list.html',
      'app/scripts/common/comments/single/fc-comment.html',
      'app/scripts/common/avatar/fc-avatar.html',
      'app/scripts/common/user-list/item/user-list-item.html',
      'app/scripts/common/user-list/user-list.html',
      'app/scripts/common/info-bar/views/info-bar.html',
      'app/scripts/common/inline/fc-inline.html',
      'app/scripts/common/likes/directives/fc-like.html',
      'app/scripts/common/permission/edit/fc-autocomplete.html',
      'app/scripts/common/permission/edit/fc-permission-edit.html',
      'app/scripts/common/permission/edit/fc-permission-proposal.html',
      'app/scripts/common/permission/fc-permissions.html',
      'app/scripts/common/permission/list/fc-permission-list.html',
      'app/scripts/common/permission/list/single/fc-permission.html',
      'app/scripts/common/tooltip-popup/views/fc-tooltip-popup.html',
      'app/scripts/common/header/fc-menu.html',
      'app/scripts/common/toolbar/fc-toolbar.html',
      'app/views/home/home.html',
      'app/views/internal/fc-chat.html',
      'app/views/internal/fc-chat-window.html',
      'app/views/internal/fc-header.html',
      'app/scripts/directives/fc-mobile-menu.html',
      'app/views/internal/header_bar.html',
      'app/views/internal/left_column_block_header.html',
      'app/views/internal/fc-notifications.html',
      'app/views/internal/fc-notification-item.html',
      'app/scripts/feed/avatar/fc-feed-avatar.html',
      'app/scripts/feed/fc-feed-album.html',
      'app/scripts/feed/fc-feed-empty.html',
      'app/scripts/feed/fc-feed-event.html',
      'app/scripts/feed/fc-feed-header.html',
      'app/scripts/feed/fc-feed-list.html',
      'app/scripts/feed/fc-feed-list.html',
      'app/scripts/feed/fc-feed-user.html',
      'app/scripts/feed/fc-post-add.html',
      'app/scripts/side/fc-side-bar.html',
      'app/scripts/side/story/fc-story-detail.html',
      'app/scripts/side/birthday/fc-birthday-list.html',
      'app/scripts/side/events/fc-events-list.html',
      'app/scripts/side/connected/fc-last-connected-list.html',
      'app/scripts/feed/left-block/fc-few-contacts.html',
      'app/scripts/feed/left-block/fc-suggest-invitations.html',
      'app/scripts/welcome/Welcome.html',
      'app/scripts/welcome/sign-in/fc-sign-in.html',
      'app/scripts/welcome/sign-up/fc-sign-up.html',
      'app/views/presentation/presentation.html',
      'app/scripts/common/util/auth/views/hello.html',
      'app/scripts/common/util/auth/views/hello.html',
      'app/scripts/common/util/auth/fc-app-icons.html',
      'app/scripts/common/date/fc-date-input.html'
    ]
  },
  tmp: '.tmp',
  imgMin: gUtil.env.img != null ? gUtil.env.img : true,
  // dev: gUtil.env.dev != null  ? gUtil.env.dev : true,
  watch: gUtil.env.watch != null ? gUtil.env.watch : true,
  weinre: gUtil.env.weinre != null ? gUtil.env.weinre : false,
  bower: gUtil.env.bower != null ? gUtil.env.bower : true
};

module.exports = conf;

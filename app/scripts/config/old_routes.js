angular.module('famicity').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('u.search-old', {
    url: '/users/:user_id/searches?q',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.search', $stateParams)}
    }
  }).state('u.home-old', {
    url: '/users/:user_id/home',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.home', $stateParams)}
    }
  }).state('u.feed-old', {
    url: '/users/:user_id/feed',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.feed', $stateParams)}
    }
  }).state('u.calendar-old', {
    url: '/users/:user_id/calendar',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.calendar', $stateParams)}
    }
  }).state('u.event-show-old', {
    url: '/users/:user_id/calendar/:event_id/show?back_action',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.event-show', $stateParams)}
    }
  }).state('u.directory-old', {
    url: '/users/:user_id/directory',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.directory.list', $stateParams)}
    }
  }).state('u.messages-old', {
    url: '/users/:user_id/messages',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.messages.welcome', $stateParams)}
    }
  }).state('u.messages-old-add', {
    url: '/users/:user_id/messages/add',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.messages.add', $stateParams)}
    }
  }).state('u.settings-old', {
    url: '/users/:user_id/settings/:settings_id',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings', $stateParams)}
    }
  }).state('u.settings-account-old', {
    url: '/users/:user_id/settings/:settings_id/account',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-account', $stateParams)}
    }
  }).state('u.settings-locale-old', {
    url: '/users/:user_id/settings/:settings_id/locale',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-locale', $stateParams)}
    }
  }).state('u.settings-locale-language-old', {
    url: '/users/:user_id/settings/:settings_id/locale/language',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-locale-language', $stateParams)}
    }
  }).state('u.settings-locale-calendar-old', {
    url: '/users/:user_id/settings/:settings_id/locale/calendar',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-calendar', $stateParams)}
    }
  }).state('u.settings-privacy-old', {
    url: '/users/:user_id/settings/:settings_id/privacy',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-privacy', $stateParams)}
    }
  }).state('u.settings-privacy-default-rights-old', {
    url: '/users/:user_id/settings/:settings_id/privacy/default_rights/edit',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-privacy-default_rights', $stateParams)}
    }
  }).state('u.settings-privacy-search-engine-old', {
    url: '/users/:user_id/settings/:settings_id/privacy/search_engine',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-privacy-search_engine', $stateParams)}
    }
  }).state('u.settings-privacy-tree-rights-old', {
    url: '/users/:user_id/settings/:settings_id/privacy/tree_rights/edit',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-privacy-tree_rights', $stateParams)}
    }
  }).state('u.settings-notifications-old', {
    url: '/users/:user_id/settings/:settings_id/notifications',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-notifications', $stateParams)}
    }
  }).state('u.settings-terms-old', {
    url: '/users/:user_id/settings/:settings_id/terms',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-terms', $stateParams)}
    }
  }).state('u.settings-unsubscription-old', {
    url: '/users/:user_id/settings/:settings_id/unsubscription',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-unsubscription', $stateParams)}
    }
  }).state('u.settings-contact-old', {
    url: '/users/:user_id/settings/:settings_id/contact',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.settings-contact', $stateParams)}
    }
  }).state('u.fusions-received-old', {
    url: '/users/:user_id/fusions/received',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.fusions-index', $stateParams)}
    }
  }).state('u.fusions-received-old2', {
    url: '/tree/:user_id/fusions/received',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.fusions-index', $stateParams)}
    }
  }).state('u.fusions-sent-old', {
    url: '/users/:user_id/fusions/sent',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.fusions-index', $stateParams)}
    }
  }).state('u.fusions-sent-old2', {
    url: '/tree/:user_id/fusions/sent',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.fusions-index', $stateParams)}
    }
  }).state('u.profile-old', {
    url: '/users/:user_id/profile',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile', $stateParams)}
    }
  }).state('u.profile-comments-old', {
    url: '/users/:user_id/comments?show_comments',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-comments', $stateParams)}
    }
  }).state('u.profile-edit-old', {
    url: '/users/:user_id/profile/edit',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-edit', $stateParams)}
    }
  }).state('u.profile-photos-old', {
    url: '/users/:user_id/profile/photos',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-photos', $stateParams)}
    }
  }).state('u.profile-photos-item-old', {
    parent: 'u',
    url: '/users/:user_id/profile/photos/item/:photo_id?show_comments',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-photos-item', $stateParams)}
    }
  }).state('u.profile-photos-item-fullscreen-old', {
    url: '/users/:user_id/profile/photos/item/:photo_id/fullscreen{root:(?:/[^/]+)?}',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-photos-item-fullscreen', $stateParams)}
    }
  }).state('u.profile-photos-item-comments-old', {
    url: '/users/:user_id/profile/photos/item/:photo_id/comments?show_comments',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-photos-item-comments', $stateParams)}
    }
  }).state('u.profile-photos-crop-old', {
    url: '/users/:user_id/profile/photos/crop/:photo_id',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-photos-crop', $stateParams)}
    }
  }).state('u.profile-photos-webcam-old', {
    url: '/profile/:user_id/photos/webcam',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-photos-webcam', $stateParams)}
    }
  }).state('u.profile-photos-gallery-old', {
    url: '/users/:user_id/profile/photos/gallery',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.profile-photos-gallery', $stateParams)}
    }
  }).state('u.tree-old', {
    url: '/users/:user_id/tree',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.tree', $stateParams)}
    }
  }).state('u.gedcom-import-old', {
    url: '/users/:user_id/gedcom/import',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.gedcom-import', $stateParams)}
    }
  }).state('u.gedcom-upload-old', {
    url: '/users/:user_id/gedcom/upload?import_id',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.gedcom-upload', $stateParams)}
    }
  }).state('u.gedcom-index-old', {
    url: '/users/:user_id/gedcom/index',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.gedcom-index', $stateParams)}
    }
  }).state('u.gedcom-details-old', {
    url: '/users/:user_id/gedcom/:gedcom_id/details',
    views: {
      '@': {controller: ($state, $stateParams) => $state.go('u.gedcom-details', $stateParams)}
    }
  });
});

angular.module('famicity')
  .controller('HelpsController', function(
    $scope, $rootScope, $stateParams, $location, $state,
    $translate, Help, notification, PageTitle,
    locale, $window, sessionManager, categories) {
    'use strict';

    $scope.help = {};

    $scope.menus = null;
    $scope.currentCategory = null;
    $scope.questions = null;
    $scope.answer = null;
    $scope.searchString = null;
    $scope.searchResults = null;
    $scope.submitted = false;
    $scope.categories = categories;

    function updateTitleAndDescription(titleKey, descriptionKey) {
      if (titleKey != null && descriptionKey != null) {
        $translate([titleKey, descriptionKey]).then(function(translations) {
          PageTitle.setTitle('Famicity - ' + translations[titleKey]);
          $rootScope.description = translations[descriptionKey];
        }).catch(function() {
          PageTitle.setTitle('Famicity');
          $rootScope.description = $translate.instant('BASELINE_START_STORY');
        }).finally(function() {
          $window.prerenderReady = true;
        });
      }
    }

    $scope.locale = locale || sessionManager.getLocale();
    $scope.userId = sessionManager.getUserId() || null;
    let titleKey = null;
    let descriptionKey;
    descriptionKey = null;
    if ($stateParams.answer_id) {
      $scope.answer = Help.get({answer_id: $stateParams.answer_id, locale: 'fr'});
      titleKey = 'TITLE.PUBLIC.HELPS';
      descriptionKey = 'DESCRIPTION.PUBLIC.HELPS';
      $scope.answer.$promise.then(function(response) {
        $scope.currentCategory = response.page;
      });
    } else if ($stateParams.search_string) {
      $scope.searchString = $stateParams.search_string;
      $scope.help.helpQuestion = $stateParams.search_string;
      $scope.searchResults = Help.search({search_string: $scope.searchString, locale: 'fr'});
    } else {
      if ($stateParams.category_id) {
        $scope.currentCategory = $stateParams.category_id;
        titleKey = 'TITLE.PUBLIC.HELPS-' + $scope.currentCategory.toUpperCase();
        descriptionKey = 'DESCRIPTION.PUBLIC.HELPS-' + $scope.currentCategory.toUpperCase();
      } else {
        $scope.currentCategory = 'home';
      }
      $scope.questions = Help.page({category_id: $scope.currentCategory, locale: 'fr'});
    }
    $rootScope.$on('$translateChangeSuccess', function() {
      updateTitleAndDescription(titleKey, descriptionKey);
    });
    updateTitleAndDescription(titleKey, descriptionKey);

    $scope.search = function() {
      $scope.submitted = true;
      if ($scope.searchForm.$valid) {
        if ($scope.pageType === 'public') {
          $state.go('helps-search', {search_string: $scope.help.helpQuestion});
        } else {
          $state.go('u.helps-search-private', {search_string: $scope.help.helpQuestion, user_id: $scope.userId});
        }
      } else {
        notification.add('EMPTY_SEARCH', {warn: true});
      }
    };
  });

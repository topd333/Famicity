angular.module('famicity')
  .directive('fcGedcomLeftMenu', function(navigation, $modal, gedcomService) {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/views/gedcom/gedcom_left_menu.html',
      controller($scope) {
        $scope.goToImportGedcomPage = function() {
          navigation.go('gedcom-import-wizard', {user_id: $scope.userId});
        };
        $scope.goToGedcomIndexPage = function() {
          navigation.go('u.gedcom-index', {user_id: $scope.userId});
        };
      }
    };
  });

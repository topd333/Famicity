angular.module('famicity.gedcom')
  .controller('GedcomDetailsController', function(
    $scope, $stateParams, profileService, Gedcom, me, detail, profile, gedcomService) {
    'use strict';
    $scope.userId = me.id;
    $scope.gedcomId = detail.id;
    $scope.gedcomDetails = detail;
    $scope.basicProfile = profile;

    $scope.gedcomId = $stateParams.gedcom_id;
    return gedcomService.details($scope.gedcomId).then(function(response) {
      $scope.gedcomDetails = response;
      const replaceContactLink = function(error) {
        return error.message.replace('<contact>', '<a href=\'/settings/contact\'>')
          .replace('</contact>', '</a>');
      };
      $scope.gedcomDetails.events.forEach(function(event) {
        event.public_errors.map(replaceContactLink);
        event.internal_errors.map(replaceContactLink);
        event.warnings.map(replaceContactLink);
      });
    });
  });

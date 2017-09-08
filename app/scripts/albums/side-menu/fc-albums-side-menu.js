angular.module('famicity')
  .directive('fcAlbumsSideMenu', function($moment) {
    'use strict';
    return {
      templateUrl: '/scripts/albums/side-menu/fc-albums-side-menu.html',
      restrict: 'E',
      link(scope) {
        scope.getAlbumDate = () => $moment.fromServer(scope.album.event_date).format('L');
      }
    };
  });

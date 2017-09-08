angular.module('famicity.album')
  .controller('AlbumCreateController', function(
    $scope, $state, $stateParams, ModalManager,
    $location, $filter, $q, Album, EventResourceService,
    Permission, notification, me, permissionService, postService) {
    'use strict';

    var log = debug('fc-AlbumCreateController');

    $scope.formStatus = {isEditing: true, show: {formTypes: false}};
    $scope.me = me;
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.eventId = $stateParams['event_id'];
    $scope.submitted = false;
    $scope.formInProgress = false;
    var eventService = new EventResourceService();

    $scope.requiredFields = {
      title: 'album.REQUIRED.TITLE'
    };

    $scope.createAlbum = function(object, required) {
      let defer = $q.defer();
      postService.warnAbout(object, required).then(function(object) {
        if (object.event_date) {
          object.event_date = $filter('date')(object['event_date'], 'yyyy-MM-dd');
        }
        var addPromise;
        var albumObject = {
          description: object.textValue,
          event_date: object.event_date,
          location: object.location,
          title: object.title
        };
        if (!$scope.eventId) {
          addPromise = new Album(albumObject).$save({
            user_id: $scope.viewedUserId
          });
        } else {
          addPromise = eventService.createEventAlbum($scope.viewedUserId, $scope.eventId, albumObject);
        }
        addPromise.then(function(response) {
          var albumData = {
            id: response.id || response.album.id,
            type: 'album'
          };
          log('Saved album #%o', albumData.id);
          permissionService.update(albumData, $scope.album.permissions)
            .then(function() {
              notification.add('ALBUM_CREATED_SUCCESS_MSG');
              defer.resolve();
              $state.go('u.albums-show', {user_id: $scope.viewedUserId, album_id: albumData.id});
            }).catch(function(errors) {
              log('saveAlbum: permissions failed %o', errors);
              notification.add('ALBUM_CREATION_FAILED', {warn: true});
            });
        }).catch(function(errors) {
          log('saveAlbum: failed %o', errors);
          defer.reject();
        });
      }).catch(error => defer.reject(error));
      return defer.promise;
    };
  });

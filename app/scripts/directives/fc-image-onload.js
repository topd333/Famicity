angular.module('famicity').directive('fcImageOnload', function() {
  'use strict';
  const log = debug('fc-ImageOnload');
  return {
    restrict: 'A',
    link(scope, element) {
      element.bind('load', function(event) {
        const maxWidthHeight = Math.min(event.target.width, event.target.height);
        if (!scope.coordinates) {
          new Cropper(this, {
            min_width: 50,
            min_height: 50,
            max_width: maxWidthHeight,
            max_height: maxWidthHeight,
            ratio: {
              width: 1,
              height: 1
            },
            update(coordinates) {
              scope.coordinates = coordinates;
              log('coordinates=%o', coordinates);
            }
          });
        }
      });
    }
  };
});

angular.module('famicity')
  .service('rotationUtilService', function(Photo, LoadingAnimationUtilService) {
    'use strict';
    return {
      rotate(imgWrapper, img, angle) {
        const ruleBy3 = function(w1, h1, w2) {
          return w2 * h1 / w1;
        };
        const width = img.offsetWidth;
        const height = img.offsetHeight;
        const wrapperParentWidth = imgWrapper.parentNode.offsetWidth;
        const horizontal = angle === 90 || angle === -90 || angle === 270 || angle === -270;
        if (horizontal) {
          if (height > wrapperParentWidth) {
            imgWrapper.style.width = wrapperParentWidth + 'px';
            imgWrapper.style.height = ruleBy3(height, width, wrapperParentWidth) + 'px';
            img.style.height = ruleBy3(height, width, wrapperParentWidth) + 'px';
          } else {
            imgWrapper.style.width = height + 'px';
            imgWrapper.style.height = width + 'px';
          }
        } else if (!horizontal) {
          if (width > wrapperParentWidth) {
            imgWrapper.style.width = wrapperParentWidth + 'px';
            imgWrapper.style.height = ruleBy3(width, height, wrapperParentWidth) + 'px';
            img.style.height = ruleBy3(width, height, wrapperParentWidth) + 'px';
          } else {
            imgWrapper.style.width = width + 'px';
            imgWrapper.style.height = height + 'px';
          }
        }
        switch (angle) {
          case 90:
          case -270:
            img.style.left = 0 + 'px';
            img.style.top = -height + 'px';
            break;
          case 180:
          case -180:
            img.style.left = width + 'px';
            img.style.top = -height + 'px';
            break;
          case 0:
          case -0:
            img.style.left = '0px';
            img.style.top = '0px';
            break;
          case 270:
          case -90:
            img.style.left = height + 'px';
            img.style.top = width - height + 'px';
            break;
          default:
        }
        img.style.webkitTransform = 'rotate(' + angle + 'deg)';
        img.style.mozTransform = 'rotate(' + angle + 'deg)';
        img.style.msTransform = 'rotate(' + angle + 'deg)';
        img.style.oTransform = 'rotate(' + angle + 'deg)';
        img.style.transform = 'rotate(' + angle + 'deg)';
      },
      validateRotation($scope, angle) {
        let photo;
        let rotation = 0;
        switch (angle) {
          case 90:
          case -270:
            rotation = 1;
            break;
          case 180:
          case -180:
            rotation = 2;
            break;
          case 0:
          case -0:
            rotation = 0;
            break;
          case 270:
          case -90:
            rotation = 3;
            break;
          default:
        }
        photo = new Photo({rotation});
        photo.$update({
          user_id: $scope.viewedUserId,
          album_id: $scope.albumId,
          photo_id: $scope.photoId
        }).then(function() {
          $scope.rotation = 0;
          return LoadingAnimationUtilService.deactivate();
        });
      }
    };
  });

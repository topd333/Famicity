angular.module('famicity').directive('fcOutsideClick', function($document) {
    'use strict';
    let postLink;
    return {
      link: postLink = function(scope, element, attrs) {
        let onClick;
        onClick = function(event) {
          let isChild;
          let isInside;
          let isSelf;
          isChild = element.has(event.target).length > 0;
          isSelf = element[0] === event.target;
          isInside = isChild || isSelf;
          if (!isInside) {
            scope.$apply(attrs.outsideClick);
          }
        };
        scope.$watch(attrs.isActive, function(newValue, oldValue) {
          if (newValue !== oldValue && newValue === true) {
            $document.bind('click', onClick);
          } else if (newValue !== oldValue && newValue === false) {
            $document.unbind('click', onClick);
          }
        });
      }
    };
  }
);


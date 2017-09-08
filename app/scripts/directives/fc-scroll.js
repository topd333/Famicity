angular.module('famicity')
  .service('scrollService', function() {
    'use strict';
    const easingPattern = function(progress) {
      // acceleration until halfway, then deceleration
      return progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
    };

    return {
      /**
       *
       * @param target target
       * @param anchorId Where to scroll to
       * @param duration The scroll duration, in ms
       * @param scrolled The scrollable element
       */
      scrollTo(target, duration, scrolled, anchorId) {
        log('scrolling to %o', target);
        const targetStart = target.offsetTop;
        // Calculate how far to scroll
        // const startLocation = viewStart || scrolled.scrollTop;
        const startLocation = scrolled.scrollTop;
        const endLocation = targetStart;
        const distance = endLocation - startLocation;

        let runAnimation;
        // Function to stop the scrolling animation
        const stopAnimateIfRequired = function(pos) {
          if (pos === endLocation) {
            cancelAnimationFrame(runAnimation);
            if (anchorId) {
              location.hash = anchorId;
            }
            log('currentPage=%s', anchorId);
          }
        };
        // Set the animation variables to 0/undefined.
        let timeLapsed = 0;
        let percentage;
        let position;

        const animate = function() {
          let currentPage;
          runAnimation = requestAnimationFrame(animate);
          timeLapsed += 16;
          percentage = timeLapsed / duration;
          if (percentage > 0.5) {
            currentPage = anchorId;
          }
          percentage = percentage > 1 ? 1 : percentage;
          position = startLocation + distance * easingPattern(percentage);
          scrolled.scrollTop = position;
          stopAnimateIfRequired(position);
          return currentPage;
        };
        // Loop the animation function
        return animate();
      }
    };
  })
  .directive('fcScroll', function($timeout, scrollService, $document, $window) {
    'use strict';
    const isTouchDevice = isMobile.phone || isMobile.tablet;
    const isLargeScreen = $window.innerWidth > 768;

    const scrolled = $document[0].getElementById('scroll');

    const pages = [];
    let currentPage;

    function pageIndex(pageId) {
      for (let p = 0; p < pages.length; p++) {
        if (pages[p].page === pageId) {
          return p;
        }
      }
    }

    let keyHandler;

    function addPage(pageId, duration, register) {
      if (register !== 'false') {
        const p = pageIndex(pageId);
        if (angular.isUndefined(p)) {
          if (!currentPage) {
            currentPage = pageId;
          }
          pages.push({page: pageId, duration});
        }
      }
    }

    angular.element(document).on('fc-scroll:destroy', function() {
      if (keyHandler) {
        angular.element(document).off('keydown', keyHandler);
      }
      // TODO: Remove scroll and wheel handlers
    });

    function anchorIdToTarget(anchorId) {
      const targetId = anchorId.substring(1);
      return $document[0].getElementById(targetId);
    }

    function ScrollHandler(elem, attrs, isPageScrolling) {
      const page = elem[0];
      const duration = parseInt(attrs.duration || '850', 10);

      if (attrs.href) {
        const isPageTriggerHandled = !isTouchDevice && isLargeScreen && isPageScrolling;
        if (isPageTriggerHandled) {
          const href = attrs.href;
          elem.on('click', function(e) {
            e.preventDefault();
            currentPage = scrollService.scrollTo(anchorIdToTarget(href), duration, scrolled);
          });
        }
      } else if (attrs.anchorId) {
        const pageId = attrs.id;
        addPage(pageId, duration, attrs.register);
        const pageStart = page.offsetTop;
        scrolled.addEventListener('scroll', function() {
          const pageHeight = elem.height();
          if (scrolled.scrollTop < pageStart + pageHeight / 2 && scrolled.scrollTop >= pageStart - pageHeight / 2) {
            elem.addClass('targeted');
            currentPage = pageId;
          } else {
            elem.removeClass('targeted');
          }
        });
      }
    }

    return {
      restrict: 'A',
      link(scope, elem, attrs) {
        if (angular.isUndefined(scope.pageScrolling)) {
          scope.pageScrolling = true;
        }
        return new ScrollHandler(elem, attrs, scope.pageScrolling);
      }
    };
  });

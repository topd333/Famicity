angular.module('famicity')
/**
 * User Interface utility functions
 */
  .service('uiUtil', function() {
    'use strict';

    /**
     * Computes the width of the possible scrollbar in a scrollable container.
     * This allows computing the proper width of scrolled content.
     *
     * @param scrollableContainer
     * @returns {number} The detected scrollbar width in pixels, including 0 (zero) if the scrollbars are not visible (Mac or touch device)
     */
    const getScrollBarWidthOf = function(scrollableContainer) {
      var scrollbarWidth;
      var scrollDiv = document.createElement('div');
      scrollDiv.className = 'scrollbar-measure';
      scrollableContainer.appendChild(scrollDiv);
      scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      scrollableContainer.removeChild(scrollDiv);
      return scrollbarWidth;
    };

    /**
     * Notifies elements of a scrollbar width so they can apply a margin to let it display
     *
     * @param scrollbarWidth The width in pixels.
     */
    const updateForScrollBarWidth = function(scrollbarWidth) {
      var elements = angular.element('.fc-scrollbar-aware');
      elements.each(function(index, element) {
        angular.element(element).css('right', scrollbarWidth + 'px');
      });
    };

    return {
      getScrollBarWidthOf,
      updateForScrollBarWidth
    };
  });

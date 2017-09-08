class QuotesController {
  constructor() {
    this.currentQuote = 0;
    this.lastQuote = 6;
  }
  quotePrev() {
    this.currentQuote = this.currentQuote === 0 ? this.lastQuote : this.currentQuote - 1;
  }
  quoteNext() {
    this.currentQuote = this.currentQuote === this.lastQuote ? 0 : this.currentQuote + 1;
  }
}

angular.module('famicity')
  .directive('fcPresentation', function(uiUtil) {
    'use strict';
    return {
      restrict: 'EA',
      templateUrl: '/scripts/presentation/fc-presentation.html',
      link() {
        const scrollZone = angular.element('#scroll')[0];
        const scrollBarWidth = uiUtil.getScrollBarWidthOf(scrollZone);
        uiUtil.updateForScrollBarWidth(scrollBarWidth);
      }
    };
  })
  .controller('QuotesController', QuotesController);


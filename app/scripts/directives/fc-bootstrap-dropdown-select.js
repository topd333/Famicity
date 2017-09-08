angular.module('famicity').directive('fcBootstrapDropdownSelect', function($compile, $translate) {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      items: '=dropdownData',
      themodel: '=ngModel',
      doSelect: '&selectVal',
      selectedItem: '=preselectedItem'
    },
    link(scope, element) {
      var html, i;
      html = `
      <div class="btn-group btn-block form-group btn-group-for-select" dropdown is-open="isopen">
        <button class="btn-options-choice btn-block btn btn-default btn-lg button-label dropdown-control dropdown-toggle" type="button" dropdown-toggle>
          <span class="col-xs-10">{{ themodel | translate }}</span>
          <span class="col-xs-2 caret-container">
            <span class="caret"></span>
          </span>
        </button>
        <ul class="dropdown-menu" role="menu">
          <li ng-repeat="item in items | orderBy:translate">
            <a tabindex="-1" data-ng-click="selectVal(item)" translate>{{item.key}}</a>
          </li>
        </ul>
      </div>`;
      element.append($compile(html)(scope));
      i = 0;
      scope.isopen = false;
      scope.selectVal = function(itm) {
        if (!itm) {
          scope.themodel = scope.items[0].key;
        } else {
          scope.themodel = itm.key;
        }
        return scope.close();
      };
      scope.close = function() {
        scope.isopen = false;
      };
      scope.translate = function(item) {
        return $translate.instant(item.key);
      };
      while (i < scope.items.length) {
        if (scope.items[i].id === scope.selectedItem) {
          scope.selectVal(scope.items[i]);
          break;
        }
        i++;
      }
    }
  };
});

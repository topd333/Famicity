angular.module('famicity')
  .directive('fcPattern', function($timeout) {
    'use strict';
    var log = debug('fc-pattern');
    return {
      restrict: 'A',
      scope: {
        patterns: '=fcPattern',
        locale: '@',
        value: '@?',
        placeholder: '@?',
        onChange: '&?',
        inputType: '@',
        readOnly: '@?'
      },
      require: '?ngModel',
      templateUrl: '/scripts/common/pattern/fc-pattern.html',
      compile: function compile(elem) {
        return {
          pre: function preLink(scope, iElement, iAttrs, modelCtrl) {
            if (scope.readOnly === 'true') {
              elem.find('input').attr('readonly', 'true');
            }
            if (modelCtrl) {
              modelCtrl.$render = function() {
                $timeout(function() {
                  scope.value = modelCtrl.$viewValue;
                  scope.update();
                });
              };
            }
            scope.defaultPlaceHolder = scope.placeholder || '';

            var focused;
            scope.update = function() {
              if (!scope.value && !focused) {
                scope.inputPlaceHolder = scope.defaultPlaceHolder;
                return;
              } else {
                scope.inputPlaceHolder = '';
              }
              scope.match = [];
              var bestMatch;
              for (let i = 0; i < scope.patterns.length; i++) {
                var pat = scope.patterns[i];
                if (!pat.locales || !pat.locales.length || pat.locales.indexOf(scope.locale) >= 0) {
                  var localMatch = pat.matches(scope.value);
                  if (localMatch) {
                    if (bestMatch) {
                      if (pat.locales && pat.locales.length && bestMatch.locales.length > pat.locales.length) {
                        bestMatch = pat;
                      }
                    } else {
                      bestMatch = pat;
                    }
                    scope.match.push({format: pat, values: localMatch});  // One more matching pattern
                  }
                }
              }
              var typedLength;
              if (scope.value) {
                typedLength = scope.value.length;
                for (let i = 0; i < typedLength; ++i) {
                  scope.inputPlaceHolder += scope.value.charAt(i);  // Update the placeholder to start with the typed value
                }
              }
              var foundPattern;
              var exactMatch = scope.onChange({result: scope.match, isBlur: false, value: scope.value});
              if (!exactMatch) {
                if (bestMatch) {
                  foundPattern = bestMatch.pattern;
                }
              } else {
                foundPattern = exactMatch.pattern;
              }
              if (foundPattern) {
                scope.inputPlaceHolder += foundPattern.substring(typedLength);
              }
              if (modelCtrl && scope.value) {
                modelCtrl.$setViewValue(scope.value);
              }
            };

            scope.focused = function() {
              focused = true;
              scope.update();
            };

            scope.blurred = function() {
              focused = false;
              if (!scope.value) {
                scope.inputPlaceHolder = scope.defaultPlaceHolder;
                modelCtrl.$setViewValue(scope.value);
              }
              scope.onChange({result: scope.match, isBlur: true, value: scope.value});
            };
          }
        };
      }
    };
  });

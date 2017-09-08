angular.module('famicity')
  .directive('fcDateInput', function($timeout, $moment) {
    'use strict';
    const log = debug('fc-date-input');

    function dateToISOString(date) {
      return $moment(date).forServer();
    }

    function anyYear(year) {
      return year.year;
    }

    return {
      restrict: 'E',
      scope: {
        locale: '@',
        // Displayed when typing
        noGuessMessage: '@',
        // Displayed at blur
        notFoundMessage: '@',
        clickToConfirmMessage: '@',
        dateModel: '=ngModel',
        value: '=?',
        placeholder: '@?',
        isValid: '=?',
        showOutput: '=?',
        notifyError: '=?',
        yearCheck: '&?'
      },
      require: '?ngModel',
      templateUrl: '/scripts/common/date/fc-date-input.html',
      compile: function compile(elem) {
        return {
          pre: function preLink(scope, iElement, iAttrs, modelCtrl) {
            scope.id = elem[0].id;
            // scope.dateMax = dateToISOString(today);
            // scope.dateMin = dateToISOString(minDay);
            if (!scope.locale) {
              throw new Error('A locale is required for fc-date-input');
            }
            if (!iAttrs.yearCheck) {
              // Default year check
              scope.yearCheck = anyYear;
            }
            if (!scope.isValid || scope.isValid !== false) {
              scope.isValid = true;
            }
            scope.showOutput = scope.showOutput || false;
            if (modelCtrl) {
              modelCtrl.$render = function() {
                let date = modelCtrl.$viewValue;
                // This will happen when you're coming back to the form or reload a filled form.
                if (angular.isString(date)) {
                  date = new Date(date);
                  scope.dateModel = date;
                }
                $timeout(function() {
                  if (date) {
                    scope.patternModel = dateToISOString(date);
                    scope.changedISO();
                  } else {
                    scope.patternModel = '';
                    scope.changedISO();
                  }
                });
              };
            }
            scope.isTouch = isMobile.phone || isMobile.tablet;
            // All locales if not specified
            const isoPattern = {
              pattern: 'YYYY-MM-DD',
              locales: [],
              matches(value) {
                if (!/^[\d-]*$/.test(value)) {
                  return null;
                }
                const numbers = value.split('-');
                if (numbers.length <= 3) {
                  if (scope.yearCheck({year: this.getYear(numbers)})) {
                    return numbers;
                  }
                }
                return null;
              },
              getDayOfMonth(match) {
                return match[2];
              },
              getMonth(match) {
                return match[1];
              },
              getYear(match) {
                return match[0];
              },
              toString(y, m, d) {
                return y + '/' + m + '/' + d;
              }
            };
            scope.datePatterns = [
              {
                pattern: 'JJ/MM/AAAA',
                locales: ['fr'],
                matches(value) {
                  if (!/^[\d/]*$/.test(value)) {
                    return null;
                  }
                  const numbers = value.split('/');
                  if (numbers.length <= 3) {
                    return numbers;
                  }
                  return null;
                },
                getDayOfMonth(match) {
                  return match[0];
                },
                getMonth(match) {
                  return match[1];
                },
                getYear(match) {
                  return match[2];
                },
                toString(y, m, d) {
                  return d + '/' + m + '/' + y;
                }
              },
              {
                pattern: 'MM/DD/YYYY',
                locales: ['en'],
                matches(value) {
                  if (!/^[\d/]*$/.test(value)) {
                    return null;
                  }
                  const numbers = value.split('/');
                  if (numbers.length <= 3) {
                    return numbers;
                  }
                  return null;
                },
                getDayOfMonth(match) {
                  return match[1];
                },
                getMonth(match) {
                  return match[0];
                },
                getYear(match) {
                  return match[2];
                },
                toString(y, m, d) {
                  return m + '/' + d + '/' + y;
                }

              },
              isoPattern
              // {
              //  locales: ['fr'],
              //  pattern: 'DD MMMM YYYY',
              //  regex: /^([0-3]\d)?(?: ([A-zéû]{1,9}))?(?: (\d{1,4}))?$/,
              //  getDayOfMonth: function (match) {
              //    return match[1];
              //  },
              //  matches: function (value) {
              //    return value.match(this.regex);
              //  },
              //  getMonth: function (match) {
              //    var value = match[2];
              //    if (value) {
              //      var localeMonths = {
              //        'en': ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'décember'],
              //        'fr': ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre']
              //      };
              //      var months = localeMonths[scope.locale];
              //      value = util.removeDiacritics(value);
              //      //value = value.replace('1er ', '1 ');
              //      value = months.indexOf(value.toLowerCase());
              //      value = (value >= 0 ? value + 1 : null);
              //    }
              //    return value;
              //  },
              //  getYear: function (match) {
              //    return match[3];
              //  }
              // }
            ];

            scope.focused = function() {
              // log('focused!');
              // scope.dateModel = today;
            };
            scope.changedISO = function() {
              if (!scope.isTouch) {
                scope.datePatterns.some(function(pat) {
                  if (pat.locales && pat.locales.indexOf(scope.locale) >= 0) {
                    const match = isoPattern.matches(scope.patternModel);
                    if (match && pat.toString) {
                      scope.patternModel =
                        pat.toString(isoPattern.getYear(match), isoPattern.getMonth(match), isoPattern.getDayOfMonth(match));
                      return true;
                    }
                  }
                  return false;
                });
              }
            };

            scope.parseDate = function(result, isBlur, value) {
              scope.selected = null;
              let pattern;
              scope.guesses = [];
              if (result && result.length) {
                result.forEach(function(match) {
                  const pat = match.format;
                  const values = match.values;

                  let year = pat.getYear(values);
                  year = scope.yearCheck({year});
                  const month = pat.getMonth(values) - 1;
                  const day = pat.getDayOfMonth(values);

                  let date = $moment({year, month, day});

                  if (date && date.isValid() && day != null && day !== '' && month != null && month !== '' && year != null && year !== '') {
                    date = date.toDate();
                    if (modelCtrl) {
                      log('set date model to %o', date);
                      modelCtrl.$setViewValue(date);
                      setValid(true);
                    }
                    pattern = pat;
                    // var dateString = getDateString(date);
                    const dateString = $moment(date).format('LL');
                    // Remove duplicate guesses
                    if (scope.guesses.indexOf(dateString) < 0) {
                      scope.guesses.push({str: dateString, format: pattern});
                    }
                  } else if (value) {
                    setValid(false);
                  }
                });
              } else {
                modelCtrl.$setViewValue(undefined);
                log('parse(undefined)');
                if (value) {
                  setValid(false);
                } else {
                  setValid(true);
                }
              }
              if (!scope.guesses.length) {
                pattern = '';
                modelCtrl.$setViewValue(undefined);
                if (isBlur) {
                  scope.blurMessage = scope.notFoundMessage;
                  if (scope.patternModel) {
                    setValid(false);
                  } else {
                    setValid(true);
                  }
                }
              } else {
                setValid(true);
                scope.blurMessage = null;
                if (scope.guesses.length === 1 && scope.showOutput) {
                  // Remove pattern remaining after input
                  pattern = scope.guesses[0];
                }
              }
              return pattern;
            };

            scope.confirm = function(r) {
              scope.selected = r;
            };

            function setValid(valid) {
              scope.isValid = valid;
            }
          }
        };
      }
    };
  });

angular.module('famicity').factory('$moment', function(sessionManager, pubsub, PUBSUB) {
    'use strict';
    moment.log = debug('fc-moment');

    let locale = sessionManager.getLocale() || 'fr';

    pubsub.subscribe(PUBSUB.USER.UPDATE_LOCALE, function(event, newLocale) {
      locale = newLocale;
    });

    moment.locale(locale);
    moment.locale('fr', {
      longDateFormat: {
        LT: 'HH:mm',
        L: 'DD/MM/YYYY',
        LL: '[Le] dddd D MMMM YYYY',
        LLL: '[Le] D MMMM YYYY [à] LT',
        LLLL: '[Le] dddd D MMMM YYYY [à] LT'
      }
    });
    moment.locale('en', {
      longDateFormat: {
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'dddd, MMMM D, YYYY',
        LLL: 'MMMM D, YYYY [at] LT',
        LLLL: 'dddd, MMMM D, YYYY [at] LT'
      }
    });
    const withTimeCalendarData = {
      en: moment.localeData('en')._calendar,
      fr: moment.localeData('fr')._calendar
    };
    const withoutTimeCalendarData = {
      en: {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[last] dddd',
        sameElse: 'L'
      },
      fr: {
        sameDay: '[Aujourd\'hui]',
        nextDay: '[Demain]',
        nextWeek: 'dddd',
        lastDay: '[Hier]',
        lastWeek: 'dddd',
        sameElse: 'L'
      }
    };
    const timeOrDateCalendarData = {
      en: {
        sameDay: 'LT',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[last] dddd',
        sameElse: 'L'
      },
      fr: {
        sameDay: 'LT',
        nextDay: '[Demain]',
        nextWeek: 'dddd',
        lastDay: '[Hier]',
        lastWeek: 'dddd',
        sameElse: 'L'
      }
    };
    moment.fn.momentCalendarFunction = moment.fn.calendar;
    moment.fn.calendar = function(options) {
      options = options != null ? options : {
        withoutTime: false,
        timeOrDate: false
      };
      if (options.withoutTime) {
        moment.locale(locale, {
          calendar: withoutTimeCalendarData[moment.locale()]
        });
      } else if (options.timeOrDate) {
        moment.locale(locale, {
          calendar: timeOrDateCalendarData[moment.locale()]
        });
      } else {
        moment.locale(locale, {
          calendar: withTimeCalendarData[moment.locale()]
        });
      }
      return this.momentCalendarFunction();
    };
    moment.fn.forServer = function() {
      return this.format('YYYY-MM-DD');
    };
    moment.fromServer = function(value) {
      return this(value, 'YYYY-MM-DD');
    };
    return moment;
  }
);

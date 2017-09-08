angular.module('famicity').factory('util', function() {
  'use strict';

  const _ = {
    now: Date.now
  };

  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const debounce = function(func, wait, immediate) {
    let timeout;
    let args;
    let context;
    let timestamp;
    let result;

    const later = function() {
      const last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last); // eslint-disable-line
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) {
            context = args = null;
          }
        }
      }
    };

    return function() {
      context = this; // eslint-disable-line
      args = arguments;
      timestamp = _.now();
      const callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait); // eslint-disable-line
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  const throttle = function(func, wait, options = {}) {
    let context;
    let args;
    let result;
    let timeout = null;
    let previous = 0;
    const later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    };
    return function() {
      const now = _.now();
      if (!previous && options.leading === false) {
        previous = now;
      }
      const remaining = wait - (now - previous);
      context = this; // eslint-disable-line
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining); // eslint-disable-line
      }
      return result;
    };
  };

  const validateEmail = function(email) {
    return emailRegex.test(email);
  };

  function removeAllLatest(str, toRemove) {
    let found;
    do {
      const latestPos = str.length - toRemove.length;
      const latestStr = str.substring(latestPos, latestPos + toRemove.length);
      found = latestStr === toRemove;
      if (found) {
        str = str.substring(0, latestPos);
      }
    } while (found);
    return str;
  }

  function replaceLineBreaks(str, replacement) {
    str = str.replace(/<br>/g, replacement);
    str = str.replace(/<br \/>/g, replacement);
    return str;
  }

  const LINE_FEED = '\n';

  function stripParagraphTag(html, tag) {
    const regExp = new RegExp('<' + tag + '>([^<]*)<\/' + tag + '>', 'g');
    let utf = html.replace(regExp, '$1' + LINE_FEED);
    utf = removeAllLatest(utf, LINE_FEED);
    return utf;
  }

  const htmlToUTFParagraphs = function(html) {
    let str = html;
    str = replaceLineBreaks(str, LINE_FEED);
    str = stripParagraphTag(str, 'p');
    // IE
    str = stripParagraphTag(str, 'code');
    // IE
    str = stripParagraphTag(str, 'pre');
    // Chrome
    str = stripParagraphTag(str, 'div');
    return str;
  };

  const htmlToUTFChars = function(html) {
    function replaceChar(html, utfReplacement, htmlEscapeValue) {
      let utf;
      if (htmlEscapeValue) {
        const regExp = new RegExp('&' + htmlEscapeValue + ';', 'g');
        utf = html.replace(regExp, utfReplacement);
      } else {
        utf = html;
      }
      return utf;
    }

    function replaceCharEntity(html, utfReplacement, isoLatin1Code, htmlEntity) {
      let utf = html;
      utf = replaceChar(utf, utfReplacement, '#' + isoLatin1Code);
      utf = replaceChar(utf, utfReplacement, htmlEntity);
      return utf;
    }

    let str = html;
    str = replaceCharEntity(str, '&', 38, 'amp');
    str = replaceCharEntity(str, ' ', 160, 'nbsp');
    str = replaceCharEntity(str, '–', 8211, 'ndash');
    str = replaceCharEntity(str, '—', 8212, 'mdash');

    str = replaceCharEntity(str, '¡', 161, 'iquest');
    str = replaceCharEntity(str, '¿', 191, 'iexcl');

    str = replaceCharEntity(str, '"', 34, 'quot');
    str = replaceCharEntity(str, '‘', 8216, 'lsquo');
    str = replaceCharEntity(str, '’', 8217, 'rsquo');
    str = replaceCharEntity(str, '“', 8220, 'ldquo');
    str = replaceCharEntity(str, '”', 8221, 'rdquo');
    str = replaceCharEntity(str, '\'', 39);
    str = replaceCharEntity(str, '«', 171, 'laquo');
    str = replaceCharEntity(str, '»', 187, 'raquo');

    str = replaceCharEntity(str, '©', 169, 'copy');
    str = replaceCharEntity(str, '®', 174, 'reg');

    str = replaceCharEntity(str, '÷', 247, 'divide');
    str = replaceCharEntity(str, '>', 62, 'gt');
    str = replaceCharEntity(str, '<', 60, 'lt');
    str = replaceCharEntity(str, '±', 177, 'plusmn');

    str = replaceCharEntity(str, '°', 176, 'deg');
    str = replaceCharEntity(str, 'µ', 181, 'micro');
    str = replaceCharEntity(str, '·', 183, 'middot');

    str = replaceCharEntity(str, '¢', 162, 'cent');
    str = replaceCharEntity(str, '€', 8364, 'euro');
    str = replaceCharEntity(str, '£', 163, 'pound');
    str = replaceCharEntity(str, '¥', 165, 'yen');

    str = replaceCharEntity(str, '¶', 182, 'para');
    str = replaceCharEntity(str, '§', 167, 'sect');

    str = replaceCharEntity(str, 'À', 192, 'Agrave');
    str = replaceCharEntity(str, 'Á', 193, 'Aacute');
    str = replaceCharEntity(str, 'Â', 194, 'Acirc');
    str = replaceCharEntity(str, 'Å', 197, 'Auml');
    str = replaceCharEntity(str, 'Æ', 198, 'AElig');
    str = replaceCharEntity(str, 'à', 224, 'agrave');
    str = replaceCharEntity(str, 'á', 225, 'aacute');
    str = replaceCharEntity(str, 'â', 226, 'acirc');
    str = replaceCharEntity(str, 'ã', 227, 'atilde');
    str = replaceCharEntity(str, 'ä', 228, 'auml');
    str = replaceCharEntity(str, 'å', 229, 'aring');
    str = replaceCharEntity(str, 'æ', 230, 'aelig');

    str = replaceCharEntity(str, 'Ç', 199, 'Ccedil');
    str = replaceCharEntity(str, 'ç', 231, 'ccedil');

    str = replaceCharEntity(str, 'È', 200, 'Egrave');
    str = replaceCharEntity(str, 'É', 201, 'Eacute');
    str = replaceCharEntity(str, 'Ê', 202, 'Ecirc');
    str = replaceCharEntity(str, 'Ë', 202, 'Euml');
    str = replaceCharEntity(str, 'é', 233, 'eacute');
    str = replaceCharEntity(str, 'è', 232, 'egrave');
    str = replaceCharEntity(str, 'ê', 234, 'ecirc');
    str = replaceCharEntity(str, 'ë', 235, 'euml');

    str = replaceCharEntity(str, 'Ì', 204, 'Igrave');
    str = replaceCharEntity(str, 'Í', 205, 'Iacute');
    str = replaceCharEntity(str, 'Î', 206, 'Icirc');
    str = replaceCharEntity(str, 'Ï', 207, 'Iuml');
    str = replaceCharEntity(str, 'ì', 236, 'iacute');
    str = replaceCharEntity(str, 'í', 237, 'igrave');
    str = replaceCharEntity(str, 'î', 238, 'icirc');
    str = replaceCharEntity(str, 'ï', 239, 'iuml');

    str = replaceCharEntity(str, 'Ñ', 209, 'Ntilde');
    str = replaceCharEntity(str, 'ñ', 241, 'ntilde');

    str = replaceCharEntity(str, 'ß', 223, 'szlig');

    str = replaceCharEntity(str, 'Ò', 210, 'Ograve');
    str = replaceCharEntity(str, 'Ò', 210, 'Ograve');
    str = replaceCharEntity(str, 'Ó', 211, 'Oacute');
    str = replaceCharEntity(str, 'Ô', 212, 'Ocirc');
    str = replaceCharEntity(str, 'Õ', 213, 'Otilde');
    str = replaceCharEntity(str, 'ò', 242, 'ograve');
    str = replaceCharEntity(str, 'ó', 243, 'oacute');
    str = replaceCharEntity(str, 'ø', 248, 'oslash');
    str = replaceCharEntity(str, 'ô', 244, 'ocirc');
    str = replaceCharEntity(str, 'õ', 245, 'otilde');
    str = replaceCharEntity(str, 'Ø', 216, 'Oslash');
    str = replaceCharEntity(str, 'Œ', 338, 'OElig');
    str = replaceCharEntity(str, 'œ', 339, 'oelig');

    str = replaceCharEntity(str, 'Ù', 217, 'Ugrave');
    str = replaceCharEntity(str, 'Ú', 218, 'Uacute');
    str = replaceCharEntity(str, 'Û', 219, 'Ucirc');
    str = replaceCharEntity(str, 'Ü', 220, 'Uuml');
    str = replaceCharEntity(str, 'ú', 250, 'uacute');
    str = replaceCharEntity(str, 'ù', 249, 'ugrave');
    str = replaceCharEntity(str, 'û', 251, 'ucirc');
    str = replaceCharEntity(str, 'ü', 252, 'uuml');

    str = replaceCharEntity(str, 'ÿ', 255, 'yuml');
    str = replaceCharEntity(str, 'Ÿ', 255, 'Yuml');

    str = replaceCharEntity(str, '´', 180);
    str = replaceCharEntity(str, '`', 96);

    return str;
  };

  const removeDiacritics = function(value) {
    return value.toLowerCase()
      .replace(new RegExp('\\s', 'g'), '')
      .replace(new RegExp('[àáâãäå]', 'g'), 'a')
      .replace(new RegExp('æ', 'g'), 'ae')
      .replace(new RegExp('ç', 'g'), 'c')
      .replace(new RegExp('[èéêë]', 'g'), 'e')
      .replace(new RegExp('[ìíîï]', 'g'), 'i')
      .replace(new RegExp('ñ', 'g'), 'n')
      .replace(new RegExp('[òóôõö]', 'g'), 'o')
      .replace(new RegExp('œ', 'g'), 'oe')
      .replace(new RegExp('[ùúûü]', 'g'), 'u')
      .replace(new RegExp('[ýÿ]', 'g'), 'y')
      .replace(new RegExp('\\W', 'g'), '');
  };

  const semVerCompare = function(a, b) {
    a = a.split('.');
    b = b.split('.');
    while (a.length && b.length) {
      if (a[0] !== b[0]) {
        return a[0] - b[0];
      }
      a.shift();
      b.shift();
    }
    return a.length - b.length;
  };

  return {
    debounce,
    throttle,
    validateEmail,
    htmlToUTFChars,
    htmlToUTFParagraphs,
    removeDiacritics,
    removeAllLatest,
    replaceLineBreaks,
    stripParagraphTag,
    semVerCompare
  };
});

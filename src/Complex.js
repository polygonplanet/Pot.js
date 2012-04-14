//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Complex.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Complex.
   * Comp + Lex.
   * Math and Numeric, lexical compare utilities.
   *
   * @name Pot.Complex
   * @type Object
   * @class
   * @static
   * @public
   */
  Complex : {}
});

update(Pot.Complex, {
  /**
   * @lends Pot.Complex
   */
  /**
   * Cast the value to numerical value.
   * All type of object can be convert.
   *
   *
   * @example
   *   debug(numeric(0));               // 0
   *   debug(numeric(1234567890));      // 1234567890
   *   debug(numeric(new Number(25)));  // 25
   *   debug(numeric(null));            // 0
   *   debug(numeric((void 0)));        // 0
   *   debug(numeric(true));            // 1
   *   debug(numeric(false));           // 0
   *   debug(numeric('abc'));           // 2748
   *   debug(numeric('0xFF'));          // 255
   *   debug(numeric('1e8'));           // 100000000
   *   debug(numeric('10px'));          // 10
   *   debug(numeric('1,000,000ms.'));  // 1000000
   *   debug(numeric('-512 +1'));       // -512
   *   debug(numeric([]));              // 0
   *   debug(numeric(['hoge']));        // 1
   *   debug(numeric(new Date()));      // 1323446177282
   *
   *
   * @param  {String|*}   value    The target value to convert numeric value.
   * @param  {Number}   (defaults) The default value if `value` is not numeric.
   * @return {Number}              Return the numeric value.
   * @type Function
   * @function
   * @static
   * @public
   */
  numeric : numeric,
  /**
   * Returns a random number. (supports float)
   *
   *
   * @example
   *   debug(rand(0, 1));
   *   // @results  1  (first tried)
   *
   * @example
   *   debug(rand(5, 5));
   *   // @results  5
   *
   * @example
   *   debug(rand(10, 1));
   *   // @results  7  (first tried)
   *
   * @example
   *   debug(rand(2.5, 5.75));
   *   // @results  4.64  (first tried)
   *
   * @example
   *   debug(rand(1, 1.8765));
   *   // @results  1.5087  (first tried)
   *
   *
   * @param  {Number|String}  (min)  Minimum or maximum numbers
   * @param  {Number|String}  (max)  Maximum or minimum numbers
   * @return {Number|String}         Random number between
   *                                   min and max.
   *                                   (including min and max)
   * @class
   * @name  Pot.Complex.rand
   * @type  Function
   * @function
   * @static
   * @public
   */
  rand : update(function(min, max) {
    var result = 0, args = arguments, me = Pot.Complex.rand,
        t, n, x, scale, forString = false;
    if (!me.getScale) {
      /**@ignore*/
      me.getScale = function(a) {
        var dot = '.', s = a.toString();
        return ~s.indexOf(dot) ? s.split(dot).pop().length : 0;
      };
    }
    if (isString(min) && isString(max)) {
      forString = true;
      min = min.charCodeAt(0);
      max = max.charCodeAt(0);
    }
    switch (args.length) {
      case 0: // Int32
          x = 0x7FFFFFFF;
          n = ~x;
          break;
      case 1:
          n = 0;
          x = min - 0;
          break;
      default:
          n = min - 0;
          x = max - 0;
    }
    if (n > x) {
      t = x;
      x = n;
      n = t;
    }
    if (isNaN(n)) {
      if (isNaN(x)) {
        result = 0;
      } else {
        result = x;
      }
    } else if (isNaN(x)) {
      if (isNaN(n)) {
        result = 0;
      } else {
        result = n;
      }
    } else if (!isFinite(n)) {
      if (isFinite(x)) {
        result = x;
      } else {
        result = 0;
      }
    } else if (!isFinite(x)) {
      if (isFinite(n)) {
        result = n;
      } else {
        result = 0;
      }
    } else {
      scale = Math.max(me.getScale(n), me.getScale(x));
      if (scale) {
        result = (Math.random() * (x - n) + n).toFixed(scale);
      } else {
        result = Math.floor(Math.random() * (x - n + 1)) + n;
      }
    }
    if (forString) {
      result = fromUnicode(result);
    } else {
      result = result - 0;
    }
    return result;
  }, (function() {
    var ALPHAS    = LOWER_ALPHAS + UPPER_ALPHAS,
        ALPHANUMS = ALPHAS + DIGITS;
    /**@ignore*/
    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return {
      /**
       * @lends Pot.Complex.rand
       */
      /**
       * Returns the random alphabet(s).
       *
       * @param  {Number}  (length)  Length.
       * @return {String}            The random alphabet(s).
       *
       * @name Pot.Complex.rand.alpha
       * @class
       * @type  Function
       * @function
       * @static
       * @public
       */
      alpha : update(function(length) {
        var result = '', c, len, max;
        len = isNumeric(length) ? length - 0 : 1;
        if (len > 0) {
          c = [];
          max = ALPHAS.length - 1;
          while (--len >= 0) {
            c[c.length] = ALPHAS.charAt(randInt(0, max));
          }
          result = c.join('');
        }
        return result;
      }, {
        /**
         * @lends Pot.Complex.rand.alpha
         */
        /**
         * Returns the random alphabet(s) as lowercase.
         *
         * @param  {Number}  (length)  Length.
         * @return {String}            The random alphabet(s).
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        lower : function(/*[length]*/) {
          return Pot.Complex.rand.alpha.apply(null, arguments).toLowerCase();
        },
        /**
         * Returns the random alphabet(s) as uppercase.
         *
         * @param  {Number}  (length)  Length.
         * @return {String}            The random alphabet(s).
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        upper : function(/*[length]*/) {
          return Pot.Complex.rand.alpha.apply(null, arguments).toUpperCase();
        }
      }),
      /**
       * @lends Pot.Complex.rand
       */
      /**
       * Returns the random alphabet(s) and digit(s).
       *
       * @param  {Number}  (length)  Length.
       * @param  {Boolean} (valid)   Whether the first character to
       *                               specify a alphabet.
       * @return {String}            The random alphabet(s) and digit(s).
       *
       * @name Pot.Complex.rand.alnum
       * @class
       * @type  Function
       * @function
       * @static
       * @public
       */
      alnum : update(function(length, valid) {
        var result = '', len, max, c;
        len = isNumeric(length) ? length - 0 : 1;
        if (len > 0) {
          c = [];
          max = ALPHANUMS.length - 1;
          if (valid) {
            c[c.length] = Pot.Complex.rand.alpha(1);
            len--;
          }
          while (--len >= 0) {
            c[c.length] = ALPHANUMS.charAt(randInt(0, max));
          }
          result = c.join('');
        }
        return result;
      }, {
        /**
         * @lends Pot.Complex.rand.alnum
         */
        /**
         * Returns the random alphabet(s) and digit(s) as lowercase.
         *
         * @param  {Number}  (length)  Length.
         * @param  {Boolean} (valid)   Whether the first character to
         *                               specify a alphabet.
         * @return {String}            The random alphabet(s) and digit(s).
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        lower : function(/*[length[, valid]]*/) {
          return Pot.Complex.rand.alnum.apply(null, arguments).toLowerCase();
        },
        /**
         * Returns the random alphabet(s) and digit(s) as uppercase.
         *
         * @param  {Number}  (length)  Length.
         * @param  {Boolean} (valid)   Whether the first character to
         *                               specify a alphabet.
         * @return {String}            The random alphabet(s) and digit(s).
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        upper : function(/*[length[, valid]]*/) {
          return Pot.Complex.rand.alnum.apply(null, arguments).toUpperCase();
        }
      }),
      /**
       * @lends Pot.Complex.rand
       */
      /**
       * Returns the random color part.
       *
       * @param  {Boolean}  (addSharp)  (Optional) Whether add the
       *                                  sharp '#' to prefix.
       * @return {String}               The random color part.
       *
       * @name Pot.Complex.rand.color
       * @class
       * @type  Function
       * @function
       * @static
       * @public
       */
      color : update(function(addSharp) {
        var col = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        while (col.length < 6) {
          col += Math.floor(Math.random() * 0xF).toString(16);
        }
        while (col.length > 6) {
          col = col.substring(1);
        }
        return (addSharp ? '#' : '') + col;
      }, {
        /**
         * @lends Pot.Complex.rand.color
         */
        /**
         * Returns the random color part as lowercase.
         *
         * @param  {Boolean}  (addSharp)  (Optional) Whether add the
         *                                  sharp '#' to prefix.
         * @return {String}               The random color part.
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        lower : function(/*[addSharp]*/) {
          return Pot.Complex.rand.color.apply(null, arguments).toLowerCase();
        },
        /**
         * Returns the random color part as uppercase.
         *
         * @param  {Boolean}  (addSharp)  (Optional) Whether add the
         *                                  sharp '#' to prefix.
         * @return {String}               The random color part.
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        upper : function(/*[addSharp]*/) {
          return Pot.Complex.rand.color.apply(null, arguments).toUpperCase();
        }
      }),
      /**
       * @lends Pot.Complex.rand
       */
      /**
       * Returns a string that converted by random case-sensitive of
       *   the alphabet in a given string.
       *
       *
       * @example
       *   var s = 'd41d8cd98f00b204e9800998ecf8427e';
       *   debug(rand.caseOf(s));
       *   // @results
       *   // e.g. 'D41D8Cd98F00b204E9800998Ecf8427e'
       *
       *
       * @param  {String}  string  Target string.
       * @return {String}          The result string.
       *
       * @name Pot.Complex.rand.caseOf
       * @class
       * @type  Function
       * @function
       * @static
       * @public
       */
      caseOf : function(string) {
        var result = '', s, i, len, c;
        s = stringify(string);
        if (s) {
          len = s.length;
          for (i = 0; i < len; i++) {
            c = s.charAt(i);
            if ((c >= 'a' && c <= 'z') ||
                (c >= 'A' && c <= 'Z')) {
              if (Math.random() * 10 >>> 0 < 5) {
                c = c.toLowerCase();
              } else {
                c = c.toUpperCase();
              }
            }
            result += c;
          }
        }
        return result;
      }
    };
  })()),
  /**
   * @lends Pot.Complex
   */
  /**
   * Return the value that limited in the range of
   *  maximum value from minimum value.
   *
   *
   * @example
   *   var result = limit(5, 10, 50);
   *   debug(result);
   *   // @results 10
   *
   * @example
   *   var result = limit(80, 10, 50);
   *   debug(result);
   *   // @results 50
   *
   * @example
   *   var result = limit(5, 2, 8);
   *   debug(result);
   *   // @results 5
   *
   * @example
   *   var result = limit(-5, -10, -50);
   *   debug(result);
   *   // @results -10
   *
   * @example
   *   var result = limit(-80, -10, -50);
   *   debug(result);
   *   // @results -50
   *
   * @example
   *   var result = limit('F', 'A', 'C');
   *   debug(result);
   *   // @results 'C'
   *
   * @example
   *   var result = limit('b', 'a', 'z');
   *   debug(result);
   *   // @results 'b'
   *
   * @example
   *   var result = limit(1, 2, 4, 5, 10, 20);
   *   debug(result);
   *   // @results 2
   *
   * @example
   *   var result = limit(100, 2, 4, 5, 10, 20);
   *   debug(result);
   *   // @results 20
   *
   *
   * @param  {Number|String|*}  x    A target value.
   * @param  {Number|String|*}  min  The minimum value, or maximum value.
   * @param  {Number|String|*}  max  The maximum value, or minimum value.
   * @return {Number|String|*}       The value in the range of
   *                                   `max` from `min`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  limit : function limit(x, min, max) {
    var result, tmp, args = arguments, values;
    switch (args.length) {
      case 0:
          result = void 0;
          break;
      case 1:
          result = x;
          break;
      case 2:
          if (x < min) {
            result = min;
          } else {
            result = x;
          }
          break;
      case 3:
          if (min > max) {
            tmp = min;
            min = max;
            max = tmp;
          }
          if (x < min) {
            result = min;
          } else if (x > max) {
            result = max;
          } else {
            result = x;
          }
          break;
      default:
          values = arrayize(args, 1);
          min = Math.min.apply(null, values);
          max = Math.max.apply(null, values);
          result = limit(x, min, max);
    }
    return result;
  },
  /**
   * Convert to the base 2 to 62 string from the base x string.
   * That can work for big scale integers.
   * The maximum base number is 62.
   * The base number '0' will be not converted.
   *
   *
   * @example
   *   var value = 'FFFFFFFF';
   *   var result = convertToBase(value, 16, 10);
   *   debug(result);
   *   // @results  result = '4294967295'
   *
   *
   * @example
   *   var value = '9223372036854775807';
   *   var result = convertToBase(value, 10, 16);
   *   debug(result);
   *   // @results  result = '7FFFFFFFFFFFFFFF'
   *
   *
   * @example
   *   var value = '11010100010011011010011101111' +
   *               '10110011001101101100111001101';
   *   var result = convertToBase(value, 2, 62);
   *   debug(result);
   *   // @results  result = 'HelloWorld'
   *
   *
   * @param  {Number|String}  value   the numeric or alphameric value.
   * @param  {Number}         from    the base number is in.
   * @param  {Number}         to      the base to convert number to.
   * @return {String}                 the numbers of result which was
   *                                    converted to base to base.
   * @type  Function
   * @function
   * @static
   * @public
   */
  convertToBase : function(value, from, to) {
    var BASE62MAP = DIGITS + UPPER_ALPHAS + LOWER_ALPHAS,
        result = '', numbers, end, i, pos, div, index,
        v = stringify(value, true),
        len = v.length,
        base = {
          from : from - 0,
          to   : to   - 0
        };
    if (!isNaN(base.from) && base.from > 0 && base.from < 63 &&
        !isNaN(base.to)   && base.to   > 0 && base.to   < 63) {
      numbers = [];
      for (i = 0; i < len; i++) {
        pos = BASE62MAP.indexOf(v.charAt(i));
        if (!~pos) {
          end = true;
          break;
        }
        numbers[i] = pos;
      }
      if (end) {
        return false;
      }
      do {
        div = index = i = 0;
        do {
          div = div * base.from + numbers[i];
          if (div >= base.to) {
            numbers[index++] = Math.floor(div / base.to);
            div = div % base.to;
          } else if (index > 0) {
            numbers[index++] = 0;
          }
        } while (++i < len);
        len = index;
        result = BASE62MAP.charAt(div) + result;
      } while (index !== 0);
    }
    return result;
  },
  /**
   * Compare two version strings.
   * Version strings are dot-separated sequences of
   *  version-parts.
   * Numbers are base-10, and are zero if left out.
   * Strings are compared basic
   *  textual versions (e.g., "beta" and "alpha" etc.).
   *
   *
   * @example
   *   function compareVersionsRepr(a, b) {
   *     var x = compareVersions(a, b);
   *     if (x == 0) {
   *       return a + ' == ' + b;
   *     } else if (x > 0) {
   *       return a + ' > '  + b;
   *     } else {
   *       return a + ' < '  + b;
   *     }
   *   }
   *   debug(compareVersionsRepr('1.0pre', '1.0'));
   *   // @results '1.0pre < 1.0'
   *
   *
   * @example
   *   debug(compareVersions('8.2.5rc', '8.2.5a'));
   *   // @results 1
   *   debug(compareVersions('8.2.50', '8.2.52'));
   *   // @results -1
   *   debug(compareVersions('5.3.0-dev', '5.3.0'));
   *   // @results -1
   *   debug(compareVersions('4.1.0.52', '4.01.0.51'));
   *   // @results 1
   *   debug(compareVersions('1.01a', '1.01'));
   *   // @results -1
   *   debug(compareVersions('1.0.0', '1.0.00'));
   *   // @results 0
   *   debug(compareVersions('2.1.0', '2.0.0', '<'));
   *   // @results false
   *   debug(compareVersions('2.1.0', '2.0.0', '>'));
   *   // @results true
   *   debug(compareVersions('2.1.0a', '2.1.0a', '=='));
   *   // @results true
   *
   *
   * @param  {String|Number}  ver1   The first version.
   * @param  {String|Number}  ver2   The second version.
   * @param  {String}   (operator)   (Optional) Comparison operator.
   * @return {Number}                If `ver1` and `ver2` are two version
   *                                   being compared, and the return value:
   *                                   - is smaller than 0, then A < B.
   *                                   - equals 0 then Version, then A == B.
   *                                   - is bigger than 0, then A > B.
   * @type  Function
   * @function
   * @static
   * @public
   */
  compareVersions : function(ver1, ver2, operator) {
    var result = 0, me = Pot.Complex.compareVersions, v1, v2, max, i;
    if (!me.prep) {
      update(me, {
        versionMapMin : -7,
        versionMaps   : {
          canary      : -7,
          dev         : -6,
          d           : -6,
          prealpha    : -6,
          pre         : -6,
          pa          : -6,
          nightly     : -6,
          n           : -6,
          minefield   : -6,
          trunk       : -6,
          aurora      : -5,
          alpha       : -5,
          a           : -5,
          beta        : -4,
          b           : -4,
          publicbeta  : -3,
          pb          : -3,
          rc          : -3,
          r           : -3,
          '#'         : -2,
          rtm         : -1,
          rt          : -1,
          stable      : -1,
          s           : -1,
          release     : -1,
          ga          : -1,
          g           : -1,
          pl          : -1,
          p           : -1
        },
        replaceMaps : [{
          from : /[\s\u00A0\u3000]+/g,
          to   : ''
        }, {
          from : /(\d*)([x*]+)(?:[.]|$)/g,
          to   : function(a, d, x) {
            return d + (new Array(x.length + 1).join('9')) + '.';
          }
        }, {
          from : /[_+-]/g,
          to   : '.'
        }, {
          from : /([^.0-9]+)/g,
          to   : '.$1.'
        }, {
          from : /[.]{2,}/g,
          to   : '.'
        }],
        prep : function(ver) {
          var v = stringify(ver, true).toLowerCase();
          each(this.replaceMaps, function(re) {
            v = v.replace(re.from, re.to);
          });
          return  (v.length === 0)   ?
            [this.versionMapMin - 2] : v.split(/[.]+/);
        },
        numbering : function(ver) {
          if (!ver) {
            return 0;
          } else if (isNaN(ver)) {
            return this.versionMaps[ver] || this.versionMapMin - 1;
          } else {
            return parseInt(ver, 10);
          }
        }
      });
    }
    v1 = me.prep(ver1);
    v2 = me.prep(ver2);
    max = Math.max(v1.length, v2.length);
    for (i = 0; i < max; i++) {
      if (v1[i] === v2[i]) {
        continue;
      }
      v1[i] = me.numbering(v1[i]);
      v2[i] = me.numbering(v2[i]);
      if (v1[i] < v2[i]) {
        result = -1;
        break;
      }
      if (v1[i] > v2[i]) {
        result = 1;
        break;
      }
    }
    if (operator) {
      switch (String(operator).toLowerCase()) {
        case '<':
        case 'lt':
            result = (result < 0);
            break;
        case '>':
        case 'gt':
            result = (result > 0);
            break;
        case '<=':
        case 'le':
            result = (result <= 0);
            break;
        case '>=':
        case 'ge':
            result = (result >= 0);
            break;
        case '<>':
        case '!==':
        case '!=':
        case 'ne':
            result = (result !== 0);
            break;
        case '===':
        case '==':
        case '=':
        case 'eq':
        default:
            result = (result === 0);
      }
    }
    return result;
  }
});

// Update Pot object.
Pot.update({
  numeric         : Pot.Complex.numeric,
  rand            : Pot.Complex.rand,
  limit           : Pot.Complex.limit,
  convertToBase   : Pot.Complex.convertToBase,
  compareVersions : Pot.Complex.compareVersions
});

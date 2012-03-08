//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Format.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Format utilities.
   *
   * @name Pot.Format
   * @type Object
   * @class
   * @static
   * @public
   */
  Format : {}
});

update(Pot.Format, {
  /**
   * @lends Pot.Format
   */
  /**
   * sprintf.
   *
   * This function is compatible with PHP sprintf function that
   *  was referenced from the PHP source code.
   *
   * @link http://php.net/function.sprintf
   *
   * <pre>
   * Extended type specifiers:
   *
   *   - a : Return the string in lowercase the result encoded in base 36.
   *   - A : Return the string in uppercase the result encoded in base 36.
   *
   * </pre>
   *
   *
   * @example
   *   var num = 5;
   *   var place = 'tree';
   *   var result = sprintf('There are %d monkeys in the %s.', num, place);
   *   debug(result);
   *   // @results 'There are 5 monkeys in the tree.'
   *
   *
   * @example
   *   var n =  43951789;
   *   var u = -43951789;
   *   var c = 65; // ASCII 65 is 'A'
   *   // notice the double %%, this prints a literal '%' character
   *   debug(sprintf("%%b = '%b'", n)); // binary
   *   debug(sprintf("%%c = '%c'", c)); // print the ascii character
   *   debug(sprintf("%%d = '%d'", n)); // standard integer
   *   debug(sprintf("%%e = '%e'", n)); // scientific notation
   *   debug(sprintf("%%u = '%u'", n)); // unsigned integer (positive)
   *   debug(sprintf("%%u = '%u'", u)); // unsigned integer (negative)
   *   debug(sprintf("%%f = '%f'", n)); // floating point
   *   debug(sprintf("%%o = '%o'", n)); // octal
   *   debug(sprintf("%%s = '%s'", n)); // string
   *   debug(sprintf("%%x = '%x'", n)); // hexadecimal (lower-case)
   *   debug(sprintf("%%X = '%X'", n)); // hexadecimal (upper-case)
   *   debug(sprintf("%%+d = '%+d'", n)); // sign specifier (positive)
   *   debug(sprintf("%%+d = '%+d'", u)); // sign specifier (negative)
   *   debug(sprintf("%%a = '%a'", n)); // base 36 format (lower-case)
   *   debug(sprintf("%%A = '%A'", n)); // base 36 format (upper-case)
   *   // @results
   *   //   %b = '10100111101010011010101101'
   *   //   %c = 'A'
   *   //   %d = '43951789'
   *   //   %e = '4.395179e+7'
   *   //   %u = '43951789'
   *   //   %u = '4251015507'
   *   //   %f = '43951789.000000'
   *   //   %o = '247523255'
   *   //   %s = '43951789'
   *   //   %x = '29ea6ad'
   *   //   %X = '29EA6AD'
   *   //   %+d = '+43951789'
   *   //   %+d = '-43951789'
   *   //   %a = 'q61f1'
   *   //   %A = 'Q61F1'
   *
   *
   * @example
   *   var date  = new Date();
   *   var year  = date.getFullYear();
   *   var month = date.getMonth() + 1;
   *   var day   = date.getDate();
   *   var isoDate = sprintf('%04d-%02d-%02d', year, month, day);
   *   debug(isoDate);
   *   // @results '2011-09-01'
   *
   *
   * @example
   *   var s = 'monkey';
   *   var t = 'many monkeys';
   *   debug(sprintf("[%s]",      s)); // standard string output
   *   debug(sprintf("[%10s]",    s)); // right-justification with spaces
   *   debug(sprintf("[%-10s]",   s)); // left-justification with spaces
   *   debug(sprintf("[%010s]",   s)); // zero-padding works on strings too
   *   debug(sprintf("[%'#10s]",  s)); // use the custom padding character '#'
   *   debug(sprintf("[%10.10s]", t)); // left-justification but with a
   *                                   //   cutoff of 10 characters
   *   // @results
   *   //   [monkey]
   *   //   [    monkey]
   *   //   [monkey    ]
   *   //   [0000monkey]
   *   //   [####monkey]
   *   //   [many monke]
   *
   *
   * @param  {String}  format   The format string is composed of zero or
   *                              more directives: ordinary characters
   *                              (excluding %) that are copied directly
   *                              to the result, and conversion
   *                              specifications, each of which results
   *                              in fetching its own parameter.
   * @param  {...*}    (...)    The variable arguments that will be
   *                              conversion specifier value.
   * @return {String}           The result string.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  sprintf : function(/*format[, ...args]*/) {
    var me = arguments.callee;
    if (!me.formatProcedure) {
      /**@ignore*/
      me.formatProcedure = (function() {
        var args,
            re = /%%|%('?(?:[0\u0020+-]|[^%\w.-])+|)(\d*|)(\.\d*|)([%a-z])/gi;
        /**@ignore*/
        function utf8(s) {
          return Pot.UTF8 && Pot.UTF8.encode(s) || stringify(s);
        }
        /**@ignore*/
        function parse(n, isFloat) {
          var r = isFloat ? parseFloat(n) : parseInt(n);
          return isNaN(r) ? 0 : r;
        }
        /**@ignore*/
        function base(n, val) {
          var r, i, len, octets;
          if (Pot.isNumeric(val)) {
            r = (parse(val) >>> 0).toString(n);
          } else {
            r = '';
            octets = utf8(val);
            len = octets.length;
            for (i = 0; i < len; ++i) {
              r += octets.charCodeAt(i).toString(n);
            }
          }
          return String((r && r.length) ? r : 0);
        }
        /**@ignore*/
        function pad(value, mark, width, precision, left, numeric) {
          var glue;
          width = width - 0;
          precision = precision - 0;
          if (value.length < width) {
            mark = stringify(mark) || ' ';
            glue = new Array(width + 1).join(mark).split('');
            while (glue && (glue.length + value.length > width)) {
              if (left) {
                glue.pop();
              } else {
                glue.shift();
              }
            }
            glue = glue.join('');
            value = left ? glue + value : value + glue;
          }
          return value;
        }
        /**@ignore*/
        function justify(value, mark, width, precision, left, numeric) {
          var sign, orgn, index, i, prevIdx;
          if (numeric) {
            value = value.toString();
            if (mark.charAt(0) === '+') {
              if (value - 0 >= 0) {
                if (Pot.isFunction(numeric)) {
                  value = mark.charAt(0) + numeric(value);
                } else {
                  value = mark.charAt(0) + (value - 0);
                }
              }
              mark = mark.substring(1);
            }
            if (mark.charAt(0) === '-') {
              left = false;
              mark = '';
            }
            sign = value.charAt(0);
            if (!~'+-'.indexOf(sign)) {
              sign = null;
            } else {
              orgn = value.substring(1);
            }
          }
          width = String(width).length ? (width - 0) : -1;
          precision = String(precision).length ? (precision - 0) : -1;
          if (width === 0) {
            value = '';
          } else {
            if (precision > 0) {
              value = value.slice(0, precision);
            }
            if (width > 0 && width > value.length) {
              value = pad(value, mark, width, precision, left, numeric);
            }
          }
          if (numeric && orgn && sign) {
            i = 1;
            do {
              prevIdx = index;
              index = value.indexOf(sign + orgn.slice(0, i));
            } while (index > 0 && ++i < value.length);
            if (!~index) {
              index = prevIdx;
            }
            if (index > 0) {
              value = sign + value.slice(0, index) + value.slice(index + 1);
            }
          }
          return value;
        }
        /**@ignore*/
        function rep(all, mark, width, precision, type) {
          var result = '', v, left, numeric = false, point;
          if (all === '%%') {
            result = '%';
          } else {
            left = true;
            if (mark.slice(-1) === '-') {
              left = false;
              mark = mark.slice(0, -1);
            }
            if (mark.indexOf("'") === 0) {
              if (mark.length > 1) {
                mark = mark.substring(1);
              }
            }
            if (precision.indexOf('.') === 0) {
              precision = precision.substring(1);
            }
            v = stringify(args.shift());
            switch (type) {
              case 'b':
                  v = base(2, v);
                  break;
              case 'c':
                  try {
                    v = Pot.isNumeric(v) ? fromUnicode(v) : '';
                  } catch (e) {
                    v = '';
                  }
                  break;
              case 'd':
                  numeric = true;
                  v = parse(v);
                  break;
              case 'u':
                  numeric = true;
                  v = (parse(v) >>> 0);
                  break;
              case 'e':
                  numeric = true;
                  point = 6;
                  v = parse(v, true);
                  if (precision) {
                    if (Pot.isNumeric(precision)) {
                      point = Math.max(0, Math.min(20, precision));
                    }
                    precision = null;
                  }
                  /**@ignore*/
                  numeric = function(n) {
                    return (+n).toExponential(point);
                  };
                  v = numeric(v);
                  break;
              case 'f':
                  numeric = true;
                  point = 6;
                  v = parse(v, true);
                  if (precision) {
                    if (Pot.isNumeric(precision)) {
                      precision = ((v < 0) ? 1 : 0) + (precision - 0);
                      point = Math.max(0, Math.min(20, precision));
                    }
                    precision = null;
                  }
                  /**@ignore*/
                  numeric = function(n) {
                    return (n - 0).toFixed(point);
                  };
                  v = numeric(v);
                  break;
              case 'o':
                  v = base(8, v);
                  break;
              case 'x':
                  v = base(16, v).toLowerCase();
                  break;
              case 'X':
                  v = base(16, v).toUpperCase();
                  break;
              case 's':
                  break;
              case 'a':
                  v = base(36, v).toLowerCase();
                  break;
              case 'A':
                  v = base(36, v).toUpperCase();
                  break;
              default:
                  break;
            }
            result = justify(v, mark, width, precision, left, numeric);
          }
          return ('' + result);
        }
        return function(format) {
          args = arrayize(arguments, 1);
          return stringify(format).replace(re, rep);
        };
      }());
    }
    return me.formatProcedure.apply(me, arguments);
  }
});

// Update Pot object.
Pot.update({
  sprintf : Pot.Format.sprintf
});

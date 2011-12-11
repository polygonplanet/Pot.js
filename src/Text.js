//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Text.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Text.
   * String utilities.
   *
   * Evaluate a string can be a scalar value only.
   * Return "1" when argument was passed as Boolean's `true`.
   * This function can treat XML object that
   *  will be string by toString method.
   *
   * @see Pot.Text.stringify
   *
   * @param  {*}        x              Any value.
   * @param  {Boolean} (ignoreBoolean) Optional, Ignores Boolean value.
   * @return {String}                  Value as a string.
   *
   * @name Pot.Text
   * @type Function
   * @function
   * @class
   * @static
   * @public
   */
  Text : function() {
    return stringify.apply(null, arguments);
  }
});

update(Pot.Text, {
  /**
   * @lends Pot.Text
   */
  /**
   * Evaluate a string can be a scalar value only.
   * Return "1" when argument was passed as true.
   * This function can treat XML object that
   *  will be string by toString method.
   *
   *
   * @example
   *   debug(stringify({}));
   *   // @results ''
   *   debug(stringify([]));
   *   // @results ''
   *   debug(stringify(0));
   *   // @results '0'
   *   debug(stringify(-100.02));
   *   // @results '-100.02'
   *   debug(stringify(new Date()));
   *   // @results ''
   *   debug(stringify(null));
   *   // @results ''
   *   debug(stringify(void 0));
   *   // @results ''
   *   debug(stringify(false));
   *   // @results ''
   *   debug(stringify(true));
   *   // @results '1'
   *   debug(stringify(''));
   *   // @results ''
   *   debug(stringify('hoge'));
   *   // @results 'hoge'
   *   debug(stringify(new String('hoge')));
   *   // @results 'hoge'
   *   debug(stringify(new Boolean(false)));
   *   // @results ''
   *   debug(stringify(new Boolean(true)));
   *   // @results '1'
   *   debug(stringify([100]));
   *   // @results ''
   *
   *
   * @param  {*}        x              Any value.
   * @param  {Boolean} (ignoreBoolean) Optional, Ignores Boolean value.
   * @return {String}                  Value as a string.
   * @type Function
   * @function
   * @public
   * @static
   */
  stringify : stringify,
  /**
   * Shortcut of String.fromCharCode().
   * This function fixed an error on 'stack overflow' (or RangeError).
   * e.g. String.fromCharCode.apply(null, new Array(100000000));
   *
   *
   * @example
   *   debug(chr(97));
   *   // @results 'a'
   *   debug(chr(97, 98, 99));
   *   // @results 'abc'
   *   debug(chr(
   *          [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]
   *   ));
   *   // @results 'Hello World!'
   *
   *
   * @param  {...Number|Array}  (...)  Unicode numbers, or an array.
   * @return {String}                  Converted string from Unicode number.
   * @type  Function
   * @function
   * @static
   * @public
   */
  chr : function(/*[...args]*/) {
    var args = arrayize(arguments), codes, chars, divs, i, len, limit, sc;
    chars = [];
    limit = 0x2000;
    sc = String.fromCharCode;
    if (args.length > 1) {
      codes = args;
    } else if (args.length === 1) {
      codes = arrayize(args[0]);
    } else {
      return '';
    }
    if (codes) {
      len = codes.length;
      if (len === 1 && codes[0] && codes[0].length < limit) {
        return sc.apply(null, codes);
      } else {
        for (i = 0; i < len; i += limit) {
          divs = codes.slice(i, i + limit);
          chars[chars.length] = sc.apply(null, divs);
        }
      }
    }
    return chars.join('');
  },
  /**
   * A shortcut of charCodeAt(0).
   *
   *
   * @example
   *   debug(ord('Hello'));
   *   // @results 72
   *
   *
   * @param  {String}  s  Target string.
   * @return {Number}     The first index Unicode number in `s`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  ord : function(s) {
    return stringify(s, true).charCodeAt(0);
  },
  /**
   * Trim the white spaces including em (U+3000).
   *
   * White spaces will not removed when specified the second argument.
   *
   * @example
   *   debug( trim(' hoge  ') );
   *   // @results 'hoge'
   *
   *
   * @example
   *   //
   *   // White spaces will not removed when 
   *   //  specified the second argument.
   *   //
   *   debug( trim('abbbcc cc ', 'ab') );
   *   // @results 'cc cc '
   *
   *
   * @param  {String}   s            A target string.
   * @param  {String}  (chars)       (Optional) Removing characters.
   * @param  {Boolean} (ignoreCase)  (Optional) Whether ignore case on RegExp.
   * @return {String}                A result string.
   * @type Function
   * @function
   * @public
   * @static
   */
  trim : trim,
  /**
   * Trim the white spaces including em (U+3000) from left side.
   *
   * White spaces will not removed when specified the second argument.
   *
   * @example
   *   debug( ltrim(' hoge  ') );
   *   // @results 'hoge  '
   *
   *
   * @example
   *   //
   *   // White spaces will not removed when 
   *   //  specified the second argument.
   *   //
   *   debug( ltrim('a cba', 'ac') );
   *   // @results ' cba'
   *
   *
   * @param  {String}   s            A target string.
   * @param  {String}  (chars)       (Optional) Removing characters.
   * @param  {Boolean} (ignoreCase)  (Optional) Whether ignore case on RegExp.
   * @return {String}                A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  ltrim : function(s, chars, ignoreCase) {
    var re;
    if (chars) {
      re = new RegExp(
        ['^[', ']+'].join(rescape(chars)),
        'g' + (ignoreCase ? 'i' : '')
      );
    } else {
      re = RE_LTRIM;
    }
    return stringify(s, true).replace(re, '');
  },
  /**
   * Trim the white spaces including em (U+3000) from right side.
   *
   * White spaces will not removed when specified the second argument.
   *
   * @example
   *   debug( rtrim(' hoge  ') );
   *   // @results ' hoge'
   *
   *
   * @example
   *   //
   *   // White spaces will not removed when 
   *   //  specified the second argument.
   *   //
   *   debug( rtrim('abc a', 'ac') );
   *   // @results 'abc '
   *
   *
   * @param  {String}   s            A target string.
   * @param  {String}  (chars)       (Optional) Removing characters.
   * @param  {Boolean} (ignoreCase)  (Optional) Whether ignore case on RegExp.
   * @return {String}                A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  rtrim : function(s, chars, ignoreCase) {
    var re;
    if (chars) {
      re = new RegExp(
        ['[', ']+$'].join(rescape(chars)),
        'g' + (ignoreCase ? 'i' : '')
      );
    } else {
      re = RE_RTRIM;
    }
    return stringify(s, true).replace(re, '');
  },
  /**
   * Remove all whitespaces in a string.
   *
   *
   * @example
   *   var s = '   Hello  World ! \r\n.';
   *   debug(strip(s));
   *   // @results 'HelloWorld!.'
   *
   *
   * @example
   *   var s = 'foo looooooooool';
   *   debug(strip(s, 'o'));
   *   // @results 'f ll'
   *
   *
   * @param  {String}  s             The target string.
   * @param  {String}  (chars)       (Optional) Removing characters.
   * @param  {Boolean} (ignoreCase)  (Optional) Whether ignore case on RegExp.
   * @return {String}                A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  strip : function(s, chars, ignoreCase) {
    var re;
    if (chars) {
      re = new RegExp(
        '[' + rescape(chars) + ']+',
        'g' + (ignoreCase ? 'i' : '')
      );
    } else {
      re = RE_STRIP;
    }
    return stringify(s, true).replace(re, '');
  },
  /**
   * Normalize whitespaces.
   * One or more whitespaces will be converted into one space.
   * If passed any character to the second argument then
   *   convertion will use it.
   *
   *
   * @example
   *   var s = 'Hello  \r\n  World  \r\n  \t !';
   *   debug(normalizeSpace(s));
   *   // @results 'Hello World !'
   *
   *
   * @example
   *   var s = 'foo       bar     baz';
   *   debug(normalizeSpace(s, '+'));
   *   // @results 'foo+bar+baz'
   *
   *
   * @param  {String}   s        The target string.
   * @param  {String}  (spacer)  (Optional) Convertion character.
   * @return {String}            A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  normalizeSpace : function(s, spacer) {
    return stringify(s, true).replace(/[\s\u00A0\u3000]+/g, spacer || ' ');
  },
  /**
   * Split a string into an array by whitespace.
   * All empty items will be removed for the result array.
   *
   *
   * @example
   *   var s = '  Hello  \r\n  World  \r\n  \t !  ';
   *   debug(splitBySpace(s));
   *   // @results ['Hello', 'World', '!']
   *
   *
   * @param  {String}   s   The target string.
   * @return {Array}        The result array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  splitBySpace : function(s) {
    var array = stringify(s, true).split(/[\s\u00A0\u3000]+/),
        a, i, len = array.length, results = [];
    for (i = 0; i < len; i++) {
      a = array[i];
      if (a && a.length) {
        results[results.length] = a;
      }
    }
    return results;
  },
  /**
   * Replaces new lines with unix style (\n).
   *
   *
   * @example
   *   var string = 'foo\r\nbar\rbaz\n';
   *   var result = canonicalizeNL(string);
   *   debug(result);
   *   // @results  'foo\nbar\nbaz\n';
   *
   *
   * @param  {String}    s    The input string.
   * @return {String}         The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  canonicalizeNL : function(s) {
    return stringify(s, true).replace(/\r\n|\r|\n/g, '\n');
  },
  /**
   * Wraps a string by specific character.
   * Wrapper string can specify an array.
   * That must has 2 or more items.
   *
   *
   * @example
   *   var s = 'hoge';
   *   debug(wrap(s, '"'));
   *   // @results '"hoge"'
   *
   *
   * @example
   *   var s = 'hoge';
   *   debug(wrap(s, ['(', ')']));
   *   // @results '(hoge)'
   *
   *
   * @example
   *   var s = 'hoge';
   *   debug(wrap(s, '()') + wrap(s, '[]'));
   *   // @results '(hoge)[hoge]'
   *
   *
   * @param  {String}         string   The target string.
   * @param  {String|Array}   wrapper  The wrapper character.
   * @return {String}                  The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  wrap : update(function(string, wrapper) {
    var w, s = stringify(string),
        me = arguments.callee, maps = me.PairMaps;
    if (wrapper && wrapper.shift && wrapper.pop) {
      s = stringify(wrapper.shift()) + s + stringify(wrapper.pop());
    } else {
      w = stringify(wrapper);
      if (w in maps) {
        s = maps[w][0] + s + maps[w][1];
      } else {
        s = w + s + w;
      }
    }
    return s;
  }, {
    /**@ignore*/
    PairMaps : {
      '()' : ['(', ')'],
      '<>' : ['<', '>'],
      '[]' : ['[', ']'],
      '{}' : ['{', '}']
    }
  }),
  /**
   * Unwraps a string by specific character.
   * Unwrapper string can specify an array.
   * That must has 2 or more items.
   *
   *
   * @example
   *   var s = '"hoge"';
   *   debug(unwrap(s, '"'));
   *   // @results 'hoge'
   *
   *
   * @example
   *   var s = '(hoge)';
   *   debug(unwrap(s, ['(', ')']));
   *   // @results 'hoge'
   *
   *
   * @example
   *   var s = '(L(hoge)R)';
   *   debug(unwrap(unwrap(s, '()'), ['L(', ')R']));
   *   // @results 'hoge'
   *
   *
   * @param  {String}        string     The target string.
   * @param  {String|Array}  unwrapper  The unwrapper character.
   * @return {String}                   The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  unwrap : function(string, unwrapper) {
    var s = stringify(string), w, left, right,
        Text = Pot.Text, maps = Text.wrap.PairMaps;
    if (unwrapper && unwrapper.shift && unwrapper.pop) {
      left  = stringify(unwrapper.shift());
      right = stringify(unwrapper.pop());
    } else {
      w = stringify(unwrapper);
      if (w in maps) {
        left  = maps[w][0];
        right = maps[w][1];
      } else {
        left = right = w;
      }
    }
    if (left && Text.startsWith(s, left)) {
      s = s.substring(left.length);
    }
    if (right && Text.endsWith(s, right)) {
      s = s.substring(0, s.length - right.length);
    }
    return s;
  },
  /**
   * Check whether a string starts with prefix.
   *
   *
   * @example
   *   var result = startsWith('foo bar baz', 'foo');
   *   debug(result);
   *   // @results true
   *
   *
   * @example
   *   var result = startsWith('bar foo foo bar baz foo', 'foo');
   *   debug(result);
   *   // @results false
   *
   *
   * @example
   *   var result = startsWith('FoO bar foo foo bar baz foo', 'foo', true);
   *   debug(result);
   *   // @results true
   *
   *
   * @param  {String}    string      The string to check.
   * @param  {String}    prefix      The subject prefix.
   * @param  {Boolean} (ignoreCase)  Whether ignore case.
   * @return {Boolean}               True if `string` begins
   *                                   with `prefix`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  startsWith : function(string, prefix, ignoreCase) {
    var
    s = stringify(string, true),
    p = stringify(prefix, true);
    if (ignoreCase) {
      s = s.toLowerCase();
      p = p.toLowerCase();
    }
    return s.lastIndexOf(p, 0) === 0;
  },
  /**
   * Check whether a string ends with suffix.
   *
   *
   * @example
   *   var result = endsWith('foo bar baz', 'baz');
   *   debug(result);
   *   // @results true
   *
   *
   * @example
   *   var result = endsWith('foo bar baz foo bar', 'foo');
   *   debug(result);
   *   // @results false
   *
   *
   * @example
   *   var result = endsWith('bar foo foo bar baz FOo', 'foo', true);
   *   debug(result);
   *   // @results true
   *
   *
   * @param  {String}    string      The string to check.
   * @param  {String}    suffix      The subject suffix.
   * @param  {Boolean} (ignoreCase)  Whether ignore case.
   * @return {Boolean}               True if `string` ends
   *                                   with `suffix`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  endsWith : function(string, suffix, ignoreCase) {
    var n,
    s = stringify(string, true),
    x = stringify(suffix, true);
    if (ignoreCase) {
      s = s.toLowerCase();
      x = x.toLowerCase();
    }
    n = s.length - x.length;
    return n >= 0 && s.indexOf(x, n) === n;
  },
  /**
   * A shortcut function of .toLowerCase().
   * Convert a string to lowercase.
   *
   *
   * @example
   *   debug(lower('Hello World!'));
   *   // @results 'hello world!'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  lower : function(s) {
    return stringify(s, true).toLowerCase();
  },
  /**
   * A shortcut function of .toUpperCase().
   * Convert a string to uppercase.
   *
   *
   * @example
   *  debug(upper('Hello World!'));
   *  // @results 'HELLO WORLD!'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  upper : function(s) {
    return stringify(s, true).toUpperCase();
  },
  /**
   * Convert a string to "Camelcase".
   *
   *
   * @example
   *   var result = camelize('font-size');
   *   debug(result);
   *   // @results 'fontSize'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  camelize : function(s) {
    return stringify(s).replace(/[_-]+(\w)/g, function(a, w) {
      return w.toUpperCase();
    });
  },
  /**
   * Convert a string to "hyphen-delimited syntax".
   *
   *
   * @example
   *   var result = hyphenize('fontSize');
   *   debug(result);
   *   // @results 'font-size'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  hyphenize : function(s) {
    return stringify(s).replace(/([A-Z]+)/g, '-$1').toLowerCase();
  },
  /**
   * Convert a string to "Underscore-syntax".
   *
   *
   * @example
   *   var result = underscore('rawInput');
   *   debug(result);
   *   // @results 'raw_input'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  underscore : function(s) {
    return stringify(s).replace(/([A-Z]+)/g, '_$1').toLowerCase();
  },
  /**
   * Increment the argument value.
   * This incrementation like Perl and PHP etc that
   *   uses alphabets [a-z] + [A-Z] and digits [0-9]
   *   as magic-increment,
   *   (i.e., different with c-style increment.).
   *
   *
   * @example
   *   debug(inc('99'));
   *   // @results '100'
   *   debug(inc('a0'));
   *   // @results 'a1'
   *   debug(inc('Az'));
   *   // @results 'Ba'
   *   debug(inc('zz'));
   *   // @results 'aaa'
   *
   *
   * @example
   *   var s = 'X';
   *   for (var i = 0; i < 10; i++) {
   *     s = inc(s);
   *     debug(s);
   *   }
   *   // @results
   *   //   Y
   *   //   Z
   *   //   AA
   *   //   AB
   *   //   AC
   *   //   AD
   *   //   AE
   *   //   AF
   *   //   AG
   *   //   AH
   *
   *
   * @see Pot.Text.dec
   * @param  {String|Number|Date|*}  value  The value to increment.
   * @return {String|Number|Date|*}         The incremented value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  inc : function(value) {
    var LOWER = 1, UPPER = 2, NUMERIC = 3,
        pos, s, c, last, carry, add;
    if (Pot.isNumber(value)) {
      return ++value;
    }
    if (!Pot.isString(value)) {
      return value;
    }
    last = 0;
    carry = false;
    /**@ignore*/
    add = function(val) {
      return String.fromCharCode(val.charCodeAt(0) + 1);
    };
    s = value.toString().split('');
    if (s.length === 0) {
      return '1';
    }
    pos = s.length - 1;
    while (pos >= 0) {
      c = s[pos].charCodeAt(0);
      if (c >= 0x61/*'a'*/ && c <= 0x7A/*'z'*/) {
        if (c === 0x7A) {
          s[pos] = 'a';
          carry = true;
        } else {
          s[pos] = add(s[pos]);
          carry = false;
        }
        last = LOWER;
      } else if (c >= 0x41/*'A'*/ && c <= 0x5A/*'Z'*/) {
        if (c === 0x5A) {
          s[pos] = 'A';
          carry = true;
        } else {
          s[pos] = add(s[pos]);
          carry = false;
        }
        last = UPPER;
      } else if (c >= 0x30/*'0'*/ && c <= 0x39/*'9'*/) {
        if (c === 0x39) {
          s[pos] = '0';
          carry = true;
        } else {
          s[pos] = add(s[pos]);
          carry = false;
        }
        last = NUMERIC;
      } else {
        carry = false;
        break;
      }
      if (!carry) {
        break;
      }
      pos--;
    }
    if (carry) {
      switch (last) {
        case NUMERIC : s.unshift('1'); break;
        case UPPER   : s.unshift('A'); break;
        case LOWER   : s.unshift('a'); break;
      }
    }
    return s.join('');
  },
  /**
   * Decrement the argument value.
   * This decrementation like Perl and PHP etc that
   *   uses alphabets [a-z] + [A-Z] and digits [0-9] as
   *   magic-decrement,
   *   (i.e., different with c-style decrement.).
   * Note Magic-Decrement cannot works with perfectly,
   *  so that Perl and Ruby etc did not implemented magic-decerement.
   *
   *
   * @example
   *   debug(dec('100'));
   *   // @results '99'
   *   debug(dec('a1'));
   *   // @results 'a0'
   *   debug(dec('Ba'));
   *   // @results 'Az'
   *   debug(dec('aaa'));
   *   // @results 'zz'
   *
   *
   * @example
   *   var s = 'AC';
   *   for (var i = 0; i < 10; i++) {
   *     s = dec(s);
   *     debug(s);
   *   }
   *   // @results
   *   //   AB
   *   //   AA
   *   //   Z
   *   //   Y
   *   //   X
   *   //   W
   *   //   V
   *   //   U
   *   //   T
   *   //   S
   *
   *
   * @see Pot.Text.inc
   * @param  {String|Number|Date|*}  value  The value to decrement.
   * @return {String|Number|Date|*}         The decremented value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  dec : function(value) {
    var LOWER = 1, UPPER = 2, NUMERIC = 3,
        i, len, s, c, t, n1, n2, carry, last, borrow;
    if (Pot.isNumber(value)) {
      return --value;
    }
    if (!Pot.isString(value)) {
      return value;
    }
    s = value.toString().split('').reverse();
    len = s.length;
    if (len === 0) {
      return '';
    }
    carry = false;
    for (i = 0; i < len; i++) {
      c = s[i].charCodeAt(0);
      if (!carry &&
           // a - z
          ((c >= 0x61 && c <= 0x7A) ||
           // A - Z
           (c >= 0x41 && c <= 0x5A) ||
           // 0 - 9
           (c >= 0x30 && c <= 0x39))
      ) {
        carry = true;
      }
      if (c === 0x61) {
        s[i] = 'z';
        last = LOWER;
      } else if (c === 0x41) {
        s[i] = 'Z';
        last = UPPER;
      } else if (c === 0x30) {
        s[i] = '9';
        last = NUMERIC;
      } else {
        break;
      }
    }
    if (!carry) {
      return value;
    }
    t = s[0];
    borrow = false;
    switch (last) {
      case LOWER:
          if (c === 0x61 &&
              (len <= 1 ||
               (len > 1 && s[len - 1] === s[len - 2]) ||
               (len === 2 && t === '0')
              )
          ) {
            borrow = true;
          }
          break;
      case UPPER:
          if (c === 0x41 &&
              (len <= 1 ||
               (len > 1 && s[len - 1] === s[len - 2]) ||
               (len === 2 && t === '0')
              )
          ) {
            borrow = true;
          }
          break;
      case NUMERIC:
          n1 = s[len - 1];
          n2 = s[len - 2];
          if ((c === 0x31 && n1 === '1' && n2 === '9') ||
              (c === 0x30 &&
               (len <= 1 ||
                (len > 1 && s[len - 1] === s[len - 2]) ||
                (len === 2 && t === '0')
               )
              )
          ) {
            borrow = true;
          }
          break;
    }
    if (i >= len) {
      i--;
    }
    s[i] = String.fromCharCode(s[i].charCodeAt(0) - 1);
    s = s.reverse();
    if (borrow) {
      s.shift();
    }
    return s.join('');
  },
  /**
   * Converts the new lines (\n) to <br>s or <br />s.
   *
   *
   * @example
   *   var string = '1. foo.\n2. bar.\n3. baz.';
   *   var result = br(string);
   *   debug(result);
   *   // @results '1. foo.<br>\n2. bar.<br>\n3. baz.'
   *
   *
   * @example
   *   var string = ' - foo.\n - bar.\n - baz.';
   *   var result = br(string, true);
   *   debug(result);
   *   // @results ' - foo.<br />\n - bar.<br />\n - baz.'
   *
   *
   * @example
   *   var string = '<ul><li>foo<br />fooo</li><li>bar\nbaaar</li></ul>';
   *   var result = br(string);
   *   debug(result);
   *   // @results '<ul><li>foo<br />fooo</li><li>bar<br />\nbaaar</li></ul>'
   *
   *
   * @example
   *   var string = [
   *     '<div>',
   *     '<h1>Hoge</h1>',
   *     '<p>',
   *     'foo',
   *     'bar',
   *     '</p>',
   *     '<span>baz</span>',
   *     '<b>qux</b>',
   *     '<pre>',
   *     'function hoge() {',
   *     '  return this;',
   *     '}',
   *     '</pre>',
   *     '<hr>',
   *     '</div>'
   *   ].join('\n');
   *   var result = br(string);
   *   debug(result);
   *   // @results
   *   //   <div>
   *   //   <h1>Hoge</h1>
   *   //   <p>
   *   //   foo<br>
   *   //   bar<br>
   *   //   </p>
   *   //   <span>baz</span><br>
   *   //   <b>qux</b><br>
   *   //   <pre>
   *   //   function hoge() {
   *   //     return this;
   *   //   }
   *   //   </pre>
   *   //   <hr>
   *   //   </div>
   *
   *
   * @example
   *   var string = [
   *     '<div>',
   *     '<div>foo</div>',
   *     '<div>bar</div>',
   *     '<div>baz</div>',
   *     '</div>'
   *   ].join('\n');
   *   var result = br(string, false, true);
   *   debug(result);
   *   // @results
   *   //   <div><br>
   *   //   <div>foo</div><br>
   *   //   <div>bar</div><br>
   *   //   <div>baz</div><br>
   *   //   </div>
   *
   *
   * @param  {String}    string   The string in which to convert newlines.
   * @param  {Boolean}  (useXML)  Whether to use XML compatible tags.
   * @param  {Boolean}   (all)    Whether convert all of the new lines.
   * @return {String}             A copy string of `string`
   *                                with converted newlines.
   * @type  Function
   * @function
   * @static
   * @public
   */
  br : update(function(string, useXML, all) {
    var result = '', me = arguments.callee, s, xml, tag;
    s = stringify(string);
    if (s) {
      xml = useXML;
      if (xml == null && me.patterns.xml.test(s)) {
        xml = true;
      }
      tag = xml ? '<br />' : '<br>';
      if (all) {
        result = s.replace(me.patterns.nlg, tag + '$1');
      } else {
        result = me.insertAdjust(s, tag);
      }
    }
    return result;
  }, {
    /**
     * @private
     * @ignore
     */
    patterns : {
      inline : new RegExp(['^(?:<|)(', ')(?:[^>]*>|)$'].join([
        '(?:a|b|i|q|s|u|abbr|acronym|applet|big|cite',
          '|code|dfn|em|font|iframe|kbd|label|object',
          '|samp|small|span|strike|strong|sub|sup|tt',
          '|var|bdo|button|del|ruby|img|input|select',
          '|embed|ins|keygen|textarea|map|canvas|svg',
          '|audio|command|mark|math|meter|time|video',
          '|datalist|progress|output|\\w+:\\w+',
        ')\\b'
      ].join('')), 'i'),
      xml  : /<\s*\w+[^>]*\/>/,
      nl   : /\r\n|\r|\n/,
      nlg  : /(\r\n|\r|\n)/g,
      rt   : /[\s\u00A0\u3000]+$/,
      top  : /^[\s\u00A0\u3000]*<\s*(\/|)\s*(\w+(?::\w+|))\b[^>]*(\/|)>/,
      end  : /<\s*(\/|)\s*(\w+(?::\w+|))\b[^>]*(\/|)>[\s\u00A0\u3000]*$/,
      code : new RegExp([
        '(<(pre|style|script)\\b[^>]*>[\\s\\S]*?</\\2\\s*>',
        '|<!--[\\s\\S]*?-->',
        '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
        ')'
      ].join(''), 'gi')
    },
    /**
     * @private
     * @ignore
     */
    insertAdjust : function(string, brTag) {
      var results = [], Text = Pot.Text, me = Text.br,
          value = stringify(string),
          lines, patterns, codes = [], mark = '', reset;
      if (value) {
        do {
          mark += 'Pot' + now();
        } while (~value.indexOf(mark));
        value = value.replace(me.patterns.code, function(a, code) {
          codes[codes.length] = code;
          return '<' + mark + codes.length + mark + '>';
        });
        lines = value.split(me.patterns.nl);
        each(lines, function(line, i) {
          var append = false, matches, closing, name, closed, nextName,
              next = stringify(lines[i + 1]),
              cur = line.replace(me.patterns.rt, '');
          if (~cur.indexOf(mark) || i >= lines.length - 1) {
            append = false;
          } else {
            if (!me.patterns.end.test(cur)) {
              append = true;
            } else {
              matches = cur.match(me.patterns.end);
              closing = matches[1];
              name    = matches[2];
              closed  = matches[3];
              if (me.patterns.inline.test(name)) {
                append = true;
              } else {
                if (closing || closed) {
                  if (next && me.patterns.top.test(next)) {
                    nextName = next.match(me.patterns.top)[2];
                    if (me.patterns.inline.test(cur) &&
                        me.patterns.inline.test(nextName)) {
                      append = true;
                    }
                  } else {
                    append = true;
                  }
                }
              }
            }
          }
          results[results.length] = line + (append ? brTag : '');
        });
        value = results.join('\n');
        if (codes && codes.length) {
          reset = new RegExp(
            ['<(', ')([0-9]+)\\1>'].join(rescape(mark)),
            'g'
          );
          value = value.replace(reset, function(a, mk, idx) {
            return codes[idx - 1];
          });
        }
      }
      return value;
    }
  }),
  /**
   * Remove the HTML/XML tags from string.
   *
   *
   * @example
   *   var html = '<div>Hoge</div>foo<br>bar<i>baz</i>';
   *   var result = stripTags(html);
   *   debug(result);
   *   // @results 'Hoge foo bar baz'
   *
   *
   * @param  {String}  text  The target string.
   * @return {String}        A result string that
   *                           removed all of tags.
   * @type  Function
   * @function
   * @static
   * @public
   */
  stripTags : update(function(text) {
    var result = '', me = arguments.callee, s, prev, i, limit = 5;
    s = stringify(text, true);
    if (s) {
      for (i = 0; i < limit; i++) {
        each(me.patterns, function(re) {
          s = s.replace(re.by, re.to);
        });
        if (prev === s) {
          break;
        }
        prev = s;
      }
      result = s;
    }
    return result;
  }, {
    /**@ignore*/
    patterns : [{
      by : /<([%?])[\s\S]*?\1>/g,
      to : ''
    }, {
      by : /<!--[\s\S]*?-->/g,
      to : ''
    }, {
      by : /<!-*\[CDATA\[[\s\S]*?\]\]-*>/gi,
      to : ''
    }, {
      by : /<!\s*\w+[^>]*>/g,
      to : ''
    }, {
      by : /<\s*(\w+)\b[^>]*>([\s\S]*?)<\s*\/\s*\1\s*>/g,
      to : ' $2 '
    }, {
      by : /<\s*\/?\s*\w+\b[^>]*>/g,
      to : ' '
    }, {
      by : /<[^>]*>|<[![\]-]*|[-[\]]*>/g,
      to : ' '
    }]
  }),
  /**
   * Truncates a string to a certain length and
   *   adds ellipsis (e.g., '...') if necessary.
   *
   *
   * @example
   *   var string = 'Helloooooooooo Wooooooooorld!! Hellooooo Woooooorld!!';
   *   debug(string + ' (length = ' + string.length + ')');
   *   var result = truncate(string, 10);
   *   debug(result + ' (length = ' + result.length + ')');
   *   // @results  result = 'Hellooo...' (length = 10)
   *
   *
   * @example
   *   var string = 'foooooooo baaaaaaaaar baaaaaaaaaaz';
   *   debug(string + ' (length = ' + string.length + ')');
   *   var result = truncate(string, 16, '...more');
   *   debug(result + ' (length = ' + result.length + ')');
   *   // @results  result = 'foooooooo...more' (length = 16)
   *
   *
   * @param  {String}   string     A target string.
   * @param  {Number}  (maxLen)    The maximum number of
   *                                 characters to truncates.
   * @param  {String}  (ellipsis)  Optional ellipsis string.
   * @return {String}              The truncated string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  truncate : function(string, maxLen, ellipsis) {
    var result = '', s, max, ch, cl;
    s = stringify(string, true);
    max = Pot.isNumeric(maxLen) ? maxLen - 0 : 140;
    if (arguments.length < 3) {
      ch = '...';
    } else {
      ch = stringify(ellipsis, true);
    }
    if (s) {
      if (max <= 0) {
        s = '';
      } else {
        if (s.length > max) {
          if (ch.length >= max) {
            cl = Math.floor(max * 0.726) || 0;
            ch = ch.substring(0, cl);
          }
          s = s.substring(0, max - ch.length) + ch;
        }
      }
      result = s;
    }
    return result;
  },
  /**
   * Truncate a string in the middle,
   *   adds ellipsis(e.g., '...') if necessary.
   *
   *
   * @example
   *   var string = 'Helloooooooooo Wooooooooorld!! Hellooooo Woooooorld!!';
   *   debug(string + ' (length = ' + string.length + ')');
   *   var result = truncateMiddle(string, 15);
   *   debug(result + ' (length = ' + result.length + ')');
   *   // @results  result = 'Helloo...orld!!' (length = 15)
   *
   *
   * @example
   *   var string = 'foooooooo baaaaaaaaar baaaaaaaaaaz';
   *   debug(string + ' (length = ' + string.length + ')');
   *   var result = truncateMiddle(string, 18, '(...)');
   *   debug(result + ' (length = ' + result.length + ')');
   *   // @results  result = 'foooooo(...)aaaaaz' (length = 18)
   *
   *
   * @param  {String}   string     A target string.
   * @param  {Number}  (maxLen)    The maximum number of
   *                                 characters to truncates.
   * @param  {String}  (ellipsis)  Optional ellipsis string.
   * @return {String}              The truncated string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  truncateMiddle : function(string, maxLen, ellipsis) {
    var result, s, max, ch, half, pos;
    s = stringify(string, true);
    max = Pot.isNumeric(maxLen) ? maxLen - 0 : 140;
    if (arguments.length < 3) {
      ch = '...';
    } else {
      ch = stringify(ellipsis, true);
    }
    if (s) {
      if (max <= 0) {
        s = '';
      } else {
        if (s.length > max) {
          if (ch.length >= max) {
            cl = Math.floor(max * 0.726) || 0;
            ch = ch.substring(0, cl);
          }
          half = Math.floor((max - ch.length) / 2);
          pos = s.length - half;
          half += (max - ch.length) % 2;
          s = s.substring(0, half) + ch + s.substring(pos);
        }
      }
      result = s;
    }
    return result;
  },
  /**
   * 全角英数記号文字を半角英数記号文字に変換
   * Convert the ascii symbols and alphanumeric characters to
   *   the zenkaku symbols and alphanumeric characters.
   *
   * Based:
   *   Hiragana/Katakana Library
   *   http://code.google.com/p/kanaxs/
   *
   *
   * @example
   *   debug(toHankakuCase('Ｈｅｌｌｏ Ｗｏｒｌｄ！ １２３４５'));
   *   // @results   'Hello World! 12345'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The conveted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toHankakuCase : function(text) {
    var r = [], c, s, i, len;
    s = stringify(text, true);
    if (s) {
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        if (0xFF01 <= c && c <= 0xFF5E) {
          c -= 0xFEE0;
        }
        r[r.length] = c;
      }
    }
    return Pot.Text.chr(r);
  },
  /**
   * 半角英数記号文字を全角英数記号文字に変換
   * Convert the zenkaku symbols and alphanumeric characters to
   *   the ascii symbols and alphanumeric characters.
   *
   *
   * @example
   *   debug(toZenkakuCase('Hello World! 12345'));
   *   // @results  'Ｈｅｌｌｏ Ｗｏｒｌｄ！ １２３４５'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toZenkakuCase : function(text) {
    var r = [], c, s, i, len;
    s = stringify(text, true);
    if (s) {
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        if (0x21 <= c && c <= 0x7E) {
          c += 0xFEE0;
        }
        r[r.length] = c;
      }
    }
    return Pot.Text.chr(r);
  },
  /**
   * 全角スペースを半角スペースに変換
   * Convert the em space(U+3000) to the single space(U+0020).
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toHanSpaceCase : function(text) {
    return stringify(text, true).replace(/[\u3000]/g, ' ');
  },
  /**
   * 半角スペースを全角スペースに変換
   * Convert the single space(U+0020) to the em space(U+3000).
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toZenSpaceCase : function(text) {
    return stringify(text, true).replace(/[\u0020]/g, '\u3000');
  },
  /**
   * 全角カタカナを全角ひらがなに変換
   * Convert the zenkaku katakana to the zenkaku hiragana.
   *
   *
   * @example
   *   debug(toHiraganaCase('ボポヴァアィイゥウェエォオ'));
   *   // @results  'ぼぽう゛ぁあぃいぅうぇえぉお'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string to hiragana.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toHiraganaCase : function(text) {
    var r = [], c, i, s, len, code;
    s = stringify(text, true);
    if (s) {
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        if (0x30A1 <= c && c <= 0x30F6) {
          code = c - 0x0060;
          // 「ヴ」を「う」+「゛」に変換
          if (c === 0x30F4) {
            r[r.length] = 0x3046;
            code = 0x309B;
          }
          c = code;
        }
        r[r.length] = c;
      }
    }
    return Pot.Text.chr(r);
  },
  /**
   * 全角ひらがなを全角カタカナに変換
   * Convert the zenkaku hiragana to the zenkaku katakana.
   *
   *
   * @example
   *   debug(toKatakanaCase('ぼぽう゛ぁあぃいぅうぇえぉお'));
   *   // @results  'ボポヴァアィイゥウェエォオ'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string to katakana.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toKatakanaCase : function(text) {
    var r = [], c, d, i, code, len, s;
    s = stringify(text, true);
    if (s) {
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        if (0x3041 <= c && c <= 0x3096) {
          code = c + 0x0060;
          if (i < len && c === 0x3046) {
            d = s.charCodeAt(i);
            if (d === 0x309B || d === 0xFF9E) {
              // 「う」+「゛」を「ヴ」に変換
              code = 0x30F4;
              i++;
            }
          }
          c = code;
        }
        r[r.length] = c;
      }
    }
    return Pot.Text.chr(r);
  },
  /**
   * 全角カタカナを半角ｶﾀｶﾅに変換
   * Convert the zenkaku katakana to the hankaku katakana.
   *
   *
   * @example
   *   debug(toHankanaCase('ボポヴァアィイゥウェエォオ'));
   *   // @results  'ﾎﾞﾎﾟｳﾞｧｱｨｲｩｳｪｴｫｵ'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string to hankaku katakana.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toHankanaCase : (function() {
    var map = {
      0x30A1:0xFF67,0x30A3:0xFF68,0x30A5:0xFF69,0x30A7:0xFF6A,0x30A9:0xFF6B,
      0x30FC:0xFF70,0x30A2:0xFF71,0x30A4:0xFF72,0x30A6:0xFF73,0x30A8:0xFF74,
      0x30AA:0xFF75,0x30AB:0xFF76,0x30AD:0xFF77,0x30AF:0xFF78,0x30B1:0xFF79,
      0x30B3:0xFF7A,0x30B5:0xFF7B,0x30B7:0xFF7C,0x30B9:0xFF7D,0x30BB:0xFF7E,
      0x30BD:0xFF7F,0x30BF:0xFF80,0x30C1:0xFF81,0x30C4:0xFF82,0x30C6:0xFF83,
      0x30C8:0xFF84,0x30CA:0xFF85,0x30CB:0xFF86,0x30CC:0xFF87,0x30CD:0xFF88,
      0x30CE:0xFF89,0x30CF:0xFF8A,0x30D2:0xFF8B,0x30D5:0xFF8C,0x30D8:0xFF8D,
      0x30DB:0xFF8E,0x30DE:0xFF8F,0x30DF:0xFF90,0x30E0:0xFF91,0x30E1:0xFF92,
      0x30E2:0xFF93,0x30E3:0xFF6C,0x30E4:0xFF94,0x30E5:0xFF6D,0x30E6:0xFF95,
      0x30E7:0xFF6E,0x30E8:0xFF96,0x30E9:0xFF97,0x30EA:0xFF98,0x30EB:0xFF99,
      0x30EC:0xFF9A,0x30ED:0xFF9B,0x30EF:0xFF9C,0x30F2:0xFF66,0x30F3:0xFF9D,
      0x30C3:0xFF6F,0x300C:0xFF62,0x300D:0xFF63,0x3002:0xFF61,0x3001:0xFF64,
      0x30FB:0xFF65,0x309B:0xFF9E,0x309C:0xFF9F
    },
    exc = {
      0x30F4:0xFF73,0x30F7:0xFF9C,0x30FA:0xFF66
    };
    return function(text) {
      var r = [], i, s, len, c;
      s = stringify(text, true);
      if (s) {
        i = 0;
        len = s.length;
        while (i < len) {
          c = s.charCodeAt(i++);
          if (c in map) {
            r[r.length] = map[c];
          } else if (c in exc) {
            r.push(exc[c], 0xFF9E);
          } else if (0x30AB <= c && c <= 0x30C9) {
            r.push(map[c - 1], 0xFF9E);
          } else if (0x30CF <= c && c <= 0x30DD) {
            r.push(map[c - c % 3], [0xFF9E, 0xFF9F][c % 3 - 1]);
          } else {
            r[r.length] = c;
          }
        }
      }
      return Pot.Text.chr(r);
    };
  })(),
  /**
   * 半角ｶﾀｶﾅを全角カタカナに変換 (濁音含む)
   * Convert the hankaku katakana to
   *   the zenkaku katakana (including dullness).
   *
   *
   * @example
   *   debug(toZenkanaCase('ﾎﾞﾎﾟｳﾞｧｱｨｲｩｳｪｴｫｵ'));
   *   // @results  'ボポヴァアィイゥウェエォオ'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string to zenkaku katakana.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toZenkanaCase : (function() {
    var maps = [
      // Unicode U+FF61 - U+FF9F Mapping
      0x3002, 0x300C, 0x300D, 0x3001, 0x30FB, 0x30F2, 0x30A1, 0x30A3,
      0x30A5, 0x30A7, 0x30A9, 0x30E3, 0x30E5, 0x30E7, 0x30C3, 0x30FC,
      0x30A2, 0x30A4, 0x30A6, 0x30A8, 0x30AA, 0x30AB, 0x30AD, 0x30AF,
      0x30B1, 0x30B3, 0x30B5, 0x30B7, 0x30B9, 0x30BB, 0x30BD, 0x30BF,
      0x30C1, 0x30C4, 0x30C6, 0x30C8, 0x30CA, 0x30CB, 0x30CC, 0x30CD,
      0x30CE, 0x30CF, 0x30D2, 0x30D5, 0x30D8, 0x30DB, 0x30DE, 0x30DF,
      0x30E0, 0x30E1, 0x30E2, 0x30E4, 0x30E6, 0x30E8, 0x30E9, 0x30EA,
      0x30EB, 0x30EC, 0x30ED, 0x30EF, 0x30F3, 0x309B, 0x309C
    ];
    return function(text) {
      var code, codes = [], i, len, s, c, next, last;
      s = stringify(text, true);
      if (s) {
        len = s.length;
        last = len - 1;
        for (i = 0; i < len; i++) {
          c = s.charCodeAt(i);
          // 半角カタカナの範囲
          if (c > 0xFF60 && c < 0xFFA0) {
            code = maps[c - 0xFF61];
            if (i < last) {
              next = s.charCodeAt(++i);
              // 濁音「ﾞ」 + 「ヴ」
              if (next === 0xFF9E && c === 0xFF73) {
                code = 0x30F4;
              // 濁音「ﾞ」 + 「カ」～「コ」 or 「ハ」～「ホ」
              } else if (next === 0xFF9E &&
                            ((c > 0xFF75 && c < 0xFF85) ||
                             (c > 0xFF89 && c < 0xFF8F))) {
                code++;
              // 濁音「ﾟ」 + 「ハ」～「ホ」
              } else if (next === 0xFF9F &&
                             (c > 0xFF89 && c < 0xFF8F)) {
                code += 2;
              } else {
                i--;
              }
            }
            c = code;
          }
          codes[codes.length] = c;
        }
      }
      return Pot.Text.chr(codes);
    };
  })()
});

// Update Pot object.
Pot.update({
  stringify      : Pot.Text.stringify,
  chr            : Pot.Text.chr,
  ord            : Pot.Text.ord,
  trim           : Pot.Text.trim,
  ltrim          : Pot.Text.ltrim,
  rtrim          : Pot.Text.rtrim,
  strip          : Pot.Text.strip,
  normalizeSpace : Pot.Text.normalizeSpace,
  splitBySpace   : Pot.Text.splitBySpace,
  canonicalizeNL : Pot.Text.canonicalizeNL,
  wrap           : Pot.Text.wrap,
  unwrap         : Pot.Text.unwrap,
  startsWith     : Pot.Text.startsWith,
  endsWith       : Pot.Text.endsWith,
  lower          : Pot.Text.lower,
  upper          : Pot.Text.upper,
  camelize       : Pot.Text.camelize,
  hyphenize      : Pot.Text.hyphenize,
  underscore     : Pot.Text.underscore,
  inc            : Pot.Text.inc,
  dec            : Pot.Text.dec,
  br             : Pot.Text.br,
  stripTags      : Pot.Text.stripTags,
  truncate       : Pot.Text.truncate,
  truncateMiddle : Pot.Text.truncateMiddle,
  toHankakuCase  : Pot.Text.toHankakuCase,
  toZenkakuCase  : Pot.Text.toZenkakuCase,
  toHanSpaceCase : Pot.Text.toHanSpaceCase,
  toZenSpaceCase : Pot.Text.toZenSpaceCase,
  toHiraganaCase : Pot.Text.toHiraganaCase,
  toKatakanaCase : Pot.Text.toKatakanaCase,
  toHankanaCase  : Pot.Text.toHankanaCase,
  toZenkanaCase  : Pot.Text.toZenkanaCase
});

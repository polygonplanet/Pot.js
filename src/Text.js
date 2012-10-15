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
   * This class will be replace a particular string to temporary string,
   *  and execute the conventional process,
   *  and after back replace to the original string,
   *  these heavy step so just to make easier by this function.
   *
   *
   * @example
   *   // This sample code is process to leaving only the 'pre' tags,
   *   //  and replace all other HTML tags are escaped.
   *   var myProcess = function(string) {
   *     return string.replace(/&/g, '&amp;').
   *                   replace(/</g, '&lt;').
   *                   replace(/>/g, '&gt;');
   *   };
   *   var string =
   *     '<pre>\n' +
   *       '<b>var</b> foo = 1;\n' +
   *     '</pre>\n' +
   *     '<div>hoge</div>\n' +
   *     '<div>fuga</div>\n' +
   *     '<p onclick="alert(1)">piyo</p>\n' +
   *     '<pre>\n' +
   *       '<b>foo</b>\n' +
   *       'bar\n' +
   *       '<i>baz</i>\n' +
   *     '</pre>';
   *   var pattern = /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi;
   *   // The string or Array that must not appear in the saved string.
   *   var reserve = ['<', '>'];
   *   var rs = new Pot.Text.ReplaceSaver(string, pattern, reserve);
   *   // Save and replace string for your replace process.
   *   var result = rs.save();
   *   // Execute your replace process.
   *   result = myProcess(result);
   *   // Load and replace from saved string.
   *   result = rs.load(result);
   *   debug(result);
   *   // @results
   *   //   <pre>
   *   //     <b>var</b> foo = 1;
   *   //   </pre>
   *   //   &lt;div&gt;hoge&lt;/div&gt;
   *   //   &lt;div&gt;fuga&lt;/div&gt;
   *   //   &lt;p onclick="alert(1)"&gt;piyo&lt;/p&gt;
   *   //   <pre>
   *   //     <b>foo</b>
   *   //     bar
   *   //     <i>baz</i>
   *   //   </pre>
   *
   *
   * @param  {String}               string   The target string.
   * @param  {String|RegExp|Array}  pattern  The pattern(s) to save string.
   * @param  {String|Array}        (reserve) The reserve keyword(s) for
   *                                         your replace process.
   * @return {Pot.ReplaceSaver}              Returns an instance of
   *                                           Pot.ReplaceSaver.
   * @name Pot.Text.ReplaceSaver
   * @constructor
   * @public
   */
  ReplaceSaver : (function() {
    /**@ignore*/
    var Saver = function(string, pattern, reserve) {
      return new Saver.fn.init(string, pattern, reserve);
    };
    Saver.fn = Saver.prototype = update(Saver.prototype, {
      /**
       * @lends Pot.Text.ReplaceSaver
       */
      /**
       * @ignore
       */
      constructor : Saver,
      /**
       * @const
       * @private
       * @ignore
       */
      id : PotInternal.getMagicNumber(),
      /**
       * @const
       * @private
       */
      serial : null,
      /**
       * @private
       * @readonly
       * @const
       * @ignore
       */
      NAME : 'ReplaceSaver',
      /**
       * toString.
       *
       * @return  Return formatted string of object.
       * @type Function
       * @function
       * @static
       * @public
       */
      toString : PotToString,
      /**
       * @ignore
       * @private
       */
      saving : null,
      /**
       * @ignore
       * @private
       */
      strings : null,
      /**
       * @ignore
       * @private
       */
      patterns : null,
      /**
       * @ignore
       * @private
       */
      reserves : null,
      /**
       * Initialize.
       *
       * @ignore
       * @private
       */
      init : function(string, pattern, reserve) {
        if (!this.serial) {
          this.serial = buildSerial(this);
        }
        this.saving = [];
        this.strings = [];
        this.patterns = [];
        this.reserves = [];
        this.setString(string);
        this.setPattern(pattern);
        this.setReserve(reserve);
        return this;
      },
      /**
       * Set the string.
       *
       * @param  {String}            string  The target string.
       * @return {Pot.ReplaceSaver}          Return this.
       * @type  Function
       * @function
       * @public
       */
      setString : function(string) {
        if (Pot.isScalar(string)) {
          this.strings[this.strings.length] = stringify(string);
        }
      },
      /**
       * Set the reserve keyword(s).
       *
       * @param  {String|Array}     reserve  The reserve keyword(s).
       * @return {Pot.ReplaceSaver}          Return this.
       * @type  Function
       * @function
       * @public
       */
      setReserve : function(reserve) {
        var rvs = this.reserves;
        each(arrayize(reserve), function(resv) {
          if (Pot.isScalar(resv)) {
            rvs[rvs.length] = stringify(resv);
          }
        });
      },
      /**
       * Generate the unique string.
       *
       * @return {String} The unique string.
       * @type  Function
       * @function
       * @ignore
       * @private
       */
      generateUniqString : function() {
        var s = this.strings.join(''),
            re = new RegExp('[' +
              rescape(this.reserves.join('')) +
            ']', 'g'),
            uniq, n = 0;
        do {
          uniq = fromCharCode(
            n, n, Math.random() * 0xFFFF >>> 0, n, n
          );
          uniq += uniq + uniq + fromCharCode(n, n);
          if (~s.indexOf(uniq)) {
            uniq += (+new Date) + uniq;
          }
          uniq = uniq.replace(re, '');
          if (++n >= 0xFFFE) {
            n = 0;
          }
        } while (~s.indexOf(uniq));
        return uniq;
      },
      /**
       * Set the pattern(s).
       *
       * @param  {String|RegExp|Array} pattern The pattern(s).
       * @return {Pot.ReplaceSaver}            Return this.
       * @type  Function
       * @function
       * @public
       */
      setPattern : function(pattern) {
        var pt = this.patterns;
        each(arrayize(pattern), function(p) {
          var item = arrayize(p), search, index, v, i;
          try {
            v = item[0];
            i = item[1];
            if (Pot.isScalar(v)) {
              search = stringify(v);
            } else if (isRegExp(v)) {
              search = v;
            }
            if (search != null) {
              if (!i) {
                index = 0;
              } else if (isNumeric(i)) {
                index = Math.floor(i - 0) || 0;
              } else if (isFunction(i)) {
                index = i;
              } else {
                index = 0;
              }
              pt[pt.length] = [search, index];
            }
          } catch (e) {}
        });
      },
      /**
       * Save the string by specified pattern(s).
       *
       *
       * @example
       *   // This sample code is process to leaving only the 'pre' tags,
       *   //  and replace all other HTML tags are escaped.
       *   var myProcess = function(string) {
       *     return string.replace(/&/g, '&amp;').
       *                   replace(/</g, '&lt;').
       *                   replace(/>/g, '&gt;');
       *   };
       *   var string =
       *     '<pre>\n' +
       *       '<b>var</b> foo = 1;\n' +
       *     '</pre>\n' +
       *     '<div>hoge</div>\n' +
       *     '<div>fuga</div>\n' +
       *     '<p onclick="alert(1)">piyo</p>\n' +
       *     '<pre>\n' +
       *       '<b>foo</b>\n' +
       *       'bar\n' +
       *       '<i>baz</i>\n' +
       *     '</pre>';
       *   var pattern = /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi;
       *   // The string or Array that must not appear in the saved string.
       *   var reserve = ['<', '>'];
       *   var rs = new Pot.Text.ReplaceSaver(string, pattern, reserve);
       *   // Save and replace string for your replace process.
       *   var result = rs.save();
       *   // Execute your replace process.
       *   result = myProcess(result);
       *   // Load and replace from saved string.
       *   result = rs.load(result);
       *   debug(result);
       *   // @results
       *   //   <pre>
       *   //     <b>var</b> foo = 1;
       *   //   </pre>
       *   //   &lt;div&gt;hoge&lt;/div&gt;
       *   //   &lt;div&gt;fuga&lt;/div&gt;
       *   //   &lt;p onclick="alert(1)"&gt;piyo&lt;/p&gt;
       *   //   <pre>
       *   //     <b>foo</b>
       *   //     bar
       *   //     <i>baz</i>
       *   //   </pre>
       *
       *
       * @return {String} Returns a string that is replaced by
       *                  specified pattern(s).
       * @type  Function
       * @function
       * @public
       */
      save : function() {
        var result = '', that = this, args = arguments,
            saving = this.saving, patterns = this.patterns,
            pattern, search, index, uniq, s, i, len;
        if (args.length) {
          this.init.apply(this, args);
        }
        s = stringify(this.strings.pop());
        if (s) {
          len = patterns.length;
          for (i = 0; i < len; i++) {
            pattern = patterns[i];
            search  = pattern[0];
            index   = pattern[1];
            if (search == null) {
              continue;
            }
            s = s.replace(search, function() {
              var matches = arrayize(arguments), idx;
              if (isFunction(index)) {
                idx = index(matches) || 0;
              } else {
                idx = (index - 0) || 0;
              }
              uniq = that.generateUniqString();
              saving[saving.length] = [matches[idx], uniq];
              return uniq;
            });
          }
          result = s;
        }
        return result;
      },
      /**
       * Load the original string from saved string.
       *
       * @see Pot.Text.ReplaceSaver.save
       *
       * @param  {String}   result  The saved string.
       * @return {String}           Returns the original string.
       * @type  Function
       * @function
       * @public
       */
      load : function(result) {
        var r = stringify(result), saving = this.saving,
            i, sv, match, uniq;
        for (i = saving.length - 1; i >= 0; --i) {
          sv = saving[i];
          try {
            match = sv[0];
            uniq = sv[1];
            if (match == null || uniq == null) {
              throw match;
            }
          } catch (e) {
            continue;
          }
          r = r.split(uniq).join(match);
        }
        return r;
      }
    });
    Saver.fn.init.prototype = Saver.fn;
    return Saver;
  }()),
  /**
   * @lends Pot.Text
   */
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
    var args = arguments, codes, chars, divs, i, len, limit = 0x2000;
    if (args.length === 1) {
      if (isArray(args[0])) {
        codes = arrayize(args[0]);
      } else {
        return fromUnicode(args[0]);
      }
    } else if (args.length > 1) {
      codes = arrayize(args);
    } else {
      return '';
    }
    chars = [];
    if (codes) {
      len = codes.length;
      if (len === 1 && codes[0] && codes[0].length < limit) {
        return fromCharCode.apply(null, codes);
      } else {
        for (i = 0; i < len; i += limit) {
          divs = codes.slice(i, i + limit);
          chars[chars.length] = fromCharCode.apply(null, divs);
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
   * Indent a string.
   *
   *
   * @example
   *   var s = 'foo bar baz';
   *   debug(indent(s));          // '  foo bar baz'
   *   debug(indent(s, 4));       // '    foo bar baz'
   *   debug(indent(s, 1, '\t')); // '\tfoo bar baz'
   *
   *
   * @example
   *   var s = 'foo\nbar\nbaz';
   *   debug(indent(s, 1, '\t')); // '\tfoo\n\tbar\n\tbaz'
   *
   *
   * @param  {String}  string  A target string.
   * @param  {Number}  (size)  (Optional) A length of indent (default=2).
   * @param  {String}  (ch)    (Optional) A character to indent (default=' ').
   * @return {String}          A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  indent : function(string, size, ch) {
    var s = stringify(string),
        c, sz, unsz, i, j, len, line, lines, nl, m, space;
    if (s) {
      if (isString(size)) {
        c = size;
        sz = ch;
      } else {
        c = ch;
        sz = size;
      }
      c = stringify(c) || ' ';
      sz = isNumeric(sz) ? ((sz - 0) || 2) : 2;
      if (sz < 0) {
        unsz = -sz;
        space = new Array(unsz + 1).join(c);
      }
      m = s.match(RE_NL_GROUP);
      nl = (m && m[1]) ? m[1] : '\n';
      lines = s.split(RE_NL);
      len = lines.length;
      for (i = 0; i < len; i++) {
        line = lines[i];
        if (unsz) {
          if (line.substr(0, unsz) === space) {
            line = line.substring(unsz);
          }
        } else {
          j = 0;
          while (j++ < sz) {
            line = c + line;
          }
        }
        lines[i] = line;
      }
      s = lines.join(nl);
    }
    return s;
  },
  /**
   * Unindent a string.
   *
   *
   * @example
   *   var s = '  foo bar baz';
   *   debug(unindent(s));          // 'foo bar baz'
   *   debug(unindent(s, 4));       // '  foo bar baz'
   *   debug(unindent(s, 1, '\t')); // '  foo bar baz'
   *
   *
   * @example
   *   var s = '\tfoo\n\tbar\n\tbaz';
   *   debug(unindent(s, 1, '\t')); // 'foo\nbar\nbaz'
   *
   *
   * @param  {String}  string  A target string.
   * @param  {Number}  (size)  (Optional) A length of indent (default=2).
   * @param  {String}  (ch)    (Optional) A character to indent (default=' ').
   * @return {String}          A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  unindent : function(string, size, ch) {
    var sz, c;
    if (isString(size)) {
      c = size;
      sz = ch;
    } else {
      c = ch;
      sz = size;
    }
    if (sz > 0) {
      sz = -sz;
    }
    return Pot.Text.indent.call(null, string, sz || -2, c);
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
  normalizeSpace : (function() {
    var re = /[\s\u00A0\u3000]+/g;
    return function(s, spacer) {
      return stringify(s, true).replace(re, spacer || ' ');
    };
  }()),
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
  splitBySpace : (function() {
    var re = /[\s\u00A0\u3000]+/;
    return function(s) {
      var array = stringify(s, true).split(re),
          a, i, len = array.length, results = [];
      for (i = 0; i < len; i++) {
        a = array[i];
        if (a && a.length) {
          results[results.length] = a;
        }
      }
      return results;
    };
  }()),
  /**
   * Replaces new lines with unix style (\n).
   *
   *
   * @example
   *   var string = 'foo\r\nbar\rbaz\n';
   *   var result = canonicalizeNL(string);
   *   debug(result);
   *   // @results  'foo\nbar\nbaz\n'
   *
   *
   * @param  {String}    s    The input string.
   * @return {String}         The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  canonicalizeNL : (function() {
    // Includes U+2028 (Line Separator) and U+2029 (Paragraph Separator).
    var re = /\r\n|\r|\n|[\u2028\u2029]/g, nl = '\u000A';
    return function(s) {
      return stringify(s, true).replace(re, nl);
    };
  }()),
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
   * @param  {String}         right    (optional) The right wrapper.
   * @return {String}                  The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  wrap : update(function(string, wrapper, right) {
    var w, s = stringify(string),
        me = Pot.Text.wrap, maps = me.PairMaps;
    if (right != null) {
      wrapper = [wrapper, right];
    }
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
      '()'           : ['(',      ')'],
      '<>'           : ['<',      '>'],
      '[]'           : ['[',      ']'],
      '{}'           : ['{',      '}'],
      '\u300c\u300d' : ['\u300c', '\u300d'], // 「」
      '\u201c\u201d' : ['\u201c', '\u201d'], // “”
      '\u300e\u300f' : ['\u300e', '\u300f'], // 『』
      '\u2018\u2019' : ['\u2018', '\u2019'], // ‘’
      '\u226a\u226b' : ['\u226a', '\u226b'], // ≪≫
      '\uff1c\uff1e' : ['\uff1c', '\uff1e'], // ＜＞
      '\u3014\u3015' : ['\u3014', '\u3015'], // 〔〕
      '\uff3b\uff3d' : ['\uff3b', '\uff3d'], // ［］
      '\uff5b\uff5d' : ['\uff5b', '\uff5d'], // ｛｝
      '\u3008\u3009' : ['\u3008', '\u3009'], // 〈〉
      '\uff08\uff09' : ['\uff08', '\uff09'], // （）
      '\u300a\u300b' : ['\u300a', '\u300b'], // 《》
      '\u3010\u3011' : ['\u3010', '\u3011']  // 【】
    }
  }),
  /**
   * @lends Pot.Text
   */
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
   * @param  {String}        rightWrap  (optional) The right unwrapper.
   * @return {String}                   The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  unwrap : function(string, unwrapper, rightWrap) {
    var s = stringify(string), w, left, right,
        Text = Pot.Text, maps = Text.wrap.PairMaps;
    if (rightWrap != null) {
      unwrapper = [unwrapper, rightWrap];
    }
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
    if (!left && !right && s) {
      left  = s.charAt(0);
      right = s.slice(-1);
      w = left + right;
      if (w in maps) {
        left  = maps[w][0];
        right = maps[w][1];
      } else {
        if (left !== right) {
          return s;
        }
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
    var s = stringify(string, true),
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
  camelize : (function() {
    var
    re = /[_-]+(\w)/g,
    /**@ignore*/
    rep = function(a, w) {
      return w.toUpperCase();
    };
    return function(s) {
      return stringify(s).replace(re, rep);
    };
  }()),
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
  hyphenize : (function() {
    var re = /([A-Z]+)/g;
    return function(s) {
      return stringify(s).replace(re, '-$1').toLowerCase();
    };
  }()),
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
  underscore : (function() {
    var re = /([A-Z]+)/g;
    return function(s) {
      return stringify(s).replace(re, '_$1').toLowerCase();
    };
  }()),
  /**
   * Extract a substring from string .
   *
   *
   * @example
   *   var result = extract('foo:bar', /:(\w+)$/);
   *   debug(result);
   *   // @results 'bar'
   *
   *
   * @example
   *   var result = extract('foo:bar', /^:(\w+)/);
   *   debug(result);
   *   // @results ''
   *
   *
   * @example
   *   var result = extract('foo.html', /(foo|bar)\.([^.]+)$/, 2);
   *   debug(result);
   *   // @results 'html'
   *
   *
   * @example
   *   var result = extract('foobar', 'foo');
   *   debug(result);
   *   // @results 'foo'
   *
   *
   * @example
   *   var result = extract('foobar', 'fo+');
   *   debug(result);
   *   // @results ''
   *
   *
   * @param  {String|*}       string    A target string.
   * @param  {RegExp|String}  pattern   A pattern for extract substring.
   * @param  {Number}         (index)   (Optional) Index number of
   *                                      captured group.
   * @return {String}                   Return extracted substring.
   * @type  Function
   * @function
   * @static
   * @public
   */
  extract : function(string, pattern, index) {
    var r = '', s = stringify(string), re, idx, m;
    if (s && pattern) {
      if (isRegExp(pattern)) {
        re = pattern;
      } else {
        re = new RegExp(rescape(pattern));
      }
      idx = (index != null && isNumeric(index)) ? index : 1;
      m = s.match(re);
      if (m) {
        r = r + m[(m[idx] == null) ? 0 : idx];
      }
    }
    return r;
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
    if (isNumber(value)) {
      return ++value;
    }
    if (!isString(value)) {
      return value;
    }
    last = 0;
    carry = false;
    /**@ignore*/
    add = function(val) {
      return fromUnicode(val.charCodeAt(0) + 1);
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
    if (isNumber(value)) {
      return --value;
    }
    if (!isString(value)) {
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
    }
    if (i >= len) {
      i--;
    }
    s[i] = fromUnicode(s[i].charCodeAt(0) - 1);
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
    var result = '', me = Pot.Text.br, s, xml, tag;
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
      inline : new RegExp(['^(?:<|)(', ')(?:[^>]*>|)$'].join(
          '(?:a|b|i|q|s|u|abbr|acronym|applet|big|cite' +
            '|code|dfn|em|font|iframe|kbd|label|object' +
            '|samp|small|span|strike|strong|sub|sup|tt' +
            '|var|bdo|button|del|ruby|img|input|select' +
            '|embed|ins|keygen|textarea|map|canvas|svg' +
            '|audio|command|mark|math|meter|time|video' +
            '|datalist|progress|output|\\w+:\\w+' +
          ')\\b'
        ),
        'i'
      ),
      xml  : /<\s*\w+[^>]*\/>/,
      nl   : /\r\n|\r|\n/,
      nlg  : /(\r\n|\r|\n)/g,
      rt   : /[\s\u00A0\u3000]+$/,
      top  : /^[\s\u00A0\u3000]*<\s*(\/|)\s*(\w+(?::\w+|))\b[^>]*(\/|)>/,
      end  : /<\s*(\/|)\s*(\w+(?::\w+|))\b[^>]*(\/|)>[\s\u00A0\u3000]*$/,
      code : new RegExp(
        '(<(pre|style|script)\\b[^>]*>[\\s\\S]*?</\\2\\s*>' +
        '|<!--[\\s\\S]*?-->' +
        '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>' +
        ')',
        'gi'
      )
    },
    /**
     * @private
     * @ignore
     */
    insertAdjust : function(string, brTag) {
      var results = [], Text = Pot.Text, me = Text.br,
          value = stringify(string),
          lines, codes = [], mark = '', reset;
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
   * @lends Pot.Text
   */
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
    var result = '', me = Pot.Text.stripTags, s, prev, i, limit = 5;
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
   * @lends Pot.Text
   */
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
    max = isNumeric(maxLen) ? maxLen - 0 : 140;
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
    max = isNumeric(maxLen) ? maxLen - 0 : 140;
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
   * Convert to character code array from a string.
   *
   *
   * @example
   *   var string = 'foo bar ほげ';
   *   var result = Pot.toCharCode(string);
   *   Pot.debug(result);
   *   // [102, 111, 111, 32, 98, 97, 114, 32, 12411, 12370]
   *
   *
   * @example
   *   var string = 'abc';
   *   var result = Pot.toCharCode(string, function(code) {
   *     return code.toString(16);
   *   });
   *   Pot.debug(result);
   *   // ['61', '62', '63']
   *
   *
   * @param  {String}    string     A target string.
   * @param  {Function} (callback)  (Optional) A callback function for code.
   * @return {Array} A result array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toCharCode : function(string, callback) {
    return Pot.map(stringify(string).split(''), function(c) {
      var code = c.charCodeAt(0);
      if (callback) {
        code = callback(code);
      }
      return code;
    });
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
  toHanSpaceCase : (function() {
    var re = /[\u3000]/g, rep = ' ';
    return function(text) {
      return stringify(text, true).replace(re, rep);
    };
  }()),
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
  toZenSpaceCase : (function() {
    var re = /[\u0020]/g, rep = '\u3000';
    return function(text) {
      return stringify(text, true).replace(re, rep);
    };
  }()),
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
  }()),
  /**
   * @lends Pot.Text
   */
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
  }())
});

// Update Pot object.
Pot.update({
  stringify      : Pot.Text.stringify,
  ReplaceSaver   : Pot.Text.ReplaceSaver,
  chr            : Pot.Text.chr,
  ord            : Pot.Text.ord,
  trim           : Pot.Text.trim,
  ltrim          : Pot.Text.ltrim,
  rtrim          : Pot.Text.rtrim,
  strip          : Pot.Text.strip,
  indent         : Pot.Text.indent,
  unindent       : Pot.Text.unindent,
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
  extract        : Pot.Text.extract,
  inc            : Pot.Text.inc,
  dec            : Pot.Text.dec,
  br             : Pot.Text.br,
  stripTags      : Pot.Text.stripTags,
  truncate       : Pot.Text.truncate,
  truncateMiddle : Pot.Text.truncateMiddle,
  toCharCode     : Pot.Text.toCharCode,
  toHankakuCase  : Pot.Text.toHankakuCase,
  toZenkakuCase  : Pot.Text.toZenkakuCase,
  toHanSpaceCase : Pot.Text.toHanSpaceCase,
  toZenSpaceCase : Pot.Text.toZenSpaceCase,
  toHiraganaCase : Pot.Text.toHiraganaCase,
  toKatakanaCase : Pot.Text.toKatakanaCase,
  toHankanaCase  : Pot.Text.toHankanaCase,
  toZenkanaCase  : Pot.Text.toZenkanaCase
});

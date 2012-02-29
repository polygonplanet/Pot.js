//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Sanitizer.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Sanitizer.
   *
   * This object escape the string or filename, and expressions,
   *  these will be sanitized safely.
   *
   * @name  Pot.Sanitizer
   * @type  Object
   * @class
   * @public
   * @static
   */
  Sanitizer : {}
});

update(Pot.Sanitizer, {
  /**
   * @lends Pot.Sanitizer
   */
  /**
   * Escape RegExp patterns.
   *
   *
   * @example
   *   var pattern = 'ﾑｷｭ*･ﾟ･*..:*･(≧∀≦)ﾟ･*:.｡.*ﾟ:!!';
   *   var regex = new RegExp('^(' + rescape(pattern) + ')$', 'g');
   *   debug(regex.toString());
   *   // @results /^(ﾑｷｭ\*･ﾟ･\*\.\.:\*･\(≧∀≦\)ﾟ･\*:\.｡\.\*ﾟ:!!)$/g
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  rescape : rescape,
  /**
   * Alias for rescape.
   *
   * @see Pot.Sanitizer.rescape
   *
   * @param  {String}  s  A target string.
   * @return {String}     The escaped string.
   * @type   Function
   * @function
   * @alias  Pot.Sanitizer.rescape
   * @static
   * @public
   */
  escapeRegExp : rescape,
  /**
   * Escape the HTML string.
   * HTML entities will be escaped.
   *
   *
   * @example
   *   var string = '(>_<)/"< Hello World!';
   *   var result = escapeHTML(string);
   *   debug(result);
   *   // @results '(&gt;_&lt;)/&quot;&lt; Hello World!'
   *   //
   *   // for JSDoc: (@results)
   *   // '(&amp;gt;_&amp;lt;)/&amp;quot;&amp;lt; Hello World!'
   *
   *
   * @param  {String}  text  The target string.
   * @return {String}        The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeHTML : function(text) {
    var me = arguments.callee, s;
    if (!me.ENTITIES) {
      update(me, {
        ENTITIES : [
          {by: /&/g, to: '&amp;' },
          {by: /</g, to: '&lt;'  },
          {by: />/g, to: '&gt;'  },
          {by: /"/g, to: '&quot;'},
          {by: /'/g, to: '&#039;'}
        ]
      });
    }
    s = stringify(text);
    if (s) {
      if (!Pot.isHTMLEscaped(s)) {
        each(me.ENTITIES, function(o) {
          s = s.replace(o.by, o.to);
        });
      }
    }
    return s;
  },
  /**
   * Unescape the HTML string.
   * HTML entities will be unescaped.
   *
   *
   * @example
   *   var string = '(&gt;_&lt;)/&quot;&lt; Hello World!';
   *   // for JSDoc: (string)
   *   // '(&amp;gt;_&amp;lt;)/&amp;quot;&amp;lt; Hello World!'
   *   //
   *   var result = unescapeHTML(string);
   *   debug(result);
   *   // @results '(>_<)/"< Hello World!'
   *
   *
   * @param  {String}  text  The target string.
   * @return {String}        The unescaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  unescapeHTML : function(text) {
    var me = arguments.callee, result = '';
    if (!me.RE) {
      update(me, {
        /**@ignore*/
        RE : /&(?:[a-z]\w{0,24}|#(?:x[0-9a-f]{1,8}|[0-9]{1,10}));/gi,
        /**@ignore*/
        ENTITIES : {
          // Some are unable to convert by DOM.
          // White spaces are not converted strict for other processing.
          '&nbsp;'   : '\u0020', // U+00A0
          '&ensp;'   : '\u0020', // U+2002
          '&emsp;'   : '\u0020', // U+2003
          '&thinsp;' : '\u0020', // U+2009
          '&hellip;' : '\u2026', '&bull;'   : '\u2022', '&copy;'   : '\u00a9',
          '&reg;'    : '\u00ae', '&deg;'    : '\u00b0', '&trade;'  : '\u2122',
          '&euro;'   : '\u20ac', '&permil;' : '\u2030', '&Delta;'  : '\u0394',
          '&nabla;'  : '\u2207', '&laquo;'  : '\u226a', '&raquo;'  : '\u226b',
          '&ldquo;'  : '\u201c', '&rdquo;'  : '\u201d', '&lsquo;'  : '\u2018',
          '&rsquo;'  : '\u2019', '&ndash;'  : '\u2013', '&mdash;'  : '\u2014',
          '&sum;'    : '\u2211', '&Sigma;'  : '\u03a3', '&plusmn;' : '\u00b1',
          '&para;'   : '\u00b6', '&equiv;'  : '\u2261', '&dagger;' : '\u2020',
          '&Dagger;' : '\u2021', '&forall;' : '\u2200', '&beta;'   : '\u03b2',
          '&Lambda;' : '\u039b', '&lambda;' : '\u03bb', '&omega;'  : '\u03c9',
          '&middot;' : '\u30fb', '&OElig;'  : '\u0152', '&quot;'   : '\u0022',
          '&apos;'   : '\u0027', '&lt;'     : '\u003c', '&gt;'     : '\u003e'
        },
        /**@ignore*/
        decode : function(s) {
          var c = '';
          try {
            if (!me.elem) {
              me.elem = Pot.currentDocument().createElement('div');
            }
            me.elem.innerHTML = String(s);
            c = me.elem.childNodes[0].nodeValue;
            me.elem.removeChild(me.elem.firstChild);
            if (!c || String(s).length > String(c).length) {
              throw c;
            }
          } catch (e) {
            c = String(s);
          }
          if (c && c.charAt(0) === '&' && c.slice(-1) === ';') {
            if (me.ENTITIES[c]) {
              c = me.ENTITIES[c];
            } else {
              c = c.slice(1, -1);
              if (c.charAt(0) === '#') {
                c = c.substring(1).toLowerCase();
                if (c.charAt(0) === 'x') {
                  c = '0' + c;
                } else {
                  c = c - 0;
                }
                c = fromCharCode(c);
              } else {
                c = '';
              }
            }
          }
          return c;
        }
      });
    }
    result = stringify(text);
    if (result) {
      if (Pot.isHTMLEscaped(result)) {
        result = result.replace(me.RE, me.decode).replace(/&amp;/g, '&');
      }
    }
    return result;
  },
  /**
   * Escape the XPath expression.
   *
   *
   * @example
   *   var text = '"] | /foo/bar/baz | .["';
   *   var expr = '//*[@class=' + escapeXPathText(text) + ']';
   *   // e.g. var element = $x(expr, document, true);
   *   debug(expr);
   *   // @results //*[@class=concat('"',"] | /foo/bar/baz | .[",'"')]
   *
   *
   * @example
   *   var text = 'hoge-class';
   *   var expr = '//*[@class=' + escapeXPathText(text) + ']';
   *   debug(expr);
   *   // @results //*[@class="hoge-class"]
   *
   *
   * @param  {String}  text  A string to be escaped.
   * @return {String}        The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeXPathText : function(text) {
    var result, re, matches, concats, esc, sq, wq;
    re = /[^"]+|"/g;
    wq = '"';
    sq = "'";
    /**@ignore*/
    esc = function(s) {
      return (s === wq) ? sq + s + sq : wq + s + wq;
    };
    matches = stringify(text).match(re);
    if (matches) {
      if (matches.length === 1) {
        result = esc(matches[0]);
      } else {
        concats = [];
        each(matches, function(match) {
          concats[concats.length] = esc(match);
        });
        result = 'concat(' + concats.join(',') + ')';
      }
    } else {
      result = wq + wq;
    }
    return result;
  },
  /**
   * Escape a string to use with AppleScript.
   *
   *
   * @example
   *   var file = escapeAppleScriptString('ヾ("ゝω・")ﾉ"');
   *   var command = [
   *     'tell application "Finder"',
   *     '  get exists of file "' + file + '" of desktop',
   *     'end tell'
   *   ].join('\n');
   *   debug(command);
   *   // @results
   *   //   tell application "Finder"
   *   //     get exists of file "ヾ(\"ゝω・\")ﾉ\"" of desktop
   *   //   end tell
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeAppleScriptString : function(s) {
    return stringify(s).replace(/(["\\])/g, '\\$1');
  },
  /**
   * Escape a string for basic code.
   *
   *
   * @example
   *   var result = 'id="' + escapeString('foo"bar"') + '"';
   *   debug(result);
   *   // @results id="foo\"bar\""
   *
   *
   * @param  {String}   s    A target string.
   * @return {String}        The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeString : function(s) {
    return stringify(s).replace(/(["'\\])/g, '\\$1');
  },
  /**
   * Unescape a string for basic code.
   *
   *
   * @example
   *   var result = unescapeString('foo=\\"bar\\"');
   *   debug(result);
   *   // @results foo="bar"
   *
   *
   * @param  {String}   s    A target string.
   * @return {String}        The unescaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  unescapeString : function(s) {
    return stringify(s).replace(/\\(["'\\])/g, '$1');
  },
  /**
   * Escape the filename.
   * Escapes to be a safe filename for each OS.
   *
   * {@link http://mxr.mozilla.org/mozilla/source/toolkit/
   *        content/contentAreaUtils.js#818 }
   *
   *
   * @example
   *   var fileName = 'ﾟ･*:.｡..｡.:*･ﾟ(file)ﾟ･*:.｡. .｡.:*･ﾟ･*';
   *   var escaped = escapeFileName(fileName);
   *   debug(escaped);
   *   // @results 'ﾟ･ .｡..｡. ･ﾟ(file)ﾟ･ .｡. .｡. ･ﾟ･ ' (on Windows)
   *
   *
   * @param  {String}  fileName   A target filename.
   * @return {String}             A validated filename.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeFileName : function(fileName) {
    var s, re;
    s = stringify(fileName);
    if (s) {
      re = [{from: /[\u0000-\u0008]+/g, to: ''}];
      if (Pot.OS.win) {
        re.push(
          {from: /[\/|\\]+/g, to: '_'},
          {from: /["]+/g,     to: "'"},
          {from: /[*:;?]+/g,  to: ' '},
          {from: /[<]+/g,     to: '('},
          {from: /[>]+/g,     to: ')'}
        );
      } else if (Pot.OS.mac) {
        re.push({from: /[\/:]+/g, to: '_'});
      }
      re.push(
        {from: /[*\/\\]+/g,      to: '_' },
        {from: /([_()])\1{2,}/g, to: '$1'}
      );
      each(re, function(r) {
        s = s.replace(r.from, r.to);
      });
    }
    return s;
  },
  /**
   * Convert a string that can be evaluated as JavaScript escape sequences.
   * This function converts more characters than JSON. (i.e. enabled as JSON)
   *
   *
   * @example
   *   var string = 'ほげabc ("ｗ")';
   *   var result = escapeSequence(string);
   *   debug(result);
   *   // @results  '\u307b\u3052abc\u0020(\"\uff57\")'
   *
   *
   * @param  {String}   text   A target string.
   * @return {String}          The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeSequence : function(text) {
    var s, me = arguments.callee;
    if (!me.re) {
      me.re = /[^\w!#$()*+,.:;=?@[\]^`|~-]/gi;
      /**@ignore*/
      me.meta = {
        // IE is not supported <VT> (\v).
        '\u0008': '\\b',  // <BS>
        '\u0009': '\\t',  // <HT> <TAB>
        '\u000A': '\\n',  // <LF>
        '\u000C': '\\f',  // <FF>
        '\u000D': '\\r',  // <CR>
        '\u0027': '\\\'',
        '\u0022': '\\"',
        '\u005C': '\\\\',
        '\u002F': '\\/'
      };
      /**@ignore*/
      me.rep = function(a) {
        var c = me.meta[a];
        return (typeof c === 'string') ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      };
    }
    me.re.lastIndex = 0;
    s = stringify(text);
    return (s && me.re.test(s)) ? s.replace(me.re, me.rep) : s;
  },
  /**
   * Revert the converted string as JavaScript escape sequences.
   *
   *
   * @example
   *   var string = '\\u307b\\u3052abc\\u0020(\\"\\uff57\\")';
   *   var result = unescapeSequence(string);
   *   debug(result);
   *   // @results  'ほげabc ("ｗ")'
   *
   *
   * @param  {String}   text   A target string.
   * @return {String}          The unescaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  unescapeSequence : function(text) {
    var s, me = arguments.callee;
    if (!me.re) {
      /**@ignore*/
      me.re = {
        seq   : /\\([btnvfr'"\/\\]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|.|[\s\S])/g,
        quote : /^\s*(?:"(?:\\.|[^"\r\n\\])*"|'(?:\\.|[^'\r\n\\])*')\s*$/,
        bs    : /[\u005C]{2}/g
      };
      /**@ignore*/
      me.meta = {
        'b' : '\u0008',
        't' : '\u0009',
        'n' : '\u000A',
        'v' : '\u000B',
        'f' : '\u000C',
        'r' : '\u000D',
        '\'': '\u0027',
        '"' : '\u0022',
        '\\': '\u005C',
        '/' : '\u002F'
      };
      me.chr = fromCharCode;
      /**@ignore*/
      me.rep = function(m, a) {
        var r, c = me.meta[a];
        if (typeof c === 'string') {
          r = c;
        } else if (a.length === 3 && a.charAt(0) === 'x') {
          r = me.chr('0' + a);
        } else if (a.length === 5 && a.charAt(0) === 'u') {
          r = me.chr('0x' + a.substring(1));
        } else {
          r = a;
        }
        return r;
      };
    }
    me.re.seq.lastIndex = 0;
    s = stringify(text);
    // for JSON string.
    if (me.re.quote.test(s) && me.re.bs.test(s)) {
      s = s.replace(me.re.bs, '\u005C');
    }
    return (s && me.re.seq.test(s)) ? s.replace(me.re.seq, me.rep) : s;
  }
});

// Update Pot object.
Pot.update({
  rescape                 : Pot.Sanitizer.rescape,
  escapeRegExp            : Pot.Sanitizer.escapeRegExp,
  escapeHTML              : Pot.Sanitizer.escapeHTML,
  unescapeHTML            : Pot.Sanitizer.unescapeHTML,
  escapeXPathText         : Pot.Sanitizer.escapeXPathText,
  escapeAppleScriptString : Pot.Sanitizer.escapeAppleScriptString,
  escapeString            : Pot.Sanitizer.escapeString,
  unescapeString          : Pot.Sanitizer.unescapeString,
  escapeFileName          : Pot.Sanitizer.escapeFileName,
  escapeSequence          : Pot.Sanitizer.escapeSequence,
  unescapeSequence        : Pot.Sanitizer.unescapeSequence
});

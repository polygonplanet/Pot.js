//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of UTF8.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * UTF-8 and UTF-16  utilities.
   *
   * Mutual conversion between UTF-8 and UTF-16.
   *
   * RFC 2044, RFC 2279: UTF-8, a transformation format of ISO 10646
   * @link http://www.ietf.org/rfc/rfc2279.txt
   *
   * Note that using "encodeURIComponent" or "decodeURIComponent" to
   *   convert a string that includes surrogate pair or characters
   *   U+FFFE or U+FFFF then will raise URIError.
   * U+FFFF and U+FFFE will convert unexpect result on SpiderMonkey.
   *
   * This methods implements convertion functions for
   *   UTF-8 and UTF-16 compatible with calling of
   *   "unescape(encodeURIComponent(string))" and
   *   "decodeURIComponent(escape(string))".
   *
   * <pre>
   * Example:
   *   decodeURIComponent(encodeURIComponent('\uFFFF')) === '\uFFFF';
   * Results:
   *   false (SpiderMonkey)
   *
   * Example:
   *   decodeURIComponent(encodeURIComponent('\uD811')) === '\uD811';
   * Results:
   *   URIError
   * </pre>
   *
   * @name Pot.UTF8
   * @type Object
   * @class
   * @static
   * @public
   * @based libxml/xml.c#xml_utf8_encode/xml_utf8_decode
   */
  UTF8 : {}
});

update(Pot.UTF8, {
  /**
   * @lends Pot.UTF8
   */
  /**
   * Convert to UTF-8 string from UTF-16 string.
   *
   *
   * @example
   *   var string = 'hogeほげ';
   *   var encoded = Pot.utf8Encode(string);
   *   var decoded = Pot.utf8Decode(encoded);
   *   var toCharCode = function(s) {
   *     return Pot.map(s.split(''), function(c) {
   *       return c.charCodeAt(0);
   *     });
   *   };
   *   Pot.debug(toCharCode(encoded));
   *   // [104, 111, 103, 101, 227, 129, 187, 227, 129, 146]
   *   Pot.debug(decoded); // 'hogeほげ'
   *   Pot.debug(decoded === string); // true
   *
   *
   * @param  {String}  string  UTF-16 string.
   * @return {String}          UTF-8 string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  encode : (function() {
    var sc = fromUnicode,
        /**@ignore*/
        add = function(b, c) {
          var l = b.length;
          if (c < 0x80) {
            b[l] = sc(c);
          } else if (c < 0x800) {
            b[l] = sc(0xC0 | ((c >>  6) & 0x1F)) +
                   sc(0x80 | ((c >>  0) & 0x3F));
          } else if (c < 0x10000) {
            b[l] = sc(0xE0 | ((c >> 12) & 0x0F)) +
                   sc(0x80 | ((c >>  6) & 0x3F)) +
                   sc(0x80 | ((c >>  0) & 0x3F));
          } else {
            b[l] = sc(0xF0 | ((c >> 18) & 0x0F)) +
                   sc(0x80 | ((c >> 12) & 0x3F)) +
                   sc(0x80 | ((c >>  6) & 0x3F)) +
                   sc(0x80 | ((c >>  0) & 0x3F));
          }
        };
    return function(string) {
      var chars = [],  len, i, j, ch, c2,
          s = stringify(string);
      if (s) {
        len = s.length;
        for (i = 0; i < len; i++) {
          ch = s.charCodeAt(i);
          if (0xD800 <= ch && ch <= 0xD8FF) {
            j = i + 1;
            if (j < len) {
              c2 = s.charCodeAt(j);
              if (0xDC00 <= c2 && c2 <= 0xDFFF) {
                ch = ((ch & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                i = j;
              }
            }
          }
          add(chars, ch);
        }
      }
      return chars.join('');
    };
  }()),
  /**
   * Convert to UTF-16 string from UTF-8 string.
   *
   *
   * @example
   *   var string = 'hogeほげ';
   *   var encoded = Pot.utf8Encode(string);
   *   var decoded = Pot.utf8Decode(encoded);
   *   var toCharCode = function(s) {
   *     return Pot.map(s.split(''), function(c) {
   *       return c.charCodeAt(0);
   *     });
   *   };
   *   Pot.debug(toCharCode(encoded));
   *   // [104, 111, 103, 101, 227, 129, 187, 227, 129, 146]
   *   Pot.debug(decoded); // 'hogeほげ'
   *   Pot.debug(decoded === string); // true
   *
   *
   * @param  {String}  string  UTF-8 string.
   * @return {String}          UTF-16 string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  decode : function(string) {
    var result = '', chars = [], i = 0, len,
        n, c, c2, c3, c4, code, sc = fromUnicode,
        s = stringify(string);
    if (s) {
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        n = (c >> 4);
        if (0 <= n && n <= 7) {
          // 0xxx xxxx
          chars[chars.length] = sc(c);
        } else if (12 <= n && n <= 13) {
          // 110x xxxx
          // 10xx xxxx
          c2 = s.charCodeAt(i++);
          chars[chars.length] = sc(((c & 0x1F) << 6) | (c2 & 0x3F));
        } else if (n === 14) {
          // 1110 xxxx
          // 10xx xxxx
          // 10xx xxxx
          c2 = s.charCodeAt(i++);
          c3 = s.charCodeAt(i++);
          chars[chars.length] = sc(((c  & 0x0F) << 12) |
                                   ((c2 & 0x3F) <<  6) |
                                   ((c3 & 0x3F) <<  0));
        } else if (i + 2 < len) {
          // 1111 0xxx ...
          c2 = s.charCodeAt(i++);
          c3 = s.charCodeAt(i++);
          c4 = s.charCodeAt(i++);
          code = (((c  & 0x07) << 18) |
                  ((c2 & 0x3F) << 12) |
                  ((c3 & 0x3F) <<  6) |
                  ((c4 & 0x3F) <<  0));
          if (code <= 0xFFFF) {
            chars[chars.length] = sc(code);
          } else {
            chars[chars.length] = fromCharCode(
              (code >> 10)   + 0xD7C0,
              (code & 0x3FF) + 0xDC00
            );
          }
        }
      }
      result = chars.join('');
    }
    return result;
  },
  /**
   * Gets the byte size of string as UTF-8.
   *
   *
   * @example
   *   var string = 'abc123あいうえお';
   *   var length = string.length;
   *   var byteSize = Pot.UTF8.byteOf(string);
   *   debug(string + ' : length = ' + length + ', byteSize = ' + byteSize);
   *   // @results
   *   //   length   = 11
   *   //   byteSize = 21
   *
   *
   * @param  {String}   string   The target string.
   * @return {Number}            The UTF-8 byte size of string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  byteOf : (function() {
    var s, i, len,
        /**@ignore*/
        toCharCode = function() {
          var c1 = s.charCodeAt(i), c2, j;
          if (0xD800 <= c1 && c1 <= 0xD8FF) {
            j = i + 1;
            if (j < len) {
              c2 = s.charCodeAt(j);
              if (0xDC00 <= c2 && c2 <= 0xDFFF) {
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                i = j;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
          return c1;
        };
    return function(string) {
      var size = 0, c;
      s = stringify(string, true);
      if (s) {
        len = s.length;
        for (i = 0; i < len; i++) {
          c = toCharCode();
          if (c !== false) {
            if (c < 0x80) {
              size += 1;
            } else if (c < 0x800) {
              size += 2;
            } else if (c < 0x10000) {
              size += 3;
            } else if (c < 0x200000) {
              size += 4;
            } else if (c < 0x4000000) {
              size += 5;
            } else {
              size += 6;
            }
          }
        }
      }
      s = i = len = null;
      return size;
    };
  }()),
  /**
   * Convert encoding to Unicode string.
   * This function requires BlobBuilder and FileReader API.
   * If environment not supported HTML5 API, it will be raised by Deferred.
   *
   * @example
   *   // 'こんにちは。ほげほげ'
   *   var unicode = [
   *     12371, 12435, 12395, 12385, 12399, 12290,
   *     12411, 12370, 12411, 12370
   *   ];
   *   // Shift_JIS: 'こんにちは。ほげほげ'
   *   var sjis = [
   *     130, 177, 130, 241, 130, 201,
   *     130, 191, 130, 205, 129, 66,
   *     130, 217, 130, 176, 130, 217,
   *     130, 176
   *   ];
   *   // EUC-JP: 'こんにちは。ほげほげ'
   *   var eucjp = [
   *     164, 179, 164, 243, 164, 203,
   *     164, 193, 164, 207, 161, 163,
   *     164, 219, 164, 178, 164, 219,
   *     164, 178
   *   ];
   *   // UTF-8: 'こんにちは。ほげほげ'
   *   var utf8 = [
   *     227, 129, 147, 227, 130, 147,
   *     227, 129, 171, 227, 129, 161,
   *     227, 129, 175, 227, 128, 130,
   *     227, 129, 187, 227, 129, 146,
   *     227, 129, 187, 227, 129, 146
   *   ];
   *   Pot.convertEncodingToUnicode(sjis, 'Shift_JIS').then(function(res) {
   *     Pot.debug('SJIS to Unicode:');
   *     Pot.debug(res); // 'こんにちは。ほげほげ'
   *   }).then(function() {
   *     return Pot.convertEncodingToUnicode(eucjp, 'EUC-JP').
   *                                                     then(function(res) {
   *       Pot.debug('EUC-JP to Unicode:');
   *       Pot.debug(res); // 'こんにちは。ほげほげ'
   *     });
   *   }).then(function() {
   *     return Pot.convertEncodingToUnicode(utf8, 'UTF-8').
   *                                                    then(function(res) {
   *       Pot.debug('UTF-8 to Unicode:');
   *       Pot.debug(res); // 'こんにちは。ほげほげ'
   *     });
   *   });
   *
   *
   * @param  {TypedArray|Array|Blob}  data   The target data.
   * @param  {(String)}              (from)  (optional) Character
   *                                           encoding from.
   * @return {Pot.Deferred}                  A new instance of
   *                                           Pot.Deferred that has
   *                                           Unicode string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  convertEncodingToUnicode : (function() {
    var isAuto = /^\s*auto\s*$/i;
    return function(data, from) {
      var d, bb, fl, b, dfd;
      if (isString(data)) {
        d = ArrayBufferoid.binaryToBuffer.deferred(data);
      } else {
        d = Deferred.succeed(data);
      }
      return d.then(function(res) {
        dfd = new Deferred();
        try {
          fl = new FileReader();
          if (isArrayBufferoid(res)) {
            bb = res.toArrayBuffer();
          } else if (isArrayLike(res)) {
            bb = new ArrayBufferoid(res).toArrayBuffer();
          } else {
            bb = res;
          }
          /**@ignore*/
          fl.onload = function(ev) {
            fl.onload = fl.onerror = PotNoop;
            if (ev && ev.target) {
              dfd.begin(ev.target.result);
            } else {
              dfd.raise(ev);
            }
          };
          /**@ignore*/
          fl.onerror = function(er) {
            fl.onload = fl.onerror = PotNoop;
            dfd.raise(er);
          };
          b = Pot.createBlob(bb, 'text/plain');
          if (from == null || isAuto.test(from)) {
            fl.readAsText(b);
          } else {
            //XXX: Assign the encoding names.
            fl.readAsText(b, trim(from));
          }
        } catch (e) {
          dfd.raise(e);
        }
        return dfd;
      });
    };
  }())
});

// Update Pot object.
Pot.update({
  utf8Encode               : Pot.UTF8.encode,
  utf8Decode               : Pot.UTF8.decode,
  utf8ByteOf               : Pot.UTF8.byteOf,
  convertEncodingToUnicode : Pot.UTF8.convertEncodingToUnicode
});

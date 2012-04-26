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
   * @param  {String}  string  UTF-16 string.
   * @return {String}          UTF-8 string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  encode : function(string) {
    var result = '', chars = [], len, i, c, s, sc;
    s = stringify(string);
    if (s) {
      sc = fromUnicode;
      len = s.length;
      for (i = 0; i < len; i++) {
        c = s.charCodeAt(i);
        if (c < 0x80) {
          chars[chars.length] = sc(c);
        } else if (c > 0x7FF) {
          chars[chars.length] = sc(0xE0 | ((c >> 12) & 0x0F)) +
                                sc(0x80 | ((c >>  6) & 0x3F)) +
                                sc(0x80 | ((c >>  0) & 0x3F));
        } else {
          chars[chars.length] = sc(0xC0 | ((c >>  6) & 0x1F)) +
                                sc(0x80 | ((c >>  0) & 0x3F));
        }
      }
      result = chars.join('');
    }
    return result;
  },
  /**
   * Convert to UTF-16 string from UTF-8 string.
   *
   * @param  {String}  string  UTF-8 string.
   * @return {String}          UTF-16 string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  decode : function(string) {
    var result = '', chars = [], i, len, s, n, c, c2, c3, sc;
    s = stringify(string);
    if (s) {
      sc = fromUnicode;
      i = 0;
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
  byteOf : function(string) {
    var size = 0, s, i, c;
    s = stringify(string, true);
    if (s) {
      i = s.length;
      while (--i >= 0) {
        c = s.charCodeAt(i);
        if (c < 0x80) {
          size++;
        } else if (c < 0x800 ||
                  // We ignore UTF-8 Surrogate Pair, for the binary data.
                  (c > 0xD7FF && c < 0xE000)
        ) {
          size += 2;
        } else {
          size += 3;
        }
      }
    }
    return size;
  },
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
   *     return Pot.convertEncodingToUnicode(eucjp, 'EUC-JP')
   *                                                    .then(function(res) {
   *       Pot.debug('EUC-JP to Unicode:');
   *       Pot.debug(res); // 'こんにちは。ほげほげ'
   *     });
   *   }).then(function() {
   *     return Pot.convertEncodingToUnicode(utf8, 'UTF-8')
   *                                                    .then(function(res) {
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
    var isAuto = /^\s*auto\s{0,}/i;
    return function(data, from) {
      var d  = new Deferred(), bb, fl, b;
      try {
        bb = new PotSystem.BlobBuilder();
        fl = new FileReader();
        if (isString(data)) {
          //XXX: String to ArrayBuffer
          bb.append(data);
        } else if (isArrayLike(data)) {
          bb.append(new Uint8Array(data).buffer);
        } else {
          bb.append(data);
        }
        /**@ignore*/
        fl.onload = function(ev) {
          fl.onload = fl.onerror = PotNoop;
          if (ev && ev.target && ev.target.result != null) {
            d.begin(ev.target.result);
          } else {
            d.raise(ev);
          }
        };
        /**@ignore*/
        fl.onerror = function(e) {
          fl.onload = fl.onerror = PotNoop;
          d.raise(e);
        };
        b = bb.getBlob('text/plain');
        if (from == null || isAuto.test(from)) {
          fl.readAsText(b);
        } else {
          fl.readAsText(b, trim(from));
        }
      } catch (e) {
        d.raise(e);
      }
      return d;
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

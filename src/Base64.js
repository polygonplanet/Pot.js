//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Base64.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Base64 encode/decode.
   *
   * RFC 3548 - Base64 Data Encodings
   * @link http://tools.ietf.org/html/rfc3548
   *
   * @name Pot.Base64
   * @type Object
   * @class
   * @static
   * @public
   */
  Base64 : (function() {
    // Base64 from: http://feel.happy.nu/test/base64.html
    var BASE64MAPS = UPPER_ALPHAS + LOWER_ALPHAS + DIGITS + '+/=';
    /**@ignore*/
    function encodeBase64(text) {
      var r = '', t = [], s, p = -6, a = 0, i = 0, v = 0, c, n;
      s = Pot.UTF8.encode(stringify(text, true));
      if (s) {
        n = s.length;
        while (i < n || p > -6) {
          if (p < 0) {
            if (i < n) {
              c = s.charCodeAt(i++);
              v += 8;
            } else {
              c = 0;
            }
            a = ((a & 255) << 8) | (c & 255);
            p += 8;
          }
          t[t.length] = BASE64MAPS.charAt((v > 0) ? (a >> p & 63) : 64);
          p -= 6;
          v -= 6;
        }
        r = t.join('');
      }
      return r;
    }
    /**@ignore*/
    function decodeBase64(text) {
      var r = '', t = [], s, p = -8, a = 0, c, d, n, i;
      s = stringify(text, true);
      if (s) {
        n = s.length;
        for (i = 0; i < n; i++) {
          c = BASE64MAPS.indexOf(s.charAt(i));
          if (~c) {
            a = (a << 6) | (c & 63);
            p += 6;
            if (p >= 0) {
              d = (a >> p & 255);
              if (c !== 64) {
                t[t.length] = fromCharCode(d);
              }
              a &= 63;
              p -= 8;
            }
          }
        }
        r = t.join('');
      }
      return Pot.UTF8.decode(r);
    }
    return {
      /**
       * @lends Pot.Base64
       */
      /**
       * Encodes a string to base64.
       *
       *
       * @example
       *   var string = 'Hello World.';
       *   var result = Pot.Base64.encode(string);
       *   debug(result);
       *   // @results 'SGVsbG8gV29ybGQu'
       *
       *
       * @param  {String}  text   A target string.
       * @return {String}         A base64 string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      encode : function(text) {
        var result = '', s = stringify(text, true);
        if (s) {
          try {
            if (typeof btoa === 'undefined') {
              throw false;
            }
            result = btoa(Pot.UTF8.encode(s));
          } catch (e) {
            try {
              result = encodeBase64(s);
            } catch (e) {}
          }
        }
        return result;
      },
      /**
       * Decodes a string from base64.
       *
       *
       * @example
       *   var b64string = 'SGVsbG8gV29ybGQu';
       *   var result = Pot.Base64.decode(b64string);
       *   debug(result);
       *   // @results 'Hello World.'
       *
       *
       * @param  {String}  text   A base64 string.
       * @return {String}         A result string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      decode : function(text) {
        var result = '', s = stringify(text, true);
        if (s) {
          try {
            if (typeof atob === 'undefined') {
              throw false;
            }
            result = Pot.UTF8.decode(atob(s));
          } catch (e) {
            try {
              result = decodeBase64(s);
            } catch (e) {}
          }
        }
        return result;
      }
    };
  })()
});

// Update Pot object.
Pot.update({
  base64Encode : Pot.Base64.encode,
  base64Decode : Pot.Base64.decode
});

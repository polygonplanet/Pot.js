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
    var BASE64MAPS    = UPPER_ALPHAS + LOWER_ALPHAS + DIGITS + '+/=',
        BASE64URLMAPS = UPPER_ALPHAS + LOWER_ALPHAS + DIGITS + '-_=',
        /**@ignore*/
        Encoder = function(data, maps) {
          return new Encoder.prototype.init(data, maps);
        },
        /**@ignore*/
        Decoder = function(string, maps) {
          return new Decoder.prototype.init(string, maps);
        };
    Encoder.prototype = update(Encoder.prototype, {
      /**
       * @private
       * @ignore
       * @internal
       */
      constructor : Encoder,
      /**
       * @private
       * @ignore
       * @internal
       */
      data : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      raw : false,
      /**
       * @private
       * @ignore
       * @internal
       */
      len : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      results : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      pos : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      att : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      index : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      vol : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      maps : null,
      /**
       * Initialize properties.
       *
       * @private
       * @ignore
       */
      init : function(data, maps) {
        this.maps = maps;
        if (isArrayLike(data)) {
          this.data = arrayize(data);
          this.raw = true;
        } else {
          this.data = stringify(data, true);
          this.raw = false;
        }
        this.len = this.data.length;
        this.results = [];
        this.pos = -6;
        this.att = 0;
        this.index = 0;
        this.vol = 0;
        return this;
      },
      /**
       * @private
       * @ignore
       */
      execute : function() {
        var r = this.results, m = this.maps;
        if (!this.raw) {
          this.data = Pot.UTF8.encode(this.data);
        }
        if (this.data) {
          this.len = this.data.length;
          while (this.index < this.len || this.pos > -6) {
            if (this.pos < 0) {
              this.peek();
            }
            r[r.length] = m.charAt(
              (this.vol > 0) ? (this.att >> this.pos & 63) : 64
            );
            this.pos -= 6;
            this.vol -= 6;
          }
        }
        return r.join('');
      },
      /**
       * @private
       * @ignore
       */
      deferred : function(speed) {
        var that = this, r = this.results, m = this.maps;
        if (!this.raw) {
          this.data = Pot.UTF8.encode(this.data);
        }
        this.len = this.data.length;
        return Deferred.forEver[speed](function() {
          if (that.index < that.len || that.pos > -6) {
            if (that.pos < 0) {
              that.peek();
            }
            r[r.length] = m.charAt(
              (that.vol > 0) ? (that.att >> that.pos & 63) : 64
            );
            that.pos -= 6;
            that.vol -= 6;
          } else {
            throw PotStopIteration;
          }
        }).then(function() {
          return r.join('');
        });
      },
      /**
       * @private
       * @ignore
       */
      peek : function() {
        var c;
        if (this.index < this.len) {
          if (this.raw) {
            c = this.data[this.index++];
          } else {
            c = this.data.charCodeAt(this.index++);
          }
          this.vol += 8;
        } else {
          c = 0;
        }
        this.att = ((this.att & 0xFF) << 8) | (c & 0xFF);
        this.pos += 8;
      }
    });
    Encoder.prototype.init.prototype = Encoder.prototype;
    Decoder.prototype = update(Decoder.prototype, {
      /**
       * @private
       * @ignore
       * @internal
       */
      constructor : Decoder,
      /**
       * @private
       * @ignore
       * @internal
       */
      string : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      asBuffer : false,
      /**
       * @private
       * @ignore
       * @internal
       */
      len : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      results : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      pos : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      att : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      vol : null,
      /**
       * @private
       * @ignore
       * @internal
       */
      maps : null,
      /**
       * Initialize properties.
       *
       * @private
       * @ignore
       */
      init : function(string, maps) {
        this.maps = maps;
        this.asBuffer = false;
        this.string = stringify(string, true);
        this.assign();
        this.len = this.string.length;
        this.results = [];
        this.pos = -8;
        this.att = 0;
        return this;
      },
      /**
       * @private
       * @ignore
       */
      assign : function() {
        var s = this.string;
        if (~s.indexOf('-') || ~s.indexOf('_')) {
          this.maps = BASE64URLMAPS;
        } else {
          this.maps = BASE64MAPS;
        }
      },
      /**
       * @private
       * @ignore
       */
      execute : function() {
        var i, n = this.len, c, m = this.maps;
        if (n) {
          for (i = 0; i < n; i++) {
            c = m.indexOf(this.string.charAt(i));
            if (~c) {
              this.decode(c);
            }
          }
        }
        return Pot.UTF8.decode(this.results.join(''));
      },
      /**
       * @private
       * @ignore
       */
      executeAsBuffer : function() {
        var i, n = this.len, c, m = this.maps;
        this.asBuffer = true;
        if (n) {
          for (i = 0; i < n; i++) {
            c = m.indexOf(this.string.charAt(i));
            if (~c) {
              this.decode(c);
            }
          }
        }
        return new ArrayBufferoid(this.results);
      },
      /**
       * @private
       * @ignore
       */
      deferred : function(speed) {
        var that = this, m = this.maps;
        return Deferred.repeat[speed](this.len, function(i) {
          var c = m.indexOf(that.string.charAt(i));
          if (~c) {
            that.decode(c);
          }
        }).then(function() {
          return Pot.UTF8.decode(that.results.join(''));
        });
      },
      /**
       * @private
       * @ignore
       */
      deferredAsBuffer : function(speed) {
        var that = this, m = this.maps;
        this.asBuffer = true;
        return Deferred.repeat[speed](this.len, function(i) {
          var c = m.indexOf(that.string.charAt(i));
          if (~c) {
            that.decode(c);
          }
        }).then(function() {
          return new ArrayBufferoid(that.results);
        });
      },
      /**
       * @private
       * @ignore
       */
      decode : function(c) {
        var code, r = this.results;
        this.att = (this.att << 6) | (c & 63);
        this.pos += 6;
        if (this.pos >= 0) {
          code = this.att >> this.pos & 0xFF;
          if (c !== 64) {
            r[r.length] = this.asBuffer ? code : fromUnicode(code);
          }
          this.att &= 63;
          this.pos -= 8;
        }
      }
    });
    Decoder.prototype.init.prototype = Decoder.prototype;
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
       *   var result = Pot.base64Encode(string);
       *   debug(result);
       *   // @results 'SGVsbG8gV29ybGQu'
       *
       *
       * @example
       *   var string = 'にゃふん!';
       *   var encoded = Pot.base64Encode(string);
       *   var decoded = Pot.base64Decode(encoded);
       *   debug(
       *     'string  = ' + string + '\n' +
       *     'encoded = ' + encoded + '\n' +
       *     'decoded = ' + decoded
       *   );
       *   // @results
       *   //   string  = にゃふん!
       *   //   encoded = 44Gr44KD44G144KTIQ==
       *   //   decoded = にゃふん!
       *
       *
       * @param  {String|Array}  data   A target data.
       * @return {String}               A base64 string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      encode : update(function(data) {
        var s;
        if (!data) {
          return '';
        }
        if (isArrayLike(data)) {
          s = arrayize(data);
        } else {
          s = stringify(data, true);
          try {
            if (typeof btoa !== 'undefined') {
              return btoa(Pot.UTF8.encode(s));
            }
          } catch (e) {}
        }
        return new Encoder(s, BASE64MAPS).execute();
      }, {
        /**
         * @lends Pot.Base64.encode
         */
        /**
         * Encodes a string to base64 with Deferred.
         *
         *
         * @example
         *   var string = 'Hello World.';
         *   Pot.base64Encode.deferred(string).then(function(encoded) {
         *     debug(encoded);
         *     // @results 'SGVsbG8gV29ybGQu'
         *     return Pot.base64Decode.deferred(encoded)
         *                            .then(function(decoded) {
         *       debug(decoded);
         *       // @results 'Hello World.'
         *     });
         *   });
         *
         *
         * @example
         *   var string = 'にゃふん!';
         *   Pot.base64Encode.deferred(string).then(function(encoded) {
         *     return Pot.base64Decode.deferred(encoded)
         *                            .then(function(decoded) {
         *       debug(
         *         'string  = ' + string + '\n' +
         *         'encoded = ' + encoded + '\n' +
         *         'decoded = ' + decoded
         *       );
         *       // @results
         *       //   string  = にゃふん!
         *       //   encoded = 44Gr44KD44G144KTIQ==
         *       //   decoded = にゃふん!
         *     });
         *   });
         *
         *
         * @param  {String|Array}  data   A target data.
         * @return {Pot.Deferred}         Returns new instance of
         *                                  Pot.Deferred with a
         *                                  base64 string.
         * @type  Function
         * @function
         * @static
         * @public
         *
         * @property {Function} limp   Run with slowest speed.
         * @property {Function} doze   Run with slower speed.
         * @property {Function} slow   Run with slow speed.
         * @property {Function} normal Run with default speed.
         * @property {Function} fast   Run with fast speed.
         * @property {Function} rapid  Run with faster speed.
         * @property {Function} ninja  Run fastest speed.
         */
        deferred : PotInternal.defineDeferrater(function(speed) {
          return function(data) {
            return new Encoder(data, BASE64MAPS).deferred(speed);
          };
        })
      }),
      /**
       * @lends Pot.Base64
       */
      /**
       * Decodes a string from base64.
       *
       *
       * @example
       *   var b64string = 'SGVsbG8gV29ybGQu';
       *   var result = Pot.base64Decode(b64string);
       *   debug(result);
       *   // @results 'Hello World.'
       *
       *
       * @example
       *   var string = 'にゃふん!';
       *   var encoded = Pot.base64Encode(string);
       *   var decoded = Pot.base64Decode(encoded);
       *   debug(
       *     'string  = ' + string + '\n' +
       *     'encoded = ' + encoded + '\n' +
       *     'decoded = ' + decoded
       *   );
       *   // @results
       *   //   string  = にゃふん!
       *   //   encoded = 44Gr44KD44G144KTIQ==
       *   //   decoded = にゃふん!
       *
       *
       * @param  {String}  string   A base64 string.
       * @return {String}           A result string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      decode : update(function(string) {
        var result = '', s = stringify(string, true);
        if (s) {
          try {
            if (typeof atob === 'undefined') {
              throw false;
            }
            result = Pot.UTF8.decode(atob(s));
          } catch (e) {
            try {
              result = new Decoder(s, BASE64MAPS).execute();
            } catch (e) {}
          }
        }
        return result;
      }, {
        /**
         * @lends Pot.Base64.decode
         */
        /**
         * Decodes a string from base64 as ArrayBuffer.
         *
         *
         * @example
         *   var b64string = 'SGVsbG8gV29ybGQu';
         *   var buffer = Pot.base64Decode.asBuffer(b64string);
         *   Pot.debug(buffer);
         *   // [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46]
         *   Pot.debug(Pot.ArrayBufferoid.bufferToString(buffer));
         *   // 'Hello World.'
         *
         *
         * @example
         *   var base64String = '776fK++9oToub++9pe++n++9peKUo8Ko' +
         *                      '77234pSjwqjvvbfimIbvvaXvvp/vvaU=';
         *   var buffer = Pot.base64Decode.asBuffer(base64String);
         *   Pot.debug(buffer);
         *   // [239, 190, 159,  43, 239, 189, 161,  58,  46, 111,
         *   //  239, 189, 165, 239, 190, 159, 239, 189, 165, 226,
         *   //  148, 163, 194, 168, 239, 189, 183, 226, 148, 163,
         *   //  194, 168, 239, 189, 183, 226, 152, 134, 239, 189,
         *   //  165, 239, 190, 159, 239, 189, 165]
         *   Pot.debug(Pot.ArrayBufferoid.bufferToString(buffer));
         *   // 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･'
         *
         *
         * @param  {String}              string   A base64 string.
         * @return {Pot.ArrayBufferoid}           A new instance of
         *                                          Pot.ArrayBufferoid.
         * @type  Function
         * @function
         * @static
         * @public
         */
        asBuffer : function(string) {
          return new Decoder(string, BASE64MAPS).executeAsBuffer();
        },
        /**
         * Decodes a string from base64 with Deferred.
         *
         *
         * @example
         *   var string = 'Hello World.';
         *   Pot.base64Encode.deferred(string).then(function(encoded) {
         *     debug(encoded);
         *     // @results 'SGVsbG8gV29ybGQu'
         *     return Pot.base64Decode.deferred(encoded)
         *                            .then(function(decoded) {
         *       debug(decoded);
         *       // @results 'Hello World.'
         *     });
         *   });
         *
         *
         * @example
         *   var string = 'にゃふん!';
         *   Pot.base64Encode.deferred(string).then(function(encoded) {
         *     return Pot.base64Decode.deferred(encoded)
         *                            .then(function(decoded) {
         *       debug(
         *         'string  = ' + string + '\n' +
         *         'encoded = ' + encoded + '\n' +
         *         'decoded = ' + decoded
         *       );
         *       // @results
         *       //   string  = にゃふん!
         *       //   encoded = 44Gr44KD44G144KTIQ==
         *       //   decoded = にゃふん!
         *     });
         *   });
         *
         *
         * @param  {String}        string   A base64 string.
         * @return {Pot.Deferred}           Returns new instance of
         *                                    Pot.Deferred with a string.
         * @type  Function
         * @function
         * @static
         * @public
         *
         * @property {Function} limp   Run with slowest speed.
         * @property {Function} doze   Run with slower speed.
         * @property {Function} slow   Run with slow speed.
         * @property {Function} normal Run with default speed.
         * @property {Function} fast   Run with fast speed.
         * @property {Function} rapid  Run with faster speed.
         * @property {Function} ninja  Run fastest speed.
         */
        deferred : PotInternal.defineDeferrater(function(speed) {
          return function(string) {
            return new Decoder(string, BASE64MAPS).deferred(speed);
          };
        }),
        /**
         * Decodes a string from base64 as ArrayBuffer with Deferred.
         *
         *
         * @example
         *   var b64string = 'SGVsbG8gV29ybGQu';
         *   Pot.base64Decode.deferredAsBuffer(b64string)
         *                                    .then(function(buffer) {
         *     Pot.debug(buffer);
         *     // [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46]
         *     Pot.debug(Pot.ArrayBufferoid.bufferToString(buffer));
         *     // 'Hello World.'
         *   });
         *
         *
         * @example
         *   var base64String = '776fK++9oToub++9pe++n++9peKUo8Ko' +
         *                      '77234pSjwqjvvbfimIbvvaXvvp/vvaU=';
         *   Pot.base64Decode.deferredAsBuffer(base64String)
         *                               .then(function(res) {
         *     Pot.debug(res);
         *     // [239, 190, 159,  43, 239, 189, 161,  58,  46, 111,
         *     //  239, 189, 165, 239, 190, 159, 239, 189, 165, 226,
         *     //  148, 163, 194, 168, 239, 189, 183, 226, 148, 163,
         *     //  194, 168, 239, 189, 183, 226, 152, 134, 239, 189,
         *     //  165, 239, 190, 159, 239, 189, 165]
         *     Pot.debug(Pot.ArrayBufferoid.bufferToString(res));
         *     // 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･'
         *   });
         *
         *
         * @param  {String}        string   A base64 string.
         * @return {Pot.Deferred}           Returns new instance of
         *                                    Pot.Deferred with a
         *                                    new instance of
         *                                    Pot.ArrayBufferoid.
         * @type  Function
         * @function
         * @static
         * @public
         *
         * @property {Function} limp   Run with slowest speed.
         * @property {Function} doze   Run with slower speed.
         * @property {Function} slow   Run with slow speed.
         * @property {Function} normal Run with default speed.
         * @property {Function} fast   Run with fast speed.
         * @property {Function} rapid  Run with faster speed.
         * @property {Function} ninja  Run fastest speed.
         */
        deferredAsBuffer : PotInternal.defineDeferrater(function(speed) {
          return function(string) {
            return new Decoder(string, BASE64MAPS).deferredAsBuffer(speed);
          };
        })
      }),
      /**
       * @lends Pot.Base64
       */
      /**
       * Encodes a string to base64 for URL safely.
       *
       *
       * @example
       *   var string = '(*>_<*)';
       *   var result = Pot.base64URLEncode(string);
       *   debug(result);
       *   // @results 'KCo-XzwqKQ=='
       *
       *
       * @example
       *   var string = 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･';
       *   var encoded = Pot.base64URLEncode(string);
       *   var decoded = Pot.base64URLDecode(encoded);
       *   debug(
       *     'string  = ' + string + '\n' +
       *     'encoded = ' + encoded + '\n' +
       *     'decoded = ' + decoded
       *   );
       *   // @results
       *   //   string  = ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･ 
       *   //   encoded = 776fK--9oToub--9pe--n--9peKUo8Ko
       *   //             77234pSjwqjvvbfimIbvvaXvvp_vvaU=
       *   //   decoded = ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･
       *
       *
       * @param  {String|Array}  data   A target data.
       * @return {String}               A base64 string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      urlEncode : update(function(data) {
        return new Encoder(data, BASE64URLMAPS).execute();
      }, {
        /**
         * @lends Pot.Base64.urlEncode
         */
        /**
         * Encodes a string to base64 for URL safely with Deferred.
         *
         *
         * @example
         *   var string = '(*>_<*)';
         *   Pot.base64URLEncode.deferred(string).then(function(encoded) {
         *     debug(encoded);
         *     // @results 'KCo-XzwqKQ=='
         *     return Pot.base64URLDecode.deferred(encoded)
         *                               .then(function(decoded) {
         *       debug(decoded);
         *       // @results '(*>_<*)'
         *     });
         *   });
         *
         *
         * @example
         *   var string = 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･';
         *   Pot.base64URLEncode.deferred(string).then(function(encoded) {
         *     return Pot.base64URLDecode.deferred(encoded)
         *                               .then(function(decoded) {
         *       debug(
         *         'string  = ' + string + '\n' +
         *         'encoded = ' + encoded + '\n' +
         *         'decoded = ' + decoded
         *       );
         *       // @results
         *       //   string  = ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･
         *       //   encoded = 776fK--9oToub--9pe--n--9peKUo8Ko
         *       //             77234pSjwqjvvbfimIbvvaXvvp_vvaU=
         *       //   decoded = ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･
         *     });
         *   });
         *
         *
         * @param  {String|Array}  data   A target data.
         * @return {Pot.Deferred}         Returns new instance of
         *                                  Pot.Deferred with a
         *                                  base64 string.
         * @type  Function
         * @function
         * @static
         * @public
         *
         * @property {Function} limp   Run with slowest speed.
         * @property {Function} doze   Run with slower speed.
         * @property {Function} slow   Run with slow speed.
         * @property {Function} normal Run with default speed.
         * @property {Function} fast   Run with fast speed.
         * @property {Function} rapid  Run with faster speed.
         * @property {Function} ninja  Run fastest speed.
         */
        deferred : PotInternal.defineDeferrater(function(speed) {
          return function(data) {
            return new Encoder(data, BASE64URLMAPS).deferred(speed);
          };
        })
      }),
      /**
       * @lends Pot.Base64
       */
      /**
       * Decodes a string from base64 for URL safely.
       *
       *
       * @example
       *   var string = 'KCo-XzwqKQ==';
       *   var result = Pot.base64URLDecode(string);
       *   debug(result);
       *   // @results '(*>_<*)'
       *
       *
       * @example
       *   var string = 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･';
       *   var encoded = Pot.base64URLEncode(string);
       *   var decoded = Pot.base64URLDecode(encoded);
       *   debug(
       *     'string  = ' + string + '\n' +
       *     'encoded = ' + encoded + '\n' +
       *     'decoded = ' + decoded
       *   );
       *   // @results
       *   //   string  = ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･ 
       *   //   encoded = 776fK--9oToub--9pe--n--9peKUo8Ko
       *   //             77234pSjwqjvvbfimIbvvaXvvp_vvaU=
       *   //   decoded = ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･
       *
       *
       * @param  {String}  string   A base64 string.
       * @return {String}           A result string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      urlDecode : update(function(string) {
        return new Decoder(string, BASE64URLMAPS).execute();
      }, {
        /**
         * @lends Pot.Base64.urlDecode
         */
        /**
         * Decodes a string as ArrayBuffer from base64 for URL safely.
         *
         *
         * @example
         *   var b64string = 'SGVsbG8gV29ybGQu';
         *   var buffer = Pot.base64URLDecode.asBuffer(b64string);
         *   Pot.debug(buffer);
         *   // [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46]
         *   Pot.debug(Pot.ArrayBufferoid.bufferToString(buffer));
         *   // 'Hello World.'
         *
         *
         * @example
         *   var base64String = '776fK--9oToub--9pe--n--9peKUo8Ko' +
         *                      '77234pSjwqjvvbfimIbvvaXvvp_vvaU=';
         *   var buffer = Pot.base64URLDecode.asBuffer(base64String);
         *   Pot.debug(buffer);
         *   // [239, 190, 159,  43, 239, 189, 161,  58,  46, 111,
         *   //  239, 189, 165, 239, 190, 159, 239, 189, 165, 226,
         *   //  148, 163, 194, 168, 239, 189, 183, 226, 148, 163,
         *   //  194, 168, 239, 189, 183, 226, 152, 134, 239, 189,
         *   //  165, 239, 190, 159, 239, 189, 165]
         *   Pot.debug(Pot.ArrayBufferoid.bufferToString(buffer));
         *   // 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･'
         *
         *
         * @param  {String}              string   A base64 string.
         * @return {Pot.ArrayBufferoid}           A new instance of
         *                                          Pot.ArrayBufferoid.
         * @type  Function
         * @function
         * @static
         * @public
         */
        asBuffer : function(string) {
          return new Decoder(string, BASE64URLMAPS).executeAsBuffer();
        },
        /**
         * Decodes a string from base64 for URL safely with Deferred.
         *
         *
         * @example
         *   var string = '(*>_<*)';
         *   Pot.base64URLEncode.deferred(string).then(function(encoded) {
         *     debug(encoded);
         *     // @results 'KCo-XzwqKQ=='
         *     return Pot.base64URLDecode.deferred(encoded)
         *                               .then(function(decoded) {
         *       debug(decoded);
         *       // @results '(*>_<*)'
         *     });
         *   });
         *
         *
         * @example
         *   var string = 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･';
         *   Pot.base64URLEncode.deferred(string).then(function(encoded) {
         *     return Pot.base64URLDecode.deferred(encoded)
         *                               .then(function(decoded) {
         *       debug(
         *         'string  = ' + string + '\n' +
         *         'encoded = ' + encoded + '\n' +
         *         'decoded = ' + decoded
         *       );
         *       // @results
         *       //   string  = ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･
         *       //   encoded = 776fK--9oToub--9pe--n--9peKUo8Ko
         *       //             77234pSjwqjvvbfimIbvvaXvvp_vvaU=
         *       //   decoded = ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･
         *     });
         *   });
         *
         *
         * @param  {String}        string   A base64 string.
         * @return {Pot.Deferred}           Returns new instance of
         *                                    Pot.Deferred with a string.
         * @type  Function
         * @function
         * @static
         * @public
         *
         * @property {Function} limp   Run with slowest speed.
         * @property {Function} doze   Run with slower speed.
         * @property {Function} slow   Run with slow speed.
         * @property {Function} normal Run with default speed.
         * @property {Function} fast   Run with fast speed.
         * @property {Function} rapid  Run with faster speed.
         * @property {Function} ninja  Run fastest speed.
         */
        deferred : PotInternal.defineDeferrater(function(speed) {
          return function(string) {
            return new Decoder(string, BASE64URLMAPS).deferred(speed);
          };
        }),
        /**
         * Decodes a string as ArrayBuffer from base64 for
         *   URL safely with Deferred.
         *
         *
         * @example
         *   var b64string = 'SGVsbG8gV29ybGQu';
         *   Pot.base64URLDecode.deferredAsBuffer(b64string)
         *                                    .then(function(buffer) {
         *     Pot.debug(buffer);
         *     // [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46]
         *     Pot.debug(Pot.ArrayBufferoid.bufferToString(buffer));
         *     // 'Hello World.'
         *   });
         *
         *
         * @example
         *   var base64String = '776fK--9oToub--9pe--n--9peKUo8Ko' +
         *                      '77234pSjwqjvvbfimIbvvaXvvp_vvaU=';
         *   Pot.base64URLDecode.deferredAsBuffer(base64String)
         *                      .then(function(res) {
         *     Pot.debug(res);
         *     // [239, 190, 159,  43, 239, 189, 161,  58,  46, 111,
         *     //  239, 189, 165, 239, 190, 159, 239, 189, 165, 226,
         *     //  148, 163, 194, 168, 239, 189, 183, 226, 148, 163,
         *     //  194, 168, 239, 189, 183, 226, 152, 134, 239, 189,
         *     //  165, 239, 190, 159, 239, 189, 165]
         *     Pot.debug(Pot.ArrayBufferoid.bufferToString(res));
         *     // 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･'
         *   });
         *
         *
         * @param  {String}        string   A base64 string.
         * @return {Pot.Deferred}           Returns new instance of
         *                                    Pot.Deferred with a new
         *                                    instance of Pot.ArrayBufferoid.
         * @type  Function
         * @function
         * @static
         * @public
         *
         * @property {Function} limp   Run with slowest speed.
         * @property {Function} doze   Run with slower speed.
         * @property {Function} slow   Run with slow speed.
         * @property {Function} normal Run with default speed.
         * @property {Function} fast   Run with fast speed.
         * @property {Function} rapid  Run with faster speed.
         * @property {Function} ninja  Run fastest speed.
         */
        deferredAsBuffer : PotInternal.defineDeferrater(function(speed) {
          return function(string) {
            return new Decoder(string, BASE64URLMAPS).deferredAsBuffer(speed);
          };
        })
      })
    };
  }())
});

// Update Pot object.
Pot.update({
  base64Encode    : Pot.Base64.encode,
  base64Decode    : Pot.Base64.decode,
  base64URLEncode : Pot.Base64.urlEncode,
  base64URLDecode : Pot.Base64.urlDecode
});

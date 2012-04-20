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
        Encoder = function(string, maps) {
          return new Encoder.prototype.init(string, maps);
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
      string : null,
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
      init : function(string, maps) {
        this.maps = maps;
        this.string = stringify(string, true);
        this.len = this.string.length;
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
        this.string = Pot.UTF8.encode(this.string);
        if (this.string) {
          this.len = this.string.length;
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
        this.string = Pot.UTF8.encode(this.string);
        this.len = this.string.length;
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
          c = this.string.charCodeAt(this.index++);
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
      assign : (function() {
        var reps = [
          [/-/g, '+'],
          [/_/g, '/']
        ];
        return function() {
          var s = this.string;
          if (~this.maps.indexOf('-')) {
            each(reps, function(item) {
              s = s.replace(item[0], item[1]);
            });
            this.string = s;
          }
        };
      }()),
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
      decode : function(c) {
        var code, r = this.results;
        this.att = (this.att << 6) | (c & 63);
        this.pos += 6;
        if (this.pos >= 0) {
          code = this.att >> this.pos & 0xFF;
          if (c !== 64) {
            r[r.length] = fromUnicode(code);
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
       * @param  {String}  string   A target string.
       * @return {String}           A base64 string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      encode : update(function(string) {
        var result = '', s = stringify(string, true);
        if (s) {
          try {
            if (typeof btoa === 'undefined') {
              throw false;
            }
            result = btoa(Pot.UTF8.encode(s));
          } catch (e) {
            try {
              result = (new Encoder(s, BASE64MAPS)).execute();
            } catch (e) {}
          }
        }
        return result;
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
         * @param  {String}        string   A target string.
         * @return {Pot.Deferred}           Returns new instance of
         *                                    Pot.Deferred with a
         *                                    base64 string.
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
            return (new Encoder(string, BASE64MAPS)).deferred(speed);
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
              result = (new Decoder(s, BASE64MAPS)).execute();
            } catch (e) {}
          }
        }
        return result;
      }, {
        /**
         * @lends Pot.Base64.decode
         */
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
            return (new Decoder(string, BASE64MAPS)).deferred(speed);
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
       * @param  {String}  string   A target string.
       * @return {String}           A base64 string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      urlEncode : update(function(string) {
        var result = '', s = stringify(string, true);
        if (s) {
          result = (new Encoder(s, BASE64URLMAPS)).execute();
        }
        return result;
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
         * @param  {String}        string   A target string.
         * @return {Pot.Deferred}           Returns new instance of
         *                                    Pot.Deferred with a
         *                                    base64 string.
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
            return (new Encoder(string, BASE64URLMAPS)).deferred(speed);
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
        var result = '', s = stringify(string, true);
        if (s) {
          result = (new Decoder(s, BASE64URLMAPS)).execute();
        }
        return result;
      }, {
        /**
         * @lends Pot.Base64.urlDecode
         */
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
            return (new Decoder(string, BASE64URLMAPS)).deferred(speed);
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

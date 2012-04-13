//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Archive.
(function(ALPHAMERIC_BASE63MAPS) {

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Archive utilities.
   *
   * @name Pot.Archive
   * @type Object
   * @class
   * @static
   * @public
   */
  Archive : {}
});

update(Pot.Archive, {
  /**
   * @lends Pot.Archive
   */
  /**
   * Compress/Decompress the data using the LZ77 algorithm.
   *
   * cf. @link http://www.ietf.org/rfc/rfc1951.txt
   *
   * via AlphamericHTML
   *
   * @link http://nurucom-archives.hp.infoseek.co.jp/digital/
   *
   * @name  Pot.Archive.AlphamericString
   * @type  Object
   * @class
   * @static
   * @public
   */
  AlphamericString : {
    /**
     * @lends Pot.Archive.AlphamericString
     */
    /**
     * Compress with encode a string to
     *   the base 63 [a-zA-Z0-9_] format string.
     *
     *
     * @example
     *   var string = 'Hello Hello foooooooo baaaaaaaar';
     *   var result = Pot.Archive.AlphamericString.encode(string);
     *   var decode = Pot.Archive.AlphamericString.decode(result);
     *   debug('string = ' + string + ' : length = ' + string.length);
     *   debug('result = ' + result + ' : length = ' + result.length);
     *   debug('decode = ' + decode + ' : length = ' + decode.length);
     *   // @results
     *   //   string = 'Hello Hello foooooooo baaaaaaaar' : length = 32
     *   //   result = 'Y8Z5CCF_v56F__5X0Z21__5I'         : length = 24
     *   //   decode = 'Hello Hello foooooooo baaaaaaaar' : length = 32
     *
     *
     * @example
     *   // Example of compression that is include multibyte string.
     *   var string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー';
     *   var result = Pot.Archive.AlphamericString.encode(string);
     *   var decode = Pot.Archive.AlphamericString.decode(result);
     *   // Note the change of byte size.
     *   var bytesS = utf8ByteOf(string);
     *   var bytesR = utf8ByteOf(result);
     *   var bytesD = utf8ByteOf(decode);
     *   debug('string=' + string + ', length=' + string.length +
     *         ', ' + bytesS + ' bytes');
     *   debug('result=' + result + ', length=' + result.length +
     *         ', ' + bytesR + ' bytes');
     *   debug('decode=' + decode + ', length=' + decode.length +
     *         ', ' + bytesD + ' bytes');
     *   // @results
     *   //   string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー',
     *   //     length = 30,
     *   //     66 bytes
     *   //
     *   //   result = 'Y8Z5CCF_v5cJeJdB1Fa1_v4dBe3hS_y1',
     *   //     length = 32,
     *   //     32 bytes
     *   //
     *   //   decode = 'Hello Hello こんにちは、こんにちは、にゃーにゃー',
     *   //     length = 30,
     *   //     66 bytes
     *   //
     *
     *
     * @param  {String}  string  An input string.
     * @return {String}          A result string.
     * @type  Function
     * @function
     * @static
     * @public
     */
    encode : (function() {
      /**@ignore*/
      var AlphamericStringEncoder = function(string) {
        return new AlphamericStringEncoder.prototype.init(string);
      },
      encodeMaps = ALPHAMERIC_BASE63MAPS.split('');
      AlphamericStringEncoder.prototype =
        update(AlphamericStringEncoder.prototype, {
        /**
         * @private
         * @ignore
         * @internal
         */
        constructor : AlphamericStringEncoder,
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
        dic : null,
        /**
         * @private
         * @ignore
         * @internal
         */
        maps : null,
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
        pos : null,
        /**
         * @private
         * @ignore
         * @internal
         */
        size : null,
        /**
         * @private
         * @ignore
         * @internal
         */
        point : null,
        /**
         * @private
         * @ignore
         * @internal
         */
        last : null,
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
        max : null,
        /**
         * Initialize properties.
         *
         * @private
         * @ignore
         */
        init : function(string) {
          this.index = 0x03F6;
          this.maps = encodeMaps;
          this.string = this.createDic() + stringify(string);
          this.results = [];
          this.point = -1;
          this.max = 0x40;
          return this;
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        execute : function() {
          var buffer, max = this.max;
          while (true) {
            buffer = this.string.substr(this.index, max);
            if (!buffer) {
              break;
            }
            this.searchSlidingWindow(buffer);
            if (this.size === 2 ||
                this.size === 3 && this.last === this.point) {
              this.pushLite();
            } else {
              this.pushStep();
            }
          }
          return this.results.join('');
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        deferred : function(speed) {
          var that = this, max = this.max;
          return Deferred.forEver[speed](function() {
            var buffer = that.string.substr(that.index, max);
            if (!buffer) {
              throw PotStopIteration;
            }
            that.searchSlidingWindow(buffer);
            if (that.size === 2 ||
                that.size === 3 && that.last === that.point) {
              that.pushLite();
            } else {
              that.pushStep();
            }
          }).then(function() {
            return that.results.join('');
          });
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        createDic : function() {
          var dic = ' ';
          for (; this.index < 0x400; this.index++) {
            dic += dic;
          }
          return dic;
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        searchSlidingWindow : function(buffer) {
          var pos, len = buffer.length;
          for (this.size = 2; this.size <= len; this.size++) {
            pos = this.string.substring(
              this.index - 0x333,
              this.index + this.size - 1
            ).lastIndexOf(buffer.substring(0, this.size));
            if (!~pos) {
              break;
            }
            this.pos = pos;
          }
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        pushLite : function() {
          var c, x, r = this.results, m = this.maps;
          this.last = this.point;
          c = this.string.charCodeAt(this.index++);
          if (c < 0x80) {
            x = c;
            c %= 0x20;
            this.point = (x - c) / 0x20 + 0x40;
            if (this.last !== this.point) {
              r[r.length] = m[this.point - 0x20];
            }
            r[r.length] = m[c];
          } else if (0x3000 <= c && c < 0x3100) {
            c -= 0x3000;
            x = c;
            c %= 0x20;
            this.point = (x - c) / 0x20 + 0x44;
            if (this.last !== this.point) {
              r[r.length] = m[this.point - 0x20];
            }
            r[r.length] = m[c];
          } else if (0xFF00 <= c && c < 0xFFA0) {
            c -= 0xFF00;
            x = c;
            c %= 0x20;
            this.point = (x - c) / 0x20 + 0x4C;
            if (this.last !== this.point) {
              r[r.length] = m[this.point - 0x20];
            }
            r[r.length] = m[c];
          } else {
            x = c;
            c %= 0x7C0;
            this.point = (x - c) / 0x7C0;
            if (this.last !== this.point) {
              r[r.length] = m[0x31] + m[this.point];
            }
            x = c;
            c %= 0x3E;
            r[r.length] = m[(x - c) / 0x3E] + m[c];
          }
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        pushStep : function() {
          var x = this.pos, m = this.maps, r = this.results;
          this.pos %= 0x3F;
          r[r.length] = m[(x - this.pos) / 0x3F + 0x32] +
                        m[this.pos] +
                        m[this.size - 3];
          this.index += this.size - 1;
        }
      });
      AlphamericStringEncoder.prototype.init.prototype =
        AlphamericStringEncoder.prototype;
      return update(function(string) {
        return (new AlphamericStringEncoder(string)).execute();
      }, {
        /**
         * @lends Pot.Archive.AlphamericString.encode
         */
        /**
         * Compress with encode a string to
         *   the base 63 [a-zA-Z0-9_] format string with Deferred.
         *
         *
         * @example
         *   var string = 'Hello Hello foooooooo baaaaaaaar';
         *   var encoded, decoded;
         *   // Execute deferred.
         *   Pot.alphamericStringEncode.deferred(string).then(function(res) {
         *     encoded = res;
         *     return Pot.alphamericStringDecode.deferred(encoded);
         *   }).then(function(res) {
         *     decoded = res;
         *     debug('string = ' + string  + ' : length = ' + string.length);
         *     debug('result = ' + encoded + ' : length = ' + encoded.length);
         *     debug('decode = ' + decoded + ' : length = ' + decoded.length);
         *     // @results
         *     //   string = 'Hello Hello foooooooo baaaaaaaar' : length = 32
         *     //   result = 'Y8Z5CCF_v56F__5X0Z21__5I'         : length = 24
         *     //   decode = 'Hello Hello foooooooo baaaaaaaar' : length = 32
         *   });
         *
         *
         * @example
         *   // Example of compression that is include multibyte string.
         *   var string, encoded, decoded;
         *   string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー';
         *   Pot.alphamericStringEncode.deferred(string).then(function(res) {
         *     encoded = res;
         *     Pot.alphamericStringDecode.deferred(res).then(function(res) {
         *       decoded = res;
         *       // Note the change of byte size.
         *       var bytesString  = utf8ByteOf(string);
         *       var bytesEncoded = utf8ByteOf(encoded);
         *       var bytesDecoded = utf8ByteOf(decoded);
         *       debug(
         *         'string=' + string +
         *         ', length=' + string.length +
         *         ', ' + bytesString + ' bytes'
         *       );
         *       debug(
         *         'result=' + encoded +
         *         ', length=' + encoded.length +
         *         ', ' + bytesEncoded + ' bytes'
         *       );
         *       debug(
         *         'decode=' + decoded +
         *         ', length=' + decoded.length +
         *         ', ' + bytesDecoded + ' bytes'
         *       );
         *       // @results
         *       // string='Hello Hello こんにちは、こんにちは、にゃーにゃー',
         *       //   length = 30,
         *       //   66 bytes
         *       //
         *       // result = 'Y8Z5CCF_v5cJeJdB1Fa1_v4dBe3hS_y1',
         *       //   length = 32,
         *       //   32 bytes
         *       //
         *       // decode='Hello Hello こんにちは、こんにちは、にゃーにゃー',
         *       //   length = 30,
         *       //   66 bytes
         *     });
         *   });
         *
         *
         * @param  {String}        string  An input string.
         * @return {Pot.Deferred}          Returns new instance of
         *                                   Pot.Deferred with
         *                                   a result string.
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
            return (new AlphamericStringEncoder(string)).deferred(speed);
          }
        })
      });
    }()),
    /**
     * @lends Pot.Archive.AlphamericString
     */
    /**
     * Decompress with decode a string from
     *   the AlphamericString (base 63 [a-zA-Z0-9_] format string).
     *
     *
     * @example
     *   var string = 'Hello Hello foooooooo baaaaaaaar';
     *   var result = Pot.Archive.AlphamericString.encode(string);
     *   var decode = Pot.Archive.AlphamericString.decode(result);
     *   debug('string = ' + string + ' : length = ' + string.length);
     *   debug('result = ' + result + ' : length = ' + result.length);
     *   debug('decode = ' + decode + ' : length = ' + decode.length);
     *   // @results
     *   //   string = 'Hello Hello foooooooo baaaaaaaar' : length = 32
     *   //   result = 'Y8Z5CCF_v56F__5X0Z21__5I'         : length = 24
     *   //   decode = 'Hello Hello foooooooo baaaaaaaar' : length = 32
     *
     *
     * @example
     *   // Example of compression that is include multibyte string.
     *   var string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー';
     *   var result = Pot.Archive.AlphamericString.encode(string);
     *   var decode = Pot.Archive.AlphamericString.decode(result);
     *   // Note the change of byte size.
     *   var bytesS = utf8ByteOf(string);
     *   var bytesR = utf8ByteOf(result);
     *   var bytesD = utf8ByteOf(decode);
     *   debug('string=' + string + ', length=' + string.length +
     *         ', ' + bytesS + ' bytes');
     *   debug('result=' + result + ', length=' + result.length +
     *         ', ' + bytesR + ' bytes');
     *   debug('decode=' + decode + ', length=' + decode.length +
     *         ', ' + bytesD + ' bytes');
     *   // @results
     *   //   string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー',
     *   //     length = 30,
     *   //     66 bytes
     *   //
     *   //   result = 'Y8Z5CCF_v5cJeJdB1Fa1_v4dBe3hS_y1',
     *   //     length = 32,
     *   //     32 bytes
     *   //
     *   //   decode = 'Hello Hello こんにちは、こんにちは、にゃーにゃー',
     *   //     length = 30,
     *   //     66 bytes
     *   //
     *
     *
     * @param  {String}  a  A input string.
     * @return {String}     A result string.
     * @type  Function
     * @function
     * @static
     * @public
     */
    decode : (function() {
      /**@ignore*/
      var AlphamericStringDecoder = function(string) {
        return new AlphamericStringDecoder.prototype.init(string);
      };
      AlphamericStringDecoder.prototype =
        update(AlphamericStringDecoder.prototype, {
        /**
         * @private
         * @ignore
         * @internal
         */
        constructor : AlphamericStringDecoder,
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
        dics : null,
        /**
         * @private
         * @ignore
         * @internal
         */
        result : null,
        /**
         * @private
         * @ignore
         * @internal
         */
        isCentral : null,
        /**
         * @private
         * @ignore
         * @internal
         */
        code : null,
        /**
         * Initialize properties.
         *
         * @private
         * @ignore
         */
        init : function(string) {
          this.string = stringify(string);
          this.index = 0;
          this.dics = {};
          this.result = (new Array(5)).join(' ');
          this.createDic();
          return this;
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        execute : function() {
          var c;
          while (true) {
            c = this.peek();
            if (c < 0x3F) {
              this.decode(c);
            } else {
              break;
            }
          }
          return this.result.slice(0x400);
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        deferred : function(speed) {
          var that = this;
          return Deferred.forEver[speed](function() {
            var c = that.peek();
            if (c < 0x3F) {
              that.decode(c);
            } else {
              throw PotStopIteration;
            }
          }).then(function() {
            return that.result.slice(0x400);
          });
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        createDic : function() {
          for (; this.index < 0x3F; this.index++) {
            this.dics[ALPHAMERIC_BASE63MAPS.charAt(this.index)] = this.index;
          }
          while ((this.index -= 7)) {
            this.result += this.result;
          }
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        peek : function() {
          return this.dics[this.string.charAt(this.index++)];
        },
        /**
         * @private
         * @ignore
         * @internal
         */
        decode : function(c) {
          var code, pos, size, bounds, buffer;
          if (c < 0x20) {
            code = this.code * 0x20 + c;
            if (!this.isCentral) {
              code = code * 0x3E + this.peek();
            }
            this.result += fromUnicode(code);
          } else if (c < 0x31) {
            if (c < 0x24) {
              this.code = c - 0x20;
            } else if (c < 0x2C) {
              this.code = c + 0x15C;
            } else {
              this.code = c + 0x7CC;
            }
            this.isCentral = true;
          } else if (c < 0x32) {
            this.code = this.peek();
            this.isCentral = false;
          } else {
            buffer = this.result.slice(-0x333);
            pos = (c - 0x32) * 0x3F + this.peek();
            size = pos + this.peek() + 2;
            bounds = buffer.substring(pos, size);
            if (bounds) {
              while (buffer.length < size) {
                buffer += bounds;
              }
            }
            this.result += buffer.substring(pos, size);
          }
        }
      });
      AlphamericStringDecoder.prototype.init.prototype =
        AlphamericStringDecoder.prototype;
      return update(function(string) {
        return (new AlphamericStringDecoder(string)).execute();
      }, {
        /**
         * @lends Pot.Archive.AlphamericString.decode
         */
        /**
         * Decompress with decode a string from
         *   the AlphamericString (base 63 [a-zA-Z0-9_] format string)
         *   with Deferred.
         *
         *
         * @example
         *   var string = 'Hello Hello foooooooo baaaaaaaar';
         *   var encoded, decoded;
         *   // Execute deferred.
         *   Pot.alphamericStringEncode.deferred(string).then(function(res) {
         *     encoded = res;
         *     return Pot.alphamericStringDecode.deferred(encoded);
         *   }).then(function(res) {
         *     decoded = res;
         *     debug('string = ' + string  + ' : length = ' + string.length);
         *     debug('result = ' + encoded + ' : length = ' + encoded.length);
         *     debug('decode = ' + decoded + ' : length = ' + decoded.length);
         *     // @results
         *     //   string = 'Hello Hello foooooooo baaaaaaaar' : length = 32
         *     //   result = 'Y8Z5CCF_v56F__5X0Z21__5I'         : length = 24
         *     //   decode = 'Hello Hello foooooooo baaaaaaaar' : length = 32
         *   });
         *
         *
         * @example
         *   // Example of compression that is include multibyte string.
         *   var string, encoded, decoded;
         *   string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー';
         *   Pot.alphamericStringEncode.deferred(string).then(function(res) {
         *     encoded = res;
         *     Pot.alphamericStringDecode.deferred(res).then(function(res) {
         *       decoded = res;
         *       // Note the change of byte size.
         *       var bytesString  = utf8ByteOf(string);
         *       var bytesEncoded = utf8ByteOf(encoded);
         *       var bytesDecoded = utf8ByteOf(decoded);
         *       debug(
         *         'string=' + string +
         *         ', length=' + string.length +
         *         ', ' + bytesString + ' bytes'
         *       );
         *       debug(
         *         'result=' + encoded +
         *         ', length=' + encoded.length +
         *         ', ' + bytesEncoded + ' bytes'
         *       );
         *       debug(
         *         'decode=' + decoded +
         *         ', length=' + decoded.length +
         *         ', ' + bytesDecoded + ' bytes'
         *       );
         *       // @results
         *       // string='Hello Hello こんにちは、こんにちは、にゃーにゃー',
         *       //   length = 30,
         *       //   66 bytes
         *       //
         *       // result = 'Y8Z5CCF_v5cJeJdB1Fa1_v4dBe3hS_y1',
         *       //   length = 32,
         *       //   32 bytes
         *       //
         *       // decode='Hello Hello こんにちは、こんにちは、にゃーにゃー',
         *       //   length = 30,
         *       //   66 bytes
         *     });
         *   });
         *
         *
         * @param  {String}        string  An input string.
         * @return {Pot.Deferred}          Returns new instance of
         *                                   Pot.Deferred with
         *                                   a result string.
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
            return (new AlphamericStringDecoder(string)).deferred(speed);
          }
        })
      });
    }())
  }
});

// Update Pot object.
Pot.update({
  alphamericStringEncode : Pot.Archive.AlphamericString.encode,
  alphamericStringDecode : Pot.Archive.AlphamericString.decode
});

}(DIGITS + UPPER_ALPHAS + LOWER_ALPHAS + '_'));

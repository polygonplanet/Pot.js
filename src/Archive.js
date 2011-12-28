//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Archive.
(function(ALPHAMERIC_BASE63TBL) {

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
     * @param  {String}  s  An input string.
     * @return {String}     A result string.
     * @type  Function
     * @function
     * @static
     * @public
     */
    encode : function(s) {
      var r = [], c, i = 1014, j, K, k, L, l = -1, p, t = ' ', A, n, x;
      A = ALPHAMERIC_BASE63TBL.split('');
      for (; i < 1024; i++) {
        t += t;
      }
      t += stringify(s);
      while ((p = t.substr(i, 64))) {
        n = p.length;
        for (j = 2; j <= n; j++) {
          k = t.substring(i - 819, i + j - 1).lastIndexOf(p.substring(0, j));
          if (!~k) {
            break;
          }
          K = k;
        }
        if (j === 2 || j === 3 && L === l) {
          L = l;
          c = t.charCodeAt(i++);
          if (c < 128) {
            x = c;
            c %= 32;
            l = (x - c) / 32 + 64;
            if (L !== l) {
              r[r.length] = A[l - 32];
            }
            r[r.length] = A[c];
          } else if (12288 <= c && c < 12544) {
            c -= 12288;
            x = c;
            c %= 32;
            l = (x - c) / 32 + 68;
            if (L !== l) {
              r[r.length] = A[l - 32];
            }
            r[r.length] = A[c];
          } else if (65280 <= c && c < 65440) {
            c -= 65280;
            x = c;
            c %= 32;
            l = (x - c) / 32 + 76
            if (L !== l) {
              r[r.length] = A[l - 32];
            }
            r[r.length] = A[c];
          } else {
            x = c;
            c %= 1984;
            l = (x - c) / 1984;
            if (L !== l) {
              r[r.length] = A[49] + A[l];
            }
            x = c;
            c %= 62;
            r[r.length] = A[(x - c) / 62] + A[c];
          }
        } else {
          x = K;
          K %= 63;
          r[r.length] = A[(x - K) / 63 + 50] + A[K] + A[j - 3];
          i += j - 1;
        }
      }
      return r.join('');
    },
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
    decode : function(a) {
      var C = {}, c, i = 0, j, k, l, m, p, s, w, t, sc;
      sc = String.fromCharCode;
      s = '    ';
      t = stringify(a);
      for (; i < 63; i++) {
        C[ALPHAMERIC_BASE63TBL.charAt(i)] = i;
      }
      while ((i -= 7)) {
        s += s;
      }
      while (true) {
        c = C[t.charAt(i++)];
        if (c < 63) {
          if (c < 32) {
            s += sc(
              m ? l * 32 + c :
                 (l * 32 + c) * 62 + C[t.charAt(i++)]
            );
          } else if (c < 49) {
            l = (c < 36) ? c - 32  :
                (c < 44) ? c + 348 : c + 1996;
            m = true;
          } else if (c < 50) {
            l = C[t.charAt(i++)];
            m = false;
          } else {
            w = s.slice(-819);
            k = (c - 50) * 63 + C[t.charAt(i++)];
            j = k + C[t.charAt(i++)] + 2;
            p = w.substring(k, j);
            if (p) {
              while (w.length < j) {
                w += p;
              }
            }
            s += w.substring(k, j);
          }
        } else {
          break;
        }
      }
      return s.slice(1024);
    }
  }
});

// Update Pot object.
Pot.update({
  alphamericStringEncode : Pot.Archive.AlphamericString.encode,
  alphamericStringDecode : Pot.Archive.AlphamericString.decode
});

})(DIGITS + UPPER_ALPHAS + LOWER_ALPHAS + '_');

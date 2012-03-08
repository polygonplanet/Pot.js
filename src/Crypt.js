//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Crypt.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Crypt and Hash utilities.
   *
   * @name Pot.Crypt
   * @type Object
   * @class
   * @static
   * @public
   */
  Crypt : {}
});

update(Pot.Crypt, {
  /**
   * @lends Pot.Crypt
   */
  /**
   * String hash function similar to java.lang.String.hashCode().
   *   The hash code for a string is computed as
   *   s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
   *   where s[i] is the ith character of the string and n is the length of
   *   the string.
   * We mod the result to make it between 0 (inclusive) and 2^32 (exclusive).
   *
   *
   * @param  {String|*}  string   A string.
   * @return {Number}             Hash value for `string`,
   *                                between 0 (inclusive)
   *                                 and 2^32 (exclusive).
   *                              The empty string returns 0.
   * @based goog.string.hashCode
   * @type Function
   * @function
   * @public
   * @static
   */
  hashCode : function(string) {
    var result = 0, s, i, len, max = 0x100000000; // 2^32
    if (string == null) {
      s = String(string);
    } else {
      s = string.toString ? string.toString() : String(string);
    }
    len = s.length;
    for (i = 0; i < len; ++i) {
      result = 31 * result + s.charCodeAt(i);
      result %= max;
    }
    return result;
  }/*{#if Pot}*/,
  /**
   * Calculate the MD5 hash of a string.
   *
   * RFC 1321 - The MD5 Message-Digest Algorithm
   * @link http://www.faqs.org/rfcs/rfc1321
   *
   *
   * @example
   *   debug(md5('apple'));
   *   // @results '1f3870be274f6c49b3e31a0c6728957f'
   *
   *
   * @param  {String}  string  The target string.
   * @return {String}          The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  md5 : (function() {
    /**@ignore*/
    function rl(v, sb) {
      return (v << sb) | (v >>> (32 - sb));
    }
    /**@ignore*/
    function au(x, y) {
      var x4, y4, x8, y8, rv;
      x8 = (x & 0x80000000);
      y8 = (y & 0x80000000);
      x4 = (x & 0x40000000);
      y4 = (y & 0x40000000);
      rv = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
      if (x4 & y4) {
        return (rv ^ 0x80000000 ^ x8 ^ y8);
      }
      if (x4 | y4) {
        if (rv & 0x40000000) {
          return (rv ^ 0xC0000000 ^ x8 ^ y8);
        } else {
          return (rv ^ 0x40000000 ^ x8 ^ y8);
        }
      } else {
        return (rv ^ x8 ^ y8);
      }
    }
    /**@ignore*/
    function f5(x, y, z) { return (x & y) | ((~x) & z); }
    /**@ignore*/
    function g5(x, y, z) { return (x & z) | (y & (~z)); }
    /**@ignore*/
    function i5(x, y, z) { return (y ^ (x | (~z))); }
    /**@ignore*/
    function h5(x, y, z) { return (x ^ y ^ z); }
    /**@ignore*/
    function ff5(a, b, c, d, x, s, ac) {
      a = au(a, au(au(f5(b, c, d), x), ac));
      return au(rl(a, s), b);
    }
    /**@ignore*/
    function gg5(a, b, c, d, x, s, ac) {
      a = au(a, au(au(g5(b, c, d), x), ac));
      return au(rl(a, s), b);
    }
    /**@ignore*/
    function hh5(a, b, c, d, x, s, ac) {
      a = au(a, au(au(h5(b, c, d), x), ac));
      return au(rl(a, s), b);
    }
    /**@ignore*/
    function ii5(a, b, c, d, x, s, ac) {
      a = au(a, au(au(i5(b, c, d), x), ac));
      return au(rl(a, s), b);
    }
    /**@ignore*/
    function convertToWordArray(s) {
      var wc, ml = s.length, t1 = ml + 8,
          t2 = (t1 - (t1 % 64)) / 64,
          nw = (t2 + 1) * 16,
          wa = new Array(nw - 1),
          bp = 0, bc = 0;
      while (bc < ml) {
        wc = (bc - (bc % 4)) / 4;
        bp = (bc % 4) * 8;
        wa[wc] = (wa[wc] | (s.charCodeAt(bc) << bp));
        bc++;
      }
      wc = (bc - (bc % 4)) / 4;
      bp = (bc % 4) * 8;
      wa[wc] = wa[wc] | (0x80 << bp);
      wa[nw - 2] = ml << 3;
      wa[nw - 1] = ml >>> 29;
      return wa;
    }
    /**@ignore*/
    function wordToHex(v) {
      var whv = '', whvt = '', bt, c;
      for (c = 0; c <= 3; c++) {
        bt = (v >>> (c * 8)) & 255;
        whvt = '0' + bt.toString(16);
        whv = whv + whvt.substr(whvt.length - 2, 2);
      }
      return whv;
    }
    /**@ignore*/
    function hex(a, b, c, d) {
      return [
        wordToHex(a), wordToHex(b), wordToHex(c), wordToHex(d)
      ].join('').toLowerCase();
    }
    /**@ignore*/
    function calc(s) {
      var
      S11 = 7,
      S12 = 12, S13 = 17, S14 = 22, S21 = 5,  S22 = 9,
      S23 = 14, S24 = 20, S31 = 4,  S32 = 11, S33 = 16,
      S34 = 23, S41 = 6,  S42 = 10, S43 = 15, S44 = 21,
      x = convertToWordArray(Pot.UTF8.encode(stringify(s, true))),
      xl = x.length,
      a = 0x67452301,
      b = 0xEFCDAB89,
      c = 0x98BADCFE,
      d = 0x10325476,
      AA, BB, CC, DD,
      /**@ignore*/
      calculate = function() {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = ff5(a, b, c, d, x[k +  0], S11, 0xD76AA478);
        d = ff5(d, a, b, c, x[k +  1], S12, 0xE8C7B756);
        c = ff5(c, d, a, b, x[k +  2], S13, 0x242070DB);
        b = ff5(b, c, d, a, x[k +  3], S14, 0xC1BDCEEE);
        a = ff5(a, b, c, d, x[k +  4], S11, 0xF57C0FAF);
        d = ff5(d, a, b, c, x[k +  5], S12, 0x4787C62A);
        c = ff5(c, d, a, b, x[k +  6], S13, 0xA8304613);
        b = ff5(b, c, d, a, x[k +  7], S14, 0xFD469501);
        a = ff5(a, b, c, d, x[k +  8], S11, 0x698098D8);
        d = ff5(d, a, b, c, x[k +  9], S12, 0x8B44F7AF);
        c = ff5(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = ff5(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = ff5(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = ff5(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = ff5(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = ff5(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = gg5(a, b, c, d, x[k +  1], S21, 0xF61E2562);
        d = gg5(d, a, b, c, x[k +  6], S22, 0xC040B340);
        c = gg5(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = gg5(b, c, d, a, x[k +  0], S24, 0xE9B6C7AA);
        a = gg5(a, b, c, d, x[k +  5], S21, 0xD62F105D);
        d = gg5(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = gg5(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = gg5(b, c, d, a, x[k +  4], S24, 0xE7D3FBC8);
        a = gg5(a, b, c, d, x[k +  9], S21, 0x21E1CDE6);
        d = gg5(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = gg5(c, d, a, b, x[k +  3], S23, 0xF4D50D87);
        b = gg5(b, c, d, a, x[k +  8], S24, 0x455A14ED);
        a = gg5(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = gg5(d, a, b, c, x[k +  2], S22, 0xFCEFA3F8);
        c = gg5(c, d, a, b, x[k +  7], S23, 0x676F02D9);
        b = gg5(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = hh5(a, b, c, d, x[k +  5], S31, 0xFFFA3942);
        d = hh5(d, a, b, c, x[k +  8], S32, 0x8771F681);
        c = hh5(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = hh5(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = hh5(a, b, c, d, x[k +  1], S31, 0xA4BEEA44);
        d = hh5(d, a, b, c, x[k +  4], S32, 0x4BDECFA9);
        c = hh5(c, d, a, b, x[k +  7], S33, 0xF6BB4B60);
        b = hh5(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = hh5(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = hh5(d, a, b, c, x[k +  0], S32, 0xEAA127FA);
        c = hh5(c, d, a, b, x[k +  3], S33, 0xD4EF3085);
        b = hh5(b, c, d, a, x[k +  6], S34, 0x4881D05);
        a = hh5(a, b, c, d, x[k +  9], S31, 0xD9D4D039);
        d = hh5(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = hh5(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = hh5(b, c, d, a, x[k +  2], S34, 0xC4AC5665);
        a = ii5(a, b, c, d, x[k +  0], S41, 0xF4292244);
        d = ii5(d, a, b, c, x[k +  7], S42, 0x432AFF97);
        c = ii5(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = ii5(b, c, d, a, x[k +  5], S44, 0xFC93A039);
        a = ii5(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = ii5(d, a, b, c, x[k +  3], S42, 0x8F0CCC92);
        c = ii5(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = ii5(b, c, d, a, x[k +  1], S44, 0x85845DD1);
        a = ii5(a, b, c, d, x[k +  8], S41, 0x6FA87E4F);
        d = ii5(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = ii5(c, d, a, b, x[k +  6], S43, 0xA3014314);
        b = ii5(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = ii5(a, b, c, d, x[k +  4], S41, 0xF7537E82);
        d = ii5(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = ii5(c, d, a, b, x[k +  2], S43, 0x2AD7D2BB);
        b = ii5(b, c, d, a, x[k +  9], S44, 0xEB86D391);
        a = au(a, AA);
        b = au(b, BB);
        c = au(c, CC);
        d = au(d, DD);
      };
      return {
        /**@ignore*/
        sync : function() {
          for (k = 0; k < xl; k += 16) {
            calculate();
          }
          return hex(a, b, c, d);
        },
        /**@ignore*/
        async : function(speed) {
          k = 0;
          return Pot.Deferred.forEver[speed](function() {
            if (k < xl) {
              calculate();
            } else {
              throw Pot.StopIteration;
            }
            k += 16;
          }).then(function() {
            return hex(a, b, c, d);
          });
        }
      };
    }
    /**@ignore*/
    return update(function(string) {
      return calc(string).sync();
    }, {
      /**
       * @lends Pot.Crypt.md5
       */
      /**
       * Calculate the MD5 hash of a string with Deferred.
       *
       * RFC 1321 - The MD5 Message-Digest Algorithm
       * @link http://www.faqs.org/rfcs/rfc1321
       *
       *
       * @example
       *   md5.deferred('apple').then(function(res) {
       *     debug(res);
       *     // @results '1f3870be274f6c49b3e31a0c6728957f'
       *   });
       *
       *
       * @param  {String}        string  The target string.
       * @return {Pot.Deferred}          Return new instance of Pot.Deferred
       *                                   with a result string.
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
      deferred : Pot.Internal.defineDeferrater(function(speed) {
        return function(string) {
          return calc(string).async(speed);
        }
      })
    });
  }()),
  /**
   * @lends Pot.Crypt
   */
  /**
   * Calculate the 32-bit CRC (cyclic redundancy checksum) checksum.
   *
   *
   * @example
   *   debug(crc32('abc123'));
   *   // @results  -821904548
   *
   *
   * @param  {String}  string   Data.
   * @return {Number}           CRC checksum.
   * @type  Function
   * @function
   * @static
   * @public
   */
  crc32 : (function() {
    var CRC32MAPS = [
      0x00000000,0x77073096,0xEE0E612C,0x990951BA,0x076DC419,0x706AF48F,
      0xE963A535,0x9E6495A3,0x0EDB8832,0x79DCB8A4,0xE0D5E91E,0x97D2D988,
      0x09B64C2B,0x7EB17CBD,0xE7B82D07,0x90BF1D91,0x1DB71064,0x6AB020F2,
      0xF3B97148,0x84BE41DE,0x1ADAD47D,0x6DDDE4EB,0xF4D4B551,0x83D385C7,
      0x136C9856,0x646BA8C0,0xFD62F97A,0x8A65C9EC,0x14015C4F,0x63066CD9,
      0xFA0F3D63,0x8D080DF5,0x3B6E20C8,0x4C69105E,0xD56041E4,0xA2677172,
      0x3C03E4D1,0x4B04D447,0xD20D85FD,0xA50AB56B,0x35B5A8FA,0x42B2986C,
      0xDBBBC9D6,0xACBCF940,0x32D86CE3,0x45DF5C75,0xDCD60DCF,0xABD13D59,
      0x26D930AC,0x51DE003A,0xC8D75180,0xBFD06116,0x21B4F4B5,0x56B3C423,
      0xCFBA9599,0xB8BDA50F,0x2802B89E,0x5F058808,0xC60CD9B2,0xB10BE924,
      0x2F6F7C87,0x58684C11,0xC1611DAB,0xB6662D3D,0x76DC4190,0x01DB7106,
      0x98D220BC,0xEFD5102A,0x71B18589,0x06B6B51F,0x9FBFE4A5,0xE8B8D433,
      0x7807C9A2,0x0F00F934,0x9609A88E,0xE10E9818,0x7F6A0DBB,0x086D3D2D,
      0x91646C97,0xE6635C01,0x6B6B51F4,0x1C6C6162,0x856530D8,0xF262004E,
      0x6C0695ED,0x1B01A57B,0x8208F4C1,0xF50FC457,0x65B0D9C6,0x12B7E950,
      0x8BBEB8EA,0xFCB9887C,0x62DD1DDF,0x15DA2D49,0x8CD37CF3,0xFBD44C65,
      0x4DB26158,0x3AB551CE,0xA3BC0074,0xD4BB30E2,0x4ADFA541,0x3DD895D7,
      0xA4D1C46D,0xD3D6F4FB,0x4369E96A,0x346ED9FC,0xAD678846,0xDA60B8D0,
      0x44042D73,0x33031DE5,0xAA0A4C5F,0xDD0D7CC9,0x5005713C,0x270241AA,
      0xBE0B1010,0xC90C2086,0x5768B525,0x206F85B3,0xB966D409,0xCE61E49F,
      0x5EDEF90E,0x29D9C998,0xB0D09822,0xC7D7A8B4,0x59B33D17,0x2EB40D81,
      0xB7BD5C3B,0xC0BA6CAD,0xEDB88320,0x9ABFB3B6,0x03B6E20C,0x74B1D29A,
      0xEAD54739,0x9DD277AF,0x04DB2615,0x73DC1683,0xE3630B12,0x94643B84,
      0x0D6D6A3E,0x7A6A5AA8,0xE40ECF0B,0x9309FF9D,0x0A00AE27,0x7D079EB1,
      0xF00F9344,0x8708A3D2,0x1E01F268,0x6906C2FE,0xF762575D,0x806567CB,
      0x196C3671,0x6E6B06E7,0xFED41B76,0x89D32BE0,0x10DA7A5A,0x67DD4ACC,
      0xF9B9DF6F,0x8EBEEFF9,0x17B7BE43,0x60B08ED5,0xD6D6A3E8,0xA1D1937E,
      0x38D8C2C4,0x4FDFF252,0xD1BB67F1,0xA6BC5767,0x3FB506DD,0x48B2364B,
      0xD80D2BDA,0xAF0A1B4C,0x36034AF6,0x41047A60,0xDF60EFC3,0xA867DF55,
      0x316E8EEF,0x4669BE79,0xCB61B38C,0xBC66831A,0x256FD2A0,0x5268E236,
      0xCC0C7795,0xBB0B4703,0x220216B9,0x5505262F,0xC5BA3BBE,0xB2BD0B28,
      0x2BB45A92,0x5CB36A04,0xC2D7FFA7,0xB5D0CF31,0x2CD99E8B,0x5BDEAE1D,
      0x9B64C2B0,0xEC63F226,0x756AA39C,0x026D930A,0x9C0906A9,0xEB0E363F,
      0x72076785,0x05005713,0x95BF4A82,0xE2B87A14,0x7BB12BAE,0x0CB61B38,
      0x92D28E9B,0xE5D5BE0D,0x7CDCEFB7,0x0BDBDF21,0x86D3D2D4,0xF1D4E242,
      0x68DDB3F8,0x1FDA836E,0x81BE16CD,0xF6B9265B,0x6FB077E1,0x18B74777,
      0x88085AE6,0xFF0F6A70,0x66063BCA,0x11010B5C,0x8F659EFF,0xF862AE69,
      0x616BFFD3,0x166CCF45,0xA00AE278,0xD70DD2EE,0x4E048354,0x3903B3C2,
      0xA7672661,0xD06016F7,0x4969474D,0x3E6E77DB,0xAED16A4A,0xD9D65ADC,
      0x40DF0B66,0x37D83BF0,0xA9BCAE53,0xDEBB9EC5,0x47B2CF7F,0x30B5FFE9,
      0xBDBDF21C,0xCABAC28A,0x53B39330,0x24B4A3A6,0xBAD03605,0xCDD70693,
      0x54DE5729,0x23D967BF,0xB3667A2E,0xC4614AB8,0x5D681B02,0x2A6F2B94,
      0xB40BBE37,0xC30C8EA1,0x5A05DF1B,0x2D02EF8D
    ];
    /**@ignore*/
    return function(string) {
      var s, crc = 0, i, n, len;
      s = Pot.UTF8.encode(stringify(string, true));
      len = s.length;
      crc = crc ^ -1;
      for (i = 0; i < len; i++) {
        n = (crc ^ s.charCodeAt(i)) & 0xFF;
        crc = (crc >>> 8) ^ CRC32MAPS[n];
      }
      return crc ^ -1;
    };
  }()),
  /**
   * @lends Pot.Crypt
   */
  /**
   * Calculate the SHA1 hash of a string.
   *
   * RFC 3174 - US Secure Hash Algorithm 1 (SHA1)
   * @link http://www.faqs.org/rfcs/rfc3174
   *
   *
   * @example
   *   debug(sha1('apple'));
   *   // @results 'd0be2dc421be4fcd0172e5afceea3970e2f3d940'
   *
   *
   * @param  {String}  string  The input string.
   * @return {String}          Returns the sha1 hash as a string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  sha1 : (function() {
    /**@ignore*/
    function rl(n, s) {
      var t4 = (n << s) | (n >>> (32 - s));
      return t4;
    }
    /**@ignore*/
    function hex(val) {
      var s = '', i, v;
      for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0F;
        s += v.toString(16);
      }
      return s;
    }
    /**@ignore*/
    function hexLower(a, b, c, d, e) {
      return (hex(a) + hex(b) + hex(c) + hex(d) + hex(e)).toLowerCase();
    }
    /**@ignore*/
    function calc(string) {
      var
      bs, i, j,
      A, B, C, D, E, W = new Array(80),
      H0 = 0x67452301,
      H1 = 0xEFCDAB89,
      H2 = 0x98BADCFE,
      H3 = 0x10325476,
      H4 = 0xC3D2E1F0,
      wa = [],
      wal,
      s = Pot.UTF8.encode(stringify(string, true)),
      sl = s.length,
      tp,
      calculate = function() {
        for (i = 0; i < 16; i++) {
          W[i] = wa[bs + i];
        }
        for (i = 16; i <= 79; i++) {
          W[i] = rl(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        }
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
          tp = (rl(A, 5) + ((B & C) |
                  (~B & D)) + E + W[i] + 0x5A827999) & 0x0FFFFFFFF;
          E = D;
          D = C;
          C = rl(B, 30);
          B = A;
          A = tp;
        }
        for (i = 20; i <= 39; i++) {
          tp = (rl(A, 5) + (B ^ C ^ D) +
                  E + W[i] + 0x6ED9EBA1) & 0x0FFFFFFFF;
          E = D;
          D = C;
          C = rl(B, 30);
          B = A;
          A = tp;
        }
        for (i = 40; i <= 59; i++) {
          tp = (rl(A, 5) + ((B & C) |
                  (B & D) | (C & D)) +
                  E + W[i] + 0x8F1BBCDC) & 0x0FFFFFFFF;
          E = D;
          D = C;
          C = rl(B, 30);
          B = A;
          A = tp;
        }
        for (i = 60; i <= 79; i++) {
          tp = (rl(A, 5) + (B ^ C ^ D) +
                  E + W[i] + 0xCA62C1D6) & 0x0FFFFFFFF;
          E = D;
          D = C;
          C = rl(B, 30);
          B = A;
          A = tp;
        }
        H0 = (H0 + A) & 0x0FFFFFFFF;
        H1 = (H1 + B) & 0x0FFFFFFFF;
        H2 = (H2 + C) & 0x0FFFFFFFF;
        H3 = (H3 + D) & 0x0FFFFFFFF;
        H4 = (H4 + E) & 0x0FFFFFFFF;
      };
      for (i = 0; i < sl - 3; i += 4) {
        j = s.charCodeAt(i)     << 24 |
            s.charCodeAt(i + 1) << 16 |
            s.charCodeAt(i + 2) <<  8 |
            s.charCodeAt(i + 3);
        wa[wa.length] = j;
      }
      switch (sl % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = s.charCodeAt(sl - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = s.charCodeAt(sl - 2) << 24 |
                s.charCodeAt(sl - 1) << 16 | 0x08000;
            break;
        case 3:
            i = s.charCodeAt(sl - 3) << 24 |
                s.charCodeAt(sl - 2) << 16 |
                s.charCodeAt(sl - 1) <<  8 | 0x80;
            break;
      }
      wa[wa.length] = i;
      while ((wa.length % 16) != 14) {
        wa[wa.length] = 0;
      }
      wa[wa.length] = (sl >>> 29);
      wa[wa.length] = ((sl << 3) & 0x0FFFFFFFF);
      wal = wa.length;
      return {
        /**@ignore*/
        sync : function() {
          for (bs = 0; bs < wal; bs += 16) {
            calculate();
          }
          return hexLower(H0, H1, H2, H3, H4);
        },
        /**@ignore*/
        async : function(speed) {
          bs = 0;
          return Pot.Deferred.forEver[speed](function() {
            if (bs < wal) {
              calculate();
            } else {
              throw Pot.StopIteration;
            }
            bs += 16;
          }).then(function() {
            return hexLower(H0, H1, H2, H3, H4);
          });
        }
      };
    }
    /**@ignore*/
    return update(function(string) {
      return calc(string).sync();
    }, {
      /**
       * @lends Pot.Crypt.sha1
       */
      /**
       * Calculate the SHA1 hash of a string with Deferred.
       *
       * RFC 3174 - US Secure Hash Algorithm 1 (SHA1)
       * @link http://www.faqs.org/rfcs/rfc3174
       *
       *
       * @example
       *   sha1.deferred('apple').then(function(res) {
       *     debug(res);
       *     // @results 'd0be2dc421be4fcd0172e5afceea3970e2f3d940'
       *   });
       *
       *
       * @param  {String}        string  The input string.
       * @return {Pot.Deferred}          Returns new instance of Pot.Deferred
       *                                   with the sha1 hash as a string.
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
      deferred : Pot.Internal.defineDeferrater(function(speed) {
        return function(string) {
          return calc(string).async(speed);
        }
      })
    });
  }()),
  /**
   * @lends Pot.Crypt
   */
  /**
   * ARC4 symmetric cipher encryption/decryption.
   *
   * Original algorithm:
   * {@link http://www.mozilla.org/projects/security/pki/nss/
   *         draft-kaukonen-cipher-arcfour-03.txt}
   *
   *
   * @example
   *   // usage:
   *   var arc4 = new Pot.Crypt.Arc4();
   *   arc4.setKey('hoge');
   *   var cipherText = arc4.encrypt('Hello World!');
   *   debug('cipherText = ' + cipherText);
   *   var origText = arc4.decrypt(cipherText);
   *   debug('origText = ' + origText);
   *
   *
   * @param  {String}  (key)  Secret key for encryption.
   * @return {Object}         The instance of Arc4 object.
   *
   * @name Pot.Crypt.Arc4
   * @type Function
   * @constructor
   * @function
   * @public
   */
  Arc4 : (function() {
    /**
     * Emit ciphertext.
     *
     * @internal
     * @ignore
     */
    function arc4Crypt(text, key, table) {
      var r = [], a, i, j, x, y, t, k, n;
      a = arrayize(table);
      j = 0;
      t = stringify(text, true);
      k = stringify(key, true);
      n = k.length;
      for (i = 0; i < 256; i++) {
        j = (j + a[i] + k.charCodeAt(i % n)) % 256;
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      i = j = 0;
      n = t.length;
      for (y = 0; y < n; y++) {
        i = (i + 1) % 256;
        j = (j + a[i]) % 256;
        x = a[i];
        a[i] = a[j];
        a[j] = x;
        r[r.length] = fromUnicode(t.charCodeAt(y) ^ a[(a[i] + a[j]) % 256]);
      }
      return r.join('');
    }
    /**
     * Arc4 constructor.
     *
     * @param  {String}  (key)  Secret key for encryption.
     * @return {Object}         The instance of Arc4 object.
     * @ignore
     */
    function arc4(key) {
      return new arc4.prototype.init(key);
    }
    arc4.prototype = update(arc4.prototype, {
      /**
       * @lends Pot.Crypt.Arc4
       */
      /**
       * @internal
       * @ignore
       */
      constructor : arc4,
      /**
       * @private
       * @ignore
       */
      table : [],
      /**
       * @private
       * @ignore
       */
      key : null,
      /**
       * Initialize.
       *
       * @param  {String}  key  Secret key for encryption.
       * @return {Object}       The instance of Arc4 object.
       * @ignore
       */
      init : function(key) {
        if (key != null) {
          this.setKey(key);
        }
        this.initTable();
        return this;
      },
      /**
       * @internal
       * @private
       * @ignore
       */
      initTable : function() {
        var i;
        this.table = [];
        for (i = 0; i < 256; i++) {
          this.table[i] = i;
        }
      },
      /**
       * Set the secret key string for encryption.
       *
       * @param  {String}  key  Secret key for encryption.
       * @return {Object}       The instance of Arc4 object.
       * @public
       */
      setKey : function(key) {
        this.key = Pot.UTF8.encode(key);
        return this;
      },
      /**
       * Encrypt given plain text using the key with RC4 algorithm.
       * All parameters and return value are in binary format.
       *
       * @param  {String}  text  Plain text to be encrypted.
       * @return {String}        The encrypted string.
       * @public
       */
      encrypt : function(text) {
        return arc4Crypt(Pot.UTF8.encode(text), this.key, this.table);
      },
      /**
       * Decrypt given cipher text using the key with RC4 algorithm.
       * All parameters and return value are in binary format.
       *
       * @param  {String}  text  Cipher text to be decrypted.
       * @return {String}        The decrypted string.
       * @public
       */
      decrypt : function(text) {
        return Pot.UTF8.decode(arc4Crypt(text, this.key, this.table));
      }
    });
    arc4.prototype.init.prototype = arc4.prototype;
    return arc4;
  }())/*{#endif}*/
});

// Update methods for reference.
Pot.update({
  hashCode : Pot.Crypt.hashCode/*{#if Pot}*/,
  md5      : Pot.Crypt.md5,
  crc32    : Pot.Crypt.crc32,
  sha1     : Pot.Crypt.sha1,
  Arc4     : Pot.Crypt.Arc4/*{#endif}*/
});

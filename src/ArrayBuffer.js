//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Pot.ArrayBufferoid (ArrayBuffer).
(function() {
var ArrayBufferoidTypes;

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Pot.ArrayBufferoid is object like TypedArray that
   *  has DataView and Array prototype methods.
   * That is able to cast to the each TypedArray.
   * If environment not supported TypedArray, it will use native Array.
   * Pot.ArrayBufferoid can coding that
   *  is compatible with other environments.
   *
   *
   * @example
   *   var buffer = new Pot.ArrayBufferoid();
   *   var i = 0;
   *   buffer[i++] = 255;
   *   buffer[i++] = 254;
   *   buffer.push(253);
   *   buffer.push(252);
   *   // like DataView.
   *   Pot.debug(buffer.getUint16(0, true)); // 65279
   *   // length.
   *   Pot.debug('buffer.length = ' + buffer.size()); // 4
   *   // convert to typed array.
   *   var arrayBuffer = buffer.toArrayBuffer();
   *   var uint8Array = buffer.toUint8Array();
   *   // stream.
   *   buffer.seek(0);
   *   var data1 = buffer.read(1);
   *   Pot.debug(data1[0]); // 255
   *   Pot.debug(buffer.tell()); // 1
   *   var data2 = buffer.read(2);
   *   Pot.debug(data2); // [254, 253]
   *   buffer.seek(0);
   *   buffer.write([100, 101]);
   *   Pot.debug(buffer); // [100, 101, 253, 252]
   *
   *
   * @example
   *   var buffer = new Pot.ArrayBufferoid([1, 2, 3, 4]);
   *   var uint8Array = buffer.map(function(val) {
   *     return val + 100;
   *   }).toUint8Array();
   *   Pot.debug(uint8Array[0]); // 101
   *
   *
   * @param  {Array|TypedArray|Pot.ArrayBufferoid|Number|*} args parameters.
   * @return {Pot.ArrayBufferoid} A new instance of Pot.ArrayBufferoid.
   *
   * @name  Pot.ArrayBufferoid
   * @class
   * @constructor
   * @public
   */
  ArrayBufferoid : update(function() {
    return isArrayBufferoid(this) ? this.init(arguments)
                                  : new ArrayBufferoid.fn.init(arguments);
  }, {
    /**
     * @lends Pot.ArrayBufferoid
     */
    /**
     * @type Object
     * @const
     */
    types : {}
  })
});

// Refer the Pot properties/functions.
ArrayBufferoid      = Pot.ArrayBufferoid;
ArrayBufferoidTypes = ArrayBufferoid.types;

each({
  /**
   * @lends Pot.ArrayBufferoid.types
   */
  /**
   * @type Number
   */
  ArrayBuffer       : 1,
  Int8Array         : 2,
  Uint8Array        : 4,
  Uint8ClampedArray : 8,
  Int16Array        : 0x10,
  Uint16Array       : 0x20,
  Int32Array        : 0x40,
  Uint32Array       : 0x80,
  Float32Array      : 0x100,
  Float64Array      : 0x200
}, function(n, name) {
  ArrayBufferoidTypes[name] = n;
  /**
   * @lends Pot.ArrayBufferoid
   */
  /**
   * @property {Function} toArrayBuffer
   *           Create a new ArrayBuffer with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toInt8Array
   *           Create a new Int8Array with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toUint8Array
   *           Create a new Uint8Array with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toUint8ClampedArray
   *           Create a new Uint8ClampedArray with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toInt16Array
   *           Create a new Int16Array with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toUint16Array
   *           Create a new Uint16Array with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toInt32Array
   *           Create a new Int32Array with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toUint32Array
   *           Create a new Uint32Array with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toFloat32Array
   *           Create a new Float32Array with arguments.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toFloat64Array
   *           Create a new Float64Array with arguments.
   *           If Typed Array not supported will returns Array.
   */
  ArrayBufferoid['to' + name] = function() {
    return createArrayBuffer(n, arguments);
  };
});

ArrayBufferoid.fn = ArrayBufferoid.prototype = {
  /**
   * @lends Pot.ArrayBufferoid.prototype
   */
  /**
   * @ignore
   */
  constructor : ArrayBufferoid,
  /**
   * @private
   * @ignore
   */
  id : PotInternal.getMagicNumber(),
  /**
   * A unique strings.
   *
   * @type  String
   * @const
   */
  serial : null,
  /**
   * @private
   * @ignore
   * @const
   */
  NAME : 'ArrayBufferoid',
  /**
   * isArrayBufferoid.
   *
   * @type Function
   * @function
   * @public
   */
  isArrayBufferoid : isArrayBufferoid,
  /**
   * length.
   *
   * @type Number
   * @ignore
   */
  length : 0,
  /**
   * offset (byteOffset).
   *
   * @type Number
   * @public
   */
  offset : 0,
  /**
   * Initialize properties.
   *
   * @private
   * @ignore
   */
  init : function(args) {
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    this.length = 0;
    this.offset = 0;
    parseArguments(this, args);
    return this;
  },
  /**
   * Get the object length.
   *
   * @return {Number}    Max length of object.
   *
   * @type Function
   * @function
   * @public
   */
  size : function() {
    var result = sizeOfBufferoid(this, true);
    this.length = result;
    return result;
  },
  /**
   * toString like Array.prototype.toString.
   *
   * @return {String}
   */
  toString : function() {
    var array = bufferoidToArray(this);
    return ArrayProto.toString.call(array);
  },
  /**
   * join like Array.prototype.join.
   *
   * @param  {String}
   * @return {String}
   */
  join : function(separator) {
    var array = bufferoidToArray(this);
    return ArrayProto.join.apply(array, arguments);
  },
  /**
   * push like Array.prototype.push.
   *
   * @param  {...args}
   * @return {Number}
   */
  push : function() {
    var array = bufferoidToArray(this, true),
        result = push.apply(array, arguments);
    arrayToBufferoid(this, array);
    return result;
  },
  /**
   * pop like Array.prototype.pop.
   *
   * @return {*}
   */
  pop : function() {
    var array = bufferoidToArray(this, true),
        result = ArrayProto.pop.apply(array, arguments);
    arrayToBufferoid(this, array);
    return result;
  },
  /**
   * shift like Array.prototype.shift.
   *
   * @return {*}
   */
  shift : function() {
    var array = bufferoidToArray(this, true),
        result = ArrayProto.shift.apply(array, arguments);
    arrayToBufferoid(this, array);
    return result;
  },
  /**
   * unshift like Array.prototype.unshift.
   *
   * @return {Number}
   */
  unshift : function() {
    var array = bufferoidToArray(this, true),
        result = unshift.apply(array, arguments);
    arrayToBufferoid(this, array);
    return result;
  },
  /**
   * reverse like Array.prototype.reverse.
   *
   * @return {Pot.ArrayBufferoid}
   */
  reverse : function() {
    var array = bufferoidToArray(this);
    return new ArrayBufferoid(ArrayProto.reverse.apply(array, arguments));
  },
  /**
   * sort like Array.prototype.sort.
   *
   * @param  {(Function)}
   * @return {Pot.ArrayBufferoid}
   */
  sort : function() {
    var array = bufferoidToArray(this, true);
    ArrayProto.sort.apply(array, arguments);
    arrayToBufferoid(this, array);
    return new ArrayBufferoid(array);
  },
  /**
   * concat like Array.prototype.concat.
   *
   * @param  {...args}
   * @return {Pot.ArrayBufferoid}
   */
  concat : function() {
    var array = bufferoidToArray(this);
    return new ArrayBufferoid(concat.apply(array, arguments));
  },
  /**
   * slice like Array.prototype.slice.
   *
   * @param  {Number}
   * @param  {(Number)}
   * @return {Pot.ArrayBufferoid}
   */
  slice : function() {
    var array = bufferoidToArray(this);
    return new ArrayBufferoid(slice.apply(array, arguments));
  },
  /**
   * splice like Array.prototype.splice.
   *
   * @param  {Number}
   * @param  {Number}
   * @param  {...args}
   * @return {*}
   */
  splice : function() {
    var array = bufferoidToArray(this, true),
        result = new ArrayBufferoid(splice.apply(array, arguments));
    arrayToBufferoid(this, array);
    return result;
  },
  /**
   * indexOf like Array.prototype.indexOf.
   *
   * @param  {*}
   * @param  {(Number)}
   * @return {Number}
   */
  indexOf : function() {
    var args = arrayize(arguments);
    args.unshift(this);
    return Pot.indexOf.apply(null, args);
  },
  /**
   * lastIndexOf like Array.prototype.lastIndexOf.
   *
   * @param  {*}
   * @param  {(Number)}
   * @return {Number}
   */
  lastIndexOf : function() {
    var args = arrayize(arguments);
    args.unshift(this);
    return Pot.lastIndexOf.apply(null, args);
  },
  /**
   * filter like Array.prototype.filter.
   *
   * @param  {Function}
   * @return {Pot.ArrayBufferoid}
   */
  filter : function() {
    var args = arrayize(arguments);
    args.unshift(this);
    if (args[2] === void 0) {
      args[2] = this;
    }
    return new ArrayBufferoid(Pot.filter.apply(null, args));
  },
  /**
   * forEach like Array.prototype.forEach.
   *
   * @param  {Function}
   * @return {*}
   */
  forEach : function() {
    var args = arrayize(arguments);
    args.unshift(this);
    if (args[2] === void 0) {
      args[2] = this;
    }
    return Pot.forEach.apply(null, args);
  },
  /**
   * map like Array.prototype.map.
   *
   * @param  {Function}
   * @return {Pot.ArrayBufferoid}
   */
  map : function() {
    var args = arrayize(arguments);
    args.unshift(this);
    if (args[2] === void 0) {
      args[2] = this;
    }
    return new ArrayBufferoid(Pot.map.apply(null, args));
  },
  /**
   * reduce like Array.prototype.reduce.
   *
   * @param  {Function}
   * @return {*}
   */
  reduce : function() {
    var args = arrayize(arguments);
    args.unshift(this);
    if (args[3] === void 0) {
      args[3] = this;
    }
    return Pot.reduce.apply(null, args);
  },
  /**
   * every like Array.prototype.every.
   *
   * @param  {Function}
   * @return {Boolean}
   */
  every : function() {
    var args = arrayize(arguments);
    args.unshift(this);
    if (args[2] === void 0) {
      args[2] = this;
    }
    return Pot.every.apply(null, args);
  },
  /**
   * some like Array.prototype.some.
   *
   * @param  {Function}
   * @return {Boolean}
   */
  some : function() {
    var args = arrayize(arguments);
    args.unshift(this);
    if (args[2] === void 0) {
      args[2] = this;
    }
    return Pot.some.apply(null, args);
  }
};

each(ArrayBufferoidTypes, function(n, k) {
  var name = 'to' + k;
  /**
   * @lends Pot.ArrayBufferoid.prototype
   */
  /**
   * @property {Function} toArrayBuffer
   *           Create a new ArrayBuffer with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toInt8Array
   *           Create a new Int8Array with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toUint8Array
   *           Create a new Uint8Array with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toUint8ClampedArray
   *           Create a new Uint8ClampedArray with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toInt16Array
   *           Create a new Int16Array with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toUint16Array
   *           Create a new Uint16Array with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toInt32Array
   *           Create a new Int32Array with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toUint32Array
   *           Create a new Uint32Array with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toFloat32Array
   *           Create a new Float32Array with buffer.
   *           If Typed Array not supported will returns Array.
   *
   * @property {Function} toFloat64Array
   *           Create a new Float64Array with buffer.
   *           If Typed Array not supported will returns Array.
   */
  ArrayBufferoid.fn[name] = function() {
    return ArrayBufferoid[name](bufferoidToArray(this));
  };
});

// Definition of stream methods.
update(ArrayBufferoid.fn, {
  /**
   * @lends Pot.ArrayBufferoid.prototype
   */
  /**
   * Get the Array of this buffer.
   *
   * @return {Array}   Array of this buffer.
   *
   * @type Function
   * @function
   * @public
   */
  toArray : function() {
    return bufferoidToArray(this);
  },
  /**
   * Seek offset.
   *
   * @param  {Number}  offset  Seek offset.
   * @return {Number}          Current offset.
   *
   * @type Function
   * @function
   * @public
   */
  seek : function(offset) {
    this.offset = (offset - 0) || 0;
    return this.offset;
  },
  /**
   * Get the current offset.
   *
   * @return {Number} Current offset.
   *
   * @type Function
   * @function
   * @public
   */
  tell : function() {
    return this.offset;
  },
  /**
   * Read the buffer.
   *
   * @param  {Number}             size  Reading length.
   * @return {Pot.ArrayBufferoid}       A new instance of Pot.ArrayBufferoid.
   *
   * @type Function
   * @function
   * @public
   */
  read : function(size) {
    var sz = (size - 0) || 0,
        result = this.slice(this.offset, this.offset + sz);
    this.offset += sz;
    return result;
  },
  /**
   * Write the buffer.
   *
   * @param  {Array|*} data  Data to write.
   * @return {Number}        Written length.
   *
   * @type Function
   * @function
   * @public
   */
  write : function(data) {
    var result = 0, array = arrayize(data), i = 0, len = array.length;
    for (; i < len; i++) {
      this[this.offset++] = array[i];
      result++;
    }
    return result;
  }
});

// Definition of DataView interface/methods.
// http://www.khronos.org/registry/typedarray/specs/latest/#8
// based: jDataView
update(ArrayBufferoid.fn, {
  /**
   * @lends Pot.ArrayBufferoid.prototype
   */
  /**
   * Get the Int8.
   *
   * <pre>
   * byte getInt8(unsigned long byteOffset);
   * </pre>
   *
   * @param  {Number} byteOffset
   * @return {Number} byte.
   *
   * @type Function
   * @function
   * @public
   */
  getInt8 : function (byteOffset) {
    var b = this.getUint8(byteOffset);
    return (b < 0x80) ? b : b - 0x100;
  },
  /**
   * Get the Uint8.
   *
   * <pre>
   * octet getUint8(unsigned long byteOffset);
   * </pre>
   *
   * @param  {Number} byteOffset
   * @return {Number} octet.
   *
   * @type Function
   * @function
   * @public
   */
  getUint8 : function(byteOffset) {
    var c;
    if (byteOffset != null) {
      this.offset = (byteOffset - 0) || 0;
    }
    c = this[this.offset++];
    if (isString(c)) {
      c = c.charCodeAt(0);
    }
    return c & 0xFF;
  },
  /**
   * Get the Int16.
   *
   * <pre>
   * short getInt16(unsigned long byteOffset,
   *                optional boolean littleEndian);
   * </pre>
   *
   * @param  {Number}     byteOffset
   * @param  {(Boolean)} (littleEndian)
   * @return {Number} short.
   *
   * @type Function
   * @function
   * @public
   */
  getInt16 : function(byteOffset, littleEndian) {
    var b = this.getUint16(byteOffset, littleEndian);
    return (b < 0x800) ? b : b - 0x10000;
  },
  /**
   * Get the Uint16.
   *
   * <pre>
   * unsigned short getUint16(unsigned long byteOffset,
   *                          optional boolean littleEndian);
   * </pre>
   *
   * @param  {Number}     byteOffset
   * @param  {(Boolean)} (littleEndian)
   * @return {Number} unsigned short.
   *
   * @type Function
   * @function
   * @public
   */
  getUint16 : function(byteOffset, littleEndian) {
    var b = getUint8EndianizeArray(this, byteOffset, 2, littleEndian);
    return (b[0] << 8) + b[1];
  },
  /**
   * Get the Int32.
   *
   * <pre>
   * long getInt32(unsigned long byteOffset,
   *               optional boolean littleEndian);
   * </pre>
   *
   * @param  {Number}     byteOffset
   * @param  {(Boolean)} (littleEndian)
   * @return {Number} long.
   *
   * @type Function
   * @function
   * @public
   */
  getInt32 : function(byteOffset, littleEndian) {
    var b = this.getUint32(byteOffset, littleEndian);
    return (b > 0x7FFFFFFF) ? b - Math.pow(2, 32) : b;
  },
  /**
   * Get the Uint32.
   *
   * <pre>
   * unsigned long getUint32(unsigned long byteOffset,
   *                         optional boolean littleEndian);
   * </pre>
   *
   * @param  {Number}     byteOffset
   * @param  {(Boolean)} (littleEndian)
   * @return {Number} unsigned long.
   *
   * @type Function
   * @function
   * @public
   */
  getUint32 : function(byteOffset, littleEndian) {
    var b = getUint8EndianizeArray(this, byteOffset, 4, littleEndian);
    return (b[0] * 0x1000000) + (b[1] << 16) + (b[2] << 8) + b[3];
  },
  /**
   * Get the Float32.
   *
   * <pre>
   * float getFloat32(unsigned long byteOffset,
   *                  optional boolean littleEndian);
   * </pre>
   *
   * @param  {Number}     byteOffset
   * @param  {(Boolean)} (littleEndian)
   * @return {Number} float.
   *
   * @type Function
   * @function
   * @public
   */
  getFloat32 : function(byteOffset, littleEndian) {
    var b = getUint8EndianizeArray(this, byteOffset, 4, littleEndian),
        sign = 1 - (2 * (b[0] >> 7)),
        expo = (((b[0] << 1) & 0xFF) | (b[1] >> 7)) - 0x7F,
        mant = ((b[1] & 0x7F) << 16) | (b[2] << 8) | b[3];
    if (expo === 0x80) {
      return (mant === 0) ? sign * Infinity : NaN;
    } else if (expo === -127) {
      return sign * mant * Math.pow(2, -126 - 23);
    } else {
      return sign * (1 + mant * Math.pow(2, -23)) * Math.pow(2, expo);
    }
  },
  /**
   * Get the Float64.
   *
   * <pre>
   * double getFloat64(unsigned long byteOffset,
   *                   optional boolean littleEndian);
   * </pre>
   *
   * @param  {Number}     byteOffset
   * @param  {(Boolean)} (littleEndian)
   * @return {Number} double.
   *
   * @type Function
   * @function
   * @public
   */
  getFloat64 : function(byteOffset, littleEndian) {
    var b = getUint8EndianizeArray(this, byteOffset, 8, littleEndian),
        sign = 1 - (2 * (b[0] >> 7)),
        expo = ((((b[0] << 1) & 0xFF) << 3) | (b[1] >> 4)) - 0x3FF,
        mant = ((b[1] & 0x0F) * Math.pow(2, 48)) +
                (b[2] * Math.pow(2, 40)) +
                (b[3] * Math.pow(2, 32)) +
                (b[4] * 0x1000000) +
                (b[5] * 0x10000) +
                (b[6] * 0x100) + b[7];
    if (expo === 0x400) {
      return (mant === 0) ? sign * Infinity : NaN;
    } else if (expo === -1023) {
      return sign * mant * Math.pow(2, -1022 - 52);
    } else {
      return sign * (1 + mant * Math.pow(2, -52)) * Math.pow(2, expo);
    }
  }
  //XXX: implements set* methods.
});

ArrayBufferoid.fn.init.prototype = ArrayBufferoid.fn;

// Static methods.
update(ArrayBufferoid, {
  /**
   * @lends Pot.ArrayBufferoid
   */
  /**
   * Copt the ArrayBuffer/ArrayBufferoid/Array.
   *
   *
   * @example
   *   var buffer = new ArrayBuffer(10);
   *   var view1 = new Uint8Array(buffer);
   *   var view2 = new Uint8Array(buffer);
   *   view1[0] = 10;
   *   view2[1] = 20;
   *   Pot.debug(view1[0]); // 10
   *   Pot.debug(view2[0]); // 10
   *   Pot.debug(view1[1]); // 20
   *   Pot.debug(view2[1]); // 20
   *   var copy = new Uint8Array(Pot.ArrayBufferoid.copyBuffer(buffer));
   *   copy[1] = 100;
   *   Pot.debug(copy[0]);  // 10
   *   Pot.debug(copy[1]);  // 100
   *   Pot.debug(view1[0]); // 10
   *   Pot.debug(view1[1]); // 20
   *   Pot.debug(view2[0]); // 10
   *   Pot.debug(view2[1]); // 20
   *
   *
   * @param  {TypedArray|Pot.ArrayBufferoid|Array}  buffer  Target array.
   * @return {TypedArray|Pot.ArrayBufferoid|Array}          Copy.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  copyBuffer : function(buffer) {
    var result = [], a, b, i, len;
    if (buffer) {
      if (isArrayBufferoid(buffer)) {
        result = new ArrayBufferoid(buffer);
      } else {
        if (PotSystem.hasTypedArray) {
          if (PotSystem.canCopyTypedArray) {
            result = new Uint8Array(
              new Uint8Array(
                buffer.subarray && buffer.subarray(0) || buffer
              )
            ).buffer;
          } else {
            a = new Uint8Array(buffer.buffer || buffer);
            b = [];
            len = a.length;
            for (i = 0; i < len; i++) {
              b[i] = a[i];
            }
            result = new Uint8Array(b).buffer;
          }
        } else {
          result = arrayize(buffer);
        }
      }
    }
    return result;
  },
  /**
   * Convert to ArrayBuffer from raw string.
   *
   *
   * @example
   *   var string = 'abc123';
   *   var buffer = Pot.ArrayBufferoid.binaryToBuffer(string);
   *   Pot.debug(buffer); // [97, 98, 99, 49, 50, 51]
   *
   *
   * @param  {String}             string  A binary string.
   * @return {Pot.ArrayBufferoid}         A new instance of
   *                                       Pot.ArrayBufferoid.
   * @type  Function
   * @function
   * @static
   * @public
   */
  binaryToBuffer : update(function(string) {
    var buffer = new ArrayBufferoid(),
        len, i,
        s = stringify(string);
    if (s) {
      len = s.length;
      for (i = 0; i < len; i++) {
        buffer[i] = s.charCodeAt(i) & 0xFF;
        buffer.length++;
      }
    }
    return buffer;
  }, {
    /**
     * @lends Pot.ArrayBufferoid.binaryToBuffer
     */
    /**
     * Convert to ArrayBuffer from raw string with Deferred.
     *
     *
     * @example
     *   var s = 'abc123';
     *   Pot.ArrayBufferoid.binaryToBuffer.deferred(s).then(function(res) {
     *     Pot.debug(res); // [97, 98, 99, 49, 50, 51]
     *   });
     *
     *
     * @param  {String}        string  A binary string.
     * @return {Pot.Deferred} Returns an instance of Pot.Deferred that
     *               has a result of new instance of Pot.ArrayBufferoid.
     * @type  Function
     * @function
     * @static
     * @public
     */
    deferred : function(string) {
      var buffer = new ArrayBufferoid(), s = stringify(string);
      return Deferred.repeat(s.length, function(i) {
        buffer[i] = s.charCodeAt(i) & 0xFF;
        buffer.length++;
      }).then(function() {
        return buffer;
      });
    }
  }),
  /**
   * @lends Pot.ArrayBufferoid
   */
  /**
   * Convert to raw string from ArrayBuffer.
   *
   *
   * @example
   *   var view = new Uint8Array([0x61, 0x62, 0x63]);
   *   Pot.debug(Pot.ArrayBufferoid.bufferToBinary(view)); // 'abc'
   *   var buffer = new Pot.ArrayBufferoid([0x61, 0x62, 0x63]);
   *   Pot.debug(Pot.ArrayBufferoid.bufferToBinary(buffer)); // 'abc'
   *
   *
   * @param  {Pot.ArrayBufferoid|ArrayBuffer|Array} buffer An input bytes.
   * @return {String}                                      A binary string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  bufferToBinary : update(function(buffer) {
    var result = '', chars = [], i, len, array;
    if (buffer && isArrayLike(buffer)) {
      array = arrayize(buffer);
      len = array.length;
      for (i = 0; i < len; i++) {
        chars[i] = fromUnicode(array[i]);
      }
      result = chars.join('');
    }
    return result;
  }, {
    /**
     * @lends Pot.ArrayBufferoid.bufferToBinary
     */
    /**
     * Convert to raw string from ArrayBuffer with Deferred.
     *
     *
     * @example
     *   var view = new Uint8Array([0x61, 0x62, 0x63]);
     *   var buffer = new Pot.ArrayBufferoid([0x61, 0x62, 0x63]);
     *   Pot.ArrayBufferoid.bufferToBinary.deferred(view)
     *                                    .then(function(res) {
     *     Pot.debug(res); // 'abc'
     *     return Pot.ArrayBufferoid.bufferToBinary.deferred(buffer).
     *                                              then(function(res) {
     *       Pot.debug(res); // 'abc'
     *     });
     *   });
     *
     *
     * @param  {Pot.ArrayBufferoid|ArrayBuffer|Array} buffer An input buffer.
     * @return {Pot.Deferred} Returns an instance of Pot.Deferred that has a
     *                          binary string result.
     * @type  Function
     * @function
     * @static
     * @public
     */
    deferred : function(buffer) {
      var bb, fl, d = new Deferred();
      if (buffer && PotSystem.hasFileReader && PotSystem.BlobBuilder) {
        bb = new PotSystem.BlobBuilder();
        fl = new FileReader();
        if (isArrayBufferoid(buffer)) {
          bb.append(buffer.toArrayBuffer());
        } else {
          bb.append(buffer.buffer || buffer);
        }
        /**@ignore*/
        fl.onload = function(ev) {
          if (ev && ev.target) {
            d.begin(ev.target.result);
          } else {
            d.raise(ev);
          }
        };
        /**@ignore*/
        fl.onerror = function(er) {
          d.raise(er);
        };
        fl.readAsBinaryString(bb.getBlob());
      } else {
        d.begin(ArrayBufferoid.bufferToBinary(buffer));
      }
      return d;
    }
  }),
  /**
   * @lends Pot.ArrayBufferoid
   */
  /**
   * Convert to UTF-8 ArrayBuffer from UTF-16 string.
   *
   *
   * @example
   *   var s = 'hogeほげ';
   *   var buffer = Pot.ArrayBufferoid.stringToBuffer(s);
   *   var string = Pot.ArrayBufferoid.bufferToString(buffer);
   *   Pot.debug(buffer);
   *   // buffer:
   *   //   [104, 111, 103, 101, 227, 129, 187, 227, 129, 146]
   *   Pot.debug(s === string); // true
   *
   *
   * @param  {String}             string  UTF-16 string.
   * @return {Pot.ArrayBufferoid}         A new instance of
   *                                       Pot.ArrayBufferoid that
   *                                       UTF-8 ArrayBuffer.
   * @type  Function
   * @function
   * @static
   * @public
   */
  stringToBuffer : (function() {
    /**@ignore*/
    var add = function(b, c) {
      if (c < 0x80) {
        b[b.length++] = c;
      } else if (c < 0x800) {
        b[b.length++] = 0xC0 | ((c >>  6) & 0x1F);
        b[b.length++] = 0x80 | ((c >>  0) & 0x3F);
      } else if (c < 0x10000) {
        b[b.length++] = 0xE0 | ((c >> 12) & 0x0F);
        b[b.length++] = 0x80 | ((c >>  6) & 0x3F);
        b[b.length++] = 0x80 | ((c >>  0) & 0x3F);
      } else {
        b[b.length++] = 0xF0 | ((c >> 18) & 0x0F);
        b[b.length++] = 0x80 | ((c >> 12) & 0x3F);
        b[b.length++] = 0x80 | ((c >>  6) & 0x3F);
        b[b.length++] = 0x80 | ((c >>  0) & 0x3F);
      }
    };
    return function(string) {
      var buffer = new ArrayBufferoid(),
          len, i, j, ch, c2,
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
          add(buffer, ch);
        }
      }
      return buffer;
    };
  }()),
  /**
   * Convert to UTF-16 string from UTF-8 ArrayBuffer.
   *
   *
   * @example
   *   var s = 'hogeほげ';
   *   var buffer = Pot.ArrayBufferoid.stringToBuffer(s);
   *   var string = Pot.ArrayBufferoid.bufferToString(buffer);
   *   Pot.debug(buffer);
   *   // buffer:
   *   //   [104, 111, 103, 101, 227, 129, 187, 227, 129, 146]
   *   Pot.debug(s === string); // true
   *
   *
   * @param {Pot.ArrayBufferoid|ArrayBuffer|Array} buffer UTF-8 ArrayBuffer.
   * @param {String}                                      UTF-16 string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  bufferToString : function(buffer) {
    var result = '', chars = [], i = 0, len,
        n, c, c2, c3, c4, code, sc, array;
    if (buffer && isArrayLike(buffer)) {
      sc = fromUnicode;
      array = arrayize(buffer);
      len = array.length;
      while (i < len) {
        c = array[i++];
        n = (c >> 4);
        if (0 <= n && n <= 7) {
          chars[chars.length] = sc(c);
        } else if (12 <= n && n <= 13) {
          c2 = array[i++];
          chars[chars.length] = sc(((c & 0x1F) << 6) | (c2 & 0x3F));
        } else if (n === 14) {
          c2 = array[i++];
          c3 = array[i++];
          chars[chars.length] = sc(((c  & 0x0F) << 12) |
                                   ((c2 & 0x3F) <<  6) |
                                   ((c3 & 0x3F) <<  0));
        } else if (i + 2 < len) {
          c2 = array[i++];
          c3 = array[i++];
          c4 = array[i++];
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
  }
});

/**
 * @private
 * @ignore
 */
function createArrayBuffer(type, args) {
  var types = ArrayBufferoidTypes, len = args.length, val;
  if (PotSystem.hasTypedArray) {
    switch (true) {
      case ((type & types.ArrayBuffer) === type):
          return newTypedArray(Uint8Array, args).buffer;
      case ((type & types.Uint8Array) === type):
          return newTypedArray(Uint8Array, args);
      case ((type & types.Uint16Array) === type):
          return newTypedArray(Uint16Array, args);
      case ((type & types.Uint32Array) === type):
          return newTypedArray(Uint32Array, args);
      case ((type & types.Int8Array) === type):
          return newTypedArray(Int8Array, args);
      case ((type & types.Int16Array) === type):
          return newTypedArray(Int16Array, args);
      case ((type & types.Int32Array) === type):
          return newTypedArray(Int32Array, args);
      case ((type & types.Float32Array) === type):
          return newTypedArray(Float32Array, args);
      case ((type & types.Float64Array) === type):
          return newTypedArray(Float64Array, args);
      case ((type & types.Uint8ClampedArray) === type):
          if (PotSystem.hasUint8ClampedArray) {
            return newTypedArray(Uint8ClampedArray, args);
          }
    }
  }
  if (len) {
    if (len === 1) {
      val = args[0];
      if (isNumber(val)) {
        return new Array(val);
      } else if (isArrayLike(val)) {
        return arrayize(val);
      } else {
        return [val];
      }
    } else {
      return arrayize(args);
    }
  }
  return [];
}

/**
 * @private
 * @ignore
 */
function newTypedArray(co, args) {
  var a, i, len;
  switch (args.length) {
    case 0:
        return new co();
    case 1:
        return new co(args[0]);
    case 2:
        return new co(args[0], args[1]);
    case 3:
        return new co(args[0], args[1], args[2]);
    default:
        a = [];
        len = args.length;
        for (i = 0; i < len; i++) {
          a[i] = 'a[' + i + ']';
        }
        return (new Function(
          'a,c',
          Pot.format('return new c(#1);', a.join(','))
        ))(args, co);
  }
}

/**
 * @private
 * @ignore
 */
function bufferoidToArray(buffer, clear) {
  var r = [], i = 0, len = buffer.size();
  for (; i < len; i++) {
    r[i] = buffer[i];
    if (clear) {
      delete buffer[i];
    }
  }
  if (clear) {
    buffer.length = 0;
  }
  return r;
}

/**
 * @private
 * @ignore
 */
function arrayToBufferoid(buffer, array) {
  var i = 0, len = array.length;
  for (; i < len; i++) {
    buffer[i] = array[i];
  }
  buffer.length = len;
}

/**
 * @private
 * @ignore
 */
function sizeOfBufferoid(buffer, all) {
  var max = -1, keys, i = 0, k, p, len;
  if (all) {
    keys = [];
    for (p in buffer) {
      if (+p >= 0) {
        keys[keys.length] = p;
      }
    }
  } else {
    keys = Pot.keys(buffer);
  }
  len = keys.length;
  for (; i < len; i++) {
    k = +keys[i];
    if (k > max) {
      max = k;
    }
  }
  if (max >= 0) {
    max++;
  } else {
    max = 0;
  }
  buffer.length = max;
  return max;
}

/**
 * @private
 * @ignore
 */
function parseArguments(buffer, args) {
  var argn = args.length, val, i, len, a;
  switch (argn) {
    case 0:
        buffer.length = 0;
        break;
    case 1:
        val = args[0];
        if (!val) {
          buffer.length = 0;
        } else if (isNumber(val)) {
          len = val;
          for (i = 0; i < len; i++) {
            buffer[i] = void 0;
          }
          buffer.length = len;
        } else if (isArrayLike(val)) {
          
          if (isTypedArray(val)) {
            if (isArrayBuffer(val) &&
                val.byteLength != null && val[0] === void 0) {
              a = new Uint8Array(val);
            } else {
              a = val;
            }
          } else {
            a = arrayize(val);
          }
          len = a.length;
          for (i = 0; i < len; i++) {
            buffer[i] = a[i];
          }
          buffer.length = len;
        } else {
          buffer[0] = val;
          buffer.length = 1;
        }
        break;
    default:
        len = args.length;
        for (i = 0; i < len; i++) {
          buffer[i] = args[i];
        }
        buffer.length = len;
  }
}

/**
 * @private
 * @ignore
 */
function getUint8EndianizeArray(buffer, byteOffset, size, littleEndian) {
  var r = [], i = 0;
  for (; i < size; i++) {
    r[i] = buffer.getUint8(
      endianize(buffer, byteOffset, i, size, littleEndian)
    );
  }
  return r;
}

/**
 * @private
 * @ignore
 */
function endianize(buffer, byteOffset, pos, size, littleEndian) {
  var le = (littleEndian == null) ? true : littleEndian;
  if (byteOffset != null) {
    buffer.offset = (byteOffset - 0) || 0;
  }
  return buffer.offset + (le ? size - pos - 1 : pos);
}

}());

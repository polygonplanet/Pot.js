//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Hash.
(function(PREFIX) {

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Hash.
   *
   * Hash can contain any key names.
   *  e.g. "__iterator__" and "hasOwnProperty" etc. will crush object.
   * The implementation to resolve them.
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set('key1', 'value1');
   *   hash.set('key2', [1, 2, 3]);
   *   debug(hash.toJSON());
   *   // @results {"key1":"value1","key2":[1,2,3]}
   *   //
   *   hash.clear();
   *   // If you use the following keys to builtin Object,
   *   //  object will no longer work usually.
   *   hash.set('__iterator__',   'iterator');
   *   hash.set('hasOwnProperty', 'hasOwn');
   *   hash.set('prototype',      'proto');
   *   hash.set('constructor',    'construct');
   *   debug(hash.toJSON());
   *   // @results
   *   //   {
   *   //     "__iterator__": "iterator",
   *   //     "hasOwnProperty": "hasOwn",
   *   //     "prototype": "proto",
   *   //     "constructor": "construct"
   *   //   }
   *   //
   *   var result = hash.map(function(value, key, object) {
   *     return '[' + value + ']';
   *   }).reduce(function(a, b) {
   *     return a + b;
   *   });
   *   debug(result);
   *   // @results  result = '[iterator][hasOwn][proto][construct]'
   *
   *
   * @param  {Object|*}  (...)  (Optional) Items.
   * @return {Pot.Hash}         Returns an instance of Pot.Hash.
   *
   * @name  Pot.Hash
   * @type  Function
   * @class
   * @constructor
   * @public
   */
  Hash : function() {
    return Pot.isHash(this) ? this.init(arguments) :
            new Pot.Hash.fn.init(arguments);
  }
});

// Definition of the creator method for iterators and iteration speeds.
update(Pot.tmp, {
  /**
   * @ignore
   */
  createHashIterator : function(creator) {
    var
    /**@ignore*/
    create = function(speed) {
      var key = speed;
      if (!key) {
        each(Pot.Internal.LightIterator.speeds, function(v, k) {
          if (v === Pot.Internal.LightIterator.defaults.speed) {
            key = k;
            throw Pot.StopIteration;
          }
        });
      }
      return creator(key);
    },
    methods = {},
    construct = create();
    each(Pot.Internal.LightIterator.speeds, function(v, k) {
      methods[k] = create(k);
    });
    return update(construct, methods);
  }
});

// Define the prototype of Pot.Hash
Pot.Hash.fn = Pot.Hash.prototype = update(Pot.Hash.prototype, {
  /**
   * @lends Pot.Hash.prototype
   */
  /**
   * @ignore
   */
  constructor : Pot.Hash,
  /**
   * @const
   * @private
   * @ignore
   */
  id : Pot.Internal.getMagicNumber(),
  /**
   * @const
   * @private
   */
  serial : null,
  /**
   * StopIteration.
   *
   * @type Object
   * @const
   * @public
   */
  StopIteration : Pot.StopIteration,
  /**
   * @private
   * @ignore
   */
  _rawData : {},
  /**
   * Length of Hash data.
   *
   * @type  Number
   * @readonly
   * @public
   */
  length : 0,
  /**
   * @private
   * @readonly
   * @const
   * @ignore
   */
  NAME : 'Hash',
  /**
   * toString.
   *
   * @return  Return formatted string of object.
   * @type Function
   * @function
   * @static
   * @public
   */
  toString : Pot.toString,
  /**
   * isHash.
   *
   * @type Function
   * @function
   * @static
   * @public
   */
  isHash : Pot.isHash,
  /**
   * Initialization.
   *
   * @private
   * @ignore
   */
  init : function(argument) {
    var that = this, args, len;
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    this._rawData = {};
    this.length   = 0;
    args = arrayize(argument);
    len = args.length;
    if (len === 2 && !Pot.isObject(args[0])) {
      this.set(args[0], args[1]);
    } else if (len) {
      each(args, function(arg) {
        that.set(arg);
      });
    }
    Pot.Internal.referSpeeds.call(this, Pot.Internal.LightIterator.speeds);
    return this;
  },
  /**
   * Get the item by the specified key name.
   *
   * @param  {String}  key  The key name.
   * @return {*}            A value that related to the key name.
   * @function
   * @public
   */
  get : function(key) {
    return this._rawData[PREFIX + key];
  },
  /**
   * Set the item that is specified key name and value.
   *
   * @param  {String}   key    The key name.
   * @param  {*}        value  The value.
   * @return {Pot.Hash}        Return the Hash.
   * @function
   * @public
   */
  set : function(key, value) {
    var that = this;
    if (Pot.isHash(key)) {
      key.forEach(function(v, k) {
        that.set(k, v);
      });
    } else if (key && Pot.isObject(key)) {
      each(key, function(v, k) {
        that.set(k, v);
      });
    } else {
      if (!this.has(key)) {
        this.length++;
      }
      this._rawData[PREFIX + key] = value;
    }
    return this;
  },
  /**
   * Check whether a key exists.
   *
   * @param  {String}  key  The key name to check.
   * @return {Boolean}      Return true if exists.
   * @function
   * @public
   */
  has : function(key) {
    return ((PREFIX + key) in this._rawData);
  },
  /**
   * Check whether a value exists.
   *
   * @param  {*}       value  The value to check.
   * @return {Boolean}        Return true if exists.
   * @function
   * @public
   */
  hasValue : function(value) {
    var result = false;
    each(this._rawData, function(v, k) {
      if (k && k.charAt(0) === PREFIX && v === value) {
        result = true;
        throw Pot.StopIteration;
      }
    });
    return result;
  },
  /**
   * Remove an item by specified key name.
   *
   * @param  {String}   key  The key name.
   * @return {Pot.Hash}      Return the Hash.
   * @function
   * @public
   */
  remove : function(key) {
    if (this.has(key)) {
      delete this._rawData[(PREFIX + key)];
      this.length--;
    }
    return this;
  },
  /**
   * Clear the data.
   * All items will remove.
   *
   * @return {Pot.Hash}  Return the Hash.
   * @function
   * @public
   */
  clear : function() {
    this._rawData = {};
    this.length   = 0;
    return this;
  },
  /**
   * Collect all key names as an array.
   *
   * @return  {Array}   Return all key names as an array.
   * @function
   * @public
   */
  keys : function() {
    var keys = [];
    each(this._rawData, function(v, k) {
      if (k && k.charAt(0) === PREFIX) {
        keys[keys.length] = k.substring(1);
      }
    });
    return keys;
  },
  /**
   * Collect all values as an array.
   *
   * @return  {Array}   Return all values as an array.
   * @function
   * @public
   */
  values : function() {
    var values = [];
    each(this._rawData, function(v, k) {
      if (k && k.charAt(0) === PREFIX) {
        values[values.length] = v;
      }
    });
    return values;
  },
  /**
   * Convert all items to JSON format.
   *
   *
   * @example
   *   var hash = new Pot.Hash({foo: [1], bar: [2], baz: [3]});
   *   hash.set({a: 4, b: 5, c: [6, 7, '"hoge"']});
   *   var json = hash.toJSON();
   *   debug(json);
   *   // @results
   *   //   '{"foo":[1],"bar":[2],"baz":[3],"a":4,"b":5,"c":[6,7,"\"hoge\""]}'
   *
   *
   * @return      Return a JSON string object that has all items.
   * @function
   * @public
   */
  toJSON : function() {
    var results = [], key, json = Pot.Serializer.serializeToJSON;
    each(this._rawData, function(v, k) {
      if (k && k.charAt(0) === PREFIX) {
        key = k.substring(1);
        try {
          results[results.length] = json(key) + ':' + json(v);
        } catch (e) {}
      }
    });
    return '{' + results.join(',') + '}';
  },
  /**
   * Convert all items to plain object.
   *
   * Notice:
   *  if special keys existed (e.g. hasOwnProperty or __iterator__ etc.)
   *    then object will be broken.
   *
   * @return      Return an object that has all items.
   * @function
   * @public
   */
  toObject : function() {
    var o = {}, key;
    each(this._rawData, function(v, k) {
      if (k && k.charAt(0) === PREFIX) {
        key = k.substring(1);
        try {
          o[key] = v;
        } catch (e) {}
      }
    });
    return o;
  },
  /**
   * Convert all elements to the items() format array.
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set('prototype',      'value1');
   *   hash.set('__iterator__',   'value2');
   *   hash.set('hasOwnProperty', 'value3');
   *   var result = hash.toItems();
   *   debug(result);
   *   // @results
   *   //   [
   *   //     ['prototype',      'value1'],
   *   //     ['__iterator__',   'value2'],
   *   //     ['hasOwnProperty', 'value3']
   *   //   ]
   *
   *
   * @see Pot.Struct.items
   *
   * @return      Return the items() format array.
   * @function
   * @public
   */
  toItems : function() {
    var items = [], key;
    each(this._rawData, function(v, k) {
      if (k && k.charAt(0) === PREFIX) {
        key = k.substring(1);
        items[items.length] = [key, v];
      }
    });
    return items;
  },
  /**
   * Iterate each items with calls callback function.
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set('key1', 'value1');
   *   hash.set('key2', 'value2');
   *   hash.set('key3', 'value3');
   *   var s = '';
   *   hash.forEach(function(value, key, object) {
   *     s += key + ':' + value + ';';
   *   });
   *   debug(s);
   *   // @results  s = 'key1:value1;key2:value2;key3:value3;'
   *
   *
   * @param  {Function}  callback   An iterable function.
   *                                  function(value, key, object)
   *                                    this == `context`.
   *                                Throw Pot.StopIteration
   *                                  if you want to stop the loop.
   * @param  {*}         (context)  Optionally, context object. (i.e. this)
   * @return {Pot.Hash}             Return the Hash.
   *
   * @name  Pot.Hash.forEach
   * @class
   * @function
   * @public
   *
   * @property {Function} limp   Iterates "forEach" loop with slowest speed.
   * @property {Function} doze   Iterates "forEach" loop with slower speed.
   * @property {Function} slow   Iterates "forEach" loop with slow speed.
   * @property {Function} normal Iterates "forEach" loop with default speed.
   * @property {Function} fast   Iterates "forEach" loop with fast speed.
   * @property {Function} rapid  Iterates "forEach" loop with faster speed.
   * @property {Function} ninja  Iterates "forEach" loop with fastest speed.
   */
  forEach : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this;
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key, result;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          result = callback.call(context, val, key, object);
        }
      });
      return this;
    };
  }),
  /**
   * Creates a new object with the results of calling a
   *   provided function on every element in object.
   *
   * This method like Array.prototype.map
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set({a: 1, b: 2, c: 3, d: 4, e: 5});
   *   var result = hash.map(function(value, key) {
   *     return value * 100;
   *   });
   *   debug(result.toObject());
   *   // @results {a: 100, b: 200, c: 300, d: 400, e: 500}
   *
   *
   * @param  {Function}  callback    A callback function.
   * @param  {*}         (context)   (Optional) Object to use
   *                                   as `this` when executing callback.
   * @return {Pot.Hash}              Return a new instance of Hash that
   *                                   has result of each callbacks.
   *
   * @name  Pot.Hash.map
   * @class
   * @function
   * @public
   *
   * @property {Function} limp   Iterates "map" loop with slowest speed.
   * @property {Function} doze   Iterates "map" loop with slower speed.
   * @property {Function} slow   Iterates "map" loop with slow speed.
   * @property {Function} normal Iterates "map" loop with default speed.
   * @property {Function} fast   Iterates "map" loop with fast speed.
   * @property {Function} rapid  Iterates "map" loop with faster speed.
   * @property {Function} ninja  Iterates "map" loop with fastest speed.
   */
  map : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this, hash;
      hash = new Pot.Hash();
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key, result;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          result = callback.call(context, val, key, object);
          hash.set(key, result);
        }
      });
      return hash;
    };
  }),
  /**
   * Creates a new object with all elements that
   *  pass the test implemented by the provided function.
   *
   * This method like Array.prototype.filter
   *
   *
   * @example
   *   var hash = new Pot.Hash({a: 1, b: 2, c: 3, d: 4, e: 5});
   *   var result = hash.filter(function(value, key, obj) {
   *     return value % 2 == 0;
   *   });
   *   debug(result.toObject());
   *   // @results {b: 2, d: 4}
   *
   *
   * @param  {Function}    callback    A callback function.
   * @param  {*}           (context)   (Optional) Object to use
   *                                     as `this` when executing callback.
   * @return {Pot.Hash}                Return a new Hash instance that
   *                                     has result of each callbacks.
   * @name  Pot.Hash.filter
   * @class
   * @function
   * @public
   *
   * @property {Function} limp   Iterates "filter" loop with slowest speed.
   * @property {Function} doze   Iterates "filter" loop with slower speed.
   * @property {Function} slow   Iterates "filter" loop with slow speed.
   * @property {Function} normal Iterates "filter" loop with default speed.
   * @property {Function} fast   Iterates "filter" loop with fast speed.
   * @property {Function} rapid  Iterates "filter" loop with faster speed.
   * @property {Function} ninja  Iterates "filter" loop with fastest speed.
   */
  filter : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this, hash;
      hash = new Pot.Hash();
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          if (callback.call(context, val, key, object)) {
            hash.set(key, val);
          }
        }
      });
      return hash;
    };
  }),
  /**
   * Apply a function against an accumulator and each value of
   *  the object (from left-to-right) as to reduce it to a single value.
   *
   * This method like Array.prototype.reduce
   *
   *
   * @example
   *   var object = {a: 1, b: 2, c: 3};
   *   var hash = new Pot.Hash(object);
   *   var total = hash.reduce(function(a, b) { return a + b; });
   *   debug(total);
   *   // @results 6
   *
   *
   * @param  {Function}       callback  A callback function.
   * @param  {*}              initial   An initial value passed as `callback`
   *                                      argument that will be used on
   *                                      first iteration.
   * @param  {*}             (context)  (Optional) Object to use as
   *                                      the first argument to the
   *                                      first call of the `callback`.
   * @return {*}                        Return the result of each callbacks.
   * @name  Pot.Hash.reduce
   * @class
   * @function
   * @public
   *
   * @property {Function} limp   Iterates "reduce" loop with slowest speed.
   * @property {Function} doze   Iterates "reduce" loop with slower speed.
   * @property {Function} slow   Iterates "reduce" loop with slow speed.
   * @property {Function} normal Iterates "reduce" loop with default speed.
   * @property {Function} fast   Iterates "reduce" loop with fast speed.
   * @property {Function} rapid  Iterates "reduce" loop with faster speed.
   * @property {Function} ninja  Iterates "reduce" loop with fastest speed.
   */
  reduce : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, initial, context) {
      var me = arguments.callee, that = me.instance || this,
          value, skip, p, raw = that._rawData;
      if (initial == null) {
        for (p in raw) {
          if (p && p.charAt(0) === PREFIX) {
            try {
              value = raw[p];
              break;
            } catch (e) {}
          }
        }
      } else {
        value = initial;
      }
      skip = true;
      Pot.forEach[speedKey](raw, function(val, k, object) {
        var key;
        if (skip) {
          skip = false;
        } else {
          if (k && k.charAt(0) === PREFIX) {
            key = k.substring(1);
            value = callback.call(context, value, val, key, object);
          }
        }
      });
      return value;
    };
  }),
  /**
   * Tests whether all elements in the object pass the
   *  test implemented by the provided function.
   *
   * This method like Array.prototype.every
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set({A: 12, B: 5, C: 8, D: 130, E: 44});
   *   var result = hash.every(function(value, key, object) {
   *     return (value >= 10);
   *   });
   *   debug('[1] result = ' + result); // @results false
   *   hash.clear();
   *   hash.set({A: 12, B: 54, C: 18, D: 130, E: 44});
   *   result = hash.every(function(value, key, object) {
   *     return (value >= 10);
   *   });
   *   debug('[2] result = ' + result); // @results true
   *
   *
   * @param  {Function}  callback   A callback function.
   * @param  {*}         (context)  (Optional) Object to use
   *                                  as `this` when executing callback.
   * @return {Boolean}              Return the Boolean result by callback.
   *
   * @name  Pot.Hash.every
   * @class
   * @function
   * @public
   *
   * @property {Function} limp   Iterates "every" loop with slowest speed.
   * @property {Function} doze   Iterates "every" loop with slower speed.
   * @property {Function} slow   Iterates "every" loop with slow speed.
   * @property {Function} normal Iterates "every" loop with default speed.
   * @property {Function} fast   Iterates "every" loop with fast speed.
   * @property {Function} rapid  Iterates "every" loop with faster speed.
   * @property {Function} ninja  Iterates "every" loop with fastest speed.
   */
  every : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this, result = true;
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          if (!callback.call(context, val, key, object)) {
            result = false;
            throw Pot.StopIteration;
          }
        }
      });
      return result;
    };
  }),
  /**
   * Tests whether some element in the object passes the
   *  test implemented by the provided function.
   *
   * This method like Array.prototype.some
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set({A: 2, B: 5, C: 8, D: 1, E: 4});
   *   var result = hash.some(function(value, key, object) {
   *     return (value >= 10);
   *   });
   *   debug('[1] result = ' + result); // @results false
   *   hash.clear();
   *   hash.set({A: 12, B: 5, C: 8, D: 1, E: 4});
   *   result = hash.some(function(value, key, object) {
   *     return (value >= 10);
   *   });
   *   debug('[2] result = ' + result); // @results true
   *
   *
   * @param  {Function}    callback   A callback function.
   * @param  {*}           (context)  (Optional) Object to use
   *                                    as `this` when executing callback.
   * @return {Boolean}                Return the Boolean result by callback.
   *
   * @name  Pot.Hash.some
   * @class
   * @function
   * @public
   *
   * @property {Function} limp   Iterates "some" loop with slowest speed.
   * @property {Function} doze   Iterates "some" loop with slower speed.
   * @property {Function} slow   Iterates "some" loop with slow speed.
   * @property {Function} normal Iterates "some" loop with default speed.
   * @property {Function} fast   Iterates "some" loop with fast speed.
   * @property {Function} rapid  Iterates "some" loop with faster speed.
   * @property {Function} ninja  Iterates "some" loop with fastest speed.
   */
  some : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this, result = false;
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          if (callback.call(context, val, key, object)) {
            result = true;
            throw Pot.StopIteration;
          }
        }
      });
      return result;
    };
  })
});

delete Pot.tmp.createHashIterator;
Pot.Hash.prototype.init.prototype = Pot.Hash.prototype;
}('.'));

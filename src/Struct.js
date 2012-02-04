//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Struct.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Struct.
   * Object and Function object utilities.
   *
   * @name Pot.Struct
   * @type Object
   * @class
   * @static
   * @public
   */
  Struct : {}
});

update(Pot.Struct, {
  /**
   * @lends Pot.Struct
   */
  /**
   * Call the function with unknown number arguments.
   * That is for cases where JavaScript sucks
   *   built-in function like alert() on IE or other-browser when
   *   calls the Function.apply.
   *
   *
   * @example
   *   debug(invoke(window, 'alert', 100));
   *   debug(invoke(document, 'getElementById', 'container'));
   *   debug(invoke(window, 'setTimeout', function() { debug(1); }, 2000));
   *
   *
   * @param  {Object}      object  The context object (e.g. window)
   * @param  {String}      method  The callable function name.
   * @param  {Array|...*}  (args)  The function arguments.
   * @return {*}                   The result of the called function.
   * @type Function
   * @function
   * @public
   * @static
   */
  invoke : invoke,
  /**
   * Clone an object.
   *
   * @example
   *   var obj1 = {key: 'value'};
   *   var obj2 = clone(obj1);
   *   obj2.hoge = 'fuga';
   *   debug(obj1.hoge);  // undefined
   *   debug(obj2.hoge);  // 'fuga'
   *
   *
   * @param  {*}  o  Target object.
   * @return {*}     Cloned object.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  clone : function(x) {
    var result, f, c, k, System = Pot.System;
    if (x == null) {
      return x;
    }
    c = x.constructor;
    switch (Pot.typeLikeOf(x)) {
      case 'array':
          result = arrayize(x);
          break;
      case 'function':
          result = update(function() {
            return x.apply(this, arguments);
          }, x);
          result.prototype = update({}, x.prototype);
          break;
      case 'object':
          if (Pot.isDOMLike(x)) {
            if (x.cloneNode) {
              result = x.cloneNode(true);
              break;
            } else if (!System.canCloneDOM) {
              result = update({}, x);
              break;
            }
          }
          if (System.canProtoClone) {
            /**@ignore*/
            f = function() {};
            f.prototype = x;
            result = new f();
          } else {
            // Some environments cannot clone object by function prototype.
            //XXX: frozen object
            result = {};
            for (k in x) {
              if (hasOwnProperty.call(x, k)) {
                try {
                  result[k] = x[k];
                } catch (e) {}
              }
            }
          }
          break;
      case 'error':
          result = new Error(x.message || x.description || x);
          update(result, x);
          break;
      case 'date':
          result = new Date(x.getTime());
          break;
      case 'regexp':
          result = new RegExp(x);
          break;
      case 'boolean':
      case 'number':
      case 'string':
          if (typeof x === 'object') {
            result = new c(c(x));
          } else {
            result = c((function() {
              return this;
            }).call(x));
          }
          break;
      default:
          result = x;
          break;
    }
    return result;
  },
  /**
   * Creates a new function with specified context and arguments.
   *
   *
   * @example
   *   var Hoge = function() {
   *     this.msg = 'Hello Hoge!';
   *   };
   *   Hoge.prototype.sayHoge = function() {
   *     debug(this.msg);
   *   };
   *   var hoge = new Hoge();
   *   //
   *   // direct
   *   setTimeout(hoge.sayHoge, 1000); // undefined
   *   //
   *   // bind
   *   setTimeout(bind(hoge.sayHoge, hoge), 1000); // Hello Hoge!
   *   //
   *   // use arguments
   *   Hoge.prototype.sayHoges = function(msg) {
   *     debug(this.msg + msg);
   *   };
   *   //
   *   // direct
   *   setTimeout(hoge.sayHoges, 1000); // NaN
   *   //
   *   // bind
   *   setTimeout(bind(hoge.sayHoges, hoge, 'Hi!'), 1000); // Hello Hoge!Hi!
   *
   *
   * @param  {Function}   func    A function to partially apply.
   * @param  {*}          self    Specifies the object as "this".
   *                              If the value is unspecified,
   *                               it will default to the global object.
   * @param  {...*}      (...)    Additional arguments that are partially
   *                               applied to the function.
   * @return {Function}           A new function that will invoked with
   *                               original context and
   *                               partially-applied arguments.
   * @type  Function
   * @function
   * @static
   * @public
   */
  bind : function(func, self/*[, ...args]*/) {
    var args = arguments, bounds, context = self || null;
    if (args.length > 2) {
      bounds = arrayize(args, 2);
      return function() {
        var a = arrayize(arguments);
        unshift.apply(a, bounds);
        return func.apply(context, a);
      };
    } else {
      return function() {
        return func.apply(context, arguments);
      };
    }
  },
  /**
   * Create a new function like Function.bind,
   *  except that a "this" is not required.
   * That is useful when the target function is already bound.
   *
   * @example
   *   function add(a, b) {
   *     return a + b;
   *   }
   *   var add2 = partial(add, 2);
   *   var result = add2(5);
   *   debug(result);
   *   // @results 7
   *
   *
   * @param  {Function}   func    A function to partially apply.
   * @param  {...*}       (...)   Additional arguments that are partially
   *                                applied to `func`.
   * @return {Function}           A new function that will invoked with
   *                                partially-applied arguments.
   * @type  Function
   * @function
   * @static
   * @public
   */
  partial : function(func/*[, ...args]*/) {
    var args = arrayize(arguments, 1);
    return function() {
      var a = arrayize(arguments);
      a.unshift.apply(a, args);
      return func.apply(this, a);
    };
  },
  /**
   * Collect the object key names like ES5's Object.keys().
   *
   *
   * @example
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   debug(keys(obj));
   *   // @results ['foo', 'bar', 'baz']
   *   var array = [10, 20, 30, 40, 50];
   *   debug(keys(array));
   *   // @results [0, 1, 2, 3, 4]
   *   delete array[2];
   *   debug(keys(array));
   *   // @results [0, 1, 3, 4]
   *
   *
   * @param  {Object}  o  The target object.
   * @return {Array}      The collected key names as an array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  keys : function(o) {
    var r = [], objectLike;
    if (o) {
      objectLike = Pot.isObject(o);
      if (objectLike && Pot.System.isBuiltinObjectKeys) {
        try {
          r = Object.keys(o);
          return r;
        } catch (e) {}
      }
      if (objectLike || Pot.isArrayLike(o)) {
        each(o, function(v, k) {
          try {
            if (hasOwnProperty.call(o, k)) {
              r[r.length] = k;
            }
          } catch (e) {}
        });
      }
    }
    return r;
  },
  /**
   * Collect the object values.
   *
   *
   * @example
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   debug(values(obj));
   *   // @results [1, 2, 3]
   *   var array = ['foo', 'bar', 'baz'];
   *   debug(values(array));
   *   // @results ['foo', 'bar', 'baz'];
   *   delete array[1];
   *   debug(values(array));
   *   // @results ['foo', 'baz']
   *
   *
   * @param  {Object}  o  The target object.
   * @return {Array}      The collected values as an array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  values : function(o) {
    var r = [];
    if (o) {
      if (Pot.isObject(o) || Pot.isArrayLike(o)) {
        each(o, function(v, k) {
          try {
            if (hasOwnProperty.call(o, k)) {
              r[r.length] = v;
            }
          } catch (e) {}
        });
      }
    }
    return r;
  },
  /**
   * Revert to an object from items() format array.
   *
   *
   * @example
   *   var array = [['foo', 1], ['bar', 2], ['baz', 3]];
   *   debug(tuple(array));
   *   // @results {foo: 1, bar: 2, baz: 3}
   *
   *
   * @example
   *   var array = [['foo', 1, 'bar', 2], {baz: 3}, ['A', 4, 'B']];
   *   debug(tuple(array));
   *   // @results {foo: 1, bar: 2, baz: 3, A: 4, B: (void 0)}
   *
   *
   * @example
   *   // Callback function usage:
   *   var array = [['A', 1], ['B', 2], ['C', 3]];
   *   var func = function(key, val) {
   *     return ['[' + key + ']', '{' + val + '}'];
   *   };
   *   debug(tuple(array, func));
   *   // @results {'[A]': '{1}', '[B]': '{2}', '[C]': '{3}'}
   *
   *
   * @example
   *   // Example to specify the type of result:
   *   var array = [['prototype', 1], ['__iterator__', 2], ['__proto__', 3]];
   *   debug(tuple(array, new Pot.Hash()).toJSON());
   *   // @results {"prototype": 1, "__iterator__": 2, "__proto__": 3}
   *
   *
   * @example
   *   // Example to specify the type of result
   *   //   (enables Array, Object, Pot.Hash etc.):
   *   var array = [['A', 1], ['B', 2], ['C', 3]];
   *   var func = function(key, val) {
   *     return '(' + key + ':' + val + ')';
   *   };
   *   debug(tuple(array, func, []));
   *   // @results ['(A:1)', '(B:2)', '(C:3)']
   *
   *
   * @param  {Array}       items        The target object.
   * @param  {Function|*} (callback)    (Optional) Callback function.
   * @param  {*}          (defaultType) (Optional) An object literal to
   *                                      specify the type of result.
   * @return {Object}                   The collected object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  tuple : function(items, callback, defaultType) {
    var result = {}, fn, args = arguments, type = null,
        Hash       = Pot.Hash,
        isFunction = Pot.isFunction,
        isHash     = Pot.isHash,
        isObject   = Pot.isObject,
        isArray    = Pot.isArray;
    if (args.length >= 2) {
      if (isFunction(callback)) {
        fn   = callback;
        type = defaultType;
      } else {
        fn   = defaultType;
        type = callback;
      }
    }
    if (!isFunction(fn)) {
      fn = null;
    }
    if (type == null) {
      type = 'object';
    } else if (isHash(type) || (type && type === Hash)) {
      type = 'hash';
    } else {
      type = Pot.typeOf(type);
    }
    if (items) {
      if (isArray(items)) {
        result = null;
        each(items, function(item) {
          var key, i, len, v, k, pairs = [];
          if (item) {
            if (Pot.isArrayLike(item)) {
              i = 0;
              len = item.length;
              if (len) {
                do {
                  try {
                    k = stringify(item[i++], true);
                    v = item[i++];
                    pairs[pairs.length] = [k, v];
                  } catch (e) {}
                } while (i < len);
              }
            } else if (isObject(item)) {
              for (key in item) {
                try {
                  k = stringify(key, true);
                  v = item[key];
                  pairs[pairs.length] = [k, v];
                } catch (ex) {}
              }
            }
            each(pairs, function(pair) {
              var rv, p;
              try {
                switch (type) {
                  case 'hash':
                      if (result === null) {
                        result = new Hash();
                      }
                      if (fn) {
                        rv = fn.apply(pair, pair);
                        if (isArray(rv)) {
                          result.set(rv[0], rv[1]);
                        } else if (isObject(rv)) {
                          result.set(rv);
                        } else {
                          result.set(pair[0], rv);
                        }
                      } else {
                        result.set(pair[0], pair[1]);
                      }
                      break;
                  case 'array':
                      if (result === null) {
                        result = [];
                      }
                      result[result.length] = fn ? fn.apply(pair, pair)
                                                 : pair;
                      break;
                  case 'string':
                      if (result === null) {
                        result = '';
                      }
                      result += fn ? fn.apply(pair, pair)
                                   : (stringify(pair[0]) + stringify(pair[1]));
                      break;
                  case 'number':
                      if (result === null) {
                        result = 0;
                      }
                      result += fn ? fn.apply(pair, pair)
                                   : ((+pair[0] || 0) + (+pair[1] || 0));
                      break;
                  case 'object':
                  default:
                      if (result === null) {
                        result = {};
                      }
                      if (fn) {
                        rv = fn.apply(pair, pair);
                        if (isArray(rv)) {
                          result[rv[0]] = rv[1];
                        } else if (isObject(rv)) {
                          for (p in rv) {
                            try {
                              result[p] = rv[p];
                            } catch (err) {}
                          }
                        } else {
                          result[pair[0]] = rv;
                        }
                      } else {
                        result[pair[0]] = pair[1];
                      }
                      break;
                }
              } catch (ex) {}
            });
          }
        });
      }
    }
    return result;
  },
  /**
   * Revert to an object from zip() format array.
   *
   * <pre>
   * Example:
   *
   *   arguments:  [[1, 4],
   *                [2, 5],
   *                [3, 6]]
   *
   *   results:    [1, 2, 3],
   *               [4, 5, 6]
   *
   * Example:
   *
   *   arguments:  [[{a: 1}, {d: 4}],
   *                [{b: 2}, {e: 5}],
   *                [{c: 3}, {f: 6}]]
   *
   *   results:    {a: 1, b: 2, c: 3},
   *               {d: 4, e: 5, f: 6}
   * </pre>
   *
   *
   * @link http://docs.python.org/library/functions.html#zip
   *
   *
   * @example
   *   debug(unzip([[1, 4], [2, 5], [3, 6]]));
   *   // @results
   *   //   [[1, 2, 3], [4, 5, 6]]
   *   //
   *   debug(unzip([[{a: 1}, {d: 4}], [{b: 2}, {e: 5}], [{c: 3}, {f: 6}]]));
   *   // @results
   *   //   [{a:1, b:2, c:3}, {d:4, e:5, f:6}]
   *   //
   *   var callback = function(a, b, c) { return a + b + c; };
   *   debug(unzip([[1, 4], [2, 5], [3, 6]], callback));
   *   // @results
   *   //   [6, 15]
   *   //
   *
   *
   * @see Pot.zip
   *
   * @param  {Array}       zipped       Target array.
   * @param  {Function|*} (callback)    (Optional) Callback function.
   * @return {Array}                    The collected array object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  unzip : function(zipped, callback) {
    var result = [], max, len, fn, i, j, lists, val, tail,
        isObject = Pot.isObject;
    if (Pot.isFunction(callback)) {
      fn = callback;
    }
    if (zipped && zipped.length && Pot.isArray(zipped)) {
      max = 0;
      each(zipped, function(z) {
        if (z && z.length > max) {
          max = z.length;
        }
      });
      len = zipped.length;
      for (i = 0; i < max; i++) {
        lists = [];
        for (j = 0; j < len; j++) {
          try {
            val = zipped[j][i];
          } catch (ex) {
            continue;
          }
          tail = lists.length - 1;
          if (val && tail >= 0 && isObject(lists[tail]) && isObject(val)) {
            each(val, function(v, k) {
              try {
                lists[tail][k] = v;
              } catch (ex) {}
            });
          } else {
            lists[lists.length] = val;
          }
        }
        if (lists.length === 1 && isObject(lists[0])) {
          lists = lists.shift();
        }
        result[result.length] = fn ? fn.apply(lists, arrayize(lists)) : lists;
      }
    }
    return result;
  },
  /**
   * Creates an object from a key-value pairs.
   *
   *
   * @example
   *   debug(pairs('key', 'value'));
   *   // @results {key : 'value'}
   *   debug(pairs('key1', 'value1', 'key2', 'value2'));
   *   // @results {key1: 'value1', key2: 'value2'}
   *   debug(pairs('key'));
   *   // @results {key: undefined}
   *   debug(pairs(['key', 'value']));
   *   // @results {key: 'value'}
   *   debug(pairs('key1', 1, ['key2', 2], 'key3', 3));
   *   // @results {key1: 1, key2: 2, key3: 3}
   *   debug(pairs(['a', 1, ['b', 2, [{c: 3}, 'd', 4]]]));
   *   // @results {a: 1, b: 2, c: 3, d: 4}
   *
   *
   * @param  {String|*}  (...)  The key-value pairs.
   * @return {Object}           The created object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  pairs : function(/*key, value[, ...args]*/) {
    var result = {}, args = arrayize(arguments),
        len = args.length, i = 0,
        isArray = Pot.isArray,
        isObject = Pot.isObject;
    do {
      if (isArray(args[i])) {
        args[i] = pairs.apply(null, args[i]);
      }
      if (isObject(args[i])) {
        each(args[i++], function(v, k) {
          result[k] = v;
        });
      } else {
        result[stringify(args[i++], true)] = args[i++];
      }
    } while (i < len);
    return result;
  },
  /**
   * Count the object items then return total number.
   *
   *
   * @example
   *   debug(count({a: 1, b: 2, c: 3}));              // 3
   *   debug(count({}));                              // 0
   *   debug(count([1, 2, 3, 4, 5]));                 // 5
   *   debug(count([]));                              // 0
   *   debug(count(new Object('foo', 'bar', 'baz'))); // 3
   *   debug(count(new Array(100)));                  // 100
   *   debug(count(null));                            // 0
   *   debug(count((void 0)));                        // 0
   *   debug(count('hoge'));                          // 4
   *   debug(count(''));                              // 0
   *   debug(count(new String('hoge')));              // 4
   *   debug(count(100));                             // 100
   *   debug(count(0));                               // 0
   *   debug(count(-1));                              // 1
   *   debug(count((function() {})));                 // 0
   *   var f = function() {};
   *   f.foo = 1;
   *   f.bar = 2;
   *   debug(count(f));  // 2
   *
   *
   * @param  {Object|*}  o  The target object.
   * @return {Number}       The total count.
   * @type  Function
   * @function
   * @static
   * @public
   */
  count : function(o) {
    var c = 0, p;
    if (o != null) {
      switch (Pot.typeLikeOf(o)) {
        case 'array':
        case 'string':
            c = o.length;
            break;
        case 'object':
        case 'function':
            for (p in o) {
              if (hasOwnProperty.call(o, p)) {
                c++;
              }
            }
            break;
        case 'number':
            c = Math.abs(Math.round(o));
            break;
        default:
            try {
              c = o.toString().length;
            } catch (e) {
              c = 0;
            }
            break;
      }
    }
    return c - 0;
  },
  /**
   * Get the first orders value in object.
   *
   *
   * @example
   *   debug(first({a: 1, b: 2, c: 3}));   // 1
   *   debug(first({}));                   // undefined
   *   debug(first([1, 2, 3, 4, 5]));      // 1
   *   debug(first([]));                   // undefined
   *   debug(first({a: 'foo', b: 'bar'})); // 'foo'
   *   debug(first(new Array(100)));       // undefined
   *   debug(first(null));                 // undefined
   *   debug(first((void 0)));             // undefined
   *   debug(first('hoge'));               // 'h'
   *   debug(first(''));                   // ''
   *   debug(first(new String('hoge')));   // 'h'
   *   debug(first(123));                  // 3
   *   debug(first(0));                    // 0
   *   debug(first(-123));                 // 3
   *
   *
   * @param  {Object|Array|*}  o  The target object.
   * @return {*}                  The first value in object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  first : function(o, keyOnly) {
    var r, p, len;
    if (o != null) {
      switch (Pot.typeLikeOf(o)) {
        case 'array':
            if (o) {
              len = o.length;
              for (p = 0; p < len; p++) {
                try {
                  if (p in o) {
                    if (keyOnly) {
                      r = p;
                    } else {
                      r = o[p];
                    }
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
            break;
        case 'string':
            if (keyOnly) {
              r = o.length ? 0 : null;
            } else {
              r = o.length ? o.charAt(0) : '';
            }
            break;
        case 'number':
            if (keyOnly) {
              r = isNaN(o) ? null : 0;
            } else {
              r = Math.abs(o).toString().slice(-1) - 0;
            }
            break;
        case 'object':
            if (o) {
              for (p in o) {
                if (hasOwnProperty.call(o, p)) {
                  try {
                    if (keyOnly) {
                      r = p;
                    } else {
                      r = o[p];
                    }
                    break;
                  } catch (e) {
                    continue;
                  }
                }
              }
            }
            break;
        default:
            break;
      }
    }
    return r;
  },
  /**
   * Get the first orders key in object.
   *
   *
   * @example
   *   debug(firstKey({a: 1, b: 2, c: 3}));   // 'a'
   *   debug(firstKey({}));                   // undefined
   *   debug(firstKey([1, 2, 3, 4, 5]));      // 0
   *   debug(firstKey([]));                   // undefined
   *   debug(firstKey({a: 'foo', b: 'bar'})); // 'a'
   *   debug(firstKey(new Array(100)));       // undefined
   *   debug(firstKey(null));                 // undefined
   *   debug(firstKey((void 0)));             // undefined
   *   debug(firstKey('hoge'));               // 0
   *   debug(firstKey(''));                   // null
   *   debug(firstKey(new String('hoge')));   // 0
   *   debug(firstKey(123));                  // 0
   *   debug(firstKey(0));                    // 0
   *   debug(firstKey(-123));                 // 0
   *
   *
   * @param  {Object|Array|*}  o  The target object.
   * @return {*}                  The first key in object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  firstKey : function(o) {
    return Pot.Struct.first(o, true);
  },
  /**
   * Get the last orders value in object.
   *
   *
   * @example
   *   debug(last({a: 1, b: 2, c: 3}));   // 3
   *   debug(last({}));                   // undefined
   *   debug(last([1, 2, 3, 4, 5]));      // 5
   *   debug(last([]));                   // undefined
   *   debug(last({a: 'foo', b: 'bar'})); // 'bar'
   *   debug(last(new Array(100)));       // undefined
   *   debug(last(null));                 // undefined
   *   debug(last((void 0)));             // undefined
   *   debug(last('hoge'));               // 'e'
   *   debug(last(''));                   // ''
   *   debug(last(new String('hoge')));   // 'e'
   *   debug(last(123));                  // 1
   *   debug(last(0));                    // 0
   *   debug(last(-123));                 // 1
   *
   *
   * @param  {Object|Array|*}  o  The target object.
   * @return {*}                  The last value in object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  last : function(o, keyOnly) {
    var r, p;
    if (o != null) {
      switch (Pot.typeLikeOf(o)) {
        case 'array':
            p = o.length;
            while (--p >= 0) {
              try {
                if (p in o) {
                  if (keyOnly) {
                    r = p;
                  } else {
                    r = o[p];
                  }
                  break;
                }
              } catch (e) {
                continue;
              }
            }
            break;
        case 'string':
            if (keyOnly) {
              r = o.length ? o.length - 1 : null;
            } else {
              r = o.length ? o.slice(-1) : '';
            }
            break;
        case 'number':
            if (keyOnly) {
              r = isNaN(o) ? null : Math.abs(o).toString().length - 1;
            } else {
              r = Math.abs(o).toString().charAt(0) - 0;
            }
            break;
        case 'object':
            for (p in o) {
              if (hasOwnProperty.call(o, p)) {
                try {
                  if (keyOnly) {
                    r = p;
                  } else {
                    r = o[p];
                  }
                } catch (e) {
                  continue;
                }
              }
            }
            break;
        default:
            break;
      }
    }
    return r;
  },
  /**
   * Get the last orders key in object.
   *
   *
   * @example
   *   debug(lastKey({a: 1, b: 2, c: 3}));   // 'c'
   *   debug(lastKey({}));                   // undefined
   *   debug(lastKey([1, 2, 3, 4, 5]));      // 4
   *   debug(lastKey([]));                   // undefined
   *   debug(lastKey({a: 'foo', b: 'bar'})); // 'b'
   *   debug(lastKey(new Array(100)));       // undefined
   *   debug(lastKey(null));                 // undefined
   *   debug(lastKey((void 0)));             // undefined
   *   debug(lastKey('hoge'));               // 3
   *   debug(lastKey(''));                   // null
   *   debug(lastKey(new String('hoge')));   // 3
   *   debug(lastKey(123));                  // 2
   *   debug(lastKey(0));                    // 0
   *   debug(lastKey(-123));                 // 2
   *
   *
   * @param  {Object|Array|*}  o  The target object.
   * @return {*}                  The last key in object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  lastKey : function(o) {
    return Pot.Struct.last(o, true);
  },
  /**
   * Whether the object contains the given subject.
   *
   *
   * @example
   *   var obj = {foo: 10, bar: 20, baz: 30};
   *   debug(contains(obj, 20));    // true
   *   debug(contains(obj, 50));    // false
   *   var arr = [10, 20, 30, 'foo', 'bar'];
   *   debug(contains(arr, 20));    // true
   *   debug(contains(arr, 75));    // false
   *   debug(contains(arr, 'foo')); // true
   *   debug(contains(arr, 'FOO')); // false
   *   var str = 'foobarbaz';
   *   debug(contains(str, 'A'));   // false
   *   debug(contains(str, 'foo')); // true
   *   debug(contains(str, '123')); // false
   *   var num = 12345;
   *   debug(contains(num, 1));     // true
   *   debug(contains(num, 45));    // true
   *   debug(contains(num, 7));     // false
   *
   *
   * @param  {*}       object   The object to test for the
   *                              presence of the element.
   * @param  {*}       subject  The object for which to test.
   * @return {Boolean}          true if subject is present.
   * @type  Function
   * @function
   * @static
   * @public
   */
  contains : function(object, subject) {
    var result = false;
    switch (Pot.typeLikeOf(object)) {
      case 'string':
          result = ~object.indexOf(subject);
          break;
      case 'array':
          result = ~Pot.indexOf(object, subject);
          break;
      case 'object':
          result = ~Pot.indexOf(object, subject);
          break;
      case 'number':
          result = ~object.toString().indexOf(subject);
          break;
      default:
          result = false;
          break;
    }
    return !!result;
  },
  /**
   * Return the copy object that was removed a subject value.
   *
   *
   * @example
   *   // String
   *   debug(remove('foo bar baz', 'o'));            // 'fo bar baz'
   *   debug(remove('foo bar baz', 'bar'));          // 'foo  baz'
   *   // Array
   *   debug(remove([1, 2, 3, 4, 5], 2));            // [1, 3, 4, 5]
   *   debug(remove([1, 2, 3, 4, 5], '3'));          // [1, 2, 3, 4, 5]
   *   debug(remove([1, 2, 3, 4, 5], '3', true));    // [1, 2, 4, 5]
   *   // Object
   *   debug(remove({A: 1, B: 2, C: 3}, 2));         // {A: 1, C: 3}
   *   debug(remove({A: 1, B: 2, C: 3}, '3'));       // {A: 1, B: 2, C: 3}
   *   debug(remove({A: 1, B: 2, C: 3}, '3', true)); // {A: 1, B: 2}
   *   // Number
   *   debug(remove(1234512345, 2));                 // 134512345
   *   debug(remove(1234512345, 123));               // 4512345
   *
   *
   * @param  {*}       object   The target value.
   * @param  {*}       subject  The subject value.
   * @param  {Boolean} (loose)  Whether to use loose compare operator(==).
   *                              Default is strict operator(===).
   * @return {*}                The removed value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  remove : function(object, subject, loose) {
    var result, i, len, index, done = false;
    result = object;
    if (object != null) {
      switch (Pot.typeLikeOf(object)) {
        case 'string':
            result = object.replace(subject, '');
            break;
        case 'array':
            if (!loose && Pot.System.isBuiltinArrayIndexOf) {
              index = indexOf.call(object, subject);
              if (~index) {
                result = Pot.Struct.removeAt(object, index);
              }
              break;
            }
            result = [];
            len = object.length;
            for (i = 0; i < len; i++) {
              try {
                if (!done &&
                    ((!loose && object[i] === subject) ||
                     (loose  && object[i] ==  subject))) {
                  done = true;
                } else {
                  result[result.length] = object[i];
                }
              } catch (e) {}
            }
            break;
        case 'object':
            result = {};
            for (i in object) {
              if (hasOwnProperty.call(object, i)) {
                try {
                  if (!done &&
                      ((!loose && object[i] === subject) ||
                       (loose  && object[i] ==  subject))) {
                    done = true;
                  } else {
                    result[i] = object[i];
                  }
                } catch (e) {}
              }
            }
            break;
        case 'number':
            result = object.toString().replace(subject, '') - 0;
            break;
        default:
            result = object;
            break;
      }
    }
    return result;
  },
  /**
   * Return the copy object that was removed all subject value.
   *
   *
   * @example
   *   // String
   *   debug(removeAll('foo bar baz', 'o'));            // 'f bar baz'
   *   debug(removeAll('foo bar baz', 'ba'));           // 'foo r z'
   *   // Array
   *   debug(removeAll([1, 2, 3, 1, 2], 2));            // [1, 3, 1]
   *   debug(removeAll([1, 2, 3, 1, 2], '2'));          // [1, 2, 3, 1, 2]
   *   debug(removeAll([1, 2, 3, 1, 2], '2', true));    // [1, 3, 1]
   *   // Object
   *   debug(removeAll({A: 1, B: 2, C: 2}, 2));         // {A: 1}
   *   debug(removeAll({A: 1, B: 2, C: 2}, '2'));       // {A: 1, B: 2, C: 2}
   *   debug(removeAll({A: 1, B: 2, C: 2}, '2', true)); // {A: 1}
   *   // Number
   *   debug(removeAll(1234512345, 2));                 // 13451345
   *   debug(removeAll(1234512345, 123));               // 4545
   *
   *
   * @param  {*}       object   The target value.
   * @param  {*}       subject  The subject value.
   * @param  {Boolean} (loose)  Whether to use loose compare operator(==).
   *                              Default is strict operator(===).
   * @return {*}                The removed value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  removeAll : function(object, subject, loose) {
    var result, i, len;
    result = object;
    if (object != null) {
      switch (Pot.typeLikeOf(object)) {
        case 'string':
            if (Pot.isRegExp(subject)) {
              if (!subject.global) {
                subject = new RegExp(
                  subject.source,
                  'g' + (subject.ignoreCase ? 'i' : '') +
                        (subject.multiline  ? 'm' : '')
                );
              }
            } else {
              subject = new RegExp(rescape(subject), 'g');
            }
            result = object.replace(subject, '');
            break;
        case 'array':
            result = [];
            len = object.length;
            for (i = 0; i < len; i++) {
              try {
                if ((!loose && object[i] === subject) ||
                    (loose  && object[i] ==  subject)) {
                  continue;
                }
                result[result.length] = object[i];
              } catch (e) {}
            }
            break;
        case 'object':
            result = {};
            for (i in object) {
              if (hasOwnProperty.call(object, i)) {
                try {
                  if ((!loose && object[i] === subject) ||
                      (loose  && object[i] ==  subject)) {
                    continue;
                  }
                  result[i] = object[i];
                } catch (e) {}
              }
            }
            break;
        case 'number':
            result = object.toString().split(subject).join('') - 0;
            break;
        default:
            result = object;
            break;
      }
    }
    return result;
  },
  /**
   * Return the copy object that was removed a subject value.
   *
   *
   * @example
   *   // String
   *   debug(removeAt('foo bar baz', 2));         // 'fo bar baz'
   *   debug(removeAt('foo bar baz', 2, 5));      // 'fo baz'
   *   debug(removeAt('foo bar baz', 100));       // 'foo bar baz'
   *   // Array
   *   debug(removeAt([1, 2, 3, 4, 5], 2));       // [1, 2, 4, 5]
   *   debug(removeAt([1, 2, 3, 4, 5], 2, 2));    // [1, 2, 5]
   *   debug(removeAt([1, 2, 3, 4, 5], -1, 5));   // [1, 2, 3, 4]
   *   // Object
   *   debug(removeAt({A: 1, B: 2, C: 3}, 2));    // {A: 1, B: 2}
   *   debug(removeAt({A: 1, B: 2, C: 3}, 1, 5)); // {A: 1}
   *   debug(removeAt({A: 1, B: 2, C: 3}, 5));    // {A: 1, B: 2, C: 3}
   *   // Number
   *   debug(removeAt(1234512345, 2));            // 123451245
   *   debug(removeAt(1234512345, 2, 3));         // 1234545
   *   debug(removeAt(-1234512345, 2, 3));        // -1234545
   *
   *
   * @param  {*}        object   The target value.
   * @param  {Number}   index    The start index.
   * @param  {Number}  (length)  (Optional) The removal length (default=1).
   * @return {*}                 The removed value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  removeAt : function(object, index, length) {
    var result, me = arguments.callee, i, idx, len, n;
    result = object;
    if (object != null) {
      idx = index - 0;
      len = (length - 0) || 1;
      if (isNaN(idx)) {
        return result;
      }
      switch (Pot.typeLikeOf(object)) {
        case 'string':
            if (object) {
              if (idx >= 0 && len > 0) {
                if (idx === 0) {
                  result = object.substring(len);
                } else {
                  result = object.substring(0, idx) +
                          object.substring(idx + len);
                }
              }
            }
            break;
        case 'array':
            if (object.length) {
              result = arrayize(object);
              splice.call(result, idx, len);
            }
            break;
        case 'object':
            result = {};
            n = 0;
            for (i in object) {
              if (hasOwnProperty.call(object, i)) {
                if (n < idx || n > idx + len) {
                  try {
                    result[i] = object[i];
                  } catch (e) {}
                }
                n++;
              }
            }
            break;
        case 'number':
            minus = (object < 0);
            result = me(
              Math.abs(object).toString().split('').reverse().join(''),
              idx,
              len
            ).toString().split('').reverse().join('') - 0;
            if (minus) {
              result = -result;
            }
            break;
        default:
            result = object;
            break;
      }
    }
    return result;
  },
  /**
   * Compares two objects for equality.
   * If two objects have same length and same scalar value then
   *   will return true. Otherwise will return false.
   *
   *
   * @example
   *   var obj1 = {foo: 10, bar: 20, baz: 30};
   *   var obj2 = {foo: 10, bar: 20, baz: 30};
   *   var obj3 = {a: 'hoge', b: 'fuga'};
   *   debug(equals(obj1, obj2)); // true
   *   debug(equals(obj1, obj3)); // false
   *   var obj4 = {};
   *   var obj5 = {};
   *   debug(equals(obj4, obj5)); // true
   *
   *
   * @example
   *   var arr1 = [1, 2, 3];
   *   var arr2 = [1, 2, 3];
   *   var arr3 = [1, 2, 10];
   *   debug(equals(arr1, arr2)); // true
   *   debug(equals(arr1, arr3)); // false
   *   var arr4 = [];
   *   var arr5 = [];
   *   debug(equals(arr4, arr5)); // true
   *   var cmp = function(a, b) {
   *     return a == b ||
   *       String(a).toLowerCase() == String(b).toLowerCase();
   *   };
   *   var arr6 = [1, 2, 'foo', 'bar'];
   *   var arr7 = ['1', 2, 'FOO', 'baR'];
   *   debug(equals(arr6, arr7, cmp)); // true
   *
   *
   * @example
   *   var func1 = (function() {});
   *   var func2 = (function() {});
   *   var func3 = (function() { return this; });
   *   debug(equals(func1, func2)); // true
   *   debug(equals(func1, func3)); // false
   *
   *
   * @example
   *   var date1 = new Date();
   *   var date2 = new Date(date1.getTime());
   *   var date3 = new Date(date1.getTime() + 100);
   *   debug(equals(date1, date2)); // true
   *   debug(equals(date1, date3)); // false
   *
   *
   * @example
   *   var str1 = 'foobarbaz';
   *   var str2 = 'foobarbaz';
   *   var str3 = 'hoge';
   *   debug(equals(str1, str2)); // true
   *   debug(equals(str1, str3)); // false
   *
   *
   * @example
   *   var num1 = 12345;
   *   var num2 = 12345;
   *   var num3 = 12345.455512;
   *   var num4 = 12345.443556;
   *   var num5 = 12345.443556999;
   *   debug(equals(num1, num2)); // true
   *   debug(equals(num1, num3)); // false
   *   debug(equals(num3, num4)); // false
   *   debug(equals(num4, num5)); // true
   *
   *
   *
   * @param  {Array|Object|*}   object    The first object to compare.
   * @param  {Array|Object|*}   subject   The second object to compare.
   * @param  {Function}         (func)    (Optional) The comparison function.
   *                                        e.g. function(a, b) {
   *                                               return a == b;
   *                                             }
   *                                        Should take 2 arguments to compare,
   *                                        and return true if the arguments
   *                                        are equal.
   *                                        Defaults to which compares the
   *                                        elements using the
   *                                        built-in '===' operator.
   * @return {Boolean}                      Whether the two objects are equal.
   * @type  Function
   * @function
   * @static
   * @public
   */
  equals : function(object, subject, func) {
    var result = false, cmp, empty, keys, p, v, i, len, k;
    /**@ignore*/
    cmp = Pot.isFunction(func) ? func : (function(a, b) { return a === b; });
    if (object == null) {
      if (cmp(object, subject)) {
        result = true;
      }
    } else if (object === subject) {
      result = true;
    } else {
      switch (Pot.typeLikeOf(object)) {
        case 'array':
            if (subject && Pot.isArrayLike(subject)) {
              if (Pot.isEmpty(object) && Pot.isEmpty(subject)) {
                result = true;
              } else {
                result = false;
                each(object, function(v, i) {
                  if (!(i in subject) || !cmp(v, subject[i])) {
                    result = false;
                    throw Pot.StopIteration;
                  } else {
                    result = true;
                  }
                });
              }
            }
            break;
        case 'object':
            if (subject && Pot.isObject(subject)) {
              if (Pot.isEmpty(object) && Pot.isEmpty(subject)) {
                result = true;
              } else if (
                  (Pot.isDOMLike(object)  || !Pot.isPlainObject(object)) &&
                  (Pot.isDOMLike(subject) || !Pot.isPlainObject(subject))
              ) {
                result = (object === subject);
              } else {
                keys = [];
                for (p in subject) {
                  if (hasOwnProperty.call(subject, p)) {
                    keys[keys.length] = p;
                  }
                }
                len = keys.length;
                i = 0;
                result = true;
                for (p in object) {
                  if (hasOwnProperty.call(object, p)) {
                    if (!(i in keys) || keys[i] !== p) {
                      result = false;
                      break;
                    }
                    try {
                      v = object[p];
                      if (!cmp(v, subject[p])) {
                        result = false;
                        break;
                      }
                    } catch (e) {}
                    i++;
                  }
                }
              }
            }
            break;
        case 'string':
            if (Pot.isString(subject)) {
              if (cmp(object.toString(), subject.toString())) {
                result = true;
              }
            }
            break;
        case 'number':
            if (Pot.isNumber(subject)) {
              if (isNaN(object) && isNaN(subject)) {
                result = true;
              } else if (!isFinite(object) && !isFinite(subject)) {
                result = true;
              } else {
                if (Pot.isInt(subject)) {
                  if (cmp(object, subject)) {
                    result = true;
                  }
                } else {
                  if (Math.abs(object - subject) <= 0.000001) {
                    result = true;
                  }
                }
              }
            }
            break;
        case 'function':
            if (Pot.isFunction(subject)) {
              if (cmp(object.toString(), subject.toString()) &&
                  object.constructor === subject.constructor) {
                /**@ignore*/
                empty = function(a) {
                  for (k in a) {
                    return false;
                  }
                  return true;
                };
                if (empty(object) && empty(subject)) {
                  result = true;
                } else {
                  result = false;
                  each(object, function(v, k) {
                    if (!cmp(v, subject[k])) {
                      result = false;
                      throw Pot.StopIteration;
                    } else {
                      result = true;
                    }
                  });
                }
                if (result) {
                  if (empty(object.prototype) && empty(subject.prototype)) {
                    result = true;
                  } else {
                    result = false;
                    each(object.prototype, function(v, k) {
                      if (!cmp(v, subject.prototype[k])) {
                        result = false;
                        throw Pot.StopIteration;
                      } else {
                        result = true;
                      }
                    });
                  }
                }
              }
            }
            break;
        case 'boolean':
            if (Pot.isBoolean(subject)) {
              if (cmp(object != false, subject != false)) {
                result = true;
              }
            }
            break;
        case 'date':
            if (Pot.isDate(subject)) {
              if (cmp(object.getTime(), subject.getTime())) {
                result = true;
              }
            }
            break;
        case 'error':
            if (Pot.isError(subject)) {
              if ((('message' in object &&
                    cmp(object.message, subject.message)) ||
                   ('description' in object &&
                    cmp(object.description, subject.description))) &&
                    cmp(object.constructor, subject.constructor)) {
                result = true;
              }
            }
            break;
        case 'regexp':
            if (Pot.isRegExp(subject)) {
              if (cmp(object.toString(), subject.toString())) {
                result = true;
              }
            }
            break;
        default:
            if (Pot.typeOf(object) === Pot.typeOf(subject) &&
                cmp(object, subject)) {
              result = true;
            }
            break;
      }
    }
    return result;
  },
  /**
   * Reverse the object.
   *
   *
   * @example
   *   debug(reverse({foo: 1, bar: 2, baz: 3}));
   *   // @results {baz: 3, bar: 2, foo: 1}
   *
   *
   * @example
   *   debug(reverse([1, 2, 3, 4, 5]));
   *   // @results [5, 4, 3, 2, 1]
   *
   *
   * @example
   *   debug(reverse('123abc'));
   *   // @results 'cba321'
   *
   *
   * @param  {Object|Array|*}  o   A target object.
   * @return {Object|*}            The result object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  reverse : function(o) {
    var result, revs, i, p, val;
    switch (Pot.typeLikeOf(o)) {
      case 'object':
          result = {};
          revs = [];
          for (p in o) {
            try {
              if (hasOwnProperty.call(o, p)) {
                try {
                  val = o[p];
                } catch (ex) {
                  continue;
                }
                revs[revs.length] = [p, val];
              }
            } catch (e) {}
          }
          i = revs.length;
          while (--i >= 0) {
            result[revs[i][0]] = revs[i][1];
          }
          break;
      case 'array':
          try {
            if (Pot.isArray(o)) {
              result = o.reverse();
            } else {
              throw o;
            }
          } catch (e) {
            result = [];
            i = o.length;
            while (--i >= 0) {
              try {
                if (hasOwnProperty.call(o, i)) {
                  try {
                    val = o[i];
                  } catch (ex) {
                    continue;
                  }
                  result[result.length] = val;
                }
              } catch (err) {}
            }
          }
          break;
      case 'string':
          result = o.split('').reverse().join('');
          break;
      case 'number':
          result = -o;
          break;
      case 'boolean':
          result = (o == false);
          break;
      default:
          result = o;
          break;
    }
    return result;
  },
  /**
   * Flips the object.
   *
   *
   * @example
   *   debug(flip({foo: 'A', bar: 'B', baz: 'C'}));
   *   // @results {A: 'foo', B: 'bar', C: 'baz'}
   *
   *
   * @param  {Object|Array|*}  o   A target object.
   * @return {Object|*}            The result object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  flip : function(o) {
    var result, sc;
    switch (Pot.typeLikeOf(o)) {
      case 'object':
          result = {};
          each(o, function(v, k) {
            if (hasOwnProperty.call(o, k)) {
              result[stringify(v, true)] = k;
            }
          });
          break;
      case 'array':
          result = [];
          each(o, function(v, i) {
            if (Pot.isNumeric(v)) {
              result[(v - 0)] = i;
            }
          });
          break;
      case 'string':
          result = '';
          sc = String.fromCharCode;
          each(o.split(''), function(c) {
            result += sc(
              c.charCodeAt(0) ^ 0xFFFF
            );
          });
          break;
      case 'number':
          result = ~o;
          break;
      case 'boolean':
          result = (o == false);
          break;
      default:
          result = o;
          break;
    }
    return result;
  },
  /**
   * Shuffle an object and returns it.
   * This function keeps the original object intact.
   *
   *
   * @example
   *   debug(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]));
   *   // @results  e.g. (uncertain)
   *   //   [8, 1, 6, 4, 3, 5, 2, 7, 9]
   *   //
   *   debug(shuffle(['foo', 'bar', 'baz']));
   *   // @results  e.g.
   *   //   ['bar', 'foo', 'baz']
   *   //
   *   debug(shuffle(12345));
   *   // @results  e.g.
   *   //   25143
   *   //
   *   debug(shuffle(-123456789.0839893));
   *   // @results  e.g.
   *   //   -276195348.9908833
   *   //
   *   debug(shuffle({a: 1, b: 2, c: 3, d: 4, e: 5}));
   *   // @results  e.g.
   *   //   {c: 3, b: 2, d: 4, e: 5, a: 1}
   *   //
   *   debug(shuffle('abcdef12345'));
   *   // @results  e.g.
   *   //   'ae2d135cb4f'
   *   //
   *
   *
   * @param  {Array}  array  A target array.
   * @return {Array}         An array of result.
   * @type  Function
   * @function
   * @static
   * @public
   */
  shuffle : function(o) {
    var result, i, j, tmp, points, sign, Struct = Pot.Struct;
    if (Pot.isArray(o)) {
      result = o.slice();
      i = result.length;
      while (i > 0) {
        j = Math.floor(Math.random() * i);
        tmp = result[--i];
        result[i] = result[j];
        result[j] = tmp;
      }
    } else if (o && Pot.isObject(o)) {
      result = Struct.tuple(Struct.shuffle(Pot.items(o)));
    } else if (o && Pot.isString(o)) {
      result = Struct.shuffle(o.split('')).join('');
    } else if (Pot.isNumber(o) && Pot.isNumeric(o)) {
      sign = ((o - 0) < 0) ? '-' : '';
      points = Math.abs(o).toString().split('.');
      result = Struct.shuffle(points.shift());
      if (points.length) {
        result += '.' + Struct.shuffle(points.pop());
      }
      result = result - 0;
      if (sign) {
        result = -result;
      }
    } else {
      result = o;
    }
    return result;
  },
  /**
   * Fill the first argument value with in the specific value.
   * The available first argument types are Array and String, and Object.
   *
   *
   * @example
   *   debug(fill([1, 2], 3, 5));
   *   // @results [1, 2, 3, 3, 3, 3, 3]
   *   debug(fill([], null, 3));
   *   // @results [null, null, null]
   *   debug(fill('foo', 'o', 10));
   *   // @results 'foooooooooooo'
   *   debug(fill('', 'hoge', 5));
   *   // @results 'hogehogehogehogehoge'
   *   debug(fill({}, 2, 5));
   *   // @results {'0': 2, '1': 2, '2': 2, '3': 2, '4': 2}
   *   debug(fill({a: 1, b: 2, c: 3}, null));
   *   // @results {a: null, b: null, c: null}
   *   debug(fill(100, 5, 10));
   *   // @results 5555555555100
   *
   *
   * @param  {Array|String|Object|Number|*}  defaults  The default value.
   *                                                   This object value does
   *                                                     not replace. use
   *                                                     returned value.
   * @param  {*}                             value     The value to fill
   *                                                     the object.
   * @param  {Number}                        count     The number of times to
   *                                                     fill the object.
   * @return {Array|String|Object|Number|*}            The result of filled.
   * @type  Function
   * @function
   * @static
   * @public
   */
  fill : function(defaults, value, count) {
    var result = null, args = arguments, i, j, val;
    if (args.length === 2) {
      count = value;
      value = defaults;
      switch (Pot.typeLikeOf(defaults)) {
        case 'string':
            defaults = '';
            break;
        case 'object':
            defaults = value;
            value = count;
            count = 0;
            break;
        case 'number':
            defaults = 0;
            break;
        case 'array':
            if (defaults.length === 1) {
              value = defaults[0];
            }
            defaults = [];
            break;
        default:
            break;
      }
    }
    if (Pot.isNumeric(count) || Pot.isObject(defaults)) {
      i = Math.floor(count - 0);
      switch (Pot.typeLikeOf(defaults)) {
        case 'array':
            result = arrayize(defaults);
            while (--i >= 0) {
              result[result.length] = value;
            }
            break;
        case 'string':
            result = stringify(defaults);
            val = stringify(value);
            while (--i >= 0) {
              result += val;
            }
            break;
        case 'object':
            result = {};
            each(defaults, function(v, k) {
              result[k] = value;
            });
            if (i) {
              j = 0;
              while (--i >= 0) {
                result[j++] = value;
              }
            }
            break;
        case 'number':
            result = ((defaults - 0) || 0).toString();
            val = Math.floor(Math.abs((value - 0) || 0)).toString();
            while (--i >= 0) {
              result = val + result;
            }
            result = result - 0;
            break;
        default:
            result = defaults;
            break;
      }
    }
    return result;
  },
  /**
   * Return a string that is joined by the object keys and values.
   *
   * Arguments can passed in any order.
   * (The first will be the `delimiter` as a string).
   *
   * If the `tail` is given as string
   *   then will be append the `tail` itself to string.
   *
   *
   * @example
   *   debug(implode({color: 'blue', margin: '5px'}, ':', ';', true));
   *   // @results 'color:blue;margin:5px;'
   *
   *
   * @example
   *   //
   *   // Arguments can passed in any order.
   *   // (The first will be the `delimiter` as a string).
   *   //
   *   debug(implode('+', {a: 1, b: 2, c: 3}, '*'));
   *   // @results 'a+1*b+2*c+3'
   *
   *
   * @example
   *   //
   *   // If the `tail` is given as string
   *   //  then will be append the `tail` itself to string.
   *   //
   *   debug(implode('>>', {a: 1, b: 2, c: 3}, '^', '==?'));
   *   // @results 'a>>1^b>>2^c>>3==?'
   *
   *
   * @param  {Object}   object      The target object.
   * @param  {String}  (delimiter)  The combining character of each
   *                                  property name and value.
   *                                  (default = ':').
   * @param  {String}  (separator)  The character string that
   *                                  will be combined by
   *                                  the following property and
   *                                  previous property.
   *                                  (default = ',').
   * @param  {Boolean} (tail)       If given "true" then will put
   *                                  `separator` to the end of the string.
   * @return {String}               The combined string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  implode : function(object/*[, delimiter[, separator[, tail]]]*/) {
    var
    result = '', ins = [], p, d, s, o, t, nop,
    args = arguments, len = args.length, i, v, params,
    isString = Pot.isString, isObject = Pot.isObject,
    defs = {
      delimiter : ':',
      separator : ','
    };
    for (i = 0; i < len; i++) {
      if (!o && isObject(args[i])) {
        o = args[i];
      } else if (!d && isString(args[i])) {
        d = args[i];
      } else if (!s && isString(args[i])) {
        s = args[i];
      } else if (isObject(o) && isString(d) && isString(s)) {
        t = args[i];
      } else if (!params && isObject(o) && isObject(args[i]) &&
                 (args[i].delimiter || args[i].separator || args[i].tail)) {
        params = args[i];
        d = d || stringify(params.delimiter, true);
        s = s || stringify(params.separator, true);
        t = t || params.tail;
      }
    }
    if (o && isObject(o)) {
      if (d === nop) {
        d = defs.delimiter;
      }
      if (s === nop) {
        s = defs.separator;
      }
      for (p in o) {
        try {
          v = o[p];
        } catch (e) {
          continue;
        }
        ins[ins.length] = p + d + stringify(v);
      }
      result = ins.join(s);
      if (t) {
        result += isString(t) ? t : s;
      }
    }
    return result;
  },
  /**
   * Separate a string by specified delimiter and separator,
   *   then returns  a converted object.
   * This function works like the opposite "implode".
   *
   * @see Pot.Struct.implode
   *
   *
   * @example
   *   var string = 'color:blue;margin:5px;';
   *   var result = explode(string, ':', ';');
   *   debug(result);
   *   // @results {color: 'blue', margin: '5px'}
   *
   *
   * @example
   *   var string = 'foo=1&bar=2&baz=3';
   *   var result = explode(string, {delimiter: '=', separator: '&'});
   *   debug(result);
   *   // @results {foo: '1', bar: '2', baz: '3'}
   *
   *
   * @example
   *   var string = 'A : 1, B:2, C: 3;';
   *   var result = explode(string, {
   *         delimiter : /(?:\s*:\s*)/,
   *         separator : /(?:\s*[,;]\s*)/
   *   });
   *   debug(result);
   *   // @results {A: '1', B: '2', C: '3'}
   *
   *
   * @param  {String}          string      The subject string.
   * @param  {String|RegExp}  (delimiter)  The split character of each
   *                                         property name and value.
   *                                         (default = ':').
   * @param  {String|RegExp}  (separator)  The character string that
   *                                         will be split by
   *                                         the following property and
   *                                         previous property.
   *                                         (default = ',').
   * @return {Object}                      The result object that
   *                                         separated from a string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  explode : function(string/*[, delimiter[, separator]]*/) {
    var
    result = {}, args = arguments, argn = args.length, nop,
    s, delim, sep, n, params,
    isObject = Pot.isObject,
    isString = Pot.isString,
    isRegExp = Pot.isRegExp,
    defaults = {
      delimiter : ':',
      separator : ','
    };
    for (n = 0; n < argn; n++) {
      if (isObject(args[n]) &&
          (args[n].delimiter || args[n].separator)) {
        params = args[n];
        delim = delim || params.delimiter;
        sep   = sep   || params.separator;
      } else if (!s && isString(args[n])) {
        s = args[n];
      } else if (!delim && (isString(args[n]) || isRegExp(args[n]))) {
        delim = args[n];
      } else if (!sep && (isString(args[n]) || isRegExp(args[n]))) {
        sep = args[n];
      }
    }
    s = stringify(s);
    if (s) {
      if (delim === nop) {
        delim = defaults.delimiter;
      }
      if (sep === nop) {
        sep = defaults.separator;
      }
      each(s.split(sep), function(unit) {
        var parts, i, len;
        if (unit) {
          parts = unit.split(delim);
          len = parts.length;
          i = 0;
          do {
            result[stringify(parts[i++], true)] = parts[i++];
          } while (i < len);
        }
      });
    }
    return result;
  },
  /**
   * Joins the all arguments to a string.
   *
   *
   * @example
   *   debug(glue([1, 2, 3, 4, 5]));
   *   // @results '12345'
   *   debug(glue('foo', 'bar', 'baz'));
   *   // @results 'foobarbaz'
   *   debug(glue(1, [2, 3, ['foo']], ['bar', 'baz']));
   *   // @results '123foobarbaz'
   *
   *
   * @param  {Array|...*}  args  The target items.
   * @return {String}            The joined string from array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  glue : function() {
    var result = '', args = arguments, arg, flatten = Pot.Collection.flatten;
    switch (args.length) {
      case 0:
          break;
      case 1:
          arg = args[0];
          if (Pot.isArray(arg)) {
            result = flatten(arg).join('');
          } else if (Pot.isObject(arg) || Pot.isArrayLike(arg)) {
            each(arg, function(v) {
              result += stringify(v);
            });
          } else {
            result = stringify(arg);
          }
          break;
      default:
          result = flatten(arrayize(args)).join('');
          break;
    }
    return result;
  },
  /**
   * Clears the object that is any types.
   *
   *
   * @example
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   clearObject(obj);
   *   debug(obj);
   *   // @results  obj = {}
   *   var arr = [1, 2, 3, 4, 5];
   *   clearObject(arr);
   *   debug(arr);
   *   // @results  arr = []
   *
   *
   * @param  {*}   o   A target object.
   * @return {*}       Return argument `o`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  clearObject : function(o) {
    var p;
    if (o) {
      if (Pot.isArrayLike(o)) {
        p = o.length;
        while (--p >= 0) {
          try {
            delete o[p];
          } catch (e) {}
        }
        try {
          o.length = 0;
        } catch (e) {}
      } else if (Pot.isObject(o)) {
        for (p in o) {
          try {
            delete o[p];
          } catch (e) {}
        }
      } else {
        o = null; // noop
      }
    }
    return o;
  }
});

// Update Pot object.
Pot.update({
  invoke      : Pot.Struct.invoke,
  clone       : Pot.Struct.clone,
  bind        : Pot.Struct.bind,
  partial     : Pot.Struct.partial,
  keys        : Pot.Struct.keys,
  values      : Pot.Struct.values,
  tuple       : Pot.Struct.tuple,
  unzip       : Pot.Struct.unzip,
  pairs       : Pot.Struct.pairs,
  count       : Pot.Struct.count,
  first       : Pot.Struct.first,
  firstKey    : Pot.Struct.firstKey,
  last        : Pot.Struct.last,
  lastKey     : Pot.Struct.lastKey,
  contains    : Pot.Struct.contains,
  remove      : Pot.Struct.remove,
  removeAll   : Pot.Struct.removeAll,
  removeAt    : Pot.Struct.removeAt,
  equals      : Pot.Struct.equals,
  reverse     : Pot.Struct.reverse,
  flip        : Pot.Struct.flip,
  shuffle     : Pot.Struct.shuffle,
  fill        : Pot.Struct.fill,
  implode     : Pot.Struct.implode,
  explode     : Pot.Struct.explode,
  glue        : Pot.Struct.glue,
  clearObject : Pot.Struct.clearObject
});

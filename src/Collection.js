//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Collection.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Collection.
   * Array utilities.
   *
   * Treated as an array of arguments given then
   *  return it as an array.
   *
   * @see Pot.Collection.arrayize
   *
   * @param  {*}       object   A target object.
   * @param  {Number}  (index)  Optional, The first index to
   *                              slice the array.
   * @return {Array}            Return an array of result.
   *
   * @name Pot.Collection
   * @type Function
   * @function
   * @class
   * @static
   * @public
   */
  Collection : function(/*object[, index]*/) {
    return arrayize.apply(null, arguments);
  }
});

update(Pot.Collection, {
  /**
   * @lends Pot.Collection
   */
  /**
   * Treated as an array of arguments given then
   *  return it as an array.
   *
   *
   * @example
   *   debug(arrayize(null));               // [null]
   *   debug(arrayize((void 0)));           // [undefined]
   *   debug(arrayize(true));               // [true]
   *   debug(arrayize(false));              // [false]
   *   debug(arrayize(new Boolean(true)));  // [Boolean(false)]
   *   debug(arrayize(Boolean));            // [Boolean]
   *   debug(arrayize(''));                 // ['']
   *   debug(arrayize('hoge'));             // ['hoge']
   *   debug(arrayize(new String('hoge'))); // [String {'hoge'}]
   *   debug(arrayize(String));             // [String]
   *   debug(arrayize(100));                // [100]
   *   debug(arrayize(-100));               // [-100]
   *   debug(arrayize(NaN));                // [NaN]
   *   debug(arrayize(12410.505932095032)); // [12410.505932095032]
   *   debug(arrayize(new Number(100)));    // [Number {100}]
   *   debug(arrayize(Number));             // [Number]
   *   debug(arrayize(Error('error')));     // [Error {'error'}]
   *   debug(arrayize(new Error('error'))); // [Error {'error'}]
   *   debug(arrayize(Error));              // [Error]
   *   debug(arrayize(/(foo|bar)/i));       // [/(foo|bar)/i]
   *   debug(arrayize(new RegExp('hoge'))); // [/hoge/]
   *   debug(arrayize(new RegExp()));       // [/(?:)/]
   *   debug(arrayize(RegExp));             // [RegExp]
   *   debug(arrayize(TypeError));          // [TypeError]
   *   debug(arrayize(encodeURI));          // [encodeURI]
   *   debug(arrayize(window));             // [window]
   *   debug(arrayize(document));           // [document]
   *   debug(arrayize(document.body));      // [body]
   *   debug(arrayize([]));                 // []
   *   debug(arrayize(new Array(1, 2, 3))); // [1, 2, 3]
   *   debug(arrayize([1, 2, 3]));          // [1, 2, 3]
   *   debug(arrayize(Array));              // [Array]
   *   debug(arrayize(Array.prototype));    // [Array.prototype]
   *   debug(arrayize([[]]));               // [[]]
   *   debug(arrayize([[100]]));            // [[100]]
   *   debug(arrayize({}));                 // [{}]
   *   debug(arrayize({foo: 'bar'}));       // [{foo: 'bar'}]
   *   debug(arrayize(new Object()));       // [Object {}]
   *   debug(arrayize(new Object('foo')));  // [Object {'foo'}]
   *   debug(arrayize(Object));             // [Object]
   *   debug(arrayize(document.getElementsByTagName('div')));
   *   // @results  [<div/>, <div/>, <div/> ...]
   *   (function(a, b, c) {
   *     debug(arrayize(arguments));
   *     // @results  [1, 2, 3]
   *   })(1, 2, 3);
   *   (function(a, b, c) {
   *     debug(arrayize(arguments, 2));
   *     // @results  [3]
   *   })(1, 2, 3);
   *
   *
   * @param  {*}       object   A target object.
   * @param  {Number}  (index)  Optional, The first index to
   *                              slice the array.
   * @return {Array}            Return an array of result.
   * @type Function
   * @function
   * @public
   * @static
   */
  arrayize : arrayize,
  /**
   * Merge some arrays or objects to base object.
   * The type of first argument will be to base type.
   *
   *
   * @example
   *   var array1 = [1, 2, 3];
   *   var array2 = [4, 5, 6];
   *   var result = merge(array1, array2);
   *   debug(result);
   *   // @results  [1, 2, 3, 4, 5, 6]
   *   var result = merge([], 1, 2, 'foo', {bar: 3});
   *   debug(result);
   *   // @results  [1, 2, 'foo', {bar: 3}]
   *
   *
   * @example
   *   var obj1 = {foo: 1, bar: 2};
   *   var obj2 = {baz: 3};
   *   var result = merge(obj1, obj2);
   *   debug(result);
   *   // @results  {foo: 1, bar: 2, baz: 3}
   *   var result = merge({}, {foo: 1}, {bar: 2});
   *   debug(result);
   *   // @results  {foo: 1, bar: 2}
   *
   *
   * @example
   *   var s1 = 'foo';
   *   var s2 = 'bar';
   *   var result = merge(s1, s2);
   *   debug(result);
   *   // @results  'foobar'
   *
   *
   * @param  {Array|*}  (...)  Array(s) to merge.
   * @return {Array|*}         Result of merged.
   * @type  Function
   * @function
   * @static
   * @public
   */
  merge : function(/*[...args]*/) {
    var result = null, args = arrayize(arguments), arg = args[0];
    switch (args.length) {
      case 0:
          break;
      case 1:
          result = arrayize(arg);
          break;
      default:
          if (Pot.isArrayLike(arg)) {
            result = concat.apply([], args);
          } else if (Pot.isObject(arg)) {
            args.unshift({});
            result = update.apply(null, args);
          } else if (Pot.isString(arg)) {
            result = Array.prototype.join.call(args, '');
          } else {
            result = args;
          }
          break;
    }
    return result;
  },
  /**
   * Returns an array with the given unique array.
   * Keep order without sorting.
   *
   *
   * @example
   *   debug(unique(
   *               [1, 2, 3, 4, 5, 3, 5, 'a', 3, 'b', 'a', 'c', 2, 5]
   *   ));
   *   // @results [1, 2, 3, 4, 5, 'a', 'b', 'c']
   *
   * @example
   *   debug(unique(
   *               [5, 7, 8, 3, 6, 1, 7, 2, 3, 8, 4, 2, 9, 5]
   *   ));
   *   // @results [5, 7, 8, 3, 6, 1, 2, 4, 9]
   *
   * @example
   *   debug(unique(
   *               ['1', 1, '2', 2, 0, '0', '', null, false, (void 0)],
   *               true
   *   ));
   *   // @results ['1', '2', 0, null]
   *
   * @example
   *   debug(unique(
   *               ['abc', 'ABC', 'Foo', 'bar', 'foO', 'BaR'],
   *               false, true
   *   ));
   *   // @results ['abc', 'Foo', 'bar']
   *
   *
   * @example
   *   debug(unique(
   *               {a: 1, b: 2, c: 3, d: 1, e: 3, f: 2}
   *   ));
   *   // @results {a: 1, b: 2, c: 3}
   *
   * @example
   *   debug(unique(
   *               {foo: 1, bar: 2, FOo: 3, Bar: '1', baZ: '2'},
   *               true, true
   *   ));
   *   // @results {foo: 1, bar: 2, FOo: 3}
   *
   * @example
   *   debug(unique(
   *               {a: 1, b: 2, c: 3, d: '1', e: '3', f: 5},
   *               true
   *   ));
   *   // @results {a: 1, b: 2, c: 3, f: 5}
   *
   *
   * @example
   *   debug(unique('abcABCabc-----foobarBaZ'));
   *   // @results  'abcABC-forZ'
   *   debug(unique('abcABCabc-----foobarBaZ', true, true));
   *   // @results  'abc-forZ'
   *
   *
   * @example
   *   debug(unique(
   *                [1, 1, [123], (function(a) { return a;}),
   *                 [123], {a: 5}, (function(a) { return a; }), {a: 5}]
   *   ));
   *   // @results  [1, [123], (function() { return a; }), {a: 5}]
   *
   *
   * @param  {Array|Object|String|*}  object   Target object.
   *                                             (no change in this object).
   * @param  {Boolean}                (loose)  If passed TRUE then
   *                                             will be compared by
   *                                             loose operator (==),
   *                                             the default is
   *                                             strict comparison (===).
   * @param  {Boolean}           (ignoreCase)  If passed TRUE then will be
   *                                             ignored case sensitive.
   * @return {Array|Object|String|*}           Array with unique values.
   * @type  Function
   * @function
   * @static
   * @public
   */
  unique : (function() {
    var
    iCase, useStrict,
    /**@ignore*/
    cmpCase = function (c1, c2) {
      var value1, value2;
      if (iCase &&
          c1 != null && c1.toLowerCase &&
          c2 != null && c2.toLowerCase) {
        value1 = c1.toLowerCase();
        value2 = c2.toLowerCase();
      } else {
        value1 = c1;
        value2 = c2;
      }
      return useStrict && value1 === value2 || value1 == value2;
    },
    /**@ignore*/
    cmp = function(a, b) {
      var v1, v2;
      if (iCase) {
        v1 = stringify(a).toLowerCase();
        v2 = stringify(b).toLowerCase();
      } else {
        v1 = a;
        v2 = b;
      }
      if (useStrict && v1 === v2 || v1 == v2) {
        return true;
      } else if (Pot.Struct && Pot.Struct.equals) {
        return Pot.Struct.equals(a, b, cmpCase);
      } else {
        return false;
      }
    };
    return function(object, loose, ignoreCase) {
      var results = [], args = arguments, me = args.callee, i, j, len,
          array, dups = [];
      args = arrayize(args);
      useStrict = !loose;
      iCase = !!ignoreCase;
      if (object) {
        if (Pot.isArray(object)) {
          len = object.length;
          if (len) {
            for (i = 0; i < len; i++) {
              for (j = i + 1; j < len; j++) {
                try {
                  if (cmp(object[i], object[j])) {
                    dups[j] = i;
                  }
                } catch (e) {}
              }
              if (!(i in dups)) {
                try {
                  results[results.length] = object[i];
                } catch (e) {}
              }
            }
          }
        } else if (Pot.isObject(object)) {
          results = {};
          array = [];
          each(object, function(val, key) {
            array[array.length] = [key, val];
          });
          len = array.length;
          for (i = 0; i < len; i++) {
            for (j = i + 1; j < len; j++) {
              try {
                if (cmp(array[i][1], array[j][1])) {
                  dups[j] = i;
                }
              } catch (e) {}
            }
            if (!(i in dups)) {
              try {
                results[array[i][0]] = array[i][1];
              } catch (e) {}
            }
          }
        } else if (Pot.isString(object)) {
          args[0] = object.split('');
          results = me.apply(null, args).join('');
        } else {
          results = object;
        }
      }
      return results;
    };
  })(),
  /**
   * Convert to one-dimensional array from multi-dimensional array.
   *
   *
   * @example
   *   debug(flatten(
   *               [1,2,3,[4,5,6,[7,8,[9],10],11],12]
   *   ));
   *   // @results [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
   *
   *
   * @param  {Array}   array   A target array.
   * @return {Array}           An array which has only one dimension.
   * @type  Function
   * @function
   * @static
   * @public
   */
  flatten : function(array) {
    var results = [], me = arguments.callee,
        i, len, item, items, isArray = Pot.isArray;
    if (!isArray(array)) {
      results[results.length] = array;
    } else {
      items = arrayize(array);
      len = items.length;
      for (i = 0; i < len; i++) {
        item = items[i];
        if (isArray(item)) {
          push.apply(results, me(item));
        } else {
          results[results.length] = item;
        }
      }
    }
    return results;
  },
  /**
   * Sorting with humaneness. (natural sort)
   *
   * Based: alphanum-sorting library that is below link.
   * @link http://www.davekoelle.com/alphanum.html
   *
   *
   * @example
   *   debug(alphanumSort(
   *               ['a10', 'a2', 'a100', 'a1', 'a12']
   *   ));
   *   // @results ['a1', 'a2', 'a10', 'a12', 'a100']
   *
   *
   * @param  {Array}  array  A target array.
   * @return {Array}         An array of result `array`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  alphanumSort : (function() {
    /**@ignore*/
    function chunkify(t) {
      var tz = [], x = 0, y = -1, n = 0, i, j, m;
      while ((i = (j = t.charAt(x++)).charCodeAt(0))) {
        m = (i == 46 || (i >= 48 && i <= 57));
        if (m !== n) {
          tz[++y] = '';
          n = m;
        }
        tz[y] += j;
      }
      return tz;
    }
    /**@ignore*/
    function alphanumCase(a, b) {
      var aa, bb, c, d, i;
      aa = chunkify(stringify(a).toLowerCase());
      bb = chunkify(stringify(b).toLowerCase());
      for (i = 0; (aa[i] && bb[i]); i++) {
        if (aa[i] !== bb[i]) {
          c = +aa[i];
          d = +bb[i];
          if (c == aa[i] && d == bb[i]) {
            return c - d;
          } else {
            return (aa[i] > bb[i]) ? 1 : -1;
          }
        }
      }
      return aa.length - bb.length;
    }
    return function(array) {
      if (Pot.isArray(array)) {
        array.sort(alphanumCase);
      }
      return array;
    };
  })()
});

// Update Pot object,
Pot.update({
  arrayize     : Pot.Collection.arrayize,
  merge        : Pot.Collection.merge,
  unique       : Pot.Collection.unique,
  flatten      : Pot.Collection.flatten,
  alphanumSort : Pot.Collection.alphanumSort
});

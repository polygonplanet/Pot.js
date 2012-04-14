//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Serializer.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Serializer.
   *
   * Provides the JSON.stringify and the JSON.parse methods.
   * If JSON object is in Built-in then will use native method.
   *
   * @name  Pot.Serializer
   * @type  Object
   * @class
   * @public
   * @static
   */
  Serializer : {}
});

(function() {
  var NULL, JSONSerializer;
  if (typeof JSON === 'object' &&
      Pot.isBuiltinMethod(JSON.stringify) &&
      Pot.isBuiltinMethod(JSON.parse)
  ) {
    update(Pot.Serializer, {
      /**@ignore*/
      serializeToJSON : function() {
        return JSON.stringify.apply(null, arguments);
      },
      /**@ignore*/
      parseFromJSON : function() {
        return JSON.parse.apply(null, arguments);
      }
    });
    return;
  }
  NULL = 'null';
  JSONSerializer = update(function() {}, {
    /**@ignore*/
    charsCache : {
      '\"'   : '\\"',
      '\\'   : '\\\\',
      '/'    : '\\/',
      '\b'   : '\\b',
      '\f'   : '\\f',
      '\n'   : '\\n',
      '\r'   : '\\r',
      '\t'   : '\\t',
      '\x0B' : '\\u000B'
    },
    /**@ignore*/
    replaceTo : /\uFFFF/.test('\uFFFF')      ?
                /[\\\"\x00-\x1F\x7F-\uFFFF]/g :
                /[\\\"\x00-\x1F\x7F-\xFF]/g
  });
  /**
   * @private
   * @ignore
   */
  JSONSerializer.prototype = update(JSONSerializer.prototype, {
    /**
     * @private
     * @ignore
     */
    serialize : function(object) {
      var json = [];
      this.serializeAll(object, json);
      return json.join('');
    },
    /**
     * @private
     * @ignore
     */
    serializeAll : function(object, json) {
      if (object == null) {
        json[json.length] = NULL;
      } else {
        switch (typeOf(object)) {
          case 'string':
              this.serializeString(object, json);
              break;
          case 'number':
              this.serializeNumber(object, json);
              break;
          case 'boolean':
              json[json.length] = (object == true) ? 'true' : 'false';
              break;
          case 'array':
              this.serializeArray(object, json);
              break;
          case 'object':
          case 'error':
              this.serializeObject(object, json);
              break;
          case 'date':
              this.serializeDate(object, json);
              break;
          case 'regexp':
              this.serializeString(object.toString(), json);
              break;
          case 'function':
              break;
          default:
              json[json.length] = NULL;
        }
      }
    },
    /**
     * @private
     * @ignore
     */
    padZero : function(n) {
      return (n < 10) ? '0' + n : n;
    },
    /**
     * @private
     * @ignore
     */
    serializeDate : function(d, json) {
      var pad = this.padZero;
      result = isFinite(d.valueOf())   ? '"' +
              d.getUTCFullYear()       + '-' +
              pad(d.getUTCMonth() + 1) + '-' +
              pad(d.getUTCDate())      + 'T' +
              pad(d.getUTCHours())     + ':' +
              pad(d.getUTCMinutes())   + ':' +
              pad(d.getUTCSeconds())   + 'Z' + '"' : NULL;
      json[json.length] = result;
    },
    /**
     * @private
     * @ignore
     */
    serializeString : function(s, json) {
      var cs = s.replace(JSONSerializer.replaceTo, function(c) {
        var cc, rv;
        if (c in JSONSerializer.charsCache) {
          return JSONSerializer.charsCache[c];
        }
        cc = c.charCodeAt(0);
        rv = '\\u';
        if (cc < 16) {
          rv += '000';
        } else if (cc < 256) {
          rv += '00';
        } else if (cc < 4096) {
          rv += '0';
        }
        rv = rv + cc.toString(16);
        JSONSerializer.charsCache[c] = rv;
        return rv;
      });
      json[json.length] = '"' + cs + '"';
    },
    /**
     * @private
     * @ignore
     */
    serializeNumber : function(n, json) {
      json[json.length] = (isFinite(n) && !isNaN(n)) ? n : NULL;
    },
    /**
     * @private
     * @ignore
     */
    serializeArray : function(a, json) {
      var len, sep = '', i, ok, val;
      len = a && a.length;
      json[json.length] = '[';
      for (i = 0; i < len; i++) {
        ok = true;
        try {
          val = a[i];
        } catch (e) {
          ok = false;
        }
        if (ok) {
          json[json.length] = sep;
          this.serializeAll(val, json);
          sep = ',';
        }
      }
      json[json.length] = ']';
    },
    /**
     * @private
     * @ignore
     */
    serializeObject : function(o, json) {
      var sep = '', key, ok, value;
      json[json.length] = '{';
      for (key in o) {
        ok = true;
        if (hasOwnProperty.call(o, key)) {
          try {
            value = o[key];
            if (isFunction(value)) {
              throw value;
            }
          } catch (e) {
            ok = false;
          }
          if (ok) {
            json[json.length] = sep;
            this.serializeString(key, json);
            json[json.length] = ':';
            this.serializeAll(value, json);
            sep = ',';
          }
        }
      }
      json[json.length] = '}';
    }
  });
  update(Pot.Serializer, {
    /**
     * @lends Pot.Serializer
     */
    /**
     * `serializeToJSON` will convert any object to a stringify JSON.
     *
     * Arguments `replacer` and `space` are unimplemented.
     *
     *
     * @example
     *   debug(serializeToJSON(100));
     *   // @results "100"
     *   debug(serializeToJSON('100'));
     *   // @results "\"100\""
     *   debug(serializeToJSON('hoge'));
     *   // @results "\"hoge\""
     *   debug(serializeToJSON(null));
     *   // @results "null"
     *   debug(serializeToJSON(true));
     *   // @results "true"
     *   debug(serializeToJSON(false));
     *   // @results "false"
     *   debug(serializeToJSON('Hello\nWorld!\n'));
     *   // @results "\"Hello\\nWorld!\\n\""
     *   debug(serializeToJSON([1, 2, 3]));
     *   // @results "[1,2,3]"
     *   debug(serializeToJSON([1E1, '(///"v"///)']));
     *   // @results "[10,\"(///\\\"v\\\"///)\"]"
     *   debug(serializeToJSON({'Hello\nWorld!': [1, {a: '{ABC}'}]}));
     *   // @results "{\"Hello\\nWorld!\":[1,{\"a\":\"{ABC}\"}]}"
     *   debug(serializeToJSON({key1: function() {}, key2: new Date()}));
     *   // @results "{\"key2\":\"2011-08-30T16:32:28Z\"}"
     *
     *
     * @param  {*}              value      A target object.
     * @param  {Function}      (replacer)  (Optional) Unimplemented.
     * @param  {Number|String} (space)     (Optional) Indent.
     * @return {String}                    Return a JSON object as string.
     * @type   Function
     * @function
     * @static
     * @public
     */
    serializeToJSON : function(value/*[, replacer[, space]]*/) {
      return (new JSONSerializer()).serialize(value);
    },
    /**
     * `parseFromJSON` will parse a JSON object and convert to any object.
     *
     * Argument `reviver` is unimplemented.
     *
     *
     * @example
     *   debug(parseFromJSON('"hoge"'));
     *   // @results 'hoge'
     *   debug(parseFromJSON('null'));
     *   // @results null
     *   debug(parseFromJSON('true'));
     *   // @results true
     *   debug(parseFromJSON('false'));
     *   // @results false
     *   debug(parseFromJSON('"Hello\\u000aWorld!\\u000a"'));
     *   // @results 'Hello\nWorld!\n'
     *   debug(parseFromJSON('[1,2,3]'));
     *   // @results [1,2,3]
     *   debug(parseFromJSON('[1E1,"(///\\"v\\"///)"]'));
     *   // @results [10,'(///"v"///)']
     *   debug(parseFromJSON('{"Hello\\u000aWorld!":[1,{"a":"{ABC}"}]}'));
     *   // @results {'Hello\nWorld!':[1,{a:'{ABC}'}]}
     *   debug(parseFromJSON('{"key1":"12345","key2":null}'));
     *   // @results {key1:'12345',key2:null}
     *
     *
     * @param  {String}    text      A target JSON string object.
     * @param  {*}        (reviver)  (Optional) Unimplemented.
     * @return {*}                   Return the parsed object.
     * @type   Function
     * @function
     * @static
     * @public
     */
    parseFromJSON : update(function(text/*[, reviver]*/) {
      var me = Pot.Serializer.parseFromJSON, o;
      o = String(text).replace(me.PATTERNS.CLEAN, '');
      if (me.isValid(me, o)) {
        return Pot.localEval('(' + o + ')');
      } else {
        throw new Error('Invalid JSON string: ' + o);
      }
    }, {
      /**
       * @ignore
       */
      PATTERNS : {
        META      : /\\["\\\/bfnrtu]/g,
        STRING    : /"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1F\x80-\x9F]*"/g,
        EXPRS     : /true|false|null|[+-]?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g,
        BRACKETS  : /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,
        REMAINDER : /^[\],:{}\s\u2028\u2029]*$/,
        SPACE     : /^\s*$/,
        CLEAN     : /^(?:[{[(']{0}[')\]}]+|)[;\s\u00A0]*|[;\s\u00A0]*$/g
      },
      /**
       * @ignore
       */
      isValid : function(that, s) {
        var at = '@', bracket = '[]'.charAt(1), re = that.PATTERNS;
        if (re.SPACE.test(s)) {
          return false;
        }
        return re.REMAINDER.test(
          s.replace(re.META,     at)
           .replace(re.STRING,   bracket)
           .replace(re.EXPRS,    bracket)
           .replace(re.BRACKETS, '')
        );
      }
    })
  });
}());

update(Pot.Serializer, {
  /**
   * @lends Pot.Serializer
   */
  /**
   * Serializes an key-value object to query-string format string.
   *
   *
   * @example
   *   var query = {foo: 1, bar: 'bar2', baz: null};
   *   debug(serializeToQueryString(query));
   *   // @results 'foo=1&bar=bar2&baz='
   *
   *
   * @example
   *   // Example of the items() format.
   *   var query = [['prototype', 'value1'], ['__iterator__', 'value2']];
   *   debug(serializeToQueryString(query));
   *   // @results 'prototype=value1&__iterator__=value2'
   *
   *
   * @example
   *   // Example of needless key.
   *   var query = {'': 'http://www.example.com/'};
   *   debug(serializeToQueryString(query));
   *   // @results 'http%3A%2F%2Fwww.example.com%2F'
   *
   *
   * @example
   *   var query = 'a=value1&b=value2';
   *   debug(serializeToQueryString(query));
   *   // @results 'a=value1&b=value2'
   *
   *
   * @example
   *   var query = {foo: 'bar', baz: ['qux', 'quux'], corge: ''};
   *   debug(serializeToQueryString(query));
   *   // @results 'foo=bar&baz[]=qux&baz[]=quux&corge='
   *
   *
   * @param  {Object|Array|*}  params    The target object.
   * @return {String}                    The query-string of builded result.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  serializeToQueryString : function(params) {
    var queries = [], encode, objectLike;
    if (!params || params == false) {
      return '';
    }
    if (typeof Buffer !== 'undefined' && params.constructor === Buffer) {
      return params;
    }
    if (isString(params)) {
      return stringify(params);
    }
    objectLike = isObject(params);
    if (objectLike || isArrayLike(params)) {
      encode = Pot.URI.urlEncode;
      each(params, function(v, k) {
        var item, key, val, sep, count = 0, ok = true;
        if (objectLike) {
          item = [k, v];
        } else {
          item = v;
        }
        try {
          key = stringify(item[0], false);
          val = item[1];
        } catch (e) {
          ok = false;
        }
        if (ok && (key || val)) {
          if (!objectLike) {
            each(params, function(items) {
              if (items) {
                try {
                  if (stringify(items[0], false) === key) {
                    count++;
                  }
                } catch (e) {}
              }
            });
          }
          if (count > 1 || isArray(val)) {
            sep = '=';
            key = stringify(key, true) + '[]';
          } else {
            sep = key ? '=' : '';
          }
          each(arrayize(val), function(t) {
            queries[queries.length] = encode(key) + sep +
                                      encode(stringify(t, true));
          });
        }
      });
    }
    return queries.join('&');
  },
  /**
   * Parse the query-string to the items() format array
   *   or the key-value object.
   * The default result will be the items() format array.
   *
   *
   * @example
   *   // Default is the items() format.
   *   var query = 'foo=1&bar=bar2&baz=';
   *   debug(parseFromQueryString(query));
   *   // @results [['foo', '1'], ['bar', 'bar2'], ['baz', '']]
   *
   *
   * @example
   *   // Specify "toObject".
   *   var query = 'key1=value1&key2=value2';
   *   debug(parseFromQueryString(query, true));
   *   // @results {key1: 'value1', key2: 'value2'}
   *
   *
   * @example
   *   // Invalid key names.
   *   var query = 'prototype=value1&__iterator__=value2';
   *   debug(parseFromQueryString(query));
   *   // @results [['prototype', 'value1'], ['__iterator__', 'value2']]
   *
   *
   * @example
   *   // Example of needless key.
   *   var query = 'http%3A%2F%2Fwww.example.com%2F';
   *   debug(parseFromQueryString(query));
   *   // @results [['', 'http://www.example.com/']]
   *
   *
   * @example
   *   var query = '%40A=16%5E2%262&%40B=(2%2B3%3E%3D1)';
   *   debug(parseFromQueryString(query, true));
   *   // @results {'@A': '16^2&2', '@B': '(2+3>=1)'}
   *
   *
   * @example
   *   var query = 'foo=bar&baz[]=qux&baz[]=quux&corge=';
   *   debug(parseFromQueryString(query, true));
   *   // @results {foo: 'bar', baz: ['qux', 'quux'], corge: ''}
   *
   *
   * @param  {String}   queryString   The query-string to parse.
   * @param  {Boolean}  (toObject)    Whether to return as
   *                                    an key-value object.
   *                                  Note that if invalid key name
   *                                    included then an object will
   *                                    be broken.
   *                                    (e.g., "__iterator__" or
   *                                           "prototype",
   *                                           "hasOwnProperty" etc.).
   * @return {Array|Object}           The parsed array or object.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  parseFromQueryString : function(queryString, toObject) {
    var result = [], decode, query, re;
    if (isObject(queryString) || isArray(queryString)) {
      return queryString;
    }
    if (toObject) {
      result = {};
    }
    query = stringify(queryString, true);
    if (query) {
      decode = Pot.URI.urlDecode;
      re = /&(?:(?:amp|#(?:0*38|[xX]0*26));|)/;
      while (query.charAt(0) === '?') {
        query = query.substring(1);
      }
      each(query.split(re), function(q) {
        var key, val, pair, k;
        pair = q.split('=');
        switch (pair.length) {
          case 0:
              break;
          case 1:
              val = pair[0];
              break;
          default:
              key = pair[0];
              val = pair[1];
              break;
        }
        if (key || val) {
          key = stringify(decode(key));
          val = stringify(decode(val));
          if (key.slice(-2) === '[]') {
            k = key.slice(0, -2);
            if (toObject) {
              if (hasOwnProperty.call(result, k)) {
                result[k] = concat.call(
                  [],
                  arrayize(result[k]),
                  arrayize(val)
                );
              } else {
                result[k] = [val];
              }
            } else {
              result[result.length] = [k, val];
            }
          } else {
            if (toObject) {
              result[key] = val;
            } else {
              result[result.length] = [key, val];
            }
          }
        }
      });
    }
    return result;
  }
});

// Update for Pot object.
Pot.update({
  serializeToJSON        : Pot.Serializer.serializeToJSON,
  parseFromJSON          : Pot.Serializer.parseFromJSON,
  serializeToQueryString : Pot.Serializer.serializeToQueryString,
  parseFromQueryString   : Pot.Serializer.parseFromQueryString
});

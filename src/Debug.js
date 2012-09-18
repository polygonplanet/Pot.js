//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Debug.
Pot.update({
  /**
   * @lends Pot.Debug
   */
  /**
   * Debugging utilities.
   *
   * @name Pot.Debug
   * @type Object
   * @class
   * @static
   * @public
   */
  Debug : {}
});

update(Pot.Debug, {
  /**
   * @lends Pot.Debug
   */
  /**
   * Output to the console using log function for debug.
   *
   *
   * @example
   *   debug('hoge'); // hoge
   *
   *
   * @param  {*}  msg  A log message, or variable.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  debug : debug,
  /**
   * Dump and returns all of object as string.
   *
   *
   * @example
   *   var reg = /^[a-z]+$/g;
   *   var err = new Error('error!');
   *   var str = new String('hello');
   *   var arr = [1, 2, 3, {a: 4, b: 5, c: true}, false, null, void 0];
   *   var obj = {
   *     key1 : 'val1',
   *     key2 : 'val2',
   *     arr  : arr,
   *     arr2 : arr,
   *     strs : [str, str],
   *     err  : err,
   *     err2 : err,
   *     reg1 : reg,
   *     reg2 : reg,
   *     reg3 : reg
   *   };
   *   obj.obj = obj;
   *   Pot.debug( Pot.dump(obj) );
   *   // @results
   *   //   #0 {
   *   //     key1: "val1",
   *   //     key2: "val2",
   *   //     arr: #3 [
   *   //       1,
   *   //       2,
   *   //       3,
   *   //       {
   *   //         a: 4,
   *   //         b: 5,
   *   //         c: true
   *   //       },
   *   //       false,
   *   //       null,
   *   //       undefined
   *   //     ],
   *   //     arr2: #3,
   *   //     strs: [
   *   //       #5 (new String("hello")),
   *   //       #5
   *   //     ],
   *   //     err: #6 (new Error("error!")),
   *   //     err2: #6,
   *   //     reg1: #8 (new RegExp(/^[a-z]+$/g)),
   *   //     reg2: #8,
   *   //     reg3: #8,
   *   //     obj: #0
   *   //   }
   *
   *
   * @param  {*}  val  A target object/value.
   * @param  {(Number)} (recursiveLimit) (Optional) recursive limit.
   *                                     (default = 16)
   * @param  {(Number)} (lengthLimit) (Optional) length limit.
   *                                     (default = 1024)
   * @return {String} dumped string.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  dump : (function() {
    /**@ignore*/
    var Dumper = function() {
      return this.init.apply(this, arguments);
    };
    Dumper.prototype = {
      /**@ignore*/
      data : null,
      /**@ignore*/
      refs : null,
      /**@ignore*/
      first : true,
      /**@ignore*/
      recursiveLimit : 16,
      /**@ignore*/
      lengthLimit : 1024,
      /**@ignore*/
      isStop : false,
      /**@ignore*/
      init : function(recursiveLimit, lengthLimit) {
        this.data = [];
        this.refs = [];
        if (isNumeric(recursiveLimit)) {
          this.recursiveLimit = recursiveLimit - 0;
        }
        if (isNumeric(lengthLimit)) {
          this.lengthLimit = lengthLimit - 0;
        }
        return this;
      },
      /**@ignore*/
      typeOf : function(v) {
        return (v === null) ? 'null' : typeof v;
      },
      /**@ignore*/
      add : function(value, object, isRef, isNull) {
        this.refs[this.refs.length] = isNull ? null : object;
        this.data[this.data.length] = [value, isRef];
      },
      /**@ignore*/
      getReferenceNumber : function(object) {
        var i = 0, len = this.refs.length;
        for (; i < len; i++) {
          if (this.refs[i] === object) {
            if (i === 0 && this.first) {
              this.first = false;
              continue;
            }
            if (this.data[i] && !this.data[i][1]) {
              this.data[i][1] = true;
              this.data[i][2] = '#' + i + ' ';
            }
            return i;
          }
        }
        return false;
      },
      /**@ignore*/
      dump : function(object) {
        var r = [], i = 0, len, recursiveCount = 0;
        this.add('', object);
        try {
          this.dumpAll(object, recursiveCount);
        } catch (e) {
          return Pot.getErrorMessage(e);
        }
        len = this.data.length;
        for (; i < len; i++) {
          r[r.length] = (this.data[i][2] || '') + this.data[i][0];
        }
        this.data = this.refs = [];
        return r.join('');
      },
      /**@ignore*/
      dumpAll : function(object, recursiveCount) {
        if (this.lengthLimit >= 0 &&
            this.data.length > this.lengthLimit) {
          this.add('\n...\n', object);
          this.isStop = true;
          return;
        }
        if (this.recursiveLimit >= 0 &&
            recursiveCount > this.recursiveLimit) {
          this.add('[RECURSIVE LIMIT]', object);
          return;
        }
        switch (this.typeOf(object)) {
          case 'null':
              this.add('null', object);
              break;
          case 'string':
              this.add('"' + object + '"', object);
              break;
          case 'number':
          case 'boolean':
          case 'xml':
              this.add(object.toString(), object);
              break;
          case 'function':
              this.dumpFunction(object);
              break;
          case 'object':
              this.dumpObject(object, recursiveCount);
              break;
          default:
              this.add('undefined', object);
        }
      },
      /**@ignore*/
      dumpFunction : function(object) {
        var n = this.getReferenceNumber(object);
        if (n !== false) {
          this.add('#' + n, object, true);
        } else {
          this.add(Pot.getFunctionCode(object), object);
        }
      },
      /**@ignore*/
      dumpObject : function(object, recursiveCount) {
        var that = this, rs, rv, p, k, keys, val, index, wrap, n;
        n = this.getReferenceNumber(object);
        if (n !== false) {
          this.add('#' + n, object, true, true);
        } else if (isString(object)) {
          this.add('(new String("' + object + '"))', object);
        } else if (isNumber(object)) {
          this.add('(new Number(' + object + '))', object);
        } else if (isBoolean(object)) {
          this.add('(new Boolean(' + object.toString() + '))', object);
        } else if (isRegExp(object)) {
          this.add('(new RegExp(' + object.toString() + '))', object);
        } else if (isError(object)) {
          this.add(
            '(new ' + (object.name || 'Error') +
            '("' + Pot.getErrorMessage(object) + '"))',
            object
          );
        } else if (isDate(object)) {
          this.add('(new Date("' + object.toString() + '"))', object);
        } else if (isFunction(object)) {
          this.add(Pot.getFunctionCode(object), object);
        } else {
          index = this.data.length;
          if (isArray(object)) {
            wrap = ['[', ']'];
            each(object, function(v) {
              that.dumpAll(v, recursiveCount + 1);
              if (that.isStop) {
                throw PotStopIteration;
              }
            });
          } else {
            wrap = ['{', '}'];
            k = ': ';
            keys = [];
            for (p in object) {
              keys[keys.length] = p;
            }
            each(keys, function(p) {
              try {
                val = object[p];
              } catch (e) {
                return;
              }
              that.dumpAll(val, recursiveCount + 1);
              if (that.isStop) {
                throw PotStopIteration;
              }
            });
          }
          this.refs.splice(index, this.refs.length);
          rs = this.data.splice(index, this.data.length);
          rv = [];
          each(rs, function(r, i) {
            rv[rv.length] = (k ? keys[i] + k : '') +
                            (r[2] || '') +
                            r[0];
          });
          this.add(wrap[0] + rv.join(', ') + wrap[1], object);
        }
      }
    };
    return function(val, recursiveLimit, lengthLimit) {
      return new Dumper(recursiveLimit, lengthLimit).dump(val);
    };
  }())
});

// Update Pot object.
Pot.update({
  debug : Pot.Debug.debug,
  dump  : Pot.Debug.dump
});

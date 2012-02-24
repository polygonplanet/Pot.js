//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of jQuery plugin and convert Ajax function to deferred.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Definition of jQuery plugin and convert Ajax function to deferred.
   *
   * <pre>
   *   - $.pot
   *       {Object}    Pot object.
   *
   *   - $.fn.deferred
   *       {Function}  Deferrize jQuery method.
   *                     function(method, (original arguments))
   *                       - method :
   *                           {String} method name.
   *                       - (...)  :
   *                           {*}      original arguments.
   *  </pre>
   *
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  deferrizejQueryAjax : (function() {
    if (typeof jQuery !== 'function' || !jQuery.fn) {
      return Pot.noop;
    }
    return function() {
      return (function($) {
        var orgAjax = $.ajax;
        $.pot = Pot;
        $.fn.extend({
          /**@ignore*/
          deferred : function(method) {
            var func, args = arrayize(arguments, 1), exists = false;
            each(args, function(arg) {
              if (Pot.isFunction(arg)) {
                exists = true;
                throw Pot.StopIteration;
              }
            });
            if (!exists) {
              args.push(function() {
                return arrayize(arguments);
              });
            }
            func = Pot.Deferred.deferrize(method, this);
            return func.apply(this, args);
          }
        });
        /**@ignore*/
        $.ajax = function(options) {
          var d = new Pot.Deferred(), opts, orgs, er;
          opts = update({}, options || {});
          orgs = update({}, opts);
          update(opts, {
            /**@ignore*/
            success : function() {
              var args = arrayize(arguments), err, done;
              try {
                if (orgs.success) {
                  orgs.success.apply(this, args);
                }
              } catch (e) {
                done = true;
                err = e || new Error(e);
                args.push(err);
                d.raise.apply(d, args);
              }
              if (!done) {
                d.destAssign = true;
                d.begin.apply(d, args);
              }
            },
            /**@ignore*/
            error : function() {
              var args = arrayize(arguments), err;
              try {
                if (orgs.error) {
                  orgs.error.apply(this, args);
                }
              } catch (e) {
                err = e || new Error(e);
                args.unshift(err);
              } finally {
                d.raise.apply(d, args);
              }
            }
          });
          try {
            d.data({
              result : orgAjax(opts)
            });
          } catch (e) {
            er = e;
            d.raise(er);
          }
          return d;
        };
      }(jQuery));
    };
  }())
});

// Update Pot.Plugin object methods.
(function(Plugin, Internal) {
update(Plugin, {
  /**
   * @lends Pot.Plugin
   */
  /**
   * @private
   * @ignore
   */
  storage : {},
  /**
   * @private
   * @ignore
   */
  shelter : {},
  /**
   * Add plugin function.
   *
   *
   * @example
   *   Pot.addPlugin('foo', function() { alert('foo!') });
   *   Pot.foo(); // 'foo!'
   *
   *
   * @param  {String|Object}  name     A name of Plugin function. or object.
   * @param  {Function}      (method)  A plugin function.
   * @param  {Boolean}       (force)   Whether overwrite plugin.
   *                                     (default=false).
   * @return {Boolean}                 Return success or failure.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  add : function(name, method, force) {
    var result = true, pairs, overwrite;
    if (Pot.isObject(name)) {
      pairs = name;
      overwrite = !!(force || method);
    } else {
      pairs = {};
      pairs[stringify(name, true)] = method;
      overwrite = !!force;
    }
    each(pairs, function(v, k) {
      var key = stringify(k, true), func;
      if (Pot.isFunction(v)) {
        /**@ignore*/
        func = function() {
          return v.apply(v, arguments);
        };
        update(func, {
          deferred : (function() {
            try {
              return Pot.Deferred.deferreed(func);
            } catch (e) {
              return Pot.Deferred.deferrize(func);
            }
          }())
        });
      } else {
        func = v;
      }
      if (key && (overwrite || !Plugin.has(key))) {
        if (key in Pot) {
          Plugin.shelter[key] = Pot[key];
        }
        Pot[key] = Plugin.storage[key] = Internal.PotExportProps[key] = func;
      } else {
        result = false;
      }
    });
    return result;
  },
  /**
   * Check whether Pot.Plugin has already specific name.
   *
   *
   * @example
   *   debug( Pot.hasPlugin('hoge') ); // false
   *   Pot.addPlugin('hoge', function() {});
   *   debug( Pot.hasPlugin('hoge') ); // true
   *
   *
   * @param  {String|Array}  name   A name of Plugin function. or Array.
   * @return {Boolean}              Returns whether Pot.Plugin has
   *                                  already specific name.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  has : function(name) {
    var result = true;
    each(arrayize(name), function(k) {
      var key = stringify(k, true);
      if (!(key in Plugin.storage)) {
        result = false;
        throw Pot.StopIteration;
      }
    });
    return result;
  },
  /**
   * Removes Pot.Plugin's function.
   *
   *
   * @example
   *   Pot.addPlugin('hoge', function() {});
   *   debug( Pot.removePlugin('hoge') ); // true
   *   Pot.hoge(); // (Error: hoge is undefined)
   *
   *
   * @param  {String|Array}  name   A name of Plugin function. or Array.
   * @return {Boolean}              Returns success or failure.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  remove : function(name) {
    var result = true;
    each(arrayize(name), function(k) {
      var key = stringify(k, true);
      if (Pot.Plugin.has(key)) {
        try {
          if (key in Plugin.shelter) {
            Pot[key] = Internal.PotExportProps[key] = Plugin.shelter[key];
            delete Plugin.shelter[key];
          } else {
            if (key in Pot) {
              delete Pot[key];
            }
            if (key in Internal.PotExportProps) {
              delete Internal.PotExportProps[key];
            }
          }
          delete Plugin.storage[key];
          if (Plugin.has(key)) {
            throw false;
          }
        } catch (e) {
          result = false;
        }
      }
    });
    return result;
  },
  /**
   * List the Pot.Plugin function names.
   *
   *
   * @example
   *   Pot.addPlugin('foo', function() { alert('foo!') });
   *   Pot.addPlugin('bar', function() { alert('bar!') });
   *   debug( Pot.listPlugin() ); // ['foo', 'bar']
   *
   *
   * @return {Array} Returns an array of function names.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  list : function() {
    var result = Pot.keys(Plugin.storage);
    return result;
  }
});

// Update Pot object.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Add plugin function.
   *
   *
   * @example
   *   Pot.addPlugin('foo', function() { alert('foo!') });
   *   Pot.foo(); // 'foo!'
   *
   *
   * @param  {String|Object}  name     A name of Plugin function. or object.
   * @param  {Function}      (method)  A plugin function.
   * @param  {Boolean}       (force)   Whether overwrite plugin.
   *                                     (default=false).
   * @return {Boolean}                 Return success or failure.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  addPlugin : Plugin.add,
  /**
   * Check whether Pot.Plugin has already specific name.
   *
   *
   * @example
   *   debug( Pot.hasPlugin('hoge') ); // false
   *   Pot.addPlugin('hoge', function() {});
   *   debug( Pot.hasPlugin('hoge') ); // true
   *
   *
   * @param  {String|Array}  name   A name of Plugin function. or Array.
   * @return {Boolean}              Returns whether Pot.Plugin has
   *                                  already specific name.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  hasPlugin : Plugin.has,
  /**
   * Removes Pot.Plugin's function.
   *
   *
   * @example
   *   Pot.addPlugin('hoge', function() {});
   *   debug( Pot.removePlugin('hoge') ); // true
   *   Pot.hoge(); // (Error: hoge is undefined)
   *
   *
   * @param  {String|Array}  name   A name of Plugin function. or Array.
   * @return {Boolean}              Returns success or failure.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  removePlugin : Plugin.remove,
  /**
   * List the Pot.Plugin function names.
   *
   *
   * @example
   *   Pot.addPlugin('foo', function() { alert('foo!') });
   *   Pot.addPlugin('bar', function() { alert('bar!') });
   *   debug( Pot.listPlugin() ); // ['foo', 'bar']
   *
   *
   * @return {Array} Returns an array of function names.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  listPlugin : Plugin.list
});

}(Pot.Plugin, Pot.Internal));

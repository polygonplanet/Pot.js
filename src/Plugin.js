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
    return function() {
      if (typeof jQuery !== 'function' || !jQuery.fn) {
        return false;
      }
      return (function($) {
        var orgAjax = $.ajax;
        $.pot = Pot;
        $.fn.extend({
          /**@ignore*/
          deferred : function(method) {
            var func, args = arrayize(arguments, 1), exists = false;
            each(args, function(arg) {
              if (isFunction(arg)) {
                exists = true;
                throw PotStopIteration;
              }
            });
            if (!exists) {
              args.push(function() {
                return arrayize(arguments);
              });
            }
            func = Deferred.deferrize(method, this);
            return func.apply(this, args);
          }
        });
        /**@ignore*/
        $.ajax = function(options) {
          var er, d = new Deferred(),
              opts = update({}, options || {}),
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
update(PotPlugin, {
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
    if (isObject(name)) {
      pairs = name;
      overwrite = !!(force || method);
    } else {
      pairs = {};
      pairs[stringify(name, true)] = method;
      overwrite = !!force;
    }
    each(pairs, function(v, k) {
      var key = stringify(k, true), func;
      if (isFunction(v)) {
        /**@ignore*/
        func = function() {
          return v.apply(v, arguments);
        };
        update(func, {
          deferred : (function() {
            try {
              return Deferred.deferreed(func);
            } catch (e) {
              return Deferred.deferrize(func);
            }
          }())
        });
      } else {
        func = v;
      }
      if (key && (overwrite || !PotPlugin.has(key))) {
        if (key in Pot) {
          PotPlugin.shelter[key] = Pot[key];
        }
        Pot[key] = PotPlugin.storage[key] =
                   PotInternal.PotExportProps[key] = func;
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
      if (!(key in PotPlugin.storage)) {
        result = false;
        throw PotStopIteration;
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
      if (PotPlugin.has(key)) {
        try {
          if (key in PotPlugin.shelter) {
            Pot[key] = PotInternal.PotExportProps[key] =
                                        PotPlugin.shelter[key];
            delete PotPlugin.shelter[key];
          } else {
            if (key in Pot) {
              delete Pot[key];
            }
            if (key in PotInternal.PotExportProps) {
              delete PotInternal.PotExportProps[key];
            }
          }
          delete PotPlugin.storage[key];
          if (PotPlugin.has(key)) {
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
    var result = Pot.keys(PotPlugin.storage);
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
  addPlugin : PotPlugin.add,
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
  hasPlugin : PotPlugin.has,
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
  removePlugin : PotPlugin.remove,
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
  listPlugin : PotPlugin.list
});

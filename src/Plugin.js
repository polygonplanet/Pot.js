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
      })(jQuery);
    };
  })()
});

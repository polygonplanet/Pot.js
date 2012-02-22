//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Deferred.
(function() {

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Deferred.
   *
   * Ability to establish a chain method asynchronously.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     return 100;
   *   }).then(function(res) {
   *     debug(res);
   *     // @results  res = 100
   *   }).begin();
   *
   *
   * @example
   *   var n = 1;
   *   var d = new Pot.Deferred({
   *     async : true,
   *     speed : 'slow'
   *   });
   *   d.then(function() {
   *     debug('Begin');
   *     debug(n);
   *     return n + 1;
   *   }).then(function(res) {
   *     debug(res);
   *     return res + 1;
   *   }).then(function(res) {
   *     debug(res);
   *     // raise an error
   *     undefinedFunction.call();
   *   }).rescue(function(err) {
   *     // catch the error
   *     debug('my error : ' + err);
   *   }).then(function() {
   *     debug('End.');
   *   }).begin();
   *
   *
   * @param  {Object|*}  Options.
   * @return {Deferred}  Returns an instance of Deferred.
   *
   * @name  Pot.Deferred
   * @class
   * @constructor
   * @public
   */
  Deferred : function() {
    return Pot.isDeferred(this) ? this.init(arguments) :
            new Pot.Deferred.fn.init(arguments);
  }
});

// Definition of the prototype and static properties.
update(Pot.Deferred, {
  /**
   * @lends Pot.Deferred
   */
  /**
   * StopIteration.
   *
   * @type Object
   * @static
   * @const
   * @public
   */
  StopIteration : Pot.StopIteration,
  /**
   * Speeds.
   *
   * @type Object
   * @static
   * @const
   * @private
   * @ignore
   */
  speeds : {
    limp   : 2400,
    doze   : 1000,
    slow   :  100,
    normal :   36,
    fast   :   20,
    rapid  :   12,
    ninja  :    0
  },
  /**
   * States.
   *
   * @type Object
   * @static
   * @const
   * @private
   * @ignore
   */
  states : {
    success : 0x01,
    failure : 0x02,
    fired   : 0x03,
    unfired : 0x04
  }
});

each(Pot.Deferred.states, function(n, name) {
  Pot.Deferred.states[n] = name;
});

update(Pot.Deferred, {
  /**
   * @lends Pot.Deferred
   */
  /**
   * Defaults.
   *
   * @type Object
   * @static
   * @const
   * @private
   * @ignore
   */
  defaults : {
    speed     : Pot.Deferred.speeds.ninja,
    canceller : null,
    stopper   : null,
    async     : true
  }
});

// Definition of the prototype.
Pot.Deferred.fn = Pot.Deferred.prototype = update(Pot.Deferred.prototype, {
  /**
   * @lends Pot.Deferred.prototype
   */
  /**
   * @ignore
   */
  constructor : Pot.Deferred,
  /**
   * @private
   * @ignore
   */
  id : Pot.Internal.getMagicNumber(),
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
   */
  chains : [],
  /**
   * @private
   * @ignore
   */
  chained : false,
  /**
   * @private
   * @ignore
   */
  cancelled : false,
  /**
   * @private
   * @ignore
   */
  freezing : false,
  /**
   * @private
   * @ignore
   */
  tilling : false,
  /**
   * @private
   * @ignore
   */
  waiting : false,
  /**
   * @private
   * @ignore
   */
  nested : 0,
  /**
   * @private
   * @ignore
   */
  state : null,
  /**
   * @private
   * @ignore
   */
  results : null,
  /**
   * @private
   * @ignore
   */
  destAssign : false,
  /**
   * @private
   * @ignore
   */
  chainDebris : null,
  /**
   * @private
   * @ignore
   */
  options : {},
  /**
   * @private
   * @ignore
   */
  plugins : {},
  /**
   * @private
   * @ignore
   * @const
   */
  NAME : 'Deferred',
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
   * isDeferred.
   *
   * @type Function
   * @function
   * @static
   * @public
   */
  isDeferred : Pot.isDeferred,
  /**
   * Initialize properties
   *
   * @private
   * @ignore
   */
  init : function(args) {
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    this.options = {};
    this.plugins = {};
    initOptions.call(this, arrayize(args), Pot.Deferred.defaults);
    update(this, {
      results     : {
        success   : null,
        failure   : null
      },
      state       : Pot.Deferred.states.unfired,
      chains      : [],
      nested      : 0,
      chained     : false,
      cancelled   : false,
      freezing    : false,
      tilling     : false,
      waiting     : false,
      destAssign  : false,
      chainDebris : null
    });
    Pot.Internal.referSpeeds.call(this, Pot.Deferred.speeds);
    return this;
  },
  /**
   * @lends Pot.Deferred.prototype
   */
  /**
   * Set the speed for processing.
   *
   * @desc
   * <pre>
   * The available constant speed names are below.
   * ------------------------------------
   *   speed name    |  speed
   * ------------------------------------
   *      limp       :  slowest
   *      doze       :  slower
   *      slow       :  slow
   *      normal     :  normal
   *      fast       :  fast
   *      rapid      :  faster
   *      ninja      :  fastest
   * ------------------------------------
   * </pre>
   *
   *
   * @example
   *   var n = 0;
   *   var testFunc = function() { debug(++n); };
   *   var d = new Pot.Deferred();
   *   d.then(testFunc).then(testFunc).then(testFunc)
   *    .then(function() { debug('Change to slowest speed. (limp)'); })
   *    .speed('limp')
   *    .then(testFunc).then(testFunc).then(testFunc)
   *    .then(function() { debug('Change to speed for 50 ms.'); })
   *    .speed(50)
   *    .then(testFunc).then(testFunc).then(testFunc)
   *    .then(function() { debug('End'); })
   *    .begin();
   *
   *
   * @param  {Number|String} sp Speed as Number or keyword as String.
   * @return {Deferred}         Returns the Deferred.
   *                            Deferred callback argument value will be
   *                              current speed value if no argument was
   *                              given, otherwise argument will succeed
   *                              the previous value.
   * @type Function
   * @function
   * @public
   */
  speed : function(sp) {
    var that = this, args = arguments, value;
    if (Pot.isNumeric(sp)) {
      value = sp - 0;
    } else if (Pot.isNumeric(Pot.Deferred.speeds[sp])) {
      value = Pot.Deferred.speeds[sp] - 0;
    } else {
      value = this.options.speed;
    }
    if (this.state === Pot.Deferred.states.unfired && !this.chains.length) {
      if (args.length === 0) {
        return this.options.speed;
      }
      this.options.speed = value;
    } else {
      this.then(function(reply) {
        if (args.length === 0) {
          return that.options.speed;
        }
        that.options.speed = value;
        return reply;
      });
    }
    return this;
  },
  /**
   * Set the asynchronous for processing.
   *
   *
   * @example
   *   // Run the callback chains while switching between
   *   //  asynchronous and synchronous.
   *   var d = new Pot.Deferred({ async : false });
   *   d.then(function(res) {
   *     debug(res);
   *     return res + 1;
   *   }).speed('slow').async(true).then(function(res) {
   *     debug(res);
   *     return res + 1;
   *   }).speed(1500).then(function(res) {
   *     debug(res);
   *     return res + 1;
   *   }).async(false).then(function(res) {
   *     debug(res);
   *     return res + 1;
   *   }).then(function(res) {
   *     debug(res);
   *   }).async().then(function(async) {
   *     // Get the current async value
   *     debug('async = ' + async);
   *     debug('End.');
   *   }).begin(1);
   *
   *
   * @param  {Boolean}    sync  Value to asynchronous if given true.
   * @return {Deferred}         Returns the Deferred.
   *                            Deferred callback argument value will be
   *                              current async value if no argument was
   *                              given, otherwise argument will succeed
   *                              the previous value.
   * @type Function
   * @function
   * @public
   */
  async : function(sync) {
    var that = this, args = arguments;
    if (this.state === Pot.Deferred.states.unfired && !this.chains.length) {
      if (args.length === 0) {
        return this.options.async;
      }
      this.options.async = !!sync;
    } else {
      this.then(function(reply) {
        if (args.length === 0) {
          return that.options.async;
        }
        that.options.async = !!sync;
        return reply;
      });
    }
    return this;
  },
  /**
   * Set the canceller that will call on canceled callback sequences.
   *
   *
   * @example
   *   var msg = 'none';
   *   var d = new Pot.Deferred();
   *   d.canceller(function() {
   *     msg = 'cancelled';
   *   }).then(function() {
   *     msg = 'hoge';
   *   }).then(function() {
   *     msg = 'fuga';
   *   });
   *   d.cancel();
   *   d.begin(); // no sense
   *   debug(msg);
   *   // @results  msg = 'cancelled'
   *
   *
   * @param  {Function}   func  A canceller function.
   * @return {Deferred|*}       Returns the Deferred if set canceller value.
   *                            Returns current value if no argument was given.
   * @type Function
   * @function
   * @public
   */
  canceller : function(func) {
    var args = arguments;
    if (this.state === Pot.Deferred.states.unfired && !this.chains.length) {
      if (args.length === 0) {
        return this.options.cancellers;
      }
      if (!this.cancelled && Pot.isFunction(func)) {
        this.options.cancellers.push(func);
      }
    } else {
      this.stopper.apply(this, args);
    }
    return this;
  },
  /**
   * Set the stopper that will call on canceled callback sequences.
   *
   * @param  {Function}   func  A stopper function.
   * @return {Deferred}         Returns the Deferred.
   *                            Deferred callback argument value will be
   *                              current stoppers if no argument was
   *                              given, otherwise argument will succeed
   *                              the previous value.
   * @type Function
   * @function
   * @public
   */
  stopper : function(func) {
    var that = this, args = arguments;
    if (this.state === Pot.Deferred.states.unfired && !this.chains.length) {
      this.canceller.apply(this, args);
    } else {
      this.then(function(reply) {
        if (args.length === 0) {
          return that.options.stoppers;
        }
        if (!that.cancelled && Pot.isFunction(func)) {
          that.options.stoppers.push(func);
        }
        return reply;
      });
    }
    return this;
  },
  /**
   * Add a callback to the end of the chains.
   *
   * @desc
   * callback/errback:
   *   If callback returns a Deferred, then it will be chained.
   *   Returned value will be passed to the next callback as argument.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     debug('Hello World!');
   *   }).begin();
   *
   *
   * @param  {Function}  callback   A callback function.
   * @param  {Function}  (errback)  Optionally, an errorback function.
   * @return {Deferred}             Returns the Deferred.
   * @type Function
   * @function
   * @public
   */
  then : function(callback, errback) {
    if (!this.chained && !this.cancelled) {
      this.chains.push({
        success : callback,
        failure : errback
      });
      if (this.state & Pot.Deferred.states.fired) {
        if (!this.freezing && !this.tilling && !this.waiting) {
          fire.call(this);
        }
      }
    }
    Pot.Internal.referSpeeds.call(this, Pot.Deferred.speeds);
    return this;
  },
  /**
   * Add an errorback function to the end of the chains.
   * Errorback will be catch the error which occurs on chains.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     // Occur an error.
   *     unknownFunc.call();
   *   }).rescue(function(err) {
   *     // catch the error
   *     debug('err = ' + err);
   *     //
   *     // Handling the error.
   *     //
   *   }).then(function() {
   *     debug('next(do something)');
   *   });
   *   d.begin();
   *
   *
   * @param  {Function}  errback  An errorback function.
   * @return {Deferred}           Returns the Deferred.
   * @type Function
   * @function
   * @public
   */
  rescue : function(errback) {
    return this.then(null, errback);
  },
  /**
   * Add the same function as both a callback and an errorback on the chains.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     // Occur an error, or succeed.
   *     return maybeCallableFunc.call();
   *   }).ensure(function(res) {
   *     if (Pot.isError(res)) {
   *       debug('Error = ' + res);
   *       // Handling the error.
   *     } else {
   *       debug('Result = ' + res);
   *       // something to do
   *     }
   *     return 'anything';
   *   }).then(function(res) {
   *     debug('next(do something) or ' + res);
   *   });
   *   d.begin();
   *
   *
   * @param  {Function}  callback  A callback/errorback function.
   * @return {Deferred}            Returns the Deferred.
   * @type Function
   * @function
   * @public
   */
  ensure : function(callback) {
    return this.then(callback, callback);
  },
  /**
   * Cancels the chains that has not yet received a value.
   *
   *
   * @example
   *   function exampleFunc(checkFunc) {
   *     var d = new Pot.Deferred();
   *     d.canceller(function() {
   *       debug('Cancelled');
   *     });
   *     d.then(function(res) {
   *       debug(res);
   *       return res + 1;
   *     }).then(function(res) {
   *       debug(res);
   *       return res + 1;
   *     }).then(function(res) {
   *       debug(res);
   *       return res + 1;
   *     }).then(function(res) {
   *       debug(res);
   *       return res + 1;
   *     });
   *     return checkFunc().then(function(res) {
   *       debug('res = ' + res);
   *       if (res) {
   *         d.begin(1);
   *       } else {
   *         d.cancel();
   *       }
   *       return d;
   *     }).begin();
   *   }
   *   var checkFunc = function() {
   *     var dd = new Pot.Deferred();
   *     return dd.then(function() {
   *       debug('Begin example');
   *     }).async(true).speed(1000).then(function() {
   *       return Math.random() * 10 <= 5; // true or false
   *     });
   *   };
   *   exampleFunc(checkFunc).then(function(res) {
   *     debug('exampleFunc : res = ' + res);
   *   });
   *
   *
   * @return  {Deferred}        Returns the Deferred.
   * @type Function
   * @function
   * @public
   */
  cancel : function() {
    if (!this.cancelled) {
      this.cancelled = true;
      switch (this.state) {
        case Pot.Deferred.states.unfired:
            cancelize.call(this, 'cancellers');
            if (this.state === Pot.Deferred.states.unfired) {
              this.raise(new Error(this));
            }
            break;
        case Pot.Deferred.states.success:
            cancelize.call(this, 'stoppers');
            if (Pot.isDeferred(this.results.success)) {
              this.results.success.cancel();
            }
            break;
        case Pot.Deferred.states.failure:
            cancelize.call(this, 'stoppers');
            break;
        default:
            break;
      }
    }
    return this;
  },
  /**
   * Begin the callback chains without Error.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     debug('Hello Deferred!');
   *   });
   *   d.begin();
   *
   *
   * @param  {...*}      (...)  Some value to pass next callback sequence.
   * @return {Deferred}         Returns the Deferred.
   * @type Function
   * @function
   * @public
   */
  begin : function(/*[ ...args]*/) {
    var that = this, arg, args = arrayize(arguments), value;
    arg = args[0];
    if (args.length > 1) {
      value = args;
    } else {
      value = args[0];
    }
    if (!this.cancelled && this.state === Pot.Deferred.states.unfired) {
      if (Pot.isDeferred(arg) && !arg.cancelled) {
        arg.ensure(function() {
          that.begin.apply(this, arguments);
        });
      } else {
        this.options.cancellers = [];
        post.call(this, value);
      }
    }
    Pot.Internal.referSpeeds.call(this, Pot.Deferred.speeds);
    return this;
  },
  /**
   * Begin the callback chains with Error.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     debug('Hello Deferred!?');
   *   }).rescue(function() {
   *     debug('Error Deferred!');
   *   });
   *   d.raise();
   *   // This will be output 'Error Deferred!'
   *
   *
   * @param  {...*}      (...)  Some value to pass next callback sequence.
   * @return {Deferred}         Returns the Deferred.
   * @type Function
   * @function
   * @public
   */
  raise : function(/*[ ...args]*/) {
    var args = arrayize(arguments), arg, value;
    arg = args[0];
    if (!Pot.isError(arg)) {
      args[0] = new Error(arg);
    }
    if (args.length > 1) {
      value = args;
    } else {
      value = args[0];
    }
    return this.begin.apply(this, arrayize(value));
  },
  /**
   * Ending the callback chains.
   *
   *
   * @example
   *   var n = 1;
   *   var d = Pot.Deferred.begin(function() {
   *     n += 1;
   *   });
   *   d.then(function() {
   *     n *= 10;
   *   }).then(function() {
   *     n += 5;
   *     debug('n = ' + n);
   *   }).end(); // End the chains.
   *   d.then(function() {
   *     // This chain will not be called.
   *     n += 10000;
   *     debug('n = ' + n);
   *   });
   *   // @results  n = 25
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   var result;
   *   d.then(function() {
   *     return 1;
   *   }).then(function(res) {
   *     return res + 1;
   *   }).then(function(res) {
   *     var dd = new Pot.Deferred();
   *     dd.then(function(res) {
   *       return res + 1;
   *     }).then(function(res) {
   *       return res + 1;
   *     }).begin(res + 1);
   *     return dd;
   *   }).then(function(res) {
   *     result = res;
   *     debug(result);
   *   }).begin().end().then(function() {
   *     result = 100;
   *     debug('This chain will not be called.');
   *   });
   *   // @results  result = 5
   *
   *
   * @return {Deferred}      Returns the Deferred.
   * @type Function
   * @function
   * @public
   */
  end : function() {
    this.chained = true;
    return this;
  },
  /**
   * Wait specified seconds and then the callback sequence will restart.
   *
   *
   * @example
   *   var n = 0;
   *   var f = function() { debug(++n); };
   *   var d = new Pot.Deferred();
   *   d.then(f).then(f).then(f)
   *    .wait(1) // Wait 1 second.
   *    .then(f).wait(1).then(f).wait(1).then(f)
   *    .wait(2) // Wait 2 seconds.
   *    .then(f).wait(2).then(f).wait(2).then(f)
   *    .wait(0.5) // Wait 0.5 second.
   *    .then(function() {
   *      f();
   *      return 'hoge';
   *    }).wait(1).then(function(res) {
   *      f();
   *      // Inherit previous value.
   *      // This will be 'hoge'.
   *      debug('res = ' + res);
   *      return Pot.Deferred.begin(function() {
   *        return '[End]';
   *      });
   *    }).wait(2.5).then(function(res) {
   *      f();
   *      debug(res); // '[End]'
   *    });
   *    d.begin();
   *
   *
   * @param  {Number}  seconds  Number of seconds.
   * @param  {*}       (value)  (optional) The value passed to the next chain.
   * @return {Deferred}         Return the Deferred.
   * @type Function
   * @function
   * @public
   */
  wait : function(seconds, value) {
    var d, that = this, args = arguments;
    d = new Pot.Deferred();
    return this.then(function(reply) {
      if (Pot.isError(reply)) {
        throw reply;
      }
      that.waiting = true;
      Pot.Deferred.wait(seconds).ensure(function(result) {
        that.waiting = false;
        if (Pot.isError(result)) {
          d.raise(result);
        } else {
          d.begin(args.length >= 2 ? value : reply);
        }
      });
      return d;
    });
  },
  /**
   * Wait until the condition completed.
   * If true returned, waiting state will end.
   *
   *
   * @example
   *   debug('Begin till');
   *   var d = new Pot.Deferred();
   *   d.till(function() {
   *     // wait until the DOM body element is loaded
   *     if (!document.body) {
   *       return false;
   *     } else {
   *       return true;
   *     }
   *   }).then(function() {
   *     debug('End till');
   *     document.body.innerHTML += 'hoge';
   *   }).begin();
   *
   *
   * @param  {Function|*}  cond  A function or value as condition.
   * @return {Deferred}          Return the Deferred.
   * @type Function
   * @function
   * @public
   */
  till : function(cond) {
    var that = this, d = new Pot.Deferred();
    return this.then(function(reply) {
      if (Pot.isError(reply)) {
        throw reply;
      }
      that.tilling = true;
      Pot.Deferred.till(cond, reply).ensure(function(result) {
        that.tilling = false;
        if (Pot.isError(result)) {
          d.raise(result);
        } else {
          d.begin(reply);
        }
      });
      return d;
    });
  },
  /**
   * Set the arguments into the callback chain.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function(res) {
   *     debug(res); // undefined
   *     // Set the argument into callback chain result.
   *   }).args('hoge').then(function(res) {
   *     debug(res);
   *     // @results  res = 'hoge'
   *   });
   *   d.begin();
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function(res) {
   *     debug(res); // undefined
   *     // Set the argument into callback chain result.
   *   }).args({
   *     foo : 1,
   *     bar : 2,
   *     baz : 3
   *   }).then(function(res) {
   *     debug(res);
   *     // @results  res = {foo: 1, bar: 2, baz: 3}
   *   });
   *   d.begin();
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     return 'hoge';
   *   }).then(function() {
   *     debug( d.args() ); // @results 'hoge'
   *   });
   *   d.begin();
   *
   *
   * @param  {...*}         (args)  The specific arguments.
   * @return {Deferred|*}           Return the Pot.Deferred.
   *                                  Return the last callback chain result
   *                                  if passed no arguments.
   * @type   Function
   * @function
   * @public
   */
  args : function(/*[... args]*/) {
    var a = arrayize(arguments), len = a.length;
    if (len === 0) {
      return Pot.Deferred.lastResult(this);
    } else {
      return this.then(function() {
        var reply, reps = arrayize(arguments);
        if (reps.length > 1) {
          reply = reps;
        } else {
          reply = reps[0];
        }
        if (len > 1) {
          return a;
        } else {
          if (Pot.isFunction(a[0])) {
            return a[0].apply(this, arrayize(reply));
          } else {
            return a[0];
          }
        }
      });
    }
  },
  /**
   * Handle the data storage in the current callback chain.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.data({
   *     // Set the data to callback chain.
   *     count : 0,
   *     begin : 'BEGIN',
   *     end   : 'END'
   *   }).then(function() {
   *     debug( this.data('begin') );
   *     return this.data('count') + 1;
   *   }).then(function(res) {
   *     debug(res);
   *     this.data('count', res + 1);
   *     return this.data('count');
   *   }).then(function(res) {
   *     debug(res);
   *     debug( this.data('end') );
   *   });
   *   d.begin();
   *   // output:
   *   //
   *   //   BEGIN
   *   //   1
   *   //   2
   *   //   END
   *   //
   *
   *
   * @param  {String|Object|*}  (key/obj)  The key name to get the data.
   *                                         Or, an key-value object for
   *                                         set the data.
   * @param  {*}                (value)    The value to set.
   * @return {Deferred|*}                  Return the current instance of
   *                                         Pot.Deferred if set the data.
   *                                       Return the value if specify key
   *                                         to get.
   * @type   Function
   * @function
   * @public
   */
  data : function(/*[key/obj [, value [, ...args]]]*/) {
    var that = this, result = this, args = arrayize(arguments);
    var i, len = args.length, prefix = '.';
    if (this.options) {
      if (!this.options.storage) {
        this.options.storage = {};
      }
      switch (len) {
        case 0:
            result = {};
            each(this.options.storage, function(val, key) {
              try {
                if (key && key.charAt(0) === prefix) {
                  result[key.substring(1)] = val;
                }
              } catch (e) {}
            });
            break;
        case 1:
            if (args[0] == null) {
              this.options.storage = {};
            } else if (Pot.isObject(args[0])) {
              each(args[0], function(val, key) {
                that.options.storage[prefix + stringify(key)] = val;
              });
            } else {
              result = this.options.storage[prefix + stringify(args[0])];
            }
            break;
        case 2:
            this.options.storage[prefix + stringify(args[0])] = args[1];
            break;
        default:
            i = 0;
            do {
              this.options.storage[prefix + stringify(args[i++])] = args[i++];
            } while (i < len);
            break;
      }
    }
    return result;
  },
  /**
   * Update the Pot.Deferred.prototype.
   *
   *
   * @example
   *   // Update Pot.Deferred.prototype.
   *   Pot.Deferred.fn.update({
   *     addHoge : function() {
   *       return this.then(function(res) {
   *         return res + 'hoge';
   *       });
   *     }
   *   });
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     return 'fuga';
   *   }).addHoge().then(function(res) {
   *     debug(res);
   *     // @results  res = 'fugahoge';
   *   });
   *   d.begin();
   *
   *
   * @param  {Object}    (...)  The object to update.
   * @return {Deferred}         Return the current instance.
   * @type   Function
   * @function
   * @public
   * @static
   */
  update : function() {
    var that = Pot.Deferred.fn, args = arrayize(arguments);
    args.unshift(that);
    update.apply(that, args);
    return this;
  }
});

Pot.Deferred.prototype.init.prototype = Pot.Deferred.prototype;
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Private methods for Deferred
/**
 * @lends Pot.Deferred
 */
/**
 * Set the current state.
 *
 * @private
 * @ignore
 */
function setState(value) {
  if (Pot.isError(value)) {
    this.state = Pot.Deferred.states.failure;
  } else {
    this.state = Pot.Deferred.states.success;
  }
  return this.state;
}

/**
 * Post the state and fire the chains.
 *
 * @private
 * @ignore
 */
function post(value) {
  setState.call(this, value);
  this.results[Pot.Deferred.states[this.state]] = value;
  if (!this.freezing && !this.tilling && !this.waiting) {
    fire.call(this);
  }
}

/**
 * Fire the callback sequence chains.
 *
 * @private
 * @ignore
 */
function fire(force) {
  if (force || (!this.freezing && !this.tilling && !this.waiting)) {
    if (this.options && this.options.async) {
      fireAsync.call(this);
    } else {
      fireSync.call(this);
    }
  }
}

/**
 * Fire the callback sequence chains by asynchronous.
 *
 * @private
 * @ignore
 */
function fireAsync() {
  var that = this, speed, callback;
  if (this.options && Pot.isNumeric(this.options.speed)) {
    speed = this.options.speed;
  } else {
    speed = Pot.Deferred.defaults.speed;
  }
  this.freezing = true;
  /**@ignore*/
  callback = function() {
    try {
      fireProcedure.call(that);
    } catch (e) {
      that.freezing = false;
      throw e;
    }
    if (chainsEnabled.call(that)) {
      fire.call(that, true);
    } else {
      that.freezing = false;
    }
  };
  if (!speed && this.state === Pot.Deferred.states.unfired) {
    Pot.Internal.callInBackground.flush(callback);
  } else {
    Pot.Internal.setTimeout(callback, speed);
  }
}

/**
 * Fire the callback sequence chains by synchronous.
 *
 * @private
 * @ignore
 */
function fireSync() {
  fireProcedure.call(this);
  if (this.options && this.options.async) {
    fire.call(this);
  }
}

/**
 * Fire the callback sequence chains.
 *
 * @private
 * @ignore
 */
function fireProcedure() {
  var that = this, result, reply, callbacks, callback, nesting, isStop;
  clearChainDebris.call(this);
  result  = this.results[Pot.Deferred.states[this.state]];
  nesting = null;
  while (chainsEnabled.call(this)) {
    callbacks = this.chains.shift();
    callback = callbacks && callbacks[Pot.Deferred.states[this.state]];
    if (!Pot.isFunction(callback)) {
      continue;
    }
    isStop = false;
    try {
      if (this.destAssign ||
          (Pot.isNumber(callback.length) && callback.length > 1 &&
           Pot.isArray(result) && result.length === callback.length)) {
        reply = callback.apply(this, result);
      } else {
        reply = callback.call(this, result);
      }
      // We ignore undefined result when "return" statement is not exists.
      if (reply === undefined &&
          this.state !== Pot.Deferred.states.failure &&
          !Pot.isError(result) && !Pot.hasReturn(callback)) {
        reply = result;
      }
      result = reply;
      this.destAssign = false;
      this.state = setState.call({}, result);
      if (Pot.isDeferred(result)) {
        /**@ignore*/
        nesting = function(result) {
          return bush.call(that, result);
        };
        this.nested++;
      }
    } catch (e) {
      result = e;
      if (Pot.isStopIter(result)) {
        isStop = true;
      } else {
        setChainDebris.call(this, result);
      }
      this.destAssign = false;
      this.state = Pot.Deferred.states.failure;
      if (!Pot.isError(result)) {
        result = new Error(result);
        if (isStop) {
          update(result, {
            StopIteration : Pot.StopIteration
          });
        }
      }
    }
    if (this.options && this.options.async) {
      break;
    }
  }
  this.results[Pot.Deferred.states[this.state]] = result;
  if (nesting && this.nested) {
    result.ensure(nesting).end();
  }
  reserveChainDebris.call(this);
}

/**
 * Valid chains.
 *
 * @private
 * @ignore
 */
function chainsEnabled() {
  return this.chains  && this.chains.length &&
    this.nested === 0 && !this.cancelled;
}

/**
 * Check whether the errback is exists.
 *
 * @private
 * @ignore
 */
function hasErrback() {
  var exists, i, len, key, chains, errback;
  key = Pot.Deferred.states[Pot.Deferred.states.failure];
  chains = this.chains;
  len = chains && chains.length;
  if (len) {
    for (i = 0; i < len; i++) {
      if (chains[i]) {
        errback = chains[i][key];
        if (errback && Pot.isFunction(errback)) {
          exists = true;
          break;
        }
      }
    }
  }
  return exists;
}

/**
 * Set the chains debris (i.e., unhandled exception).
 *
 * @private
 * @ignore
 */
function setChainDebris(result) {
  if (!hasErrback.call(this)) {
    this.chainDebris = {
      error : result
    };
  }
}

/**
 * Reserved to handle the chains debris.
 *
 * @private
 * @ignore
 */
function reserveChainDebris() {
  var that = this, speed;
  if (this.chainDebris && 'error' in this.chainDebris &&
      (this.cancelled || this.chained ||
        (!this.chains || !this.chains.length))
  ) {
    if (this.options && Pot.isNumeric(this.options.speed)) {
      speed = this.options.speed;
    } else {
      speed = Pot.Deferred.defaults.speed;
    }
    this.chainDebris.timerId = Pot.Internal.setTimeout(function() {
      throw that.chainDebris.error;
    }, speed);
  }
}

/**
 * Clear the chains debris handler.
 *
 * @private
 * @ignore
 */
function clearChainDebris() {
  if (this.chainDebris && this.chainDebris.timerId != null &&
      (this.state & Pot.Deferred.states.fired) && hasErrback.call(this)) {
    Pot.Internal.clearTimeout(this.chainDebris.timerId);
    delete this.chainDebris.error;
    delete this.chainDebris.timerId;
    this.chainDebris = null;
  }
}

/**
 * Processing the child Deferred objects.
 *
 * @private
 * @ignore
 */
function bush(result) {
  post.call(this, result);
  this.nested--;
  if (this.nested === 0 && !this.cancelled &&
      (this.state & Pot.Deferred.states.fired)) {
    fire.call(this);
  }
}

/**
 * Parse the arguments of initialization method.
 *
 * @private
 * @ignore
 */
function initOptions(args, defaults) {
  var opts, speed, canceller, stopper, async, nop;
  if (args) {
    if (args.length === 1 && args[0] && Pot.isObject(args[0])) {
      opts = args[0];
      if (opts.speed !== nop || opts.canceller !== nop ||
          opts.async !== nop || opts.stopper   !== nop
      ) {
        speed     = opts.speed;
        canceller = opts.canceller;
        stopper   = opts.stopper;
        async     = opts.async;
      } else {
        speed     = opts.options && opts.options.speed;
        canceller = opts.options && opts.options.canceller;
        stopper   = opts.options && opts.options.stopper;
        async     = opts.options && opts.options.async;
      }
    } else {
      if (args.length === 1 && args[0] && Pot.isArray(args[0])) {
        opts = args[0];
      } else {
        opts = args;
      }
      each(opts || [], function(opt) {
        if (speed === nop && Pot.isNumeric(opt)) {
          speed = opt;
        } else if (speed === nop &&
                   Pot.isNumeric(Pot.Deferred.speeds[opt])) {
          speed = Pot.Deferred.speeds[opt];
        } else if (canceller === nop && Pot.isFunction(opt)) {
          canceller = opt;
        } else if (async === nop && Pot.isBoolean(opt)) {
          async = opt;
        } else if (stopper === nop &&
                 canceller === nop && Pot.isFunction(opt)) {
          stopper = opt;
        }
      });
    }
  }
  this.options = this.options || {};
  this.options.storage = this.options.storage || {};
  if (!Pot.isArray(this.options.cancellers)) {
    this.options.cancellers = [];
  }
  if (!Pot.isArray(this.options.stoppers)) {
    this.options.stoppers = [];
  }
  if (!Pot.isNumeric(speed)) {
    if (this.options.speed !== nop && Pot.isNumeric(this.options.speed)) {
      speed = this.options.speed - 0;
    } else {
      speed = defaults.speed;
    }
  }
  if (!Pot.isFunction(canceller)) {
    canceller = defaults.canceller;
  }
  if (!Pot.isFunction(stopper)) {
    stopper = defaults.stopper;
  }
  if (!Pot.isBoolean(async)) {
    if (this.options.async !== nop && Pot.isBoolean(this.options.async)) {
      async = this.options.async;
    } else {
      async = defaults.async;
    }
  }
  update(this.options, {
    speed : speed - 0,
    async : async
  });
  if (Pot.isFunction(canceller)) {
    this.options.cancellers.push(canceller);
  }
  if (Pot.isFunction(stopper)) {
    this.options.stoppers.push(stopper);
  }
  return this;
}

/**
 * Cancel the chains.
 *
 * @private
 * @ignore
 */
function cancelize(type) {
  var func;
  while (this.options[type] && this.options[type].length) {
    func = this.options[type].shift();
    if (Pot.isFunction(func)) {
      func.call(this);
    }
  }
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Create each speeds constructors (optional)

update(Pot.Deferred, {
  /**
   * @lends Pot.Deferred
   */
  /**
   * Extends object with speeds.
   *
   * @type Function
   * @function
   * @private
   * @ignore
   */
  extendSpeeds : function(target, name, construct, speeds) {
    /**@ignore*/
    var create = function(speedName, speed) {
      return function() {
        var opts = {}, args = arguments, me = args.callee;
        args = arrayize(args);
        initOptions.call(opts, args, {
          speed     : speed,
          canceller : Pot.Deferred.defaults.canceller,
          stopper   : Pot.Deferred.defaults.stopper,
          async     : Pot.Deferred.defaults.async
        });
        opts.speedName = speedName;
        args.unshift(opts);
        return construct.apply(me.instance, args);
      };
    },
    methods = {};
    each(speeds, function(val, key) {
      methods[key] = create(key, val);
    });
    return update(target[name], methods);
  }
});

update(Pot.Internal, {
  /**
   * Reference to instance of object.
   *
   * @private
   * @ignore
   */
  referSpeeds : update(function(speeds) {
    var me = arguments.callee, prop, speed;
    if (speeds && this.forEach.fast.instance !== this) {
      for (prop in me.props) {
        if (prop in this && this[prop]) {
          for (speed in me.speeds) {
            if (speed in speeds && speed in this[prop] && this[prop][speed]) {
              this[prop][speed].instance = this;
            }
          }
        }
      }
    }
  }, {
    /**@ignore*/
    props : {
      forEach : true,
      repeat  : true,
      forEver : true,
      iterate : true,
      items   : true,
      zip     : true,
      map     : true,
      filter  : true,
      reduce  : true,
      every   : true,
      some    : true
    },
    /**@ignore*/
    speeds : {
      limp   : 0,
      doze   : 1,
      slow   : 2,
      normal : 3,
      fast   : 4,
      rapid  : 5,
      ninja  : 6
    }
  })
});

/**
 * Pot.Deferred.*speed*
 * 
 * Ability to establish a chain method asynchronously with specified speed.
 *
 * @example
 *   // This chain will run slower than normal.
 *   var d = new Pot.Deferred.slow(); // or limp (comprehensible)
 *   d.then(function() {
 *     debug(1);
 *   }).then(function() {
 *     debug(2);
 *   }).then(function() {
 *     debug(3);
 *   }).begin();
 *
 *
 * @param  {Object|*}  Options.
 * @return {Deferred}  Returns new instance of Deferred.
 *
 * @static
 * @lends Pot.Deferred
 * @property {Function} limp
 *           Create new Deferred with slowest speed. (static)
 * @property {Function} doze
 *           Create new Deferred with slower speed. (static)
 * @property {Function} slow
 *           Create new Deferred with slow speed. (static)
 * @property {Function} normal
 *           Create new Deferred with normal speed. (static)
 * @property {Function} fast
 *           Create new Deferred with fast speed. (static)
 * @property {Function} rapid
 *           Create new Deferred with faster speed. (static)
 * @property {Function} ninja
 *           Create new Deferred with fastest speed. (static)
 */
Pot.Deferred.extendSpeeds(Pot, 'Deferred', function(options) {
  return Pot.Deferred(options);
}, Pot.Deferred.speeds);

}());
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Deferred utilities.
(function() {

update(Pot.Deferred, {
  /**
   * @lends Pot.Deferred
   */
  /**
   * Check whether the argument object is an instance of Pot.Deferred.
   *
   *
   * @example
   *   var o = {hoge: 1};
   *   var d = new Pot.Deferred();
   *   debug(isDeferred(o)); // false
   *   debug(isDeferred(d)); // true
   *
   *
   * @param  {Object|*}  x  The target object to test.
   * @return {Boolean}      Return true if the argument object is an
   *                          instance of Pot.Deferred,
   *                          otherwise return false.
   * @type Function
   * @function
   * @public
   * @static
   */
  isDeferred : Pot.isDeferred,
  /**
   * Return a Deferred that has already had .begin(result) called.
   *
   * This method useful when you execute synchronous code to
   *   an asynchronous interface.
   * i.e., some code is calling you expecting a Deferred result,
   *   but you don't actually need to do anything asynchronous.
   * Just return succeed(theResult).
   *
   *
   * @example
   *   function testFunc(value) {
   *     var result;
   *     if (value) {
   *       result = Pot.Deferred.succeed(value);
   *     } else {
   *       result = Pot.Deferred.begin(function() {
   *         return 'anything';
   *       });
   *     }
   *     return result;
   *   }
   *   testFunc( Math.random() * 10 >= 5 ? 'OK' : false ).then(function(res) {
   *     debug(res);
   *     // @results  res = 'OK' or 'anything'
   *   });
   *
   *
   * @param  {*}        (...)  The result to give to
   *                             Deferred.prototype.begin(result).
   * @return {Deferred}        Return a new Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  succeed : function(/*[...args]*/) {
    var d = new Pot.Deferred();
    d.begin.apply(d, arguments);
    return d;
  },
  /**
   * Return a Deferred that has already had .raise(result) called.
   *
   *
   * @example
   *   function testFunc(value) {
   *     var result;
   *     if (!value) {
   *       result = Pot.Deferred.failure('error');
   *     } else {
   *       result = Pot.Deferred.begin(function() {
   *         return 'success';
   *       });
   *     }
   *     return result;
   *   }
   *   testFunc(Math.random() * 10 >= 5 ? false : true).ensure(function(res) {
   *     debug(res);
   *     // @results  res = Error('error') or 'success'
   *   });
   *
   *
   * @param  {*}        (...)   The result to give to
   *                              Deferred.prototype.raise(result).
   * @return {Deferred}         Return a new Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  failure : function(/*[...args]*/) {
    var d = new Pot.Deferred();
    d.raise.apply(d, arguments);
    return d;
  },
  /**
   * Return a new cancellable Deferred that will .begin() after
   *  at least seconds seconds have elapsed.
   *
   *
   * @example
   *   // Called after 5 seconds.
   *   Pot.Deferred.wait(5).then(function() {
   *     debug('Begin wait() test');
   *   }).then(function() {
   *     return Pot.Deferred.wait(2); // Wait 2 seconds.
   *   }).then(function() {
   *     debug('End wait() test');
   *   });
   *
   *
   * @param  {Number}  seconds  Number of seconds.
   * @param  {*}       (value)  (optional) The value passed to the next chain.
   * @return {Deferred}         Return a new Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  wait : function(seconds, value) {
    var timer, d = new Pot.Deferred({
      /**@ignore*/
      canceller : function() {
        try {
          Pot.Internal.clearTimeout(timer);
        } catch (e) {}
      }
    });
    if (arguments.length >= 2) {
      d.then(function() {
        return value;
      });
    }
    timer = Pot.Internal.setTimeout(function() {
      d.begin();
    }, Math.floor(((seconds - 0) || 0) * 1000));
    return d;
  },
  /**
   * Call the specified function after a few(seconds) seconds.
   *
   *
   * @example
   *   var value = null;
   *   // Called after 1 second.
   *   Pot.Deferred.callLater(1, function() {
   *     value = 'hoge';
   *   });
   *   debug(value); // null
   *   Pot.Deferred.callLater(1, function() {
   *     debug(value); // 'hoge'
   *   });
   *
   *
   * @example
   *   // Create a new Deferred synchronously.
   *   var d = new Pot.Deferred({ async : false });
   *   d.then(function() {
   *     return 'Hello Deferred!';
   *   }).then(function(res) {
   *     debug(res);
   *   });
   *   // But, run with asynchronously.
   *   // If the argument is the instance of Deferred
   *   //  then will be called "begin" method.
   *   Pot.Deferred.callLater(5, d); // Called after 5 seconds.
   *
   *
   * @param  {Number}   seconds   The number of seconds to delay.
   * @param  {Function} callback  The callback function.
   * @return {Deferred}           Return a new Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  callLater : function(seconds, callback) {
    var args = arrayize(arguments, 2);
    return Pot.Deferred.wait(seconds).then(function() {
      if (Pot.isDeferred(callback)) {
        return callback.begin.apply(callback, args);
      } else if (Pot.isFunction(callback)) {
        return callback.apply(callback, args);
      } else {
        return callback;
      }
    });
  },
  /**
   * Call the specified function as browser-non-blocking in background.
   * If callback is a Deferred, then will call .begin(args)
   *
   *
   * @example
   *   var value = null;
   *   Pot.Deferred.callLazy(function() {
   *     value = 'hoge';
   *   });
   *   debug(value); // null
   *   Pot.Deferred.callLazy(function() {
   *     debug(value); // 'hoge'
   *   });
   *
   *
   * @example
   *   // Create a new Deferred synchronously.
   *   var d = new Pot.Deferred({ async : false });
   *   d.then(function() {
   *     return 'Hello Deferred!';
   *   }).then(function(res) {
   *     debug(res);
   *   });
   *   // But, run with asynchronously.
   *   // If the argument is the instance of Deferred
   *   //  then will be called "begin" method.
   *   Pot.Deferred.callLazy(d);
   *
   *
   * @param  {Function} callback  A function to execute.
   * @return {Deferred}           Return a new Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  callLazy : function(callback) {
    var args = arrayize(arguments, 1);
    return Pot.Deferred.begin(function() {
      if (Pot.isDeferred(callback)) {
        return callback.begin.apply(callback, args);
      } else if (Pot.isFunction(callback)) {
        return callback.apply(callback, args);
      } else {
        return callback;
      }
    });
  },
  /**
   * Return a Deferred surely that maybe as a Deferred.
   *
   *
   * @example
   *   var maybeTest = function(obj) {
   *     var deferred = Pot.Deferred.maybeDeferred(obj);
   *     debug(deferred);
   *     // @results  deferred = (object Deferred {...})
   *     return deferred;
   *   };
   *   var obj;
   *   if (Math.random() * 10 < 5) {
   *     obj = new Pot.Deferred().then(function() {
   *       return 'foo';
   *     });
   *   } else {
   *     obj = 'bar';
   *   }
   *   maybeTest(obj).then(function(res) {
   *     debug('res = ' + res); // 'foo' or 'bar'
   *   }).begin();
   *
   *
   * @param  {*}         x    The value like a Deferred.
   * @retrun {Deferred}       Return a Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  maybeDeferred : function(x) {
    var result;
    if (Pot.isDeferred(x)) {
      if (Pot.Deferred.isFired(x)) {
        result = x;
      } else {
        result = x.begin();
      }
    } else if (Pot.isError(x)) {
      result = Pot.Deferred.failure(x);
    } else {
      result = Pot.Deferred.succeed(x);
    }
    return result;
  },
  /**
   * Check whether the callback chain was fired.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   debug( Pot.Deferred.isFired(d) ); // false
   *   d.then(function() {
   *     return 'hoge';
   *   });
   *   debug( Pot.Deferred.isFired(d) ); // false
   *   d.begin();
   *   debug( Pot.Deferred.isFired(d) ); // true
   *
   *
   * @param  {Deferred}  deferred  The target Deferred object.
   * @return {Boolean}             Return whether the
   *                                 callback chain was fired.
   * @type Function
   * @function
   * @public
   * @static
   */
  isFired : function(deferred) {
    return Pot.isDeferred(deferred) &&
           ((deferred.state & Pot.Deferred.states.fired) !== 0);
  },
  /**
   * Get the last result of the callback chains.
   *
   *
   * @example
   *   var d = new Pot.Deferred({ async : false });
   *   d.then(function() {
   *     return 'foo';
   *   }).then(function(res) {
   *     return 'bar';
   *   }).then(function(res) {
   *     return 'baz';
   *   }).begin();
   *   var result = Pot.Deferred.lastResult(d);
   *   debug(result);
   *   // @results  result = 'baz'
   *
   *
   * @param  {Deferred}  deferred  The target Deferred object.
   * @param  {*}         (value)   (Optional) The input value.
   * @return {*}                   Return the last result if exist.
   * @type Function
   * @function
   * @public
   * @static
   */
  lastResult : function(deferred, value) {
    var result, args = arguments, key;
    if (Pot.isDeferred(deferred)) {
      try {
        key = Pot.Deferred.states[Pot.Deferred.states.success];
        if (args.length <= 1) {
          result = deferred.results[key];
        } else {
          deferred.results[key] = value;
          result = deferred;
        }
      } catch (e) {}
    }
    return result;
  },
  /**
   * Get the last Error of the callback chains.
   *
   *
   * @example
   *   var d = new Pot.Deferred({ async : false });
   *   d.then(function() {
   *     throw new Error('foo');
   *   }).then(function(res) {
   *     throw new Error('bar');
   *   }).then(function(res) {
   *     throw new Error('baz');
   *   }).begin();
   *   var result = Pot.Deferred.lastError(d);
   *   debug(result);
   *   // @results  result = (Error: foo)
   *
   *
   * @param  {Deferred}  deferred  The target Deferred object.
   * @param  {*}         (value)   (Optional) The input value.
   * @return {*}                   Return the last Error if exist.
   * @type Function
   * @function
   * @public
   * @static
   */
  lastError : function(deferred, value) {
    var result, args = arguments, key;
    if (Pot.isDeferred(deferred)) {
      try {
        key = Pot.Deferred.states[Pot.Deferred.states.failure];
        if (args.length <= 1) {
          result = deferred.results[key];
        } else {
          if (!Pot.isError(value)) {
            value = new Error(value);
          }
          deferred.results[key] = value;
          result = deferred;
        }
      } catch (e) {}
    }
    return result;
  },
  /**
   * Register the new method into Pot.Deferred.prototype.
   *
   *
   * @example
   *   // Register the new method for waiting 5 seconds.
   *   Pot.Deferred.register('wait5', function(args) {
   *     return Pot.Deferred.wait(5).then(function() {
   *       return args.result;
   *     });
   *   });
   *   // Use registered method.
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     debug('begin');
   *     return 1;
   *   }).wait5().then(function(res) {
   *     debug(res); // @results  res = 1
   *     debug('end');
   *   });
   *   d.begin();
   *
   *
   * @example
   *   // Register a new method for add the input value and the result.
   *   Pot.Deferred.register('add', function(args) {
   *     return args.inputs[0] + args.results[0];
   *   });
   *   // Use registered method.
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     debug('begin');
   *     return 100;
   *   }).add(50).then(function(res) {
   *     debug(res); // @results  res = 150
   *     debug('end');
   *   });
   *   d.begin();
   *
   *
   * @param  {String|Object}  name  The name of the new method.
   *                                  Or, the new methods as key-value object.
   * @param  {Function}       func  The new method.
   *                                  A new function has defined argument
   *                                    that is an object.
   *                                  <pre>
   *                                  -------------------------------------
   *                                  function(args)
   *                                    - args.inputs  : {Arguments}
   *                                        The original input arguments.
   *                                    - args.results : {Arguments}
   *                                        The result of previous
   *                                          callback chain.
   *                                  -------------------------------------
   *                                  </pre>
   * @return {Number}               Return the registered count.
   * @type Function
   * @function
   * @public
   * @static
   */
  register : function(/*name, func*/) {
    var result, that = Pot.Deferred.fn, args = arrayize(arguments), methods;
    result  = 0;
    methods = [];
    switch (args.length) {
      case 0:
          break;
      case 1:
          if (Pot.isObject(args[0])) {
            each(args[0], function(val, key) {
              if (Pot.isFunction(val) && Pot.isString(key)) {
                methods.push([key, val]);
              } else if (Pot.isFunction(key) && Pot.isString(val)) {
                methods.push([val, key]);
              }
            });
          }
          break;
      case 2:
      default:
          if (Pot.isFunction(args[0])) {
            methods.push([args[1], args[0]]);
          } else {
            methods.push([args[0], args[1]]);
          }
          break;
    }
    if (methods && methods.length) {
      each(methods, function(item) {
        var subs = {}, name, func, method;
        if (item && item.length >= 2 && Pot.isFunction(item[1])) {
          name = stringify(item[0], true);
          func = item[1];
          /**@ignore*/
          method = function() {
            var params = {};
            params.inputs = arguments;
            return this.then(function() {
              params.results = arguments;
              return func.call(this, params);
            });
          };
          subs[name] = method;
          update(that, subs);
          result++;
        }
      });
    }
    return result;
  },
  /**
   * Unregister the user defined method from Pot.Deferred.prototype.
   *
   *
   * @example
   *   // Register a new method for add the input value and the result.
   *   Pot.Deferred.register('add', function(args) {
   *     return args.inputs[0] + args.results[0];
   *   });
   *   // Use registered method.
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     debug('begin');
   *     return 100;
   *   }).add(50).then(function(res) {
   *     debug(res); // @results  res = 150
   *     debug('end');
   *   });
   *   d.begin();
   *   // Unregister the user defined method from Pot.Deferred.prototype.
   *   Pot.Deferred.unregister('add');
   *   var dfd = new Pot.Deferred();
   *   dfd.then(function() {
   *     debug('After unregister');
   *     return 10;
   *     // Next chain will be occur an error: add is undefined.
   *   }).add(20).then(function(res) {
   *     debug(res);
   *   });
   *   dfd.begin();
   *
   *
   * @param  {String|Array}  name  The name of the user defined method.
   * @return {Number}              Return the unregistered count.
   * @type Function
   * @function
   * @public
   * @static
   */
  unregister : function(/*name*/) {
    var result, that = Pot.Deferred.fn, args = arrayize(arguments), names;
    result = 0;
    if (args.length > 1) {
      names = args;
    } else {
      names = args[0];
    }
    each(arrayize(names), function(name) {
      try {
        delete that[name];
        result++;
      } catch (e) {}
    });
    return result;
  },
  /**
   * Create new defer function from static function.
   * That returns a new instance of Pot.Deferred that
   *   has already ".begin()" called.
   *
   *
   * @example
   *   var timer = Pot.Deferred.deferrize(window, 'setTimeout');
   *   // Call the defer function with same as the original arguments usage.
   *   timer(function() {
   *     debug('in timer (2000 ms.)');
   *   }, 2000).then(function() {
   *     debug('End timer');
   *   });
   *
   *
   * @example
   *   var byId = Pot.Deferred.deferrize(document, 'getElementById');
   *   // Call the defer function with same as the original arguments usage.
   *   byId('container').then(function(element) {
   *     debug('End byId()');
   *     debug('tagName = ' + element.tagName);
   *     // @results  tagName = 'DIV'
   *   });
   *
   *
   * @example
   *   // Example of user defined function.
   *   var toCharCode = Pot.Deferred.deferrize(function(string) {
   *     var chars = [], i, len = string.length;
   *     for (i = 0; i < len; i++) {
   *       chars.push(string.charCodeAt(i));
   *     }
   *     return chars;
   *   });
   *   var string = 'abcdef';
   *   Pot.Deferred.begin(function() {
   *     debug('string = ' + string);
   *     return toCharCode(string).then(function(result) {
   *       debug('result = ' + result);
   *       // @results  result = [97, 98, 99, 100, 101, 102]
   *     });
   *   });
   *
   *
   * @param  {Object|Function}   object   The context object.
   *                                        or the target function.
   * @param  {String|Function}  (method)  The target function name.
   *                                        or the target function.
   * @return {Function}                   The defer function that
   *                                        returns Deferred object.
   * @based  JSDeferred.connect
   * @type   Function
   * @function
   * @public
   * @static
   */
  deferrize : function(object, method) {
    var args = arguments, func, context, err;
    try {
      switch (args.length) {
        case 0:
            throw false;
        case 1:
            func = object;
            break;
        case 2:
        default:
            if (Pot.isObject(method)) {
              context = method;
              func    = object;
            } else {
              func    = method;
              context = object;
            }
            break;
      }
      if (!func) {
        throw func;
      }
    } catch (e) {
      err = e;
      throw (Pot.isError(err) ? err : new Error(err));
    }
    return function() {
      var that = this, args = arrayize(arguments), d = new Pot.Deferred();
      d.then(function() {
        var dd, result, params = [], done = false, error, isFired;
        isFired = Pot.Deferred.isFired;
        dd = new Pot.Deferred();
        each(args, function(val) {
          if (Pot.isFunction(val)) {
            params.push(function() {
              var r, er;
              try {
                r = val.apply(that, arguments);
              } catch (e) {
                er = e;
                if (!isFired(dd)) {
                  dd.raise(er);
                }
              } finally {
                if (!isFired(dd)) {
                  dd.begin(r);
                }
              }
              if (er != null) {
                throw er;
              }
              return r;
            });
            done = true;
          } else {
            params[params.length] = val;
          }
        });
        try {
          result = invoke(context, func, params);
        } catch (e) {
          error = e;
          if (!done && !isFired(dd)) {
            dd.raise(error);
          }
        } finally {
          if (!done && !isFired(dd)) {
            dd.begin(result);
          }
        }
        if (error != null) {
          throw Pot.isError(error) ? error : new Error(error);
        }
        return dd;
      }).begin();
      return d;
    };
  },
  /**
   * Update the Pot.Deferred.
   *
   *
   * @example
   *   // Update Pot.Deferred.
   *   Pot.Deferred.update({
   *     sayHoge : function() {
   *       alert('hoge');
   *     }
   *   });
   *   Pot.Deferred.sayHoge(); // hoge
   *
   *
   * @param  {Object}        (...)  The object to update.
   * @return {Pot.Deferred}         Return Pot.Deferred.
   * @type   Function
   * @function
   * @public
   * @static
   */
  update : function() {
    var that = Pot.Deferred, args = arrayize(arguments);
    args.unshift(that);
    return update.apply(that, args);
  }
});

// Definitions of the loop/iterator methods.
update(Pot.Deferred, {
  /**
   * @lends Pot.Deferred
   */
  /**
   * A shortcut faster way of creating new Deferred sequence.
   *
   *
   * @example
   *   Pot.Deferred.begin(function() {
   *     debug('Begin Deferred.begin');
   *   }).wait(1).then(function() {
   *     debug('End Deferred.begin');
   *   });
   *   // Without having to call  the ".begin()", has already executed.
   *
   *
   * @param  {Function|*}   x   A callback function or any value.
   * @return {Deferred}         Return a new Deferred.
   * @class
   * @type Function
   * @function
   * @public
   * @static
   */
  begin : function(x) {
    var d, args = arrayize(arguments, 1), isCallable, value;
    d = new Pot.Deferred();
    isCallable = (x && Pot.isFunction(x));
    if (isCallable) {
      d.then(function() {
        return x.apply(this, args);
      });
    } else {
      value = x;
    }
    Pot.Internal.callInBackground.flush(function() {
      d.begin(value);
    });
    return d;
  },
  /**
   * Call the function with asynchronous.
   *
   *
   * @example
   *   var value = null;
   *   // Call the function with asynchronous.
   *   Pot.Deferred.flush(function() {
   *     debug('Begin Deferred.flush');
   *     value = 1;
   *   }).wait(1).then(function() {
   *     debug('End Deferred.flush');
   *     value = 2;
   *   });
   *   // Without having to call the ".begin()", has already executed.
   *   debug(value);
   *   // @results  value = null
   *   Pot.Deferred.callLater(2.5, function() {
   *     debug(value);
   *     // @results  value = 2
   *   });
   *
   *
   * @param  {Function|*} callback  A function to call.
   * @param  {...}        (...)     Arguments passed to callback.
   * @return {Deferred}             Return a new Deferred.
   * @class
   * @type Function
   * @function
   * @public
   * @static
   */
  flush : function(callback) {
    var args = arrayize(arguments, 1);
    return Pot.Deferred.begin(function() {
      if (Pot.isDeferred(callback)) {
        return callback.begin.apply(callback, args);
      } else if (Pot.isFunction(callback)) {
        return callback.apply(this, args);
      } else {
        return callback;
      }
    });
  },
  /**
   * Wait until the condition completed.
   * If true returned, waiting state will end.
   *
   *
   * @example
   *   debug('Begin till');
   *   Pot.Deferred.till(function() {
   *     // wait until the DOM body element is loaded
   *     if (!document.body) {
   *       return false;
   *     } else {
   *       return true;
   *     }
   *   }).then(function() {
   *     debug('End till');
   *     document.body.innerHTML += 'hoge';
   *   });
   *
   *
   * @param  {Function|*}   cond   A function or value as condition.
   * @return {Deferred}            Return the Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  till : function(cond) {
    var d = new Pot.Deferred(), args = arrayize(arguments, 1), interval = 13;
    return Pot.Deferred.begin(function() {
      var that = this, me = arguments.callee, time = now();
      if (cond && !cond.apply(this, args)) {
        Pot.Internal.setTimeout(function() {
          me.call(that);
        }, Math.min(1000, interval + (now() - time)));
      } else {
        d.begin();
      }
      return d;
    });
  },
  /**
   * Bundle up some Deferreds (DeferredList) to one Deferred
   *  then returns results of  these list.
   *
   * The DeferredList can be as Array or Object.
   *
   *
   * @example
   *   Pot.Deferred.parallel([
   *     function() {
   *       debug(1);
   *       return 1;
   *     },
   *     function() {
   *       debug(2);
   *       var d = new Pot.Deferred();
   *       return d.then(function() { return 2; }).begin();
   *     },
   *     Pot.Deferred.begin(function() {
   *       return Pot.Deferred.wait(2).then(function() {
   *         debug(3);
   *         return 3;
   *       });
   *     }),
   *     '{4}',
   *     (new Pot.Deferred()).then(function() {
   *       return Pot.Deferred.wait(1.5).then(function() {
   *         debug(5);
   *         return 5;
   *       });
   *     }),
   *     6.00126,
   *     function() {
   *       return Pot.Deferred.succeed().then(function() {
   *         return Pot.Deferred.wait(1).then(function() {
   *           return 7;
   *         });
   *       });
   *     },
   *     function() {
   *       return Pot.Deferred.begin(function() {
   *         debug(8);
   *         return 8;
   *       });
   *     }
   *   ]).then(function(values) {
   *     debug(values);
   *     // values[0] == 1
   *     // values[1] == 2
   *     // values[2] == 3
   *     // values[3] == '{4}'
   *     // ...
   *   });
   *   // @results  values = [1, 2, 3, '{4}', 5, 6.00126, 7, 8]
   *   //
   *   // output: 1, 2, 8, 5, 3 ...
   *   //
   *
   *
   * @example
   *   Pot.Deferred.parallel({
   *     foo : function() {
   *       debug(1);
   *       return 1;
   *     },
   *     bar : (new Pot.Deferred()).then(function() {
   *       return Pot.Deferred.begin(function() {
   *         return Pot.Deferred.wait(1).then(function() {
   *           debug(2);
   *           return Pot.Deferred.succeed(2);
   *         });
   *       });
   *     }),
   *     baz : function() {
   *       var d = new Pot.Deferred();
   *       return d.async(false).then(function() {
   *         debug(3);
   *         return 3;
   *       });
   *     }
   *   }).then(function(values) {
   *     debug(values);
   *     // values.foo == 1
   *     // values.bar == 2
   *     // values.baz == 3
   *   });
   *   // @results  values = {foo: 1, baz: 3, bar: 2}
   *   //
   *   // output: 1, 3, 2
   *   //
   *
   *
   * @param  {...[Array|Object|*]} deferredList  Deferred list to get
   *                                               the results in bundles.
   * @return {Deferred}                          Return the Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  parallel : function(deferredList) {
    var result, args = arguments, d, deferreds, values, bounds;
    if (args.length === 0) {
      result = Pot.Deferred.succeed();
    } else {
      if (args.length === 1) {
        if (Pot.isObject(deferredList)) {
          deferreds = deferredList;
        } else {
          deferreds = arrayize(deferredList);
        }
      } else {
        deferreds = arrayize(args);
      }
      result = new Pot.Deferred({
        /**@ignore*/
        canceller : function() {
          each(deferreds, function(deferred) {
            if (Pot.isDeferred(deferred)) {
              deferred.cancel();
            }
          });
        }
      });
      d = new Pot.Deferred();
      bounds = [];
      values = Pot.isObject(deferreds) ? {} : [];
      each(deferreds, function(deferred, key) {
        var defer;
        if (Pot.isDeferred(deferred)) {
          defer = deferred;
        } else if (Pot.isFunction(deferred)) {
          defer = new Pot.Deferred();
          defer.then(function() {
            var r = deferred();
            if (Pot.isDeferred(r) &&
                r.state === Pot.Deferred.states.unfired) {
              r.begin();
            }
            return r;
          });
        } else {
          defer = Pot.Deferred.succeed(deferred);
        }
        if (!Pot.isDeferred(defer)) {
          defer = Pot.Deferred.maybeDeferred(defer);
        }
        bounds[bounds.length] = key;
        d.then(function() {
          if (defer.state === Pot.Deferred.states.unfired) {
            Pot.Deferred.flush(defer);
          }
          defer.then(function(value) {
            if (bounds.length) {
              values[key] = value;
              bounds.pop();
              if (bounds.length === 0) {
                result.begin(values);
              }
            }
          }, function(err) {
            bounds = [];
            result.raise(err);
          });
        });
      });
      Pot.Deferred.flush(d);
    }
    return result;
  },
  /**
   * Create a new Deferred with callback chains by
   *   some functionable arguments.
   *
   *
   * @example
   *   var deferred = Pot.Deferred.chain(
   *     function() {
   *       debug(1);
   *       return Pot.Deferred.wait(1);
   *     },
   *     function() {
   *       debug(2);
   *       throw new Error('error');
   *     },
   *     function rescue(err) {
   *       debug(3);
   *       debug('Error : ' + err);
   *     },
   *     1000,
   *     function(number) {
   *       debug(4);
   *       debug('prev number = ' + number);
   *       return Pot.Deferred.wait(2);
   *     },
   *     {
   *       foo : function() {
   *         debug('5 foo');
   *         return '{{foo}}';
   *       },
   *       bar : function() {
   *         debug('6 bar');
   *         return Pot.Deferred.begin(function() {
   *           return '{{bar}}';
   *         });
   *       }
   *     },
   *     function(res) {
   *       debug('7 res:');
   *       debug(res);
   *     },
   *     new Error('error2'),
   *     function() {
   *       debug('This chain will not be called.');
   *     },
   *     function rescue(e) {
   *       debug(8);
   *       debug('Error : ' + e);
   *     },
   *     [
   *       function() {
   *         debug(9);
   *         return Pot.Deferred.wait(1).then(function() {
   *           return 9;
   *         });
   *       },
   *       function() {
   *         debug(10);
   *         return Pot.Deferred.wait(1.5).then(function() {
   *           return Pot.Deferred.succeed(10);
   *         });
   *       }
   *     ],
   *     function(res) {
   *       debug('11 res:');
   *       debug('res[0] = ' + res[0] + ', res[1] = ' + res[1]);
   *     },
   *     (new Pot.Deferred()).then(function() {
   *       debug('12 [END]');
   *     })
   *   );
   *
   *
   * @param  {...[Function|Array|Object|*]}  (...)  Arguments to
   *                                                  concatenate the chains.
   * @return {Deferred}                             Return a new Deferred.
   * @type Function
   * @function
   * @public
   * @static
   * @based  JSDeferred.chain
   */
  chain : (function() {
    var re = {
      funcName : /^\s*[()]*\s*function\s*([^\s()]+)/,
      rescue   : /rescue|raise|err|fail/i
    };
    return function(/*...args*/) {
      var args = arguments, len = args.length, chains,
          chain = new Pot.Deferred();
      if (len > 0) {
        chains = arrayize((len === 1) ? args[0] : args);
        each(chains, function(o) {
          var name;
          if (Pot.isFunction(o)) {
            try {
              name = o.toString().match(re.funcName)[1];
            } catch (e) {}
            if (name && re.rescue.test(name)) {
              chain.rescue(o);
            } else {
              chain.then(o);
            }
          } else if (Pot.isDeferred(o)) {
            chain.then(function(v) {
              if (o.state === Pot.Deferred.states.unfired) {
                o.begin(v);
              }
              return o;
            });
          } else if (Pot.isObject(o) || Pot.isArray(o)) {
            chain.then(function() {
              return Pot.Deferred.parallel(o);
            });
          } else if (Pot.isError(o)) {
            chain.then(function() {
              throw o;
            });
          } else {
            chain.then(function() {
              return o;
            });
          }
        });
      }
      Pot.Deferred.callLazy(chain);
      return chain;
    };
  }())
});

// Extends the speeds control methods
/**
 * Pot.Deferred.begin.*speed* (limp/doze/slow/normal/fast/rapid/ninja).
 *
 * A shortcut faster way of
 *   creating new Deferred sequence with specified speed.
 *
 * @param  {Function|*}   x   A callback function or any value.
 * @return {Deferred}         Return a new Deferred.
 *
 * @static
 * @lends Pot.Deferred.begin
 * @property {Function} limp
 *           Return new Deferred with slowest speed. (static)
 * @property {Function} doze
 *           Return new Deferred with slower speed. (static)
 * @property {Function} slow
 *           Return new Deferred with slow speed. (static)
 * @property {Function} normal
 *           Return new Deferred with normal speed. (static)
 * @property {Function} fast
 *           Return new Deferred with fast speed. (static)
 * @property {Function} rapid
 *           Return new Deferred with faster speed. (static)
 * @property {Function} ninja
 *           Return new Deferred with fastest speed. (static)
 */
Pot.Deferred.extendSpeeds(Pot.Deferred, 'begin', function(opts, x) {
  var d, timer, args = arrayize(arguments, 2), isCallable, op, speed, value;
  isCallable = (x && Pot.isFunction(x));
  op = opts.options || opts || {};
  if (!op.cancellers) {
    op.cancellers = [];
  }
  op.cancellers.push(function() {
    try {
      if (timer != null) {
        Pot.Internal.clearTimeout(timer);
      }
    } catch (e) {}
  });
  d = new Pot.Deferred(op);
  if (isCallable) {
    d.then(function() {
      return x.apply(this, args);
    });
  } else {
    value = x;
  }
  speed = (((opts.options && opts.options.speed) || opts.speed) - 0) || 0;
  if (Pot.isNumeric(speed) && speed > 0) {
    timer = Pot.Internal.setTimeout(function() {
      d.begin(value);
    }, speed);
  } else {
    Pot.Internal.callInBackground.flush(function() {
      d.begin(value);
    });
  }
  return d;
}, Pot.Deferred.speeds);

/**
 * Pot.Deferred.flush.*speed* (limp/doze/slow/normal/fast/rapid/ninja).
 *
 * Call the function with asynchronous by specified speed.
 *
 * @param  {Function|*} callback  A function to call.
 * @param  {...}        (...)     Arguments passed to callback.
 * @return {Deferred}
 *
 * @static
 * @lends Pot.Deferred.flush
 * @property {Function} limp
 *           Return new Deferred with slowest speed. (static)
 * @property {Function} doze
 *           Return new Deferred with slower speed. (static)
 * @property {Function} slow
 *           Return new Deferred with slow speed. (static)
 * @property {Function} normal
 *           Return new Deferred with normal speed. (static)
 * @property {Function} fast
 *           Return new Deferred with fast speed. (static)
 * @property {Function} rapid
 *           Return new Deferred with faster speed. (static)
 * @property {Function} ninja
 *           Return new Deferred with fastest speed. (static)
 */
Pot.Deferred.extendSpeeds(Pot.Deferred, 'flush', function(opts, callback) {
  var speed, name, method, args = arrayize(arguments, 2);
  speed = opts.options ? opts.options.speed : opts.speed;
  if (speed in Pot.Deferred.speeds &&
      Pot.isString(Pot.Deferred.speeds[speed])) {
    name = Pot.Deferred.speeds[speed];
  } else {
    each(Pot.Deferred.speeds, function(val, key) {
      if (val == speed) {
        name = key;
        throw Pot.StopIteration;
      }
    });
  }
  if (name && name in Pot.Deferred.begin) {
    method = Pot.Deferred.begin[name];
  } else {
    method = Pot.Deferred.begin;
  }
  return method(function() {
    if (Pot.isDeferred(callback)) {
      return callback.begin.apply(callback, args);
    } else if (Pot.isFunction(callback)) {
      return callback.apply(this, args);
    } else {
      return callback;
    }
  });
}, Pot.Deferred.speeds);

// Update Pot object.
Pot.update({
  succeed       : Pot.Deferred.succeed,
  failure       : Pot.Deferred.failure,
  wait          : Pot.Deferred.wait,
  callLater     : Pot.Deferred.callLater,
  callLazy      : Pot.Deferred.callLazy,
  maybeDeferred : Pot.Deferred.maybeDeferred,
  isFired       : Pot.Deferred.isFired,
  lastResult    : Pot.Deferred.lastResult,
  lastError     : Pot.Deferred.lastError,
  register      : Pot.Deferred.register,
  unregister    : Pot.Deferred.unregister,
  deferrize     : Pot.Deferred.deferrize,
  begin         : Pot.Deferred.begin,
  flush         : Pot.Deferred.flush,
  till          : Pot.Deferred.till,
  parallel      : Pot.Deferred.parallel,
  chain         : Pot.Deferred.chain
});

}());

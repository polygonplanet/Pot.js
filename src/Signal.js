//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Signal/Event.
(function() {
var
/**@ignore*/
handlers         = [],
propHandlers     = [],
attachedHandlers = [],
trappers         = {},
handlersLocked   = false,
errorKey         = '*e',
PREFIX           = '.',
RE               = {
  MOUSE_OVER : /mouse(?:over|enter)/,
  MOUSE_OUT  : /mouse(?:out|leave)/,
  EVENT_ONCE : /^(?:on|)(?:(?:un|)load|DOMContentLoaded)$/,
  ID_CLEAN   : /^#/
};

Pot.update({
  /**
   * Signal/Event utilities.
   *
   * @name Pot.Signal
   * @type Object
   * @class
   * @static
   * @public
   */
  Signal : {}
});

update(Pot.Signal, {
  /**
   * @lends Pot.Signal
   */
  /**
   * @ignore
   */
  NAME : 'Signal',
  /**
   * @ignore
   */
  toString : Pot.toString,
  /**
   * @ignore
   */
  Handler : update(function(args) {
    return new Pot.Signal.Handler.prototype.init(args);
  }, {
    /**
     * @lends Pot.Signal.Handler
     */
    /**
     * @ignore
     * @const
     * @private
     */
    advices : {
      normal     : 0x01,
      before     : 0x02,
      around     : 0x04,
      after      : 0x08,
      propBefore : 0x10,
      propAround : 0x20,
      propAfter  : 0x40
    }
  }),
  /**
   * @lends Pot.Signal
   */
  /**
   * @private
   * @ignore
   */
  Observer : function(object, ev) {
    var that = this, evt, pi = this.PotInternal;
    if (!pi.serial) {
      pi.serial = buildSerial(this);
    }
    update(pi, {
      orgEvent : ev || (typeof window === 'object' && window.event) || {},
      object   : object
    });
    evt = pi.orgEvent;
    if (!Pot.isObject(evt)) {
      pi.orgEvent = evt = {type : evt};
    }
    each(update({}, evt), function(v, p) {
      if (!hasOwnProperty.call(that, p)) {
        that[p] = v;
      }
    });
    try {
      if (!evt.target) {
        evt.target = evt.srcElement || Pot.currentDocument() || {};
      }
      if (evt.target.nodeType == 3 && evt.target.parentNode) {
        evt.target = evt.target.parentNode;
      }
      if (evt.metaKey == null) {
        evt.metaKey = evt.ctrlKey;
      }
      if (evt.timeStamp == null) {
        evt.timeStamp = now();
      }
      if (evt.relatedTarget == null) {
        if (RE.MOUSE_OVER.test(evt.type)) {
          evt.relatedTarget = evt.fromElement;
        } else if (RE.MOUSE_OUT.test(evt.type)) {
          evt.relatedTarget = evt.toElement;
        }
      }
    } catch (ex) {}
    this.originalEvent = evt;
  },
  /**
   * @lends Pot.Signal
   */
  /**
   * Drop file constructor.
   *
   *
   * @example
   *   // This example using jQuery.
   *   var panel = $('<div/>')
   *     .css({
   *       position   : 'fixed',
   *       left       : '10%',
   *       top        : '10%',
   *       width      : '80%',
   *       height     : '80%',
   *       minHeight  : 200,
   *       background : '#ccc',
   *       border     : '2px solid #999',
   *       zIndex     : 9999999
   *     })
   *     .hide()
   *     .text('Drop here')
   *     .appendTo('body');
   *   var dropFile = new Pot.DropFile(panel, {
   *     onShow : function() { panel.show() },
   *     onHide : function() { panel.hide() },
   *     onDrop : function(files) {
   *       panel.text('dropped');
   *     },
   *     onLoadImage : function(data, name, size) {
   *       $('<img/>').attr('src', data).appendTo('body');
   *     },
   *     onLoadText : function(data, name, size) {
   *       $('<textarea/>').val(data).appendTo('body');
   *     },
   *     onLoadUnknown : function(data, name, size) {
   *       $('<textarea/>').val(data).appendTo('body');
   *     },
   *     onLoadEnd : function(files) {
   *       this.upload(
   *         'http://www.example.com/',
   *         'dropfiles'
   *       ).then(function() {
   *         alert('finish upload.');
   *       });
   *     }
   *   });
   *   alert("Let's try drag and drop any file from your desktop.");
   *
   *
   * @param  {Element|String}  target    Target element or id.
   * @param  {Object|String}  (options)  Options for drop file:
   *                                     -------------------------------------
   *                                     - onShow : {Function}
   *                                         Should display a message that
   *                                         is able to dropped.
   *                                     - onHide : {Function}
   *                                         Should hide a message that
   *                                         is not able to dropped.
   *                                     - onDrop : {Function}
   *                                         Called when a file is dropped.
   *                                     - onLoadImage : {Function}
   *                                         Called when a file is
   *                                           loaded as image.
   *                                     - onLoadText : {Function}
   *                                         Called when a file is
   *                                           loaded as text.
   *                                     - onLoadUnknown : {Function}
   *                                         Called when a file is
   *                                           loaded as unknown type.
   *                                     - onLoadEnd : {Function}
   *                                         Called when a file is loaded.
   *                                         (i.e. enable to upload).
   *                                     -------------------------------------
   * @return {DropFile}                  Return an instance of Pot.DropFile.
   * @name Pot.Signal.DropFile
   * @constructor
   * @public
   */
  DropFile : function(target, options) {
    return new Pot.Signal.DropFile.prototype.init(target, options);
  },
  /**
   * @lends Pot.Signal
   */
  /**
   * Check whether the argument object is an instance of Pot.Signal.Handler.
   *
   *
   * @param  {Object|*}  x  The target object to test.
   * @return {Boolean}      Return true if the argument object is an
   *                          instance of Pot.Signal.Handler,
   *                          otherwise return false.
   * @type Function
   * @function
   * @static
   */
  isHandler : function(x) {
    return x != null && ((x instanceof Pot.Signal.Handler) ||
     (x.id   != null && x.id   === Pot.Signal.Handler.prototype.id &&
      x.NAME != null && x.NAME === Pot.Signal.Handler.prototype.NAME));
  },
  /**
   * Check whether the argument object is an instance of Pot.Signal.Observer.
   *
   *
   * @param  {Object|*}  x  The target object to test.
   * @return {Boolean}      Return true if the argument object is an
   *                          instance of Pot.Signal.Observer,
   *                          otherwise return false.
   * @type Function
   * @function
   * @static
   */
  isObserver : function(x) {
    return x != null && ((x instanceof Pot.Signal.Observer) ||
     (x.PotInternal != null && x.PotInternal.id != null &&
      x.PotInternal.id === Pot.Signal.Observer.prototype.PotInternal.id &&
      x.PotInternal.NAME != null &&
      x.PotInternal.NAME === Pot.Signal.Observer.prototype.PotInternal.NAME));
  },
  /**
   * Attaches a signal to a slot,
   *  and return a handler object as a unique identifier that
   *  can be used to detach that signal.
   *
   *
   * @example
   *   // Usage like addEventListener/removeEventListener.
   *   // Will get to a DOM element by document.getElementById if the
   *   //   first argument passed as a string.
   *   var handler = attach('#foo', 'click', function(ev) {...});
   *   //
   *   // Release the signal(Event).
   *   detach(handler);
   *
   *
   * @example
   *   // Example code of signal for Object usage.
   *   var MyObj = {};
   *   // Register your own signal.
   *   var handler = attach(MyObj, 'clear-data', function() {
   *     // To initialize the properties etc.
   *     MyObj.data = null;
   *     MyObj.time = null;
   *   });
   *   attach(window, 'load', function() {
   *     // Send a signal to initialize.
   *     signal(MyObj, 'clear-data');
   *     // Also set to clear when you press the reset button.
   *     attach('#reset', 'click', function() {
   *       signal(MyObj, 'clear-data');
   *     });
   *     // Existing processing etc.
   *     myLoadProcess();
   *     //...
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String|Array}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @param  {Boolean}  (once)
   *           (Optional) Only internal usage.
   * @return {Object|Array}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @type Function
   * @function
   * @class
   * @public
   * @static
   */
  attach : function(object, signalName, callback, useCapture, once) {
    var results = [], isDOM, isMulti, capture, advice,
        o = getElement(object);
    if (!o) {
      return (void 0);
    }
    isDOM = isDOMObject(o);
    capture = !!useCapture;
    if (Pot.isArray(signalName)) {
      isMulti = true;
    }
    advice = Pot.Signal.Handler.advices.normal;
    each(arrayize(signalName), function(sig) {
      var sigName, handler, listener;
      sigName = stringify(sig);
      listener = createListener(
        o, sigName, callback, capture, isDOM, once, advice
      );
      handler = new Pot.Signal.Handler({
        object     : o,
        signal     : sigName,
        listener   : listener,
        callback   : callback,
        isDOM      : isDOM,
        useCapture : capture,
        advice     : advice,
        attached   : true
      });
      withHandlers(function(hs) {
        hs[hs.length] = handler;
      });
      if (isDOM) {
        if (o.addEventListener) {
          o.addEventListener(
            adaptSignalForDOM(o, sigName),
            listener,
            capture
          );
        } else if (o.attachEvent) {
          o.attachEvent(
            adaptSignalForDOM(o, sigName),
            listener
          );
        }
      }
      results[results.length] = handler;
    });
    return isMulti ? results : results[0];
  },
  /**
   * Attaches a signal to a slot on before,
   *  and return a handler object as a unique identifier that
   *  can be used to detach that signal.
   *
   *
   * @example
   *   // Set the event of pressing the Save button.
   *   attach('#saveData', 'click', function() {
   *     // Saving function.
   *     saveData(document.getElementById('inputText').value);
   *     // Function to send a message to user that the data saved.
   *     showSaveData('Saved!');
   *   });
   *   // Add the callback function for
   *   //  move the focus after click the element.
   *   attachAfter('#saveData', 'click', function() {
   *     document.getElementById('inputText').focus();
   *   });
   *   // To configure the logging before calling it.
   *   attachBefore('#saveData', 'click', function() {
   *     MyLogger.log('Save inputText');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String|Array}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @param  {Boolean}  (once)
   *           (Optional) Only internal usage.
   * @return {Object|Array}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @type Function
   * @function
   * @class
   * @public
   * @static
   */
  attachBefore : function(object, signalName, callback, useCapture, once) {
    return attachByJoinPoint(
      object, signalName, callback,
      Pot.Signal.Handler.advices.before, once
    );
  },
  /**
   * Attaches a signal to a slot on after,
   *  and return a handler object as a unique identifier that
   *  can be used to detach that signal.
   *
   *
   * @example
   *   // Set the event of pressing the Save button.
   *   attach('#saveData', 'click', function() {
   *     // Saving function.
   *     saveData(document.getElementById('inputText').value);
   *     // Function to send a message to user that the data saved.
   *     showSaveData('Saved!');
   *   });
   *   // Add the callback function for
   *   //  move the focus after click the element.
   *   attachAfter('#saveData', 'click', function() {
   *     document.getElementById('inputText').focus();
   *   });
   *   // To configure the logging before calling it.
   *   attachBefore('#saveData', 'click', function() {
   *     MyLogger.log('Save inputText');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String|Array}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @param  {Boolean}  (once)
   *           (Optional) Only internal usage.
   * @return {Object|Array}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @type Function
   * @function
   * @class
   * @public
   * @static
   */
  attachAfter : function(object, signalName, callback, useCapture, once) {
    return attachByJoinPoint(
      object, signalName, callback,
      Pot.Signal.Handler.advices.after, once
    );
  },
  /**
   * Attaches a signal to a slot on before,
   *  and return a handler object as a unique identifier that
   *  can be used to detach that signal.
   * When method is called, this callback will be triggered.
   *
   *
   * @example
   *   // Example code for add callback to the
   *   //  Object direct like aspect settings.
   *   var MyApp = {
   *     execute : function() {
   *       // Begin something process.
   *       myAppDoit();
   *     }
   *   };
   *   attach('#execute', 'click', function() {
   *     // Execute Application.
   *     MyApp.execute();
   *   });
   *   // Add a logging callback function before execution.
   *   attachPropBefore(MyApp, 'execute', function() {
   *     MyLogger.log('Begin execute');
   *   });
   *   // Add a logging callback function after execution.
   *   attachPropAfter(MyApp, 'execute', function() {
   *     MyLogger.log('End execute');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String|Array}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @param  {Boolean}  (once)
   *           (Optional) Only internal usage.
   * @return {Object|Array}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @type Function
   * @function
   * @class
   * @public
   * @static
   */
  attachPropBefore : function(object, propName, callback, useCapture, once) {
    return attachPropByJoinPoint(
      object, propName, callback,
      Pot.Signal.Handler.advices.propBefore, once
    );
  },
  /**
   * Attaches a signal to a slot on after,
   *  and return a handler object as a unique identifier that
   *  can be used to detach that signal.
   * When method is called, this callback will be triggered.
   *
   *
   * @example
   *   // Example code for add callback to the
   *   //  Object direct like aspect settings.
   *   var MyApp = {
   *     execute : function() {
   *       // Begin something process.
   *       myAppDoit();
   *     }
   *   };
   *   attach('#execute', 'click', function() {
   *     // Execute Application.
   *     MyApp.execute();
   *   });
   *   // Add a logging callback function before execution.
   *   attachPropBefore(MyApp, 'execute', function() {
   *     MyLogger.log('Begin execute');
   *   });
   *   // Add a logging callback function after execution.
   *   attachPropAfter(MyApp, 'execute', function() {
   *     MyLogger.log('End execute');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String|Array}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @param  {Boolean}  (once)
   *           (Optional) Only internal usage.
   * @return {Object|Array}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @type Function
   * @function
   * @class
   * @public
   * @static
   */
  attachPropAfter : function(object, propName, callback, useCapture, once) {
    return attachPropByJoinPoint(
      object, propName, callback,
      Pot.Signal.Handler.advices.propAfter, once
    );
  },
  /**
   * Detaches a signal.
   * To detach a signal, pass its handler identifier returned by attach().
   * This is similar to how the setTimeout and clearTimeout works.
   *
   *
   * @example
   *   // This is similar to how the setTimeout and clearTimeout works.
   *   var handler = attach('#foo', 'click', function(ev) {...});
   *   // Release the signal(Event).
   *   detach(handler);
   *
   *
   * @param  {Object|Function}  object
   *           An instance identifier of Pot.Signal.Handler object that
   *             returned by attach().
   *           Or if signal using DOM object, you can specify the same as the
   *             removeEventListener arguments usage.
   * @param  {String}  (signalName)
   *           (Optional) If `object` is a DOM object,
   *             you can specify same as the
   *             removeEventListener arguments usage.
   *           `signalName` is the signal/event in string.
   * @param  {Function}  (callback)
   *           (Optional) If `object` is a DOM object,
   *             you can specify same as the
   *             removeEventListener arguments usage.
   *           `callback` is a trigger function.
   * @param  {Boolean}  (useCapture)
   *           (Optional) If `object` is a DOM object,
   *             you can specify same as the
   *             removeEventListener arguments usage.
   *           `useCapture` is 3rd argument of
   *             removeEventListener if environment is available it on DOM.
   * @return {Boolean}
   *           Success or failure.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  detach : function(object, signalName, callback, useCapture) {
    var result = false, args = arguments,
        ps = Pot.Signal, target,
        o = getElement(object);
    if (!o) {
      return (void 0);
    }
    if (ps.isHandler(o)) {
      eachHandlers(function(h) {
        if (h && h.attached && h === o) {
          target = h;
          throw Pot.StopIteration;
        }
      });
    } else if (args.length > 1) {
      eachHandlers(function(h) {
        if (h && h.attached &&
            h.object === o &&
            h.signal == signalName &&
            h.callback === callback
        ) {
          target = h;
          throw Pot.StopIteration;
        }
      });
    }
    if (target) {
      detachHandler(target);
      result = true;
    }
    return result;
  },
  /**
   * Removes all set of signals connected with object.
   *
   *
   * @example
   *   // Release all of element's event.
   *   var foo = document.getElementById('foo');
   *   attach(foo, 'click',     function(ev) {...});
   *   attach(foo, 'mouseover', function(ev) {...});
   *   attach(foo, 'mouseout',  function(ev) {...});
   *   // Detach all of foo's events.
   *   detachAll(foo);
   *
   *
   * @example
   *   // Release all of signals.
   *   attach(window,        'load',      function(ev) {...});
   *   attach(document.body, 'mousemove', function(ev) {...});
   *   attach('#foo',        'click',     function(ev) {...});
   *   // Detach all of signals.
   *   detachAll();
   *
   *
   * @param  {Object|Function}  (object)
   *           (Optional) An instance identifier of
   *             Pot.Signal.Handler object that returned by attach().
   *           If omitted, a global object will be target.
   * @param  {String|Array}  (signals)
   *           (Optional) A signal or an event name in string
   *             for detach and remove.
   *           If passed as an Array, will be target all signal items.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  detachAll : function(/*[object[, signals]]*/) {
    var args = arguments,
        o, signals = [], sigs = {}, targets = [];
    switch (args.length) {
      case 0:
          break;
      case 1:
          o = args[0];
          break;
      case 2:
          o = args[0];
          signals = args[1] || [];
          break;
      default:
          o = args[0];
          signals = arrayize(args, 1);
          break;
    }
    if (o != null) {
      o = getElement(o);
    }
    signals = arrayize(signals);
    each(signals, function(sig) {
      sigs[PREFIX + stringify(sig)] = true;
    });
    eachHandlers(function(h) {
      if (!h ||
          ((o == null || h.object === o) &&
          ((!signals  || signals.length === 0) ||
          (signals.length && h.signal in sigs)))
      ) {
        if (h && h.attached) {
          targets[targets.length] = h;
        }
      }
    });
    each(targets, function(h) {
      detachHandler(h);
    });
  },
  /**
   * `signal` will send signal to a connected with object and triggered.
   * When signal is called with an object and the specify signal,
   *   the observer function will be triggered.
   * Note that when using this function for DOM signals,
   *   a single event argument is expected by most listeners.
   *
   *
   * @example
   *   // Example code of signal for Object usage.
   *   var MyObj = {};
   *   // Register your own signal.
   *   var handler = attach(MyObj, 'clear-data', function() {
   *     // To initialize the properties etc.
   *     MyObj.data = null;
   *     MyObj.time = null;
   *   });
   *   attach(window, 'load', function() {
   *     // Send a signal to initialize.
   *     signal(MyObj, 'clear-data');
   *     // Also set to clear when you press the reset button.
   *     attach('#reset', 'click', function() {
   *       signal(MyObj, 'clear-data');
   *     });
   *     // Existing processing etc.
   *     myLoadProcess();
   *     //...
   *   });
   *
   *
   * @param  {Object|Function}  object
   *           An instance identifier of
   *             Pot.Signal.Handler object that returned by attach().
   * @param  {String|Array}  signalName
   *           A signal or an event name in string for signal.
   * @return {Deferred}
   *           Return result of triggered as an instance of Pot.Deferred.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  signal : function(object, signalName) {
    var deferred, args = arrayize(arguments, 2),
        errors = [], sigName, advice, signals = {},
        o = getElement(object);
    if (!o) {
      return (void 0);
    }
    deferred = newDeferred();
    sigName = signalName;
    advice = Pot.Signal.Handler.advices.normal;
    each(arrayize(sigName), function(sig) {
      signals[PREFIX + stringify(sig)] = true;
    });
    eachHandlers(function(h) {
      if (h && h.attached &&
          h.advice === advice &&
          h.object === o &&
          ((PREFIX + h.signal) in signals)
      ) {
        deferred.then(function() {
          var result = h.listener.apply(o, args);
          if (Pot.isDeferred(result)) {
            result.begin();
          }
          return result;
        }, function(err) {
          errors[errors.length] = err;
        });
      }
    });
    return deferred.ensure(function(res) {
      if (Pot.isError(res)) {
        errors[errors.length] = res;
      }
      switch (errors.length) {
        case 0:
            break;
        case 1:
            throw errors[0];
        default:
            throw update(errors[0] || {}, {errors : errors});
      }
      return res;
    }).begin();
  },
  /**
   * Cancel and stop event.
   *
   *
   * @example
   *   attach('#foo', 'click', function(ev) {
   *     myProcess();
   *     return cancelEvent(ev);
   *   });
   *
   *
   * @param  {Event}    ev  The event object.
   * @return {Boolean}      Returns always false.
   * @type   Function
   * @function
   * @public
   * @static
   */
  cancelEvent : function(ev) {
    /**@ignore*/
    var f = function(v) {
      try {
        v.preventDefault();
        v.stopPropagation();
      } catch (e) {}
    };
    if (ev) {
      f();
      if (ev.originalEvent) {
        f(ev.originalEvent);
      }
      if (ev.PotInternal && ev.PotInternal.orgEvent) {
        f(ev.PotInternal.orgEvent);
      }
    }
    return false;
  }
});

// Definition of prototype.
Pot.Signal.DropFile.prototype = update(Pot.Signal.DropFile.prototype, {
  /**
   * @lends Pot.Signal.DropFile.prototype
   */
  /**
   * @private
   * @ignore
   * @internal
   */
  constructor : Pot.Signal.DropFile,
  /**
   * @private
   * @ignore
   */
  id : Pot.Internal.getMagicNumber(),
  /**
   * @private
   * @ignore
   * @const
   */
  NAME : 'DropFile',
  /**
   * A unique strings.
   *
   * @type  String
   * @const
   * @ignore
   */
  serial : null,
  /**
   * toString.
   *
   * @return  Return formatted string of object.
   * @type Function
   * @function
   * @static
   * @ignore
   */
  toString : Pot.toString,
  /**
   * @ignore
   * @private
   */
  defaultOptions : {
    onShow        : null,
    onHide        : null,
    onDrop        : null,
    onLoadImage   : null,
    onLoadText    : null,
    onLoadUnknown : null,
    onLoadEnd     : null
  },
  /**
   * Text encoding. (default = 'UTF-8')
   *
   * @type  String
   */
  encoding : 'UTF-8',
  /**
   * @ignore
   * @private
   */
  loadedFiles : [],
  /**
   * @ignore
   * @private
   */
  handleCache : [],
  /**
   * @ignore
   * @private
   */
  target : [],
  /**
   * @ignore
   * @private
   */
  options : {},
  /**
   * @ignore
   * @private
   */
  isShow : false,
  /**
   * Initialize properties.
   *
   * @private
   * @ignore
   */
  init : function(target, options) {
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    this.isShow = false;
    this.target = getElement(target);
    this.options = update({}, this.defaultOptions, options || {});
    if (this.options.encoding) {
      this.encoding = this.options.encoding;
    }
    if (this.target) {
      this.initEvents();
    }
    return this;
  },
  /**
   * Clear drop events.
   *
   * @public
   */
  clearDropEvents : function() {
    each(this.handleCache, function(h) {
      Pot.Signal.detach(h);
    });
    this.handleCache = [];
  },
  /**
   * Initialize events.
   *
   * @private
   * @ignore
   */
  initEvents : function() {
    var that = this, target = this.target, html,
        cache = this.handleCache, op = this.options, ps = Pot.Signal;
    cache[cache.length] = ps.attach(target, 'drop', function(ev) {
      var files, reader, i = 0;
      that.isShow = false;
      files = ev.dataTransfer && ev.dataTransfer.files;
      if (files) {
        if (op.onDrop) {
          op.onDrop.call(that, files);
        }
        reader = new FileReader();
        /**@ignore*/
        reader.onloadend = function(evt) {
          i--;
          if (evt && evt.target && evt.target.result != null) {
            that.loadedFiles.push(evt.target.result);
            if (i <= 0) {
              if (op.onLoadEnd) {
                op.onLoadEnd.call(that, arrayize(that.loadedFiles));
              }
            }
          }
        };
        each(files, function(file) {
          var name, size, type;
          if (file) {
            i++;
            type = file.type;
            size = file.size;
            name = file.name;
            reader.readAsDataURL(file);
            if (that.isImageFile(type)) {
              that.loadAsImage(file, name, size, type);
            } else if (that.isTextFile(type)) {
              that.loadAsText(file, name, size, type);
            } else {
              that.loadAsUnknown(file, name, size, type);
            }
          }
        });
      }
    });
    cache[cache.length] = ps.attach(target, 'dragenter', function(ev) {
      that.isShow = true;
      ps.cancelEvent(ev);
    });
    cache[cache.length] = ps.attach(target, 'dragover', function(ev) {
      that.isShow = true;
      ps.cancelEvent(ev);
    });
    cache[cache.length] = ps.attach(target, 'dragleave', function(ev) {
      that.isShow = false;
    });
    if (op.onHide) {
      op.onHide.call(that);
    }
    html = Pot.currentDocument().documentElement;
    cache[cache.length] = ps.attach(html, 'drop', function(ev) {
      that.isShow = false;
      if (op.onHide) {
        op.onHide.call(that);
      }
      ps.cancelEvent(ev);
    });
    cache[cache.length] = ps.attach(html, 'dragleave', function(ev) {
      Pot.Internal.setTimeout(function() {
        if (that.isShow) {
          that.isShow = false;
        } else {
          if (op.onHide) {
            op.onHide.call(that);
          }
        }
      }, 1000);
    });
    each(['dragenter', 'dragover'], function(type) {
      cache[cache.length] = ps.attach(html, type, function(ev) {
        var dt = ev && ev.dataTransfer, doShow, re;
        if (dt) {
          if (dt.files && dt.files.length) {
            doShow = true;
          } else if (dt.types) {
            re = /Files/i;
            if (re.test(dt.types)) {
              doShow = true;
            } else if (Pot.isArrayLike(dt.types)) {
              each(dt.types, function(t) {
                if (re.test(t)) {
                  doShow = true;
                  throw Pot.StopIteration;
                }
              });
            }
          }
        }
        if (doShow) {
          that.isShow = true;
          if (op.onShow) {
            op.onShow.call(that);
          }
        }
        ps.cancelEvent(ev);
      });
    });
  },
  /**
   * @private
   * @ignore
   */
  isImageFile : function(type) {
    return /image/i.test(type);
  },
  /**
   * @private
   * @ignore
   */
  isTextFile : function(type) {
    return !/image|audio|video|zip|compress/i.test(type);
  },
  /**
   * Upload the dropped files with specified options.
   *
   *
   * @example
   *   // This example using jQuery.
   *   var panel = $('<div/>')
   *     .css({
   *       position   : 'fixed',
   *       left       : '10%',
   *       top        : '10%',
   *       width      : '80%',
   *       height     : '80%',
   *       minHeight  : 200,
   *       background : '#ccc',
   *       border     : '2px solid #999',
   *       zIndex     : 9999999
   *     })
   *     .hide()
   *     .text('Drop here')
   *     .appendTo('body');
   *   var dropFile = new Pot.DropFile(panel, {
   *     onShow : function() { panel.show() },
   *     onHide : function() { panel.hide() },
   *     onDrop : function(files) {
   *       panel.text('dropped');
   *     },
   *     onLoadImage : function(data, name, size) {
   *       $('<img/>').attr('src', data).appendTo('body');
   *     },
   *     onLoadText : function(data, name, size) {
   *       $('<textarea/>').val(data).appendTo('body');
   *     },
   *     onLoadUnknown : function(data, name, size) {
   *       $('<textarea/>').val(data).appendTo('body');
   *     },
   *     onLoadEnd : function(files) {
   *       this.upload(
   *         'http://www.example.com/',
   *         'dropfiles'
   *       ).then(function() {
   *         alert('finish upload.');
   *       });
   *     }
   *   });
   *   alert("Let's try drag and drop any file from your desktop.");
   *
   *
   * @param  {String}             url      Target url to upload.
   * @param  {Object|String|*}  (options)  Upload options.
   *                                       Available parameters:
   *                                       -----------------------------------
   *                                       - key : {String}
   *                                           The file data key name in
   *                                             query string if specify.
   *                                           (default = 'file').
   *                                       - sendContent : {Object|Array}
   *                                           Other parameters if you need.
   *                                       -----------------------------------
   * @return {Deferred}                    Return the Pot.Deferred instance.
   * @type Function
   * @function
   * @public
   */
  upload : function(url, options) {
    var d, uri, files = this.loadedFiles,
        opts = {}, re, data, key = 'file';
    if (files && files.length) {
      if (Pot.isString(options)) {
        key = options;
      } else if (Pot.isObject(options)) {
        re = /key|file|name/i;
        each(options, function(v, k) {
          if (Pot.isString(v) && re.test(k)) {
            key = v;
            throw Pot.StopIteration;
          }
        });
        opts = update({}, options);
      }
      uri = stringify(url);
      re = /([^@:;#?&=\/\\]+)=[?]/;
      if (re.test(uri)) {
        key = uri.match(re)[1];
        uri = uri.replace(key, '');
      }
      data = opts.sendContent || opts.queryString || {};
      if (Pot.isArray(data)) {
        data[data.length] = [key, files.splice(0, files.length)];
      } else {
        data[key] = files.splice(0, files.length);
      }
      opts.sendContent = data;
      opts.queryString = null;
      opts.method = opts.method || 'POST';
      d = Pot.Net.request(uri, opts);
    }
    return Pot.Deferred.maybeDeferred(d);
  },
  /**
   * @private
   * @ignore
   */
  loadAsImage : function(file, name, size, type) {
    var that = this, reader = new FileReader(),
        callback = this.options.onLoadImage;
    /**@ignore*/
    reader.onload = function(ev) {
      if (callback) {
        callback.call(
          that,
          ev && ev.target && ev.target.result,
          name, size, type
        );
      }
    };
    reader.readAsDataURL(file);
  },
  /**
   * @private
   * @ignore
   */
  loadAsText : function(file, name, size, type) {
    var that = this, reader = new FileReader(),
        callback = this.options.onLoadText;
    /**@ignore*/
    reader.onload = function(ev) {
      if (callback) {
        callback.call(
          that,
          ev && ev.target && ev.target.result,
          name, size, type
        );
      }
    };
    reader.readAsText(file, this.encoding);
  },
  /**
   * @private
   * @ignore
   */
  loadAsUnknown : function(file, name, size, type) {
    var that = this, reader = new FileReader(),
        callback = this.options.onLoadUnknown;
    /**@ignore*/
    reader.onload = function(ev) {
      if (callback) {
        callback.call(
          that,
          ev && ev.target && ev.target.result,
          name, size, type
        );
      }
    };
    reader.readAsDataURL(file);
  }
});
Pot.Signal.DropFile.prototype.init.prototype = Pot.Signal.DropFile.prototype;

// Definition of prototype.
Pot.Signal.Handler.prototype = update(Pot.Signal.Handler.prototype, {
  /**
   * @lends Pot.Signal.Handler.prototype
   */
  /**
   * @private
   * @ignore
   * @internal
   */
  constructor : Pot.Signal.Handler,
  /**
   * @private
   * @ignore
   */
  id : Pot.Internal.getMagicNumber(),
  /**
   * @private
   * @ignore
   * @const
   */
  NAME : 'Handler',
  /**
   * A unique strings.
   *
   * @type  String
   * @const
   * @ignore
   */
  serial : null,
  /**
   * toString.
   *
   * @return  Return formatted string of object.
   * @type Function
   * @function
   * @static
   * @ignore
   */
  toString : Pot.toString,
  /**
   * Initialize properties
   *
   * @private
   * @ignore
   */
  init : function(params) {
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    update(this, params);
    return this;
  }
});
Pot.Signal.Handler.prototype.init.prototype = Pot.Signal.Handler.prototype;

Pot.Signal.Observer.prototype = {
  /**
   * @lends Pot.Signal.Observer.prototype
   */
  /**
   * @ignore
   */
  constructor : Pot.Signal.Observer,
  /**
   * @private
   * @ignore
   * @internal
   */
  PotInternal : {
    /**
     * @ignore
     */
    id : Pot.Internal.getMagicNumber(),
    /**
     * @ignore
     */
    NAME : 'Observer',
    /**
     * @ignore
     */
    serial : null,
    /**
     * @ignore
     */
    orgEvent : null,
    /**
     * @ignore
     */
    object : null
  },
  /**
   * toString.
   *
   * @return  Return formatted string of object.
   * @type Function
   * @function
   * @ignore
   */
  toString : function() {
    return buildObjectString(this.PotInternal.NAME);
  },
  /**
   * preventDefault.
   *
   * @type Function
   * @function
   * @ignore
   */
  preventDefault : function() {
    var ev;
    try {
      ev = this.PotInternal.orgEvent;
      if (ev) {
        if (ev.preventDefault) {
          ev.preventDefault();
        } else {
          ev.returnValue = false;
        }
      }
    } catch (e) {}
    if (this.originalEvent) {
      try {
        ev = this.originalEvent;
        if (ev) {
          if (ev.preventDefault) {
            ev.preventDefault();
          } else {
            ev.returnValue = false;
          }
        }
      } catch (e) {}
    }
  },
  /**
   * stopPropagation.
   *
   * @type Function
   * @function
   * @ignore
   */
  stopPropagation : function() {
    var ev;
    try {
      ev = this.PotInternal.orgEvent;
      if (ev) {
        if (ev.stopPropagation) {
          ev.stopPropagation();
        }
        ev.cancelBubble = true;
      }
    } catch (e) {}
    if (this.originalEvent) {
      try {
        ev = this.originalEvent;
        if (ev) {
          if (ev.stopPropagation) {
            ev.stopPropagation();
          }
          ev.cancelBubble = true;
        }
      } catch (e) {}
    }
  }
};

// Definition of 'once' methods.
each({
  /**
   * Similar to attach*(),
   *   but detaches the signal handler automatically once it has fired.
   *
   *
   * @example
   *   attach.once(document.body, 'click', function() {
   *     alert('This message will show only once.');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @return {Object}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @name Pot.Signal.attach.once
   * @type Function
   * @function
   * @public
   * @static
   */
  attach : 4,
  /**
   * Similar to attach*(),
   *   but detaches the signal handler automatically once it has fired.
   *
   *
   * @example
   *   attachBefore.once(document.body, 'click', function() {
   *     alert('This message will show only once.');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @return {Object}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @name Pot.Signal.attachBefore.once
   * @type Function
   * @function
   * @public
   * @static
   */
  attachBefore : 4,
  /**
   * Similar to attach*(),
   *   but detaches the signal handler automatically once it has fired.
   *
   *
   * @example
   *   attachAfter.once(document.body, 'click', function() {
   *     alert('This message will show only once.');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @return {Object}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @name Pot.Signal.attachAfter.once
   * @type Function
   * @function
   * @public
   * @static
   */
  attachAfter : 4,
  /**
   * Similar to attach*(),
   *   but detaches the signal handler automatically once it has fired.
   *
   *
   * @example
   *   attachPropBefore.once(MyObj, 'initialize', function() {
   *     alert('This message will show only once.');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @return {Object}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @name Pot.Signal.attachPropBefore.once
   * @type Function
   * @function
   * @public
   * @static
   */
  attachPropBefore : 4,
  /**
   * Similar to attach*(),
   *   but detaches the signal handler automatically once it has fired.
   *
   *
   * @example
   *   attachPropAfter.once(MyObj, 'initialize', function() {
   *     alert('This message will show only once.');
   *   });
   *
   *
   * @param  {Object|Function|String}  object
   *           The object that be target of the signal.
   *           If passed in a string then will be a
   *             HTML element by document.getElementById.
   * @param  {String}  signalName
   *           `signalName` is a string that represents a signal name.
   *           If `object` is a DOM object then
   *             it can be specify one of the 'onxxx' native events.
   *           That case 'on' prefix is optionally.
   * @param  {Function}  callback
   *           An action to take when the signal is triggered.
   * @param  {Boolean}  (useCapture)
   *           (Optional) `useCapture` will passed its 3rd argument to
   *             addEventListener if environment is available it on DOM.
   * @return {Object}
   *           Return an instance of Pot.Signal.Handler object as
   *             a unique identifier that can be used to detach that signal.
   *
   * @name Pot.Signal.attachPropAfter.once
   * @type Function
   * @function
   * @public
   * @static
   */
  attachPropAfter : 4
}, function(index, name) {
  update(Pot.Signal[name], {
    /**@ignore*/
    once : function() {
      var args = arrayize(arguments);
      args[index] = true;
      return Pot.Signal[name].apply(Pot.Signal, args);
    }
  });
});

// Definition of internal signal trappers.
each({
  /**@ignore*/
  before     : true,
  /**@ignore*/
  after      : true,
  /**@ignore*/
  normal     : true,
  /**@ignore*/
  before     : true,
  /**@ignore*/
  after      : true,
  /**@ignore*/
  propBefore : true,
  /**@ignore*/
  propAfter  : true
}, function(v, k) {
  var o = {};
  /**@ignore*/
  o[k] = function(deferred, object, sigName, args) {
    return signalByJoinPoint(
      deferred, object, sigName,
      Pot.Signal.Handler.advices[k],
      args
    );
  };
  update(trappers, o);
});

// Private functions.
/**
 * @private
 * @ignore
 */
function createListener(object, sigName, callback,
                        useCapture, isDOM, once, advice) {
  var isLoadEvent = (isDOM && RE.EVENT_ONCE.test(sigName)),
      isOnce, onceHandler, fn, ps = Pot.Signal, done;
  if (once || isLoadEvent) {
    isOnce = true;
    /**@ignore*/
    onceHandler = function(listener) {
      ps.detach(object, sigName, callback, useCapture);
    };
  }
  if (isAttached(object, sigName, true)) {
    if (advice === ps.Handler.advices.normal) {
      replaceToAttached(object, sigName);
    }
    fn = Pot.noop;
    if (isDOM) {
      return fn;
    } else {
      eachHandlers(function(h) {
        if (h && !h.isDOM &&
            h.advice === ps.Handler.advices.normal &&
            h.object === object && h.signal == sigName &&
            h.listener !== Pot.noop
        ) {
          if (done) {
            h.listener = Pot.noop;
          } else if (!h.attached) {
            fn = h.listener;
            h.listener = Pot.noop;
            done = true;
          }
        }
      });
      return fn;
    }
  }
  attachedHandlers[attachedHandlers.length] = {
    object   : object,
    signal   : sigName,
    advice   : advice,
    attached : true
  };
  return function(ev) {
    var d    = newDeferred(),
        args = arguments,
        me   = args.callee,
        obs  = isDOM ? new ps.Observer(object, ev) : args;
    d.data(errorKey, []);
    trappers.before(d, object, sigName, obs);
    trappers.normal(d, object, sigName, obs);
    trappers.after(d, object, sigName, obs);
    return d.ensure(function(res) {
      var errors;
      if (Pot.isError(res)) {
        this.data(errorKey,
          concat.call(this.data(errorKey) || [], res)
        );
      }
      errors = this.data(errorKey);
      if (isOnce) {
        onceHandler(me);
      }
      if (errors && errors.length) {
        if (errors.length > 1) {
          throw update(errors[0], {errors : errors});
        } else {
          throw errors[0];
        }
      }
      return res;
    }).begin();
  };
}

/**
 * @private
 * @ignore
 */
function signalByJoinPoint(deferred, object, signalName, advice, args) {
  var ps = Pot.Signal, signals = {}, sigNames, attached,
      o = getElement(object);
  if (!o) {
    return (void 0);
  }
  sigNames = arrayize(signalName);
  each(sigNames, function(sig) {
    signals[PREFIX + stringify(sig)] = true;
  });
  attached = false;
  switch (advice) {
    case ps.Handler.advices.normal:
        attached = true;
        break;
    case ps.Handler.advices.before:
    case ps.Handler.advices.after:
        each(sigNames, function(sig) {
          if (isAttached(o, stringify(sig))) {
            attached = true;
            throw Pot.StopIteration;
          }
        });
        break;
    case ps.Handler.advices.propBefore:
    case ps.Handler.advices.propAfter:
        each(sigNames, function(sig) {
          if (isPropAttached(o, stringify(sig))) {
            attached = true;
            throw Pot.StopIteration;
          }
        });
        break;
    default:
        attached = false;
        break;
  }
  if (attached) {
    eachHandlers(function(h) {
      var key = stringify(h && h.signal);
      if (h && h.attached &&
          h.advice === advice &&
          h.object === o &&
          ((PREFIX + key) in signals)
      ) {
        deferred.ensure(function(res) {
          if (Pot.isError(res)) {
            this.data(errorKey,
              concat.call(this.data(errorKey) || [], res)
            );
          }
          if (advice === ps.Handler.advices.normal) {
            return h.callback.apply(o, arrayize(args));
          } else {
            return h.listener.apply(o, arrayize(args));
          }
        });
      }
    });
  }
  return deferred;
}

/**
 * @private
 * @ignore
 */
function isAttached(object, sigName, ignoreAttached) {
  var result = false, ps = Pot.Signal;
  each(arrayize(sigName), function(sig) {
    var i, h, k = stringify(sig);
    for (i = attachedHandlers.length - 1; i >= 0; i--) {
      h = attachedHandlers[i];
      if (h && (ignoreAttached || h.attached) &&
          h.advice === ps.Handler.advices.normal &&
          h.object === object && h.signal == k) {
        result = true;
        throw Pot.StopIteration;
      }
    }
  });
  return result;
}

/**
 * @private
 * @ignore
 */
function replaceToAttached(object, sigName) {
  var result = false, ps = Pot.Signal;
  each(arrayize(sigName), function(sig) {
    var i, h, k = stringify(sig);
    for (i = attachedHandlers.length - 1; i >= 0; i--) {
      h = attachedHandlers[i];
      if (h && !h.attached &&
          h.advice === ps.Handler.advices.normal &&
          h.object === object && h.signal == k) {
        h.attached = true;
        throw Pot.StopIteration;
      }
    }
  });
  return result;
}

/**
 * @private
 * @ignore
 */
function isPropAttached(object, prop, ignoreAttached) {
  var result = false;
  each(arrayize(prop), function(p) {
    var i, h, k = stringify(p);
    for (i = propHandlers.length - 1; i >= 0; i--) {
      h = propHandlers[i];
      if (h && (ignoreAttached || h.attached) &&
          h.object === object && h.signal == k) {
        result = true;
        throw Pot.StopIteration;
      }
    }
  });
  return result;
}

/**
 * @private
 * @ignore
 */
function replaceToPropAttached(object, prop) {
  var result = false, ps = Pot.Signal;
  each(arrayize(prop), function(sig) {
    var i, h, k = stringify(sig);
    for (i = propHandlers.length - 1; i >= 0; i--) {
      h = propHandlers[i];
      if (h && !h.attached &&
          (h.advice === ps.Handler.advices.propBefore ||
           h.advice === ps.Handler.advices.propAfter) &&
          h.object === object && h.signal == k) {
        h.attached = true;
        throw Pot.StopIteration;
      }
    }
  });
  return result;
}

/**
 * @private
 * @ignore
 */
function detachHandler(handler) {
  var object, signal, listener, capture,
      i, h, has, sub, ps = Pot.Signal;
  if (!handler || !handler.attached) {
    return;
  }
  handler.attached = false;
  object   = handler.object;
  signal   = handler.signal;
  capture  = handler.useCapture;
  listener = handler.listener;
  if (!handler.isDOM) {
    if (handler.advice === ps.Handler.advices.propBefore ||
        handler.advice === ps.Handler.advices.propAfter) {
      has = false;
      eachHandlers(function(h) {
        if (h && h.attached && !h.isDOM &&
            (h.advice === ps.Handler.advices.propBefore ||
             h.advice === ps.Handler.advices.propAfter) &&
             h.object === object && h.signal == signal) {
          has = true;
          throw Pot.StopIteration;
        }
      });
      if (!has) {
        for (i = propHandlers.length - 1; i >= 0; i--) {
          h = propHandlers[i];
          if (h && h.attached &&
              h.object === object && h.signal == signal) {
            h.attached = false;
          }
        }
      }
    } else if (handler.advice === ps.Handler.advices.normal) {
      has = false;
      sub = null;
      eachHandlers(function(h) {
        if (h && h.attached && !h.isDOM &&
            h.advice === ps.Handler.advices.normal &&
            h.object === object && h.signal == signal) {
          has = true;
          sub = h;
          throw Pot.StopIteration;
        }
      });
      if (has) {
        if (sub && sub.listener === Pot.noop && listener !== Pot.noop) {
          sub.listener = listener;
        }
      } else {
        for (i = attachedHandlers.length - 1; i >= 0; i--) {
          h = attachedHandlers[i];
          if (h && h.attached &&
              h.object === object && h.signal == signal) {
            h.attached = false;
          }
        }
      }
    }
  } else {
    if (handler.advice === ps.Handler.advices.normal) {
      has = false;
      eachHandlers(function(h) {
        if (h && h.attached && h.isDOM &&
            h.advice === ps.Handler.advices.normal &&
            h.object === object && h.signal == signal) {
          has = true;
          throw Pot.StopIteration;
        }
      });
      if (!has) {
        for (i = attachedHandlers.length - 1; i >= 0; i--) {
          h = attachedHandlers[i];
          if (h && h.attached &&
              h.advice === ps.Handler.advices.normal &&
              h.object === object && h.signal == signal) {
            h.attached = false;
          }
        }
      }
    }
  }
  cleanHandlers();
}

/**
 * @private
 * @ignore
 */
function attachByJoinPoint(object, signalName, callback, advice, once) {
  var results = [], o, isDOM, isMulti, bindListener;
  o = getElement(object);
  if (!o) {
    return (void 0);
  }
  /**@ignore*/
  bindListener = function(sig) {
    return function() {
      var args = arguments;
      callback.apply(o, args);
      if (once) {
        Pot.Signal.detach(o, sig, args.callee, false);
      }
    };
  };
  isDOM = isDOMObject(o);
  if (Pot.isArray(signalName)) {
    isMulti = true;
  }
  each(arrayize(signalName), function(sig) {
    var sigName = stringify(sig), handler, listener;
    listener = bindListener(sigName);
    handler = new Pot.Signal.Handler({
      object     : o,
      signal     : sigName,
      listener   : listener,
      callback   : listener,
      isDOM      : isDOM,
      useCapture : false,
      advice     : advice,
      attached   : true
    });
    withHandlers(function(hs) {
      hs[hs.length] = handler;
    });
    results[results.length] = handler;
  });
  return isMulti ? results : results[0];
}

/**
 * @private
 * @ignore
 */
function attachPropByJoinPoint(object, propName, callback, advice, once) {
  var results = [], isMulti, props,
      bindListener, ps = Pot.Signal;
  if (!object || !Pot.isFunction(callback)) {
    return (void 0);
  }
  if (Pot.isArray(propName)) {
    isMulti = true;
  }
  /**@ignore*/
  bindListener = function(sigName) {
    return function() {
      var args = arguments;
      callback.apply(object, args);
      if (once) {
        ps.detach(object, sigName, args.callee, false);
      }
    };
  };
  props = arrayize(propName);
  each(props, function(p) {
    var key = stringify(p);
    if (isPropAttached(object, key, true)) {
      if (advice === ps.Handler.advices.propBefore ||
          advice === ps.Handler.advices.propAfter) {
        replaceToPropAttached(object, key);
      }
    } else {
      propHandlers[propHandlers.length] = {
        object   : object,
        signal   : key,
        advice   : advice,
        attached : true
      };
      Pot.override(object, key, function(inherits, args) {
        var uniq = {},
            d = newDeferred(),
            orgResult = uniq;
        d.data(errorKey, []);
        trappers.propBefore(d, object, key, args);
        d.ensure(function(res) {
          if (Pot.isError(res)) {
            this.data(errorKey,
              concat.call(this.data(errorKey) || [], res)
            );
          }
          return inherits.apply(object, args);
        }).then(function(res) {
          orgResult = res;
          return res;
        });
        trappers.normal(d, object, key, args);
        trappers.propAfter(d, object, key, args);
        d.ensure(function(res) {
          var errors;
          if (Pot.isError(res)) {
            this.data(errorKey,
              concat.call(this.data(errorKey) || [], res)
            );
          }
          errors = this.data(errorKey);
          if (errors && errors.length) {
            if (errors.length > 1) {
              throw update(errors[0], {errors : errors});
            } else {
              throw errors[0];
            }
          }
          return res;
        }).begin();
        return (orgResult === uniq) ? null : orgResult;
      });
    }
  });
  each(props, function(p) {
    var name = stringify(p), handler, listener;
    listener = bindListener(name);
    handler = new Pot.Signal.Handler({
      object     : object,
      signal     : name,
      listener   : listener,
      callback   : listener,
      isDOM      : false,
      useCapture : false,
      advice     : advice,
      attached   : true
    });
    withHandlers(function(hs) {
      hs[hs.length] = handler;
    });
    results[results.length] = handler;
  });
  return isMulti ? results : results[0];
}

/**
 * @private
 * @ignore
 */
function adaptSignalForDOM(object, signal) {
  var s = stringify(signal), prefix = 'on';
  if (object) {
    if (object.addEventListener) {
      if (s.indexOf(prefix) === 0) {
        s = s.substring(2);
      }
    } else if (object.attachEvent) {
      if (s.indexOf(prefix) !== 0) {
        s = prefix + s;
      }
    }
  }
  return s;
}

/**
 * @private
 * @ignore
 */
function isDOMObject(o) {
  return !!(o &&
            (o.addEventListener && o.removeEventListener) ||
            (o.attachEvent && o.detachEvent));
}

/**
 * @private
 * @ignore
 */
function getElement(expr) {
  if (typeof expr === 'object' || Pot.isFunction(expr)) {
    if (expr.jquery && expr.get) {
      return expr.get(0);
    } else {
      return expr;
    }
  }
  if (Pot.isString(expr)) {
    try {
      return Pot.currentDocument().getElementById(
        stringify(expr).replace(RE.ID_CLEAN, '')
      );
    } catch (e) {}
  }
  return false;
}

/**
 * @private
 * @ignore
 */
function eachHandlers(callback) {
  var result, err = null, i, len;
  handlersLocked = true;
  try {
    len = handlers.length;
    for (i = 0; i < len; i++) {
      result = callback(handlers[i], i);
    }
  } catch (e) {
    err = e;
  } finally {
    handlersLocked = false;
  }
  if (err !== null && !Pot.isStopIter(err)) {
    throw err;
  }
  return result;
}

/**
 * @private
 * @ignore
 */
function withHandlers(callback) {
  var result,
      limit = 255,
      retry = {},
      end   = false;
  /**@ignore*/
  (function restback() {
    try {
      if (handlersLocked) {
        if (--limit >= 0) {
          throw retry;
        } else {
          limit = -1;
          Pot.Internal.setTimeout(function() {
            restback();
          }, 0);
        }
      } else {
        if (!end) {
          end = true;
          result = callback(handlers);
        }
      }
    } catch (e) {
      if (e === retry) {
        return restback();
      } else {
        throw e;
      }
    }
  })();
  return result;
}

/**
 * @private
 * @ignore
 */
function cleanHandlers() {
  var i, len, h, t = [], err, ps = Pot.Signal;
  if (!handlersLocked) {
    handlersLocked = true;
    try {
      len = handlers.length;
      for (i = 0; i < len; i++) {
        h = handlers[i];
        if (!h ||
            (!h.attached &&
              (
                (h.advice === ps.Handler.advices.normal &&
                 h.listener === Pot.noop
                ) ||
                (h.advice === ps.Handler.advices.propBefore ||
                 h.advice === ps.Handler.advices.propAfter
                ) ||
                (h.advice === ps.Handler.advices.before ||
                 h.advice === ps.Handler.advices.after
                )
              )
            )
        ) {
          continue;
        }
        t[t.length] = h;
      }
      handlers.splice(0, len);
      push.apply(handlers, t);
    } catch (e) {
      err = e;
    } finally {
      handlersLocked = false;
    }
    if (err != null) {
      throw err;
    }
  }
}

/**
 * @private
 * @ignore
 */
function newDeferred() {
  return new Pot.Deferred({async : false});
}

// Update Pot object.
Pot.update({
  attach           : Pot.Signal.attach,
  attachBefore     : Pot.Signal.attachBefore,
  attachAfter      : Pot.Signal.attachAfter,
  attachPropBefore : Pot.Signal.attachPropBefore,
  attachPropAfter  : Pot.Signal.attachPropAfter,
  detach           : Pot.Signal.detach,
  detachAll        : Pot.Signal.detachAll,
  signal           : Pot.Signal.signal,
  cancelEvent      : Pot.Signal.cancelEvent,
  DropFile         : Pot.Signal.DropFile
});

}());

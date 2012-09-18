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
},
Handler,
Observer;

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

// Refer the Pot properties/functions.
Signal = Pot.Signal;

update(Signal, {
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
  toString : PotToString,
  /**
   * @ignore
   */
  Handler : update(function(args) {
    return new Handler.fn.init(args);
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
    if (!isObject(evt)) {
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
    return new DropFile.fn.init(target, options);
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
    return x != null && ((x instanceof Handler) ||
     (x.id   != null && x.id   === Handler.fn.id &&
      x.NAME != null && x.NAME === Handler.fn.NAME));
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
    return x != null && ((x instanceof Observer) ||
     (x.PotInternal != null && x.PotInternal.id != null &&
      x.PotInternal.id === Observer.fn.PotInternal.id &&
      x.PotInternal.NAME != null &&
      x.PotInternal.NAME === Observer.fn.PotInternal.NAME));
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
      return;
    }
    isDOM = isDOMObject(o);
    capture = !!useCapture;
    if (isArray(signalName)) {
      isMulti = true;
    }
    advice = Handler.advices.normal;
    each(arrayize(signalName), function(sig) {
      var sigName, handler, listener;
      sigName = stringify(sig);
      listener = createListener(
        o, sigName, callback, capture, isDOM, once, advice
      );
      handler = new Handler({
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
      Handler.advices.before, once
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
      Handler.advices.after, once
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
      Handler.advices.propBefore, once
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
      Handler.advices.propAfter, once
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
    var result = false, args = arguments, target,
        o = getElement(object);
    if (!o) {
      return;
    }
    if (Signal.isHandler(o)) {
      eachHandlers(function(h) {
        if (h && h.attached && h === o) {
          target = h;
          throw PotStopIteration;
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
          throw PotStopIteration;
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
      return;
    }
    deferred = newDeferred();
    sigName = signalName;
    advice = Handler.advices.normal;
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
          if (isDeferred(result)) {
            result.begin();
          }
          return result;
        }, function(err) {
          errors[errors.length] = err;
        });
      }
    });
    return deferred.ensure(function(res) {
      if (isError(res)) {
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

// Refer the Pot properties/functions.
DropFile = Signal.DropFile;

Handler  = Signal.Handler;
Observer = Signal.Observer;

// Definition of prototype.
DropFile.fn = DropFile.prototype = update(DropFile.prototype, {
  /**
   * @lends Pot.Signal.DropFile.prototype
   */
  /**
   * @private
   * @ignore
   * @internal
   */
  constructor : DropFile,
  /**
   * @private
   * @ignore
   */
  id : PotInternal.getMagicNumber(),
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
  toString : PotToString,
  /**
   * @ignore
   * @private
   */
  defaultOptions : {
    onShow         : null,
    onHide         : null,
    onDrop         : null,
    onLoadImage    : null,
    onLoadText     : null,
    onLoadUnknown  : null,
    onLoadEnd      : null,
    onProgress     : null,
    onProgressFile : null,
    // readAs:
    //  - 'text'
    //  - 'binary'
    //  - 'arraybuffer'
    //  - 'datauri'
    //  or null (auto)
    readAs         : null,
    encoding       : null
  },
  /**
   * Text encoding.
   *
   * @type  String
   * @ignore
   */
  encoding : null,
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
    this.loadedFiles = [];
    this.handleCache = [];
    this.isShow = false;
    this.target = getElement(target);
    this.options = update({}, this.defaultOptions, options || {});
    if (this.options.encoding) {
      this.encoding = this.options.encoding;
    }
    this.assignReadType();
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
      Signal.detach(h);
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
        cache = this.handleCache, op = this.options, ps = Signal;
    cache[cache.length] = ps.attach(target, 'drop', function(ev) {
      var files, reader, i = 0, total, fileList,
          deferreds = {
            seek   : new Deferred(),
            files  : [],
            steps  : [],
            ends   : [true],
            done   : false
          },
          /**@ignore*/
          pushFiles = function(evt) {
            if (evt && evt.target && evt.target.result != null) {
              that.loadedFiles.push(evt.target.result);
              return true;
            } else {
              return false;
            }
          };
      that.isShow = false;
      fileList = ev.dataTransfer && ev.dataTransfer.files;
      if (fileList) {
        total = 0;
        files = [];
        each(fileList, function(file) {
          if (file) {
            files[total++] = file;
          }
        });
        if (op.onDrop) {
          op.onDrop.call(that, files, total);
        }
        if (PotSystem.hasFileReader) {
          reader = new FileReader();
          /**@ignore*/
          reader.onloadend = function(evt) {
            if (pushFiles(evt)) {
              if (deferreds.files[i] && !deferreds.ends[i]) {
                deferreds.files[i].begin();
              }
            }
          };
          Deferred.forEach(files, function(file) {
            if (file) {
              deferreds.seek.then(function() {
                var fileinfo = update({}, file, {index : i++});
                return Deferred.till(function() {
                  return !Pot.some(deferreds.ends, function(end) {
                    return end === false;
                  });
                }).then(function() {
                  deferreds.ends[i] = false;
                  deferreds.steps[i] = new Deferred();
                  deferreds.files[i] = new Deferred().then(function() {
                    if (that.isImageFile(fileinfo.type)) {
                      that.loadAsImage(deferreds, i, total, file, fileinfo);
                    } else if (that.isTextFile(fileinfo.type)) {
                      that.loadAsText(deferreds, i, total, file, fileinfo);
                    } else {
                      that.loadAsUnknown(deferreds, i, total, file, fileinfo);
                    }
                    return deferreds.steps[i];
                  });
                  that.readFile(reader, file);
                  return deferreds.files[i];
                });
              });
            }
          }).then(function() {
            deferreds.seek.then(function() {
              var done = Pot.every(deferreds.ends, function(end) {
                return end === true;
              });
              if (done && !deferreds.done) {
                deferreds.done = true;
                if (op.onProgress) {
                  that.updateProgressEnd();
                }
                if (op.onLoadEnd) {
                  op.onLoadEnd.call(that, arrayize(that.loadedFiles));
                }
              }
            }).begin();
          });
        }
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
      PotInternalSetTimeout(function() {
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
            } else if (isArrayLike(dt.types)) {
              each(dt.types, function(t) {
                if (re.test(t)) {
                  doShow = true;
                  throw PotStopIteration;
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
  readFile : function(reader, file, isText) {
    switch (this.options.readAs) {
      case 'text':
          if (this.encoding) {
            reader.readAsText(file, this.encoding);
          } else {
            reader.readAsText(file);
          }
          break;
      case 'binary':
          reader.readAsBinaryString(file);
          break;
      case 'arraybuffer':
          reader.readAsArrayBuffer(file);
          break;
      case 'datauri':
          reader.readAsDataURL(file);
          break;
      default:
          if (isText) {
            if (this.encoding) {
              reader.readAsText(file, this.encoding);
            } else {
              reader.readAsText(file);
            }
          } else {
            reader.readAsDataURL(file);
          }
    }
  },
  /**
   * @private
   * @ignore
   */
  assignReadType : function() {
    var res, type = stringify(this.options.readAs).toLowerCase();
    if (~type.indexOf('text')) {
      res = 'text';
    } else if (~type.indexOf('bin')) {
      res = 'binary';
    } else if (~type.indexOf('arr') || ~type.indexOf('buf')) {
      res = 'arraybuffer';
    } else if (~type.indexOf('data') || ~type.indexOf('ur')) {
      res = 'datauri';
    } else {
      res = null;
    }
    this.options.readAs = res;
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
    return !/image|audio|video|zip|compress|stream/i.test(type);
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
      if (isString(options)) {
        key = options;
      } else if (isObject(options)) {
        re = /key|file|name/i;
        each(options, function(v, k) {
          if (isString(v) && re.test(k)) {
            key = v;
            throw PotStopIteration;
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
      if (isArray(data)) {
        data[data.length] = [key, files.splice(0, files.length)];
      } else {
        data[key] = files.splice(0, files.length);
      }
      opts.sendContent = data;
      opts.queryString = null;
      opts.method = opts.method || 'POST';
      d = Pot.Net.request(uri, opts);
    }
    return Deferred.maybeDeferred(d);
  },
  /**
   * @private
   * @ignore
   */
  loadAsImage : function(deferreds, i, total, file, fileinfo) {
    var that = this,
        op = this.options,
        reader = new FileReader(),
        callback = op.onLoadImage;
    if (op.onProgressFile) {
      /**@ignore*/
      reader.onprogress = function(ev) {
        that.updateProgressFile(ev, fileinfo, total);
      };
    }
    /**@ignore*/
    reader.onload = function(ev) {
      deferreds.ends[i] = true;
      deferreds.steps[i].begin();
      if (op.onProgressFile) {
        that.updateProgressFileEnd(fileinfo);
      }
      if (callback) {
        callback.call(
          that,
          ev && ev.target && ev.target.result,
          fileinfo
        );
      }
    };
    /**@ignore*/
    reader.onerror = function(err) {
      deferreds.ends[i] = true;
      deferreds.steps[i].raise(err);
    };
    this.readFile(reader, file);
  },
  /**
   * @private
   * @ignore
   */
  loadAsText : function(deferreds, i, total, file, fileinfo) {
    var that = this,
        op = this.options,
        reader = new FileReader(),
        callback = op.onLoadText;
    if (op.onProgressFile) {
      /**@ignore*/
      reader.onprogress = function(ev) {
        that.updateProgressFile(ev, fileinfo, total);
      };
    }
    /**@ignore*/
    reader.onload = function(ev) {
      deferreds.ends[i] = true;
      deferreds.steps[i].begin();
      if (op.onProgressFile) {
        that.updateProgressFileEnd(fileinfo);
      }
      if (callback) {
        callback.call(
          that,
          ev && ev.target && ev.target.result,
          fileinfo
        );
      }
    };
    /**@ignore*/
    reader.onerror = function(err) {
      deferreds.ends[i] = true;
      deferreds.steps[i].raise(err);
    };
    this.readFile(reader, file, true);
  },
  /**
   * @private
   * @ignore
   */
  loadAsUnknown : function(deferreds, i, total, file, fileinfo) {
    var that = this,
        op = this.options,
        reader = new FileReader(),
        callback = op.onLoadUnknown;
    if (op.onProgressFile) {
      /**@ignore*/
      reader.onprogress = function(ev) {
        that.updateProgressFile(ev, fileinfo, total);
      };
    }
    /**@ignore*/
    reader.onload = function(ev) {
      deferreds.ends[i] = true;
      deferreds.steps[i].begin();
      if (op.onProgressFile) {
        that.updateProgressFileEnd(fileinfo);
      }
      if (callback) {
        callback.call(
          that,
          ev && ev.target && ev.target.result,
          fileinfo
        );
      }
    };
    /**@ignore*/
    reader.onerror = function(err) {
      deferreds.ends[i] = true;
      deferreds.steps[i].raise(err);
    };
    this.readFile(reader, file);
  },
  /**
   * @private
   * @ignore
   */
  updateProgress : function(index, total) {
    var per, callback = this.options.onProgress;
    if (callback) {
      per = Math.max(0,
              Math.min(100,
                Math.round((index / total) * 100)
              )
      );
      callback.call(this, per);
    }
  },
  /**
   * @private
   * @ignore
   */
  updateProgressEnd : function() {
    var callback = this.options.onProgress;
    if (callback) {
      callback.call(this, 100);
    }
  },
  /**
   * @private
   * @ignore
   */
  updateProgressFile : function(evt, fileinfo, total) {
    var per, op = this.options, callback = op.onProgressFile;
    if (callback &&
        evt && evt.lengthComputable && evt.loaded != null) {
      per = Math.max(0,
              Math.min(100,
                Math.round((evt.loaded / evt.total) * 100)
              )
      );
      callback.call(this, per, fileinfo);
    }
    if (op.onProgress) {
      this.updateProgress(fileinfo.index, total);
    }
  },
  /**
   * @private
   * @ignore
   */
  updateProgressFileEnd : function(fileinfo) {
    var callback = this.options.onProgressFile;
    if (callback) {
      callback.call(this, 100, fileinfo);
    }
  }
});
DropFile.fn.init.prototype = DropFile.fn;

// Definition of prototype.
Handler.fn = Handler.prototype = update(Handler.prototype, {
  /**
   * @lends Pot.Signal.Handler.prototype
   */
  /**
   * @private
   * @ignore
   * @internal
   */
  constructor : Handler,
  /**
   * @private
   * @ignore
   */
  id : PotInternal.getMagicNumber(),
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
  toString : PotToString,
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
Handler.fn.init.prototype = Handler.fn;

Observer.fn = Observer.prototype = {
  /**
   * @lends Pot.Signal.Observer.prototype
   */
  /**
   * @ignore
   */
  constructor : Observer,
  /**
   * @private
   * @ignore
   * @internal
   */
  PotInternal : {
    /**
     * @ignore
     */
    id : PotInternal.getMagicNumber(),
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
  update(Signal[name], {
    /**@ignore*/
    once : function() {
      var args = arrayize(arguments);
      args[index] = true;
      return Signal[name].apply(Signal, args);
    }
  });
});

// Definition of internal signal trappers.
each({
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
      Handler.advices[k],
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
  var resultFunc,
      isLoadEvent = (isDOM && RE.EVENT_ONCE.test(sigName)),
      isOnce, onceHandler, fn, ps = Signal, done;
  if (once || isLoadEvent) {
    isOnce = true;
    /**@ignore*/
    onceHandler = function(listener) {
      ps.detach(object, sigName, callback, useCapture);
    };
  }
  if (isAttached(object, sigName, true)) {
    if (advice === Handler.advices.normal) {
      replaceToAttached(object, sigName);
    }
    fn = PotNoop;
    if (isDOM) {
      return fn;
    } else {
      eachHandlers(function(h) {
        if (h && !h.isDOM &&
            h.advice === Handler.advices.normal &&
            h.object === object && h.signal == sigName &&
            h.listener !== PotNoop
        ) {
          if (done) {
            h.listener = PotNoop;
          } else if (!h.attached) {
            fn = h.listener;
            h.listener = PotNoop;
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
  /**@ignore*/
  resultFunc = function(ev) {
    var d    = newDeferred(),
        args = arguments,
        me   = resultFunc,
        obs  = isDOM ? new Observer(object, ev) : args;
    d.data(errorKey, []);
    trappers.before(d, object, sigName, obs);
    trappers.normal(d, object, sigName, obs);
    trappers.after(d, object, sigName, obs);
    return d.ensure(function(res) {
      var errors;
      if (isError(res)) {
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
  return resultFunc;
}

/**
 * @private
 * @ignore
 */
function signalByJoinPoint(deferred, object, signalName, advice, args) {
  var signals = {}, sigNames, attached,
      o = getElement(object);
  if (!o) {
    return;
  }
  sigNames = arrayize(signalName);
  each(sigNames, function(sig) {
    signals[PREFIX + stringify(sig)] = true;
  });
  attached = false;
  switch (advice) {
    case Handler.advices.normal:
        attached = true;
        break;
    case Handler.advices.before:
    case Handler.advices.after:
        each(sigNames, function(sig) {
          if (isAttached(o, stringify(sig))) {
            attached = true;
            throw PotStopIteration;
          }
        });
        break;
    case Handler.advices.propBefore:
    case Handler.advices.propAfter:
        each(sigNames, function(sig) {
          if (isPropAttached(o, stringify(sig))) {
            attached = true;
            throw PotStopIteration;
          }
        });
        break;
    default:
        attached = false;
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
          if (isError(res)) {
            this.data(errorKey,
              concat.call(this.data(errorKey) || [], res)
            );
          }
          if (advice === Handler.advices.normal) {
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
  var result = false;
  each(arrayize(sigName), function(sig) {
    var i, h, k = stringify(sig);
    for (i = attachedHandlers.length - 1; i >= 0; i--) {
      h = attachedHandlers[i];
      if (h && (ignoreAttached || h.attached) &&
          h.advice === Handler.advices.normal &&
          h.object === object && h.signal == k) {
        result = true;
        throw PotStopIteration;
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
  var result = false;
  each(arrayize(sigName), function(sig) {
    var i, h, k = stringify(sig);
    for (i = attachedHandlers.length - 1; i >= 0; i--) {
      h = attachedHandlers[i];
      if (h && !h.attached &&
          h.advice === Handler.advices.normal &&
          h.object === object && h.signal == k) {
        h.attached = true;
        throw PotStopIteration;
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
        throw PotStopIteration;
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
  var result = false;
  each(arrayize(prop), function(sig) {
    var i, h, k = stringify(sig);
    for (i = propHandlers.length - 1; i >= 0; i--) {
      h = propHandlers[i];
      if (h && !h.attached &&
          (h.advice === Handler.advices.propBefore ||
           h.advice === Handler.advices.propAfter) &&
          h.object === object && h.signal == k) {
        h.attached = true;
        throw PotStopIteration;
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
      i, h, has, sub;
  if (!handler || !handler.attached) {
    return;
  }
  handler.attached = false;
  object   = handler.object;
  signal   = handler.signal;
  capture  = handler.useCapture;
  listener = handler.listener;
  if (!handler.isDOM) {
    if (handler.advice === Handler.advices.propBefore ||
        handler.advice === Handler.advices.propAfter) {
      has = false;
      eachHandlers(function(h) {
        if (h && h.attached && !h.isDOM &&
            (h.advice === Handler.advices.propBefore ||
             h.advice === Handler.advices.propAfter) &&
             h.object === object && h.signal == signal) {
          has = true;
          throw PotStopIteration;
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
    } else if (handler.advice === Handler.advices.normal) {
      has = false;
      sub = null;
      eachHandlers(function(h) {
        if (h && h.attached && !h.isDOM &&
            h.advice === Handler.advices.normal &&
            h.object === object && h.signal == signal) {
          has = true;
          sub = h;
          throw PotStopIteration;
        }
      });
      if (has) {
        if (sub && sub.listener === PotNoop && listener !== PotNoop) {
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
    if (handler.advice === Handler.advices.normal) {
      has = false;
      eachHandlers(function(h) {
        if (h && h.attached && h.isDOM &&
            h.advice === Handler.advices.normal &&
            h.object === object && h.signal == signal) {
          has = true;
          throw PotStopIteration;
        }
      });
      if (!has) {
        for (i = attachedHandlers.length - 1; i >= 0; i--) {
          h = attachedHandlers[i];
          if (h && h.attached &&
              h.advice === Handler.advices.normal &&
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
    return;
  }
  /**@ignore*/
  bindListener = function(sig) {
    /**@ignore*/
    var func = function() {
      var args = arguments;
      callback.apply(o, args);
      if (once) {
        Signal.detach(o, sig, func, false);
      }
    };
    return func;
  };
  isDOM = isDOMObject(o);
  if (isArray(signalName)) {
    isMulti = true;
  }
  each(arrayize(signalName), function(sig) {
    var sigName = stringify(sig), handler, listener;
    listener = bindListener(sigName);
    handler = new Handler({
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
      bindListener, ps = Signal;
  if (!object || !isFunction(callback)) {
    return;
  }
  if (isArray(propName)) {
    isMulti = true;
  }
  /**@ignore*/
  bindListener = function(sigName) {
    /**@ignore*/
    var func = function() {
      var args = arguments;
      callback.apply(object, args);
      if (once) {
        ps.detach(object, sigName, func, false);
      }
    };
    return func;
  };
  props = arrayize(propName);
  each(props, function(p) {
    var key = stringify(p);
    if (isPropAttached(object, key, true)) {
      if (advice === Handler.advices.propBefore ||
          advice === Handler.advices.propAfter) {
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
          if (isError(res)) {
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
          if (isError(res)) {
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
    handler = new Handler({
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
  if (typeof expr === 'object' || isFunction(expr)) {
    if (expr.jquery && expr.get) {
      return expr.get(0);
    } else {
      return expr;
    }
  }
  if (isString(expr)) {
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
  if (err !== null && !isStopIter(err)) {
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
          PotInternalSetTimeout(function() {
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
  var i, len, h, t = [], err;
  if (!handlersLocked) {
    handlersLocked = true;
    try {
      len = handlers.length;
      for (i = 0; i < len; i++) {
        h = handlers[i];
        if (!h ||
            (!h.attached &&
              (
                (h.advice === Handler.advices.normal &&
                 h.listener === PotNoop
                ) ||
                (h.advice === Handler.advices.propBefore ||
                 h.advice === Handler.advices.propAfter
                ) ||
                (h.advice === Handler.advices.before ||
                 h.advice === Handler.advices.after
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
  return new Deferred({async : false});
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

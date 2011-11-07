/*!
 * Pot.js - JavaScript utility library (lite)
 *
 * Pot.js implements practical tendency as a substitution utility library.
 * That includes asynchronous methods as "Deferred"
 *  for solution to heavy process.
 * That is fully ECMAScript compliant.
 *
 * Version 1.21, 2011-11-08
 * Copyright (c) 2011 polygon planet <polygon.planet@gmail.com>
 * Dual licensed under the MIT and GPL v2 licenses.
 */
/**
 * Project Pot.js
 *
 * @description
 *  <p>
 *  Pot.js implements practical tendency as a substitution utility library.
 *  That includes asynchronous methods as "Deferred"
 *   for solution to heavy process.
 *  That is fully ECMAScript compliant.
 *  </p>
 *
 * @description
 *  <p>
 *  非ブロックでの非同期処理を直列的に書けるようにし、
 *  UI や CPU への負担を軽減する
 *  ループ処理を中心に実装された JavaScript ライブラリ。
 *  </p>
 *
 *
 * @fileoverview   Pot.js utility library (lite)
 * @author         polygon planet
 * @version        1.21
 * @date           2011-11-08
 * @copyright      Copyright (c) 2011 polygon planet <polygon.planet*gmail.com>
 * @license        Dual licensed under the MIT and GPL v2 licenses.
 *
 * Based:
 *   - JSDeferred
 *       http://github.com/cho45/jsdeferred
 *   - MochiKit.Async
 *       http://mochikit.com/
 *   - jQuery.Deferred
 *       http://jquery.com/
 *   - Tombloo library (Firefox Add-On)
 *       https://github.com/to/tombloo/wiki
 */
/*
 * JSDoc Comment
 * http://code.google.com/intl/ja/closure/compiler/docs/js-for-compiler.html
 */
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @namespace Pot.js
 */
(function(globals, undefined) {

/**
 * Define the object Pot.
 *
 * @name    Pot
 * @type    Object
 * @class
 * @static
 * @public
 */
var Pot = {VERSION : '1.21', TYPE : 'lite'},

// A shortcut of prototype methods.
slice = Array.prototype.slice,
concat = Array.prototype.concat,
toString = Object.prototype.toString,
hasOwnProperty = Object.prototype.hasOwnProperty,

// Regular expression patterns.
RE_ARRAYLIKE       = /List|Collection/i,
RE_TRIM            = /^[\s\u00A0\u3000]+|[\s\u00A0\u3000]+$/g,
RE_RESCAPE         = /([-.*+?^${}()|[\]\/\\])/g,
RE_PERCENT_ENCODED = /^(?:[a-zA-Z0-9_~.-]|%[0-9a-fA-F]{2})*$/,

// Mozilla XPCOM Components.
Ci, Cc, Cr, Cu;

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
(function(nv) {

// Define environment properties.
update(Pot, {
  /**
   * @lends Pot
   */
  /**
   * Name of the Pot.
   *
   * @const
   * @ignore
   */
  NAME : 'Pot',
  /**
   * Execution environment.
   *
   *
   * @example
   *   if (Pot.System.isWebBrowser) {
   *     document.write('on Web Browser');
   *   }
   *
   *
   * @type  Object
   * @class
   * @static
   * @const
   * @public
   *
   * @property {Boolean} isWebBrowser
   *           Whether the environment is running on web browser.
   * @property {Boolean} isNonBrowser
   *           Whether the environment is running on non-browser.
   * @property {Boolean} isNodeJS
   *           Whether the environment is running on Node.js.
   * @property {Boolean} isWaitable
   *           Whether the user agent can to wait as synchronously.
   * @property {Boolean} hasComponents
   *           Whether the environment has Components (XPCOM).
   * @property {Boolean} hasActiveXObject
   *           Whether the environment has ActiveXObject.
   * @property {Boolean} isYieldable
   *           Whether the environment can use "yield" operator.
   * @property {Boolean} isFirefoxExtension
   *           Whether the environment is running on Firefox extension.
   * @property {Boolean} isChromeExtension
   *           Whether the environment is running on Chrome extension.
   * @property {Boolean} isSafariExtension
   *           Whether the environment is running on Safari extension.
   * @property {Boolean} isGreasemonkey
   *           Whether the environment is running on Greasemonkey.
   * @property {Boolean} isJetpack
   *           Whether the environment is running on Jetpack.
   * @property {Boolean} isNotExtension
   *           Whether the environment is running on non browser-extension.
   */
  System : {},
  /**
   * toString.
   *
   * @return  Return formatted string of object.
   * @type Function
   * @function
   * @static
   */
  toString : function() {
    return buildObjectString(this.NAME || this.name || typeof this);
  },
  /**
   * Detect the browser running.
   *
   * @example
   *   if (Pot.Browser.firefox) {
   *     debug('Firefox version:' + Pot.Browser.firefox.version);
   *   }
   *
   * @type  Object
   * @class
   * @static
   * @const
   *
   * @property {Object} webkit     WebKit engine.
   * @property {Object} opera      Opera.
   * @property {Object} msie       MSIE.
   * @property {Object} mozilla    Mozilla engine.
   * @property {Object} firefox    Mozilla Firefox.
   * @property {Object} chrome     Google Chrome.
   * @property {Object} safari     Safari.
   * @property {Object} iphone     iPhone.
   * @property {Object} ipod       iPod.
   * @property {Object} ipad       iPad.
   * @property {Object} android    Android.
   * @property {Object} blackberry BlackBerry.
   */
  Browser : (function(n) {
    // Expression from: jquery.browser (based)
    var r = {}, u, m, ua, ver, re, rs, i, len;
    re = {
      webkit  : /(webkit)(?:.*version|)[\s\/]+([\w.]+)/,
      opera   : /(opera)(?:.*version|)[\s\/]+([\w.]+)/,
      msie    : /(msie)[\s\/]+([\w.]+)/,
      mozilla : /(?!^.*compatible.*$).*(mozilla)(?:.*?\s+rv[:\s\/]+([\w.]+)|)/
    };
    rs = [
      /webkit.*(chrome)[\s\/]+([\w.]+)/,
      /webkit.*version[\s\/]+([\w.]+).*(safari)/,
      /webkit.*(safari)[\s\/]+([\w.]+)/,
      /(iphone).*version[\s\/]+([\w.]+)/,
      /(ipod).*version[\s\/]+([\w.]+)/,
      /(ipad).*version[\s\/]+([\w.]+)/,
      /(android).*version[\s\/]+([\w.]+)/,
      /(blackberry)(?:[\s\d]*|.*version)[\s\/]+([\w.]+)/,
      re.webkit,
      re.opera,
      re.msie,
      /(?!^.*compatible.*$).*mozilla.*?(firefox)(?:[\s\/]+([\w.]+)|)/,
      re.mozilla
    ];
    u = String(n && n.userAgent).toLowerCase();
    if (u) {
      for (i = 0, len = rs.length; i < len; i++) {
        if ((m = rs[i].exec(u))) {
          break;
        }
      }
      if (m) {
        if (/[^a-z]/.test(m[1])) {
          ua  = m[2];
          ver = m[1];
        } else {
          ua  = m[1];
          ver = m[2];
        }
        if (ua) {
          r[ua] = {version : String(ver || 0)};
        }
      }
      m = re.webkit.exec(u) || re.opera.exec(u)   ||
          re.msie.exec(u)   || re.mozilla.exec(u) || [];
      if (m && m[1]) {
        r[m[1]] = {version : String(m[2] || 0)};
      }
    }
    return r;
  })(nv),
  /**
   * Detect the browser/user language.
   *
   * @example
   *   if (Pot.LANG == 'ja') {
   *     debug('ハローワールド');
   *   }
   *
   * @type  String
   * @static
   * @const
   */
  LANG : (function(n) {
    return ((n && (n.language || n.userLanguage     ||
            n.browserLanguage || n.systemLanguage)) ||
            'en').split(/[^a-zA-Z0-9]+/).shift().toLowerCase();
  })(nv),
  /**
   * Detect the user operating system.
   *
   * @example
   *   if (Pot.OS.win) {
   *     debug('OS : ' + Pot.OS.toString());
   *   }
   *
   * @type Object
   * @class
   * @static
   * @const
   *
   * @property {Boolean}  iphone     iPhone.
   * @property {Boolean}  ipod       iPod.
   * @property {Boolean}  ipad       iPad.
   * @property {Boolean}  blackberry BlackBerry.
   * @property {Boolean}  android    Android.
   * @property {Boolean}  mac        Mac.
   * @property {Boolean}  win        Windows.
   * @property {Boolean}  linux      Linux.
   * @property {Boolean}  x11        X11.
   * @property {Function} toString   Represents OS as a string.
   */
  OS : (function(nv) {
    var r = {}, n = nv || {}, pf, ua, av, maps, i, len, o;
    pf = String(n.platform).toLowerCase();
    ua = String(n.userAgent).toLowerCase();
    av = String(n.appVersion).toLowerCase();
    maps = [
      {s: 'iphone',     p: pf},
      {s: 'ipod',       p: pf},
      {s: 'ipad',       p: ua},
      {s: 'blackberry', p: ua},
      {s: 'android',    p: ua},
      {s: 'mac',        p: pf},
      {s: 'win',        p: pf},
      {s: 'linux',      p: pf},
      {s: 'x11',        p: av}
    ];
    for (i = 0, len = maps.length; i < len; i++) {
      o = maps[i];
      if (~o.p.indexOf(o.s)) {
        r[o.s] = true;
      }
    }
    if (r.android && !~ua.indexOf('mobile')) {
      r.androidtablet = true;
    }
    if (r.ipad || r.androidtablet) {
      r.tablet = true;
    }
    /**
     * @lends Pot.OS
     *
     * @return {String}  Return the platform as a string.
     */
    r.toString = function() {
      var s = [], p;
      for (p in r) {
        if (r[p] === true) {
          s.push(p);
        }
      }
      return s.join('/');
    };
    return r;
  })(nv),
  /**
   * Global object. (e.g. window)
   *
   * @type Object
   * @static
   * @public
   */
  Global : (function() {
    if (!globals ||
        typeof globals !== 'object' || !('setTimeout' in globals)) {
      globals = this || {};
    }
    return this || {};
  })(),
  /**
   * Noop function.
   *
   * @type  Function
   * @function
   * @const
   */
  noop : function() {},
  /**
   * Temporary storage place.
   *
   * @type  Object
   * @private
   * @ignore
   */
  tmp : {},
  /**
   * Treats the internal properties/methods.
   *
   * @internal
   * @type Object
   * @class
   * @private
   * @ignore
   */
  Internal : {
    /**
     * @lends Pot.Internal
     */
    /**
     * Numbering the magic numbers for the constructor.
     *
     * @private
     * @ignore
     */
    getMagicNumber : update(function() {
      var me = arguments.callee;
      return me.INITIAL_NUMBER + (me.count++);
    }, {
      count : 0,
      INITIAL_NUMBER : Number('0xC26BEB642C0A') || (2147483647 ^ 2047)
    }),
    /**
     * Get the export object.
     *
     * @private
     * @ignore
     */
    getExportObject : function(forGlobalScope) {
      var outputs;
      if (forGlobalScope) {
        if (Pot.System.isNonBrowser) {
          outputs = Pot.Global || globals;
        } else {
          outputs = (Pot.isWindow(globals) && globals) ||
                    (Pot.isWindow(Pot.Global) && Pot.Global) ||
                     Pot.currentWindow();
        }
        if (!outputs &&
            typeof window !== 'undefined' && Pot.isWindow(window)) {
          outputs = window;
        }
      }
      if (!outputs) {
        if (Pot.System.isNodeJS) {
          if (typeof module === 'object' &&
              typeof module.exports === 'object') {
            outputs = module.exports;
          } else if (typeof exports === 'object') {
            outputs = exports;
          } else {
            outputs = globals;
          }
        } else {
          outputs = globals;
        }
        if (!outputs) {
          outputs = globals || Pot.Global || Pot.currentWindow();
        }
      }
      return outputs;
    }
  },
  /**
   * Extend target object from arguments.
   *
   *
   * @example
   *   var obj = {foo: 'v1', bar: 'v2'};
   *   var src = {baz: 'v3'};
   *   update(obj, src);
   *   debug(obj);
   *   // @results  obj = {foo: 'v1', bar: 'v2', baz: 'v3'}
   *
   *
   * @param  {Object}     target   Target object.
   * @param  {...Object}  (...)    Subject objects.
   * @return {Object}              Updated object. (first argument).
   * @static
   * @function
   * @public
   */
  update : update,
  /**
   * Refer Pot object.
   *
   * @ignore
   */
  Pot : Pot
});
})(typeof navigator !== 'undefined' && navigator || {});

// Definition of System.
update(Pot.System, (function() {
  var o = {}, g;
  o.isWaitable = false;
  if (typeof window === 'object' && 'setTimeout' in window &&
      window.window == window &&
      typeof document === 'object' && document.nodeType > 0 &&
      typeof document.documentElement === 'object'
  ) {
    o.isWebBrowser = true;
    if (window.location &&
        /^(?:chrome|resource):?$/.test(window.location.protocol)) {
      try {
        if (typeof Components !== 'object') {
          throw false;
        }
        Cc = Components.classes;
        Ci = Components.interfaces;
        Cr = Components.results;
        Cu = Components.utils;
        o.isWaitable = true;
        o.hasComponents = true;
        if (Pot.Browser.firefox || Pot.Browser.mozilla) {
          o.isFirefoxExtension = true;
        }
      } catch (e) {
        // If you need XPCOM, try following privilege.
        // e.g.
        //   netscape.security.PrivilegeManager
        //           .enablePrivilege('UniversalXPConnect');
        //   or
        //   about:config :
        //   signed.applets.codebase_principal_support : true (default=false)
        //
        Ci = Cc = Cr = Cu = null;
      }
    }
  } else {
    o.isNonBrowser = true;
    if (typeof process !== 'undefined' && process && process.version &&
        typeof require === 'function' &&
        (typeof exports === 'object' ||
        (typeof module === 'object' && typeof module.exports === 'object'))
    ) {
      o.isNodeJS = true;
    }
  }
  if (Pot.Global && Pot.Global.ActiveXObject ||
      typeof ActiveXObject !== 'undefined' && (ActiveXObject)) {
    o.hasActiveXObject = true;
  }
  if (!o.isFirefoxExtension) {
    if (Pot.Browser.chrome || Pot.Browser.webkit || Pot.Browser.safari) {
      if (typeof chrome === 'object' &&
          typeof chrome.extension === 'object') {
        o.isChromeExtension = true;
      } else if (typeof safari === 'object' &&
                 typeof safari.extension === 'object') {
        o.isSafariExtension = true;
      }
    }
  }
  if (!o.isChromeExtension && !o.isSafariExtension) {
    if (typeof GM_log === 'function' &&
        typeof GM_xmlhttpRequest === 'function') {
      o.isGreasemonkey = true;
    } else if (typeof require === 'function') {
      try {
        if ('title' in require('windows').browserWindows.activeWindow) {
          o.isJetpack = true;
        }
      } catch (e) {}
    }
    if (o.isWebBrowser && !o.isGreasemonkey && !o.isFirefoxExtension) {
      o.isNotExtension = true;
    }
  }
  try {
    /**@ignore*/
    g = (function() {
      yield (0);
    })();
    if (g && typeof g.next === 'function') {
      o.isYieldable = true;
    }
  } catch (e) {}
  return o;
})());

/**
 * Creates methods to detect the type definition.
 *
 * <pre>
 * Pot.is*
 *
 *   * ::= Boolean | Number | String | Function |
 *         Array | Date | RegExp | Object | Error
 * </pre>
 *
 *
 * @example
 *   Pot.isString(100);      // false
 *   Pot.isObject('hoge');   // false
 *   Pot.isArray([1, 2, 3]); // true
 *
 *
 * @param  {*}         A target object
 * @return {Boolean}   Returns whether the proper object
 * @lends  Pot
 * @static
 * @public
 *
 * @property {Function} isBoolean  Detect the Boolean type. (static)
 * @property {Function} isNumber   Detect the Number type. (static)
 * @property {Function} isString   Detect the String type. (static)
 * @property {Function} isFunction Detect the Function type. (static)
 * @property {Function} isArray    Detect the Array type. (static)
 * @property {Function} isDate     Detect the Date type. (static)
 * @property {Function} isRegExp   Detect the RegExp type. (static)
 * @property {Function} isObject   Detect the Object type. (static)
 * @property {Function} isError    Detect the Error type. (static)
 */
(function(types) {
  var i, len, typeMaps = {};
  for (i = 0, len = types.length; i < len; i++) {
    (function() {
      var type = types[i], low = type.toLowerCase();
      typeMaps[buildObjectString(type)] = low;
      Pot['is' + type] = (function() {
        switch (low) {
          case 'error':
              return function(o) {
                return (o && (o instanceof Error ||
                        Pot.typeOf(o) === low))  || false;
              };
          case 'date':
              return function(o) {
                return (o && (o instanceof Date ||
                        Pot.typeOf(o) === low)) || false;
              };
          default:
              return function(o) {
                return Pot.typeOf(o) === low;
              };
        }
      })();
    })();
  }
  Pot.update({
    /**
     * @lends Pot
     */
    /**
     * Get the object type as string.
     *
     * <pre>
     * The return types:
     *   'boolean', 'number', 'string',   'function',
     *   'array',   'date',   'regexp',   'object',
     *   'error',   'null',   'undefined'
     * </pre>
     *
     *
     * @example
     *   debug( Pot.typeOf([1, 2, 3]) );
     *   // @results 'array'
     *
     *
     * @param  {*}       o  A target object.
     * @return {String}     Return the type of object.
     * @static
     * @function
     * @public
     */
    typeOf : function(o) {
      return (o == null) ? String(o)
                         : (typeMaps[toString.call(o)] || 'object');
    },
    /**
     * Get the object type like of array or any types.
     *
     * <pre>
     * The return types:
     *   'boolean', 'number', 'string',   'function',
     *   'array',   'date',   'regexp',   'object',
     *   'error',   'null',   'undefined'
     * </pre>
     *
     *
     * @example
     *   (function() {
     *     debug( Pot.typeLikeOf(arguments) );
     *     // @results 'array'
     *   })();
     *
     *
     * @param  {*}       o  A target object.
     * @return {String}     Return the type of object.
     * @static
     * @function
     * @public
     */
    typeLikeOf : function(o) {
      var type = Pot.typeOf(o);
      if (type !== 'array' && Pot.isArrayLike(o)) {
        type = 'array';
      }
      return type;
    }
  });
})('Boolean Number String Function Array Date RegExp Object Error'.split(' '));
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
(function(SI) {
// Aggregate in this obejct for global functions. (HTML5 Task)
update(Pot.Internal, {
  /**
   * @lends Pot.Internal
   */
  /**
   * Call the function in the background (i.e. in non-blocking).
   *
   * @param  {Function}  callback  The callback function.
   *
   * @type  Object
   * @class
   * @static
   * @private
   * @ignore
   * @based JSDeferred.next
   */
  callInBackground : {
    /**
     * @lends Pot.Internal.callInBackground
     */
    /**
     * Call the function in the background (i.e. in non-blocking).
     *
     * @param  {Function}  callback  The callback function.
     *
     * @type  Function
     * @function
     * @static
     * @private
     * @ignore
     * @based JSDeferred.next
     */
    flush : function(callback) {
      var handler = this.byEvent || this.byTick || this.byTimer;
      handler(callback);
    },
    /**
     * @private
     * @ignore
     * @based JSDeferred.next
     */
    byEvent : (function() {
      var IMAGE;
      if (Pot.System.isNonBrowser || Pot.System.isNodeJS ||
          typeof window !== 'object'  || typeof document !== 'object' ||
          typeof Image !== 'function' || window.opera || Pot.Browser.opera ||
          typeof document.addEventListener !== 'function'
      ) {
        return false;
      }
      try {
        if (typeof (new Image()).addEventListener !== 'function') {
          return false;
        }
      } catch (e) {
        return false;
      }
      // Dummy 1x1 gif image.
      IMAGE = 'data:image/gif;base64,' +
              'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
      /**@ignore*/
      return function(callback) {
        var done, img, handler;
        img = new Image();
        /**@ignore*/
        handler = function() {
          try {
            img.removeEventListener('load', handler, false);
            img.removeEventListener('error', handler, false);
          } catch (e) {}
          if (!done) {
            done = true;
            callback();
          }
        };
        img.addEventListener('load', handler, false);
        img.addEventListener('error', handler, false);
        try {
          img.src = IMAGE;
        } catch (e) {
          this.byEvent = this.byTimer;
        }
      };
    })(),
    /**
     * @private
     * @ignore
     */
    byTick : (function() {
      if (!Pot.System.isNodeJS || typeof process !== 'object' ||
          typeof process.nextTick !== 'function') {
        return false;
      }
      /**@ignore*/
      return function(callback) {
        process.nextTick(callback);
      };
    })(),
    /**
     * @private
     * @ignore
     */
    byTimer : function(callback, msec) {
      return setTimeout(callback, msec || 0);
    }
  },
  /**
   * Alias for window.setTimeout function. (for non-window-environment)
   *
   * @type  Function
   * @function
   * @static
   * @private
   * @ignore
   */
  setTimeout : function(func, msec) {
    try {
      return Pot.Internal.callInBackground.byTimer(func, msec || 0);
    } catch (e) {}
  },
  /**
   * Alias for window.clearTimeout function. (for non-window-environment)
   *
   * @type  Function
   * @function
   * @static
   * @private
   * @ignore
   */
  clearTimeout : function(id) {
    try {
      return clearTimeout(id);
    } catch (e) {}
  },
  /**
   * Alias for window.setInterval function. (for non-window-environment)
   *
   * @type  Function
   * @function
   * @static
   * @private
   * @ignore
   */
  setInterval : function(func, msec) {
    try {
      return setInterval(func, msec || 0);
    } catch (e) {}
  },
  /**
   * Alias for window.clearInterval function. (for non-window-environment)
   *
   * @type  Function
   * @function
   * @static
   * @private
   * @ignore
   */
  clearInterval : function(id) {
    try {
      return clearInterval(id);
    } catch (e) {}
  }
});

// Define distinction of types.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Emulate StopIteration.
   *
   *
   * @example
   *   Pot.forEach([1, 2, 3, 4, 5], function(v) {
   *     if (v > 2) {
   *       throw Pot.StopIteration;
   *     }
   *     debug(v);
   *   });
   *
   *
   * @type  Object
   * @static
   * @const
   * @public
   */
  StopIteration : (function() {
    /**@ignore*/
    var f = update(function() {
      return f;
    }, {
      NAME     : SI,
      toString : Pot.toString
    });
    f.prototype = {
      constructor : f,
      NAME        : f.NAME,
      toString    : f.toString
    };
    f.prototype.constructor.prototype = f.constructor.prototype;
    return new f;
  })(),
  /**
   * Return whether the argument is StopIteration or not.
   *
   *
   * @example
   *   try {
   *     for (var i = 0; i < 10; i++) {
   *       if (i > 5) {
   *         throw Pot.StopIteration;
   *       }
   *       debug(i);
   *     }
   *   } catch (e) {
   *     if (Pot.isStopIter(e)) {
   *       debug('StopIteration was thrown!');
   *     } else {
   *       throw e;
   *     }
   *   }
   *
   *
   * @param  {*}         o   Target object.
   * @return {Boolean}       Return true if argument is StopIteration.
   * @type Function
   * @function
   * @static
   * @public
   */
  isStopIter : function(o) {
    if (!o) {
      return false;
    }
    if (Pot.StopIteration !== undefined &&
        (o == Pot.StopIteration || o instanceof Pot.StopIteration)) {
      return true;
    }
    if (typeof StopIteration !== 'undefined' &&
        (o == StopIteration || o instanceof StopIteration)) {
      return true;
    }
    if (this && this.StopIteration !== undefined &&
        (o == this.StopIteration || o instanceof this.StopIteration)) {
      return true;
    }
    if (~toString.call(o).indexOf(SI) ||
        ~String(o && o.toString && o.toString() || o).indexOf(SI)) {
      return true;
    }
    if (Pot.isError(o) && o[SI] && !(SI in o[SI]) &&
        !Pot.isError(o[SI]) && Pot.isStopIter(o[SI])) {
      return true;
    }
    return false;
  },
  /**
   * Return whether the argument is Iterator or not.
   *
   *
   * @example
   *   var iter = new Pot.Iter();
   *   var i = 0;
   *   iter.next = function() {
   *     if (i > 5) {
   *       throw StopIteration;
   *     }
   *     return i++;
   *   };
   *   debug( isIterable(iter) ); // @results  true
   *   var func = function() {};
   *   debug( isIterable(func) ); // @results  false
   *
   *
   * @example
   *   var iter = (function() {
   *     for (var i = 0; i < 10; i++) {
   *       yield;
   *       debug(i);
   *     }
   *   })();
   *   debug( isIterable(iter) ); // @results  true
   *
   *
   * @param  {*}         x   Target object.
   * @return {Boolean}       Return true if argument is iterable.
   * @type Function
   * @function
   * @static
   * @public
   */
  isIterable : function(x) {
    return !!(x && Pot.isFunction(x.next) &&
         (~x.next.toString().indexOf(SI) || Pot.isNativeCode(x.next)));
  },
  /**
   * Return whether the argument object like Array (i.e. iterable)
   *
   *
   * @example
   *   (function() {
   *     debug(Pot.isArray(arguments));
   *     // @results false
   *     debug(Pot.isArrayLike(arguments));
   *     // @results true
   *   })();
   *
   *
   * @param   {*}         o     A target object
   * @return  {Boolean}         ture or false (iterable or false)
   * @type Function
   * @function
   * @static
   * @public
   */
  isArrayLike : function(o) {
    var len;
    if (!o) {
      return false;
    }
    if (Pot.isArray(o) || o instanceof Array || o.constructor === Array) {
      return true;
    }
    len = o.length;
    if (!Pot.isNumber(len) || (!Pot.isObject(o) && !Pot.isArray(o)) ||
        o === Pot || o === Pot.Global || o === globals ||
        Pot.isWindow(o) || Pot.isDocument(o) || Pot.isElement(o)
    ) {
      return false;
    }
    if (o.isArray || Pot.isFunction(o.callee) || Pot.isNodeList(o) ||
        ((typeof o.item === 'function' ||
          typeof o.nextNode === 'function') &&
           o.nodeType != 3 && o.nodeType != 4) ||
        (0 in o && ((len - 1) in o)) ||
        RE_ARRAYLIKE.test(toString.call(o))
    ) {
      return true;
    } else {
      return false;
    }
  },
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
   * @static
   * @public
   */
  isDeferred : function(x) {
    return x != null && ((x instanceof Pot.Deferred) ||
     (x.id   != null && x.id   === Pot.Deferred.prototype.id &&
      x.NAME != null && x.NAME === Pot.Deferred.prototype.NAME));
  },
  /**
   * Check whether the argument object is an instance of Pot.Iter.
   *
   *
   * @example
   *   var obj = {hoge: 1};
   *   var iter = new Pot.Iter();
   *   debug(isIter(obj));  // false
   *   debug(isIter(iter)); // true
   *
   *
   * @param  {Object|*}  x  The target object to test.
   * @return {Boolean}      Return true if the argument object is an
   *                          instance of Pot.Iter, otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isIter : function(x) {
    return x != null && ((x instanceof Pot.Iter) ||
     (x.id   != null && x.id   === Pot.Iter.prototype.id &&
      x.NAME != null && x.NAME === Pot.Iter.prototype.NAME &&
                typeof x.next  === 'function'));
  },
  /**
   * Check whether the value is percent encoded.
   *
   *
   * @example
   *   debug(isPercentEncoded('abc'));              // false
   *   debug(isPercentEncoded('1234567890'));       // false
   *   debug(isPercentEncoded('%7B%20hoge%20%7D')); // true
   *   debug(isPercentEncoded(null));               // false
   *   debug(isPercentEncoded((void 0)));           // false
   *
   *
   * @param  {String|*}   s   The target string to test.
   * @return {Boolean}        Return true if the value is encoded,
   *                            otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isPercentEncoded : function(s) {
    return RE_PERCENT_ENCODED.test(s);
  },
  /**
   * Check whether the value can be numeric value.
   *
   *
   * @example
   *   debug(isNumeric(0));               // true
   *   debug(isNumeric(1234567890));      // true
   *   debug(isNumeric(new Number(25)));  // true
   *   debug(isNumeric(null));            // false
   *   debug(isNumeric((void 0)));        // false
   *   debug(isNumeric('abc'));           // false
   *   debug(isNumeric('0xFF'));          // true
   *   debug(isNumeric('1e8'));           // true
   *   debug(isNumeric('10px'));          // false
   *   debug(isNumeric('-512 +1'));       // false
   *   debug(isNumeric([]));              // false
   *   debug(isNumeric([100]));           // false
   *   debug(isNumeric(new Date()));      // false
   *   debug(isNumeric({}));              // false
   *   debug(isNumeric((function() {}))); // false
   *
   *
   * @param  {Number|*}   n   The target value to test.
   * @return {Boolean}        Return true if the value is numeric,
   *                            otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isNumeric : function(n) {
    return (n == null ||
           (n === ''  ||
           (n ==  ''  && n && n.constructor === String)) ||
           (typeof n === 'object' && n.constructor !== Number)) ?
            false : !isNaN(n - 0);
  },
  /**
   * Returns whether the supplied number represents an integer,
   *   i.e. that is has no fractional component.
   *
   *
   * @example
   *   debug(isInt(0));                       // true
   *   debug(isInt(-524560620));              // true
   *   debug(isInt(0.1205562));               // false
   *   debug(isInt(1.5));                     // false
   *   debug(isInt(12345));                   // true
   *   debug(isInt(Number.MAX_VALUE));        // true
   *   debug(isInt(Number.MAX_VALUE * 1000)); // false
   *   debug(isInt(null));                    // false
   *   debug(isInt((void 0)));                // false
   *   debug(isInt('hoge'));                  // false
   *   debug(isInt(''));                      // false
   *   debug(isInt([100]));                   // false
   *
   *
   * @param  {Number}   n  The number to test.
   * @return {boolean}     Whether `n` is an integer.
   * @type Function
   * @function
   * @static
   * @public
   */
  isInt : function(n) {
    return Pot.isNumber(n) && isFinite(n) && n % 1 == 0;
  },
  /**
   * Check whether the argument is the native code.
   *
   *
   * @example
   *   debug(isNativeCode(null));                     // false
   *   debug(isNativeCode((void 0)));                 // false
   *   debug(isNativeCode({foo: 1, bar: 2, baz: 3})); // false
   *   debug(isNativeCode('hoge'));                   // false
   *   debug(isNativeCode(window));                   // false
   *   debug(isNativeCode(document));                 // false
   *   debug(isNativeCode(document.body));            // false
   *   debug(isNativeCode(document.getElementById));  // true
   *   debug(isNativeCode(encodeURIComponent));       // true
   *   debug(isNativeCode(Array.prototype.slice));    // true
   *   debug(isNativeCode((function() {})));          // false
   *   debug(isNativeCode(Math.max.toString()));      // true
   *
   *
   * @param  {String|Function}  method   The target method.
   * @return {Boolean}                   Return true if the `method` is
   *                                       native code,
   *                                       otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isNativeCode : function(method) {
    var code;
    if (!method) {
      return false;
    }
    code = method.toString();
    return !!(~code.indexOf('[native code]') && code.length <= 92);
  },
  /**
   * Check whether the argument function is the built-in method.
   *
   *
   * @example
   *   debug(isBuiltinMethod(null));                     // false
   *   debug(isBuiltinMethod((void 0)));                 // false
   *   debug(isBuiltinMethod({foo: 1, bar: 2, baz: 3})); // false
   *   debug(isBuiltinMethod('hoge'));                   // false
   *   debug(isBuiltinMethod(window));                   // false
   *   debug(isBuiltinMethod(document));                 // false
   *   debug(isBuiltinMethod(document.body));            // false
   *   debug(isBuiltinMethod(document.getElementById));  // true
   *   debug(isBuiltinMethod(encodeURIComponent));       // true
   *   debug(isBuiltinMethod(Array.prototype.slice));    // true
   *   debug(isBuiltinMethod((function() {})));          // false
   *
   *
   * @param  {Function}  method   The target method.
   * @return {Boolean}            Return true if the argument function
   *                                is built-in, otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isBuiltinMethod : function(method) {
    return method != null && (typeof method === 'function' ||
           method.constructor === Function) && Pot.isNativeCode(method);
  },
  /**
   * Check whether the argument object is Window.
   *
   *
   * @example
   *   debug(isWindow(null));                                 // false
   *   debug(isWindow((void 0)));                             // false
   *   debug(isWindow({foo: 1, bar: 2, baz: 3}));             // false
   *   debug(isWindow('hoge'));                               // false
   *   debug(isWindow(window));                               // true
   *   debug(isWindow(document));                             // false
   *   debug(isWindow(document.body));                        // false
   *   debug(isWindow(document.getElementById('container'))); // false
   *   debug(isWindow(document.getElementsByTagName('div'))); // false
   *
   *
   * @param  {Document|Element|Node|*}  x  The target object.
   * @return {Boolean}                     Return true if the argument object
   *                                         is Window, otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isWindow : function(x) {
    return x != null && typeof x === 'object' && 'setInterval' in x &&
           x.window == x && !!(x.location || x.screen || x.navigator ||
           x.document);
  },
  /**
   * Check whether the argument object is Document.
   *
   *
   * @example
   *   debug(isDocument(null));                                 // false
   *   debug(isDocument((void 0)));                             // false
   *   debug(isDocument({foo: 1, bar: 2, baz: 3}));             // false
   *   debug(isDocument('hoge'));                               // false
   *   debug(isDocument(window));                               // false
   *   debug(isDocument(document));                             // true
   *   debug(isDocument(document.body));                        // false
   *   debug(isDocument(document.getElementById('container'))); // false
   *   debug(isDocument(document.getElementsByTagName('div'))); // false
   *
   *
   * @param  {Window|Element|Node|*}  x  The target object.
   * @return {Boolean}                   Return true if the argument object
   *                                       is Document, otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isDocument : function(x) {
    return x != null && typeof x === 'object' && 'getElementById' in x &&
      x.nodeType > 0 && typeof x.documentElement === 'object';
  },
  /**
   * Check whether the argument object is Element.
   *
   *
   * @example
   *   debug(isElement(null));                                 // false
   *   debug(isElement((void 0)));                             // false
   *   debug(isElement({foo: 1, bar: 2, baz: 3}));             // false
   *   debug(isElement('hoge'));                               // false
   *   debug(isElement(window));                               // false
   *   debug(isElement(document));                             // false
   *   debug(isElement(document.body));                        // true
   *   debug(isElement(document.getElementById('container'))); // true
   *   debug(isElement(document.getElementsByTagName('div'))); // false
   *
   *
   * @param  {Element|Node|*}  x  The target object.
   * @return {Boolean}            Return true if the argument object
   *                                is Element, otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isElement : function(x) {
    return x != null && typeof x === 'object' && x.nodeType == 1;
  },
  /**
   * Check whether the object looks like a DOM node.
   *
   *
   * @example
   *   debug(isNodeLike({foo: 1, bar: 2, baz: 3}));             // false
   *   debug(isNodeLike('hoge'));                               // false
   *   debug(isNodeLike(window));                               // false
   *   debug(isNodeLike(document));                             // true
   *   debug(isNodeLike(document.body));                        // true
   *   debug(isNodeLike(document.getElementById('container'))); // true
   *   debug(isNodeLike(document.getElementsByTagName('div'))); // false
   *
   *
   * @param  {*}        x   The target object.
   * @return {Boolean}      Whether the object looks like a DOM node.
   * @type Function
   * @function
   * @static
   * @public
   */
  isNodeLike : function(x) {
    return x != null && typeof x === 'object' && x.nodeType > 0;
  },
  /**
   * Returns true if the object is a NodeList.
   *
   *
   * @example
   *   var obj = new Array({foo: 1, bar: 2, baz: 3});
   *   var nodes = document.getElementsByTagName('div');
   *   debug(isNodeList(obj));
   *   // @results  false
   *   debug(isNodeList(nodes));
   *   // @results  true
   *   //
   *   // Make dummy method for test.
   *   obj.item = function() {};
   *   debug(isNodeList(obj));
   *   // @results  false
   *
   *
   * @param  {*}        x   The target object to test.
   * @return {Boolean}      Whether the object is a NodeList.
   * @type Function
   * @function
   * @static
   * @public
   */
  isNodeList : function(x) {
    var type;
    if (x && Pot.isNumber(x.length)) {
      type = typeof x.item;
      if (Pot.isObject(x)) {
        return type === 'function' || type === 'string';
      } else if (Pot.isFunction(x)) {
        return type === 'function';
      }
    }
    return false;
  }
});
})('StopIteration');

// Define StopIteration (this scope only)
if (typeof StopIteration === 'undefined') {
  var StopIteration = Pot.StopIteration;
}

// Definition of current Document and URI.
(function() {
  var win, doc, uri, wp, dp;
  wp = 'window contentWindow defaultView parentWindow content top'.split(' ');
  dp = 'ownerDocument document'.split(' ');
  /**@ignore*/
  function detectWindow(x) {
    var w;
    if (x) {
      if (Pot.isWindow(x)) {
        w = x;
      } else {
        each(wp, function(p) {
          try {
            if (Pot.isWindow(x[p])) {
              w = x[p];
            }
            if (x[p].content && Pot.isWindow(x[p].content)) {
              w = x[p].content;
            }
          } catch (e) {}
          if (w) {
            throw Pot.StopIteration;
          }
        });
      }
    }
    return w;
  }
  /**@ignore*/
  function detectDocument(x) {
    var d;
    if (x) {
      if (Pot.isDocument(x)) {
        d = x;
      } else {
        each(dp, function(p) {
          try {
            if (Pot.isDocument(x[p])) {
              d = x[p];
            }
            if (x[p].content && Pot.isDocument(x[p].content.document)) {
              d = x[p].content.document;
            }
          } catch (e) {}
          if (d) {
            throw Pot.StopIteration;
          }
        });
      }
    }
    return d;
  }
  each([
    globals,
    Pot.Global,
    typeof window   === 'undefined' ? this : window,
    typeof document === 'undefined' ? this : document
  ], function(x) {
    if (x) {
      if (!win) {
        win = detectWindow(x);
      }
      if (!doc) {
        doc = detectDocument(x);
      }
      if (win && doc) {
        throw Pot.StopIteration;
      }
    }
  });
  if (Pot.System.isNodeJS && typeof __filename === 'string') {
    uri = __filename;
  } else {
    if (doc) {
      try {
        uri = doc.documentURI || doc.baseURI || doc.URL;
      } catch (e) {}
    }
    if (!uri && win) {
      try {
        uri = win.location && win.location.href || win.location;
      } catch (e) {}
    }
  }
  update(Pot.System, {
    /**
     * @lends Pot.System
     */
    /**
     * Current DOM Window object if exists (i.e., on web-browser).
     *
     * @type Object
     * @static
     * @public
     */
    currentWindow : win || {},
    /**
     * Current DOM Document object if exists (i.e., on web-browser).
     *
     * @type Object
     * @static
     * @public
     */
    currentDocument : doc || {},
    /**
     * The current document URI (on web-browser) or filename (on non-browser).
     *
     * @type String
     * @static
     * @public
     */
    currentURI : stringify(uri, true)
  });
  Pot.update({
    /**
     * @lends Pot
     */
    /**
     * Get the current DOM Window object if exists (i.e., on web-browser).
     *
     * @return {Object} The current DOM window object.
     * @type Function
     * @function
     * @static
     * @public
     */
    currentWindow : function() {
      return Pot.System.currentWindow;
    },
    /**
     * Get the current DOM Document object if exists (i.e., on web-browser).
     *
     * @return {Object} The current DOM Document object.
     * @type Function
     * @function
     * @static
     * @public
     */
    currentDocument : function() {
      return Pot.System.currentDocument;
    },
    /**
     * Get the current document URI (on web-browser)
     *   or filename (on non-browser).
     *
     * @return {String} The current URI.
     * @type Function
     * @static
     * @public
     */
    currentURI : function() {
      return Pot.System.currentURI;
    }
  });
})();

// Definition of builtin method states.
update(Pot.System, {
  /**
   * @lends Pot.System
   */
  /**
   * Whether the environment supports the built-in "Object.keys".
   *
   * @type  Boolean
   * @const
   */
  isBuiltinObjectKeys : Pot.isBuiltinMethod(Object.keys),
  /**
   * Whether the environment supports the built-in "Array.prototype.forEach".
   *
   * @type  Boolean
   * @const
   */
  isBuiltinArrayForEach : Pot.isBuiltinMethod(Array.prototype.forEach),
  /**
   * Whether the environment supports the built-in "Array.prototype.indexOf".
   *
   * @type  Boolean
   * @const
   */
  isBuiltinArrayIndexOf : Pot.isBuiltinMethod(Array.prototype.indexOf),
  /**
   * Whether the environment supports
   *   the built-in "Array.prototype.lastIndexOf".
   *
   * @type  Boolean
   * @const
   */
  isBuiltinArrayLastIndexOf : Pot.isBuiltinMethod(Array.prototype.lastIndexOf)
});

// Update Pot object methods.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Evaluates a script in a global context.
   *
   *
   * @example
   *   globalEval('function hoge() { return "hoge"; }');
   *   debug(hoge());
   *   // @results 'hoge'
   *
   *
   * @param  {String}  code  The code to evaluate.
   * @return {*}             The value of evaluated result.
   * @type  Function
   * @function
   * @static
   * @public
   */
  globalEval : update(function(code) {
    var me = arguments.callee, id, scope, func, doc, script;
    if (code && me.patterns.valid.test(code)) {
      if (Pot.System.hasActiveXObject) {
        if (typeof execScript !== 'undefined' && execScript &&
            me.test(execScript)) {
          return execScript(code, me.language);
        } else {
          func = 'execScript';
          if (func in globals && me.test(func, globals)) {
            return globals[func](code, me.language);
          } else if (func in Pot.Global && me.test(func, Pot.Global)) {
            return Pot.Global[func](code, me.language);
          }
        }
      }
      func = 'eval';
      if (func in globals && me.test(func, globals)) {
        scope = globals;
      } else if (func in Pot.Global && me.test(func, Pot.Global)) {
        scope = Pot.Global;
      }
      if (Pot.System.isGreasemonkey) {
        // eval does not work to global scope on greasemonkey
        //   even if using the unsafeWindow.
        return Pot.localEval.doEval(code, scope);
      }
      if (scope) {
        if (scope[func].call && scope[func].apply) {
          return scope[func].call(scope, code);
        }
        if (me.worksForGlobal == null) {
          me.worksForGlobal = false;
          do {
            id = buildSerial(Pot, '');
          } while (id in scope);
          scope[func]('var ' + id + '=1;');
          if (id in scope && scope[id] === 1) {
            me.worksForGlobal = true;
          }
          delete scope[id];
        }
        if (me.worksForGlobal) {
          return scope[func](code);
        }
      }
      if (Pot.System.isWebBrowser &&
          typeof document === 'object' && document.body) {
        doc = document;
        script = doc.createElement('script');
        script.type = 'text/javascript';
        script.defer = false;
        script.appendChild(doc.createTextNode(code));
        doc.body.appendChild(script);
        doc.body.removeChild(script);
      } else {
        return Pot.localEval(code, scope);
      }
    }
  }, {
    /**
     * @private
     * @ignore
     * @const
     */
    language : 'JavaScript',
    /**
     * @private
     * @ignore
     */
    patterns : {
      valid  : /\S/
    },
    /**
     * @ignore
     */
    test : function(func, obj) {
      var result = false, nop = '(void 0);';
      try {
        if (obj) {
          obj[func](nop);
        } else {
          func(nop);
        }
        result = true;
      } catch (e) {
        result = false;
      }
      return result;
    }
  }),
  /**
   * Evaluates a script in a anonymous context.
   *
   *
   * @example
   *   localEval('function hoge() { return "hoge"; }');
   *   debug(hoge());
   *   // @results (Error: hoge is undefined)
   *
   *
   * @param  {String}     code    The code to evaluate.
   * @param  {Object|*}  (scope)  (Optional) The evaluation scope.
   * @return {*}                  The value of evaluated result.
   * @type  Function
   * @function
   * @static
   * @public
   */
  localEval : update(function(code, scope) {
    var that = Pot.globalEval, me = arguments.callee, src, func, context;
    if (code && that.patterns.valid.test(code)) {
      func = 'eval';
      if (func in globals && that.test(func, globals)) {
        context = globals;
      } else if (func in Pot.Global && that.test(func, Pot.Global)) {
        context = Pot.Global;
      }
      if (context && context[func] &&
          context[func].call && context[func].apply) {
        return me.doEval(code, context, scope);
      } else {
        if (me.isLiteral.test(code) && !Pot.hasReturn(code)) {
          src = 'return(' + String(code).replace(me.clean, '') + ');';
        } else {
          src = code;
        }
        return (new Function(
          'return(function(){' + src + '}).call(this);'
        )).call(scope);
      }
    }
  }, {
    /**
     * @private
     * @ignore
     * @const
     */
    isLiteral :
      /^\s*(?!(?:return|var|if|do|for|try|while)\b\s*)[\w$.!"'~(){}[\]]/,
    /**
     * @ignore
     */
    clean : /^(?:[{[(']{0}[')\]}]+|)[;\s\u00A0]*|[;\s\u00A0]*$/g,
    /**
     * @ignore
     */
    doEval : function() {
      return arguments[1]['eval'].call(
        arguments[2] || arguments[1],
        arguments[0]
      );
    }
  }),
  /**
   * Check whether the function has "return" statement.
   *
   *
   * @example
   *   var func = function() {
   *     return 'hoge';
   *   };
   *   debug(hasReturn(func));
   *   // @results  true
   *
   *
   * @example
   *   var func = function() {
   *     var hoge = 1;
   *   };
   *   debug(hasReturn(func));
   *   // @results  false
   *
   *
   * @example
   *   var func = function return_test(return1, return$2) {
   *     // dummy comment: return 'hoge';
   *     var $return = 'return(1)' ? (function(a) {
   *       if (a) {
   *         return true;
   *       }
   *       return false;
   *     })(/return true/) : "return false";
   *   };
   *   debug(hasReturn(func));
   *   // @results  false
   *
   *
   * @example
   *   var func = function() {
   *     if (1) {
   *       return (function() {
   *         return 'hoge';
   *       })();
   *     }
   *   };
   *   debug(hasReturn(func));
   *   // @results  true
   *
   *
   * @example
   *   // Using E4X Syntax for test.
   *   var func = function() {
   *     // return 'hoge';
   *     var e1 = <>return</>;
   *     var e2 = <><![CDATA[
   *       return 1;
   *     ]]></>;
   *     var e3 = <> <div data={(function() {
   *       return 'hoge';
   *     })()}>
   *       return 1;
   *     </div></>;
   *     var e4 = <><!--</>-->return 1;</>;
   *     var re = /<><!--[\/]--><\/>/gim;
   *     var e5 = <root><hoge fuga={(function() {
   *       return 1;
   *     })()} piyo="<root>">
   *     <root>return</root>return;<!--</root>"<root>"-->return;
   *     <!--return-->
   *     </hoge></root>;
   *     var root = "</root>";
   *     var r = 'return(1)' ? (function(a) {
   *       if (a) {
   *         return true;
   *       }
   *       return false;
   *     })(/return true/) : "return false";
   *   };
   *   debug(hasReturn(func));
   *   // @results  false
   *
   *
   * @param  {Function|String}   func   The code or function to check.
   * @return {Boolean}                  Whether the function has
   *                                      "return" statement.
   * @type  Function
   * @function
   * @static
   * @public
   */
  hasReturn : (function() {
    var PATTERNS = {
      STRIP    : new RegExp(
              '^\\s*function\\b[^{]*[{]' +
        '|' + '[}][^}]*$' +
        '|' + '/[*][\\s\\S]*?[*]/' +
        '|' + '/{2,}[^\\r\\n]*(?:\\r\\n|\\r|\\n|)' +
        '|' + '"(?:\\\\.|[^"\\\\])*"' +
        '|' + "'(?:\\\\.|[^'\\\\])*'",
        'g'
      ),
      RETURN   : /(?:^|\s|[^\w$.]\b)return(?:[^\w$.]\b|\s|$)/,
      FUNC     : /(?:^|\s|[^\w$.]\b)function(?:[^\w$.]\b|\s|)[^{}]*$/,
      PREREGEX : /(?:^|[,;:!?=&|!([]|[^\w$.<>%'"@){}\]])\s*\/$/,
      REGEXP   : /(\/(?![*])(?:\\.|[^\/\r\n\\])+\/)$/,
      E4X      : /(?:^|[(){}<>&|%*~^!?:;,\/[\]=+-])\s*<([^\s>]*)[^>]*>$/,
      TAG      : /<([^\s>]*)[^>]*>$/
    },
    limit = 0x2000,
    count = 0,
    cache = {};
    return function(func) {
      var result = false, code, open, close, org,
          s, i, len, c, s, n, x, z, r, m, cdata, tag, skip;
      code = stringify(func && func.toString && func.toString() || func);
      if (code in cache) {
        return cache[code];
      }
      org = code;
      code = code.replace(PATTERNS.STRIP, '');
      if (code && PATTERNS.RETURN.test(code)) {
        n = 0;
        x = 0;
        r = '';
        z = '';
        s = '';
        tag = '';
        skip = false;
        cdata = false;
        len = code.length;
        for (i = 0; i < len; i++) {
          c = code.charAt(i);
          if (r && c !== '/') {
            r += c;
            continue;
          }
          switch (c) {
            case '{':
                if (x === 0 && PATTERNS.FUNC.test(s)) {
                  n++;
                }
                break;
            case '}':
                if (x === 0 && n > 0) {
                  n--;
                }
                break;
            case '/':
                if (!skip && n === 0) {
                  if (x > 0) {
                    z += c;
                  } else if (!r) {
                    s += c;
                    if (PATTERNS.PREREGEX.test(s)) {
                      r = c;
                      s = s.slice(0, -1) + ' ';
                    }
                  } else if (r) {
                    r += c;
                    if (PATTERNS.REGEXP.test(r)) {
                      r = '';
                    }
                  }
                }
                break;
            case '-':
                if (n === 0) {
                  if (x > 0) {
                    z += c;
                    if (z.slice(-4) === '<!--') {
                      skip = true;
                      z = z.slice(0, -4) + ' ';
                    }
                  } else {
                    s += c;
                  }
                }
                break;
            case '[':
                if ((cdata || !skip) && n === 0) {
                  if (x > 0) {
                    z += c;
                    if (z.slice(-9).toUpperCase() === '<![CDATA[') {
                      skip = true;
                      cdata = true;
                      z = z.slice(0, -9) + ' ';
                    }
                  } else {
                    s += c;
                  }
                }
                break;
            case ']':
                if ((cdata || !skip) && n === 0) {
                  if (x > 0) {
                    z += c;
                  } else {
                    s += c;
                  }
                }
                break;
            case '<':
                if ((cdata || !skip) && n === 0) {
                  if (x > 0) {
                    z += c;
                  } else {
                    s += c;
                  }
                }
                break;
            case '>':
                if (n === 0) {
                  if (x === 0) {
                    s += c;
                    if (PATTERNS.E4X.test(s)) {
                      m = s.match(PATTERNS.TAG);
                      x++;
                      s = s.slice(0, -m[0].length) + ' ';
                      tag = m[1];
                      close = new RegExp('</' + rescape(tag) + '>$');
                      open  = new RegExp('<' + rescape(tag) + '\\b[^>]*>$');
                    }
                  } else if (x > 0) {
                    if (skip) {
                      if ((!cdata && z.slice(-2) === '--') ||
                           (cdata && z.slice(-2) === ']]')) {
                        skip = cdata = false;
                        z = z.slice(0, -2);
                      }
                      z += ' ';
                      break;
                    }
                    z += c;
                    if (close && close.test(z)) {
                      x--;
                      if (x === 0) {
                        tag = z = '';
                      }
                    } else if (open && open.test(z)) {
                      x++;
                    }
                  }
                }
                break;
            default:
                if (!skip && n === 0) {
                  if (x > 0) {
                    z += c;
                  } else {
                    s += c;
                  }
                }
                break;
          }
        }
        if (PATTERNS.RETURN.test(s)) {
          result = true;
        }
      }
      if (count < limit) {
        cache[org] = result;
        count++;
      }
      return result;
    };
  })()
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Shortcut functions.

/**
 * @ignore
 */
function update() {
  var args = arguments, len = args.length, i = 1, o, p, x;
  if (len === i) {
    o = this || {};
    i--;
  } else {
    o = args[i - 1];
  }
  if (o) {
    do {
      x = args[i];
      if (x) {
        for (p in x) {
          try {
            o[p] = x[p];
          } catch (e) {}
        }
      }
    } while (++i < len);
  }
  return o;
}

/**
 * @ignore
 */
function arrayize(object, index) {
  var array, i, len, me = arguments.callee, t;
  if (me.canNodeList == null) {
    // NodeList cannot convert to the Array in the Blackberry, IE browsers.
    if (Pot.System.currentDocument) {
      try {
        t = slice.call(
          Pot.System.currentDocument.documentElement.childNodes
        )[0].nodeType;
        t = null;
        me.canNodeList = true;
      } catch (e) {
        me.canNodeList = false;
      }
    }
  }
  if (object == null) {
    array = [object];
  } else {
    switch (Pot.typeOf(object)) {
      case 'array':
          array = object.slice();
          break;
      case 'object':
          if (Pot.isArrayLike(object)) {
            if (!me.canNodeList && Pot.isNodeList(object)) {
              array = [];
              i = 0;
              len = object.length;
              do {
                array[i] = object[i];
              } while (++i < len);
            } else {
              array = slice.call(object);
            }
            break;
          }
          // FALL THROUGH
      default:
          array = slice.call(concat.call([], object));
          break;
    }
  }
  if (index > 0) {
    array = array.slice(index);
  }
  return array;
}

/**
 * @ignore
 */
function now() {
  return (new Date()).getTime();
}

/**
 * @ignore
 */
function stringify(x, ignoreBoolean) {
  var result = '', c, len = arguments.length;
  if (x !== null) {
    switch (typeof x) {
      case 'string':
      case 'number':
      case 'xml':
          result = x;
          break;
      case 'boolean':
          if (len >= 2 && !ignoreBoolean) {
            result = x;
          } else if (!ignoreBoolean) {
            result = x ? 1 : '';
          }
          break;
      case 'object':
          if (x) {
            // Fixed object valueOf. e.g. new String('hoge');
            c = x.constructor;
            if (c === String || c === Number ||
                (typeof XML !== 'undefined' && c === XML) ||
                (typeof Buffer !== 'undefined' && c === Buffer)) {
              result = x;
            } else if (c === Boolean) {
              if (len >= 2 && !ignoreBoolean) {
                result = x;
              } else if (!ignoreBoolean) {
                result = (x == true) ? 1 : '';
              }
            }
          }
          break;
      default:
          break;
    }
  }
  return result.toString();
}

/**
 * @ignore
 */
function trim(s, chars, ignoreCase) {
  var re;
  if (chars) {
    re = new RegExp(
      ['^[', ']+|[', ']+$'].join(rescape(chars)),
      'g' + (ignoreCase ? 'i' : '')
    );
  } else {
    re = RE_TRIM;
  }
  return stringify(s, true).replace(re, '');
}

/**
 * @ignore
 */
function rescape(s) {
  return stringify(s, true).replace(RE_RESCAPE, '\\$1');
}

/**
 * @ignore
 */
function invoke(/*object[, method[, ...args]]*/) {
  var args = arrayize(arguments), argn = args.length;
  var object, method, params, emit, p, t, i, len, err;
  try {
    switch (argn) {
      case 0:
          throw false;
      case 1:
          method = args[0];
          break;
      case 2:
          object = args[0];
          method = args[1];
          break;
      case 3:
          object = args[0];
          method = args[1];
          params = arrayize(args[2]);
          break;
      default:
          object = args[0];
          method = args[1];
          params = arrayize(args, 2);
          break;
    }
    if (!method) {
      throw method;
    }
    if (!object && Pot.isString(method)) {
      object = (object && object[method] && object)  ||
             (globals && globals[method] && globals) ||
          (Pot.Global && Pot.Global[method] && Pot.Global);
    }
    if (Pot.isString(method)) {
      emit = true;
      if (!object) {
        object = (globals || Pot.Global);
      }
    }
  } catch (e) {
    err = e;
    throw Pot.isError(err) ? err : new Error(err);
  }
  if (Pot.isFunction(method.apply) && Pot.isFunction(method.call)) {
    if (params == null || !params.length) {
      return method.call(object);
    } else {
      return method.apply(object, params);
    }
  } else {
    p = params || [];
    len = p.length || 0;
    if (emit) {
      // faster way.
      switch (len) {
        case 0: return object[method]();
        case 1: return object[method](p[0]);
        case 2: return object[method](p[0], p[1]);
        case 3: return object[method](p[0], p[1], p[2]);
        default: break;
      }
    } else {
      switch (len) {
        case 0: return method();
        case 1: return method(p[0]);
        case 2: return method(p[0], p[1]);
        case 3: return method(p[0], p[1], p[2]);
        default: break;
      }
    }
    t = [];
    for (i = 0; i < len; i++) {
      t[t.length] = 'p[' + i + ']';
    }
    return (new Function(
      'e,o,m,p',
      ['return e?o[m](', '):m(', ');'].join(t.join(','))
    ))(emit, object, method, p);
  }
}

/**
 * @ignore
 */
function debug(msg) {
  var args = arguments, me = args.callee, func, consoleService;
  try {
    if (!me.firebug('log', args)) {
      if (!Pot.System.hasComponents) {
        throw false;
      }
      consoleService = Cc['@mozilla.org/consoleservice;1']
                      .getService(Ci.nsIConsoleService);
      consoleService.logStringMessage(String(msg));
    }
  } catch (e) {
    if (typeof GM_log !== 'undefined') {
      /**@ignore*/
      func = GM_log;
    } else if (typeof console !== 'undefined') {
      /**@ignore*/
      func = console.debug || console.dir || console.log;
    } else if (typeof opera !== 'undefined' && opera.postError) {
      /**@ignore*/
      func = opera.postError;
    } else {
      /**@ignore*/
      func = function(x) { throw x; };
    }
    try {
      if (func.apply) {
        func.apply(func, args);
      } else {
        throw func;
      }
    } catch (e) {
      try {
        func(msg);
      } catch (e) {
        try {
          console.log(msg);
        } catch (e) {
          try {
            me.divConsole(msg);
          } catch (e) {}
        }
      }
    }
  }
  return msg;
}

// Update debug function.
update(debug, {
  /**
   * @ignore
   */
  firebug : function(method, args) {
    var result = false, win, fbConsole;
    try {
      if (!Pot.System.hasComponents) {
        throw false;
      }
      win = Pot.XPCOM.getMostRecentWindow();
      if (!win) {
        throw win;
      }
      if (win.FirebugConsole && win.FirebugContext) {
        fbConsole = new win.FirebugConsole(win.FirebugContext, win.content);
        fbConsole[method].apply(fbConsole, args);
        result = true;
      } else if (win.Firebug && win.Firebug.Console) {
        try {
          win.Firebug.Console.logFormatted.call(
            win.Firebug.Console,
            arrayize(args),
            win.FirebugContext,
            method
          );
          result = true;
        } catch (er) {}
      }
    } catch (e) {}
    return result;
  },
  /**
   * @ignore
   */
  dump : function(o) {
    var r, me = arguments.callee, repr;
    /**@ignore*/
    repr = function(x) {
      return (x == null) ? String(x) :
              x.toString ? x.toString() : String(x);
    };
    if (o == null) {
      return String(o);
    }
    if (typeof uneval === 'function') {
      return uneval(o);
    } else if (typeof o.toSource === 'function') {
      return o.toSource();
    }
    r = [];
    switch (Pot.typeLikeOf(o)) {
      case 'array':
          each(o, function(v) {
            r[r.length] = me(v);
          });
          return '[' + r.join(', ') + ']';
      case 'object':
          if (Pot.isNodeLike(o) || Pot.isWindow(o) || Pot.isDocument(o)) {
            r[r.length] = toString.call(o);
          } else {
            each(o, function(v, k) {
              r[r.length] = k + ': ' + me(v);
            });
          }
          return '{' + r.join(', ') + '}';
      case 'string':
          return '"' + repr(o) + '"';
      case 'function':
          return '(' + repr(o) + ')';
      default:
          return repr(o);
    }
  },
  /**
   * @ignore
   */
  divConsole : update(function(msg) {
    var me = arguments.callee, ie6, doc, de, onResize, onScroll, onClick;
    if (Pot.System.hasActiveXObject && typeof document !== 'undefined') {
      doc = document;
      de = doc.documentElement || {};
      try {
        ie6 = (typeof de.style.maxHeight === 'undefined');
      } catch (e) {}
      if (me.done && me.ieConsole) {
        me.append(msg);
      } else {
        if (!me.msgStack) {
          me.msgStack = [];
        }
        me.msgStack.push(msg);
        if (!me.done) {
          me.done = true;
          Pot.Deferred.till(function() {
            return !!(doc && doc.body);
          }).then(function() {
            var defStyle, style, close, wrapper;
            defStyle = {
              border     : '1px solid #999',
              background : '#fff',
              color      : '#333',
              fontSize   : '13px',
              fontFamily : 'monospace',
              position   : 'absolute',
              padding    : '10px',
              margin     : '0px'
            };
            wrapper = doc.createElement('div');
            style = wrapper.style;
            each(defStyle, function(v, k) {
              style[k] = v;
            });
            style.borderWidth  = '3px';
            style.width        = '95%';
            style.zIndex       = 9996;
            style.left         = '0px';
            style.bottom       = '0px';
            if (ie6) {
              style.height = Math.floor(de.clientHeight / 3.2) + 'px';
            } else {
              style.position = 'fixed';
              style.height   = '25%';
            }
            me.ieConsole = wrapper.cloneNode(false);
            me.ieConsole.id = me.ieConsoleId = buildSerial(Pot, '');
            style = me.ieConsole.style;
            style.borderWidth = '1px';
            style.width       = '95%';
            style.height      = '87%';
            style.position    = 'relative';
            style.zIndex      = 9997;
            style.padding     = '5px';
            style.whiteSpace  = 'pre';
            style.wordWrap    = 'break-word';
            style.overflowX   = 'hidden';
            style.overflowY   = 'auto';
            me.hr = doc.createElement('hr');
            style = me.hr.style;
            style.position    = 'static';
            style.width       = '100%';
            style.border      = '1px solid #aaa';
            style.zIndex      = 9998;
            close = doc.createElement('div');
            style = close.style;
            each(defStyle, function(v, k) {
              style[k] = v;
            });
            style.zIndex      = 9999;
            style.fontFamily  = 'sans-serif';
            style.fontWeight  = 'bold';
            style.borderWidth = '1px';
            style.padding     = '1px 4px';
            style.lineHeight  = 1;
            style.right       = '2px';
            style.top         = '2px';
            style.cursor      = 'pointer';
            close.title       = 'close';
            close.innerHTML   = 'x';
            /**@ignore*/
            onResize = function() {
              var width, height, def = '95%';
              width = doc.body.clientWidth - 7;
              wrapper.style.width = (width <= 0) ? def : width + 'px';
              width = wrapper.offsetWidth - 55;
              me.ieConsole.style.width = (width <= 0) ? def : width + 'px';
              height = Math.floor(de.clientHeight / 3.2) + 'px';
              wrapper.style.height = height;
              onScroll();
            };
            /**@ignore*/
            onScroll = function() {
              var pos = de.scrollTop +
                       (de.clientHeight - wrapper.clientHeight) - 7;
              if (pos > 0) {
                wrapper.style.top = pos + 'px';
              }
            };
            /**@ignore*/
            onClick = function() {
              try {
                wrapper.parentNode.removeChild(wrapper);
                window.dettachEvent('onscroll', onScroll);
                window.dettachEvent('onresize', onResize);
                wrapper = me.ieConsole = null;
              } catch (e) {}
            };
            if (typeof window !== 'undefined' &&
                window && window.attachEvent) {
              if (ie6) {
                each({
                  onscroll : onScroll,
                  onresize : onResize
                }, function(f, k) {
                  window.attachEvent(k, f);
                });
              }
              if (close.attachEvent) {
                close.attachEvent('onclick', onClick);
              }
            }
            if (ie6) {
              Pot.Deferred.wait(0.25).then(function() {
                wrapper.style.bottom = '1px';
              }).wait(0.5).then(function() {
                wrapper.style.bottom = '0px';
              });
            }
            wrapper.appendChild(close);
            wrapper.appendChild(me.ieConsole);
            doc.body.appendChild(wrapper);
            me.append();
          });
        }
      }
    }
  }, {
    /**
     * @ignore
     */
    append : function(msg) {
      var me = this, v, s, stack;
      if (me.ieConsole) {
        try {
          stack = arrayize(me.msgStack || []);
          while (me.msgStack && me.msgStack.length) {
            me.msgStack.pop();
          }
          if (arguments.length) {
            stack.push(msg);
          }
          while (stack.length) {
            v = stack.shift();
            s = debug.dump(v);
            if (Pot.isString(v) &&
                s.charAt(0) === '"' && s.slice(-1) === '"') {
              s = s.slice(1, -1);
            }
            each([
              document.createTextNode(s),
              me.hr.cloneNode(false)
            ], function(node) {
              me.ieConsole.appendChild(node);
            });
          }
          Pot.Internal.setTimeout(function() {
            me.ieConsole.scrollTop = me.ieConsole.scrollHeight;
          }, 10);
        } catch (e) {}
      }
    }
  })
});

// Update Pot object.
Pot.update({
  /**
   * @lends Pot
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
   * Evaluate a string can be a scalar value only.
   * Return "1" when argument was passed as true.
   * This function can treat XML object that
   *  will be string by toString method.
   *
   *
   * @example
   *   debug(stringify({}));
   *   // @results ''
   *   debug(stringify([]));
   *   // @results ''
   *   debug(stringify(0));
   *   // @results '0'
   *   debug(stringify(-100.02));
   *   // @results '-100.02'
   *   debug(stringify(new Date()));
   *   // @results ''
   *   debug(stringify(null));
   *   // @results ''
   *   debug(stringify(void 0));
   *   // @results ''
   *   debug(stringify(false));
   *   // @results ''
   *   debug(stringify(true));
   *   // @results '1'
   *   debug(stringify(''));
   *   // @results ''
   *   debug(stringify('hoge'));
   *   // @results 'hoge'
   *   debug(stringify(new String('hoge')));
   *   // @results 'hoge'
   *   debug(stringify(new Boolean(false)));
   *   // @results ''
   *   debug(stringify(new Boolean(true)));
   *   // @results '1'
   *   debug(stringify([100]));
   *   // @results ''
   *
   *
   * @param  {*}        x              Any value.
   * @param  {Boolean} (ignoreBoolean) Optional, Ignores Boolean value.
   * @return {String}                  Value as a string.
   * @type Function
   * @function
   * @public
   * @static
   */
  stringify : stringify,
  /**
   * Trim the white spaces including em (U+3000).
   *
   * White spaces will not removed when specified the second argument.
   *
   * @example
   *   debug( trim(' hoge  ') );
   *   // @results 'hoge'
   *
   *
   * @example
   *   //
   *   // White spaces will not removed when 
   *   //  specified the second argument.
   *   //
   *   debug( trim('abbbcc cc ', 'ab') );
   *   // @results 'cc cc '
   *
   *
   * @param  {String}   s            A target string.
   * @param  {String}  (chars)       (Optional) Removing characters.
   * @param  {Boolean} (ignoreCase)  (Optional) Whether ignore case on RegExp.
   * @return {String}                A result string.
   * @type Function
   * @function
   * @public
   * @static
   */
  trim : trim,
  /**
   * Escape RegExp patterns.
   *
   *
   * @example
   *   var pattern = '*[hoge]*';
   *   var regex = new RegExp('^(' + rescape(pattern) + ')$', 'g');
   *   debug(regex.toString());
   *   // @results /^(\*\[hoge\]\*)$/g
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     The escaped string.
   * @type Function
   * @function
   * @public
   * @static
   */
  rescape : rescape,
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
   * Output to the console using log function for debug.
   *
   *
   * @example
   *   debug('hoge'); // hoge
   *
   *
   * @param  {*}  msg  A log message, or variable
   * @type Function
   * @function
   * @public
   * @static
   */
  debug : debug
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Private functions.

/**
 * Iterate "forEach".
 *
 * @private
 * @ignore
 * @internal
 */
function each(object, callback, context) {
  var i, len, val, err;
  if (object) {
    len = object.length;
    try {
      if (Pot.isArrayLike(object)) {
        for (i = 0; i < len; i++) {
          if (i in object) {
            try {
              val = object[i];
            } catch (e) {
              continue;
            }
            callback.call(context, val, i, object);
          }
        }
      } else {
        for (i in object) {
          try {
            val = object[i];
          } catch (e) {
            continue;
          }
          callback.call(context, val, i, object);
        }
      }
    } catch (ex) {
      err = ex;
      if (!Pot.isStopIter(err)) {
        throw err;
      }
    }
  }
  return object;
}

/**
 * Build the serial number.
 *
 * @private
 * @ignore
 */
function buildSerial(o, sep) {
  return [
    String((o && (o.NAME || o.name)) || (void 0)),
    Math.random().toString(36).substring(2),
    now()
  ].join(arguments.length >= 2 ? sep : '-');
}

/**
 * @private
 * @ignore
 */
function buildObjectString(name) {
  return '[object ' + name + ']';
}

/**
 * Method for Deferred.
 *
 * @private
 * @ignore
 */
function extendDeferredOptions(o, x) {
  var a, b;
  if (o && x) {
    if (Pot.isObject(o.options)) {
      a = o.options;
    } else if (Pot.isObject(o)) {
      a = o;
    }
    if (Pot.isObject(x.options)) {
      b = x.options;
    } else if (Pot.isObject(x)) {
      b = x;
    }
    if ('async' in b) {
      a.async = !!b.async;
    }
    if ('speed' in b && Pot.isNumeric(b.speed)) {
      a.speed = b.speed;
    }
    if ('cancellers' in b) {
      if (!b.cancellers || !b.cancellers.length) {
        b.cancellers = [];
      } else {
        if (a.cancellers && a.cancellers.length) {
          a.cancellers = concat.call([],
            arrayize(a.cancellers), arrayize(b.cancellers));
        } else {
          a.cancellers = arrayize(b.cancellers);
        }
      }
    }
    if ('stoppers' in b) {
      if (!b.stoppers || !b.stoppers.length) {
        b.stoppers = [];
      } else {
        if (a.stoppers && a.stoppers.length) {
          a.stoppers = concat.call([],
            arrayize(a.stoppers), arrayize(b.stoppers));
        } else {
          a.stoppers = arrayize(b.stoppers);
        }
      }
    }
    if ('storage' in b) {
      a.storage = b.storage || {};
    }
    if (!a.storage) {
      a.storage = {};
    }
  }
}

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
  destassign : false,
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
      destassign  : false,
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
      if (this.destassign ||
          (Pot.isNumber(callback.length) && callback.length > 1 &&
           Pot.isArray(result) && result.length === callback.length)) {
        reply = callback.apply(this, result);
      } else {
        reply = callback.call(this, result);
      }
      // We ignore undefined result when "return" statement is not exists.
      if (reply === undefined &&
          !Pot.isError(result) && !Pot.hasReturn(callback)) {
        reply = result;
      }
      result = reply;
      this.destassign = false;
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
      this.destassign = false;
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

})();
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
   *     return args.input + args.result;
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
   *                                    - args.input  :
   *                                        The original input arguments.
   *                                    - args.result :
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
            var params = {}, a = arrayize(arguments);
            params.input = (a.length > 1) ? a : a[0];
            return this.then(function() {
              var ar = arrayize(arguments);
              params.result = (ar.length > 1) ? ar : ar[0];
              return func.apply(this, arrayize(params));
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
   *     return args.input + args.result;
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
            Pot.Deferred.callLazy(defer);
          }
          defer.then(function(value) {
            values[key] = value;
            bounds.pop();
            if (bounds.length === 0) {
              result.begin(values);
            }
          }, function(err) {
            result.raise(err);
          });
        });
      });
      Pot.Deferred.callLazy(d);
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
  chain : function() {
    var args = arguments, len = args.length, chains, chain, re;
    chain = new Pot.Deferred();
    if (len > 0) {
      chains = arrayize(len === 1 ? args[0] : args);
      re = {
        name   : /^\s*[()]*\s*function\s*([^\s()]+)/,
        rescue : /rescue|raise|err|fail/i
      };
      each(chains, function(o) {
        var name;
        if (Pot.isFunction(o)) {
          try {
            name = o.toString().match(re.name)[1];
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
  }
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

})();
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Define iteration methods. (internal)

update(Pot.Internal, {
  /**
   * @lends Pot.Internal
   */
  /**
   * LightIterator.
   *
   * Async/Sync iterator.
   *
   * @class
   * @private
   * @constructor
   * @ignore
   */
  LightIterator : update(function(object, callback, options) {
    return new Pot.Internal.LightIterator.prototype.doit(
      object, callback, options
    );
  }, {
    /**@ignore*/
    speeds : {
      limp   : -1,
      doze   :  0,
      slow   :  2,
      normal :  5,
      fast   : 12,
      rapid  : 36,
      ninja  : 60
    },
    /**@ignore*/
    delays : {
      limp   : 1000,
      doze   :  100,
      slow   :   13,
      normal :    0,
      fast   :    0,
      rapid  :    0,
      ninja  :    0
    },
    /**@ignore*/
    types : {
      forLoop   : 0x01,
      forInLoop : 0x02,
      repeat    : 0x04,
      forEver   : 0x08,
      iterate   : 0x10,
      items     : 0x20,
      zip       : 0x40
    }
  })
});

update(Pot.Internal.LightIterator, {
  /**@ignore*/
  defaults : {
    speed : Pot.Internal.LightIterator.speeds.normal
  },
  /**@ignore*/
  revSpeeds : {}
});

each(Pot.Internal.LightIterator.speeds, function(v, k) {
  Pot.Internal.LightIterator.revSpeeds[v] = k;
});

Pot.Internal.LightIterator.fn = Pot.Internal.LightIterator.prototype =
  update(Pot.Internal.LightIterator.prototype, {
  /**
   * @lends Pot.Internal.LightIterator.prototype
   */
  /**
   * @ignore
   */
  constructor : Pot.Internal.LightIterator,
  /**
   * @private
   * @ignore
   */
  interval : Pot.Internal.LightIterator.defaults.speed,
  /**
   * @private
   * @ignore
   */
  iter : null,
  /**
   * @private
   * @ignore
   */
  result : null,
  /**
   * @private
   * @ignore
   */
  deferred : null,
  /**
   * @private
   * @ignore
   */
  revDeferred : null,
  /**
   * @private
   * @ignore
   */
  isDeferStopIter : false,
  /**
   * @private
   * @ignore
   */
  time : {},
  /**
   * @private
   * @ignore
   */
  waiting : false,
  /**
   * @private
   * @ignore
   */
  restable : false,
  /**
   * @private
   * @ignore
   */
  async : false,
  /**
   * @private
   * @ignore
   */
  options : null,
  /**
   * @private
   * @ignore
   */
  doit : function(object, callback, options) {
    this.setOptions(options);
    this.execute(object, callback);
    this.watch();
    return this;
  },
  /**
   * Set the options.
   *
   * @private
   * @ignore
   */
  setOptions : function(options) {
    this.options = options || {};
    this.setInterval();
    this.setAsync();
  },
  /**
   * Set the interval option.
   *
   * @private
   * @ignore
   */
  setInterval : function() {
    var n = null;
    if (Pot.isNumeric(this.options.interval)) {
      n = this.options.interval - 0;
    } else if (this.options.interval in Pot.Internal.LightIterator.speeds) {
      n = Pot.Internal.LightIterator.speeds[this.options.interval] - 0;
    }
    if (n !== null && !isNaN(n)) {
      this.interval = n;
    }
    if (!Pot.isNumeric(this.interval)) {
      this.interval = Pot.Internal.LightIterator.defaults.speed;
    }
  },
  /**
   * Set the async option.
   *
   * @private
   * @ignore
   */
  setAsync : function() {
    var a = null;
    if (this.options.async !== undefined) {
      a = !!this.options.async;
    }
    if (a !== null) {
      this.async = !!a;
    }
    if (!Pot.isBoolean(this.async)) {
      this.async = !!this.async;
    }
  },
  /**
   * Create a new Deferred.
   *
   * @private
   * @ignore
   */
  createDeferred : function() {
    return new Pot.Deferred({ async : false });
  },
  /**
   * Watch the process.
   *
   * @private
   * @ignore
   */
  watch : function() {
    var that = this;
    if (!this.async && this.waiting === true) {
      if (Pot.System.isWaitable) {
        Pot.XPCOM.throughout(function() {
          return that.waiting !== true;
        });
      } else {
        //XXX: Fix to synchronize loop for perfectly.
        throw new Error('Failed to synchronize loop');
      }
    }
  },
  /**
   * Execute process.
   *
   * @private
   * @ignore
   */
  execute : function(object, callback) {
    var d, that = this;
    this.waiting = true;
    if (!object) {
      this.result = {};
      this.waiting = false;
    } else {
      this.waiting  = true;
      this.restable = true;
      this.time = {
        start : now(),
        total : null,
        loop  : null,
        diff  : null,
        risk  : null,
        axis  : null,
        count : 1,
        rest  : 100,
        limit : 255
      };
      this.setIter(object, callback);
      if (!this.async && !Pot.System.isWaitable) {
        this.revback();
        this.waiting = false;
      } else {
        d = this.createDeferred();
        d.then(function() {
          var d1, d2;
          d1 = that.createDeferred();
          d2 = that.createDeferred();
          d1.then(function() {
            return that.revolve().then(function() {
              d2.begin();
            });
          }).begin();
          return d2;
        }).ensure(function() {
          that.waiting = false;
        });
        if (this.async) {
          this.deferred = d.then(function() {
            if (Pot.isDeferred(that.result) &&
                Pot.isStopIter(Pot.Deferred.lastError(that.result))) {
              that.result = Pot.Deferred.lastResult(that.result);
            }
            return that.result;
          });
        }
        this.flush(d);
      }
    }
  },
  /**
   * @private
   * @ignore
   */
  setIter : function(object, callback) {
    var type, types, context;
    type = this.options.type;
    types = Pot.Internal.LightIterator.types;
    context = this.options.context;
    if ((type & types.iterate) === types.iterate) {
      this.result = null;
      this.iter = this.iterate(object, callback, context);
    } else if ((type & types.forEver) === types.forEver) {
      this.result = {};
      this.iter = this.forEver(object, context);
    } else if ((type & types.repeat) === types.repeat) {
      this.result = {};
      this.iter = this.repeat(object, callback, context);
    } else if ((type & types.items) === types.items) {
      this.result = [];
      this.iter = this.items(object, callback, context);
    } else if ((type & types.zip) === types.zip) {
      this.result = [];
      this.iter = this.zip(object, callback, context);
    } else if (Pot.isArrayLike(object)) {
      this.result = object;
      this.iter = this.forLoop(object, callback, context);
    } else {
      this.result = object;
      this.iter = this.forInLoop(object, callback, context);
    }
  },
  /**
   * @private
   * @ignore
   */
  revback : function() {
    var that = this, result, err, cutback = false, time;
    this.time.loop = now();
    REVOLVE: {
      do {
        try {
          if (this.isDeferStopIter) {
            this.isDeferStopIter = false;
            throw Pot.StopIteration;
          }
          result = this.iter.next();
        } catch (e) {
          err = e;
          if (Pot.isStopIter(err)) {
            break REVOLVE;
          }
          throw err;
        }
        if (this.async && Pot.isDeferred(result)) {
          return result.ensure(function(res) {
            if (res !== undefined) {
              if (Pot.isError(res)) {
                if (Pot.isStopIter(res)) {
                  that.isDeferStopIter = true;
                  if (Pot.isDeferred(that.result) &&
                      Pot.isStopIter(Pot.Deferred.lastError(that.result))) {
                    that.result = Pot.Deferred.lastResult(that.result);
                  }
                } else {
                  Pot.Deferred.lastError(this, res);
                }
              } else {
                Pot.Deferred.lastResult(this, res);
              }
            }
            that.flush(that.revback, true);
          });
        }
        time = now();
        if (Pot.System.isWaitable) {
          if (this.time.total === null) {
            this.time.total = time;
          } else if (time - this.time.total >= this.time.rest) {
            Pot.XPCOM.throughout(0);
            this.time.total = now();
          }
        } else if (!this.async) {
          if (this.restable && this.time.count >= this.time.limit) {
            this.restable = false;
          }
        }
        this.time.risk = time - this.time.start;
        this.time.diff = time - this.time.loop;
        if (this.time.diff >= this.interval) {
          if (this.async &&
              this.interval < Pot.Internal.LightIterator.speeds.normal) {
            cutback = true;
          } else if (this.async || this.restable || Pot.System.isWaitable) {
            if (this.time.diff < this.interval + 8) {
              this.time.axis = 2;
            } else if (this.time.diff < this.interval + 36) {
              this.time.axis = 5;
            } else if (this.time.diff < this.interval + 48) {
              this.time.axis = 7;
            } else {
              this.time.axis = 10;
            }
            if (this.time.axis >= 10 ||
                (Math.random() * 10 < this.time.axis)) {
              cutback = true;
            }
          }
        }
      } while (!cutback);
      if (this.time.count <= this.time.limit) {
        this.time.count++;
      }
      return this.flush(this.revback, true);
    }
    if (Pot.isDeferred(this.revDeferred)) {
      this.revDeferred.begin();
    }
  },
  /**
   * Revolve the process.
   *
   * @private
   * @ignore
   */
  revolve : function() {
    var that = this, d, de;
    d  = this.createDeferred();
    de = this.createDeferred();
    d.then(function() {
      var dd = that.createDeferred();
      that.revDeferred = that.createDeferred();
      dd.then(function() {
        return that.revback();
      }).begin();
      return that.revDeferred;
    }).ensure(function(er) {
      de.begin();
      if (Pot.isError(er)) {
        throw er;
      }
    });
    this.flush(d);
    return de;
  },
  /**
   * Flush the callback.
   *
   * @private
   * @ignore
   */
  flush : function(callback, useSpeed) {
    var that = this, d, lazy = false, speed, speedKey;
    if (this.async || Pot.System.isWaitable) {
      lazy = true;
    }
    if (!lazy && Pot.isFunction(callback)) {
      return callback.call(this);
    } else {
      d = this.createDeferred();
      d.then(function() {
        if (Pot.isDeferred(callback)) {
          callback.begin();
        } else {
          callback.call(that);
        }
      });
      if (lazy) {
        speed = 0;
        if (useSpeed) {
          speedKey = Pot.Internal.LightIterator.revSpeeds[this.interval];
          if (speedKey &&
              Pot.isNumeric(Pot.Internal.LightIterator.delays[speedKey])) {
            speed = Pot.Internal.LightIterator.delays[speedKey];
          }
          if (Math.random() * 10 < Math.max(2, (this.time.axis || 2) / 2.75)) {
            speed += Math.min(
              this.time.rest,
              Math.max(1,
                Math.ceil(
                  (this.time.risk / (this.time.rest + this.time.diff)) +
                   this.time.diff
                )
              )
            );
          }
        }
        Pot.Internal.setTimeout(function() {
          d.begin();
        }, speed);
      } else {
        d.begin();
      }
      return (void 0);
    }
  },
  /**
   * Return noop function.
   *
   * @private
   * @ignore
   */
  noop : function() {
    return {
      /**@ignore*/
      next : function() {
        throw Pot.StopIteration;
      }
    };
  },
  /**
   * forEver.
   *
   * @private
   * @ignore
   */
  forEver : function(callback, context) {
    var i = 0;
    if (!Pot.isFunction(callback)) {
      return this.noop();
    }
    return {
      /**@ignore*/
      next : function() {
        var result = callback.call(context, i);
        try {
          if (!isFinite(++i) || i >= Number.MAX_VALUE) {
            throw 0;
          }
        } catch (ex) {
          i = 0;
        }
        return result;
      }
    };
  },
  /**
   * repeat.
   *
   * @private
   * @ignore
   */
  repeat : function(max, callback, context) {
    var i, loops, n, last;
    if (!Pot.isFunction(callback)) {
      return this.noop();
    }
    if (!max || max == null) {
      n = 0;
    } else if (Pot.isNumeric(max)) {
      n = max - 0;
    } else {
      n = max || {};
      if (Pot.isNumeric(n.start)) {
        n.begin = n.start;
      }
      if (Pot.isNumeric(n.stop)) {
        n.end = n.stop;
      }
    }
    loops = {
      begin : Pot.isNumeric(n.begin) ? n.begin - 0 : 0,
      end   : Pot.isNumeric(n.end)   ? n.end   - 0 : (n || 0) - 0,
      step  : Pot.isNumeric(n.step)  ? n.step  - 0 : 1,
      last  : false,
      prev  : null
    };
    i = loops.step ? loops.begin : loops.end;
    last = loops.end - loops.step;
    return {
      /**@ignore*/
      next : function() {
        var result;
        if (i < loops.end) {
          loops.last = (i >= last);
          result = callback.call(context, i, loops.last, loops);
          loops.prev = result;
        } else {
          throw Pot.StopIteration;
        }
        i += loops.step;
        return result;
      }
    };
  },
  /**
   * forLoop.
   *
   * @private
   * @ignore
   */
  forLoop : function(object, callback, context) {
    var copy, i = 0;
    if (!object || !object.length || !Pot.isFunction(callback)) {
      return this.noop();
    }
    copy = arrayize(object);
    return {
      /**@ignore*/
      next : function() {
        var val, result;
        while (true) {
          if (i >= copy.length) {
            throw Pot.StopIteration;
          }
          if (!(i in copy)) {
            i++;
            continue;
          }
          try {
            val = copy[i];
          } catch (e) {
            i++;
            continue;
          }
          result = callback.call(context, val, i, object);
          i++;
          return result;
        }
      }
    };
  },
  /**
   * forInLoop.
   *
   * @private
   * @ignore
   */
  forInLoop : function(object, callback, context) {
    var copy, i = 0, p, v;
    //XXX: Should use "yield" for duplicate loops.
    if (Pot.isFunction(callback)) {
      copy = [];
      for (p in object) {
        try {
          v = object[p];
        } catch (e) {
          continue;
        }
        copy[copy.length] = [v, p];
      }
    }
    if (!copy || !copy.length) {
      return this.noop();
    }
    return {
      /**@ignore*/
      next : function() {
        var result, c, key, val;
        while (true) {
          if (i >= copy.length) {
            throw Pot.StopIteration;
          }
          if (!(i in copy)) {
            i++;
            continue;
          }
          try {
            c = copy[i];
            val = c[0];
            key = c[1];
          } catch (e) {
            i++;
            continue;
          }
          result = callback.call(context, val, key, object);
          i++;
          return result;
        }
      }
    };
  },
  /**
   * iterate.
   *
   * @private
   * @ignore
   */
  iterate : function(object, callback, context) {
    var that = this, iterable;
    if (Pot.isIterable(object) && !Pot.isIter(object)) {
      // using "yield" generator.
      if (Pot.isFunction(callback)) {
        return {
          /**@ignore*/
          next : function() {
            var res = object.next();
            that.result = callback.apply(context, arrayize(res));
            return that.result;
          }
        };
      } else {
        return {
          /**@ignore*/
          next : function() {
            that.result = object.next();
            return that.result;
          }
        };
      }
    } else {
      iterable = Pot.Iter.toIter(object);
      if (!Pot.isIter(iterable)) {
        return this.noop();
      }
      if (Pot.isFunction(callback)) {
        return {
          /**@ignore*/
          next : function() {
            var results = iterable.next();
            results = arrayize(results);
            while (results.length < 2) {
              results.push((void 0));
            }
            results.push(object);
            that.result = callback.apply(context, results);
            return that.result;
          }
        };
      } else {
        return {
          /**@ignore*/
          next : function() {
            that.result = iterable.next();
            return that.result;
          }
        };
      }
    }
  },
  /**
   * items format loop.
   *
   * @private
   * @ignore
   */
  items : function(object, callback, context) {
    var that = this, copy, i = 0, value, prop, isPair;
    if (Pot.isObject(object)) {
      copy = [];
      for (prop in object) {
        if (hasOwnProperty.call(object, prop)) {
          try {
            value = object[prop];
          } catch (e) {
            continue;
          }
          copy[copy.length] = [prop, value];
        }
      }
      isPair = true;
    } else if (Pot.isArrayLike(object)) {
      copy = arrayize(object);
    }
    if (!copy || !copy.length) {
      return this.noop();
    }
    if (Pot.isFunction(callback)) {
      return {
        /**@ignore*/
        next : function() {
          var result, c, key, val;
          while (true) {
            if (i >= copy.length) {
              throw Pot.StopIteration;
            }
            if (!(i in copy)) {
              i++;
              continue;
            }
            try {
              c = copy[i];
              if (isPair) {
                key = c[0];
                val = c[1];
              } else {
                key = i;
                val = c;
              }
            } catch (e) {
              i++;
              continue;
            }
            result = callback.call(context, [key, val], object);
            i++;
            that.result[that.result.length] = result;
            return result;
          }
        }
      };
    } else {
      return {
        /**@ignore*/
        next : function() {
          var r, t, k, v;
          while (true) {
            if (i >= copy.length) {
              throw Pot.StopIteration;
            }
            if (!(i in copy)) {
              i++;
              continue;
            }
            try {
              t = copy[i];
              if (isPair) {
                k = t[0];
                v = t[1];
              } else {
                k = i;
                v = t;
              }
            } catch (e) {
              i++;
              continue;
            }
            i++;
            r = [k, v];
            that.result[that.result.length] = r;
            return r;
          }
        }
      };
    }
  },
  /**
   * zip iteration.
   *
   * @private
   * @ignore
   */
  zip : function(object, callback, context) {
    var that = this, copy, i = 0, max;
    if (Pot.isArrayLike(object)) {
      copy = arrayize(object);
      max = copy.length;
    }
    if (!max || !copy || !copy.length) {
      return this.noop();
    }
    if (Pot.isFunction(callback)) {
      return {
        /**@ignore*/
        next : function() {
          var result, zips = [], j, item;
          for (j = 0; j < max; j++) {
            item = arrayize(copy[j]);
            if (!item || !item.length || i >= item.length) {
              throw Pot.StopIteration;
            }
            zips[zips.length] = item[i];
          }
          result = callback.call(context, zips, object);
          that.result[that.result.length] = result;
          i++;
          return result;
        }
      };
    } else {
      return {
        /**@ignore*/
        next : function() {
          var z = [], k, t;
          for (k = 0; k < max; k++) {
            t = arrayize(copy[k]);
            if (!t || !t.length || i >= t.length) {
              throw Pot.StopIteration;
            }
            z[z.length] = t[i];
          }
          that.result[that.result.length] = z;
          i++;
          return z;
        }
      };
    }
  }
});

Pot.Internal.LightIterator.prototype.doit.prototype =
  Pot.Internal.LightIterator.prototype;

// Update internal synchronous iteration.
update(Pot.Internal.LightIterator, {
  /**
   * @lends Pot.Internal.LightIterator
   */
  /**
   * Quick iteration for synchronous.
   *
   * @type Object
   * @class
   * @private
   * @ignore
   */
  QuickIteration : {
    /**
     * @lends Pot.Internal.LightIterator.QuickIteration
     */
    /**
     * @private
     * @ignore
     */
    resolve : function(iter) {
      var err;
      try {
        while (true) {
          iter.next();
        }
      } catch (e) {
        err = e;
        if (!Pot.isStopIter(err)) {
          throw err;
        }
      }
    },
    /**
     * @private
     * @ignore
     */
    forEach : function(object, callback, context) {
      var result, that, iter;
      that = Pot.Internal.LightIterator.fn;
      if (!object) {
        result = {};
      } else {
        result = object;
        if (Pot.isArrayLike(object)) {
          iter = that.forLoop(object, callback, context);
        } else {
          iter = that.forInLoop(object, callback, context);
        }
        Pot.Internal.LightIterator.QuickIteration.resolve(iter);
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    repeat : function(max, callback, context) {
      var result, that, iter;
      that = Pot.Internal.LightIterator.fn;
      result = {};
      if (max) {
        iter = that.repeat(max, callback, context);
        Pot.Internal.LightIterator.QuickIteration.resolve(iter);
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    forEver : function(callback, context) {
      var result, that, iter;
      that = Pot.Internal.LightIterator.fn;
      result = {};
      if (callback) {
        iter = that.forEver(callback, context);
        Pot.Internal.LightIterator.QuickIteration.resolve(iter);
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    iterate : function(object, callback, context) {
      var result, that, iter, o;
      that = Pot.Internal.LightIterator.fn;
      if (!object) {
        result = {};
      } else {
        result = null;
        o = {
          noop   : that.noop,
          result : null
        };
        iter = that.iterate.call(o, object, callback, context);
        Pot.Internal.LightIterator.QuickIteration.resolve(iter);
        result = o.result;
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    items : function(object, callback, context) {
      var result = [], that, iter, o;
      that = Pot.Internal.LightIterator.fn;
      if (object) {
        o = {
          noop   : that.noop,
          result : []
        };
        iter = that.items.call(o, object, callback, context);
        Pot.Internal.LightIterator.QuickIteration.resolve(iter);
        result = o.result;
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    zip : function(object, callback, context) {
      var result = [], that, iter, o;
      that = Pot.Internal.LightIterator.fn;
      if (object) {
        o = {
          noop   : that.noop,
          result : []
        };
        iter = that.zip.call(o, object, callback, context);
        Pot.Internal.LightIterator.QuickIteration.resolve(iter);
        result = o.result;
      }
      return result;
    }
  }
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Define the main iterators.

// Temporary creation function.
update(Pot.tmp, {
  /**
   * @lends Pot.tmp
   */
  /**
   * @private
   * @ignore
   */
  createLightIterateConstructor : function(creator) {
    var methods, construct, name;
    /**@ignore*/
    var create = function(speed) {
      var interval;
      if (Pot.Internal.LightIterator.speeds[speed] === undefined) {
        interval = Pot.Internal.LightIterator.defaults.speed;
      } else {
        interval = Pot.Internal.LightIterator.speeds[speed];
      }
      return creator(interval);
    };
    construct = create();
    methods = {};
    for (name in Pot.Internal.LightIterator.speeds) {
      methods[name] = create(name);
    }
    return update(construct, methods);
  }
});

// Define the iterator functions to evaluate as synchronized.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Iterates as "for each" loop.
   *
   *
   * @desc
   * <pre>
   * Unlike Deferred, speed options affect to cutback count in loop.
   * Options append to after the forEach and execute it.
   *
   *  e.g.   Pot.forEach.slow(obj, function() {...})
   *
   * The available methods are below.
   * ------------------------------------
   *   method name   |  speed
   * ------------------------------------
   *      limp       :  slowest
   *      doze       :  slower
   *      slow       :  slow
   *      normal     :  normal (default)
   *      fast       :  fast
   *      rapid      :  faster
   *      ninja      :  fastest
   * ------------------------------------
   * </pre>
   *
   *
   * @example
   *   var a = 0;
   *   Pot.forEach([1, 2, 3], function(value) {
   *     a += value;
   *   });
   *   debug(a);
   *   // @results 6
   *
   *
   * @example
   *   var a = '';
   *   Pot.forEach({a:'foo', b:'bar'}, function(value, key) {
   *     a += key + '=' + value + ',';
   *   });
   *   debug(a);
   *   // @results 'a=foo,b=bar,'
   *
   *
   * @param  {Array|Object}  object    A target object.
   * @param  {Function}      callback  An iterable function.
   *                                     function(value, key, object)
   *                                       this == `context`.
   *                                   Throw Pot.StopIteration
   *                                     if you want to stop the loop.
   * @param  {*}            (context)  Optionally, context object. (i.e. this)
   * @result {Object}                  Return the object.
   * @class
   * @function
   * @static
   * @name Pot.forEach
   * @property {Function} limp   Iterates "for each" loop with slowest speed.
   * @property {Function} doze   Iterates "for each" loop with slower speed.
   * @property {Function} slow   Iterates "for each" loop with slow speed.
   * @property {Function} normal Iterates "for each" loop with default speed.
   * @property {Function} fast   Iterates "for each" loop with fast speed.
   * @property {Function} rapid  Iterates "for each" loop with faster speed.
   * @property {Function} ninja  Iterates "for each" loop with fastest speed.
   */
  forEach : Pot.tmp.createLightIterateConstructor(function(interval) {
    if (Pot.System.isWaitable &&
        interval < Pot.Internal.LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = Pot.Internal.LightIterator.types.forLoop |
                    Pot.Internal.LightIterator.types.forInLoop;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new Pot.Internal.LightIterator(object, callback, opts)).result;
      };
    } else {
      return function(object, callback, context) {
        return Pot.Internal.LightIterator.QuickIteration.forEach(
          object, callback, context
        );
      };
    }
  }),
  /**
   * "repeat" loop iterates a specified number.
   *
   * The second argument of the callback function is
   *   passed the value to true only for the end of the loop.
   *
   * The first argument can pass as object
   *   that gives names "begin, end, step" any keys.
   *
   *
   * @example
   *   var a = [];
   *   Pot.repeat(10, function(i) {
   *     a.push(i);
   *   });
   *   debug(a);
   *   // @results [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *
   *
   * @example
   *   //
   *   // The second argument of the callback function is
   *   //  passed the value to true only for the end of the loop.
   *   //
   *   var s = '', a = 'abcdef'.split('');
   *   Pot.repeat(a.length, function(i, last) {
   *     s += a[i] + '=' + i + (last ? ';' : ',');
   *   });
   *   debug(s);
   *   // @results 'a=0,b=1,c=2,d=3,e=4,f=5;'
   *
   *
   * @example
   *   //
   *   // The first argument can pass as object
   *   //  that gives names "begin, end, step" any keys.
   *   //
   *   var a = [];
   *   Pot.repeat({begin: 0, end: 100, step: 10}, function(i) {
   *     a.push(i);
   *   });
   *   debug(a);
   *   // @results [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
   *
   *
   * @param  {Number|Object}  max       The maximum number of times to loop,
   *                                      or object.
   * @param  {Function}       callback  An iterable function.
   *                                    Throw Pot.StopIteration
   *                                      if you want to stop the loop.
   * @param  {*}             (context)  Optionally, context object. (i.e. this)
   * @class
   * @function
   * @static
   * @name Pot.repeat
   * @property {Function} limp   Iterates "repeat" loop with slowest speed.
   * @property {Function} doze   Iterates "repeat" loop with slower speed.
   * @property {Function} slow   Iterates "repeat" loop with slow speed.
   * @property {Function} normal Iterates "repeat" loop with default speed.
   * @property {Function} fast   Iterates "repeat" loop with fast speed.
   * @property {Function} rapid  Iterates "repeat" loop with faster speed.
   * @property {Function} ninja  Iterates "repeat" loop with fastest speed.
   */
  repeat : Pot.tmp.createLightIterateConstructor(function(interval) {
    if (Pot.System.isWaitable &&
        interval < Pot.Internal.LightIterator.speeds.normal) {
      return function(max, callback, context) {
        var opts = {};
        opts.type = Pot.Internal.LightIterator.types.repeat;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new Pot.Internal.LightIterator(max, callback, opts)).result;
      };
    } else {
      return function(max, callback, context) {
        return Pot.Internal.LightIterator.QuickIteration.repeat(
          max, callback, context
        );
      };
    }
  }),
  /**
   * Iterates indefinitely until "Pot.StopIteration" is thrown.
   *
   *
   * @example
   *   var s = '', a = 'abc*';
   *   Pot.forEver(function(i) {
   *     s += i + ':' + a;
   *     if (s.length > 50) {
   *       throw Pot.StopIteration;
   *     }
   *   });
   *   debug(s);
   *   // @results
   *   // '0:abc*1:abc*2:abc*3:abc*4:abc*5:abc*6:abc*7:abc*8:abc*'
   *
   *
   * @param  {Function}  callback   An iterable function.
   *                                Throw Pot.StopIteration
   *                                  if you want to stop the loop.
   * @param  {*}         (context)  Optionally, context object. (i.e. this)
   * @class
   * @function
   * @static
   * @name Pot.forEver
   * @property {Function} limp   Iterates "forEver" loop with slowest speed.
   * @property {Function} doze   Iterates "forEver" loop with slower speed.
   * @property {Function} slow   Iterates "forEver" loop with slow speed.
   * @property {Function} normal Iterates "forEver" loop with default speed.
   * @property {Function} fast   Iterates "forEver" loop with fast speed.
   * @property {Function} rapid  Iterates "forEver" loop with faster speed.
   * @property {Function} ninja  Iterates "forEver" loop with fastest speed.
   */
  forEver : Pot.tmp.createLightIterateConstructor(function(interval) {
    if (Pot.System.isWaitable &&
        interval < Pot.Internal.LightIterator.speeds.normal) {
      return function(callback, context) {
        var opts = {};
        opts.type = Pot.Internal.LightIterator.types.forEver;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new Pot.Internal.LightIterator(callback, null, opts)).result;
      };
    } else {
      return function(callback, context) {
        return Pot.Internal.LightIterator.QuickIteration.forEver(
          callback, context
        );
      };
    }
  }),
  /**
   * Iterate an iterable object. (using Pot.Iter)
   *
   * @param  {*}         object     An iterable object.
   * @param  {Function}  callback   An iterable function.
   *                                  function(value, key, object)
   *                                    this == `context`.
   *                                Throw Pot.StopIteration
   *                                  if you want to stop the loop.
   * @param  {Object}    (context)  Optionally, context object. (i.e. this)
   * @return {*}                    Result of iteration.
   * @class
   * @function
   * @static
   * @name Pot.iterate
   * @property {Function} limp   Iterates "iterate" loop with slowest speed.
   * @property {Function} doze   Iterates "iterate" loop with slower speed.
   * @property {Function} slow   Iterates "iterate" loop with slow speed.
   * @property {Function} normal Iterates "iterate" loop with default speed.
   * @property {Function} fast   Iterates "iterate" loop with fast speed.
   * @property {Function} rapid  Iterates "iterate" loop with faster speed.
   * @property {Function} ninja  Iterates "iterate" loop with fastest speed.
   */
  iterate : Pot.tmp.createLightIterateConstructor(function(interval) {
    if (Pot.System.isWaitable &&
        interval < Pot.Internal.LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = Pot.Internal.LightIterator.types.iterate;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new Pot.Internal.LightIterator(object, callback, opts)).result;
      };
    } else {
      return function(object, callback, context) {
        return Pot.Internal.LightIterator.QuickIteration.iterate(
          object, callback, context
        );
      };
    }
  }),
  /**
   * Collect the object key and value and make array as items format.
   *
   *
   * @example
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   debug(items(obj));
   *   // @results [['foo', 1], ['bar', 2], ['baz', 3]]
   *
   *
   * @example
   *   var array = ['foo', 'bar', 'baz'];
   *   debug(items(array));
   *   // @results [[0, 'foo'], [1, 'bar'], [2, 'baz']]
   *
   *
   * @example
   *   // Example for using callback.
   *   var arr = ['foo', 'bar', 'baz'];
   *   var func = function(item) {
   *     return '(' + item[0] + ')' + item[1];
   *   };
   *   debug(items(arr, func));
   *   // @results ['(0)foo', '(1)bar', '(2)baz']
   *
   *
   * @example
   *   // Example for using callback.
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   var func = function(item) {
   *     return [item[0] + '::' + item[1]];
   *   };
   *   debug(items(obj, func));
   *   // @results [['foo::1'], ['bar::2'], ['baz::3']]
   *
   *
   * @param  {Object|Array}  object     The target object or an array.
   * @param  {Function}     (callback)  (Optional) Callback function.
   *                                      function({Array} item[, object])
   *                                        this == `context`.
   * @param  {*}            (context)   (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {Array}                    The collected items as an array.
   *
   * @class
   * @function
   * @static
   * @name Pot.items
   *
   * @property {Function} limp   Iterates "items" loop with slowest speed.
   * @property {Function} doze   Iterates "items" loop with slower speed.
   * @property {Function} slow   Iterates "items" loop with slow speed.
   * @property {Function} normal Iterates "items" loop with default speed.
   * @property {Function} fast   Iterates "items" loop with fast speed.
   * @property {Function} rapid  Iterates "items" loop with faster speed.
   * @property {Function} ninja  Iterates "items" loop with fastest speed.
   */
  items : Pot.tmp.createLightIterateConstructor(function(interval) {
    if (Pot.System.isWaitable &&
        interval < Pot.Internal.LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = Pot.Internal.LightIterator.types.items;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new Pot.Internal.LightIterator(object, callback, opts)).result;
      };
    } else {
      return function(object, callback, context) {
        return Pot.Internal.LightIterator.QuickIteration.items(
          object, callback, context
        );
      };
    }
  }),
  /**
   * Create a new array which has the elements at
   *   position ith of the provided arrays.
   * This function is handled as seen from the longitudinal for array
   *   that is similar to the zip() function in Python.
   *
   * <pre>
   * Example:
   *
   *   arguments:  [[1, 2, 3],
   *                [4, 5, 6]]
   *
   *   results:    [[1, 4],
   *                [2, 5],
   *                [3, 6]]
   * </pre>
   *
   *
   * @link http://docs.python.org/library/functions.html#zip
   *
   *
   * @example
   *   var result = zip([[1, 2, 3], [4, 5, 6]]);
   *   debug(result);
   *   // @results
   *   //   [[1, 4], [2, 5], [3, 6]]
   *   //
   *
   *
   * @example
   *   var result = zip([[1, 2, 3], [1, 2, 3, 4, 5]]);
   *   debug(result);
   *   // @results
   *   //   [[1, 1], [2, 2], [3, 3]]
   *   //
   *
   *
   * @example
   *   var result = zip([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11]]);
   *   debug(result);
   *   // @results
   *   //   [[1, 4, 7, 10], [2, 5, 8, 11]]
   *   //
   *
   *
   * @example
   *   var result = zip(['hoge']);
   *   debug(result);
   *   // @results
   *   //   [['hoge']]
   *   //
   *
   *
   * @example
   *   var result = zip([[1], [2], [3]]);
   *   debug(result);
   *   // @results
   *   //   [[1, 2, 3]]
   *   //
   *
   *
   * @example
   *   var result = zip([[1, 2, 3], ['foo', 'bar', 'baz'], [4, 5]]);
   *   debug(result);
   *   // @results
   *   //   [[1, 'foo', 4], [2, 'bar', 5]]
   *   //
   *
   *
   * @example
   *   var callback = function(items) { return items[0] + items[1]; };
   *   var result = zip([[1, 2, 3], [4, 5, 6]], callback);
   *   debug(result);
   *   // @results [5, 7, 9]
   *
   *
   * @param  {Array}     object     An array to be combined.
   * @param  {Function} (callback)  (Optional) Callback function.
   *                                  function({Array} items[, {*} object])
   *                                    this == `context`.
   * @param  {*}        (context)   (Optional) Object to use
   *                                  as `this` when executing callback.
   * @return {Array}                A new array of arrays created from
   *                                  provided objects.
   *
   * @class
   * @function
   * @static
   * @name Pot.zip
   *
   * @property {Function} limp   Iterates "zip" loop with slowest speed.
   * @property {Function} doze   Iterates "zip" loop with slower speed.
   * @property {Function} slow   Iterates "zip" loop with slow speed.
   * @property {Function} normal Iterates "zip" loop with default speed.
   * @property {Function} fast   Iterates "zip" loop with fast speed.
   * @property {Function} rapid  Iterates "zip" loop with faster speed.
   * @property {Function} ninja  Iterates "zip" loop with fastest speed.
   */
  zip : Pot.tmp.createLightIterateConstructor(function(interval) {
    if (Pot.System.isWaitable &&
        interval < Pot.Internal.LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = Pot.Internal.LightIterator.types.zip;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new Pot.Internal.LightIterator(object, callback, opts)).result;
      };
    } else {
      return function(object, callback, context) {
        return Pot.Internal.LightIterator.QuickIteration.zip(
          object, callback, context
        );
      };
    }
  })
});

// Define iterators for Deferred (Asynchronous)
update(Pot.Deferred, {
  /**
   * Iterates as "for each" loop. (Asynchronous)
   *
   * @desc
   * <pre>
   * Unlike Deferred, speed options affect to cutback count in loop.
   * Options append to after the forEach and execute it.
   *
   *  e.g.   Pot.Deferred.forEach.fast(obj, function() {...})
   *
   * The available methods are below.
   * ------------------------------------
   *   method name   |  speed
   * ------------------------------------
   *      limp       :  slowest
   *      doze       :  slower
   *      slow       :  slow
   *      normal     :  normal (default)
   *      fast       :  fast
   *      rapid      :  faster
   *      ninja      :  fastest
   * ------------------------------------
   * </pre>
   *
   * @param  {Array|Object}  object    A target object.
   * @param  {Function}      callback  An iterable function.
   *                                     function(value, key, object)
   *                                       this == `context`.
   *                                   Throw Pot.StopIteration
   *                                     if you want to stop the loop.
   * @param  {*}            (context)  Optionally, context object. (i.e. this)
   * @result {Deferred}                Return the Deferred.
   * @class
   * @function
   * @public
   * @type Function
   * @name Pot.Deferred.forEach
   * @property {Function} limp   Iterates "for each" loop with slowest speed.
   * @property {Function} doze   Iterates "for each" loop with slower speed.
   * @property {Function} slow   Iterates "for each" loop with slow speed.
   * @property {Function} normal Iterates "for each" loop with default speed.
   * @property {Function} fast   Iterates "for each" loop with fast speed.
   * @property {Function} rapid  Iterates "for each" loop with faster speed.
   * @property {Function} ninja  Iterates "for each" loop with fastest speed.
   */
  forEach : Pot.tmp.createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = Pot.Internal.LightIterator.types.forLoop |
                  Pot.Internal.LightIterator.types.forInLoop;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new Pot.Internal.LightIterator(object, callback, opts)).deferred;
    };
  }),
  /**
   * "repeat" loop iterates a specified number. (Asynchronous)
   *
   * @param  {Number|Object}  max       The maximum number of times to loop,
   *                                      or object.
   * @param  {Function}       callback  An iterable function.
   *                                    Throw Pot.StopIteration
   *                                      if you want to stop the loop.
   * @param  {*}             (context)  Optionally, context object. (i.e. this)
   * @return {Deferred}                 Return the Deferred.
   * @class
   * @function
   * @public
   * @type Function
   * @name Pot.Deferred.repeat
   * @property {Function} limp   Iterates "repeat" loop with slowest speed.
   * @property {Function} doze   Iterates "repeat" loop with slower speed.
   * @property {Function} slow   Iterates "repeat" loop with slow speed.
   * @property {Function} normal Iterates "repeat" loop with default speed.
   * @property {Function} fast   Iterates "repeat" loop with fast speed.
   * @property {Function} rapid  Iterates "repeat" loop with faster speed.
   * @property {Function} ninja  Iterates "repeat" loop with fastest speed.
   */
  repeat : Pot.tmp.createLightIterateConstructor(function(interval) {
    return function(max, callback, context) {
      var opts = {};
      opts.type = Pot.Internal.LightIterator.types.repeat;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new Pot.Internal.LightIterator(max, callback, opts)).deferred;
    };
  }),
  /**
   * Iterates indefinitely until "Pot.StopIteration" is thrown. (Asynchronous)
   *
   * @param  {Function}  callback   An iterable function.
   *                                Throw Pot.StopIteration
   *                                  if you want to stop the loop.
   * @param  {*}         (context)  Optionally, context object. (i.e. this)
   * @return {Deferred}             Return the Deferred.
   * @class
   * @function
   * @public
   * @type Function
   * @name Pot.Deferred.forEver
   * @property {Function} limp   Iterates "forEver" loop with slowest speed.
   * @property {Function} doze   Iterates "forEver" loop with slower speed.
   * @property {Function} slow   Iterates "forEver" loop with slow speed.
   * @property {Function} normal Iterates "forEver" loop with default speed.
   * @property {Function} fast   Iterates "forEver" loop with fast speed.
   * @property {Function} rapid  Iterates "forEver" loop with faster speed.
   * @property {Function} ninja  Iterates "forEver" loop with fastest speed.
   */
  forEver : Pot.tmp.createLightIterateConstructor(function(interval) {
    return function(callback, context) {
      var opts = {};
      opts.type = Pot.Internal.LightIterator.types.forEver;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new Pot.Internal.LightIterator(callback, null, opts)).deferred;
    };
  }),
  /**
   * Iterate an iterable object. (using Pot.Iter)
   *
   * @param  {*}         object     An iterable object.
   * @param  {Function}  callback   An iterable function.
   *                                  function(value, key, object)
   *                                    this == `context`.
   *                                Throw Pot.StopIteration
   *                                  if you want to stop the loop.
   * @param  {Object}    (context)  Optionally, context object. (i.e. this)
   * @return {Deferred}             Return the Deferred.
   * @class
   * @function
   * @public
   * @type Function
   * @name Pot.Deferred.iterate
   * @property {Function} limp   Iterates "iterate" loop with slowest speed.
   * @property {Function} doze   Iterates "iterate" loop with slower speed.
   * @property {Function} slow   Iterates "iterate" loop with slow speed.
   * @property {Function} normal Iterates "iterate" loop with default speed.
   * @property {Function} fast   Iterates "iterate" loop with fast speed.
   * @property {Function} rapid  Iterates "iterate" loop with faster speed.
   * @property {Function} ninja  Iterates "iterate" loop with fastest speed.
   */
  iterate : Pot.tmp.createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = Pot.Internal.LightIterator.types.iterate;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new Pot.Internal.LightIterator(object, callback, opts)).deferred;
    };
  }),
  /**
   * Collect the object key and value and make array as items format.
   *
   * @param  {Object|Array}  object     The target object or an array.
   * @param  {Function}     (callback)  (Optional) Callback function.
   *                                      function({Array} item[, object])
   *                                        this == `context`.
   * @param  {*}            (context)   (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {Deferred}                 Return a new instance of Deferred that has
   *                                      the collected items as an array.
   *
   * @class
   * @function
   * @public
   * @type Function
   * @name Pot.Deferred.items
   *
   * @property {Function} limp   Iterates "items" loop with slowest speed.
   * @property {Function} doze   Iterates "items" loop with slower speed.
   * @property {Function} slow   Iterates "items" loop with slow speed.
   * @property {Function} normal Iterates "items" loop with default speed.
   * @property {Function} fast   Iterates "items" loop with fast speed.
   * @property {Function} rapid  Iterates "items" loop with faster speed.
   * @property {Function} ninja  Iterates "items" loop with fastest speed.
   */
  items : Pot.tmp.createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = Pot.Internal.LightIterator.types.items;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new Pot.Internal.LightIterator(object, callback, opts)).deferred;
    };
  }),
  /**
   * Create a new array which has the elements at
   *   position ith of the provided arrays.
   * This function is handled as seen from the longitudinal for array
   *   that is similar to the zip() function in Python.
   *
   * <pre>
   * Example:
   *
   *   arguments:  [[1, 2, 3],
   *                [4, 5, 6]]
   *
   *   results:    [[1, 4],
   *                [2, 5],
   *                [3, 6]]
   * </pre>
   *
   * @link http://docs.python.org/library/functions.html#zip
   *
   * @param  {Array}     object     Objects to be combined.
   * @param  {Function} (callback)  (Optional) Callback function.
   *                                  function({Array} items[, {*} object])
   *                                    this == `context`.
   * @param  {*}        (context)   (Optional) Object to use
   *                                  as `this` when executing callback.
   * @return {Deferred}             Return a new instance of Deferred that has
   *                                  a new array of arrays created from
   *                                  provided objects.
   * @class
   * @function
   * @public
   * @type Function
   * @name Pot.Deferred.zip
   *
   * @property {Function} limp   Iterates "zip" loop with slowest speed.
   * @property {Function} doze   Iterates "zip" loop with slower speed.
   * @property {Function} slow   Iterates "zip" loop with slow speed.
   * @property {Function} normal Iterates "zip" loop with default speed.
   * @property {Function} fast   Iterates "zip" loop with fast speed.
   * @property {Function} rapid  Iterates "zip" loop with faster speed.
   * @property {Function} ninja  Iterates "zip" loop with fastest speed.
   */
  zip : Pot.tmp.createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = Pot.Internal.LightIterator.types.zip;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new Pot.Internal.LightIterator(object, callback, opts)).deferred;
    };
  })
});

delete Pot.tmp.createLightIterateConstructor;
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Iter.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Iter.
   *
   * A Simple iterator.
   * Constructor.
   *
   * @param  {*}          Options.
   * @return {Pot.Iter}   Returns an instance of Pot.Iter
   *
   * @name  Pot.Iter
   * @class
   * @constructor
   * @public
   */
  Iter : function() {
    return Pot.isIter(this) ? this.init(arguments) :
            new Pot.Iter.fn.init(arguments);
  }
});

// Definition of the prototype
Pot.Iter.fn = Pot.Iter.prototype = update(Pot.Iter.prototype, {
  /**
   * @lends Pot.Iter.prototype
   */
  /**
   * @ignore
   */
  constructor : Pot.Iter,
  /**
   * @private
   * @ignore
   */
  id : Pot.Internal.getMagicNumber(),
  /**
   * A unique strings.
   *
   * @type String
   * @private
   * @const
   */
  serial : null,
  /**
   * @private
   * @ignore
   * @const
   */
  NAME : 'Iter',
  /**
   * toString.
   *
   * @return  Return formatted string of object.
   * @type  Function
   * @function
   * @const
   * @static
   * @public
   */
  toString : Pot.toString,
  /**
   * isIter.
   *
   * @type Function
   * @function
   * @const
   * @static
   * @public
   */
  isIter : Pot.isIter,
  /**
   * Initialize properties.
   *
   * @private
   * @ignore
   */
  init : function(args) {
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    return this;
  },
  /**
   * Abstract function.
   *
   * Note: Firebug 1.7.x never shows the name of "next" method.
   *
   * @abstract
   * @type Function
   * @function
   * @public
   */
  next : function() {
    throw Pot.StopIteration;
  }
  /**
   * The property that implemented since JavaScript 1.7
   *   as the extended ECMAScript-3rd edition.
   *
   * @return  {Object}       Return the iterator object
   */
  //XXX: __iterator__ unimplemented for Object.prototype.__iterator__.
  //__iterator__ : function() {
  //  return this;
  //}
});

Pot.Iter.prototype.init.prototype = Pot.Iter.prototype;

// Define Iter object properties.
update(Pot.Iter, {
  /**
   * @lends Pot.Iter
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
   * Assign to an iterator from the argument object value.
   *
   * @param  {*}         x   An iterable object.
   * @return {Pot.Iter}      An iterator object instance.
   * @type Function
   * @function
   * @static
   * @public
   */
  toIter : function(x) {
    var iter, o, p, v, arrayLike, objectLike;
    if (Pot.isIter(x)) {
      return x;
    }
    arrayLike  = x && Pot.isArrayLike(x);
    objectLike = x && !arrayLike && Pot.isObject(x);
    if (objectLike) {
      o = [];
      for (p in x) {
        try {
          v = x[p];
        } catch (e) {
          continue;
        }
        o[o.length] = [v, p];
      }
    } else {
      o = arrayize(x);
    }
    iter = new Pot.Iter();
    /**@ignore*/
    iter.next = (function() {
      var i = 0;
      if (objectLike) {
        return function() {
          var key, val, pair;
          while (true) {
            if (i >= o.length) {
              throw Pot.StopIteration;
            }
            if (!(i in o)) {
              i++;
              continue;
            }
            try {
              key = o[i][1];
              val = o[i][0];
            } catch (e) {
              i++;
              continue;
            }
            pair = [val, key];
            i++;
            return pair;
          }
        };
      } else {
        return function() {
          var value, result;
          while (true) {
            if (i >= o.length) {
              throw Pot.StopIteration;
            }
            if (!(i in o)) {
              i++;
              continue;
            }
            try {
              value = o[i];
            } catch (e) {
              i++;
              continue;
            }
            result = [value, i];
            i++;
            return result;
          }
        };
      }
    })();
    return iter;
  },
  /**
   * @private
   * @ignore
   */
  forEach : function(/*object, callback[, context]*/) {
    return Pot.iterate.apply(null, arguments);
  },
  /**
   * Creates a new object with the results of calling a
   *   provided function on every element in object.
   *
   * This method like Array.prototype.map
   *
   *
   * @example
   *   function fuzzyPlural(single) {
   *     return single.replace(/o/g, 'e');
   *   }
   *   var words = ['foot', 'goose', 'moose'];
   *   debug(Pot.Iter.map(words, fuzzyPlural));
   *   // @results ['feet', 'geese', 'meese']
   *
   *
   * @example
   *   var object = {foo: 'foo1', bar: 'bar2', baz: 'baz3'};
   *   var result = Pot.Iter.map(object, function(value, key) {
   *     return value + '00';
   *   });
   *   debug(result);
   *   // @results {foo: 'foo100', bar: 'bar200', baz: 'baz300'}
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {*}                        Return the result of each callbacks.
   * @type Function
   * @function
   * @static
   * @public
   */
  map : function(object, callback, context) {
    var result, arrayLike, objectLike, iterateDefer, it, iterable;
    iterateDefer = this && this.iterateSpeed;
    arrayLike  = object && Pot.isArrayLike(object);
    objectLike = object && !arrayLike && Pot.isObject(object);
    if (arrayLike) {
      result = [];
    } else if (objectLike) {
      result = {};
    } else {
      result = null;
    }
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    /**@ignore*/
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res = callback.call(context, val, key, obj);
        if (Pot.isDeferred(res)) {
          return res.then(function(rv) {
            if (arrayLike) {
              result[result.length] = rv;
            } else if (objectLike) {
              result[key] = rv;
            } else {
              result = rv;
            }
          });
        } else {
          if (arrayLike) {
            result[result.length] = res;
          } else if (objectLike) {
            result[key] = res;
          } else {
            result = res;
          }
        }
      }, context);
    };
    if (iterateDefer) {
      return it().then(function() {
        return result;
      });
    } else {
      it();
      return result;
    }
  },
  /**
   * Creates a new object with all elements that
   *  pass the test implemented by the provided function.
   *
   * This method like Array.prototype.filter
   *
   *
   * @example
   *   function isBigEnough(value, index, array) {
   *     return (value >= 10);
   *   }
   *   var filtered = Pot.Iter.filter([12, 5, 8, 130, 44], isBigEnough);
   *   debug(filtered);
   *   // @results [12, 130, 44]
   *
   *
   * @example
   *   function isBigEnough(value, key, object) {
   *     return (value >= 10);
   *   }
   *   var object = {a: 1, b: 20, c: 7, d: 5, e: 27, f: 99};
   *   var result = Pot.Iter.filter(object, isBigEnough);
   *   debug(result);
   *   // @results {b: 20, e: 27, f: 99}
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {*}                        Return the result of each callbacks.
   * @type Function
   * @function
   * @static
   * @public
   */
  filter : function(object, callback, context) {
    var result, arrayLike, objectLike, iterateDefer, it, iterable;
    iterateDefer = this && this.iterateSpeed;
    arrayLike  = object && Pot.isArrayLike(object);
    objectLike = object && !arrayLike && Pot.isObject(object);
    if (arrayLike) {
      result = [];
    } else if (objectLike) {
      result = {};
    } else {
      result = null;
    }
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    /**@ignore*/
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res = callback.call(context, val, key, obj);
        if (Pot.isDeferred(res)) {
          return res.then(function(rv) {
            if (rv) {
              if (arrayLike) {
                result[result.length] = val;
              } else if (objectLike) {
                result[key] = val;
              } else {
                result = val;
              }
            }
          });
        } else {
          if (res) {
            if (arrayLike) {
              result[result.length] = val;
            } else if (objectLike) {
              result[key] = val;
            } else {
              result = val;
            }
          }
        }
      }, context);
    };
    if (iterateDefer) {
      return it().then(function() {
        return result;
      });
    } else {
      it();
      return result;
    }
  },
  /**
   * Apply a function against an accumulator and each value of
   *  the object (from left-to-right) as to reduce it to a single value.
   *
   * This method like Array.prototype.reduce
   *
   *
   * @example
   *   var array = [1, 2, 3, 4, 5];
   *   var total = Pot.Iter.reduce(array, function(a, b) { return a + b; });
   *   debug(total);
   *   // @results 15
   *
   * @example
   *   var object = {a: 1, b: 2, c: 3};
   *   var total = Pot.Iter.reduce(object, function(a, b) { return a + b; });
   *   debug(total);
   *   // @results 6
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (initial)  An initial value passed as `callback`
   *                                      argument that will be used on
   *                                      first iteration.
   * @param  {*}             (context)  (Optional) Object to use as
   *                                      the first argument to the
   *                                      first call of the `callback`.
   * @return {*}                        Return the result of each callbacks.
   * @type Function
   * @function
   * @static
   * @public
   */
  reduce : function(object, callback, initial, context) {
    var arrayLike, objectLike, value, skip, iterateDefer, it, iterable;
    iterateDefer = this && this.iterateSpeed;
    arrayLike  = object && Pot.isArrayLike(object);
    objectLike = object && !arrayLike && Pot.isObject(object);
    if (initial === undefined) {
      /**@ignore*/
      value = (function() {
        var first;
        if (arrayLike || objectLike) {
          each(object, function(v) {
            first = v;
            throw Pot.StopIteration;
          });
        }
        return first;
      })();
    } else {
      value = initial;
    }
    skip = true;
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    /**@ignore*/
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res;
        if (skip) {
          skip = false;
        } else {
          res = callback.call(context, value, val, key, obj);
          if (Pot.isDeferred(res)) {
            return res.then(function(rv) {
              value = rv;
            });
          } else {
            value = res;
          }
        }
      }, context);
    };
    if (iterateDefer) {
      return it().then(function() {
        return value;
      });
    } else {
      it();
      return value;
    }
  },
  /**
   * Tests whether all elements in the object pass the
   *  test implemented by the provided function.
   *
   * This method like Array.prototype.every
   *
   * @example
   *   function isBigEnough(value, index, array) {
   *     return (value >= 10);
   *   }
   *   var passed = Pot.Iter.every([12, 5, 8, 130, 44], isBigEnough);
   *   debug(passed);
   *   // passed is false
   *   passed = Pot.Iter.every([12, 54, 18, 130, 44], isBigEnough);
   *   debug(passed);
   *   // passed is true
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {Boolean}                  Return the Boolean result by callback.
   * @type Function
   * @function
   * @static
   * @public
   */
  every : function(object, callback, context) {
    var result = true, iterateDefer, it, iterable;
    iterateDefer = this && this.iterateSpeed;
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    /**@ignore*/
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res = callback.call(context, val, key, obj);
        if (Pot.isDeferred(res)) {
          return res.then(function(rv) {
            if (!rv) {
              result = false;
              throw Pot.StopIteration;
            }
          });
        } else {
          if (!res) {
            result = false;
            throw Pot.StopIteration;
          }
        }
      }, context);
    };
    if (iterateDefer) {
      return it().then(function() {
        return result;
      });
    } else {
      it();
      return result;
    }
  },
  /**
   * Tests whether some element in the object passes the
   *  test implemented by the provided function.
   *
   * This method like Array.prototype.some
   *
   *
   * @example
   *   function isBigEnough(value, index, array) {
   *     return (value >= 10);
   *   }
   *   var passed = Pot.Iter.some([2, 5, 8, 1, 4], isBigEnough);
   *   debug(passed);
   *   // passed is false
   *   passed = Pot.Iter.some([12, 5, 8, 1, 4], isBigEnough);
   *   debug(passed);
   *   // passed is true
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {Boolean}                  Return the Boolean result by callback.
   * @type Function
   * @function
   * @static
   * @public
   */
  some : function(object, callback, context) {
    var result = false, iterateDefer, it, iterable;
    iterateDefer = this && this.iterateSpeed;
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    /**@ignore*/
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res = callback.call(context, val, key, obj);
        if (Pot.isDeferred(res)) {
          return res.then(function(rv) {
            if (rv) {
              result = true;
              throw Pot.StopIteration;
            }
          });
        } else {
          if (res) {
            result = true;
            throw Pot.StopIteration;
          }
        }
      }, context);
    };
    if (iterateDefer) {
      return it().then(function() {
        return result;
      });
    } else {
      it();
      return result;
    }
  },
  /**
   * Create continuously array that
   *  has numbers between start number and end number.
   *
   * First argument can given an object that has "begin, end, step" any keys.
   *
   * This function can be a letter rather than just numbers.
   *
   * @example
   *   var numbers = Pot.Iter.range(1, 5);
   *   debug(numbers); // @results [1, 2, 3, 4, 5]
   *   var chars = Pot.Iter.range('a', 'f');
   *   debug(chars);   // @results ['a', 'b', 'c', 'd', 'e', 'f']
   *   var ranges = Pot.Iter.range({begin: 0, step: 10, end: 50});
   *   debug(ranges);  // @results [0, 10, 20, 30, 40, 50]
   *
   *
   * @param  {Number|Object}  end/begin  The end number or object.
   * @param  {Number}         (end)      (optinal) The end number.
   * @param  {Number}         (step)     (optinal) The step number.
   * @return {Array}                     Return an array result.
   * @type Function
   * @function
   * @static
   * @public
   */
  range : function(/*[begin,] end[, step]*/) {
    var args = arguments, arg, result;
    var begin, end, step, n, string, iter;
    result = [];
    begin = 0;
    end   = 0;
    step  = 1;
    switch (args.length) {
      case 0:
          return (void 0);
      case 1:
          arg = args[0];
          if (Pot.isObject(arg)) {
            if ('begin' in arg) {
              begin = arg.begin;
            } else if ('start' in arg) {
              begin = arg.start;
            }
            if ('end' in arg) {
              end = arg.end;
            } else if ('stop' in arg) {
              end = arg.stop;
            }
            if ('step' in arg) {
              step = arg.step;
            }
          } else {
            end = arg;
          }
          break;
      case 2:
          begin = args[0];
          end   = args[1];
          break;
      case 3:
      default:
          begin = args[0];
          end   = args[1];
          step  = args[2];
          break;
    }
    if (Pot.isString(begin) && begin.length === 1 &&
        Pot.isString(end)   && end.length   === 1) {
      begin  = begin.charCodeAt(0) || 0;
      end    = end.charCodeAt(0)   || 0;
      string = true;
    } else {
      begin  = begin - 0;
      end    = end   - 0;
      string = false;
    }
    step = step - 0;
    if (isNaN(begin) || isNaN(end) || isNaN(step) || step == 0) {
      return result;
    }
    if ((step > 0 && begin > end) ||
        (step < 0 && begin < end)) {
      n     = begin;
      begin = end;
      end   = n;
    }
    iter = new Pot.Iter();
    /**@ignore*/
    iter.next = function() {
      if ((step > 0 && begin > end) ||
          (step < 0 && begin < end)) {
        throw Pot.StopIteration;
      }
      result[result.length] = string ? String.fromCharCode(begin) : begin;
      begin += step;
    };
    Pot.iterate(iter);
    return result;
  },
  /**
   * Returns the first index at which a
   *  given element can be found in the object, or -1 if it is not present.
   *
   * This method like Array.prototype.indexOf
   *
   *
   * @example
   *   var array = [2, 5, 9];
   *   var index = Pot.Iter.indexOf(array, 2);
   *   // index is 0
   *   index = Pot.Iter.indexOf(array, 7);
   *   // index is -1
   *   var object = {a: 2, b: 5, c: 9};
   *   index = Pot.Iter.indexOf(object, 2);
   *   // index is 'a'
   *   index = Pot.Iter.indexOf(object, 7);
   *   // index is -1
   *
   *
   * @param  {Array|Object|*} object  A target object.
   * @param  {*}              subject A subject object.
   * @param  {*}              (from)  (Optional) The index at
   *                                    which to begin the search.
   *                                  Defaults to 0.
   * @return {Number}                 Return the index of result, or -1.
   * @type Function
   * @function
   * @static
   * @public
   */
  indexOf : function(object, subject, from) {
    var result = -1, arrayLike, objectLike;
    var i, len,  key, val, args, argn, passed;
    args = arguments;
    argn = args.length;
    arrayLike  = object && Pot.isArrayLike(object);
    objectLike = object && !arrayLike && Pot.isObject(object);
    if (arrayLike) {
      try {
        if (Pot.System.isBuiltinArrayIndexOf) {
          i = Array.prototype.indexOf.apply(object, arrayize(args, 1));
          if (Pot.isNumeric(i)) {
            result = i;
          } else {
            throw i;
          }
        } else {
          throw i;
        }
      } catch (err) {
        len = (object && object.length) || 0;
        i = Number(from) || 0;
        i = (i < 0) ? Math.ceil(i) : Math.floor(i);
        if (i < 0) {
          i += len;
        }
        for (; i < len; i++) {
          try {
            if (i in object) {
              val = object[i];
              if (val === subject) {
                result = i;
                break;
              }
            }
          } catch (e) {
            continue;
          }
        }
      }
    } else if (objectLike) {
      passed = false;
      for (key in object) {
        try {
          if (!passed && argn >= 3 && from !== key) {
            continue;
          } else {
            passed = true;
          }
          val = object[key];
          if (val === subject) {
            result = key;
          }
        } catch (e) {
          continue;
        }
      }
    } else if (object != null) {
      try {
        val = (object.toString && object.toString()) || String(object);
        result = String.prototype.indexOf.apply(val, arrayize(args, 1));
      } catch (e) {
        result = -1;
      }
    } else {
      result = -1;
    }
    return result;
  },
  /**
   * Returns the last index at which a
   *  given element can be found in the object, or -1 if it is not present.
   *
   * This method like Array.prototype.lastIndexOf
   *
   *
   * @example
   *   debug('array');
   *   var index, array = [2, 5, 9, 2];
   *   index = Pot.Iter.lastIndexOf(array, 2);
   *   debug('index is 3 : result = ' + index);      // 3
   *   index = Pot.Iter.lastIndexOf(array, 7);
   *   debug('index is -1 : result = ' + index);     // -1
   *   index = Pot.Iter.lastIndexOf(array, 2, 3);
   *   debug('index is 3 : result = ' + index);      // 3
   *   index = Pot.Iter.lastIndexOf(array, 2, 2);
   *   debug('index is 0 : result = ' + index);      // 0
   *   index = Pot.Iter.lastIndexOf(array, 2, -2);
   *   debug('index is 0 : result = ' + index);      // 0
   *   index = Pot.Iter.lastIndexOf(array, 2, -1);
   *   debug('index is 3 : result = ' + index);      // 3
   *   debug('object');
   *   var object = {a: 2, b: 5, c: 9, d: 2};
   *   index = Pot.Iter.lastIndexOf(object, 2);
   *   debug('index is  d : result = ' + index);     // 'd'
   *   index = Pot.Iter.lastIndexOf(object, 7);
   *   debug('index is -1 : result = ' + index);     // -1
   *   index = Pot.Iter.lastIndexOf(object, 2, 'd'); // 'd'
   *   debug('index is  d : result = ' + index);
   *   index = Pot.Iter.lastIndexOf(object, 2, 'c'); // 'a'
   *   debug('index is  a : result = ' + index);
   *
   *
   * @param  {Array|Object|*} object  A target object.
   * @param  {*}              subject A subject object.
   * @param  {*}             (from)   (Optional) The index at which to
   *                                    start searching backwards.
   *                                  Defaults to the array's length.
   * @return {Number}                 Return the index of result, or -1.
   * @type Function
   * @function
   * @static
   * @public
   */
  lastIndexOf : function(object, subject, from) {
    var result = -1, arrayLike, objectLike;
    var i, len,  key, val, args, argn, passed, pairs;
    args = arguments;
    argn = args.length;
    arrayLike  = object && Pot.isArrayLike(object);
    objectLike = object && !arrayLike && Pot.isObject(object);
    if (arrayLike) {
      try {
        if (Pot.System.isBuiltinArrayLastIndexOf) {
          i = Array.prototype.lastIndexOf.apply(object, arrayize(args, 1));
          if (Pot.isNumeric(i)) {
            result = i;
          } else {
            throw i;
          }
        } else {
          throw i;
        }
      } catch (err) {
        len = (object && object.length) || 0;
        i = Number(from);
        if (isNaN(i)) {
          i = len - 1;
        } else {
          i = (i < 0) ? Math.ceil(i) : Math.floor(i);
          if (i < 0) {
            i += len;
          } else if (i >= len) {
            i = len - 1;
          }
        }
        for (; i > -1; i--) {
          try {
            if (i in object) {
              val = object[i];
              if (val === subject) {
                result = i;
                break;
              }
            }
          } catch (e) {
            continue;
          }
        }
      }
    } else if (objectLike) {
      pairs = [];
      passed = false;
      for (key in object) {
        try {
          val = object[key];
        } catch (e) {
          continue;
        }
        pairs[pairs.length] = [key, val];
        if (val === subject) {
          result = key;
        }
        if (key === from) {
          passed = true;
          break;
        }
      }
      if (passed) {
        result = -1;
        len = pairs.length;
        while (--len >= 0) {
          key = pairs[len][0];
          val = pairs[len][1];
          if (val === subject) {
            result = key;
            break;
          }
        }
      }
    } else if (object != null) {
      try {
        val = (object.toString && object.toString()) || String(object);
        result = String.prototype.lastIndexOf.apply(val, arrayize(args, 1));
      } catch (e) {
        result = -1;
      }
    } else {
      result = -1;
    }
    return result;
  }
});

// Update methods for reference.
Pot.update({
  toIter : Pot.Iter.toIter
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Update the Pot.Deferred object for iterators.

// Extends the Pot.Deferred object for iterators with speed.
update(Pot.tmp, {
  /**
   * @private
   * @ignore
   */
  createIterators : function(iters) {
    each(iters, function(iter) {
      var o = {};
      /**@ignore*/
      o[iter.NAME] = function() {
        var me = {}, args = arrayize(arguments);
        me.iterateSpeed = (this && this.iterateSpeed) || Pot.Deferred.iterate;
        return Pot.Deferred.begin(function() {
          var d = new Pot.Deferred();
          iter.method.apply(me, args).then(function(res) {
            d.begin(res);
          }, function(err) {
            d.raise(err);
          });
          return d;
        });
      };
      update(Pot.Deferred, o);
      Pot.Deferred.extendSpeeds(Pot.Deferred, iter.NAME, function(opts) {
        var me = {}, args = arrayize(arguments, 1);
        me.iterateSpeed = Pot.Deferred.iterate[opts.speedName];
        return Pot.Deferred.begin(function() {
          var d = new Pot.Deferred();
          iter.method.apply(me, args).then(function(res) {
            d.begin(res);
          }, function(err) {
            d.raise(err);
          });
          return d;
        });
      }, Pot.Internal.LightIterator.speeds);
    });
  },
  /**
   * @private
   * @ignore
   */
  createProtoIterators : function(iters) {
    each(iters, function(iter) {
      var o = {}, sp = {};
      /**@ignore*/
      o[iter.NAME] = function() {
        var args = arrayize(arguments), options = update({}, this.options);
        return this.then(function(value) {
          var d = new Pot.Deferred();
          args = iter.args(value, args);
          iter.method.apply(iter.context, args).ensure(function(res) {
            extendDeferredOptions(d, options);
            if (Pot.isError(res)) {
              d.raise(res);
            } else {
              d.begin(res);
            }
          });
          return d;
        });
      };
      update(Pot.Deferred.fn, o);
      if (iter.speed) {
        if (iter.iterable) {
          /**@ignore*/
          sp.methods = function(speed) {
            return {
              iter    : iter.iterable[speed],
              context : iter.context
            };
          };
        } else {
          /**@ignore*/
          sp.methods = function(speed) {
            return {
              iter    : iter.method,
              context : {iterateSpeed : iter.context.iterateSpeed[speed]}
            };
          };
        }
        Pot.Deferred.extendSpeeds(Pot.Deferred.fn, iter.NAME, function(opts) {
          var iterable, options, args = arrayize(arguments, 1);
          iterable = sp.methods(opts.speedName);
          options  = update({}, this.options);
          return this.then(function(value) {
            var d = new Pot.Deferred();
            args = iter.args(value, args);
            iterable.iter.apply(iterable.context, args).ensure(function(res) {
              extendDeferredOptions(d, options);
              if (Pot.isError(res)) {
                d.raise(res);
              } else {
                d.begin(res);
              }
            });
            return d;
          });
        }, Pot.Internal.LightIterator.speeds);
      }
    });
  },
  /**
   * @private
   * @ignore
   */
  createSyncIterator : function(creator) {
    var methods, construct;
    /**@ignore*/
    var create = function(speed) {
      var key = speed;
      if (!key) {
        each(Pot.Internal.LightIterator.speeds, function(v, k) {
          if (v === Pot.Internal.LightIterator.defaults.speed) {
            key = k;
            throw Pot.StopIteration;
          }
        });
      }
      return creator(key);
    };
    construct = create();
    methods = {};
    each(Pot.Internal.LightIterator.speeds, function(v, k) {
      methods[k] = create(k);
    });
    return update(construct, methods);
  }
});

// Create iterators to Pot.Deferred.
Pot.tmp.createIterators([{
  /**
   * Creates a new object with the results of calling a
   *   provided function on every element in object.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.map
   *
   *
   * @example
   *   var words = ['foot', 'goose', 'moose'];
   *   Pot.Deferred.map(words, function(word) {
   *     return word.replace(/o/g, 'e');
   *   }).then(function(result) {
   *     debug(result);
   *   });
   *   // @results result = ['feet', 'geese', 'meese']
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {*}                        Return the result of each callbacks.
   * @name   Pot.Deferred.map
   * @type   Function
   * @class
   * @function
   * @static
   * @public
   *
   * @property {Function} limp   Iterates "map" loop with slowest speed.
   * @property {Function} doze   Iterates "map" loop with slower speed.
   * @property {Function} slow   Iterates "map" loop with slow speed.
   * @property {Function} normal Iterates "map" loop with default speed.
   * @property {Function} fast   Iterates "map" loop with fast speed.
   * @property {Function} rapid  Iterates "map" loop with faster speed.
   * @property {Function} ninja  Iterates "map" loop with fastest speed.
   */
  NAME   : 'map',
  /**@ignore*/
  method : Pot.Iter.map
}, {
  /**
   * Creates a new object with all elements that
   *  pass the test implemented by the provided function.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.filter
   *
   *
   * @example
   *   var numbers = [12, 5, 8, 130, 44];
   *   Pot.Deferred.filter(numbers, function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *   });
   *   // @results result = [12, 130, 44]
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {*}                        Return the result of each callbacks.
   * @name   Pot.Deferred.filter
   * @type   Function
   * @class
   * @function
   * @static
   * @public
   *
   * @property {Function} limp   Iterates "filter" loop with slowest speed.
   * @property {Function} doze   Iterates "filter" loop with slower speed.
   * @property {Function} slow   Iterates "filter" loop with slow speed.
   * @property {Function} normal Iterates "filter" loop with default speed.
   * @property {Function} fast   Iterates "filter" loop with fast speed.
   * @property {Function} rapid  Iterates "filter" loop with faster speed.
   * @property {Function} ninja  Iterates "filter" loop with fastest speed.
   */
  NAME   : 'filter',
  /**@ignore*/
  method : Pot.Iter.filter
}, {
  /**
   * Apply a function against an accumulator and each value of
   *  the object (from left-to-right) as to reduce it to a single value.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.reduce
   *
   *
   * @example
   *   var numbers = [1, 2, 3, 4, 5];
   *   Pot.Deferred.reduce(numbers, function(a, b) {
   *     return a + b;
   *   }).then(function(result) {
   *     debug(result);
   *   });
   *   // @results result = 15
   *
   *
   * @param  {Array|Object|*}  object     A target object.
   * @param  {Function}        callback   A callback function.
   * @param  {*}               initial    An initial value passed as
   *                                        `callback` argument that
   *                                        will be used on
   *                                        first iteration.
   * @param  {*}              (context)   (Optional) Object to use as
   *                                        the first argument to the
   *                                        first call of the `callback`.
   * @return {*}                          Return the result of each callbacks.
   * @name   Pot.Deferred.reduce
   * @type   Function
   * @class
   * @function
   * @static
   * @public
   *
   * @property {Function} limp   Iterates "reduce" loop with slowest speed.
   * @property {Function} doze   Iterates "reduce" loop with slower speed.
   * @property {Function} slow   Iterates "reduce" loop with slow speed.
   * @property {Function} normal Iterates "reduce" loop with default speed.
   * @property {Function} fast   Iterates "reduce" loop with fast speed.
   * @property {Function} rapid  Iterates "reduce" loop with faster speed.
   * @property {Function} ninja  Iterates "reduce" loop with fastest speed.
   */
  NAME   : 'reduce',
  /**@ignore*/
  method : Pot.Iter.reduce
}, {
  /**
   * Tests whether all elements in the object pass the
   *  test implemented by the provided function.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.every
   *
   * @example
   *   var numbers = [12, 5, 8, 130, 44];
   *   Pot.Deferred.every(numbers, function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *     // @results false
   *   });
   *
   * @example
   *   var numbers = [12, 54, 18, 130, 44];
   *   Pot.Deferred.every(numbers, function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *     // @results true
   *   });
   *
   * @param  {Array|Object|*}  object      A target object.
   * @param  {Function}        callback    A callback function.
   * @param  {*}               (context)   (Optional) Object to use as
   *                                         `this` when executing callback.
   * @return {Boolean}                     Return the Boolean result
   *                                          by callback.
   * @name   Pot.Deferred.every
   * @type   Function
   * @class
   * @function
   * @static
   * @public
   *
   * @property {Function} limp   Iterates "every" loop with slowest speed.
   * @property {Function} doze   Iterates "every" loop with slower speed.
   * @property {Function} slow   Iterates "every" loop with slow speed.
   * @property {Function} normal Iterates "every" loop with default speed.
   * @property {Function} fast   Iterates "every" loop with fast speed.
   * @property {Function} rapid  Iterates "every" loop with faster speed.
   * @property {Function} ninja  Iterates "every" loop with fastest speed.
   */
  NAME   : 'every',
  /**@ignore*/
  method : Pot.Iter.every
}, {
  /**
   * Tests whether some element in the object passes the
   *  test implemented by the provided function.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.some
   *
   *
   * @example
   *   var numbers = [2, 5, 8, 1, 4];
   *   Pot.Deferred.some(numbers, function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *     // @results false
   *   });
   *
   * @example
   *   var numbers = [12, 5, 8, 1, 4];
   *   Pot.Deferred.some(numbers, function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *     // @results true
   *   });
   *
   *
   * @param  {Array|Object|*}  object      A target object.
   * @param  {Function}        callback    A callback function.
   * @param  {*}               (context)   (Optional) Object to use as
   *                                         `this` when executing callback.
   * @return {Boolean}                     Return the Boolean result by
   *                                         callback.
   * @name   Pot.Deferred.some
   * @type   Function
   * @class
   * @function
   * @static
   * @public
   *
   * @property {Function} limp   Iterates "some" loop with slowest speed.
   * @property {Function} doze   Iterates "some" loop with slower speed.
   * @property {Function} slow   Iterates "some" loop with slow speed.
   * @property {Function} normal Iterates "some" loop with default speed.
   * @property {Function} fast   Iterates "some" loop with fast speed.
   * @property {Function} rapid  Iterates "some" loop with faster speed.
   * @property {Function} ninja  Iterates "some" loop with fastest speed.
   */
  NAME   : 'some',
  /**@ignore*/
  method : Pot.Iter.some
}]);

// Create iterators to Pot.Deferred.prototype.
Pot.tmp.createProtoIterators([{
  /**
   * Iterates as "for each" loop. (Asynchronous)
   *
   * Iteration will use the results of the previous chain.
   *
   * @desc
   * <pre>
   * Unlike Deferred, speed options affect to cutback count in loop.
   * Options append to after the forEach and execute it.
   *
   *  e.g. d.forEach.slow(function() {...}).then(function() {...})
   *
   * The available methods are below.
   * ------------------------------------
   *   method name   |  speed
   * ------------------------------------
   *      limp       :  slowest
   *      doze       :  slower
   *      slow       :  slowly
   *      normal     :  normal (default)
   *      fast       :  fast
   *      rapid      :  faster
   *      ninja      :  fastest
   * ------------------------------------
   * </pre>
   *
   *
   * @example
   *   var elems = document.getElementsByTagName('*');
   *   var defer = new Pot.Deferred();
   *   var alpha = 1;
   *   defer.forEach.slow(function(elem, i, elems) {
   *     alpha -= 0.02;
   *     if (alpha < 0.02) {
   *       alpha = 0.02;
   *     }
   *     elem.style.opacity = alpha;
   *   }).wait(5).forEach(function(elem, i, elems) {
   *     elem.style.opacity = 1;
   *   }).then(function() {
   *     debug('end');
   *   }).begin(elems);
   *
   *
   * @param  {Function}   callback   An iterable function.
   *                                   function(value, key, object)
   *                                     this == `context`.
   *                                 Throw Pot.StopIteration
   *                                   if you want to stop the loop.
   * @param  {*}          (context)  Optionally, context object. (i.e. this)
   * @result {Deferred}              Return the Deferred.
   *
   * @name  Pot.Deferred.prototype.forEach
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "for each" loop with slowest speed.
   * @property {Function} doze   Iterates "for each" loop with slower speed.
   * @property {Function} slow   Iterates "for each" loop with slow speed.
   * @property {Function} normal Iterates "for each" loop with default speed.
   * @property {Function} fast   Iterates "for each" loop with fast speed.
   * @property {Function} rapid  Iterates "for each" loop with faster speed.
   * @property {Function} ninja  Iterates "for each" loop with fastest speed.
   */
  NAME : 'forEach',
  /**
   * @ignore
   */
  method : Pot.Deferred.forEach,
  /**
   * @ignore
   */
  context : null,
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : Pot.Deferred.forEach,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  /**
   * "repeat" loop iterates a specified number. (Asynchronous)
   *
   * If you specify the first argument as a function
   *  then the results of the previous chain will be used.
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   var p = document.getElementsByTagName('p');
   *   d.repeat(p.length, function(i, last) {
   *     p[i].innerHTML += last ? 'end' : i;
   *   }).then(function() {
   *     debug('finish');
   *   }).begin();
   *
   *
   * @param  {Number|Object}  (max)     The maximum number of times to loop,
   *                                      or object.
   * @param  {Function}       callback  An iterable function.
   *                                    Throw Pot.StopIteration
   *                                      if you want to stop the loop.
   * @param  {*}             (context)  Optionally, context object. (i.e. this)
   * @return {Deferred}                 Return the Deferred.
   *
   * @name  Pot.Deferred.prototype.repeat
   * @class
   * @public
   * 
   * @property {Function} limp   Iterates "repeat" loop with slowest speed.
   * @property {Function} doze   Iterates "repeat" loop with slower speed.
   * @property {Function} slow   Iterates "repeat" loop with slow speed.
   * @property {Function} normal Iterates "repeat" loop with default speed.
   * @property {Function} fast   Iterates "repeat" loop with fast speed.
   * @property {Function} rapid  Iterates "repeat" loop with faster speed.
   * @property {Function} ninja  Iterates "repeat" loop with fastest speed.
   */
  NAME : 'repeat',
  /**
   * @ignore
   */
  method : Pot.Deferred.repeat,
  /**
   * @ignore
   */
  context : null,
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : Pot.Deferred.repeat,
  /**
   * @ignore
   */
  args : function(arg, args) {
    if (Pot.isNumeric(arg)) {
      return [arg - 0].concat(args);
    }
    if (arg && Pot.isNumber(arg.length)) {
      return [arg.length].concat(args);
    }
    if (arg && Pot.isObject(arg) &&
        ('end'  in arg || 'begin' in arg || 'step' in arg ||
         'stop' in arg || 'start' in arg)) {
      return [arg].concat(args);
    }
    return args;
  }
}, {
  /**
   * Iterates indefinitely until "Pot.StopIteration" is thrown. (Asynchronous)
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   var s = '';
   *   d.forEver(function(i) {
   *     s += 'i=' + i + ',';
   *     if (s.length > 25) {
   *       throw Pot.StopIteration;
   *     }
   *   }).then(function() {
   *     debug(s);
   *   }).begin();
   *   // @results  s = 'i=0,i=1,i=2,i=3,i=4,i=5,i=6,'
   *
   *
   * @param  {Function}  callback   An iterable function.
   *                                Throw Pot.StopIteration
   *                                  if you want to stop the loop.
   * @param  {*}         (context)  Optionally, context object. (i.e. this)
   * @return {Deferred}             Return the Deferred.
   *
   * @name  Pot.Deferred.prototype.forEver
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "forEver" loop with slowest speed.
   * @property {Function} doze   Iterates "forEver" loop with slower speed.
   * @property {Function} slow   Iterates "forEver" loop with slow speed.
   * @property {Function} normal Iterates "forEver" loop with default speed.
   * @property {Function} fast   Iterates "forEver" loop with fast speed.
   * @property {Function} rapid  Iterates "forEver" loop with faster speed.
   * @property {Function} ninja  Iterates "forEver" loop with fastest speed.
   */
  NAME : 'forEver',
  /**
   * @ignore
   */
  method : Pot.Deferred.forEver,
  /**
   * @ignore
   */
  context : null,
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : Pot.Deferred.forEver,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return args;
  }
}, {
  /**
   * Iterate an iterable object that is previous chain result.
   *
   * Iteration will use the results of the previous chain.
   *
   * @param  {Function}  callback   An iterable function.
   *                                  function(value, key, object)
   *                                    this == `context`.
   *                                Throw Pot.StopIteration
   *                                  if you want to stop the loop.
   * @param  {Object}    (context)  Optionally, context object. (i.e. this)
   * @return {Deferred}             Return the Deferred.
   *
   * @name  Pot.Deferred.prototype.iterate
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "iterate" loop with slowest speed.
   * @property {Function} doze   Iterates "iterate" loop with slower speed.
   * @property {Function} slow   Iterates "iterate" loop with slow speed.
   * @property {Function} normal Iterates "iterate" loop with default speed.
   * @property {Function} fast   Iterates "iterate" loop with fast speed.
   * @property {Function} rapid  Iterates "iterate" loop with faster speed.
   * @property {Function} ninja  Iterates "iterate" loop with fastest speed.
   */
  NAME : 'iterate',
  /**
   * @ignore
   */
  method : Pot.Deferred.iterate,
  /**
   * @ignore
   */
  context : null,
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : Pot.Deferred.iterate,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  /**
   * Collect the object key and value and make array as items format.
   *
   *
   * @example
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   var d = new Deferred();
   *   d.items().then(function(res) {
   *     debug(res);
   *     // @results [['foo', 1], ['bar', 2], ['baz', 3]]
   *   }).begin(obj);
   *
   *
   * @example
   *   var array = ['foo', 'bar', 'baz'];
   *   var d = new Deferred();
   *   d.items().then(function(res) {
   *     debug(res);
   *     // @results [[0, 'foo'], [1, 'bar'], [2, 'baz']]
   *   }).begin(array);
   *
   *
   * @example
   *   // Example for using callback.
   *   var arr = ['foo', 'bar', 'baz'];
   *   var func = function(item) {
   *     return '(' + item[0] + ')' + item[1];
   *   };
   *   var d = new Deferred();
   *   d.items(func).then(function(res) {
   *     debug(res);
   *     // @results ['(0)foo', '(1)bar', '(2)baz']
   *   }).begin(arr);
   *
   *
   * @example
   *   // Example for using callback.
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   var func = function(item) {
   *     return [item[0] + '::' + item[1]];
   *   };
   *   var d = new Deferred();
   *   d.items(func).then(function(res) {
   *     debug(res);
   *     // @results [['foo::1'], ['bar::2'], ['baz::3']]
   *   }).begin(obj);
   *
   *
   * @param  {Function}     (callback)  (Optional) Callback function.
   *                                      function({Array} item[, object])
   *                                        this == `context`.
   * @param  {*}            (context)   (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {Array}                    The collected items as an array.
   *
   * @name  Pot.Deferred.prototype.items
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "items" loop with slowest speed.
   * @property {Function} doze   Iterates "items" loop with slower speed.
   * @property {Function} slow   Iterates "items" loop with slow speed.
   * @property {Function} normal Iterates "items" loop with default speed.
   * @property {Function} fast   Iterates "items" loop with fast speed.
   * @property {Function} rapid  Iterates "items" loop with faster speed.
   * @property {Function} ninja  Iterates "items" loop with fastest speed.
   */
  NAME : 'items',
  /**
   * @ignore
   */
  method : Pot.Deferred.items,
  /**
   * @ignore
   */
  context : null,
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : Pot.Deferred.items,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  /**
   * Create a new array which has the elements at
   *   position ith of the provided arrays.
   * This function is handled as seen from the longitudinal for array
   *   that is similar to the zip() function in Python.
   *
   * <pre>
   * Example:
   *
   *   arguments:  [[1, 2, 3],
   *                [4, 5, 6]]
   *
   *   results:    [[1, 4],
   *                [2, 5],
   *                [3, 6]]
   * </pre>
   *
   *
   * @link http://docs.python.org/library/functions.html#zip
   *
   *
   * @example
   *   var d = new Deferred();
   *   d.then(function() {
   *     return [[1, 2, 3], [4, 5, 6]];
   *   }).zip().then(function(res) {
   *     debug(res);
   *     // @results
   *     //     [[1, 4], [2, 5], [3, 6]]
   *     //
   *   }).begin();
   *
   *
   * @example
   *   var d = new Deferred();
   *   d.then(function() {
   *     return [[1, 2, 3], [1, 2, 3, 4, 5]];
   *   }).zip().then(function(res) {
   *     debug(res);
   *     // @results
   *     //     [[1, 1], [2, 2], [3, 3]]
   *     //
   *   }).begin();
   *
   *
   * @example
   *   var d = new Deferred();
   *   d.then(function() {
   *     return [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11]];
   *   }).zip().then(function(res) {
   *     debug(res);
   *     // @results
   *     //     [[1, 4, 7, 10], [2, 5, 8, 11]]
   *     //
   *   }).begin();
   *
   *
   * @example
   *   begin(function() {
   *     return ['hoge'];
   *   }).zip().then(function(res) {
   *     debug(res);
   *     // @results
   *     //     [['hoge']]
   *     //
   *   });
   *
   *
   * @example
   *   begin(function() {
   *     return [[1], [2], [3]];
   *   }).zip().then(function(res) {
   *     debug(res);
   *     // @results
   *     //     [[1, 2, 3]]
   *     //
   *   });
   *
   *
   * @example
   *   begin(function() {
   *     return [[1, 2, 3], ['foo', 'bar', 'baz'], [4, 5]];
   *   }).zip().then(function(res) {
   *     debug(res);
   *     // @results
   *     //     [[1, 'foo', 4], [2, 'bar', 5]]
   *     //
   *   });
   *
   *
   * @example
   *   var callback = function(items) { return items[0] + items[1]; };
   *   begin(function() {
   *     return [[1, 2, 3], [4, 5, 6]];
   *   }).zip(callback).then(function(res) {
   *     debug(res);
   *     // @results [5, 7, 9]
   *   });
   *
   *
   * @param  {Function} (callback)  (Optional) Callback function.
   *                                  function({Array} items[, {*} object])
   *                                    this == `context`.
   * @param  {*}        (context)   (Optional) Object to use
   *                                  as `this` when executing callback.
   * @return {Array}                A new array of arrays created from
   *                                  provided objects.
   *
   * @name  Pot.Deferred.prototype.zip
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "zip" loop with slowest speed.
   * @property {Function} doze   Iterates "zip" loop with slower speed.
   * @property {Function} slow   Iterates "zip" loop with slow speed.
   * @property {Function} normal Iterates "zip" loop with default speed.
   * @property {Function} fast   Iterates "zip" loop with fast speed.
   * @property {Function} rapid  Iterates "zip" loop with faster speed.
   * @property {Function} ninja  Iterates "zip" loop with fastest speed.
   */
  NAME : 'zip',
  /**
   * @ignore
   */
  method : Pot.Deferred.zip,
  /**
   * @ignore
   */
  context : null,
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : Pot.Deferred.zip,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  /**
   * Creates a new object with the results of calling a
   *   provided function on every element in chains result.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.map
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     return ['foot', 'goose', 'moose'];
   *   }).map(function(word) {
   *     return word.replace(/o/g, 'e');
   *   }).then(function(result) {
   *     debug(result);
   *   }).begin();
   *   // @results result = ['feet', 'geese', 'meese']
   *
   *
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {*}                        Return the result of each callbacks.
   *
   * @name  Pot.Deferred.prototype.map
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "map" loop with slowest speed.
   * @property {Function} doze   Iterates "map" loop with slower speed.
   * @property {Function} slow   Iterates "map" loop with slow speed.
   * @property {Function} normal Iterates "map" loop with default speed.
   * @property {Function} fast   Iterates "map" loop with fast speed.
   * @property {Function} rapid  Iterates "map" loop with faster speed.
   * @property {Function} ninja  Iterates "map" loop with fastest speed.
   */
  NAME : 'map',
  /**
   * @ignore
   */
  method : Pot.Iter.map,
  /**
   * @ignore
   */
  context : {iterateSpeed : Pot.Deferred.iterate},
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : null,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  /**
   * Creates a new object with all elements that
   *  pass the test implemented by the provided function.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.filter
   *
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     return [12, 5, 8, 130, 44];
   *   }).filter(function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *   }).begin();
   *   // @results [12, 130, 44]
   *
   *
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {*}                        Return the result of each callbacks.
   *
   * @name  Pot.Deferred.prototype.filter
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "filter" loop with slowest speed.
   * @property {Function} doze   Iterates "filter" loop with slower speed.
   * @property {Function} slow   Iterates "filter" loop with slow speed.
   * @property {Function} normal Iterates "filter" loop with default speed.
   * @property {Function} fast   Iterates "filter" loop with fast speed.
   * @property {Function} rapid  Iterates "filter" loop with faster speed.
   * @property {Function} ninja  Iterates "filter" loop with fastest speed.
   */
  NAME : 'filter',
  /**
   * @ignore
   */
  method : Pot.Iter.filter,
  /**
   * @ignore
   */
  context : {iterateSpeed : Pot.Deferred.iterate},
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : null,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  /**
   * Apply a function against an accumulator and each value of
   *  the object (from left-to-right) as to reduce it to a single value.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.reduce
   *
   *
   * @example
   *   Pot.Deferred.begin(function() {
   *     return [1, 2, 3, 4, 5];
   *   }).reduce(function(a, b) {
   *     return a + b;
   *   }).then(function(result) {
   *     debug(result);
   *   });
   *   // @results 15
   *
   *
   * @param  {Function}  callback    A callback function.
   * @param  {*}         initial     An initial value passed as `callback`
   *                                   argument that will be used on
   *                                   first iteration.
   * @param  {*}         (context)   (Optional) Object to use as
   *                                   the first argument to the
   *                                   first call of the `callback`.
   * @return {*}                     Return the result of each callbacks.
   *
   * @name  Pot.Deferred.prototype.reduce
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "reduce" loop with slowest speed.
   * @property {Function} doze   Iterates "reduce" loop with slower speed.
   * @property {Function} slow   Iterates "reduce" loop with slow speed.
   * @property {Function} normal Iterates "reduce" loop with default speed.
   * @property {Function} fast   Iterates "reduce" loop with fast speed.
   * @property {Function} rapid  Iterates "reduce" loop with faster speed.
   * @property {Function} ninja  Iterates "reduce" loop with fastest speed.
   */
  NAME : 'reduce',
  /**
   * @ignore
   */
  method : Pot.Iter.reduce,
  /**
   * @ignore
   */
  context : {iterateSpeed : Pot.Deferred.iterate},
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : null,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  /**
   * Tests whether all elements in the object pass the
   *  test implemented by the provided function.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.every
   *
   * @example
   *   var d = new Pot.Deferred();
   *   d.then(function() {
   *     return [12, 5, 8, 130, 44];
   *   }).every(function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *     // @results false
   *   }).then(function() {
   *     return [12, 54, 18, 130, 44];
   *   }).every(function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *     // @results true
   *   });
   *   d.begin();
   *
   *
   * @param  {Function}  callback    A callback function.
   * @param  {*}         (context)   (Optional) Object to use
   *                                   as `this` when executing callback.
   * @return {Boolean}               Return the Boolean result by callback.
   *
   * @name  Pot.Deferred.prototype.every
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "every" loop with slowest speed.
   * @property {Function} doze   Iterates "every" loop with slower speed.
   * @property {Function} slow   Iterates "every" loop with slow speed.
   * @property {Function} normal Iterates "every" loop with default speed.
   * @property {Function} fast   Iterates "every" loop with fast speed.
   * @property {Function} rapid  Iterates "every" loop with faster speed.
   * @property {Function} ninja  Iterates "every" loop with fastest speed.
   */
  NAME : 'every',
  /**
   * @ignore
   */
  method : Pot.Iter.every,
  /**
   * @ignore
   */
  context : {iterateSpeed : Pot.Deferred.iterate},
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : null,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  /**
   * Tests whether some element in the object passes the
   *  test implemented by the provided function.
   *
   * Iteration will use the results of the previous chain.
   *
   * This method like Array.prototype.some
   *
   *
   * @example
   *   Pot.Deferred.begin(function() {
   *     return [2, 5, 8, 1, 4];
   *   }).some(function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *     // @results false
   *   }).then(function() {
   *     return [12, 5, 8, 1, 4];
   *   }).some(function(value, index, array) {
   *     return (value >= 10);
   *   }).then(function(result) {
   *     debug(result);
   *     // @results true;
   *   });
   *
   *
   * @param  {Function}  callback    A callback function.
   * @param  {*}         (context)   (Optional) Object to use
   *                                   as `this` when executing callback.
   * @return {Boolean}               Return the Boolean result by callback.
   *
   * @name  Pot.Deferred.prototype.some
   * @class
   * @public
   *
   * @property {Function} limp   Iterates "some" loop with slowest speed.
   * @property {Function} doze   Iterates "some" loop with slower speed.
   * @property {Function} slow   Iterates "some" loop with slow speed.
   * @property {Function} normal Iterates "some" loop with default speed.
   * @property {Function} fast   Iterates "some" loop with fast speed.
   * @property {Function} rapid  Iterates "some" loop with faster speed.
   * @property {Function} ninja  Iterates "some" loop with fastest speed.
   */
  NAME : 'some',
  /**
   * @ignore
   */
  method : Pot.Iter.some,
  /**
   * @ignore
   */
  context : {iterateSpeed : Pot.Deferred.iterate},
  /**
   * @ignore
   */
  speed : true,
  /**
   * @ignore
   */
  iterable : null,
  /**
   * @ignore
   */
  args : function(arg, args) {
    return [arg].concat(args);
  }
}]);

// Update iterator methods for Pot
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Creates a new object with the results of calling a
   *   provided function on every element in object.
   *
   * This method like Array.prototype.map
   *
   *
   * @example
   *   function fuzzyPlural(single) {
   *     return single.replace(/o/g, 'e');
   *   }
   *   var words = ['foot', 'goose', 'moose'];
   *   debug(Pot.map(words, fuzzyPlural));
   *   // @results ['feet', 'geese', 'meese']
   *
   * @example
   *   var object = {foo: 'foo1', bar: 'bar2', baz: 'baz3'};
   *   var result = Pot.map(object, function(value, key) {
   *     return value + '00';
   *   });
   *   debug(result);
   *   // @results {foo: 'foo100', bar: 'bar200', baz: 'baz300'}
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {*}                        Return the result of each callbacks.
   * @name  Pot.map
   * @class
   * @function
   * @static
   * @public
   */
  map : Pot.tmp.createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Pot.Iter.map.apply(context, arguments);
    };
  }),
  /**
   * Creates a new object with all elements that
   *  pass the test implemented by the provided function.
   *
   * This method like Array.prototype.filter
   *
   *
   * @example
   *   function isBigEnough(value, index, array) {
   *     return (value >= 10);
   *   }
   *   var filtered = Pot.filter([12, 5, 8, 130, 44], isBigEnough);
   *   debug(filtered);
   *   // @results [12, 130, 44]
   *
   *
   * @example
   *   function isBigEnough(value, key, object) {
   *     return (value >= 10);
   *   }
   *   var object = {a: 1, b: 20, c: 7, d: 5, e: 27, f: 99};
   *   var result = Pot.filter(object, isBigEnough);
   *   debug(result);
   *   // @results {b: 20, e: 27, f: 99}
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {*}                        Return the result of each callbacks.
   * @name  Pot.filter
   * @class
   * @function
   * @static
   * @public
   */
  filter : Pot.tmp.createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Pot.Iter.filter.apply(context, arguments);
    };
  }),
  /**
   * Apply a function against an accumulator and each value of
   *  the object (from left-to-right) as to reduce it to a single value.
   *
   * This method like Array.prototype.reduce
   *
   *
   * @example
   *   var array = [1, 2, 3, 4, 5];
   *   var total = Pot.reduce(array, function(a, b) { return a + b; });
   *   debug(total);
   *   // @results 15
   *
   * @example
   *   var object = {a: 1, b: 2, c: 3};
   *   var total = Pot.reduce(object, function(a, b) { return a + b; });
   *   debug(total);
   *   // @results 6
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}              initial   An initial value passed as `callback`
   *                                      argument that will be used on
   *                                      first iteration.
   * @param  {*}             (context)  (Optional) Object to use as
   *                                      the first argument to the
   *                                      first call of the `callback`.
   * @return {*}                        Return the result of each callbacks.
   * @name  Pot.reduce
   * @class
   * @function
   * @static
   * @public
   */
  reduce : Pot.tmp.createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Pot.Iter.reduce.apply(context, arguments);
    };
  }),
  /**
   * Tests whether all elements in the object pass the
   *  test implemented by the provided function.
   *
   * This method like Array.prototype.every
   *
   * @example
   *   function isBigEnough(value, index, array) {
   *     return (value >= 10);
   *   }
   *   var passed = Pot.every([12, 5, 8, 130, 44], isBigEnough);
   *   // passed is false
   *   passed = Pot.every([12, 54, 18, 130, 44], isBigEnough);
   *   // passed is true
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {Boolean}                  Return the Boolean result by callback.
   * @name  Pot.every
   * @class
   * @function
   * @static
   * @public
   */
  every : Pot.tmp.createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Pot.Iter.every.apply(context, arguments);
    };
  }),
  /**
   * Tests whether some element in the object passes the
   *  test implemented by the provided function.
   *
   * This method like Array.prototype.some
   *
   *
   * @example
   *   function isBigEnough(value, index, array) {
   *     return (value >= 10);
   *   }
   *   var passed = Pot.some([2, 5, 8, 1, 4], isBigEnough);
   *   // passed is false
   *   passed = Pot.some([12, 5, 8, 1, 4], isBigEnough);
   *   // passed is true
   *
   *
   * @param  {Array|Object|*} object    A target object.
   * @param  {Function}       callback  A callback function.
   * @param  {*}             (context)  (Optional) Object to use
   *                                      as `this` when executing callback.
   * @return {Boolean}                  Return the Boolean result by callback.
   * @name  Pot.some
   * @class
   * @function
   * @static
   * @public
   */
  some : Pot.tmp.createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Pot.Iter.some.apply(context, arguments);
    };
  }),
  /**
   * Create continuously array that
   *  has numbers between start number and end number.
   *
   * First argument can given an object that has "begin, end, step" any keys.
   *
   * This function can be a letter rather than just numbers.
   *
   * @example
   *   var numbers = Pot.range(1, 5);
   *   debug(numbers); // @results [1, 2, 3, 4, 5]
   *   var chars = Pot.range('a', 'f');
   *   debug(chars);   // @results ['a', 'b', 'c', 'd', 'e', 'f']
   *   var ranges = Pot.range({begin: 0, step: 10, end: 50});
   *   debug(ranges);  // @results [0, 10, 20, 30, 40, 50]
   *
   *
   * @param  {Number|Object}  end/begin  The end number or object.
   * @param  {Number}         (end)      (optinal) The end number.
   * @param  {Number}         (step)     (optinal) The step number.
   * @return {Array}                     Return an array result.
   * @function
   * @static
   * @public
   */
  range : function(/*[begin,] end[, step]*/) {
    return Pot.Iter.range.apply(null, arguments);
  },
  /**
   * Returns the first index at which a
   *  given element can be found in the object, or -1 if it is not present.
   *
   * This method like Array.prototype.indexOf
   *
   *
   * @example
   *   var array = [2, 5, 9];
   *   var index = Pot.indexOf(array, 2);
   *   // index is 0
   *   index = Pot.indexOf(array, 7);
   *   // index is -1
   *   var object = {a: 2, b: 5, c: 9};
   *   index = Pot.indexOf(object, 2);
   *   // index is 'a'
   *   index = Pot.indexOf(object, 7);
   *   // index is -1
   *
   *
   * @param  {Array|Object|*} object  A target object.
   * @param  {*}              subject A subject object.
   * @param  {*}              (from)  (Optional) The index at
   *                                    which to begin the search.
   *                                  Defaults to 0.
   * @return                          Return the index of result, or -1.
   * @function
   * @static
   * @public
   */
  indexOf : function() {
    return Pot.Iter.indexOf.apply(null, arguments);
  },
  /**
   * Returns the last index at which a
   *  given element can be found in the object, or -1 if it is not present.
   *
   * This method like Array.prototype.lastIndexOf
   *
   *
   * @example
   *   debug('array');
   *   var index, array = [2, 5, 9, 2];
   *   index = Pot.lastIndexOf(array, 2);
   *   debug('index is 3 : result = ' + index);   // 3
   *   index = Pot.lastIndexOf(array, 7);
   *   debug('index is -1 : result = ' + index);  // -1
   *   index = Pot.lastIndexOf(array, 2, 3);
   *   debug('index is 3 : result = ' + index);   // 3
   *   index = Pot.lastIndexOf(array, 2, 2);
   *   debug('index is 0 : result = ' + index);   // 0
   *   index = Pot.lastIndexOf(array, 2, -2);
   *   debug('index is 0 : result = ' + index);   // 0
   *   index = Pot.lastIndexOf(array, 2, -1);
   *   debug('index is 3 : result = ' + index);   // 3
   *   debug('object');
   *   var object = {a: 2, b: 5, c: 9, d: 2};
   *   index = Pot.lastIndexOf(object, 2);
   *   debug('index is  d : result = ' + index);  // 'd'
   *   index = Pot.lastIndexOf(object, 7);
   *   debug('index is -1 : result = ' + index);  // -1
   *   index = Pot.lastIndexOf(object, 2, 'd');   // 'd'
   *   debug('index is  d : result = ' + index);
   *   index = Pot.lastIndexOf(object, 2, 'c');   // 'a'
   *   debug('index is  a : result = ' + index);
   *
   *
   * @param  {Array|Object|*} object  A target object.
   * @param  {*}              subject A subject object.
   * @param  {*}             (from)   (Optional) The index at which to
   *                                    start searching backwards.
   *                                  Defaults to the array's length.
   * @return                          Return the index of result, or -1.
   * @function
   * @static
   * @public
   */
  lastIndexOf : function() {
    return Pot.Iter.lastIndexOf.apply(null, arguments);
  }
});

delete Pot.tmp.createIterators;
delete Pot.tmp.createProtoIterators;
delete Pot.tmp.createSyncIterator;
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
        switch (Pot.typeOf(object)) {
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
              break;
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
            if (Pot.isFunction(value)) {
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
     * @param  {*}         text      A target JSON string object.
     * @param  {*}        (reviver)  (Optional) Unimplemented.
     * @return {String}              Return the parsed object.
     * @type   Function
     * @function
     * @static
     * @public
     */
    parseFromJSON : update(function(text/*[, reviver]*/) {
      var me = arguments.callee, o;
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
})();

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
   * @param  {Object|Array|*}  params    The target object.
   * @return {String}                    The query-string of builded result.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  serializeToQueryString : function(params) {
    var queries = [], encode;
    if (Pot.isString(params)) {
      return stringify(params);
    } else if (!params || params == false) {
      return '';
    }
    if (Pot.isObject(params) || Pot.isArrayLike(params)) {
      encode = Pot.URI.urlEncode;
      each(params, function(v, k) {
        var item, key, val, sep, ok = true;
        item = Pot.isArray(v) ? v : [k, v];
        try {
          key = stringify(item[0], false);
          val = stringify(item[1], false);
        } catch (e) {
          ok = false;
        }
        if (ok && (key || val)) {
          sep = key ? '=' : '';
          queries[queries.length] = encode(key) + sep + encode(val);
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
    if (Pot.isObject(queryString) || Pot.isArray(queryString)) {
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
        var key, val, pair;
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
          if (toObject) {
            result[key] = val;
          } else {
            result[result.length] = [key, val];
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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of URI.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * URI utilities.
   *
   * @name Pot.URI
   * @type Object
   * @class
   * @static
   * @public
   */
  URI : {}
});

update(Pot.URI, {
  /**
   * @lends Pot.URI
   */
  /**
   * Encode the URI string.
   *
   * @param  {String}  string  The subject string.
   * @return {String}          The encoded string.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  urlEncode : update(function(string) {
    var result = '', me = arguments.callee, s;
    s = stringify(string, true);
    if (s) {
      if (Pot.isPercentEncoded(s)) {
        result = s;
      } else {
        try {
          result = me.encoder.component(s);
        } catch (e) {
          result = me.encoder.encode(s);
        }
      }
    }
    return stringify(result, true);
  }, {
    /**
     * @ignore
     */
    encoder : {
      /**
       * @ignore
       */
      component : function(string) {
        return encodeURIComponent(string);
      },
      /**
       * Simple URL encode for Surrogate Pair (URIError).
       *
       * @private
       * @ignore
       */
      encode : function(string) {
        var result = '', s, re, rep, per;
        s = stringify(string, true);
        if (s) {
          re = /[^!'-*.0-9A-Z_a-z~-]/g;
          per = '%';
          /**@ignore*/
          rep = function(s) {
            var r, c = s.charCodeAt(0);
            if (c < 0x10) {
              r = per + '0' + c.toString(16);
            } else if (c < 0x80) {
              r = per + c.toString(16);
            } else if (c < 0x800) {
              r = per + (c >> 0x06 | 0xC0).toString(16) +
                  per + (c  & 0x3F | 0x80).toString(16);
            } else {
              r = per + (c >> 0x0C | 0xE0).toString(16) +
                  per + (c >> 0x06 & 0x3F | 0x80).toString(16) +
                  per + (c  & 0x3F | 0x80).toString(16);
            }
            return r.toUpperCase();
          };
          result = s.replace(re, rep);
        }
        return result;
      }
    }
  }),
  /**
   * Decode the URI string.
   *
   * @param  {String}  string  The subject string.
   * @return {String}          The decoded string.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  urlDecode : update(function(string) {
    var result = '', me = arguments.callee, s;
    s = stringify(string, true);
    if (s) {
      s = s.replace(me.decoder.reSpace.from, me.decoder.reSpace.to);
      try {
        result = me.decoder.component(s);
      } catch (e) {
        result = me.decoder.decode(s);
      }
    }
    return stringify(result, true);
  }, {
    /**
     * @ignore
     */
    decoder : {
      /**
       * @ignore
       */
      reSpace : {
        from  : /[+]/g,
        to    : ' '
      },
      /**
       * @ignore
       */
      component : function(string) {
        return decodeURIComponent(string);
      },
      /**
       * Simple URL decode for Surrogate Pair (URIError).
       *
       * @private
       * @ignore
       */
      decode : function(string) {
        var result = '', s, re, rep;
        s = stringify(string, true);
        if (s) {
          re = new RegExp([
            '%', '(?:',  'E', '(?:', '0%[AB]',
                                '|', '[1-CEF]%[89AB]',
                                '|', 'D%[89]',
                               ')',  '[0-9A-F]',
                 '|',    'C[2-9A-F]',
                 '|',    'D[0-9A-F]',
                 ')',    '%[89AB][0-9A-F]',
            '|',         '%[0-7][0-9A-F]'
          ].join(''), 'gi');
          /**@ignore*/
          rep = function(s) {
            var r, c = parseInt(s.substring(1), 16);
            if (c < 0x80) {
              r = c;
            } else if (c < 0xE0) {
              r = ((c & 0x1F) << 6 | parseInt(s.substring(4), 16) & 0x3F);
            } else {
              r = (((c & 0x0F) << 6 | parseInt(s.substring(4), 16) & 0x3F)
                               << 6 | parseInt(s.substring(7), 16) & 0x3F);
            }
            return String.fromCharCode(r);
          };
          result = s.replace(re, rep);
        }
        return result;
      }
    }
  })
});

// Update Pot object.
Pot.update({
  urlEncode : Pot.URI.urlEncode,
  urlDecode : Pot.URI.urlDecode
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Crypt.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Crypt and Hash utilities.
   *
   * @name Pot.Crypt
   * @type Object
   * @class
   * @static
   * @public
   */
  Crypt : {}
});

update(Pot.Crypt, {
  /**
   * @lends Pot.Crypt
   */
  /**
   * String hash function similar to java.lang.String.hashCode().
   *   The hash code for a string is computed as
   *   s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
   *   where s[i] is the ith character of the string and n is the length of
   *   the string.
   * We mod the result to make it between 0 (inclusive) and 2^32 (exclusive).
   *
   *
   * @param  {String|*}  string   A string.
   * @return {Number}             Hash value for `string`,
   *                                between 0 (inclusive)
   *                                 and 2^32 (exclusive).
   *                              The empty string returns 0.
   * @based goog.string.hashCode
   * @type Function
   * @function
   * @public
   * @static
   */
  hashCode : function(string) {
    var result = 0, s, i, len, max;
    max = 0x100000000; // 2^32
    if (string == null) {
      s = String(string);
    } else {
      s = string.toString ? string.toString() : String(string);
    }
    len = s.length;
    for (i = 0; i < len; ++i) {
      result = 31 * result + s.charCodeAt(i);
      result %= max;
    }
    return result;
  }
});

// Update methods for reference.
Pot.update({
  hashCode : Pot.Crypt.hashCode
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Net.
(function() {

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Net utilities.
   *
   * @name Pot.Net
   * @type Object
   * @class
   * @static
   * @public
   */
  Net : {}
});

update(Pot.Net, {
  /**
   * @lends Pot.Net
   */
  /**
   * Send HTTP request.
   *
   *
   * @example
   *   Pot.Net.request('/data.cgi', {
   *     method : 'POST',
   *     sendContent : {
   *       query  : 'Book OR Media',
   *       start  : 0,
   *       length : 15,
   *       format : 'json'
   *     },
   *     mimeType : 'application/json',
   *     headers : {
   *       'Content-Type' : 'text/javascript'
   *     }
   *   }).then(function(res) {
   *     debug(res.responseText);
   *   }, function(err) {
   *     debug('Error!');
   *     debug(err);
   *   });
   *
   *
   * @param  {String}     url      The request URL.
   * @param  {Object}   (options)  Request options.
   *                                 <pre>
   *                                 +----------------------------------
   *                                 | Available options:
   *                                 +----------------------------------
   *                                 - method      : {String}    'GET'
   *                                 - sendContent : {Object}    null
   *                                 - queryString : {Object}    null
   *                                 - username    : {String}    null
   *                                 - password    : {String}    null
   *                                 - headers     : {Object}    null
   *                                 - mimeType    : {String}    null
   *                                 </pre>
   * @return {Deferred}            Return the instance of Pot.Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  request : function(url, options) {
    if (Pot.System.isGreasemonkey) {
      return Pot.Net.requestByGreasemonkey(url, options);
    } else if (Pot.System.isNodeJS) {
      return Pot.Net.requestByNodeJS(url, options);
    } else {
      return Pot.Net.XHR.request(url, options);
    }
  },
  /**
   * The XMLHttpRequest handler object.
   *
   * @type Object
   * @class
   * @public
   * @static
   */
  XHR : {
    /**
     * @lends Pot.Net.XHR
     */
    /**
     * Status constants for XMLHTTP:
     *
     * {@link http://msdn.microsoft.com/library/default.asp?url=/library/
     *         en-us/xmlsdk/html/0e6a34e4-f90c-489d-acff-cb44242fafc6.asp }
     *
     * @enum {Number}
     * @type Object
     * @const
     * @static
     */
    ReadyState : {
      UNINITIALIZED : 0,
      LOADING       : 1,
      LOADED        : 2,
      INTERACTIVE   : 3,
      COMPLETE      : 4
    },
    /**
     * XMLHttpRequest factory.
     *
     * @return {Object}     The XMLHttpRequest object.
     * @type Function
     * @function
     * @public
     * @static
     */
    factory : function() {
      var x, xhr;
      if (Pot.System.isNodeJS) {
        try {
          // Require XMLHttpRequest.js on Node.js.
          // https://github.com/driverdan/node-XMLHttpRequest
          xhr = require('XMLHttpRequest').XMLHttpRequest;
          x = new xhr;
        } catch (e) {}
      }
      if (!x) {
        try {
          x = new XMLHttpRequest();
        } catch (e) {}
        if (!x && Pot.System.hasActiveXObject) {
          each([
            'MSXML2.XMLHTTP.6.0',
            'MSXML2.XMLHTTP.3.0',
            'MSXML2.XMLHTTP',
            'Microsoft.XMLHTTP',
            'Msxml2.XMLHTTP.4.0'
          ], function(prog) {
            try {
              x = new ActiveXObject(prog);
            } catch (e) {}
            if (x) {
              throw Pot.StopIteration;
            }
          });
        }
      }
      return x;
    },
    /**
     * Send HTTP request with the XMLHttpRequest.
     *
     *
     * @example
     *   Pot.Net.XHR.request('/data.cgi', {
     *     method : 'POST',
     *     sendContent : {
     *       query  : 'Book OR Media',
     *       start  : 0,
     *       length : 15,
     *       format : 'json'
     *     },
     *     headers : {
     *       'Content-Type' : 'text/javascript'
     *     }
     *   }).then(function(res) {
     *     debug(res.responseText);
     *   }, function(err) {
     *     debug('Error!');
     *     debug(err);
     *   });
     *
     *
     * @param  {String}     url      The request URL.
     * @param  {Object}   (options)  Request options.
     *                                 <pre>
     *                                 +----------------------------------
     *                                 | Available options:
     *                                 +----------------------------------
     *                                 - method      : {String}    'GET'
     *                                 - sendContent : {Object}    null
     *                                 - queryString : {Object}    null
     *                                 - username    : {String}    null
     *                                 - password    : {String}    null
     *                                 - headers     : {Object}    null
     *                                 - mimeType    : {String}    null
     *                                 </pre>
     * @return {Deferred}            Return the instance of Pot.Deferred.
     * @type Function
     * @function
     * @public
     * @static
     */
    request : (function() {
      /**@ignore*/
      var Request = function(url, options) {
        return new Request.prototype.doit(url, options);
      };
      Request.prototype = update(Request.prototype, {
        /**
         * @ignore
         */
        xhr : null,
        /**
         * @ignore
         */
        url : null,
        /**
         * @ignore
         */
        options : {},
        /**
         * @ignore
         */
        deferred : null,
        /**
         * @private
         * @ignore
         */
        doit : function(url, options) {
          var that = this;
          this.url = stringify(url, true);
          this.deferred = new Pot.Deferred({
            /**@ignore*/
            canceller : function() {
              try {
                that.cancel(true);
              } catch (e) {}
            }
          });
          if (this.url) {
            try {
              this.setOptions(options);
              if (this.factory()) {
                this.open();
                this.setHeaders();
                this.setReadyStateChange();
                this.send();
              }
            } catch (e) {
              try {
                this.cancel(true);
              } catch (ex) {}
              this.deferred.raise(e);
            }
          }
          return this;
        },
        /**
         * @private
         * @ignore
         */
        factory : function() {
          this.xhr = Pot.Net.XHR.factory();
          if (!this.xhr) {
            this.deferred.raise('Failed to create XMLHttpRequest');
            return false;
          } else {
            return true;
          }
        },
        /**
         * @private
         * @ignore
         */
        setOptions : function(options) {
          var defaults, opts;
          defaults = {
            method      : 'GET',
            sendContent : null,
            queryString : null,
            callback    : null,
            username    : null,
            password    : null,
            headers     : null,
            mimeType    : null
          };
          if (Pot.isObject(options)) {
            opts = update({}, options);
          } else {
            opts = {};
          }
          this.options = update({}, defaults, opts || {});
          this.method = trim(this.options.method).toUpperCase();
          if (!this.method) {
            this.method = defaults.method;
          }
          this.url = buildURL(this.url, this.options.queryString);
          this.options.sendContent = stringify(
            Pot.Serializer.serializeToQueryString(this.options.sendContent),
            true
          );
          if ((this.options.method === 'GET' ||
               this.options.method === defaults.method) &&
              (this.options.sendContent)) {
            this.options.method = 'POST';
          }
        },
        /**
         * @private
         * @ignore
         */
        open : function() {
          if (this.options.username != null) {
            this.xhr.open(
              this.options.method,
              this.url,
              true,
              stringify(this.options.username, true),
              stringify(this.options.password, true)
            );
          } else {
            this.xhr.open(this.options.method, this.url, true);
          }
        },
        /**
         * @private
         * @ignore
         */
        setHeaders : function() {
          var that = this, contentType;
          try {
            try {
              if (this.xhr.overrideMimeType &&
                  this.options.mimeType != null) {
                this.xhr.overrideMimeType(this.options.mimeType);
              }
            } catch (e) {}
            this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (this.options.contentType != null) {
              contentType = this.options.contentType;
            }
            if (this.options.headers != null) {
              each(this.options.headers, function(value, name) {
                if (!contentType && /^Content-?Type/i.test(name)) {
                  contentType = value;
                } else {
                  that.xhr.setRequestHeader(name, value);
                }
              });
            }
            if (!contentType &&
                this.options.method === 'POST') {
              contentType = 'application/x-www-form-urlencoded';
            }
            if (contentType) {
              this.xhr.setRequestHeader('Content-Type', contentType);
            }
          } catch (e) {}
        },
        /**
         * @private
         * @ignore
         */
        setReadyStateChange : function() {
          var that = this;
          /**@ignore*/
          this.xhr.onreadystatechange = function() {
            var status = null;
            if (that.xhr.readyState == Pot.Net.XHR.ReadyState.COMPLETE) {
              that.cancel();
              try {
                status = parseInt(that.xhr.status);
                if (!status && that.xhr.responseText) {
                  // 0 or undefined seems to mean cached or local
                  status = 304;
                }
              } catch (e) {}
              // 1223 is apparently a bug in IE
              if ((status >= 200 && status < 300) ||
                  status === 304 || status === 1223) {
                if (Pot.isFunction(that.options.callback)) {
                  Pot.Deferred.flush(function() {
                    that.options.callback.call(
                      that.xhr,
                      that.xhr.responseText, that.xhr
                    );
                  }).ensure(function(res) {
                    that.deferred.begin(that.xhr);
                  });
                } else {
                  that.deferred.begin(that.xhr);
                }
              } else {
                that.deferred.raise(update({}, that.xhr));
                try {
                  that.cancel(true);
                } catch (e) {}
              }
            }
          };
        },
        /**
         * @private
         * @ignore
         */
        cancel : function(isAbort) {
          // IE SUCKS
          try {
            this.xhr.onreadystatechange = null;
          } catch (e) {
            try {
              this.xhr.onreadystatechange = Pot.noop;
            } catch (e) {}
          }
          if (isAbort) {
            try {
              this.xhr.abort();
            } catch (e) {}
          }
        },
        /**
         * @private
         * @ignore
         */
        send : function() {
          this.xhr.send(this.options.sendContent);
          this.deferred.data({
            request : this.xhr
          });
        }
      });
      Request.prototype.doit.prototype = Request.prototype;
      return function(url, options) {
        return (new Request(url, options)).deferred;
      };
    })()
  },
  /**
   * @lends Pot.Net
   */
  /**
   * Send request by Greasemonkey.
   *
   * @internal
   * @private
   * @ignore
   */
  requestByGreasemonkey : function(url, options) {
    var d, opts, maps, type;
    d = new Pot.Deferred();
    opts = update({}, options || {});
    maps = {
      sendContent : 'data',
      mimeType    : 'overrideMimeType',
      username    : 'user'
    };
    each(maps, function(gm, org) {
      if (org in opts) {
        opts[gm] = opts[org];
      }
    });
    opts.method = trim(opts.method).toUpperCase() || 'GET';
    opts.url = buildURL(url, opts.queryString);
    if (opts.data) {
      opts.data = Pot.Serializer.serializeToQueryString(opts.data);
    }
    if (opts.data && opts.method === 'GET') {
      opts.method = 'POST';
    }
    type = opts.contentType;
    if (opts.headers) {
      each(opts.headers, function(v, k) {
        if (!type && /^Content-?Type/i.test(k)) {
          type = v;
          throw Pot.StopIteration;
        }
      });
    }
    if (!type && opts.method === 'POST') {
      type = 'application/x-www-form-urlencoded';
    }
    if (type) {
      opts.headers = update(opts.headers || {}, {
        'Content-Type' : type
      });
    }
    if (opts.onload) {
      d.then(opts.onload);
    }
    if (opts.onerror) {
      d.rescue(opts.onerror);
    }
    update(opts, {
      /**@ignore*/
      onload : function() {
        d.begin.apply(d, arguments);
      },
      /**@ignore*/
      onerror : function() {
        d.raise.apply(d, arguments);
      }
    });
    Pot.Deferred.callLazy(function() {
      var req = GM_xmlhttpRequest(opts);
      d.data({
        request : req
      });
      d.canceller(function() {
        try {
          req.abort();
        } catch (e) {}
      });
    });
    return d;
  },
  /**
   * Send request by Node.js::http(s).
   *
   * @internal
   * @private
   * @ignore
   */
  requestByNodeJS : (function() {
    /**
     * @ignore
     */
    function SimpleRequestByNode(options) {
      return new SimpleRequestByNode.prototype.doit(options);
    }
    /**
     * @ignore
     */
    function SimpleResponseByNode(res) {
      return new SimpleResponseByNode.prototype.init(res);
    }
    // Definition of prototype.
    SimpleResponseByNode.prototype = update(SimpleResponseByNode.prototype, {
      /**
       * @private
       * @ignore
       */
      responseText : '',
      /**
       * @private
       * @ignore
       */
      responseXML : '',
      /**
       * @private
       * @ignore
       */
      status : null,
      /**
       * @private
       * @ignore
       */
      statusText : null,
      /**
       * @private
       * @ignore
       */
      init : function(response) {
        var res = response || {};
        update(this, res, {
          getResponseHeader     : this.getResponseHeader,
          getAllResponseHeaders : this.getAllResponseHeaders,
          responseText          : res.responseText,
          responseXML           : res.responseXML,
          status                : res.status,
          statusText            : res.statusText
        });
        return this;
      },
      /**
       * @private
       * @ignore
       */
      getResponseHeader : function(name) {
        var result = null, key;
        key = stringify(name);
        lkey = key.toLowerCase();
        if (this.headers) {
          if (lkey in this.headers) {
            result = this.headers[lkey];
          } else if (key in this.headers) {
            result = this.headers[key];
          }
        }
        return result;
      },
      /**
       * @private
       * @ignore
       */
      getAllResponseHeaders : function() {
        var results = [], key;
        if (this.headers) {
          for (key in this.headers) {
            results.push(key + ': ' + this.headers[key]);
          }
        }
        return results.join('\r\n');
      }
    });
    // Definition of prototype.
    SimpleRequestByNode.prototype = update(SimpleRequestByNode.prototype, {
      /**
       * @private
       * @ignore
       */
      deferred : null,
      /**
       * @private
       * @ignore
       */
      request : null,
      /**
       * @private
       * @ignore
       */
      response : null,
      /**
       * @private
       * @ignore
       */
      headers : {},
      /**
       * @private
       * @ignore
       */
      requestOptions : {},
      /**
       * @private
       * @ignore
       */
      defaultHeaders : {
        'Accept'     : '*/*',
        'User-Agent' : [
          'Pot.js/', Pot.VERSION,
          ' ', Pot.TYPE,
          ' ', '(Node.js; *)'
        ].join('')
      },
      /**
       * @private
       * @ignore
       */
      doit : function(options) {
        var that = this;
        this.deferred = new Pot.Deferred({
          /**@ignore*/
          canceller : function() {
            try {
              that.abort();
            } catch (e) {}
          }
        });
        this.setOptions(options);
        this.send();
        return this;
      },
      /**
       * @private
       * @ignore
       */
      setOptions : function(options) {
        var opts, method, ssl, uri, host, port, path, auth, data;
        opts = update({}, options || {});
        method = trim(opts.method).toUpperCase() || 'GET';
        ssl = false;
        uri = require('url').parse(opts.url);
        switch (uri.protocol) {
          case 'https:':
              ssl = true;
          case 'http:':
              host = uri.hostname;
              break;
          default:
              throw new Error('Not supported protocol: ' + uri.protocol);
        }
        port = uri.port || (ssl ? 443 : 80);
        path = uri.pathname + (uri.search ? uri.search : '');
        this.headers = update({}, this.defaultHeaders, opts.headers || {});
        this.headers['Host'] = host;
        if (opts.username != null) {
          auth = new Buffer([
            stringify(opts.username, true),
            stringify(opts.password, true)
          ].join(':'));
          this.headers['Authorization'] = 'Basic ' + auth.toString('base64');
        }
        if (method === 'GET' || method === 'HEAD') {
          data = null;
        } else if (data) {
          this.headers['Content-Length'] = Buffer.byteLength(data);
          if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'text/plain;charset=UTF-8';
          }
        }
        this.requestOptions = {
          data : data,
          ssl  : ssl,
          settings  : {
            host    : host,
            port    : port,
            path    : path,
            method  : method,
            headers : this.headers
          }
        };
      },
      /**
       * @private
       * @ignore
       */
      send : function() {
        var that = this, doRequest;
        if (this.requestOptions.ssl) {
          doRequest = require('https').request;
        } else {
          doRequest = require('http').request;
        }
        this.request = doRequest(this.requestOptions.settings, function(res) {
          that.response = new SimpleResponseByNode(res);
          that.response.responseText = '';
          that.response.responseXML  = '';
          that.response.setEncoding('utf8');
          that.response.status = that.response.statusCode;
          if (that.response.status == 200 && !that.response.statusText) {
            that.response.statusText = 'OK';
          }
          that.response.on('data', function(chunk) {
            if (chunk) {
              that.response.responseText += stringify(chunk, true);
            }
          });
          that.response.on('end', function() {
            that.deferred.begin(that.response);
          });
          that.response.on('error', function(err) {
            that.handleError(err);
          });
        }).on('error', function(err) {
          that.handleError(err);
        });
        if (this.requestOptions.data) {
          this.request.write(this.requestOptions.data);
        }
        this.request.end();
      },
      /**
       * @private
       * @ignore
       */
      handleError : function(error) {
        this.response.status = 503;
        this.response.statusText = error;
        this.response.responseText = error && error.stack;
        this.deferred.raise(this.response);
      },
      /**
       * @private
       * @ignore
       */
      abort : function() {
        if (this.response) {
          this.response.responseText = '';
          this.response.responseXML  = '';
        }
        try {
          if (this.request && this.request.abort) {
            this.request.abort();
          }
        } catch (e) {}
      }
    });
    SimpleRequestByNode.prototype.doit.prototype =
      SimpleRequestByNode.prototype;
    SimpleResponseByNode.prototype.init.prototype =
      SimpleResponseByNode.prototype;
    /**@ignore*/
    return function(url, options) {
      var opts = update({}, options || {}, {
        url : url
      });
      return (new SimpleRequestByNode(opts)).deferred;
    };
  })(),
  /**
   * Send request by JSONP.
   *
   *
   * @example
   *   // Same as jQuery.jsonp usage.
   *   var url = 'http://www.example.com/jsonpTest?callback=?';
   *   Pot.Net.requestByJSONP(url, {
   *     queryString : {
   *       q : 'JavaScript OR ECMAScript'
   *     }
   *   }).then(function(data) {
   *     debug(data.results[0].text);
   *   });
   *
   *
   * @param  {String}     url      The request URL.
   * @param  {Object}   (options)  Request options.
   *                                 <pre>
   *                                 +----------------------------------
   *                                 | Available options:
   *                                 +----------------------------------
   *                                 - queryString : {Object} null
   *                                 - callback    : {String} 'callback'
   *                                 </pre>
   * @return {Deferred}            Return the instance of Pot.Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  requestByJSONP : (function() {
    /**@ignore*/
    var PATTERNS = {
      KEY  : /json|call/i,
      DONE : /loaded|complete/
    };
    return function(url, options) {
      var d, opts, context, id, callback, key;
      var doc, uri, head, script, done, defaults;
      defaults = 'callback';
      d = new Pot.Deferred();
      opts    = update({}, options || {});
      context = globals || Pot.Global;
      doc     = Pot.System.currentDocument;
      head    = getHead();
      if (!context || !doc || !head || !url) {
        return d.raise(context || url || head || doc);
      }
      try {
        if (opts.callback) {
          if (Pot.isString(opts.callback)) {
            id = opts.callback;
          } else if (Pot.isFunction(opts.callback)) {
            callback = opts.callback;
          } else if (Pot.isObject(opts.callback)) {
            for (key in opts.callback) {
              defaults = key;
              if (Pot.isString(opts.callback[key])) {
                id = opts.callback[key];
              } else if (Pot.isFunction(opts.callback[key])) {
                callback = opts.callback[key];
              }
              break;
            }
          }
        } else {
          each(opts, function(v, k) {
            if (PATTERNS.KEY.test(k)) {
              defaults = k;
              if (Pot.isString(v)) {
                id = v;
              } else if (Pot.isFunction(v)) {
                callback = v;
              }
              throw Pot.StopIteration;
            }
          });
        }
        if (!id) {
          do {
            id = buildSerial(Pot, '');
          } while (id in context);
        }
        uri = buildURL(
          insertId(url, id, defaults),
          opts.queryString || opts.sendContent
        );
        if (Pot.System.isGreasemonkey) {
          return Pot.Net.requestByGreasemonkey(uri, {
            method : 'GET'
          }).then(function(res) {
            var code = trim(res && res.responseText);
            code = code.replace(/^[^{]*|[^}]*$/g, '');
            return Pot.Serializer.parseFromJSON(code);
          });
        }
        script = doc.createElement('script');
        script.async = 'async';
        if (opts.type) {
          script.type = opts.type;
        }
        if (opts.charset) {
          script.charset = opts.charset;
        }
        /**@ignore*/
        context[id] = function() {
          var args = arguments;
          try {
            delete context[id];
          } catch (e) {
            try {
              context[id] = null;
            } catch (e) {}
          }
          try {
            if (script) {
              script.parentNode.removeChild(script);
            }
            script = undefined;
          } catch (e) {}
          if (Pot.isFunction(callback)) {
            callback.apply(callback, args);
          }
          d.begin.apply(d, args);
        };
        script.src = uri;
        /**@ignore*/
        script.onload =
        /**@ignore*/
        script.onreadystatechange = function(a, isAbort) {
          if (!done && script &&
              (isAbort === 1 || !script.readyState ||
               PATTERNS.DONE.test(script.readyState))
          ) {
            done = true;
            try {
              script.onload = script.onreadystatechange = null;
            } catch (e) {}
            if (head && script && script.parentNode) {
              try {
                head.removeChild(script);
              } catch (e) {}
            }
            script = undefined;
          }
        };
        d.canceller(function() {
          try {
            if (script) {
              script.onload(0, 1);
            }
          } catch (e) {}
        });
        head.insertBefore(script, head.firstChild);
      } catch (e) {
        d.raise(e);
      }
      return d;
    };
  })(),
  /**
   * Non-blocking script loader.
   *
   * @param  {String}             url        The script URL or URI.
   * @param  {Object|Function}   (options)   The loading options.
   * @return {Deferred}                      Return the Deferred.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  loadScript : (function() {
    var PATTERNS;
    if (Pot.System.isNonBrowser || !Pot.System.isNotExtension) {
      return function(url, options) {
        return Pot.Net.request(url, update({
          method   : 'GET',
          mimeType : 'text/javascript',
          headers  : {
            'Content-Type' : 'text/javascript'
          }
        }, options || {})).then(function(res) {
          return Pot.globalEval(res.responseText);
        });
      };
    }
    /**@ignore*/
    PATTERNS = {
      DONE     : /loaded|complete/,
      CALLBACK : /^callback|(?:on|)(?:load(?:ed|)|ready)/i
    };
    return function(url, options) {
      var d, script, opts, doc, head, uri, callback, done;
      d = new Pot.Deferred();
      try {
        if (Pot.isFunction(options)) {
          opts = {callback : opts};
          callback = opts.callback;
        } else {
          opts = update({}, options || {});
          each(opts, function(v, k) {
            if (Pot.isFunction(v)) {
              callback = v;
              if (PATTERNS.CALLBACK.test(k)) {
                throw Pot.StopIteration;
              }
            }
          });
        }
        if (callback) {
          d.then(function() {
            return callback.apply(this, arguments);
          });
        }
        uri = buildURL(url, opts.queryString || opts.sendContent);
        doc = Pot.System.currentDocument;
        head = getHead();
        if (!doc || !head || !uri) {
          return d.raise(uri || head || doc);
        }
        script = doc.createElement('script');
        script.async = 'async';
        script.type = opts.type || 'text/javascript';
        if (opts.charset) {
          script.charset = opts.charset;
        }
        script.src = uri;
        /**@ignore*/
        script.onload =
        /**@ignore*/
        script.onreadystatechange = function(a, isAbort) {
          if (!done && script &&
              (isAbort === 1 || !script.readyState ||
               PATTERNS.DONE.test(script.readyState))
          ) {
            done = true;
            try {
              script.onload = script.onreadystatechange = null;
            } catch (e) {}
            if (head && script && script.parentNode) {
              try {
                head.removeChild(script);
              } catch (e) {}
            }
            script = undefined;
            d.begin();
          }
        };
        d.canceller(function() {
          try {
            if (script) {
              script.onload(0, 1);
            }
          } catch (e) {}
        });
        head.insertBefore(script, head.firstChild);
      } catch (e) {
        d.raise(e);
      }
      return d;
    };
  })()
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Private functions.

/**
 * @private
 * @ignore
 */
function buildURL(url, query) {
  var u, q, p;
  u = stringify(url);
  p = (~u.indexOf('?')) ? '&' : '?';
  q = stringify(Pot.Serializer.serializeToQueryString(query));
  while (u.slice(-1) === p) {
    u = u.slice(0, -1);
  }
  while (q.charAt(0) === p) {
    q = q.substring(1);
  }
  if (q) {
    q = p + q;
  }
  return u ? u + q : null;
}

/**
 * @private
 * @ignore
 */
function getHead() {
  var heads, doc = Pot.System.currentDocument;
  try {
    if (doc.head && Pot.isElement(doc.head)) {
      return doc.head;
    }
  } catch (e) {}
  try {
    heads = doc.getElementsByTagName('head');
    if (heads && Pot.isElement(heads[0])) {
      return heads[0];
    }
  } catch (e) {}
  try {
    return doc.documentElement;
  } catch (e) {}
}

/**
 * @private
 * @ignore
 */
function insertId(url, id, defaults) {
  var uri = stringify(url);
  if (~uri.indexOf('=?')) {
    uri = uri.replace('=?', '=' + id);
  } else if (~uri.indexOf('?')) {
    uri = uri.replace('?', '?' + defaults + '=' + id);
  } else {
    while (uri.slice(-1) === '&') {
      uri = uri.slice(0, -1);
    }
    uri = uri + '?' + defaults + '=' + id;
  }
  return uri;
}

// Update methods for reference.
Pot.update({
  request    : Pot.Net.request,
  jsonp      : Pot.Net.requestByJSONP,
  loadScript : Pot.Net.loadScript
});

})();
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Mozilla XPCOM interfaces/methods.
Pot.update({
  /**
   * XPCOM utilities.
   *
   * @name Pot.XPCOM
   * @type Object
   * @class
   * @static
   * @public
   */
  XPCOM : {}
});

update(Pot.XPCOM, {
  /**
   * @lends Pot.XPCOM
   */
  /**
   * Evaluate JavaScript code in the sandbox.
   *
   * @param  {String}  code   The expression.
   * @param  {String}  url    The sandbox URL.
   * @return {*}              Return the result of expression.
   * @type Function
   * @function
   * @public
   * @static
   */
  evalInSandbox : function(code, url) {
    var result, re, src;
    if (Pot.System.hasComponents) {
      if (!Cu) {
        Pot.System.isWaitable = Pot.System.hasComponents = false;
        return;
      }
      re = /^[\s;]*|[\s;]*$/g;
      src = ['(', ')'].join(stringify(code).replace(re, ''));
      result = Cu.evalInSandbox(src, Cu.Sandbox(url));
    }
    return result;
  },
  /**
   * Wait until condition is true on the thread in non-blocking.
   * If true returned, waiting state will end.
   *
   * @param  {Function|*}  cond  A function or value as condition.
   * @based  Tombloo Lib
   * @type Function
   * @function
   * @public
   * @static
   */
  throughout : function(cond) {
    var thread;
    if (Pot.System.hasComponents) {
      try {
        thread = Cc['@mozilla.org/thread-manager;1']
                .getService(Ci.nsIThreadManager).mainThread;
      } catch (e) {
        Pot.System.isWaitable = Pot.System.hasComponents = false;
      }
      if (thread && Pot.System.hasComponents) {
        do {
          thread.processNextEvent(true);
        } while (cond && !cond());
      }
    }
  },
  /**
   * Get a browser window that was active last.
   *
   * @return {Window}       Return the browser window.
   * @type Function
   * @function
   * @public
   * @static
   */
  getMostRecentWindow : function() {
    var cwin;
    if (Pot.System.hasComponents) {
      try {
        cwin = Cc['@mozilla.org/appshell/window-mediator;1']
              .getService(Ci.nsIWindowMediator)
              .getMostRecentWindow('navigator:browser');
      } catch (e) {
        Pot.System.isWaitable = Pot.System.hasComponents = false;
      }
    }
    return cwin;
  },
  /**
   * Get the specific XUL Window.
   *
   * @param  {String}  uri  The target URI to get.
   *                        Will be the browser window if omitted.
   * @return {Object}       XULWindow.
   * @type Function
   * @function
   * @public
   * @static
   */
  getChromeWindow : function(uri) {
    var result, win, wins, pref;
    if (!Pot.System.hasComponents) {
      return;
    }
    pref = uri || 'chrome://browser/content/browser.xul';
    try {
      wins = Cc['@mozilla.org/appshell/window-mediator;1']
            .getService(Ci.nsIWindowMediator)
            .getXULWindowEnumerator(null);
    } catch (e) {
      Pot.System.isWaitable = Pot.System.hasComponents = false;
      return;
    }
    while (wins.hasMoreElements()) {
      try {
        win = wins.getNext()
            .QueryInterface(Ci.nsIXULWindow).docShell
            .QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindow);
        if (win && win.location &&
            (win.location.href == pref || win.location == pref)) {
          result = win;
          break;
        }
      } catch (e) {}
    }
    return result;
  }
});

// Update Pot object.
Pot.update({
  evalInSandbox       : Pot.XPCOM.evalInSandbox,
  throughout          : Pot.XPCOM.throughout,
  getMostRecentWindow : Pot.XPCOM.getMostRecentWindow,
  getChromeWindow     : Pot.XPCOM.getChromeWindow
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Debug.
Pot.update({
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
  debug : debug
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of globalize method.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Globalizes the Pot object properties.
   *
   *
   * @example
   *   var obj = {
   *     foo : function() { return 'foo'; },
   *     bar : function() { return 'bar'; }
   *   };
   *   globalize(obj);
   *   // e.g.,
   *   debug(window.foo()); // 'foo'
   *   debug(bar());        // 'bar'
   *
   *
   * @example
   *   var result, obj = [1, 2, 3];
   *   //
   *   // Test for before globalization.
   *   try {
   *     result = succeed(obj);
   *   } catch (e) {
   *     // Will be Error: ReferenceError: unique is not defined.
   *     // Call by method to see a long object name from Pot.
   *     result = Pot.Deferred.succeed(obj);
   *     result.map(function(val) {
   *       return val + 100;
   *     }).then(function(res) {
   *       debug(res);
   *       // @results  res = [101, 102, 103]
   *     });
   *   }
   *   //
   *   // Globalize the Pot object methods.
   *   //
   *   Pot.globalize();
   *   //
   *   // Then you can call the short method name easy.
   *   var s = '';
   *   forEach(range('A', 'C'), function(val, key) {
   *     s += val + key;
   *   });
   *   debug(s);
   *   // @results 'A0B0C0'
   *
   *
   * @param  {Object}   (target)    A target object to globalize.
   * @param  {Boolean}  (advised)   (Optional) Whether to not overwrite the
   *                                  global object property names 
   *                                  if a conflict with the Pot object
   *                                  property name.
   * @return {Array}                The property name(s) that not defined by
   *                                  conflict as an array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  globalize : function(target, advised) {
    var result = false, args = arrayize(arguments);
    var inputs, outputs, len, noops = [];
    len = args.length;
    if (len <= 1 && this === Pot && !Pot.isObject(target)) {
      inputs = this;
      if (len >= 1 && Pot.isBoolean(target)) {
        advised = target;
      } else {
        advised = !!target;
      }
    } else if (target && (Pot.isObject(target) ||
               Pot.isFunction(target) || Pot.isArray(target))) {
      inputs = target;
    }
    outputs = Pot.Internal.getExportObject(true);
    if (inputs && outputs) {
      if (inputs === Pot) {
        if (Pot.Internal.exportPot && Pot.Internal.PotExportProps) {
          result = Pot.Internal.exportPot(advised, true, true);
        }
      } else {
        each(inputs, function(prop, name) {
          if (advised && name in outputs) {
            noops[noops.length] = name;
          } else {
            outputs[name] = prop;
          }
        });
        result = noops;
      }
    }
    return result;
  }
});

// Define the export method.
update(Pot.Internal, {
  /**
   * Export the Pot properties.
   *
   * @private
   * @ignore
   * @internal
   */
  exportPot : function(advised, forGlobalScope, allProps, initialize) {
    var outputs, noops = [];
    outputs = Pot.Internal.getExportObject(forGlobalScope);
    if (outputs) {
      if (allProps) {
        each(Pot.Internal.PotExportProps, function(prop, name) {
          if (advised && name in outputs) {
            noops[noops.length] = name;
          } else {
            outputs[name] = prop;
          }
        });
      } else {
        each(Pot.Internal.PotExportObject, function(prop, name) {
          if (advised && name in outputs) {
            noops[noops.length] = name;
          } else {
            outputs[name] = prop;
          }
        });
      }
    }
    if (initialize) {
      outputs = Pot.Internal.getExportObject(
        Pot.System.isNodeJS ? false : true
      );
      if (outputs) {
        update(outputs, Pot.Internal.PotExportObject);
      }
      // for Node.js and CommonJS.
      if ((Pot.System.isNonBrowser ||
           !Pot.System.isNotExtension) && typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = Pot;
        }
        exports.Pot = Pot;
      } else if (typeof define === 'function' && define.amd) {
        // for AMD.
        define('pot', function() {
          return Pot;
        });
      }
      if (outputs && !outputs.Pot) {
        outputs['Pot'] = Pot;
      }
    }
    return noops;
  },
  /**
   * The object to export.
   *
   * @private
   * @ignore
   * @internal
   */
  PotExportObject : {
    Pot : Pot
  },
  /**
   * The properties to export.
   *
   * @private
   * @ignore
   * @internal
   */
  PotExportProps : {
    Pot                    : Pot,
    update                 : update,
    isBoolean              : Pot.isBoolean,
    isNumber               : Pot.isNumber,
    isString               : Pot.isString,
    isFunction             : Pot.isFunction,
    isArray                : Pot.isArray,
    isDate                 : Pot.isDate,
    isRegExp               : Pot.isRegExp,
    isObject               : Pot.isObject,
    isError                : Pot.isError,
    typeOf                 : Pot.typeOf,
    typeLikeOf             : Pot.typeLikeOf,
    StopIteration          : Pot.StopIteration,
    isStopIter             : Pot.isStopIter,
    isIterable             : Pot.isIterable,
    isArrayLike            : Pot.isArrayLike,
    isDeferred             : Pot.isDeferred,
    isIter                 : Pot.isIter,
    isPercentEncoded       : Pot.isPercentEncoded,
    isNumeric              : Pot.isNumeric,
    isInt                  : Pot.isInt,
    isNativeCode           : Pot.isNativeCode,
    isBuiltinMethod        : Pot.isBuiltinMethod,
    isWindow               : Pot.isWindow,
    isDocument             : Pot.isDocument,
    isElement              : Pot.isElement,
    isNodeLike             : Pot.isNodeLike,
    isNodeList             : Pot.isNodeList,
    Deferred               : Pot.Deferred,
    succeed                : Pot.Deferred.succeed,
    failure                : Pot.Deferred.failure,
    wait                   : Pot.Deferred.wait,
    callLater              : Pot.Deferred.callLater,
    callLazy               : Pot.Deferred.callLazy,
    maybeDeferred          : Pot.Deferred.maybeDeferred,
    isFired                : Pot.Deferred.isFired,
    lastResult             : Pot.Deferred.lastResult,
    lastError              : Pot.Deferred.lastError,
    register               : Pot.Deferred.register,
    unregister             : Pot.Deferred.unregister,
    deferrize              : Pot.Deferred.deferrize,
    begin                  : Pot.Deferred.begin,
    flush                  : Pot.Deferred.flush,
    till                   : Pot.Deferred.till,
    parallel               : Pot.Deferred.parallel,
    chain                  : Pot.Deferred.chain,
    forEach                : Pot.forEach,
    repeat                 : Pot.repeat,
    forEver                : Pot.forEver,
    iterate                : Pot.iterate,
    items                  : Pot.items,
    zip                    : Pot.zip,
    Iter                   : Pot.Iter,
    toIter                 : Pot.Iter.toIter,
    map                    : Pot.map,
    filter                 : Pot.filter,
    reduce                 : Pot.reduce,
    every                  : Pot.every,
    some                   : Pot.some,
    range                  : Pot.range,
    indexOf                : Pot.indexOf,
    lastIndexOf            : Pot.lastIndexOf,
    globalEval             : Pot.globalEval,
    localEval              : Pot.localEval,
    hasReturn              : Pot.hasReturn,
    currentWindow          : Pot.currentWindow,
    currentDocument        : Pot.currentDocument,
    currentURI             : Pot.currentURI,
    serializeToJSON        : Pot.Serializer.serializeToJSON,
    parseFromJSON          : Pot.Serializer.parseFromJSON,
    serializeToQueryString : Pot.Serializer.serializeToQueryString,
    parseFromQueryString   : Pot.Serializer.parseFromQueryString,
    urlEncode              : Pot.URI.urlEncode,
    urlDecode              : Pot.URI.urlDecode,
    request                : Pot.Net.request,
    jsonp                  : Pot.Net.requestByJSONP,
    loadScript             : Pot.Net.loadScript,
    evalInSandbox          : Pot.XPCOM.evalInSandbox,
    throughout             : Pot.XPCOM.throughout,
    getMostRecentWindow    : Pot.XPCOM.getMostRecentWindow,
    getChromeWindow        : Pot.XPCOM.getChromeWindow,
    rescape                : rescape,
    arrayize               : arrayize,
    invoke                 : invoke,
    stringify              : stringify,
    trim                   : trim,
    now                    : now,
    hashCode               : Pot.Crypt.hashCode,
    globalize              : Pot.globalize,
    debug                  : Pot.Debug.debug
  }
});

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
                d.destassign = true;
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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Register the Pot object into global.


// Export the Pot object.
Pot.Internal.exportPot(false, false, false, true);


})(this || {});


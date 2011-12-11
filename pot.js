/*!
 * Pot.js - JavaScript utility library
 *
 * Pot.js implements practical tendency as a substitution utility library.
 * That includes asynchronous methods as "Deferred"
 *  for solution to heavy process.
 * That is fully ECMAScript compliant.
 *
 * Version 1.07, 2011-12-11
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
 * @fileoverview   Pot.js utility library
 * @author         polygon planet
 * @version        1.07
 * @date           2011-12-11
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
var Pot = {VERSION : '1.07', TYPE : 'full'},

// A shortcut of prototype methods.
push = Array.prototype.push,
slice = Array.prototype.slice,
splice = Array.prototype.splice,
concat = Array.prototype.concat,
unshift = Array.prototype.unshift,
indexOf = Array.prototype.indexOf,
toString = Object.prototype.toString,
hasOwnProperty = Object.prototype.hasOwnProperty,

// Namespace URIs.
XML_NS_URI   = 'http://www.w3.org/XML/1998/namespace',
HTML_NS_URI  = 'http://www.w3.org/1999/xhtml',
XHTML_NS_URI = 'http://www.w3.org/1999/xhtml',
XLINK_NS_URI = 'http://www.w3.org/1999/xlink',
XSL_NS_URI   = 'http://www.w3.org/1999/XSL/Transform',
SVG_NS_URI   = 'http://www.w3.org/2000/svg',
XUL_NS_URI   = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',

// Constant strings.
UPPER_ALPHAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
LOWER_ALPHAS = 'abcdefghijklmnopqrstuvwxyz',
DIGITS       = '0123456789',

// Regular expression patterns.
RE_JS_ESCAPED      = /\\[ux][0-9a-fA-F]+/,
RE_PERCENT_ENCODED = /^(?:[a-zA-Z0-9_~.-]|%[0-9a-fA-F]{2})*$/,
RE_HTML_ESCAPED    = /&(?:[a-z]\w{0,24}|#(?:x[0-9a-f]{1,8}|[0-9]{1,10}));/i,
RE_ARRAYLIKE       = /List|Collection/i,
RE_EMPTYFN         = /^[(]?[^{]*?[{][\s\u00A0]*[}]\s*[)]?\s*$/,
RE_TRIM            = /^[\s\u00A0\u3000]+|[\s\u00A0\u3000]+$/g,
RE_LTRIM           = /^[\s\u00A0\u3000]+/g,
RE_RTRIM           = /[\s\u00A0\u3000]+$/g,
RE_STRIP           = /[\s\u00A0\u3000]+/g,
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
     * @return {String}  Return the platform as a string.
     * @ignore
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
      var me = arguments.callee, n = me.n + (me.c++);
      if (!isFinite(n) || isNaN(n)) {
        me.c = me.n = n = 0;
      }
      return n;
    }, {
      c : 0,
      n : +'0xC26BEB642C0A'
    }),
    /**
     * Get the export object.
     *
     * @private
     * @ignore
     */
    getExportObject : function(forGlobalScope) {
      var outputs, id, valid;
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
        if (outputs) {
          do {
            id = buildSerial(Pot, '');
          } while (id in outputs);
          outputs[id] = 1;
          valid = (new Function('try{return ' + id + '===1;}catch(e){}'))();
          try {
            delete outputs[id];
          } catch (e) {
            try {
              outputs[id] = (void 0);
            } catch (e) {}
          }
          if (!valid) {
            outputs = Pot.Global;
          }
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
   * @lends Pot
   */
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

// Path/Directory Delimiter
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Delimiter for path.
   *
   * @type  String
   * @static
   * @const
   */
  PATH_DELIMITER : Pot.OS.win ? ';'  : ':',
  /**
   * Delimiter for directory.
   *
   * @type  String
   * @static
   * @const
   */
  DIR_DELIMITER : Pot.OS.win ? '\\' : '/'
});

// Definition of System.
update(Pot.System, (function() {
  var o = {}, g, oe, ce, ov, cv, f;
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
    try {
      oe = document.documentElement;
      if (oe) {
        /**@ignore*/
        f = function() {};
        f.prototype = oe;
        ce = new f;
        if (oe.nodeName === ce.nodeName && oe.nodeType === ce.nodeType) {
          o.canCloneDOM = true;
        }
      }
    } catch (e) {}
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
    ov = {a: 1, b: 2};
    /**@ignore*/
    f = function() {};
    f.prototype = ov;
    cv = new f;
    cv.a = 0;
    if (ov !== cv && ov.a === 1 && cv.a === 0 && ov.b === cv.b) {
      o.canProtoClone = true;
    }
  } catch (e) {}
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
                return (o != null &&
                        (o instanceof Error || Pot.typeOf(o) === low)
                       ) || false;
              };
          case 'date':
              return function(o) {
                return (o != null &&
                        (o instanceof Date || Pot.typeOf(o) === low)
                       ) || false;
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
   * Detect whether the object is plain object.
   *
   *
   * @example
   *   debug(isPlainObject(String));         // false
   *   debug(isPlainObject(new String(''))); // false
   *   debug(isPlainObject(Date));           // false
   *   debug(isPlainObject(new Date()));     // false
   *   debug(isPlainObject(Number));         // false
   *   debug(isPlainObject(new Number(1)));  // false
   *   debug(isPlainObject(Array));          // false
   *   debug(isPlainObject(new Array()));    // false
   *   debug(isPlainObject([]));             // false
   *   debug(isPlainObject(Object));         // false
   *   debug(isPlainObject(new Object()));   // true
   *   debug(isPlainObject({}));             // true
   *   debug(isPlainObject({foo: 'bar'}));   // true
   *
   *
   * @param  {*}        o   A target object to detect.
   * @return {Boolean}      Return true if `o` is a plain object.
   * @type Function
   * @function
   * @static
   * @public
   */
  isPlainObject : function(o) {
    var result = false, p;
    try {
      if (!o || !Pot.isObject(o) ||
          Pot.isElement(o) || Pot.isWindow(o) || Pot.isDocument(o)) {
        throw o;
      }
      if (o.constructor &&
          !hasOwnProperty.call(o, 'constructor') &&
          !hasOwnProperty.call(o.constructor.prototype, 'isPrototypeOf')
      ) {
        throw o;
      }
      for (p in o) {}
      result = (p === undefined || hasOwnProperty.call(o, p));
    } catch (e) {
      result = false;
    }
    return result;
  },
  /**
   * Check whether the argument object is empty.
   *
   *
   * @example
   *   debug(isEmpty(null));                // true
   *   debug(isEmpty(true));                // false
   *   debug(isEmpty(false));               // true
   *   debug(isEmpty(0));                   // true
   *   debug(isEmpty(-524560620));          // false
   *   debug(isEmpty(0.1205562));           // false
   *   debug(isEmpty(''));                  // true
   *   debug(isEmpty('abc'));               // false
   *   debug(isEmpty(new String()));        // true
   *   debug(isEmpty([]));                  // true
   *   debug(isEmpty([1, 2, 3]));           // false
   *   debug(isEmpty([[]]));                // false
   *   debug(isEmpty(new Array()));         // true
   *   debug(isEmpty(new Array('a', 'b'))); // false
   *   debug(isEmpty({a:1, b:2, c:3}));     // false
   *   debug(isEmpty({}));                  // true
   *   debug(isEmpty(new Object()));        // true
   *   debug(isEmpty((void 0)));            // true
   *   debug(isEmpty((function() {})));     // true
   *   var f = function(a, b) {
   *     return a + b;
   *   };
   *   debug(isEmpty(f)); // false
   *
   *
   * @param  {*}        o   The target object to test.
   * @return {Boolean}      Return true if the argument object is empty,
   *                          otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isEmpty : function(o) {
    var empty, p, f;
    switch (Pot.typeLikeOf(o)) {
      case 'object':
          empty = true;
          for (p in o) {
            empty = false;
            break;
          }
          break;
      case 'array':
      case 'string':
          empty = (!o || !o.length);
          break;
      case 'function':
          f = (function() {});
          empty = true;
          for (p in o) {
            if (p in f) {
              continue;
            }
            empty = false;
            break;
          }
          if (empty) {
            if (o.toString() === f.toString() ||
                RE_EMPTYFN.test(o.toString())
            ) {
              if (o.prototype) {
                for (p in o.prototype) {
                  if (p in f.prototype) {
                    continue;
                  }
                  empty = false;
                  break;
                }
              }
            } else {
              empty = false;
            }
          }
          break;
      default:
          empty = (o == false || !o || o == null || o == 0);
          break;
    }
    return empty;
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
   * Check whether the argument object is an instance of Pot.Hash.
   *
   *
   * @example
   *   var obj = {hoge: 1};
   *   var hash = new Pot.Hash();
   *   debug(isHash(obj));  // false
   *   debug(isHash(hash)); // true
   *
   *
   * @param  {Object|*}  x  The target object to test.
   * @return {Boolean}      Return true if the argument object is an
   *                          instance of Pot.Hash, otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isHash : function(x) {
    return x != null && ((x instanceof Pot.Hash) ||
     (x.id   != null && x.id   === Pot.Hash.prototype.id &&
      x.NAME != null && x.NAME === Pot.Hash.prototype.NAME));
  },
  /**
   * Check whether the value is escaped as JavaScript String.
   *
   *
   * @example
   *   debug(isJSEscaped('abc'));                          // false
   *   debug(isJSEscaped('1234567890'));                   // false
   *   debug(isJSEscaped('\\u007b\\x20hoge\\x20\\u007d')); // true
   *   debug(isJSEscaped(null));                           // false
   *   debug(isJSEscaped((void 0)));                       // false
   *
   *
   * @param  {String|*}   s   The target string to test.
   * @return {Boolean}        Return true if the value is escaped,
   *                            otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isJSEscaped : function(s) {
    return RE_JS_ESCAPED.test(s);
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
   * Check whether the value is escaped as HTML/XML String.
   *
   *
   * @example
   *   debug(isHTMLEscaped('abc'));                     // false
   *   debug(isHTMLEscaped('1234567890'));              // false
   *   debug(isHTMLEscaped('&quot;(&gt;_&lt;)&quot;')); // true
   *   debug(isHTMLEscaped(null));                      // false
   *   debug(isHTMLEscaped((void 0)));                  // false
   *
   *
   * @param  {String|*}   s   The target string to test.
   * @return {Boolean}        Return true if the value is escaped,
   *                            otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isHTMLEscaped : function(s) {
    return RE_HTML_ESCAPED.test(s);
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
  },
  /**
   * Check whether the object looks like a DOM Object.
   *
   *
   * @example
   *   debug(isDOMLike({foo: 1, bar: 2, baz: 3}));             // false
   *   debug(isDOMLike('hoge'));                               // false
   *   debug(isDOMLike(window));                               // true
   *   debug(isDOMLike(document));                             // true
   *   debug(isDOMLike(document.body));                        // true
   *   debug(isDOMLike(document.getElementById('container'))); // true
   *   debug(isDOMLike(document.getElementsByTagName('div'))); // true
   *   debug(isDOMLike(document.createTextNode('hoge')));      // true
   *
   *
   * @param  {*}        x   The target object.
   * @return {Boolean}      Whether the object looks like a DOM Object.
   * @type Function
   * @function
   * @static
   * @public
   */
  isDOMLike : (function() {
    var re = new RegExp(
      'X?HTML|XUL|XML|DOM|Element|Node|Entity|Plugin|Worker|' +
      'Character|Data|Comment|Document|Window|Fragment|Range|Event|' +
      'CDATA|Section|Process|Shared|List|Collection|Audio|Video|' +
      'Canvas|Image|Notify|Text|Option|Socket|File|Session|Local',
      'i'
    );
    return function(x) {
      return (Pot.isNodeLike(x) || Pot.isWindow(x) || Pot.isDocument(x)) ||
        x != null && typeof x === 'object' && (
        // Event
        ((x.preventDefault || 'returnValue' in x) &&
          (x.target || x.currentTarget || x.originalTarget || x.pageX)) ||
        // Range
        ((x.selectNode || x.selectNodeContents || x.surroundContents) &&
          (x.cloneRange || x.commonAncestorContainer ||
           x.insertNode || x.compareBoundaryPoints)) ||
        // Selection
        ((x.getRangeAt || x.addRange || x.deleteFromDocument) &&
          (x.anchorNode  || x.anchorOffset || x.focusNode ||
           x.isCollapsed || x.rangeCount)) ||
        // Element.style
        ('cssText' in x &&
          'color' in x && 'margin' in x && 'padding' in x && 'border' in x) ||
        // Attr
        ('ownerElement' in x && 'isId' in x && 'name' in x && 'value' in x) ||
        // Worker
        (x.postMessage && 'terminate' in x) ||
        re.test(toString.call(x))
      );
    };
  })()
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
  if (Pot.System.isNodeJS) {
    uri = (typeof process === 'object' &&
            process.mainModule && process.mainModule.filename) ||
          (typeof __filename === 'string' && __filename);
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
    var me = arguments.callee, id, scope, func, doc, script, head, text;
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
        return Pot.localEval(code, scope || Pot.Global);
      }
      if (scope) {
        if (scope[func].call && scope[func].apply &&
            me.test(func, scope, true)) {
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
          try {
            delete scope[id];
          } catch (e) {
            try {
              scope[id] = (void 0);
            } catch (e) {}
          }
        }
        if (me.worksForGlobal) {
          return scope[func](code);
        }
      }
      if (Pot.System.isNodeJS) {
        return me.doEvalInGlobalNodeJS(func, code);
      }
      if (Pot.System.isWebBrowser &&
          typeof document === 'object') {
        doc = document;
        head = doc.getElementsByTagName('head');
        if (head && head[0]) {
          head = head[0];
        } else {
          head = doc.head || doc.body || doc.documentElement;
        }
        if (head) {
          script = doc.createElement('script');
          script.type = 'text/javascript';
          script.defer = false;
          script.appendChild(doc.createTextNode(code));
          head.appendChild(script);
          head.removeChild(script);
        }
      } else {
        return Pot.localEval(code, scope || Pot.Global);
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
    test : function(func, obj, useCall) {
      var result = false, nop = '(void 0);';
      try {
        if (obj) {
          if (useCall) {
            obj.func.call(null, nop);
          } else {
            obj.func(nop);
          }
        } else {
          if (useCall) {
            func.call(null, nop);
          } else {
            func(nop);
          }
        }
        result = true;
      } catch (e) {
        result = false;
      }
      return result;
    },
    /**
     * @ignore
     */
    doEvalInGlobalNodeJS : function(func, code) {
      var result, me = arguments.callee, vm, script, scope = Pot.Global, id;
      if (me.worksForGlobal == null) {
        try {
          me.worksForGlobal = false;
          do {
            id = buildSerial(Pot, '');
          } while (id in scope);
          scope[func].call(scope, 'var ' + id + '=1;');
          if (id in scope && scope[id] === 1) {
            me.worksForGlobal = true;
          }
          delete scope[id];
        } catch (e) {
          me.worksForGlobal = false;
        }
      }
      if (me.worksForGlobal) {
        result = scope[func].call(scope, code);
      } else if (typeof require !== 'undefined') {
        vm = require('vm');
        if (vm && vm.createScript) {
          script = vm.createScript(code);
          if (script && script.runInThisContext) {
            result = script.runInThisContext();
          }
        }
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
    var that = Pot.globalEval, me = arguments.callee, func, context;
    if (code && that.patterns.valid.test(code)) {
      func = 'eval';
      if (func in globals && that.test(func, globals)) {
        context = globals;
      } else if (func in Pot.Global && that.test(func, Pot.Global)) {
        context = Pot.Global;
      }
      if (context && context[func]) {
        if (context[func].call && context[func].apply &&
            that.test(func, context, true)) {
          return me.doEval(code, context, scope);
        } else if (scope == null) {
          return me.doEval(code, context, scope, true);
        }
      }
      return me.doEvalByFunc(code, scope);
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
    isFunc : /^\s*function\b[^{]*[{][\s\S]*[}][^}]*$/,
    /**
     * @ignore
     */
    clean : /^(?:[{[(']{0}[')\]}]+|)[;\s\u00A0]*|[;\s\u00A0]*$/g,
    /**
     * @ignore
     */
    doEval : function(/*code[, context[, scope[, isSimple]]]*/) {
      try {
        return arguments[1]['eval'].call(
          arguments[2] || arguments[1],
          arguments[0]
        );
      } catch (e) {}
      if (arguments[3]) {
        return arguments[1]['eval'](arguments[0]);
      } else {
        return Pot.localEval.doEvalByFunc(
          arguments[0],
          arguments[2] || arguments[1]
        );
      }
    },
    /**
     * @ignore
     */
    doEvalByFunc : function(code, scope) {
      var that = Pot.localEval, src;
      if (that.isFunc.test(code) ||
          (that.isLiteral.test(code) && !Pot.hasReturn(code))) {
        src = 'return(' + String(code).replace(that.clean, '') + ');';
      } else {
        src = code;
      }
      return (new Function(
        'return(function(){' + src + '}).call(this);'
      )).call(scope);
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
   *   // See source code directly.
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
              '^\\s*function\\b[^{]*[{]' +            // function prefix
        '|' + '[}][^}]*$' +                           // function suffix
        '|' + '/[*][\\s\\S]*?[*]/' +                  // multiline comment
        '|' + '/{2,}[^\\r\\n]*(?:\\r\\n|\\r|\\n|)' +  // single line comment
        '|' + '"(?:\\\\.|[^"\\\\])*"' +               // string literal
        '|' + "'(?:\\\\.|[^'\\\\])*'",                // string literal
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
          s, i, len, c, n, x, z, r, m, cdata, tag, skip;
      code = stringify(
        func && func.toString && func.toString() || String(func)
      );
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
  })(),
  /**
   * Override the method of the object.
   * That enable replace the return value and the arguments variables.
   *
   *
   * @example
   *   var Hoge = {
   *     addHoge : function(value) {
   *       return value + 'hoge';
   *     }
   *   };
   *   debug(Hoge.addHoge('fugafuga'));
   *   // @results 'fugafugahoge'
   *   override(Hoge, 'addHoge', function(inherits, args, self, prop) {
   *     var value = args[0];
   *     var modify = '{{Modified:' + value + '}}';
   *     args[0] = '';
   *     return modify + inherits(args);
   *   });
   *   var result = Hoge.addHoge('fugafuga');
   *   debug(result);
   *   // @results '{{Modified:fugafuga}}hoge'
   *
   *
   * @example
   *   var Numbers = {
   *     NAME   : 'Numbers',
   *     logAdd : function(a, b) {
   *       return this.NAME + ':' + (a + b);
   *     }
   *   };
   *   debug(Numbers.logAdd(1, 2));
   *   // @results  'Numbers:3'
   *   //
   *   override(Numbers, 'logAdd', [[
   *     /\bthis\.NAME\b/,
   *     '"Result"'
   *   ], [
   *     /(["']):(['"])/,
   *     '$1 = $2'
   *   ], [
   *     /\ba\s*[+]\s*b\b/,
   *     '(a * b * 100)'
   *   ]]);
   *   debug(Numbers.logAdd(1, 2));
   *   // @results  'Result = 200'
   *
   *
   * @example
   *   var Numbers = {
   *     NAME   : 'Numbers',
   *     logAdd : function(a, b) {
   *       return this.NAME + ':' + (a + b);
   *     }
   *   };
   *   debug(Numbers.logAdd(1, 2));
   *   // @results  'Numbers:3'
   *   //
   *   override(Numbers, 'logAdd', [
   *     /this\.NAME\s*[+]\s*([()])?\s*["']:['"]\s*[+]/,
   *     '"(*l_l)/"+$1'
   *   ], function(inherits, args, self, prop) {
   *     var a = args[0], b = args[1];
   *     return '{{' + inherits(a + 100, b + 100) + '}}';
   *   });
   *   debug(Numbers.logAdd(1, 2));
   *   // @results  '{{(*l_l)/203}}'
   *
   *
   * @param  {Object}  object
   *         The target object.
   *
   * @param  {String|RegExp|Array}  properties
   *         The method name. (can be multiple).
   *         That can also be specified by regular expressions, and arrays.
   *
   * @param  {Array|RegExp|String}  converters/overrider
   *         (Optional) The converters to replace the function source code
   *           by RegExp patterns.
   *         e.g.
   *           [/\breturn\b\s*([^;]+);/, 'throw $1;']
   *
   * @param  {Function}  overrider/converters
   *         (Optional) The processing function.
   *         The 4 arguments are passed.
   *         <pre>
   *           function(inherits, args, self, prop)
   *             - inherits : {Function}
   *                          Inherits function for the original method.
   *             - args     : {Arguments}
   *                          The original arguments.
   *             - self     : {Object}
   *                          The original object self.
   *             - prop     : {String}
   *                          The target method name.
   *         </pre>
   *
   * @return {Object}    Return the first argument `object`.
   * @type  Function
   * @function
   * @static
   * @public
   * @based Tombloo.addAround
   */
  override : function(object, properties, converters, overrider) {
    var props = [], t;
    if (object && properties && (converters || overrider)) {
      if (overrider) {
        if (Pot.isFunction(converters)) {
          t = converters;
          converters = overrider;
          overrider = t;
        }
      } else {
        if (Pot.isFunction(converters)) {
          overrider = converters;
        }
      }
      if (Pot.isRegExp(converters)) {
        converters = [converters, ''];
      } else if (Pot.isString(converters)) {
        converters = [new RegExp(rescape(converters), 'g'), ''];
      }
      each(arrayize(properties), function(name) {
        if (name) {
          each(object, function(val, prop) {
            if (Pot.isFunction(val) &&
                ((Pot.isRegExp(name) && name.test(prop)) || name == prop)) {
              props[props.length] = prop;
            }
          });
        }
      });
      each(props, function(prop) {
        var method, code, org, patterns, canApply;
        if (hasOwnProperty.call(object, prop)) {
          method = object[prop];
          canApply = !!(object[prop] && object[prop].apply &&
            typeof object[prop].apply === typeof object[prop].call);
          if (converters) {
            code = org = method.toString();
            patterns = arrayize(converters);
            if (!Pot.isArray(patterns[0])) {
              patterns = [patterns];
            }
            each(patterns, function(pattern) {
              var from, to;
              try {
                from = pattern[0];
                to   = pattern[1];
                if (Pot.isString(from)) {
                  from = new RegExp(rescape(from), 'g');
                }
                if (!Pot.isString(to)) {
                  to = '';
                }
                code = code.replace(from, to);
              } catch (e) {}
            });
            if (org !== code) {
              method = Pot.localEval(code, object);
            }
          }
          object[prop] = update(function() {
            var that = this, args = arguments;
            if (Pot.isFunction(overrider)) {
              return overrider.call(that, function() {
                var a = arguments;
                if (a.length === 1 && a[0] && a[0].callee &&
                    a[0].callee === args.callee) {
                  if (canApply) {
                    return method.apply(that, arrayize(a[0]));
                  } else {
                    return invoke(object, prop, arrayize(a[0]));
                  }
                } else {
                  if (canApply) {
                    return method.apply(that, arrayize(a));
                  } else {
                    return invoke(object, prop, arrayize(a));
                  }
                }
              }, args, that, prop);
            } else {
              return method.apply(that, args);
            }
          }, object[prop]);
          if (!object[prop].overridden ||
              Pot.isNumber(object[prop].overridden)) {
            update(object[prop], {
              overridden : ((object[prop].overridden || 0) - 0) + 1
            });
          }
        }
      });
    }
    return object;
  }
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
function numeric(value, defaults) {
  var result = 0, def = 0, args = arguments, me = args.callee, s, m;
  if (!me.PATTERNS) {
    me.PATTERNS = {
      BASE36GZ  : /[g-z]/,
      BASE36G   : /[^a-z0-9]/g,
      BASE36    : /[^a-z0-9]/,
      BASE16    : /[a-f]/,
      MB_DIGITS : /[\uFF10-\uFF19]/,
      COMMAS    : /[,\uFF0C]+/g,
      STRIP     : /[^\w$]/g,
      NUMBERS   :
        /([+-]?(?:0[0-7]+|0x[\da-f]+|(?:\d+[.]?\d*|[.]\d+)(?:e[-+]?\d+)?))/i,
      LEFT_SYMBOLS :
        /^[\s\xA0\u3000\x00-\x20!-\/:-@[-\]^-`{|}~\x7F-\xFF]*/,
      LEFT_NUMBERS :
        /^[^\d]{0,5}((?:0x?|)(?:\d+[.]?\d*|[.]\d+)(?:e[-+]?\d+|))/i
    };
  }
  if (Pot.isNumeric(value)) {
    result = value - 0;
  } else {
    if (args.length >= 2 && Pot.isNumeric(defaults)) {
      result = defaults - 0;
    } else if (value == null) {
      result = 0;
    } else {
      def = 0;
      switch (Pot.typeLikeOf(value)) {
        case 'boolean':
            result = (value == true) ? 1 : 0;
            break;
        case 'string':
            if (!value) {
              result = def;
            } else {
              s = value.replace(RE_STRIP, '')
                       .replace(me.PATTERNS.COMMAS, '');
              if (Pot.Text && me.PATTERNS.MB_DIGITS.test(s)) {
                s = Pot.Text.toHankakuCase(s);
              }
              if ((m = s.match(me.PATTERNS.NUMBERS)) &&
                  s.indexOf(m[1]) === 0) {
                result = m[1] - 0;
              } else {
                if (Pot.Sanitizer && Pot.isJSEscaped(s)) {
                  s = Pot.Sanitizer.unescapeSequence(s);
                }
                if (Pot.Sanitizer && Pot.isHTMLEscaped(s)) {
                  s = Pot.Sanitizer.unescapeHTML(s);
                }
                if (Pot.URI && Pot.isPercentEncoded(s)) {
                  s = Pot.URI.urlDecode(s);
                }
                if ((m = s.match(me.PATTERNS.NUMBERS)) &&
                    s.indexOf(m[1]) === 0) {
                  result = m[1] - 0;
                } else {
                  if (!me.PATTERNS.BASE36.test(s)) {
                    if (me.PATTERNS.BASE36GZ.test(s)) {
                      result = parseInt(s, 36);
                    } else if (me.PATTERNS.BASE16.test(s)) {
                      result = parseInt(s, 16);
                    } else {
                      result = parseInt(s, 10);
                    }
                  } else {
                    s = s.replace(me.PATTERNS.LEFT_SYMBOLS, '');
                    if ((m = s.match(me.PATTERNS.LEFT_NUMBERS))) {
                      result = m[1] - 0;
                    } else if ((m = s.match(me.PATTERNS.NUMBERS))) {
                      result = m[1] - 0;
                    } else {
                      result = parseInt(
                        s.replace(me.PATTERNS.BASE36G, ''),
                        36
                      );
                    }
                  }
                }
              }
            }
            break;
        case 'function':
            result = 0xCAAE163D + (+value.length || 0);
            break;
        case 'regexp':
            s = value.toString();
            if (Pot.Crypt) {
              result = Pot.Crypt.hashCode(s);
            } else {
              result = me(s);
            }
            break;
        case 'array':
            result = value.length;
            break;
        case 'date':
            result = value.getTime();
            break;
        case 'number':
            result = value - 0;
            break;
        case 'object':
            result = 0xA8ADABEC;
            break;
        case 'error':
            result = me(String(
              value.message || value.description || value
            ));
            break;
        default:
            try {
              result = me(Pot.JSON.stringify(value));
            } catch (e) {
              result = me(
                (value == null) ? String(value) : value.toString()
              );
            }
            break;
      }
    }
  }
  return (Pot.isNumeric(result) ? result : def) - 0;
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
   * Cast the value to numerical value.
   * All type of object can be convert.
   *
   *
   * @example
   *   debug(numeric(0));               // 0
   *   debug(numeric(1234567890));      // 1234567890
   *   debug(numeric(new Number(25)));  // 25
   *   debug(numeric(null));            // 0
   *   debug(numeric((void 0)));        // 0
   *   debug(numeric(true));            // 1
   *   debug(numeric(false));           // 0
   *   debug(numeric('abc'));           // 2748
   *   debug(numeric('0xFF'));          // 255
   *   debug(numeric('1e8'));           // 100000000
   *   debug(numeric('10px'));          // 10
   *   debug(numeric('1,000,000ms.'));  // 1000000
   *   debug(numeric('-512 +1'));       // -512
   *   debug(numeric([]));              // 0
   *   debug(numeric(['hoge']));        // 1
   *   debug(numeric(new Date()));      // 1323446177282
   *
   *
   * @param  {String|*}   value    The target value to convert numeric value.
   * @param  {Number}   (defaults) The default value if `value` is not numeric.
   * @return {Number}              Return the numeric value.
   * @type Function
   * @function
   * @static
   * @public
   */
  numeric : numeric,
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
   * Get the current time as milliseconds.
   *
   *
   * @example
   *   var time = now(); // equals (new Date()).getTime();
   *   debug(time); // 1323446177282
   *
   *
   * @return    Return the current time as milliseconds.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  now : now,
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
    var args = arguments, func, context, err, rep;
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
    if (!this.async && this.waiting === true && Pot.System.isWaitable) {
      Pot.XPCOM.throughout(function() {
        return that.waiting !== true;
      });
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
    var
    name,
    /**@ignore*/
    create = function(speed) {
      var interval;
      if (Pot.Internal.LightIterator.speeds[speed] === undefined) {
        interval = Pot.Internal.LightIterator.defaults.speed;
      } else {
        interval = Pot.Internal.LightIterator.speeds[speed];
      }
      return creator(interval);
    },
    methods = {},
    construct = create();
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
    var methods, construct,
    /**@ignore*/
    create = function(speed) {
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
    if (!params || params == false) {
      return '';
    }
    if (typeof Buffer !== 'undefined' && params.constructor === Buffer) {
      return params;
    }
    if (Pot.isString(params)) {
      return stringify(params);
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
          re = new RegExp(
            '%' + '(?:' + 'E' + '(?:' + '0%[AB]' +
                                  '|' + '[1-CEF]%[89AB]' +
                                  '|' + 'D%[89]' +
                                 ')'  + '[0-9A-F]' +
                    '|' + 'C[2-9A-F]' +
                    '|' + 'D[0-9A-F]' +
                  ')' +   '%[89AB][0-9A-F]' +
            '|' +         '%[0-7][0-9A-F]',
            'gi'
          );
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
  }),
  /**
   * Parse the URI string to an object that has keys like "location" object.
   *
   * @desc
   * <pre>
   * from: RFC 3986
   *
   *     URI Generic Syntax
   *     Parsing a URI Reference with a Regular Expression
   *
   * As the "first-match-wins" algorithm is identical to the "greedy"
   * disambiguation method used by POSIX regular expressions, it is
   * natural and commonplace to use a regular expression for parsing the
   * potential five components of a URI reference.
   *
   * The following line is the regular expression for breaking-down a
   * well-formed URI reference into its components.
   *
   *     ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
   *      12            3  4          5       6  7        8 9
   *
   * The numbers in the second line above are only to assist readability;
   * they indicate the reference points for each subexpression (i.e., each
   * paired parenthesis).  We refer to the value matched for subexpression
   * <n> as $<n>.  For example, matching the above expression to
   *
   *     http://www.ics.uci.edu/pub/ietf/uri/#Related
   *
   * results in the following subexpression matches:
   *
   *     $1 = http:
   *     $2 = http
   *     $3 = //www.ics.uci.edu
   *     $4 = www.ics.uci.edu
   *     $5 = /pub/ietf/uri/
   *     $6 = <undefined>
   *     $7 = <undefined>
   *     $8 = #Related
   *     $9 = Related
   *
   * where <undefined> indicates that the component is not present, as is
   * the case for the query component in the above example.  Therefore, we
   * can determine the value of the five components as
   *
   *     scheme    = $2
   *     authority = $4
   *     path      = $5
   *     query     = $7
   *     fragment  = $9
   *
   * Going in the opposite direction, we can recreate a URI reference from
   * its components by using the algorithm of Section 5.3.
   * </pre>
   *
   *
   * @example
   *   //
   *   // This results contains all the keys and values.
   *   //
   *   var uri, result;
   *   uri = 'http://user:pass@host:8000/path/to/file.ext?arg=value#fragment';
   *   result = parseURI(uri);
   *   debug(result);
   *   // @results
   *   //   {
   *   //     protocol  : 'http:',
   *   //     scheme    : 'http',
   *   //     userinfo  : 'user:pass',
   *   //     username  : 'user',
   *   //     password  : 'pass',
   *   //     host      : 'host:8000',
   *   //     hostname  : 'host',
   *   //     port      : '8000',
   *   //     pathname  : '/path/to/file.ext',
   *   //     dirname   : '/path/to',
   *   //     filename  : 'file.ext',
   *   //     extension : 'ext',
   *   //     search    : '?arg=value',
   *   //     query     : 'arg=value',
   *   //     hash      : '#fragment',
   *   //     fragment  : 'fragment'
   *   //   }
   *
   *
   * @example
   *   var uri = 'file:///C:/foo/bar/baz.js';
   *   var result = parseURI(uri);
   *   debug(result);
   *   // @results
   *   //   {
   *   //     protocol  : 'file:',
   *   //     scheme    : 'file',
   *   //     userinfo  : '',
   *   //     username  : '',
   *   //     password  : '',
   *   //     host      : '',
   *   //     hostname  : '',
   *   //     port      : '',
   *   //     pathname  : 'C:/foo/bar/baz.js',
   *   //     dirname   : 'C:/foo/bar',
   *   //     filename  : 'baz.js',
   *   //     extension : 'js',
   *   //     search    : '',
   *   //     query     : '',
   *   //     hash      : '',
   *   //     fragment  : ''
   *   //   }
   *
   *
   * @param  {String}  uri  The target URI string.
   * @return {Object}       Object of parsing result.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  parseURI : update(function(uri) {
    var result = {}, me = arguments.callee, p,
        parts = stringify(uri, true).match(me.parser.pattern) || [];
    for (p in me.parser.capture) {
      result[p] = stringify(parts[me.parser.capture[p]]);
    }
    return result;
  }, {
    /**
     * @private
     * @ignore
     */
    parser : {
      /**
       * @private
       * @ignore
       */
      pattern : new RegExp(
        '^' +
        '(?:' +
          '(' +                               //  1. protocol
            '([^:/\\\\?#.]+)' +               //  2. scheme
            ':+|' +
          ')' +
          '(?://|[\\\\]+|)' +
        ')' +
        '(?:' +
          '(' +                               //  3. userinfo
                '([^/\\\\?#:]*)' +            //  4. username
                ':' +
                '([^/\\\\?#]*)' +             //  5. password
          '|' + '[^/\\\\?#]*?' +
          ')@|' +
        ')' +
        '(?:[/\\\\]|' +
          '(' +                               //  6. host
            '([-\\w\\d\\u0100-\\uFFFF.%]*)' + //  7. hostname  - domain
            '(?::([0-9]+)|)|' +               //  8. port
          ')' +
        ')' +
        '(' +                                 //  9. pathname  - path
          '(?:([^?#]*)[/\\\\]|)' +            // 10. dirname
          '(' +                               // 11. filename
            '[^/\\\\?#]*?' +
            '(?:[.]([^.?#]*)|)|' +            // 12. extension
          ')' +
          '|[^?#]+|' +
        ')' +
        '([?]' +                              // 13. search
          '([^#]*)|' +                        // 14. query     - queryString
        ')' +
        '(#' +                                // 15. hash
          '(.*)|' +                           // 16. fragment
        ')' +
        '$'
      ),
      /**
       * @private
       * @ignore
       */
      capture : {
        protocol  : 1,
        scheme    : 2,
        userinfo  : 3,
        username  : 4,
        password  : 5,
        host      : 6,
        hostname  : 7,
        port      : 8,
        pathname  : 9,
        dirname   : 10,
        filename  : 11,
        extension : 12,
        search    : 13,
        query     : 14,
        hash      : 15,
        fragment  : 16
      }
    }
  }),
  /**
   * Resolves the incomplete URI.
   * Then, fix the invalid symbols for ".." and "./" etc hierarchies.
   *
   *
   * @example
   *   var uri = 'C:/path/to/foo/bar/../hoge.ext';
   *   var result = resolveRelativeURI(uri);
   *   debug(result);
   *   // @results 'C:/path/to/foo/hoge.ext'
   *
   *
   * @example
   *   var uri = 'C:/path/to/../../hoge.ext';
   *   var result = resolveRelativeURI(uri);
   *   debug(result);
   *   // @results 'C:/hoge.ext'
   *
   *
   * @example
   *   var uri = 'C:/path/to/../../../../././../../hoge.ext';
   *   var result = resolveRelativeURI(uri);
   *   debug(result);
   *   // @results 'C:/hoge.ext'
   *
   *
   * @example
   *   var uri = '/////path/to/////hoge.ext';
   *   var context = document;
   *   var result = resolveRelativeURI(uri, context);
   *   debug(result);
   *   // @results  e.g., 'http://www.example.com/path/to/hoge.ext'
   *
   *
   * @example
   *   var uri = './hoge.png';
   *   var context = document.getElementById('image1');
   *   var result = resolveRelativeURI(uri, context);
   *   debug(result);
   *   // @results  e.g., 'http://www.example.com/dir1/dir2/hoge.png'
   *
   *
   * @example
   *   var uri = '/usr/local/bin/../././hoge.ext';
   *   var result = resolveRelativeURI(uri);
   *   debug(result);
   *   // @results '/usr/local/hoge.ext'
   *
   *
   * @param  {String}   uri      The target URI.
   * @param  {Object}  (context) The completion object that
   *                               is able to reference absolute URI.
   *                               (i.e., document).
   * @return {String}            The result string that has absolute URI.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  resolveRelativeURI : update(function(uri, context) {
    var result = '', args = arguments, me = args.callee,
        sep, cur = '', path, pos, parts, part, subs, len, protocol;
    if (context) {
      cur = context.document || context.ownerDocument;
      if (cur) {
        cur = cur.documentURI || cur.URL ||
              (cur.location && cur.location.href) || ''
      }
    }
    cur = stringify(cur || Pot.currentURI());
    path = trim(trim(uri && (uri.href || uri.path) || uri) || cur);
    if (!path) {
      result = cur;
    } else {
      sep = '/';
      pos = path.indexOf(sep);
      if (Pot.OS.win && !~pos && !~cur.indexOf(sep)) {
        sep = '\\';
      }
      if (cur) {
        if (pos === 0 && me.PATTERNS.PROTOCOL.test(cur)) {
          cur = cur.replace(me.PATTERNS.HOSTS, '$1');
        }
        if (!me.PATTERNS.PROTOCOL.test(path)) {
          path = cur.replace(me.PATTERNS.UNHOSTS, '$1') + path;
        }
      }
      protocol = '';
      if (me.PATTERNS.PROTOCOL.test(path)) {
        path = path.replace(me.PATTERNS.PROTOCOL, function(m) {
          protocol = m;
          return '';
        });
      }
      parts = path.split(me.PATTERNS.SEPARATOR);
      len = parts.length;
      subs = [];
      while (--len >= 0) {
        part = parts.shift();
        if (!part || part.indexOf('.') === 0) {
          if (part === '..') {
            subs.pop();
          }
          continue;
        }
        subs.push(part);
      }
      result = protocol + subs.join(sep);
      // UNIX Path
      if (!me.PATTERNS.PROTOCOL.test(result)) {
        result = sep + result;
      }
    }
    return stringify(result);
  }, {
    /**
     * @private
     * @ignore
     * @const
     */
    PATTERNS : {
      PROTOCOL  : /^([a-zA-Z]\w*:[\/\\]*)/,
      SEPARATOR : /[\/\\]/,
      HOSTS     : /^(\w+:[\/\\]*[^\/\\]*[\/\\]).*$/,
      UNHOSTS   : /([\/\\])[^\/\\]*$/g
    }
  }),
  /**
   * Get the file extension name.
   * This method enabled for URI or URL string etc.
   *
   *
   * @example
   *   var fileName = 'foo.html';
   *   var result = getExt(fileName);
   *   debug(result);
   *   // @results 'html'
   *
   *
   * @example
   *   var fileName = 'C:\\foo\\bar\\baz.tmp.txt';
   *   var result = getExt(fileName);
   *   debug(result);
   *   // @results 'txt'
   *
   *
   * @example
   *   var uri = 'http://www.example.com/file.html?q=hoge.js';
   *   var result = getExt(uri);
   *   debug(result);
   *   // @results 'html'
   *
   *
   * @example
   *   var uri = 'http://www.example.com/?output=hoge.xml#fuga.piyo';
   *   var result = getExt(uri);
   *   debug(result);
   *   // @results 'xml'
   *
   *
   * @example
   *   var uri = 'http://www.example.com/?q=hoge';
   *   var result = getExt(uri);
   *   debug(result);
   *   // @results ''
   *
   *
   * @example
   *   var uri, result;
   *   uri = 'http://www.example.com/http%3A%2F%2Fwww.example.com%2Ffoo%2Ejs';
   *   result = getExt(uri);
   *   debug(result);
   *   // @results 'js'
   *
   *
   * @param  {String}  path  The target filename or URI.
   * @return {String}        The file extension name that
   *                           was excluded dot(.).
   * @type  Function
   * @function
   * @static
   * @public
   */
  getExt : update(function(path) {
    var
    result = '',
    me = arguments.callee,
    re = me.PATTERNS,
    decode = Pot.URI.urlDecode,
    uri = stringify(
      (path && (path.href || path.path)) || path,
      true
    ).replace(re.STRIP, '');
    if (uri && ~uri.indexOf('.')) {
      try {
        result = uri.replace(re.CLEAN, '').match(re.EXT)[1];
      } catch (e) {}
      if (!result) {
        try {
          result = decode(uri.replace(re.HASH, '')).match(re.EXT)[1];
        } catch (e) {}
        if (!result) {
          try {
            result = decode(uri).match(re.EXT)[1];
          } catch (e) {}
          if (!result) {
            try {
              result = decode(uri).match(re.EXTF)[1];
            } catch (e) {}
          }
        }
      }
    }
    return stringify(result);
  }, {
    /**
     * @private
     * @ignore
     * @const
     */
    PATTERNS : {
      EXT   : /[.](\w{1,24})$/,
      EXTF  : /[.]([^.:;*&=#?!\/\\]*)$/,
      HASH  : /#.*$/g,
      CLEAN : /[?#].*$/g,
      STRIP : /[\s\u00A0\u3000]+/g
    }
  }),
  /**
   * Create Data Scheme (data:...).
   *
   * <pre>
   * RFC 2397 - The "data" URL scheme
   * @link http://tools.ietf.org/html/rfc2397
   *
   * data:[<mime type>][;charset=<charset>][;base64],<encoded data>
   * </pre>
   *
   *
   * @example
   *   debug(
   *     toDataURI('Hello World!', 'text/plain', false, 'UTF-8', false)
   *   );
   *   // @results  'data:text/plain;charset=UTF-8,Hello%20World!'
   *
   *
   * @example
   *   debug(
   *     toDataURI('Hello World!', 'text/plain', true, 'UTF-8', false)
   *   );
   *   // @results  'data:text/plain;charset=UTF-8;base64,SGVsbG8gV29ybGQh'
   *
   *
   * @example
   *   debug(
   *     toDataURI({
   *       data     : 'Hello World!',
   *       mimeType : 'html',
   *       base64   : true
   *     })
   *   );
   *   // @results  'data:text/html;base64,SGVsbG8gV29ybGQh'
   *
   *
   * @example
   *   debug(
   *     toDataURI({
   *       data     : 'SGVsbG8gV29ybGQh',
   *       mimeType : 'txt',
   *       base64   : true,
   *       encoded  : true
   *     })
   *   );
   *   // @results  'data:text/plain;base64,SGVsbG8gV29ybGQh'
   *
   *
   * @param  {String|Object}   data     The target data string, or Object.
   *                                      <pre>
   *                                      When specify Object:
   *                                        - data     : {String}
   *                                            Data string.
   *                                        - mimeType : {String}
   *                                            MIMEType or Extension.
   *                                            e.g. 'image/png', 'png' etc.
   *                                        - base64   : {Boolean}
   *                                            True if encode base64.
   *                                        - charset  : {String}
   *                                            Character Encoding.
   *                                        - encoded  : {Boolean}
   *                                            True if already encoded data.
   *                                      </pre>
   * @param  {String}        (mimeType) MIME Type (e.g. 'image/png').
   * @param  {Boolean}       (base64)   Whether the `data` is base64 format.
   * @param  {String}        (charset)  The character code if needed.
   * @return {String}                   The result Data URI.
   *
   * @type Function
   * @function
   * @static
   * @public
   */
  toDataURI : function(data/*[, mimeType
                             [, base64
                             [, charset
                             [, encoded   ]]]]*/) {
    var uri = '', args = arguments, o = {}, p, lp, s,
        isObject = Pot.isObject,
        URI      = Pot.URI,
        MimeType = Pot.MimeType,
        Base64   = Pot.Base64,
        isTwo    = isObject(args[1]);
    if (data) {
      if (args.length <= 2 && (isObject(data) || isTwo)) {
        if (isTwo) {
          data = update({}, args[1], {data : data});
        }
        for (p in data) {
          lp = String(p).toLowerCase();
          if (o.type == null && ~lp.indexOf('mime')) {
            o.type = data[p];
          } else if (o.encoded == null && ~lp.indexOf('enc')) {
            o.encoded = data[p];
          } else if (o.base64 == null && ~lp.indexOf('64')) {
            o.base64 = data[p];
          } else if (o.charset == null && ~lp.indexOf('char')) {
            o.charset = data[p];
          } else if (o.data == null && ~lp.indexOf('data')) {
            o.data = data[p];
          }
        }
      } else {
        o.data    = data;
        o.type    = args[1];
        o.base64  = args[2];
        o.charset = args[3];
        o.encoded = args[4];
      }
      o.type = trim(o.type).toLowerCase();
      if (MimeType && o.type && !~o.type.indexOf('/')) {
        o.type = MimeType.getMimeTypeByExt(o.type);
      }
      if (!o.type) {
        o.type = '*/*';
      }
      if (o.charset) {
        o.charset = ';charset=' + stringify(o.charset, true);
      }
      if (o.base64) {
        o.base64 = ';base64';
      }
      s = stringify(o.data, true);
      if (!o.encoded) {
        if (o.base64) {
          if (Base64) {
            s = Base64.encode(s);
          } else {
            o.base64 = false;
            s = URI.urlEncode(s);
          }
        } else {
          s = URI.urlEncode(s);
        }
      }
    }
    uri = [
      'data:',
      o.type,
      stringify(o.charset, true),
      stringify(o.base64, true),
      ',',
      stringify(s, true)
    ].join('');
    return uri;
  }
});

// Update Pot object.
Pot.update({
  urlEncode          : Pot.URI.urlEncode,
  urlDecode          : Pot.URI.urlDecode,
  parseURI           : Pot.URI.parseURI,
  resolveRelativeURI : Pot.URI.resolveRelativeURI,
  getExt             : Pot.URI.getExt,
  toDataURI          : Pot.URI.toDataURI
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
  },
  /**
   * Calculate the MD5 hash of a string.
   *
   * RFC 1321 - The MD5 Message-Digest Algorithm
   * @link http://www.faqs.org/rfcs/rfc1321
   *
   *
   * @example
   *   debug(md5('apple'));
   *   // @results '1f3870be274f6c49b3e31a0c6728957f'
   *
   *
   * @param  {String}  string  The target string.
   * @return {String}          The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  md5 : (function() {
    /**@ignore*/
    function rl(v, sb) {
      return (v << sb) | (v >>> (32 - sb));
    }
    /**@ignore*/
    function au(x, y) {
      var x4, y4, x8, y8, rv;
      x8 = (x & 0x80000000);
      y8 = (y & 0x80000000);
      x4 = (x & 0x40000000);
      y4 = (y & 0x40000000);
      rv = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
      if (x4 & y4) {
        return (rv ^ 0x80000000 ^ x8 ^ y8);
      }
      if (x4 | y4) {
        if (rv & 0x40000000) {
          return (rv ^ 0xC0000000 ^ x8 ^ y8);
        } else {
          return (rv ^ 0x40000000 ^ x8 ^ y8);
        }
      } else {
        return (rv ^ x8 ^ y8);
      }
    }
    /**@ignore*/
    function f5(x, y, z) { return (x & y) | ((~x) & z); }
    /**@ignore*/
    function g5(x, y, z) { return (x & z) | (y & (~z)); }
    /**@ignore*/
    function i5(x, y, z) { return (y ^ (x | (~z))); }
    /**@ignore*/
    function h5(x, y, z) { return (x ^ y ^ z); }
    /**@ignore*/
    function ff5(a, b, c, d, x, s, ac) {
      a = au(a, au(au(f5(b, c, d), x), ac));
      return au(rl(a, s), b);
    }
    /**@ignore*/
    function gg5(a, b, c, d, x, s, ac) {
      a = au(a, au(au(g5(b, c, d), x), ac));
      return au(rl(a, s), b);
    }
    /**@ignore*/
    function hh5(a, b, c, d, x, s, ac) {
      a = au(a, au(au(h5(b, c, d), x), ac));
      return au(rl(a, s), b);
    }
    /**@ignore*/
    function ii5(a, b, c, d, x, s, ac) {
      a = au(a, au(au(i5(b, c, d), x), ac));
      return au(rl(a, s), b);
    }
    /**@ignore*/
    function convertToWordArray(s) {
      var wc, ml = s.length, t1 = ml + 8,
          t2 = (t1 - (t1 % 64)) / 64,
          nw = (t2 + 1) * 16,
          wa = new Array(nw - 1),
          bp = 0, bc = 0;
      while (bc < ml) {
        wc = (bc - (bc % 4)) / 4;
        bp = (bc % 4) * 8;
        wa[wc] = (wa[wc] | (s.charCodeAt(bc) << bp));
        bc++;
      }
      wc = (bc - (bc % 4)) / 4;
      bp = (bc % 4) * 8;
      wa[wc] = wa[wc] | (0x80 << bp);
      wa[nw - 2] = ml << 3;
      wa[nw - 1] = ml >>> 29;
      return wa;
    }
    /**@ignore*/
    function wordToHex(v) {
      var whv = '', whvt = '', bt, c;
      for (c = 0; c <= 3; c++) {
        bt = (v >>> (c * 8)) & 255;
        whvt = '0' + bt.toString(16);
        whv = whv + whvt.substr(whvt.length - 2, 2);
      }
      return whv;
    }
    /**@ignore*/
    function calc(s) {
      var x, xl, k, AA, BB, CC, DD, a, b, c, d,   S11 = 7,
          S12 = 12, S13 = 17, S14 = 22, S21 = 5,  S22 = 9,
          S23 = 14, S24 = 20, S31 = 4,  S32 = 11, S33 = 16,
          S34 = 23, S41 = 6,  S42 = 10, S43 = 15, S44 = 21;
      x = convertToWordArray(Pot.UTF8.encode(stringify(s, true)));
      a = 0x67452301;
      b = 0xEFCDAB89;
      c = 0x98BADCFE;
      d = 0x10325476;
      xl = x.length;
      for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = ff5(a, b, c, d, x[k +  0], S11, 0xD76AA478);
        d = ff5(d, a, b, c, x[k +  1], S12, 0xE8C7B756);
        c = ff5(c, d, a, b, x[k +  2], S13, 0x242070DB);
        b = ff5(b, c, d, a, x[k +  3], S14, 0xC1BDCEEE);
        a = ff5(a, b, c, d, x[k +  4], S11, 0xF57C0FAF);
        d = ff5(d, a, b, c, x[k +  5], S12, 0x4787C62A);
        c = ff5(c, d, a, b, x[k +  6], S13, 0xA8304613);
        b = ff5(b, c, d, a, x[k +  7], S14, 0xFD469501);
        a = ff5(a, b, c, d, x[k +  8], S11, 0x698098D8);
        d = ff5(d, a, b, c, x[k +  9], S12, 0x8B44F7AF);
        c = ff5(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = ff5(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = ff5(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = ff5(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = ff5(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = ff5(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = gg5(a, b, c, d, x[k +  1], S21, 0xF61E2562);
        d = gg5(d, a, b, c, x[k +  6], S22, 0xC040B340);
        c = gg5(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = gg5(b, c, d, a, x[k +  0], S24, 0xE9B6C7AA);
        a = gg5(a, b, c, d, x[k +  5], S21, 0xD62F105D);
        d = gg5(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = gg5(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = gg5(b, c, d, a, x[k +  4], S24, 0xE7D3FBC8);
        a = gg5(a, b, c, d, x[k +  9], S21, 0x21E1CDE6);
        d = gg5(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = gg5(c, d, a, b, x[k +  3], S23, 0xF4D50D87);
        b = gg5(b, c, d, a, x[k +  8], S24, 0x455A14ED);
        a = gg5(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = gg5(d, a, b, c, x[k +  2], S22, 0xFCEFA3F8);
        c = gg5(c, d, a, b, x[k +  7], S23, 0x676F02D9);
        b = gg5(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = hh5(a, b, c, d, x[k +  5], S31, 0xFFFA3942);
        d = hh5(d, a, b, c, x[k +  8], S32, 0x8771F681);
        c = hh5(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = hh5(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = hh5(a, b, c, d, x[k +  1], S31, 0xA4BEEA44);
        d = hh5(d, a, b, c, x[k +  4], S32, 0x4BDECFA9);
        c = hh5(c, d, a, b, x[k +  7], S33, 0xF6BB4B60);
        b = hh5(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = hh5(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = hh5(d, a, b, c, x[k +  0], S32, 0xEAA127FA);
        c = hh5(c, d, a, b, x[k +  3], S33, 0xD4EF3085);
        b = hh5(b, c, d, a, x[k +  6], S34, 0x4881D05);
        a = hh5(a, b, c, d, x[k +  9], S31, 0xD9D4D039);
        d = hh5(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = hh5(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = hh5(b, c, d, a, x[k +  2], S34, 0xC4AC5665);
        a = ii5(a, b, c, d, x[k +  0], S41, 0xF4292244);
        d = ii5(d, a, b, c, x[k +  7], S42, 0x432AFF97);
        c = ii5(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = ii5(b, c, d, a, x[k +  5], S44, 0xFC93A039);
        a = ii5(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = ii5(d, a, b, c, x[k +  3], S42, 0x8F0CCC92);
        c = ii5(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = ii5(b, c, d, a, x[k +  1], S44, 0x85845DD1);
        a = ii5(a, b, c, d, x[k +  8], S41, 0x6FA87E4F);
        d = ii5(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = ii5(c, d, a, b, x[k +  6], S43, 0xA3014314);
        b = ii5(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = ii5(a, b, c, d, x[k +  4], S41, 0xF7537E82);
        d = ii5(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = ii5(c, d, a, b, x[k +  2], S43, 0x2AD7D2BB);
        b = ii5(b, c, d, a, x[k +  9], S44, 0xEB86D391);
        a = au(a, AA);
        b = au(b, BB);
        c = au(c, CC);
        d = au(d, DD);
      }
      return [
        wordToHex(a), wordToHex(b), wordToHex(c), wordToHex(d)
      ].join('').toLowerCase();
    }
    /**@ignore*/
    return function(string) {
      return calc(string);
    };
  })(),
  /**
   * Calculate the 32-bit CRC (cyclic redundancy checksum) checksum.
   *
   *
   * @example
   *   debug(crc32('abc123'));
   *   // @results  -821904548
   *
   *
   * @param  {String}  string   Data.
   * @return {Number}           CRC checksum.
   * @type  Function
   * @function
   * @static
   * @public
   */
  crc32 : (function() {
    var CRC32MAPS = [
      0x00000000,0x77073096,0xEE0E612C,0x990951BA,0x076DC419,0x706AF48F,
      0xE963A535,0x9E6495A3,0x0EDB8832,0x79DCB8A4,0xE0D5E91E,0x97D2D988,
      0x09B64C2B,0x7EB17CBD,0xE7B82D07,0x90BF1D91,0x1DB71064,0x6AB020F2,
      0xF3B97148,0x84BE41DE,0x1ADAD47D,0x6DDDE4EB,0xF4D4B551,0x83D385C7,
      0x136C9856,0x646BA8C0,0xFD62F97A,0x8A65C9EC,0x14015C4F,0x63066CD9,
      0xFA0F3D63,0x8D080DF5,0x3B6E20C8,0x4C69105E,0xD56041E4,0xA2677172,
      0x3C03E4D1,0x4B04D447,0xD20D85FD,0xA50AB56B,0x35B5A8FA,0x42B2986C,
      0xDBBBC9D6,0xACBCF940,0x32D86CE3,0x45DF5C75,0xDCD60DCF,0xABD13D59,
      0x26D930AC,0x51DE003A,0xC8D75180,0xBFD06116,0x21B4F4B5,0x56B3C423,
      0xCFBA9599,0xB8BDA50F,0x2802B89E,0x5F058808,0xC60CD9B2,0xB10BE924,
      0x2F6F7C87,0x58684C11,0xC1611DAB,0xB6662D3D,0x76DC4190,0x01DB7106,
      0x98D220BC,0xEFD5102A,0x71B18589,0x06B6B51F,0x9FBFE4A5,0xE8B8D433,
      0x7807C9A2,0x0F00F934,0x9609A88E,0xE10E9818,0x7F6A0DBB,0x086D3D2D,
      0x91646C97,0xE6635C01,0x6B6B51F4,0x1C6C6162,0x856530D8,0xF262004E,
      0x6C0695ED,0x1B01A57B,0x8208F4C1,0xF50FC457,0x65B0D9C6,0x12B7E950,
      0x8BBEB8EA,0xFCB9887C,0x62DD1DDF,0x15DA2D49,0x8CD37CF3,0xFBD44C65,
      0x4DB26158,0x3AB551CE,0xA3BC0074,0xD4BB30E2,0x4ADFA541,0x3DD895D7,
      0xA4D1C46D,0xD3D6F4FB,0x4369E96A,0x346ED9FC,0xAD678846,0xDA60B8D0,
      0x44042D73,0x33031DE5,0xAA0A4C5F,0xDD0D7CC9,0x5005713C,0x270241AA,
      0xBE0B1010,0xC90C2086,0x5768B525,0x206F85B3,0xB966D409,0xCE61E49F,
      0x5EDEF90E,0x29D9C998,0xB0D09822,0xC7D7A8B4,0x59B33D17,0x2EB40D81,
      0xB7BD5C3B,0xC0BA6CAD,0xEDB88320,0x9ABFB3B6,0x03B6E20C,0x74B1D29A,
      0xEAD54739,0x9DD277AF,0x04DB2615,0x73DC1683,0xE3630B12,0x94643B84,
      0x0D6D6A3E,0x7A6A5AA8,0xE40ECF0B,0x9309FF9D,0x0A00AE27,0x7D079EB1,
      0xF00F9344,0x8708A3D2,0x1E01F268,0x6906C2FE,0xF762575D,0x806567CB,
      0x196C3671,0x6E6B06E7,0xFED41B76,0x89D32BE0,0x10DA7A5A,0x67DD4ACC,
      0xF9B9DF6F,0x8EBEEFF9,0x17B7BE43,0x60B08ED5,0xD6D6A3E8,0xA1D1937E,
      0x38D8C2C4,0x4FDFF252,0xD1BB67F1,0xA6BC5767,0x3FB506DD,0x48B2364B,
      0xD80D2BDA,0xAF0A1B4C,0x36034AF6,0x41047A60,0xDF60EFC3,0xA867DF55,
      0x316E8EEF,0x4669BE79,0xCB61B38C,0xBC66831A,0x256FD2A0,0x5268E236,
      0xCC0C7795,0xBB0B4703,0x220216B9,0x5505262F,0xC5BA3BBE,0xB2BD0B28,
      0x2BB45A92,0x5CB36A04,0xC2D7FFA7,0xB5D0CF31,0x2CD99E8B,0x5BDEAE1D,
      0x9B64C2B0,0xEC63F226,0x756AA39C,0x026D930A,0x9C0906A9,0xEB0E363F,
      0x72076785,0x05005713,0x95BF4A82,0xE2B87A14,0x7BB12BAE,0x0CB61B38,
      0x92D28E9B,0xE5D5BE0D,0x7CDCEFB7,0x0BDBDF21,0x86D3D2D4,0xF1D4E242,
      0x68DDB3F8,0x1FDA836E,0x81BE16CD,0xF6B9265B,0x6FB077E1,0x18B74777,
      0x88085AE6,0xFF0F6A70,0x66063BCA,0x11010B5C,0x8F659EFF,0xF862AE69,
      0x616BFFD3,0x166CCF45,0xA00AE278,0xD70DD2EE,0x4E048354,0x3903B3C2,
      0xA7672661,0xD06016F7,0x4969474D,0x3E6E77DB,0xAED16A4A,0xD9D65ADC,
      0x40DF0B66,0x37D83BF0,0xA9BCAE53,0xDEBB9EC5,0x47B2CF7F,0x30B5FFE9,
      0xBDBDF21C,0xCABAC28A,0x53B39330,0x24B4A3A6,0xBAD03605,0xCDD70693,
      0x54DE5729,0x23D967BF,0xB3667A2E,0xC4614AB8,0x5D681B02,0x2A6F2B94,
      0xB40BBE37,0xC30C8EA1,0x5A05DF1B,0x2D02EF8D
    ];
    /**@ignore*/
    return function(string) {
      var s, crc = 0, i, n, len;
      s = Pot.UTF8.encode(stringify(string, true));
      len = s.length;
      crc = crc ^ -1;
      for (i = 0; i < len; i++) {
        n = (crc ^ s.charCodeAt(i)) & 0xFF;
        crc = (crc >>> 8) ^ CRC32MAPS[n];
      }
      return crc ^ -1;
    };
  })(),
  /**
   * Calculate the SHA1 hash of a string.
   *
   * RFC 3174 - US Secure Hash Algorithm 1 (SHA1)
   * @link http://www.faqs.org/rfcs/rfc3174
   *
   *
   * @example
   *   debug(sha1('apple'));
   *   // @results 'd0be2dc421be4fcd0172e5afceea3970e2f3d940'
   *
   *
   * @param  {String}  string  The input string.
   * @return {String}          Returns the sha1 hash as a string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  sha1 : (function() {
    /**@ignore*/
    function rl(n, s) {
      var t4 = (n << s) | (n >>> (32 - s));
      return t4;
    }
    /**@ignore*/
    function hex(val) {
      var s = '', i, v;
      for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0F;
        s += v.toString(16);
      }
      return s;
    }
    /**@ignore*/
    function calc(string) {
      var bs, i, j, A, B, C, D, E, W = new Array(80),
          H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE,
          H3 = 0x10325476, H4 = 0xC3D2E1F0,
          wa = [], s, sl, tp;
      s = Pot.UTF8.encode(stringify(string, true));
      sl = s.length;
      for (i = 0; i < sl - 3; i += 4) {
        j = s.charCodeAt(i)     << 24 |
            s.charCodeAt(i + 1) << 16 |
            s.charCodeAt(i + 2) <<  8 |
            s.charCodeAt(i + 3);
        wa[wa.length] = j;
      }
      switch (sl % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = s.charCodeAt(sl - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = s.charCodeAt(sl - 2) << 24 |
                s.charCodeAt(sl - 1) << 16 | 0x08000;
            break;
        case 3:
            i = s.charCodeAt(sl - 3) << 24 |
                s.charCodeAt(sl - 2) << 16 |
                s.charCodeAt(sl - 1) <<  8 | 0x80;
            break;
        default:
            break;
      }
      wa[wa.length] = i;
      while ((wa.length % 16) != 14) {
        wa[wa.length] = 0;
      }
      wa[wa.length] = (sl >>> 29);
      wa[wa.length] = ((sl << 3) & 0x0FFFFFFFF);
      for (bs = 0; bs < wa.length; bs += 16) {
        for (i = 0; i < 16; i++) {
          W[i] = wa[bs + i];
        }
        for (i = 16; i <= 79; i++) {
          W[i] = rl(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        }
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
          tp = (rl(A, 5) + ((B & C) |
                  (~B & D)) + E + W[i] + 0x5A827999) & 0x0FFFFFFFF;
          E = D;
          D = C;
          C = rl(B, 30);
          B = A;
          A = tp;
        }
        for (i = 20; i <= 39; i++) {
          tp = (rl(A, 5) + (B ^ C ^ D) +
                  E + W[i] + 0x6ED9EBA1) & 0x0FFFFFFFF;
          E = D;
          D = C;
          C = rl(B, 30);
          B = A;
          A = tp;
        }
        for (i = 40; i <= 59; i++) {
          tp = (rl(A, 5) + ((B & C) |
                  (B & D) | (C & D)) +
                  E + W[i] + 0x8F1BBCDC) & 0x0FFFFFFFF;
          E = D;
          D = C;
          C = rl(B, 30);
          B = A;
          A = tp;
        }
        for (i = 60; i <= 79; i++) {
          tp = (rl(A, 5) + (B ^ C ^ D) +
                  E + W[i] + 0xCA62C1D6) & 0x0FFFFFFFF;
          E = D;
          D = C;
          C = rl(B, 30);
          B = A;
          A = tp;
        }
        H0 = (H0 + A) & 0x0FFFFFFFF;
        H1 = (H1 + B) & 0x0FFFFFFFF;
        H2 = (H2 + C) & 0x0FFFFFFFF;
        H3 = (H3 + D) & 0x0FFFFFFFF;
        H4 = (H4 + E) & 0x0FFFFFFFF;
      }
      tp = hex(H0) + hex(H1) + hex(H2) + hex(H3) + hex(H4);
      return tp.toLowerCase();
    }
    /**@ignore*/
    return function(string) {
      return calc(string);
    };
  })(),
  /**
   * ARC4 symmetric cipher encryption/decryption.
   *
   * Original algorithm:
   * {@link http://www.mozilla.org/projects/security/pki/nss/
   *         draft-kaukonen-cipher-arcfour-03.txt}
   *
   *
   * @example
   *   // usage:
   *   var arc4 = new Pot.Crypt.Arc4();
   *   arc4.setKey('hoge');
   *   var cipherText = arc4.encrypt('Hello World!');
   *   debug('cipherText = ' + cipherText);
   *   var origText = arc4.decrypt(cipherText);
   *   debug('origText = ' + origText);
   *
   *
   * @param  {String}  (key)  Secret key for encryption.
   * @return {Object}         The instance of Arc4 object.
   *
   * @name Pot.Crypt.Arc4
   * @type Function
   * @constructor
   * @function
   * @public
   */
  Arc4 : (function() {
    /**
     * Emit ciphertext.
     *
     * @internal
     * @ignore
     */
    function arc4Crypt(text, key, table) {
      var r = [], a, i, j, x, y, t, k, n, sc;
      sc = String.fromCharCode;
      a = arrayize(table);
      j = 0;
      t = stringify(text, true);
      k = stringify(key, true);
      n = k.length;
      for (i = 0; i < 256; i++) {
        j = (j + a[i] + k.charCodeAt(i % n)) % 256;
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      i = j = 0;
      n = t.length;
      for (y = 0; y < n; y++) {
        i = (i + 1) % 256;
        j = (j + a[i]) % 256;
        x = a[i];
        a[i] = a[j];
        a[j] = x;
        r[r.length] = sc(t.charCodeAt(y) ^ a[(a[i] + a[j]) % 256]);
      }
      return r.join('');
    }
    /**
     * Arc4 constructor.
     *
     * @param  {String}  (key)  Secret key for encryption.
     * @return {Object}         The instance of Arc4 object.
     * @ignore
     */
    function arc4(key) {
      return new arc4.prototype.init(key);
    }
    arc4.prototype = update(arc4.prototype, {
      /**
       * @lends Pot.Crypt.Arc4
       */
      /**
       * @internal
       * @ignore
       */
      constructor : arc4,
      /**
       * @private
       * @ignore
       */
      table : [],
      /**
       * @private
       * @ignore
       */
      key : null,
      /**
       * Initialize.
       *
       * @param  {String}  key  Secret key for encryption.
       * @return {Object}       The instance of Arc4 object.
       * @ignore
       */
      init : function(key) {
        if (key != null) {
          this.setKey(key);
        }
        this.initTable();
        return this;
      },
      /**
       * @internal
       * @private
       * @ignore
       */
      initTable : function() {
        var i;
        this.table = [];
        for (i = 0; i < 256; i++) {
          this.table[i] = i;
        }
      },
      /**
       * Set the secret key string for encryption.
       *
       * @param  {String}  key  Secret key for encryption.
       * @return {Object}       The instance of Arc4 object.
       * @public
       */
      setKey : function(key) {
        this.key = Pot.UTF8.encode(key);
        return this;
      },
      /**
       * Encrypt given plain text using the key with RC4 algorithm.
       * All parameters and return value are in binary format.
       *
       * @param  {String}  text  Plain text to be encrypted.
       * @return {String}        The encrypted string.
       * @public
       */
      encrypt : function(text) {
        return arc4Crypt(Pot.UTF8.encode(text), this.key, this.table);
      },
      /**
       * Decrypt given cipher text using the key with RC4 algorithm.
       * All parameters and return value are in binary format.
       *
       * @param  {String}  text  Cipher text to be decrypted.
       * @return {String}        The decrypted string.
       * @public
       */
      decrypt : function(text) {
        return Pot.UTF8.decode(arc4Crypt(text, this.key, this.table));
      }
    });
    arc4.prototype.init.prototype = arc4.prototype;
    return arc4;
  })()
});

// Update methods for reference.
Pot.update({
  hashCode : Pot.Crypt.hashCode,
  md5      : Pot.Crypt.md5,
  crc32    : Pot.Crypt.crc32,
  sha1     : Pot.Crypt.sha1,
  Arc4     : Pot.Crypt.Arc4
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
   *                                 - cache       : {Boolean}   true
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
      var x;
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
     *                                 - cache       : {Boolean}   true
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
            mimeType    : null,
            cache       : true
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
          if (!this.options.cache &&
              (this.options.method === 'GET' ||
               this.options.method === 'HEAD')) {
            this.url = addNoCache(this.url);
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
    opts = update({cache : true}, options || {});
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
    if (!opts.cache &&
        (opts.method === 'GET' || opts.method === 'HEAD')) {
      opts.url = addNoCache(opts.url);
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
        opts = update({cache : true}, options || {});
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
        data = opts.sendContent || opts.queryString;
        if (method === 'GET' || method === 'HEAD') {
          path = buildURL(path, data);
          if (!opts.cache) {
            path = addNoCache(path);
          }
          data = null;
        } else {
          data = Pot.Serializer.serializeToQueryString(data);
          if (data) {
            this.headers['Content-Length'] = Buffer.byteLength(data);
            if (!this.headers['Content-Type']) {
              this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
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
   *                                 +------------------------------------
   *                                 | Available options:
   *                                 +------------------------------------
   *                                 - queryString : {Object}   null
   *                                 - cache       : {Boolean}  false
   *                                 - callback    : {String}   'callback'
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
      opts    = update({cache : false}, options || {});
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
        if (!opts.cache) {
          uri = addNoCache(uri);
        }
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
        }, {cache : false}, options || {})).then(function(res) {
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
        if (!opts.cache) {
          uri = addNoCache(uri);
        }
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
function addNoCache(uri) {
  var url = stringify(uri), key, sep = '?', pre = '_';
  if (url) {
    do {
      key = pre + buildSerial(Pot, '').toLowerCase();
    } while (~url.indexOf(key));
    if (~url.indexOf(sep)) {
      sep = '&';
      while (url.slice(-1) === sep) {
        url = url.slice(0, -1);
      }
    }
    url = url + sep + key + '=' + now();
  }
  return url;
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
      src = stringify(code).replace(re, '');
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
    var that = this, evt;
    if (!this.PotInternal.serial) {
      this.PotInternal.serial = buildSerial(this);
    }
    update(this.PotInternal, {
      orgEvent : ev || (typeof window === 'object' && window.event) || {},
      object   : object
    });
    evt = this.PotInternal.orgEvent;
    if (!Pot.isObject(evt)) {
      this.PotInternal.orgEvent = evt = {type : evt};
    }
    each(evt, function(v, p) {
      if (p) {
        if (!(p in that)) {
          that[p] = v;
        }
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
  },
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
  }
});

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
        var uniq = buildSerial(Pot),
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
  signal           : Pot.Signal.signal
});

})();

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Hash.
(function(PREFIX) {

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Hash.
   *
   * Hash can contain any key names.
   *  e.g. "__iterator__" and "hasOwnProperty" etc. will crush object.
   * The implementation to resolve them.
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set('key1', 'value1');
   *   hash.set('key2', [1, 2, 3]);
   *   debug(hash.toJSON());
   *   // @results {"key1":"value1","key2":[1,2,3]}
   *   //
   *   hash.clear();
   *   // If you use the following keys to builtin Object,
   *   //  object will no longer work usually.
   *   hash.set('__iterator__',   'iterator');
   *   hash.set('hasOwnProperty', 'hasOwn');
   *   hash.set('prototype',      'proto');
   *   hash.set('constructor',    'construct');
   *   debug(hash.toJSON());
   *   // @results
   *   //   {
   *   //     "__iterator__": "iterator",
   *   //     "hasOwnProperty": "hasOwn",
   *   //     "prototype": "proto",
   *   //     "constructor": "construct"
   *   //   }
   *   //
   *   var result = hash.map(function(value, key, object) {
   *     return '[' + value + ']';
   *   }).reduce(function(a, b) {
   *     return a + b;
   *   });
   *   debug(result);
   *   // @results  result = '[iterator][hasOwn][proto][construct]'
   *
   *
   * @param  {Object|*}  (...)  (Optional) Items.
   * @return {Pot.Hash}         Returns an instance of Pot.Hash.
   *
   * @name  Pot.Hash
   * @type  Function
   * @class
   * @constructor
   * @public
   */
  Hash : function() {
    return Pot.isHash(this) ? this.init(arguments) :
            new Pot.Hash.fn.init(arguments);
  }
});

// Definition of the creator method for iterators and iteration speeds.
update(Pot.tmp, {
  /**
   * @ignore
   */
  createHashIterator : function(creator) {
    var
    /**@ignore*/
    create = function(speed) {
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
    },
    methods = {},
    construct = create();
    each(Pot.Internal.LightIterator.speeds, function(v, k) {
      methods[k] = create(k);
    });
    return update(construct, methods);
  }
});

// Define the prototype of Pot.Hash
Pot.Hash.fn = Pot.Hash.prototype = update(Pot.Hash.prototype, {
  /**
   * @lends Pot.Hash.prototype
   */
  /**
   * @ignore
   */
  constructor : Pot.Hash,
  /**
   * @const
   * @private
   * @ignore
   */
  id : Pot.Internal.getMagicNumber(),
  /**
   * @const
   * @private
   */
  serial : null,
  /**
   * StopIteration.
   *
   * @type Object
   * @const
   * @public
   */
  StopIteration : Pot.StopIteration,
  /**
   * @private
   * @ignore
   */
  _rawData : {},
  /**
   * Length of Hash data.
   *
   * @type  Number
   * @readonly
   * @public
   */
  length : 0,
  /**
   * @private
   * @readonly
   * @const
   * @ignore
   */
  NAME : 'Hash',
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
   * isHash.
   *
   * @type Function
   * @function
   * @static
   * @public
   */
  isHash : Pot.isHash,
  /**
   * Initialization.
   *
   * @private
   * @ignore
   */
  init : function(argument) {
    var that = this, args, len;
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    this._rawData = {};
    this.length   = 0;
    args = arrayize(argument);
    len = args.length;
    if (len === 2 && !Pot.isObject(args[0])) {
      this.set(args[0], args[1]);
    } else if (len) {
      each(args, function(arg) {
        that.set(arg);
      });
    }
    Pot.Internal.referSpeeds.call(this, Pot.Internal.LightIterator.speeds);
    return this;
  },
  /**
   * Get the item by the specified key name.
   *
   * @param  {String}  key  The key name.
   * @return {*}            A value that related to the key name.
   * @function
   * @public
   */
  get : function(key) {
    return this._rawData[PREFIX + key];
  },
  /**
   * Set the item that is specified key name and value.
   *
   * @param  {String}   key    The key name.
   * @param  {*}        value  The value.
   * @return {Pot.Hash}        Return the Hash.
   * @function
   * @public
   */
  set : function(key, value) {
    var that = this;
    if (Pot.isHash(key)) {
      key.forEach(function(v, k) {
        that.set(k, v);
      });
    } else if (key && Pot.isObject(key)) {
      each(key, function(v, k) {
        that.set(k, v);
      });
    } else {
      if (!this.has(key)) {
        this.length++;
      }
      this._rawData[PREFIX + key] = value;
    }
    return this;
  },
  /**
   * Check whether a key exists.
   *
   * @param  {String}  key  The key name to check.
   * @return {Boolean}      Return true if exists.
   * @function
   * @public
   */
  has : function(key) {
    return ((PREFIX + key) in this._rawData);
  },
  /**
   * Check whether a value exists.
   *
   * @param  {*}       value  The value to check.
   * @return {Boolean}        Return true if exists.
   * @function
   * @public
   */
  hasValue : function(value) {
    var result = false, raw = this._rawData, k, val;
    for (k in raw) {
      if (k && k.charAt(0) === PREFIX) {
        try {
          val = raw[k];
        } catch (e) {
          continue;
        }
        if (val === value) {
          result = true;
          break;
        }
      }
    }
    return result;
  },
  /**
   * Remove an item by specified key name.
   *
   * @param  {String}   key  The key name.
   * @return {Pot.Hash}      Return the Hash.
   * @function
   * @public
   */
  remove : function(key) {
    if (this.has(key)) {
      delete this._rawData[(PREFIX + key)];
      this.length--;
    }
    return this;
  },
  /**
   * Clear the data.
   * All items will remove.
   *
   * @return {Pot.Hash}  Return the Hash.
   * @function
   * @public
   */
  clear : function() {
    this._rawData = {};
    this.length   = 0;
    return this;
  },
  /**
   * Collect all key names as an array.
   *
   * @return  {Array}   Return all key names as an array.
   * @function
   * @public
   */
  keys : function() {
    var keys = [], raw = this._rawData, k;
    for (k in raw) {
      if (k && k.charAt(0) === PREFIX) {
        keys[keys.length] = k.substring(1);
      }
    }
    return keys;
  },
  /**
   * Collect all values as an array.
   *
   * @return  {Array}   Return all values as an array.
   * @function
   * @public
   */
  values : function() {
    var values = [], raw = this._rawData, k;
    for (k in raw) {
      if (k && k.charAt(0) === PREFIX) {
        try {
          values[values.length] = raw[k];
        } catch (e) {}
      }
    }
    return values;
  },
  /**
   * Convert all items to JSON format.
   *
   *
   * @example
   *   var hash = new Pot.Hash({foo: [1], bar: [2], baz: [3]});
   *   hash.set({a: 4, b: 5, c: [6, 7, '"hoge"']});
   *   var json = hash.toJSON();
   *   debug(json);
   *   // @results
   *   //   '{"foo":[1],"bar":[2],"baz":[3],"a":4,"b":5,"c":[6,7,"\"hoge\""]}'
   *
   *
   * @return      Return a JSON string object that has all items.
   * @function
   * @public
   */
  toJSON : function() {
    var results = [], raw = this._rawData, k, key,
        json = Pot.Serializer.serializeToJSON;
    for (k in raw) {
      if (k && k.charAt(0) === PREFIX) {
        key = k.substring(1);
        try {
          results[results.length] = json(key) + ':' + json(raw[k]);
        } catch (e) {}
      }
    }
    return '{' + results.join(',') + '}';
  },
  /**
   * Convert all items to plain object.
   *
   * Notice:
   *  if special keys existed (e.g. hasOwnProperty or __iterator__ etc.)
   *    then object will be broken.
   *
   * @return      Return an object that has all items.
   * @function
   * @public
   */
  toObject : function() {
    var o = {}, raw = this._rawData, key, val;
    for (k in raw) {
      if (k && k.charAt(0) === PREFIX) {
        key = k.substring(1);
        try {
          o[key] = raw[k];
        } catch (e) {}
      }
    }
    return o;
  },
  /**
   * Convert all elements to the items() format array.
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set('prototype',      'value1');
   *   hash.set('__iterator__',   'value2');
   *   hash.set('hasOwnProperty', 'value3');
   *   var result = hash.toItems();
   *   debug(result);
   *   // @results
   *   //   [
   *   //     ['prototype',      'value1'],
   *   //     ['__iterator__',   'value2'],
   *   //     ['hasOwnProperty', 'value3']
   *   //   ]
   *
   *
   * @see Pot.Struct.items
   *
   * @return      Return the items() format array.
   * @function
   * @public
   */
  toItems : function() {
    var items = [], raw = this._rawData, k, key;
    for (k in raw) {
      if (k && k.charAt(0) === PREFIX) {
        key = k.substring(1);
        try {
          items[items.length] = [key, raw[k]];
        } catch (e) {}
      }
    }
    return items;
  },
  /**
   * Iterate each items with calls callback function.
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set('key1', 'value1');
   *   hash.set('key2', 'value2');
   *   hash.set('key3', 'value3');
   *   var s = '';
   *   hash.forEach(function(value, key, object) {
   *     s += key + ':' + value + ';';
   *   });
   *   debug(s);
   *   // @results  s = 'key1:value1;key2:value2;key3:value3;'
   *
   *
   * @param  {Function}  callback   An iterable function.
   *                                  function(value, key, object)
   *                                    this == `context`.
   *                                Throw Pot.StopIteration
   *                                  if you want to stop the loop.
   * @param  {*}         (context)  Optionally, context object. (i.e. this)
   * @return {Pot.Hash}             Return the Hash.
   *
   * @name  Pot.Hash.forEach
   * @class
   * @function
   * @public
   *
   * @property {Function} limp   Iterates "forEach" loop with slowest speed.
   * @property {Function} doze   Iterates "forEach" loop with slower speed.
   * @property {Function} slow   Iterates "forEach" loop with slow speed.
   * @property {Function} normal Iterates "forEach" loop with default speed.
   * @property {Function} fast   Iterates "forEach" loop with fast speed.
   * @property {Function} rapid  Iterates "forEach" loop with faster speed.
   * @property {Function} ninja  Iterates "forEach" loop with fastest speed.
   */
  forEach : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this;
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key, result;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          result = callback.call(context, val, key, object);
        }
      });
      return this;
    };
  }),
  /**
   * Creates a new object with the results of calling a
   *   provided function on every element in object.
   *
   * This method like Array.prototype.map
   *
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set({a: 1, b: 2, c: 3, d: 4, e: 5});
   *   var result = hash.map(function(value, key) {
   *     return value * 100;
   *   });
   *   debug(result.toObject());
   *   // @results {a: 100, b: 200, c: 300, d: 400, e: 500}
   *
   *
   * @param  {Function}  callback    A callback function.
   * @param  {*}         (context)   (Optional) Object to use
   *                                   as `this` when executing callback.
   * @return {Pot.Hash}              Return a new instance of Hash that
   *                                   has result of each callbacks.
   *
   * @name  Pot.Hash.map
   * @class
   * @function
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
  map : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this, hash;
      hash = new Pot.Hash();
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key, result;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          result = callback.call(context, val, key, object);
          hash.set(key, result);
        }
      });
      return hash;
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
   *   var hash = new Pot.Hash({a: 1, b: 2, c: 3, d: 4, e: 5});
   *   var result = hash.filter(function(value, key, obj) {
   *     return value % 2 == 0;
   *   });
   *   debug(result.toObject());
   *   // @results {b: 2, d: 4}
   *
   *
   * @param  {Function}    callback    A callback function.
   * @param  {*}           (context)   (Optional) Object to use
   *                                     as `this` when executing callback.
   * @return {Pot.Hash}                Return a new Hash instance that
   *                                     has result of each callbacks.
   * @name  Pot.Hash.filter
   * @class
   * @function
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
  filter : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this, hash;
      hash = new Pot.Hash();
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          if (callback.call(context, val, key, object)) {
            hash.set(key, val);
          }
        }
      });
      return hash;
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
   *   var object = {a: 1, b: 2, c: 3};
   *   var hash = new Pot.Hash(object);
   *   var total = hash.reduce(function(a, b) { return a + b; });
   *   debug(total);
   *   // @results 6
   *
   *
   * @param  {Function}       callback  A callback function.
   * @param  {*}              initial   An initial value passed as `callback`
   *                                      argument that will be used on
   *                                      first iteration.
   * @param  {*}             (context)  (Optional) Object to use as
   *                                      the first argument to the
   *                                      first call of the `callback`.
   * @return {*}                        Return the result of each callbacks.
   * @name  Pot.Hash.reduce
   * @class
   * @function
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
  reduce : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, initial, context) {
      var me = arguments.callee, that = me.instance || this,
          value, skip, p, raw = that._rawData;
      if (initial == null) {
        for (p in raw) {
          if (p && p.charAt(0) === PREFIX) {
            try {
              value = raw[p];
              break;
            } catch (e) {}
          }
        }
      } else {
        value = initial;
      }
      skip = true;
      Pot.forEach[speedKey](raw, function(val, k, object) {
        var key;
        if (skip) {
          skip = false;
        } else {
          if (k && k.charAt(0) === PREFIX) {
            key = k.substring(1);
            value = callback.call(context, value, val, key, object);
          }
        }
      });
      return value;
    };
  }),
  /**
   * Tests whether all elements in the object pass the
   *  test implemented by the provided function.
   *
   * This method like Array.prototype.every
   *
   * @example
   *   var hash = new Pot.Hash();
   *   hash.set({A: 12, B: 5, C: 8, D: 130, E: 44});
   *   var result = hash.every(function(value, key, object) {
   *     return (value >= 10);
   *   });
   *   debug('[1] result = ' + result); // @results false
   *   hash.clear();
   *   hash.set({A: 12, B: 54, C: 18, D: 130, E: 44});
   *   result = hash.every(function(value, key, object) {
   *     return (value >= 10);
   *   });
   *   debug('[2] result = ' + result); // @results true
   *
   *
   * @param  {Function}  callback   A callback function.
   * @param  {*}         (context)  (Optional) Object to use
   *                                  as `this` when executing callback.
   * @return {Boolean}              Return the Boolean result by callback.
   *
   * @name  Pot.Hash.every
   * @class
   * @function
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
  every : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this, result = true;
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          if (!callback.call(context, val, key, object)) {
            result = false;
            throw Pot.StopIteration;
          }
        }
      });
      return result;
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
   *   var hash = new Pot.Hash();
   *   hash.set({A: 2, B: 5, C: 8, D: 1, E: 4});
   *   var result = hash.some(function(value, key, object) {
   *     return (value >= 10);
   *   });
   *   debug('[1] result = ' + result); // @results false
   *   hash.clear();
   *   hash.set({A: 12, B: 5, C: 8, D: 1, E: 4});
   *   result = hash.some(function(value, key, object) {
   *     return (value >= 10);
   *   });
   *   debug('[2] result = ' + result); // @results true
   *
   *
   * @param  {Function}    callback   A callback function.
   * @param  {*}           (context)  (Optional) Object to use
   *                                    as `this` when executing callback.
   * @return {Boolean}                Return the Boolean result by callback.
   *
   * @name  Pot.Hash.some
   * @class
   * @function
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
  some : Pot.tmp.createHashIterator(function(speedKey) {
    return function(callback, context) {
      var me = arguments.callee, that = me.instance || this, result = false;
      Pot.forEach[speedKey](that._rawData, function(val, k, object) {
        var key;
        if (k && k.charAt(0) === PREFIX) {
          key = k.substring(1);
          if (callback.call(context, val, key, object)) {
            result = true;
            throw Pot.StopIteration;
          }
        }
      });
      return result;
    };
  })
});

delete Pot.tmp.createHashIterator;
Pot.Hash.prototype.init.prototype = Pot.Hash.prototype;
})('.');

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
            for (j = 0; j < len; j++) {
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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Struct.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Struct.
   * Object and Function object utilities.
   *
   * @name Pot.Struct
   * @type Object
   * @class
   * @static
   * @public
   */
  Struct : {}
});

update(Pot.Struct, {
  /**
   * @lends Pot.Struct
   */
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
   * Clone an object.
   *
   * @example
   *   var obj1 = {key: 'value'};
   *   var obj2 = clone(obj1);
   *   obj2.hoge = 'fuga';
   *   debug(obj1.hoge);  // undefined
   *   debug(obj2.hoge);  // 'fuga'
   *
   *
   * @param  {*}  o  Target object.
   * @return {*}     Cloned object.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  clone : function(x) {
    var result, p, f, c, k, System = Pot.System;
    if (x == null) {
      return x;
    }
    c = x.constructor;
    switch (Pot.typeLikeOf(x)) {
      case 'array':
          result = arrayize(x);
          break;
      case 'function':
          result = update(function() {
            return x.apply(this, arguments);
          }, x);
          result.prototype = update({}, x.prototype);
          break;
      case 'object':
          if (Pot.isDOMLike(x)) {
            if (x.cloneNode) {
              result = x.cloneNode(true);
              break;
            } else if (!System.canCloneDOM) {
              result = update({}, x);
              break;
            }
          }
          if (System.canProtoClone) {
            /**@ignore*/
            f = function() {};
            f.prototype = x;
            result = new f();
          } else {
            // Some environments cannot clone object by function prototype.
            //XXX: frozen object
            result = {};
            for (k in x) {
              if (hasOwnProperty.call(x, k)) {
                try {
                  result[k] = x[k];
                } catch (e) {}
              }
            }
          }
          break;
      case 'error':
          result = new Error(x.message || x.description || x);
          update(result, x);
          break;
      case 'date':
          result = new Date(x.getTime());
          break;
      case 'regexp':
          result = new RegExp(x);
          break;
      case 'boolean':
      case 'number':
      case 'string':
          if (typeof x === 'object') {
            result = new c(c(x));
          } else {
            result = c((function() {
              return this;
            }).call(x));
          }
          break;
      default:
          result = x;
          break;
    }
    return result;
  },
  /**
   * Creates a new function with specified context and arguments.
   *
   *
   * @example
   *   var Hoge = function() {
   *     this.msg = 'Hello Hoge!';
   *   };
   *   Hoge.prototype.sayHoge = function() {
   *     debug(this.msg);
   *   };
   *   var hoge = new Hoge();
   *   //
   *   // direct
   *   setTimeout(hoge.sayHoge, 1000); // undefined
   *   //
   *   // bind
   *   setTimeout(bind(hoge.sayHoge, hoge), 1000); // Hello Hoge!
   *   //
   *   // use arguments
   *   Hoge.prototype.sayHoges = function(msg) {
   *     debug(this.msg + msg);
   *   };
   *   //
   *   // direct
   *   setTimeout(hoge.sayHoges, 1000); // NaN
   *   //
   *   // bind
   *   setTimeout(bind(hoge.sayHoges, hoge, 'Hi!'), 1000); // Hello Hoge!Hi!
   *
   *
   * @param  {Function}   func    A function to partially apply.
   * @param  {*}          self    Specifies the object as "this".
   *                              If the value is unspecified,
   *                               it will default to the global object.
   * @param  {...*}      (...)    Additional arguments that are partially
   *                               applied to the function.
   * @return {Function}           A new function that will invoked with
   *                               original context and
   *                               partially-applied arguments.
   * @type  Function
   * @function
   * @static
   * @public
   */
  bind : function(func, self/*[, ...args]*/) {
    var args = arguments, bounds, context = self || null;
    if (args.length > 2) {
      bounds = arrayize(args, 2);
      return function() {
        var a = arrayize(arguments);
        unshift.apply(a, bounds);
        return func.apply(context, a);
      };
    } else {
      return function() {
        return func.apply(context, arguments);
      };
    }
  },
  /**
   * Create a new function like Function.bind,
   *  except that a "this" is not required.
   * That is useful when the target function is already bound.
   *
   * @example
   *   function add(a, b) {
   *     return a + b;
   *   }
   *   var add2 = partial(add, 2);
   *   var result = add2(5);
   *   debug(result);
   *   // @results 7
   *
   *
   * @param  {Function}   func    A function to partially apply.
   * @param  {...*}       (...)   Additional arguments that are partially
   *                                applied to `func`.
   * @return {Function}           A new function that will invoked with
   *                                partially-applied arguments.
   * @type  Function
   * @function
   * @static
   * @public
   */
  partial : function(func/*[, ...args]*/) {
    var args = arrayize(arguments, 1);
    return function() {
      var a = arrayize(arguments);
      a.unshift.apply(a, args);
      return func.apply(this, a);
    };
  },
  /**
   * Collect the object key names like ES5's Object.keys().
   *
   *
   * @example
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   debug(keys(obj));
   *   // @results ['foo', 'bar', 'baz']
   *   var array = [10, 20, 30, 40, 50];
   *   debug(keys(array));
   *   // @results [0, 1, 2, 3, 4]
   *   delete array[2];
   *   debug(keys(array));
   *   // @results [0, 1, 3, 4]
   *
   *
   * @param  {Object}  o  The target object.
   * @return {Array}      The collected key names as an array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  keys : function(o) {
    var r = [], objectLike;
    if (o) {
      objectLike = Pot.isObject(o);
      if (objectLike && Pot.System.isBuiltinObjectKeys) {
        try {
          r = Object.keys(o);
          return r;
        } catch (e) {}
      }
      if (objectLike || Pot.isArrayLike(o)) {
        each(o, function(v, k) {
          try {
            if (hasOwnProperty.call(o, k)) {
              r[r.length] = k;
            }
          } catch (e) {}
        });
      }
    }
    return r;
  },
  /**
   * Collect the object values.
   *
   *
   * @example
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   debug(values(obj));
   *   // @results [1, 2, 3]
   *   var array = ['foo', 'bar', 'baz'];
   *   debug(values(array));
   *   // @results ['foo', 'bar', 'baz'];
   *   delete array[1];
   *   debug(values(array));
   *   // @results ['foo', 'baz']
   *
   *
   * @param  {Object}  o  The target object.
   * @return {Array}      The collected values as an array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  values : function(o) {
    var r = [];
    if (o) {
      if (Pot.isObject(o) || Pot.isArrayLike(o)) {
        each(o, function(v, k) {
          try {
            if (hasOwnProperty.call(o, k)) {
              r[r.length] = v;
            }
          } catch (e) {}
        });
      }
    }
    return r;
  },
  /**
   * Revert to an object from items() format array.
   *
   *
   * @example
   *   var array = [['foo', 1], ['bar', 2], ['baz', 3]];
   *   debug(tuple(array));
   *   // @results {foo: 1, bar: 2, baz: 3}
   *
   *
   * @example
   *   var array = [['foo', 1, 'bar', 2], {baz: 3}, ['A', 4, 'B']];
   *   debug(tuple(array));
   *   // @results {foo: 1, bar: 2, baz: 3, A: 4, B: (void 0)}
   *
   *
   * @example
   *   // Callback function usage:
   *   var array = [['A', 1], ['B', 2], ['C', 3]];
   *   var func = function(key, val) {
   *     return ['[' + key + ']', '{' + val + '}'];
   *   };
   *   debug(tuple(array, func));
   *   // @results {'[A]': '{1}', '[B]': '{2}', '[C]': '{3}'}
   *
   *
   * @example
   *   // Example to specify the type of result:
   *   var array = [['prototype', 1], ['__iterator__', 2], ['__proto__', 3]];
   *   debug(tuple(array, new Pot.Hash()).toJSON());
   *   // @results {"prototype": 1, "__iterator__": 2, "__proto__": 3}
   *
   *
   * @example
   *   // Example to specify the type of result
   *   //   (enables Array, Object, Pot.Hash etc.):
   *   var array = [['A', 1], ['B', 2], ['C', 3]];
   *   var func = function(key, val) {
   *     return '(' + key + ':' + val + ')';
   *   };
   *   debug(tuple(array, func, []));
   *   // @results ['(A:1)', '(B:2)', '(C:3)']
   *
   *
   * @param  {Array}       items        The target object.
   * @param  {Function|*} (callback)    (Optional) Callback function.
   * @param  {*}          (defaultType) (Optional) An object literal to
   *                                      specify the type of result.
   * @return {Object}                   The collected object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  tuple : function(items, callback, defaultType) {
    var result = {}, fn, args = arguments, type = null,
        Hash       = Pot.Hash,
        isFunction = Pot.isFunction,
        isHash     = Pot.isHash,
        isObject   = Pot.isObject,
        isArray    = Pot.isArray;
    if (args.length >= 2) {
      if (isFunction(callback)) {
        fn   = callback;
        type = defaultType;
      } else {
        fn   = defaultType;
        type = callback;
      }
    }
    if (!isFunction(fn)) {
      fn = null;
    }
    if (type == null) {
      type = 'object';
    } else if (isHash(type) || (type && type === Hash)) {
      type = 'hash';
    } else {
      type = Pot.typeOf(type);
    }
    if (items) {
      if (isArray(items)) {
        result = null;
        each(items, function(item) {
          var key, i, len, v, k, pairs = [];
          if (item) {
            if (Pot.isArrayLike(item)) {
              i = 0;
              len = item.length;
              if (len) {
                do {
                  try {
                    k = stringify(item[i++], true);
                    v = item[i++];
                    pairs[pairs.length] = [k, v];
                  } catch (e) {}
                } while (i < len);
              }
            } else if (isObject(item)) {
              for (key in item) {
                try {
                  k = stringify(key, true);
                  v = item[key];
                  pairs[pairs.length] = [k, v];
                } catch (ex) {}
              }
            }
            each(pairs, function(pair) {
              var rv, p;
              try {
                switch (type) {
                  case 'hash':
                      if (result === null) {
                        result = new Hash();
                      }
                      if (fn) {
                        rv = fn.apply(pair, pair);
                        if (isArray(rv)) {
                          result.set(rv[0], rv[1]);
                        } else if (isObject(rv)) {
                          result.set(rv);
                        } else {
                          result.set(pair[0], rv);
                        }
                      } else {
                        result.set(pair[0], pair[1]);
                      }
                      break;
                  case 'array':
                      if (result === null) {
                        result = [];
                      }
                      result[result.length] = fn ? fn.apply(pair, pair)
                                                 : pair;
                      break;
                  case 'string':
                      if (result === null) {
                        result = '';
                      }
                      result += fn ? fn.apply(pair, pair)
                                   : (stringify(pair[0]) + stringify(pair[1]));
                      break;
                  case 'number':
                      if (result === null) {
                        result = 0;
                      }
                      result += fn ? fn.apply(pair, pair)
                                   : ((+pair[0] || 0) + (+pair[1] || 0));
                      break;
                  case 'object':
                  default:
                      if (result === null) {
                        result = {};
                      }
                      if (fn) {
                        rv = fn.apply(pair, pair);
                        if (isArray(rv)) {
                          result[rv[0]] = rv[1];
                        } else if (isObject(rv)) {
                          for (p in rv) {
                            try {
                              result[p] = rv[p];
                            } catch (err) {}
                          }
                        } else {
                          result[pair[0]] = rv;
                        }
                      } else {
                        result[pair[0]] = pair[1];
                      }
                      break;
                }
              } catch (ex) {}
            });
          }
        });
      }
    }
    return result;
  },
  /**
   * Revert to an object from zip() format array.
   *
   * <pre>
   * Example:
   *
   *   arguments:  [[1, 4],
   *                [2, 5],
   *                [3, 6]]
   *
   *   results:    [1, 2, 3],
   *               [4, 5, 6]
   *
   * Example:
   *
   *   arguments:  [[{a: 1}, {d: 4}],
   *                [{b: 2}, {e: 5}],
   *                [{c: 3}, {f: 6}]]
   *
   *   results:    {a: 1, b: 2, c: 3},
   *               {d: 4, e: 5, f: 6}
   * </pre>
   *
   *
   * @link http://docs.python.org/library/functions.html#zip
   *
   *
   * @example
   *   debug(unzip([[1, 4], [2, 5], [3, 6]]));
   *   // @results
   *   //   [[1, 2, 3], [4, 5, 6]]
   *   //
   *   debug(unzip([[{a: 1}, {d: 4}], [{b: 2}, {e: 5}], [{c: 3}, {f: 6}]]));
   *   // @results
   *   //   [{a:1, b:2, c:3}, {d:4, e:5, f:6}]
   *   //
   *   var callback = function(a, b, c) { return a + b + c; };
   *   debug(unzip([[1, 4], [2, 5], [3, 6]], callback));
   *   // @results
   *   //   [6, 15]
   *   //
   *
   *
   * @see Pot.zip
   *
   * @param  {Array}       zipped       Target array.
   * @param  {Function|*} (callback)    (Optional) Callback function.
   * @return {Array}                    The collected array object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  unzip : function(zipped, callback) {
    var result = [], max, len, fn, i, j, lists, val, tail,
        isObject = Pot.isObject;
    if (Pot.isFunction(callback)) {
      fn = callback;
    }
    if (zipped && zipped.length && Pot.isArray(zipped)) {
      max = 0;
      each(zipped, function(z) {
        if (z && z.length > max) {
          max = z.length;
        }
      });
      len = zipped.length;
      for (i = 0; i < max; i++) {
        lists = [];
        for (j = 0; j < len; j++) {
          try {
            val = zipped[j][i];
          } catch (ex) {
            continue;
          }
          tail = lists.length - 1;
          if (val && tail >= 0 && isObject(lists[tail]) && isObject(val)) {
            each(val, function(v, k) {
              try {
                lists[tail][k] = v;
              } catch (ex) {}
            });
          } else {
            lists[lists.length] = val;
          }
        }
        if (lists.length === 1 && isObject(lists[0])) {
          lists = lists.shift();
        }
        result[result.length] = fn ? fn.apply(lists, arrayize(lists)) : lists;
      }
    }
    return result;
  },
  /**
   * Creates an object from a key-value pairs.
   *
   *
   * @example
   *   debug(pairs('key', 'value'));
   *   // @results {key : 'value'}
   *   debug(pairs('key1', 'value1', 'key2', 'value2'));
   *   // @results {key1: 'value1', key2: 'value2'}
   *   debug(pairs('key'));
   *   // @results {key: undefined}
   *   debug(pairs(['key', 'value']));
   *   // @results {key: 'value'}
   *   debug(pairs('key1', 1, ['key2', 2], 'key3', 3));
   *   // @results {key1: 1, key2: 2, key3: 3}
   *   debug(pairs(['a', 1, ['b', 2, [{c: 3}, 'd', 4]]]));
   *   // @results {a: 1, b: 2, c: 3, d: 4}
   *
   *
   * @param  {String|*}  (...)  The key-value pairs.
   * @return {Object}           The created object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  pairs : function(/*key, value[, ...args]*/) {
    var result = {}, args = arrayize(arguments), len = args.length,
        i = 0, j, n, p, pair, key, val,
        isArray = Pot.isArray,
        isObject = Pot.isObject;
    do {
      if (isArray(args[i])) {
        args[i] = pairs.apply(null, args[i]);
      }
      if (isObject(args[i])) {
        each(args[i++], function(v, k) {
          result[k] = v;
        });
      } else {
        result[stringify(args[i++], true)] = args[i++];
      }
    } while (i < len);
    return result;
  },
  /**
   * Count the object items then return total number.
   *
   *
   * @example
   *   debug(count({a: 1, b: 2, c: 3}));              // 3
   *   debug(count({}));                              // 0
   *   debug(count([1, 2, 3, 4, 5]));                 // 5
   *   debug(count([]));                              // 0
   *   debug(count(new Object('foo', 'bar', 'baz'))); // 3
   *   debug(count(new Array(100)));                  // 100
   *   debug(count(null));                            // 0
   *   debug(count((void 0)));                        // 0
   *   debug(count('hoge'));                          // 4
   *   debug(count(''));                              // 0
   *   debug(count(new String('hoge')));              // 4
   *   debug(count(100));                             // 100
   *   debug(count(0));                               // 0
   *   debug(count(-1));                              // 1
   *   debug(count((function() {})));                 // 0
   *   var f = function() {};
   *   f.foo = 1;
   *   f.bar = 2;
   *   debug(count(f));  // 2
   *
   *
   * @param  {Object|*}  o  The target object.
   * @return {Number}       The total count.
   * @type  Function
   * @function
   * @static
   * @public
   */
  count : function(o) {
    var c = 0, p;
    if (o != null) {
      switch (Pot.typeLikeOf(o)) {
        case 'array':
        case 'string':
            c = o.length;
            break;
        case 'object':
        case 'function':
            for (p in o) {
              c++;
            }
            break;
        case 'number':
            c = Math.abs(Math.round(o));
            break;
        default:
            try {
              c = o.toString().length;
            } catch (e) {
              c = 0;
            }
            break;
      }
    }
    return c - 0;
  },
  /**
   * Get the first orders value in object.
   *
   *
   * @example
   *   debug(first({a: 1, b: 2, c: 3}));   // 1
   *   debug(first({}));                   // undefined
   *   debug(first([1, 2, 3, 4, 5]));      // 1
   *   debug(first([]));                   // undefined
   *   debug(first({a: 'foo', b: 'bar'})); // 'foo'
   *   debug(first(new Array(100)));       // undefined
   *   debug(first(null));                 // undefined
   *   debug(first((void 0)));             // undefined
   *   debug(first('hoge'));               // 'h'
   *   debug(first(''));                   // ''
   *   debug(first(new String('hoge')));   // 'h'
   *   debug(first(123));                  // 3
   *   debug(first(0));                    // 0
   *   debug(first(-123));                 // 3
   *
   *
   * @param  {Object|Array|*}  o  The target object.
   * @return {*}                  The first value in object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  first : function(o, keyOnly) {
    var r, p, len;
    if (o != null) {
      switch (Pot.typeLikeOf(o)) {
        case 'array':
            if (o) {
              len = o.length;
              for (p = 0; p < len; p++) {
                try {
                  if (p in o) {
                    if (keyOnly) {
                      r = p;
                    } else {
                      r = o[p];
                    }
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
            break;
        case 'string':
            if (keyOnly) {
              r = o.length ? 0 : null;
            } else {
              r = o.length ? o.charAt(0) : '';
            }
            break;
        case 'number':
            if (keyOnly) {
              r = isNaN(o) ? null : 0;
            } else {
              r = Math.abs(o).toString().slice(-1) - 0;
            }
            break;
        case 'object':
            if (o) {
              for (p in o) {
                if (hasOwnProperty.call(o, p)) {
                  try {
                    if (keyOnly) {
                      r = p;
                    } else {
                      r = o[p];
                    }
                    break;
                  } catch (e) {
                    continue;
                  }
                }
              }
            }
            break;
        default:
            break;
      }
    }
    return r;
  },
  /**
   * Get the first orders key in object.
   *
   *
   * @example
   *   debug(firstKey({a: 1, b: 2, c: 3}));   // 'a'
   *   debug(firstKey({}));                   // undefined
   *   debug(firstKey([1, 2, 3, 4, 5]));      // 0
   *   debug(firstKey([]));                   // undefined
   *   debug(firstKey({a: 'foo', b: 'bar'})); // 'a'
   *   debug(firstKey(new Array(100)));       // undefined
   *   debug(firstKey(null));                 // undefined
   *   debug(firstKey((void 0)));             // undefined
   *   debug(firstKey('hoge'));               // 0
   *   debug(firstKey(''));                   // null
   *   debug(firstKey(new String('hoge')));   // 0
   *   debug(firstKey(123));                  // 0
   *   debug(firstKey(0));                    // 0
   *   debug(firstKey(-123));                 // 0
   *
   *
   * @param  {Object|Array|*}  o  The target object.
   * @return {*}                  The first key in object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  firstKey : function(o) {
    return Pot.Struct.first(o, true);
  },
  /**
   * Get the last orders value in object.
   *
   *
   * @example
   *   debug(last({a: 1, b: 2, c: 3}));   // 3
   *   debug(last({}));                   // undefined
   *   debug(last([1, 2, 3, 4, 5]));      // 5
   *   debug(last([]));                   // undefined
   *   debug(last({a: 'foo', b: 'bar'})); // 'bar'
   *   debug(last(new Array(100)));       // undefined
   *   debug(last(null));                 // undefined
   *   debug(last((void 0)));             // undefined
   *   debug(last('hoge'));               // 'e'
   *   debug(last(''));                   // ''
   *   debug(last(new String('hoge')));   // 'e'
   *   debug(last(123));                  // 1
   *   debug(last(0));                    // 0
   *   debug(last(-123));                 // 1
   *
   *
   * @param  {Object|Array|*}  o  The target object.
   * @return {*}                  The last value in object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  last : function(o, keyOnly) {
    var r, p;
    if (o != null) {
      switch (Pot.typeLikeOf(o)) {
        case 'array':
            p = o.length;
            while (--p >= 0) {
              try {
                if (p in o) {
                  if (keyOnly) {
                    r = p;
                  } else {
                    r = o[p];
                  }
                  break;
                }
              } catch (e) {
                continue;
              }
            }
            break;
        case 'string':
            if (keyOnly) {
              r = o.length ? o.length - 1 : null;
            } else {
              r = o.length ? o.slice(-1) : '';
            }
            break;
        case 'number':
            if (keyOnly) {
              r = isNaN(o) ? null : Math.abs(o).toString().length - 1;
            } else {
              r = Math.abs(o).toString().charAt(0) - 0;
            }
            break;
        case 'object':
            for (p in o) {
              if (hasOwnProperty.call(o, p)) {
                try {
                  if (keyOnly) {
                    r = p;
                  } else {
                    r = o[p];
                  }
                } catch (e) {
                  continue;
                }
              }
            }
            break;
        default:
            break;
      }
    }
    return r;
  },
  /**
   * Get the last orders key in object.
   *
   *
   * @example
   *   debug(lastKey({a: 1, b: 2, c: 3}));   // 'c'
   *   debug(lastKey({}));                   // undefined
   *   debug(lastKey([1, 2, 3, 4, 5]));      // 4
   *   debug(lastKey([]));                   // undefined
   *   debug(lastKey({a: 'foo', b: 'bar'})); // 'b'
   *   debug(lastKey(new Array(100)));       // undefined
   *   debug(lastKey(null));                 // undefined
   *   debug(lastKey((void 0)));             // undefined
   *   debug(lastKey('hoge'));               // 3
   *   debug(lastKey(''));                   // null
   *   debug(lastKey(new String('hoge')));   // 3
   *   debug(lastKey(123));                  // 2
   *   debug(lastKey(0));                    // 0
   *   debug(lastKey(-123));                 // 2
   *
   *
   * @param  {Object|Array|*}  o  The target object.
   * @return {*}                  The last key in object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  lastKey : function(o) {
    return Pot.Struct.last(o, true);
  },
  /**
   * Whether the object contains the given subject.
   *
   *
   * @example
   *   var obj = {foo: 10, bar: 20, baz: 30};
   *   debug(contains(obj, 20));    // true
   *   debug(contains(obj, 50));    // false
   *   var arr = [10, 20, 30, 'foo', 'bar'];
   *   debug(contains(arr, 20));    // true
   *   debug(contains(arr, 75));    // false
   *   debug(contains(arr, 'foo')); // true
   *   debug(contains(arr, 'FOO')); // false
   *   var str = 'foobarbaz';
   *   debug(contains(str, 'A'));   // false
   *   debug(contains(str, 'foo')); // true
   *   debug(contains(str, '123')); // false
   *   var num = 12345;
   *   debug(contains(num, 1));     // true
   *   debug(contains(num, 45));    // true
   *   debug(contains(num, 7));     // false
   *
   *
   * @param  {*}       object   The object to test for the
   *                              presence of the element.
   * @param  {*}       subject  The object for which to test.
   * @return {Boolean}          true if subject is present.
   * @type  Function
   * @function
   * @static
   * @public
   */
  contains : function(object, subject) {
    var result = false;
    switch (Pot.typeLikeOf(object)) {
      case 'string':
          result = ~object.indexOf(subject);
          break;
      case 'array':
          result = ~Pot.indexOf(object, subject);
          break;
      case 'object':
          result = ~Pot.indexOf(object, subject);
          break;
      case 'number':
          result = ~object.toString().indexOf(subject);
          break;
      default:
          result = false;
          break;
    }
    return !!result;
  },
  /**
   * Return the copy object that was removed a subject value.
   *
   *
   * @example
   *   // String
   *   debug(remove('foo bar baz', 'o'));            // 'fo bar baz'
   *   debug(remove('foo bar baz', 'bar'));          // 'foo  baz'
   *   // Array
   *   debug(remove([1, 2, 3, 4, 5], 2));            // [1, 3, 4, 5]
   *   debug(remove([1, 2, 3, 4, 5], '3'));          // [1, 2, 3, 4, 5]
   *   debug(remove([1, 2, 3, 4, 5], '3', true));    // [1, 2, 4, 5]
   *   // Object
   *   debug(remove({A: 1, B: 2, C: 3}, 2));         // {A: 1, C: 3}
   *   debug(remove({A: 1, B: 2, C: 3}, '3'));       // {A: 1, B: 2, C: 3}
   *   debug(remove({A: 1, B: 2, C: 3}, '3', true)); // {A: 1, B: 2}
   *   // Number
   *   debug(remove(1234512345, 2));                 // 134512345
   *   debug(remove(1234512345, 123));               // 4512345
   *
   *
   * @param  {*}       object   The target value.
   * @param  {*}       subject  The subject value.
   * @param  {Boolean} (loose)  Whether to use loose compare operator(==).
   *                              Default is strict operator(===).
   * @return {*}                The removed value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  remove : function(object, subject, loose) {
    var result, i, len, done = false;
    result = object;
    if (object != null) {
      switch (Pot.typeLikeOf(object)) {
        case 'string':
            result = object.replace(subject, '');
            break;
        case 'array':
            if (!loose && Pot.System.isBuiltinArrayIndexOf) {
              result = Pot.Struct.removeAt(
                object,
                indexOf.call(object, subject)
              );
            } else {
              result = [];
              len = object.length;
              for (i = 0; i < len; i++) {
                try {
                  if (!done &&
                      (!loose && object[i] === subject) ||
                      (loose  && object[i] ==  subject)) {
                    done = true;
                  } else {
                    result[result.length] = object[i];
                  }
                } catch (e) {}
              }
            }
            break;
        case 'object':
            result = {};
            for (i in object) {
              try {
                if (!done &&
                    (!loose && object[i] === subject) ||
                    (loose  && object[i] ==  subject)) {
                  done = true;
                } else {
                  result[i] = object[i];
                }
              } catch (e) {}
            }
            break;
        case 'number':
            result = object.toString().replace(subject, '') - 0;
            break;
        default:
            result = object;
            break;
      }
    }
    return result;
  },
  /**
   * Return the copy object that was removed all subject value.
   *
   *
   * @example
   *   // String
   *   debug(removeAll('foo bar baz', 'o'));            // 'f bar baz'
   *   debug(removeAll('foo bar baz', 'ba'));           // 'foo r z'
   *   // Array
   *   debug(removeAll([1, 2, 3, 1, 2], 2));            // [1, 3, 1]
   *   debug(removeAll([1, 2, 3, 1, 2], '2'));          // [1, 2, 3, 1, 2]
   *   debug(removeAll([1, 2, 3, 1, 2], '2', true));    // [1, 3, 1]
   *   // Object
   *   debug(removeAll({A: 1, B: 2, C: 2}, 2));         // {A: 1}
   *   debug(removeAll({A: 1, B: 2, C: 2}, '2'));       // {A: 1, B: 2, C: 2}
   *   debug(removeAll({A: 1, B: 2, C: 2}, '2', true)); // {A: 1}
   *   // Number
   *   debug(removeAll(1234512345, 2));                 // 13451345
   *   debug(removeAll(1234512345, 123));               // 4545
   *
   *
   * @param  {*}       object   The target value.
   * @param  {*}       subject  The subject value.
   * @param  {Boolean} (loose)  Whether to use loose compare operator(==).
   *                              Default is strict operator(===).
   * @return {*}                The removed value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  removeAll : function(object, subject, loose) {
    var result, i, len, done = false;
    result = object;
    if (object != null) {
      switch (Pot.typeLikeOf(object)) {
        case 'string':
            if (Pot.isRegExp(subject)) {
              if (!subject.global) {
                subject = new RegExp(
                  subject.source,
                  'g' + (subject.ignoreCase ? 'i' : '') +
                        (subject.multiline  ? 'm' : '')
                );
              }
            } else {
              subject = new RegExp(rescape(subject), 'g');
            }
            result = object.replace(subject, '');
            break;
        case 'array':
            result = [];
            len = object.length;
            for (i = 0; i < len; i++) {
              try {
                if ((!loose && object[i] === subject) ||
                    (loose  && object[i] ==  subject)) {
                  continue;
                }
                result[result.length] = object[i];
              } catch (e) {}
            }
            break;
        case 'object':
            result = {};
            for (i in object) {
              try {
                if ((!loose && object[i] === subject) ||
                    (loose  && object[i] ==  subject)) {
                  continue;
                }
                result[i] = object[i];
              } catch (e) {}
            }
            break;
        case 'number':
            result = object.toString().split(subject).join('') - 0;
            break;
        default:
            result = object;
            break;
      }
    }
    return result;
  },
  /**
   * Return the copy object that was removed a subject value.
   *
   *
   * @example
   *   // String
   *   debug(removeAt('foo bar baz', 2));         // 'fo bar baz'
   *   debug(removeAt('foo bar baz', 2, 5));      // 'fo baz'
   *   debug(removeAt('foo bar baz', 100));       // 'foo bar baz'
   *   // Array
   *   debug(removeAt([1, 2, 3, 4, 5], 2));       // [1, 2, 4, 5]
   *   debug(removeAt([1, 2, 3, 4, 5], 2, 2));    // [1, 2, 5]
   *   debug(removeAt([1, 2, 3, 4, 5], -1, 5));   // [1, 2, 3, 4]
   *   // Object
   *   debug(removeAt({A: 1, B: 2, C: 3}, 2));    // {A: 1, B: 2}
   *   debug(removeAt({A: 1, B: 2, C: 3}, 1, 5)); // {A: 1}
   *   debug(removeAt({A: 1, B: 2, C: 3}, 5));    // {A: 1, B: 2, C: 3}
   *   // Number
   *   debug(removeAt(1234512345, 2));            // 123451245
   *   debug(removeAt(1234512345, 2, 3));         // 1234545
   *   debug(removeAt(-1234512345, 2, 3));        // -1234545
   *
   *
   * @param  {*}        object   The target value.
   * @param  {Number}   index    The start index.
   * @param  {Number}  (length)  (Optional) The removal length (default=1).
   * @return {*}                 The removed value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  removeAt : function(object, index, length) {
    var result, me = arguments.callee, i, idx, len, n;
    result = object;
    if (object != null) {
      idx = index - 0;
      len = (length - 0) || 1;
      if (isNaN(idx)) {
        return result;
      }
      switch (Pot.typeLikeOf(object)) {
        case 'string':
            if (object) {
              if (idx >= 0 && len > 0) {
                if (idx === 0) {
                  result = object.substring(len);
                } else {
                  result = object.substring(0, idx) +
                          object.substring(idx + len);
                }
              }
            }
            break;
        case 'array':
            if (object.length) {
              result = arrayize(object);
              splice.call(result, idx, len);
            }
            break;
        case 'object':
            result = {};
            n = 0;
            for (i in object) {
              if (n < idx || n > idx + len) {
                try {
                  result[i] = object[i];
                } catch (e) {}
              }
              n++;
            }
            break;
        case 'number':
            minus = (object < 0);
            result = me(
              Math.abs(object).toString().split('').reverse().join(''),
              idx,
              len
            ).toString().split('').reverse().join('') - 0;
            if (minus) {
              result = -result;
            }
            break;
        default:
            result = object;
            break;
      }
    }
    return result;
  },
  /**
   * Compares two objects for equality.
   * If two objects have same length and same scalar value then
   *   will return true. Otherwise will return false.
   *
   *
   * @example
   *   var obj1 = {foo: 10, bar: 20, baz: 30};
   *   var obj2 = {foo: 10, bar: 20, baz: 30};
   *   var obj3 = {a: 'hoge', b: 'fuga'};
   *   debug(equals(obj1, obj2)); // true
   *   debug(equals(obj1, obj3)); // false
   *   var obj4 = {};
   *   var obj5 = {};
   *   debug(equals(obj4, obj5)); // true
   *
   *
   * @example
   *   var arr1 = [1, 2, 3];
   *   var arr2 = [1, 2, 3];
   *   var arr3 = [1, 2, 10];
   *   debug(equals(arr1, arr2)); // true
   *   debug(equals(arr1, arr3)); // false
   *   var arr4 = [];
   *   var arr5 = [];
   *   debug(equals(arr4, arr5)); // true
   *   var cmp = function(a, b) {
   *     return a == b ||
   *       String(a).toLowerCase() == String(b).toLowerCase();
   *   };
   *   var arr6 = [1, 2, 'foo', 'bar'];
   *   var arr7 = ['1', 2, 'FOO', 'baR'];
   *   debug(equals(arr6, arr7, cmp)); // true
   *
   *
   * @example
   *   var func1 = (function() {});
   *   var func2 = (function() {});
   *   var func3 = (function() { return this; });
   *   debug(equals(func1, func2)); // true
   *   debug(equals(func1, func3)); // false
   *
   *
   * @example
   *   var date1 = new Date();
   *   var date2 = new Date(date1.getTime());
   *   var date3 = new Date(date1.getTime() + 100);
   *   debug(equals(date1, date2)); // true
   *   debug(equals(date1, date3)); // false
   *
   *
   * @example
   *   var str1 = 'foobarbaz';
   *   var str2 = 'foobarbaz';
   *   var str3 = 'hoge';
   *   debug(equals(str1, str2)); // true
   *   debug(equals(str1, str3)); // false
   *
   *
   * @example
   *   var num1 = 12345;
   *   var num2 = 12345;
   *   var num3 = 12345.455512;
   *   var num4 = 12345.443556;
   *   var num5 = 12345.443556999;
   *   debug(equals(num1, num2)); // true
   *   debug(equals(num1, num3)); // false
   *   debug(equals(num3, num4)); // false
   *   debug(equals(num4, num5)); // true
   *
   *
   *
   * @param  {Array|Object|*}   object    The first object to compare.
   * @param  {Array|Object|*}   subject   The second object to compare.
   * @param  {Function}         (func)    (Optional) The comparison function.
   *                                        e.g. function(a, b) {
   *                                               return a == b;
   *                                             }
   *                                        Should take 2 arguments to compare,
   *                                        and return true if the arguments
   *                                        are equal.
   *                                        Defaults to which compares the
   *                                        elements using the
   *                                        built-in '===' operator.
   * @return {Boolean}                      Whether the two objects are equal.
   * @type  Function
   * @function
   * @static
   * @public
   */
  equals : function(object, subject, func) {
    var result = false, cmp, empty;
    /**@ignore*/
    cmp = Pot.isFunction(func) ? func : (function(a, b) { return a === b; });
    if (object == null) {
      if (cmp(object, subject)) {
        result = true;
      }
    } else {
      switch (Pot.typeLikeOf(object)) {
        case 'array':
            if (subject && Pot.isArrayLike(subject)) {
              if (Pot.isEmpty(object) && Pot.isEmpty(subject)) {
                result = true;
              } else {
                result = false;
                each(object, function(v, i) {
                  if (!cmp(v, subject[i])) {
                    result = false;
                    throw Pot.StopIteration;
                  } else {
                    result = true;
                  }
                });
              }
            }
            break;
        case 'object':
            if (subject && Pot.isObject(subject)) {
              if ((Pot.isDOMLike(object)  || !Pot.isPlainObject(object)) &&
                  (Pot.isDOMLike(subject) || !Pot.isPlainObject(subject))) {
                result = (object === subject);
              } else {
                if (Pot.isEmpty(object) && Pot.isEmpty(subject)) {
                  result = true;
                } else {
                  result = false;
                  each(object, function(v, k) {
                    if (!cmp(v, subject[k])) {
                      result = false;
                      throw Pot.StopIteration;
                    } else {
                      result = true;
                    }
                  });
                }
              }
            }
            break;
        case 'string':
            if (Pot.isString(subject)) {
              if (cmp(object.toString(), subject.toString())) {
                result = true;
              }
            }
            break;
        case 'number':
            if (Pot.isNumber(subject)) {
              if (Pot.isInt(subject)) {
                if (cmp(object, subject)) {
                  result = true;
                }
              } else {
                if (Math.abs(object - subject) <= 0.000001) {
                  result = true;
                }
              }
            }
            break;
        case 'function':
            if (Pot.isFunction(subject)) {
              if (cmp(object.toString(), subject.toString()) &&
                  object.constructor === subject.constructor) {
                /**@ignore*/
                empty = function(a) {
                  for (var p in a) {
                    return false;
                  }
                  return true;
                };
                if (empty(object) && empty(subject)) {
                  result = true;
                } else {
                  result = false;
                  each(object, function(v, k) {
                    if (!cmp(v, subject[k])) {
                      result = false;
                      throw Pot.StopIteration;
                    } else {
                      result = true;
                    }
                  });
                }
                if (result) {
                  if (empty(object.prototype) && empty(subject.prototype)) {
                    result = true;
                  } else {
                    result = false;
                    each(object.prototype, function(v, k) {
                      if (!cmp(v, subject.prototype[k])) {
                        result = false;
                        throw Pot.StopIteration;
                      } else {
                        result = true;
                      }
                    });
                  }
                }
              }
            }
            break;
        case 'boolean':
            if (Pot.isBoolean(subject)) {
              if (cmp(object != false, subject != false)) {
                result = true;
              }
            }
            break;
        case 'date':
            if (Pot.isDate(subject)) {
              if (cmp(object.getTime(), subject.getTime())) {
                result = true;
              }
            }
            break;
        case 'error':
            if (Pot.isError(subject)) {
              if ((('message' in object &&
                    cmp(object.message, subject.message)) ||
                   ('description' in object &&
                    cmp(object.description, subject.description))) &&
                    cmp(object.constructor, subject.constructor)) {
                result = true;
              }
            }
            break;
        case 'regexp':
            if (Pot.isRegExp(subject)) {
              if (cmp(object.toString(), subject.toString())) {
                result = true;
              }
            }
            break;
        default:
            if (Pot.typeOf(object) === Pot.typeOf(subject) &&
                cmp(object, subject)) {
              result = true;
            }
            break;
      }
    }
    return result;
  },
  /**
   * Reverse the object.
   *
   *
   * @example
   *   debug(reverse({foo: 1, bar: 2, baz: 3}));
   *   // @results {baz: 3, bar: 2, foo: 1}
   *
   *
   * @example
   *   debug(reverse([1, 2, 3, 4, 5]));
   *   // @results [5, 4, 3, 2, 1]
   *
   *
   * @example
   *   debug(reverse('123abc'));
   *   // @results 'cba321'
   *
   *
   * @param  {Object|Array|*}  o   A target object.
   * @return {Object|*}            The result object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  reverse : function(o) {
    var result, revs, i, p, val;
    switch (Pot.typeLikeOf(o)) {
      case 'object':
          result = {};
          revs = [];
          for (p in o) {
            try {
              if (hasOwnProperty.call(o, p)) {
                try {
                  val = o[p];
                } catch (ex) {
                  continue;
                }
                revs[revs.length] = [p, val];
              }
            } catch (e) {}
          }
          i = revs.length;
          while (--i >= 0) {
            result[revs[i][0]] = revs[i][1];
          }
          break;
      case 'array':
          try {
            if (Pot.isArray(o)) {
              result = o.reverse();
            } else {
              throw o;
            }
          } catch (e) {
            result = [];
            i = o.length;
            while (--i >= 0) {
              try {
                if (hasOwnProperty.call(o, i)) {
                  try {
                    val = o[i];
                  } catch (ex) {
                    continue;
                  }
                  result[result.length] = val;
                }
              } catch (err) {}
            }
          }
          break;
      case 'string':
          result = o.split('').reverse().join('');
          break;
      case 'number':
          result = -o;
          break;
      case 'boolean':
          result = (o == false);
          break;
      default:
          result = o;
          break;
    }
    return result;
  },
  /**
   * Flips the object.
   *
   *
   * @example
   *   debug(flip({foo: 'A', bar: 'B', baz: 'C'}));
   *   // @results {A: 'foo', B: 'bar', C: 'baz'}
   *
   *
   * @param  {Object|Array|*}  o   A target object.
   * @return {Object|*}            The result object.
   * @type  Function
   * @function
   * @static
   * @public
   */
  flip : function(o) {
    var result;
    switch (Pot.typeLikeOf(o)) {
      case 'object':
          result = {};
          each(o, function(v, k) {
            result[stringify(v, true)] = k;
          });
          break;
      case 'array':
          result = [];
          each(o, function(v, i) {
            if (Pot.isNumeric(v)) {
              result[(v - 0)] = i;
            }
          });
          break;
      case 'string':
          result = '';
          each(o.split(''), function(c) {
            result += String.fromCharCode(
              c.charCodeAt(0) ^ 0xFFFF
            );
          });
          break;
      case 'number':
          result = ~o;
          break;
      case 'boolean':
          result = (o == false);
          break;
      default:
          result = o;
          break;
    }
    return result;
  },
  /**
   * Shuffle an object and returns it.
   * This function keeps the original object intact.
   *
   *
   * @example
   *   debug(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]));
   *   // @results  e.g. (uncertain)
   *   //   [8, 1, 6, 4, 3, 5, 2, 7, 9]
   *   //
   *   debug(shuffle(['foo', 'bar', 'baz']));
   *   // @results  e.g.
   *   //   ['bar', 'foo', 'baz']
   *   //
   *   debug(shuffle(12345));
   *   // @results  e.g.
   *   //   25143
   *   //
   *   debug(shuffle(-123456789.0839893));
   *   // @results  e.g.
   *   //   -276195348.9908833
   *   //
   *   debug(shuffle({a: 1, b: 2, c: 3, d: 4, e: 5}));
   *   // @results  e.g.
   *   //   {c: 3, b: 2, d: 4, e: 5, a: 1}
   *   //
   *   debug(shuffle('abcdef12345'));
   *   // @results  e.g.
   *   //   'ae2d135cb4f'
   *   //
   *
   *
   * @param  {Array}  array  A target array.
   * @return {Array}         An array of result.
   * @type  Function
   * @function
   * @static
   * @public
   */
  shuffle : function(o) {
    var result, i, j, tmp, points, sign, Struct = Pot.Struct;
    if (Pot.isArray(o)) {
      result = o.slice();
      i = result.length;
      while (i > 0) {
        j = Math.floor(Math.random() * i);
        tmp = result[--i];
        result[i] = result[j];
        result[j] = tmp;
      }
    } else if (o && Pot.isObject(o)) {
      result = Struct.tuple(Struct.shuffle(Pot.items(o)));
    } else if (o && Pot.isString(o)) {
      result = Struct.shuffle(o.split('')).join('');
    } else if (Pot.isNumber(o) && Pot.isNumeric(o)) {
      sign = ((o - 0) < 0) ? '-' : '';
      points = Math.abs(o).toString().split('.');
      result = sign + Struct.shuffle(points.shift());
      if (points.length) {
        result += '.' + Struct.shuffle(points.pop());
      }
      result = result - 0;
    } else {
      result = o;
    }
    return result;
  },
  /**
   * Fill the first argument value with in the specific value.
   * The available first argument types are Array and String, and Object.
   *
   *
   * @example
   *   debug(fill([1, 2], 3, 5));
   *   // @results [1, 2, 3, 3, 3, 3, 3]
   *   debug(fill([], null, 3));
   *   // @results [null, null, null]
   *   debug(fill('foo', 'o', 10));
   *   // @results 'foooooooooooo'
   *   debug(fill('', 'hoge', 5));
   *   // @results 'hogehogehogehogehoge'
   *   debug(fill({}, 2, 5));
   *   // @results {'0': 2, '1': 2, '2': 2, '3': 2, '4': 2}
   *   debug(fill({a: 1, b: 2, c: 3}, null));
   *   // @results {a: null, b: null, c: null}
   *   debug(fill(100, 5, 10));
   *   // @results 5555555555100
   *
   *
   * @param  {Array|String|Object|Number|*}  defaults  The default value.
   *                                                   This object value does
   *                                                     not replace. use
   *                                                     returned value.
   * @param  {*}                             value     The value to fill
   *                                                     the object.
   * @param  {Number}                        count     The number of times to
   *                                                     fill the object.
   * @return {Array|String|Object|Number|*}            The result of filled.
   * @type  Function
   * @function
   * @static
   * @public
   */
  fill : function(defaults, value, count) {
    var result = null, args = arguments, i, j, val;
    if (args.length === 2) {
      count = value;
      value = defaults;
      switch (Pot.typeLikeOf(defaults)) {
        case 'string':
            defaults = '';
            break;
        case 'object':
            defaults = {};
            break;
        case 'number':
            defaults = 0;
            break;
        case 'array':
            if (defaults.length === 1) {
              value = defaults[0];
            }
            defaults = [];
            break;
        default:
            break;
      }
    }
    if (Pot.isNumeric(count) || Pot.isObject(defaults)) {
      i = Math.floor(count - 0);
      switch (Pot.typeLikeOf(defaults)) {
        case 'array':
            result = arrayize(defaults);
            while (--i >= 0) {
              result[result.length] = value;
            }
            break;
        case 'string':
            result = stringify(defaults);
            val = stringify(value);
            while (--i >= 0) {
              result += val;
            }
            break;
        case 'object':
            result = {};
            each(defaults, function(v, k) {
              result[k] = value;
            });
            if (i) {
              j = 0;
              while (--i >= 0) {
                result[j++] = value;
              }
            }
            break;
        case 'number':
            result = ((defaults - 0) || 0).toString();
            val = Math.floor(Math.abs((value - 0) || 0)).toString();
            while (--i >= 0) {
              result = val + result;
            }
            result = result - 0;
            break;
        default:
            result = defaults;
            break;
      }
    }
    return result;
  },
  /**
   * Return a string that is joined by the object keys and values.
   *
   * Arguments can passed in any order.
   * (The first will be the `delimiter` as a string).
   *
   * If the `tail` is given as string
   *   then will be append the `tail` itself to string.
   *
   *
   * @example
   *   debug(implode({color: 'blue', margin: '5px'}, ':', ';', true));
   *   // @results 'color:blue;margin:5px;'
   *
   *
   * @example
   *   //
   *   // Arguments can passed in any order.
   *   // (The first will be the `delimiter` as a string).
   *   //
   *   debug(implode('+', {a: 1, b: 2, c: 3}, '*'));
   *   // @results 'a+1*b+2*c+3'
   *
   *
   * @example
   *   //
   *   // If the `tail` is given as string
   *   //  then will be append the `tail` itself to string.
   *   //
   *   debug(implode('>>', {a: 1, b: 2, c: 3}, '^', '==?'));
   *   // @results 'a>>1^b>>2^c>>3==?'
   *
   *
   * @param  {Object}   object      The target object.
   * @param  {String}  (delimiter)  The combining character of each
   *                                  property name and value.
   *                                  (default = ':').
   * @param  {String}  (separator)  The character string that
   *                                  will be combined by
   *                                  the following property and
   *                                  previous property.
   *                                  (default = ',').
   * @param  {Boolean} (tail)       If given "true" then will put
   *                                  `separator` to the end of the string.
   * @return {String}               The combined string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  implode : function(object/*[, delimiter[, separator[, tail]]]*/) {
    var
    result = '', ins = [], p, d, s, o, t, nop,
    args = arguments, len = args.length, i, v, params,
    isString = Pot.isString, isObject = Pot.isObject,
    defs = {
      delimiter : ':',
      separator : ','
    };
    for (i = 0; i < len; i++) {
      if (!o && isObject(args[i])) {
        o = args[i];
      } else if (!d && isString(args[i])) {
        d = args[i];
      } else if (!s && isString(args[i])) {
        s = args[i];
      } else if (isObject(o) && isString(d) && isString(s)) {
        t = args[i];
      } else if (!params && isObject(o) && isObject(args[i]) &&
                 (args[i].delimiter || args[i].separator || args[i].tail)) {
        params = args[i];
        d = d || stringify(params.delimiter, true);
        s = s || stringify(params.separator, true);
        t = t || params.tail;
      }
    }
    if (o && isObject(o)) {
      if (d === nop) {
        d = defs.delimiter;
      }
      if (s === nop) {
        s = defs.separator;
      }
      for (p in o) {
        try {
          v = o[p];
        } catch (e) {
          continue;
        }
        ins[ins.length] = p + d + stringify(v);
      }
      result = ins.join(s);
      if (t) {
        result += isString(t) ? t : s;
      }
    }
    return result;
  },
  /**
   * Separate a string by specified delimiter and separator,
   *   then returns  a converted object.
   * This function works like the opposite "implode".
   *
   * @see Pot.Struct.implode
   *
   *
   * @example
   *   var string = 'color:blue;margin:5px;';
   *   var result = explode(string, ':', ';');
   *   debug(result);
   *   // @results {color: 'blue', margin: '5px'}
   *
   *
   * @example
   *   var string = 'foo=1&bar=2&baz=3';
   *   var result = explode(string, {delimiter: '=', separator: '&'});
   *   debug(result);
   *   // @results {foo: '1', bar: '2', baz: '3'}
   *
   *
   * @example
   *   var string = 'A : 1, B:2, C: 3;';
   *   var result = explode(string, {
   *         delimiter : /(?:\s*:\s*)/,
   *         separator : /(?:\s*[,;]\s*)/
   *   });
   *   debug(result);
   *   // @results {A: '1', B: '2', C: '3'}
   *
   *
   * @param  {String}          string      The subject string.
   * @param  {String|RegExp}  (delimiter)  The split character of each
   *                                         property name and value.
   *                                         (default = ':').
   * @param  {String|RegExp}  (separator)  The character string that
   *                                         will be split by
   *                                         the following property and
   *                                         previous property.
   *                                         (default = ',').
   * @return {Object}                      The result object that
   *                                         separated from a string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  explode : function(string/*[, delimiter[, separator]]*/) {
    var
    result = {}, args = arguments, argn = args.length, nop,
    s, delim, sep, n, params,
    isObject = Pot.isObject,
    isString = Pot.isString,
    isRegExp = Pot.isRegExp,
    defaults = {
      delimiter : ':',
      separator : ','
    };
    for (n = 0; n < argn; n++) {
      if (isObject(args[n]) &&
          (args[n].delimiter || args[n].separator)) {
        params = args[n];
        delim = delim || params.delimiter;
        sep   = sep   || params.separator;
      } else if (!s && isString(args[n])) {
        s = args[n];
      } else if (!delim && (isString(args[n]) || isRegExp(args[n]))) {
        delim = args[n];
      } else if (!sep && (isString(args[n]) || isRegExp(args[n]))) {
        sep = args[n];
      }
    }
    s = stringify(s);
    if (s) {
      if (delim === nop) {
        delim = defaults.delimiter;
      }
      if (sep === nop) {
        sep = defaults.separator;
      }
      each(s.split(sep), function(unit) {
        var parts, i, len;
        if (unit) {
          parts = unit.split(delim);
          len = parts.length;
          i = 0;
          do {
            result[stringify(parts[i++], true)] = parts[i++];
          } while (i < len);
        }
      });
    }
    return result;
  },
  /**
   * Joins the all arguments to a string.
   *
   *
   * @example
   *   debug(glue([1, 2, 3, 4, 5]));
   *   // @results '12345'
   *   debug(glue('foo', 'bar', 'baz'));
   *   // @results 'foobarbaz'
   *   debug(glue(1, [2, 3, ['foo']], ['bar', 'baz']));
   *   // @results '123foobarbaz'
   *
   *
   * @param  {Array|...*}  args  The target items.
   * @return {String}            The joined string from array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  glue : function() {
    var result = '', args = arguments, arg, flatten = Pot.Collection.flatten;
    switch (args.length) {
      case 0:
          break;
      case 1:
          arg = args[0];
          if (Pot.isArray(arg)) {
            result = flatten(arg).join('');
          } else if (Pot.isObject(arg) || Pot.isArrayLike(arg)) {
            each(arg, function(v) {
              result += stringify(v);
            });
          } else {
            result = stringify(arg);
          }
          break;
      default:
          result = flatten(arrayize(args)).join('');
          break;
    }
    return result;
  },
  /**
   * Clears the object that is any types.
   *
   *
   * @example
   *   var obj = {foo: 1, bar: 2, baz: 3};
   *   clearObject(obj);
   *   debug(obj);
   *   // @results  obj = {}
   *   var arr = [1, 2, 3, 4, 5];
   *   clearObject(arr);
   *   debug(arr);
   *   // @results  arr = []
   *
   *
   * @param  {*}   o   A target object.
   * @return {*}       Return argument `o`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  clearObject : function(o) {
    var p;
    if (o) {
      if (Pot.isArrayLike(o)) {
        p = o.length;
        while (--p >= 0) {
          try {
            delete o[p];
          } catch (e) {}
        }
        try {
          o.length = 0;
        } catch (e) {}
      } else if (Pot.isObject(o)) {
        for (p in o) {
          try {
            delete o[p];
          } catch (e) {}
        }
      } else {
        o = null; // noop
      }
    }
    return o;
  }
});

// Update Pot object.
Pot.update({
  invoke      : Pot.Struct.invoke,
  clone       : Pot.Struct.clone,
  bind        : Pot.Struct.bind,
  partial     : Pot.Struct.partial,
  keys        : Pot.Struct.keys,
  values      : Pot.Struct.values,
  tuple       : Pot.Struct.tuple,
  unzip       : Pot.Struct.unzip,
  pairs       : Pot.Struct.pairs,
  count       : Pot.Struct.count,
  first       : Pot.Struct.first,
  firstKey    : Pot.Struct.firstKey,
  last        : Pot.Struct.last,
  lastKey     : Pot.Struct.lastKey,
  contains    : Pot.Struct.contains,
  remove      : Pot.Struct.remove,
  removeAll   : Pot.Struct.removeAll,
  removeAt    : Pot.Struct.removeAt,
  equals      : Pot.Struct.equals,
  reverse     : Pot.Struct.reverse,
  flip        : Pot.Struct.flip,
  shuffle     : Pot.Struct.shuffle,
  fill        : Pot.Struct.fill,
  implode     : Pot.Struct.implode,
  explode     : Pot.Struct.explode,
  glue        : Pot.Struct.glue,
  clearObject : Pot.Struct.clearObject
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of DateTime.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * DateTime utilities.
   *
   * @param  {*}       x  The timestamp.
   * @return {Number}     The timestamp at that time.
   *
   * @name Pot.DateTime
   * @type Function
   * @class
   * @function
   * @static
   * @public
   */
  DateTime : function(x) {
    return (new Date(x)).getTime();
  }
});

update(Pot.DateTime, {
  /**
   * @lends Pot.DateTime
   */
  /**
   * Get the current time as milliseconds.
   *
   *
   * @example
   *   var time = now(); // equals (new Date()).getTime();
   *   debug(time); // 1323446177282
   *
   *
   * @return    Return the current time as milliseconds.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  now : now,
  /**
   * Get the current UNIX timestamp.
   *
   * @return      Return the current UNIX timestamp.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  time : function() {
    return Math.round(now() / 1000);
  },
  /**
   * Return the formatted date.
   *
   * That works the same as PHP's date function probably.
   * (Refer the manual.)
   * @link http://php.net/function.date
   *
   * Use a backslash '\\' if escape the next character.
   *
   * <pre>
   * ------------------------------------------------
   * Extended formats:
   *   - J : Japanese weekday (日 ～ 土)
   *   - o : Old Japanese Month (霜月, 水無月, etc.)
   * ------------------------------------------------
   * </pre>
   *
   *
   * @example
   *   var result = Pot.DateTime.format('Y-m-d H:i:s');
   *   debug(result);
   *   // @results '2011-06-07 01:25:17'
   *
   *
   * @example
   *   var result = Pot.DateTime.format('Y/m/d (J) H:i [\\o=o]');
   *   debug(result);
   *   // @results '2011/06/08 (水) 11:30 [o=水無月]'
   *
   *
   * @example
   *   var result = Pot.DateTime.format(Pot.DateTime.format.RFC2822);
   *   debug(result);
   *   // @results 'Wed, 08 Jun 2011 02:34:21 +0900'
   *
   *
   * @param  {String}          format   A format string. (e.g. 'Y-m-d').
   * @param  {Date|Number|*}   (date)   (Optional) The specific timestamp.
   * @return {String}                   Return the formatted date string.
   *
   * @name  Pot.DateTime.format
   * @type  Function
   * @class
   * @function
   * @static
   * @public
   */
  format : (function() {
    /**
     * @private
     * @ignore
     */
    var DateTimeFormatter = function() {};
    update(DateTimeFormatter, {
      /**
       * @private
       * @ignore
       */
      TIMEZONE_MAPS : {
        GMT  :   0,               // Greenwich Mean
        UTC  :   0,               // Universal (Coordinated)
        WET  :   0,               // Western European
        WAT  :  -1 * 3600,        // West Africa
        AT   :  -2 * 3600,        // Azores
        NFT  :  -3 * 3600 - 1800, // Newfoundland
        AST  :  -4 * 3600,        // Atlantic Standard
        EST  :  -5 * 3600,        // Eastern Standard
        CST  :  -6 * 3600,        // Central Standard
        MST  :  -7 * 3600,        // Mountain Standard
        PST  :  -8 * 3600,        // Pacific Standard
        YST  :  -9 * 3600,        // Yukon Standard
        HST  : -10 * 3600,        // Hawaii Standard
        CAT  : -10 * 3600,        // Central Alaska
        AHST : -10 * 3600,        // Alaska-Hawaii Standard
        NT   : -11 * 3600,        // Nome
        IDLW : -12 * 3600,        // International Date Line West
        CET  :  +1 * 3600,        // Central European
        MET  :  +1 * 3600,        // Middle European
        MEWT :  +1 * 3600,        // Middle European Winter
        SWT  :  +1 * 3600,        // Swedish Winter
        FWT  :  +1 * 3600,        // French Winter
        EET  :  +2 * 3600,        // Eastern Europe, USSR Zone 1
        BT   :  +3 * 3600,        // Baghdad, USSR Zone 2
        IT   :  +3 * 3600 + 1800, // Iran
        ZP4  :  +4 * 3600,        // USSR Zone 3
        ZP5  :  +5 * 3600,        // USSR Zone 4
        IST  :  +5 * 3600 + 1800, // Indian Standard
        ZP6  :  +6 * 3600,        // USSR Zone 5
        SST  :  +7 * 3600,        // South Sumatra, USSR Zone 6
        WAST :  +7 * 3600,        // West Australian Standard
        JT   :  +7 * 3600 + 1800, // Java
        CCT  :  +8 * 3600,        // China Coast, USSR Zone 7
        JST  :  +9 * 3600,        // Japan Standard, USSR Zone 8
        CAST :  +9 * 3600 + 1800, // Central Australian Standard
        EAST : +10 * 3600,        // Eastern Australian Standard
        GST  : +10 * 3600,        // Guam Standard, USSR Zone 9
        NZT  : +12 * 3600,        // New Zealand
        NZST : +12 * 3600,        // New Zealand Standard
        IDLE : +12 * 3600         // International Date Line East
      },
      /**
       * @private
       * @ignore
       */
      WEEK : {
        en : [
          'Sunday',    'Monday',   'Tuesday',
          'Wednesday', 'Thursday', 'Friday',  'Saturday'
        ],
        ja : [
          '\u65e5', // 日
          '\u6708', // 月
          '\u706b', // 火
          '\u6c34', // 水
          '\u6728', // 木
          '\u91d1', // 金
          '\u571f'  // 土
        ]
      },
      /**
       * @private
       * @ignore
       */
      MONTH : {
        en : [
          'January',   'February', 'March',    'April',
          'May',       'June',     'July',     'August',
          'September', 'October',  'November', 'December'
        ],
        ja : [
          '\u7766\u6708',       // 睦月
          '\u5982\u6708',       // 如月
          '\u5f25\u751f',       // 弥生
          '\u536f\u6708',       // 卯月
          '\u7690\u6708',       // 皐月
          '\u6c34\u7121\u6708', // 水無月
          '\u6587\u6708',       // 文月
          '\u8449\u6708',       // 葉月
          '\u9577\u6708',       // 長月
          '\u795e\u7121\u6708', // 神無月
          '\u971c\u6708',       // 霜月
          '\u5e2b\u8d70'        // 師走
        ]
      },
      /**
       * @private
       * @ignore
       */
      DATE_SUFFIX : [
        'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'
      ],
      /**
       * @private
       * @ignore
       */
      TRANSLATE_PATTERN : /(?:\\.|[a-zA-Z])/g
    });
    DateTimeFormatter.prototype = update(DateTimeFormatter.prototype, {
      /**
       * @private
       * @ignore
       */
      format : function(pattern, date) {
        var result = '', that = this, t, fm, d, o, tr, isString = Pot.isString;
        if (!isString(pattern)) {
          t = pattern;
          pattern = date;
          date = t;
        }
        fm = stringify(pattern);
        if (Pot.isDate(date)) {
          d = date;
        } else if (Pot.isNumeric(date) || (date && isString(date))) {
          d = new Date(date);
        } else {
          d = new Date();
        }
        if (fm) {
          o = {
            self     : d,
            year     : d.getFullYear(),
            month    : d.getMonth(),
            date     : d.getDate(),
            day      : d.getDay(),
            hours    : d.getHours(),
            minutes  : d.getMinutes(),
            seconds  : d.getSeconds(),
            mseconds : d.getMilliseconds(),
            timezone : d.getTimezoneOffset(),
            time     : d.getTime()
          };
          /**@ignore*/
          tr = function(m) {
            return that.translate(m, o);
          };
          result = fm.replace(DateTimeFormatter.TRANSLATE_PATTERN, tr);
        }
        return result;
      },
      /**
       * @private
       * @ignore
       */
      translate : function(c, d) {
        switch (c.charAt(0)) {
            case '\\': return c.charAt(1);
            case 'A': return this.meridiem(d.hours).toUpperCase();
            case 'a': return this.meridiem(d.hours);
            case 'c': return this.format(Pot.DateTime.format.ATOM);
            case 'D': return DateTimeFormatter.WEEK.en[d.day].substr(0, 3);
            case 'd': return this.padding(d.date);
            case 'F': return DateTimeFormatter.MONTH.en[d.month];
            case 'G': return d.hours;
            case 'g': return this.to12Hour(d.hours);
            case 'H': return this.padding(d.hours);
            case 'h': return this.padding(this.to12Hour(d.hours));
            case 'i': return this.padding(d.minutes);
            case 'J': return DateTimeFormatter.WEEK.ja[d.day];
            case 'j': return d.date;
            case 'L': return String(this.isLeapYear(d.year) ? 1 : 0);
            case 'l': return DateTimeFormatter.WEEK.en[d.day];
            case 'M': return DateTimeFormatter.MONTH.en[d.month].substr(0, 3);
            case 'm': return this.padding(d.month + 1);
            case 'N': return this.isoDay(d.day);
            case 'n': return d.month + 1;
            case 'o': return DateTimeFormatter.MONTH.ja[d.month];
            case 'O': return this.getTimezone(d.timezone);
            case 'P': return this.getTimezone(d.timezone, true);
            case 'r': return this.format(Pot.DateTime.format.RFC2822);
            case 'S': return DateTimeFormatter.DATE_SUFFIX[d.date - 1];
            case 's': return this.padding(d.seconds);
            case 'T': return this.getTimezoneName(d.timezone);
            case 't': return this.lastDayOfMonth(d.self);
            case 'U': return Math.round(d.time / 1000);
            case 'u': return this.padding(d.mseconds, 6);
            case 'w': return d.day;
            case 'Y': return d.year;
            case 'y': return d.year.toString().substr(2, 2);
            case 'z': return this.countDate(d.year, d.month, d.date);
            case 'Z': return this.getTimezoneSec(d.timezone);
            default : break;
        }
        return c;
      },
      /**
       * @private
       * @ignore
       */
      padding : function pad(n, size, ch) {
        var s = String(n), len = (size || 2) - 0, c = String(ch || 0);
        while (s.length < len) {
          s = c + s;
        }
        return s;
      },
      /**
       * @private
       * @ignore
       */
      to12Hour : function(hours) {
        return (hours > 12) ? hours - 12 : hours;
      },
      /**
       * @private
       * @ignore
       */
      meridiem : function(hours) {
        return (((hours - 0) < 12) ? 'a' : 'p') + 'm';
      },
      /**
       * @private
       * @ignore
       */
      isoDay : function(day) {
        return ((day - 0) === 0) ? '7' : day;
      },
      /**
       * @private
       * @ignore
       */
      lastDayOfMonth : function(date) {
        var t = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        t.setTime(t.getTime() - 1);
        return t.getDate();
      },
      /**
       * @private
       * @ignore
       */
      isLeapYear : function(year) {
        var d = new Date(year, 0, 1), sum = 0, i;
        for (i = 0; i < 12; i++) {
          d.setMonth(i);
          sum += this.lastDayOfMonth(d);
        }
        return sum != 365;
      },
      /**
       * @private
       * @ignore
       */
      countDate : function(year, month, date) {
        var d = new Date(year, 0, 1), sum = -1, i, max = (month - 0);
        for (i = 0; i < max; i++) {
          d.setMonth(i);
          sum += this.lastDayOfMonth(d);
        }
        return sum + date;
      },
      /**
       * @private
       * @ignore
       */
      getTimezone : function(offset, colon) {
        var o = (offset - 0) || 0,
            a = Math.abs(o),
            sign = (o < 0) ? '+' : '-';
        return [
          sign,
          this.padding(Math.floor(a / 60)),
          colon ? ':' : '',
          this.padding(a % 60)
        ].join('');
      },
      /**
       * @private
       * @ignore
       */
      getTimezoneSec : function(offset) {
        var o = (offset - 0) || 0;
        return ((o < 0) ? '' : '-') + Math.abs(o * 60);
      },
      /**
       * @private
       * @ignore
       */
      getTimezoneName : function(offset) {
        var result, name,
            maps = DateTimeFormatter.TIMEZONE_MAPS;
            def = maps[1],
            o = (offset - 0) || 0;
            time = Math.floor(-o / 60 * 3600);
        if (time === 0) {
          result = def;
        } else {
          for (name in maps) {
            if (maps[name] === time) {
              result = name;
              break;
            }
          }
        }
        return result || def;
      }
    });
    return update(function(/*format[, date]*/) {
      var d = new DateTimeFormatter();
      return d.format.apply(d, arguments);
    }, {
      /**
       * @lends Pot.DateTime.format
       */
      /**
       * A constant string of the date format for ATOM.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      ATOM : 'Y-m-d\\TH:i:sP',
      /**
       * A constant string of the date format for COOKIE.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      COOKIE : 'l, d-M-y H:i:s T',
      /**
       * A constant string of the date format for ISO8601.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      ISO8601 : 'Y-m-d\\TH:i:sO',
      /**
       * A constant string of the date format for RFC822.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC822 : 'D, d M y H:i:s O',
      /**
       * A constant string of the date format for RFC850.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC850 : 'l, d-M-y H:i:s T',
      /**
       * A constant string of the date format for RFC1036.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC1036 : 'D, d M y H:i:s O',
      /**
       * A constant string of the date format for RFC1123.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC1123 : 'D, d M Y H:i:s O',
      /**
       * A constant string of the date format for RFC2822.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC2822 : 'D, d M Y H:i:s O',
      /**
       * A constant string of the date format for RFC3339.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC3339 : 'Y-m-d\\TH:i:sP',
      /**
       * A constant string of the date format for RSS.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RSS : 'D, d M Y H:i:s O',
      /**
       * A constant string of the date format for W3C.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      W3C : 'Y-m-d\\TH:i:sP'
    });
  })()
});

// Update Pot object.
Pot.update({
  time : Pot.DateTime.time,
  date : Pot.DateTime.format
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Complex.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Complex.
   * Comp + Lex.
   * Math and Numeric, lexical compare utilities.
   *
   * @name Pot.Complex
   * @type Object
   * @class
   * @static
   * @public
   */
  Complex : {}
});

update(Pot.Complex, {
  /**
   * @lends Pot.Complex
   */
  /**
   * Cast the value to numerical value.
   * All type of object can be convert.
   *
   *
   * @example
   *   debug(numeric(0));               // 0
   *   debug(numeric(1234567890));      // 1234567890
   *   debug(numeric(new Number(25)));  // 25
   *   debug(numeric(null));            // 0
   *   debug(numeric((void 0)));        // 0
   *   debug(numeric(true));            // 1
   *   debug(numeric(false));           // 0
   *   debug(numeric('abc'));           // 2748
   *   debug(numeric('0xFF'));          // 255
   *   debug(numeric('1e8'));           // 100000000
   *   debug(numeric('10px'));          // 10
   *   debug(numeric('1,000,000ms.'));  // 1000000
   *   debug(numeric('-512 +1'));       // -512
   *   debug(numeric([]));              // 0
   *   debug(numeric(['hoge']));        // 1
   *   debug(numeric(new Date()));      // 1323446177282
   *
   *
   * @param  {String|*}   value    The target value to convert numeric value.
   * @param  {Number}   (defaults) The default value if `value` is not numeric.
   * @return {Number}              Return the numeric value.
   * @type Function
   * @function
   * @static
   * @public
   */
  numeric : numeric,
  /**
   * Returns a random number. (supports float)
   *
   *
   * @example
   *   debug(rand(0, 1));
   *   // @results  1  (first tried)
   *
   * @example
   *   debug(rand(5, 5));
   *   // @results  5
   *
   * @example
   *   debug(rand(10, 1));
   *   // @results  7  (first tried)
   *
   * @example
   *   debug(rand(2.5, 5.75));
   *   // @results  4.64  (first tried)
   *
   * @example
   *   debug(rand(1, 1.8765));
   *   // @results  1.5087  (first tried)
   *
   *
   * @param  {Number|String}  (min)  Minimum or maximum numbers
   * @param  {Number|String}  (max)  Maximum or minimum numbers
   * @return {Number|String}         Random number between
   *                                   min and max.
   *                                   (including min and max)
   * @class
   * @name  Pot.Complex.rand
   * @type  Function
   * @function
   * @static
   * @public
   */
  rand : update(function(min, max) {
    var result = 0, args = arguments, me = args.callee,
        t, n, x, scale, forString = false, isString = Pot.isString;
    if (!me.getScale) {
      /**@ignore*/
      me.getScale = function(a) {
        var dot = '.', s = a.toString();
        return ~s.indexOf(dot) ? s.split(dot).pop().length : 0;
      };
    }
    if (isString(min) && isString(max)) {
      forString = true;
      min = min.charCodeAt(0);
      max = max.charCodeAt(0);
    }
    switch (args.length) {
      case 0: // Int32
          x = 0x7FFFFFFF;
          n = ~x;
          break;
      case 1:
          n = 0;
          x = min - 0;
          break;
      default:
          n = min - 0;
          x = max - 0;
          break;
    }
    if (n > x) {
      t = x;
      x = n;
      n = t;
    }
    if (isNaN(n)) {
      if (isNaN(x)) {
        result = 0;
      } else {
        result = x;
      }
    } else if (isNaN(x)) {
      if (isNaN(n)) {
        result = 0;
      } else {
        result = n;
      }
    } else if (!isFinite(n)) {
      if (isFinite(x)) {
        result = x;
      } else {
        result = 0;
      }
    } else if (!isFinite(x)) {
      if (isFinite(n)) {
        result = n;
      } else {
        result = 0;
      }
    } else {
      scale = Math.max(me.getScale(n), me.getScale(x));
      if (scale) {
        result = (Math.random() * (x - n) + n).toFixed(scale);
      } else {
        result = Math.floor(Math.random() * (x - n + 1)) + n;
      }
    }
    if (forString) {
      result = String.fromCharCode(result);
    } else {
      result = result - 0;
    }
    return result;
  }, (function() {
    var
    ALPHAS    = LOWER_ALPHAS + UPPER_ALPHAS,
    ALPHANUMS = ALPHAS + DIGITS;
    /**@ignore*/
    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return {
      /**
       * @lends Pot.Complex.rand
       */
      /**
       * Returns the random alphabet(s).
       *
       * @param  {Number}  (length)  Length.
       * @return {String}            The random alphabet(s).
       *
       * @name Pot.Complex.rand.alpha
       * @class
       * @type  Function
       * @function
       * @static
       * @public
       */
      alpha : update(function(length) {
        var result = '', c, len, max;
        len = Pot.isNumeric(length) ? length - 0 : 1;
        if (len > 0) {
          c = [];
          max = ALPHAS.length - 1;
          while (--len >= 0) {
            c[c.length] = ALPHAS.charAt(randInt(0, max));
          }
          result = c.join('');
        }
        return result;
      }, {
        /**
         * @lends Pot.Complex.rand.alpha
         */
        /**
         * Returns the random alphabet(s) as lowercase.
         *
         * @param  {Number}  (length)  Length.
         * @return {String}            The random alphabet(s).
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        lower : function(/*[length]*/) {
          return Pot.Complex.rand.alpha.apply(null, arguments).toLowerCase();
        },
        /**
         * Returns the random alphabet(s) as uppercase.
         *
         * @param  {Number}  (length)  Length.
         * @return {String}            The random alphabet(s).
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        upper : function(/*[length]*/) {
          return Pot.Complex.rand.alpha.apply(null, arguments).toUpperCase();
        }
      }),
      /**
       * @lends Pot.Complex.rand
       */
      /**
       * Returns the random alphabet(s) and digit(s).
       *
       * @param  {Number}  (length)  Length.
       * @param  {Boolean} (valid)   Whether the first character to
       *                               specify a alphabet.
       * @return {String}            The random alphabet(s) and digit(s).
       *
       * @name Pot.Complex.rand.alnum
       * @class
       * @type  Function
       * @function
       * @static
       * @public
       */
      alnum : update(function(length, valid) {
        var result = '', len, max
        len = Pot.isNumeric(length) ? length - 0 : 1;
        if (len > 0) {
          c = [];
          max = ALPHANUMS.length - 1;
          if (valid) {
            c[c.length] = Pot.Complex.rand.alpha(1);
            len--;
          }
          while (--len >= 0) {
            c[c.length] = ALPHANUMS.charAt(randInt(0, max));
          }
          result = c.join('');
        }
        return result;
      }, {
        /**
         * @lends Pot.Complex.rand.alnum
         */
        /**
         * Returns the random alphabet(s) and digit(s) as lowercase.
         *
         * @param  {Number}  (length)  Length.
         * @param  {Boolean} (valid)   Whether the first character to
         *                               specify a alphabet.
         * @return {String}            The random alphabet(s) and digit(s).
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        lower : function(/*[length[, valid]]*/) {
          return Pot.Complex.rand.alnum.apply(null, arguments).toLowerCase();
        },
        /**
         * Returns the random alphabet(s) and digit(s) as uppercase.
         *
         * @param  {Number}  (length)  Length.
         * @param  {Boolean} (valid)   Whether the first character to
         *                               specify a alphabet.
         * @return {String}            The random alphabet(s) and digit(s).
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        upper : function(/*[length[, valid]]*/) {
          return Pot.Complex.rand.alnum.apply(null, arguments).toUpperCase();
        }
      }),
      /**
       * @lends Pot.Complex.rand
       */
      /**
       * Returns the random color part.
       *
       * @param  {Boolean}  (addSharp)  (Optional) Whether add the
       *                                  sharp '#' to prefix.
       * @return {String}               The random color part.
       *
       * @name Pot.Complex.rand.color
       * @class
       * @type  Function
       * @function
       * @static
       * @public
       */
      color : update(function(addSharp) {
        var col = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        while (col.length < 6) {
          col += Math.floor(Math.random() * 0xF).toString(16);
        }
        while (col.length > 6) {
          col = col.substring(1);
        }
        return (addSharp ? '#' : '') + col;
      }, {
        /**
         * @lends Pot.Complex.rand.color
         */
        /**
         * Returns the random color part as lowercase.
         *
         * @param  {Boolean}  (addSharp)  (Optional) Whether add the
         *                                  sharp '#' to prefix.
         * @return {String}               The random color part.
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        lower : function(/*[addSharp]*/) {
          return Pot.Complex.rand.color.apply(null, arguments).toLowerCase();
        },
        /**
         * Returns the random color part as uppercase.
         *
         * @param  {Boolean}  (addSharp)  (Optional) Whether add the
         *                                  sharp '#' to prefix.
         * @return {String}               The random color part.
         *
         * @type  Function
         * @function
         * @static
         * @public
         */
        upper : function(/*[addSharp]*/) {
          return Pot.Complex.rand.color.apply(null, arguments).toUpperCase();
        }
      })
    };
  })()),
  /**
   * Return the value that limited in the range of
   *  maximum value from minimum value.
   *
   *
   * @example
   *   var result = limit(5, 10, 50);
   *   debug(result);
   *   // @results 10
   *
   * @example
   *   var result = limit(80, 10, 50);
   *   debug(result);
   *   // @results 50
   *
   * @example
   *   var result = limit(5, 2, 8);
   *   debug(result);
   *   // @results 5
   *
   * @example
   *   var result = limit(-5, -10, -50);
   *   debug(result);
   *   // @results -10
   *
   * @example
   *   var result = limit(-80, -10, -50);
   *   debug(result);
   *   // @results -50
   *
   * @example
   *   var result = limit('F', 'A', 'C');
   *   debug(result);
   *   // @results 'C'
   *
   * @example
   *   var result = limit('b', 'a', 'z');
   *   debug(result);
   *   // @results 'b'
   *
   * @example
   *   var result = limit(1, 2, 4, 5, 10, 20);
   *   debug(result);
   *   // @results 2
   *
   * @example
   *   var result = limit(100, 2, 4, 5, 10, 20);
   *   debug(result);
   *   // @results 20
   *
   *
   * @param  {Number|String|*}  x    A target value.
   * @param  {Number|String|*}  min  The minimum value, or maximum value.
   * @param  {Number|String|*}  max  The maximum value, or minimum value.
   * @return {Number|String|*}       The value in the range of
   *                                   `max` from `min`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  limit : function(x, min, max) {
    var result, tmp, args = arguments, values;
    switch (args.length) {
      case 0:
          result = (void 0);
          break;
      case 1:
          result = x;
          break;
      case 2:
          if (x < min) {
            result = min;
          } else {
            result = x;
          }
          break;
      case 3:
          if (min > max) {
            tmp = min;
            min = max;
            max = tmp;
          }
          if (x < min) {
            result = min;
          } else if (x > max) {
            result = max;
          } else {
            result = x;
          }
          break;
      default:
          values = arrayize(args, 1);
          min = Math.min.apply(null, values);
          max = Math.max.apply(null, values);
          result = args.callee(x, min, max);
          break;
    }
    return result;
  },
  /**
   * Convert to the base 2 to 62 string from the base x string.
   * That can work for big scale integers.
   * The maximum base number is 62.
   * The base number '0' will be not converted.
   *
   *
   * @example
   *   var value = 'FFFFFFFF';
   *   var result = convertToBase(value, 16, 10);
   *   debug(result);
   *   // @results  result = '4294967295'
   *
   *
   * @example
   *   var value = '9223372036854775807';
   *   var result = convertToBase(value, 10, 16);
   *   debug(result);
   *   // @results  result = '7FFFFFFFFFFFFFFF'
   *
   *
   * @example
   *   var value = '11010100010011011010011101111' +
   *               '10110011001101101100111001101';
   *   var result = convertToBase(value, 2, 62);
   *   debug(result);
   *   // @results  result = 'HelloWorld'
   *
   *
   * @param  {Number|String}  value   the numeric or alphameric value.
   * @param  {Number}         from    the base number is in.
   * @param  {Number}         to      the base to convert number to.
   * @return {String}                 the numbers of result which was
   *                                    converted to base to base.
   * @type  Function
   * @function
   * @static
   * @public
   */
  convertToBase : function(value, from, to) {
    var
    BASE62MAP = DIGITS + UPPER_ALPHAS + LOWER_ALPHAS,
    result = '', numbers, end, i, pos, div, index,
    v = stringify(value, true),
    len = v.length,
    base = {
      from : from - 0,
      to   : to   - 0
    };
    if (!isNaN(base.from) && base.from > 0 && base.from < 63 &&
        !isNaN(base.to)   && base.to   > 0 && base.to   < 63) {
      numbers = [];
      for (i = 0; i < len; i++) {
        pos = BASE62MAP.indexOf(v.charAt(i));
        if (!~pos) {
          end = true;
          break;
        }
        numbers[i] = pos;
      }
      if (end) {
        return false;
      }
      do {
        div = index = i = 0;
        do {
          div = div * base.from + numbers[i];
          if (div >= base.to) {
            numbers[index++] = Math.floor(div / base.to);
            div = div % base.to;
          } else if (index > 0) {
            numbers[index++] = 0;
          }
        } while (++i < len);
        len = index;
        result = BASE62MAP.charAt(div) + result;
      } while (index !== 0);
    }
    return result;
  },
  /**
   * Compare two version strings.
   * Version strings are dot-separated sequences of
   *  version-parts.
   * Numbers are base-10, and are zero if left out.
   * Strings are compared basic
   *  textual versions (e.g., "beta" and "alpha" etc.).
   *
   *
   * @example
   *   function compareVersionsRepr(a, b) {
   *     var x = compareVersions(a, b);
   *     if (x == 0) {
   *       return a + ' == ' + b;
   *     } else if (x > 0) {
   *       return a + ' > '  + b;
   *     } else {
   *       return a + ' < '  + b;
   *     }
   *   }
   *   debug(compareVersionsRepr('1.0pre', '1.0'));
   *   // @results '1.0pre < 1.0'
   *
   *
   * @example
   *   debug(compareVersions('8.2.5rc', '8.2.5a'));
   *   // @results 1
   *   debug(compareVersions('8.2.50', '8.2.52'));
   *   // @results -1
   *   debug(compareVersions('5.3.0-dev', '5.3.0'));
   *   // @results -1
   *   debug(compareVersions('4.1.0.52', '4.01.0.51'));
   *   // @results 1
   *   debug(compareVersions('1.01a', '1.01'));
   *   // @results -1
   *   debug(compareVersions('1.0.0', '1.0.00'));
   *   // @results 0
   *   debug(compareVersions('2.1.0', '2.0.0', '<'));
   *   // @results false
   *   debug(compareVersions('2.1.0', '2.0.0', '>'));
   *   // @results true
   *   debug(compareVersions('2.1.0a', '2.1.0a', '=='));
   *   // @results true
   *
   *
   * @param  {String|Number}  ver1   The first version.
   * @param  {String|Number}  ver2   The second version.
   * @param  {String}   (operator)   (Optional) Comparison operator.
   * @return {Number}                If `ver1` and `ver2` are two version
   *                                   being compared, and the return value:
   *                                   - is smaller than 0, then A < B.
   *                                   - equals 0 then Version, then A == B.
   *                                   - is bigger than 0, then A > B.
   * @type  Function
   * @function
   * @static
   * @public
   */
  compareVersions : function(ver1, ver2, operator) {
    var result = 0, me = arguments.callee, v1, v2, max, i;
    if (!me.prep) {
      update(me, {
        versionMapMin : -7,
        versionMaps   : {
          canary      : -7,
          dev         : -6,
          d           : -6,
          prealpha    : -6,
          pre         : -6,
          pa          : -6,
          nightly     : -6,
          n           : -6,
          minefield   : -6,
          trunk       : -6,
          aurora      : -5,
          alpha       : -5,
          a           : -5,
          beta        : -4,
          b           : -4,
          publicbeta  : -3,
          pb          : -3,
          rc          : -3,
          r           : -3,
          '#'         : -2,
          rtm         : -1,
          rt          : -1,
          stable      : -1,
          s           : -1,
          release     : -1,
          ga          : -1,
          g           : -1,
          pl          : -1,
          p           : -1
        },
        replaceMaps : [{
          from : /[\s\u00A0\u3000]+/g,
          to   : ''
        }, {
          from : /(\d*)([x*]+)(?:[.]|$)/g,
          to   : function(a, d, x) {
            return d + (new Array(x.length + 1).join('9')) + '.';
          }
        }, {
          from : /[_+-]/g,
          to   : '.'
        }, {
          from : /([^.0-9]+)/g,
          to   : '.$1.'
        }, {
          from : /[.]{2,}/g,
          to   : '.'
        }],
        prep : function(ver) {
          var v = stringify(ver, true).toLowerCase();
          each(this.replaceMaps, function(re) {
            v = v.replace(re.from, re.to);
          });
          return  (v.length === 0)   ?
            [this.versionMapMin - 2] : v.split(/[.]+/);
        },
        numbering : function(ver) {
          if (!ver) {
            return 0;
          } else if (isNaN(ver)) {
            return this.versionMaps[ver] || this.versionMapMin - 1;
          } else {
            return parseInt(ver);
          }
        }
      });
    }
    v1 = me.prep(ver1);
    v2 = me.prep(ver2);
    max = Math.max(v1.length, v2.length);
    for (i = 0; i < max; i++) {
      if (v1[i] === v2[i]) {
        continue;
      }
      v1[i] = me.numbering(v1[i]);
      v2[i] = me.numbering(v2[i]);
      if (v1[i] < v2[i]) {
        result = -1;
        break;
      }
      if (v1[i] > v2[i]) {
        result = 1;
        break;
      }
    }
    if (operator) {
      switch (String(operator).toLowerCase()) {
        case '<':
        case 'lt':
            result = (result < 0);
            break;
        case '>':
        case 'gt':
            result = (result > 0);
            break;
        case '<=':
        case 'le':
            result = (result <= 0);
            break;
        case '>=':
        case 'ge':
            result = (result >= 0);
            break;
        case '<>':
        case '!==':
        case '!=':
        case 'ne':
            result = (result !== 0);
            break;
        case '===':
        case '==':
        case '=':
        case 'eq':
        default:
            result = (result === 0);
            break;
      }
    }
    return result;
  }
});

// Update Pot object.
Pot.update({
  numeric         : Pot.Complex.numeric,
  rand            : Pot.Complex.rand,
  limit           : Pot.Complex.limit,
  convertToBase   : Pot.Complex.convertToBase,
  compareVersions : Pot.Complex.compareVersions
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Sanitizer.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Sanitizer.
   *
   * This object escape the string or filename, and expressions,
   *  these will be sanitized safely.
   *
   * @name  Pot.Sanitizer
   * @type  Object
   * @class
   * @public
   * @static
   */
  Sanitizer : {}
});

update(Pot.Sanitizer, {
  /**
   * @lends Pot.Sanitizer
   */
  /**
   * Escape RegExp patterns.
   *
   *
   * @example
   *   var pattern = 'ﾑｷｭ*･ﾟ･*..:*･(≧∀≦)ﾟ･*:.｡.*ﾟ:!!';
   *   var regex = new RegExp('^(' + rescape(pattern) + ')$', 'g');
   *   debug(regex.toString());
   *   // @results /^(ﾑｷｭ\*･ﾟ･\*\.\.:\*･\(≧∀≦\)ﾟ･\*:\.｡\.\*ﾟ:!!)$/g
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  rescape : rescape,
  /**
   * Alias for rescape.
   *
   * @see Pot.Sanitizer.rescape
   *
   * @param  {String}  s  A target string.
   * @return {String}     The escaped string.
   * @type   Function
   * @function
   * @alias  Pot.Sanitizer.rescape
   * @static
   * @public
   */
  escapeRegExp : rescape,
  /**
   * Escape the HTML string.
   * HTML entities will be escaped.
   *
   *
   * @example
   *   var string = '(>_<)/"< Hello World!';
   *   var result = escapeHTML(string);
   *   debug(result);
   *   // @results '(&gt;_&lt;)/&quot;&lt; Hello World!'
   *   //
   *   // for JSDoc: (@results)
   *   // '(&amp;gt;_&amp;lt;)/&amp;quot;&amp;lt; Hello World!'
   *
   *
   * @param  {String}  text  The target string.
   * @return {String}        The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeHTML : function(text) {
    var me = arguments.callee, s;
    if (!me.ENTITIES) {
      update(me, {
        ENTITIES : [
          {by: /&/g, to: '&amp;' },
          {by: /</g, to: '&lt;'  },
          {by: />/g, to: '&gt;'  },
          {by: /"/g, to: '&quot;'},
          {by: /'/g, to: '&#039;'}
        ]
      });
    }
    s = stringify(text);
    if (s) {
      if (!Pot.isHTMLEscaped(s)) {
        each(me.ENTITIES, function(o) {
          s = s.replace(o.by, o.to);
        });
      }
    }
    return s;
  },
  /**
   * Unescape the HTML string.
   * HTML entities will be unescaped.
   *
   *
   * @example
   *   var string = '(&gt;_&lt;)/&quot;&lt; Hello World!';
   *   // for JSDoc: (string)
   *   // '(&amp;gt;_&amp;lt;)/&amp;quot;&amp;lt; Hello World!'
   *   //
   *   var result = unescapeHTML(string);
   *   debug(result);
   *   // @results '(>_<)/"< Hello World!'
   *
   *
   * @param  {String}  text  The target string.
   * @return {String}        The unescaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  unescapeHTML : function(text) {
    var me = arguments.callee, result = '';
    if (!me.RE) {
      update(me, {
        /**@ignore*/
        RE : /&(?:[a-z]\w{0,24}|#(?:x[0-9a-f]{1,8}|[0-9]{1,10}));/gi,
        /**@ignore*/
        ENTITIES : {
          // Some are unable to convert by DOM.
          // White spaces are not converted strict for other processing.
          '&nbsp;'   : '\u0020', // U+00A0
          '&ensp;'   : '\u0020', // U+2002
          '&emsp;'   : '\u0020', // U+2003
          '&thinsp;' : '\u0020', // U+2009
          '&hellip;' : '\u2026', '&bull;'   : '\u2022', '&copy;'   : '\u00a9',
          '&reg;'    : '\u00ae', '&deg;'    : '\u00b0', '&trade;'  : '\u2122',
          '&euro;'   : '\u20ac', '&permil;' : '\u2030', '&Delta;'  : '\u0394',
          '&nabla;'  : '\u2207', '&laquo;'  : '\u226a', '&raquo;'  : '\u226b',
          '&ldquo;'  : '\u201c', '&rdquo;'  : '\u201d', '&lsquo;'  : '\u2018',
          '&rsquo;'  : '\u2019', '&ndash;'  : '\u2013', '&mdash;'  : '\u2014',
          '&sum;'    : '\u2211', '&Sigma;'  : '\u03a3', '&plusmn;' : '\u00b1',
          '&para;'   : '\u00b6', '&equiv;'  : '\u2261', '&dagger;' : '\u2020',
          '&Dagger;' : '\u2021', '&forall;' : '\u2200', '&beta;'   : '\u03b2',
          '&Lambda;' : '\u039b', '&lambda;' : '\u03bb', '&omega;'  : '\u03c9',
          '&middot;' : '\u30fb', '&OElig;'  : '\u0152', '&quot;'   : '\u0022',
          '&apos;'   : '\u0027', '&lt;'     : '\u003c', '&gt;'     : '\u003e'
        },
        /**@ignore*/
        decode : function(s) {
          var c = '';
          try {
            if (!me.elem) {
              me.elem = Pot.currentDocument().createElement('div');
            }
            me.elem.innerHTML = String(s);
            c = me.elem.childNodes[0].nodeValue;
            me.elem.removeChild(me.elem.firstChild);
            if (!c || String(s).length > String(c).length) {
              throw c;
            }
          } catch (e) {
            c = String(s);
          }
          if (c && c.charAt(0) === '&' && c.slice(-1) === ';') {
            if (me.ENTITIES[c]) {
              c = me.ENTITIES[c];
            } else {
              c = c.slice(1, -1);
              if (c.charAt(0) === '#') {
                c = c.substring(1).toLowerCase();
                if (c.charAt(0) === 'x') {
                  c = '0' + c;
                } else {
                  c = c - 0;
                }
                c = String.fromCharCode(c);
              } else {
                c = '';
              }
            }
          }
          return c;
        }
      });
    }
    result = stringify(text);
    if (result) {
      if (Pot.isHTMLEscaped(s)) {
        result = result.replace(me.RE, me.decode).replace(/&amp;/g, '&');
      }
    }
    return result;
  },
  /**
   * Escape the XPath expression.
   *
   *
   * @example
   *   var text = '"] | /foo/bar/baz | .["';
   *   var expr = '//*[@class=' + escapeXPathText(text) + ']';
   *   // e.g. var element = $x(expr, document, true);
   *   debug(expr);
   *   // @results //*[@class=concat('"',"] | /foo/bar/baz | .[",'"')]
   *
   *
   * @example
   *   var text = 'hoge-class';
   *   var expr = '//*[@class=' + escapeXPathText(text) + ']';
   *   debug(expr);
   *   // @results //*[@class="hoge-class"]
   *
   *
   * @param  {String}  text  A string to be escaped.
   * @return {String}        The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeXPathText : function(text) {
    var result, re, matches, concats, esc, sq, wq;
    re = /[^"]+|"/g;
    wq = '"';
    sq = "'";
    /**@ignore*/
    esc = function(s) {
      return (s === wq) ? sq + s + sq : wq + s + wq;
    };
    matches = stringify(text).match(re);
    if (matches) {
      if (matches.length === 1) {
        result = esc(matches[0]);
      } else {
        concats = [];
        each(matches, function(match) {
          concats[concats.length] = esc(match);
        });
        result = 'concat(' + concats.join(',') + ')';
      }
    } else {
      result = wq + wq;
    }
    return result;
  },
  /**
   * Escape a string to use with AppleScript.
   *
   *
   * @example
   *   var file = escapeAppleScriptString('ヾ("ゝω・")ﾉ"');
   *   var command = [
   *     'tell application "Finder"',
   *     '  get exists of file "' + file + '" of desktop',
   *     'end tell'
   *   ].join('\n');
   *   debug(command);
   *   // @results
   *   //   tell application "Finder"
   *   //     get exists of file "ヾ(\"ゝω・\")ﾉ\"" of desktop
   *   //   end tell
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeAppleScriptString : function(s) {
    return stringify(s).replace(/(["\\])/g, '\\$1');
  },
  /**
   * Escape a string for basic code.
   *
   *
   * @example
   *   var result = 'id="' + escapeString('foo"bar"') + '"';
   *   debug(result);
   *   // @results id="foo\"bar\""
   *
   *
   * @param  {String}   s    A target string.
   * @return {String}        The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeString : function(s) {
    return stringify(s).replace(/(["'\\])/g, '\\$1');
  },
  /**
   * Unescape a string for basic code.
   *
   *
   * @example
   *   var result = unescapeString('foo=\\"bar\\"');
   *   debug(result);
   *   // @results foo="bar"
   *
   *
   * @param  {String}   s    A target string.
   * @return {String}        The unescaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  unescapeString : function(s) {
    return stringify(s).replace(/\\(["'\\])/g, '$1');
  },
  /**
   * Escape the filename.
   * Escapes to be a safe filename for each OS.
   *
   * {@link http://mxr.mozilla.org/mozilla/source/toolkit/
   *        content/contentAreaUtils.js#818 }
   *
   *
   * @example
   *   var fileName = 'ﾟ･*:.｡..｡.:*･ﾟ(file)ﾟ･*:.｡. .｡.:*･ﾟ･*';
   *   var escaped = escapeFileName(fileName);
   *   debug(escaped);
   *   // @results 'ﾟ･ .｡..｡. ･ﾟ(file)ﾟ･ .｡. .｡. ･ﾟ･ ' (on Windows)
   *
   *
   * @param  {String}  fileName   A target filename.
   * @return {String}             A validated filename.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeFileName : function(fileName) {
    var s, re;
    s = stringify(fileName);
    if (s) {
      re = [{from: /[\u0000-\u0008]+/g, to: ''}];
      if (Pot.OS.win) {
        re.push(
          {from: /[\/|\\]+/g, to: '_'},
          {from: /["]+/g,     to: "'"},
          {from: /[*:;?]+/g,  to: ' '},
          {from: /[<]+/g,     to: '('},
          {from: /[>]+/g,     to: ')'}
        );
      } else if (Pot.OS.mac) {
        re.push({from: /[\/:]+/g, to: '_'});
      }
      re.push(
        {from: /[*\/\\]+/g,      to: '_' },
        {from: /([_()])\1{2,}/g, to: '$1'}
      );
      each(re, function(r) {
        s = s.replace(r.from, r.to);
      });
    }
    return s;
  },
  /**
   * Convert a string that can be evaluated as JavaScript escape sequences.
   * This function converts more characters than JSON. (i.e. enabled as JSON)
   *
   *
   * @example
   *   var string = 'ほげabc ("ｗ")';
   *   var result = escapeSequence(string);
   *   debug(result);
   *   // @results  '\u307b\u3052abc\u0020(\"\uff57\")'
   *
   *
   * @param  {String}   text   A target string.
   * @return {String}          The escaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  escapeSequence : function(text) {
    var s, me = arguments.callee;
    if (!me.re) {
      me.re = /[^\w!#$()*+,.:;=?@[\]^`|~-]/gi;
      /**@ignore*/
      me.meta = {
        // IE is not supported <VT> (\v).
        '\u0008': '\\b',  // <BS>
        '\u0009': '\\t',  // <HT> <TAB>
        '\u000A': '\\n',  // <LF>
        '\u000C': '\\f',  // <FF>
        '\u000D': '\\r',  // <CR>
        '\u0027': '\\\'',
        '\u0022': '\\"',
        '\u005C': '\\\\',
        '\u002F': '\\/'
      };
      /**@ignore*/
      me.rep = function(a) {
        var c = me.meta[a];
        return (typeof c === 'string') ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      };
    }
    me.re.lastIndex = 0;
    s = stringify(text);
    return (s && me.re.test(s)) ? s.replace(me.re, me.rep) : s;
  },
  /**
   * Revert the converted string as JavaScript escape sequences.
   *
   *
   * @example
   *   var string = '\\u307b\\u3052abc\\u0020(\\"\\uff57\\")';
   *   var result = unescapeSequence(string);
   *   debug(result);
   *   // @results  'ほげabc ("ｗ")'
   *
   *
   * @param  {String}   text   A target string.
   * @return {String}          The unescaped string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  unescapeSequence : function(text) {
    var s, me = arguments.callee;
    if (!me.re) {
      /**@ignore*/
      me.re = {
        seq   : /\\([btnvfr'"\/\\]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|.|[\s\S])/g,
        quote : /^\s*(?:"(?:\\.|[^"\r\n\\])*"|'(?:\\.|[^'\r\n\\])*')\s*$/,
        bs    : /[\u005C]{2}/g
      };
      /**@ignore*/
      me.meta = {
        'b' : '\u0008',
        't' : '\u0009',
        'n' : '\u000A',
        'v' : '\u000B',
        'f' : '\u000C',
        'r' : '\u000D',
        '\'': '\u0027',
        '"' : '\u0022',
        '\\': '\u005C',
        '/' : '\u002F'
      };
      me.chr = String.fromCharCode;
      /**@ignore*/
      me.rep = function(m, a) {
        var r, c = me.meta[a];
        if (typeof c === 'string') {
          r = c;
        } else if (a.length === 3 && a.charAt(0) === 'x') {
          r = me.chr('0' + a);
        } else if (a.length === 5 && a.charAt(0) === 'u') {
          r = me.chr('0x' + a.substring(1));
        } else {
          r = a;
        }
        return r;
      };
    }
    me.re.seq.lastIndex = 0;
    s = stringify(text);
    // for JSON string.
    if (me.re.quote.test(s) && me.re.bs.test(s)) {
      s = s.replace(me.re.bs, '\u005C');
    }
    return (s && me.re.seq.test(s)) ? s.replace(me.re.seq, me.rep) : s;
  }
});

// Update Pot object.
Pot.update({
  rescape                 : Pot.Sanitizer.rescape,
  escapeRegExp            : Pot.Sanitizer.escapeRegExp,
  escapeHTML              : Pot.Sanitizer.escapeHTML,
  unescapeHTML            : Pot.Sanitizer.unescapeHTML,
  escapeXPathText         : Pot.Sanitizer.escapeXPathText,
  escapeAppleScriptString : Pot.Sanitizer.escapeAppleScriptString,
  escapeString            : Pot.Sanitizer.escapeString,
  unescapeString          : Pot.Sanitizer.unescapeString,
  escapeFileName          : Pot.Sanitizer.escapeFileName,
  escapeSequence          : Pot.Sanitizer.escapeSequence,
  unescapeSequence        : Pot.Sanitizer.unescapeSequence
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of UTF8.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * UTF-8 and UTF-16  utilities.
   *
   * Mutual conversion between UTF-8 and UTF-16.
   *
   * RFC 2044, RFC 2279: UTF-8, a transformation format of ISO 10646
   * @link http://www.ietf.org/rfc/rfc2279.txt
   *
   * Note that using "encodeURIComponent" or "decodeURIComponent" to
   *   convert a string that includes surrogate pair or characters
   *   U+FFFE or U+FFFF then will raise URIError.
   * U+FFFF and U+FFFE will convert unexpect result on SpiderMonkey.
   *
   * This methods implements convertion functions for
   *   UTF-8 and UTF-16 compatible with calling of
   *   "unescape(encodeURIComponent(string))" and
   *   "decodeURIComponent(escape(string))".
   *
   * <pre>
   * Example:
   *   decodeURIComponent(encodeURIComponent('\uFFFF')) === '\uFFFF';
   * Results:
   *   false (SpiderMonkey)
   *
   * Example:
   *   decodeURIComponent(encodeURIComponent('\uD811')) === '\uD811';
   * Results:
   *   URIError
   * </pre>
   *
   * @name Pot.UTF8
   * @type Object
   * @class
   * @static
   * @public
   * @based libxml/xml.c#xml_utf8_encode/xml_utf8_decode
   */
  UTF8 : {}
});

update(Pot.UTF8, {
  /**
   * @lends Pot.UTF8
   */
  /**
   * Convert to UTF-8 string from UTF-16 string.
   *
   * @param  {String}  string  UTF-16 string.
   * @return {String}          UTF-8 string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  encode : function(string) {
    var result = '', chars = [], len, i, c, s, sc;
    s = stringify(string);
    if (s) {
      sc = String.fromCharCode;
      len = s.length;
      for (i = 0; i < len; i++) {
        c = s.charCodeAt(i);
        if (c < 0x80) {
          chars[chars.length] = sc(c);
        } else if (c > 0x7FF) {
          chars[chars.length] = sc(0xE0 | ((c >> 12) & 0x0F)) +
                                sc(0x80 | ((c >>  6) & 0x3F)) +
                                sc(0x80 | ((c >>  0) & 0x3F));
        } else {
          chars[chars.length] = sc(0xC0 | ((c >>  6) & 0x1F)) +
                                sc(0x80 | ((c >>  0) & 0x3F));
        }
      }
      result = chars.join('');
    }
    return result;
  },
  /**
   * Convert to UTF-16 string from UTF-8 string.
   *
   * @param  {String}  string  UTF-8 string.
   * @return {String}          UTF-16 string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  decode : function(string) {
    var result = '', chars = [], i, len, s, n, c, c2, c3, sc;
    s = stringify(string);
    if (s) {
      sc = String.fromCharCode;
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        n = (c >> 4);
        if (0 <= n && n <= 7) {
          // 0xxxxxxx
          chars[chars.length] = sc(c);
        } else if (12 <= n && n <= 13) {
          // 110x xxxx  10xx xxxx
          c2 = s.charCodeAt(i++);
          chars[chars.length] = sc(((c & 0x1F) << 6) | (c2 & 0x3F));
        } else if (n === 14) {
          // 1110 xxxx  10xx xxxx  10xx xxxx
          c2 = s.charCodeAt(i++);
          c3 = s.charCodeAt(i++);
          chars[chars.length] = sc(((c  & 0x0F) << 12) |
                                   ((c2 & 0x3F) <<  6) |
                                   ((c3 & 0x3F) <<  0));
        }
      }
      result = chars.join('');
    }
    return result;
  },
  /**
   * Gets the byte size of string as UTF-8.
   *
   *
   * @example
   *   var string = 'abc123あいうえお';
   *   var length = string.length;
   *   var byteSize = Pot.UTF8.byteOf(string);
   *   debug(string + ' : length = ' + length + ', byteSize = ' + byteSize);
   *   // @results
   *   //   length   = 11
   *   //   byteSize = 21
   *
   *
   * @param  {String}   string   The target string.
   * @return {Number}            The UTF-8 byte size of string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  byteOf : function(string) {
    var size = 0, s, i, c;
    s = stringify(string, true);
    if (s) {
      i = s.length;
      while (--i >= 0) {
        c = s.charCodeAt(i);
        if (c < 0x80) {
          size++;
        } else if (c < 0x800 ||
                  // We ignore UTF-8 Surrogate Pair, for the binary data.
                  (c > 0xD7FF && c < 0xE000)
        ) {
          size += 2;
        } else {
          size += 3;
        }
      }
    }
    return size;
  }
});

// Update Pot object.
Pot.update({
  utf8Encode : Pot.UTF8.encode,
  utf8Decode : Pot.UTF8.decode,
  utf8ByteOf : Pot.UTF8.byteOf
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Base64.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Base64 encode/decode.
   *
   * RFC 3548 - Base64 Data Encodings
   * @link http://tools.ietf.org/html/rfc3548
   *
   * @name Pot.Base64
   * @type Object
   * @class
   * @static
   * @public
   */
  Base64 : (function() {
    // Base64 from: http://feel.happy.nu/test/base64.html
    var BASE64MAPS = UPPER_ALPHAS + LOWER_ALPHAS + DIGITS + '+/=';
    /**@ignore*/
    function encodeBase64(text) {
      var r = '', t = [], s, p = -6, a = 0, i = 0, v = 0, c, n;
      s = Pot.UTF8.encode(stringify(text, true));
      if (s) {
        n = s.length;
        while (i < n || p > -6) {
          if (p < 0) {
            if (i < n) {
              c = s.charCodeAt(i++);
              v += 8;
            } else {
              c = 0;
            }
            a = ((a & 255) << 8) | (c & 255);
            p += 8;
          }
          t[t.length] = BASE64MAPS.charAt((v > 0) ? (a >> p & 63) : 64);
          p -= 6;
          v -= 6;
        }
        r = t.join('');
      }
      return r;
    }
    /**@ignore*/
    function decodeBase64(text) {
      var r = '', t = [], s, p = -8, a = 0, c, d, n, i, sc;
      s = stringify(text, true);
      if (s) {
        n = s.length;
        sc = String.fromCharCode;
        for (i = 0; i < n; i++) {
          c = BASE64MAPS.indexOf(s.charAt(i));
          if (~c) {
            a = (a << 6) | (c & 63);
            p += 6;
            if (p >= 0) {
              d = (a >> p & 255);
              if (c !== 64) {
                t[t.length] = sc(d);
              }
              a &= 63;
              p -= 8;
            }
          }
        }
        r = t.join('');
      }
      return Pot.UTF8.decode(r);
    }
    return {
      /**
       * @lends Pot.Base64
       */
      /**
       * Encodes a string to base64.
       *
       *
       * @example
       *   var string = 'Hello World.';
       *   var result = Pot.Base64.encode(string);
       *   debug(result);
       *   // @results 'SGVsbG8gV29ybGQu'
       *
       *
       * @param  {String}  text   A target string.
       * @return {String}         A base64 string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      encode : function(text) {
        var result = '', s = stringify(text, true);
        if (s) {
          try {
            if (typeof btoa === 'undefined') {
              throw false;
            }
            result = btoa(Pot.UTF8.encode(s));
          } catch (e) {
            try {
              result = encodeBase64(s);
            } catch (e) {}
          }
        }
        return result;
      },
      /**
       * Decodes a string from base64.
       *
       *
       * @example
       *   var b64string = 'SGVsbG8gV29ybGQu';
       *   var result = Pot.Base64.decode(b64string);
       *   debug(result);
       *   // @results 'Hello World.'
       *
       *
       * @param  {String}  text   A base64 string.
       * @return {String}         A result string.
       * @type  Function
       * @function
       * @static
       * @public
       */
      decode : function(text) {
        var result = '', s = stringify(text, true);
        if (s) {
          try {
            if (typeof atob === 'undefined') {
              throw false;
            }
            result = Pot.UTF8.decode(atob(s));
          } catch (e) {
            try {
              result = decodeBase64(s);
            } catch (e) {}
          }
        }
        return result;
      }
    };
  })()
});

// Update Pot object.
Pot.update({
  base64Encode : Pot.Base64.encode,
  base64Decode : Pot.Base64.decode
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Archive.
(function(ALPHAMERIC_BASE63TBL) {

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Archive utilities.
   *
   * @name Pot.Archive
   * @type Object
   * @class
   * @static
   * @public
   */
  Archive : {}
});

update(Pot.Archive, {
  /**
   * @lends Pot.Archive
   */
  /**
   * Compress/Decompress the data using the LZ77 algorithm.
   *
   * cf. @link http://www.ietf.org/rfc/rfc1951.txt
   *
   * via AlphamericHTML
   *
   * @link http://nurucom-archives.hp.infoseek.co.jp/digital/
   *
   * @name  Pot.Archive.AlphamericString
   * @type  Object
   * @class
   * @static
   * @public
   */
  AlphamericString : {
    /**
     * @lends Pot.Archive.AlphamericString
     */
    /**
     * Compress with encode a string to
     *   the base 63 [a-zA-Z0-9_] format string.
     *
     *
     * @example
     *   var string = 'Hello Hello foooooooo baaaaaaaar';
     *   var result = Pot.Archive.AlphamericString.encode(string);
     *   var decode = Pot.Archive.AlphamericString.decode(result);
     *   debug('string = ' + string + ' : length = ' + string.length);
     *   debug('result = ' + result + ' : length = ' + result.length);
     *   debug('decode = ' + decode + ' : length = ' + decode.length);
     *   // @results
     *   //   string = 'Hello Hello foooooooo baaaaaaaar' : length = 32
     *   //   result = 'Y8Z5CCF_v56F__5X0Z21__5I'         : length = 24
     *   //   decode = 'Hello Hello foooooooo baaaaaaaar' : length = 32
     *
     *
     * @example
     *   // Example of compression that is include multibyte string.
     *   var string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー';
     *   var result = Pot.Archive.AlphamericString.encode(string);
     *   var decode = Pot.Archive.AlphamericString.decode(result);
     *   // Note the change of byte size.
     *   var bytesS = utf8ByteOf(string);
     *   var bytesR = utf8ByteOf(result);
     *   var bytesD = utf8ByteOf(decode);
     *   debug('string=' + string + ', length=' + string.length +
     *         ', ' + bytesS + ' bytes');
     *   debug('result=' + result + ', length=' + result.length +
     *         ', ' + bytesR + ' bytes');
     *   debug('decode=' + decode + ', length=' + decode.length +
     *         ', ' + bytesD + ' bytes');
     *   // @results
     *   //   string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー',
     *   //     length = 30,
     *   //     66 bytes
     *   //
     *   //   result = 'Y8Z5CCF_v5cJeJdB1Fa1_v4dBe3hS_y1',
     *   //     length = 32,
     *   //     32 bytes
     *   //
     *   //   decode = 'Hello Hello こんにちは、こんにちは、にゃーにゃー',
     *   //     length = 30,
     *   //     66 bytes
     *   //
     *
     *
     * @param  {String}  s  An input string.
     * @return {String}     A result string.
     * @type  Function
     * @function
     * @static
     * @public
     */
    encode : function(s) {
      var r = [], c, i = 1014, j, K, k, L, l = -1, p, t = ' ', A, n, x, y;
      A = ALPHAMERIC_BASE63TBL.split('');
      for (; i < 1024; i++) {
        t += t;
      }
      t += stringify(s);
      while ((p = t.substr(i, 64))) {
        n = p.length;
        for (j = 2; j <= n; j++) {
          k = t.substring(i - 819, i + j - 1).lastIndexOf(p.substring(0, j));
          if (!~k) {
            break;
          }
          K = k;
        }
        if (j === 2 || j === 3 && L === l) {
          L = l;
          c = t.charCodeAt(i++);
          if (c < 128) {
            x = c;
            c %= 32;
            l = (x - c) / 32 + 64;
            if (L !== l) {
              r[r.length] = A[l - 32];
            }
            r[r.length] = A[c];
          } else if (12288 <= c && c < 12544) {
            c -= 12288;
            x = c;
            c %= 32;
            l = (x - c) / 32 + 68;
            if (L !== l) {
              r[r.length] = A[l - 32];
            }
            r[r.length] = A[c];
          } else if (65280 <= c && c < 65440) {
            c -= 65280;
            x = c;
            c %= 32;
            l = (x - c) / 32 + 76
            if (L !== l) {
              r[r.length] = A[l - 32];
            }
            r[r.length] = A[c];
          } else {
            x = c;
            c %= 1984;
            l = (x - c) / 1984;
            if (L !== l) {
              r[r.length] = A[49] + A[l];
            }
            x = c;
            c %= 62;
            r[r.length] = A[(x - c) / 62] + A[c];
          }
        } else {
          x = K;
          K %= 63;
          r[r.length] = A[(x - K) / 63 + 50] + A[K] + A[j - 3];
          i += j - 1;
        }
      }
      return r.join('');
    },
    /**
     * Decompress with decode a string from
     *   the AlphamericString (base 63 [a-zA-Z0-9_] format string).
     *
     *
     * @example
     *   var string = 'Hello Hello foooooooo baaaaaaaar';
     *   var result = Pot.Archive.AlphamericString.encode(string);
     *   var decode = Pot.Archive.AlphamericString.decode(result);
     *   debug('string = ' + string + ' : length = ' + string.length);
     *   debug('result = ' + result + ' : length = ' + result.length);
     *   debug('decode = ' + decode + ' : length = ' + decode.length);
     *   // @results
     *   //   string = 'Hello Hello foooooooo baaaaaaaar' : length = 32
     *   //   result = 'Y8Z5CCF_v56F__5X0Z21__5I'         : length = 24
     *   //   decode = 'Hello Hello foooooooo baaaaaaaar' : length = 32
     *
     *
     * @example
     *   // Example of compression that is include multibyte string.
     *   var string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー';
     *   var result = Pot.Archive.AlphamericString.encode(string);
     *   var decode = Pot.Archive.AlphamericString.decode(result);
     *   // Note the change of byte size.
     *   var bytesS = utf8ByteOf(string);
     *   var bytesR = utf8ByteOf(result);
     *   var bytesD = utf8ByteOf(decode);
     *   debug('string=' + string + ', length=' + string.length +
     *         ', ' + bytesS + ' bytes');
     *   debug('result=' + result + ', length=' + result.length +
     *         ', ' + bytesR + ' bytes');
     *   debug('decode=' + decode + ', length=' + decode.length +
     *         ', ' + bytesD + ' bytes');
     *   // @results
     *   //   string = 'Hello Hello こんにちは、こんにちは、にゃーにゃー',
     *   //     length = 30,
     *   //     66 bytes
     *   //
     *   //   result = 'Y8Z5CCF_v5cJeJdB1Fa1_v4dBe3hS_y1',
     *   //     length = 32,
     *   //     32 bytes
     *   //
     *   //   decode = 'Hello Hello こんにちは、こんにちは、にゃーにゃー',
     *   //     length = 30,
     *   //     66 bytes
     *   //
     *
     *
     * @param  {String}  a  A input string.
     * @return {String}     A result string.
     * @type  Function
     * @function
     * @static
     * @public
     */
    decode : function(a) {
      var C = {}, c, i = 0, j, k, l, m, p, s, w, t, sc;
      sc = String.fromCharCode;
      s = '    ';
      t = stringify(a);
      for (; i < 63; i++) {
        C[ALPHAMERIC_BASE63TBL.charAt(i)] = i;
      }
      while ((i -= 7)) {
        s += s;
      }
      while (true) {
        c = C[t.charAt(i++)];
        if (c < 63) {
          if (c < 32) {
            s += sc(
              m ? l * 32 + c :
                 (l * 32 + c) * 62 + C[t.charAt(i++)]
            );
          } else if (c < 49) {
            l = (c < 36) ? c - 32  :
                (c < 44) ? c + 348 : c + 1996;
            m = true;
          } else if (c < 50) {
            l = C[t.charAt(i++)];
            m = false;
          } else {
            w = s.slice(-819);
            k = (c - 50) * 63 + C[t.charAt(i++)];
            j = k + C[t.charAt(i++)] + 2;
            p = w.substring(k, j);
            if (p) {
              while (w.length < j) {
                w += p;
              }
            }
            s += w.substring(k, j);
          }
        } else {
          break;
        }
      }
      return s.slice(1024);
    }
  }
});

// Update Pot object.
Pot.update({
  alphamericStringEncode : Pot.Archive.AlphamericString.encode,
  alphamericStringDecode : Pot.Archive.AlphamericString.decode
});

})(DIGITS + UPPER_ALPHAS + LOWER_ALPHAS + '_');

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Format.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Format utilities.
   *
   * @name Pot.Format
   * @type Object
   * @class
   * @static
   * @public
   */
  Format : {}
});

update(Pot.Format, {
  /**
   * @lends Pot.Format
   */
  /**
   * sprintf.
   *
   * This function is compatible with PHP sprintf function that
   *  was referenced from the PHP source code.
   *
   * @link http://php.net/function.sprintf
   *
   * <pre>
   * Extended type specifiers:
   *
   *   - a : Return the string in lowercase the result encoded in base 36.
   *   - A : Return the string in uppercase the result encoded in base 36.
   *
   * </pre>
   *
   *
   * @example
   *   var num = 5;
   *   var place = 'tree';
   *   var result = sprintf('There are %d monkeys in the %s.', num, place);
   *   debug(result);
   *   // @results 'There are 5 monkeys in the tree.'
   *
   *
   * @example
   *   var n =  43951789;
   *   var u = -43951789;
   *   var c = 65; // ASCII 65 is 'A'
   *   // notice the double %%, this prints a literal '%' character
   *   debug(sprintf("%%b = '%b'", n)); // binary
   *   debug(sprintf("%%c = '%c'", c)); // print the ascii character
   *   debug(sprintf("%%d = '%d'", n)); // standard integer
   *   debug(sprintf("%%e = '%e'", n)); // scientific notation
   *   debug(sprintf("%%u = '%u'", n)); // unsigned integer (positive)
   *   debug(sprintf("%%u = '%u'", u)); // unsigned integer (negative)
   *   debug(sprintf("%%f = '%f'", n)); // floating point
   *   debug(sprintf("%%o = '%o'", n)); // octal
   *   debug(sprintf("%%s = '%s'", n)); // string
   *   debug(sprintf("%%x = '%x'", n)); // hexadecimal (lower-case)
   *   debug(sprintf("%%X = '%X'", n)); // hexadecimal (upper-case)
   *   debug(sprintf("%%+d = '%+d'", n)); // sign specifier (positive)
   *   debug(sprintf("%%+d = '%+d'", u)); // sign specifier (negative)
   *   debug(sprintf("%%a = '%a'", n)); // base 36 format (lower-case)
   *   debug(sprintf("%%A = '%A'", n)); // base 36 format (upper-case)
   *   // @results
   *   //   %b = '10100111101010011010101101'
   *   //   %c = 'A'
   *   //   %d = '43951789'
   *   //   %e = '4.395179e+7'
   *   //   %u = '43951789'
   *   //   %u = '4251015507'
   *   //   %f = '43951789.000000'
   *   //   %o = '247523255'
   *   //   %s = '43951789'
   *   //   %x = '29ea6ad'
   *   //   %X = '29EA6AD'
   *   //   %+d = '+43951789'
   *   //   %+d = '-43951789'
   *   //   %a = 'q61f1'
   *   //   %A = 'Q61F1'
   *
   *
   * @example
   *   var date  = new Date();
   *   var year  = date.getFullYear();
   *   var month = date.getMonth() + 1;
   *   var day   = date.getDate();
   *   var isoDate = sprintf('%04d-%02d-%02d', year, month, day);
   *   debug(isoDate);
   *   // @results '2011-09-01'
   *
   *
   * @example
   *   var s = 'monkey';
   *   var t = 'many monkeys';
   *   debug(sprintf("[%s]",      s)); // standard string output
   *   debug(sprintf("[%10s]",    s)); // right-justification with spaces
   *   debug(sprintf("[%-10s]",   s)); // left-justification with spaces
   *   debug(sprintf("[%010s]",   s)); // zero-padding works on strings too
   *   debug(sprintf("[%'#10s]",  s)); // use the custom padding character '#'
   *   debug(sprintf("[%10.10s]", t)); // left-justification but with a
   *                                   //   cutoff of 10 characters
   *   // @results
   *   //   [monkey]
   *   //   [    monkey]
   *   //   [monkey    ]
   *   //   [0000monkey]
   *   //   [####monkey]
   *   //   [many monke]
   *
   *
   * @param  {String}  format   The format string is composed of zero or
   *                              more directives: ordinary characters
   *                              (excluding %) that are copied directly
   *                              to the result, and conversion
   *                              specifications, each of which results
   *                              in fetching its own parameter.
   * @param  {...*}    (...)    The variable arguments that will be
   *                              conversion specifier value.
   * @return {String}           The result string.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  sprintf : function(/*format[, ...args]*/) {
    var me = arguments.callee;
    if (!me.formatProcedure) {
      /**@ignore*/
      me.formatProcedure = (function() {
        var re, args;
        re = /%%|%('?(?:[0\u0020+-]|[^%\w.-])+|)(\d*|)(\.\d*|)([%a-z])/gi;
        /**@ignore*/
        function utf8(s) {
          return Pot.UTF8 && Pot.UTF8.encode(s) || stringify(s);
        }
        /**@ignore*/
        function parse(n, isFloat) {
          var r = isFloat ? parseFloat(n) : parseInt(n);
          return isNaN(r) ? 0 : r;
        }
        /**@ignore*/
        function base(n, val) {
          var r, i, len, octets;
          if (Pot.isNumeric(val)) {
            r = (parse(val) >>> 0).toString(n);
          } else {
            r = '';
            octets = utf8(val);
            len = octets.length;
            for (i = 0; i < len; ++i) {
              r += octets.charCodeAt(i).toString(n);
            }
          }
          return String((r && r.length) ? r : 0);
        }
        /**@ignore*/
        function pad(value, mark, width, precision, left, numeric) {
          var glue;
          width = width - 0;
          precision = precision - 0;
          if (value.length < width) {
            mark = stringify(mark) || ' ';
            glue = new Array(width + 1).join(mark).split('');
            while (glue && (glue.length + value.length > width)) {
              if (left) {
                glue.pop();
              } else {
                glue.shift();
              }
            }
            glue = glue.join('');
            value = left ? glue + value : value + glue;
          }
          return value;
        }
        /**@ignore*/
        function justify(value, mark, width, precision, left, numeric) {
          var sign, orgn, index, i, prevIdx;
          if (numeric) {
            value = value.toString();
            if (mark.charAt(0) === '+') {
              if (value - 0 >= 0) {
                if (Pot.isFunction(numeric)) {
                  value = mark.charAt(0) + numeric(value);
                } else {
                  value = mark.charAt(0) + (value - 0);
                }
              }
              mark = mark.substring(1);
            }
            if (mark.charAt(0) === '-') {
              left = false;
              mark = '';
            }
            sign = value.charAt(0);
            if ('+-'.indexOf(sign) === -1) {
              sign = null;
            } else {
              orgn = value.substring(1);
            }
          }
          width = String(width).length ? (width - 0) : -1;
          precision = String(precision).length ? (precision - 0) : -1;
          if (width === 0) {
            value = '';
          } else {
            if (precision > 0) {
              value = value.slice(0, precision);
            }
            if (width > 0 && width > value.length) {
              value = pad(value, mark, width, precision, left, numeric);
            }
          }
          if (numeric && orgn && sign) {
            i = 1;
            do {
              prevIdx = index;
              index = value.indexOf(sign + orgn.slice(0, i));
            } while (index > 0 && ++i < value.length);
            if (index === -1) {
              index = prevIdx;
            }
            if (index > 0) {
              value = sign + value.slice(0, index) + value.slice(index + 1);
            }
          }
          return value;
        }
        /**@ignore*/
        function rep(all, mark, width, precision, type) {
          var result = '', v, left, numeric = false, point;
          if (all === '%%') {
            result = '%';
          } else {
            left = true;
            if (mark.slice(-1) === '-') {
              left = false;
              mark = mark.slice(0, -1);
            }
            if (mark.indexOf("'") === 0) {
              if (mark.length > 1) {
                mark = mark.substring(1);
              }
            }
            if (precision.indexOf('.') === 0) {
              precision = precision.substring(1);
            }
            v = stringify(args.shift());
            switch (type) {
              case 'b':
                  v = base(2, v);
                  break;
              case 'c':
                  try {
                    v = Pot.isNumeric(v) ? String.fromCharCode(v) : '';
                  } catch (e) {
                    v = '';
                  }
                  break;
              case 'd':
                  numeric = true;
                  v = parse(v);
                  break;
              case 'u':
                  numeric = true;
                  v = (parse(v) >>> 0);
                  break;
              case 'e':
                  numeric = true;
                  point = 6;
                  v = parse(v, true);
                  if (precision) {
                    if (Pot.isNumeric(precision)) {
                      point = Math.max(0, Math.min(20, precision));
                    }
                    precision = null;
                  }
                  /**@ignore*/
                  numeric = function(n) {
                    return Number(n).toExponential(point);
                  };
                  v = numeric(v);
                  break;
              case 'f':
                  numeric = true;
                  point = 6;
                  v = parse(v, true);
                  if (precision) {
                    if (Pot.isNumeric(precision)) {
                      precision = ((v < 0) ? 1 : 0) + (precision - 0);
                      point = Math.max(0, Math.min(20, precision));
                    }
                    precision = null;
                  }
                  /**@ignore*/
                  numeric = function(n) {
                    return (n - 0).toFixed(point);
                  };
                  v = numeric(v);
                  break;
              case 'o':
                  v = base(8, v);
                  break;
              case 'x':
                  v = base(16, v).toLowerCase();
                  break;
              case 'X':
                  v = base(16, v).toUpperCase();
                  break;
              case 's':
                  break;
              case 'a':
                  v = base(36, v).toLowerCase();
                  break;
              case 'A':
                  v = base(36, v).toUpperCase();
                  break;
              default:
                  break;
            }
            result = justify(v, mark, width, precision, left, numeric);
          }
          return ('' + result);
        }
        return function(format) {
          args = arrayize(arguments, 1);
          return stringify(format).replace(re, rep);
        };
      })();
    }
    return me.formatProcedure.apply(me, arguments);
  }
});

// Update Pot object.
Pot.update({
  sprintf : Pot.Format.sprintf
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of MimeType.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * MIME Types utilities.
   *
   * This object is not use "navigator.mimeTypes"
   *   for x-browser and non-browser environment.
   *
   * @name Pot.MimeType
   * @type Object
   * @class
   * @static
   * @public
   */
  MimeType : {}
});

update(Pot.MimeType, {
  /**
   * @lends Pot.MimeType
   */
  /**
   * Gets the extension name from the MIME Type.
   *
   *
   * @example
   *   debug( getExtByMimeType('application/javascript') );
   *   // @results 'js'
   *
   *
   * @param  {String}  mimeType   MIME Type.
   * @return {String}             Extension name.
   * @type  Function
   * @function
   * @static
   * @public
   */
  getExtByMimeType : function(mimeType) {
    var result = '', ext, lext, mime, mimes,
        mtype, ltype, part, i, len,
        maps = Pot.MimeType.MimeTypeMaps,
        type = trim(mimeType).toLowerCase();
    if (type) {
      for (ext in maps) {
        mime = String(maps[ext]).toLowerCase();
        if (mime === type) {
          result = ext;
          break;
        }
      }
      if (!result) {
        for (ext in maps) {
          mime = String(maps[ext]).toLowerCase().split('/').pop();
          if (~type.indexOf(mime)) {
            result = ext;
            break;
          }
        }
        if (!result) {
          try {
            // helper if not match.
            if (typeof navigator === 'object' && navigator.mimeTypes) {
              mimes = navigator.mimeTypes;
              if (type in mimes) {
                mime = mimes[type];
                if (mime && mime.suffixes) {
                  mtype = mime;
                }
              } else {
                part = type.split('/').pop();
                len = mimes.length;
                for (i = 0; i < len; i++) {
                  mime = mimes[i];
                  if (mime && mime.suffixes) {
                    ltype = String(mime.type).toLowerCase();
                    if (~ltype.indexOf(type) || ~type.indexOf(ltype) ||
                        ~part.indexOf(ltype.split('/').pop()) ||
                        ~ltype.split('/').pop().indexOf(part)) {
                      mtype = mime;
                      break;
                    }
                  }
                }
              }
              if (mtype) {
                result = String(mtype.suffixes).replace(/^\s*(\w+).*$/, '$1');
              }
            }
          } catch (e) {
            result = '';
          }
        }
      }
    }
    return stringify(result, true);
  },
  /**
   * Gets the MIME Type from the extension name.
   *
   *
   * @example
   *   debug( getMimeTypeByExt('js') );
   *   // @results 'application/javascript'
   *
   *
   * @param  {String}   extension   Extension name.
   * @return {String}               MIME Type.
   * @type  Function
   * @function
   * @static
   * @public
   */
  getMimeTypeByExt : function(extension) {
    var result = '', ext, mimes, mime, re, i, len,
        maps = Pot.MimeType.MimeTypeMaps;
    if (~String(extension).indexOf('.')) {
      if (Pot.URI) {
        ext = trim(Pot.URI.getExt(extension)).toLowerCase();
      } else {
        ext = trim(extension).toLowerCase().split('.').pop();
      }
    } else {
      ext = trim(extension).toLowerCase();
    }
    if (ext in maps) {
      result = maps[ext];
    }
    if (!result) {
      try {
        if (typeof navigator === 'object' && navigator.mimeTypes) {
          mimes = navigator.mimeTypes;
          re = new RegExp('(?:^|\\b)' + rescape(ext) + '(?:\\b|$)', 'i');
          len = mimes.length;
          for (i = 0; i < len; i++) {
            mime = mimes[i];
            if (mime && re.test(mime.suffixes)) {
              result = trim(mime.type);
              break;
            }
          }
        }
      } catch (e) {
        result = '';
      }
    }
    return stringify(result, true) || '*/*';
  },
  /**
   * A basic MIME Type object map.
   *
   * @type  Object
   * @const
   * @static
   * @public
   */
  MimeTypeMaps : {
    // text/basic
    ''   : 'application/octet-stream',
    bin  : 'application/octet-stream',
    txt  : 'text/plain',
    html : 'text/html',
    htm  : 'text/html',
    php  : 'text/html',
    css  : 'text/css',
    js   : 'application/javascript',
    json : 'application/json',
    xml  : 'application/xml',
    swf  : 'application/x-shockwave-flash',
    flv  : 'video/x-flv',
    rdf  : 'application/rdf+xml',
    xul  : 'application/vnd.mozilla.xul+xml',
    // images
    png  : 'image/png',
    jpg  : 'image/jpeg',
    jpe  : 'image/jpeg',
    jpeg : 'image/jpeg',
    gif  : 'image/gif',
    bmp  : 'image/bmp',
    ico  : 'image/vnd.microsoft.icon',
    tiff : 'image/tiff',
    tif  : 'image/tiff',
    svg  : 'image/svg+xml',
    svgz : 'image/svg+xml',
    // archives
    zip  : 'application/zip',
    rar  : 'application/x-rar-compressed',
    msi  : 'application/x-msdownload',
    exe  : 'application/x-msdownload',
    cab  : 'application/vnd.ms-cab-compressed',
    jar  : 'application/java-archive',
    lzh  : 'application/x-lzh-compressed',
    lha  : 'application/x-lzh-compressed',
    afa  : 'application/x-astrotite-afa',
    z    : 'application/x-compress',
    taz  : 'application/x-compress',
    bz2  : 'application/x-bzip',
    gz   : 'application/x-gzip',
    tgz  : 'application/x-gzip',
    tar  : 'application/x-tar',
    '7z' : 'application/x-7z-compressed',
    // audio/video
    au   : 'audio/basic',
    snd  : 'audio/basic',
    aif  : 'audio/x-aiff',
    aiff : 'audio/x-aiff',
    aifc : 'audio/x-aiff',
    m3u  : 'audio/x-mpegurl',
    ram  : 'audio/x-pn-realaudio',
    ra   : 'audio/x-pn-realaudio',
    rm   : 'application/vnd.rn-realmedia',
    wav  : 'audio/x-wav',
    midi : 'audio/midi',
    mid  : 'audio/midi',
    kar  : 'audio/midi',
    mp3  : 'audio/mpeg',
    mp2  : 'audio/mpeg',
    mpga : 'audio/mpeg',
    mp4  : 'video/mp4',
    mov  : 'video/quicktime',
    qt   : 'video/quicktime',
    mpeg : 'video/mpeg',
    mpg  : 'video/mpeg',
    mpe  : 'video/mpeg',
    mxu  : 'video/vnd.mpegurl',
    m4u  : 'video/vnd.mpegurl',
    avi  : 'video/x-msvideo',
    // adobe
    pdf  : 'application/pdf',
    psd  : 'image/vnd.adobe.photoshop',
    ps   : 'application/postscript',
    ai   : 'application/postscript',
    eps  : 'application/postscript',
    // ms office
    doc  : 'application/msword',
    rtf  : 'application/rtf',
    xls  : 'application/vnd.ms-excel',
    ppt  : 'application/vnd.ms-powerpoint',
    // open office
    odt  : 'application/vnd.oasis.opendocument.text',
    ods  : 'application/vnd.oasis.opendocument.spreadsheet'
  }
});

// Update Pot object.
Pot.update({
  getExtByMimeType : Pot.MimeType.getExtByMimeType,
  getMimeTypeByExt : Pot.MimeType.getMimeTypeByExt
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Text.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Text.
   * String utilities.
   *
   * Evaluate a string can be a scalar value only.
   * Return "1" when argument was passed as Boolean's `true`.
   * This function can treat XML object that
   *  will be string by toString method.
   *
   * @see Pot.Text.stringify
   *
   * @param  {*}        x              Any value.
   * @param  {Boolean} (ignoreBoolean) Optional, Ignores Boolean value.
   * @return {String}                  Value as a string.
   *
   * @name Pot.Text
   * @type Function
   * @function
   * @class
   * @static
   * @public
   */
  Text : function() {
    return stringify.apply(null, arguments);
  }
});

update(Pot.Text, {
  /**
   * @lends Pot.Text
   */
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
   * Shortcut of String.fromCharCode().
   * This function fixed an error on 'stack overflow' (or RangeError).
   * e.g. String.fromCharCode.apply(null, new Array(100000000));
   *
   *
   * @example
   *   debug(chr(97));
   *   // @results 'a'
   *   debug(chr(97, 98, 99));
   *   // @results 'abc'
   *   debug(chr(
   *          [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]
   *   ));
   *   // @results 'Hello World!'
   *
   *
   * @param  {...Number|Array}  (...)  Unicode numbers, or an array.
   * @return {String}                  Converted string from Unicode number.
   * @type  Function
   * @function
   * @static
   * @public
   */
  chr : function(/*[...args]*/) {
    var args = arrayize(arguments), codes, chars, divs, i, len, limit, sc;
    chars = [];
    limit = 0x2000;
    sc = String.fromCharCode;
    if (args.length > 1) {
      codes = args;
    } else if (args.length === 1) {
      codes = arrayize(args[0]);
    } else {
      return '';
    }
    if (codes) {
      len = codes.length;
      if (len === 1 && codes[0] && codes[0].length < limit) {
        return sc.apply(null, codes);
      } else {
        for (i = 0; i < len; i += limit) {
          divs = codes.slice(i, i + limit);
          chars[chars.length] = sc.apply(null, divs);
        }
      }
    }
    return chars.join('');
  },
  /**
   * A shortcut of charCodeAt(0).
   *
   *
   * @example
   *   debug(ord('Hello'));
   *   // @results 72
   *
   *
   * @param  {String}  s  Target string.
   * @return {Number}     The first index Unicode number in `s`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  ord : function(s) {
    return stringify(s, true).charCodeAt(0);
  },
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
   * Trim the white spaces including em (U+3000) from left side.
   *
   * White spaces will not removed when specified the second argument.
   *
   * @example
   *   debug( ltrim(' hoge  ') );
   *   // @results 'hoge  '
   *
   *
   * @example
   *   //
   *   // White spaces will not removed when 
   *   //  specified the second argument.
   *   //
   *   debug( ltrim('a cba', 'ac') );
   *   // @results ' cba'
   *
   *
   * @param  {String}   s            A target string.
   * @param  {String}  (chars)       (Optional) Removing characters.
   * @param  {Boolean} (ignoreCase)  (Optional) Whether ignore case on RegExp.
   * @return {String}                A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  ltrim : function(s, chars, ignoreCase) {
    var re;
    if (chars) {
      re = new RegExp(
        ['^[', ']+'].join(rescape(chars)),
        'g' + (ignoreCase ? 'i' : '')
      );
    } else {
      re = RE_LTRIM;
    }
    return stringify(s, true).replace(re, '');
  },
  /**
   * Trim the white spaces including em (U+3000) from right side.
   *
   * White spaces will not removed when specified the second argument.
   *
   * @example
   *   debug( rtrim(' hoge  ') );
   *   // @results ' hoge'
   *
   *
   * @example
   *   //
   *   // White spaces will not removed when 
   *   //  specified the second argument.
   *   //
   *   debug( rtrim('abc a', 'ac') );
   *   // @results 'abc '
   *
   *
   * @param  {String}   s            A target string.
   * @param  {String}  (chars)       (Optional) Removing characters.
   * @param  {Boolean} (ignoreCase)  (Optional) Whether ignore case on RegExp.
   * @return {String}                A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  rtrim : function(s, chars, ignoreCase) {
    var re;
    if (chars) {
      re = new RegExp(
        ['[', ']+$'].join(rescape(chars)),
        'g' + (ignoreCase ? 'i' : '')
      );
    } else {
      re = RE_RTRIM;
    }
    return stringify(s, true).replace(re, '');
  },
  /**
   * Remove all whitespaces in a string.
   *
   *
   * @example
   *   var s = '   Hello  World ! \r\n.';
   *   debug(strip(s));
   *   // @results 'HelloWorld!.'
   *
   *
   * @example
   *   var s = 'foo looooooooool';
   *   debug(strip(s, 'o'));
   *   // @results 'f ll'
   *
   *
   * @param  {String}  s             The target string.
   * @param  {String}  (chars)       (Optional) Removing characters.
   * @param  {Boolean} (ignoreCase)  (Optional) Whether ignore case on RegExp.
   * @return {String}                A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  strip : function(s, chars, ignoreCase) {
    var re;
    if (chars) {
      re = new RegExp(
        '[' + rescape(chars) + ']+',
        'g' + (ignoreCase ? 'i' : '')
      );
    } else {
      re = RE_STRIP;
    }
    return stringify(s, true).replace(re, '');
  },
  /**
   * Normalize whitespaces.
   * One or more whitespaces will be converted into one space.
   * If passed any character to the second argument then
   *   convertion will use it.
   *
   *
   * @example
   *   var s = 'Hello  \r\n  World  \r\n  \t !';
   *   debug(normalizeSpace(s));
   *   // @results 'Hello World !'
   *
   *
   * @example
   *   var s = 'foo       bar     baz';
   *   debug(normalizeSpace(s, '+'));
   *   // @results 'foo+bar+baz'
   *
   *
   * @param  {String}   s        The target string.
   * @param  {String}  (spacer)  (Optional) Convertion character.
   * @return {String}            A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  normalizeSpace : function(s, spacer) {
    return stringify(s, true).replace(/[\s\u00A0\u3000]+/g, spacer || ' ');
  },
  /**
   * Split a string into an array by whitespace.
   * All empty items will be removed for the result array.
   *
   *
   * @example
   *   var s = '  Hello  \r\n  World  \r\n  \t !  ';
   *   debug(splitBySpace(s));
   *   // @results ['Hello', 'World', '!']
   *
   *
   * @param  {String}   s   The target string.
   * @return {Array}        The result array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  splitBySpace : function(s) {
    var array = stringify(s, true).split(/[\s\u00A0\u3000]+/),
        a, i, len = array.length, results = [];
    for (i = 0; i < len; i++) {
      a = array[i];
      if (a && a.length) {
        results[results.length] = a;
      }
    }
    return results;
  },
  /**
   * Replaces new lines with unix style (\n).
   *
   *
   * @example
   *   var string = 'foo\r\nbar\rbaz\n';
   *   var result = canonicalizeNL(string);
   *   debug(result);
   *   // @results  'foo\nbar\nbaz\n';
   *
   *
   * @param  {String}    s    The input string.
   * @return {String}         The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  canonicalizeNL : function(s) {
    return stringify(s, true).replace(/\r\n|\r|\n/g, '\n');
  },
  /**
   * Wraps a string by specific character.
   * Wrapper string can specify an array.
   * That must has 2 or more items.
   *
   *
   * @example
   *   var s = 'hoge';
   *   debug(wrap(s, '"'));
   *   // @results '"hoge"'
   *
   *
   * @example
   *   var s = 'hoge';
   *   debug(wrap(s, ['(', ')']));
   *   // @results '(hoge)'
   *
   *
   * @example
   *   var s = 'hoge';
   *   debug(wrap(s, '()') + wrap(s, '[]'));
   *   // @results '(hoge)[hoge]'
   *
   *
   * @param  {String}         string   The target string.
   * @param  {String|Array}   wrapper  The wrapper character.
   * @return {String}                  The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  wrap : update(function(string, wrapper) {
    var w, s = stringify(string),
        me = arguments.callee, maps = me.PairMaps;
    if (wrapper && wrapper.shift && wrapper.pop) {
      s = stringify(wrapper.shift()) + s + stringify(wrapper.pop());
    } else {
      w = stringify(wrapper);
      if (w in maps) {
        s = maps[w][0] + s + maps[w][1];
      } else {
        s = w + s + w;
      }
    }
    return s;
  }, {
    /**@ignore*/
    PairMaps : {
      '()' : ['(', ')'],
      '<>' : ['<', '>'],
      '[]' : ['[', ']'],
      '{}' : ['{', '}']
    }
  }),
  /**
   * Unwraps a string by specific character.
   * Unwrapper string can specify an array.
   * That must has 2 or more items.
   *
   *
   * @example
   *   var s = '"hoge"';
   *   debug(unwrap(s, '"'));
   *   // @results 'hoge'
   *
   *
   * @example
   *   var s = '(hoge)';
   *   debug(unwrap(s, ['(', ')']));
   *   // @results 'hoge'
   *
   *
   * @example
   *   var s = '(L(hoge)R)';
   *   debug(unwrap(unwrap(s, '()'), ['L(', ')R']));
   *   // @results 'hoge'
   *
   *
   * @param  {String}        string     The target string.
   * @param  {String|Array}  unwrapper  The unwrapper character.
   * @return {String}                   The result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  unwrap : function(string, unwrapper) {
    var s = stringify(string), w, left, right,
        Text = Pot.Text, maps = Text.wrap.PairMaps;
    if (unwrapper && unwrapper.shift && unwrapper.pop) {
      left  = stringify(unwrapper.shift());
      right = stringify(unwrapper.pop());
    } else {
      w = stringify(unwrapper);
      if (w in maps) {
        left  = maps[w][0];
        right = maps[w][1];
      } else {
        left = right = w;
      }
    }
    if (left && Text.startsWith(s, left)) {
      s = s.substring(left.length);
    }
    if (right && Text.endsWith(s, right)) {
      s = s.substring(0, s.length - right.length);
    }
    return s;
  },
  /**
   * Check whether a string starts with prefix.
   *
   *
   * @example
   *   var result = startsWith('foo bar baz', 'foo');
   *   debug(result);
   *   // @results true
   *
   *
   * @example
   *   var result = startsWith('bar foo foo bar baz foo', 'foo');
   *   debug(result);
   *   // @results false
   *
   *
   * @example
   *   var result = startsWith('FoO bar foo foo bar baz foo', 'foo', true);
   *   debug(result);
   *   // @results true
   *
   *
   * @param  {String}    string      The string to check.
   * @param  {String}    prefix      The subject prefix.
   * @param  {Boolean} (ignoreCase)  Whether ignore case.
   * @return {Boolean}               True if `string` begins
   *                                   with `prefix`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  startsWith : function(string, prefix, ignoreCase) {
    var
    s = stringify(string, true),
    p = stringify(prefix, true);
    if (ignoreCase) {
      s = s.toLowerCase();
      p = p.toLowerCase();
    }
    return s.lastIndexOf(p, 0) === 0;
  },
  /**
   * Check whether a string ends with suffix.
   *
   *
   * @example
   *   var result = endsWith('foo bar baz', 'baz');
   *   debug(result);
   *   // @results true
   *
   *
   * @example
   *   var result = endsWith('foo bar baz foo bar', 'foo');
   *   debug(result);
   *   // @results false
   *
   *
   * @example
   *   var result = endsWith('bar foo foo bar baz FOo', 'foo', true);
   *   debug(result);
   *   // @results true
   *
   *
   * @param  {String}    string      The string to check.
   * @param  {String}    suffix      The subject suffix.
   * @param  {Boolean} (ignoreCase)  Whether ignore case.
   * @return {Boolean}               True if `string` ends
   *                                   with `suffix`.
   * @type  Function
   * @function
   * @static
   * @public
   */
  endsWith : function(string, suffix, ignoreCase) {
    var n,
    s = stringify(string, true),
    x = stringify(suffix, true);
    if (ignoreCase) {
      s = s.toLowerCase();
      x = x.toLowerCase();
    }
    n = s.length - x.length;
    return n >= 0 && s.indexOf(x, n) === n;
  },
  /**
   * A shortcut function of .toLowerCase().
   * Convert a string to lowercase.
   *
   *
   * @example
   *   debug(lower('Hello World!'));
   *   // @results 'hello world!'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  lower : function(s) {
    return stringify(s, true).toLowerCase();
  },
  /**
   * A shortcut function of .toUpperCase().
   * Convert a string to uppercase.
   *
   *
   * @example
   *  debug(upper('Hello World!'));
   *  // @results 'HELLO WORLD!'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A result string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  upper : function(s) {
    return stringify(s, true).toUpperCase();
  },
  /**
   * Convert a string to "Camelcase".
   *
   *
   * @example
   *   var result = camelize('font-size');
   *   debug(result);
   *   // @results 'fontSize'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  camelize : function(s) {
    return stringify(s).replace(/[_-]+(\w)/g, function(a, w) {
      return w.toUpperCase();
    });
  },
  /**
   * Convert a string to "hyphen-delimited syntax".
   *
   *
   * @example
   *   var result = hyphenize('fontSize');
   *   debug(result);
   *   // @results 'font-size'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  hyphenize : function(s) {
    return stringify(s).replace(/([A-Z]+)/g, '-$1').toLowerCase();
  },
  /**
   * Convert a string to "Underscore-syntax".
   *
   *
   * @example
   *   var result = underscore('rawInput');
   *   debug(result);
   *   // @results 'raw_input'
   *
   *
   * @param  {String}  s  A target string.
   * @return {String}     A converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  underscore : function(s) {
    return stringify(s).replace(/([A-Z]+)/g, '_$1').toLowerCase();
  },
  /**
   * Increment the argument value.
   * This incrementation like Perl and PHP etc that
   *   uses alphabets [a-z] + [A-Z] and digits [0-9]
   *   as magic-increment,
   *   (i.e., different with c-style increment.).
   *
   *
   * @example
   *   debug(inc('99'));
   *   // @results '100'
   *   debug(inc('a0'));
   *   // @results 'a1'
   *   debug(inc('Az'));
   *   // @results 'Ba'
   *   debug(inc('zz'));
   *   // @results 'aaa'
   *
   *
   * @example
   *   var s = 'X';
   *   for (var i = 0; i < 10; i++) {
   *     s = inc(s);
   *     debug(s);
   *   }
   *   // @results
   *   //   Y
   *   //   Z
   *   //   AA
   *   //   AB
   *   //   AC
   *   //   AD
   *   //   AE
   *   //   AF
   *   //   AG
   *   //   AH
   *
   *
   * @see Pot.Text.dec
   * @param  {String|Number|Date|*}  value  The value to increment.
   * @return {String|Number|Date|*}         The incremented value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  inc : function(value) {
    var LOWER = 1, UPPER = 2, NUMERIC = 3,
        pos, s, c, last, carry, add;
    if (Pot.isNumber(value)) {
      return ++value;
    }
    if (!Pot.isString(value)) {
      return value;
    }
    last = 0;
    carry = false;
    /**@ignore*/
    add = function(val) {
      return String.fromCharCode(val.charCodeAt(0) + 1);
    };
    s = value.toString().split('');
    if (s.length === 0) {
      return '1';
    }
    pos = s.length - 1;
    while (pos >= 0) {
      c = s[pos].charCodeAt(0);
      if (c >= 0x61/*'a'*/ && c <= 0x7A/*'z'*/) {
        if (c === 0x7A) {
          s[pos] = 'a';
          carry = true;
        } else {
          s[pos] = add(s[pos]);
          carry = false;
        }
        last = LOWER;
      } else if (c >= 0x41/*'A'*/ && c <= 0x5A/*'Z'*/) {
        if (c === 0x5A) {
          s[pos] = 'A';
          carry = true;
        } else {
          s[pos] = add(s[pos]);
          carry = false;
        }
        last = UPPER;
      } else if (c >= 0x30/*'0'*/ && c <= 0x39/*'9'*/) {
        if (c === 0x39) {
          s[pos] = '0';
          carry = true;
        } else {
          s[pos] = add(s[pos]);
          carry = false;
        }
        last = NUMERIC;
      } else {
        carry = false;
        break;
      }
      if (!carry) {
        break;
      }
      pos--;
    }
    if (carry) {
      switch (last) {
        case NUMERIC : s.unshift('1'); break;
        case UPPER   : s.unshift('A'); break;
        case LOWER   : s.unshift('a'); break;
      }
    }
    return s.join('');
  },
  /**
   * Decrement the argument value.
   * This decrementation like Perl and PHP etc that
   *   uses alphabets [a-z] + [A-Z] and digits [0-9] as
   *   magic-decrement,
   *   (i.e., different with c-style decrement.).
   * Note Magic-Decrement cannot works with perfectly,
   *  so that Perl and Ruby etc did not implemented magic-decerement.
   *
   *
   * @example
   *   debug(dec('100'));
   *   // @results '99'
   *   debug(dec('a1'));
   *   // @results 'a0'
   *   debug(dec('Ba'));
   *   // @results 'Az'
   *   debug(dec('aaa'));
   *   // @results 'zz'
   *
   *
   * @example
   *   var s = 'AC';
   *   for (var i = 0; i < 10; i++) {
   *     s = dec(s);
   *     debug(s);
   *   }
   *   // @results
   *   //   AB
   *   //   AA
   *   //   Z
   *   //   Y
   *   //   X
   *   //   W
   *   //   V
   *   //   U
   *   //   T
   *   //   S
   *
   *
   * @see Pot.Text.inc
   * @param  {String|Number|Date|*}  value  The value to decrement.
   * @return {String|Number|Date|*}         The decremented value.
   * @type  Function
   * @function
   * @static
   * @public
   */
  dec : function(value) {
    var LOWER = 1, UPPER = 2, NUMERIC = 3,
        i, len, s, c, t, n1, n2, carry, last, borrow;
    if (Pot.isNumber(value)) {
      return --value;
    }
    if (!Pot.isString(value)) {
      return value;
    }
    s = value.toString().split('').reverse();
    len = s.length;
    if (len === 0) {
      return '';
    }
    carry = false;
    for (i = 0; i < len; i++) {
      c = s[i].charCodeAt(0);
      if (!carry &&
           // a - z
          ((c >= 0x61 && c <= 0x7A) ||
           // A - Z
           (c >= 0x41 && c <= 0x5A) ||
           // 0 - 9
           (c >= 0x30 && c <= 0x39))
      ) {
        carry = true;
      }
      if (c === 0x61) {
        s[i] = 'z';
        last = LOWER;
      } else if (c === 0x41) {
        s[i] = 'Z';
        last = UPPER;
      } else if (c === 0x30) {
        s[i] = '9';
        last = NUMERIC;
      } else {
        break;
      }
    }
    if (!carry) {
      return value;
    }
    t = s[0];
    borrow = false;
    switch (last) {
      case LOWER:
          if (c === 0x61 &&
              (len <= 1 ||
               (len > 1 && s[len - 1] === s[len - 2]) ||
               (len === 2 && t === '0')
              )
          ) {
            borrow = true;
          }
          break;
      case UPPER:
          if (c === 0x41 &&
              (len <= 1 ||
               (len > 1 && s[len - 1] === s[len - 2]) ||
               (len === 2 && t === '0')
              )
          ) {
            borrow = true;
          }
          break;
      case NUMERIC:
          n1 = s[len - 1];
          n2 = s[len - 2];
          if ((c === 0x31 && n1 === '1' && n2 === '9') ||
              (c === 0x30 &&
               (len <= 1 ||
                (len > 1 && s[len - 1] === s[len - 2]) ||
                (len === 2 && t === '0')
               )
              )
          ) {
            borrow = true;
          }
          break;
    }
    if (i >= len) {
      i--;
    }
    s[i] = String.fromCharCode(s[i].charCodeAt(0) - 1);
    s = s.reverse();
    if (borrow) {
      s.shift();
    }
    return s.join('');
  },
  /**
   * Converts the new lines (\n) to <br>s or <br />s.
   *
   *
   * @example
   *   var string = '1. foo.\n2. bar.\n3. baz.';
   *   var result = br(string);
   *   debug(result);
   *   // @results '1. foo.<br>\n2. bar.<br>\n3. baz.'
   *
   *
   * @example
   *   var string = ' - foo.\n - bar.\n - baz.';
   *   var result = br(string, true);
   *   debug(result);
   *   // @results ' - foo.<br />\n - bar.<br />\n - baz.'
   *
   *
   * @example
   *   var string = '<ul><li>foo<br />fooo</li><li>bar\nbaaar</li></ul>';
   *   var result = br(string);
   *   debug(result);
   *   // @results '<ul><li>foo<br />fooo</li><li>bar<br />\nbaaar</li></ul>'
   *
   *
   * @example
   *   var string = [
   *     '<div>',
   *     '<h1>Hoge</h1>',
   *     '<p>',
   *     'foo',
   *     'bar',
   *     '</p>',
   *     '<span>baz</span>',
   *     '<b>qux</b>',
   *     '<pre>',
   *     'function hoge() {',
   *     '  return this;',
   *     '}',
   *     '</pre>',
   *     '<hr>',
   *     '</div>'
   *   ].join('\n');
   *   var result = br(string);
   *   debug(result);
   *   // @results
   *   //   <div>
   *   //   <h1>Hoge</h1>
   *   //   <p>
   *   //   foo<br>
   *   //   bar<br>
   *   //   </p>
   *   //   <span>baz</span><br>
   *   //   <b>qux</b><br>
   *   //   <pre>
   *   //   function hoge() {
   *   //     return this;
   *   //   }
   *   //   </pre>
   *   //   <hr>
   *   //   </div>
   *
   *
   * @example
   *   var string = [
   *     '<div>',
   *     '<div>foo</div>',
   *     '<div>bar</div>',
   *     '<div>baz</div>',
   *     '</div>'
   *   ].join('\n');
   *   var result = br(string, false, true);
   *   debug(result);
   *   // @results
   *   //   <div><br>
   *   //   <div>foo</div><br>
   *   //   <div>bar</div><br>
   *   //   <div>baz</div><br>
   *   //   </div>
   *
   *
   * @param  {String}    string   The string in which to convert newlines.
   * @param  {Boolean}  (useXML)  Whether to use XML compatible tags.
   * @param  {Boolean}   (all)    Whether convert all of the new lines.
   * @return {String}             A copy string of `string`
   *                                with converted newlines.
   * @type  Function
   * @function
   * @static
   * @public
   */
  br : update(function(string, useXML, all) {
    var result = '', me = arguments.callee, s, xml, tag;
    s = stringify(string);
    if (s) {
      xml = useXML;
      if (xml == null && me.patterns.xml.test(s)) {
        xml = true;
      }
      tag = xml ? '<br />' : '<br>';
      if (all) {
        result = s.replace(me.patterns.nlg, tag + '$1');
      } else {
        result = me.insertAdjust(s, tag);
      }
    }
    return result;
  }, {
    /**
     * @private
     * @ignore
     */
    patterns : {
      inline : new RegExp(['^(?:<|)(', ')(?:[^>]*>|)$'].join([
        '(?:a|b|i|q|s|u|abbr|acronym|applet|big|cite',
          '|code|dfn|em|font|iframe|kbd|label|object',
          '|samp|small|span|strike|strong|sub|sup|tt',
          '|var|bdo|button|del|ruby|img|input|select',
          '|embed|ins|keygen|textarea|map|canvas|svg',
          '|audio|command|mark|math|meter|time|video',
          '|datalist|progress|output|\\w+:\\w+',
        ')\\b'
      ].join('')), 'i'),
      xml  : /<\s*\w+[^>]*\/>/,
      nl   : /\r\n|\r|\n/,
      nlg  : /(\r\n|\r|\n)/g,
      rt   : /[\s\u00A0\u3000]+$/,
      top  : /^[\s\u00A0\u3000]*<\s*(\/|)\s*(\w+(?::\w+|))\b[^>]*(\/|)>/,
      end  : /<\s*(\/|)\s*(\w+(?::\w+|))\b[^>]*(\/|)>[\s\u00A0\u3000]*$/,
      code : new RegExp([
        '(<(pre|style|script)\\b[^>]*>[\\s\\S]*?</\\2\\s*>',
        '|<!--[\\s\\S]*?-->',
        '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
        ')'
      ].join(''), 'gi')
    },
    /**
     * @private
     * @ignore
     */
    insertAdjust : function(string, brTag) {
      var results = [], Text = Pot.Text, me = Text.br,
          value = stringify(string),
          lines, patterns, codes = [], mark = '', reset;
      if (value) {
        do {
          mark += 'Pot' + now();
        } while (~value.indexOf(mark));
        value = value.replace(me.patterns.code, function(a, code) {
          codes[codes.length] = code;
          return '<' + mark + codes.length + mark + '>';
        });
        lines = value.split(me.patterns.nl);
        each(lines, function(line, i) {
          var append = false, matches, closing, name, closed, nextName,
              next = stringify(lines[i + 1]),
              cur = line.replace(me.patterns.rt, '');
          if (~cur.indexOf(mark) || i >= lines.length - 1) {
            append = false;
          } else {
            if (!me.patterns.end.test(cur)) {
              append = true;
            } else {
              matches = cur.match(me.patterns.end);
              closing = matches[1];
              name    = matches[2];
              closed  = matches[3];
              if (me.patterns.inline.test(name)) {
                append = true;
              } else {
                if (closing || closed) {
                  if (next && me.patterns.top.test(next)) {
                    nextName = next.match(me.patterns.top)[2];
                    if (me.patterns.inline.test(cur) &&
                        me.patterns.inline.test(nextName)) {
                      append = true;
                    }
                  } else {
                    append = true;
                  }
                }
              }
            }
          }
          results[results.length] = line + (append ? brTag : '');
        });
        value = results.join('\n');
        if (codes && codes.length) {
          reset = new RegExp(
            ['<(', ')([0-9]+)\\1>'].join(rescape(mark)),
            'g'
          );
          value = value.replace(reset, function(a, mk, idx) {
            return codes[idx - 1];
          });
        }
      }
      return value;
    }
  }),
  /**
   * Remove the HTML/XML tags from string.
   *
   *
   * @example
   *   var html = '<div>Hoge</div>foo<br>bar<i>baz</i>';
   *   var result = stripTags(html);
   *   debug(result);
   *   // @results 'Hoge foo bar baz'
   *
   *
   * @param  {String}  text  The target string.
   * @return {String}        A result string that
   *                           removed all of tags.
   * @type  Function
   * @function
   * @static
   * @public
   */
  stripTags : update(function(text) {
    var result = '', me = arguments.callee, s, prev, i, limit = 5;
    s = stringify(text, true);
    if (s) {
      for (i = 0; i < limit; i++) {
        each(me.patterns, function(re) {
          s = s.replace(re.by, re.to);
        });
        if (prev === s) {
          break;
        }
        prev = s;
      }
      result = s;
    }
    return result;
  }, {
    /**@ignore*/
    patterns : [{
      by : /<([%?])[\s\S]*?\1>/g,
      to : ''
    }, {
      by : /<!--[\s\S]*?-->/g,
      to : ''
    }, {
      by : /<!-*\[CDATA\[[\s\S]*?\]\]-*>/gi,
      to : ''
    }, {
      by : /<!\s*\w+[^>]*>/g,
      to : ''
    }, {
      by : /<\s*(\w+)\b[^>]*>([\s\S]*?)<\s*\/\s*\1\s*>/g,
      to : ' $2 '
    }, {
      by : /<\s*\/?\s*\w+\b[^>]*>/g,
      to : ' '
    }, {
      by : /<[^>]*>|<[![\]-]*|[-[\]]*>/g,
      to : ' '
    }]
  }),
  /**
   * Truncates a string to a certain length and
   *   adds ellipsis (e.g., '...') if necessary.
   *
   *
   * @example
   *   var string = 'Helloooooooooo Wooooooooorld!! Hellooooo Woooooorld!!';
   *   debug(string + ' (length = ' + string.length + ')');
   *   var result = truncate(string, 10);
   *   debug(result + ' (length = ' + result.length + ')');
   *   // @results  result = 'Hellooo...' (length = 10)
   *
   *
   * @example
   *   var string = 'foooooooo baaaaaaaaar baaaaaaaaaaz';
   *   debug(string + ' (length = ' + string.length + ')');
   *   var result = truncate(string, 16, '...more');
   *   debug(result + ' (length = ' + result.length + ')');
   *   // @results  result = 'foooooooo...more' (length = 16)
   *
   *
   * @param  {String}   string     A target string.
   * @param  {Number}  (maxLen)    The maximum number of
   *                                 characters to truncates.
   * @param  {String}  (ellipsis)  Optional ellipsis string.
   * @return {String}              The truncated string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  truncate : function(string, maxLen, ellipsis) {
    var result = '', s, max, ch, cl;
    s = stringify(string, true);
    max = Pot.isNumeric(maxLen) ? maxLen - 0 : 140;
    if (arguments.length < 3) {
      ch = '...';
    } else {
      ch = stringify(ellipsis, true);
    }
    if (s) {
      if (max <= 0) {
        s = '';
      } else {
        if (s.length > max) {
          if (ch.length >= max) {
            cl = Math.floor(max * 0.726) || 0;
            ch = ch.substring(0, cl);
          }
          s = s.substring(0, max - ch.length) + ch;
        }
      }
      result = s;
    }
    return result;
  },
  /**
   * Truncate a string in the middle,
   *   adds ellipsis(e.g., '...') if necessary.
   *
   *
   * @example
   *   var string = 'Helloooooooooo Wooooooooorld!! Hellooooo Woooooorld!!';
   *   debug(string + ' (length = ' + string.length + ')');
   *   var result = truncateMiddle(string, 15);
   *   debug(result + ' (length = ' + result.length + ')');
   *   // @results  result = 'Helloo...orld!!' (length = 15)
   *
   *
   * @example
   *   var string = 'foooooooo baaaaaaaaar baaaaaaaaaaz';
   *   debug(string + ' (length = ' + string.length + ')');
   *   var result = truncateMiddle(string, 18, '(...)');
   *   debug(result + ' (length = ' + result.length + ')');
   *   // @results  result = 'foooooo(...)aaaaaz' (length = 18)
   *
   *
   * @param  {String}   string     A target string.
   * @param  {Number}  (maxLen)    The maximum number of
   *                                 characters to truncates.
   * @param  {String}  (ellipsis)  Optional ellipsis string.
   * @return {String}              The truncated string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  truncateMiddle : function(string, maxLen, ellipsis) {
    var result, s, max, ch, half, pos;
    s = stringify(string, true);
    max = Pot.isNumeric(maxLen) ? maxLen - 0 : 140;
    if (arguments.length < 3) {
      ch = '...';
    } else {
      ch = stringify(ellipsis, true);
    }
    if (s) {
      if (max <= 0) {
        s = '';
      } else {
        if (s.length > max) {
          if (ch.length >= max) {
            cl = Math.floor(max * 0.726) || 0;
            ch = ch.substring(0, cl);
          }
          half = Math.floor((max - ch.length) / 2);
          pos = s.length - half;
          half += (max - ch.length) % 2;
          s = s.substring(0, half) + ch + s.substring(pos);
        }
      }
      result = s;
    }
    return result;
  },
  /**
   * 全角英数記号文字を半角英数記号文字に変換
   * Convert the ascii symbols and alphanumeric characters to
   *   the zenkaku symbols and alphanumeric characters.
   *
   * Based:
   *   Hiragana/Katakana Library
   *   http://code.google.com/p/kanaxs/
   *
   *
   * @example
   *   debug(toHankakuCase('Ｈｅｌｌｏ Ｗｏｒｌｄ！ １２３４５'));
   *   // @results   'Hello World! 12345'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The conveted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toHankakuCase : function(text) {
    var r = [], c, s, i, len;
    s = stringify(text, true);
    if (s) {
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        if (0xFF01 <= c && c <= 0xFF5E) {
          c -= 0xFEE0;
        }
        r[r.length] = c;
      }
    }
    return Pot.Text.chr(r);
  },
  /**
   * 半角英数記号文字を全角英数記号文字に変換
   * Convert the zenkaku symbols and alphanumeric characters to
   *   the ascii symbols and alphanumeric characters.
   *
   *
   * @example
   *   debug(toZenkakuCase('Hello World! 12345'));
   *   // @results  'Ｈｅｌｌｏ Ｗｏｒｌｄ！ １２３４５'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toZenkakuCase : function(text) {
    var r = [], c, s, i, len;
    s = stringify(text, true);
    if (s) {
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        if (0x21 <= c && c <= 0x7E) {
          c += 0xFEE0;
        }
        r[r.length] = c;
      }
    }
    return Pot.Text.chr(r);
  },
  /**
   * 全角スペースを半角スペースに変換
   * Convert the em space(U+3000) to the single space(U+0020).
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toHanSpaceCase : function(text) {
    return stringify(text, true).replace(/[\u3000]/g, ' ');
  },
  /**
   * 半角スペースを全角スペースに変換
   * Convert the single space(U+0020) to the em space(U+3000).
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toZenSpaceCase : function(text) {
    return stringify(text, true).replace(/[\u0020]/g, '\u3000');
  },
  /**
   * 全角カタカナを全角ひらがなに変換
   * Convert the zenkaku katakana to the zenkaku hiragana.
   *
   *
   * @example
   *   debug(toHiraganaCase('ボポヴァアィイゥウェエォオ'));
   *   // @results  'ぼぽう゛ぁあぃいぅうぇえぉお'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string to hiragana.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toHiraganaCase : function(text) {
    var r = [], c, i, s, len, code;
    s = stringify(text, true);
    if (s) {
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        if (0x30A1 <= c && c <= 0x30F6) {
          code = c - 0x0060;
          // 「ヴ」を「う」+「゛」に変換
          if (c === 0x30F4) {
            r[r.length] = 0x3046;
            code = 0x309B;
          }
          c = code;
        }
        r[r.length] = c;
      }
    }
    return Pot.Text.chr(r);
  },
  /**
   * 全角ひらがなを全角カタカナに変換
   * Convert the zenkaku hiragana to the zenkaku katakana.
   *
   *
   * @example
   *   debug(toKatakanaCase('ぼぽう゛ぁあぃいぅうぇえぉお'));
   *   // @results  'ボポヴァアィイゥウェエォオ'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string to katakana.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toKatakanaCase : function(text) {
    var r = [], c, d, i, code, len, s;
    s = stringify(text, true);
    if (s) {
      i = 0;
      len = s.length;
      while (i < len) {
        c = s.charCodeAt(i++);
        if (0x3041 <= c && c <= 0x3096) {
          code = c + 0x0060;
          if (i < len && c === 0x3046) {
            d = s.charCodeAt(i);
            if (d === 0x309B || d === 0xFF9E) {
              // 「う」+「゛」を「ヴ」に変換
              code = 0x30F4;
              i++;
            }
          }
          c = code;
        }
        r[r.length] = c;
      }
    }
    return Pot.Text.chr(r);
  },
  /**
   * 全角カタカナを半角ｶﾀｶﾅに変換
   * Convert the zenkaku katakana to the hankaku katakana.
   *
   *
   * @example
   *   debug(toHankanaCase('ボポヴァアィイゥウェエォオ'));
   *   // @results  'ﾎﾞﾎﾟｳﾞｧｱｨｲｩｳｪｴｫｵ'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string to hankaku katakana.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toHankanaCase : (function() {
    var map = {
      0x30A1:0xFF67,0x30A3:0xFF68,0x30A5:0xFF69,0x30A7:0xFF6A,0x30A9:0xFF6B,
      0x30FC:0xFF70,0x30A2:0xFF71,0x30A4:0xFF72,0x30A6:0xFF73,0x30A8:0xFF74,
      0x30AA:0xFF75,0x30AB:0xFF76,0x30AD:0xFF77,0x30AF:0xFF78,0x30B1:0xFF79,
      0x30B3:0xFF7A,0x30B5:0xFF7B,0x30B7:0xFF7C,0x30B9:0xFF7D,0x30BB:0xFF7E,
      0x30BD:0xFF7F,0x30BF:0xFF80,0x30C1:0xFF81,0x30C4:0xFF82,0x30C6:0xFF83,
      0x30C8:0xFF84,0x30CA:0xFF85,0x30CB:0xFF86,0x30CC:0xFF87,0x30CD:0xFF88,
      0x30CE:0xFF89,0x30CF:0xFF8A,0x30D2:0xFF8B,0x30D5:0xFF8C,0x30D8:0xFF8D,
      0x30DB:0xFF8E,0x30DE:0xFF8F,0x30DF:0xFF90,0x30E0:0xFF91,0x30E1:0xFF92,
      0x30E2:0xFF93,0x30E3:0xFF6C,0x30E4:0xFF94,0x30E5:0xFF6D,0x30E6:0xFF95,
      0x30E7:0xFF6E,0x30E8:0xFF96,0x30E9:0xFF97,0x30EA:0xFF98,0x30EB:0xFF99,
      0x30EC:0xFF9A,0x30ED:0xFF9B,0x30EF:0xFF9C,0x30F2:0xFF66,0x30F3:0xFF9D,
      0x30C3:0xFF6F,0x300C:0xFF62,0x300D:0xFF63,0x3002:0xFF61,0x3001:0xFF64,
      0x30FB:0xFF65,0x309B:0xFF9E,0x309C:0xFF9F
    },
    exc = {
      0x30F4:0xFF73,0x30F7:0xFF9C,0x30FA:0xFF66
    };
    return function(text) {
      var r = [], i, s, len, c;
      s = stringify(text, true);
      if (s) {
        i = 0;
        len = s.length;
        while (i < len) {
          c = s.charCodeAt(i++);
          if (c in map) {
            r[r.length] = map[c];
          } else if (c in exc) {
            r.push(exc[c], 0xFF9E);
          } else if (0x30AB <= c && c <= 0x30C9) {
            r.push(map[c - 1], 0xFF9E);
          } else if (0x30CF <= c && c <= 0x30DD) {
            r.push(map[c - c % 3], [0xFF9E, 0xFF9F][c % 3 - 1]);
          } else {
            r[r.length] = c;
          }
        }
      }
      return Pot.Text.chr(r);
    };
  })(),
  /**
   * 半角ｶﾀｶﾅを全角カタカナに変換 (濁音含む)
   * Convert the hankaku katakana to
   *   the zenkaku katakana (including dullness).
   *
   *
   * @example
   *   debug(toZenkanaCase('ﾎﾞﾎﾟｳﾞｧｱｨｲｩｳｪｴｫｵ'));
   *   // @results  'ボポヴァアィイゥウェエォオ'
   *
   *
   * @param  {String}  text  The input string.
   * @return {String}        The converted string to zenkaku katakana.
   * @type  Function
   * @function
   * @static
   * @public
   */
  toZenkanaCase : (function() {
    var maps = [
      // Unicode U+FF61 - U+FF9F Mapping
      0x3002, 0x300C, 0x300D, 0x3001, 0x30FB, 0x30F2, 0x30A1, 0x30A3,
      0x30A5, 0x30A7, 0x30A9, 0x30E3, 0x30E5, 0x30E7, 0x30C3, 0x30FC,
      0x30A2, 0x30A4, 0x30A6, 0x30A8, 0x30AA, 0x30AB, 0x30AD, 0x30AF,
      0x30B1, 0x30B3, 0x30B5, 0x30B7, 0x30B9, 0x30BB, 0x30BD, 0x30BF,
      0x30C1, 0x30C4, 0x30C6, 0x30C8, 0x30CA, 0x30CB, 0x30CC, 0x30CD,
      0x30CE, 0x30CF, 0x30D2, 0x30D5, 0x30D8, 0x30DB, 0x30DE, 0x30DF,
      0x30E0, 0x30E1, 0x30E2, 0x30E4, 0x30E6, 0x30E8, 0x30E9, 0x30EA,
      0x30EB, 0x30EC, 0x30ED, 0x30EF, 0x30F3, 0x309B, 0x309C
    ];
    return function(text) {
      var code, codes = [], i, len, s, c, next, last;
      s = stringify(text, true);
      if (s) {
        len = s.length;
        last = len - 1;
        for (i = 0; i < len; i++) {
          c = s.charCodeAt(i);
          // 半角カタカナの範囲
          if (c > 0xFF60 && c < 0xFFA0) {
            code = maps[c - 0xFF61];
            if (i < last) {
              next = s.charCodeAt(++i);
              // 濁音「ﾞ」 + 「ヴ」
              if (next === 0xFF9E && c === 0xFF73) {
                code = 0x30F4;
              // 濁音「ﾞ」 + 「カ」～「コ」 or 「ハ」～「ホ」
              } else if (next === 0xFF9E &&
                            ((c > 0xFF75 && c < 0xFF85) ||
                             (c > 0xFF89 && c < 0xFF8F))) {
                code++;
              // 濁音「ﾟ」 + 「ハ」～「ホ」
              } else if (next === 0xFF9F &&
                             (c > 0xFF89 && c < 0xFF8F)) {
                code += 2;
              } else {
                i--;
              }
            }
            c = code;
          }
          codes[codes.length] = c;
        }
      }
      return Pot.Text.chr(codes);
    };
  })()
});

// Update Pot object.
Pot.update({
  stringify      : Pot.Text.stringify,
  chr            : Pot.Text.chr,
  ord            : Pot.Text.ord,
  trim           : Pot.Text.trim,
  ltrim          : Pot.Text.ltrim,
  rtrim          : Pot.Text.rtrim,
  strip          : Pot.Text.strip,
  normalizeSpace : Pot.Text.normalizeSpace,
  splitBySpace   : Pot.Text.splitBySpace,
  canonicalizeNL : Pot.Text.canonicalizeNL,
  wrap           : Pot.Text.wrap,
  unwrap         : Pot.Text.unwrap,
  startsWith     : Pot.Text.startsWith,
  endsWith       : Pot.Text.endsWith,
  lower          : Pot.Text.lower,
  upper          : Pot.Text.upper,
  camelize       : Pot.Text.camelize,
  hyphenize      : Pot.Text.hyphenize,
  underscore     : Pot.Text.underscore,
  inc            : Pot.Text.inc,
  dec            : Pot.Text.dec,
  br             : Pot.Text.br,
  stripTags      : Pot.Text.stripTags,
  truncate       : Pot.Text.truncate,
  truncateMiddle : Pot.Text.truncateMiddle,
  toHankakuCase  : Pot.Text.toHankakuCase,
  toZenkakuCase  : Pot.Text.toZenkakuCase,
  toHanSpaceCase : Pot.Text.toHanSpaceCase,
  toZenSpaceCase : Pot.Text.toZenSpaceCase,
  toHiraganaCase : Pot.Text.toHiraganaCase,
  toKatakanaCase : Pot.Text.toKatakanaCase,
  toHankanaCase  : Pot.Text.toHankanaCase,
  toZenkanaCase  : Pot.Text.toZenkanaCase
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of DOM.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * DOM utilities.
   *
   * @name Pot.DOM
   * @type Function
   * @function
   * @class
   * @static
   * @public
   */
  DOM : function() {
    return Pot.currentDocument();
  }
});

// Update DOM methods.
(function(DOM, isWindow, isDocument, isString,
                isObject, isArray, isArrayLike) {

update(DOM, {
  /**
   * @lends Pot.DOM
   */
  /**
   * The name of Pot.DOM.
   *
   * @type String
   * @static
   * @private
   * @const
   * @ignore
   */
  NAME : 'DOM',
  /**
   * toString.
   *
   * @return {String}     The string representation of object.
   * @type Function
   * @function
   * @static
   * @public
   */
  toString : Pot.toString,
  /**
   * Enumeration for DOM node types (for reference)
   *
   * @link http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247
   * @enum {Number}
   * @static
   * @const
   * @public
   */
  NodeType : {
    ELEMENT_NODE                : 1,
    ATTRIBUTE_NODE              : 2,
    TEXT_NODE                   : 3,
    CDATA_SECTION_NODE          : 4,
    ENTITY_REFERENCE_NODE       : 5,
    ENTITY_NODE                 : 6,
    PROCESSING_INSTRUCTION_NODE : 7,
    COMMENT_NODE                : 8,
    DOCUMENT_NODE               : 9,
    DOCUMENT_TYPE_NODE          : 10,
    DOCUMENT_FRAGMENT_NODE      : 11,
    NOTATION_NODE               : 12
  },
  /**
   * Enumeration for DOM XPath result types (for reference)
   *
   * @link http://www.w3.org/TR/DOM-Level-3-XPath/ecma-script-binding.html
   * @enum {Number}
   * @static
   * @const
   * @public
   */
  XPathResult : {
    ANY_TYPE                     : 0,
    NUMBER_TYPE                  : 1,
    STRING_TYPE                  : 2,
    BOOLEAN_TYPE                 : 3,
    UNORDERED_NODE_ITERATOR_TYPE : 4,
    ORDERED_NODE_ITERATOR_TYPE   : 5,
    UNORDERED_NODE_SNAPSHOT_TYPE : 6,
    ORDERED_NODE_SNAPSHOT_TYPE   : 7,
    ANY_UNORDERED_NODE_TYPE      : 8,
    FIRST_ORDERED_NODE_TYPE      : 9
  },
  /**
   * Mapping the attribute names for access to property.
   *
   * @type Object
   * @static
   * @const
   */
  AttrMaps : (function() {
    var maps = {}, p;
    maps.dir = {
      'for'         : 'htmlFor',
      'class'       : 'className',
      'readonly'    : 'readOnly',
      'maxlength'   : 'maxLength',
      'cellpadding' : 'cellPadding',
      'cellspacing' : 'cellSpacing',
      'rowspan'     : 'rowSpan',
      'colspan'     : 'colSpan',
      'tabindex'    : 'tabIndex',
      'usemap'      : 'useMap',
      'frameborder' : 'frameBorder',
      'valign'      : 'vAlign',
      'checked'     : 'defaultChecked',
      'bgcolor'     : 'bgColor'
    };
    maps.raw = {};
    for (p in maps.dir) {
      maps.raw[maps.dir[p]] = p;
    }
    return maps;
  })(),
  /**
   * Detect Window object.
   *
   * @param  {Document|Element|Node|*}   x  The target object.
   * @return {Window|undefined}             Result of detected object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  detectWindow : (function() {
    /**@ignore*/
    function detect(o) {
      try {
        return (isWindow(o.window) && o.window) ||
               (isWindow(o.contentWindow) && o.contentWindow) ||
               (isWindow(o.defaultView) && o.defaultView) ||
               (isWindow(o.parentWindow) && o.parentWindow) ||
               (isWindow(o.top) && o.top) ||
               (isWindow(o.content) && o.content);
      } catch (e) {}
    }
    return function(x) {
      var win, doc;
      if (x) {
        if (isWindow(x)) {
          win = x;
        } else {
          try {
            win = detect(x);
            if (!isWindow(win)) {
              doc = DOM.detectDocument(x);
              if (doc) {
                win = detect(doc);
              }
            }
          } catch (e) {}
        }
      }
      return win;
    };
  })(),
  /**
   * Detect Document object.
   *
   * @param  {Window|Element|Node|*}   x  The target object.
   * @return {Document|undefined}         Result of detected object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  detectDocument : function(x) {
    var doc;
    if (x) {
      if (isDocument(x)) {
        doc = x;
      } else {
        try {
          doc = (x.ownerDocument || x.document ||
                (x.content && x.content.document));
        } catch (e) {}
      }
    }
    return doc;
  },
  /**
   * Returns the owner document for a node.
   *
   * @param  {Node|Window|Element}  node  The node to get the document for.
   * @return {Document}                   The document owning the node.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getOwnerDocument : function(node) {
    return node != null &&
      ((node.nodeType == DOM.NodeType.DOCUMENT_NODE) ? node :
       (node.ownerDocument || node.document || DOM.detectDocument(node)));
  },
  /**
   * Alias for getElementById.
   *
   * @param  {String|Element}    id     Element ID or a DOM node.
   * @param  {Element|Document}  (doc)  (Optional) A context node.
   * @return {Element}                  The element with the given ID,
   *                                      or the node passed in.
   * @type   Function
   * @function
   * @static
   * @public
   */
  byId : function(id, doc) {
    return isString(id) ?
      (doc || Pot.currentDocument()).getElementById(id) : id;
  },
  /**
   * Get the element(s) by simple CSS selector expression.
   * If .querySelector is available then will use it.
   *
   * @example
   *   var elem;
   *   elem = getElement('#foo');
   *   // @results  elem = Element e.g. <div id="foo"/>
   *   elem = getElement('.bar');
   *   // @results  elem = Element e.g. <div class="bar"/>
   *   elem = getElement('span.bar');
   *   // @results  elem = Element e.g. <span class="bar"/>
   *   elem = getElement('textarea');
   *   // @results  elem = Element e.g. <textarea>...</textarea>
   *   elem = getElement('[name="foo"]');
   *   // @results  elem = Element e.g. <div name="foo"/>
   *   elem = getElement('input[type="text"]');
   *   // @results  elem = Element e.g. <input type="text"/>
   *   elem = getElement('[action]');
   *   // @results  elem = Element e.g. <form action="..."/>
   *   elem = getElement('<div/>');
   *   // @results  elem = new Element e.g. <div/>
   *   elem = getElement('<div name="foo">Hello foo.</div>');
   *   // @results  elem = new Element e.g. <div name="foo">Hello foo.</div>
   *   elem = getElement('*');
   *   // @results  elem = All Elements, but will be returned first item.
   *   //                              e.g. <html lang="ja"/>
   *   // Multiple:
   *   var elems;
   *   elems = getElement('#foo, .bar, *[name="baz"]', document, true);
   *   // @results
   *   //   elems = [<div id="foo"/>, <div class="bar"/>, <div name="baz"/>]
   *   elems = getElement('*', getElement('div#foo'), true);
   *   // @results
   *   //   elems = Return all childNodes in <div id="foo">...</div>
   *
   *
   * @param  {String}            selector   The simple CSS selector.
   * @param  {Document|Element}  (context)  The target context or element.
   * @param  {Boolean}           (multi)    Whether to get the
   *                                          multiple elements.
   *                                        Default is single mode.
   * @return {Array|Element}                The result element(s).
   * @type   Function
   * @function
   * @static
   * @public
   */
  getElement : (function() {
    // http://www.w3.org/TR/css3-selectors/
    // http://www.w3.org/TR/REC-html40/types.html#type-name
    // ID and NAME tokens must begin with a letter ([A-Za-z])
    // and may be followed by any number of letters,
    // digits ([0-9]), hyphens ("-"), underscores ("_"),
    // colons (":"), and periods (".").
    /**@ignore*/
    var PATTERNS = (function() {
      var
      ident = '[\\w\\u00C0-\\uFFFF-]',
      space = '[\\s\\u00A0]',
      /**@ignore*/
      re = function() {
        return new RegExp(arrayize(arguments).join(''));
      };
      /**@ignore*/
      return {
        /**@ignore*/
        TAG : {
          /**@ignore*/
          re   : re('^([*]|', ident, '+)'),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            o.tag = m[1];
            return byTag(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        ID : {
          /**@ignore*/
          re   : re('^#(', ident, '+)'),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            return byId(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        CLASS : {
          /**@ignore*/
          re   : re('^[.](', ident, '+)'),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            return byClass(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        NAME : {
          /**@ignore*/
          re   : re('^\\[', space, '*name', space,
                    '*=', space,
                    '*["\']*(', ident, '+)[\'"]*', space,
                    '*\\]'
                 ),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            return byName(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        ATTR : {
          /**@ignore*/
          re   : re('^\\[', space, '*(', ident, '+)', space,
                    '*([~*|^$!]?=|)', space,
                    '*["\']?(.*?(?=["\'])|[^\'"[\\]]*)[\'"]?', space,
                    '*\\]'
                 ),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            if (m[2]) {
              return byAttr(o, m[1], m[2], m[3], doc, multi);
            } else {
              return byAttr(o, m[1], null, null, doc, multi);
            }
          }
        },
        /**@ignore*/
        PSEUDO : {
          /**@ignore*/
          re   : re('^::?((?:[()]|', ident, ')+)'),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            return byPseudo(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        RELATIVE : {
          /**@ignore*/
          re   : re('^', space, '*((?:', space, '+|[>+~])',
                    '(?=', space, '*(?:', ident, '|[*#.[\\]:])))',
                    space, '*'
                 ),
          func : function(o, m, doc, multi) {
            o.relative = trim(m[1]) || ' ';
            o.relFirst = true;
          }
        },
        /**@ignore*/
        SPLIT  : re(space, '*,+', space, '*'),
        /**@ignore*/
        SPACES : re(space, '+'),
        /**@ignore*/
        QUOTES : /"[^"]*?"|'[^']*?'/g,
        /**@ignore*/
        PARSE_ORDER : {
          TAG      : 1,
          ID       : 2,
          CLASS    : 3,
          NAME     : 4,
          ATTR     : 5,
          PSEUDO   : 6,
          RELATIVE : 7
        }
      };
    })();
    /**@ignore*/
    function normalizeElements(elems) {
      var r = [], i, j, len, dups = [];
      len = elems && elems.length;
      if (len) {
        for (i = 0; i < len; i++) {
          for (j = i + 1; j < len; j++) {
            if (elems[i] === elems[j]) {
              dups[j] = i;
            }
          }
          if (elems[i] && !(i in dups)) {
            r[r.length] = elems[i];
          }
        }
      }
      return r;
    }
    /**@ignore*/
    function searchReplace(o, re, sel, doc, multi) {
      var m = sel.match(re.re), result;
      if (m && m[0]) {
        sel = sel.replace(m[0], '');
        result = re.func(o, m, doc, multi);
        if (o.relative) {
          if (!o.relFirst) {
            if (multi) {
              o.relments = result ? arrayize(result) : [];
            } else {
              o.relments = (result && result[0]) || result || null;
            }
            o.relmDone = true;
          }
        } else {
          if (multi) {
            o.elements = result ? arrayize(result) : [];
          } else {
            o.elements = (result && result[0]) || result || null;
          }
          o.elemDone = true;
        }
      }
      return sel;
    }
    /**@ignore*/
    function getCurrentElements(o) {
      var result;
      if (o.relmDone) {
        result = o.relments;
      } else if (o.elemDone) {
        result = o.elements;
      } else {
        return false;
      }
      return result ? arrayize(result) : [];
    }
    /**@ignore*/
    function selectRelative(o, doc, multi) {
      var result = [], parents, childs, child, i, j, len, plen, node, has;
      parents = arrayize(o.elements);
      plen = parents.length;
      if (o.relments) {
        childs = arrayize(o.relments);
        len = childs.length;
        for (i = 0; i < len; i++) {
          child = childs[i];
          node = child;
          has = false;
          try {
            switch (o.relative) {
              case ' ':
                  while ((node = node.parentNode)) {
                    for (j = 0; j < plen; j++) {
                      if (parents[j] === node) {
                        has = true;
                        break;
                      }
                    }
                    if (has) {
                      break;
                    }
                  }
                  break;
              case '>':
                  node = node.parentNode;
                  for (j = 0; j < plen; j++) {
                    if (parents[j] === node) {
                      has = true;
                      break;
                    }
                  }
                  break;
              case '+':
                  while ((node = node.previousSibling)) {
                    if (node.nodeType == DOM.NodeType.ELEMENT_NODE) {
                      for (j = 0; j < plen; j++) {
                        if (parents[j] === node) {
                          has = true;
                          break;
                        }
                      }
                      break;
                    }
                  }
                  break;
              case '~':
                  while ((node = node.previousSibling)) {
                    if (node.nodeType == DOM.NodeType.ELEMENT_NODE) {
                      for (j = 0; j < plen; j++) {
                        if (parents[j] === node) {
                          has = true;
                          break;
                        }
                      }
                      if (has) {
                        break;
                      }
                    }
                  }
                  break;
              default:
                  has = false;
                  break;
            }
          } catch (e) {
            has = false;
          }
          if (has) {
            result[result.length] = child;
          }
        }
      }
      if (multi) {
        o.elements = result || [];
      } else {
        o.elements = (result && result[0]) || null;
      }
    }
    /**@ignore*/
    function getAll(o, doc, multi) {
      var result, context, elems;
      context = doc || Pot.currentDocument();
      o.tag = o.tag || '*';
      elems = getCurrentElements(o);
      if (elems === false) {
        if (context.getElementsByTagName) {
          result = context.getElementsByTagName(o.tag);
        } else if (context.querySelectorAll) {
          result = context.querySelectorAll(o.tag);
        } else {
          result = [];
        }
      } else {
        result = elems;
      }
      if (!result || !result.length) {
        result = [];
      }
      result = arrayize(result);
      if (multi) {
        return result;
      } else {
        return (result && result[0]) || null;
      }
    }
    /**@ignore*/
    function byId(o, id, doc, multi) {
      var result, context, elems, elem, i, len;
      if (!id) {
        return multi ? [] : null;
      }
      context = doc || Pot.currentDocument();
      elems = getCurrentElements(o);
      if (elems === false) {
        result = context.getElementById(id);
      } else if (elems && elems.length) {
        result = null;
        len = elems.length;
        for (i = 0; i < len; i++) {
          elem = elems[i];
          if (elem &&
              (elem.id == id || DOM.getAttr(elem, 'id') == id)) {
            result = elem;
            break;
          }
        }
      }
      if (!result) {
        return multi ? [] : null;
      }
      if (multi) {
        return result ? [result] : [];
      } else {
        return result || null;
      }
    }
    /**@ignore*/
    function byTag(o, tag, doc, multi) {
      var result, elems, context, tagName, elem, i, len;
      o.tag = tag || o.tag || '*';
      context = doc || Pot.currentDocument();
      elems = getCurrentElements(o);
      if (elems === false) {
        if (!o.tag || o.tag === '*') {
          result = getAll(o, context, multi);
        } else {
          result = context.getElementsByTagName(o.tag);
        }
      } else if (elems && elems.length) {
        if (!o.tag || o.tag === '*') {
          result = elems;
        } else {
          tagName = stringify(o.tag).toLowerCase();
          result = [];
          len = elems.length;
          for (i = 0; i < len; i++) {
            elem = elems[i];
            if (elem && DOM.tagNameOf(elem) === tagName) {
              result[result.length] = elem;
            }
          }
        }
      }
      if (multi) {
        if (isArrayLike(result)) {
          result = (result && result.length) ? arrayize(result) : [];
        } else {
          result = result ? arrayize(result) : [];
        }
      } else {
        if (isArrayLike(result)) {
          result = ((result && result.length) ? result[0] : null) || null;
        } else {
          result = result || null;
        }
      }
      return result;
    }
    /**@ignore*/
    function byName(o, name, doc, multi) {
      var result, elems, context, elem, i, len;
      if (!name) {
        return multi ? [] : null;
      }
      context = doc || Pot.currentDocument();
      elems = getCurrentElements(o);
      if (elems === false) {
        result = context.getElementsByName(name);
      } else {
        result = [];
        len = elems.length;
        for (i = 0; i < len; i++) {
          elem = elems[i];
          if (elem &&
              (elem.name == name || DOM.getAttr(elem, 'name') == name)) {
            result[result.length] = elem;
          }
        }
      }
      if (multi) {
        if (isArrayLike(result)) {
          result = (result && result.length) ? arrayize(result) : [];
        } else {
          result = result ? arrayize(result) : [];
        }
      } else {
        if (isArrayLike(result)) {
          result = ((result && result.length) ? result[0] : null) || null;
        } else {
          result = result || null;
        }
      }
      return result;
    }
    /**@ignore*/
    function byClass(o, name, doc, multi) {
      var r = [], re, elems, elem, i, len;
      if (!name) {
        return multi ? [] : null;
      }
      re = PATTERNS.SPACES;
      elems = getCurrentElements(o);
      if (elems === false) {
        elems = getAll(o, doc, multi);
      }
      elems = arrayize(elems);
      len = elems.length;
      for (i = 0; i < len; i++) {
        elem = elems[i];
        if (elem && elem.className && (elem.className == name ||
            Pot.Struct.contains(elem.className.split(re), name))) {
          if (multi) {
            r[r.length] = elem;
          } else {
            r = elem || null;
            break;
          }
        }
      }
      return r;
    }
    /**@ignore*/
    function byAttr(o, name, op, value, doc, multi) {
      var result = [], attr, elems, node, selector, tagName, dir, raw,
          elem, i, len, has, aval;
      if (!name) {
        return multi ? [] : null;
      }
      node = doc || Pot.currentDocument();
      dir = DOM.AttrMaps.dir;
      raw = DOM.AttrMaps.raw;
      elems = getCurrentElements(o);
      if (elems === false) {
        if (node.querySelectorAll) {
          attr = raw[name] || name;
          if (op != null) {
            selector = '*[' + attr + op +
                        '"' + Pot.Sanitizer.escapeString(value) + '"]';
          } else {
            selector = '*[' + attr + ']';
          }
          if (multi) {
            result = node.querySelectorAll(selector);
            if (!result || !result.length) {
              result = [];
            } else {
              result = arrayize(result);
            }
          } else {
            result = node.querySelector(selector) || null;
          }
          return result;
        }
        elems = getAll(o, node, multi);
      }
      elems = arrayize(elems);
      len = elems.length;
      for (i = 0; i < len; i++) {
        elem = elems[i];
        has = false;
        if (Pot.isElement(elem)) {
          if (op != null) {
            aval = DOM.getAttr(elem, name);
            switch (op) {
              case '=':
                  has = (aval == value);
                  break;
              case '~=':
                  has = new RegExp(
                          '(?:^|\\s)' + rescape(value) + '(?:\\s|$)'
                        ).test(aval);
                  break;
              case '|=':
                  has = (aval == value ||
                         String(aval).indexOf(value + '-') === 0);
                  break;
              case '^=':
                  has = Pot.Text.startsWith(aval, value);
                  break;
              case '$=':
                  has = Pot.Text.endsWith(aval, value);
                  break;
              case '*=':
                  has = Pot.Struct.contains(aval, value);
                  break;
              case '!=':
                  has = (aval != value);
                  break;
              default:
                  has = false;
                  break;
            }
          } else {
            has = DOM.hasAttr(elem, name);
          }
          if (has) {
            if (multi) {
              result[result.length] = elem;
            } else {
              result = elem || null;
              break;
            }
          }
        }
      }
      if (!multi && isArrayLike(result)) {
        if (result && result.length) {
          result = result.shift() || null;
        } else {
          result = null;
        }
      }
      return result;
    }
    /**@ignore*/
    function byPseudo(o, op, doc, multi) {
      var result = [], elems, context, elem, i, len,
          node, parent, count, ok, attr, type, name,
          pseudo = stringify(op, true).toLowerCase();
      if (!pseudo) {
        return multi ? [] : null;
      }
      context = doc || Pot.currentDocument();
      elems = getCurrentElements(o);
      if (elems === false) {
        elems = getAll(o, context, multi);
      }
      elems = arrayize(elems);
      len = elems.length;
      for (i = 0; i < len; i++) {
        elem = elems[i];
        node = elem;
        try {
          switch (pseudo) {
            case 'first-child':
                while ((node = node.previousSibling)) {
                  if (node.nodeType == DOM.NodeType.ELEMENT_NODE) {
                    throw false;
                  }
                }
                break;
            case 'last-child':
                while ((node = node.nextSibling)) {
                  if (node.nodeType == DOM.NodeType.ELEMENT_NODE) {
                    throw false;
                  }
                }
                break;
            case 'even':
                parent = elem.parentNode;
                if (parent) {
                  count = 0;
                  node = parent.firstChild;
                  for (; node; node = node.nextSibling) {
                    if (node.nodeType == DOM.NodeType.ELEMENT_NODE &&
                        count++ % 2 === 0 && node === elem
                    ) {
                      ok = true;
                      break;
                    }
                  }
                }
                if (!ok) {
                  throw false;
                }
                break;
            case 'odd':
                parent = elem.parentNode;
                if (parent) {
                  count = 0;
                  node = parent.firstChild;
                  for (; node; node = node.nextSibling) {
                    if (node.nodeType == DOM.NodeType.ELEMENT_NODE &&
                        count++ % 2 === 1 && node === elem
                    ) {
                      ok = true;
                      break;
                    }
                  }
                }
                if (!ok) {
                  throw false;
                }
                break;
            case 'focus':
                if (elem === elem.ownerDocument.activeElement) {
                  break;
                }
                throw false;
            case 'enabled':
                if (elem.disabled || elem.type == 'hidden') {
                  throw false;
                }
                break;
            case 'disabled':
                if (!elem.disabled) {
                  throw false;
                }
                break;
            case 'checked':
                if (elem.checked) {
                  break;
                }
                throw false;
            case 'selected':
                if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
                }
                if (elem.selected) {
                  break;
                }
                throw false;
            case 'parent':
                if (!elem.firstChild) {
                  throw false;
                }
                break;
            case 'empty':
                if (elem.firstChild) {
                  throw false;
                }
                break;
            case 'header':
                if (!/h\d/i.test(elem.nodeName)) {
                  throw false;
                }
                break;
            case 'text':
                attr = elem.getAttribute('type');
                type = elem.type;
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'text' === type && (attr === type || attr == null)) {
                  break;
                }
                throw false;
            case 'radio':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'radio' === elem.type) {
                  break;
                }
                throw false;
            case 'checkbox':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'checkbox' === elem.type) {
                  break;
                }
                throw false;
            case 'file':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'file' === elem.type) {
                  break;
                }
                throw false;
            case 'password':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'password' === elem.type) {
                  break;
                }
                throw false;
            case 'submit':
                name = elem.nodeName.toLowerCase();
                if ((name === 'input' || name === 'button') &&
                    'submit' === elem.type) {
                  break;
                }
                throw false;
            case 'image':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'image' === elem.type) {
                  break;
                }
                throw false;
            case 'reset':
                name = elem.nodeName.toLowerCase();
                if ((name === 'input' || name === 'button') &&
                    'reset' === elem.type) {
                  break;
                }
                throw false;
            case 'button':
                name = elem.nodeName.toLowerCase();
                if ((name === 'input' && 'button' === elem.type) ||
                    name === 'button') {
                  break;
                }
                throw false;
            case 'input':
                name = elem.nodeName;
                if (/^(?:input|select|textarea|button)$/i.test(name)) {
                  break;
                }
                throw false;
            default:
                throw false;
          }
          result[result.length] = elem;
        } catch (e) {}
        if (!multi && result && result.length) {
          result = result.shift() || null;
          break;
        }
      }
      return result || null;
    }
    /**@ignore*/
    function getElementsBySelector(selector, context, multi, options) {
      var result = [], mark, cc, quotes = [], rep, doc,
          i, len, parts, part, query, o,
          j, q, qlen, regexp,
          beforePart, prevPart, key, k, qLen, qt, regex,
          s = stringify(selector, true);
      if (!s) {
        return null;
      }
      doc = DOM.getOwnerDocument(context) || Pot.currentDocument();
      context || (context = doc);
      if (!selector || !isString(selector)) {
        return multi ? [] : null;
      }
      mark = '';
      do {
        do {
          cc = (Math.random() * 0x7F) >>> 0;
        } while (cc === 0x2C);
        mark += String.fromCharCode(0, cc, 1);
      } while (~s.indexOf(mark));
      /**@ignore*/
      rep = function(m) {
        var markLen = mark + (quotes.length + 1) + mark;
        quotes[quotes.length] = {
          match : m,
          mark  : markLen
        };
        return markLen;
      };
      s = s.replace(PATTERNS.QUOTES, rep);
      parts = s.split(PATTERNS.SPLIT);
      len = parts.length;
      for (i = 0; i < len; i++) {
        part = parts[i];
        o = {
          tag      : '*',
          elements : null,
          relments : null,
          relative : null,
          relFirst : false,
          elemDone : false,
          relmDone : false
        };
        if (options && options.elements) {
          o.elements = normalizeElements(arrayize(options.elements));
          o.elemDone = true;
        }
        part = trim(part);
        if (part) {
          try {
            query = part;
            qlen = quotes.length;
            for (j = 0; j < qlen; j++) {
              q = quotes[j];
              regexp = new RegExp(rescape(q.mark));
              if (regexp.test(query)) {
                query = query.replace(regexp, q.match);
              }
            }
            if (multi && doc.querySelectorAll) {
              o.elements = Pot.Collection.merge(
                o.elements ? arrayize(o.elements) : [],
                arrayize(doc.querySelectorAll(query))
              );
            } else if (!multi && doc.querySelector) {
              o.elements = doc.querySelector(query) || null;
              throw Pot.StopIteration;
            }
          } catch (ex) {
            if (ex == Pot.StopIteration) {
              break;
            }
            do {
              beforePart = part;
              if (o.relFirst) {
                o.relFirst = false;
                o.elemDone = false;
              }
              for (key in PATTERNS.PARSE_ORDER) {
                if (part) {
                  if (key === 'ATTR') {
                    qLen = quotes.length;
                    for (k = 0; k < qLen; k++) {
                      qt = quotes[k];
                      regex = new RegExp(rescape(qt.mark));
                      if (regex.test(part)) {
                        part = part.replace(regex, qt.match);
                        quotes.splice(k, 1);
                      }
                    }
                  }
                  do {
                    prevPart = part;
                    part = searchReplace(
                      o, PATTERNS[key], part, context, multi
                    );
                  } while (prevPart !== part && part && trim(part));
                }
              }
              if (o.relative && !o.relFirst) {
                selectRelative(o, context, multi);
                o.relative = o.relments = null;
                o.relmDone = false;
                o.elemDone = true;
              }
            } while (beforePart !== part && part && trim(part));
          }
        }
        if (multi) {
          result = Pot.Collection.merge(result, arrayize(o.elements));
        } else {
          result = o.elements || null;
          break;
        }
      }
      if (multi) {
        result = normalizeElements(result);
      } else {
        if (isArrayLike(result)) {
          result = result[0] || null;
        } else {
          result = result || null;
        }
      }
      return result;
    }
    return update(function(selector, context, multi) {
      return getElementsBySelector(selector, context, multi);
    }, {
      /**@ignore*/
      find : function(elements, selector, context, multi) {
        var options = {
          elements : elements
        };
        return getElementsBySelector(selector, context, multi, options);
      }
    })
  })(),
  /**
   * A shortcut of getElement() method as multiple mode.
   * Get the elements by simple CSS selector expression.
   * If .querySelectorAll is available then will use it.
   *
   * @example
   *   var elems;
   *   elems = getElement('#foo, .bar, *[@name="baz"]', document, true);
   *   // @results
   *   //   elems = [<div id="foo"/>, <div class="bar"/>, <div name="baz"/>]
   *   elems = getElement('*', getElement('div#foo'), true);
   *   // @results
   *   //   elems = Return all childNodes in <div id="foo">...</div>
   *
   *
   * @see    Pot.DOM.getElement
   *
   * @param  {String}            selector   The simple CSS selector.
   * @param  {Document|Element}  (context)  The target context or element.
   * @return {Array}                        The result elements as an Array.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getElements : function(selector, context) {
    return DOM.getElement(selector, context, true);
  },
  /**
   * Check whether the argument object is Window.
   *
   * @see Pot.isWindow
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isWindow : isWindow,
  /**
   * Check whether the argument object is Document.
   *
   * @see Pot.isDocument
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isDocument : isDocument,
  /**
   * Check whether the argument object is Element.
   *
   * @see Pot.isElement
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isElement : Pot.isElement,
  /**
   * Check whether the argument object like Node.
   *
   * @see Pot.isNodeLike
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isNodeLike : Pot.isNodeLike,
  /**
   * Check whether the argument object is NodeList.
   *
   * @see Pot.isNodeList
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isNodeList : Pot.isNodeList,
  /**
   * Check whether the argument object is XHTML Document.
   *
   * @param  {Document}  doc  The input document object.
   * @return {Boolean}        Whether `doc` is XHTML.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isXHTML : function(doc) {
    try {
      return doc != null && doc.documentElement != null &&
             doc.documentElement.tagName !== 'HTML' &&
             doc.createElement('p').tagName === 'p';
    } catch (e) {}
    return false;
  },
  /**
   * Check whether the argument object is XML Document.
   *
   * @param  {Document}  doc  The input document object.
   * @return {Boolean}        Whether `doc` is XML.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isXML : function(doc) {
    var context = (doc ?
      (doc.ownerDocument || doc.document || doc) : {}).documentElement;
    return context ? context.nodeName !== 'HTML' : false;
  },
  /**
   * Get the tagname of element as lower-case string.
   *
   *
   * @example
   *   var elem = document.getElementsByTagName('*')[15];
   *   if (tagNameOf(elem) === 'div') {
   *     // do something
   *   }
   *
   *
   * @param  {Element}  elem  The target element node.
   * @return {String}         The result of tagname.
   * @type   Function
   * @function
   * @static
   * @public
   */
  tagNameOf : function(elem) {
    return elem ? stringify(elem.tagName).toLowerCase() : '';
  },
  /**
   * Get or set the element's attributes.
   *
   *
   * @param  {Element}        elem  The target element node.
   * @param  {String|Object}  name  Get the attribute if you pass a string.
   *                                Set each attributes if you pass an object.
   * @param  {String|*}             The value to set.
   * @return {*}                    Return the obtained attribute value,
   *                                  or if you set the value then
   *                                  will return the element.
   * @type   Function
   * @function
   * @static
   * @public
   */
  attr : function(elem, name, value) {
    var result, args = arguments;
    each(arrayize(elem), function(el) {
      if (Pot.isElement(el) && name != null) {
        switch (args.length) {
          case 0:
          case 1:
              break;
          case 2:
              if (isObject(name)) {
                result = DOM.setAttr(el, name);
              } else {
                result = DOM.getAttr(el, name);
              }
              break;
          case 3:
          default:
              result = DOM.setAttr(el, name, value);
              break;
        }
      }
    });
    return result;
  },
  /**
   * Get the node value.
   *
   * @param  {Element}   elem  The input node.
   * @return {String|*}        The result value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getValue : function(elem) {
    var result, value;
    if (elem) {
      switch (DOM.tagNameOf(elem)) {
        case 'option':
            value = elem.attributes && elem.attributes.value;
            if (!value || value.specified) {
              result = elem.value;
            } else {
              result = elem.text;
            }
            break;
        case 'select':
        default:
            result = elem.value;
            break;
      }
      if (isString(result)) {
        result = result.replace(/\r/g, '');
      }
    }
    return stringify(result);
  },
  /**
   * Set the value to element.
   *
   * @param  {Element}  elem   The input element.
   * @param  {*}        value  The value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setValue : function(elem, value) {
    var val;
    if (Pot.isElement(elem)) {
      elem.value = stringify(value, false);
    }
    return elem;
  },
  /**
   * Get the HTML string from element.
   *
   * @param  {Element}  elem  The target element.
   * @return {String}         The result HTML string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getHTMLString : function(elem) {
    var result;
    if (Pot.isElement(elem)) {
      try {
        result = elem.innerHTML;
      } catch (e) {}
    }
    return stringify(result);
  },
  /**
   * Set the HTML string to the element.
   *
   * @param  {Element}   elem   The input element.
   * @param  {String|*}  value  The value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setHTMLString : function(elem, value) {
    var html;
    if (Pot.isElement(elem)) {
      html = stringify(value);
      try {
        elem.innerHTML = html;
        if (elem.innerHTML != html) {
          throw html;
        }
      } catch (e) {
        try {
          DOM.removeChilds(elem);
          DOM.appendChilds(elem, value);
        } catch (e) {}
      }
    }
    return elem;
  },
  /**
   * Get the outer HTML string to the element.
   *
   * @param  {Element}   elem   The input element.
   * @return {String}           The value of result.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getOuterHTML : function(elem) {
    var result, doc, div;
    if (Pot.isElement(elem)) {
      if ('outerHTML' in elem) {
        result = elem.outerHTML;
      } else {
        doc = DOM.getOwnerDocument(elem);
        div = doc.createElement('div');
        div.appendChild(elem.cloneNode(true));
        result = div.innerHTML;
      }
    }
    return stringify(result);
  },
  /**
   * Set the outer HTML string to the element.
   *
   * @param  {Element}   elem   The input element.
   * @param  {String|*}  value  The value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setOuterHTML : function(elem, value) {
    var doc, range, done, html;
    if (Pot.isElement(elem)) {
      value = stringify(value);
      if ('outerHTML' in elem) {
        try {
          elem.outerHTML = value;
          done = true;
        } catch (e) {
          done = false;
        }
      }
      if (!done) {
        try {
          doc = DOM.getOwnerDocument(elem);
          range = doc.createRange();
          range.setStartBefore(elem);
          elem.parentNode.replaceChild(
            range.createContextualFragment(value),
            elem
          );
        } catch (e) {}
      }
    }
    return elem;
  },
  /**
   * Get the text content string from element.
   *
   * @param  {Element}  elem  The target element.
   * @return {String}         The result text content string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getTextContent : update(function(elem) {
    var result, me = arguments.callee, buffer;
    if (Pot.isElement(elem)) {
      try {
        if (Pot.Browser.msie &&
            Pot.Complex.compareVersions(Pot.Browser.msie.version, '9', '<') &&
            ('innerText' in elem)
        ) {
          result = Pot.Text.canonicalizeNL(elem.innerText);
        } else {
          buffer = [];
          me.getTextValue(elem, buffer, true);
          result = buffer.join('');
        }
        if (!result) {
          result = stringify(elem.textContent || elem.innerText, true) || '';
        }
        each(me.NORMALIZE_MAPS, function(map) {
          result = result.replace(map.by, map.to);
        });
        if (/\S/.test(result)) {
          result = trim(result);
        }
      } catch (e) {}
    }
    return stringify(result);
  }, {
    /**
     * @type Array
     * @private
     * @ignore
     */
    NORMALIZE_MAPS : [{
      by : /[\u0009\u0020][\xAD][\u0009\u0020]/g,
      to : ' '
    }, {
      by : /[\xAD]/g,
      to : ''
    }, {
      by : /[\u200B]/g,
      to : ''
    }, {
      by : /[\u0009\u0020\u00A0]+/g,
      to : ' '
    }],
    /**
     * @type {Object}
     * @private
     * @ignore
     */
    IGNORE_TAGS : {
      SCRIPT : 1,
      STYLE  : 1,
      HEAD   : 1,
      IFRAME : 1,
      OBJECT : 1
    },
    /**
     * @type {Object}
     * @private
     * @ignore
     */
    PREDEFINED_TAGS : {
      IMG : ' ',
      BR  : '\n'
    },
    getTextValue : function(node, buffer, normalizeSpace) {
      var that = DOM.getTextContent, value, nodeName, child;
      nodeName = Pot.Text.upper(node.nodeName);
      if (!(nodeName in that.IGNORE_TAGS)) {
        if (node.nodeType == DOM.NodeType.TEXT_NODE) {
          value = stringify(node.nodeValue, true);
          if (normalizeSpace) {
            buffer[buffer.length] = value.replace(/\r\n|\r|\n/g, '');
          } else {
            buffer[buffer.length] = value;
          }
        } else if (nodeName in that.PREDEFINED_TAGS) {
          buffer[buffer.length] = that.PREDEFINED_TAGS[nodeName];
        } else {
          child = node.firstChild;
          while (child) {
            that.getTextValue(child, buffer, normalizeSpace);
            child = child.nextSibling;
          }
        }
      }
    }
  }),
  /**
   * Set the Text content string to the element.
   *
   * @param  {Element}   elem   The input element.
   * @param  {String|*}  value  The value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setTextContent : function(elem, value) {
    var text, doc;
    if (Pot.isElement(elem)) {
      try {
        text = stringify(value);
        if ('textContent' in elem) {
          elem.textContent = text;
        } else if (elem.firstChild &&
                  elem.firstChild.nodeType == DOM.NodeType.TEXT_NODE) {
          while (elem.lastChild != elem.firstChild) {
            elem.removeChild(elem.lastChild);
          }
          elem.firstChild.data = text;
        } else {
          DOM.removeChilds(elem);
          doc = DOM.getOwnerDocument(elem);
          elem.appendChild(doc.createTextNode(text));
        }
      } catch (e) {}
    }
    return elem;
  },
  /**
   * Get the selection object.
   *
   * @param  {Document|Window|Element|*}  context  The input context.
   * @return {Selection|*}                         The Selection object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSelectionObject : function(context) {
    var result, sel, target, doc;
    target = context || Pot.currentWindow();
    if (target) {
      if (target.getSelection) {
        sel = target.getSelection();
      } else if (target.rangeCount) {
        sel = target;
      } else {
        doc = DOM.getOwnerDocument(target);
        if (doc) {
          try {
            sel = doc.documentElement.getSelection();
          } catch (e) {
            try {
              sel = doc.defaultView.getSelection();
            } catch (e) {}
          }
        }
      }
      if (sel && sel.rangeCount && !sel.isCollapsed) {
        result = sel;
      }
    }
    return result;
  },
  /**
   * Get the selection contents.
   *
   * @param  {Window|Document|Node|*}  context  The input context.
   * @return {Object}                           The result contents.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSelectionContents : function(context) {
    var result, sel;
    sel = DOM.getSelectionObject(context);
    if (sel) {
      result = sel.getRangeAt(0).cloneContents();
    }
    return result;
  },
  /**
   * Get the selection text.
   *
   * @param  {Window|Document|Node|*}  context  The input context.
   * @return {String}                           The selection text.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSelectionText : function(context) {
    var result = '', sel;
    sel = DOM.getSelectionObject(context);
    if (sel) {
      result = sel.toString();
    }
    return stringify(result);
  },
  /**
   * Get the selection HTML string.
   *
   * @param  {Window|Document|Node|*}  context  The input context.
   * @return {String}                           The selection HTML.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSelectionHTML : function(context) {
    var result = '', sel, node, doc;
    sel = DOM.getSelectionContents(context);
    doc = DOM.getOwnerDocument(sel);
    if (sel && doc) {
      node = doc.createElement('div');
      node.appendChild(sel);
      result = node.innerHTML;
    }
    return stringify(result);
  },
  /**
   * Coerce to any DOM Node from argument value.
   *
   * @param  {Node|*}  node  The input node.
   * @return {Node|*}        The coerced node.
   * @type   Function
   * @function
   * @static
   * @public
   */
  coerceToNode : function(node) {
    var type;
    if (!node) {
      return node;
    }
    type = Pot.typeOf(node);
    switch (type) {
      case 'number':
      case 'boolean':
      case 'string':
          return Pot.currentDocument().createTextNode(node.toString());
      default:
          break;
    }
    return node;
  },
  /**
   * Remove the element(s) from DOM tree.
   *
   * @param  {Element}  elem  The input elemenet(s).
   * @return {Element}        Returns `elem`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  removeElement : function(elem) {
    var node = DOM.coerceToNode(elem);
    if (node) {
      if (isArrayLike(node)) {
        each(node, function(n) {
          try {
            n.parentNode.removeChild(n);
          } catch (e) {}
        });
      } else {
        try {
          node.parentNode.removeChild(node);
        } catch (e) {}
      }
    }
    return node;
  },
  /**
   * Appends all the child nodes on a DOM node.
   *
   * @param  {Node|Element}  parent  The target parent node.
   * @param  {Node|...Node}  (...)   Nodes to append children from.
   * @return {Node}                  Return the last child node appended.
   * @type   Function
   * @function
   * @static
   * @public
   */
  appendChilds : function(parent/*[, ...childs]*/) {
    var result, childs, args = arrayize(arguments, 1),
        i, j, len, child, chs, n, c;
    if (!parent || !parent.appendChild || args.length === 0) {
      return null;
    }
    if (args.length === 1) {
      childs = arrayize(args[0]);
    } else {
      childs = args;
    }
    len = childs.length;
    for (i = 0; i < len; i++) {
      child = DOM.coerceToNode(childs[i]);
      if (child) {
        try {
          result = parent.appendChild(child);
        } catch (e) {
          chs = child.childNodes;
          if (chs && chs.length) {
            n = chs.length;
            for (j = 0; j < n; j++) {
              c = DOM.coerceToNode(chs[j]);
              if (c) {
                result = parent.appendChild(c);
              }
            }
          }
        }
      }
    }
    return result;
  },
  /**
   * Prepends all the child nodes on a DOM node.
   *
   * @param  {Node|Element}  parent  The target parent node.
   * @param  {Node|...Node}  (...)   Nodes to prepend children from.
   * @return {Node}                  Return the last child node prepended.
   * @type   Function
   * @function
   * @static
   * @public
   */
  prependChilds : function(parent/*[, ...childs]*/) {
    var result, childs, args = arrayize(arguments, 1),
        i, j, len, child, chs, n, c;
    if (!parent || !parent.insertBefore || args.length === 0) {
      return null;
    }
    if (args.length === 1) {
      childs = arrayize(args[0]);
    } else {
      childs = args;
    }
    len = childs.length;
    for (i = 0; i < len; i++) {
      child = DOM.coerceToNode(childs[i]);
      if (child) {
        try {
          result = parent.insertBefore(child, parent.firstChild);
        } catch (e) {
          chs = child.childNodes;
          if (chs && chs.length) {
            n = chs.length;
            for (j = 0; j < n; j++) {
              c = DOM.coerceToNode(chs[j]);
              if (c) {
                result = parent.insertBefore(c, parent.firstChild);
              }
            }
          }
        }
      }
    }
    return result;
  },
  /**
   * Removes all the child nodes on a DOM node.
   *
   * @param  {Node|Element}  node  Node to remove children from.
   * @return {Node|Element}        Returns `node`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  removeChilds : function(node) {
    var child;
    while ((child = node.firstChild)) {
      node.removeChild(child);
    }
    return node;
  },
  /**
   * Get the attribute value.
   *
   * @param  {Element}  node  The target element.
   * @param  {String}   name  The attribute name.
   * @return {String|*}       The arrtibute value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getAttr : function(node, name) {
    var result = null, dir, raw;
    if (!node) {
      return result;
    }
    dir = DOM.AttrMaps.dir;
    raw = DOM.AttrMaps.raw;
    switch (name) {
      case 'style':
          result = (node.style != null && node.style.cssText) ||
                    (node.getAttribute && node.getAttribute(name)) || null;
          break;
      case 'class':
          result = node.className;
          break;
      case 'for':
          result = node.htmlFor;
          break;
      default:
          try {
            result = node.getAttribute(name) ||
                (name in dir &&
                  (node[dir[name]] || node.getAttribute(dir[name]))) ||
                (name in raw &&
                  (node[raw[name]] || node.getAttribute(raw[name]))) || null;
          } catch (e) {
            result = null;
          }
          break;
    }
    return result;
  },
  /**
   * Set the attribute value(s).
   *
   * @param  {Element}        node   The target element.
   * @param  {String|Object}  name   The attribute name or
   *                                    key-value object.
   * @param  {String|*}      (value) The attribute value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setAttr : function(node, name, value) {
    var args = arguments, attrs = {}, dir, raw;
    if (!node) {
      return false;
    }
    if (args.length >= 3) {
      attrs[name] = value;
    } else {
      attrs = name;
    }
    if (!isObject(attrs)) {
      if (isString(name)) {
        attrs[name] = '';
      } else {
        return false;
      }
    }
    dir = DOM.AttrMaps.dir;
    raw = DOM.AttrMaps.raw;
    each(attrs, function(val, key) {
      try {
        if (key == 'style') {
          if (isObject(val)) {
            each(val, function(v, k) {
              Pot.Style.setStyle(node, k, v);
            });
          } else {
            node.style.cssText = val;
          }
        } else if (key == 'class') {
          node.className = val;
        } else if (key == 'for') {
          node.htmlFor = val;
        } else if (key in dir || key in raw) {
          if (key in dir) {
            node.setAttribute(dir[key], val);
            if (!node.hasAttribute(dir[key])) {
              node.setAttribute(key, val);
            }
          } else {
            node.setAttribute(raw[key], val);
            if (!node.hasAttribute(raw[key])) {
              node.setAttribute(key, val);
            }
          }
        } else {
          node[key] = val;
          if (node[key] != val) {
            node.setAttribute(key, val);
          }
        }
      } catch (e) {}
    });
    return true;
  },
  /**
   * Check whether the attribute is exist.
   *
   * @param  {Element}  node  The target element.
   * @param  {String}   name  The attribute name.
   * @return {Boolean}        Whether the attribute is exist.
   * @type   Function
   * @function
   * @static
   * @public
   */
  hasAttr : function(node, name) {
    var result = false, dir, raw;
    if (!node) {
      return result;
    }
    dir = DOM.AttrMaps.dir;
    raw = DOM.AttrMaps.raw;
    if (node.hasAttribute) {
      try {
        result = node.hasAttribute(name) ||
          (name in dir && node.hasAttribute(dir[name])) ||
          (name in raw && node.hasAttribute(raw[name]));
      } catch (e) {
        result = false;
      }
    } else {
      try {
        result = node.getAttribute(name) != null ||
          (name in dir && node.getAttribute(dir[name]) != null) ||
          (name in raw && node.getAttribute(raw[name]) != null);
      } catch (e) {
        result = false;
      }
    }
    return result;
  },
  /**
   * Remove the attribute.
   *
   * @param  {Element}  node  The target element.
   * @param  {String}   name  The attribute name.
   * @type   Function
   * @function
   * @static
   * @public
   */
  removeAttr : function(node, name) {
    var elem, removals, dir, raw;
    if (!node) {
      return false;
    }
    dir = DOM.AttrMaps.dir;
    raw = DOM.AttrMaps.raw;
    elem = node.ownerElement || node;
    removals = [
      name && name in dir && dir[name],
      name && name in raw && raw[name],
      name || node.name || node
    ];
    each(removals, function(removal) {
      try {
        elem.removeAttribute(removal);
        if (elem.hasAttribute(removal)) {
          throw elem;
        }
      } catch (e) {
        try {
          elem.removeAttributeNode(removal);
        } catch (e) {}
        try {
          elem.removeAttributeNode(elem.getAttributeNode());
        } catch (e) {}
      }
    });
  },
  /**
   * Add the class name to the element.
   *
   * @param  {Element}  elem  The target element.
   * @param  {String}   name  The class name.
   * @return {Element}        Returns `elem`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  addClass : function(elem, name) {
    var names, value, sp;
    if (Pot.isElement(elem) && name && isString(name)) {
      names = Pot.Text.splitBySpace(name);
      if (!elem.className && names.length === 1) {
        elem.className = names.join(sp);
      } else {
        value = Pot.Text.wrap(elem.className, sp);
        each(names, function(n) {
          if (n && !~value.indexOf(Pot.Text.wrap(n, sp))) {
            value += n + sp;
          }
        });
        elem.className = trim(Pot.Text.normalizeSpace(value));
      }
    }
    return elem;
  },
  /**
   * Remove the class name from the element.
   *
   * @param  {Element}  elem  The target element.
   * @param  {String}   name  The class name to remove.
   * @return                  Returns `elem`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  removeClass : function(elem, name) {
    var names, value, sp;
    if (Pot.isElement(elem) && elem.className) {
      if (name === undefined) {
        elem.className = '';
      } else if (name && isString(name)) {
        sp = ' ';
        names = Pot.Text.splitBySpace(name);
        value = Pot.Text.wrap(
          Pot.Text.splitBySpace(elem.className).join(sp), sp);
        each(names, function(n) {
          if (n) {
            value = value.split(Pot.Text.wrap(n, sp)).join(sp);
          }
        });
        elem.className = trim(Pot.Text.normalizeSpace(value));
      }
    }
    return elem;
  },
  /**
   * Check whether the class name is exist.
   *
   * @param  {Element}  elem  The target element.
   * @param  {String}   name  The class name.
   * @return {Boolean}        Whether the class name is exist.
   * @type   Function
   * @function
   * @static
   * @public
   */
  hasClass : function(elem, name) {
    var result = false, sp = ' ', subject;
    if (Pot.isElement(elem) && elem.className && name) {
      subject = Pot.Text.wrap(name, sp);
      if (~(Pot.Text.wrap(
            Pot.Text.normalizeSpace(elem.className),
              sp).indexOf(subject)
           )
      ) {
        result = true;
      }
    }
    return result;
  },
  /**
   * Toggle the specified class name.
   *
   * @param  {Element}  elem  The target element.
   * @param  {String}   name  The class name to toggle.
   * @return {Element}        Returns `elem`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  toggleClass : function(elem, name) {
    if (Pot.isElement(elem) && elem.className && name) {
      if (DOM.hasClass(elem, name)) {
        DOM.removeClass(elem, name);
      } else {
        DOM.addClass(elem, name);
      }
    }
    return elem;
  },
  /**
   * Creates an XML document object.
   *
   * @param  {String}   (rootTagName)  (Optional) The root tag name.
   * @param  {String}   (namespaceURI) (Optional) Namespace URI of
   *                                     the document element.
   * @return {Document}                Return the new document.
   * @type   Function
   * @function
   * @static
   * @public
   */
  createDocument : function(rootTagName, namespaceURI) {
    var doc, context, tag, uri;
    tag = stringify(rootTagName);
    uri = stringify(namespaceURI);
    if (uri && !tag) {
      tag = buildSerial(DOM, '');
    }
    context = Pot.currentDocument();
    if (context.implementation &&
        context.implementation.createHTMLDocument) {
      doc = context.implementation.createHTMLDocument('');
    } else if (context.implementation &&
              context.implementation.createDocument) {
      doc = context.implementation.createDocument(uri, tag, null);
    } else if (Pot.System.hasActiveXObject) {
      doc = DOM.createMSXMLDocument();
      if (doc && tag) {
        doc.appendChild(doc.createNode(
          DOM.NodeType.ELEMENT_NODE, tag, uri));
      }
    }
    return doc;
  },
  /**
   * Serialize an element object or subtree to string.
   *
   * @param  {Document|Element}  doc   The document or the root node of
   *                                     the subtree.
   * @return {String}                  The serialized XML/HTML string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  serializeToString : function(doc) {
    var result = '';
    if (doc) {
      if (typeof XMLSerializer !== 'undefined') {
        result = new XMLSerializer().serializeToString(doc);
      } else {
        result = doc.xml || doc.responseXML || doc.outerHTML ||
          (doc.documentElement &&
            (doc.documentElement.xml || doc.documentElement.outerHTML)) ||
          (doc.body &&
            (doc.body.xml || doc.body.outerHTML)) ||
          doc.innerHTML ||
            (doc.documentElement && doc.documentElement.innerHTML) ||
            (doc.body && doc.body.innerHTML) || '';
      }
    }
    return result;
  },
  /**
   * Parse the HTML/XML string and convert to the document object.
   *
   * @param  {String}   string    The target text.
   * @return {Document}           XML/HTML document from the text.
   * @type   Function
   * @function
   * @static
   * @public
   */
  parseFromString : function(string) {
    var doc;
    if (typeof DOMParser !== 'undefined') {
      doc = new DOMParser().parseFromString(string, 'application/xml');
    } else if (Pot.System.hasActiveXObject) {
      doc = DOM.createMSXMLDocument();
      doc.loadXML(string);
    }
    return doc;
  },
  /**
   * Evaluate the XPath expression and select the result node.
   *
   * @param  {String}            exp      The XPath expression.
   * @param  {Document|Element} (context) The conetxt object. e.g. document.
   * @param  {Boolean}          (all)     Whether to make multiple selections.
   * @param  {Boolean}          (asis)    Whether to return the results as is.
   * @return {Array|Element}              Return the selected node(s).
   * @type   Function
   * @function
   * @static
   * @public
   */
  evaluate : update(function(exp, context, all, asis) {
    var doc, expr, xresult = null, result, i, len,
        me = arguments.callee,
        item, evaluator, defaultPrefix;
    context || (context = Pot.currentDocument());
    expr = stringify(exp);
    doc = DOM.getOwnerDocument(context);
    if (Pot.System.hasActiveXObject) {
      // Use JavaScript-XPath library in IE.
      // http://coderepos.org/share/wiki/JavaScript-XPath
      if (!doc.evaluate && Pot.currentDocument().evaluate) {
        doc.evaluate = Pot.currentDocument().evaluate;
      }
      if (!doc.evaluate) {
        //TODO: To be able to get the actual node by MSXML XPath.
        try {
          doc = DOM.createMSXMLDocument();
          doc.loadXML(DOM.serializeToString(context));
          doc.setProperty('SelectionLanguage', 'XPath');
          xresult = (doc.documentElement || doc).selectNodes(expr) || [];
          if (!all) {
            return asis ? xresult[0] : me.suitablize(xresult[0]);
          }
          result = [];
          len = xresult.length;
          for (i = 0; i < len; i++) {
            result[result.length] = asis ? xresult[i] :
              me.suitablize(xresult[i]);
          }
          return result;
        } catch (e) {
          return null;
        }
      }
    }
    defaultPrefix = null;
    if (DOM.isXHTML(doc)) {
      defaultPrefix = '__default__';
      expr = me.addDefaultPrefix(expr, defaultPrefix);
    }
    try {
      /**@ignore*/
      evaluator = function(type) {
        /**@ignore*/
        var resolver = function(prefix) {
          return context.lookupNamespaceURI(
            (prefix === defaultPrefix) ? null : prefix
          ) || doc.documentElement && doc.documentElement.namespaceURI || '';
        };
        return doc.evaluate(expr, context, resolver, type, null);
      };
      xresult = evaluator(DOM.XPathResult.ANY_TYPE);
    } catch (e) {
      /**@ignore*/
      evaluator = function(type) {
        try {
          return expr.evaluate(context, type, null);
        } catch (ex) {
          return expr.evaluate(doc, type, null);
        }
      };
      try {
        expr = doc.createExpression(expr, function(prefix) {
          try {
            return doc.createNSResolver(
              context.documentElement ||
              context).lookupNamespaceURI(prefix) ||
              context.namespaceURI || doc.documentElement.namespaceURI || '';
          } catch (er) {
            return false;
          }
        });
        if (!expr || !expr.evaluate) {
          throw expr;
        }
      } catch (e) {
        expr = doc.createExpression(expr, {
          /**@ignore*/
          lookupNamespaceURI : function(prefix) {
            switch (String(prefix).toLowerCase()) {
              case 'xul'   : return XUL_NS_URI;
              case 'html'  : return HTML_NS_URI;
              case 'xhtml' : return XHTML_NS_URI;
              default      : return '';
            }
          }
        });
      }
    }
    if (xresult === null) {
      xresult = evaluator(DOM.XPathResult.ANY_TYPE);
    }
    switch (xresult.resultType) {
      case DOM.XPathResult.NUMBER_TYPE:
          result = xresult.numberValue;
          break;
      case DOM.XPathResult.STRING_TYPE:
          result = xresult.stringValue;
          break;
      case DOM.XPathResult.BOOLEAN_TYPE:
          result = xresult.booleanValue;
          break;
      case DOM.XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
          if (!all) {
            item = xresult.iterateNext();
            result = asis ? item : me.suitablize(item);
            break;
          }
          xresult = evaluator(DOM.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
          result = [];
          len = xresult.snapshotLength;
          for (i = 0; i < len; i++) {
            item = xresult.snapshotItem(i);
            result[result.length] = asis ? item : me.suitablize(item);
          }
          break;
      default:
          result = null;
          break;
    }
    return result;
  }, {
    /**@ignore*/
    suitablize : function(node) {
      if (node) {
        switch (node.nodeType) {
          case DOM.NodeType.ELEMENT_NODE:
              return node;
          case DOM.NodeType.ATTRIBUTE_NODE:
          case DOM.NodeType.TEXT_NODE:
              return node.textContent || node.innerText || node.value || node;
          default:
              return node;
        }
      }
    },
    /**
     * Add prefix to name-test that has not prefix in XPath expression.
     *
     * e.g.    '//body[@class = "foo"]/p'
     *      -> '//prefix:body[@class = "foo"]/prefix:p'
     *
     * via:
     *   http://gist.github.com/184276
     *   http://nanto.asablo.jp/blog/2008/12/11/4003371
     *
     * @private
     * @ignore
     */
    addDefaultPrefix : function(xpath, prefix) {
      var tokenPattern, tokenType, replacer,
          TERM = 1, OPERATOR = 2, MODIFIER = 3;
      tokenPattern = new RegExp(
            '(' + '[A-Za-z_\\u00C0-\\uFFFD][-.\\w\\u00B7-\\uFFFD]*' +
            '|' + '[*]' +
            ')' +                            // 1 identifier
            '\\s*' +
            '(::?|[(])?' +                   // 2 suffix
        '|' +
                '(' + '".*?"' +              // 3 term
                '|' + "'.*?'" +
                '|' + '\\d+(?:[.]\\d*)?' +
                '|' + '[.](?:[.]|\\d+)?' +
                '|' + '[)\\]]' +
                ')' +
            '|' +
                '(' + '//?' +                // 4 operator
                '|' + '!=' +
                '|' + '[<>]=?' +
                '|' + '[([|,=+-]' +
                ')' +
            '|' +
                '([@$])',                    // 5 modifier
      'g');
      tokenType = OPERATOR;
      prefix += ':';
      /**@ignore*/
      replacer = function(token, identifier, suffix,
                          term, operator, modifier) {
        if (suffix) {
          tokenType =
            (suffix === ':' ||
            (suffix === '::' && (identifier === 'attribute' ||
                                 identifier === 'namespace'))) ?
            MODIFIER : OPERATOR;
        } else if (identifier) {
          if (tokenType === OPERATOR && identifier !== '*') {
            token = prefix + token;
          }
          tokenType = (tokenType === TERM) ? OPERATOR : TERM;
        } else {
          tokenType = term ? TERM : operator ? OPERATOR : MODIFIER;
        }
        return token;
      };
      return xpath.replace(tokenPattern, replacer);
    }
  }),
  /**
   * Convert HTML string to HTML Document object.
   *
   * @param  {String}  htmlString   A subject HTML string.
   * @param  {Object}  (context)    (Optional) A context object.
   *                                  e.g. document.
   * @return {Object}               Return the HTML Document object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  convertToHTMLDocument : update(function(htmlString, context) {
    var me = arguments.callee, doc, html, patterns, xsl, xsltp, range;
    patterns = {
      remove : [
        /<\s*!\s*DOCTYPE[^>]*>/gi,
        /<\s*html\b[^>]*>/gi,
        /<\s*\/\s*html\s*>[\s\S]*/gi
      ]
    };
    html = stringify(htmlString);
    each(patterns.remove, function(re) {
      html = html.replace(re, '');
    });
    xsl = Pot.DOM.parseFromString(
      '<' + '?xml version="1.0"?' + '>' +
      '<stylesheet version="1.0" xmlns="' + XSL_NS_URI + '">' +
        '<output method="html" />' +
      '</stylesheet>'
    );
    if (Pot.System.hasActiveXObject) {
      doc = new ActiveXObject('htmlfile');
      doc.open();
      doc.write(html);
      doc.close();
    } else {
      try {
        doc = context || Pot.currentDocument();
        xsltp = new XSLTProcessor();
        xsltp.importStylesheet(xsl);
        doc = xsltp.transformToDocument(
          doc.implementation.createDocument('', '', null)
        );
        doc.appendChild(doc.createElement('html'));
        range = doc.createRange();
        range.selectNodeContents(doc.documentElement);
        doc.documentElement.appendChild(range.createContextualFragment(html));
      } catch (e) {
        try {
          doc = me.createHTMLDocumentFromString(html);
        } catch (e) {}
      }
    }
    return doc;
  }, {
    /**
     * A helper function for convertToHTMLDocument.
     *
     * from: Taberareloo lib.
     * original: http://gist.github.com/198443
     *
     * @private
     * @ignore
     */
    createHTMLDocumentFromString : function(srcString) {
      var doc, context, range, fragment, headElements, child, head, body;
      context = Pot.currentDocument();
      doc = DOM.createDocument('html');
      range = context.createRange();
      range.selectNodeContents(doc.documentElement);
      fragment = range.createContextualFragment(srcString);
      headElements = {
        title   : true,
        meta    : true,
        link    : true,
        script  : true,
        style   : true,
        object  : false,
        base    : true,
        isindex : false
      };
      try {
        head = doc.getElementsByTagName('head')[0];
        if (!head) {
          throw head;
        }
      } catch (e) {
        head = doc.createElement('head');
      }
      try {
        body = doc.getElementsByTagName('body')[0];
        if (!body) {
          throw body;
        }
      } catch (e) {
        body = doc.createElement('body');
      }
      HEADING: {
        while ((child = fragment.firstChild)) {
          switch (child.nodeType) {
            case DOM.NodeType.ELEMENT_NODE:
                if (!headElements[Pot.Text.lower(child.nodeName)]) {
                  break HEADING;
                }
                break;
            case DOM.NodeType.TEXT_NODE:
                if (/\S/.test(child.nodeValue)) {
                  break HEADING;
                }
                break;
            default:
                break;
          }
          head.appendChild(child);
        }
      }
      body.appendChild(fragment);
      doc.documentElement.appendChild(head);
      doc.documentElement.appendChild(body);
      return doc;
    }
  }),
  /**
   * Convert to a HTML string from DOM document object.
   *
   * from: Taberareloo lib.
   * via: http://nanto.asablo.jp/blog/2010/02/05/4858761
   *
   * @param  {Document|Node}  context  The input context.
   * @param  {Boolean}        (safe)   Whether sanitize the HTML nodes,
   *                                     for safely.
   * @return {String}                  The result HTML string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  convertToHTMLString : update(function(context, safe) {
    var result, me = arguments.callee, node, doc, root,
        range, uniqid, fragment, re, tag;
    if (!context || (context.getRangeAt && context.isCollapsed)) {
      return '';
    }
    doc = isDocument(context) ? context : Pot.currentDocument();
    tag = buildSerial(DOM, 'tag');
    uniqid = buildSerial(DOM, 'uid');
    re = new RegExp('</?(?:' + uniqid + '|' + tag + ')\\b[^>]*>', 'gi');
    if (context.getRangeAt) {
      range = context.getRangeAt(0);
      node = range.cloneContents();
      root = range.commonAncestorContainer.cloneNode(false);
    } else {
      range = null;
      node = context.cloneNode(true);
      if (!node) {
        node = context.documentElement &&
              context.documentElement.cloneNode(true) ||
              context.body && context.body.cloneNode(true);
      }
      root = null;
    }
    if (!root || root.nodeType != DOM.NodeType.ELEMENT_NODE) {
      try {
        root = node.ownerDocument.createElement(tag);
      } catch (e) {
        root = doc.createElement(tag);
      }
    }
    DOM.appendChilds(root, node);
    if (safe) {
      try {
        each([{
          elems : DOM.evaluate(
            'descendant::*[contains(",' +
            me.UNSAFE_ELEMENTS +
            ',",concat(",",local-name(.),","))]',
            root, true
          ),
          method : DOM.removeElement
        }, {
          elems : DOM.evaluate(
            'descendant::*/@*[not(contains(",' +
            me.SAFE_ATTRIBUTES +
            ',",concat(",",local-name(.),",")))]',
            root, true, true
          ),
          method : DOM.removeAttr
        }, {
          elems : DOM.evaluate(
            'descendant-or-self::a',
            root, true
          ),
          method : me.resetter.href
        }, {
          elems : DOM.evaluate(
            'descendant-or-self::*' +
            '[contains(" img embed ",concat(" ",local-name(.)," "))]',
            root, true
          ),
          method : me.resetter.src
        }, {
          elems : DOM.evaluate(
            'descendant-or-self::object',
            root, true
          ),
          method : me.resetter.data
        }], function(item) {
          each(item.elems || [], item.method);
        });
      } catch (e) {
        if (typeof toStaticHTML !== 'undefined') {
          try {
            root.innerHTML = toStaticHTML(root.innerHTML);
          } catch (e) {}
        }
      }
    }
    fragment = doc.createDocumentFragment();
    result = fragment.appendChild(doc.createElement(uniqid));
    DOM.appendChilds(result, root);
    return trim(DOM.serializeToString(result)).replace(re, '');
  }, {
    /**@ignore*/
    UNSAFE_ELEMENTS :
      'frame,script,style,frame,iframe',
    /**@ignore*/
    SAFE_ATTRIBUTES :
      'action,cellpadding,cellspacing,checked,cite,clear,' +
      'cols,colspan,content,coords,enctype,face,for,href,' +
      'label,method,name,nohref,nowrap,rel,rows,rowspan,'  +
      'shape,span,src,style,title,target,type,usemap,value',
    // resolve relative path
    /**@ignore*/
    resetter : (function(o) {
      each(['href', 'data', 'src'], function(attr) {
        /**@ignore*/
        o[attr] = function(elem) {
          if (elem && DOM.hasAttr(elem, attr)) {
            elem[attr] = elem[attr];
          }
        };
      });
      return o;
    })({})
  }),
  /**
   * Get the MSXML Document object.
   *
   * @private
   * @ignore
   */
  createMSXMLDocument : function(count) {
    var result;
    if (Pot.System.hasActiveXObject) {
      each([
        'Msxml2.DOMDocument.3.0',
        'Msxml2.DOMDocument.6.0',
        'Microsoft.XMLDOM.1.0',
        'Microsoft.XMLDOM',
        'Msxml2.DOMDocument.5.0',
        'Msxml2.DOMDocument.4.0',
        'MSXML2.DOMDocument',
        'MSXML.DOMDocument'
      ], function(prog) {
        try {
          result = new ActiveXObject(prog);
        } catch (e) {}
        if (result) {
          if (count == null || count-- <= 0) {
            throw Pot.StopIteration;
          }
        }
      });
      if (result) {
        result.async = false;
        // Prevent potential vulnerabilities exposed by MSXML2, see
        // http://b/1707300 and http://wiki/Main/ISETeamXMLAttacks for details.
        result.resolveExternals = false;
        result.validateOnParse = false;
        try {
          // IE6 or IE7 that are on XP SP2 or earlier without MSXML updates.
          // See http://msdn.microsoft.com/en-us/library/ms766391(VS.85).aspx
          result.setProperty('ProhibitDTD', true);
          result.setProperty('MaxXMLSize', 2 * 1024);
          result.setProperty('MaxElementDepth', 256);
        } catch (e) {}
      }
    }
    return result;
  }
});
})(Pot.DOM,
   Pot.isWindow, Pot.isDocument, Pot.isString,
   Pot.isObject, Pot.isArray, Pot.isArrayLike);

// Update Pot object.
Pot.update({
  detectWindow          : Pot.DOM.detectWindow,
  detectDocument        : Pot.DOM.detectDocument,
  getOwnerDocument      : Pot.DOM.getOwnerDocument,
  getElement            : Pot.DOM.getElement,
  getElements           : Pot.DOM.getElements,
  isXHTML               : Pot.DOM.isXHTML,
  isXML                 : Pot.DOM.isXML,
  tagNameOf             : Pot.DOM.tagNameOf,
  getNodeValue          : Pot.DOM.getValue,
  setNodeValue          : Pot.DOM.setValue,
  getHTMLString         : Pot.DOM.getHTMLString,
  setHTMLString         : Pot.DOM.setHTMLString,
  getOuterHTML          : Pot.DOM.getOuterHTML,
  setOuterHTML          : Pot.DOM.setOuterHTML,
  getTextContent        : Pot.DOM.getTextContent,
  setTextContent        : Pot.DOM.setTextContent,
  getSelectionObject    : Pot.DOM.getSelectionObject,
  getSelectionContents  : Pot.DOM.getSelectionContents,
  getSelectionText      : Pot.DOM.getSelectionText,
  getSelectionHTML      : Pot.DOM.getSelectionHTML,
  coerceToNode          : Pot.DOM.coerceToNode,
  removeElement         : Pot.DOM.removeElement,
  appendChilds          : Pot.DOM.appendChilds,
  prependChilds         : Pot.DOM.prependChilds,
  removeChilds          : Pot.DOM.removeChilds,
  getAttr               : Pot.DOM.getAttr,
  setAttr               : Pot.DOM.setAttr,
  hasAttr               : Pot.DOM.hasAttr,
  removeAttr            : Pot.DOM.removeAttr,
  addClass              : Pot.DOM.addClass,
  removeClass           : Pot.DOM.removeClass,
  hasClass              : Pot.DOM.hasClass,
  toggleClass           : Pot.DOM.toggleClass,
  serializeToXMLString  : Pot.DOM.serializeToString,
  parseFromXMLString    : Pot.DOM.parseFromString,
  evaluate              : Pot.DOM.evaluate,
  attr                  : Pot.DOM.attr,
  convertToHTMLDocument : Pot.DOM.convertToHTMLDocument,
  convertToHTMLString   : Pot.DOM.convertToHTMLString
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Style.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * CSS utilities.
   *
   * @name  Pot.Style
   * @type  Object
   * @class
   * @static
   * @public
   */
  Style : {}
});

update(Pot.Style, {
  /**
   * @lends Pot.Style
   */
  /**
   * @const
   * @ignore
   */
  NAME : 'Style',
  /**
   * Return the string representation of object.
   *
   * @return {String}  The string representation of object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  toString : Pot.toString,
  /**
   * Exclude the following css properties to add px
   *
   * @private
   * @ignore
   */
  NumberTypes : {
    fillOpacity : true,
    fontWeight  : true,
    lineHeight  : true,
    opacity     : true,
    orphans     : true,
    widows      : true,
    zIndex      : true,
    zoom        : true
  },
  /**
   * Normalize float css property.
   * Add in properties whose names you wish to fix before
   *   setting or getting the value.
   *
   * @private
   * @ignore
   */
  PropMaps : (function() {
    var maps = {}, p;
    maps.dir = {
      'float' : Pot.Browser.msie ? 'styleFloat' : 'cssFloat'
    };
    maps.raw = {};
    for (p in maps.dir) {
      maps.raw[maps.dir[p]] = p;
    }
    maps.ref = {
      /**@ignore*/
      whiteSpace : function(elem, key, val) {
        if (/pre-?wrap/i.test(val)) {
          return {
            /**@ignore*/
            get : function() {
              return Pot.Style.getStyle(elem, key);
            },
            /**@ignore*/
            set : function() {
              return Pot.Style.setPreWrap(elem);
            }
          };
        } else {
          return {
            /**@ignore*/
            get : function() {
              return Pot.Style.getStyle(elem, key);
            },
            /**@ignore*/
            set : function() {
              return Pot.Style.setStyle(elem, key, val);
            }
          };
        }
      },
      /**@ignore*/
      opacity : function(elem, key, val) {
        return {
          /**@ignore*/
          get : function() {
            return Pot.Style.getOpacity(elem, key);
          },
          /**@ignore*/
          set : function() {
            return Pot.Style.setOpacity(elem, val);
          }
        }
      }
    };
    return maps;
  })(),
  /**
   * Get or set the element's style.
   *
   *
   * @param  {Element}        elem  The target element node.
   * @param  {String|Object}  name  Get the style if you pass a string.
   *                                Set each styles if you pass an object.
   * @param  {String|*}             The value to set.
   * @return {*}                    Return the obtained style value,
   *                                  or if you set the value then
   *                                  will return the element.
   * @type   Function
   * @function
   * @static
   * @public
   */
  css : function(elem, name, value) {
    var result, args = arguments;
    each(arrayize(elem), function(el) {
      if (Pot.isElement(el) && name != null) {
        switch (args.length) {
          case 0:
          case 1:
              break;
          case 2:
              if (Pot.isObject(name)) {
                result = Pot.Style.setStyle(el, name);
              } else {
                result = Pot.Style.getStyle(el, name);
              }
              break;
          case 3:
          default:
              result = Pot.Style.setStyle(el, name, value);
              break;
        }
      }
    });
    return result;
  },
  /**
   * Get the computed style value of a node.
   *
   * @param  {Element}  elem   Element to get style of.
   * @param  {String}   prop   Property to get (camel-case).
   * @return {String}          Style value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getComputedStyle : function(elem, prop) {
    var result = '', doc, styles;
    doc = Pot.DOM.getOwnerDocument(elem);
    if (doc.defaultView && doc.defaultView.getComputedStyle) {
      styles = doc.defaultView.getComputedStyle(elem, null);
      if (styles) {
        result = styles[prop] || styles.getPropertyValue(prop) || '';
      }
    }
    return result;
  },
  /**
   * Gets the cascaded style value of a node, or null.
   *
   * @param  {Element}  elem   Element to get style of.
   * @param  {String}   style  Property to get (camel-case).
   * @return {String}          Style value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getCascadedStyle : function(elem, style) {
    return (elem && elem.currentStyle) ?
      (elem.currentStyle[style] || '') : '';
  },
  /**
   * Get the style value.
   *
   * @param  {Element}  elem       Element to get style of.
   * @param  {String}   styleName  Property to get.
   * @return {String}              Style value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getStyle : update(function(elem, styleName) {
    var result = '', me = arguments.callee, style, camel, dir, raw, ref;
    dir = Pot.Style.PropMaps.dir;
    raw = Pot.Style.PropMaps.raw;
    ref = Pot.Style.PropMaps.ref;
    if (elem) {
      style = stringify(styleName);
      camel = Pot.Text.camelize(style);
      if (camel in ref) {
        result = ref[camel](elem, style).get();
      } else {
        result = me.find(elem, style) ||
          (style in dir && me.find(elem, dir[style])) ||
          (style in raw && me.find(elem, raw[style])) || '';
      }
    }
    return result;
  }, {
    /**@ignore*/
    find : function(elem, style) {
      var c, camel;
      c = (~style.indexOf('-'));
      camel = c ? Pot.Text.camelize(style) : style;
      return Pot.Style.getComputedStyle(elem, style)  || (c &&
             Pot.Style.getComputedStyle(elem, camel)) ||
             Pot.Style.getCascadedStyle(elem, style)  || (c &&
             Pot.Style.getCascadedStyle(elem, camel)) ||
             elem.style[camel] || '';
    }
  }),
  /**
   * Set the style value.
   *
   * @param  {Element}         elem    Element to set style of.
   * @param  {String|Object}   name    Style name string or
   *                                     key-value object.
   * @param  {String|*}       (value)  Style value.
   * @return {Boolean}                 Success or failure.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setStyle : function(elem, name, value) {
    var result = false, args = arguments, styles = {}, dir, ref;
    switch (args.length) {
      case 0:
      case 1:
          return false;
      case 2:
          if (Pot.isObject(name)) {
            styles = name;
          } else {
            return false;
          }
          break;
      default:
          styles[stringify(name)] = value;
          break;
    }
    if (Pot.isElement(elem)) {
      dir = Pot.Style.PropMaps.dir;
      ref = Pot.Style.PropMaps.ref;
      each.quick(styles, function(v, k) {
        var key = stringify(k), val = v;
        if (~key.indexOf('-')) {
          key = Pot.Text.camelize(key);
        }
        if (key in dir) {
          key = dir[key];
        }
        if ((Pot.isNumber(val) || !/[^\d.]/.test(val)) &&
            !(key in Pot.Style.NumberTypes)) {
          val = Pot.Style.pxize(val);
        }
        if (key in ref) {
          try {
            ref[key](elem, key, val).set();
            result = true;
            return;
          } catch (e) {}
        }
        try {
          elem.style[key] = val;
          result = true;
        } catch (e) {}
      });
    }
    return result;
  },
  /**
   * Gets the opacity of a node.
   *
   * @param  {Element}        el     Element whose opacity has to be found.
   * @return {Number|String}         Opacity between 0 and 1 or
   *                                   an empty string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getOpacity : function(el) {
    var result, style, match, re;
    if (el) {
      style = el.style;
      if ('opacity' in style) {
        result = style.opacity - 0;
      } else if ('MozOpacity' in style) {
        result = style.MozOpacity - 0;
      } else if ('filter' in style) {
        re = /alpha\s*[(]\s*opacity\s*=\s*([\d.]+)\s*[)]/i;
        match = stringify(style.filter).match(re);
        if (match) {
          result = String(match[1] / 100) - 0;
        }
      }
    }
    return result;
  },
  /**
   * Sets the opacity of a node.
   *
   * @param  {Element}         el      Elements whose opacity has to be set.
   * @param  {Number|String}  alpha    Opacity between 0 and 1 or
   *                                     an empty string to clear the opacity.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setOpacity : function(el, alpha) {
    var style;
    if (el) {
      style = el.style;
      if ('opacity' in style) {
        style.opacity = alpha;
      } else if ('MozOpacity' in style) {
        style.MozOpacity = alpha;
      } else if ('filter' in style) {
        if (Pot.isNumeric(alpha)) {
          style.filter = 'alpha(opacity=' + (alpha * 100) + ')';
        } else {
          style.filter = '';
        }
      }
    }
  },
  /**
   * Sets 'white-space: pre-wrap' for a node.
   *
   * There are as many ways of specifying pre-wrap as there are browsers.
   * <pre>
   * CSS3/IE8: white-space: pre-wrap;
   * Mozilla:  white-space: -moz-pre-wrap;
   * Opera:    white-space: -o-pre-wrap;
   * IE6/7:    white-space: pre; word-wrap: break-word;
   * </pre>
   *
   * @param  {Element}   el   Element to enable pre-wrap for.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setPreWrap : function(el) {
    var style;
    if (el) {
      style = el.style;
      if (Pot.Browser.msie &&
          Pot.Complex.compareVersions(Pot.Browser.msie.version, '8', '<')
      ) {
        style.whiteSpace = 'pre';
        style.wordWrap   = 'break-word';
      } else if (Pot.Browser.mozilla) {
        style.whiteSpace = '-moz-pre-wrap';
      } else {
        style.whiteSpace = 'pre-wrap';
      }
    }
  },
  /**
   * Check whether the element is shown.
   *
   *
   * @param  {Element}        elem  The target element node.
   * @return {*}                    Return whether the element is shown.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isShown : function(elem) {
    return Pot.isElement(elem) &&
           Pot.Style.getStyle(elem, 'display') != 'none';
  },
  /**
   * Check whether the element is visible.
   *
   *
   * @param  {Element}        elem  The target element node.
   * @return {*}                    Return whether the element is visible.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isVisible : function(elem) {
    return Pot.isElement(elem) &&
           Pot.Style.getStyle(elem, 'visibility') != 'hidden';
  },
  /**
   * Add 'px' suffix to integer value.
   *
   * @param  {String|Number}   value    The numeric value.
   * @param  {Boolean}         round    Whether to round the nearest integer.
   * @return {String}                   The string value for the property.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  pxize : function(value, round) {
    var n = (Pot.isNumeric(value) ? value : numeric(value)) - 0;
    if (round) {
      n = Math.round(n);
    }
    return n + 'px';
  },
  /**
   * Gets the height and width and position of an element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @return {Object}             Object with
   *                                width/height/left/top properties.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSizePos : function(elem) {
    var result, x, y, w, h, org, style;
    //XXX: Implements "Rect", "Box", "Coordinate" constructors.
    result = {
      left   : null,
      top    : null,
      width  : null,
      height : null
    };
    if (!elem || !Pot.isNodeLike(elem)) {
      return result;
    }
    style = elem.style;
    if (!Pot.Style.isShown(elem) ||
        ((elem.offsetParent == null ||
         (elem.offsetWidth  == 0 && elem.offsetHeight == 0)) &&
         Pot.DOM.tagNameOf(elem) !== 'body')
    ) {
      org = {
        display    : style.display,
        visibility : style.visibility,
        position   : style.position
      };
      style.visibility = 'hidden';
      style.position   = 'absolute';
      style.display    = 'inline';
    }
    x = elem.offsetLeft   || style.pixelLeft   || 0;
    y = elem.offsetTop    || style.pixelTop    || 0;
    w = elem.offsetWidth  || style.pixelWidth  || 0;
    h = elem.offsetHeight || style.pixelHeight || 0;
    if (org) {
      style.display    = org.display;
      style.position   = org.position;
      style.visibility = org.visibility;
    }
    result.left   = x - 0;
    result.top    = y - 0;
    result.width  = w - 0;
    result.height = h - 0;
    return result;
  },
  /**
   * Gets the height and width of an element.
   *
   * @param  {Element}   elem    Element to get width of.
   * @param  {Boolean}  (extra)  Whether include margin.
   * @return {Object}            Object with width/height properties.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  getPixelSize : function(elem, extra) {
    var result = {}, maps;
    result.width  = null;
    result.height = null;
    if (Pot.isElement(elem)) {
      maps = {
        Width : {
          Left  : 1,
          Right : 1
        },
        Height : {
          Top    : 1,
          Bottom : 1
        }
      };
      each(maps, function(map, key) {
        var value = elem['offset' + key];
        if (value > 0) {
          each(map, function(n, ax) {
            if (!extra) {
              value -= parseFloat(
                Pot.Style.getStyle(elem, 'padding' + ax)
              ) || 0;
            }
            if (extra) {
              value += parseFloat(
                Pot.Style.getStyle(elem, 'margin' + ax)
              ) || 0;
            } else {
              value -= parseFloat(
                Pot.Style.getStyle(elem, 'border' + ax + 'Width')
              ) || 0;
            }
          });
        } else {
          // Fall back to computed then uncomputed css if necessary
          value = Pot.Style.getStyle(elem, key);
          if (value < 0 || value == null) {
            value = elem.style[key] || 0;
          }
          value = parseFloat(value) || 0;
          if (extra) {
            each(map, function(n, ax) {
              value += parseFloat(
                Pot.Style.getStyle(elem, 'padding' + ax)
              ) || 0;
              value += parseFloat(
                Pot.Style.getStyle(elem, 'margin' + ax)
              ) || 0;
            });
          }
        }
        result[Pot.Text.lower(key)] = Pot.Style.pxize(value);
      });
    }
    return result;
  },
  /**
   * Sets the width and height to the element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @param  {Number}     width   Specify width.
   * @param  {Number}     height  Specify height.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  setSize : function(elem, width, height) {
    var size = {};
    if (Pot.isObject(width)) {
      size = width;
    } else {
      size.width  = width;
      size.height = height;
    }
    Pot.Style.setWidth(elem, size.width);
    Pot.Style.setHeight(elem, size.height);
  },
  /**
   * Gets the width to the element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @return {Number}             Object width.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getWidth : function(elem, extra) {
    var size = Pot.Style.getPixelSize(elem, extra);
    return size.width;
  },
  /**
   * Gets the width to the element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @param  {Number}     height  Specify width.
   * @return {Number}             Object width.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  getHeight : function(elem, extra) {
    var size = Pot.Style.getPixelSize(elem, extra);
    return size.height;
  },
  /**
   * Sets the width to the element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @param  {Number}     width   Specify width.
   * @return {Number}             Object width.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  setWidth : function(elem, width) {
    if (elem) {
      Pot.Style.setStyle(elem, {
        width : width
      });
    }
  },
  /**
   * Sets the height to the element.
   *
   * @param  {Element}    elem    Element to get height of.
   * @param  {Number}     width   Specify height.
   * @return {Number}             Object height.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  setHeight : function(elem, height) {
    if (elem) {
      Pot.Style.setStyle(elem, {
        height : height
      });
    }
  }
});

// Update Pot object.
Pot.update({
  css          : Pot.Style.css,
  getStyle     : Pot.Style.getStyle,
  setStyle     : Pot.Style.setStyle,
  isShown      : Pot.Style.isShown,
  isVisible    : Pot.Style.isVisible,
  pxize        : Pot.Style.pxize,
  getSizePos   : Pot.Style.getSizePos,
  getPixelSize : Pot.Style.getPixelSize,
  setSize      : Pot.Style.setSize,
  getWidth     : Pot.Style.getWidth,
  setWidth     : Pot.Style.setWidth,
  getHeight    : Pot.Style.getHeight,
  setHeight    : Pot.Style.setHeight
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
    Pot                     : Pot,
    update                  : update,
    PATH_DELIMITER          : Pot.PATH_DELIMITER,
    DIR_DELIMITER           : Pot.DIR_DELIMITER,
    isBoolean               : Pot.isBoolean,
    isNumber                : Pot.isNumber,
    isString                : Pot.isString,
    isFunction              : Pot.isFunction,
    isArray                 : Pot.isArray,
    isDate                  : Pot.isDate,
    isRegExp                : Pot.isRegExp,
    isObject                : Pot.isObject,
    isError                 : Pot.isError,
    typeOf                  : Pot.typeOf,
    typeLikeOf              : Pot.typeLikeOf,
    StopIteration           : Pot.StopIteration,
    isStopIter              : Pot.isStopIter,
    isIterable              : Pot.isIterable,
    isArrayLike             : Pot.isArrayLike,
    isPlainObject           : Pot.isPlainObject,
    isEmpty                 : Pot.isEmpty,
    isDeferred              : Pot.isDeferred,
    isIter                  : Pot.isIter,
    isHash                  : Pot.isHash,
    isJSEscaped             : Pot.isJSEscaped,
    isPercentEncoded        : Pot.isPercentEncoded,
    isHTMLEscaped           : Pot.isHTMLEscaped,
    isNumeric               : Pot.isNumeric,
    isInt                   : Pot.isInt,
    isNativeCode            : Pot.isNativeCode,
    isBuiltinMethod         : Pot.isBuiltinMethod,
    isWindow                : Pot.isWindow,
    isDocument              : Pot.isDocument,
    isElement               : Pot.isElement,
    isNodeLike              : Pot.isNodeLike,
    isNodeList              : Pot.isNodeList,
    isDOMLike               : Pot.isDOMLike,
    Deferred                : Pot.Deferred,
    succeed                 : Pot.Deferred.succeed,
    failure                 : Pot.Deferred.failure,
    wait                    : Pot.Deferred.wait,
    callLater               : Pot.Deferred.callLater,
    callLazy                : Pot.Deferred.callLazy,
    maybeDeferred           : Pot.Deferred.maybeDeferred,
    isFired                 : Pot.Deferred.isFired,
    lastResult              : Pot.Deferred.lastResult,
    lastError               : Pot.Deferred.lastError,
    register                : Pot.Deferred.register,
    unregister              : Pot.Deferred.unregister,
    deferrize               : Pot.Deferred.deferrize,
    begin                   : Pot.Deferred.begin,
    flush                   : Pot.Deferred.flush,
    till                    : Pot.Deferred.till,
    parallel                : Pot.Deferred.parallel,
    chain                   : Pot.Deferred.chain,
    forEach                 : Pot.forEach,
    repeat                  : Pot.repeat,
    forEver                 : Pot.forEver,
    iterate                 : Pot.iterate,
    items                   : Pot.items,
    zip                     : Pot.zip,
    Iter                    : Pot.Iter,
    toIter                  : Pot.Iter.toIter,
    map                     : Pot.map,
    filter                  : Pot.filter,
    reduce                  : Pot.reduce,
    every                   : Pot.every,
    some                    : Pot.some,
    range                   : Pot.range,
    indexOf                 : Pot.indexOf,
    lastIndexOf             : Pot.lastIndexOf,
    globalEval              : Pot.globalEval,
    localEval               : Pot.localEval,
    hasReturn               : Pot.hasReturn,
    override                : Pot.override,
    currentWindow           : Pot.currentWindow,
    currentDocument         : Pot.currentDocument,
    currentURI              : Pot.currentURI,
    serializeToJSON         : Pot.Serializer.serializeToJSON,
    parseFromJSON           : Pot.Serializer.parseFromJSON,
    serializeToQueryString  : Pot.Serializer.serializeToQueryString,
    parseFromQueryString    : Pot.Serializer.parseFromQueryString,
    urlEncode               : Pot.URI.urlEncode,
    urlDecode               : Pot.URI.urlDecode,
    parseURI                : Pot.URI.parseURI,
    resolveRelativeURI      : Pot.URI.resolveRelativeURI,
    getExt                  : Pot.URI.getExt,
    toDataURI               : Pot.URI.toDataURI,
    request                 : Pot.Net.request,
    jsonp                   : Pot.Net.requestByJSONP,
    loadScript              : Pot.Net.loadScript,
    hashCode                : Pot.Crypt.hashCode,
    md5                     : Pot.Crypt.md5,
    crc32                   : Pot.Crypt.crc32,
    sha1                    : Pot.Crypt.sha1,
    Arc4                    : Pot.Crypt.Arc4,
    evalInSandbox           : Pot.XPCOM.evalInSandbox,
    throughout              : Pot.XPCOM.throughout,
    getMostRecentWindow     : Pot.XPCOM.getMostRecentWindow,
    getChromeWindow         : Pot.XPCOM.getChromeWindow,
    attach                  : Pot.Signal.attach,
    attachBefore            : Pot.Signal.attachBefore,
    attachAfter             : Pot.Signal.attachAfter,
    attachPropBefore        : Pot.Signal.attachPropBefore,
    attachPropAfter         : Pot.Signal.attachPropAfter,
    detach                  : Pot.Signal.detach,
    detachAll               : Pot.Signal.detachAll,
    signal                  : Pot.Signal.signal,
    Hash                    : Pot.Hash,
    arrayize                : Pot.Collection.arrayize,
    merge                   : Pot.Collection.merge,
    unique                  : Pot.Collection.unique,
    flatten                 : Pot.Collection.flatten,
    alphanumSort            : Pot.Collection.alphanumSort,
    invoke                  : Pot.Struct.invoke,
    clone                   : Pot.Struct.clone,
    bind                    : Pot.Struct.bind,
    partial                 : Pot.Struct.partial,
    keys                    : Pot.Struct.keys,
    values                  : Pot.Struct.values,
    tuple                   : Pot.Struct.tuple,
    unzip                   : Pot.Struct.unzip,
    pairs                   : Pot.Struct.pairs,
    count                   : Pot.Struct.count,
    first                   : Pot.Struct.first,
    firstKey                : Pot.Struct.firstKey,
    last                    : Pot.Struct.last,
    lastKey                 : Pot.Struct.lastKey,
    contains                : Pot.Struct.contains,
    remove                  : Pot.Struct.remove,
    removeAll               : Pot.Struct.removeAll,
    removeAt                : Pot.Struct.removeAt,
    equals                  : Pot.Struct.equals,
    reverse                 : Pot.Struct.reverse,
    flip                    : Pot.Struct.flip,
    shuffle                 : Pot.Struct.shuffle,
    fill                    : Pot.Struct.fill,
    implode                 : Pot.Struct.implode,
    explode                 : Pot.Struct.explode,
    glue                    : Pot.Struct.glue,
    clearObject             : Pot.Struct.clearObject,
    now                     : Pot.DateTime.now,
    time                    : Pot.DateTime.time,
    date                    : Pot.DateTime.format,
    numeric                 : Pot.Complex.numeric,
    rand                    : Pot.Complex.rand,
    limit                   : Pot.Complex.limit,
    convertToBase           : Pot.Complex.convertToBase,
    compareVersions         : Pot.Complex.compareVersions,
    rescape                 : Pot.Sanitizer.rescape,
    escapeRegExp            : Pot.Sanitizer.escapeRegExp,
    escapeHTML              : Pot.Sanitizer.escapeHTML,
    unescapeHTML            : Pot.Sanitizer.unescapeHTML,
    escapeXPathText         : Pot.Sanitizer.escapeXPathText,
    escapeAppleScriptString : Pot.Sanitizer.escapeAppleScriptString,
    escapeString            : Pot.Sanitizer.escapeString,
    unescapeString          : Pot.Sanitizer.unescapeString,
    escapeFileName          : Pot.Sanitizer.escapeFileName,
    escapeSequence          : Pot.Sanitizer.escapeSequence,
    unescapeSequence        : Pot.Sanitizer.unescapeSequence,
    utf8Encode              : Pot.UTF8.encode,
    utf8Decode              : Pot.UTF8.decode,
    utf8ByteOf              : Pot.UTF8.byteOf,
    base64Encode            : Pot.Base64.encode,
    base64Decode            : Pot.Base64.decode,
    alphamericStringEncode  : Pot.Archive.AlphamericString.encode,
    alphamericStringDecode  : Pot.Archive.AlphamericString.decode,
    sprintf                 : Pot.Format.sprintf,
    getExtByMimeType        : Pot.MimeType.getExtByMimeType,
    getMimeTypeByExt        : Pot.MimeType.getMimeTypeByExt,
    stringify               : Pot.Text.stringify,
    chr                     : Pot.Text.chr,
    ord                     : Pot.Text.ord,
    trim                    : Pot.Text.trim,
    ltrim                   : Pot.Text.ltrim,
    rtrim                   : Pot.Text.rtrim,
    strip                   : Pot.Text.strip,
    normalizeSpace          : Pot.Text.normalizeSpace,
    splitBySpace            : Pot.Text.splitBySpace,
    canonicalizeNL          : Pot.Text.canonicalizeNL,
    wrap                    : Pot.Text.wrap,
    unwrap                  : Pot.Text.unwrap,
    startsWith              : Pot.Text.startsWith,
    endsWith                : Pot.Text.endsWith,
    lower                   : Pot.Text.lower,
    upper                   : Pot.Text.upper,
    camelize                : Pot.Text.camelize,
    hyphenize               : Pot.Text.hyphenize,
    underscore              : Pot.Text.underscore,
    inc                     : Pot.Text.inc,
    dec                     : Pot.Text.dec,
    br                      : Pot.Text.br,
    stripTags               : Pot.Text.stripTags,
    truncate                : Pot.Text.truncate,
    truncateMiddle          : Pot.Text.truncateMiddle,
    toHankakuCase           : Pot.Text.toHankakuCase,
    toZenkakuCase           : Pot.Text.toZenkakuCase,
    toHanSpaceCase          : Pot.Text.toHanSpaceCase,
    toZenSpaceCase          : Pot.Text.toZenSpaceCase,
    toHiraganaCase          : Pot.Text.toHiraganaCase,
    toKatakanaCase          : Pot.Text.toKatakanaCase,
    toHankanaCase           : Pot.Text.toHankanaCase,
    toZenkanaCase           : Pot.Text.toZenkanaCase,
    detectWindow            : Pot.DOM.detectWindow,
    detectDocument          : Pot.DOM.detectDocument,
    getOwnerDocument        : Pot.DOM.getOwnerDocument,
    getElement              : Pot.DOM.getElement,
    getElements             : Pot.DOM.getElements,
    isXHTML                 : Pot.DOM.isXHTML,
    isXML                   : Pot.DOM.isXML,
    tagNameOf               : Pot.DOM.tagNameOf,
    getNodeValue            : Pot.DOM.getValue,
    setNodeValue            : Pot.DOM.setValue,
    getHTMLString           : Pot.DOM.getHTMLString,
    setHTMLString           : Pot.DOM.setHTMLString,
    getOuterHTML            : Pot.DOM.getOuterHTML,
    setOuterHTML            : Pot.DOM.setOuterHTML,
    getTextContent          : Pot.DOM.getTextContent,
    setTextContent          : Pot.DOM.setTextContent,
    getSelectionObject      : Pot.DOM.getSelectionObject,
    getSelectionContents    : Pot.DOM.getSelectionContents,
    getSelectionText        : Pot.DOM.getSelectionText,
    getSelectionHTML        : Pot.DOM.getSelectionHTML,
    coerceToNode            : Pot.DOM.coerceToNode,
    removeElement           : Pot.DOM.removeElement,
    appendChilds            : Pot.DOM.appendChilds,
    prependChilds           : Pot.DOM.prependChilds,
    removeChilds            : Pot.DOM.removeChilds,
    getAttr                 : Pot.DOM.getAttr,
    setAttr                 : Pot.DOM.setAttr,
    hasAttr                 : Pot.DOM.hasAttr,
    removeAttr              : Pot.DOM.removeAttr,
    addClass                : Pot.DOM.addClass,
    removeClass             : Pot.DOM.removeClass,
    hasClass                : Pot.DOM.hasClass,
    toggleClass             : Pot.DOM.toggleClass,
    serializeToXMLString    : Pot.DOM.serializeToString,
    parseFromXMLString      : Pot.DOM.parseFromString,
    evaluate                : Pot.DOM.evaluate,
    attr                    : Pot.DOM.attr,
    convertToHTMLDocument   : Pot.DOM.convertToHTMLDocument,
    convertToHTMLString     : Pot.DOM.convertToHTMLString,
    css                     : Pot.Style.css,
    getStyle                : Pot.Style.getStyle,
    setStyle                : Pot.Style.setStyle,
    isShown                 : Pot.Style.isShown,
    isVisible               : Pot.Style.isVisible,
    pxize                   : Pot.Style.pxize,
    getSizePos              : Pot.Style.getSizePos,
    getPixelSize            : Pot.Style.getPixelSize,
    setSize                 : Pot.Style.setSize,
    getWidth                : Pot.Style.getWidth,
    setWidth                : Pot.Style.setWidth,
    getHeight               : Pot.Style.getHeight,
    setHeight               : Pot.Style.setHeight,
    rescape                 : rescape,
    arrayize                : arrayize,
    numeric                 : numeric,
    invoke                  : invoke,
    stringify               : stringify,
    trim                    : trim,
    now                     : now,
    globalize               : Pot.globalize,
    debug                   : Pot.Debug.debug
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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Register the Pot object into global.


// Export the Pot object.
Pot.Internal.exportPot(false, false, false, true);


})(this || {});


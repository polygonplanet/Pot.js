/**
 * Define the object Pot.
 *
 * @name    Pot
 * @type    Object
 * @class
 * @static
 * @public
 */
var Pot = {VERSION : '{#$version}', TYPE : /*{#if Pot}'full'{#else}*/'lite'/*{#endif}*/},

// A shortcut of prototype methods.
push           = Array.prototype.push,
slice          = Array.prototype.slice,
splice         = Array.prototype.splice,
concat         = Array.prototype.concat,
unshift        = Array.prototype.unshift,
indexOf        = Array.prototype.indexOf,
lastIndexOf    = Array.prototype.lastIndexOf,
toString       = Object.prototype.toString,
hasOwnProperty = Object.prototype.hasOwnProperty,
fromCharCode   = String.fromCharCode,

/**
 * faster way of String.fromCharCode(c).
 * @ignore
 */
fromUnicode = (function() {
  var i, maps = [];
  for (i = 0; i <= 0xFFFF; i++) {
    maps[i] = fromCharCode(i);
  }
  return function(c) {
    return maps[c & 0xFFFF];
  };
}()),

/*{#if Pot}*/
// Namespace URIs.
XML_NS_URI   = 'http://www.w3.org/XML/1998/namespace',
HTML_NS_URI  = 'http://www.w3.org/1999/xhtml',
XHTML_NS_URI = 'http://www.w3.org/1999/xhtml',
XLINK_NS_URI = 'http://www.w3.org/1999/xlink',
XSL_NS_URI   = 'http://www.w3.org/1999/XSL/Transform',
SVG_NS_URI   = 'http://www.w3.org/2000/svg',
XUL_NS_URI   = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
JS_VOID_URI  = 'javascript:void(0)',

// Constant strings.
UPPER_ALPHAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
LOWER_ALPHAS = 'abcdefghijklmnopqrstuvwxyz',
DIGITS       = '0123456789',
/*{#endif}*/
// Regular expression patterns.
RE_RESCAPE         = /([-.*+?^${}()|[\]\/\\])/g,
RE_PERCENT_ENCODED = /^(?:[a-zA-Z0-9_~.-]|%[0-9a-fA-F]{2})*$/,
RE_ARRAYLIKE       = /List|Collection/i,
RE_TRIM            = /^[\s\u00A0\u3000]+|[\s\u00A0\u3000]+$/g,/*{#if Pot}*/
RE_LTRIM           = /^[\s\u00A0\u3000]+/g,
RE_RTRIM           = /[\s\u00A0\u3000]+$/g,
RE_STRIP           = /[\s\u00A0\u3000]+/g,
RE_NL              = /\r\n|\r|\n/,
RE_NL_GROUP        = /(\r\n|\r|\n)/,
RE_EMPTYFN         = /^[(]?[^{]*?[{][\s\u00A0]*[}]\s*[)]?\s*$/,
RE_JS_ESCAPED      = /^(?:[\w!#$()*+,.:;=?@[\]^`|~-]|\\[ux][0-9a-f]+)*$/i,
RE_HTML_ESCAPED    =
  /^(?:[^<>"'&]|&(?:[a-z]\w{0,24}|#(?:x[0-9a-f]{1,8}|[0-9]{1,10}));)*$/i,/*{#endif}*/

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
   * Pot plugin object.
   *
   *
   * @example
   *   // Register my plugin function.
   *   Pot.addPlugin('myFunc', function(msg) {
   *     alert('myFunc: ' + msg);
   *   });
   *   // Call function that is able to refer from the Pot object.
   *   Pot.myFunc('Hello!'); // 'myFunc: Hello!'
   *   // Check exists.
   *   debug( Pot.hasPlugin('myFunc') ); // true
   *   // Register other plugin function.
   *   Pot.addPlugin('myFunc2', function(a, b) {
   *     return a + b;
   *   });
   *   // Call other function.
   *   debug( Pot.myFunc2(1, 2) ); // 3
   *   // addPlugin does not overwrite function on default.
   *   debug( Pot.addPlugin('myFunc', function() {}) ); // false
   *   // View list of plugins.
   *   debug( Pot.listPlugin() ); // ['myFunc', 'myFunc2']
   *   // Remove my plugin.
   *   Pot.removePlugin('myFunc');
   *   debug( Pot.hasPlugin('myFunc') ); // false
   *   debug( Pot.listPlugin() ); // ['myFunc2']
   *
   *
   * @example
   *   Pot.addPlugin({
   *     foo : function() { return 'foo!'; },
   *     bar : function() { return 'bar!'; },
   *     baz : function() { return 'baz!'; }
   *   });
   *   debug(Pot.foo() + Pot.bar() + Pot.baz()); // 'foo!bar!baz!'
   *
   *
   * @example
   *   // Register function.
   *   Pot.addPlugin('foo', function() { return 'foo!'; });
   *   // Try change function.
   *   var newFoo = function() { return 'NewFoo!' };
   *   debug( Pot.addPlugin('foo', newFoo) ); // false
   *   // Overwrite plugin function.
   *   debug( Pot.addPlugin('foo', newFoo, true) ); // true
   *   debug( Pot.foo() ); // 'NewFoo!'
   *
   *
   * @example
   *   var toArray = function(string) {
   *     return string.split('');
   *   };
   *   // Plugin function has 'deferred' method.
   *   Pot.addPlugin('toArray', toArray);
   *   // Synchronous
   *   debug( Pot.toArray('abc') ); // ['a', 'b', 'c']
   *   // Asynchronous
   *   Pot.toArray.deferred('abc').then(function(res) {
   *     debug(res); // ['a', 'b', 'c']
   *   });
   *
   *
   * @example
   *   var string = '\t abc\n \t ';
   *   // Original Pot.trim().
   *   debug(Pot.trim(string)); // 'abc'
   *   // Overwrite Pot.trim().
   *   Pot.addPlugin('trim', function(s) {
   *     return s.replace(/^ +| +$/g, '');
   *   });
   *   // New Pot.trim().
   *   debug(Pot.trim(string)); // '\t abc\n \t'
   *   // Removes new Pot.trim().
   *   Pot.removePlugin('trim');
   *   // Back to the original.
   *   debug(Pot.trim(string)); // 'abc'
   *
   *
   * @type  Object
   * @class
   * @static
   * @public
   */
  Plugin : {},
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
  }(nv)),
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
  }(nv)),
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
  }(nv)),
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
  }()),
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
}(typeof navigator !== 'undefined' && navigator || {}));
/*{#if Pot}*/
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
  DIR_DELIMITER : Pot.OS.win ? '\\' : '/',
  /**
   * XML/HTML namespace URI.
   *
   * @type  String
   * @static
   * @const
   */
  XML_NS_URI : XML_NS_URI,
  /**
   * XML/HTML namespace URI.
   *
   * @type  String
   * @static
   * @const
   */
  HTML_NS_URI : HTML_NS_URI,
  /**
   * XML/HTML namespace URI.
   *
   * @type  String
   * @static
   * @const
   */
  XHTML_NS_URI : XHTML_NS_URI,
  /**
   * XML/HTML namespace URI.
   *
   * @type  String
   * @static
   * @const
   */
  XLINK_NS_URI : XLINK_NS_URI,
  /**
   * XML/HTML namespace URI.
   *
   * @type  String
   * @static
   * @const
   */
  XSL_NS_URI : XSL_NS_URI,
  /**
   * XML/HTML namespace URI.
   *
   * @type  String
   * @static
   * @const
   */
  SVG_NS_URI : SVG_NS_URI,
  /**
   * XML/HTML namespace URI.
   *
   * @type  String
   * @static
   * @const
   */
  XUL_NS_URI : XUL_NS_URI,
  /**
   * JavaScript void URI.
   *
   * @type  String
   * @static
   * @const
   */
  JS_VOID_URI : JS_VOID_URI
});
/*{#endif}*/
// Definition of System.
update(Pot.System, (function() {
  var o = {}, g, w, wb, b, u/*{#if Pot}*/, oe, ce, ov, cv, f/*{#endif}*/;
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
    }/*{#if Pot}*/
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
    } catch (e) {}/*{#endif}*/
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
  }/*{#if Pot}*/
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
  } catch (e) {}/*{#endif}*/
  try {
    /**@ignore*/
    g = (function() {
      yield (0);
    }());
    if (g && typeof g.next === 'function') {
      o.isYieldable = true;
    }
  } catch (e) {}
  try {
    b = (typeof BlobBuilder       !== 'undefined') ? BlobBuilder       :
        (typeof MozBlobBuilder    !== 'undefined') ? MozBlobBuilder    :
        (typeof WebKitBlobBuilder !== 'undefined') ? WebKitBlobBuilder :
        (typeof MSBlobBuilder     !== 'undefined') ? MSBlobBuilder     : null;
    if (!b ||
        typeof b !== 'function' ||
        typeof b.prototype.append !== 'function' ||
        typeof b.prototype.getBlob !== 'function'
    ) {
      b = null;
    } else {
      o.BlobBuilder = b;
    }
  } catch (e) {}
  try {
    u = (typeof URL       !== 'undefined') ? URL       :
        (typeof webkitURL !== 'undefined') ? webkitURL : null;
    if (!u || typeof u.createObjectURL !== 'function') {
      u = null;
    } else {
      o.BlobURI = u;
    }
  } catch (e) {}
  try {
    if (typeof Worker === 'function' &&
        typeof Worker.prototype.postMessage === 'function') {
      o.hasWorker = true;
      w = new Worker(
        'data:application/javascript;base64,' +
        // base64: onmessage=function(e){postMessage(e.data+1)}
        'b25tZXNzYWdlPWZ1bmN0aW9uKGUpe3Bvc3RNZXNzYWdlKGUuZGF0YSsxKX0='
      );
      /**@ignore*/
      w.onmessage = function(ev) {
        if (ev && ev.data === 'x1') {
          Pot.System.canWorkerDataURI = true;
        }
        try {
          w.terminate();
        } catch (ex) {}
      };
      w.postMessage('x');
    }
  } catch (e) {}
  if (o.hasWorker && o.BlobBuilder && o.BlobURI) {
    try {
      b = new o.BlobBuilder();
      b.append('onmessage=function(e){postMessage(e.data+2)}');
      wb = new Worker(o.BlobURI.createObjectURL(b.getBlob()));
      /**@ignore*/
      wb.onmessage = function(ev) {
        if (ev && ev.data === 'x2') {
          Pot.System.canWorkerBlobURI = true;
        }
        try {
          wb.terminate();
        } catch (ex) {}
      };
      wb.postMessage('x');
    } catch (e) {}
  }
  return o;
}()));

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
      }());
    }());
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
}('Boolean Number String Function Array Date RegExp Object Error'.split(' ')));
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
    }()),
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
    }()),
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
   * A shortcut of "Components.classes".
   *
   * @type  Object
   * @static
   * @const
   * @public
   */
  Cc : Cc,
  /**
   * A shortcut of "Components.interfaces".
   *
   * @type  Object
   * @static
   * @const
   * @public
   */
  Ci : Ci,
  /**
   * A shortcut of "Components.results".
   *
   * @type  Object
   * @static
   * @const
   * @public
   */
  Cr : Cr,
  /**
   * A shortcut of "Components.utils".
   *
   * @type  Object
   * @static
   * @const
   * @public
   */
  Cu : Cu,
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
  }()),
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
    if (Pot.StopIteration !== void 0 &&
        (o == Pot.StopIteration || o instanceof Pot.StopIteration)) {
      return true;
    }
    if (typeof StopIteration !== 'undefined' &&
        (o == StopIteration || o instanceof StopIteration)) {
      return true;
    }
    if (this && this.StopIteration !== void 0 &&
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
   * Return whether the argument is scalar type.
   * This function treats as scalar type for
   *   String or Number and Boolean types.
   *
   *
   * @example
   *   debug(isScalar(null));              // false
   *   debug(isScalar((void 0)));          // false
   *   debug(isScalar(''));                // true
   *   debug(isScalar('abc'));             // true
   *   debug(isScalar(0));                 // true
   *   debug(isScalar(123));               // true
   *   debug(isScalar(false));             // true
   *   debug(isScalar(true));              // true
   *   debug(isScalar(new Boolean(true))); // true
   *   debug(isScalar([]));                // false
   *   debug(isScalar([1, 2, 3]));         // false
   *   debug(isScalar(/hoge/));            // false
   *   debug(isScalar(new Error()));       // false
   *   debug(isScalar({}));                // false
   *   debug(isScalar({a: 1, b: 2}));      // false
   *
   *
   * @param   {*}         x     A target object.
   * @return  {Boolean}         ture or false (scalar type or not).
   * @type Function
   * @function
   * @static
   * @public
   */
  isScalar : function(x) {
    return x != null &&
      (Pot.isString(x) || Pot.isNumber(x) || Pot.isBoolean(x));
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
  },/*{#if Pot}*/
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
      result = (p === void 0 || hasOwnProperty.call(o, p));
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
          /**@ignore*/
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
  },/*{#endif}*/
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
   * Check whether the argument object is an instance of Pot.Workeroid.
   *
   *
   * @example
   *   var o = {hoge: 1};
   *   var w = new Pot.Workeroid();
   *   debug(isWorkeroid(o)); // false
   *   debug(isWorkeroid(w)); // true
   *
   *
   * @param  {Object|*}  x  The target object to test.
   * @return {Boolean}      Return true if the argument object is an
   *                          instance of Pot.Workeroid,
   *                          otherwise return false.
   * @type Function
   * @function
   * @static
   * @public
   */
  isWorkeroid : function(x) {
    return x != null && ((x instanceof Pot.Workeroid) ||
     (x.id   != null && x.id   === Pot.Workeroid.prototype.id &&
      x.NAME != null && x.NAME === Pot.Workeroid.prototype.NAME));
  },/*{#if Pot}*/
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
   *   debug(isJSEscaped('abc'));                          // true
   *   debug(isJSEscaped('abc\\hoge".'));                  // false
   *   debug(isJSEscaped('\\u007b\\x20hoge\\x20\\u007d')); // true
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
  },/*{#endif}*/
  /**
   * Check whether the value is percent encoded.
   *
   *
   * @example
   *   debug(isPercentEncoded('abc'));              // true
   *   debug(isPercentEncoded('abc["hoge"]'));      // false
   *   debug(isPercentEncoded('%7B%20hoge%20%7D')); // true
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
  },/*{#if Pot}*/
  /**
   * Check whether the value is escaped as HTML/XML String.
   *
   *
   * @example
   *   debug(isHTMLEscaped('abc'));                     // true
   *   debug(isHTMLEscaped('1 < 2'));                   // false
   *   debug(isHTMLEscaped('&quot;(&gt;_&lt;)&quot;')); // true
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
  },/*{#endif}*/
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
   * @return {Boolean}     Whether `n` is an integer.
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
  }/*{#if Pot}*/,
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
      return (Pot.isNodeLike(x) || Pot.isNodeList(x)  ||
              Pot.isWindow(x)   || Pot.isDocument(x)) ||
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
  }())/*{#endif}*/
});
}('StopIteration'));

// Define StopIteration (this scope only)
if (typeof StopIteration === 'undefined') {
  var StopIteration = Pot.StopIteration;
}

// Definition of current Document and URI.
(function() {
  var win, doc, uri, wp, dp, a;
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
      } catch (e) {
        try {
          a = doc.createElement('a');
          a.href = '';
          uri = a.href;
        } catch (ex) {}
      }
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
}());

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
   * {@link https://developer.mozilla.org/en/JavaScript/
   *                Reference/Global_Objects/Object/keys }
   *
   * @param  {Object|Function|*}  o  The target object.
   * @return {Array}                 The collected key names as an array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  keys : (function() {
    var hasDontEnumBug = !({toString : null})
                            .propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;
    return function(object) {
      var results = [], type = typeof object, len, p, i;
      if (type !== 'object' && type !== 'function' || object === null) {
        return results;
      }
      if (Pot.isArrayLike(object)) {
        len = object.length;
        for (i = 0; i < len; i++) {
          if (i in object) {
            results[results.length] = i;
          }
        }
      } else {
        if (Pot.System.isBuiltinObjectKeys) {
          try {
            results = Object.keys(object);
            return results;
          } catch (e) {}
        }
        for (p in object) {
          try {
            if (hasOwnProperty.call(object, p)) {
              results[results.length] = p;
            }
          } catch (ex) {}
        }
        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            try {
              if (hasOwnProperty.call(object, dontEnums[i])) {
                results[results.length] = dontEnums[i];
              }
            } catch (er) {}
          }
        }
      }
      return results;
    };
  }()),
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
    var me = arguments.callee, id, scope, func, doc, script, head;
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
        // eval does not work to global scope in greasemonkey
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
          scope[id] = 1;
          scope[func]('try{delete ' + id + ';}catch(e){}');
          if (!(id in scope)) {
            me.worksForGlobal = true;
          }
          try {
            delete scope[id];
          } catch (e) {
            try {
              scope[id] = void 0;
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
          script.defer = script.async = false;
          if (Pot.System.hasActiveXObject && 'text' in script) {
            script.text = code;
          } else {
            script.appendChild(doc.createTextNode(code));
          }
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
          scope[id] = 1;
          scope[func].call(scope, 'try{delete ' + id + '}catch(e){}');
          if (!(id in scope)) {
            me.worksForGlobal = true;
          } else {
            try {
              delete scope[id];
            } catch (e) {}
          }
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
   * Get the function code.
   *
   *
   * @example
   *   debug(getFunctionCode(function() { return 'hoge'; }));
   *   // @results e.g.
   *   //   'function () {' +
   *   //   '    return "hoge";' +
   *   //   '}'
   *
   *
   * @example
   *   debug(getFunctionCode('function() { return 1; }'));
   *   // @results 'function() { return 1; }'
   *
   *
   * @example
   *   debug(getFunctionCode(1));      // ''
   *   debug(getFunctionCode(false));  // ''
   *   debug(getFunctionCode(true));   // ''
   *   debug(getFunctionCode(null));   // ''
   *   debug(getFunctionCode(void 0)); // ''
   *   debug(getFunctionCode({}));     // ''
   *
   *
   * @example
   *   debug(getFunctionCode(new Function('return 1')));
   *   // @results e.g.
   *   //   'function anonymous() {' +
   *   //   '    return 1;' +
   *   //   '}'
   *
   *
   * @param  {Function|String}   func  Target function or string code.
   * @return {String}                  Returns function code
   *                                     or empty string ''.
   * @type  Function
   * @function
   * @static
   * @public
   */
  getFunctionCode : function(func) {
    if (!func || func == null ||
        (!Pot.isFunction(func) && !Pot.isString(func))
    ) {
      return '';
    } else if (func.toString) {
      return func.toString();
    } else {
      return '' + func;
    }
  },
  /**
   * Checks whether a token is words.
   *
   *
   * @example
   *   debug(isWords(' '));     // false
   *   debug(isWords('abc'));   // true
   *   debug(isWords('ほげ'));  // true
   *   debug(isWords('\r\n'));  // false
   *   debug(isWords(' \n'));   // false
   *   debug(isWords(' abc'));  // false
   *   debug(isWords('abc '));  // false
   *   debug(isWords('_'));     // true
   *   debug(isWords(false));   // false
   *   debug(isWords(true));    // false
   *   debug(isWords(void 0));  // false
   *   debug(isWords({}));      // false
   *   debug(isWords(['ABC'])); // false
   *   debug(isWords('$hoge')); // true
   *   debug(isWords('$_'));    // true
   *
   *
   * @param  {String}   c  A string token.
   * @return {Boolean}     Returns whether a token is words.
   * @type  Function
   * @function
   * @static
   * @public
   */
  isWords : (function() {
    var isSpace = /\s/,
        notWord = /[^$\w\u0100-\uFFFF]/;
    return function(c) {
      return Pot.isString(c) && !isSpace.test(c) && !notWord.test(c);
    };
  }()),
  /**
   * Checks whether a token is line-break.
   *
   *
   * @example
   *   debug(isNL('abc'));            // false
   *   debug(isNL(' '));              // false
   *   debug(isNL('\n'));             // true
   *   debug(isNL('\r'));             // true
   *   debug(isNL('\r\n'));           // true
   *   debug(isNL('\nhoge'));         // false
   *   debug(isNL('\r \n'));          // false
   *   debug(isNL('\r\n\r\n'));       // true
   *   // Note: includes U+2028 - U+2029
   *   debug(isNL('\u2028\u2029'));   // true
   *   debug(isNL(null));             // false
   *   debug(isNL(void 0));           // false
   *   debug(isNL(false));            // false
   *   debug(isNL(true));             // false
   *   debug(isNL(new String('\n'))); // true
   *   debug(isNL({}));               // false
   *   debug(isNL(['\n']));           // false
   *
   *
   * @param  {String}   c  A string token.
   * @return {Boolean}     Returns whether a token is NL.
   * @type  Function
   * @function
   * @static
   * @public
   */
  isNL : (function() {
    var notNL = /[^\r\n\u2028\u2029]/;
    return function(c) {
      return Pot.isString(c) && !notNL.test(c);
    };
  }()),
  /**
   * Formats to a string by arguments.
   *
   *
   * @example
   *   var result = format('#1 + #2 + #3', 10, 20, 30);
   *   debug(result);
   *   // @results '10 + 20 + 30'
   *
   *
   * @example
   *   var result = format('J#1v#1#2 ECMA#2', 'a', 'Script');
   *   debug(result);
   *   // @results 'JavaScript ECMAScript'
   *
   *
   * @param  {String}   fmt   A string format.
   * @param  {...*}    (...)  Format arguments.
   * @return {String}         Returns a formatted string.
   * @type  Function
   * @function
   * @static
   * @public
   */
  format : (function() {
    var args,
        re = /#(\d+)/g,
        /**@ignore*/
        rep = function(a, i) {
          return args && args[+i];
        };
    return function(fmt/*[, ...args]*/) {
      var f = stringify(fmt, true);
      args = arrayize(arguments);
      if (!args || !args.length) {
        return f;
      }
      re.lastIndex = 0;
      return f.replace(re, rep);
    };
  }()),
  /**
   * Tokenize a function code simply.
   *
   *
   * @example
   *   var hoge = function() {
   *     var a = 1, b = 0.5, c = '"hoge"', $d = /'\/'/g;
   *     return $d.test(c) ? a : b;
   *   };
   *   debug( Pot.tokenize(hoge) );
   *   // @results
   *   // [
   *   //   'function', '(', ')', '{', '\n',
   *   //     'var', 'a', '=', '1', ',', 'b', '=', '0.5', ',',
   *   //            'c', '=', '\'"hoge"\'', ',',
   *   //            '$d', '=', '/\'\\/\'/g', ';', '\n',
   *   //     'return', '$d', '.', 'test', '(', 'c', ')', '?',
   *   //               'a', ':', 'b', ';', '\n',
   *   //   '}'
   *   // ]
   *
   *
   * @param  {Function|String}   func   The code or function to tokenize.
   * @return {Array}                    Tokens as an array.
   * @type  Function
   * @function
   * @static
   * @public
   */
  tokenize : (function() {
    var RE = {
      TOKEN : new RegExp(
        '(' + '/[*][\\s\\S]*?[*]/' +                  // multiline comment
        '|' + '/{2,}[^\\r\\n]*(?:\\r\\n|\\r|\\n|)' +  // single line comment
        '|' + '"(?:\\\\[\\s\\S]|[^"\\r\\n\\\\])*"' +  // string literal
        '|' + "'(?:\\\\[\\s\\S]|[^'\\r\\n\\\\])*'" +  // string literal
        '|' + '(' + '^' +                         // (2) regexp literal prefix
              '|' + '[-!%&*+,/:;<=>?[{(^|~]' +
              ')' +
              '(?:' +
                  '(' +    // (3) line break
                    '(?!' + '[\\r\\n])\\s+' +
                      '|' + '(?:\\r\\n|\\r|\\n)' +
                   ')' +
                '|' + '\\s*' +
              ')' +
              '(?:' +
                '(' +      // (4) regular expression literal
                    '(?:/(?![*])(?:\\\\.|[^/\\r\\n\\\\])+/)' +
                    '(?:[gimy]{0,4}|\\b)' +
                ')' +
                '(?=\\s*' +
                  '(?:' + '(?!\\s*[/\\\\<>*+%`^"\'\\w$-])' +
                          '[^/\\\\<>*+%`^\'"@({[\\w$-]' +
                    '|' + '===?' +
                    '|' + '!==?' +
                    '|' + '[|][|]' +
                    '|' + '[&][&]' +
                    '|' + '/(?:[*]|/)' +
                    '|' + '[,.;:!?)}\\]\\r\\n]' +
                    '|' + '$' +
                  ')' +
                ')' +
              ')' +
        '|' + '<(\\w+(?::\\w+|))\\b[^>]*>' +          // (5) e4x
              '(?:(?!</\\5>(?!\\s*[\'"]))[\\s\\S])*' +
              '</\\5>' +
        '|' + '<>[\\s\\S]*?</>' +                     // e4x
        '|' + '>>>=?|<<=|===|!==|>>=' +               // operators
        '|' + '[+][+](?=[+])|[-][-](?=[-])' +
        '|' + '[=!<>*+/&|^-]=' +
        '|' + '[&][&]|[|][|]|[+][+]|[-][-]|<<|>>' +
        '|' + '0(?:[xX][0-9a-fA-F]+|[0-7]+)' +        // number literal
        '|' + '\\d+(?:[.]\\d+)?(?:[eE][+-]?\\d+)?' +
        '|' + '[1-9]\\d*' +
        '|' + '[-+/%*=&|^~<>!?:,;@()\\\\[\\].{}]' +   // operator
        '|' + '(?:(?![\\r\\n])\\s)+' +                // white space
        '|' + '(?:\\r\\n|\\r|\\n)' +                  // nl
        '|' + '[^\\s+/%*=&|^~<>!?:,;@()\\\\[\\].{}\'"-]+' + // token
        ')',
        'g'
      ),
      LINEBREAK : /^(?:\r\n|\r|\n)/,
      NOTSPACE  : /[\S\r\n]/,
      COMMENTS  : /^\/{2,}[\s\S]*$|^\/[*][\s\S]*?[*]\/$/
    },
    LIMIT  = 0x2000,
    COUNT  = 0,
    PREFIX = '.',
    CACHES = {};
    return function(func) {
      var r = [], m, token, prev, s = Pot.getFunctionCode(func);
      if (s) {
        if ((PREFIX + s) in CACHES) {
          return CACHES[PREFIX + s];
        }
        RE.TOKEN.lastIndex = 0;
        while ((m = RE.TOKEN.exec(s)) != null) {
          token = m[1];
          if (!RE.NOTSPACE.test(token) || RE.COMMENTS.test(token)) {
            continue;
          }
          if (m[4]) {
            if (m[2]) {
              r[r.length] = m[2];
            }
            if (m[3] && RE.NOTSPACE.test(m[3])) {
              r[r.length] = m[3];
            }
            r[r.length] = m[4];
          } else {
            prev = r[r.length - 1];
            if (!prev ||
                !RE.LINEBREAK.test(prev) || !RE.LINEBREAK.test(token)) {
              r[r.length] = token;
            }
          }
        }
        if (COUNT < LIMIT) {
          CACHES[PREFIX + s] = r;
          COUNT++;
        }
      }
      return r;
    };
  }()),
  /**
   * Joins the tokenized array.
   *
   *
   * @example
   *   var hoge = function() {
   *     var a = 1, b = 0.5, c = '"hoge"', $d = /'\/'/g;
   *     return $d.test(c) ? a : b;
   *   };
   *   var tokens = Pot.tokenize(hoge);
   *   var result = Pot.joinTokens(tokens);
   *   // @results
   *   //   'function(){\n' +
   *   //     'var a=1,b=0.5,c=\'"hoge"\',$d=/\'\\/\'/g;\n' +
   *   //     'return $d.test(c)?a:b;\n' +
   *   //   '}'
   *
   *
   * @param  {Array}   tokens   The tokenized array.
   * @return {String}           Returns a string that joined from tokens.
   * @type  Function
   * @function
   * @static
   * @public
   */
  joinTokens : (function() {
    var isWord = /^[^\s+\/%*=&|^~<>!?:,;@()\\[\].{}'"-]+$/,
        isSign = /^[-+]+$/;
    return function(tokens) {
      var result = [], len, prev, prevSuf, pre, suf, i, token;
      if (Pot.isArray(tokens)) {
        len = tokens.length;
        for (i = 0; i < len; i++) {
          token = tokens[i];
          if (!prev) {
            result[result.length] = token;
          } else {
            pre = '';
            suf = '';
            if (token === 'in') {
              if (!prevSuf) {
                pre = ' ';
              }
              suf = ' ';
            } else if (isSign.test(token)) {
              if (!prevSuf && isSign.test(prev)) {
                pre = ' ';
              }
            } else if (isWord.test(prev.slice(-1)) &&
                       isWord.test(token.charAt(0))) {
              pre = ' ';
            }
            if (prevSuf === ' ') {
              pre = '';
            }
            result[result.length] = pre + token + suf;
          }
          prev = token;
          prevSuf = suf;
        }
      }
      return result.join('');
    };
  }()),
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
  }()),
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
  },
  /**
   * Get the error message from Error object.
   *
   *
   * @example
   *   var error = new Error('MyError!');
   *   debug(getErrorMessage(error));
   *   // @results 'MyError!'
   *
   *
   * @param  {Error|*}    error      Error object.
   * @param  {String|*}  (defaults)  Optional message.
   * @return {String}                Return the error message, or 'error'.
   * @type  Function
   * @function
   * @static
   * @public
   */
  getErrorMessage : function(error, defaults) {
    var msg;
    if (Pot.isError(error)) {
      msg = String(error.message  || error.description ||
                  (error.toString && error.toString()) || error);
    }
    return stringify(msg) || stringify(defaults) || 'error';
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
        // Includes prototype properties.
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
/*{#if Pot}*/
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
/*{#endif}*/
/**
 * @ignore
 */
function now() {
  return +new Date;
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
              margin     : '0px',
              zoom       : 1
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
            style.zoom         = 1;
            if (ie6) {
              style.height = Math.floor(de.clientHeight / 3.2) + 'px';
            } else {
              style.position = 'fixed';
              style.height   = '25%';
            }
            me.titlebar = doc.createElement('div');
            style = me.titlebar.style;
            style.zIndex      = 9999;
            style.border      = '0';
            style.width       = '95%';
            style.position    = 'relative';
            style.margin      = '2px';
            style.fontWeight  = 'bold';
            style.color       = '#333';
            style.background  = '#fff';
            style.fontFamily  = 'verdana';
            style.zoom        = 1;
            me.titlebar.appendChild(doc.createTextNode('Pot.js Console'));
            me.ieConsole = wrapper.cloneNode(false);
            me.ieConsole.id = me.ieConsoleId = buildSerial(Pot, '');
            style = me.ieConsole.style;
            style.borderWidth = '1px';
            style.width       = '95%';
            style.height      = '68%';
            style.position    = 'relative';
            style.zIndex      = 9997;
            style.marginTop   = '3px';
            style.padding     = '5px';
            style.whiteSpace  = 'pre';
            style.wordWrap    = 'break-word';
            style.overflowX   = 'hidden';
            style.overflowY   = 'auto';
            style.zoom        = 1;
            me.hr = doc.createElement('hr');
            style = me.hr.style;
            style.position    = 'relative';
            style.width       = '100%';
            style.border      = '1px solid #aaa';
            style.zIndex      = 9998;
            style.zoom        = 1;
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
            style.zoom        = 1;
            close.title       = 'close';
            close.appendChild(doc.createTextNode('x'));
            me.histories = [];
            me.historyIndex = 0;
            me.historyLimit = 50;
            me.executer = doc.createElement('input');
            me.executer.type  = 'text';
            style = me.executer.style;
            style.zIndex      = 9999;
            style.position    = 'relative';
            style.display     = 'block';
            style.fontFamily  = 'monospace';
            style.fontSize    = '13px';
            style.padding     = '2px';
            style.marginTop   = '5px';
            style.width       = '95.5%';
            style.border      = '2px solid #999';
            style.zoom        = 1;
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
            /**@ignore*/
            onKeydown = function(ev) {
              var result, prevCode, nextCode, code = trim(me.executer.value);
              ev = window.event || ev;
              if (ev) {
                if (code && ev.keyCode == 13) { // enter
                  try {
                    result = Pot.localEval(code);
                  } catch (e) {
                    result = Pot.getErrorMessage(e);
                  }
                  Pot.debug(result);
                  if (me.histories.length > me.historyLimit) {
                    me.histories.pop();
                  }
                  me.histories.unshift(code);
                  me.executer.value = '';
                  me.historyIndex = 0;
                } else if (ev.keyCode == 38) { // up
                  prevCode = me.histories[me.historyIndex];
                  me.historyIndex = Math.max(
                    0,
                    Math.min(me.histories.length - 1, me.historyIndex + 1)
                  );
                  if (prevCode) {
                    me.executer.value = prevCode;
                  }
                } else if (ev.keyCode == 40) { // down
                  if (me.historyIndex - 1 < 0) {
                    me.executer.value = '';
                    me.historyIndex = 0;
                  } else {
                    me.historyIndex = Math.max(
                      0,
                      Math.min(me.histories.length - 1, me.historyIndex - 1)
                    );
                    nextCode = me.histories[me.historyIndex];
                    if (nextCode) {
                      me.executer.value = nextCode;
                    }
                  }
                } else {
                  me.historyIndex = 0;
                }
              }
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
              if (me.executer.attachEvent) {
                me.executer.attachEvent('onkeydown', onKeydown);
              }
            }
            if (ie6) {
              Pot.Deferred.wait(0.25).then(function() {
                wrapper.style.bottom = '1px';
              }).wait(0.5).then(function() {
                wrapper.style.bottom = '0px';
              });
            }
            each([close, me.titlebar,
                  me.ieConsole, me.executer], function(el) {
              wrapper.appendChild(el);
            });
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
  arrayize : arrayize,/*{#if Pot}*/
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
  numeric : numeric,/*{#endif}*/
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
   *   debug(time); // e.g. 1323446177282
   *
   *
   * @return {Number} Return the current time as milliseconds.
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
  var i, len, val, err, p, keys;
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
        keys = Pot.keys(object);
        len = keys.length;
        for (i = 0; i < len; i++) {
          p = keys[i];
          try {
            val = object[p];
          } catch (e) {
            continue;
          }
          callback.call(context, val, p, object);
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

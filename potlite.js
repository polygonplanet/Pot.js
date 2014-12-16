/*!
 * PotLite.js - JavaScript library
 *
 * PotLite.js is an implemental utility library
 *  that can execute JavaScript without burdening the CPU.
 *
 * Version 1.3.9, 2014-12-16
 * Copyright (c) 2012-2014 polygon planet <polygon.planet.aqua@gmail.com>
 * Dual licensed under the MIT or GPL v2 licenses.
 * https://github.com/polygonplanet/Pot.js
 * http://polygonplanet.github.com/Pot.js/
 */
/**
 * Project PotLite.js
 *
 * @description
 *  <p>
 *  Pot.js is a JavaScript library that can be performed without causing
 *   stress to the UI and the CPU load by using easy loop iteration functions.
 *  With respect to load, you can implement a particular application without
 *   requiring the programmer to be aware of.
 *  Pot.js is built around the asynchronous processing
 *   and iterator with Deferred.
 *  Pot.Deferred is a Deferred object like MochiKit (or JSDeferred like).
 *  That makes it possible to various iterations (forEach, filter, map,
 *   reduce, zip, repeat, some etc.).
 *  Moreover, Pot.js is an utility library that handles string processes with
 *   various algorithms,
 *   and it has the Signal object that can write like aspect-oriented (AOP),
 *   and it has the Event object for DOM listener,
 *   and treats it the File API for HTML5. etc.
 *  And, Pot.js never pollute the prototype of the global objects.
 *  We only define the 'Pot' object in the global scope basically.
 *  You can use Pot.js with other available libraries without fear of conflict.
 *  Pot.js is a cross-browser library that works on a Web browser, Node.js,
 *   userscript (Greasemonkey, Scriptish) XUL, or (Firefox Add-ons) etc.
 *  PotLite.js is a light version that extracts only the part of asynchronous
 *   processing (Deferred etc.) has been implemented in Pot.js.
 *  </p>
 *
 * @description
 *  <p>
 *  Pot.js は、
 *   JavaScript のループ処理における CPU 負荷を抑え、
 *   UI にストレスを与えることなく実行できるライブラリです。
 *  負荷に関して、とくにプログラマが意識する必要なく
 *   アプリケーションを実装することができます。
 *  Pot.js は、Deferred による非同期処理や、
 *   非同期イテレータを中心に作られています。
 *  MochiKit ライク (または JSDeferred ライク) な Pot.Deferred によって、
 *   多様なイテレート (forEach, filter, map, reduce, zip, repeat, some など)
 *   を可能とします。
 *  また、様々なアルゴリズムを扱った文字列処理や、
 *   アスペクト指向 (AOP) で書ける シグナルやイベント処理、
 *   HTML5 に関する File API などを扱うことができる
 *   汎用ユーティリティライブラリです。
 *  そして、グローバルオブジェクトの prototype を汚染しません。
 *  基本的にグローバルに定義されるのは 'Pot' オブジェクトだけなので
 *   コンフリクトの心配なく、他の JavaScript ライブラリと共に利用できます。
 *  Pot.js は、クロスブラウザであり、Web ブラウザ上や Node.js、
 *   userscript (Greasemonkey, Scriptish) や
 *   XUL (Firefox アドオン) 上などで動きます。
 *  PotLite.js は、
 *   Pot.js で実装されている Deferred などの
 *   非同期処理の部分だけを抽出したライトバージョンです。
 *  </p>
 *
 *
 * @fileoverview   PotLite.js library
 * @author         polygon planet
 * @version        1.3.9
 * @date           2014-12-16
 * @link           https://github.com/polygonplanet/Pot.js
 * @link           http://polygonplanet.github.com/Pot.js/
 * @copyright      Copyright (c) 2012-2014 polygon planet <polygon.planet.aqua@gmail.com>
 * @license        Dual licensed under the MIT or GPL v2 licenses.
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
 * @namespace PotLite.js
 */
(function PotScriptImplementation(globals) {
'use strict';

/**
 * Define the object Pot.
 *
 * @name    Pot
 * @type    Object
 * @class
 * @static
 * @public
 */
var Pot = {VERSION : '1.38', TYPE : 'lite'},

// Refer the Pot properties/functions.
PotSystem,
PotPlugin,
PotToString,
PotBrowser,
PotLang,
PotOS,
PotGlobal,
PotNoop,
PotTmp,
PotInternal,

// Asynchronous/Iteration methods/properties.
PotInternalCallInBackground,
PotInternalSetTimeout,
PotInternalClearTimeout,
PotStopIteration,

// is* : object typing.
typeOf,
typeLikeOf,
isBoolean,
isNumber,
isString,
isFunction,
isArray,
isDate,
isRegExp,
isObject,
isError,
isTypedArray,
isArrayBuffer,
isArrayLike,
isNumeric,
isStopIter,
isDeferred,
isHash,
isIter,
isWorkeroid,
isWindow,
isDocument,
isElement,
isNodeList,
isNodeLike,

// Constructors.
Deferred,
Iter,
PotInternalLightIterator,
Signal,
DropFile,
Workeroid,

// A shortcut of prototype methods/functions.
ArrayProto     = Array.prototype,
ObjectProto    = Object.prototype,
StringProto    = String.prototype,
FunctionProto  = Function.prototype,
push           = ArrayProto.push,
slice          = ArrayProto.slice,
splice         = ArrayProto.splice,
concat         = ArrayProto.concat,
unshift        = ArrayProto.unshift,
indexOf        = ArrayProto.indexOf,
lastIndexOf    = ArrayProto.lastIndexOf,
toString       = ObjectProto.toString,
hasOwnProperty = ObjectProto.hasOwnProperty,
toFuncString   = FunctionProto.toString,
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

// Regular expression patterns.
RE_RESCAPE         = /([-.*+?^${}()|[\]\/\\])/g,
RE_PERCENT_ENCODED = /^(?:[a-zA-Z0-9_~.-]|%[0-9a-fA-F]{2})*$/,
RE_ARRAYLIKE       = /List|Collection/i,
RE_TRIM            = /^[\s\u00A0\u3000]+|[\s\u00A0\u3000]+$/g,

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
    var r = {}, m, ua, ver, i, len, re = {
      webkit  : /(webkit)(?:.*version|)[\s\/]+([\w.]+)/,
      opera   : /(opera)(?:.*version|)[\s\/]+([\w.]+)/,
      msie    : /(msie)[\s\/]+([\w.]+)/,
      mozilla : /(?!^.*compatible.*$).*(mozilla)(?:.*?\s+rv[:\s\/]+([\w.]+)|)/
    },
    rs = [
      /webkit.*version[\s\/]+([\w.]+).*(safari)/,
      /webkit.*(chrome|safari)[\s\/]+([\w.]+)/,
      /(iphone|ipod|ipad|android).*version[\s\/]+([\w.]+)/,
      /(blackberry)(?:[\s\d]*|.*version)[\s\/]+([\w.]+)/,
      re.webkit,
      re.opera,
      re.msie,
      /(?!^.*compatible.*$).*mozilla.*?(firefox)(?:[\s\/]+([\w.]+)|)/,
      re.mozilla
    ],
    u = ('' + (n && n.userAgent)).toLowerCase();
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
          r[ua] = {version : '' + (ver || 0)};
        }
      }
      m = re.webkit.exec(u) || re.opera.exec(u)   ||
          re.msie.exec(u)   || re.mozilla.exec(u) || [];
      if (m && m[1]) {
        r[m[1]] = {version : '' + (m[2] || 0)};
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
    var r = {}, n = nv || {}, i, len, o,
        pf = ('' + (n.platform)).toLowerCase(),
        ua = ('' + (n.userAgent)).toLowerCase(),
        av = ('' + (n.appVersion)).toLowerCase(),
        maps = [
          {s : 'iphone',     p : pf},
          {s : 'ipod',       p : pf},
          {s : 'ipad',       p : ua},
          {s : 'blackberry', p : ua},
          {s : 'android',    p : ua},
          {s : 'mac',        p : pf},
          {s : 'win',        p : pf},
          {s : 'linux',      p : pf},
          {s : 'x11',        p : av}
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
    var g = (new Function('return this;'))();
    if (!globals ||
        typeof globals !== 'object' || !('setTimeout' in globals)) {
      globals = this || g || {};
    }
    return this || g || {};
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
    getMagicNumber : (function(sn) {
      var c = 0, n = +sn;
      return function() {
        var i = n + (c++);
        if (!isFinite(i) || isNaN(i)) {
          c = n = i = 0;
        }
        return i;
      };
    }('0xC26BEB642C0A')),
    /**
     * Get the export object.
     *
     * @private
     * @ignore
     */
    getExportObject : function(forGlobalScope) {
      var outputs, id, valid;
      if (forGlobalScope) {
        if (PotSystem.isNonBrowser) {
          outputs = PotGlobal || globals;
        } else {
          outputs = (isWindow(globals) && globals) ||
                    (isWindow(PotGlobal) && PotGlobal) ||
                     Pot.currentWindow();
        }
        if (!outputs &&
            typeof window !== 'undefined' && isWindow(window)) {
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
              outputs[id] = void 0;
            } catch (e) {}
          }
          if (!valid) {
            outputs = PotGlobal;
          }
        }
      }
      if (!outputs) {
        if (PotSystem.isNodeJS) {
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
          outputs = globals || PotGlobal || Pot.currentWindow();
        }
      }
      return outputs;
    },
    /**
     * Pot.js Script Implementation.
     *
     * @private
     * @ignore
     */
    ScriptImplementation : PotScriptImplementation
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

// Refer the Pot properties.
PotSystem   = Pot.System;
PotPlugin   = Pot.Plugin;
PotToString = Pot.toString;
PotBrowser  = Pot.Browser;
PotLang     = Pot.LANG;
PotOS       = Pot.OS;
PotGlobal   = Pot.Global;
PotNoop     = Pot.noop;
PotTmp      = Pot.tmp;
PotInternal = Pot.Internal;


// Definition of System.
update(PotSystem, (function() {
  var o = {}, g, ws, b, u, ua, ca;
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
        if (PotBrowser.firefox || PotBrowser.mozilla) {
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
  if (PotGlobal && PotGlobal.ActiveXObject ||
      typeof ActiveXObject !== 'undefined' && ActiveXObject) {
    o.hasActiveXObject = true;
  }
  if (!o.isFirefoxExtension) {
    if (PotBrowser.chrome || PotBrowser.webkit || PotBrowser.safari) {
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
    g = (new Function('yield(0);'))();
    if (g && typeof g.next === 'function') {
      o.isYieldable = true;
    }
  } catch (e) {}
  try {
    if (typeof FileReader !== 'undefined' &&
        typeof FileReader.LOADING !== 'undefined' &&
        typeof (new FileReader()).readAsText === 'function') {
      o.hasFileReader = true;
    }
  } catch (e) {}
  try {
    if (typeof Blob === 'function' &&
        toString.call(new Blob()) === '[object Blob]' &&
        typeof Blob.prototype.slice === 'function') {
      o.hasBlob = true;
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
      if (b &&
          typeof MozBlobBuilder !== 'undefined' && b === MozBlobBuilder) {
        o.isMozillaBlobBuilder = true;
      }
    }
  } catch (e) {}
  /**@ignore*/
  o.createBlob = function() {
    if (o.hasBlob) {
      return function(value, type) {
        var arr = concat.call([], value);
        if (type) {
          return new Blob(arr, {type : type});
        } else {
          return new Blob(arr);
        }
      };
    } else if (o.BlobBuilder) {
      return function(value, type) {
        var blb = new o.BlobBuilder();
        blb.append(value);
        if (type) {
          return blb.getBlob(type);
        } else {
          return blb.getBlob();
        }
      };
    }
  }();
  try {
    u = (typeof URL       !== 'undefined') ? URL       :
        (typeof webkitURL !== 'undefined') ? webkitURL : null;
    if (!u || typeof u.createObjectURL !== 'function') {
      u = null;
    } else {
      o.BlobURI = u;
    }
  } catch (e) {}
  ws = [];
  if (typeof Worker === 'function') {
    ws.push([Worker, 'Worker']);
  }
  if (typeof ChromeWorker === 'function') {
    ws.push([ChromeWorker, 'ChromeWorker']);
  }
  while (ws.length) {
    (function() {
      var item = ws.shift(),
          worker = item[0],
          key    = item[1],
          hasWorker           = 'has' + key,
          canWorkerDataURI    = 'can' + key + 'DataURI',
          canWorkerBlobURI    = 'can' + key + 'BlobURI',
          canWorkerPostObject = 'can' + key + 'PostObject',
          ref, msg, w, wb;
      /**@ignore*/
      ref = function() {
        return 1;
      };
      msg = {
        /**@ignore*/
        a : function() {
          return ref();
        }
      };
      try {
        if (typeof worker.prototype.postMessage === 'function') {
          // hasWorker: 'hasWorker' or 'hasChromeWorker'
          o[hasWorker] = true;
          w = new worker(
            'data:application/javascript;base64,' +
            // base64:
            // onmessage = function(e) {
            //   postMessage(
            //     (e && e.data &&
            //       ((typeof e.data.a === 'function' && e.data.a()) ||
            //         e.data
            //       )
            //     ) + 1
            //   )
            // }
            'b25tZXNzYWdlPWZ1bmN0aW9uKGUpe3Bvc3RNZXNzYWdlKChlJiZlLmRhdGEmJ' +
            'igodHlwZW9mIGUuZGF0YS5hPT09J2Z1bmN0aW9uJyYmZS5kYXRhLmEoKSl8fG' +
            'UuZGF0YSkpKzEpfQ=='
          );
          /**@ignore*/
          w.onmessage = function(ev) {
            if (ev) {
              switch (ev.data) {
                case (msg.a() + 1):
                    // canWorkerPostObject:
                    //   'canWorkerPostObject' or 'canChromeWorkerPostObject'
                    PotSystem[canWorkerPostObject] = true;
                    // FALL THROUGH
                case (msg + 1):
                case 'x1':
                    // canWorkerDataURI:
                    //   'canWorkerDataURI' or 'canChromeWorkerDataURI'
                    PotSystem[canWorkerDataURI] = true;
              }
            }
            try {
              w.terminate();
            } catch (ex) {}
          };
          try {
            w.postMessage(msg);
          } catch (ex) {
            w.postMessage('x');
          }
        }
      } catch (e) {}
      if (o[hasWorker] && o.createBlob && o.BlobURI) {
        try {
          wb = new worker(o.BlobURI.createObjectURL(o.createBlob(
            'onmessage=function(e){' +
              'postMessage(' +
                '(e&&e.data&&' +
                  '((typeof e.data.a==="function"&&e.data.a())||e.data)' +
                ')+1' +
              ')' +
            '}'
          )));
          /**@ignore*/
          wb.onmessage = function(ev) {
            if (ev) {
              switch (ev.data) {
                case (msg.a() + 1):
                    PotSystem[canWorkerPostObject] = true;
                    // FALL THROUGH
                case (msg + 1):
                case 'x1':
                    // canWorkerBlobURI:
                    //   'canWorkerBlobURI' or 'canChromeWorkerBlobURI'
                    PotSystem[canWorkerBlobURI] = true;
              }
            }
            try {
              wb.terminate();
            } catch (ex) {}
          };
          try {
            wb.postMessage(msg);
          } catch (ex) {
            wb.postMessage('x');
          }
        } catch (e) {}
      }
    }());
  }
  try {
    if (typeof ArrayBuffer !== 'undefined' &&
        (new ArrayBuffer(10)).byteLength === 10 &&
        typeof Uint8Array !== 'undefined' &&
        (new Uint8Array([0, 312])).subarray(1)[0] === 56
    ) {
      o.hasTypedArray = true;
      try {
        ua = new Uint8Array([1, 2]);
        ca = new Uint8Array(ua.subarray(0));
        ca[0] = 5;
        if (ua[0] === 1 && ca[0] === 5) {
          o.canCopyTypedArray = true;
        }
        ua = ca = null;
      } catch (ex) {}
      try {
        if (typeof Uint8ClampedArray !== 'undefined' &&
            (new Uint8ClampedArray([0, 312])).subarray(1)[0] === 255) {
          o.hasUint8ClampedArray = true;
        }
      } catch (ex) {}
      if (typeof DataView !== 'undefined' &&
          (new DataView(new Uint8Array([
            0x10, 0x20, 0x40, 0x80
          ]).buffer)).getUint32(0) === 0x10204080) {
        o.hasDataView = true;
      }
    }
  } catch (e) {}
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
  var i = 0, len = types.length, typeMaps = {};
  for (; i < len; i++) {
    (function() {
      var type = types[i], low = type.toLowerCase();
      typeMaps[buildObjectString(type)] = low;
      Pot['is' + type] = (function() {
        switch (low) {
          case 'error':
              return function(o) {
                return (o != null &&
                        (o instanceof Error || typeOf(o) === low)
                       ) || false;
              };
          case 'date':
              return function(o) {
                return (o != null &&
                        (o instanceof Date || typeOf(o) === low)
                       ) || false;
              };
          default:
              return function(o) {
                return typeOf(o) === low;
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
      var type = typeOf(o);
      if (type !== 'array' && isArrayLike(o)) {
        type = 'array';
      }
      return type;
    }
  });
}('Boolean Number String Function Array Date RegExp Object Error'.split(' ')));

// Refer variables.
isBoolean   = Pot.isBoolean;
isNumber    = Pot.isNumber;
isString    = Pot.isString;
isFunction  = Pot.isFunction;
isArray     = Pot.isArray;
isDate      = Pot.isDate;
isRegExp    = Pot.isRegExp;
isObject    = Pot.isObject;
isError     = Pot.isError;
isArrayLike = Pot.isArrayLike;
typeOf      = Pot.typeOf;
typeLikeOf  = Pot.typeLikeOf;
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
(function(SI) {
// Aggregate in this obejct for global functions. (HTML5 Task)
update(PotInternal, {
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
      if (PotSystem.isNonBrowser || PotSystem.isNodeJS ||
          typeof window !== 'object'  || typeof document !== 'object' ||
          typeof Image !== 'function' || window.opera || PotBrowser.opera ||
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
        var done, handler, img = new Image();
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
      if (!PotSystem.isNodeJS || typeof process !== 'object' ||
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
   * @lends Pot.Internal
   */
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
      return PotInternalCallInBackground.byTimer(func, msec || 0);
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

// Refer objects.
PotInternalCallInBackground = PotInternal.callInBackground;
PotInternalSetTimeout       = PotInternal.setTimeout;
PotInternalClearTimeout     = PotInternal.clearTimeout;

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
      toString : PotToString
    });
    f.prototype = {
      constructor : f,
      NAME        : f.NAME,
      toString    : f.toString
    };
    f.prototype.constructor.prototype = f.constructor.prototype;
    return new f();
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
    if (o &&
        (
          (PotStopIteration !== void 0 &&
            (o == PotStopIteration || o instanceof PotStopIteration)
          ) ||
          (typeof StopIteration === 'object' &&
            (o == StopIteration || o instanceof StopIteration)
          ) ||
          (this && this.StopIteration !== void 0 &&
            (o == this.StopIteration || o instanceof this.StopIteration)
          ) ||
          (~toString.call(o).indexOf(SI) ||
            ~String(o && o.toString && o.toString() || o).indexOf(SI)
          ) ||
          (isError(o) && o[SI] && !(SI in o[SI]) &&
            !isError(o[SI]) && isStopIter(o[SI])
          )
        )
    ) {
      return true;
    } else {
      return false;
    }
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
    return !!(x && isFunction(x.next) &&
         (~Pot.getFunctionCode(x.next).indexOf(SI) ||
           Pot.isNativeCode(x.next)));
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
    return x != null && (isString(x) || isNumber(x) || isBoolean(x));
  },
  /**
   * Check whether the argument is Blob or not.
   *
   *
   * @example
   *   var bb = new Pot.System.BlobBuilder();
   *   bb.append('hoge');
   *   var blob = bb.getBlob();
   *   Pot.debug(Pot.isBlob(blob));   // true
   *   Pot.debug(Pot.isBlob({}));     // false
   *   Pot.debug(Pot.isBlob('hoge')); // false
   *
   *
   * @param  {*}         x   Target object.
   * @return {Boolean}       Return true if argument is Blob.
   * @type Function
   * @function
   * @static
   * @public
   */
  isBlob : function(x) {
    return !!(x && toString.call(x) === '[object Blob]');
  },
  /**
   * Check whether the argument is a instance of FileReader or not.
   *
   *
   * @example
   *   var object = {hoge : 1};
   *   var reader = new FileReader();
   *   Pot.debug(Pot.isFileReader(object)); // false
   *   Pot.debug(Pot.isFileReader(reader)); // true
   *
   *
   * @param  {*}         x   Target object.
   * @return {Boolean}       Return true if argument is FileReader.
   * @type Function
   * @function
   * @static
   * @public
   */
  isFileReader : function(x) {
    return !!(PotSystem.hasFileReader && x && x.constructor === FileReader);
  },
  /**
   * Check whether the argument is a instance of Image or not.
   *
   *
   * @example
   *   var object = {hoge : 1};
   *   var image = new Image();
   *   Pot.debug(Pot.isImage(object)); // false
   *   Pot.debug(Pot.isImage(image));  // true
   *
   *
   * @param  {*}         x   Target object.
   * @return {Boolean}       Return true if argument is Image.
   * @type Function
   * @function
   * @static
   * @public
   */
  isImage : function() {
    var hasImage = (typeof Image === 'function') ||
                   (PotBrowser.msie && typeof Image === 'object');
    return function(x) {
      return !!(hasImage && x &&
                (x.constructor === Image ||
                 toString.call(x) === '[object HTMLImageElement]' ||
                 stringify(x.tagName).toLowerCase() === 'img'
                )
               );
    };
  }(),
  /**
   * Check whether the argument is Arguments object or not.
   *
   *
   * @example
   *   (function(a, b, c) {
   *     var obj = {foo : 1};
   *     var arr = [1, 2, 3];
   *     debug(isArguments(obj));       // false
   *     debug(isArguments(arr));       // false
   *     debug(isArguments(arguments)); // true
   *   }(1, 2, 3));
   *
   *
   * @param  {*}         x   Target object.
   * @return {Boolean}       Return true if argument is Arguments object.
   * @type Function
   * @function
   * @static
   * @public
   */
  isArguments : function(x) {
    var result = false;
    if (x) {
      if (toString.call(x) === '[object Arguments]') {
        result = true;
      } else {
        try {
          if ('callee' in x && typeof x.length === 'number') {
            result = true;
          }
        } catch (e) {}
      }
    }
    return result;
  },
  /**
   * Check whether the argument is TypedArray object or not.
   *
   *
   * @example
   *   var obj = {foo : 1};
   *   var arr = [1, 2, 3];
   *   var buf = new ArrayBuffer(10);
   *   var uar = new Uint8Array(10);
   *   debug(isTypedArray(obj)); // false
   *   debug(isTypedArray(arr)); // false
   *   debug(isTypedArray(buf)); // true
   *   debug(isTypedArray(uar)); // true
   *
   *
   * @param  {*}         x   Target object.
   * @return {Boolean}       Return true if argument is TypedArray object.
   * @type Function
   * @function
   * @static
   * @public
   */
  isTypedArray : function(x) {
    var result = false;
    if (x && PotSystem.hasTypedArray && 
        (x.constructor === ArrayBuffer ||
          (x.buffer && x.buffer.constructor === ArrayBuffer)
        )
    ) {
      result = true;
    }
    return result;
  },
  /**
   * Check whether the argument is ArrayBuffer object or not.
   *
   *
   * @example
   *   var obj = {foo : 1};
   *   var arr = [1, 2, 3];
   *   var buf = new ArrayBuffer(10);
   *   var uar = new Uint8Array(10);
   *   debug(isArrayBuffer(obj)); // false
   *   debug(isArrayBuffer(arr)); // false
   *   debug(isArrayBuffer(buf)); // true
   *   debug(isArrayBuffer(uar)); // false
   *
   *
   * @param  {*}         x   Target object.
   * @return {Boolean}       Return true if argument is ArrayBuffer object.
   * @type Function
   * @function
   * @static
   * @public
   */
  isArrayBuffer : function(x) {
    return !!(PotSystem.hasTypedArray && x && x.constructor === ArrayBuffer);
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
    if (isArray(o) || o instanceof Array || o.constructor === Array ||
        isTypedArray(o)) {
      return true;
    }
    len = o.length;
    if (!isNumber(len) || (!isObject(o) && !isArray(o)) ||
         o === Pot  || o === PotGlobal || o === globals ||
        isWindow(o) ||  isDocument(o)  || isElement(o)
    ) {
      return false;
    }
    if (o.isArray || Pot.isArguments(o) || isNodeList(o) ||
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
    return x != null && ((x instanceof Deferred) ||
     (x.id   != null && x.id   === Deferred.fn.id &&
      x.NAME != null && x.NAME === Deferred.fn.NAME));
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
    return x != null && ((x instanceof Iter) ||
     (x.id   != null && x.id   === Iter.fn.id &&
      x.NAME != null && x.NAME === Iter.fn.NAME &&
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
    return x != null && ((x instanceof Workeroid) ||
     (x.id   != null && x.id   === Workeroid.fn.id &&
      x.NAME != null && x.NAME === Workeroid.fn.NAME));
  },
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
   * @return {Boolean}     Whether `n` is an integer.
   * @type Function
   * @function
   * @static
   * @public
   */
  isInt : function(n) {
    return isNumber(n) && isFinite(n) && n % 1 == 0;
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
    if (Pot.getFunctionCode) {
      code = Pot.getFunctionCode(method);
    } else if (isFunction(method)) {
      code = toFuncString.call(method);
    } else if (method.toString) {
      code = method.toString();
    } else {
      code = '' + method;
    }
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
    if (x && isNumber(x.length)) {
      type = typeof x.item;
      if (isObject(x)) {
        return type === 'function' || type === 'string';
      } else if (isFunction(x)) {
        return type === 'function';
      }
    }
    return false;
  }
});
}('StopIteration'));

// Refer the Pot properties/functions.
PotStopIteration = Pot.StopIteration;
isTypedArray     = Pot.isTypedArray;
isArrayBuffer    = Pot.isArrayBuffer;
isArrayLike      = Pot.isArrayLike;
isNumeric        = Pot.isNumeric;
isStopIter       = Pot.isStopIter;
isDeferred       = Pot.isDeferred;
isHash           = Pot.isHash;
isIter           = Pot.isIter;
isWorkeroid      = Pot.isWorkeroid;
isWindow         = Pot.isWindow;
isDocument       = Pot.isDocument;
isElement        = Pot.isElement;
isNodeList       = Pot.isNodeList;
isNodeLike       = Pot.isNodeLike;

// Definition of current Document and URI.
(function() {
  var win, doc, uri, wp, dp, a;
  wp = 'window contentWindow defaultView parentWindow content top'.split(' ');
  dp = 'ownerDocument document'.split(' ');
  /**@ignore*/
  function detectWindow(x) {
    var w;
    if (x) {
      if (isWindow(x)) {
        w = x;
      } else {
        each(wp, function(p) {
          try {
            if (isWindow(x[p])) {
              w = x[p];
            }
            if (x[p].content && isWindow(x[p].content)) {
              w = x[p].content;
            }
          } catch (e) {}
          if (w) {
            throw PotStopIteration;
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
      if (isDocument(x)) {
        d = x;
      } else {
        each(dp, function(p) {
          try {
            if (isDocument(x[p])) {
              d = x[p];
            }
            if (x[p].content && isDocument(x[p].content.document)) {
              d = x[p].content.document;
            }
          } catch (e) {}
          if (d) {
            throw PotStopIteration;
          }
        });
      }
    }
    return d;
  }
  each([
    globals,
    PotGlobal,
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
        throw PotStopIteration;
      }
    }
  });
  if (PotSystem.isNodeJS) {
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
  update(PotSystem, {
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
      return PotSystem.currentWindow;
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
      return PotSystem.currentDocument;
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
      return PotSystem.currentURI;
    }
  });
}());

// Definition of builtin method states.
update(PotSystem, {
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
  isBuiltinArrayForEach : Pot.isBuiltinMethod(ArrayProto.forEach),
  /**
   * Whether the environment supports the built-in "Array.prototype.indexOf".
   *
   * @type  Boolean
   * @const
   */
  isBuiltinArrayIndexOf : Pot.isBuiltinMethod(ArrayProto.indexOf),
  /**
   * Whether the environment supports
   *   the built-in "Array.prototype.lastIndexOf".
   *
   * @type  Boolean
   * @const
   */
  isBuiltinArrayLastIndexOf : Pot.isBuiltinMethod(ArrayProto.lastIndexOf)
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
      if (isArrayLike(object)) {
        len = object.length;
        for (i = 0; i < len; i++) {
          if (i in object) {
            results[results.length] = i;
          }
        }
      } else {
        if (PotSystem.isBuiltinObjectKeys) {
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
    var me = Pot.globalEval, id, scope, func, doc, script, head;
    if (code && me.patterns.valid.test(code)) {
      if (PotSystem.hasActiveXObject) {
        if (typeof execScript !== 'undefined' && execScript &&
            me.test(execScript)) {
          return execScript(code, me.language);
        } else {
          func = 'execScript';
          if (func in globals && me.test(func, globals)) {
            return globals[func](code, me.language);
          } else if (func in PotGlobal && me.test(func, PotGlobal)) {
            return PotGlobal[func](code, me.language);
          }
        }
      }
      func = 'eval';
      if (func in globals && me.test(func, globals)) {
        scope = globals;
      } else if (func in PotGlobal && me.test(func, PotGlobal)) {
        scope = PotGlobal;
      }
      if (PotSystem.isGreasemonkey) {
        // eval does not work to global scope in greasemonkey
        //   even if using the unsafeWindow.
        return Pot.localEval(code, scope || PotGlobal);
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
      if (PotSystem.isNodeJS) {
        return me.doEvalInGlobalNodeJS(func, code);
      }
      if (PotSystem.isWebBrowser &&
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
          if (PotSystem.hasActiveXObject && 'text' in script) {
            script.text = code;
          } else {
            script.appendChild(doc.createTextNode(code));
          }
          head.appendChild(script);
          head.removeChild(script);
        }
      } else {
        return Pot.localEval(code, scope || PotGlobal);
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
      var result, me = Pot.globalEval.doEvalInGlobalNodeJS,
          vm, script, scope = PotGlobal, id;
      if (me.worksForGlobal == null) {
        try {
          me.worksForGlobal = false;
          do {
            id = buildSerial(Pot, '');
          } while (id in scope);
          scope[id] = 1;
          scope[func].call(scope, 'try{delete ' + id + ';}catch(e){}');
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
      } else if (typeof require !== 'undefined' && require) {
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
    var that = Pot.globalEval, me = Pot.localEval, func, context;
    if (code && that.patterns.valid.test(code)) {
      func = 'eval';
      if (func in globals && that.test(func, globals)) {
        context = globals;
      } else if (func in PotGlobal && that.test(func, PotGlobal)) {
        context = PotGlobal;
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
    if (isFunction(func)) {
      return toFuncString.call(func);
    }
    if (isString(func)) {
      if (func.toString) {
        return func.toString();
      }
      return '' + func;
    }
    return '';
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
      return isString(c) && !isSpace.test(c) && !notWord.test(c);
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
      return isString(c) && !notNL.test(c);
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
      if (isArray(tokens)) {
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
      code = Pot.getFunctionCode(func);
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
        if (isFunction(converters)) {
          t = converters;
          converters = overrider;
          overrider = t;
        }
      } else {
        if (isFunction(converters)) {
          overrider = converters;
        }
      }
      if (isRegExp(converters)) {
        converters = [converters, ''];
      } else if (isString(converters)) {
        converters = [new RegExp(rescape(converters), 'g'), ''];
      }
      each(arrayize(properties), function(name) {
        if (name) {
          each(object, function(val, prop) {
            if (isFunction(val) &&
                ((isRegExp(name) && name.test(prop)) || name == prop)) {
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
            code = org = Pot.getFunctionCode(method);
            patterns = arrayize(converters);
            if (!isArray(patterns[0])) {
              patterns = [patterns];
            }
            each(patterns, function(pattern) {
              var from, to;
              try {
                from = pattern[0];
                to   = pattern[1];
                if (isString(from)) {
                  from = new RegExp(rescape(from), 'g');
                }
                if (!isString(to)) {
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
            if (isFunction(overrider)) {
              return overrider.call(that, function() {
                var a = arguments;
                if (a.length === 1 && a[0] &&
                     Pot.isArguments(a[0]) && a[0] === args) {
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
              isNumber(object[prop].overridden)) {
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
    if (isError(error)) {
      msg = String(error.message  || error.description ||
                  (error.toString && error.toString()) || error);
    } else {
      msg = (error && error.toString && error.toString()) || error;
    }
    return stringify(msg) || stringify(defaults) || 'error';
  },
  /**
   * Create new instance of Blob.
   *
   *
   * @example
   *   Pot.begin(function() {
   *     var blob = Pot.createBlob('hoge');
   *     var reader = new FileReader();
   *     reader.readAsText(blob);
   *     return reader;
   *   }).then(function(res) {
   *     Pot.debug(res); // 'hoge'
   *   });
   *
   *
   * @param  {*}         value   value.
   * @param  {(String)}  (type)  Optional MIME type.
   * @return {Blob}              Return new instance of Blob.
   * @type  Function
   * @function
   * @static
   * @public
   */
  createBlob : function(value, type) {
    if (PotSystem.createBlob) {
      try {
        return PotSystem.createBlob(value, type);
      } catch (e) {}
    }
    return null;
  },
  /**
   * Create a constructor with prototype.
   *
   * That will set the toString method to constructor
   *   if argument `name` specified.
   * If argument `init` has been specified in the string,
   *   then that method will be used to initialize.
   * If argument `init` has been specified in a function,
   *   then initialization will be execute by `init`.
   * If omitted argument `init`, and `proto` has 'init' function
   *   then initialization will be execute by 'init' function.
   *
   *
   * @example
   *   var Hoge = Pot.createConstructor('Hoge', {
   *     init : function(a, b, c) {
   *       this.value = a + b + c;
   *     },
   *     getHoge : function() {
   *       return 'hogehoge';
   *     }
   *   });
   *   Pot.debug(new Hoge(1, 2, 3).value); // 6
   *   Pot.debug(new Hoge().getHoge());    // 'hogehoge'
   *
   *
   * @example
   *   var Fuga = Pot.createConstructor({
   *     value : 1,
   *     addValue : function(v) {
   *       this.value += v;
   *       return this;
   *     },
   *     getValue : function() {
   *       return this.value;
   *     }
   *   }, function(a, b, c) {
   *     this.value += a + b + c;
   *   });
   *   Pot.debug(new Fuga(1, 2, 3).value); // 7
   *   Pot.debug(new Fuga(1, 2, 3).addValue(10).getValue()); // 17
   *
   *
   * @example
   *   var Piyo = Pot.createConstructor('Piyo', {
   *     initialize : function(a, b, c) {
   *       this.value = a + b + c;
   *     },
   *     getValue : function() {
   *       return this.value;
   *     }
   *   }, 'initialize');
   *   Pot.debug(new Piyo(10, 20, 30).getValue()); // 60
   *
   *
   * @param  {(String)} (name)  (Optional) A name of constructor.
   * @param  {Object}  (proto)  prototype.
   * @param  {(Function|String)} (init) (Optional) initialization method name
   *                                    or initialization function.
   * @return {Function} Return new constructor.
   * @type  Function
   * @function
   * @static
   * @public
   */
  createConstructor : function(name, proto, init) {
    var c, p, n, def = 'init';
    if (isString(name)) {
      n = name;
    } else {
      init = proto;
      proto = name;
    }
    p = proto || {};
    if (!init && def in p) {
      init = def;
    }
    if (isString(init) && init in p) {
      /**@ignore*/
      c = function() {
        this[init].apply(this, arguments);
      };
    } else if (isFunction(init)) {
      proto.init = init;
      /**@ignore*/
      c = function() {
        this.init.apply(this, arguments);
      };
    }
    if (!c) {
      /**@ignore*/
      c = function() {};
    }
    c.prototype = p;
    c.prototype.constructor = c;
    if (n) {
      /**@ignore*/
      c.prototype.toString = function() {
        return buildObjectString(n);
      };
    }
    return c;
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
  var array, i, len, me = arrayize, t;
  if (me.canNodeList == null) {
    // NodeList cannot convert to the Array in the Blackberry, IE browsers.
    if (PotSystem.currentDocument) {
      try {
        t = slice.call(
          PotSystem.currentDocument.documentElement.childNodes
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
    switch (typeOf(object)) {
      case 'array':
          array = object.slice();
          break;
      case 'object':
          if (isArrayLike(object)) {
            if (!me.canNodeList && isNodeList(object)) {
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
            //XXX: TypedArray String convertion.
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
  var args = arrayize(arguments), argn = args.length,
      object, method, params, emit, p, t, i, len, err;
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
    }
    if (!method) {
      throw method;
    }
    if (!object && isString(method)) {
      object = (object && object[method] && object)  ||
             (globals && globals[method] && globals) ||
          (PotGlobal && PotGlobal[method] && PotGlobal);
    }
    if (isString(method)) {
      emit = true;
      if (!object) {
        object = (globals || PotGlobal);
      }
    }
  } catch (e) {
    err = e;
    throw isError(err) ? err : new Error(err);
  }
  if (isFunction(method.apply) && isFunction(method.call)) {
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
      }
    } else {
      switch (len) {
        case 0: return method();
        case 1: return method(p[0]);
        case 2: return method(p[0], p[1]);
        case 3: return method(p[0], p[1], p[2]);
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
  var args = arguments, me = debug, func, consoleService;
  try {
    if (!me.firebug('log', args)) {
      if (!PotSystem.hasComponents) {
        throw false;
      }
      consoleService = Cc['@mozilla.org/consoleservice;1']
                      .getService(Ci.nsIConsoleService);
      consoleService.logStringMessage(String(msg));
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console) {
      func = console.debug || console.dir || console.log;
    } else if (typeof opera !== 'undefined' && opera && opera.postError) {
      func = opera.postError;
    } else if (typeof GM_log === 'function') {
      func = GM_log;
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

/**
 * @ignore
 */
function error(msg) {
  var args = arguments, func;
  try {
    if (!debug.firebug('error', args)) {
      if (!PotSystem.hasComponents) {
        throw false;
      }
      Cu.reportError(msg);
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console) {
      func = console.error || console.debug || console.dir || console.log;
    } else if (typeof opera !== 'undefined' && opera && opera.postError) {
      func = opera.postError;
    } else if (typeof GM_log === 'function') {
      func = GM_log;
    } else {
      /**@ignore*/
      func = function(x) { throw x; };
    }
    try {
      if (func.apply) {
        func.apply(func, args);
      } else {
        func(msg);
      }
    } catch (e) {
      throw msg;
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
      if (!PotSystem.hasComponents) {
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
    var r, me = debug.dump, repr;
    /**@ignore*/
    repr = function(x) {
      return (x == null) ? String(x)    :
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
    switch (typeLikeOf(o)) {
      case 'array':
          each(o, function(v) {
            r[r.length] = me(v);
          });
          return '[' + r.join(', ') + ']';
      case 'object':
          if (isNodeLike(o) || isWindow(o) || isDocument(o)) {
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
    var me = debug.divConsole, ie6, doc, de, onResize, onScroll, onClick;
    if (PotSystem.hasActiveXObject && typeof document !== 'undefined') {
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
          Deferred.till(function() {
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
              Deferred.wait(0.25).then(function() {
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
            if (isString(v) &&
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
          PotInternalSetTimeout(function() {
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
  debug : debug,
  /**
   * Output to the console using 'error' function for error logging.
   *
   *
   * @example
   *   Pot.error('Error!'); // Error!
   *
   *
   * @param  {*}  msg  An error message, or variable.
   * @type Function
   * @function
   * @public
   * @static
   */
  error : error
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
      if (isArrayLike(object)) {
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
      if (!isStopIter(err)) {
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
    if (isObject(o.options)) {
      a = o.options;
    } else if (isObject(o)) {
      a = o;
    }
    if (isObject(x.options)) {
      b = x.options;
    } else if (isObject(x)) {
      b = x;
    }
    if ('async' in b) {
      a.async = !!b.async;
    }
    if ('speed' in b && isNumeric(b.speed)) {
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
    return isDeferred(this) ? this.init(arguments)
                            : new Deferred.fn.init(arguments);
  }
});

// Refer the Pot properties/functions.
Deferred = Pot.Deferred;

// Definition of the prototype and static properties.
update(Deferred, {
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
  StopIteration : PotStopIteration,
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

each(Deferred.states, function(n, name) {
  Deferred.states[n] = name;
});

update(Deferred, {
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
    speed     : Deferred.speeds.ninja,
    canceller : null,
    stopper   : null,
    async     : true
  }
});

// Definition of the prototype.
Deferred.fn = Deferred.prototype = update(Deferred.prototype, {
  /**
   * @lends Pot.Deferred.prototype
   */
  /**
   * @ignore
   */
  constructor : Deferred,
  /**
   * @private
   * @ignore
   */
  id : PotInternal.getMagicNumber(),
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
  toString : PotToString,
  /**
   * isDeferred.
   *
   * @type Function
   * @function
   * @static
   * @public
   */
  isDeferred : isDeferred,
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
    initOptions.call(this, arrayize(args), Deferred.defaults);
    update(this, {
      results     : {
        success   : null,
        failure   : null
      },
      state       : Deferred.states.unfired,
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
    PotInternal.referSpeeds.call(this, Deferred.speeds);
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
    if (isNumeric(sp)) {
      value = sp - 0;
    } else if (isNumeric(Deferred.speeds[sp])) {
      value = Deferred.speeds[sp] - 0;
    } else {
      value = this.options.speed;
    }
    if (this.state === Deferred.states.unfired && !this.chains.length) {
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
    if (this.state === Deferred.states.unfired && !this.chains.length) {
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
    if (this.state === Deferred.states.unfired && !this.chains.length) {
      if (args.length === 0) {
        return this.options.cancellers;
      }
      if (!this.cancelled && isFunction(func)) {
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
    if (this.state === Deferred.states.unfired && !this.chains.length) {
      this.canceller.apply(this, args);
    } else {
      this.then(function(reply) {
        if (args.length === 0) {
          return that.options.stoppers;
        }
        if (!that.cancelled && isFunction(func)) {
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
      if (this.state & Deferred.states.fired) {
        if (!this.freezing && !this.tilling && !this.waiting) {
          fire.call(this);
        }
      }
    }
    PotInternal.referSpeeds.call(this, Deferred.speeds);
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
        case Deferred.states.unfired:
            cancelize.call(this, 'cancellers');
            if (this.state === Deferred.states.unfired) {
              this.raise(new Error(this));
            }
            break;
        case Deferred.states.success:
            cancelize.call(this, 'stoppers');
            if (isDeferred(this.results.success)) {
              this.results.success.cancel();
            }
            break;
        case Deferred.states.failure:
            cancelize.call(this, 'stoppers');
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
    if (!this.cancelled && this.state === Deferred.states.unfired) {
      if (isDeferred(arg) && !arg.cancelled) {
        arg.ensure(function() {
          that.begin.apply(this, arguments);
        });
      } else {
        this.options.cancellers = [];
        post.call(this, value);
      }
    }
    PotInternal.referSpeeds.call(this, Deferred.speeds);
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
    if (!isError(arg)) {
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
    var d = new Deferred(), that = this, args = arguments;
    return this.then(function(reply) {
      if (isError(reply)) {
        throw reply;
      }
      that.waiting = true;
      Deferred.wait(seconds).ensure(function(result) {
        that.waiting = false;
        if (isError(result)) {
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
    var that = this, d = new Deferred();
    return this.then(function(reply) {
      if (isError(reply)) {
        throw reply;
      }
      that.tilling = true;
      Deferred.till(cond, reply).ensure(function(result) {
        that.tilling = false;
        if (isError(result)) {
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
      return Deferred.lastResult(this);
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
          if (isFunction(a[0])) {
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
    var that = this, result = this, args = arrayize(arguments),
        i, len = args.length, prefix = '.';
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
            } else if (isObject(args[0])) {
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
    var that = Deferred.fn, args = arrayize(arguments);
    args.unshift(that);
    update.apply(that, args);
    return this;
  }
});

Deferred.fn.init.prototype = Deferred.fn;
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
  if (isError(value)) {
    this.state = Deferred.states.failure;
  } else {
    this.state = Deferred.states.success;
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
  this.results[Deferred.states[this.state]] = value;
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
  if (this.options && isNumeric(this.options.speed)) {
    speed = this.options.speed;
  } else {
    speed = Deferred.defaults.speed;
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
  if (!speed && this.state === Deferred.states.unfired) {
    PotInternalCallInBackground.flush(callback);
  } else {
    PotInternalSetTimeout(callback, speed);
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
  var that = this, result, reply, callbacks, callback, nesting = null, isStop;
  clearChainDebris.call(this);
  result = this.results[Deferred.states[this.state]];
  while (chainsEnabled.call(this)) {
    callbacks = this.chains.shift();
    callback = callbacks && callbacks[Deferred.states[this.state]];
    if (!isFunction(callback)) {
      continue;
    }
    isStop = false;
    try {
      if (this.destAssign ||
          (isNumber(callback.length) && callback.length > 1 &&
           isArray(result) && result.length === callback.length)) {
        reply = callback.apply(this, result);
      } else {
        reply = callback.call(this, result);
      }
      // We ignore undefined result when "return" statement is not exists.
      if (reply === void 0 &&
          this.state !== Deferred.states.failure &&
          !isError(result) && !Pot.hasReturn(callback)) {
        reply = result;
      }
      result = reply;
      if (isWorkeroid(result)) {
        result = workerMessaging.call(this, result);
      } else if (Pot.isFileReader(result)) {
        result = readerPolling.call(this, result);
      } else if (Pot.isImage(result)) {
        result = imagePolling.call(this, result);
      }
      this.destAssign = false;
      this.state = setState.call({}, result);
      if (isDeferred(result)) {
        /**@ignore*/
        nesting = function(result) {
          return bush.call(that, result);
        };
        this.nested++;
      }
    } catch (e) {
      result = e;
      if (isStopIter(result)) {
        isStop = true;
      } else {
        setChainDebris.call(this, result);
      }
      this.destAssign = false;
      this.state = Deferred.states.failure;
      if (!isError(result)) {
        result = new Error(result);
        if (isStop) {
          update(result, {
            StopIteration : PotStopIteration
          });
        }
      }
    }
    if (this.options && this.options.async) {
      break;
    }
  }
  this.results[Deferred.states[this.state]] = result;
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
  key = Deferred.states[Deferred.states.failure];
  chains = this.chains;
  len = chains && chains.length;
  if (len) {
    for (i = 0; i < len; i++) {
      if (chains[i]) {
        errback = chains[i][key];
        if (errback && isFunction(errback)) {
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
    if (this.options && isNumeric(this.options.speed)) {
      speed = this.options.speed;
    } else {
      speed = Deferred.defaults.speed;
    }
    this.chainDebris.timerId = PotInternalSetTimeout(function() {
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
      (this.state & Deferred.states.fired) && hasErrback.call(this)) {
    PotInternalClearTimeout(this.chainDebris.timerId);
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
      (this.state & Deferred.states.fired)) {
    fire.call(this);
  }
}

/**
 * Messaging for Pot.Workeroid.
 *
 * @private
 * @ignore
 */
function workerMessaging(worker) {
  var result, async = false;
  if (this.options && this.options.async) {
    async = true;
  }
  result = new Deferred({async : async});
  return result.then(function() {
    var defer = new Deferred({async : async}), count = 0;
    if (worker && worker.workers) {
      each(worker.workers, function(w, k) {
        if (w && k && k.charAt && k.charAt(0) === '.') {
          /**@ignore*/
          w.callback = function(data) {
            count--;
            if (count === 0) {
              defer.begin(data);
            }
          };
          count++;
        }
      });
      if (count === 0) {
        defer.begin();
      }
    } else {
      defer.begin();
    }
    return defer;
  }).begin();
}

/**
 * Observe FileReader state.
 *
 * @private
 * @ignore
 */
function readerPolling(reader) {
  var d, done, async = false,
      orgLoad = reader.onload,
      orgLoadEnd = reader.onloadend,
      orgError = reader.onerror;
  if (this.options && this.options.async) {
    async = true;
  }
  d = new Deferred({async : async});
  if (reader.readyState === FileReader.LOADING) {
    /**@ignore*/
    reader.onload = function(ev) {
      if (!done) {
        done = true;
        d.begin(ev && ev.target && ev.target.result);
      }
      if (isFunction(orgLoad)) {
        if (orgLoad.apply) {
          orgLoad.apply(this, arguments);
        } else {
          orgLoad(ev);
        }
      }
    };
    /**@ignore*/
    reader.onloadend = function(ev) {
      if (!done) {
        done = true;
        d.begin(ev && ev.target && ev.target.result);
      }
      if (isFunction(orgLoadEnd)) {
        if (orgLoadEnd.apply) {
          orgLoadEnd.apply(this, arguments);
        } else {
          orgLoadEnd(ev);
        }
      }
    };
    /**@ignore*/
    reader.onerror = function(e) {
      if (!done) {
        done = true;
        d.raise(e);
      }
      if (isFunction(orgError)) {
        if (orgError.apply) {
          orgError.apply(this, arguments);
        } else {
          orgError(e);
        }
      }
    };
  } else {
    d.begin(reader.result);
  }
  return d;
}

/**
 * Observe Image state.
 *
 * @private
 * @ignore
 */
function imagePolling(image) {
  var d, done,
      async = false,
      orgLoad = image.onload,
      orgError = image.onerror,
      /**@ignore*/
      isZero = function(img) {
        return (('naturalWidth' in img &&
                !(img.naturalWidth + img.naturalHeight)) ||
                !(img.width + img.height));
      };
  if (this.options && this.options.async) {
    async = true;
  }
  d = new Deferred({async : async});
  if (!isZero(image)) {
    d.begin(image);
  } else {
    /**@ignore*/
    image.onload = function(ev) {
      if (!done) {
        done = true;
        if (isZero(this)) {
          return this.onerror(new Error(this.src));
        }
        d.begin(this);
      }
      if (isFunction(orgLoad)) {
        if (orgLoad.apply) {
          orgLoad.apply(this, arguments);
        } else {
          orgLoad(ev);
        }
      }
    };
    /**@ignore*/
    image.onerror = function(e) {
      if (!done) {
        done = true;
        d.raise(e);
      }
      if (isFunction(orgError)) {
        if (orgError.apply) {
          orgError.apply(this, arguments);
        } else {
          orgError(e);
        }
      }
    };
  }
  return d;
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
    if (args.length === 1 && args[0] && isObject(args[0])) {
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
      if (args.length === 1 && args[0] && isArray(args[0])) {
        opts = args[0];
      } else {
        opts = args;
      }
      each(opts || [], function(opt) {
        if (speed === nop && isNumeric(opt)) {
          speed = opt;
        } else if (speed === nop &&
                   isNumeric(Deferred.speeds[opt])) {
          speed = Deferred.speeds[opt];
        } else if (canceller === nop && isFunction(opt)) {
          canceller = opt;
        } else if (async === nop && isBoolean(opt)) {
          async = opt;
        } else if (stopper === nop &&
                 canceller === nop && isFunction(opt)) {
          stopper = opt;
        }
      });
    }
  }
  this.options = this.options || {};
  this.options.storage = this.options.storage || {};
  if (!isArray(this.options.cancellers)) {
    this.options.cancellers = [];
  }
  if (!isArray(this.options.stoppers)) {
    this.options.stoppers = [];
  }
  if (!isNumeric(speed)) {
    if (this.options.speed !== nop && isNumeric(this.options.speed)) {
      speed = this.options.speed - 0;
    } else {
      speed = defaults.speed;
    }
  }
  if (!isFunction(canceller)) {
    canceller = defaults.canceller;
  }
  if (!isFunction(stopper)) {
    stopper = defaults.stopper;
  }
  if (!isBoolean(async)) {
    if (this.options.async !== nop && isBoolean(this.options.async)) {
      async = this.options.async;
    } else {
      async = defaults.async;
    }
  }
  update(this.options, {
    speed : speed - 0,
    async : async
  });
  if (isFunction(canceller)) {
    this.options.cancellers.push(canceller);
  }
  if (isFunction(stopper)) {
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
    if (isFunction(func)) {
      func.call(this);
    }
  }
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Create each speeds constructors (optional)

update(Deferred, {
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
      /**@ignore*/
      var func = function() {
        var opts = {}, args = arguments, me = func;
        args = arrayize(args);
        initOptions.call(opts, args, {
          speed     : speed,
          canceller : Deferred.defaults.canceller,
          stopper   : Deferred.defaults.stopper,
          async     : Deferred.defaults.async
        });
        opts.speedName = speedName;
        args.unshift(opts);
        return construct.apply(me.instance, args);
      };
      return func;
    },
    methods = {};
    each(speeds, function(val, key) {
      methods[key] = create(key, val);
    });
    return update(target[name], methods);
  }
});

update(PotInternal, {
  /**
   * Reference to instance of object.
   *
   * @private
   * @ignore
   */
  referSpeeds : update(function(speeds) {
    var me = PotInternal.referSpeeds, prop, speed;
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
Deferred.extendSpeeds(Pot, 'Deferred', function(options) {
  return Deferred(options);
}, Deferred.speeds);

}());
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Deferred utilities.
(function() {

update(Deferred, {
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
  isDeferred : isDeferred,
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
    var d = new Deferred();
    return d.begin.apply(d, arguments);
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
    var d = new Deferred();
    return d.raise.apply(d, arguments);
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
    var timer, d = new Deferred({
      /**@ignore*/
      canceller : function() {
        try {
          PotInternalClearTimeout(timer);
        } catch (e) {}
      }
    });
    if (arguments.length >= 2) {
      d.then(function() {
        return value;
      });
    }
    timer = PotInternalSetTimeout(function() {
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
    return Deferred.wait(seconds).then(function() {
      if (isDeferred(callback)) {
        return callback.begin.apply(callback, args);
      } else if (isFunction(callback)) {
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
    return Deferred.begin(function() {
      if (isDeferred(callback)) {
        return callback.begin.apply(callback, args);
      } else if (isFunction(callback)) {
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
    var d;
    if (isDeferred(x)) {
      return x;
    }
    if (isError(x)) {
      return Deferred.failure(x);
    }
    if (x) {
      try {
        // jQuery Deferred convertion.
        if (typeof jQuery === 'function' && jQuery.Deferred &&
            typeof x.then === 'function' &&
            x.promise && x.always && x.resolve && x.rejectWith
        ) {
          d = new Deferred();
          x.then(function() {
            d.begin.apply(d, arguments);
          }, function() {
            d.raise.apply(d, arguments);
          });
          return d;
        }
      } catch (e) {}
      try {
        // JSDeferred convertion.
        if (x._id === 0xE38286E381AE &&
            typeof x.next === 'function' && typeof x.error === 'function' &&
            typeof x.fail === 'function' && typeof x.cancel === 'function'
        ) {
          d = new Deferred();
          x.next(function() {
            d.begin.apply(d, arguments);
          }).error(function() {
            d.raise.apply(d, arguments);
          });
          return d;
        }
      } catch (e) {}
    }
    return Deferred.succeed(x);
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
    return isDeferred(deferred) &&
           ((deferred.state & Deferred.states.fired) !== 0);
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
    if (isDeferred(deferred)) {
      try {
        key = Deferred.states[Deferred.states.success];
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
    if (isDeferred(deferred)) {
      try {
        key = Deferred.states[Deferred.states.failure];
        if (args.length <= 1) {
          result = deferred.results[key];
        } else {
          if (!isError(value)) {
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
    var result = 0, that = Deferred.fn,
        args = arrayize(arguments), methods = [];
    switch (args.length) {
      case 0:
          break;
      case 1:
          if (isObject(args[0])) {
            each(args[0], function(val, key) {
              if (isFunction(val) && isString(key)) {
                methods.push([key, val]);
              } else if (isFunction(key) && isString(val)) {
                methods.push([val, key]);
              }
            });
          }
          break;
      default:
          if (isFunction(args[0])) {
            methods.push([args[1], args[0]]);
          } else {
            methods.push([args[0], args[1]]);
          }
    }
    if (methods && methods.length) {
      each(methods, function(item) {
        var subs = {}, name, func, method;
        if (item && item.length >= 2 && isFunction(item[1])) {
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
    var result = 0, that = Deferred.fn, args = arrayize(arguments), names;
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
        default:
            if (isObject(method)) {
              context = method;
              func    = object;
            } else {
              func    = method;
              context = object;
            }
      }
      if (!func) {
        throw func;
      }
    } catch (e) {
      err = e;
      throw (isError(err) ? err : new Error(err));
    }
    return function() {
      var that = this, args = arrayize(arguments), d = new Deferred();
      d.then(function() {
        var dd = new Deferred(), result, params = [],
            done = false, error, isFired = Deferred.isFired;
        each(args, function(val) {
          if (isFunction(val)) {
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
          throw isError(error) ? error : new Error(error);
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
    var that = Deferred, args = arrayize(arguments);
    args.unshift(that);
    return update.apply(that, args);
  }
});

// Definitions of the loop/iterator methods.
update(Deferred, {
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
    var d = new Deferred(), args = arrayize(arguments, 1), value;
    if (x && isFunction(x)) {
      d.then(function() {
        return x.apply(this, args);
      });
    } else {
      value = x;
    }
    PotInternalCallInBackground.flush(function() {
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
    return Deferred.begin(function() {
      if (isDeferred(callback)) {
        return callback.begin.apply(callback, args);
      } else if (isFunction(callback)) {
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
    var d = new Deferred(), args = arrayize(arguments, 1), interval = 13;
    return Deferred.begin(function till() {
      var that = this, time = now();
      if (cond && !cond.apply(this, args)) {
        PotInternalSetTimeout(function() {
          till.call(that);
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
   *     }).begin(),
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
   *     }).begin(),
   *     baz : function() {
   *       var d = new Pot.Deferred();
   *       return d.async(false).then(function() {
   *         debug(3);
   *         return 3;
   *       }).begin();
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
      result = Deferred.succeed();
    } else {
      if (args.length === 1) {
        if (isObject(deferredList)) {
          deferreds = deferredList;
        } else {
          deferreds = arrayize(deferredList);
        }
      } else {
        deferreds = arrayize(args);
      }
      result = new Deferred({
        /**@ignore*/
        canceller : function() {
          each(deferreds, function(deferred) {
            if (isDeferred(deferred)) {
              deferred.cancel();
            }
          });
        }
      });
      d = new Deferred();
      bounds = [];
      values = isObject(deferreds) ? {} : [];
      each(deferreds, function(deferred, key) {
        var defer;
        if (isDeferred(deferred)) {
          defer = deferred;
        } else if (isFunction(deferred)) {
          defer = new Deferred();
          defer.then(deferred);
        } else {
          defer = Deferred.succeed(deferred);
        }
        if (!isDeferred(defer)) {
          defer = Deferred.maybeDeferred(defer);
        }
        bounds[bounds.length] = key;
        d.then(function() {
          if (defer.state === Deferred.states.unfired) {
            Deferred.flush(defer);
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
      Deferred.flush(d);
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
          chain = new Deferred();
      if (len > 0) {
        chains = arrayize((len === 1) ? args[0] : args);
        each(chains, function(o) {
          var name;
          if (isFunction(o)) {
            try {
              name = Pot.getFunctionCode(o).match(re.funcName)[1];
            } catch (e) {}
            if (name && re.rescue.test(name)) {
              chain.rescue(o);
            } else {
              chain.then(o);
            }
          } else if (isDeferred(o)) {
            chain.then(function(v) {
              if (o.state === Deferred.states.unfired) {
                o.begin(v);
              }
              return o;
            });
          } else if (isObject(o) || isArray(o)) {
            chain.then(function() {
              return Deferred.parallel(o);
            });
          } else if (isError(o)) {
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
      Deferred.callLazy(chain);
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
Deferred.extendSpeeds(Deferred, 'begin', function(opts, x) {
  var d, timer, args = arrayize(arguments, 2),
      isCallable = (x && isFunction(x)),
      op = opts.options || opts || {},
      speed, value;
  if (!op.cancellers) {
    op.cancellers = [];
  }
  op.cancellers.push(function() {
    try {
      if (timer != null) {
        PotInternalClearTimeout(timer);
      }
    } catch (e) {}
  });
  d = new Deferred(op);
  if (isCallable) {
    d.then(function() {
      return x.apply(this, args);
    });
  } else {
    value = x;
  }
  speed = (((opts.options && opts.options.speed) || opts.speed) - 0) || 0;
  if (isNumeric(speed) && speed > 0) {
    timer = PotInternalSetTimeout(function() {
      d.begin(value);
    }, speed);
  } else {
    PotInternalCallInBackground.flush(function() {
      d.begin(value);
    });
  }
  return d;
}, Deferred.speeds);

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
Deferred.extendSpeeds(Deferred, 'flush', function(opts, callback) {
  var speed, name, method, args = arrayize(arguments, 2);
  speed = opts.options ? opts.options.speed : opts.speed;
  if (speed in Deferred.speeds &&
      isString(Deferred.speeds[speed])) {
    name = Deferred.speeds[speed];
  } else {
    each(Deferred.speeds, function(val, key) {
      if (val == speed) {
        name = key;
        throw PotStopIteration;
      }
    });
  }
  if (name && name in Deferred.begin) {
    method = Deferred.begin[name];
  } else {
    method = Deferred.begin;
  }
  return method(function() {
    if (isDeferred(callback)) {
      return callback.begin.apply(callback, args);
    } else if (isFunction(callback)) {
      return callback.apply(this, args);
    } else {
      return callback;
    }
  });
}, Deferred.speeds);

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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Define iteration methods. (internal)
(function() {
var LightIterator,
    QuickIteration,
    createLightIterateConstructor,
    createSyncIterator;

update(PotInternal, {
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
    return new LightIterator.fn.doit(
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

// Refer the Pot properties/functions.
PotInternalLightIterator = LightIterator = PotInternal.LightIterator;

update(LightIterator, {
  /**@ignore*/
  defaults : {
    speed : LightIterator.speeds.normal
  },
  /**@ignore*/
  revSpeeds : {}
});

each(LightIterator.speeds, function(v, k) {
  LightIterator.revSpeeds[v] = k;
});

LightIterator.fn = LightIterator.prototype =
  update(LightIterator.prototype, {
  /**
   * @lends Pot.Internal.LightIterator.prototype
   */
  /**
   * @ignore
   */
  constructor : LightIterator,
  /**
   * @private
   * @ignore
   */
  interval : LightIterator.defaults.speed,
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
    if (isNumeric(this.options.interval)) {
      n = this.options.interval - 0;
    } else if (this.options.interval in LightIterator.speeds) {
      n = LightIterator.speeds[this.options.interval] - 0;
    }
    if (n !== null && !isNaN(n)) {
      this.interval = n;
    }
    if (!isNumeric(this.interval)) {
      this.interval = LightIterator.defaults.speed;
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
    if (this.options.async !== void 0) {
      a = !!this.options.async;
    }
    if (a !== null) {
      this.async = !!a;
    }
    if (!isBoolean(this.async)) {
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
    return new Deferred({ async : false });
  },
  /**
   * Watch the process.
   *
   * @private
   * @ignore
   */
  watch : function() {
    var that = this;
    if (!this.async && this.waiting === true && PotSystem.isWaitable) {
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
      if (!this.async && !PotSystem.isWaitable) {
        this.revback();
        this.waiting = false;
      } else {
        d = this.createDeferred();
        d.then(function() {
          var d1 = that.createDeferred(),
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
            if (isDeferred(that.result) &&
                isStopIter(Deferred.lastError(that.result))) {
              that.result = Deferred.lastResult(that.result);
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
    var type = this.options.type,
        types = LightIterator.types,
        context = this.options.context;
    switch (true) {
      case ((type & types.iterate) === types.iterate):
          this.result = null;
          this.iter = this.iterate(object, callback, context);
          break;
      case ((type & types.forEver) === types.forEver):
          this.result = {};
          this.iter = this.forEver(object, context);
          break;
      case ((type & types.repeat) === types.repeat):
          this.result = {};
          this.iter = this.repeat(object, callback, context);
          break;
      case ((type & types.items) === types.items):
          this.result = [];
          this.iter = this.items(object, callback, context);
          break;
      case ((type & types.zip) === types.zip):
          this.result = [];
          this.iter = this.zip(object, callback, context);
          break;
      default:
          if (isArrayLike(object)) {
            this.result = object;
            this.iter = this.forLoop(object, callback, context);
          } else {
            this.result = object;
            this.iter = this.forInLoop(object, callback, context);
          }
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
            throw PotStopIteration;
          }
          result = this.iter.next();
        } catch (e) {
          err = e;
          if (isStopIter(err)) {
            break REVOLVE;
          }
          throw err;
        }
        if (this.async && isDeferred(result)) {
          return result.ensure(function(res) {
            if (res !== void 0) {
              if (isError(res)) {
                if (isStopIter(res)) {
                  that.isDeferStopIter = true;
                  if (isDeferred(that.result) &&
                      isStopIter(Deferred.lastError(that.result))) {
                    that.result = Deferred.lastResult(that.result);
                  }
                } else {
                  Deferred.lastError(this, res);
                }
              } else {
                Deferred.lastResult(this, res);
              }
            }
            that.flush(that.revback, true);
          });
        }
        time = now();
        if (PotSystem.isWaitable) {
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
              this.interval < LightIterator.speeds.normal) {
            cutback = true;
          } else if (this.async || this.restable || PotSystem.isWaitable) {
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
    if (isDeferred(this.revDeferred)) {
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
    var that = this,
        d  = this.createDeferred(),
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
      if (isError(er)) {
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
    if (this.async || PotSystem.isWaitable) {
      lazy = true;
    }
    if (!lazy && isFunction(callback)) {
      return callback.call(this);
    } else {
      d = this.createDeferred();
      d.then(function() {
        if (isDeferred(callback)) {
          callback.begin();
        } else {
          callback.call(that);
        }
      });
      if (lazy) {
        speed = 0;
        if (useSpeed) {
          speedKey = LightIterator.revSpeeds[this.interval];
          if (speedKey &&
              isNumeric(LightIterator.delays[speedKey])) {
            speed = LightIterator.delays[speedKey];
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
        PotInternalSetTimeout(function() {
          d.begin();
        }, speed);
      } else {
        d.begin();
      }
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
        throw PotStopIteration;
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
    if (!isFunction(callback)) {
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
    if (!isFunction(callback)) {
      return this.noop();
    }
    if (!max || max == null) {
      n = 0;
    } else if (isNumeric(max)) {
      n = max - 0;
    } else {
      n = max || {};
      if (isNumeric(n.start)) {
        n.begin = n.start;
      }
      if (isNumeric(n.stop)) {
        n.end = n.stop;
      }
    }
    loops = {
      begin : isNumeric(n.begin) ? n.begin - 0 : 0,
      end   : isNumeric(n.end)   ? n.end   - 0 : (n || 0) - 0,
      step  : isNumeric(n.step)  ? n.step  - 0 : 1,
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
          throw PotStopIteration;
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
    if (!object || !object.length || !isFunction(callback)) {
      return this.noop();
    }
    copy = arrayize(object);
    return {
      /**@ignore*/
      next : function() {
        var val, result;
        while (true) {
          if (i >= copy.length) {
            throw PotStopIteration;
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
    var copy, i = 0;
    //XXX: Should use "yield" for duplicate loops.
    if (isFunction(callback)) {
      copy = [];
      each(object, function(value, prop) {
        copy[copy.length] = [value, prop];
      });
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
            throw PotStopIteration;
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
      if (isFunction(callback)) {
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
      iterable = Iter.toIter(object);
      if (!isIter(iterable)) {
        return this.noop();
      }
      if (isFunction(callback)) {
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
    var that = this, copy, i = 0, isPair;
    if (isObject(object)) {
      copy = [];
      each(object, function(ov, op) {
        copy[copy.length] = [op, ov];
      });
      isPair = true;
    } else if (isArrayLike(object)) {
      copy = arrayize(object);
    }
    if (!copy || !copy.length) {
      return this.noop();
    }
    if (isFunction(callback)) {
      return {
        /**@ignore*/
        next : function() {
          var result, c, key, val;
          while (true) {
            if (i >= copy.length) {
              throw PotStopIteration;
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
              throw PotStopIteration;
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
    if (isArrayLike(object)) {
      copy = arrayize(object);
      max = copy.length;
    }
    if (!max || !copy || !copy.length) {
      return this.noop();
    }
    if (isFunction(callback)) {
      return {
        /**@ignore*/
        next : function() {
          var result, zips = [], j, item;
          for (j = 0; j < max; j++) {
            item = arrayize(copy[j]);
            if (!item || !item.length || i >= item.length) {
              throw PotStopIteration;
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
              throw PotStopIteration;
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

LightIterator.fn.doit.prototype = LightIterator.fn;

// Update internal synchronous iteration.
update(LightIterator, {
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
        if (!isStopIter(err)) {
          throw err;
        }
      }
    },
    /**
     * @private
     * @ignore
     */
    forEach : function(object, callback, context) {
      var result, iter, that = LightIterator.fn;
      if (!object) {
        result = {};
      } else {
        result = object;
        if (isArrayLike(object)) {
          iter = that.forLoop(object, callback, context);
        } else {
          iter = that.forInLoop(object, callback, context);
        }
        QuickIteration.resolve(iter);
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    repeat : function(max, callback, context) {
      var result = {}, iter, that = LightIterator.fn;
      if (max) {
        iter = that.repeat(max, callback, context);
        QuickIteration.resolve(iter);
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    forEver : function(callback, context) {
      var result = {}, iter, that = LightIterator.fn;
      if (callback) {
        iter = that.forEver(callback, context);
        QuickIteration.resolve(iter);
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    iterate : function(object, callback, context) {
      var result, iter, o, that = LightIterator.fn;
      if (!object) {
        result = {};
      } else {
        result = null;
        o = {
          noop   : that.noop,
          result : null
        };
        iter = that.iterate.call(o, object, callback, context);
        QuickIteration.resolve(iter);
        result = o.result;
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    items : function(object, callback, context) {
      var result = [], iter, o, that = LightIterator.fn;
      if (object) {
        o = {
          noop   : that.noop,
          result : []
        };
        iter = that.items.call(o, object, callback, context);
        QuickIteration.resolve(iter);
        result = o.result;
      }
      return result;
    },
    /**
     * @private
     * @ignore
     */
    zip : function(object, callback, context) {
      var result = [], iter, o, that = LightIterator.fn;
      if (object) {
        o = {
          noop   : that.noop,
          result : []
        };
        iter = that.zip.call(o, object, callback, context);
        QuickIteration.resolve(iter);
        result = o.result;
      }
      return result;
    }
  }
});

QuickIteration = LightIterator.QuickIteration;
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Define the main iterators.

// Temporary creation function.
update(PotTmp, {
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
      if (LightIterator.speeds[speed] === void 0) {
        interval = LightIterator.defaults.speed;
      } else {
        interval = LightIterator.speeds[speed];
      }
      return creator(interval);
    },
    methods = {},
    construct = create();
    for (name in LightIterator.speeds) {
      methods[name] = create(name);
    }
    return update(construct, methods);
  }
});

createLightIterateConstructor = PotTmp.createLightIterateConstructor;

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
  forEach : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.forLoop |
                    LightIterator.types.forInLoop;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new LightIterator(object, callback, opts)).result;
      };
    } else {
      return function(object, callback, context) {
        return QuickIteration.forEach(
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
  repeat : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(max, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.repeat;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new LightIterator(max, callback, opts)).result;
      };
    } else {
      return function(max, callback, context) {
        return QuickIteration.repeat(
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
  forEver : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(callback, context) {
        var opts = {};
        opts.type = LightIterator.types.forEver;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new LightIterator(callback, null, opts)).result;
      };
    } else {
      return function(callback, context) {
        return QuickIteration.forEver(
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
  iterate : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.iterate;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new LightIterator(object, callback, opts)).result;
      };
    } else {
      return function(object, callback, context) {
        return QuickIteration.iterate(
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
  items : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.items;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new LightIterator(object, callback, opts)).result;
      };
    } else {
      return function(object, callback, context) {
        return QuickIteration.items(
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
  zip : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.zip;
        opts.interval = interval;
        opts.async = false;
        opts.context = context;
        return (new LightIterator(object, callback, opts)).result;
      };
    } else {
      return function(object, callback, context) {
        return QuickIteration.zip(
          object, callback, context
        );
      };
    }
  })
});

// Define iterators for Deferred (Asynchronous)
update(Deferred, {
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
  forEach : createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.forLoop |
                  LightIterator.types.forInLoop;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new LightIterator(object, callback, opts)).deferred;
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
  repeat : createLightIterateConstructor(function(interval) {
    return function(max, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.repeat;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new LightIterator(max, callback, opts)).deferred;
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
  forEver : createLightIterateConstructor(function(interval) {
    return function(callback, context) {
      var opts = {};
      opts.type = LightIterator.types.forEver;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new LightIterator(callback, null, opts)).deferred;
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
  iterate : createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.iterate;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new LightIterator(object, callback, opts)).deferred;
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
   * @return {Deferred}                 Return a new instance of Deferred that
   *                                      has the collected items as an array.
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
  items : createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.items;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new LightIterator(object, callback, opts)).deferred;
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
  zip : createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.zip;
      opts.interval = interval;
      opts.async = true;
      opts.context = context;
      return (new LightIterator(object, callback, opts)).deferred;
    };
  })
});

delete PotTmp.createLightIterateConstructor;
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
    return isIter(this) ? this.init(arguments)
                        : new Iter.fn.init(arguments);
  }
});

// Refer the Pot properties/functions.
Iter = Pot.Iter;

// Definition of the prototype
Iter.fn = Iter.prototype = update(Iter.prototype, {
  /**
   * @lends Pot.Iter.prototype
   */
  /**
   * @ignore
   */
  constructor : Iter,
  /**
   * @private
   * @ignore
   */
  id : PotInternal.getMagicNumber(),
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
  toString : PotToString,
  /**
   * isIter.
   *
   * @type Function
   * @function
   * @const
   * @static
   * @public
   */
  isIter : isIter,
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
    throw PotStopIteration;
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

Iter.fn.init.prototype = Iter.fn;

// Define Iter object properties.
update(Iter, {
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
  StopIteration : PotStopIteration,
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
    var iter, o, arrayLike, objectLike;
    if (isIter(x)) {
      return x;
    }
    arrayLike  = x && isArrayLike(x);
    objectLike = x && !arrayLike && isObject(x);
    if (objectLike) {
      o = [];
      each(x, function(xv, xp) {
        o[o.length] = [xv, xp];
      });
    } else {
      o = arrayize(x);
    }
    iter = new Iter();
    /**@ignore*/
    iter.next = (function() {
      var i = 0;
      if (objectLike) {
        return function() {
          var key, val, pair;
          while (true) {
            if (i >= o.length) {
              throw PotStopIteration;
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
              throw PotStopIteration;
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
    }());
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
    arrayLike  = object && isArrayLike(object);
    objectLike = object && !arrayLike && isObject(object);
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
        if (isDeferred(res)) {
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
  filter : (function() {
    /**@ignore*/
    var emptyFilter = function(a) { return a; };
    return function(object, callback, context) {
      var result, arrayLike, objectLike, iterateDefer, it, iterable, cb;
      cb = callback || emptyFilter;
      iterateDefer = this && this.iterateSpeed;
      arrayLike  = object && isArrayLike(object);
      objectLike = object && !arrayLike && isObject(object);
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
          var res = cb.call(context, val, key, obj);
          if (isDeferred(res)) {
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
    };
  }()),
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
    arrayLike  = object && isArrayLike(object);
    objectLike = object && !arrayLike && isObject(object);
    if (initial === void 0) {
      /**@ignore*/
      value = (function() {
        var first;
        if (arrayLike || objectLike) {
          each(object, function(v) {
            first = v;
            throw PotStopIteration;
          });
        }
        return first;
      }());
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
          if (isDeferred(res)) {
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
        if (isDeferred(res)) {
          return res.then(function(rv) {
            if (!rv) {
              result = false;
              throw PotStopIteration;
            }
          });
        } else {
          if (!res) {
            result = false;
            throw PotStopIteration;
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
        if (isDeferred(res)) {
          return res.then(function(rv) {
            if (rv) {
              result = true;
              throw PotStopIteration;
            }
          });
        } else {
          if (res) {
            result = true;
            throw PotStopIteration;
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
    var args = arguments, arg, result = [],
        begin = 0,
        end   = 0,
        step  = 1,
        n, string, iter;
    switch (args.length) {
      case 0:
          return;
      case 1:
          arg = args[0];
          if (isObject(arg)) {
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
      default:
          begin = args[0];
          end   = args[1];
          step  = args[2];
    }
    if (isString(begin) && begin.length === 1 &&
        isString(end)   && end.length   === 1) {
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
    iter = new Iter();
    /**@ignore*/
    iter.next = function() {
      if ((step > 0 && begin > end) ||
          (step < 0 && begin < end)) {
        throw PotStopIteration;
      }
      result[result.length] = string ? fromUnicode(begin) : begin;
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
   * @return {Number|String}          Return the index of result, or -1.
   * @type Function
   * @function
   * @static
   * @public
   */
  indexOf : function(object, subject, from) {
    var result = -1, i, len, val, passed,
        args = arguments, argn = args.length,
        arrayLike = object && isArrayLike(object),
        objectLike = object && !arrayLike && isObject(object);
    if (arrayLike) {
      try {
        if (PotSystem.isBuiltinArrayIndexOf) {
          i = indexOf.apply(object, arrayize(args, 1));
          if (isNumeric(i)) {
            result = i;
          } else {
            throw i;
          }
        } else {
          throw i;
        }
      } catch (err) {
        len = (object && object.length) || 0;
        i = (+from) || 0;
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
      each(object, function(ov, op) {
        if (!passed && argn >= 3 && from !== op) {
          return;
        } else {
          passed = true;
        }
        if (ov === subject) {
          result = op;
        }
      });
    } else if (object != null) {
      try {
        val = (object.toString && object.toString()) || String(object);
        result = StringProto.indexOf.apply(val, arrayize(args, 1));
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
   * @return {Number|String}          Return the index of result, or -1.
   * @type Function
   * @function
   * @static
   * @public
   */
  lastIndexOf : function(object, subject, from) {
    var result = -1, i, len,  key, val, passed, pairs,
        args = arguments,
        arrayLike  = object && isArrayLike(object),
        objectLike = object && !arrayLike && isObject(object);
    if (arrayLike) {
      try {
        if (PotSystem.isBuiltinArrayLastIndexOf) {
          i = lastIndexOf.apply(object, arrayize(args, 1));
          if (isNumeric(i)) {
            result = i;
          } else {
            throw i;
          }
        } else {
          throw i;
        }
      } catch (err) {
        len = (object && object.length) || 0;
        i = (+from);
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
      each(object, function(ov, op) {
        pairs[pairs.length] = [op, ov];
        if (ov === subject) {
          result = op;
        }
        if (op === from) {
          passed = true;
          throw PotStopIteration;
        }
      });
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
        result = StringProto.lastIndexOf.apply(val, arrayize(args, 1));
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
  toIter : Iter.toIter
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Update the Pot.Deferred object for iterators.

// Extends the Pot.Deferred object for iterators with speed.
update(PotTmp, {
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
        me.iterateSpeed = (this && this.iterateSpeed) || Deferred.iterate;
        return Deferred.begin(function() {
          var d = new Deferred();
          iter.method.apply(me, args).then(function(res) {
            d.begin(res);
          }, function(err) {
            d.raise(err);
          });
          return d;
        });
      };
      update(Deferred, o);
      Deferred.extendSpeeds(Deferred, iter.NAME, function(opts) {
        var me = {}, args = arrayize(arguments, 1);
        me.iterateSpeed = Deferred.iterate[opts.speedName];
        return Deferred.begin(function() {
          var d = new Deferred();
          iter.method.apply(me, args).then(function(res) {
            d.begin(res);
          }, function(err) {
            d.raise(err);
          });
          return d;
        });
      }, LightIterator.speeds);
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
          var d = new Deferred();
          args = iter.args(value, args);
          iter.method.apply(iter.context, args).ensure(function(res) {
            extendDeferredOptions(d, options);
            if (isError(res)) {
              d.raise(res);
            } else {
              d.begin(res);
            }
          });
          return d;
        });
      };
      update(Deferred.fn, o);
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
        Deferred.extendSpeeds(Deferred.fn, iter.NAME, function(opts) {
          var args = arrayize(arguments, 1),
              iterable = sp.methods(opts.speedName),
              options  = update({}, this.options);
          return this.then(function(value) {
            var d = new Deferred();
            args = iter.args(value, args);
            iterable.iter.apply(iterable.context, args).ensure(function(res) {
              extendDeferredOptions(d, options);
              if (isError(res)) {
                d.raise(res);
              } else {
                d.begin(res);
              }
            });
            return d;
          });
        }, LightIterator.speeds);
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
            each(LightIterator.speeds, function(v, k) {
              if (v === LightIterator.defaults.speed) {
                key = k;
                throw PotStopIteration;
              }
            });
          }
          return creator(key);
        };
    construct = create();
    methods = {};
    each(LightIterator.speeds, function(v, k) {
      methods[k] = create(k);
    });
    return update(construct, methods);
  }
});

// Create iterators to Pot.Deferred.
PotTmp.createIterators([{
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
  method : Iter.map
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
  method : Iter.filter
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
  method : Iter.reduce
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
  method : Iter.every
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
  method : Iter.some
}]);

// Create iterators to Pot.Deferred.prototype.
PotTmp.createProtoIterators([{
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
  method : Deferred.forEach,
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
  iterable : Deferred.forEach,
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
  method : Deferred.repeat,
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
  iterable : Deferred.repeat,
  /**
   * @ignore
   */
  args : function(arg, args) {
    if (isNumeric(arg)) {
      return [arg - 0].concat(args);
    }
    if (arg && isNumber(arg.length)) {
      return [arg.length].concat(args);
    }
    if (arg && isObject(arg) &&
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
  method : Deferred.forEver,
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
  iterable : Deferred.forEver,
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
  method : Deferred.iterate,
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
  iterable : Deferred.iterate,
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
  method : Deferred.items,
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
  iterable : Deferred.items,
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
  method : Deferred.zip,
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
  iterable : Deferred.zip,
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
  method : Iter.map,
  /**
   * @ignore
   */
  context : {iterateSpeed : Deferred.iterate},
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
  method : Iter.filter,
  /**
   * @ignore
   */
  context : {iterateSpeed : Deferred.iterate},
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
  method : Iter.reduce,
  /**
   * @ignore
   */
  context : {iterateSpeed : Deferred.iterate},
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
  method : Iter.every,
  /**
   * @ignore
   */
  context : {iterateSpeed : Deferred.iterate},
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
  method : Iter.some,
  /**
   * @ignore
   */
  context : {iterateSpeed : Deferred.iterate},
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

createSyncIterator = PotTmp.createSyncIterator;

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
  map : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.map.apply(context, arguments);
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
  filter : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.filter.apply(context, arguments);
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
  reduce : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.reduce.apply(context, arguments);
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
  every : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.every.apply(context, arguments);
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
  some : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.some.apply(context, arguments);
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
    return Iter.range.apply(null, arguments);
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
    return Iter.indexOf.apply(null, arguments);
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
    return Iter.lastIndexOf.apply(null, arguments);
  }
});

update(PotInternal, {
  defineDeferrater : createSyncIterator
});

// Definition of deferreed function.
(function() {
  /**@ignore*/
  var Deferrizer = function(func) {
    return new Deferrizer.prototype.init(func);
  },
  SPEED = buildSerial({NAME : '.\u0000[~`{{*@:SPEED:@*}}`~]\u0001'}),
  CACHE = {},
  CACHE_COUNT = 0,
  CACHE_LIMIT = 0x2000;
  Deferrizer.prototype = update(Deferrizer.prototype, {
    /**
     * @private
     * @ignore
     * @internal
     */
    constructor : Deferrizer,
    /**
     * @private
     * @ignore
     */
    id : PotInternal.getMagicNumber(),
    /**
     * @ignore
     * @private
     */
    func : null,
    /**
     * @ignore
     * @private
     */
    code : null,
    /**
     * @ignore
     * @private
     */
    tokens : [],
    /**
     * @ignore
     * @private
     */
    uniqs : {},
    /**
     * @ignore
     * @private
     */
    tails : [],
    /**
     * @ignore
     * @private
     */
    iteration : {},
    /**
     * Initialize properties.
     *
     * @private
     * @ignore
     */
    init : function(func) {
      this.func = func;
      this.code = this.toCode(this.func);
      this.tokens = [];
      this.iteration = {};
      this.tails = [];
      return this;
    },
    /**
     * Execute.
     *
     * @private
     * @ignore
     */
    execute : function() {
      var that = this, result = '';
      if (this.code) {
        if (this.code in CACHE) {
          result = CACHE[this.code];
        } else {
          this.uniqs = {};
          each('key val ret rev err nxt'.split(' '), function(v) {
            that.uniqs[v] = that.generateUniqName({
              NAME : '$_' + v + '_'
            });
          });
          this.tokens = this.tokenize(this.code);
          if (!this.hasIteration(this.tokens)) {
            result = this.func;
          } else {
            this.parseLoop();
            result = this.deferrizeFunction();
            if (result) {
              if (CACHE_COUNT < CACHE_LIMIT) {
                CACHE[this.code] = result;
                CACHE_COUNT++;
              }
            }
          }
        }
      }
      return result;
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    hasIteration : function(tokens) {
      var result = false, i, len, token;
      if (tokens) {
        len = tokens.length;
        for (i = 0; i < len; i++) {
          token = tokens[i];
          if (token === 'for' || token === 'while' || token === 'do') {
            result = true;
            break;
          }
        }
      }
      return result;
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    toCode : function(func) {
      return Pot.getFunctionCode(func);
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    isWord : (function() {
      var RE = {
        SPACE : /\s/,
        WORDS : /[$\w\u0100-\uFFFF]/
      };
      return function(c) {
        return c != null && !RE.SPACE.test(c) && RE.WORDS.test(c);
      };
    }()),
    /**
     * @internal
     * @private
     * @ignore
     */
    isNL : (function() {
      var RE = /\r\n|\r|\n/;
      return function(c) {
        return c != null && RE.test(c);
      };
    }()),
    /**
     * @internal
     * @private
     * @ignore
     */
    format : function(/*format[, ...args]*/) {
      var args = arrayize(arguments);
      return args[0].replace(/#(\d+)/g, function(a, i) {
        return args[+i];
      });
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    joinTokens : function(tokens) {
      var result = [], len = tokens.length,
          prev, prevSuf, pre, suf, i, token;
      for (i = 0; i < len; i++) {
        token = tokens[i];
        if (!prev) {
          result[result.length] = token;
        } else {
          pre = '';
          suf = '';
          if (token === '+'  || token === '-'  ||
              token === '++' || token === '--' ||
              token === 'in'
          ) {
            pre = ' ';
            suf = ' ';
          } else if (this.isWord(prev.slice(-1)) &&
                     this.isWord(token.charAt(0))) {
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
      return result.join('');
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    toEnd : function(code) {
      var s;
      if (isArray(code)) {
        s = this.joinTokens(code);
      } else {
        s = stringify(code);
      }
      if (trim(s).slice(-1) === ';') {
        return s;
      }
      return s ? s + ';' : s;
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    generateUniqName : function(prefix) {
      var result;
      do {
        result = buildSerial(prefix || Pot, '');
      } while (~Pot.indexOf(this.tokens, result));
      return result;
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    tokenize : (function() {
      var RE = {
        TOKEN : new RegExp(
          '(' + '^\\s*function\\b[^{]*[{]' +            // function prefix
          '|' + '[}][^}]*$' +                           // function suffix
          '|' + '/[*][\\s\\S]*?[*]/' +                  // multiline comment
          '|' + '/{2,}[^\\r\\n]*(?:\\r\\n|\\r|\\n|)' +  // single line comment
          '|' + '"(?:\\\\[\\s\\S]|[^"\\r\\n\\\\])*"' +  // string literal
          '|' + "'(?:\\\\[\\s\\S]|[^'\\r\\n\\\\])*'" +  // string literal
          '|' + '/(?![*])(?:\\\\.|[^/\\r\\n\\\\])+/' +
                '[gimy]{0,4}' +
          '|' + '<([^\\s>]*)[^>]*>[\\s\\S]*?</\\2>' +   // e4x
          '|' + '>>>=?|<<=|===|!==|>>=' +               // operators
          '|' + '[+][+](?=[+])|[-][-](?=[-])' +
          '|' + '[=!<>*+/&|^-]=' +
          '|' + '[&][&]|[|][|]|[+][+]|[-][-]|<<|>>' +
          '|' + '0(?:[xX][0-9a-fA-F]+|[0-7]+)' +        // number literal
          '|' + '\\d+(?:[.]\\d+)?(?:[eE][+-]?\\d+)?' +
          '|' + '[1-9]\\d*' +
          '|' + '[-+/%*=&|^~<>!?:,;@()\\\\[\\].{}]' +   // operator
          '|' + '(?![\\r\\n])\\s+' +                    // white space
          '|' + '(?:\\r\\n|\\r|\\n)' +                  // nl
          '|' + '[^\\s+/%*=&|^~<>!?:,;@()\\\\[\\].{}\'"-]+' + // token
          ')',
          'g'
        ),
        NOTSPACE : /[\S\r\n]/,
        COMMENTS : /^\/{2,}[\s\S]*$|^\/[*][\s\S]*?[*]\/$/
      };
      return function(func) {
        var r = [], m, token, s = this.toCode(func);
        if (s) {
          RE.TOKEN.lastIndex = 0;
          while ((m = RE.TOKEN.exec(s)) != null) {
            token = m[1];
            if (!RE.NOTSPACE.test(token) || RE.COMMENTS.test(token)) {
              continue;
            } else {
              r[r.length] = token;
            }
          }
        }
        return r;
      };
    }()),
    /**
     * @internal
     * @private
     * @ignore
     */
    parseLoop : function() {
      var result, max = 0, loops = [], offsets = [], index = 0, nest = 0,
          level = 0, inLoop, i, token, len = this.tokens.length;
      for (i = 0; i < len; i++) {
        token = this.tokens[i];
        switch (token) {
          case 'for':
          case 'while':
          case 'do':
              if (!inLoop) {
                inLoop = {
                  token : token,
                  org : {
                    level : level,
                    nest  : nest
                  },
                  cur : {
                    level : level,
                    nest  : nest
                  }
                };
              }
              break;
          case '(':
              nest++;
              if (inLoop) {
                inLoop.cur.nest++;
              }
              break;
          case ')':
              nest--;
              if (inLoop) {
                if (--inLoop.cur.nest === inLoop.org.nest &&
                    inLoop.cur.level === inLoop.org.level &&
                    inLoop.token === 'do'
                ) {
                  inLoop.last = true;
                }
              }
              break;
          case '{':
              level++;
              if (inLoop) {
                inLoop.cur.level++;
              }
              break;
          case '}':
              level--;
              if (inLoop) {
                if (--inLoop.cur.level === inLoop.org.level &&
                    inLoop.cur.nest === inLoop.org.nest &&
                    inLoop.token !== 'do'
                ) {
                  inLoop.last = true;
                }
              }
              break;
        }
        if (inLoop) {
          if (!(index in loops)) {
            loops[index] = [];
            offsets[index] = {
              start : i
            };
          }
          loops[index][loops[index].length] = token;
          if (inLoop.last) {
            offsets[index].end = i;
            inLoop = null;
            index++;
          }
        }
      }
      len = loops.length;
      for (i = 0; i < len; i++) {
        if (loops[i].length > max) {
          max = i;
        }
      }
      this.iteration = {
        loops : loops[max],
        start : offsets[max].start,
        end   : offsets[max].end
      };
      return result;
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    deferrizeLoop : function() {
      var tokens = this.iteration.loops,
          state = tokens.shift();
      switch (state) {
        case 'for'   : return this.parseFor(tokens);
        case 'while' : return this.parseWhile(tokens);
        case 'do'    : return this.parseDoWhile(tokens);
      }
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    deferrizeFunction : function() {
      var result, next, looped, token, i, len = this.tokens.length,
          key = 'before', enclose,
          states = {
            level : 0,
            block : 0
          },
          parts = {
            before : [],
            loop   : [],
            after  : [],
            result : []
          },
          /**@ignore*/
          openBlock = function(k) {
            if (!states[k]) {
              states[k] = {
                block : states.block,
                level : states.level
              };
            }
          },
          /**@ignore*/
          closeBlock = function(kv) {
            each(kv ? arrayize(kv) : ['func', 'cond'], function(k) {
              if (states[k] &&
                  states[k].block === states.block &&
                  states[k].level === states.level) {
                states[k] = null;
              }
            });
          };
      for (i = 1; i < len - 1; i++) {
        if (i >= this.iteration.start &&
            i <= this.iteration.end
        ) {
          if (!looped) {
            looped = true;
            i = this.iteration.end - 1;
            parts.loop = arrayize(this.deferrizeLoop());
            key = 'after';
            if (states.cond) {
              enclose = true;
            }
          }
          continue;
        }
        token = this.tokens[i];
        next = this.tokens[i + 1];
        switch (token) {
          case '{':
              states.block++;
              break;
          case '}':
              states.block--;
              closeBlock();
              break;
          case '(':
              states.level++;
              break;
          case ')':
              states.level--;
              if (states.cond && states.cond.expr && next === '{') {
                states.cond.expr = null;
                closeBlock('func');
              } else {
                closeBlock();
              }
              break;
          case ';':
              closeBlock('result');
              break;
          case 'function':
              openBlock('func');
              break;
          case 'if':
              openBlock('cond');
              states.cond.expr = true;
              break;
          case 'return':
              if (!states.func && !states.result) {
                if (!next || next === ';' || this.isNL(next)) {
                  token = this.format('#1 #2=void 0#3',
                    token,
                    this.uniqs.ret,
                    (next === ';' || this.isNL(next)) ? '' : ';'
                  );
                } else {
                  token = this.format('#1(#2!==#3)?#2:#2=',
                    token,
                    this.uniqs.ret,
                    this.uniqs.rev
                  );
                }
                parts.result = [];
                openBlock('result');
              }
              break;
          default:
              if (states.result && this.isNL(token)) {
                closeBlock('result');
              }
              break;
        }
        parts[key][parts[key].length] = token;
        if (states.result) {
          parts.result[parts.result.length] = token;
        }
      }
      result = this.format(
        '#1' +
        'var #2={},#3=#2,#4={};' +
        'return Pot.Deferred.begin(function(){' +
            '#5' +
            '#6' +
            '#9' +
          '});' +
          '#7' +
          '#8' +
        '}).then(function(r){' +
          'return(#2===#3)?r:#2;' +
        '});' +
        '#10',
        this.tokens.shift(),
        this.uniqs.ret,
        this.uniqs.rev,
        this.uniqs.nxt,
        this.toEnd(this.joinTokens(parts.before)),
        this.joinTokens(parts.loop),
        this.joinTokens(this.tails),
        this.joinTokens(enclose ? parts.after  : []),
        this.joinTokens(enclose ? parts.result : parts.after),
        this.tokens.pop()
      );
      return result;
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    parseWhile : function(tokens) {
      var result = '', level = 0, nest = 0, started = false,
          prev, next, skip, key = 'cond', inLoop, token, i,
          len = tokens.length, isEnd = false,
          states = {
            cond : [],
            body : []
          };
      for (i = 0; i < len; i++) {
        token = tokens[i];
        next = tokens[i + 1];
        skip = false;
        switch (token) {
          case '(':
              nest++;
              if (inLoop) {
                inLoop.cur.nest++;
              }
              if (i === 0 && nest === 1) {
                skip = true;
              }
              break;
          case ')':
              nest--;
              if (inLoop) {
                if (--inLoop.cur.nest === inLoop.org.nest &&
                    inLoop.cur.level === inLoop.org.level &&
                    inLoop.token === 'do'
                ) {
                  inLoop = null;
                }
              }
              if (!started && nest === 0 &&
                  level === 0 && next === '{') {
                skip = true;
              }
              break;
          case '{':
              level++;
              if (inLoop) {
                inLoop.cur.level++;
              }
              if (level === 1 && nest === 0 && prev === ')') {
                skip = true;
                started = true;
                key = 'body';
              }
              break;
          case '}':
              level--;
              if (inLoop) {
                if (--inLoop.cur.level === inLoop.org.level &&
                    inLoop.cur.nest === inLoop.org.nest &&
                    inLoop.token !== 'do'
                ) {
                  inLoop = null;
                }
              }
              if (started && nest === 0 && level === 0) {
                states.body.unshift(this.format(
                  'if(#1!==#2||!(#3)){' +
                    'throw Pot.StopIteration;' +
                  '}' +
                  'try{',
                  this.uniqs.ret,
                  this.uniqs.rev,
                  this.joinTokens(states.cond) || 'false'
                ));
                states.body.push(this.format(
                  '}catch(#1){' +
                    'if(Pot.isError(#1)||Pot.isStopIter(#1)){' +
                      'throw #1;' +
                    '}' +
                    'if(#1!==#2){' +
                      'throw #1;' +
                    '}' +
                  '}',
                  this.uniqs.err,
                  this.uniqs.nxt
                ));
                token += ').then(function(){';
                isEnd = true;
              }
              break;
          case 'for':
          case 'while':
          case 'do':
              inLoop = {
                token : token,
                org : {
                  level : level,
                  nest  : nest
                },
                cur : {
                  level : level,
                  nest  : nest
                }
              };
              break;
          case 'break':
              if (!inLoop && started && !this.isWord(next)) {
                token = 'throw Pot.StopIteration';
              }
              break;
          case 'continue':
              if (!inLoop && started && !this.isWord(next)) {
                token = 'throw ' + this.uniqs.nxt;
              }
              break;
          case 'return':
              if (started) {
                if (!next || next === ';' || this.isNL(next)) {
                  token = this.format('#1 #2=void 0#3',
                    token,
                    this.uniqs.ret,
                    (next === ';' || this.isNL(next)) ? '' : ';'
                  );
                } else {
                  token = this.format('#1 #2=',
                    token,
                    this.uniqs.ret
                  );
                }
              }
              break;
        }
        if (!skip) {
          states[key][states[key].length] = token;
        }
        prev = token;
      }
      result = '';
      if (!isEnd) {
        throw new Error("Parse error, expect 'while(...)'");
      }
      result = this.format(
        'return Pot.Deferred.forEver.#1(function(){' +
        '#2',
        SPEED,
        this.joinTokens(states.body)
      );
      return result;
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    parseDoWhile : function(tokens) {
      var result = '', level = 0, nest = 0, prev, next, skip,
          key = 'body', inLoop, token, i, len = tokens.length, isEnd = false,
          states = {
            cond  : [],
            body  : [],
            after : []
          };
      for (i = 0; i < len; i++) {
        token = tokens[i];
        next = tokens[i + 1];
        skip = false;
        switch (token) {
          case '(':
              nest++;
              if (inLoop) {
                inLoop.cur.nest++;
              }
              if (level === 0 && nest === 1 && prev === 'while') {
                skip = true;
                key = 'cond';
              }
              break;
          case ')':
              nest--;
              if (inLoop) {
                if (--inLoop.cur.nest === inLoop.org.nest &&
                    inLoop.cur.level === inLoop.org.level &&
                    inLoop.token === 'do'
                ) {
                  inLoop = null;
                }
              }
              if (nest === 0 && level === 0 && key === 'cond') {
                skip = true;
              }
              break;
          case '{':
              level++;
              if (inLoop) {
                inLoop.cur.level++;
              }
              if (i === 0 && level === 1) {
                skip = true;
              }
              break;
          case '}':
              level--;
              if (inLoop) {
                if (--inLoop.cur.level === inLoop.org.level &&
                    inLoop.cur.nest === inLoop.org.nest &&
                    inLoop.token !== 'do'
                ) {
                  inLoop = null;
                }
              }
              if (nest === 0 && level === 0 && next === 'while') {
                isEnd = true;
                skip = true;
              }
              break;
          case 'while':
              if (level === 0 && nest === 0) {
                skip = true;
                break;
              }
              // FALLTHROUGH
          case 'for':
          case 'do':
              inLoop = {
                token : token,
                org : {
                  level : level,
                  nest  : nest
                },
                cur : {
                  level : level,
                  nest  : nest
                }
              };
              break;
          case 'break':
              if (!inLoop && !this.isWord(next)) {
                token = 'throw Pot.StopIteration';
              }
              break;
          case 'continue':
              if (!inLoop && !this.isWord(next)) {
                token = 'throw ' + this.uniqs.nxt;
              }
              break;
          case 'return':
              if (!next || next === ';' || this.isNL(next)) {
                token = this.format('#1 #2=void 0#3',
                  token,
                  this.uniqs.ret,
                  (next === ';' || this.isNL(next)) ? '' : ';'
                );
              } else {
                token = this.format('#1 #2=',
                  token,
                  this.uniqs.ret
                );
              }
              break;
        }
        if (!skip) {
          states[key][states[key].length] = token;
        }
        prev = token;
      }
      result = '';
      if (!isEnd) {
        throw new Error("Parse error, expect 'do...while()'");
      }
      states.body.unshift(this.format(
        'if(#1!==#2){' +
          'throw Pot.StopIteration;' +
        '}' +
        'try{',
        this.uniqs.ret,
        this.uniqs.rev
      ));
      states.body.push(this.format(
        '}catch(#1){' +
          'if(Pot.isError(#1)||Pot.isStopIter(#1)){' +
            'throw #1;' +
          '}' +
          'if(#1!==#2){' +
            'throw #1;' +
          '}' +
        '}finally{' +
          'if(!(#3)){' +
            'throw Pot.StopIteration;' +
          '}' +
        '}' +
        '}).then(function(){',
        this.uniqs.err,
        this.uniqs.nxt,
        this.joinTokens(states.cond) || 'false'
      ));
      result = this.format(
        'return Pot.Deferred.forEver.#1(function(){' +
        '#2',
        SPEED,
        this.joinTokens(states.body)
      );
      return result;
    },
    /**
     * @internal
     * @private
     * @ignore
     */
    parseFor : function(tokens) {
      var result = '', level = 0, nest = 0, isInOrOf = null, started = false,
          prev, next, skip, key = 'before', varType, inLoop, i, len, token,
          isEnd = false,
          states = {
            prefix : [],
            suffix : [],
            before : [],
            cond   : [],
            after  : [],
            key    : [],
            target : [],
            body   : []
          };
      len = tokens.length;
      for (i = 0; i < len; i++) {
        token = tokens[i];
        next = tokens[i + 1];
        skip = false;
        switch (token) {
          case '(':
              nest++;
              if (inLoop) {
                inLoop.cur.nest++;
              }
              if (i === 0 && nest === 1) {
                skip = true;
              }
              break;
          case ')':
              nest--;
              if (inLoop) {
                if (--inLoop.cur.nest === inLoop.org.nest &&
                    inLoop.cur.level === inLoop.org.level &&
                    inLoop.token === 'do'
                ) {
                  inLoop = null;
                }
              }
              if (!started && nest === 0 &&
                  level === 0 && next === '{') {
                skip = true;
              }
              break;
          case '{':
              level++;
              if (inLoop) {
                inLoop.cur.level++;
              }
              if (level === 1 && nest === 0 && prev === ')') {
                skip = true;
                started = true;
                key = 'body';
              }
              break;
          case '}':
              level--;
              if (inLoop) {
                if (--inLoop.cur.level === inLoop.org.level &&
                    inLoop.cur.nest === inLoop.org.nest &&
                    inLoop.token !== 'do'
                ) {
                  inLoop = null;
                }
              }
              if (started && nest === 0 && level === 0) {
                states.body.unshift(this.format(
                  'if(#1!==#2){' +
                    'throw Pot.StopIteration;' +
                  '}' +
                  'try{',
                  this.uniqs.ret,
                  this.uniqs.rev
                ));
                if (states.suffix.length) {
                  states.body.push(
                    this.toEnd(this.joinTokens(states.suffix))
                  );
                }
                states.body.push(this.format(
                  '}catch(#1){' +
                    'if(Pot.isError(#1)||Pot.isStopIter(#1)){' +
                      'throw #1;' +
                    '}' +
                    'if(#1!==#2){' +
                      'throw #1;' +
                    '}' +
                  '}finally{' +
                    '#3' +
                  '}',
                  this.uniqs.err,
                  this.uniqs.nxt,
                  this.toEnd(this.joinTokens(states.after))
                ));
                token += ').then(function(){';
                isEnd = true;
              }
              break;
          case 'each':
              if (i === 0) {
                throw new Error("Not supported 'for each'");
              }
              break;
          case 'in':
          case 'of':
              if (!started && isInOrOf === null &&
                  nest === 1 && level === 0
              ) {
                skip = true;
                isInOrOf = true;
                if (states.before.length > 2) {
                  throw new Error(
                    "Invalid keys, expect 'for(var [...] in ...);'"
                  );
                }
                if (varType) {
                  states.before.push(';');
                  unshift.apply(states.prefix, states.before);
                  states.before.shift();
                  states.before.pop();
                  if (varType === 'let') {
                    states.prefix.unshift('{');
                    this.tails.push('}');
                  }
                }
                states.before.push('=' + this.uniqs.key);
                states.before.push(';');
                states.key = states.before;
                unshift.apply(states.body, states.key);
                key = 'target';
              }
              break;
          case 'var':
          case 'let':
              if (!varType && i === 1 && nest === 1) {
                varType = token;
              }
              break;
          case ',':
              if (!started && nest === 1 && level === 0 &&
                  !varType &&
                  (key === 'before' || key === 'after')
              ) {
                token = ';';
              }
              break;
          case ';':
              if (!started && nest === 1 && level === 0) {
                skip = true;
                if (isInOrOf === null) {
                  isInOrOf = false;
                }
                if (key === 'before') {
                  key = 'cond';
                  states.prefix.push(
                    this.toEnd(this.joinTokens(states.before))
                  );
                  if (varType === 'let') {
                    states.prefix.unshift('{');
                    this.tails.push('}');
                  }
                } else if (key === 'cond') {
                  key = 'after';
                  if (states.cond.length) {
                    states.cond.unshift('if(');
                    states.cond.push('){');
                    states.suffix.push('}else{throw Pot.StopIteration;}');
                  }
                  push.apply(states.body, states.cond);
                }
              }
              break;
          case 'for':
          case 'while':
          case 'do':
              inLoop = {
                token : token,
                org : {
                  level : level,
                  nest  : nest
                },
                cur : {
                  level : level,
                  nest  : nest
                }
              };
              break;
          case 'break':
              if (!inLoop && started && !this.isWord(next)) {
                token = 'throw Pot.StopIteration';
              }
              break;
          case 'continue':
              if (!inLoop && started && !this.isWord(next)) {
                token = 'throw ' + this.uniqs.nxt;
              }
              break;
          case 'return':
              if (started) {
                if (!next || next === ';' || this.isNL(next)) {
                  token = this.format('#1 #2=void 0#3',
                    token,
                    this.uniqs.ret,
                    (next === ';' || this.isNL(next)) ? '' : ';'
                  );
                } else {
                  token = this.format('#1 #2=',
                    token,
                    this.uniqs.ret
                  );
                }
              }
              break;
        }
        if (!skip) {
          states[key][states[key].length] = token;
        }
        prev = token;
      }
      result = '';
      if (!isEnd) {
        throw new Error("Parse error, expect 'for(...)'");
      }
      if (isInOrOf) {
        result = this.format(
          '#1return Pot.Deferred.forEach.#2(#3,function(#4,#5){' +
          '#6',
          this.toEnd(this.joinTokens(states.prefix)),
          SPEED,
          this.joinTokens(states.target),
          this.uniqs.val,
          this.uniqs.key,
          this.joinTokens(states.body)
        );
      } else {
        result = this.format(
          '#1return Pot.Deferred.forEver.#2(function(){' +
          '#3',
          this.toEnd(this.joinTokens(states.prefix)),
          SPEED,
          this.joinTokens(states.body)
        );
      }
      return result;
    }
  });
  Deferrizer.prototype.init.prototype = Deferrizer.prototype;
  update(PotInternal, {
    /**
     * @lends Pot.Internal
     */
    /**
     * @type Function
     * @internal
     * @ignore
     */
    deferrate : function(func) {
      return (new Deferrizer(func)).execute();
    }
  });
  // Update Pot/Pot.Deferred.
  update(Deferred, {
    /**
     * @lends Pot.Deferred
     */
    /**
     * Create new defer function with speeds from static function.
     * That returns a new instance of Pot.Deferred that
     *  has already ".begin()" called.
     * This function works like 'deferrize'.
     * This function will redefine the function that converts the
     *  synchronous loop block (i.e. for, for-in, do, while) to the
     *  asynchronous iteration by Pot.Deferred.xxx.
     *
     *
     * @example
     *   var toCharCode = function(string) {
     *     var result = [];
     *     for (var i = 0; i < string.length; i++) {
     *       result.push(string.charCodeAt(i));
     *     }
     *     return result;
     *   };
     *   var toCharCodeDefer = Pot.deferreed(toCharCode);
     *   // Note:
     *   //  toCharCodeDefer like below.
     *   //
     *   //  function(string) {
     *   //    var result = [];
     *   //    return Pot.Deferred.repeat(string.length, function(i) {
     *   //      result.push(string.charCodeAt(i));
     *   //    }).then(function() {
     *   //      return result;
     *   //    });
     *   //  };
     *   //
     *   toCharCodeDefer('abc').then(function(res) {
     *     Pot.debug(res); // @results [97, 98, 99]
     *   });
     *   // Large string.
     *   var largeString = new Array(100000).join('abcdef');
     *   // Specify speed 'slow'.
     *   toCharCodeDefer.slow(largeString).then(function(res) {
     *     Pot.debug(res.length); // @results  599994
     *   });
     *
     *
     * @example
     *   // Compress/Decompress string by LZ77 algorithm.
     *   // http://polygon-planet.blogspot.com/2011/02/lz77javascript.html
     *   var TinyLz77 = {
     *     // compress (synchronous)
     *     compress : function(s) {
     *       var a = 53300, b, c, d, e, f, g = -1,
     *           h, i, r = [], x = String.fromCharCode;
     *       if (!s) {
     *         return '';
     *       }
     *       s = new Array(a--).join(' ') + s;
     *       while ((b = s.substr(a, 256))) {
     *         for (c = 2, i = b.length; c <= i; ++c) {
     *           d = s.substring(
     *               a - 52275,
     *               a + c - 1
     *           ).lastIndexOf(b.substring(0, c));
     *           if (!~d) {
     *             break;
     *           }
     *           e = d;
     *         }
     *         if (c === 2 || c === 3 && f === g) {
     *           f = g;
     *           h = s.charCodeAt(a++);
     *           r.push(
     *               x(h >> 8 & 255),
     *               x(h & 255)
     *           );
     *         } else {
     *           r.push(
     *               x((e >> 8 & 255) | 65280),
     *               x(e & 255),
     *               x(c - 3)
     *           );
     *           a += c - 1;
     *         }
     *       }
     *       return r.join('');
     *     },
     *     // decompress (synchronous)
     *     decompress : function(s) {
     *       var a = 53300, b = 0, c, d, e, f, g,
     *           h, r = new Array(a--).join(' '),
     *           x = String.fromCharCode;
     *       if (s && s.length) {
     *         do {
     *           c = s.charCodeAt(b++);
     *           if (c <= 255) {
     *             r += x((c << 8) | s.charCodeAt(b++));
     *           } else {
     *             e = ((c & 255) << 8) | s.charCodeAt(b++);
     *             f = e + s.charCodeAt(b++) + 2;
     *             h = r.slice(-52275);
     *             g = h.substring(e, f);
     *             if (g) {
     *               while (h.length < f) {
     *                 h += g;
     *               }
     *               r += h.substring(e, f);
     *             }
     *           }
     *         } while (b < s.length);
     *       }
     *       return r.slice(a);
     *     }
     *   };
     *   // create asynchronous iteration functions.
     *   var compressDefer   = Pot.deferreed(TinyLz77, 'compress');
     *   var decompressDefer = Pot.deferreed(TinyLz77, 'decompress');
     *   // original string.
     *   var string = 'foooooooooo baaaaaaaaaaaaar baaaaaaazzzzzzzzzzzz';
     *   Pot.debug(string.length); // 48
     *   // execute compress with asynchronous iterator.
     *   compressDefer(string).then(function(res) {
     *     Pot.debug(res.length); // 26
     *     return decompressDefer(res).then(function(res) {
     *       Pot.debug(res.length); // 48
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
     *                                      Returns new asynchronous
     *                                        function that has
     *                                        each speeds below.
     *                                      <pre>
     *                                      ----------------------------------
     *                                       method name |  speed
     *                                      ----------------------------------
     *                                       limp        :  slowest
     *                                       doze        :  slower
     *                                       slow        :  slow
     *                                       normal      :  normal (default)
     *                                       fast        :  fast
     *                                       rapid       :  faster
     *                                       ninja       :  fastest
     *                                      ----------------------------------
     *                                      You can control speed by
     *                                        specify key.
     *                                      e.g.
     *                                        var f = deferreed(func);
     *                                        f();      // normal
     *                                        f.slow(); // slow
     *                                      </pre>
     * @type   Function
     * @function
     * @public
     * @static
     */
    deferreed : function(object, method) {
      var result, func, context, err, code, proc;
      try {
        switch (arguments.length) {
          case 0:
              throw false;
          case 1:
              func = object;
              if (!isFunction(func)) {
                throw func;
              }
              proc = func;
              break;
          case 2:
          default:
              if (isObject(method)) {
                context = method;
                func    = object;
              } else {
                func    = method;
                context = object;
              }
              if (!isFunction(context[func])) {
                throw func;
              }
              proc = context[func];
              break;
        }
        if (!proc || !isFunction(proc) || Pot.isBuiltinMethod(proc)) {
          throw proc;
        }
        code = PotInternal.deferrate(proc);
        if (!code) {
          throw code;
        }
        if (code === proc) {
          result = Deferred.deferrize(proc);
        } else {
          if (!isString(code)) {
            throw code;
          }
          result = PotInternal.defineDeferrater(function(speedKey) {
            var c = code.replace(SPEED, speedKey),
                f = Pot.localEval(c, context);
            return function() {
              return f.apply(context, arguments);
            };
          });
        }
        if (!result || !isFunction(result)) {
          throw result;
        }
      } catch (e) {
        err = e;
        throw isError(err) ? err : new Error(err);
      }
      return result;
    }
  });
  // Refer Pot object.
  Pot.update({
    deferreed : Deferred.deferreed
  });
}());

delete PotTmp.createIterators;
delete PotTmp.createProtoIterators;
delete PotTmp.createSyncIterator;
}());

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Web Worker.
(function() {
var WorkerServer,
    WorkerChild,
    PREFIX = '.',
    RE = {
      URI  : /^(?:[\w.*=+-]+:+|)[-.!~\w\/\\?@&=+$%#^]+$/i,
      FUNC : /^[\s();]*(?:new|)[\s();]*|[\s();]*$/g,
      FUNF : /^[\s();]*(?:new|)[\s();]{0,}/,
      FUNT : /[\s();]*$/,
      HEAD : /^(?:(?![(]?[)]{0}function)[\s\S])*([(]?[)]{0}function)\b/,
      DEFF : /^[\s;{}()]*(?:new|)[\s;{}()]*function\b/,
      DEFT : /[^{]*[}][\s;]*$/,
      PREF : /^([\s;{}()]*(?:new|)[\s;{}()]*function\b[^{]+?[{])(?=[^}]*[}])/,
      ARGS : /^function\s*[^()]*?[(]\s*(?:\S[^()]*?)\s*[)]/,
      LOAD : /complete|loaded/i,
      DATA : new RegExp(
          '^' +
            'data:' +
            '((?:[\\w.*+-]+/[\\w.*+-]+|[*]|)(?=[;,])|)' +
            '(;?charset=["\']?[\\w.=*+-]+[\'"]?(?=[;,])|)' +
            '(;?base64(?=,)|)' +
            ',' +
            '([\\s\\S]*)' +
          '$',
        'i'
      ),
      MSG  : new RegExp(
              '(?:^|\\b)(?:\\[["\']|)onmessage(?:[\'"]\\]|)\\s*=' +
        '|' + '(?:^|\\b)addEventListener\\s*[(]\\s*' +
              '["\'](?:[Oo][Nn]|)[Mm][Ee][Ss][Ss][Aa][Gg][Ee][\'"]' +
              '[\\s\\S]*?[)]'
      )
    };

/**@ignore*/
WorkerServer = function(js) {
  return new WorkerServer.fn.init(js);
};

WorkerServer.fn = WorkerServer.prototype = update(WorkerServer.prototype, {
  /**
   * @ignore
   */
  constructor : WorkerServer,
  /**
   * @private
   * @ignore
   */
  child : null,
  /**
   * @private
   * @ignore
   */
  queues : [],
  /**
   * @private
   * @ignore
   */
  fired : false,
  /**
   * @private
   * @ignore
   */
  callback : null,
  /**
   * @private
   * @ignore
   */
  init : function(js) {
    this.queues = [];
    this.child = new WorkerChild(this, js);
    return this;
  },
  /**
   * @param {String} data message
   * @ignore
   */
  postMessage : function(data) {
    var that = this, child = this.child;
    this.queues.push(data);
    Deferred.till(function() {
      return child.isReady();
    }).then(function() {
      var items = arrayize(that.queues.splice(0, that.queues.length));
      return Deferred.forEach(items, function(item) {
        return Deferred.flush(function() {
          var err;
          try {
            if (child.nativeWorker) {
              child.nativeWorker.postMessage(item);
            } else {
              child.onmessage({data : item});
            }
          } catch (e) {
            err = e;
            if (!isStopIter(err)) {
              throw err;
            }
          } finally {
            that.fired = true;
          }
        });
      });
    });
  },
  /**
   * @ignore
   */
  terminate : function() {
    var child = this.child;
    if (child) {
      if (child.nativeWorker) {
        child.nativeWorker.terminate();
      }
      if (child.context && child.stopId && child.stopId in child.context) {
        child.context[child.stopId] = true;
        if (child.elem) {
          // When removes iframe in asynchronous processing will be warnings.
          Deferred.till(function() {
            return child.context[child.isStoppedId] === true;
          }).wait(1).then(function() {
            try {
              child.elem.parentNode.removeChild(child.elem);
            } catch (e) {}
            child.elem = null;
          }).ensure(function() {
            // ignore error.
          });
        }
      }
    }
  },
  /**
   * @ignore
   */
  addEventListener : function(type, func/*[, useCapture]*/) {
    if (isFunction(func)) {
      switch (stringify(type).toLowerCase()) {
        case 'message':
            this.onmessage = func;
            break;
        case 'error':
            this.onerror = func;
      }
    }
  },
  /**
   * @ignore
   */
  removeEventListener : function(type/*, func[, useCapture]*/) {
    switch (stringify(type).toLowerCase()) {
      case 'message':
          this.onmessage = null;
          break;
      case 'error':
          this.onerror = null;
    }
  }
});
WorkerServer.fn.init.prototype = WorkerServer.fn;

/**@ignore*/
WorkerChild = function(server, js) {
  return new WorkerChild.fn.init(server, js);
};

WorkerChild.fn = WorkerChild.prototype = update(WorkerChild.prototype, {
  /**
   * @ignore
   */
  constructor : WorkerChild,
  /**
   * @private
   * @ignore
   */
  server : null,
  /**
   * @private
   * @ignore
   */
  queues : [],
  /**
   * @private
   * @ignore
   */
  loaded : false,
  /**
   * @private
   * @ignore
   */
  context : {},
  /**
   * @private
   * @ignore
   */
  elem : null,
  /**
   * @private
   * @ignore
   */
  nativeWorker : null,
  /**
   * @private
   * @ignore
   */
  stopId : null,
  /**
   * @private
   * @ignore
   */
  isStoppedId : null,
  /**
   * @private
   * @ignore
   */
  usePot : false,
  /**
   * @private
   * @ignore
   */
  init : function(server, js) {
    var that = this;
    this.queues = [];
    this.server = server;
    this.context = update({}, {
      postMessage         : bind(this.postMessage, this),
      importScripts       : bind(this.importScripts, this),
      addEventListener    : bind(this.addEventListener, this),
      removeEventListener : bind(this.removeEventListener, this),
      onmessage           : null,
      onerror             : null
    });
    each({
      stopId      : ['stop',    false],
      isStoppedId : ['stopped', false]
    }, function(v, k) {
      that[k] = buildSerial(Pot, v[0]);
      that.context[that[k]] = v[1];
    });
    Deferred.flush(function() {
      that.runScript(js);
    });
    return this;
  },
  /**
   * @private
   * @ignore
   */
  compriseScript : function(script, isFunc) {
    var result = '', tokens, code, hasWorker;
    if ((PotSystem.hasWorker &&
         (PotSystem.canWorkerDataURI || PotSystem.canWorkerBlobURI)) ||
        (PotSystem.hasChromeWorker &&
         (PotSystem.canChromeWorkerDataURI || PotSystem.canChromeWorkerBlobURI))
    ) {
      hasWorker = true;
    }
    if (script) {
      if (isFunc) {
        code = Pot.getFunctionCode(script).replace(RE.FUNC, '');
      } else {
        code = stringify(script, true);
      }
      tokens = Pot.tokenize(code);
      code = Pot.joinTokens(tokens);
      this.usePot = this.isPotUsing(tokens);
      if (this.usePot && PotSystem.isMozillaBlobBuilder) {
        //XXX: Fix setTimeout and scope in Firefox's Worker thread.
        hasWorker = false;
      }
      if (RE.MSG.test(code)) {
        // STATE: has onmessage settings: onmessage = function(ev) {...}
        if (hasWorker) {
          result = this.insertProvision(tokens, isFunc);
        } else {
          if (RE.DEFF.test(code)) {
            code = Pot.format(
              '(#1).call(this);',
              code.replace(RE.HEAD, '$1').replace(RE.FUNC, '')
            );
            result = this.insertStepStatements(Pot.tokenize(code));
          } else {
            result = this.insertStepStatements(tokens);
          }
        }
      } else {
        if (RE.DEFF.test(code)) {
          code = Pot.format(
            '(#1).call(' +
              'this,' +
              '(!event||typeof event.data==="undefined")?void 0:event.data,' +
              'event' +
            ');',
            code.replace(RE.HEAD, '$1').replace(RE.FUNC, '')
          );
        }
        if (hasWorker) {
          result = this.providePot(code);
        } else {
          code = this.insertStepStatements(Pot.tokenize(code));
          result = 'onmessage=(function(){' +
            'var self=this;' +
            'return function(){' +
              'var event=arguments[0];' +
              'return(function(){' +
                code +
              '}).call(self);' +
            '};' +
          '}).call(' +
            '(typeof self!=="undefined"&&self&&' +
             'self.postMessage)?self:this' +
          ');';
        }
      }
    }
    return result;
  },
  /**
   * @private
   * @ignore
   */
  isPotUsing : function(tokens) {
    var result = false, i, j, k, len, token, next, next2;
    if (tokens) {
      len = tokens.length;
      for (i = 0; i < len; i++) {
        token = tokens[i];
        next = '';
        for (j = i + 1; j < len; j++) {
          next = tokens[j];
          if (Pot.isNL(next)) {
            continue;
          } else {
            break;
          }
        }
        next2 = '';
        for (k = j + 1; k < len; k++) {
          next2 = tokens[k];
          if (Pot.isNL(next2)) {
            continue;
          } else {
            break;
          }
        }
        switch (token) {
          case 'Pot':
              if (next === '.' ||
                  (next === '[' && next2 !== ']')) {
                result = true;
              }
        }
        if (result) {
          break;
        }
      }
    }
    return result;
  },
  /**
   * @private
   * @ignore
   */
  insertStepStatements : function(tokens) {
    var results = [],
        token, i, j, k, len, prev, next, next2, add,
        id = buildSerial(Pot, '$this$scope'),
        statements = {
          pre  : Pot.format(
            'var #1=this;' +
            'Pot.Deferred.forEver(function(){(function(){',
            id
          ),
          suf  : Pot.format(
            '}).call(#1);throw Pot.StopIteration;}).then(function(){' +
              '#2=true;' +
            '});',
            id, this.isStoppedId
          ),
          step : Pot.format(
            'if(#1){throw Pot.StopIteration;}',
            this.stopId
          )
        };
    len = tokens.length;
    for (i = 0; i < len; i++) {
      add = false;
      token = tokens[i];
      next = '';
      for (j = i + 1; j < len; j++) {
        next = tokens[j];
        if (Pot.isNL(next)) {
          continue;
        } else {
          break;
        }
      }
      next2 = '';
      for (k = j + 1; k < len; k++) {
        next2 = tokens[k];
        if (Pot.isNL(next2)) {
          continue;
        } else {
          break;
        }
      }
      switch (token) {
        case '{':
            if (prev === ')'    && next !== '}' &&
                next !== 'case' && next !== 'default' &&
                next2 !== ':') {
              add = true;
            }
      }
      if (!Pot.isNL(token)) {
        prev = token;
      }
      results[results.length] = token;
      if (add) {
        results[results.length] = statements.step;
      }
    }
    results.unshift(statements.pre + statements.step);
    results.push(statements.suf);
    return Pot.joinTokens(results);
  },
  /**
   * @private
   * @ignore
   */
  providePot : function(code) {
    var result,
        scope = buildSerial({NAME : 'scope'}, '$'),
        script = this.getPotScript();
    result = Pot.format(
      'var #1=this;' +
      'onmessage=(function(){' +
        'var self=this;' +
        'return function(){' +
          'var event=arguments[0];' +
          'if(typeof Pot==="undefined"){' +
            '(#2)(#1||{});' +
          '}' +
          'return(function(){' +
            '#3' +
          '}).call(self);' +
        '};' +
      '}).call(' +
        '(typeof self!=="undefined"&&self&&' +
         'self.postMessage)?self:this' +
      ');',
      scope,
      script,
      code
    );
    return result;
  },
  /**
   * @private
   * @ignore
   */
  insertProvision : function(tokens, isFunc) {
    var result, code, parts,
        names = {},
        script = this.getPotScript();
    each(['scope', 'script', 'func'], function(name) {
      names[name] = buildSerial({NAME : name}, '$');
    });
    parts = this.parseScript(tokens);
    code = Pot.format(
      '(function(){' +
        'var self=this;' +
        'return function(){' +
          'return(function(){' +
            'if(typeof Pot==="undefined"){' +
              '(#1)(#2||{});' +
            '}' +
            'var #3=#4;' +
            'return #3.apply(this,arguments);' +
          '}).apply(self,arguments);' +
        '};' +
      '}).call(' +
        '(typeof self!=="undefined"&&self&&' +
         'self.postMessage)?self:this' +
      ')\n',
      script,
      names.scope,
      names.func,
      parts.func
    );
    if (isFunc ||
        (RE.DEFF.test(parts.pre) && RE.DEFT.test(parts.suf))) {
      result = Pot.format(
        'var #1=this;(#2#3#4).call(this);',
        names.scope,
        parts.pre.replace(RE.FUNF, ''),
        code,
        parts.suf.replace(RE.FUNT, '')
      );
    } else {
      result = Pot.format(
        'var #1=this;#2#3#4',
        names.scope,
        parts.pre,
        code,
        parts.suf
      );
    }
    return result;
  },
  /**
   * @private
   * @ignore
   */
  getPotScript : function() {
    var script = Pot.getFunctionCode(
      PotInternal.ScriptImplementation
    ).replace(RE.FUNC, '');
    return script;
  },
  /**
   * @private
   * @ignore
   */
  parseScript : function(tokens) {
    var pres = [], sufs = [], parts = [],
        i, j, len = tokens && tokens.length,
        token, next, first, last,
        prepared, unwrap, inListener, inFunc, inPrefunc,
        level, startLevel,
        depth, startDepth,
        skip, endScope;
    for (i = 0; i < len; i++) {
      token = tokens[i];
      if (skip) {
        sufs[sufs.length] = token;
        continue;
      }
      next = '';
      for (j = i + 1; j < len; j++) {
        next = tokens[j];
        if (Pot.isNL(next)) {
          continue;
        } else {
          break;
        }
      }
      switch (token) {
        case 'onmessage':
            inListener = false;
            if (next === '=' && !inFunc && !endScope) {
              inPrefunc = true;
            }
            break;
        case 'function':
            inListener = false;
            if (prepared) {
              inFunc = true;
            }
            break;
        case 'addEventListener':
            inListener = true;
            break;
        case '=':
            if (inPrefunc && !inFunc && !endScope) {
              first = true;
              inPrefunc = false;
            }
            break;
        case '{':
            if (prepared && inFunc && !endScope) {
              startLevel = level = 1;
              prepared = false;
            } else if (inFunc && !endScope) {
              level++;
            }
            break;
        case '}':
            if (inFunc && !endScope) {
              if (level-- === startLevel) {
                endScope = true;
                if (next === '(' || next === ')' || next === '.') {
                  break;
                }
                inFunc = false;
                last = true;
              }
            }
            break;
        case '(':
            if (endScope && inFunc && startDepth == null) {
              startDepth = depth = 1;
            } else if (inFunc) {
              depth++;
            }
            break;
        case ')':
            if (endScope && inFunc) {
              if (startDepth == null) {
                if (next === '(' || next === ')' || next === '.') {
                  break;
                }
                inFunc = false;
                last = true;
              } else {
                depth--;
                if (next === '(' || next === ')' || next === '.') {
                  break;
                }
                if (depth === startDepth - 1) {
                  inFunc = false;
                  last = true;
                }
              }
            }
            break;
        case ',':
            if (inListener && inPrefunc && !inFunc && !endScope) {
              first = true;
              inPrefunc = false;
            }
            break;
        default:
            if (inListener && next === ',' &&
                ((token.charAt(0) === '"' && token.slice(-1) === '"') ||
                 (token.charAt(0) === "'" && token.slice(-1) === "'"))
            ) {
              unwrap = token.slice(1, -1).toLowerCase();
              if (unwrap === 'message') {
                inPrefunc = true;
                break;
              }
            }
            if (inListener && Pot.isWords(token)) {
              inListener = false;
            }
      }
      if (prepared || inFunc || last) {
        parts[parts.length] = token;
        if (last) {
          last = false;
          skip = true;
        }
      } else {
        pres[pres.length] = token;
        if (first) {
          prepared = true;
          first = false;
        }
      }
    }
    return {
      pre  : Pot.joinTokens(pres),
      suf  : Pot.joinTokens(sufs),
      func : Pot.joinTokens(parts)
    };
  },
  /**
   * @private
   * @ignore
   */
  loadScript : function(js, recursive) {
    var that = this, result, code,
        hasWorker, canWorkerDataURI, canWorkerBlobURI;
    if (isChromeWorkerAvailable()) {
      hasWorker = PotSystem.hasChromeWorker;
      canWorkerDataURI = hasWorker && PotSystem.canChromeWorkerDataURI;
      canWorkerBlobURI = hasWorker && PotSystem.canChromeWorkerBlobURI;
    } else {
      hasWorker = PotSystem.hasWorker;
      canWorkerDataURI = hasWorker && PotSystem.canWorkerDataURI;
      canWorkerBlobURI = hasWorker && PotSystem.canWorkerBlobURI;
    }
    if (js) {
      if (isFunction(js)) {
        code = this.compriseScript(js, true);
        if (PotSystem.isMozillaBlobBuilder && this.usePot) {
          result = [code, false];
        } else if (canWorkerBlobURI) {
          result = [toBlobURI(code), true];
        } else if (canWorkerDataURI) {
          result = [toDataURI(code), true];
        } else {
          result = [code, false];
        }
      } else {
        code = stringify(js, true);
        if (isURI(code)) {
          if (isJavaScriptScheme(code)) {
            code = this.compriseScript(fromJavaScriptScheme(code));
            if (PotSystem.isMozillaBlobBuilder && this.usePot) {
              result = [code, false];
            } else if (canWorkerBlobURI) {
              result = [toBlobURI(code), true];
            } else if (canWorkerDataURI) {
              result = [toDataURI(code), true];
            } else {
              result = [code, false];
            }
          } else if (isDataURI(code)) {
            code = this.compriseScript(fromDataURI(code));
            if (PotSystem.isMozillaBlobBuilder && this.usePot) {
              result = [code, false];
            } else if (canWorkerDataURI) {
              result = [toDataURI(code), true];
            } else if (canWorkerBlobURI) {
              result = [toBlobURI(code), true];
            } else {
              result = [code, false];
            }
          } else {
            if (recursive) {
              result = this.compriseScript(code);
            } else {
              result = getScript(code, true).then(function(res) {
                return that.loadScript(res, true);
              });
            }
          }
        } else {
          code = this.compriseScript(code);
          if (PotSystem.isMozillaBlobBuilder && this.usePot) {
            result = [code, false];
          } else if (canWorkerBlobURI) {
            result = [toBlobURI(code), true];
          } else if (canWorkerDataURI) {
            result = [toDataURI(code), true];
          } else {
            result = [code, false];
          }
        }
      }
    }
    return Deferred.maybeDeferred(result);
  },
  /**
   * @private
   * @ignore
   */
  runScript : function(js) {
    var that = this;
    return this.loadScript(js).then(function(code, useNative) {
      var elem;
      if (code) {
        if (useNative) {
          that.nativeWorker = createWorker(code);
          that.loaded = true;
        } else {
          if (PotSystem.isWebBrowser && PotSystem.isNotExtension) {
            elem = runWithFrame(code, that.context, that);
          }
          if (elem) {
            that.elem = elem;
            Deferred.till(function() {
              return isFrameLoaded(elem);
            }).then(function() {
              that.loaded = true;
            });
          } else {
            runWithFunction(code, that.context);
            that.loaded = true;
          }
        }
      }
    });
  },
  /**
   * @private
   * @ignore
   */
  isReady : function() {
    this.referEvents();
    return this.loaded && (
      (this.nativeWorker && this.nativeWorker.onmessage) ||
      (isFunction(this.server.onmessage) && isFunction(this.onmessage))
    );
  },
  /**
   * @private
   * @ignore
   */
  referEvents : function() {
    if (this.nativeWorker) {
      if (this.server.onmessage) {
        this.nativeWorker.onmessage = this.server.onmessage;
      }
      if (this.server.onerror) {
        this.nativeWorker.onerror = this.server.onerror;
      }
    } else if (this.context) {
      if (this.context.onmessage) {
        this.onmessage = this.context.onmessage;
      }
      if (this.context.onerror) {
        this.onerror = this.context.onerror;
      }
    }
  },
  /**
   * @private
   * @ignore
   */
  postMessage : function(data) {
    var that = this;
    this.queues.push(data);
    return Deferred.till(function() {
      return that.isReady() && that.server.fired;
    }).then(function() {
      var items = arrayize(that.queues.splice(0, that.queues.length));
      return Deferred.forEach(items, function(item) {
        return Deferred.flush(function() {
          var err;
          try {
            that.server.onmessage({data : item});
          } catch (e) {
            err = e;
            if (!isStopIter(err)) {
              throw err;
            }
          }
        });
      });
    });
  },
  /**
   * @private
   * @ignore
   */
  importScripts : function() {
    var that = this, i, args = arguments, len = args.length, js;
    for (i = 0; i < len; i++) {
      js = stringify(args[i]);
      if (js) {
        getScript(js, true).then(function(code) {
          if (that.elem) {
            runSubScriptWithFrame(code, that.elem, that.context);
          } else {
            Pot.globalEval(code);
          }
        });
      }
    }
  },
  /**
   * @private
   * @ignore
   */
  addEventListener : function(type, func/*[, useCapture]*/) {
    if (isFunction(func)) {
      switch (stringify(type).toLowerCase()) {
        case 'message':
            this.onmessage = func;
            break;
        case 'error':
            this.onerror = func;
      }
    }
  },
  /**
   * @private
   * @ignore
   */
  removeEventListener : function(type/*, func[, useCapture]*/) {
    switch (stringify(type).toLowerCase()) {
      case 'message':
          this.onmessage = null;
          break;
      case 'error':
          this.onerror = null;
    }
  }
});
WorkerChild.fn.init.prototype = WorkerChild.fn;

// Definition of Pot.Workeroid.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * Pot.Workeroid implements an API for running scripts in the background
   *  independently of any user interface scripts that is inherited from the
   *  native Worker.
   * Pot.Workeroid emulates native Worker API if user environment not has
   *  Web Worker.
   * This allows for background tasks for long-running scripts or
   *  heavy-weight processing that are not interrupted by scripts that
   *  respond to user interactions.
   *
   *
   * @example
   *   var worker = new Pot.Workeroid(function(data) {
   *     // This function scope is a child Worker's "onmessage" that
   *     //  will be other process or thread.
   *     switch (data) {
   *       case 'foo':
   *           postMessage('foo!');
   *           break;
   *       case 'bar':
   *           postMessage('bar!');
   *           break;
   *       default:
   *           postMessage('hello!');
   *           break;
   *     }
   *   });
   *   // You can coding like same usage of native Worker.
   *   worker.onmessage = function(data) {
   *     Pot.debug(data);
   *   };
   *   worker.onerror = function(err) {
   *     Pot.debug(err);
   *   };
   *   // Sends data and starts Worker thread.
   *   worker.postMessage('foo');
   *   // -- results --
   *   //  This will be received a message "foo!" from a child Worker.
   *   //
   *
   *
   * @param  {String|Function|Object|*} script Script that will runs in
   *                                             child processing.
   * @return {Pot.Workeroid}                   Returns an instance of
   *                                             Pot.Workeroid.
   *
   * @name  Pot.Workeroid
   * @class
   * @constructor
   * @public
   */
  Workeroid : function(script) {
    return isWorkeroid(this) ? this.init(script)
                             : new Workeroid.fn.init(script);
  }
});

// Refer the Pot properties/functions.
Workeroid = Pot.Workeroid;

Workeroid.fn = Workeroid.prototype = update(Workeroid.prototype, {
  /**
   * @lends Pot.Workeroid.prototype
   */
  /**
   * @ignore
   */
  constructor : Workeroid,
  /**
   * @private
   * @ignore
   */
  id : PotInternal.getMagicNumber(),
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
   * @const
   */
  NAME : 'Workeroid',
  /**
   * toString.
   *
   * @return  Return formatted string of object.
   * @type Function
   * @function
   * @public
   */
  toString : PotToString,
  /**
   * isWorkeroid.
   *
   * @type Function
   * @function
   * @public
   */
  isWorkeroid : isWorkeroid,
  /**
   * @private
   * @ignore
   */
  workers : {},
  /**
   * @private
   * @ignore
   */
  workerLength : 0,
  /**
   * @private
   * @ignore
   */
  singleKey : null,
  /**
   * Initialize properties
   *
   * @private
   * @ignore
   */
  init : function(script) {
    var that = this;
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    clearWorkers.call(this);
    if (script) {
      if (isObject(script)) {
        this.singleKey = null;
        each(script, function(val, name) {
          addWorker.call(that, name, val);
        });
      } else {
        this.singleKey = buildSerial(this);
        addWorker.call(this, this.singleKey, script);
      }
    }
    return this;
  },
  /**
   * Post a message.
   *
   * @param  {String}         data   Message.
   * @return {Pot.Workeroid}         Returns an instance of Pot.Workeroid.
   *
   * @type Function
   * @function
   * @public
   */
  postMessage : function(/*[name,] data*/) {
    var that = this, args = arguments,
        data = {}, i, len = args.length;
    switch (len) {
      case 0:
          if (this.singleKey) {
            data[this.singleKey] = void 0;
          }
          break;
      case 1:
          if (isObject(args[0])) {
            data = args[0];
          } else {
            data[this.singleKey] = args[0];
          }
          break;
      case 2:
          data[args[0]] = args[1];
          break;
      default:
          i = 0;
          do {
            data[args[i++]] = args[i++];
          } while (i < len);
    }
    referWorkerEvents.call(this);
    each(data, function(val, name) {
      var msg = val, worker = getWorker.call(that, name);
      if (msg == null) {
        msg = null;
      }
      if (worker && worker.postMessage) {
        worker.postMessage(msg);
      }
    });
    return this;
  },
  /**
   * Terminate process.
   *
   * @return {Pot.Workeroid}  Returns an instance of Pot.Workeroid.
   *
   * @type Function
   * @function
   * @public
   */
  terminate : function(/*[name]*/) {
    var that = this, args = arguments, len = args.length, names;
    switch (len) {
      case 0:
          clearWorkers.call(this);
          break;
      case 1:
          names = arrayize(args[0]);
          break;
      default:
          names = arrayize(args);
    }
    if (names) {
      each(names, function(name) {
        removeWorker.call(that, name);
      });
    }
    return this;
  },
  /**
   * Add an event.
   *
   * @param  {String}        type  Event type. ('message' or 'error').
   * @param  {Function}      func  Event callback function.
   * @return {Pot.Workeroid}       Returns an instance of Pot.Workeroid.
   *
   * @type Function
   * @function
   * @public
   */
  addEventListener : function(type, func/*[, useCapture]*/) {
    if (isFunction(func)) {
      switch (stringify(type).toLowerCase()) {
        case 'message':
            this.onmessage = func;
            break;
        case 'error':
            this.onerror = func;
      }
    }
    return this;
  },
  /**
   * Remove an event.
   *
   * @param  {String}        type  Event type. ('message' or 'error').
   * @return {Pot.Workeroid}       Returns an instance of Pot.Workeroid.
   *
   * @type Function
   * @function
   * @public
   */
  removeEventListener : function(type/*, func[, useCapture]*/) {
    switch (stringify(type).toLowerCase()) {
      case 'message':
          this.onmessage = null;
          break;
      case 'error':
          this.onerror = null;
    }
    return this;
  }
});

// ----- helper functions -----
/**
 * @private
 * @ignore
 */
function referWorkerEvents() {
  var that = this;
  each(this.workers, function(worker) {
    if (worker) {
      if (isFunction(that.onmessage)) {
        /**@ignore*/
        worker.onmessage = function(ev) {
          that.onmessage.call(that, ev && ev.data, ev);
          worker.callback && worker.callback(ev && ev.data);
        };
      }
      if (that.onerror) {
        worker.onerror = that.onerror;
      }
    }
  });
}

/**
 * @private
 * @ignore
 */
function toWorkerKey(name) {
  return PREFIX + name;
}

/**
 * @private
 * @ignore
 */
function newWorker(script) {
  return new WorkerServer(script);
}

/**
 * @private
 * @ignore
 */
function hasWorkerByName(name) {
  return (toWorkerKey(name) in this.workers);
}

/**
 * @private
 * @ignore
 */
function addWorker(name, script) {
  var key = toWorkerKey(name);
  if (hasWorkerByName.call(this)) {
    removeWorker.call(this, name);
  }
  this.workers[key] = newWorker(script);
  this.workerLength++;
}

/**
 * @private
 * @ignore
 */
function getWorker(name) {
  return this.workers[toWorkerKey(name)];
}

/**
 * @private
 * @ignore
 */
function removeWorker(name) {
  var key = toWorkerKey(name),
      worker = this.workers[key];
  if (worker) {
    if (worker.terminate) {
      worker.terminate();
    }
    this.workers[key] = worker = null;
    delete this.workers[key];
    this.workerLength--;
  }
}

/**
 * @private
 * @ignore
 */
function clearWorkers() {
  var that = this;
  if (this.workers) {
    each(this.workers, function(worker, key) {
      if (key && key.charAt && key.charAt(0) === PREFIX) {
        removeWorker.call(that, key.substring(1));
      }
    });
  }
  this.workers = {};
  this.workerLength = 0;
}

// ----- utilities -----
/**
 * @private
 * @ignore
 */
function bind(func, context) {
  var that = context || null;
  return function() {
    return func.apply(that, arguments);
  };
}

/**
 * @private
 * @ignore
 */
function mergeObjects(context) {
  var locations = {};
  if (typeof location !== 'undefined' && !!location) {
    each([
      'href', 'protocol', 'host', 'hostname',
      'port', 'pathname', 'search', 'hash'
    ], function(key) {
      try {
        locations[key] = stringify(location[key]);
      } catch (e) {}
    });
  }
  each(['window', 'document', 'navigator'], function(v) {
    context[v] = void 0;
  });
  context['location'] = locations;
  context['self'] = context;
  context['Pot'] = Pot;
}

/**
 * @private
 * @ignore
 */
function runWithFunction(code, context) {
  mergeObjects(context);
  return (new Function('with(this){' + code + '}')).call(context);
}

/**
 * @private
 * @ignore
 */
function runWithFrame(code, context, child) {
  var result = false, win, doc, iframe, id, childWin, style, ie, version;
  win = Pot.currentWindow();
  doc = Pot.currentDocument();
  if (win && doc && win.document === doc && doc.body) {
    ie = !!(PotBrowser.msie && PotSystem.hasActiveXObject);
    if (ie) {
      version = parseInt(PotBrowser.msie.version, 10);
    }
    do {
      id = buildSerial({NAME : 'potiframeworker'}, '');
    } while ((id in win) || doc.getElementById(id));
    if (ie && version <= 7) {
      iframe = doc.createElement('<iframe name="' + id + '">');
    } else {
      iframe = doc.createElement('iframe');
    }
    child.elem = iframe;
    iframe.name = iframe.id = id;
    iframe.frameBorder = 0;
    if (ie && version < 7) {
      iframe.src = 'javascript:[]+[]';
    }
    style = iframe.style;
    style.zIndex = -1;
    style.visibility = style.overflow = 'hidden';
    style.border = style.outline = style.margin = style.padding = '0';
    style.minWidth = style.minHeight = '0px';
    style.width = style.height = style.maxWidth = style.maxHeight = '10px';
    if (PotBrowser.webkit) {
      // Safari 2.0.* bug: iframe's absolute position and src set.
      style.marginTop = style.marginLeft = '-10px';
    } else {
      style.position = 'absolute';
      style.top = style.left = '-20px';
    }
    doc.body.appendChild(iframe);
    childWin = iframe.contentWindow || (win.frames && win.frames[id]);
    doc = detectFrameDocument(iframe);
    if (!doc || !childWin || !doc.write) {
      try {
        iframe.parentNode.removeChild(iframe);
      } catch (e) {}
      child.elem = null;
    } else {
      doc.open();
      each(context, function(v, k) {
        childWin[k] = v;
      });
      mergeObjects(context);
      do {
        id = buildSerial(Pot, '$');
      } while (id in childWin);
      childWin[id] = context;
      doc.write(
        '<!doctype html><html><head>' +
        wrapScript(Pot.format(
          '(function(){with(#1){' +
            '#2' +
          '}}).call(#1);',
          id, code
        )) +
        '</head><body><br></body></html>'
      );
      doc.close();
      result = iframe;
    }
  }
  return result;
}

/**
 * @private
 * @ignore
 */
function runSubScriptWithFrame(js, iframe, context) {
  var pwin, win, doc, head, script, done, func, code, id, val = 'val';
  pwin = Pot.currentWindow();
  win = iframe.contentWindow ||
        (pwin && pwin.frames && pwin.frames[iframe.id]);
  if (win) {
    doc = detectFrameDocument(iframe);
    do {
      id = buildSerial(Pot, '$');
    } while (id in win);
    win[id] = context;
    code = 'with(' + id + '){' + js + '}';
    if (doc) {
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
        if (PotSystem.hasActiveXObject && 'text' in script) {
          script.text = code;
        } else {
          script.appendChild(doc.createTextNode(code));
        }
        head.appendChild(script);
        head.removeChild(script);
        done = true;
      }
    }
    if (!done) {
      func = ['e'] + val;
      if (win[func]) {
        if (win[func].call && win[func].apply) {
          win[func].call(win, code);
        } else {
          win[func](code);
        }
        done = true;
      }
    }
  }
  return done;
}

/**
 * @private
 * @ignore
 */
function isFrameLoaded(frame) {
  var result = false, doc;
  try {
    if (frame) {
      if (PotSystem.hasActiveXObject && RE.LOAD.test(frame.readyState)) {
        result = true;
      } else {
        doc = detectFrameDocument(frame);
        if (doc) {
          result = !!(doc.body && doc.body.firstChild);
        }
      }
    }
  } catch (e) {}
  return result;
}

/**
 * @private
 * @ignore
 */
function detectFrameDocument(frame) {
  var isWin = isWindow, isDoc = isDocument;
  if (frame == null) {
    return null;
  }
  if (isWin(frame.contentWindow) && isDoc(frame.contentWindow.document)) {
    return frame.contentWindow.document;
  }
  if (isDoc(frame.contentDocument)) {
    return frame.contentDocument;
  }
  if (isDoc(frame.document)) {
    return frame.document;
  }
  return null;
}

/**
 * @private
 * @ignore
 */
function isDataURI(uri) {
  return stringify(uri).slice(0, 5).toLowerCase() === 'data:';
}

/**
 * @private
 * @ignore
 */
function isJavaScriptScheme(uri) {
  return stringify(uri).slice(0, 11).toLowerCase() === 'javascript:';
}

/**
 * @private
 * @ignore
 */
function isURI(src) {
  return RE.URI.test(stringify(src));
}

/**
 * @private
 * @ignore
 */
function fromJavaScriptScheme(uri) {
  var data = '';
  if (isJavaScriptScheme(uri)) {
    data = stringify(uri).substring(11);
  }
  return data;
}

/**
 * @private
 * @ignore
 */
function toDataURI(code) {
  return 'data:application/javascript,' + Pot.URI.urlEncode(code);
}

/**
 * @private
 * @ignore
 */
function fromDataURI(uri) {
  var data = '', m;
  if (isDataURI(uri)) {
    RE.DATA.lastIndex = 0;
    m = RE.DATA.match(uri);
    if (m && m[4]) {
      data = m[4];
      if (m[3]) {
        data = fromBase64(data);
      } else {
        data = Pot.URI.urlDecode(data);
      }
    }
  }
  return data;
}

/**
 * @private
 * @ignore
 */
function toBlobURI(code) {
  return PotSystem.BlobURI.createObjectURL(Pot.createBlob(code));
}

/**
 * @private
 * @ignore
 */
function fromBase64(string) {
  if (Pot.Base64) {
    return Pot.Base64.decode(string);
  }
  if (!fromBase64.decode) {
    /**@ignore*/
    fromBase64.decode = (function() {
      var maps = UPPER_ALPHAS + LOWER_ALPHAS + DIGITS + '+/=',
          /**@ignore*/
          utf8decode = function(s) {
            if (Pot.UTF8) {
              return Pot.UTF8.decode(s);
            }
            try {
              return Pot.URI.urlDecode(escape(s));
            } catch (e) {
              try {
                return decodeURIComponent(escape(s));
              } catch (ex) {
                return s;
              }
            }
          };
      return function(data) {
        var t = '', p = -8, a = 0, c, d, i = 0,
            s = stringify(data), len = s.length;
        for (; i < len; i++) {
          c = maps.indexOf(s.charAt(i));
          if (c >= 0) {
            a = (a << 6) | (c & 63);
            if ((p += 6) >= 0) {
              d = a >> p & 255;
              if (c !== 64) {
                t += fromUnicode(d);
              }
              a &= 63;
              p -= 8;
            }
          }
        }
        return utf8decode(t);
      };
    }());
  }
  return fromBase64.decode(string);
}

/**
 * @private
 * @ignore
 */
function createWorker(js) {
  return isChromeWorkerAvailable() ? new ChromeWorker(js) : new Worker(js);
}

/**
 * @private
 * @ignore
 */
function isChromeWorkerAvailable() {
  var cw = 0, w = 0;
  if (PotSystem.hasChromeWorker) {
    cw++;
    if (PotSystem.canChromeWorkerDataURI) {
      cw++;
    }
    if (PotSystem.canChromeWorkerBlobURI) {
      cw++;
    }
  }
  if (PotSystem.hasWorker) {
    w++;
    if (PotSystem.canWorkerDataURI) {
      w++;
    }
    if (PotSystem.canWorkerBlobURI) {
      w++;
    }
  }
  return cw >= w;
}

/**
 * @private
 * @ignore
 */
function wrapScript(code) {
  return ['<script>' + code + '</'] + ['script>'];
}

/**
 * @private
 * @ignore
 */
function getScript(url, sync) {
  var type = 'application/javascript';
  return Pot.Net.request(url, {
    sync     : sync,
    mimeType : type,
    headers  : {
      'Content-Type' : type
    }
  }).then(function(res) {
    return stringify(res && res.responseText);
  });
}

}());

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
        switch (typeOf(object)) {
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
            if (isFunction(value)) {
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
     * @param  {String}    text      A target JSON string object.
     * @param  {*}        (reviver)  (Optional) Unimplemented.
     * @return {*}                   Return the parsed object.
     * @type   Function
     * @function
     * @static
     * @public
     */
    parseFromJSON : update(function(text/*[, reviver]*/) {
      var me = Pot.Serializer.parseFromJSON, o;
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
}());

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
   * @example
   *   var query = {foo: 'bar', baz: ['qux', 'quux'], corge: ''};
   *   debug(serializeToQueryString(query));
   *   // @results 'foo=bar&baz[]=qux&baz[]=quux&corge='
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
    var queries = [], encode, objectLike;
    if (!params || params == false) {
      return '';
    }
    if (typeof Buffer !== 'undefined' && params.constructor === Buffer) {
      return params;
    }
    if (isString(params)) {
      return stringify(params);
    }
    objectLike = isObject(params);
    if (objectLike || isArrayLike(params)) {
      encode = Pot.URI.urlEncode;
      each(params, function(v, k) {
        var item, key, val, sep, count = 0, ok = true;
        if (objectLike) {
          item = [k, v];
        } else {
          item = v;
        }
        try {
          key = stringify(item[0], false);
          val = item[1];
        } catch (e) {
          ok = false;
        }
        if (ok && (key || val)) {
          if (!objectLike) {
            each(params, function(items) {
              if (items) {
                try {
                  if (stringify(items[0], false) === key) {
                    count++;
                  }
                } catch (e) {}
              }
            });
          }
          if (count > 1 || isArray(val)) {
            sep = '=';
            key = stringify(key, true) + '[]';
          } else {
            sep = key ? '=' : '';
          }
          each(arrayize(val), function(t) {
            queries[queries.length] = encode(key) + sep +
                                      encode(stringify(t, false));
          });
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
   * @example
   *   var query = 'foo=bar&baz[]=qux&baz[]=quux&corge=';
   *   debug(parseFromQueryString(query, true));
   *   // @results {foo: 'bar', baz: ['qux', 'quux'], corge: ''}
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
    if (isObject(queryString) || isArray(queryString)) {
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
        var key, val, pair, k;
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
          if (key.slice(-2) === '[]') {
            k = key.slice(0, -2);
            if (toObject) {
              if (hasOwnProperty.call(result, k)) {
                result[k] = concat.call(
                  [],
                  arrayize(result[k]),
                  arrayize(val)
                );
              } else {
                result[k] = [val];
              }
            } else {
              result[result.length] = [k, val];
            }
          } else {
            if (toObject) {
              result[key] = val;
            } else {
              result[result.length] = [key, val];
            }
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
    var result = '', me = Pot.URI.urlEncode, s;
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
   * @lends Pot.URI
   */
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
    var result = '', me = Pot.URI.urlDecode, s;
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
            return fromUnicode(r);
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
  urlEncode          : Pot.URI.urlEncode,
  urlDecode          : Pot.URI.urlDecode
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
   * @example
   *   Pot.debug( Pot.hashCode('abc') ); // 96354
   *   Pot.debug( Pot.hashCode([0x61, 0x62, 0x63]) ); // 96354
   *
   *
   * @param  {String|Array|*}  data   A target data.
   * @return {Number}                 Hash value for `string`,
   *                                    between 0 (inclusive)
   *                                    and 2^32 (exclusive).
   *                                  The empty string returns 0.
   * @based goog.string.hashCode
   * @type Function
   * @function
   * @public
   * @static
   */
  hashCode : function(data) {
    var result = 0, s, i, len,
        max = 0x100000000, // 2^32
        arrayLike = false;
    if (data == null) {
      s = String(data);
    } else if (isArrayLike(data)) {
      s = arrayize(data);
      arrayLike = true;
    } else {
      s = data.toString ? data.toString() : String(data);
    }
    len = s.length;
    for (i = 0; i < len; ++i) {
      result = 31 * result + (arrayLike ? s[i] : s.charCodeAt(i));
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
   *                                 - method       : {String}    'GET'
   *                                 - sendContent  : {Object}    null
   *                                 - queryString  : {Object}    null
   *                                 - username     : {String}    null
   *                                 - password     : {String}    null
   *                                 - headers      : {Object}    null
   *                                 - mimeType     : {String}    null
   *                                 - cache        : {Boolean}   true
   *                                 - sync         : {Boolean}   false
   *                                 - responseType : {String}    null
   *                                 - binary       : {Boolean}   false
   *                                 - cookie       : {Boolean}   false
   *                                 - crossDomain  : {Boolean}   false
   *                                 </pre>
   * @return {Deferred}            Return the instance of Pot.Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  request : function(url, options) {
    if (PotSystem.isGreasemonkey) {
      return Pot.Net.requestByGreasemonkey(url, options);
    } else if (PotSystem.isNodeJS) {
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
      if (!x && PotSystem.hasActiveXObject) {
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
            throw PotStopIteration;
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
     *                                 - method       : {String}    'GET'
     *                                 - sendContent  : {Object}    null
     *                                 - queryString  : {Object}    null
     *                                 - username     : {String}    null
     *                                 - password     : {String}    null
     *                                 - headers      : {Object}    null
     *                                 - mimeType     : {String}    null
     *                                 - cache        : {Boolean}   true
     *                                 - sync         : {Boolean}   false
     *                                 - responseType : {String}    null
     *                                 - binary       : {Boolean}   false
     *                                 - cookie       : {Boolean}   false
     *                                 - crossDomain  : {Boolean}   false
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
      },
      PATTERNS = {
        URI : /^([^:]+)(?::+\/{0,}((?:[^@]+@|)[^\/\\?&#:;]*)(?::(\d+)|)|)/
      },
      CURRENT_URIS = PATTERNS.URI.exec(Pot.currentURI().toLowerCase()) || [];
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
          this.deferred = new Deferred({
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
          var opts, parts, defaults = {
            method       : 'GET',
            sendContent  : null,
            queryString  : null,
            callback     : null,
            username     : null,
            password     : null,
            mimeType     : null,
            responseType : null,
            binary       : false,
            cache        : true,
            sync         : false,
            cookie       : false,
            crossDomain  : null,
            headers      : {
              'Accept'           : ['*/'] + ['*'], //XXX: Check MimeType.
              'X-Requested-With' : 'XMLHttpRequest'
            }
          };
          if (isObject(options)) {
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
          if (this.options.crossDomain == null) {
            PATTERNS.URI.lastIndex = 0;
            parts = PATTERNS.URI.exec(Pot.currentURI().toLowerCase());
            this.options.crossDomain = !!(parts &&
              (parts[1] !== CURRENT_URIS[1] ||
               parts[2] !== CURRENT_URIS[2] ||
               parts[3] !== CURRENT_URIS[3])
            );
          }
          if (this.options.binary && !this.options.mimeType) {
            this.options.mimeType = 'text/plain; charset=x-user-defined';
          }
          if (this.options.sync) {
            this.deferred.async(false);
          }
        },
        /**
         * @private
         * @ignore
         */
        open : function() {
          var async = this.options.sync ? false : true;
          if (this.options.username != null) {
            this.xhr.open(
              this.options.method,
              this.url,
              async,
              stringify(this.options.username, true),
              stringify(this.options.password, true)
            );
          } else {
            this.xhr.open(this.options.method, this.url, async);
          }
        },
        /**
         * @private
         * @ignore
         */
        setHeaders : function() {
          var that = this, contentType;
          try {
            if (this.options.responseType) {
              try {
                this.xhr.responseType = this.options.responseType;
              } catch (e) {}
            }
            if (this.options.cookie) {
              try {
                // https://developer.mozilla.org/en/HTTP_access_control
                this.xhr.withCredentials = 'true';
              } catch (e) {}
            }
            try {
              if (this.xhr.overrideMimeType &&
                  this.options.mimeType != null) {
                this.xhr.overrideMimeType(this.options.mimeType);
              }
            } catch (e) {}
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
              contentType =
                'application/x-www-form-urlencoded; charset=UTF-8';
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
          var that = this, flush;
          if (this.options.sync) {
            /**@ignore*/
            flush = function(f) {
              var d = new Deferred({async : false});
              return d.then(f).begin();
            };
          } else {
            flush = Deferred.flush;
          }
          /**@ignore*/
          this.xhr.onreadystatechange = function() {
            var status = null, text;
            if (that.xhr.readyState == Pot.Net.XHR.ReadyState.COMPLETE) {
              that.cancel();
              try {
                status = parseInt(that.xhr.status, 10);
                text = that.xhr.responseText;
                if (!status && text) {
                  // 0 or undefined seems to mean cached or local
                  status = 304;
                }
              } catch (e) {}
              // 1223 is apparently a bug in IE
              if ((status >= 200 && status < 300) ||
                  status === 304 || status === 1223) {
                that.assignResponseText();
                if (isFunction(that.options.callback)) {
                  flush(function() {
                    that.options.callback.call(
                      that.xhr, text, that.xhr
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
        assignResponseText : function() {
          var i, len, bytes, chars, c, s;
          if (this.options.binary) {
            bytes = [];
            chars = [];
            try {
              // IE will throws exception when Text is binary data.
              s = this.xhr.responseText || '';
            } catch (e) {
              s = '';
            }
            len = s.length;
            for (i = 0; i < len; i++) {
              c = s.charCodeAt(i) & 0xFF;
              bytes[i] = c;
              chars[i] = fromUnicode(c);
            }
            try {
              this.xhr.originalText  = s;
              this.xhr.responseBytes = bytes;
              this.xhr.responseText  = chars.join('');
            } catch (e) {
              try {
                this.xhr = update(this.xhr, {
                  originalText  : s,
                  responseBytes : bytes,
                  responseText  : chars.join('')
                });
              } catch (ex) {}
            }
          }
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
              this.xhr.onreadystatechange = PotNoop;
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
    }())
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
    var d = new Deferred(), type, lazy,
        opts = update({cache : true}, options || {}),
        maps = {
          sendContent : 'data',
          mimeType    : 'overrideMimeType',
          username    : 'user',
          sync        : 'synchronous'
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
          throw PotStopIteration;
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
    if (opts.sync) {
      d.async(false);
      /**@ignore*/
      lazy = function(f) {
        f();
      };
    } else {
      /**@ignore*/
      lazy = Deferred.callLazy;
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
    lazy(function() {
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
        'Accept'     : ['*/'] + ['*'],
        'User-Agent' : [
          'Pot.js/' + Pot.VERSION,
          Pot.TYPE,
          '(Node.js; *)'
        ].join(' ')
      },
      /**
       * @private
       * @ignore
       */
      doit : function(options) {
        var that = this;
        this.deferred = new Deferred({
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
        opts = update({
          cache : true,
          sync  : false
        }, options || {});
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
              this.headers['Content-Type'] =
                'application/x-www-form-urlencoded';
            }
          }
        }
        if (opts.sync) {
          this.deferred.async(false);
        }
        this.requestOptions = {
          data : data,
          ssl  : ssl,
          sync : opts.sync,
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
        var that = this, doRequest, waiting = true;
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
            waiting = false;
            that.deferred.begin(that.response);
          });
          that.response.on('error', function(err) {
            waiting = false;
            that.handleError(err);
          });
        }).on('error', function(err) {
          waiting = false;
          that.handleError(err);
        });
        if (this.requestOptions.data) {
          this.request.write(this.requestOptions.data);
        }
        this.request.end();
        if (this.requestOptions.sync) {
          while (waiting) {}
        }
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
  }()),
  /**
   * @lends Pot.Net
   */
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
   *                                 - sync        : {Boolean}  false
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
      var d, opts, context, id, callback, key,
          doc, uri, head, script, done, defaults;
      defaults = 'callback';
      d = new Deferred();
      opts    = update({
        cache : false,
        sync  : false
      }, options || {});
      context = globals || PotGlobal;
      doc     = PotSystem.currentDocument;
      head    = getHead();
      if (!context || !doc || !head || !url) {
        return d.raise(context || url || head || doc);
      }
      try {
        if (opts.callback) {
          if (isString(opts.callback)) {
            id = opts.callback;
          } else if (isFunction(opts.callback)) {
            callback = opts.callback;
          } else if (isObject(opts.callback)) {
            for (key in opts.callback) {
              defaults = key;
              if (isString(opts.callback[key])) {
                id = opts.callback[key];
              } else if (isFunction(opts.callback[key])) {
                callback = opts.callback[key];
              }
              break;
            }
          }
        } else {
          each(opts, function(v, k) {
            if (PATTERNS.KEY.test(k)) {
              defaults = k;
              if (isString(v)) {
                id = v;
              } else if (isFunction(v)) {
                callback = v;
              }
              throw PotStopIteration;
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
        if (PotSystem.isGreasemonkey) {
          return Pot.Net.requestByGreasemonkey(uri, {
            method : 'GET',
            sync   : opts.sync
          }).then(function(res) {
            var code = trim(res && res.responseText);
            code = code.replace(/^[^{]*|[^}]*$/g, '');
            return Pot.Serializer.parseFromJSON(code);
          });
        }
        script = doc.createElement('script');
        if (opts.sync) {
          d.async(false);
        } else {
          script.async = 'async';
        }
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
            script = void 0;
          } catch (e) {}
          if (isFunction(callback)) {
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
            script = void 0;
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
  }()),
  /**
   * @lends Pot.Net
   */
  /**
   * Get the JSON data by HTTP GET request.
   *
   *
   * @example
   *   var url = 'http://www.example.com/hoge.json';
   *   getJSON(url).then(function(data) {
   *     debug(data.results[0].text);
   *   });
   *
   *
   * @param  {String}     url      The request URL.
   * @param  {Object}   (options)  Request options. (@see Pot.Net.request)
   * @return {Deferred}            Return the instance of Pot.Deferred.
   * @type Function
   * @function
   * @public
   * @static
   */
  getJSON : (function() {
    var fixJson = /^[^{]*|[^}]*$/g,
        type = 'application/json';
    return function(url, options) {
      return Pot.Net.request(url, update({
        mimeType : type,
        headers  : {
          'Content-Type' : type
        }
      }, options || {})).then(function(res) {
        var data = trim(res && res.responseText).replace(fixJson, '');
        return Pot.Serializer.parseFromJSON(data);
      });
    };
  }()),
  /**
   * @lends Pot.Net
   */
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
    if (PotSystem.isNonBrowser || !PotSystem.isNotExtension) {
      return function(url, options) {
        return Pot.Net.request(url, update({
          method   : 'GET',
          mimeType : 'application/javascript',
          headers  : {
            'Content-Type' : 'application/javascript'
          }
        }, {
          cache : false,
          sync  : false
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
      d = new Deferred();
      try {
        if (isFunction(options)) {
          opts = {callback : opts};
          callback = opts.callback;
        } else {
          opts = update({}, options || {});
          each(opts, function(v, k) {
            if (isFunction(v)) {
              callback = v;
              if (PATTERNS.CALLBACK.test(k)) {
                throw PotStopIteration;
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
        doc = PotSystem.currentDocument;
        head = getHead();
        if (!doc || !head || !uri) {
          return d.raise(uri || head || doc);
        }
        script = doc.createElement('script');
        if (opts.sync) {
          d.async(false);
        } else {
          script.async = 'async';
        }
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
            script = void 0;
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
  }())
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
  var heads, doc = PotSystem.currentDocument;
  try {
    if (doc.head && isElement(doc.head)) {
      return doc.head;
    }
  } catch (e) {}
  try {
    heads = doc.getElementsByTagName('head');
    if (heads && isElement(heads[0])) {
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
  getJSON    : Pot.Net.getJSON,
  loadScript : Pot.Net.loadScript
});

}());

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Mozilla XPCOM interfaces/methods.

Pot.update({
  /**
   * @lends Pot
   */
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
    if (PotSystem.hasComponents) {
      if (!Cu) {
        PotSystem.isWaitable = PotSystem.hasComponents = false;
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
    if (PotSystem.hasComponents) {
      try {
        thread = Cc['@mozilla.org/thread-manager;1']
                .getService(Ci.nsIThreadManager).mainThread;
      } catch (e) {
        PotSystem.isWaitable = PotSystem.hasComponents = false;
      }
      if (thread && PotSystem.hasComponents) {
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
    if (PotSystem.hasComponents) {
      try {
        cwin = Cc['@mozilla.org/appshell/window-mediator;1']
              .getService(Ci.nsIWindowMediator)
              .getMostRecentWindow('navigator:browser');
      } catch (e) {
        PotSystem.isWaitable = PotSystem.hasComponents = false;
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
    if (!PotSystem.hasComponents) {
      return;
    }
    pref = uri || 'chrome://browser/content/browser.xul';
    try {
      wins = Cc['@mozilla.org/appshell/window-mediator;1']
            .getService(Ci.nsIWindowMediator)
            .getXULWindowEnumerator(null);
    } catch (e) {
      PotSystem.isWaitable = PotSystem.hasComponents = false;
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
   * Output to the console using 'error' function for error logging.
   *
   *
   * @example
   *   Pot.error('Error!'); // Error!
   *
   *
   * @param  {*}  msg  An error message, or variable.
   * @type Function
   * @function
   * @public
   * @static
   */
  error : error,
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
    var result = false, args = arrayize(arguments),
        inputs, outputs, len = args.length, noops = [];
    if (len <= 1 && this === Pot && !isObject(target)) {
      inputs = this;
      if (len >= 1 && isBoolean(target)) {
        advised = target;
      } else {
        advised = !!target;
      }
    } else if (target && (isObject(target) ||
               isFunction(target) || isArray(target))) {
      inputs = target;
    }
    outputs = PotInternal.getExportObject(true);
    if (inputs && outputs) {
      if (inputs === Pot) {
        if (PotInternal.exportPot && PotInternal.PotExportProps) {
          result = PotInternal.exportPot(advised, true, true);
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
update(PotInternal, {
  /**
   * @lends Pot.Internal
   */
  /**
   * Export the Pot properties.
   *
   * @private
   * @ignore
   * @internal
   */
  exportPot : function(advised, forGlobalScope, allProps, initialize) {
    var outputs, noops = [];
    outputs = PotInternal.getExportObject(forGlobalScope);
    if (outputs) {
      if (allProps) {
        each(PotInternal.PotExportProps, function(prop, name) {
          if (advised && name in outputs) {
            noops[noops.length] = name;
          } else {
            outputs[name] = prop;
          }
        });
      } else {
        each(PotInternal.PotExportObject, function(prop, name) {
          if (advised && name in outputs) {
            noops[noops.length] = name;
          } else {
            outputs[name] = prop;
          }
        });
      }
    }
    if (initialize) {
      outputs = PotInternal.getExportObject(
        PotSystem.isNodeJS ? false : true
      );
      if (outputs) {
        update(outputs, PotInternal.PotExportObject);
      }
      // for Node.js and CommonJS.
      if ((PotSystem.isNonBrowser ||
           !PotSystem.isNotExtension) && typeof exports !== 'undefined') {
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
    Pot                      : Pot,
    update                   : update,
    isBoolean                : Pot.isBoolean,
    isNumber                 : Pot.isNumber,
    isString                 : Pot.isString,
    isFunction               : Pot.isFunction,
    isArray                  : Pot.isArray,
    isDate                   : Pot.isDate,
    isRegExp                 : Pot.isRegExp,
    isObject                 : Pot.isObject,
    isError                  : Pot.isError,
    typeOf                   : Pot.typeOf,
    typeLikeOf               : Pot.typeLikeOf,
    StopIteration            : Pot.StopIteration,
    isStopIter               : Pot.isStopIter,
    isIterable               : Pot.isIterable,
    isScalar                 : Pot.isScalar,
    isBlob                   : Pot.isBlob,
    isFileReader             : Pot.isFileReader,
    isImage                  : Pot.isImage,
    isArguments              : Pot.isArguments,
    isTypedArray             : Pot.isTypedArray,
    isArrayBuffer            : Pot.isArrayBuffer,
    isArrayLike              : Pot.isArrayLike,
    isDeferred               : Pot.isDeferred,
    isIter                   : Pot.isIter,
    isWorkeroid              : Pot.isWorkeroid,
    isPercentEncoded         : Pot.isPercentEncoded,
    isNumeric                : Pot.isNumeric,
    isInt                    : Pot.isInt,
    isNativeCode             : Pot.isNativeCode,
    isBuiltinMethod          : Pot.isBuiltinMethod,
    isWindow                 : Pot.isWindow,
    isDocument               : Pot.isDocument,
    isElement                : Pot.isElement,
    isNodeLike               : Pot.isNodeLike,
    isNodeList               : Pot.isNodeList,
    Cc                       : Pot.Cc,
    Ci                       : Pot.Ci,
    Cr                       : Pot.Cr,
    Cu                       : Pot.Cu,
    Deferred                 : Pot.Deferred,
    succeed                  : Pot.Deferred.succeed,
    failure                  : Pot.Deferred.failure,
    wait                     : Pot.Deferred.wait,
    callLater                : Pot.Deferred.callLater,
    callLazy                 : Pot.Deferred.callLazy,
    maybeDeferred            : Pot.Deferred.maybeDeferred,
    isFired                  : Pot.Deferred.isFired,
    lastResult               : Pot.Deferred.lastResult,
    lastError                : Pot.Deferred.lastError,
    register                 : Pot.Deferred.register,
    unregister               : Pot.Deferred.unregister,
    deferrize                : Pot.Deferred.deferrize,
    deferreed                : Pot.Deferred.deferreed,
    begin                    : Pot.Deferred.begin,
    flush                    : Pot.Deferred.flush,
    till                     : Pot.Deferred.till,
    parallel                 : Pot.Deferred.parallel,
    chain                    : Pot.Deferred.chain,
    forEach                  : Pot.forEach,
    repeat                   : Pot.repeat,
    forEver                  : Pot.forEver,
    iterate                  : Pot.iterate,
    items                    : Pot.items,
    zip                      : Pot.zip,
    Iter                     : Pot.Iter,
    toIter                   : Pot.Iter.toIter,
    map                      : Pot.map,
    filter                   : Pot.filter,
    reduce                   : Pot.reduce,
    every                    : Pot.every,
    some                     : Pot.some,
    range                    : Pot.range,
    indexOf                  : Pot.indexOf,
    lastIndexOf              : Pot.lastIndexOf,
    globalEval               : Pot.globalEval,
    localEval                : Pot.localEval,
    tokenize                 : Pot.tokenize,
    joinTokens               : Pot.joinTokens,
    isWords                  : Pot.isWords,
    isNL                     : Pot.isNL,
    hasReturn                : Pot.hasReturn,
    override                 : Pot.override,
    createBlob               : Pot.createBlob,
    createConstructor        : Pot.createConstructor,
    getErrorMessage          : Pot.getErrorMessage,
    getFunctionCode          : Pot.getFunctionCode,
    currentWindow            : Pot.currentWindow,
    currentDocument          : Pot.currentDocument,
    currentURI               : Pot.currentURI,
    serializeToJSON          : Pot.Serializer.serializeToJSON,
    parseFromJSON            : Pot.Serializer.parseFromJSON,
    serializeToQueryString   : Pot.Serializer.serializeToQueryString,
    parseFromQueryString     : Pot.Serializer.parseFromQueryString,
    urlEncode                : Pot.URI.urlEncode,
    urlDecode                : Pot.URI.urlDecode,
    request                  : Pot.Net.request,
    jsonp                    : Pot.Net.requestByJSONP,
    getJSON                  : Pot.Net.getJSON,
    loadScript               : Pot.Net.loadScript,
    hashCode                 : Pot.Crypt.hashCode,
    evalInSandbox            : Pot.XPCOM.evalInSandbox,
    throughout               : Pot.XPCOM.throughout,
    getMostRecentWindow      : Pot.XPCOM.getMostRecentWindow,
    getChromeWindow          : Pot.XPCOM.getChromeWindow,
    Workeroid                : Pot.Workeroid,
    attach                   : Pot.Signal.attach,
    attachBefore             : Pot.Signal.attachBefore,
    attachAfter              : Pot.Signal.attachAfter,
    attachPropBefore         : Pot.Signal.attachPropBefore,
    attachPropAfter          : Pot.Signal.attachPropAfter,
    detach                   : Pot.Signal.detach,
    detachAll                : Pot.Signal.detachAll,
    signal                   : Pot.Signal.signal,
    cancelEvent              : Pot.Signal.cancelEvent,
    DropFile                 : Pot.Signal.DropFile,
    rescape                  : rescape,
    arrayize                 : arrayize,
    invoke                   : invoke,
    stringify                : stringify,
    trim                     : trim,
    now                      : now,
    globalize                : Pot.globalize,
    debug                    : Pot.Debug.debug,
    error                    : Pot.Debug.error,
    dump                     : Pot.Debug.dump,
    addPlugin                : Pot.Plugin.add,
    hasPlugin                : Pot.Plugin.has,
    removePlugin             : Pot.Plugin.remove,
    listPlugin               : Pot.Plugin.list
  }
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Register the Pot object into global.

// Export the Pot object.
PotInternal.exportPot(false, false, false, true);

return Pot;


}(this || {}));

/*!
 * PotPico.js - JavaScript library
 *
 * PotPico.js is an implemental utility library
 *  that can execute JavaScript without burdening the CPU.
 *
 * Available objects:
 *  - A part of Core: http://polygonplanet.github.com/Pot.js/#reference.Pot.Core.functionsAndProperties
 *  - Pot.Deferred: http://polygonplanet.github.com/Pot.js/#manual.Deferred.Reference
 *  - Pot.Iter: http://polygonplanet.github.com/Pot.js/#reference.Pot.Iter.functions
 *
 * Version 0.01, 2012-05-14
 * Copyright (c) 2012 polygon planet <polygon.planet.aqua@gmail.com>
 * Dual licensed under the MIT or GPL v2 licenses.
 * https://github.com/polygonplanet/Pot.js
 * http://polygonplanet.github.com/Pot.js/
 */
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
(function (globals) {
'use strict';

var Pot = {VERSION : '0.01', TYPE : 'pico'},

NULL      = null,
FALSE     = !1,
TRUE      = !0,
UNDEFINED = void 0,
TYPE_UNDEFINED = 'undefined',
TYPE_STRING    = 'string',
TYPE_NUMBER    = 'number',
TYPE_OBJECT    = 'object',
TYPE_FUNCTION  = 'function',
TYPE_ARRAY     = 'array',
TYPE_BOOLEAN   = 'boolean',
TYPE_ERROR     = 'error',

ST_POT         = 'Pot',
ST_DEFERRED    = 'Deferred',
ST_LOAD        = 'load',
ST_TOSTRING    = 'toString',
ST_MOZILLA_ORG = '@mozilla.org/',
ST_SETTIMEOUT  = 'setTimeout',
ST_CANCELLERS  = 'cancellers',
ST_STOPPERS    = 'stoppers',
ST_END         = 'end',
ST_BEGIN       = 'begin',
ST_STEP        = 'step',
ST_STOP        = 'stop',
ST_START       = 'start',
ST_LENGTH      = 'length',
ST_NAME        = 'NAME',
ST_OPTIONS     = 'options',
ST_PROTOTYPE   = 'prototype',

FN_ADD_EVENT_LISTENER    = 'addEventListener',
FN_REMOVE_EVENT_LISTENER = 'removeEventListener',

PotSystem,
PotPlugin,
PotToString,
PotBrowser,
PotGlobal,
PotNoop,
PotTmp,
PotInternal,

PotInternalCallInBackground,
PotInternalSetTimeout,
PotInternalClearTimeout,
PotStopIteration,

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
isArrayLike,
isNumeric,
isStopIter,
isDeferred,
isIter,
isWindow,
isDocument,
isElement,
isNodeList,

Deferred,
Iter,
PotInternalLightIterator,
XPCOM,

ArrayProto     = Array[ST_PROTOTYPE],
ObjectProto    = Object[ST_PROTOTYPE],
StringProto    = String[ST_PROTOTYPE],
FunctionProto  = Function[ST_PROTOTYPE],
slice          = ArrayProto.slice,
concat         = ArrayProto.concat,
indexOf        = ArrayProto.indexOf,
lastIndexOf    = ArrayProto.lastIndexOf,
toString       = ObjectProto.toString,
hasOwnProperty = ObjectProto.hasOwnProperty,
toFuncString   = FunctionProto.toString,
fromCharCode   = String.fromCharCode,
StopIteration  = (typeof StopIteration === TYPE_UNDEFINED) ? UNDEFINED : StopIteration,

RE_RESCAPE         = /([-.*+?^${}()|[\]\/\\])/g,
RE_ARRAYLIKE       = /List|Collection/i,
RE_TRIM            = /^[\s\u00A0\u3000]+|[\s\u00A0\u3000]+$/g,

Ci, Cc, Cr, Cu;

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
(function(nv) {

update(Pot, {
  NAME : ST_POT,
  System : {},
  toString : function() {
    return buildObjectString(this[ST_NAME] || this.name || typeof this);
  },
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
    u = String(n && n.userAgent).toLowerCase();
    if (u) {
      for (i = 0, len = rs[ST_LENGTH]; i < len; i++) {
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
  Global : (function() {
    var g = (new Function('return this;'))();
    if (!globals ||
        typeof globals !== TYPE_OBJECT || !(ST_SETTIMEOUT in globals)) {
      globals = this || g || {};
    }
    return this || g || {};
  }()),
  noop : function() {},
  tmp : {},
  Internal : {
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
            typeof window !== TYPE_UNDEFINED && isWindow(window)) {
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
              outputs[id] = UNDEFINED;
            } catch (e) {}
          }
          if (!valid) {
            outputs = PotGlobal;
          }
        }
      }
      if (!outputs) {
        if (PotSystem.isNodeJS) {
          if (typeof module === TYPE_OBJECT &&
              typeof module.exports === TYPE_OBJECT) {
            outputs = module.exports;
          } else if (typeof exports === TYPE_OBJECT) {
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
    }
  },
  update : update,
  Pot : Pot
});
}(typeof navigator !== TYPE_UNDEFINED && navigator || {}));

PotSystem   = Pot.System;
PotToString = Pot.toString;
PotBrowser  = Pot.Browser;
PotGlobal   = Pot.Global;
PotNoop     = Pot.noop;
PotTmp      = Pot.tmp;
PotInternal = Pot.Internal;

update(PotSystem, (function() {
  var o = {isWaitable : FALSE};
  if (typeof window === TYPE_OBJECT && ST_SETTIMEOUT in window &&
      window.window == window &&
      typeof document === TYPE_OBJECT && document.nodeType > 0 &&
      typeof document.documentElement === TYPE_OBJECT
  ) {
    o.isWebBrowser = TRUE;
    if (window.location &&
        /^(?:chrome|resource):?$/.test(window.location.protocol)) {
      try {
        if (typeof Components !== TYPE_OBJECT) {
          throw FALSE;
        }
        Cc = Components.classes;
        Ci = Components.interfaces;
        Cr = Components.results;
        Cu = Components.utils;
        o.isWaitable = TRUE;
        o.hasComponents = TRUE;
        if (PotBrowser.firefox || PotBrowser.mozilla) {
          o.isFirefoxExtension = TRUE;
        }
      } catch (e) {
        Ci = Cc = Cr = Cu = NULL;
      }
    }
  } else {
    o.isNonBrowser = TRUE;
    if (typeof process !== TYPE_UNDEFINED && process && process.version &&
        typeof require === TYPE_FUNCTION &&
        (typeof exports === TYPE_OBJECT ||
        (typeof module === TYPE_OBJECT && typeof module.exports === TYPE_OBJECT))
    ) {
      o.isNodeJS = TRUE;
    }
  }
  if (PotGlobal && PotGlobal.ActiveXObject ||
      typeof ActiveXObject !== TYPE_UNDEFINED && ActiveXObject) {
    o.hasActiveXObject = TRUE;
  }
  if (!o.isFirefoxExtension) {
    if (PotBrowser.chrome || PotBrowser.webkit || PotBrowser.safari) {
      if (typeof chrome === TYPE_OBJECT &&
          typeof chrome.extension === TYPE_OBJECT) {
        o.isChromeExtension = TRUE;
      } else if (typeof safari === TYPE_OBJECT &&
                 typeof safari.extension === TYPE_OBJECT) {
        o.isSafariExtension = TRUE;
      }
    }
  }
  if (!o.isChromeExtension && !o.isSafariExtension) {
    if (typeof GM_log === TYPE_FUNCTION &&
        typeof GM_xmlhttpRequest === TYPE_FUNCTION) {
      o.isGreasemonkey = TRUE;
    } else if (typeof require === TYPE_FUNCTION) {
      try {
        if ('title' in require('windows').browserWindows.activeWindow) {
          o.isJetpack = TRUE;
        }
      } catch (e) {}
    }
    if (o.isWebBrowser && !o.isGreasemonkey && !o.isFirefoxExtension) {
      o.isNotExtension = TRUE;
    }
  }
  try {
    if (typeof FileReader !== TYPE_UNDEFINED &&
        typeof FileReader.LOADING !== TYPE_UNDEFINED &&
        typeof (new FileReader()).readAsText === TYPE_FUNCTION) {
      o.hasFileReader = TRUE;
    }
  } catch (e) {}
  return o;
}()));

(function(types) {
  var i = 0, len = types[ST_LENGTH], typeMaps = {};
  for (; i < len; i++) {
    (function() {
      var type = types[i], low = type.toLowerCase();
      typeMaps[buildObjectString(type)] = low;
      Pot['is' + type] = (function() {
        switch (low) {
          case TYPE_ERROR:
              return function(o) {
                return (o != NULL &&
                        (o instanceof Error || typeOf(o) === low)
                       ) || FALSE;
              };
          case 'date':
              return function(o) {
                return (o != NULL &&
                        (o instanceof Date || typeOf(o) === low)
                       ) || FALSE;
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
    typeOf : function(o) {
      return (o == NULL) ? String(o)
                         : (typeMaps[toString.call(o)] || TYPE_OBJECT);
    },
    typeLikeOf : function(o) {
      var type = typeOf(o);
      if (type !== TYPE_ARRAY && isArrayLike(o)) {
        type = TYPE_ARRAY;
      }
      return type;
    }
  });
}('Boolean Number String Function Array Date RegExp Object Error'.split(' ')));

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

update(PotInternal, {
  callInBackground : {
    flush : function(callback) {
      var handler = this.byEvent || this.byTick || this.byTimer;
      handler(callback);
    },
    byEvent : (function() {
      var IMAGE;
      if (PotSystem.isNonBrowser || PotSystem.isNodeJS ||
          typeof window !== TYPE_OBJECT  || typeof document !== TYPE_OBJECT ||
          typeof Image !== TYPE_FUNCTION || window.opera || PotBrowser.opera ||
          typeof document[FN_ADD_EVENT_LISTENER] !== TYPE_FUNCTION
      ) {
        return FALSE;
      }
      try {
        if (typeof (new Image())[FN_ADD_EVENT_LISTENER] !== TYPE_FUNCTION) {
          return FALSE;
        }
      } catch (e) {
        return FALSE;
      }
      IMAGE = 'data:image/gif;base64,' +
              'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
      return function(callback) {
        var done, img = new Image(), handler = function() {
          try {
            img[FN_REMOVE_EVENT_LISTENER](ST_LOAD, handler, FALSE);
            img[FN_REMOVE_EVENT_LISTENER](TYPE_ERROR, handler, FALSE);
          } catch (e) {}
          if (!done) {
            done = TRUE;
            callback();
          }
        };
        img[FN_ADD_EVENT_LISTENER](ST_LOAD, handler, FALSE);
        img[FN_ADD_EVENT_LISTENER](TYPE_ERROR, handler, FALSE);
        try {
          img.src = IMAGE;
        } catch (e) {
          this.byEvent = this.byTimer;
        }
      };
    }()),
    byTick : (function() {
      if (!PotSystem.isNodeJS || typeof process !== TYPE_OBJECT ||
          typeof process.nextTick !== TYPE_FUNCTION) {
        return FALSE;
      }
      return function(callback) {
        process.nextTick(callback);
      };
    }()),
    byTimer : function(callback, msec) {
      return setTimeout(callback, msec || 0);
    }
  },
  setTimeout : function(func, msec) {
    try {
      return PotInternalCallInBackground.byTimer(func, msec || 0);
    } catch (e) {}
  },
  clearTimeout : function(id) {
    try {
      return clearTimeout(id);
    } catch (e) {}
  }
});

PotInternalCallInBackground = PotInternal.callInBackground;
PotInternalSetTimeout       = PotInternal.setTimeout;
PotInternalClearTimeout     = PotInternal.clearTimeout;

Pot.update({
  Cc : Cc,
  Ci : Ci,
  Cr : Cr,
  Cu : Cu,
  StopIteration : (function() {
    var f = update(function() {
      return f;
    }, {
      NAME     : SI,
      toString : PotToString
    });
    f[ST_PROTOTYPE] = {
      constructor : f,
      NAME        : f[ST_NAME],
      toString    : f.toString
    };
    f[ST_PROTOTYPE].constructor[ST_PROTOTYPE] = f.constructor[ST_PROTOTYPE];
    return new f();
  }()),
  isStopIter : function(o) {
    if (!o) {
      return FALSE;
    }
    if (PotStopIteration !== UNDEFINED &&
        (o == PotStopIteration || o instanceof PotStopIteration)) {
      return TRUE;
    }
    if (typeof StopIteration !== TYPE_UNDEFINED &&
        (o == StopIteration || o instanceof StopIteration)) {
      return TRUE;
    }
    if (this && this.StopIteration !== UNDEFINED &&
        (o == this.StopIteration || o instanceof this.StopIteration)) {
      return TRUE;
    }
    if (~toString.call(o).indexOf(SI) ||
        ~String(o && o.toString && o.toString() || o).indexOf(SI)) {
      return TRUE;
    }
    if (isError(o) && o[SI] && !(SI in o[SI]) &&
        !isError(o[SI]) && isStopIter(o[SI])) {
      return TRUE;
    }
    return FALSE;
  },
  isIterable : function(x) {
    return !!(x && isFunction(x.next) &&
         (~Pot.getFunctionCode(x.next).indexOf(SI) ||
           Pot.isNativeCode(x.next)));
  },
  isArguments : function(x) {
    var result = FALSE;
    if (x) {
      if (toString.call(x) === '[object Arguments]') {
        result = TRUE;
      } else {
        try {
          if ('callee' in x && typeof x[ST_LENGTH] === TYPE_NUMBER) {
            result = TRUE;
          }
        } catch (e) {}
      }
    }
    return result;
  },
  isArrayLike : function(o) {
    var len;
    if (!o) {
      return FALSE;
    }
    if (isArray(o) || o instanceof Array || o.constructor === Array) {
      return TRUE;
    }
    len = o[ST_LENGTH];
    if (!isNumber(len) || (!isObject(o) && !isArray(o)) ||
         o === Pot  || o === PotGlobal || o === globals ||
        isWindow(o) ||  isDocument(o)  || isElement(o)
    ) {
      return FALSE;
    }
    if (o.isArray || Pot.isArguments(o) || isNodeList(o) ||
        ((typeof o.item === TYPE_FUNCTION ||
          typeof o.nextNode === TYPE_FUNCTION) &&
           o.nodeType != 3 && o.nodeType != 4) ||
        (0 in o && ((len - 1) in o)) ||
        RE_ARRAYLIKE.test(toString.call(o))
    ) {
      return TRUE;
    } else {
      return FALSE;
    }
  },
  isDeferred : function(x) {
    return x != NULL && ((x instanceof Deferred) ||
     (x.id   != NULL && x.id   === Deferred.fn.id &&
      x[ST_NAME] != NULL && x[ST_NAME] === Deferred.fn[ST_NAME]));
  },
  isIter : function(x) {
    return x != NULL && ((x instanceof Iter) ||
     (x.id   != NULL && x.id   === Iter.fn.id &&
      x[ST_NAME] != NULL && x[ST_NAME] === Iter.fn[ST_NAME] &&
                typeof x.next  === TYPE_FUNCTION));
  },
  isNumeric : function(n) {
    return (n == NULL ||
           (n === ''  ||
           (n ==  ''  && n && n.constructor === String)) ||
           (typeof n === TYPE_OBJECT && n.constructor !== Number)) ?
            FALSE : !isNaN(n - 0);
  },
  isNativeCode : function(method) {
    var code;
    if (!method) {
      return FALSE;
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
    return !!(~code.indexOf('[native code]') && code[ST_LENGTH] <= 92);
  },
  isBuiltinMethod : function(method) {
    return method != NULL && (typeof method === TYPE_FUNCTION ||
           method.constructor === Function) && Pot.isNativeCode(method);
  },
  isWindow : function(x) {
    return x != NULL && typeof x === TYPE_OBJECT && 'setInterval' in x &&
           x.window == x && !!(x.location || x.screen || x.navigator ||
           x.document);
  },
  isDocument : function(x) {
    return x != NULL && typeof x === TYPE_OBJECT && 'getElementById' in x &&
      x.nodeType > 0 && typeof x.documentElement === TYPE_OBJECT;
  },
  isElement : function(x) {
    return x != NULL && typeof x === TYPE_OBJECT && x.nodeType == 1;
  },
  isNodeList : function(x) {
    var type;
    if (x && isNumber(x[ST_LENGTH])) {
      type = typeof x.item;
      if (isObject(x)) {
        return type === TYPE_FUNCTION || type === TYPE_STRING;
      } else if (isFunction(x)) {
        return type === TYPE_FUNCTION;
      }
    }
    return FALSE;
  }
});
}('StopIteration'));

if (typeof StopIteration === TYPE_UNDEFINED || !StopIteration) {
  StopIteration = Pot.StopIteration;
}

PotStopIteration = Pot.StopIteration;
isArrayLike      = Pot.isArrayLike;
isNumeric        = Pot.isNumeric;
isStopIter       = Pot.isStopIter;
isDeferred       = Pot.isDeferred;
isIter           = Pot.isIter;
isWindow         = Pot.isWindow;
isDocument       = Pot.isDocument;
isElement        = Pot.isElement;
isNodeList       = Pot.isNodeList;

(function() {
  var win, doc, uri, wp, dp, a;
  wp = 'window contentWindow defaultView parentWindow content top'.split(' ');
  dp = 'ownerDocument document'.split(' ');
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
    typeof window   === TYPE_UNDEFINED ? this : window,
    typeof document === TYPE_UNDEFINED ? this : document
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
    uri = (typeof process === TYPE_OBJECT &&
            process.mainModule && process.mainModule.filename) ||
          (typeof __filename === TYPE_STRING && __filename);
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
    currentWindow : win || {},
    currentDocument : doc || {},
    currentURI : stringify(uri, TRUE)
  });
  Pot.update({
    currentWindow : function() {
      return PotSystem.currentWindow;
    },
    currentDocument : function() {
      return PotSystem.currentDocument;
    },
    currentURI : function() {
      return PotSystem.currentURI;
    }
  });
}());

update(PotSystem, {
  isBuiltinObjectKeys : Pot.isBuiltinMethod(Object.keys),
  isBuiltinArrayForEach : Pot.isBuiltinMethod(ArrayProto.forEach),
  isBuiltinArrayIndexOf : Pot.isBuiltinMethod(ArrayProto.indexOf),
  isBuiltinArrayLastIndexOf : Pot.isBuiltinMethod(ArrayProto.lastIndexOf)
});

Pot.update({
  keys : (function() {
    var hasDontEnumBug = !({toString : NULL})
                            .propertyIsEnumerable(ST_TOSTRING),
        dontEnums = [
          ST_TOSTRING,
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums[ST_LENGTH];
    return function(object) {
      var results = [], type = typeof object, len, p, i;
      if (type !== TYPE_OBJECT && type !== TYPE_FUNCTION || object === NULL) {
        return results;
      }
      if (isArrayLike(object)) {
        len = object[ST_LENGTH];
        for (i = 0; i < len; i++) {
          if (i in object) {
            results[results[ST_LENGTH]] = i;
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
              results[results[ST_LENGTH]] = p;
            }
          } catch (ex) {}
        }
        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            try {
              if (hasOwnProperty.call(object, dontEnums[i])) {
                results[results[ST_LENGTH]] = dontEnums[i];
              }
            } catch (er) {}
          }
        }
      }
      return results;
    };
  }()),
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
      var result = FALSE, code, open, close, org,
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
        skip = FALSE;
        cdata = FALSE;
        len = code[ST_LENGTH];
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
                      skip = TRUE;
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
                      skip = TRUE;
                      cdata = TRUE;
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
                      s = s.slice(0, -m[0][ST_LENGTH]) + ' ';
                      tag = m[1];
                      close = new RegExp('</' + rescape(tag) + '>$');
                      open  = new RegExp('<' + rescape(tag) + '\\b[^>]*>$');
                    }
                  } else if (x > 0) {
                    if (skip) {
                      if ((!cdata && z.slice(-2) === '--') ||
                           (cdata && z.slice(-2) === ']]')) {
                        skip = cdata = FALSE;
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
          result = TRUE;
        }
      }
      if (count < limit) {
        cache[org] = result;
        count++;
      }
      return result;
    };
  }()),
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
  getErrorMessage : function(error, defaults) {
    var msg;
    if (isError(error)) {
      msg = String(error.message  || error.description ||
                  (error.toString && error.toString()) || error);
    } else {
      msg = (error && error.toString && error.toString()) || error;
    }
    return stringify(msg) || stringify(defaults) || TYPE_ERROR;
  }
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

function update() {
  var args = arguments, len = args[ST_LENGTH], i = 1, o, p, x;
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

function arrayize(object, index) {
  var array, i, len, me = arrayize, t;
  if (me.canNodeList == NULL) {
    if (PotSystem.currentDocument) {
      try {
        t = slice.call(
          PotSystem.currentDocument.documentElement.childNodes
        )[0].nodeType;
        t = NULL;
        me.canNodeList = TRUE;
      } catch (e) {
        me.canNodeList = FALSE;
      }
    }
  }
  if (object == NULL) {
    array = [object];
  } else {
    switch (typeOf(object)) {
      case TYPE_ARRAY:
          array = object.slice();
          break;
      case TYPE_OBJECT:
          if (isArrayLike(object)) {
            if (!me.canNodeList && isNodeList(object)) {
              array = [];
              i = 0;
              len = object[ST_LENGTH];
              do {
                array[i] = object[i];
              } while (++i < len);
            } else {
              array = slice.call(object);
            }
            break;
          }
      default:
          array = slice.call(concat.call([], object));
    }
  }
  if (index > 0) {
    array = array.slice(index);
  }
  return array;
}

function now() {
  return +new Date;
}

function stringify(x, ignoreBoolean) {
  var result = '', c, len = arguments[ST_LENGTH];
  if (x !== NULL) {
    switch (typeof x) {
      case TYPE_STRING:
      case TYPE_NUMBER:
      case 'xml':
          result = x;
          break;
      case TYPE_BOOLEAN:
          if (len >= 2 && !ignoreBoolean) {
            result = x;
          } else if (!ignoreBoolean) {
            result = x ? 1 : '';
          }
          break;
      case TYPE_OBJECT:
          if (x) {
            c = x.constructor;
            if (c === String || c === Number ||
                (typeof XML !== TYPE_UNDEFINED && c === XML) ||
                (typeof Buffer !== TYPE_UNDEFINED && c === Buffer)) {
              result = x;
            } else if (c === Boolean) {
              if (len >= 2 && !ignoreBoolean) {
                result = x;
              } else if (!ignoreBoolean) {
                result = (x == TRUE) ? 1 : '';
              }
            }
          }
    }
  }
  return result.toString();
}

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
  return stringify(s, TRUE).replace(re, '');
}

function rescape(s) {
  return stringify(s, TRUE).replace(RE_RESCAPE, '\\$1');
}

function invoke() {
  var args = arrayize(arguments), argn = args[ST_LENGTH],
      object, method, params, emit, p, t, i, len, err;
  try {
    switch (argn) {
      case 0:
          throw FALSE;
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
      emit = TRUE;
      if (!object) {
        object = (globals || PotGlobal);
      }
    }
  } catch (e) {
    err = e;
    throw isError(err) ? err : new Error(err);
  }
  if (isFunction(method.apply) && isFunction(method.call)) {
    if (params == NULL || !params[ST_LENGTH]) {
      return method.call(object);
    } else {
      return method.apply(object, params);
    }
  } else {
    p = params || [];
    len = p[ST_LENGTH] || 0;
    if (emit) {
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
      t[t[ST_LENGTH]] = 'p[' + i + ']';
    }
    return (new Function(
      'e,o,m,p',
      ['return e?o[m](', '):m(', ');'].join(t.join(','))
    ))(emit, object, method, p);
  }
}

function debug(msg) {
  var args = arguments, me = debug, func, consoleService;
  try {
    if (!me.firebug('log', args)) {
      if (!PotSystem.hasComponents) {
        throw FALSE;
      }
      consoleService = Cc[ST_MOZILLA_ORG + 'consoleservice;1']
                      .getService(Ci.nsIConsoleService);
      consoleService.logStringMessage(String(msg));
    }
  } catch (e) {
    if (typeof console !== TYPE_UNDEFINED && console) {
      func = console.debug || console.dir || console.log;
    } else if (typeof opera !== TYPE_UNDEFINED && opera && opera.postError) {
      func = opera.postError;
    } else if (typeof GM_log === TYPE_FUNCTION) {
      func = GM_log;
    } else {
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
        } catch (e) {}
      }
    }
  }
  return msg;
}

update(debug, {
  firebug : function(method, args) {
    var result = FALSE, win, fbConsole;
    try {
      if (!PotSystem.hasComponents) {
        throw FALSE;
      }
      win = XPCOM.getMostRecentWindow();
      if (!win) {
        throw win;
      }
      if (win.FirebugConsole && win.FirebugContext) {
        fbConsole = new win.FirebugConsole(win.FirebugContext, win.content);
        fbConsole[method].apply(fbConsole, args);
        result = TRUE;
      } else if (win.Firebug && win.Firebug.Console) {
        try {
          win.Firebug.Console.logFormatted.call(
            win.Firebug.Console,
            arrayize(args),
            win.FirebugContext,
            method
          );
          result = TRUE;
        } catch (er) {}
      }
    } catch (e) {}
    return result;
  }
});

Pot.update({
  arrayize : arrayize,
  stringify : stringify,
  trim : trim,
  rescape : rescape,
  invoke : invoke,
  now : now,
  debug : debug
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

function each(object, callback, context) {
  var i, len, val, err, p, keys;
  if (object) {
    len = object[ST_LENGTH];
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
        len = keys[ST_LENGTH];
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

function buildSerial(o, sep) {
  return [
    String((o && (o[ST_NAME] || o.name)) || UNDEFINED),
    Math.random().toString(36).substring(2),
    now()
  ].join(arguments[ST_LENGTH] >= 2 ? sep : '-');
}

function buildObjectString(name) {
  return '[object ' + name + ']';
}

function extendDeferredOptions(o, x) {
  var a, b;
  if (o && x) {
    if (isObject(o[ST_OPTIONS])) {
      a = o[ST_OPTIONS];
    } else if (isObject(o)) {
      a = o;
    }
    if (isObject(x[ST_OPTIONS])) {
      b = x[ST_OPTIONS];
    } else if (isObject(x)) {
      b = x;
    }
    if ('async' in b) {
      a.async = !!b.async;
    }
    if ('speed' in b && isNumeric(b.speed)) {
      a.speed = b.speed;
    }
    if (ST_CANCELLERS in b) {
      if (!b.cancellers || !b.cancellers[ST_LENGTH]) {
        b.cancellers = [];
      } else {
        if (a.cancellers && a.cancellers[ST_LENGTH]) {
          a.cancellers = concat.call([],
            arrayize(a.cancellers), arrayize(b.cancellers));
        } else {
          a.cancellers = arrayize(b.cancellers);
        }
      }
    }
    if (ST_STOPPERS in b) {
      if (!b.stoppers || !b.stoppers[ST_LENGTH]) {
        b.stoppers = [];
      } else {
        if (a.stoppers && a.stoppers[ST_LENGTH]) {
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
(function() {

Pot.update({
  Deferred : function() {
    return isDeferred(this) ? this.init(arguments)
                            : new Deferred.fn.init(arguments);
  }
});
Deferred = Pot.Deferred;
update(Deferred, {
  StopIteration : PotStopIteration,
  speeds : {
    limp   : 2400,
    doze   : 1000,
    slow   :  100,
    normal :   36,
    fast   :   20,
    rapid  :   12,
    ninja  :    0
  },
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
  defaults : {
    speed     : Deferred.speeds.ninja,
    canceller : NULL,
    stopper   : NULL,
    async     : TRUE
  }
});

Deferred.fn = Deferred[ST_PROTOTYPE] = update(Deferred[ST_PROTOTYPE], {
  constructor : Deferred,
  id : PotInternal.getMagicNumber(),
  serial : NULL,
  chains : [],
  chained : FALSE,
  cancelled : FALSE,
  freezing : FALSE,
  tilling : FALSE,
  waiting : FALSE,
  nested : 0,
  state : NULL,
  results : NULL,
  destAssign : FALSE,
  chainDebris : NULL,
  options : {},
  plugins : {},
  NAME : ST_DEFERRED,
  toString : PotToString,
  isDeferred : isDeferred,
  init : function(args) {
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    this[ST_OPTIONS] = {};
    this.plugins = {};
    initOptions.call(this, arrayize(args), Deferred.defaults);
    update(this, {
      results     : {
        success   : NULL,
        failure   : NULL
      },
      state       : Deferred.states.unfired,
      chains      : [],
      nested      : 0,
      chained     : FALSE,
      cancelled   : FALSE,
      freezing    : FALSE,
      tilling     : FALSE,
      waiting     : FALSE,
      destAssign  : FALSE,
      chainDebris : NULL
    });
    PotInternal.referSpeeds.call(this, Deferred.speeds);
    return this;
  },
  speed : function(sp) {
    var that = this, args = arguments, value;
    if (isNumeric(sp)) {
      value = sp - 0;
    } else if (isNumeric(Deferred.speeds[sp])) {
      value = Deferred.speeds[sp] - 0;
    } else {
      value = this[ST_OPTIONS].speed;
    }
    if (this.state === Deferred.states.unfired && !this.chains[ST_LENGTH]) {
      if (args[ST_LENGTH] === 0) {
        return this[ST_OPTIONS].speed;
      }
      this[ST_OPTIONS].speed = value;
    } else {
      this.then(function(reply) {
        if (args[ST_LENGTH] === 0) {
          return that[ST_OPTIONS].speed;
        }
        that[ST_OPTIONS].speed = value;
        return reply;
      });
    }
    return this;
  },
  async : function(sync) {
    var that = this, args = arguments;
    if (this.state === Deferred.states.unfired && !this.chains[ST_LENGTH]) {
      if (args[ST_LENGTH] === 0) {
        return this[ST_OPTIONS].async;
      }
      this[ST_OPTIONS].async = !!sync;
    } else {
      this.then(function(reply) {
        if (args[ST_LENGTH] === 0) {
          return that[ST_OPTIONS].async;
        }
        that[ST_OPTIONS].async = !!sync;
        return reply;
      });
    }
    return this;
  },
  canceller : function(func) {
    var args = arguments;
    if (this.state === Deferred.states.unfired && !this.chains[ST_LENGTH]) {
      if (args[ST_LENGTH] === 0) {
        return this[ST_OPTIONS].cancellers;
      }
      if (!this.cancelled && isFunction(func)) {
        this[ST_OPTIONS].cancellers.push(func);
      }
    } else {
      this.stopper.apply(this, args);
    }
    return this;
  },
  stopper : function(func) {
    var that = this, args = arguments;
    if (this.state === Deferred.states.unfired && !this.chains[ST_LENGTH]) {
      this.canceller.apply(this, args);
    } else {
      this.then(function(reply) {
        if (args[ST_LENGTH] === 0) {
          return that[ST_OPTIONS].stoppers;
        }
        if (!that.cancelled && isFunction(func)) {
          that[ST_OPTIONS].stoppers.push(func);
        }
        return reply;
      });
    }
    return this;
  },
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
  rescue : function(errback) {
    return this.then(NULL, errback);
  },
  ensure : function(callback) {
    return this.then(callback, callback);
  },
  cancel : function() {
    if (!this.cancelled) {
      this.cancelled = TRUE;
      switch (this.state) {
        case Deferred.states.unfired:
            cancelize.call(this, ST_CANCELLERS);
            if (this.state === Deferred.states.unfired) {
              this.raise(new Error(this));
            }
            break;
        case Deferred.states.success:
            cancelize.call(this, ST_STOPPERS);
            if (isDeferred(this.results.success)) {
              this.results.success.cancel();
            }
            break;
        case Deferred.states.failure:
            cancelize.call(this, ST_STOPPERS);
      }
    }
    return this;
  },
  begin : function() {
    var that = this, arg, args = arrayize(arguments), value;
    arg = args[0];
    if (args[ST_LENGTH] > 1) {
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
        this[ST_OPTIONS].cancellers = [];
        post.call(this, value);
      }
    }
    PotInternal.referSpeeds.call(this, Deferred.speeds);
    return this;
  },
  raise : function() {
    var args = arrayize(arguments), arg, value;
    arg = args[0];
    if (!isError(arg)) {
      args[0] = new Error(arg);
    }
    if (args[ST_LENGTH] > 1) {
      value = args;
    } else {
      value = args[0];
    }
    return this.begin.apply(this, arrayize(value));
  },
  end : function() {
    this.chained = TRUE;
    return this;
  },
  wait : function(seconds, value) {
    var d = new Deferred(), that = this, args = arguments;
    return this.then(function(reply) {
      if (isError(reply)) {
        throw reply;
      }
      that.waiting = TRUE;
      Deferred.wait(seconds).ensure(function(result) {
        that.waiting = FALSE;
        if (isError(result)) {
          d.raise(result);
        } else {
          d.begin(args[ST_LENGTH] >= 2 ? value : reply);
        }
      });
      return d;
    });
  },
  till : function(cond) {
    var that = this, d = new Deferred();
    return this.then(function(reply) {
      if (isError(reply)) {
        throw reply;
      }
      that.tilling = TRUE;
      Deferred.till(cond, reply).ensure(function(result) {
        that.tilling = FALSE;
        if (isError(result)) {
          d.raise(result);
        } else {
          d.begin(reply);
        }
      });
      return d;
    });
  },
  args : function() {
    var a = arrayize(arguments), len = a[ST_LENGTH];
    if (len === 0) {
      return Deferred.lastResult(this);
    } else {
      return this.then(function() {
        var reply, reps = arrayize(arguments);
        if (reps[ST_LENGTH] > 1) {
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
  data : function() {
    var that = this, result = this, args = arrayize(arguments),
        i, len = args[ST_LENGTH], prefix = '.';
    if (this[ST_OPTIONS]) {
      if (!this[ST_OPTIONS].storage) {
        this[ST_OPTIONS].storage = {};
      }
      switch (len) {
        case 0:
            result = {};
            each(this[ST_OPTIONS].storage, function(val, key) {
              try {
                if (key && key.charAt(0) === prefix) {
                  result[key.substring(1)] = val;
                }
              } catch (e) {}
            });
            break;
        case 1:
            if (args[0] == NULL) {
              this[ST_OPTIONS].storage = {};
            } else if (isObject(args[0])) {
              each(args[0], function(val, key) {
                that[ST_OPTIONS].storage[prefix + stringify(key)] = val;
              });
            } else {
              result = this[ST_OPTIONS].storage[prefix + stringify(args[0])];
            }
            break;
        case 2:
            this[ST_OPTIONS].storage[prefix + stringify(args[0])] = args[1];
            break;
        default:
            i = 0;
            do {
              this[ST_OPTIONS].storage[prefix + stringify(args[i++])] = args[i++];
            } while (i < len);
      }
    }
    return result;
  },
  update : function() {
    var that = Deferred.fn, args = arrayize(arguments);
    args.unshift(that);
    update.apply(that, args);
    return this;
  }
});

Deferred.fn.init[ST_PROTOTYPE] = Deferred.fn;
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

function setState(value) {
  if (isError(value)) {
    this.state = Deferred.states.failure;
  } else {
    this.state = Deferred.states.success;
  }
  return this.state;
}

function post(value) {
  setState.call(this, value);
  this.results[Deferred.states[this.state]] = value;
  if (!this.freezing && !this.tilling && !this.waiting) {
    fire.call(this);
  }
}

function fire(force) {
  if (force || (!this.freezing && !this.tilling && !this.waiting)) {
    if (this[ST_OPTIONS] && this[ST_OPTIONS].async) {
      fireAsync.call(this);
    } else {
      fireSync.call(this);
    }
  }
}

function fireAsync() {
  var that = this, speed, callback;
  if (this[ST_OPTIONS] && isNumeric(this[ST_OPTIONS].speed)) {
    speed = this[ST_OPTIONS].speed;
  } else {
    speed = Deferred.defaults.speed;
  }
  this.freezing = TRUE;
  callback = function() {
    try {
      fireProcedure.call(that);
    } catch (e) {
      that.freezing = FALSE;
      throw e;
    }
    if (chainsEnabled.call(that)) {
      fire.call(that, TRUE);
    } else {
      that.freezing = FALSE;
    }
  };
  if (!speed && this.state === Deferred.states.unfired) {
    PotInternalCallInBackground.flush(callback);
  } else {
    PotInternalSetTimeout(callback, speed);
  }
}

function fireSync() {
  fireProcedure.call(this);
  if (this[ST_OPTIONS] && this[ST_OPTIONS].async) {
    fire.call(this);
  }
}

function fireProcedure() {
  var that = this, result, reply, callbacks, callback, nesting = NULL, isStop;
  clearChainDebris.call(this);
  result = this.results[Deferred.states[this.state]];
  while (chainsEnabled.call(this)) {
    callbacks = this.chains.shift();
    callback = callbacks && callbacks[Deferred.states[this.state]];
    if (!isFunction(callback)) {
      continue;
    }
    isStop = FALSE;
    try {
      if (this.destAssign ||
          (isNumber(callback[ST_LENGTH]) && callback[ST_LENGTH] > 1 &&
           isArray(result) && result[ST_LENGTH] === callback[ST_LENGTH])) {
        reply = callback.apply(this, result);
      } else {
        reply = callback.call(this, result);
      }
      if (reply === UNDEFINED &&
          this.state !== Deferred.states.failure &&
          !isError(result) && !Pot.hasReturn(callback)) {
        reply = result;
      }
      result = reply;
      if (PotSystem.hasFileReader && result && result.constructor === FileReader) {
        result = readerPolling.call(this, result);
      }
      this.destAssign = FALSE;
      this.state = setState.call({}, result);
      if (isDeferred(result)) {
        nesting = function(result) {
          return bush.call(that, result);
        };
        this.nested++;
      }
    } catch (e) {
      result = e;
      if (isStopIter(result)) {
        isStop = TRUE;
      } else {
        setChainDebris.call(this, result);
      }
      this.destAssign = FALSE;
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
    if (this[ST_OPTIONS] && this[ST_OPTIONS].async) {
      break;
    }
  }
  this.results[Deferred.states[this.state]] = result;
  if (nesting && this.nested) {
    result.ensure(nesting).end();
  }
  reserveChainDebris.call(this);
}

function chainsEnabled() {
  return this.chains  && this.chains[ST_LENGTH] &&
    this.nested === 0 && !this.cancelled;
}

function hasErrback() {
  var exists, i, len, key, chains, errback;
  key = Deferred.states[Deferred.states.failure];
  chains = this.chains;
  len = chains && chains[ST_LENGTH];
  if (len) {
    for (i = 0; i < len; i++) {
      if (chains[i]) {
        errback = chains[i][key];
        if (errback && isFunction(errback)) {
          exists = TRUE;
          break;
        }
      }
    }
  }
  return exists;
}

function setChainDebris(result) {
  if (!hasErrback.call(this)) {
    this.chainDebris = {
      error : result
    };
  }
}

function reserveChainDebris() {
  var that = this, speed;
  if (this.chainDebris && TYPE_ERROR in this.chainDebris &&
      (this.cancelled || this.chained ||
        (!this.chains || !this.chains[ST_LENGTH]))
  ) {
    if (this[ST_OPTIONS] && isNumeric(this[ST_OPTIONS].speed)) {
      speed = this[ST_OPTIONS].speed;
    } else {
      speed = Deferred.defaults.speed;
    }
    this.chainDebris.timerId = PotInternalSetTimeout(function() {
      throw that.chainDebris.error;
    }, speed);
  }
}

function clearChainDebris() {
  if (this.chainDebris && this.chainDebris.timerId != NULL &&
      (this.state & Deferred.states.fired) && hasErrback.call(this)) {
    PotInternalClearTimeout(this.chainDebris.timerId);
    delete this.chainDebris.error;
    delete this.chainDebris.timerId;
    this.chainDebris = NULL;
  }
}

function bush(result) {
  post.call(this, result);
  this.nested--;
  if (this.nested === 0 && !this.cancelled &&
      (this.state & Deferred.states.fired)) {
    fire.call(this);
  }
}

function readerPolling(reader) {
  var d, done, async = FALSE,
      orgLoad = reader.onload,
      orgLoadEnd = reader.onloadend,
      orgError = reader.onerror;
  if (this[ST_OPTIONS] && this[ST_OPTIONS].async) {
    async = TRUE;
  }
  d = new Deferred({async : async});
  if (reader.readyState === FileReader.LOADING) {
    reader.onload = function(ev) {
      if (!done) {
        done = TRUE;
        d.begin(ev && ev.target && ev.target.result);
      }
      orgLoad && orgLoad.apply(this, arguments);
    };
    reader.onloadend = function(ev) {
      if (!done) {
        done = TRUE;
        d.begin(ev && ev.target && ev.target.result);
      }
      orgLoadEnd && orgLoadEnd.apply(this, arguments);
    };
    reader.onerror = function(e) {
      if (!done) {
        done = TRUE;
        d.raise(e);
      }
      orgError && orgError.apply(this, arguments);
    };
  } else {
    d.begin(reader.result);
  }
  return d;
}

function initOptions(args, defaults) {
  var opts, speed, canceller, stopper, async, nop, op, opt;
  if (args) {
    if (args[ST_LENGTH] === 1 && args[0] && isObject(args[0])) {
      opts = args[0];
      op = opts[ST_OPTIONS];
      if (opts.speed !== nop || opts.canceller !== nop ||
          opts.async !== nop || opts.stopper   !== nop
      ) {
        speed     = opts.speed;
        canceller = opts.canceller;
        stopper   = opts.stopper;
        async     = opts.async;
      } else {
        speed     = op && op.speed;
        canceller = op && op.canceller;
        stopper   = op && op.stopper;
        async     = op && op.async;
      }
    } else {
      if (args[ST_LENGTH] === 1 && args[0] && isArray(args[0])) {
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
  opt = this[ST_OPTIONS] = this[ST_OPTIONS] || {};
  opt.storage = opt.storage || {};
  if (!isArray(opt.cancellers)) {
    opt.cancellers = [];
  }
  if (!isArray(opt.stoppers)) {
    opt.stoppers = [];
  }
  if (!isNumeric(speed)) {
    if (opt.speed !== nop && isNumeric(opt.speed)) {
      speed = opt.speed - 0;
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
    if (opt.async !== nop && isBoolean(opt.async)) {
      async = opt.async;
    } else {
      async = defaults.async;
    }
  }
  update(opt, {
    speed : speed - 0,
    async : async
  });
  if (isFunction(canceller)) {
    opt.cancellers.push(canceller);
  }
  if (isFunction(stopper)) {
    opt.stoppers.push(stopper);
  }
  return this;
}

function cancelize(type) {
  var func, op = this[ST_OPTIONS];
  while (op[type] && op[type][ST_LENGTH]) {
    func = op[type].shift();
    if (isFunction(func)) {
      func.call(this);
    }
  }
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

update(Deferred, {
  extendSpeeds : function(target, name, construct, speeds) {
    var create = function(speedName, speed) {
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
    props : {
      forEach : TRUE,
      repeat  : TRUE,
      forEver : TRUE,
      iterate : TRUE,
      items   : TRUE,
      zip     : TRUE,
      map     : TRUE,
      filter  : TRUE,
      reduce  : TRUE,
      every   : TRUE,
      some    : TRUE
    },
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

Deferred.extendSpeeds(Pot, ST_DEFERRED, function(options) {
  return Deferred(options);
}, Deferred.speeds);

}());
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
(function() {

update(Deferred, {
  isDeferred : isDeferred,
  succeed : function() {
    var d = new Deferred();
    return d.begin.apply(d, arguments);
  },
  failure : function() {
    var d = new Deferred();
    return d.raise.apply(d, arguments);
  },
  wait : function(seconds, value) {
    var timer, d = new Deferred({
      canceller : function() {
        try {
          PotInternalClearTimeout(timer);
        } catch (e) {}
      }
    });
    if (arguments[ST_LENGTH] >= 2) {
      d.then(function() {
        return value;
      });
    }
    timer = PotInternalSetTimeout(function() {
      d.begin();
    }, Math.floor(((seconds - 0) || 0) * 1000));
    return d;
  },
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
  maybeDeferred : function(x) {
    var result;
    if (isDeferred(x)) {
      if (Deferred.isFired(x)) {
        result = x;
      } else {
        result = x.begin();
      }
    } else if (isError(x)) {
      result = Deferred.failure(x);
    } else {
      result = Deferred.succeed(x);
    }
    return result;
  },
  isFired : function(deferred) {
    return isDeferred(deferred) &&
           ((deferred.state & Deferred.states.fired) !== 0);
  },
  lastResult : function(deferred, value) {
    var result, args = arguments, key;
    if (isDeferred(deferred)) {
      try {
        key = Deferred.states[Deferred.states.success];
        if (args[ST_LENGTH] <= 1) {
          result = deferred.results[key];
        } else {
          deferred.results[key] = value;
          result = deferred;
        }
      } catch (e) {}
    }
    return result;
  },
  lastError : function(deferred, value) {
    var result, args = arguments, key;
    if (isDeferred(deferred)) {
      try {
        key = Deferred.states[Deferred.states.failure];
        if (args[ST_LENGTH] <= 1) {
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
  register : function() {
    var result = 0, that = Deferred.fn,
        args = arrayize(arguments), methods = [];
    switch (args[ST_LENGTH]) {
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
    if (methods && methods[ST_LENGTH]) {
      each(methods, function(item) {
        var subs = {}, name, func, method;
        if (item && item[ST_LENGTH] >= 2 && isFunction(item[1])) {
          name = stringify(item[0], TRUE);
          func = item[1];
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
  unregister : function() {
    var result = 0, that = Deferred.fn, args = arrayize(arguments), names;
    if (args[ST_LENGTH] > 1) {
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
  deferrize : function(object, method) {
    var args = arguments, func, context, err;
    try {
      switch (args[ST_LENGTH]) {
        case 0:
            throw FALSE;
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
            done = FALSE, error, isFired = Deferred.isFired;
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
              if (er != NULL) {
                throw er;
              }
              return r;
            });
            done = TRUE;
          } else {
            params[params[ST_LENGTH]] = val;
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
        if (error != NULL) {
          throw isError(error) ? error : new Error(error);
        }
        return dd;
      }).begin();
      return d;
    };
  },
  update : function() {
    var that = Deferred, args = arrayize(arguments);
    args.unshift(that);
    return update.apply(that, args);
  },
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
  parallel : function(deferredList) {
    var result, args = arguments, d, deferreds, values, bounds;
    if (args[ST_LENGTH] === 0) {
      result = Deferred.succeed();
    } else {
      if (args[ST_LENGTH] === 1) {
        if (isObject(deferredList)) {
          deferreds = deferredList;
        } else {
          deferreds = arrayize(deferredList);
        }
      } else {
        deferreds = arrayize(args);
      }
      result = new Deferred({
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
          defer.then(function() {
            var r = deferred();
            if (isDeferred(r) &&
                r.state === Deferred.states.unfired) {
              r.begin();
            }
            return r;
          });
        } else {
          defer = Deferred.succeed(deferred);
        }
        if (!isDeferred(defer)) {
          defer = Deferred.maybeDeferred(defer);
        }
        bounds[bounds[ST_LENGTH]] = key;
        d.then(function() {
          if (defer.state === Deferred.states.unfired) {
            Deferred.flush(defer);
          }
          defer.then(function(value) {
            if (bounds[ST_LENGTH]) {
              values[key] = value;
              bounds.pop();
              if (bounds[ST_LENGTH] === 0) {
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
  chain : (function() {
    var re = {
      funcName : /^\s*[()]*\s*function\s*([^\s()]+)/,
      rescue   : /rescue|raise|err|fail/i
    };
    return function() {
      var args = arguments, len = args[ST_LENGTH], chains,
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

Deferred.extendSpeeds(Deferred, ST_BEGIN, function(opts, x) {
  var d, timer, args = arrayize(arguments, 2),
      isCallable = (x && isFunction(x)),
      op = opts[ST_OPTIONS] || opts || {},
      speed, value;
  if (!op.cancellers) {
    op.cancellers = [];
  }
  op.cancellers.push(function() {
    try {
      if (timer != NULL) {
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
  speed = (((opts[ST_OPTIONS] && opts[ST_OPTIONS].speed) || opts.speed) - 0) || 0;
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

Deferred.extendSpeeds(Deferred, 'flush', function(opts, callback) {
  var speed, name, method, args = arrayize(arguments, 2);
  speed = opts[ST_OPTIONS] ? opts[ST_OPTIONS].speed : opts.speed;
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

Pot.update({
  succeed       : Deferred.succeed,
  failure       : Deferred.failure,
  wait          : Deferred.wait,
  callLater     : Deferred.callLater,
  callLazy      : Deferred.callLazy,
  maybeDeferred : Deferred.maybeDeferred,
  isFired       : Deferred.isFired,
  lastResult    : Deferred.lastResult,
  lastError     : Deferred.lastError,
  register      : Deferred.register,
  unregister    : Deferred.unregister,
  deferrize     : Deferred.deferrize,
  begin         : Deferred.begin,
  flush         : Deferred.flush,
  till          : Deferred.till,
  parallel      : Deferred.parallel,
  chain         : Deferred.chain
});

}());

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
(function() {
var LightIterator,
    QuickIteration,
    createLightIterateConstructor,
    createSyncIterator;

update(PotInternal, {
  LightIterator : update(function(object, callback, options) {
    return new LightIterator.fn.doit(
      object, callback, options
    );
  }, {
    speeds : {
      limp   : -1,
      doze   :  0,
      slow   :  2,
      normal :  5,
      fast   : 12,
      rapid  : 36,
      ninja  : 60
    },
    delays : {
      limp   : 1000,
      doze   :  100,
      slow   :   13,
      normal :    0,
      fast   :    0,
      rapid  :    0,
      ninja  :    0
    },
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

PotInternalLightIterator = LightIterator = PotInternal.LightIterator;

update(LightIterator, {
  defaults : {
    speed : LightIterator.speeds.normal
  },
  revSpeeds : {}
});

each(LightIterator.speeds, function(v, k) {
  LightIterator.revSpeeds[v] = k;
});

LightIterator.fn = LightIterator[ST_PROTOTYPE] = update(LightIterator[ST_PROTOTYPE], {
  constructor : LightIterator,
  interval : LightIterator.defaults.speed,
  iter : NULL,
  result : NULL,
  deferred : NULL,
  revDeferred : NULL,
  isDeferStopIter : FALSE,
  time : {},
  waiting : FALSE,
  restable : FALSE,
  async : FALSE,
  options : NULL,
  doit : function(object, callback, options) {
    this.setOptions(options);
    this.execute(object, callback);
    this.watch();
    return this;
  },
  setOptions : function(options) {
    this[ST_OPTIONS] = options || {};
    this.setInterval();
    this.setAsync();
  },
  setInterval : function() {
    var n = NULL;
    if (isNumeric(this[ST_OPTIONS].interval)) {
      n = this[ST_OPTIONS].interval - 0;
    } else if (this[ST_OPTIONS].interval in LightIterator.speeds) {
      n = LightIterator.speeds[this[ST_OPTIONS].interval] - 0;
    }
    if (n !== NULL && !isNaN(n)) {
      this.interval = n;
    }
    if (!isNumeric(this.interval)) {
      this.interval = LightIterator.defaults.speed;
    }
  },
  setAsync : function() {
    var a = NULL;
    if (this[ST_OPTIONS].async !== UNDEFINED) {
      a = !!this[ST_OPTIONS].async;
    }
    if (a !== NULL) {
      this.async = !!a;
    }
    if (!isBoolean(this.async)) {
      this.async = !!this.async;
    }
  },
  createDeferred : function() {
    return new Deferred({ async : FALSE });
  },
  watch : function() {
    var that = this;
    if (!this.async && this.waiting === TRUE && PotSystem.isWaitable) {
      XPCOM.throughout(function() {
        return that.waiting !== TRUE;
      });
    }
  },
  execute : function(object, callback) {
    var d, that = this;
    this.waiting = TRUE;
    if (!object) {
      this.result = {};
      this.waiting = FALSE;
    } else {
      this.waiting  = TRUE;
      this.restable = TRUE;
      this.time = {
        start : now(),
        total : NULL,
        loop  : NULL,
        diff  : NULL,
        risk  : NULL,
        axis  : NULL,
        count : 1,
        rest  : 100,
        limit : 255
      };
      this.setIter(object, callback);
      if (!this.async && !PotSystem.isWaitable) {
        this.revback();
        this.waiting = FALSE;
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
          that.waiting = FALSE;
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
  setIter : function(object, callback) {
    var type = this[ST_OPTIONS].type,
        types = LightIterator.types,
        context = this[ST_OPTIONS].context;
    switch (TRUE) {
      case ((type & types.iterate) === types.iterate):
          this.result = NULL;
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
  revback : function() {
    var that = this, result, err, cutback = FALSE, time;
    this.time.loop = now();
    REVOLVE: {
      do {
        try {
          if (this.isDeferStopIter) {
            this.isDeferStopIter = FALSE;
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
            if (res !== UNDEFINED) {
              if (isError(res)) {
                if (isStopIter(res)) {
                  that.isDeferStopIter = TRUE;
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
            that.flush(that.revback, TRUE);
          });
        }
        time = now();
        if (PotSystem.isWaitable) {
          if (this.time.total === NULL) {
            this.time.total = time;
          } else if (time - this.time.total >= this.time.rest) {
            XPCOM.throughout(0);
            this.time.total = now();
          }
        } else if (!this.async) {
          if (this.restable && this.time.count >= this.time.limit) {
            this.restable = FALSE;
          }
        }
        this.time.risk = time - this.time.start;
        this.time.diff = time - this.time.loop;
        if (this.time.diff >= this.interval) {
          if (this.async &&
              this.interval < LightIterator.speeds.normal) {
            cutback = TRUE;
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
              cutback = TRUE;
            }
          }
        }
      } while (!cutback);
      if (this.time.count <= this.time.limit) {
        this.time.count++;
      }
      return this.flush(this.revback, TRUE);
    }
    if (isDeferred(this.revDeferred)) {
      this.revDeferred.begin();
    }
  },
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
  flush : function(callback, useSpeed) {
    var that = this, d, lazy = FALSE, speed, speedKey;
    if (this.async || PotSystem.isWaitable) {
      lazy = TRUE;
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
  noop : function() {
    return {
      next : function() {
        throw PotStopIteration;
      }
    };
  },
  forEver : function(callback, context) {
    var i = 0;
    if (!isFunction(callback)) {
      return this.noop();
    }
    return {
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
  repeat : function(max, callback, context) {
    var i, loops, n, last;
    if (!isFunction(callback)) {
      return this.noop();
    }
    if (!max || max == NULL) {
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
      last  : FALSE,
      prev  : NULL
    };
    i = loops.step ? loops.begin : loops.end;
    last = loops.end - loops.step;
    return {
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
  forLoop : function(object, callback, context) {
    var copy, i = 0;
    if (!object || !object[ST_LENGTH] || !isFunction(callback)) {
      return this.noop();
    }
    copy = arrayize(object);
    return {
      next : function() {
        var val, result;
        while (TRUE) {
          if (i >= copy[ST_LENGTH]) {
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
  forInLoop : function(object, callback, context) {
    var copy, i = 0;
    if (isFunction(callback)) {
      copy = [];
      each(object, function(value, prop) {
        copy[copy[ST_LENGTH]] = [value, prop];
      });
    }
    if (!copy || !copy[ST_LENGTH]) {
      return this.noop();
    }
    return {
      next : function() {
        var result, c, key, val;
        while (TRUE) {
          if (i >= copy[ST_LENGTH]) {
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
  iterate : function(object, callback, context) {
    var that = this, iterable;
    if (Pot.isIterable(object) && !Pot.isIter(object)) {
      if (isFunction(callback)) {
        return {
          next : function() {
            var res = object.next();
            that.result = callback.apply(context, arrayize(res));
            return that.result;
          }
        };
      } else {
        return {
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
          next : function() {
            var results = iterable.next();
            results = arrayize(results);
            while (results[ST_LENGTH] < 2) {
              results.push(UNDEFINED);
            }
            results.push(object);
            that.result = callback.apply(context, results);
            return that.result;
          }
        };
      } else {
        return {
          next : function() {
            that.result = iterable.next();
            return that.result;
          }
        };
      }
    }
  },
  items : function(object, callback, context) {
    var that = this, copy, i = 0, isPair;
    if (isObject(object)) {
      copy = [];
      each(object, function(ov, op) {
        copy[copy[ST_LENGTH]] = [op, ov];
      });
      isPair = TRUE;
    } else if (isArrayLike(object)) {
      copy = arrayize(object);
    }
    if (!copy || !copy[ST_LENGTH]) {
      return this.noop();
    }
    if (isFunction(callback)) {
      return {
        next : function() {
          var result, c, key, val;
          while (TRUE) {
            if (i >= copy[ST_LENGTH]) {
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
            that.result[that.result[ST_LENGTH]] = result;
            return result;
          }
        }
      };
    } else {
      return {
        next : function() {
          var r, t, k, v;
          while (TRUE) {
            if (i >= copy[ST_LENGTH]) {
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
            that.result[that.result[ST_LENGTH]] = r;
            return r;
          }
        }
      };
    }
  },
  zip : function(object, callback, context) {
    var that = this, copy, i = 0, max;
    if (isArrayLike(object)) {
      copy = arrayize(object);
      max = copy[ST_LENGTH];
    }
    if (!max || !copy || !copy[ST_LENGTH]) {
      return this.noop();
    }
    if (isFunction(callback)) {
      return {
        next : function() {
          var result, zips = [], j, item;
          for (j = 0; j < max; j++) {
            item = arrayize(copy[j]);
            if (!item || !item[ST_LENGTH] || i >= item[ST_LENGTH]) {
              throw PotStopIteration;
            }
            zips[zips[ST_LENGTH]] = item[i];
          }
          result = callback.call(context, zips, object);
          that.result[that.result[ST_LENGTH]] = result;
          i++;
          return result;
        }
      };
    } else {
      return {
        next : function() {
          var z = [], k, t;
          for (k = 0; k < max; k++) {
            t = arrayize(copy[k]);
            if (!t || !t[ST_LENGTH] || i >= t[ST_LENGTH]) {
              throw PotStopIteration;
            }
            z[z[ST_LENGTH]] = t[i];
          }
          that.result[that.result[ST_LENGTH]] = z;
          i++;
          return z;
        }
      };
    }
  }
});

LightIterator.fn.doit[ST_PROTOTYPE] = LightIterator.fn;

update(LightIterator, {
  QuickIteration : {
    resolve : function(iter) {
      var err;
      try {
        while (TRUE) {
          iter.next();
        }
      } catch (e) {
        err = e;
        if (!isStopIter(err)) {
          throw err;
        }
      }
    },
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
    repeat : function(max, callback, context) {
      var result = {}, iter, that = LightIterator.fn;
      if (max) {
        iter = that.repeat(max, callback, context);
        QuickIteration.resolve(iter);
      }
      return result;
    },
    forEver : function(callback, context) {
      var result = {}, iter, that = LightIterator.fn;
      if (callback) {
        iter = that.forEver(callback, context);
        QuickIteration.resolve(iter);
      }
      return result;
    },
    iterate : function(object, callback, context) {
      var result, iter, o, that = LightIterator.fn;
      if (!object) {
        result = {};
      } else {
        result = NULL;
        o = {
          noop   : that.noop,
          result : NULL
        };
        iter = that.iterate.call(o, object, callback, context);
        QuickIteration.resolve(iter);
        result = o.result;
      }
      return result;
    },
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
update(PotTmp, {
  createLightIterateConstructor : function(creator) {
    var
    name,
    create = function(speed) {
      var interval;
      if (LightIterator.speeds[speed] === UNDEFINED) {
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

Pot.update({
  forEach : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.forLoop |
                    LightIterator.types.forInLoop;
        opts.interval = interval;
        opts.async = FALSE;
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
  repeat : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(max, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.repeat;
        opts.interval = interval;
        opts.async = FALSE;
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
  forEver : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(callback, context) {
        var opts = {};
        opts.type = LightIterator.types.forEver;
        opts.interval = interval;
        opts.async = FALSE;
        opts.context = context;
        return (new LightIterator(callback, NULL, opts)).result;
      };
    } else {
      return function(callback, context) {
        return QuickIteration.forEver(
          callback, context
        );
      };
    }
  }),
  iterate : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.iterate;
        opts.interval = interval;
        opts.async = FALSE;
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
  items : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.items;
        opts.interval = interval;
        opts.async = FALSE;
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
  zip : createLightIterateConstructor(function(interval) {
    if (PotSystem.isWaitable &&
        interval < LightIterator.speeds.normal) {
      return function(object, callback, context) {
        var opts = {};
        opts.type = LightIterator.types.zip;
        opts.interval = interval;
        opts.async = FALSE;
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

update(Deferred, {
  forEach : createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.forLoop |
                  LightIterator.types.forInLoop;
      opts.interval = interval;
      opts.async = TRUE;
      opts.context = context;
      return (new LightIterator(object, callback, opts)).deferred;
    };
  }),
  repeat : createLightIterateConstructor(function(interval) {
    return function(max, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.repeat;
      opts.interval = interval;
      opts.async = TRUE;
      opts.context = context;
      return (new LightIterator(max, callback, opts)).deferred;
    };
  }),
  forEver : createLightIterateConstructor(function(interval) {
    return function(callback, context) {
      var opts = {};
      opts.type = LightIterator.types.forEver;
      opts.interval = interval;
      opts.async = TRUE;
      opts.context = context;
      return (new LightIterator(callback, NULL, opts)).deferred;
    };
  }),
  iterate : createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.iterate;
      opts.interval = interval;
      opts.async = TRUE;
      opts.context = context;
      return (new LightIterator(object, callback, opts)).deferred;
    };
  }),
  items : createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.items;
      opts.interval = interval;
      opts.async = TRUE;
      opts.context = context;
      return (new LightIterator(object, callback, opts)).deferred;
    };
  }),
  zip : createLightIterateConstructor(function(interval) {
    return function(object, callback, context) {
      var opts = {};
      opts.type = LightIterator.types.zip;
      opts.interval = interval;
      opts.async = TRUE;
      opts.context = context;
      return (new LightIterator(object, callback, opts)).deferred;
    };
  })
});

delete PotTmp.createLightIterateConstructor;
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

Pot.update({
  Iter : function() {
    return isIter(this) ? this.init(arguments)
                        : new Iter.fn.init(arguments);
  }
});

Iter = Pot.Iter;

Iter.fn = Iter[ST_PROTOTYPE] = update(Iter[ST_PROTOTYPE], {
  constructor : Iter,
  id : PotInternal.getMagicNumber(),
  serial : NULL,
  NAME : 'Iter',
  toString : PotToString,
  isIter : isIter,
  init : function(args) {
    if (!this.serial) {
      this.serial = buildSerial(this);
    }
    return this;
  },
  next : function() {
    throw PotStopIteration;
  }
});

Iter.fn.init[ST_PROTOTYPE] = Iter.fn;

update(Iter, {
  StopIteration : PotStopIteration,
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
        o[o[ST_LENGTH]] = [xv, xp];
      });
    } else {
      o = arrayize(x);
    }
    iter = new Iter();
    iter.next = (function() {
      var i = 0;
      if (objectLike) {
        return function() {
          var key, val, pair;
          while (TRUE) {
            if (i >= o[ST_LENGTH]) {
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
          while (TRUE) {
            if (i >= o[ST_LENGTH]) {
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
  forEach : function() {
    return Pot.iterate.apply(NULL, arguments);
  },
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
      result = NULL;
    }
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res = callback.call(context, val, key, obj);
        if (isDeferred(res)) {
          return res.then(function(rv) {
            if (arrayLike) {
              result[result[ST_LENGTH]] = rv;
            } else if (objectLike) {
              result[key] = rv;
            } else {
              result = rv;
            }
          });
        } else {
          if (arrayLike) {
            result[result[ST_LENGTH]] = res;
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
  filter : (function() {
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
        result = NULL;
      }
      iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
      it = function() {
        return iterable(object, function(val, key, obj) {
          var res = cb.call(context, val, key, obj);
          if (isDeferred(res)) {
            return res.then(function(rv) {
              if (rv) {
                if (arrayLike) {
                  result[result[ST_LENGTH]] = val;
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
                result[result[ST_LENGTH]] = val;
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
  reduce : function(object, callback, initial, context) {
    var arrayLike, objectLike, value, skip, iterateDefer, it, iterable;
    iterateDefer = this && this.iterateSpeed;
    arrayLike  = object && isArrayLike(object);
    objectLike = object && !arrayLike && isObject(object);
    if (initial === UNDEFINED) {
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
    skip = TRUE;
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res;
        if (skip) {
          skip = FALSE;
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
  every : function(object, callback, context) {
    var result = TRUE, iterateDefer, it, iterable;
    iterateDefer = this && this.iterateSpeed;
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res = callback.call(context, val, key, obj);
        if (isDeferred(res)) {
          return res.then(function(rv) {
            if (!rv) {
              result = FALSE;
              throw PotStopIteration;
            }
          });
        } else {
          if (!res) {
            result = FALSE;
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
  some : function(object, callback, context) {
    var result = FALSE, iterateDefer, it, iterable;
    iterateDefer = this && this.iterateSpeed;
    iterable = iterateDefer || this && this.iterateSpeedSync || Pot.iterate;
    it = function() {
      return iterable(object, function(val, key, obj) {
        var res = callback.call(context, val, key, obj);
        if (isDeferred(res)) {
          return res.then(function(rv) {
            if (rv) {
              result = TRUE;
              throw PotStopIteration;
            }
          });
        } else {
          if (res) {
            result = TRUE;
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
  range : function() {
    var args = arguments, arg, result = [],
        begin = 0,
        end   = 0,
        step  = 1,
        n, string, iter;
    switch (args[ST_LENGTH]) {
      case 0:
          return;
      case 1:
          arg = args[0];
          if (isObject(arg)) {
            if (ST_BEGIN in arg) {
              begin = arg.begin;
            } else if (ST_START in arg) {
              begin = arg.start;
            }
            if (ST_END in arg) {
              end = arg.end;
            } else if (ST_STOP in arg) {
              end = arg.stop;
            }
            if (ST_STEP in arg) {
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
    if (isString(begin) && begin[ST_LENGTH] === 1 &&
        isString(end)   && end[ST_LENGTH]   === 1) {
      begin  = begin.charCodeAt(0) || 0;
      end    = end.charCodeAt(0)   || 0;
      string = TRUE;
    } else {
      begin  = begin - 0;
      end    = end   - 0;
      string = FALSE;
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
    iter.next = function() {
      if ((step > 0 && begin > end) ||
          (step < 0 && begin < end)) {
        throw PotStopIteration;
      }
      result[result[ST_LENGTH]] = string ? fromCharCode(begin) : begin;
      begin += step;
    };
    Pot.iterate(iter);
    return result;
  },
  indexOf : function(object, subject, from) {
    var result = -1, i, len, val, passed,
        args = arguments, argn = args[ST_LENGTH],
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
        len = (object && object[ST_LENGTH]) || 0;
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
      passed = FALSE;
      each(object, function(ov, op) {
        if (!passed && argn >= 3 && from !== op) {
          return;
        } else {
          passed = TRUE;
        }
        if (ov === subject) {
          result = op;
        }
      });
    } else if (object != NULL) {
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
        len = (object && object[ST_LENGTH]) || 0;
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
      passed = FALSE;
      each(object, function(ov, op) {
        pairs[pairs[ST_LENGTH]] = [op, ov];
        if (ov === subject) {
          result = op;
        }
        if (op === from) {
          passed = TRUE;
          throw PotStopIteration;
        }
      });
      if (passed) {
        result = -1;
        len = pairs[ST_LENGTH];
        while (--len >= 0) {
          key = pairs[len][0];
          val = pairs[len][1];
          if (val === subject) {
            result = key;
            break;
          }
        }
      }
    } else if (object != NULL) {
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

Pot.update({
  toIter : Iter.toIter
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

update(PotTmp, {
  createIterators : function(iters) {
    each(iters, function(iter) {
      var o = {};
      o[iter[ST_NAME]] = function() {
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
      Deferred.extendSpeeds(Deferred, iter[ST_NAME], function(opts) {
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
  createProtoIterators : function(iters) {
    each(iters, function(iter) {
      var o = {}, sp = {};
      o[iter[ST_NAME]] = function() {
        var args = arrayize(arguments), options = update({}, this[ST_OPTIONS]);
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
          sp.methods = function(speed) {
            return {
              iter    : iter.iterable[speed],
              context : iter.context
            };
          };
        } else {
          sp.methods = function(speed) {
            return {
              iter    : iter.method,
              context : {iterateSpeed : iter.context.iterateSpeed[speed]}
            };
          };
        }
        Deferred.extendSpeeds(Deferred.fn, iter[ST_NAME], function(opts) {
          var args = arrayize(arguments, 1),
              iterable = sp.methods(opts.speedName),
              options  = update({}, this[ST_OPTIONS]);
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
  createSyncIterator : function(creator) {
    var methods, construct,
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

PotTmp.createIterators([{
  NAME   : 'map',
  method : Iter.map
}, {
  NAME   : 'filter',
  method : Iter.filter
}, {
  NAME   : 'reduce',
  method : Iter.reduce
}, {
  NAME   : 'every',
  method : Iter.every
}, {
  NAME   : 'some',
  method : Iter.some
}]);

PotTmp.createProtoIterators([{
  NAME : 'forEach',
  method : Deferred.forEach,
  context : NULL,
  speed : TRUE,
  iterable : Deferred.forEach,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  NAME : 'repeat',
  method : Deferred.repeat,
  context : NULL,
  speed : TRUE,
  iterable : Deferred.repeat,
  args : function(arg, args) {
    if (isNumeric(arg)) {
      return [arg - 0].concat(args);
    }
    if (arg && isNumber(arg[ST_LENGTH])) {
      return [arg[ST_LENGTH]].concat(args);
    }
    if (arg && isObject(arg) &&
        (ST_END  in arg || ST_BEGIN in arg || ST_STEP in arg ||
         ST_STOP in arg || ST_START in arg)) {
      return [arg].concat(args);
    }
    return args;
  }
}, {
  NAME : 'forEver',
  method : Deferred.forEver,
  context : NULL,
  speed : TRUE,
  iterable : Deferred.forEver,
  args : function(arg, args) {
    return args;
  }
}, {
  NAME : 'iterate',
  method : Deferred.iterate,
  context : NULL,
  speed : TRUE,
  iterable : Deferred.iterate,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  NAME : 'items',
  method : Deferred.items,
  context : NULL,
  speed : TRUE,
  iterable : Deferred.items,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  NAME : 'zip',
  method : Deferred.zip,
  context : NULL,
  speed : TRUE,
  iterable : Deferred.zip,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  NAME : 'map',
  method : Iter.map,
  context : {iterateSpeed : Deferred.iterate},
  speed : TRUE,
  iterable : NULL,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  NAME : 'filter',
  method : Iter.filter,
  context : {iterateSpeed : Deferred.iterate},
  speed : TRUE,
  iterable : NULL,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  NAME : 'reduce',
  method : Iter.reduce,
  context : {iterateSpeed : Deferred.iterate},
  speed : TRUE,
  iterable : NULL,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  NAME : 'every',
  method : Iter.every,
  context : {iterateSpeed : Deferred.iterate},
  speed : TRUE,
  iterable : NULL,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}, {
  NAME : 'some',
  method : Iter.some,
  context : {iterateSpeed : Deferred.iterate},
  speed : TRUE,
  iterable : NULL,
  args : function(arg, args) {
    return [arg].concat(args);
  }
}]);

createSyncIterator = PotTmp.createSyncIterator;

Pot.update({
  map : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.map.apply(context, arguments);
    };
  }),
  filter : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.filter.apply(context, arguments);
    };
  }),
  reduce : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.reduce.apply(context, arguments);
    };
  }),
  every : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.every.apply(context, arguments);
    };
  }),
  some : createSyncIterator(function(speedKey) {
    return function() {
      var context = {iterateSpeedSync : Pot.iterate[speedKey]};
      return Iter.some.apply(context, arguments);
    };
  }),
  range : function() {
    return Iter.range.apply(NULL, arguments);
  },
  indexOf : function() {
    return Iter.indexOf.apply(NULL, arguments);
  },
  lastIndexOf : function() {
    return Iter.lastIndexOf.apply(NULL, arguments);
  }
});

update(PotInternal, {
  defineDeferrater : createSyncIterator
});

delete PotTmp.createIterators;
delete PotTmp.createProtoIterators;
delete PotTmp.createSyncIterator;
}());

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
Pot.update({
  XPCOM : {
    throughout : function(cond) {
      var thread;
      if (PotSystem.hasComponents) {
        try {
          thread = Cc[ST_MOZILLA_ORG + 'thread-manager;1']
                  .getService(Ci.nsIThreadManager).mainThread;
        } catch (e) {
          PotSystem.isWaitable = PotSystem.hasComponents = FALSE;
        }
        if (thread && PotSystem.hasComponents) {
          do {
            thread.processNextEvent(TRUE);
          } while (cond && !cond());
        }
      }
    },
    getMostRecentWindow : function() {
      var cwin;
      if (PotSystem.hasComponents) {
        try {
          cwin = Cc[ST_MOZILLA_ORG + 'appshell/window-mediator;1']
                .getService(Ci.nsIWindowMediator)
                .getMostRecentWindow('navigator:browser');
        } catch (e) {
          PotSystem.isWaitable = PotSystem.hasComponents = FALSE;
        }
      }
      return cwin;
    }
  }
});

XPCOM = Pot.XPCOM;

Pot.update({
  throughout : XPCOM.throughout,
  getMostRecentWindow : XPCOM.getMostRecentWindow
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

Pot.update({
  deferrizejQueryAjax : (function() {
    if (typeof jQuery !== TYPE_FUNCTION || !jQuery.fn) {
      return PotNoop;
    }
    return function() {
      return (function($) {
        var orgAjax = $.ajax;
        $.pot = Pot;
        $.fn.extend({
          deferred : function(method) {
            var func, args = arrayize(arguments, 1), exists = FALSE;
            each(args, function(arg) {
              if (isFunction(arg)) {
                exists = TRUE;
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
        $.ajax = function(options) {
          var er, d = new Deferred(),
              opts = update({}, options || {}),
              orgs = update({}, opts);
          update(opts, {
            success : function() {
              var args = arrayize(arguments), err, done;
              try {
                if (orgs.success) {
                  orgs.success.apply(this, args);
                }
              } catch (e) {
                done = TRUE;
                err = e || new Error(e);
                args.push(err);
                d.raise.apply(d, args);
              }
              if (!done) {
                d.destAssign = TRUE;
                d.begin.apply(d, args);
              }
            },
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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
Pot.update({
  globalize : function(target, advised) {
    var result = FALSE, args = arrayize(arguments),
        inputs, outputs, len = args[ST_LENGTH], noops = [];
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
    outputs = PotInternal.getExportObject(TRUE);
    if (inputs && outputs) {
      if (inputs === Pot) {
        if (PotInternal.exportPot && PotInternal.PotExportProps) {
          result = PotInternal.exportPot(advised, TRUE, TRUE);
        }
      } else {
        each(inputs, function(prop, name) {
          if (advised && name in outputs) {
            noops[noops[ST_LENGTH]] = name;
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

update(PotInternal, {
  exportPot : function(advised, forGlobalScope, allProps, initialize) {
    var outputs, noops = [];
    outputs = PotInternal.getExportObject(forGlobalScope);
    if (outputs) {
      if (allProps) {
        each(PotInternal.PotExportProps, function(prop, name) {
          if (advised && name in outputs) {
            noops[noops[ST_LENGTH]] = name;
          } else {
            outputs[name] = prop;
          }
        });
      } else {
        each(PotInternal.PotExportObject, function(prop, name) {
          if (advised && name in outputs) {
            noops[noops[ST_LENGTH]] = name;
          } else {
            outputs[name] = prop;
          }
        });
      }
    }
    if (initialize) {
      outputs = PotInternal.getExportObject(
        PotSystem.isNodeJS ? FALSE : TRUE
      );
      if (outputs) {
        update(outputs, PotInternal.PotExportObject);
      }
      if ((PotSystem.isNonBrowser ||
           !PotSystem.isNotExtension) && typeof exports !== TYPE_UNDEFINED) {
        if (typeof module !== TYPE_UNDEFINED && module.exports) {
          exports = module.exports = Pot;
        }
        exports.Pot = Pot;
      } else if (typeof define === TYPE_FUNCTION && define.amd) {
        define('pot', function() {
          return Pot;
        });
      }
      if (outputs && !outputs.Pot) {
        outputs[ST_POT] = Pot;
      }
    }
    return noops;
  },
  PotExportObject : {
    Pot : Pot
  },
  PotExportProps : {
    Pot                      : Pot,
    update                   : update,
    isBoolean                : isBoolean,
    isNumber                 : isNumber,
    isString                 : isString,
    isFunction               : isFunction,
    isArray                  : isArray,
    isDate                   : isDate,
    isRegExp                 : isRegExp,
    isObject                 : isObject,
    isError                  : isError,
    typeOf                   : typeOf,
    typeLikeOf               : typeLikeOf,
    StopIteration            : PotStopIteration,
    isStopIter               : isStopIter,
    isIterable               : Pot.isIterable,
    isArguments              : Pot.isArguments,
    isArrayLike              : isArrayLike,
    isDeferred               : isDeferred,
    isIter                   : isIter,
    isNumeric                : isNumeric,
    isNativeCode             : Pot.isNativeCode,
    isBuiltinMethod          : Pot.isBuiltinMethod,
    isWindow                 : isWindow,
    isDocument               : isDocument,
    isElement                : isElement,
    isNodeList               : isNodeList,
    Cc                       : Cc,
    Ci                       : Ci,
    Cr                       : Cr,
    Cu                       : Cu,
    Deferred                 : Deferred,
    succeed                  : Deferred.succeed,
    failure                  : Deferred.failure,
    wait                     : Deferred.wait,
    callLater                : Deferred.callLater,
    callLazy                 : Deferred.callLazy,
    maybeDeferred            : Deferred.maybeDeferred,
    isFired                  : Deferred.isFired,
    lastResult               : Deferred.lastResult,
    lastError                : Deferred.lastError,
    register                 : Deferred.register,
    unregister               : Deferred.unregister,
    deferrize                : Deferred.deferrize,
    begin                    : Deferred.begin,
    flush                    : Deferred.flush,
    till                     : Deferred.till,
    parallel                 : Deferred.parallel,
    chain                    : Deferred.chain,
    forEach                  : Pot.forEach,
    repeat                   : Pot.repeat,
    forEver                  : Pot.forEver,
    iterate                  : Pot.iterate,
    items                    : Pot.items,
    zip                      : Pot.zip,
    Iter                     : Iter,
    toIter                   : Iter.toIter,
    map                      : Pot.map,
    filter                   : Pot.filter,
    reduce                   : Pot.reduce,
    every                    : Pot.every,
    some                     : Pot.some,
    range                    : Pot.range,
    indexOf                  : Pot.indexOf,
    lastIndexOf              : Pot.lastIndexOf,
    hasReturn                : Pot.hasReturn,
    getErrorMessage          : Pot.getErrorMessage,
    getFunctionCode          : Pot.getFunctionCode,
    currentWindow            : Pot.currentWindow,
    currentDocument          : Pot.currentDocument,
    currentURI               : Pot.currentURI,
    throughout               : XPCOM.throughout,
    getMostRecentWindow      : XPCOM.getMostRecentWindow,
    rescape                  : rescape,
    arrayize                 : arrayize,
    invoke                   : invoke,
    stringify                : stringify,
    trim                     : trim,
    now                      : now,
    globalize                : Pot.globalize,
    debug                    : debug
  }
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

PotInternal.exportPot(FALSE, FALSE, FALSE, TRUE);

return Pot;

}(this || {}));

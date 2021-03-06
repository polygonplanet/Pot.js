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
    update                   : update,/*{#if Pot}*/
    PATH_DELIMITER           : Pot.PATH_DELIMITER,
    DIR_DELIMITER            : Pot.DIR_DELIMITER,
    XML_NS_URI               : Pot.XML_NS_URI,
    HTML_NS_URI              : Pot.HTML_NS_URI,
    XHTML_NS_URI             : Pot.XHTML_NS_URI,
    XLINK_NS_URI             : Pot.XLINK_NS_URI,
    XSL_NS_URI               : Pot.XSL_NS_URI,
    SVG_NS_URI               : Pot.SVG_NS_URI,
    XUL_NS_URI               : Pot.XUL_NS_URI,
    JS_VOID_URI              : Pot.JS_VOID_URI,/*{#endif}*/
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
    isArrayLike              : Pot.isArrayLike,/*{#if Pot}*/
    isPlainObject            : Pot.isPlainObject,
    isEmpty                  : Pot.isEmpty,/*{#endif}*/
    isDeferred               : Pot.isDeferred,
    isIter                   : Pot.isIter,
    isWorkeroid              : Pot.isWorkeroid,/*{#if Pot}*/
    isArrayBufferoid         : Pot.isArrayBufferoid,
    isHash                   : Pot.isHash,
    isJSEscaped              : Pot.isJSEscaped,/*{#endif}*/
    isPercentEncoded         : Pot.isPercentEncoded,/*{#if Pot}*/
    isHTMLEscaped            : Pot.isHTMLEscaped,/*{#endif}*/
    isNumeric                : Pot.isNumeric,
    isInt                    : Pot.isInt,
    isNativeCode             : Pot.isNativeCode,
    isBuiltinMethod          : Pot.isBuiltinMethod,
    isWindow                 : Pot.isWindow,
    isDocument               : Pot.isDocument,
    isElement                : Pot.isElement,
    isNodeLike               : Pot.isNodeLike,
    isNodeList               : Pot.isNodeList,/*{#if Pot}*/
    isDOMLike                : Pot.isDOMLike,/*{#endif}*/
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
    urlDecode                : Pot.URI.urlDecode,/*{#if Pot}*/
    parseURI                 : Pot.URI.parseURI,
    buildURI                 : Pot.URI.buildURI,
    resolveRelativeURI       : Pot.URI.resolveRelativeURI,
    getExt                   : Pot.URI.getExt,
    toDataURI                : Pot.URI.toDataURI,/*{#endif}*/
    request                  : Pot.Net.request,
    jsonp                    : Pot.Net.requestByJSONP,
    getJSON                  : Pot.Net.getJSON,
    loadScript               : Pot.Net.loadScript,
    hashCode                 : Pot.Crypt.hashCode,/*{#if Pot}*/
    md5                      : Pot.Crypt.md5,
    crc32                    : Pot.Crypt.crc32,
    sha1                     : Pot.Crypt.sha1,
    Arc4                     : Pot.Crypt.Arc4,/*{#endif}*/
    evalInSandbox            : Pot.XPCOM.evalInSandbox,
    throughout               : Pot.XPCOM.throughout,
    getMostRecentWindow      : Pot.XPCOM.getMostRecentWindow,
    getChromeWindow          : Pot.XPCOM.getChromeWindow,/*{#if Pot}*/
    ArrayBufferoid           : Pot.ArrayBufferoid,/*{#endif}*/
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
    DropFile                 : Pot.Signal.DropFile,/*{#if Pot}*/
    Hash                     : Pot.Hash,
    merge                    : Pot.Collection.merge,
    unique                   : Pot.Collection.unique,
    flatten                  : Pot.Collection.flatten,
    alphanumSort             : Pot.Collection.alphanumSort,
    clone                    : Pot.Struct.clone,
    bind                     : Pot.Struct.bind,
    partial                  : Pot.Struct.partial,
    keys                     : Pot.Struct.keys,
    values                   : Pot.Struct.values,
    tuple                    : Pot.Struct.tuple,
    unzip                    : Pot.Struct.unzip,
    pairs                    : Pot.Struct.pairs,
    count                    : Pot.Struct.count,
    first                    : Pot.Struct.first,
    firstKey                 : Pot.Struct.firstKey,
    last                     : Pot.Struct.last,
    lastKey                  : Pot.Struct.lastKey,
    contains                 : Pot.Struct.contains,
    remove                   : Pot.Struct.remove,
    removeAll                : Pot.Struct.removeAll,
    removeAt                 : Pot.Struct.removeAt,
    equals                   : Pot.Struct.equals,
    reverse                  : Pot.Struct.reverse,
    flip                     : Pot.Struct.flip,
    shuffle                  : Pot.Struct.shuffle,
    fill                     : Pot.Struct.fill,
    implode                  : Pot.Struct.implode,
    explode                  : Pot.Struct.explode,
    glue                     : Pot.Struct.glue,
    clearObject              : Pot.Struct.clearObject,
    time                     : Pot.DateTime.time,
    date                     : Pot.DateTime.format,
    prettyDate               : Pot.DateTime.prettyDate,
    rand                     : Pot.Complex.rand,
    limit                    : Pot.Complex.limit,
    convertToBase            : Pot.Complex.convertToBase,
    compareVersions          : Pot.Complex.compareVersions,
    escapeRegExp             : Pot.Sanitizer.escapeRegExp,
    escapeHTML               : Pot.Sanitizer.escapeHTML,
    unescapeHTML             : Pot.Sanitizer.unescapeHTML,
    escapeXPathText          : Pot.Sanitizer.escapeXPathText,
    escapeAppleScriptString  : Pot.Sanitizer.escapeAppleScriptString,
    escapeString             : Pot.Sanitizer.escapeString,
    unescapeString           : Pot.Sanitizer.unescapeString,
    escapeFileName           : Pot.Sanitizer.escapeFileName,
    escapeSequence           : Pot.Sanitizer.escapeSequence,
    unescapeSequence         : Pot.Sanitizer.unescapeSequence,
    utf8Encode               : Pot.UTF8.encode,
    utf8Decode               : Pot.UTF8.decode,
    utf8ByteOf               : Pot.UTF8.byteOf,
    convertEncodingToUnicode : Pot.UTF8.convertEncodingToUnicode,
    base64Encode             : Pot.Base64.encode,
    base64Decode             : Pot.Base64.decode,
    base64URLEncode          : Pot.Base64.urlEncode,
    base64URLDecode          : Pot.Base64.urlDecode,
    alphamericStringEncode   : Pot.Archive.AlphamericString.encode,
    alphamericStringDecode   : Pot.Archive.AlphamericString.decode,
    sprintf                  : Pot.Format.sprintf,
    format                   : Pot.Format.format,
    getExtByMimeType         : Pot.MimeType.getExtByMimeType,
    getMimeTypeByExt         : Pot.MimeType.getMimeTypeByExt,
    ReplaceSaver             : Pot.Text.ReplaceSaver,
    chr                      : Pot.Text.chr,
    ord                      : Pot.Text.ord,
    ltrim                    : Pot.Text.ltrim,
    rtrim                    : Pot.Text.rtrim,
    strip                    : Pot.Text.strip,
    indent                   : Pot.Text.indent,
    unindent                 : Pot.Text.unindent,
    normalizeSpace           : Pot.Text.normalizeSpace,
    splitBySpace             : Pot.Text.splitBySpace,
    canonicalizeNL           : Pot.Text.canonicalizeNL,
    wrap                     : Pot.Text.wrap,
    unwrap                   : Pot.Text.unwrap,
    startsWith               : Pot.Text.startsWith,
    endsWith                 : Pot.Text.endsWith,
    lower                    : Pot.Text.lower,
    upper                    : Pot.Text.upper,
    camelize                 : Pot.Text.camelize,
    hyphenize                : Pot.Text.hyphenize,
    underscore               : Pot.Text.underscore,
    extract                  : Pot.Text.extract,
    inc                      : Pot.Text.inc,
    dec                      : Pot.Text.dec,
    br                       : Pot.Text.br,
    stripTags                : Pot.Text.stripTags,
    truncate                 : Pot.Text.truncate,
    truncateMiddle           : Pot.Text.truncateMiddle,
    toCharCode               : Pot.Text.toCharCode,
    toHankakuCase            : Pot.Text.toHankakuCase,
    toZenkakuCase            : Pot.Text.toZenkakuCase,
    toHanSpaceCase           : Pot.Text.toHanSpaceCase,
    toZenSpaceCase           : Pot.Text.toZenSpaceCase,
    toHiraganaCase           : Pot.Text.toHiraganaCase,
    toKatakanaCase           : Pot.Text.toKatakanaCase,
    toHankanaCase            : Pot.Text.toHankanaCase,
    toZenkanaCase            : Pot.Text.toZenkanaCase,
    detectWindow             : Pot.DOM.detectWindow,
    detectDocument           : Pot.DOM.detectDocument,
    getOwnerDocument         : Pot.DOM.getOwnerDocument,
    getElement               : Pot.DOM.getElement,
    getElements              : Pot.DOM.getElements,
    isXHTML                  : Pot.DOM.isXHTML,
    isXML                    : Pot.DOM.isXML,
    tagNameOf                : Pot.DOM.tagNameOf,
    getNodeValue             : Pot.DOM.getValue,
    setNodeValue             : Pot.DOM.setValue,
    getHTMLString            : Pot.DOM.getHTMLString,
    setHTMLString            : Pot.DOM.setHTMLString,
    getOuterHTML             : Pot.DOM.getOuterHTML,
    setOuterHTML             : Pot.DOM.setOuterHTML,
    getTextContent           : Pot.DOM.getTextContent,
    setTextContent           : Pot.DOM.setTextContent,
    getSelectionObject       : Pot.DOM.getSelectionObject,
    getSelectionContents     : Pot.DOM.getSelectionContents,
    getSelectionText         : Pot.DOM.getSelectionText,
    getSelectionHTML         : Pot.DOM.getSelectionHTML,
    coerceToNode             : Pot.DOM.coerceToNode,
    removeElement            : Pot.DOM.removeElement,
    appendChilds             : Pot.DOM.appendChilds,
    prependChilds            : Pot.DOM.prependChilds,
    removeChilds             : Pot.DOM.removeChilds,
    getAttr                  : Pot.DOM.getAttr,
    setAttr                  : Pot.DOM.setAttr,
    hasAttr                  : Pot.DOM.hasAttr,
    removeAttr               : Pot.DOM.removeAttr,
    addClass                 : Pot.DOM.addClass,
    removeClass              : Pot.DOM.removeClass,
    hasClass                 : Pot.DOM.hasClass,
    toggleClass              : Pot.DOM.toggleClass,
    serializeToXMLString     : Pot.DOM.serializeToString,
    parseFromXMLString       : Pot.DOM.parseFromString,
    evaluate                 : Pot.DOM.evaluate,
    attr                     : Pot.DOM.attr,
    convertToHTMLDocument    : Pot.DOM.convertToHTMLDocument,
    convertToHTMLString      : Pot.DOM.convertToHTMLString,
    isElementInView          : Pot.DOM.isElementInView,
    css                      : Pot.Style.css,
    getStyle                 : Pot.Style.getStyle,
    setStyle                 : Pot.Style.setStyle,
    isShown                  : Pot.Style.isShown,
    isVisible                : Pot.Style.isVisible,
    pxize                    : Pot.Style.pxize,
    getSizePos               : Pot.Style.getSizePos,
    getPixelSize             : Pot.Style.getPixelSize,
    setSize                  : Pot.Style.setSize,
    getWidth                 : Pot.Style.getWidth,
    setWidth                 : Pot.Style.setWidth,
    getHeight                : Pot.Style.getHeight,
    setHeight                : Pot.Style.setHeight,
    getResizeSize            : Pot.Style.getResizeSize,/*{#endif}*/
    rescape                  : rescape,
    arrayize                 : arrayize,/*{#if Pot}*/
    numeric                  : numeric,/*{#endif}*/
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

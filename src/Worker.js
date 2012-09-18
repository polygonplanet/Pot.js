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

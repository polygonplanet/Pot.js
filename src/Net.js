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

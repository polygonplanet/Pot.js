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
            return fromUnicode(r);
          };
          result = s.replace(re, rep);
        }
        return result;
      }
    }
  })/*{#if Pot}*/,
  /**
   * @lends Pot.URI
   */
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
   * @lends Pot.URI
   */
  /**
   * Build to the URI from a string or an object with query-string.
   * Object key names can treat like "window.location" object keys.
   * Query-string will encode by percent-encoding.
   *
   *
   * @example
   *   var url = 'http://www.example.com/';
   *   var params = {
   *     foo : '{foo}',
   *     bar : '{bar}'
   *   };
   *   var result = Pot.buildURI(url, params);
   *   debug(result);
   *   // @results 'http://www.example.com/?foo=%7Bfoo%7D&bar=%7Bbar%7D'
   *
   *
   * @example
   *   var url = 'http://www.example.com/test?a=1';
   *   var params = [
   *     ['prototype',    '{foo}'],
   *     ['__iterator__', '{bar}'],
   *   ];
   *   var result = Pot.buildURI(url, params);
   *   debug(result);
   *   // @results
   *   // 'http://www.example.com/test?' +
   *   //   'a=1&prototype=%7Bfoo%7D&__iterator__=%7Bbar%7D'
   *
   *
   * @example
   *   var url = 'http://www.example.com/test?a=1';
   *   var params = 'b=2&c=3';
   *   var result = Pot.buildURI(url, params);
   *   debug(result);
   *   // @results 'http://www.example.com/test?a=1&b=2&c=3'
   *
   *
   * @example
   *   var parts = {
   *     protocol : 'http:',
   *     username : 'user',
   *     password : 'pass',
   *     hostname : 'www.example.com',
   *     port     : 8000,
   *     pathname : '/path/to/file.ext',
   *     query    : {
   *       arg1   : 'v1',
   *       arg2   : 'v#2'
   *     },
   *     hash     : 'a'
   *   };
   *   var result = Pot.buildURI(parts);
   *   debug(result);
   *   // @results
   *   // 'http://user:pass@www.example.com:8000/path/to/file.ext' +
   *   //   '?arg1=v1&arg2=v%232#a'
   *
   *
   * @example
   *   var uri = 'http://user:pass@host:8000/path/to/file.ext?' +
   *               'arg=value#fragment';
   *   var parts = parseURI(uri);
   *   var result = Pot.buildURI(parts);
   *   debug(result);
   *   // @results
   *   // 'http://user:pass@host:8000/path/to/file.ext?arg=value#fragment'
   *
   *
   * @example
   *   var parts = {
   *     protocol : 'file:',
   *     pathname : 'C:\\path\\to\\file.ext',
   *     query    : {
   *       arg1   : 'value#1',
   *       arg2   : 'value#2'
   *     },
   *     hash     : '#fragment'
   *   };
   *   var result = Pot.buildURI(parts);
   *   debug(result);
   *   // @results
   *   // 'file:///C:\\path\\to\\file.ext?' +
   *   //   'arg1=value%231&arg2=value%232#fragment'
   *
   *
   * @param  {String|Object}         url     Base URI string or
   *                                           parts as Object.
   * @param  {Object|Array|String}  (query)  (Optional) queryString.
   * @return {String}                        Return a builded URI string.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  buildURI : (function() {
    var
    RE_SCHEME = /^[^:]+:\/{0,}/,
    // URI list from RFC 1738: http://tools.ietf.org/html/rfc1738
    RE_PROTOCOL = new RegExp(
      '[st]?' +
      '(?:' +
        'http|ws|ftp|rsync|wais|telnet|nntp|' +
        'gopher|prospero|ssh|svn|scp|ldap|git' +
      ')' +
      '(?:[+]ssh)?' +
      's?',
      'i'
    );
    return function(url/*[, query]*/) {
      var uri, args = arguments, c, s, index, query,
          queryString = args[1],
          encode = Pot.URI.urlEncode,
          serialize = Pot.Serializer.serializeToQueryString,
          protocol, userinfo, host, pathname, search, hash;
      if (Pot.isObject(url)) {
        protocol = stringify(url.protocol);
        if (!protocol) {
          protocol = stringify(url.scheme);
          if (!protocol) {
            protocol = 'http:';
          }
        }
        c = protocol.slice(-1);
        if (c !== ':' && c !== '/') {
          protocol += ':';
        }
        userinfo = stringify(url.userinfo);
        if (!userinfo && url.username != null && url.password != null) {
          userinfo = [encode(url.username), encode(url.password)].join(':');
          if (userinfo === ':') {
            userinfo = '';
          }
        }
        if (userinfo && userinfo.slice(-1) !== '@') {
          userinfo += '@';
        }
        host = stringify(url.host);
        if (!host) {
          if (url.hostname != null) {
            host = stringify(url.hostname);
          }
          if (Pot.isNumeric(url.port)) {
            host += ':' + (+url.port);
          }
        }
        pathname = stringify(url.pathname);
        if (!pathname) {
          if (url.dirname != null && url.filename != null) {
            pathname = stringify(url.dirname) + stringify(url.filename);
          }
        }
        c = pathname.charAt(0);
        if (c !== '/' && c !== '\\') {
          pathname = '/' + pathname;
        }
        if (Pot.isObject(url.search) || Pot.isArrayLike(url.search)) {
          search = stringify(serialize(url.search));
        } else {
          search = stringify(url.search);
        }
        if (!search) {
          if (url.query != null) {
            if (Pot.isObject(url.query) || Pot.isArrayLike(url.query)) {
              search = stringify(serialize(url.query));
            } else {
              search = stringify(url.query);
            }
          } else if (queryString != null) {
            if (Pot.isObject(queryString) || Pot.isArrayLike(queryString)) {
              search = stringify(serialize(queryString));
            } else {
              search = stringify(queryString);
            }
          }
        }
        while (search.charAt(0) === '?') {
          search = search.substring(1);
        }
        if (search) {
          search = '?' + search;
        }
        hash = stringify(url.hash);
        if (!hash) {
          hash = stringify(url.fragment);
        }
        while (hash.charAt(0) === '#') {
          hash = hash.substring(1);
        }
        if (hash) {
          hash = '#' + hash;
        }
        uri = protocol + userinfo + host + pathname;
        c = (~uri.indexOf('?')) ? '&' : '?';
        while (search.charAt(0) === c) {
          search = search.substring(1);
        }
        if (search) {
          uri += c + search;
        }
        uri += hash;
      } else {
        uri = stringify(url);
        query = '';
        if (queryString != null) {
          if (Pot.isObject(queryString) || Pot.isArrayLike(queryString)) {
            query = stringify(serialize(queryString));
          } else {
            query = stringify(queryString);
          }
        }
        c = (~uri.indexOf('?')) ? '&' : '?';
        while (query.charAt(0) === c) {
          query = query.substring(1);
        }
        if (query) {
          uri += c + query;
        }
      }
      index = uri.indexOf(':');
      if (!~index) {
        protocol = 'http';
      } else {
        protocol = uri.substr(0, index).toLowerCase();
      }
      s = '';
      if (protocol === 'file') {
        s = '///';
      } else if (RE_PROTOCOL.test(protocol)) {
        s = '//';
      }
      protocol += ':' + s;
      if (uri.indexOf(s) !== 0) {
        uri = uri.replace(RE_SCHEME, protocol);
      }
      return uri;
    };
  }()),
  /**
   * @lends Pot.URI
   */
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
    cur = stringify(cur);
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
   * @lends Pot.URI
   */
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
   * @lends Pot.URI
   */
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
  }/*{#endif}*/
});

// Update Pot object.
Pot.update({
  urlEncode          : Pot.URI.urlEncode,
  urlDecode          : Pot.URI.urlDecode/*{#if Pot}*/,
  parseURI           : Pot.URI.parseURI,
  buildURI           : Pot.URI.buildURI,
  resolveRelativeURI : Pot.URI.resolveRelativeURI,
  getExt             : Pot.URI.getExt,
  toDataURI          : Pot.URI.toDataURI/*{#endif}*/
});

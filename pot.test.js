/**
 * Pot.js - Run Test
 *
 * @description
 *  Run Test for Pot.js
 *
 * @description
 *  JavaScriptライブラリPot.js用のテストスクリプト
 *
 * @fileoverview   Pot.js Run test
 * @author         polygon planet
 * @version        1.12
 * @date           2012-04-04
 * @copyright      Copyright (c) 2012 polygon planet <polygon.planet.aqua@gmail.com>
 * @license        Dual licensed under the MIT and GPL v2 licenses.
 */
var Assert = {
  JSON_URL     : './pot.test.json',
  JSONP_URL    : 'http://api.polygonpla.net/js/pot/pot.test.json',
  WORKER_URL   : './pot.worker.test.js',
  POTJS_LOADED : false
};

$(function() {
  // IE9 SUCKS
  try {
    if (typeof Pot === 'undefined') {
      throw 'continue';
    }
  } catch (e) {
    setTimeout(arguments.callee, 13);
    return;
  }
  if (Pot.TYPE === 'lite') {
    throw 'This test-run cannot execute by PotLite.js';
  }
  if (Assert.POTJS_LOADED) {
    return;
  }
  Assert.POTJS_LOADED = true;
  Pot.globalize();
  update(Assert, {
    results : [],
    OUTPUT  : $('#output').get(0),
    STATUS  : $('#status').get(0),
    PROGRES : $('#progres-bar').get(0),
    isEmpty : function(o) {
      for (var p in o) {
        return false;
      }
      return true;
    },
    equals : function(o, x) {
      var result = false;
      if (o == null) {
        return (o === x);
      }
      switch (typeLikeOf(o)) {
        case 'array':
            if (x && isArrayLike(x)) {
              if (Assert.isEmpty(o) && Assert.isEmpty(x)) {
                result = true;
              } else if (o.length == 0 && x.length == 0) {
                result = true;
              } else {
                result = false;
                forEach(o, function(v, i) {
                  if (!(i in x) || !Assert.equals(v, x[i])) {
                    result = false;
                    throw StopIteration;
                  } else {
                    result = true;
                  }
                });
              }
            }
            break;
        case 'object':
            if (x && isObject(x)) {
              if (Assert.isEmpty(o) && Assert.isEmpty(x)) {
                result = true;
              } else if (isWindow(o) || isDocument(o) || isNodeLike(o) ||
                         isWindow(x) || isDocument(x) || isNodeLike(x)) {
                result = (o === x);
              } else {
                result = false;
                forEach(o, function(v, k) {
                  if (!(k in x) || !Assert.equals(v, x[k])) {
                    result = false;
                    throw StopIteration;
                  } else {
                    result = true;
                  }
                });
              }
            }
            break;
        case 'string':
            if (isString(x) && o.toString() === x.toString()) {
              result = true;
            }
            break;
        case 'number':
            if (isNumber(x)) {
              if (isNaN(x) && isNaN(o)) {
                result = true;
              } else if (!isFinite(x) && !isFinite(o)) {
                result = true;
              } else if (isInt(x) && o == x) {
                result = true;
              } else if (Math.abs(o - x) <= 0.000001) {
                result = true;
              }
            }
            break;
        case 'function':
            if (isFunction(x) && o.toString() === x.toString() &&
                o.constructor === x.constructor && o.length == x.length) {
              result = true;
            }
            break;
        case 'boolean':
            if (isBoolean(x) && (o != false) == (x != false)) {
              result = true;
            }
            break;
        case 'date':
            if (isDate(x) && o.getTime() === x.getTime()) {
              result = true;
            }
            break;
        case 'error':
            if (isError(x) &&
                (('message' in o && o.message == x.message) ||
                 ('description' in o && o.description == x.description))) {
              result = true;
            }
            break;
        case 'regexp':
            if (isRegExp(x) && o.toString() === x.toString()) {
              result = true;
            }
            break;
        default:
            if (typeOf(o) === typeOf(x) && o === x) {
              result = true;
            }
            break;
      }
      if (Pot.equals && !result &&
          (typeof o === 'object' || typeof x === 'object')) {
        result = Pot.equals(o, x);
      }
      return result;
    },
    dump : function(o) {
      var r, me = arguments.callee, repr = function(x) {
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
      switch (typeLikeOf(o)) {
        case 'array':
            return '[' + map(o, function(v) {
              return me(v);
            }).join(', ') + ']';
        case 'object':
            r = [];
            if (isWindow(o) || isDocument(o) || isNodeLike(o)) {
              r[r.length] = Object.prototype.toString.call(o);
            } else {
              forEach(o, function(v, k) {
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
    scrollToBottom : function(time) {
      var d = new Deferred;
      try {
        if (!time) {
          throw time;
        }
        $(Assert.OUTPUT).scrollTo('div:last', time || 800, {
          axis    : 'y',
          onAfter : function() {
            d.begin();
          }
        });
      } catch (e) {
        try {
          Assert.OUTPUT.scrollTop = Assert.OUTPUT.scrollHeight;
        } catch (e) {}
        d.begin();
      }
      return d;
    },
    msg : function(message, html) {
      return maybeDeferred(message).then(function(msg) {
        var p = $('<p/>').addClass('assert-msg');
        $('<div/>')
          .addClass('assert-code-block')
          .append(
            html ? p.html(msg) : p.text(msg)
          )
          .appendTo(Assert.OUTPUT);
        $('<hr/>').appendTo(Assert.OUTPUT);
      }).wait(0.1).then(function() {
        return Assert.scrollToBottom(80).then(function() {
          return wait(0);
        });
      });
    },
    log : function(title, code, expect) {
      return maybeDeferred(expect).wait(0).then(function(expected) {
        var elem = $('<div/>')
          .addClass('assert-result')
          .text('Processing...');
        $('<div/>')
          .addClass('assert-code-block')
          .append(
            $('<h3/>')
              .text(title)
          )
          .append(
            $('<pre/>')
              .text(trim(code.toString()))
          )
          .append(
            $('<div/>')
              .addClass('assert-expect')
              .append(
                $('<p/>')
                  .text('expected result:')
              )
              .append(
                $('<code/>')
                  .addClass('assert-result')
                  .text(Assert.dump(expected))
              )
          )
          .append(elem)
          .appendTo(Assert.OUTPUT);
        $('<hr/>').appendTo(Assert.OUTPUT);
        return elem;
      }).wait(0.1).then(function(elem) {
        return Assert.scrollToBottom(250).then(function() {
          return Assert.invoke(title, code, expect, elem);
        }).then(function() {
          return Deferred.repeat(2, function(i) {
            return wait(i * 0.175).then(function() {
              return Assert.scrollToBottom(
                Math.min(250, Math.max(0, Math.floor(Math.random() * 250)))
              );
            });
          });
        });
      });
    },
    invoke : function(title, code, expect, elem) {
      return flush(code).ensure(function(actual) {
        var result, key;
        result = {
          title   : title,
          code    : code.toString(),
          expect  : expect,
          actual  : actual,
          failure : null,
          success : null
        };
        if (isError(actual)) {
          result.failure = actual;
          result.success = false;
        } else {
          result.success = true;
        }
        if (Assert.equals(expect, actual)) {
          key = 'actual';
        } else {
          key = 'failure';
          result.success = false;
        }
        $(elem)
          .empty()
          .removeClass('assert-result')
          .addClass('assert-' + key)
          .append(
            $('<p/>')
              .text('actual result:')
          )
          .append(
            $('<code/>')
              .addClass('assert-result')
              .text(Assert.dump(actual))
          );
        Assert.results.push(result);
        Assert.showState(Assert.results.length);
        return wait(0);
      });
    },
    showState : function(count) {
      callLazy(function() {
        var max = Math.max(count, Assert.Units.length - 3),
            per = (count == max) ? 100 : Math.floor(count / max * 100);
        $(Assert.STATUS).text(
          'Done: ' + count + '/' + max +
          ' (' + per + '%)'
        );
        $(Assert.PROGRES).css({width : per + '%'});
      });
    },
    run : function() {
      begin(function() {
        Assert.msg('Begin Test Run.');
        return wait(0.25).then(function() {
          Assert.OUTPUT.scrollTop = Assert.OUTPUT.scrollHeight;
        });
      }).wait(0.1).then(function() {
        return Deferred.forEach(Assert.Units, function(unit) {
          return Assert.log(unit.title, unit.code, unit.expect);
        });
      }).wait(1).ensure(function(ex) {
        
        if (isError(ex)) {
          alert(ex);
        }
        
        Assert.msg('End Test Run.').then(function() {
          var total = {
            count : {
              success : 0,
              failure : 0
            },
            title : {
              success : [],
              failure : []
            }
          };
          Deferred.forEach(Assert.results, function(result) {
            if (result.success) {
              total.count.success++;
              total.title.success.push(result.title);
            } else {
              total.count.failure++;
              total.title.failure.push(result.title);
            }
          }).then(function() {
            Assert.msg(
              $('<div/>')
                .append(
                  $('<h2/>')
                    .text('Total : ' +
                          (total.count.success + total.count.failure))
                )
                .append(
                  $('<h3/>')
                    .addClass('assert-success')
                    .css({background : 'transparent'})
                    .text('Success : ' + total.count.success)
                )
                .append(
                  $('<h3/>')
                    .addClass('assert-failure')
                    .css({background : 'transparent'})
                    .text('Failure : ' + total.count.failure)
                )
                .append(
                  (function() {
                    var ul = $('<ul/>');
                    forEach(total.title.failure, function(err) {
                      ul.append(
                        $('<li/>')
                          .addClass('assert-failure')
                          .css({background : 'transparent'})
                          .text(err)
                      );
                    });
                    return ul;
                  })()
                ),
              true
            );
          });
        });
      });
    },
    Units : [{
      title : 'Pot.update()',
      code  : function() {
        var obj = {foo: 1};
        update(obj, {bar: 2}, {baz: 3});
        return obj;
      },
      expect : {foo: 1, bar: 2, baz: 3}
    }, {
      title : 'Pot.stringify()',
      code  : function() {
        return [
          stringify(null),
          stringify((void 0)),
          stringify('foo'),
          stringify(new String('bar')),
          stringify([100]),
          stringify({})
        ];
      },
      expect : ['', '', 'foo', 'bar', '', '']
    }, {
      title : 'Pot.arrayize()',
      code  : function() {
        return [
          arrayize(null),
          arrayize((void 0)),
          arrayize('foo'),
          arrayize([]),
          arrayize([[100]]),
          (function() {
            return arrayize(arguments);
          })(1, 2, 3),
          arrayize(document.getElementsByTagName('body'))
        ];
      },
      expect : [
        [null], [(void 0)], ['foo'], [], [[100]],
        [1, 2, 3], [document.getElementsByTagName('body')[0]]
      ]
    }, {
      title  : 'Pot.numeric()',
      code   : function() {
        return [
          numeric(0),
          numeric(1234567890),
          numeric(new Number(25)),
          numeric(null),
          numeric((void 0)),
          numeric(true),
          numeric(false),
          numeric('abc'),
          numeric('0xFF'),
          numeric('1e8'),
          numeric('10px'),
          numeric('1,000,000ms.'),
          numeric('-512 +1'),
          numeric([]),
          numeric(['hoge'])
        ];
      },
      expect : [
        0,
        1234567890,
        25,
        0,
        0,
        1,
        0,
        2748,
        255,
        100000000,
        10,
        1000000,
        -512,
        0,
        1
      ]
    }, {
      title : 'Pot.rescape()',
      code  : function() {
        var pattern = '*[hoge]*';
        return new RegExp('^(' + rescape(pattern) + ')$', 'g');
      },
      expect : /^(\*\[hoge\]\*)$/g
    }, {
      title : 'Pot.trim()',
      code  : function() {
        return trim(' \t\r\nhoge \r ');
      },
      expect : 'hoge'
    }, {
      title : 'Pot.isBoolean()',
      code  : function() {
        return [isBoolean(true), isBoolean('hoge')];
      },
      expect : [true, false]
    }, {
      title : 'Pot.isNumber()',
      code  : function() {
        return [isNumber(123), isNumber('123')];
      },
      expect : [true, false]
    }, {
      title : 'Pot.isString()',
      code  : function() {
        return [isString('abc'), isString(123)];
      },
      expect : [true, false]
    }, {
      title : 'Pot.isFunction()',
      code  : function() {
        return [
          isFunction((function() {})),
          isFunction(123)
        ];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.isArray()',
      code   : function() {
        return [isArray([123]), isArray(123)];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.isDate()',
      code   : function() {
        return [isDate(new Date()), isDate(123)];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.isRegExp()',
      code   : function() {
        return [isRegExp(/\s+/g), isRegExp(123)];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.isObject()',
      code   : function() {
        return [isObject({a: 1, b: 2, c: 3}), isObject(123)];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.isError()',
      code   : function() {
        return [isError(new Error('error!')), isError(123)];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.typeOf()',
      code   : function() {
        return typeOf([1, 2, 3]);
      },
      expect : 'array'
    }, {
      title  : 'Pot.isStopIter()',
      code   : function() {
        try {
          throw StopIteration;
        } catch (e) {
          return isStopIter(e);
        }
      },
      expect : true
    }, {
      title  : 'Pot.isIterable()',
      code   : function() {
        var iter = new Iter();
        var i = 0;
        iter.next = function() {
          if (i > 5) {
            throw StopIteration;
          }
          return i++;
        };
        return isIterable(iter);
      },
      expect : true
    }, {
      title  : 'Pot.isScalar()',
      code   : function() {
        return [
          isScalar(null),
          isScalar((void 0)),
          isScalar(''),
          isScalar('abc'),
          isScalar(0),
          isScalar(123),
          isScalar(false),
          isScalar(true),
          isScalar(new Boolean(true)),
          isScalar([]),
          isScalar([1, 2, 3]),
          isScalar(/hoge/),
          isScalar(new Error()),
          isScalar({}),
          isScalar({a: 1, b: 2})
        ];
      },
      expect : [
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    }, {
      title  : 'Pot.isArrayLike()',
      code   : function() {
        return (function() {
          return isArrayLike(arguments);
        })();
      },
      expect : true
    }, {
      title  : 'Pot.isPlainObject()',
      code   : function() {
        var obj1 = {};
        var obj2 = {foo: 1, bar: 2, baz: 3};
        var obj3 = Boolean;
        var obj4 = document.body;
        return [
          isPlainObject(obj1),
          isPlainObject(obj2),
          isPlainObject(obj3),
          isPlainObject(obj4)
        ];
      },
      expect : [true, true, false, false]
    }, {
      title  : 'Pot.isEmpty()',
      code   : function() {
        return [
          isEmpty(null),
          isEmpty(true),
          isEmpty(false),
          isEmpty(0),
          isEmpty(-524560620),
          isEmpty(0.1205562),
          isEmpty(''),
          isEmpty('abc'),
          isEmpty(new String()),
          isEmpty([]),
          isEmpty([1, 2, 3]),
          isEmpty([[]]),
          isEmpty(new Array()),
          isEmpty(new Array('a', 'b')),
          isEmpty({a:1, b:2, c:3}),
          isEmpty({}),
          isEmpty(new Object()),
          isEmpty((void 0)),
          isEmpty((function() {})),
          isEmpty((function(a, b) { return a + b; }))
        ];
      },
      expect : [
        true,
        false,
        true,
        true,
        false,
        false,
        true,
        false,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        true,
        true,
        true,
        false
      ]
    }, {
      title  : 'Pot.isDeferred()',
      code   : function() {
        var d = new Deferred();
        var o = {};
        return [isDeferred(d), isDeferred(o)];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.isIter()',
      code   : function() {
        var obj = {};
        var iter = new Iter();
        return [isIter(iter), isIter(obj)];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.isWorkeroid()',
      code   : function() {
        var o = {hoge : 1};
        var w = new Workeroid();
        return [isWorkeroid(o), isWorkeroid(w)];
      },
      expect : [false, true]
    }, {
      title  : 'Pot.isHash()',
      code   : function() {
        var hash = new Hash();
        var obj = {};
        return [isHash(hash), isHash(obj)];
      },
      expect : [true, false]
    }, {
      title  : 'Pot.isJSEscaped()',
      code   : function() {
        return [
          isJSEscaped('abc'),
          isJSEscaped('abc\\hoge".'),
          isJSEscaped('\\u007b\\x20hoge\\x20\\u007d')
        ];
      },
      expect : [true, false, true]
    }, {
      title  : 'Pot.isPercentEncoded()',
      code   : function() {
        return [
          isPercentEncoded('abc'),
          isPercentEncoded('abc["hoge"]'),
          isPercentEncoded('%7B%20hoge%20%7D')
        ];
      },
      expect : [true, false, true]
    }, {
      title  : 'Pot.isHTMLEscaped()',
      code   : function() {
        return [
          isHTMLEscaped('abc'),
          isHTMLEscaped('1 < 2'),
          isHTMLEscaped('&quot;(&gt;_&lt;)&quot;')
        ];
      },
      expect : [true, false, true]
    }, {
      title  : 'Pot.isNumeric()',
      code   : function() {
        return [
          isNumeric(123),
          isNumeric('1e8'),
          isNumeric('10px')
        ];
      },
      expect : [true, true, false]
    }, {
      title  : 'Pot.isInt()',
      code   : function() {
        return [
          isInt(0.1205562),
          isInt(1.5),
          isInt(12345)
        ];
      },
      expect : [false, false, true]
    }, {
      title  : 'Pot.isBuiltinMethod()',
      code   : function() {
        return [
          isBuiltinMethod((function() {})),
          isBuiltinMethod(Array.prototype.slice)
        ];
      },
      expect : [false, true]
    }, {
      title  : 'Pot.isWindow()',
      code   : function() {
        return [
          isWindow(window),
          isWindow(document),
          isWindow(document.body)
        ];
      },
      expect : [true, false, false]
    }, {
      title  : 'Pot.isDocument()',
      code   : function() {
        return [
          isDocument(window),
          isDocument(document),
          isDocument(document.body)
        ];
      },
      expect : [false, true, false]
    }, {
      title  : 'Pot.isElement()',
      code   : function() {
        return [
          isElement(window),
          isElement(document),
          isElement(document.body)
        ];
      },
      expect : [false, false, true]
    }, {
      title  : 'Pot.isNodeLike()',
      code   : function() {
        return [
          isNodeLike({foo: 1, bar: 2, baz: 3}),
          isNodeLike('hoge'),
          isNodeLike(window),
          isNodeLike(document),
          isNodeLike(document.body),
          isNodeLike(document.getElementsByTagName('div')),
        ];
      },
      expect : [false, false, false, true, true, false]
    }, {
      title  : 'Pot.isNodeList()',
      code   : function() {
        var obj = new Array({foo: 1, bar: 2, baz: 3});
        var nodes = document.getElementsByTagName('div');
        return [
          isNodeList(obj),
          isNodeList(nodes)
        ];
      },
      expect : [false, true]
    }, {
      title  : 'Pot.isDOMLike()',
      code   : function() {
        return [
          isDOMLike({foo: 1, bar: 2, baz: 3}),
          isDOMLike('hoge'),
          isDOMLike(window),
          isDOMLike(document),
          isDOMLike(document.body),
          isDOMLike(document.getElementsByTagName('div')),
          isDOMLike(document.createTextNode('hoge'))
        ];
      },
      expect : [false, false, true, true, true, true, true]
    }, {
      title  : 'Pot.currentWindow()',
      code   : function() {
        return (window === Pot.currentWindow());
      },
      expect : true
    }, {
      title  : 'Pot.currentDocument()',
      code   : function() {
        return (document === Pot.currentDocument());
      },
      expect : true
    }, {
      title  : 'Pot.currentURI()',
      code   : function() {
        return (document.URL == Pot.currentURI());
      },
      expect : true
    }, {
      title  : 'Pot.globalEval()',
      code   : function() {
        globalEval(
          'var Pot__globalEval__testvar = 2;' +
          'Pot.tmp.__globalEval__testvar = 2;'
        );
        var result = (window.Pot__globalEval__testvar === 2 &&
                      Pot.tmp.__globalEval__testvar  === 2);
        try {
          delete Pot.tmp.__globalEval__testvar;
          delete window.Pot__globalEval__testvar;
        } catch (e) {}
        return result;
      },
      expect : true
    }, {
      title  : 'Pot.localEval()',
      code   : function() {
        localEval(
          'var Pot__localEval__testvar = 2;' +
          'Pot.tmp.__localEval__testvar = 2;'
        );
        var result = (window.Pot__localEval__testvar !== 2 &&
                      Pot.tmp.__localEval__testvar  === 2);
        try {
          delete Pot.tmp.__localEval__testvar;
          delete window.Pot__localEval__testvar;
        } catch (e) {}
        return result;
      },
      expect : true
    }, {
      title  : 'Pot.getFunctionCode()',
      code   : function() {
        return [
          getFunctionCode(function() { return 'hoge'; }).replace(/^\s*[(]+\s*|\s*[)]+\s*$/g, ''),
          getFunctionCode('function() { return 1; }'),
          getFunctionCode(1),
          getFunctionCode(false),
          getFunctionCode(true),
          getFunctionCode(null),
          getFunctionCode(void 0),
          getFunctionCode({}),
          getFunctionCode(new Function('return 1')).replace(/^\s*[(]+\s*|\s*[)]+\s*$/g, '')
        ];
      },
      expect : [
        (function() { return 'hoge'; }).toString().replace(/^\s*[(]+\s*|\s*[)]+\s*$/g, ''),
        'function() { return 1; }',
        '',
        '',
        '',
        '',
        '',
        '',
        (new Function('return 1')).toString().replace(/^\s*[(]+\s*|\s*[)]+\s*$/g, '')
      ]
    }, {
      title  : 'Pot.isWords()',
      code   : function() {
        return [
          isWords(' '),
          isWords('abc'),
          isWords('ほげ'),
          isWords('\r\n'),
          isWords(' \n'),
          isWords(' abc'),
          isWords('abc '),
          isWords('_'),
          isWords(false),
          isWords(true),
          isWords(void 0),
          isWords({}),
          isWords(['ABC']),
          isWords('$hoge'),
          isWords('$_')
        ];
      },
      expect : [
        false,
        true,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        true
      ]
    }, {
      title  : 'Pot.isNL()',
      code   : function() {
        return [
          isNL('abc'),
          isNL(' '),
          isNL('\n'),
          isNL('\r'),
          isNL('\r\n'),
          isNL('\nhoge'),
          isNL('\r \n'),
          isNL('\r\n\r\n'),
          isNL('\u2028\u2029'),
          isNL(null),
          isNL(void 0),
          isNL(false),
          isNL(true),
          isNL(new String('\n')),
          isNL({}),
          isNL(['\n'])
        ];
      },
      expect : [
        false,
        false,
        true,
        true,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false
      ]
    }, {
      title  : 'Pot.tokenize()',
      code   : function() {
        var hoge = function() {
          var a = 1, b = 0.5, c = String(1), $d = /'\/'/g;
          return $d.test(c) ? a : b;
        };
        return tokenize(hoge);
      },
      expect : [
        'function', '(', ')', '{', '\n',
          'var', 'a', '=', '1', ',', 'b', '=', '0.5', ',',
                 'c', '=', 'String', '(', '1', ')', ',',
                 '$d', '=', '/\'\\/\'/g', ';', '\n',
          'return', '$d', '.', 'test', '(', 'c', ')', '?',
                    'a', ':', 'b', ';', '\n',
        '}'
      ]
    }, {
      title  : 'Pot.joinTokens()',
      code   : function() {
        var hoge = function() {
          var a = 1, b = 0.5, c = String(1), $d = /'\/'/g;
          return $d.test(c) ? a : b;
        };
        return joinTokens(tokenize(hoge));
      },
      expect : 'function(){\n' +
        'var a=1,b=0.5,c=String(1),$d=/\'\\/\'/g;\n' +
        'return $d.test(c)?a:b;\n' +
      '}'
    }, {
      title  : 'Pot.hasReturn()',
      code   : function() {
        return [
          hasReturn(function() {
            return 'hoge';
          }),
          hasReturn(function() {
            var hoge = 1;
          }),
          hasReturn(function return_test(return1, return$2) {
            /* dummy comment: return 'hoge'; */
            var $return = 'return(1)' ? (function(a) {
              if (a) {
                return true;
              }
              return false;
            })(/return true/) : "return false";
          }),
          hasReturn(function() {
            if (1) {
              return (function() {
                return 'hoge';
              })();
            }
          })
        ];
      },
      expect : [true, false, false, true]
    }, {
      title  : 'Pot.override()',
      code   : function() {
        var results = [];
        var Hoge = {
          addHoge : function(value) {
            return value + 'hoge';
          }
        };
        results.push(Hoge.addHoge('fugafuga'));
        override(Hoge, 'addHoge', function(inherits, args) {
          var value = args[0];
          var modify = '{{Modified:' + value + '}}';
          args[0] = '';
          return modify + inherits(args);
        });
        results.push(Hoge.addHoge('fugafuga'));
        return results;
      },
      expect : ['fugafugahoge', '{{Modified:fugafuga}}hoge']
    }, {
      title  : 'Pot.getErrorMessage()',
      code   : function() {
        return getErrorMessage(new Error('ErrorMessage'));
      },
      expect : 'ErrorMessage'
    }, {
      title  : 'Pot.Plugin methods',
      code   : function() {
        var results = [];
        addPlugin('myFunc', function(msg) {
          return 'myFunc: ' + msg;
        });
        results.push(Pot.myFunc('Hello!'));
        results.push(hasPlugin('myFunc'));
        addPlugin('myFunc2', function(a, b) {
          return a + b;
        });
        results.push(Pot.myFunc2(1, 2));
        results.push(addPlugin('myFunc', function() {}));
        results.push(listPlugin());
        results.push(removePlugin('myFunc'));
        results.push(hasPlugin('myFunc'));
        results.push(listPlugin());
        return results;
      },
      expect : [
        'myFunc: Hello!',
        true,
        3,
        false,
        ['myFunc', 'myFunc2'],
        true,
        false,
        ['myFunc2']
      ]
    }, {
      title  : 'Pot.addPlugin() overwrite',
      code   : function() {
        var results = [];
        addPlugin({
          foo : function() { return 'foo!'; },
          bar : function() { return 'bar!'; },
          baz : function() { return 'baz!'; }
        });
        results.push(Pot.foo() + Pot.bar() + Pot.baz());
        addPlugin('hoge', function() { return 'hoge!'; });
        var newHoge = function() { return 'NewHoge!' };
        results.push(addPlugin('hoge', newHoge));
        results.push(addPlugin('hoge', newHoge, true));
        results.push(Pot.hoge());
        return results;
      },
      expect : [
        'foo!bar!baz!',
        false,
        true,
        'NewHoge!'
      ]
    }, {
      title  : 'Pot.addPlugin() using deferred method',
      code   : function() {
        var toArray = function(string) {
          return string.split('');
        };
        Pot.addPlugin('myToArray', toArray);
        var results = [];
        results.push(Pot.myToArray('abc'));
        return Pot.myToArray.deferred('abc').then(function(res) {
          results.push(res);
          return results;
        });
      },
      expect : [
        ['a', 'b', 'c'],
        ['a', 'b', 'c']
      ]
    }, {
      title  : 'Pot.addPlugin() and Pot.removePlugin()',
      code   : function() {
        var results = [];
        var string = '\t abc\n \t ';
        results.push(Pot.trim(string));
        addPlugin('trim', function(s) {
          return s.replace(/^ +| +$/g, '');
        });
        results.push(Pot.trim(string));
        removePlugin('trim');
        results.push(Pot.trim(string));
        return results;
      },
      expect : [
        'abc',
        '\t abc\n \t',
        'abc'
      ]
    }, {
      title  : 'Pot.range()',
      code   : function() {
        return [
          range(1, 5),
          range('a', 'f'),
          range({begin: 0, end: 100, step: 25})
        ];
      },
      expect : [
        [1, 2, 3, 4, 5],
        ['a', 'b', 'c', 'd', 'e', 'f'],
        [0, 25, 50, 75, 100]
      ]
    }, {
      title  : 'Pot.indexOf()',
      code   : function() {
        var arr = [2, 5, 9];
        var obj = {a: 2, b: 5, c: 9};
        return [
          indexOf(arr, 2),
          indexOf(arr, 7),
          indexOf(obj, 2),
          indexOf(obj, 7)
        ];
      },
      expect : [0, -1, 'a', -1]
    }, {
      title  : 'Pot.lastIndexOf()',
      code   : function() {
        var arr = [2, 5, 9, 2];
        var obj = {a: 2, b: 5, c: 9, d: 2};
        return [
          lastIndexOf(arr, 2),
          lastIndexOf(arr, 7),
          lastIndexOf(arr, 2, 3),
          lastIndexOf(arr, 2, 2),
          lastIndexOf(arr, 2, -2),
          lastIndexOf(obj, 2),
          lastIndexOf(obj, 7),
          lastIndexOf(obj, 2, 'd'),
          lastIndexOf(obj, 2, 'c')
        ];
      },
      expect : [3, -1, 3, 0, 0, 'd', -1, 'd', 'a']
    }, {
      title  : 'Pot.request() and Deferred chain',
      code   : function() {
        return request('./pot.test.json', {
          mimeType : 'text/javascript'
        }).then(function(res) {
          return res.responseText;
        }, function(err) {
          return err;
        });
      },
      expect : ['{' +
        '"foo":"FOO\\u0020\\"1\\""',
        '"bar":"BAR\\u0020\\"2\\""',
        '"baz":"BAZ\\u0020\\"3\\""' +
      '}'].join(',')
    }, {
      title  : 'Pot.jsonp() and Deferred chain',
      code   : function() {
        var url = 'http://api.polygonpla.net/js/pot/pot.test.json?callback=?';
        return jsonp(url).then(function(data) {
          return data.foo;
        });
      },
      expect : 'FOO "1"'
    }, {
      title  : 'Pot.getJSON()',
      code   : function() {
        var url = './pot.test.json';
        return getJSON(url).then(function(data) {
          return data.foo;
        });
      },
      expect : 'FOO "1"'
    }, {
      title  : 'Pot.serializeToJSON()',
      code   : function() {
        var obj = {foo: '"1"', bar: 2, baz: null};
        return serializeToJSON(obj);
      },
      expect : '{"foo":"\\"1\\"","bar":2,"baz":null}'
    }, {
      title  : 'Pot.parseFromJSON()',
      code   : function() {
        var data = '{"foo":"FOO\\u0020\\"1\\"","bar":2,"baz":null}';
        return parseFromJSON(data);
      },
      expect : {foo: 'FOO "1"', bar: 2, baz: null}
    }, {
      title  : 'Pot.serializeToQueryString()',
      code   : function() {
        var obj = {foo: 1, bar: 'bar2', baz: null}
        return serializeToQueryString(obj);
      },
      expect : 'foo=1&bar=bar2&baz='
    }, {
      title  : 'Pot.serializeToQueryString() for Array',
      code   : function() {
        var obj = {foo: 'bar', baz: ['qux', 'quux'], corge: ''};
        return serializeToQueryString(obj);
      },
      expect : 'foo=bar&baz%5B%5D=qux&baz%5B%5D=quux&corge='
    }, {
      title  : 'Pot.parseFromQueryString()',
      code   : function() {
        var queryString = 'foo=1&bar=bar2&baz=%7B3%7D';
        return parseFromQueryString(queryString, true);
      },
      expect : {foo: '1', bar: 'bar2', baz: '{3}'}
    }, {
      title  : 'Pot.parseFromQueryString() for Array',
      code   : function() {
        var queryString = 'foo=bar&baz[]=qux&baz[]=quux&corge=';
        return parseFromQueryString(queryString, true);
      },
      expect : {foo: 'bar', baz: ['qux', 'quux'], corge: ''}
    }, {
      title  : 'Pot.parseFromQueryString() for Array Strict',
      code   : function() {
        var queryString = 'foo=bar&baz%5B%5D=qux&baz%5B%5D=quux&corge=';
        return parseFromQueryString(queryString, true);
      },
      expect : {foo: 'bar', baz: ['qux', 'quux'], corge: ''}
    }, {
      title  : 'Pot.parseFromQueryString() for Array with Items',
      code   : function() {
        var queryString = 'foo=bar&baz%5B%5D=qux&baz%5B%5D=quux&corge=';
        return parseFromQueryString(queryString);
      },
      expect : [['foo', 'bar'], ['baz', 'qux'], ['baz', 'quux'], ['corge', '']]
    }, {
      title  : 'Pot.urlEncode()',
      code   : function() {
        return urlEncode('(a+b)*c=?');
      },
      expect : '(a%2Bb)*c%3D%3F'
    }, {
      title  : 'Pot.urlDecode()',
      code   : function() {
        return urlDecode('(a%2Bb)*c+%3D+%3F');
      },
      expect : '(a+b)*c = ?'
    }, {
      title  : 'Pot.parseURI()',
      code   : function() {
        return parseURI(
          'http://user:pass@host:8000/path/to/file.ext?arg=value#fragment'
        );
      },
      expect : {
        protocol  : 'http:',
        scheme    : 'http',
        userinfo  : 'user:pass',
        username  : 'user',
        password  : 'pass',
        host      : 'host:8000',
        hostname  : 'host',
        port      : '8000',
        pathname  : '/path/to/file.ext',
        dirname   : '/path/to',
        filename  : 'file.ext',
        extension : 'ext',
        search    : '?arg=value',
        query     : 'arg=value',
        hash      : '#fragment',
        fragment  : 'fragment'
      }
    }, {
      title  : 'Pot.buildURI()',
      code   : function() {
        return [
          buildURI('http://www.example.com/', {
            foo : '{foo}',
            bar : '{bar}'
          }),
          buildURI('http://www.example.com/test?a=1', [
            ['prototype',    '{foo}'],
            ['__iterator__', '{bar}'],
          ]),
          buildURI('http://www.example.com/test?a=1', 'b=2&c=3'),
          buildURI({
            protocol : 'http:',
            username : 'user',
            password : 'pass',
            hostname : 'www.example.com',
            port     : 8000,
            pathname : '/path/to/file.ext',
            query    : {
              arg1   : 'v1',
              arg2   : 'v#2'
            },
            hash     : 'a'
          }),
          buildURI(parseURI('http://user:pass@host:8000/path/to/file.ext?arg=value#fragment')),
          buildURI({
            protocol : 'file:',
            pathname : 'C:\\path\\to\\file.ext',
            query    : {
              arg1   : 'value#1',
              arg2   : 'value#2'
            },
            hash     : '#fragment'
          })
        ];
      },
      expect : [
        'http://www.example.com/?foo=%7Bfoo%7D&bar=%7Bbar%7D',
        'http://www.example.com/test?a=1&prototype=%7Bfoo%7D&__iterator__=%7Bbar%7D',
        'http://www.example.com/test?a=1&b=2&c=3',
        'http://user:pass@www.example.com:8000/path/to/file.ext?arg1=v1&arg2=v%232#a',
        'http://user:pass@host:8000/path/to/file.ext?arg=value#fragment',
        'file:///C:\\path\\to\\file.ext?arg1=value%231&arg2=value%232#fragment'
      ]
    }, {
      title  : 'Pot.resolveRelativeURI()',
      code   : function() {
        var results = [];
        results.push(resolveRelativeURI(
          'C:/path/to/foo/bar/../hoge.ext'
        ));
        results.push(resolveRelativeURI(
          'C:/path/to/../../hoge.ext'
        ));
        results.push(resolveRelativeURI(
          'C:/path/to/../../../../././../../hoge.ext'
        ));
        results.push(resolveRelativeURI(
          '/usr/local/bin/../././hoge.ext'
        ));
        return results;
      },
      expect : [
        'C:/path/to/foo/hoge.ext',
        'C:/hoge.ext',
        'C:/hoge.ext',
        '/usr/local/hoge.ext'
      ]
    }, {
      title  : 'Pot.getExt()',
      code   : function() {
        return [
          getExt('foo.html'),
          getExt('C:\\foo\\bar\\baz.tmp.txt'),
          getExt('http://www.example.com/file.html?q=hoge.js'),
          getExt('http://www.example.com/?output=hoge.xml#fuga.piyo'),
          getExt('http://www.example.com/?q=hoge'),
          getExt('http://www.example.com/http%3A%2F%2Fwww.example.com%2Ffoo%2Ejs')
        ];
      },
      expect : [
        'html', 'txt', 'html', 'xml', '', 'js'
      ]
    }, {
      title  : 'Pot.toDataURI()',
      code   : function() {
        return [
          toDataURI('Hello World!', 'text/plain', false, 'UTF-8', false),
          toDataURI('Hello World!', 'text/plain', true, 'UTF-8', false),
          toDataURI({
            data     : 'Hello World!',
            mimeType : 'html',
            base64   : true
          }),
          toDataURI({
            data     : 'SGVsbG8gV29ybGQh',
            mimeType : 'txt',
            base64   : true,
            encoded  : true
          })
        ];
      },
      expect : [
        'data:text/plain;charset=UTF-8,Hello%20World!',
        'data:text/plain;charset=UTF-8;base64,SGVsbG8gV29ybGQh',
        'data:text/html;base64,SGVsbG8gV29ybGQh',
        'data:text/plain;base64,SGVsbG8gV29ybGQh'
      ]
    }, {
      title  : 'Pot.forEach() with Array',
      code   : function() {
        var s = '';
        forEach([1, 2, 3], function(val, i, array) {
          s += val;
        });
        return s;
      },
      expect : '123'
    }, {
      title  : 'Pot.forEach() with Object',
      code   : function() {
        var s = '';
        forEach({foo: 1, bar: 2, baz: 3}, function(val, key, obj) {
          s += key + val + ';';
        });
        return s;
      },
      expect : 'foo1;bar2;baz3;'
    }, {
      title  : 'Pot.Deferred.forEach() with Array',
      code   : function() {
        var s = '';
        return Deferred.forEach([1, 2, 3], function(val, i) {
          s += val;
        }).then(function() {
          return s;
        });
      },
      expect : '123'
    }, {
      title  : 'Pot.Deferred.forEach() with Object',
      code   : function() {
        var s = '';
        return Deferred.forEach({foo: 1, bar: 2, baz: 3}, function(val, key) {
          s += key + val + ';';
        }).then(function() {
          return s;
        });
      },
      expect : 'foo1;bar2;baz3;'
    }, {
      title  : 'Pot.Deferred.forEach() with Array on chain',
      code   : function() {
        var s = '';
        var d = new Deferred();
        return d.forEach(function(val, i) {
          s += val;
        }).then(function() {
          return s;
        }).begin([1, 2, 3]);
      },
      expect : '123'
    }, {
      title  : 'Pot.Deferred.forEach() with Object on chain',
      code   : function() {
        var s = '';
        var d = new Deferred();
        return d.forEach(function(val, key) {
          s += key + val + ';';
        }).then(function() {
          return s;
        }).begin({foo: 1, bar: 2, baz: 3});
      },
      expect : 'foo1;bar2;baz3;'
    }, {
      title  : 'Pot.repeat() with Number',
      code   : function() {
        var a = [];
        repeat(10, function(i) {
          a.push(i);
        });
        return a;
      },
      expect : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {
      title  : 'Pot.repeat() with Object',
      code   : function() {
        var a = [];
        repeat({begin: 0, end: 100, step: 20}, function(i) {
          a.push(i);
        });
        return a;
      },
      expect : [0, 20, 40, 60, 80]
    }, {
      title  : 'Pot.Deferred.repeat() with Number',
      code   : function() {
        var a = [];
        return Deferred.repeat(10, function(i) {
          a.push(i);
        }).then(function() {
          return a;
        });
      },
      expect : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {
      title  : 'Pot.Deferred.repeat() with Object',
      code   : function() {
        var a = [];
        return Deferred.repeat({begin: 0, end: 100, step: 20}, function(i) {
          a.push(i);
        }).then(function() {
          return a;
        });
      },
      expect : [0, 20, 40, 60, 80]
    }, {
      title  : 'Pot.Deferred.repeat() with Number on chain',
      code   : function() {
        var a = [];
        var d = new Deferred();
        return d.repeat(function(i) {
          a.push(i);
        }).then(function() {
          return a;
        }).begin(10);
      },
      expect : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {
      title  : 'Pot.Deferred.repeat() with Object on chain',
      code   : function() {
        var a = [];
        var d = new Deferred();
        return d.repeat(function(i) {
          a.push(i);
        }).then(function() {
          return a;
        }).begin({begin: 0, end: 100, step: 20});
      },
      expect : [0, 20, 40, 60, 80]
    }, {
      title  : 'Pot.forEver()',
      code   : function() {
        var s = '';
        var a = 'abc*';
        forEver(function(i) {
          s += i + ':' + a;
          if (s.length > 50) {
            throw StopIteration;
          }
        });
        return s;
      },
      expect : '0:abc*1:abc*2:abc*3:abc*4:abc*5:abc*6:abc*7:abc*8:abc*'
    }, {
      title  : 'Pot.Deferred.forEver()',
      code   : function() {
        var s = '';
        var a = 'abc*';
        return Deferred.forEver(function(i) {
          s += i + ':' + a;
          if (s.length > 50) {
            throw StopIteration;
          }
        }).then(function() {
          return s;
        });
      },
      expect : '0:abc*1:abc*2:abc*3:abc*4:abc*5:abc*6:abc*7:abc*8:abc*'
    }, {
      title  : 'Pot.Deferred.forEver() on chain',
      code   : function() {
        var s = '';
        var a = 'abc*';
        var d = new Deferred();
        return d.forEver(function(i) {
          s += i + ':' + a;
          if (s.length > 50) {
            throw StopIteration;
          }
        }).then(function() {
          return s;
        }).begin();
      },
      expect : '0:abc*1:abc*2:abc*3:abc*4:abc*5:abc*6:abc*7:abc*8:abc*'
    }, {
      title  : 'Pot.iterate()',
      code   : function() {
        var results = [];
        var iter = new Iter();
        iter.next = (function() {
          var i = 0;
          var end = 10;
          return function() {
            if (i >= end) {
              throw StopIteration;
            }
            return i++;
          };
        })();
        iterate(iter, function(i) {
          results.push(i);
        });
        return results;
      },
      expect : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {
      title  : 'Pot.Deferred.iterate()',
      code   : function() {
        var results = [];
        var iter = new Iter();
        iter.next = (function() {
          var i = 0;
          var end = 10;
          return function() {
            if (i >= end) {
              throw StopIteration;
            }
            return i++;
          };
        })();
        return Deferred.iterate(iter, function(i) {
          results.push(i);
        }).then(function() {
          return results;
        });
      },
      expect : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {
      title  : 'Pot.Deferred.iterate() on chain',
      code   : function() {
        var results = [];
        var iter = new Iter();
        iter.next = (function() {
          var i = 0;
          var end = 10;
          return function() {
            if (i >= end) {
              throw StopIteration;
            }
            return i++;
          };
        })();
        var d = new Deferred();
        return d.iterate(function(i) {
          results.push(i);
        }).then(function() {
          return results;
        }).begin(iter);
      },
      expect : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {
      title  : 'Pot.toIter()',
      code   : function() {
        var arr = [1, 2, 3, 4, 5];
        var iter = toIter(arr);
        var results = [];
        Pot.iterate(iter, function(i) {
          results.push(i * 100);
        });
        return results.join('+');
      },
      expect : '100+200+300+400+500'
    }, {
      title  : 'Pot.items() with Array',
      code   : function() {
        return items(['foo', 'bar', 'baz']);
      },
      expect : [[0, 'foo'], [1, 'bar'], [2, 'baz']]
    }, {
      title  : 'Pot.items() with Object',
      code   : function() {
        return items({foo: 1, bar: 2, baz: 3});
      },
      expect : [['foo', 1], ['bar', 2], ['baz', 3]]
    }, {
      title  : 'Pot.Deferred.items() with Array',
      code   : function() {
        return Deferred.items(['foo', 'bar', 'baz']);
      },
      expect : [[0, 'foo'], [1, 'bar'], [2, 'baz']]
    }, {
      title  : 'Pot.Deferred.items() with Object',
      code   : function() {
        return Deferred.items({foo: 1, bar: 2, baz: 3});
      },
      expect : [['foo', 1], ['bar', 2], ['baz', 3]]
    }, {
      title  : 'Pot.Deferred.items() with Array on chain',
      code   : function() {
        var d = new Deferred();
        return d.items().begin(['foo', 'bar', 'baz']);
      },
      expect : [[0, 'foo'], [1, 'bar'], [2, 'baz']]
    }, {
      title  : 'Pot.Deferred.items() with Object on chain',
      code   : function() {
        var d = new Deferred();
        return d.items().begin({foo: 1, bar: 2, baz: 3});
      },
      expect : [['foo', 1], ['bar', 2], ['baz', 3]]
    }, {
      title  : 'Pot.items() with callback',
      code   : function() {
        return items({foo: 1, bar: 2, baz: 3}, function(item) {
          return [item[0] + '::' + item[1]];
        });
      },
      expect : [['foo::1'], ['bar::2'], ['baz::3']]
    }, {
      title  : 'Pot.Deferred.items() with callback',
      code   : function() {
        return Deferred.items({foo: 1, bar: 2, baz: 3}, function(item) {
          return [item[0] + '::' + item[1]];
        });
      },
      expect : [['foo::1'], ['bar::2'], ['baz::3']]
    }, {
      title  : 'Pot.Deferred.items() with callback on chain',
      code   : function() {
        var d = new Deferred();
        return d.items(function(item) {
          return [item[0] + '::' + item[1]];
        }).begin({foo: 1, bar: 2, baz: 3});
      },
      expect : [['foo::1'], ['bar::2'], ['baz::3']]
    }, {
      title  : 'Pot.zip()',
      code   : function() {
        return zip([[1, 2, 3], [4, 5, 6]]);
      },
      expect : [[1, 4], [2, 5], [3, 6]]
    }, {
      title  : 'Pot.zip() for other length',
      code   : function() {
        return zip([[1, 2, 3], [1, 2, 3, 4, 5]]);
      },
      expect : [[1, 1], [2, 2], [3, 3]]
    }, {
      title  : 'Pot.zip() with callback',
      code   : function() {
        return zip([[1, 2, 3], [4, 5, 6]], function(items) {
          return items[0] + items[1];
        });
      },
      expect : [5, 7, 9]
    }, {
      title  : 'Pot.Deferred.zip()',
      code   : function() {
        return Deferred.zip([[1, 2, 3], [4, 5, 6]]);
      },
      expect : [[1, 4], [2, 5], [3, 6]]
    }, {
      title  : 'Pot.Deferred.zip() with callback',
      code   : function() {
        return zip([[1, 2, 3], [4, 5, 6]], function(items) {
          return items[0] + items[1];
        });
      },
      expect : [5, 7, 9]
    }, {
      title  : 'Pot.Deferred.zip() on chain',
      code   : function() {
        var d = new Deferred();
        return d.zip().begin([[1, 2, 3], [4, 5, 6]]);
      },
      expect : [[1, 4], [2, 5], [3, 6]]
    }, {
      title  : 'Pot.Deferred.zip() with callback on chain',
      code   : function() {
        var d = new Deferred();
        return d.zip(function(items) {
          return items[0] + items[1];
        }).begin([[1, 2, 3], [4, 5, 6]]);
      },
      expect : [5, 7, 9]
    }, {
      title  : 'Pot.map() with Array',
      code   : function() {
        var words = ['foot', 'goose', 'moose'];
        return map(words, function(val) {
          return val.replace(/o/g, 'e');
        });
      },
      expect : ['feet', 'geese', 'meese']
    }, {
      title  : 'Pot.map() with Object',
      code   : function() {
        var words = {A: 'foot', B: 'goose', C: 'moose'};
        return map(words, function(val) {
          return val.replace(/o/g, 'e');
        });
      },
      expect : {A: 'feet', B: 'geese', C: 'meese'}
    }, {
      title  : 'Pot.Deferred.map() with Array',
      code   : function() {
        var words = ['foot', 'goose', 'moose'];
        return Deferred.map(words, function(val) {
          return val.replace(/o/g, 'e');
        });
      },
      expect : ['feet', 'geese', 'meese']
    }, {
      title  : 'Pot.Deferred.map() with Object',
      code   : function() {
        var words = {A: 'foot', B: 'goose', C: 'moose'};
        return Deferred.map(words, function(val) {
          return val.replace(/o/g, 'e');
        });
      },
      expect : {A: 'feet', B: 'geese', C: 'meese'}
    }, {
      title  : 'Pot.Deferred.map() with Array on chain',
      code   : function() {
        var words = ['foot', 'goose', 'moose'];
        var d = new Deferred();
        return d.map(function(val) {
          return val.replace(/o/g, 'e');
        }).begin(words);
      },
      expect : ['feet', 'geese', 'meese']
    }, {
      title  : 'Pot.Deferred.map() with Object on chain',
      code   : function() {
        var words = {A: 'foot', B: 'goose', C: 'moose'};
        var d = new Deferred();
        return d.map(function(val) {
          return val.replace(/o/g, 'e');
        }).begin(words);
      },
      expect : {A: 'feet', B: 'geese', C: 'meese'}
    }, {
      title  : 'Pot.filter() with Array',
      code   : function() {
        return filter([12, 5, 8, 130, 45], function(val) {
          return (val >= 10);
        });
      },
      expect : [12, 130, 45]
    }, {
      title  : 'Pot.filter() with Object',
      code   : function() {
        return filter({A: 12, B: 5, C: 8, D: 130, E: 45}, function(val) {
          return (val >= 10);
        });
      },
      expect : {A: 12, D: 130, E: 45}
    }, {
      title  : 'Pot.Deferred.filter() with Array',
      code   : function() {
        return Deferred.filter([12, 5, 8, 130, 45], function(val) {
          return (val >= 10);
        });
      },
      expect : [12, 130, 45]
    }, {
      title  : 'Pot.Deferred.filter() with Object',
      code   : function() {
        return Deferred.filter({A: 12, B: 5, C: 8, D: 130, E: 45}, function(val) {
          return (val >= 10);
        });
      },
      expect : {A: 12, D: 130, E: 45}
    }, {
      title  : 'Pot.Deferred.filter() with Array on chain',
      code   : function() {
        var d = new Deferred();
        return d.filter(function(val) {
          return (val >= 10);
        }).begin([12, 5, 8, 130, 45]);
      },
      expect : [12, 130, 45]
    }, {
      title  : 'Pot.Deferred.filter() with Object on chain',
      code   : function() {
        var d = new Deferred();
        return d.filter(function(val) {
          return (val >= 10);
        }).begin({A: 12, B: 5, C: 8, D: 130, E: 45});
      },
      expect : {A: 12, D: 130, E: 45}
    }, {
      title  : 'Pot.reduce() with Array',
      code   : function() {
        return reduce([1, 2, 3, 4, 5], function(a, b) {
          return a + b;
        });
      },
      expect : 15
    }, {
      title  : 'Pot.reduce() with Object',
      code   : function() {
        return reduce({A: 1, B: 2, C: 3, D: 4, E: 5}, function(a, b) {
          return a + b;
        });
      },
      expect : 15
    }, {
      title  : 'Pot.Deferred.reduce() with Array',
      code   : function() {
        return Deferred.reduce([1, 2, 3, 4, 5], function(a, b) {
          return a + b;
        });
      },
      expect : 15
    }, {
      title  : 'Pot.Deferred.reduce() with Object',
      code   : function() {
        return Deferred.reduce({A: 1, B: 2, C: 3, D: 4, E: 5}, function(a, b) {
          return a + b;
        });
      },
      expect : 15
    }, {
      title  : 'Pot.Deferred.reduce() with Array on chain',
      code   : function() {
        var d = new Deferred();
        return d.reduce(function(a, b) {
          return a + b;
        }).begin([1, 2, 3, 4, 5]);
      },
      expect : 15
    }, {
      title  : 'Pot.Deferred.reduce() with Object on chain',
      code   : function() {
        var d = new Deferred();
        return d.reduce(function(a, b) {
          return a + b;
        }).begin({A: 1, B: 2, C: 3, D: 4, E: 5});
      },
      expect : 15
    }, {
      title  : 'Pot.every() with Array',
      code   : function() {
        return every([12, 54, 18, 130, 45], function(val) {
          return (val >= 10);
        });
      },
      expect : true
    }, {
      title  : 'Pot.every() with Object',
      code   : function() {
        return every({A: 12, B: 54, C: 18, D: 130, E: 45}, function(val) {
          return (val >= 10);
        });
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.every() with Array',
      code   : function() {
        return Deferred.every([12, 54, 18, 130, 45], function(val) {
          return (val >= 10);
        });
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.every() with Object',
      code   : function() {
        return Deferred.every({A: 12, B: 54, C: 18, D: 130, E: 45}, function(val) {
          return (val >= 10);
        });
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.every() with Array on chain',
      code   : function() {
        var d = new Deferred();
        return d.every(function(val) {
          return (val >= 10);
        }).begin([12, 54, 18, 130, 45]);
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.every() with Object on chain',
      code   : function() {
        var d = new Deferred();
        return d.every(function(val) {
          return (val >= 10);
        }).begin({A: 12, B: 54, C: 18, D: 130, E: 45});
      },
      expect : true
    }, {
      title  : 'Pot.some() with Array',
      code   : function() {
        return some([12, 5, 8, 1, 5], function(val) {
          return (val >= 10);
        });
      },
      expect : true
    }, {
      title  : 'Pot.some() with Object',
      code   : function() {
        return some({A: 12, B: 5, C: 8, D: 1, E: 5}, function(val) {
          return (val >= 10);
        });
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.some() with Array',
      code   : function() {
        return Deferred.some([12, 5, 8, 1, 5], function(val) {
          return (val >= 10);
        });
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.some() with Object',
      code   : function() {
        return Deferred.some({A: 12, B: 5, C: 8, D: 1, E: 5}, function(val) {
          return (val >= 10);
        });
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.some() with Array on chain',
      code   : function() {
        var d = new Deferred();
        return d.some(function(val) {
          return (val >= 10);
        }).begin([12, 5, 8, 1, 5]);
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.some() with Object on chain',
      code   : function() {
        var d = new Deferred();
        return d.some(function(val) {
          return (val >= 10);
        }).begin({A: 12, B: 5, C: 8, D: 1, E: 5});
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.prototype.then()',
      code   : function() {
        var d = new Deferred();
        return d.then(function() {
          return 'foo';
        }).then(function(res) {
          return res + 'bar';
        }).then(function(res) {
          return res + 'baz';
        }).begin();
      },
      expect : 'foobarbaz'
    }, {
      title  : 'Pot.Deferred.prototype.rescue()',
      code   : function() {
        var d = new Deferred();
        d.then(function() {
          throw new Error('TestError');
        }).rescue(function(err) {
          return typeOf(err);
        }).then(function(res) {
          return 'Test' + res.charAt(0).toUpperCase() + res.substring(1);
        }).then(function(res) {
          return '(CatchTestError {' + res + '})';
        });
        return d.begin();
      },
      expect : '(CatchTestError {TestError})'
    }, {
      title  : 'Pot.Deferred.prototype.ensure()',
      code   : function() {
        var d = new Deferred();
        d.then(function() {
          throw 'TestError';
        }).ensure(function(err) {
          return typeOf(err);
        }).ensure(function(res) {
          return res.charAt(0).toUpperCase() + res.substring(1);
        }).ensure(function(res) {
          return 'Test' + res;
        }).ensure(function(res) {
          return '[[' + res + ']]';
        }).begin();
        return d;
      },
      expect : '[[TestError]]'
    }, {
      title  : 'Pot.Deferred.prototype.begin()',
      code   : function() {
        return (new Deferred()).then(function(val) {
          return val * 100;
        }).begin(1);
      },
      expect : 100
    }, {
      title  : 'Pot.Deferred.prototype.raise()',
      code   : function() {
        var d = new Deferred();
        return d.then(function(res) {
          return '{{' + res + '}}';
        }).raise('RaiseError');
      },
      expect : new Error('RaiseError')
    }, {
      title  : 'Pot.Deferred.prototype.end()',
      code   : function() {
        var n = 0;
        var d = new Deferred();
        d.then(function() {
          n = 1;
        }).then(function() {
          n = 2;
        }).begin();
        d.end();
        d.then(function() {
          n = 'Help me!';
        });
        return wait(1).then(function() {
          return n;
        });
      },
      expect : 2
    }, {
      title  : 'Pot.Deferred.prototype.wait()',
      code   : function() {
        var d = new Deferred();
        return d.then(function() {
          return 1;
        }).wait(1).then(function(res) {
          return res + 1;
        }).wait(1.5).then(function(res) {
          return res + 1;
        }).wait(0).then(function(res) {
          return res;
        }).begin();
      },
      expect : 3
    }, {
      title  : 'Pot.Deferred.prototype.till()',
      code   : function() {
        var d = new Pot.Deferred();
        var time, limit = 2 * 1000;
        return d.then(function() {
          time = now();
        }).till(function() {
          if (now() - time < limit) {
            return false;
          } else {
            return true;
          }
        }).then(function() {
          return 'Waited 2 seconds.';
        }).begin();
      },
      expect : 'Waited 2 seconds.'
    }, {
      title  : 'Pot.Deferred.prototype.cancel()',
      code   : function() {
        var n = 0;
        var d = new Deferred();
        d.then(function() {
          n = 1;
        }).then(function() {
          n = 2;
        });
        d.cancel();
        d.then(function() {
          n = 100;
        });
        d.begin();
        return wait(1).then(function() {
          return n;
        });
      },
      expect : 0
    }, {
      title  : 'Pot.Deferred.prototype.cancel() in chain',
      code   : function() {
        var n = 0;
        var d = new Deferred();
        d.then(function() {
          n = 1;
        }).then(function(res) {
          n = 2;
        }).then(function(res) {
          this.cancel();
        }).then(function(res) {
          n = 999;
        }).begin();
        return wait(1).then(function() {
          return n;
        });
      },
      expect : 2
    }, {
      title  : 'Pot.Deferred.prototype.canceller()',
      code   : function() {
        var r = [];
        var d = new Deferred();
        d.canceller(function() {
          r.push('canceller(1)');
        }).canceller(function() {
          r.push('canceller(2)');
        }).then(function() {
          r.push('start chain');
        });
        d.cancel();
        return wait(1).then(function() {
          return r;
        });
      },
      expect : ['canceller(1)', 'canceller(2)']
    }, {
      title  : 'Pot.Deferred.prototype.speed()',
      code   : function() {
        var d = new Deferred();
        return d.then(function() {
          return 'speed: slowest (limp)';
        }).speed('limp').then(function() {
          return 'speed: 50 ms.';
        }).speed(50).then(function() {
          return '50 ms.';
        }).then(function(res) {
          return res;
        }).begin();
      },
      expect : '50 ms.'
    }, {
      title  : 'Pot.Deferred.prototype.async() with synchronous',
      code   : function() {
        var value = null;
        var d = new Deferred();
        d.async(false).then(function() {
          return 'sync';
        }).then(function(res) {
          return res + 'hron';
        }).then(function(res) {
          return res + 'ous';
        }).then(function(res) {
          value = res;
        }).begin();
        return value;
      },
      expect : 'synchronous'
    }, {
      title  : 'Pot.Deferred.prototype.async() with asynchronous',
      code   : function() {
        var value = null;
        var d = new Deferred();
        d.async(true).then(function() {
            return 'async';
        }).then(function(res) {
            return res + 'hron';
        }).then(function(res) {
            return res + 'ous';
        }).then(function(res) {
            value = res;
        }).begin();
        return value;
      },
      expect : null
    }, {
      title  : 'Pot.Deferred.prototype.args()',
      code   : function() {
        var d = new Deferred();
        d.args('TestArgsValue').then(function(res) {
          return '[[' + res + ']]';
        }).begin();
        d.then(function(res) {
          return (this.args() === res) ? this.args() : false;
        });
        return d;
      },
      expect : '[[TestArgsValue]]'
    }, {
      title  : 'Destructuring-Assignment by Pot.Deferred.prototype.args()',
      code   : function() {
        var d = new Deferred();
        return d.args(1, 2, 3).then(function(a, b, c) {
          return a + b + c;
        }).args(['A', 'B', 'C']).then(function(a, b, c) {
          return a + b + c;
        }).begin('nop');
      },
      expect : 'ABC'
    }, {
      title  : 'Destructuring-Assignment by Pot.Deferred chain',
      code   : function() {
        var d = new Deferred();
        return d.then(function() {
          return [1, 2, 3];
        }).then(function(a, b, c) {
          return [c, b, a];
        }).then(function(res) {
          return res;
        }).begin();
      },
      expect : [3, 2, 1]
    }, {
      title  : 'Pot.Deferred.prototype.data()',
      code   : function() {
        var d = new Deferred();
        d.data({
          count : 0
        }).then(function() {
          return this.data('count') + 1;
        }).then(function(res) {
          this.data('count', res + 1);
          return this.data('count');
        }).then(function(res) {
          return this.data('count') + 1;
        });
        return d.begin();
      },
      expect : 3
    }, {
      title  : 'Pot.Deferred.succeed()',
      code   : function() {
        return succeed('foo').then(function(res) {
          return res + 'bar';
        });
      },
      expect : 'foobar'
    }, {
      title  : 'Pot.Deferred.failure()',
      code   : function() {
        return failure('TestError').then(function(res) {
          return '(success)';
        }, function(err) {
          return '(failure)';
        });
      },
      expect : '(failure)'
    }, {
      title  : 'Pot.Deferred.wait()',
      code   : function() {
        return wait(1).then(function() {
          return wait(0.5, 'foo').then(function(res) {
            return res + 'bar';
          });
        }).then(function(res) {
          return res + 'baz';
        });
      },
      expect : 'foobarbaz'
    }, {
      title  : 'Pot.Deferred.till()',
      code   : function() {
        return till(function() {
          if (document.body) {
            return true;
          } else {
            return false;
          }
        }).then(function() {
          return document.body.tagName.toLowerCase();
        });
      },
      expect : 'body'
    }, {
      title  : 'Pot.Deferred.begin()',
      code   : function() {
        return begin(function() {
          return 1;
        }).then(function(res) {
          return res + 1;
        }).then(function(res) {
          return res * 100;
        });
      },
      expect : 200
    }, {
      title  : 'Pot.Deferred.flush()',
      code   : function() {
        return flush(function() {
          var d = new Deferred();
          d.then(function() {
            return 'foo';
          });
          return flush(d).then(function(res) {
            return res + 'bar';
          }).then(function(res) {
            return flush('baz').then(function(r) {
              return res + r;
            });
          });
        }).then(function(res) {
          return '*' + res + '*';
        });
      },
      expect : '*foobarbaz*'
    }, {
      title  : 'Pot.Deferred.maybeDeferred()',
      code   : function() {
        var d = new Deferred();
        d.then(function() {
          return 'Deferred';
        });
        var value = 'Hello';
        return maybeDeferred(d).then(function(r1) {
          return maybeDeferred(value).then(function(r2) {
            var dfd = begin(function() {
              return '!';
            });
            return maybeDeferred(dfd).then(function(r3) {
              return r2 + ' ' + r1 + r3;
            });
          });
        });
      },
      expect : 'Hello Deferred!'
    }, {
      title  : 'Pot.Deferred.callLater()',
      code   : function() {
        var msg = '';
        return callLater(2, function() {
          msg = 'Called after 2 seconds.';
        }).then(function() {
          return msg;
        });
      },
      expect : 'Called after 2 seconds.'
    }, {
      title  : 'Pot.Deferred.callLazy()',
      code   : function() {
        var msg = '';
        return callLazy(function() {
          msg = 'lazy';
        }).then(function() {
          return msg;
        });
      },
      expect : 'lazy'
    }, {
      title  : 'Pot.Deferred.isFired()',
      code   : function() {
        var d = new Deferred();
        if (isFired(d)) {
          return false;
        }
        d.then(function() {
          return 'hoge';
        });
        if (isFired(d)) {
          return false;
        }
        d.begin();
        return isFired(d);
      },
      expect : true
    }, {
      title  : 'Pot.Deferred.lastResult()',
      code   : function() {
        var d = new Deferred({ async : false });
        d.then(function() {
          return 'foo';
        }).then(function(res) {
          return 'bar';
        }).then(function(res) {
          return 'baz';
        }).begin();
        return lastResult(d);
      },
      expect : 'baz'
    }, {
      title  : 'Pot.Deferred.lastError()',
      code   : function() {
        var d = new Deferred({ async : false });
        d.then(function() {
          throw new Error('Error(1)');
        }).then(function(res) {
          throw new Error('Error(2)');
        }).then(function(res) {
          throw new Error('Error(3)');
        }).begin();
        return lastError(d);
      },
      expect : new Error('Error(1)')
    }, {
      title  : 'Pot.Deferred.register()',
      code   : function() {
        register('add', function(args) {
          return args.inputs[0] + args.results[0];
        });
        var d = new Pot.Deferred();
        d.then(function() {
          return 100;
        }).add(50).then(function(res) {
          return res;
        });
        d.begin();
        return d;
      },
      expect : 150
    }, {
      title  : 'Pot.Deferred.unregister()',
      code   : function() {
        register('add', function(args) {
          return args.inputs[0] + args.results[0];
        });
        var d = new Pot.Deferred();
        return d.then(function() {
          return 100;
        }).add(50).then(function(res) {
          unregister('add');
          var dfd = new Deferred();
          return [dfd.add, res];
        }).begin();
      },
      expect : [(void 0), 150]
    }, {
      title  : 'Pot.Deferred.deferrize() for asynchronous function',
      code   : function() {
        var timer = deferrize(window, 'setTimeout');
        var msg = '[Begin timer]';
        return timer(function() {
          msg += 'in timer (1000 ms.)';
        }, 1000).then(function() {
          msg += '[End timer]';
        }).then(function() {
          return msg;
        });
      },
      expect : '[Begin timer]in timer (1000 ms.)[End timer]'
    }, {
      title  : 'Pot.Deferred.deferrize() for synchronous function',
      code   : function() {
        var toCharCode = deferrize(function(string) {
          var chars = [], i, len = string.length;
          for (i = 0; i < len; i++) {
            chars.push(string.charCodeAt(i));
          }
          return chars;
        });
        var string = 'abcdef';
        return begin(function() {
          return toCharCode(string).then(function(result) {
            return result;
          });
        });
      },
      expect : [97, 98, 99, 100, 101, 102]
    }, {
      title  : 'Pot.Deferred.deferreed() with for statement',
      code   : function() {
        var toCharCode = function(string) {
          var result = [];
          for (var i = 0; i < string.length; i++) {
            result.push(string.charCodeAt(i));
          }
          return result;
        };
        var toCharCodeDefer = deferreed(toCharCode);
        return toCharCodeDefer.fast('abc').then(function(res) {
          return res;
        });
      },
      expect : [97, 98, 99]
    }, {
      title  : 'Pot.Deferred.deferreed() with do-while statement',
      code   : function() {
        var TinyLz77 = {
          compress : function(s) {
            var a = 53300, b, c, d, e, f, g = -1,
                h, i, r = [], x = String.fromCharCode;
            if (!s) {
              return '';
            }
            s = new Array(a--).join(' ') + s;
            while ((b = s.substr(a, 256))) {
              for (c = 2, i = b.length; c <= i; ++c) {
                d = s.substring(
                    a - 52275,
                    a + c - 1
                ).lastIndexOf(b.substring(0, c));
                if (!~d) {
                  break;
                }
                e = d;
              }
              if (c === 2 || c === 3 && f === g) {
                f = g;
                h = s.charCodeAt(a++);
                r.push(
                    x(h >> 8 & 255),
                    x(h & 255)
                );
              } else {
                r.push(
                    x((e >> 8 & 255) | 65280),
                    x(e & 255),
                    x(c - 3)
                );
                a += c - 1;
              }
            }
            return r.join('');
          },
          decompress : function(s) {
            var a = 53300, b = 0, c, d, e, f, g,
                h, r = new Array(a--).join(' '),
                x = String.fromCharCode;
            if (s && s.length) {
              do {
                c = s.charCodeAt(b++);
                if (c <= 255) {
                  r += x((c << 8) | s.charCodeAt(b++));
                } else {
                  e = ((c & 255) << 8) | s.charCodeAt(b++);
                  f = e + s.charCodeAt(b++) + 2;
                  h = r.slice(-52275);
                  g = h.substring(e, f);
                  if (g) {
                    while (h.length < f) {
                      h += g;
                    }
                    r += h.substring(e, f);
                  }
                }
              } while (b < s.length);
            }
            return r.slice(a);
          }
        };
        var compressDefer   = deferreed(TinyLz77, 'compress');
        var decompressDefer = deferreed(TinyLz77, 'decompress');
        var string = 'foooooooooo baaaaaaaaaaaaar baaaaaaazzzzzzzzzzzz';
        var results = [];
        results.push(string.length);
        return compressDefer(string).then(function(res) {
          results.push(res.length);
          return decompressDefer(res).then(function(res) {
            results.push(res.length);
            return results;
          });
        });
      },
      expect : [48, 26, 48]
    }, {
      title  : 'Pot.Deferred.parallel() with Array',
      code   : function() {
        return parallel([
          begin(function() {
            return 'foo';
          }),
          function() {
            return succeed().then(function() {
              return wait(1).then(function() {
                return 'bar';
              });
            });
          },
          (new Deferred()).then(function() {
            return 'baz';
          })
        ]).then(function(values) {
          return values;
        });
      },
      expect : ['foo', 'bar', 'baz']
    }, {
      title  : 'Pot.Deferred.parallel() with Object',
      code   : function() {
        return parallel({
          foo : function() {
            return 1;
          },
          bar : (new Deferred()).then(function() {
            return begin(function() {
              return wait(1).then(function() {
                return succeed(2);
              });
            });
          }),
          baz : function() {
            var d = new Deferred();
            return d.async(false).then(function() {
              return 3;
            });
          }
        }).then(function(values) {
          return values;
        });
      },
      expect : {foo: 1, baz: 3, bar: 2}
    }, {
      title  : 'Pot.Deferred.chain()',
      code   : function() {
        var result = [];
        var deferred = chain(
          function() {
            return wait(1).then(function() {
              result.push(1);
            });
          },
          function(res) {
            throw new Error('TestChainError');
          },
          function rescue(err) {
            result.push(err);
          },
          function(res) {
            return succeed(res).then(function(val) {
              result.push(2);
            });
          },
          {
            foo : function(res) {
              result.push(3);
            },
            bar : function(res) {
              return begin(function() {
                result.push(4);
              });
            }
          },
          function(res) {
            result.push(5);
          },
          [
            function(res) {
              return wait(1).then(function() {
                result.push(6);
              });
            },
            function(res) {
              return begin(function() {
                return succeed(7).then(function(val) {
                  result.push(val);
                });
              });
            }
          ]
        );
        return deferred.then(function() {
          return result;
        });
      },
      expect : [1, new Error('TestChainError'), 2, 3, 4, 5, 6, 7]
    }, {
      title : 'A simple Deferred chain',
      code  : function() {
        var d = new Deferred();
        return d.then(function() {
          return 1;
        }).begin();
      },
      expect : 1
    }, {
      title : 'Nested Deferred chain',
      code  : function() {
        var d = new Deferred();
        return d.then(function() {
          var dd = new Deferred();
          return dd.then(function() {
            return 2;
          }).begin();
        }).begin();
      },
      expect : 2
    }, {
      title : 'Iterate with specific speed for synchronous',
      code  : function() {
        var array = ['foo', 'bar', 'baz'];
        var object = {a: 1, b: 2, c: 3, d: 4, e: 5};
        var result = [];
        forEver.slow(function() {
          forEach.slow(object, function(val, key) {
            repeat.fast(array.length, function(i) {
              var value = [];
              var iter = new Iter();
              iter.next = (function() {
                var n = 0;
                return function() {
                  if (n >= 5) {
                    throw StopIteration;
                  }
                  return n++;
                };
              })();
              iterate.slow(iter, function(j) {
                value[j] = [array[i], key, val];
              });
              value = filter.ninja(map.rapid(value, function(v) {
                return items.slow(zip.ninja(v, function(item) {
                  return item.slice(0, 2);
                }), function(item) {
                  return item[item.length - 1];
                }).shift().join('');
              }), function(item) {
                return item && item.length && /a/.test(item);
              });
              if (!value || !value.length) {
                throw StopIteration;
              }
              if (!some(value, function(item) {
                return /f/.test(item);
              })) {
                value.push(10);
              }
              if (every(value, function(item) {
                return /o/.test(item);
              })) {
                value.push(20);
              }
              value = reduce.limp(value, function(a, b) {
                return a + ':' + b;
              });
              result.push(value);
            });
          });
          throw StopIteration;
        });
        return result;
      },
      expect : [
        'fooa:fooa:fooa:fooa:fooa:20',
        'bara:bara:bara:bara:bara:10',
        'baza:baza:baza:baza:baza:10'
      ]
    }, {
      title  : 'Iterate with specific speed for asynchronous',
      code   : function() {
        var array = ['foo', 'bar', 'baz'];
        var object = {a: 1, b: 2, c: 3, d: 4, e: 5};
        var result = [];
        return Deferred.forEach.slow(object, function(val, key) {
          return Deferred.repeat.fast(array.length, function(i) {
            result.push([array[i], key, val]);
          });
        }).then(function() {
          return Deferred.zip.slow(result, function(item) {
            return item.join(':');
          });
        });
      },
      expect : [
        'foo:bar:baz:foo:bar:baz:foo:bar:baz:foo:bar:baz:foo:bar:baz',
        'a:a:a:b:b:b:c:c:c:d:d:d:e:e:e',
        '1:1:1:2:2:2:3:3:3:4:4:4:5:5:5'
      ]
    }, {
      title  : 'Iterate with specific speed for asynchronous on chain',
      code   : function() {
        var array = ['foo', 'bar', 'baz'];
        var object = {a: 1, b: 2, c: 3, d: 4, e: 5};
        var result = [];
        var d = new Deferred();
        return d.then(function() {
          return object;
        }).forEach.slow(function(val, key) {
          var dd = new Deferred();
          return dd.repeat.fast(function(i) {
            result.push([array[i], key, val]);
          }).then(function() {
            return result;
          }).begin(array.length);
        }).then(function() {
          return result;
        }).zip.doze(function(item) {
          return item.join(':');
        }).then(function(res) {
          return res;
        }).begin();
      },
      expect : [
        'foo:bar:baz:foo:bar:baz:foo:bar:baz:foo:bar:baz:foo:bar:baz',
        'a:a:a:b:b:b:c:c:c:d:d:d:e:e:e',
        '1:1:1:2:2:2:3:3:3:4:4:4:5:5:5'
      ]
    }, {
      title  : 'StopIteration on nested iteration',
      code   : function() {
        var result = [];
        return begin(function() {
          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }).forEach(function(value) {
          return begin(function() {
            var d = new Deferred();
            return d.then(function() {
              if (value > 5) {
                throw StopIteration;
              }
              return value * 100;
            }).begin();
          }).then(function(res) {
            result.push(res);
          });
        }).then(function() {
          return result;
        });
      },
      expect : [100, 200, 300, 400, 500]
    }, {
      title  : 'Statement for return and non-return',
      code   : function() {
        return begin(function() {
          return 'foo';
        }).then(function(res) {
          var nop = res;
        }).then(function(res) {
          return res + 'bar';
        }).then(function() {
          void 0;
        }).wait(1).then(function(res) {
          return res + 'baz';
        });
      },
      expect : 'foobarbaz'
    }, {
      title  : 'Pot.Workeroid with function',
      code   : function() {
        var d = new Deferred();
        var worker = new Workeroid(function(data) {
          postMessage(data + 1);
        });
        worker.onmessage = function(data) {
          d.begin(data);
        };
        worker.onerror = function(err) {
          d.raise(err);
        };
        worker.postMessage(1);
        return d;
      },
      expect : 2
    }, {
      title  : 'Pot.Workeroid with function by self',
      code   : function() {
        var d = new Deferred();
        var worker = new Workeroid(function(data) {
          self.postMessage(data + 1);
        });
        worker.onmessage = function(data) {
          d.begin(data);
        };
        worker.onerror = function(err) {
          d.raise(err);
        };
        worker.postMessage(1);
        return d;
      },
      expect : 2
    }, {
      title  : 'Pot.Workeroid with scope',
      code   : function() {
        var d = new Deferred();
        var worker = new Workeroid(function() {
          onmessage = function(ev) {
            postMessage(ev.data + 'bar');
          };
        });
        worker.onmessage = function(data) {
          d.begin(data);
        };
        worker.onerror = function(err) {
          d.raise(err);
        };
        worker.postMessage('foo');
        return d;
      },
      expect : 'foobar'
    }, {
      title  : 'Pot.Workeroid with scope by self',
      code   : function() {
        var d = new Deferred();
        var worker = new Workeroid(function() {
          var bar = 'bar';
          self.onmessage = function(ev) {
            self.postMessage(ev.data + bar);
          };
        });
        worker.onmessage = function(data) {
          d.begin(data);
        };
        worker.onerror = function(err) {
          d.raise(err);
        };
        worker.postMessage('foo');
        return d;
      },
      expect : 'foobar'
    }, {
      title  : 'Pot.Workeroid with file',
      code   : function() {
        var d = new Deferred();
        var worker = new Workeroid('pot.worker.test.js');
        worker.onmessage = function(data) {
          d.begin(data);
        };
        worker.onerror = function(err) {
          d.raise(err);
        };
        worker.postMessage('foo');
        return d;
      },
      expect : 'foobar'
    }, {
      title  : 'Pot.Workeroid with Deferred chain',
      code   : function() {
        var results = [];
        var d = new Deferred();
        var worker = new Workeroid(function(data) {
          switch (data) {
            case 'foo':
                setTimeout(function() {
                  postMessage('foo!');
                }, 2000);
                break;
            case 'bar':
                Pot.callLater(1, function() {
                  postMessage('bar!');
                });
                break;
            case 'baz':
                postMessage('baz!');
                break;
          }
        });
        worker.onmessage = function(data) {
          results.push(data);
        };
        worker.onerror = function(err) {
          results.push(err);
        };
        return begin(function() {
          worker.postMessage('foo');
          return worker;
        }).then(function() {
          worker.postMessage('bar');
          return worker;
        }).then(function() {
          worker.postMessage('baz');
          return worker;
        }).then(function() {
          worker.terminate();
          return d.begin(results);
        });
      },
      expect : ['foo!', 'bar!', 'baz!']
    }, {
      title  : 'Pot.Signal.attach() and Pot.Signal.detach() for Object',
      code   : function() {
        var value = [];
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key + (a + b));
          }
        };
        var handler1 = attach(obj, 'push', function(a, b) {
          obj.method(a, b);
        });
        signal(obj, 'push', 0, 1);
        var handler2 = attach(obj, 'push', function(a, b) {
          obj.method(a * 10, b * 10);
        });
        signal(obj, 'push', 2, 0);
        detach(handler1);
        var handler3 = attach(obj, 'push', function(a, b) {
          obj.method(a * 100, b * 100);
        });
        signal(obj, 'push', 0, 3);
        detach(handler2);
        detach(handler3);
        signal(obj, 'push', 4, 5);
        return value;
      },
      expect : ['obj1', 'obj2', 'obj20', 'obj30', 'obj300']
    }, {
      title  : 'Pot.Signal.attach() and Pot.Signal.detachAll() for Object',
      code   : function() {
        var value = [];
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key + (a + b));
          }
        };
        var handler1 = attach(obj, 'push', function(a, b) {
          obj.method(a, b);
        });
        var handler2 = attach(obj, 'push', function(a, b) {
          obj.method(a * 10, b * 10);
        });
        var handler3 = attach(obj, 'push', function(a, b) {
          obj.method(a * 100, b * 100);
        });
        signal(obj, 'push', 1, 0);
        detachAll(obj);
        return value;
      },
      expect : ['obj1', 'obj10', 'obj100']
    }, {
      title  : 'Pot.Signal.attachBefore() for Object',
      code   : function() {
        var value = [];
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key + (a + b));
          }
        };
        var handler1 = attach(obj, 'push', function(a, b) {
          obj.method(a, b);
        });
        var handler2 = attachBefore(obj, 'push', function(a, b) {
          obj.method(a * 10, b * 10);
        });
        signal(obj, 'push', 1, 0);
        detachAll(obj);
        return value;
      },
      expect : ['obj10', 'obj1']
    }, {
      title  : 'Pot.Signal.attachAfter() for Object',
      code   : function() {
        var value = [];
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key + (a + b));
          }
        };
        var handler1 = attach(obj, 'push', function(a, b) {
          obj.method(a, b);
        });
        var handler2 = attachAfter(obj, 'push', function(a, b) {
          obj.method(a * 10, b * 10);
        });
        signal(obj, 'push', 1, 0);
        detachAll(obj);
        return value;
      },
      expect : ['obj1', 'obj10']
    }, {
      title  : 'Pot.Signal.attachBefore.once() for Object',
      code   : function() {
        var value = [];
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key + (a + b));
          }
        };
        var handler1 = attach(obj, 'push', function(a, b) {
          obj.method(a, b);
        });
        var handler2 = attachBefore.once(obj, 'push', function(a, b) {
          obj.method(a * 10, b * 10);
        });
        signal(obj, 'push', 1, 0);
        signal(obj, 'push', 0, 2);
        detachAll(obj);
        return value;
      },
      expect : ['obj10', 'obj1', 'obj2']
    }, {
      title  : 'Pot.Signal.attachAfter.once() for Object',
      code   : function() {
        var value = [];
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key + (a + b));
          }
        };
        var handler1 = attach(obj, 'push', function(a, b) {
          obj.method(a, b);
        });
        var handler2 = attachAfter.once(obj, 'push', function(a, b) {
          obj.method(a * 10, b * 10);
        });
        signal(obj, 'push', 1, 0);
        signal(obj, 'push', 0, 2);
        detachAll(obj);
        return value;
      },
      expect : ['obj1', 'obj10', 'obj2']
    }, {
      title  : 'Pot.Signal.attachPropBefore()',
      code   : function() {
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key);
            value.push(a + b);
          }
        };
        var value = [];
        attachPropBefore(obj, 'method', function(a, b) {
          value.push(a + b);
        });
        attachPropBefore(obj, 'method', function(a, b) {
          value.push(a + b + a + b);
        });
        obj.method(1, 2);
        return value;
      },
      expect : [3, 6, 'obj', 3]
    }, {
      title  : 'Pot.Signal.attachPropAfter()',
      code   : function() {
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key);
            value.push(a + b);
          }
        };
        var value = [];
        attachPropAfter(obj, 'method', function(a, b) {
          value.push(a + b);
        });
        attachPropAfter(obj, 'method', function(a, b) {
          value.push(a + b + a + b);
        });
        obj.method(1, 2);
        return value;
      },
      expect : ['obj', 3, 3, 6]
    }, {
      title  : 'Pot.Signal.attachPropBefore.once()',
      code   : function() {
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key);
            value.push(a + b);
          }
        };
        var value = [];
        attachPropBefore.once(obj, 'method', function(a, b) {
          value.push(a + b);
        });
        attachPropBefore.once(obj, 'method', function(a, b) {
          value.push(a + b + a + b);
        });
        obj.method(1, 2);
        obj.method(1, 2);
        return value;
      },
      expect : [3, 6, 'obj', 3, 'obj', 3]
    }, {
      title  : 'Pot.Signal.attachPropAfter.once()',
      code   : function() {
        var obj = {
          key : 'obj',
          method : function(a, b) {
            value.push(this.key);
            value.push(a + b);
          }
        };
        var value = [];
        attachPropAfter.once(obj, 'method', function(a, b) {
          value.push(a + b);
        });
        attachPropAfter.once(obj, 'method', function(a, b) {
          value.push(a + b + a + b);
        });
        obj.method(1, 2);
        obj.method(1, 2);
        return value;
      },
      expect : ['obj', 3, 3, 6, 'obj', 3]
    }, {
      title  : 'Pot.hashCode()',
      code   : function() {
        return hashCode('abc');
      },
      expect : 96354
    }, {
      title  : 'Pot.md5()',
      code   : function() {
        return md5('apple');
      },
      expect : '1f3870be274f6c49b3e31a0c6728957f'
    }, {
      title  : 'Pot.md5.deferred()',
      code   : function() {
        return md5.deferred('apple').then(function(res) {
          return res;
        });
      },
      expect : '1f3870be274f6c49b3e31a0c6728957f'
    }, {
      title  : 'Pot.crc32()',
      code   : function() {
        return crc32('abc123');
      },
      expect : -821904548
    }, {
      title  : 'Pot.sha1()',
      code   : function() {
        return sha1('apple');
      },
      expect : 'd0be2dc421be4fcd0172e5afceea3970e2f3d940'
    }, {
      title  : 'Pot.sha1.deferred()',
      code   : function() {
        return sha1.deferred('apple').then(function(res) {
          return res;
        });
      },
      expect : 'd0be2dc421be4fcd0172e5afceea3970e2f3d940'
    }, {
      title  : 'Pot.Arc4',
      code   : function() {
        var arc4 = new Arc4();
        arc4.setKey('hoge');
        var text = 'Hello World!';
        var cipherText = arc4.encrypt(text);
        var origText = arc4.decrypt(cipherText);
        return cipherText != text && text === origText;
      },
      expect : true
    }, {
      title  : 'Pot.Arc4 with Deferred',
      code   : function() {
        var arc4 = new Arc4();
        arc4.setKey('hoge');
        var text = 'Hello World!';
        return arc4.encrypt.deferred(text).then(function(cipherText) {
          return arc4.decrypt.deferred.slow(cipherText).then(function(origText) {
            return cipherText != text && text === origText;
          });
        });
      },
      expect : true
    }, {
      title  : 'Pot.Hash object',
      code   : function() {
        var results = [];
        var hash = new Pot.Hash();
        hash.set('key1', 'value1');
        hash.set('key2', [1, 2, 3]);
        results.push(hash.toJSON());
        hash.clear();
        hash.set('__iterator__',   'iterator');
        hash.set('hasOwnProperty', 'hasOwn');
        hash.set('prototype',      'proto');
        hash.set('constructor',    'construct');
        results.push(hash.toJSON());
        results.push(hash.map(function(value, key, object) {
          return '[' + value + ']';
        }).reduce(function(a, b) {
          return a + b;
        }));
        return results;
      },
      expect : [
        '{"key1":"value1","key2":[1,2,3]}',
        '{"__iterator__":"iterator","hasOwnProperty":"hasOwn","prototype":"proto","constructor":"construct"}',
        '[iterator][hasOwn][proto][construct]'
      ]
    }, {
      title  : 'Pot.merge()',
      code   : function() {
        var results = [];
        var array1 = [1, 2, 3];
        var array2 = [4, 5, 6];
        results.push(merge(array1, array2));
        results.push(merge([], 1, 2, 'foo', {bar: 3}));
        var obj1 = {foo: 1, bar: 2};
        var obj2 = {baz: 3};
        results.push(merge(obj1, obj2));
        results.push(merge({}, {foo: 1}, {bar: 2}));
        var s1 = 'foo';
        var s2 = 'bar';
        results.push(merge(s1, s2));
        return results;
      },
      expect : [
        [1, 2, 3, 4, 5, 6],
        [1, 2, 'foo', {bar: 3}],
        {foo: 1, bar: 2, baz: 3},
        {foo: 1, bar: 2},
        'foobar'
      ]
    }, {
      title  : 'Pot.unique()',
      code   : function() {
        return [
          unique(
            [1, 2, 3, 4, 5, 3, 5, 'a', 3, 'b', 'a', 'c', 2, 5]
          ),
          unique(
            [5, 7, 8, 3, 6, 1, 7, 2, 3, 8, 4, 2, 9, 5]
          ),
          unique(
            ['1', 1, '2', 2, 0, '0', '', null, false, (void 0)],
            true
          ),
          unique(
            ['abc', 'ABC', 'Foo', 'bar', 'foO', 'BaR'],
            false, true
          ),
          unique(
            {a: 1, b: 2, c: 3, d: 1, e: 3, f: 2}
          ),
          unique(
            {foo: 1, bar: 2, FOo: 3, Bar: '1', baZ: '2'},
            true, true
          ),
          unique(
            {a: 1, b: 2, c: 3, d: '1', e: '3', f: 5},
            true
          ),
          unique('abcABCabc-----foobarBaZ'),
          unique('abcABCabc-----foobarBaZ', true, true),
          unique([
            1, 1,  [123],  (function(a) { return a; }),
            [123], {a: 5}, (function(a) { return a; }),
            {a: 5}
          ])
        ];
      },
      expect : [
        [1, 2, 3, 4, 5, 'a', 'b', 'c'],
        [5, 7, 8, 3, 6, 1, 2, 4, 9],
        ['1', '2', 0, null],
        ['abc', 'Foo', 'bar'],
        {a: 1, b: 2, c: 3},
        {foo: 1, bar: 2, FOo: 3},
        {a: 1, b: 2, c: 3, f: 5},
        'abcABC-forZ',
        'abc-forZ',
        [1, [123], (function(a) { return a; }), {a: 5}]
      ]
    }, {
      title  : 'Pot.flatten()',
      code   : function() {
        return flatten([
          1, 2, 3, [4, 5, 6, [7, 8, [9], 10], 11], 12
        ]);
      },
      expect : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }, {
      title  : 'Pot.alphanumSort()',
      code   : function() {
        return alphanumSort([
          'a10', 'a2', 'a100', 'a1', 'a12'
        ]);
      },
      expect : ['a1', 'a2', 'a10', 'a12', 'a100']
    }, {
      title  : 'Pot.clone()',
      code   : function() {
        var obj1 = {key: 'value'};
        var obj2 = clone(obj1);
        obj2.hoge = 'fuga';
        return [obj1.hoge, obj2.hoge];
      },
      expect : [(void 0), 'fuga']
    }, {
      title  : 'Pot.bind()',
      code   : function() {
        var results = [];
        var Hoge = function() {
          this.msg = 'Hello Hoge!';
        };
        Hoge.prototype.sayHoge = function() {
          results.push(this.msg);
        };
        var hoge = new Hoge();
        setTimeout(hoge.sayHoge, 0);
        setTimeout(bind(hoge.sayHoge, hoge), 0);
        Hoge.prototype.sayHoges = function(msg) {
          results.push(this.msg + msg);
        };
        setTimeout(hoge.sayHoges, 0);
        setTimeout(bind(hoge.sayHoges, hoge, 'Hi!'), 0);
        return wait(1).then(function() {
          return results;
        });
      },
      expect : [(void 0), 'Hello Hoge!', NaN, 'Hello Hoge!Hi!']
    }, {
      title  : 'Pot.partial()',
      code   : function() {
        var add = function(a, b) {
          return a + b;
        }
        var add2 = partial(add, 2);
        return add2(5);
      },
      expect : 7
    }, {
      title  : 'Pot.keys()',
      code   : function() {
        var results = [];
        var obj = {foo: 1, bar: 2, baz: 3};
        results.push(keys(obj));
        var array = [10, 20, 30, 40, 50];
        results.push(keys(array));
        delete array[2];
        results.push(keys(array));
        return results;
      },
      expect : [
        ['foo', 'bar', 'baz'],
        [0, 1, 2, 3, 4],
        [0, 1, 3, 4]
      ]
    }, {
      title  : 'Pot.values()',
      code   : function() {
        var results = [];
        var obj = {foo: 1, bar: 2, baz: 3};
        results.push(values(obj));
        var array = ['foo', 'bar', 'baz'];
        results.push(values(array));
        delete array[1];
        results.push(values(array));
        return results;
      },
      expect : [
        [1, 2, 3],
        ['foo', 'bar', 'baz'],
        ['foo', 'baz']
      ]
    }, {
      title  : 'Pot.tuple()',
      code   : function() {
        var results = [];
        var array = [['foo', 1], ['bar', 2], ['baz', 3]];
        results.push(tuple(array));
        var array = [['foo', 1, 'bar', 2], {baz: 3}, ['A', 4, 'B']];
        results.push(tuple(array));
        var array = [['A', 1], ['B', 2], ['C', 3]];
        var func = function(key, val) {
          return ['[' + key + ']', '{' + val + '}'];
        };
        results.push(tuple(array, func));
        var array = [['prototype', 1], ['__iterator__', 2], ['__proto__', 3]];
        results.push(tuple(array, new Pot.Hash()).toJSON());
        var array = [['A', 1], ['B', 2], ['C', 3]];
        var func = function(key, val) {
          return '(' + key + ':' + val + ')';
        };
        results.push(tuple(array, func, []));
        return results;
      },
      expect : [
        {foo: 1, bar: 2, baz: 3},
        {foo: 1, bar: 2, baz: 3, A: 4, B: (void 0)},
        {'[A]': '{1}', '[B]': '{2}', '[C]': '{3}'},
        '{"prototype":1,"__iterator__":2,"__proto__":3}',
        ['(A:1)', '(B:2)', '(C:3)']
      ]
    }, {
      title  : 'Pot.unzip()',
      code   : function() {
        var results = [];
        results.push(unzip([[1, 4], [2, 5], [3, 6]]));
        results.push(unzip([[{a: 1}, {d: 4}], [{b: 2}, {e: 5}], [{c: 3}, {f: 6}]]));
        var callback = function(a, b, c) { return a + b + c; };
        results.push(unzip([[1, 4], [2, 5], [3, 6]], callback));
        return results;
      },
      expect : [
        [[1, 2, 3], [4, 5, 6]],
        [{a: 1, b: 2, c: 3}, {d: 4, e: 5, f: 6}],
        [6, 15]
      ]
    }, {
      title  : 'Pot.pairs()',
      code   : function() {
        var results = [];
        results.push(pairs('key', 'value'));
        results.push(pairs('key1', 'value1', 'key2', 'value2'));
        results.push(pairs('key'));
        results.push(pairs(['key', 'value']));
        results.push(pairs('key1', 1, ['key2', 2], 'key3', 3));
        results.push(pairs(['a', 1, ['b', 2, [{c: 3}, 'd', 4]]]));
        return results;
      },
      expect : [
        {key : 'value'},
        {key1: 'value1', key2: 'value2'},
        {key: (void 0)},
        {key: 'value'},
        {key1: 1, key2: 2, key3: 3},
        {a: 1, b: 2, c: 3, d: 4}
      ]
    }, {
      title  : 'Pot.count()',
      code   : function() {
        var results = [];
        results.push(count({a: 1, b: 2, c: 3}));
        results.push(count({}));
        results.push(count([1, 2, 3, 4, 5]));
        results.push(count([]));
        results.push(count(new Object('foo', 'bar', 'baz')));
        results.push(count(new Array(100)));
        results.push(count(null));
        results.push(count((void 0)));
        results.push(count('hoge'));
        results.push(count(''));
        results.push(count(new String('hoge')));
        results.push(count(100));
        results.push(count(0));
        results.push(count(-1));
        results.push(count((function() {})));
        var f = function() {};
        f.foo = 1;
        f.bar = 2;
        results.push(count(f));
        return results;
      },
      expect : [
        3,
        0,
        5,
        0,
        3,
        100,
        0,
        0,
        4,
        0,
        4,
        100,
        0,
        1,
        0,
        2
      ]
    }, {
      title  : 'Pot.first()',
      code   : function() {
        return [
          first({a: 1, b: 2, c: 3}),
          first({}),
          first([1, 2, 3, 4, 5]),
          first([]),
          first({a: 'foo', b: 'bar'}),
          first(new Array(100)),
          first(null),
          first((void 0)),
          first('hoge'),
          first(''),
          first(new String('hoge')),
          first(123),
          first(0),
          first(-123)
        ];
      },
      expect : [
        1,
        undefined,
        1,
        undefined,
        'foo',
        undefined,
        undefined,
        undefined,
        'h',
        '',
        'h',
        3,
        0,
        3
      ]
    }, {
      title  : 'Pot.firstKey()',
      code   : function() {
        return [
          firstKey({a: 1, b: 2, c: 3}),
          firstKey({}),
          firstKey([1, 2, 3, 4, 5]),
          firstKey([]),
          firstKey({a: 'foo', b: 'bar'}),
          firstKey(new Array(100)),
          firstKey(null),
          firstKey((void 0)),
          firstKey('hoge'),
          firstKey(''),
          firstKey(new String('hoge')),
          firstKey(123),
          firstKey(0),
          firstKey(-123)
        ];
      },
      expect : [
        'a',
        undefined,
        0,
        undefined,
        'a',
        undefined,
        undefined,
        undefined,
        0,
        null,
        0,
        0,
        0,
        0
      ]
    }, {
      title  : 'Pot.last()',
      code   : function() {
        return [
          last({a: 1, b: 2, c: 3}),
          last({}),
          last([1, 2, 3, 4, 5]),
          last([]),
          last({a: 'foo', b: 'bar'}),
          last(new Array(100)),
          last(null),
          last((void 0)),
          last('hoge'),
          last(''),
          last(new String('hoge')),
          last(123),
          last(0),
          last(-123)
        ];
      },
      expect : [
        3,
        undefined,
        5,
        undefined,
        'bar',
        undefined,
        undefined,
        undefined,
        'e',
        '',
        'e',
        1,
        0,
        1
      ]
    }, {
      title  : 'Pot.lastKey()',
      code   : function() {
        return [
          lastKey({a: 1, b: 2, c: 3}),
          lastKey({}),
          lastKey([1, 2, 3, 4, 5]),
          lastKey([]),
          lastKey({a: 'foo', b: 'bar'}),
          lastKey(new Array(100)),
          lastKey(null),
          lastKey((void 0)),
          lastKey('hoge'),
          lastKey(''),
          lastKey(new String('hoge')),
          lastKey(123),
          lastKey(0),
          lastKey(-123)
        ];
      },
      expect : [
        'c',
        undefined,
        4,
        undefined,
        'b',
        undefined,
        undefined,
        undefined,
        3,
        null,
        3,
        2,
        0,
        2
      ]
    }, {
      title  : 'Pot.contains()',
      code   : function() {
        var results = [];
        var obj = {foo: 10, bar: 20, baz: 30};
        results.push(contains(obj, 20));
        results.push(contains(obj, 50));
        var arr = [10, 20, 30, 'foo', 'bar'];
        results.push(contains(arr, 20));
        results.push(contains(arr, 75));
        results.push(contains(arr, 'foo'));
        results.push(contains(arr, 'FOO'));
        var str = 'foobarbaz';
        results.push(contains(str, 'A'));
        results.push(contains(str, 'foo'));
        results.push(contains(str, '123'));
        var num = 12345;
        results.push(contains(num, 1));
        results.push(contains(num, 45));
        results.push(contains(num, 7));
        return results;
      },
      expect : [
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        false,
        true,
        true,
        false
      ]
    }, {
      title  : 'Pot.remove()',
      code   : function() {
        return [
          remove('foo bar baz', 'o'),
          remove('foo bar baz', 'bar'),
          remove([1, 2, 3, 4, 5], 2),
          remove([1, 2, 3, 4, 5], '3'),
          remove([1, 2, 3, 4, 5], '3', true),
          remove({A: 1, B: 2, C: 3}, 2),
          remove({A: 1, B: 2, C: 3}, '3'),
          remove({A: 1, B: 2, C: 3}, '3', true),
          remove(1234512345, 2),
          remove(1234512345, 123)
        ];
      },
      expect : [
        'fo bar baz',
        'foo  baz',
        [1, 3, 4, 5],
        [1, 2, 3, 4, 5],
        [1, 2, 4, 5],
        {A: 1, C: 3},
        {A: 1, B: 2, C: 3},
        {A: 1, B: 2},
        134512345,
        4512345
      ]
    }, {
      title  : 'Pot.removeAll()',
      code   : function() {
        return [
          removeAll('foo bar baz', 'o'),
          removeAll('foo bar baz', 'ba'),
          removeAll([1, 2, 3, 1, 2], 2),
          removeAll([1, 2, 3, 1, 2], '2'),
          removeAll([1, 2, 3, 1, 2], '2', true),
          removeAll({A: 1, B: 2, C: 2}, 2),
          removeAll({A: 1, B: 2, C: 2}, '2'),
          removeAll({A: 1, B: 2, C: 2}, '2', true),
          removeAll(1234512345, 2),
          removeAll(1234512345, 123)
        ];
      },
      expect : [
        'f bar baz',
        'foo r z',
        [1, 3, 1],
        [1, 2, 3, 1, 2],
        [1, 3, 1],
        {A: 1},
        {A: 1, B: 2, C: 2},
        {A: 1},
        13451345,
        4545
      ]
    }, {
      title  : 'Pot.removeAt()',
      code   : function() {
        return [
          removeAt('foo bar baz', 2),
          removeAt('foo bar baz', 2, 5),
          removeAt('foo bar baz', 100),
          removeAt([1, 2, 3, 4, 5], 2),
          removeAt([1, 2, 3, 4, 5], 2, 2),
          removeAt([1, 2, 3, 4, 5], -1, 5),
          removeAt({A: 1, B: 2, C: 3}, 2),
          removeAt({A: 1, B: 2, C: 3}, 1, 5),
          removeAt({A: 1, B: 2, C: 3}, 5),
          removeAt(1234512345, 2),
          removeAt(1234512345, 2, 3),
          removeAt(-1234512345, 2, 3)
        ];
      },
      expect : [
        'fo bar baz',
        'fo baz',
        'foo bar baz',
        [1, 2, 4, 5],
        [1, 2, 5],
        [1, 2, 3, 4],
        {A: 1, B: 2},
        {A: 1},
        {A: 1, B: 2, C: 3},
        123451245,
        1234545,
        -1234545
      ]
    }, {
      title  : 'Pot.equals()',
      code   : function() {
        var results = [];
        var obj1 = {foo: 10, bar: 20, baz: 30};
        var obj2 = {foo: 10, bar: 20, baz: 30};
        var obj3 = {a: 'hoge', b: 'fuga'};
        results.push(equals(obj1, obj2));
        results.push(equals(obj1, obj3));
        var obj4 = {};
        var obj5 = {};
        results.push(equals(obj4, obj5));
        var arr1 = [1, 2, 3];
        var arr2 = [1, 2, 3];
        var arr3 = [1, 2, 10];
        results.push(equals(arr1, arr2));
        results.push(equals(arr1, arr3));
        var arr4 = [];
        var arr5 = [];
        results.push(equals(arr4, arr5));
        var cmp = function(a, b) {
          return a == b ||
            String(a).toLowerCase() == String(b).toLowerCase();
        };
        var arr6 = [1, 2, 'foo', 'bar'];
        var arr7 = ['1', 2, 'FOO', 'baR'];
        results.push(equals(arr6, arr7, cmp));
        var func1 = (function() {});
        var func2 = (function() {});
        var func3 = (function() { return this; });
        results.push(equals(func1, func2));
        results.push(equals(func1, func3));
        var date1 = new Date();
        var date2 = new Date(date1.getTime());
        var date3 = new Date(date1.getTime() + 100);
        results.push(equals(date1, date2));
        results.push(equals(date1, date3));
        var str1 = 'foobarbaz';
        var str2 = 'foobarbaz';
        var str3 = 'hoge';
        results.push(equals(str1, str2));
        results.push(equals(str1, str3));
        var num1 = 12345;
        var num2 = 12345;
        var num3 = 12345.455512;
        var num4 = 12345.443556;
        var num5 = 12345.443556999;
        results.push(equals(num1, num2));
        results.push(equals(num1, num3));
        results.push(equals(num3, num4));
        results.push(equals(num4, num5));
        return results;
      },
      expect : [
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        true
      ]
    }, {
      title  : 'Pot.reverse()',
      code   : function() {
        return [
          reverse({foo: 1, bar: 2, baz: 3}),
          reverse([1, 2, 3, 4, 5]),
          reverse('123abc')
        ];
      },
      expect : [
        {baz: 3, bar: 2, foo: 1},
        [5, 4, 3, 2, 1],
        'cba321'
      ]
    }, {
      title  : 'Pot.flip()',
      code   : function() {
        return flip({foo: 'A', bar: 'B', baz: 'C'});
      },
      expect : {A: 'foo', B: 'bar', C: 'baz'}
    }, {
      title  : 'Pot.shuffle()',
      code   : function() {
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var ash = shuffle(arr);
        while (arr[0] === ash[0]) {
          ash = shuffle(arr);
        }
        var num = 123456789;
        var nsh = shuffle(num);
        while (num == nsh) {
          nsh = shuffle(num);
        }
        var dbl = -123456789.0839893;
        var dsh = shuffle(dbl);
        while (dbl == dsh) {
          dsh = shuffle(dbl);
        }
        var obj = {a: 1, b: 2, c: 3, d: 4, e: 5};
        var osh = shuffle(obj);
        while (first(obj) == first(osh)) {
          osh = shuffle(obj);
        }
        var str = 'abcdef12345';
        var ssh = shuffle(str);
        while (str == ssh) {
          ssh = shuffle(str);
        }
        return !equals(arr, ash) && arr.length === ash.length &&
               num !== nsh && String(num).length === String(nsh).length &&
               dbl !== dsh &&
               /^-\d+[.]\d+$/.test(dbl) && /^-\d+[.]\d+$/.test(dsh) &&
               !equals(obj, osh) && count(obj) === count(osh) &&
               str !== ssh && str.length === ssh.length;
      },
      expect : true
    }, {
      title  : 'Pot.fill()',
      code   : function() {
        return [
          fill([1, 2], 3, 5),
          fill([], null, 3),
          fill('foo', 'o', 10),
          fill('', 'hoge', 5),
          fill({}, 2, 5),
          fill({a: 1, b: 2, c: 3}, null),
          fill(100, 5, 10)
        ];
      },
      expect : [
        [1, 2, 3, 3, 3, 3, 3],
        [null, null, null],
        'foooooooooooo',
        'hogehogehogehogehoge',
        {'0': 2, '1': 2, '2': 2, '3': 2, '4': 2},
        {a: null, b: null, c: null},
        5555555555100
      ]
    }, {
      title  : 'Pot.implode()',
      code   : function() {
        return [
          implode({color: 'blue', margin: '5px'}, ':', ';', true),
          implode('+', {a: 1, b: 2, c: 3}, '*'),
          implode('>>', {a: 1, b: 2, c: 3}, '^', '==?')
        ];
      },
      expect : [
        'color:blue;margin:5px;',
        'a+1*b+2*c+3',
        'a>>1^b>>2^c>>3==?'
      ]
    }, {
      title  : 'Pot.explode()',
      code   : function() {
        var results = [];
        var string = 'color:blue;margin:5px;';
        var result = explode(string, ':', ';');
        results.push(result);
        var string = 'foo=1&bar=2&baz=3';
        var result = explode(string, {delimiter: '=', separator: '&'});
        results.push(result);
        var string = 'A : 1, B:2, C: 3;';
        var result = explode(string, {
              delimiter : /(?:\s*:\s*)/,
              separator : /(?:\s*[,;]\s*)/
        });
        results.push(result);
        return results;
      },
      expect : [
        {color: 'blue', margin: '5px'},
        {foo: '1', bar: '2', baz: '3'},
        {A: '1', B: '2', C: '3'}
      ]
    }, {
      title  : 'Pot.glue()',
      code   : function() {
        return [
          glue([1, 2, 3, 4, 5]),
          glue('foo', 'bar', 'baz'),
          glue(1, [2, 3, ['foo']], ['bar', 'baz'])
        ];
      },
      expect : [
        '12345',
        'foobarbaz',
        '123foobarbaz'
      ]
    }, {
      title  : 'Pot.clearObject()',
      code   : function() {
        var results = [];
        var obj = {foo: 1, bar: 2, baz: 3};
        clearObject(obj);
        results.push(obj);
        var arr = [1, 2, 3, 4, 5];
        clearObject(arr);
        results.push(arr);
        return results;
      },
      expect : [{}, []]
    }, {
      title  : 'Pot.date()',
      code   : function() {
        var result = date('Y-m-d H:i:s');
        return /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(result);
      },
      expect : true
    }, {
      title  : 'Pot.prettyDate()',
      code   : function() {
        return [
          /[a-z]/.test(prettyDate('Fri Mar 16 2012 00:42:50 GMT+0900')),
          prettyDate(new Date().getTime() + 10),
          prettyDate(new Date().getTime() - 1000 * 60 - 10),
          prettyDate(new Date().getTime() - 1000 * 60 * 60 - 10),
          prettyDate(new Date().getTime() - 1000 * 60 * 60 * 24 - 10),
          prettyDate(new Date().getTime() - 1000 * 60 * 60 * 24 * 7 - 10),
          prettyDate(new Date().getTime() + 1000 * 60 + 10),
          prettyDate(new Date().getTime() + 1000 * 60 * 60 + 10),
          prettyDate(new Date().getTime() + 1000 * 60 * 60 * 24 + 10),
          prettyDate(new Date().getTime() + 1000 * 60 * 60 * 24 * 7 + 10)
        ];
      },
      expect : [
        true,
        'just now',
        'a minute ago',
        'an hour ago',
        'yesterday',
        'last week',
        'a minute from now',
        'an hour from now',
        'tomorrow',
        'next week'
      ]
    }, {
      title  : 'Pot.rand()',
      code   : function() {
        var results = [];
        var r = rand(0, 1);
        results.push( r === 0 || r === 1 );
        results.push( rand(5, 5) );
        r = rand(10, 1);
        results.push( r >= 1 && r <= 10 );
        r = rand(2.5, 5.75);
        results.push( /^\d\.\d{0,2}$/.test(r) );
        r = rand(1, 1.8765);
        results.push( /^\d\.\d{0,4}$/.test(r) );
        return results;
      },
      expect : [true, 5, true, true, true]
    }, {
      title  : 'Pot.rand.alpha()',
      code   : function() {
        var r1 = rand.alpha();
        var r2 = rand.alpha(8);
        return [
          /^[a-zA-Z]+$/.test(r1),
          /^[a-zA-Z]{8}$/.test(r2)
        ];
      },
      expect : [true, true]
    }, {
      title  : 'Pot.rand.alpha.lower()',
      code   : function() {
        var r1 = rand.alpha.lower();
        var r2 = rand.alpha.lower(8);
        return [
          /^[a-z]+$/.test(r1),
          /^[a-z]{8}$/.test(r2)
        ];
      },
      expect : [true, true]
    }, {
      title  : 'Pot.rand.alpha.upper()',
      code   : function() {
        var r1 = rand.alpha.upper();
        var r2 = rand.alpha.upper(8);
        return [
          /^[A-Z]+$/.test(r1),
          /^[A-Z]{8}$/.test(r2)
        ];
      },
      expect : [true, true]
    }, {
      title  : 'Pot.rand.alnum()',
      code   : function() {
        var r1 = rand.alnum();
        var r2 = rand.alnum(8);
        var r3 = rand.alnum(10, true);
        return [
          /^[a-zA-Z0-9]+$/.test(r1),
          /^[a-zA-Z0-9]{8}$/.test(r2),
          /^[a-zA-Z][a-zA-Z0-9]{9}$/.test(r3)
        ];
      },
      expect : [true, true, true]
    }, {
      title  : 'Pot.rand.alnum.lower()',
      code   : function() {
        var r1 = rand.alnum.lower();
        var r2 = rand.alnum.lower(8);
        var r3 = rand.alnum.lower(10, true);
        return [
          /^[a-z0-9]+$/.test(r1),
          /^[a-z0-9]{8}$/.test(r2),
          /^[a-z][a-z0-9]{9}$/.test(r3)
        ];
      },
      expect : [true, true, true]
    }, {
      title  : 'Pot.rand.alnum.upper()',
      code   : function() {
        var r1 = rand.alnum.upper();
        var r2 = rand.alnum.upper(8);
        var r3 = rand.alnum.upper(10, true);
        return [
          /^[A-Z0-9]+$/.test(r1),
          /^[A-Z0-9]{8}$/.test(r2),
          /^[A-Z][A-Z0-9]{9}$/.test(r3)
        ];
      },
      expect : [true, true, true]
    }, {
      title  : 'Pot.rand.color()',
      code   : function() {
        var r1 = rand.color();
        var r2 = rand.color(true);
        return [
          /^[a-fA-F0-9]{6}$/.test(r1),
          /^#[a-fA-F0-9]{6}$/.test(r2)
        ];
      },
      expect : [true, true]
    }, {
      title  : 'Pot.rand.color.lower()',
      code   : function() {
        var r1 = rand.color.lower();
        var r2 = rand.color.lower(true);
        return [
          /^[a-f0-9]{6}$/.test(r1),
          /^#[a-f0-9]{6}$/.test(r2)
        ];
      },
      expect : [true, true]
    }, {
      title  : 'Pot.rand.color.upper()',
      code   : function() {
        var r1 = rand.color.upper();
        var r2 = rand.color.upper(true);
        return [
          /^[A-F0-9]{6}$/.test(r1),
          /^#[A-F0-9]{6}$/.test(r2)
        ];
      },
      expect : [true, true]
    }, {
      title  : 'Pot.rand.caseOf()',
      code   : function() {
        var r, s = 'd41d8cd98f00b204e9800998ecf8427e';
        do {
          r = rand.caseOf(s);
        } while (s === r);
        return s !== r && s.length === r.length;
      },
      expect : true
    }, {
      title  : 'Pot.limit()',
      code   : function() {
        return [
          limit(5, 10, 50),
          limit(80, 10, 50),
          limit(5, 2, 8),
          limit(-5, -10, -50),
          limit(-80, -10, -50),
          limit('F', 'A', 'C'),
          limit('b', 'a', 'z'),
          limit(1, 2, 4, 5, 10, 20),
          limit(100, 2, 4, 5, 10, 20)
        ];
      },
      expect : [
        10,
        50,
        5,
        -10,
        -50,
        'C',
        'b',
        2,
        20
      ]
    }, {
      title  : 'Pot.convertToBase()',
      code   : function() {
        var results = [];
        var value = 'FFFFFFFF';
        results.push(convertToBase(value, 16, 10));
        var value = '9223372036854775807';
        results.push(convertToBase(value, 10, 16));
        var value = '11010100010011011010011101111' +
                    '10110011001101101100111001101';
        results.push(convertToBase(value, 2, 62));
        return results;
      },
      expect : [
        '4294967295',
        '7FFFFFFFFFFFFFFF',
        'HelloWorld'
      ]
    }, {
      title  : 'Pot.compareVersions()',
      code   : function() {
        var compareVersionsRepr = function(a, b) {
          var x = compareVersions(a, b);
          if (x == 0) {
            return a + ' == ' + b;
          } else if (x > 0) {
            return a + ' > '  + b;
          } else {
            return a + ' < '  + b;
          }
        };
        return [
          compareVersionsRepr('1.0pre', '1.0'),
          compareVersions('8.2.5rc', '8.2.5a'),
          compareVersions('8.2.50', '8.2.52'),
          compareVersions('5.3.0-dev', '5.3.0'),
          compareVersions('4.1.0.52', '4.01.0.51'),
          compareVersions('1.01a', '1.01'),
          compareVersions('1.0.0', '1.0.00'),
          compareVersions('2.1.0', '2.0.0', '<'),
          compareVersions('2.1.0', '2.0.0', '>'),
          compareVersions('2.1.0a', '2.1.0a', '==')
        ];
      },
      expect : [
        '1.0pre < 1.0',
        1,
        -1,
        -1,
        1,
        -1,
        0,
        false,
        true,
        true
      ]
    }, {
      title  : 'Pot.escapeHTML()',
      code   : function() {
        return escapeHTML('(>_<)/"< Hello World!');
      },
      expect : '(&gt;_&lt;)/&quot;&lt; Hello World!'
    }, {
      title  : 'Pot.unescapeHTML()',
      code   : function() {
        return unescapeHTML('(&gt;_&lt;)/&quot;&lt; Hello World!');
      },
      expect : '(>_<)/"< Hello World!'
    }, {
      title  : 'Pot.escapeXPathText()',
      code   : function() {
        var results = [];
        var text = '"] | /foo/bar/baz | .["';
        var expr = '//*[@class=' + escapeXPathText(text) + ']';
        results.push(expr);
        text = 'hoge-class';
        expr = '//*[@class=' + escapeXPathText(text) + ']';
        results.push(expr);
        return results;
      },
      expect : [
        '//*[@class=concat(\'"\',"] | /foo/bar/baz | .[",\'"\')]',
        '//*[@class="hoge-class"]'
      ]
    }, {
      title  : 'Pot.escapeAppleScriptString()',
      code   : function() {
        var file = escapeAppleScriptString('ヾ("ゝω・")ﾉ"');
        var command = [
          'tell application "Finder"',
          '  get exists of file "' + file + '" of desktop',
          'end tell'
        ].join('\n');
        return command;
      },
      expect : [
        'tell application "Finder"',
        '  get exists of file "ヾ(\\"ゝω・\\")ﾉ\\"" of desktop',
        'end tell'
      ].join('\n')
    }, {
      title  : 'Pot.escapeString()',
      code   : function() {
        var result = 'id="' + escapeString('foo"bar"') + '"';
        return result;
      },
      expect : 'id="foo\\"bar\\""'
    }, {
      title  : 'Pot.unescapeString()',
      code   : function() {
        var result = unescapeString('foo=\\"bar\\"');
        return result;
      },
      expect : 'foo="bar"'
    }, {
      title  : 'Pot.escapeFileName()',
      code   : function() {
        var fileName = 'ﾟ･*:.｡..｡.:*･ﾟ(file)ﾟ･*:.｡. .｡.:*･ﾟ･*';
        var escaped = escapeFileName(fileName);
        return escaped;
      },
      expect : 'ﾟ･ .｡..｡. ･ﾟ(file)ﾟ･ .｡. .｡. ･ﾟ･ '
    }, {
      title  : 'Pot.escapeSequence()',
      code   : function() {
        var string = 'ほげabc ("ｗ")';
        return escapeSequence(string);
      },
      expect : '\\u307b\\u3052abc\\u0020(\\"\\uff57\\")'
    }, {
      title  : 'Pot.unescapeSequence()',
      code   : function() {
        var string = '\\u307b\\u3052abc\\u0020(\\"\\uff57\\")';
        return unescapeSequence(string);
      },
      expect : 'ほげabc ("ｗ")'
    }, {
      title  : 'Pot.utf8Encode() and Pot.utf8Decode()',
      code   : function() {
        var s = 'abc123あいうえお';
        var e = utf8Encode(s);
        var d = utf8Decode(e);
        return s === d && s !== e;
      },
      expect : true
    }, {
      title  : 'Pot.utf8ByteOf()',
      code   : function() {
        var string = 'abc123あいうえお';
        var length = string.length;
        var byteSize = utf8ByteOf(string);
        return string +
            ' : length = ' + length +
            ', byteSize = ' + byteSize;
      },
      expect : 'abc123あいうえお : length = 11, byteSize = 21'
    }, {
      title  : 'Pot.base64Encode() and Pot.base64Decode()',
      code   : function() {
        var string = 'Hello World.';
        var encoded = base64Encode(string);
        var decoded = base64Decode(encoded);
        return [
          encoded,
          string === decoded && string !== encoded
        ];
      },
      expect : [
        'SGVsbG8gV29ybGQu',
        true
      ]
    }, {
      title  : 'Pot.base64Encode() and Pot.base64Decode() with Deferred',
      code   : function() {
        var string = 'Hello World.';
        return base64Encode.deferred(string).then(function(encoded) {
          return base64Decode.deferred.slow(encoded).then(function(decoded) {
            return [
              encoded,
              string === decoded && string !== encoded
            ];
          });
        });
      },
      expect : [
        'SGVsbG8gV29ybGQu',
        true
      ]
    }, {
      title  : 'Pot.base64URLEncode() and Pot.base64URLDecode()',
      code   : function() {
        var string = 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･';
        var encoded = base64URLEncode(string);
        var decoded = base64URLDecode(encoded);
        return [
          encoded,
          string === decoded && string !== encoded
        ];
      },
      expect : [
        '776fK--9oToub--9pe--n--9peKUo8Ko77234pSjwqjvvbfimIbvvaXvvp_vvaU=',
        true
      ]
    }, {
      title  : 'Pot.base64URLEncode() and Pot.base64URLDecode() with Deferred',
      code   : function() {
        var string = 'ﾟ+｡:.o･ﾟ･┣¨ｷ┣¨ｷ☆･ﾟ･';
        return base64URLEncode.deferred.slow(string).then(function(encoded) {
          return base64URLDecode.deferred(encoded).then(function(decoded) {
            return [
              encoded,
              string === decoded && string !== encoded
            ];
          });
        });
      },
      expect : [
        '776fK--9oToub--9pe--n--9peKUo8Ko77234pSjwqjvvbfimIbvvaXvvp_vvaU=',
        true
      ]
    }, {
      title  : 'Pot.alphamericStringEncode() and Pot.alphamericStringDecode()',
      code   : function() {
        var string  = 'Hello Hello foooooooo baaaaaaaar';
        var encoded = alphamericStringEncode(string);
        var decoded = alphamericStringDecode(encoded);
        var string2  = 'Hello Hello こんにちは、こんにちは、にゃーにゃー';
        var encoded2 = alphamericStringEncode(string2);
        var decoded2 = alphamericStringDecode(encoded2);
        var bytesS = utf8ByteOf(string2);
        var bytesE = utf8ByteOf(encoded2);
        var bytesD = utf8ByteOf(decoded2);
        return [
          encoded,
          string === decoded && string.length > encoded.length,
          encoded2,
          string2 === decoded2 && utf8ByteOf(string2) > utf8ByteOf(encoded2)
        ];
      },
      expect : [
        'Y8Z5CCF_v56F__5X0Z21__5I',
        true,
        'Y8Z5CCF_v5cJeJdB1Fa1_v4dBe3hS_y1',
        true
      ]
    }, {
      title  : 'Pot.alphamericStringEncode/Decode() with Deferred',
      code   : function() {
        var string = 'Hello Hello foooooooo baaaaaaaar';
        var encoded, decoded;
        return alphamericStringEncode.deferred(string).then(function(res) {
          encoded = res;
          return alphamericStringDecode.deferred(encoded);
        }).then(function(res) {
          decoded = res;
          return [
            encoded,
            decoded
          ];
        });
      },
      expect : [
        'Y8Z5CCF_v56F__5X0Z21__5I',
        'Hello Hello foooooooo baaaaaaaar'
      ]
    }, {
      title  : 'Pot.format()',
      code   : function() {
        return [
          format('#1 + #2 + #3', 10, 20, 30),
          format('J#1v#1#2 ECMA#2', 'a', 'Script')
        ];
      },
      expect : [
        '10 + 20 + 30',
        'JavaScript ECMAScript'
      ]
    }, {
      title  : 'Pot.sprintf()',
      code   : function() {
        var results = [];
        var num = 5;
        var place = 'tree';
        results.push(sprintf('There are %d monkeys in the %s.', num, place));
        var n =  43951789;
        var u = -43951789;
        var c = 65;
        results.push(sprintf("%%b = '%b'", n));
        results.push(sprintf("%%c = '%c'", c));
        results.push(sprintf("%%d = '%d'", n));
        results.push(sprintf("%%e = '%e'", n));
        results.push(sprintf("%%u = '%u'", n));
        results.push(sprintf("%%u = '%u'", u));
        results.push(sprintf("%%f = '%f'", n));
        results.push(sprintf("%%o = '%o'", n));
        results.push(sprintf("%%s = '%s'", n));
        results.push(sprintf("%%x = '%x'", n));
        results.push(sprintf("%%X = '%X'", n));
        results.push(sprintf("%%+d = '%+d'", n));
        results.push(sprintf("%%+d = '%+d'", u));
        results.push(sprintf("%%a = '%a'", n));
        results.push(sprintf("%%A = '%A'", n));
        var date  = new Date();
        var year  = date.getFullYear();
        var month = date.getMonth() + 1;
        var day   = date.getDate();
        var isoDate = sprintf('%04d-%02d-%02d', year, month, day);
        results.push(isoDate);
        var s = 'monkey';
        var t = 'many monkeys';
        results.push(sprintf("[%s]",      s));
        results.push(sprintf("[%10s]",    s));
        results.push(sprintf("[%-10s]",   s));
        results.push(sprintf("[%010s]",   s));
        results.push(sprintf("[%'#10s]",  s));
        results.push(sprintf("[%10.10s]", t));
        return results;
      },
      expect : [
        'There are 5 monkeys in the tree.',
        "%b = '10100111101010011010101101'",
        "%c = 'A'",
        "%d = '43951789'",
        "%e = '4.395179e+7'",
        "%u = '43951789'",
        "%u = '4251015507'",
        "%f = '43951789.000000'",
        "%o = '247523255'",
        "%s = '43951789'",
        "%x = '29ea6ad'",
        "%X = '29EA6AD'",
        "%+d = '+43951789'",
        "%+d = '-43951789'",
        "%a = 'q61f1'",
        "%A = 'Q61F1'",
        date('Y-m-d'),
        "[monkey]",
        "[    monkey]",
        "[monkey    ]",
        "[0000monkey]",
        "[####monkey]",
        "[many monke]"
      ]
    }, {
      title  : 'Pot.getExtByMimeType()',
      code   : function() {
        return getExtByMimeType('application/javascript');
      },
      expect : 'js'
    }, {
      title  : 'Pot.getMimeTypeByExt()',
      code   : function() {
        return getMimeTypeByExt('js');
      },
      expect : 'application/javascript'
    }, {
      title  : 'new Pot.ReplaceSaver()',
      code   : function() {
        var myProcess = function(string) {
          return string.replace(/&/g, '&amp;').
                        replace(/</g, '&lt;').
                        replace(/>/g, '&gt;');
        };
        var string =
          '<pre>' +
            '<b>var</b> foo = 1;' +
          '</pre>' +
          '<div>hoge</div>' +
          '<div>fuga</div>' +
          '<p onclick="alert(1)">piyo</p>' +
          '<pre>' +
            '<b>foo</b>' +
            'bar' +
            '<i>baz</i>' +
          '</pre>';
        var pattern = /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi;
        var reserve = ['<', '>'];
        var rs = new ReplaceSaver(string, pattern, reserve);
        var result = rs.save();
        result = myProcess(result);
        return rs.load(result);
      },
      expect : '<pre>' +
        '<b>var</b> foo = 1;' +
      '</pre>' +
      '&lt;div&gt;hoge&lt;/div&gt;' +
      '&lt;div&gt;fuga&lt;/div&gt;' +
      '&lt;p onclick="alert(1)"&gt;piyo&lt;/p&gt;' +
      '<pre>' +
        '<b>foo</b>' +
        'bar' +
        '<i>baz</i>' +
      '</pre>'
    }, {
      title  : 'Pot.chr()',
      code   : function() {
        var i, ok = true;
        for (i = 0; i <= 0xFFFF; i++) {
          if (chr(i) !== String.fromCharCode(i)) {
            ok = false;
            break;
          }
        }
        return [
          ok,
          chr(97),
          chr(97, 98, 99),
          chr([
            72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33
          ])
        ];
      },
      expect : [
        true,
        'a',
        'abc',
        'Hello World!'
      ]
    }, {
      title  : 'Pot.ord()',
      code   : function() {
        return ord('Hello');
      },
      expect : 72
    }, {
      title  : 'Pot.ltrim()',
      code   : function() {
        return [
          ltrim(' hoge  '),
          ltrim('a cba', 'ac')
        ];
      },
      expect : ['hoge  ', ' cba']
    }, {
      title  : 'Pot.rtrim()',
      code   : function() {
        return [
          rtrim(' hoge  '),
          rtrim('abc a', 'ac')
        ];
      },
      expect : [' hoge', 'abc ']
    }, {
      title  : 'Pot.strip()',
      code   : function() {
        return [
          strip('   Hello  World ! \r\n.'),
          strip('foo looooooooool', 'o')
        ];
      },
      expect : ['HelloWorld!.', 'f ll']
    }, {
      title  : 'Pot.indent()',
      code   : function() {
        var s1 = 'foo bar baz';
        var s2 = 'foo\nbar\nbaz';
        return [
          indent(s1),
          indent(s1, 4),
          indent(s1, 1, '\t'),
          indent(s2, 1, '\t')
        ];
      },
      expect : [
        '  foo bar baz',
        '    foo bar baz',
        '\tfoo bar baz',
        '\tfoo\n\tbar\n\tbaz'
      ]
    }, {
      title  : 'Pot.unindent()',
      code   : function() {
        var s1 = '  foo bar baz';
        var s2 = '\tfoo\n\tbar\n\tbaz';
        return [
          unindent(s1),
          unindent(s1, 4),
          unindent(s1, 1, '\t'),
          unindent(s2, 1, '\t')
        ];
      },
      expect : [
        'foo bar baz',
        '  foo bar baz',
        '  foo bar baz',
        'foo\nbar\nbaz'
      ]
    }, {
      title  : 'Pot.normalizeSpace()',
      code   : function() {
        return [
          normalizeSpace('Hello  \r\n  World  \r\n  \t !'),
          normalizeSpace('foo       bar     baz', '+')
        ];
      },
      expect : ['Hello World !', 'foo+bar+baz']
    }, {
      title  : 'Pot.splitBySpace()',
      code   : function() {
        var s = '  Hello  \r\n  World  \r\n  \t !  ';
        return splitBySpace(s);
      },
      expect : ['Hello', 'World', '!']
    }, {
      title  : 'Pot.canonicalizeNL()',
      code   : function() {
        var string = 'foo\r\nbar\rbaz\n';
        return canonicalizeNL(string);
      },
      expect : 'foo\nbar\nbaz\n'
    }, {
      title  : 'Pot.wrap()',
      code   : function() {
        var s = 'hoge';
        return [
          wrap(s, '"'),
          wrap(s, ['(', ')']),
          wrap(s, '()') + wrap(s, '[]')
        ];
      },
      expect : ['"hoge"', '(hoge)', '(hoge)[hoge]']
    }, {
      title  : 'Pot.unwrap()',
      code   : function() {
        return [
          unwrap('"hoge"', '"'),
          unwrap('(hoge)', ['(', ')']),
          unwrap(unwrap('(L(hoge)R)', '()'), ['L(', ')R'])
        ];
      },
      expect : ['hoge', 'hoge', 'hoge']
    }, {
      title  : 'Pot.startsWith()',
      code   : function() {
        return [
          startsWith('foo bar baz', 'foo'),
          startsWith('bar foo foo bar baz foo', 'foo'),
          startsWith('FoO bar foo foo bar baz foo', 'foo', true)
        ];
      },
      expect : [true, false, true]
    }, {
      title  : 'Pot.endsWith()',
      code   : function() {
        return [
          endsWith('foo bar baz', 'baz'),
          endsWith('foo bar baz foo bar', 'foo'),
          endsWith('bar foo foo bar baz FOo', 'foo', true)
        ];
      },
      expect : [true, false, true]
    }, {
      title  : 'Pot.lower()',
      code   : function() {
        return lower('Hello World!');
      },
      expect : 'hello world!'
    }, {
      title  : 'Pot.upper()',
      code   : function() {
        return upper('Hello World!');
      },
      expect : 'HELLO WORLD!'
    }, {
      title  : 'Pot.camelize()',
      code   : function() {
        return camelize('font-size');
      },
      expect : 'fontSize'
    }, {
      title  : 'Pot.hyphenize()',
      code   : function() {
        return hyphenize('fontSize');
      },
      expect : 'font-size'
    }, {
      title  : 'Pot.underscore()',
      code   : function() {
        return underscore('rawInput');
      },
      expect : 'raw_input'
    }, {
      title  : 'Pot.extract()',
      code   : function() {
        return [
          extract('foo:bar', /:(\w+)$/),
          extract('foo:bar', /^:(\w+)/),
          extract('foo.html', /(foo|bar)\.([^.]+)$/, 2),
          extract('foobar', 'foo'),
          extract('foobar', 'fo+')
        ];
      },
      expect : [
        'bar',
        '',
        'html',
        'foo',
        ''
      ]
    }, {
      title  : 'Pot.inc()',
      code   : function() {
        return [
          inc('99'),
          inc('a0'),
          inc('Az'),
          inc('zz')
        ];
      },
      expect : ['100', 'a1', 'Ba', 'aaa']
    }, {
      title  : 'Pot.dec()',
      code   : function() {
        return [
          dec('100'),
          dec('a1'),
          dec('Ba'),
          dec('aaa')
        ];
      },
      expect : ['99', 'a0', 'Az', 'zz']
    }, {
      title  : 'Pot.br()',
      code   : function() {
        var results = [];
        var string = '1. foo.\n2. bar.\n3. baz.';
        results.push(br(string));
        string = ' - foo.\n - bar.\n - baz.';
        results.push(br(string, true));
        string = '<ul><li>foo<br />fooo</li><li>bar\nbaaar</li></ul>';
        results.push(br(string));
        return results;
      },
      expect : [
        '1. foo.<br>\n2. bar.<br>\n3. baz.',
        ' - foo.<br />\n - bar.<br />\n - baz.',
        '<ul><li>foo<br />fooo</li><li>bar<br />\nbaaar</li></ul>'
      ]
    }, {
      title  : 'Pot.stripTags()',
      code   : function() {
        var html = '<div>Hoge</div>foo<br>bar<i>baz</i>';
        return trim(stripTags(html));
      },
      expect : 'Hoge foo bar baz'
    }, {
      title  : 'Pot.truncate()',
      code   : function() {
        var results = [];
        var string = 'Helloooooooooo Wooooooooorld!! Hellooooo Woooooorld!!';
        results.push(truncate(string, 10));
        string = 'foooooooo baaaaaaaaar baaaaaaaaaaz';
        results.push(truncate(string, 16, '...more'));
        return results;
      },
      expect : [
        'Hellooo...',
        'foooooooo...more'
      ]
    }, {
      title  : 'Pot.truncateMiddle()',
      code   : function() {
        var results = [];
        var string = 'Helloooooooooo Wooooooooorld!! Hellooooo Woooooorld!!';
        results.push(truncateMiddle(string, 15));
        string = 'foooooooo baaaaaaaaar baaaaaaaaaaz';
        results.push(truncateMiddle(string, 18, '(...)'));
        return results;
      },
      expect : [
        'Helloo...orld!!',
        'foooooo(...)aaaaaz'
      ]
    }, {
      title  : 'Pot.toHankakuCase()',
      code   : function() {
        return toHankakuCase('Ｈｅｌｌｏ Ｗｏｒｌｄ！ １２３４５');
      },
      expect : 'Hello World! 12345'
    }, {
      title  : 'Pot.toZenkakuCase()',
      code   : function() {
        return toZenkakuCase('Hello World! 12345');
      },
      expect : 'Ｈｅｌｌｏ Ｗｏｒｌｄ！ １２３４５'
    }, {
      title  : 'Pot.toHanSpaceCase()',
      code   : function() {
        return toHanSpaceCase(' 　hoge　 ');
      },
      expect : '  hoge  '
    }, {
      title  : 'Pot.toZenSpaceCase()',
      code   : function() {
        return toZenSpaceCase('  hoge  ');
      },
      expect : '　　hoge　　'
    }, {
      title  : 'Pot.toHiraganaCase()',
      code   : function() {
        return toHiraganaCase('ボポヴァアィイゥウェエォオ');
      },
      expect : 'ぼぽう゛ぁあぃいぅうぇえぉお'
    }, {
      title  : 'Pot.toKatakanaCase()',
      code   : function() {
        return toKatakanaCase('ぼぽう゛ぁあぃいぅうぇえぉお');
      },
      expect : 'ボポヴァアィイゥウェエォオ'
    }, {
      title  : 'Pot.toHankanaCase()',
      code   : function() {
        return toHankanaCase('ボポヴァアィイゥウェエォオ');
      },
      expect : 'ﾎﾞﾎﾟｳﾞｧｱｨｲｩｳｪｴｫｵ'
    }, {
      title  : 'Pot.toZenkanaCase()',
      code   : function() {
        return toZenkanaCase('ﾎﾞﾎﾟｳﾞｧｱｨｲｩｳｪｴｫｵ');
      },
      expect : 'ボポヴァアィイゥウェエォオ'
    }]
  });
  Assert.run();
});


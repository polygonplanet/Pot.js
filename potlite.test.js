/**
 * PotLite.js - Run Test
 *
 * @description
 *  Run Test for PotLite.js
 *
 * @description
 *  PotLite.js用のテストスクリプト
 *
 * @fileoverview   PotLite.js Run test
 * @author         polygon planet
 * @version        1.01
 * @date           2011-10-29
 * @copyright      Copyright (c) 2011 polygon planet <polygon.planet*gmail.com>
 * @license        Dual licensed under the MIT and GPL v2 licenses.
 */
var Assert = {
  JSON_URL  : './potlite.test.json',
  JSONP_URL : 'http://api.polygonpla.net/js/pot/potlite.test.json'
};

$(function() {
  update(Assert, {
    results : [],
    OUTPUT  : $('#output').get(0),
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
              if (isWindow(o) || isDocument(o) || isNodeLike(o) ||
                  isWindow(x) || isDocument(x) || isNodeLike(x)) {
                result = (o === x);
              } else if (Assert.isEmpty(o) && Asset.isEmpty(x)) {
                result = true;
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
              if (isInt(x) && o == x) {
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
                r[r.length] = k + ': ' + me(k);
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
              .html(trim(code.toString()))
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
        return wait(0);
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
      }).wait(1).ensure(function() {
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
      title  : 'Pot.isArrayLike()',
      code   : function() {
        return (function() {
          return isArrayLike(arguments);
        })();
      },
      expect : true
    }, {
      title  : 'Pot.isDeferred()',
      code   : function() {
        var d = new Deferred();
        return isDeferred(d);
      },
      expect : true
    }, {
      title  : 'Pot.isIter()',
      code   : function() {
        var iter = new Iter();
        return isIter(iter);
      },
      expect : true
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
        return request('./potlite.test.json', {
          mimeType : 'text/plain'
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
        var url = 'http://api.polygonpla.net/js/pot/potlite.test.json?callback=?';
        return jsonp(url).then(function(data) {
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
      title  : 'Pot.parseFromQueryString()',
      code   : function() {
        var queryString = 'foo=1&bar=bar2&baz=%7B3%7D';
        return parseFromQueryString(queryString, true);
      },
      expect : {foo: '1', bar: 'bar2', baz: '{3}'}
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
          return args.input + args.result;
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
          return args.input + args.result;
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
    }]
  });
  Assert.run();
});


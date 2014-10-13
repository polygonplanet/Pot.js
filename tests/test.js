var assert = require('assert');
var pot = require('../pot');


var tests = [{
  title : 'Pot.update()',
  code  : function() {
    var obj = {foo: 1};
    pot.update(obj, {bar: 2}, {baz: 3});
    return obj;
  },
  expect : {foo: 1, bar: 2, baz: 3}
}, {
  title : 'Pot.stringify()',
  code  : function() {
    return [
      pot.stringify(null),
      pot.stringify((void 0)),
      pot.stringify('foo'),
      pot.stringify(new String('bar')),
      pot.stringify([100]),
      pot.stringify({})
    ];
  },
  expect : ['', '', 'foo', 'bar', '', '']
}, {
  title : 'Pot.arrayize()',
  code  : function() {
    return [
      pot.arrayize(null),
      pot.arrayize((void 0)),
      pot.arrayize('foo'),
      pot.arrayize([]),
      pot.arrayize([[100]]),
      (function() {
        return pot.arrayize(arguments);
      })(1, 2, 3)
    ];
  },
  expect : [
    [null], [(void 0)], ['foo'], [], [[100]], [1, 2, 3]
  ]
}, {
  title  : 'Pot.numeric()',
  code   : function() {
    return [
      pot.numeric(0),
      pot.numeric(1234567890),
      pot.numeric(new Number(25)),
      pot.numeric(null),
      pot.numeric((void 0)),
      pot.numeric(true),
      pot.numeric(false),
      pot.numeric('abc'),
      pot.numeric('0xFF'),
      pot.numeric('1e8'),
      pot.numeric('10px'),
      pot.numeric('1,000,000ms.'),
      pot.numeric('-512 +1'),
      pot.numeric([]),
      pot.numeric(['hoge'])
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
    return new RegExp('^(' + pot.rescape(pattern) + ')$', 'g');
  },
  expect : /^(\*\[hoge\]\*)$/g
}, {
  title : 'Pot.trim()',
  code  : function() {
    return pot.trim(' \t\r\nhoge \r ');
  },
  expect : 'hoge'
}, {
  title : 'Pot.isBoolean()',
  code  : function() {
    return [pot.isBoolean(true), pot.isBoolean('hoge')];
  },
  expect : [true, false]
}, {
  title : 'Pot.isNumber()',
  code  : function() {
    return [pot.isNumber(123), pot.isNumber('123')];
  },
  expect : [true, false]
}, {
  title : 'Pot.isString()',
  code  : function() {
    return [pot.isString('abc'), pot.isString(123)];
  },
  expect : [true, false]
}, {
  title : 'Pot.isFunction()',
  code  : function() {
    return [
      pot.isFunction((function() {})),
      pot.isFunction(123)
    ];
  },
  expect : [true, false]
}, {
  title  : 'Pot.isArray()',
  code   : function() {
    return [pot.isArray([123]), pot.isArray(123)];
  },
  expect : [true, false]
}, {
  title  : 'Pot.isDate()',
  code   : function() {
    return [pot.isDate(new Date()), pot.isDate(123)];
  },
  expect : [true, false]
}, {
  title  : 'Pot.isRegExp()',
  code   : function() {
    return [pot.isRegExp(/\s+/g), pot.isRegExp(123)];
  },
  expect : [true, false]
}, {
  title  : 'Pot.isObject()',
  code   : function() {
    return [pot.isObject({a: 1, b: 2, c: 3}), pot.isObject(123)];
  },
  expect : [true, false]
}, {
  title  : 'Pot.isError()',
  code   : function() {
    return [pot.isError(new Error('error!')), pot.isError(123)];
  },
  expect : [true, false]
}, {
  title  : 'Pot.typeOf()',
  code   : function() {
    return pot.typeOf([1, 2, 3]);
  },
  expect : 'array'
}, {
  title  : 'Pot.isStopIter()',
  code   : function() {
    try {
      throw pot.StopIteration;
    } catch (e) {
      return pot.isStopIter(e);
    }
  },
  expect : true
}, {
  title  : 'Pot.isIterable()',
  code   : function() {
    var iter = new pot.Iter();
    var i = 0;
    iter.next = function() {
      if (i > 5) {
        throw pot.StopIteration;
      }
      return i++;
    };
    return pot.isIterable(iter);
  },
  expect : true
}, {
  title  : 'Pot.isScalar()',
  code   : function() {
    return [
      pot.isScalar(null),
      pot.isScalar((void 0)),
      pot.isScalar(''),
      pot.isScalar('abc'),
      pot.isScalar(0),
      pot.isScalar(123),
      pot.isScalar(false),
      pot.isScalar(true),
      pot.isScalar(new Boolean(true)),
      pot.isScalar([]),
      pot.isScalar([1, 2, 3]),
      pot.isScalar(/hoge/),
      pot.isScalar(new Error()),
      pot.isScalar({}),
      pot.isScalar({a: 1, b: 2})
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
  title  : 'Pot.isBlob()',
  code   : function() {
    if (!pot.System.createBlob) {
      return [true, false, false];
    } else {
      var blob = pot.createBlob('hoge');
      return [
        pot.isBlob(blob),
        pot.isBlob({}),
        pot.isBlob('hoge')
      ];
    }
  },
  expect : [true, false, false]
}, {
  title  : 'Pot.isFileReader()',
  code   : function() {
    if (!pot.System.hasFileReader) {
      return [false, true];
    } else {
      var object = {hoge : 1};
      var reader = new FileReader();
      return [
        pot.isFileReader(object),
        pot.isFileReader(reader)
      ];
    }
  },
  expect : [false, true]
}, {
  title  : 'Pot.isImage()',
  code   : function() {
    if (typeof Image === 'undefined') {
      return [false, true];
    } else {
      var object = {hoge : 1};
      var image = new Image();
      return [
        pot.isImage(object),
        pot.isImage(image)
      ];
    }
  },
  expect : [false, true]
}, {
  title  : 'Pot.isArguments()',
  code   : function() {
    var result = [];
    (function(a, b, c) {
      var obj = {foo : 1};
      var arr = [1, 2, 3];
      result.push(pot.isArguments(obj));
      result.push(pot.isArguments(arr));
      result.push(pot.isArguments(arguments));
    }(1, 2, 3));
    return result;
  },
  expect : [false, false, true]
}, {
  title  : 'Pot.isTypedArray()',
  code   : function() {
    var result = [];
    var obj = {foo : 1};
    var arr = [1, 2, 3];
    result.push(pot.isTypedArray(obj));
    result.push(pot.isTypedArray(arr));
    if (pot.System.hasTypedArray) {
      result.push(pot.isTypedArray(new ArrayBuffer(10)));
      result.push(pot.isTypedArray(new Uint8Array(10)));
    } else {
      result.push(true, true);
    }
    return result;
  },
  expect : [false, false, true, true]
}, {
  title  : 'Pot.isArrayBuffer()',
  code   : function() {
    if (!pot.System.hasTypedArray) {
      return [false, false, true, false];
    } else {
      var obj = {foo : 1};
      var arr = [1, 2, 3];
      var buf = new ArrayBuffer(10);
      var uar = new Uint8Array(10);
      return [
        pot.isArrayBuffer(obj),
        pot.isArrayBuffer(arr),
        pot.isArrayBuffer(buf),
        pot.isArrayBuffer(uar)
      ];
    }
  },
  expect : [false, false, true, false]
}, {
  title  : 'Pot.isArrayLike()',
  code   : function() {
    return (function() {
      return pot.isArrayLike(arguments);
    })();
  },
  expect : true
}, {
  title  : 'Pot.isPlainObject()',
  code   : function() {
    var obj1 = {};
    var obj2 = {foo: 1, bar: 2, baz: 3};
    var obj3 = Boolean;
    return [
      pot.isPlainObject(obj1),
      pot.isPlainObject(obj2),
      pot.isPlainObject(obj3)
    ];
  },
  expect : [true, true, false]
}, {
  title  : 'Pot.isEmpty()',
  code   : function() {
    return [
      pot.isEmpty(null),
      pot.isEmpty(true),
      pot.isEmpty(false),
      pot.isEmpty(0),
      pot.isEmpty(-524560620),
      pot.isEmpty(0.1205562),
      pot.isEmpty(''),
      pot.isEmpty('abc'),
      pot.isEmpty(new String()),
      pot.isEmpty([]),
      pot.isEmpty([1, 2, 3]),
      pot.isEmpty([[]]),
      pot.isEmpty(new Array()),
      pot.isEmpty(new Array('a', 'b')),
      pot.isEmpty({a:1, b:2, c:3}),
      pot.isEmpty({}),
      pot.isEmpty(new Object()),
      pot.isEmpty((void 0)),
      pot.isEmpty((function() {})),
      pot.isEmpty((function(a, b) { return a + b; }))
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
    var d = new pot.Deferred();
    var o = {};
    return [pot.isDeferred(d), pot.isDeferred(o)];
  },
  expect : [true, false]
}, {
  title  : 'Pot.isIter()',
  code   : function() {
    var obj = {};
    var iter = new pot.Iter();
    return [pot.isIter(iter), pot.isIter(obj)];
  },
  expect : [true, false]
}, {
  title  : 'Pot.isWorkeroid()',
  code   : function() {
    var o = {hoge : 1};
    var w = new pot.Workeroid();
    return [pot.isWorkeroid(o), pot.isWorkeroid(w)];
  },
  expect : [false, true]
}, {
  title  : 'Pot.isArrayBufferoid()',
  code   : function() {
    var o = {hoge: 1};
    var a = new pot.ArrayBufferoid();
    return [pot.isArrayBufferoid(o), pot.isArrayBufferoid(a)];
  },
  expect : [false, true]
}, {
  title  : 'Pot.isHash()',
  code   : function() {
    var hash = new pot.Hash();
    var obj = {};
    return [pot.isHash(hash), pot.isHash(obj)];
  },
  expect : [true, false]
}, {
  title  : 'Pot.isJSEscaped()',
  code   : function() {
    return [
      pot.isJSEscaped('abc'),
      pot.isJSEscaped('abc\\hoge".'),
      pot.isJSEscaped('\\u007b\\x20hoge\\x20\\u007d')
    ];
  },
  expect : [true, false, true]
}, {
  title  : 'Pot.isPercentEncoded()',
  code   : function() {
    return [
      pot.isPercentEncoded('abc'),
      pot.isPercentEncoded('abc["hoge"]'),
      pot.isPercentEncoded('%7B%20hoge%20%7D')
    ];
  },
  expect : [true, false, true]
}, {
  title  : 'Pot.isHTMLEscaped()',
  code   : function() {
    return [
      pot.isHTMLEscaped('abc'),
      pot.isHTMLEscaped('1 < 2'),
      pot.isHTMLEscaped('&quot;(&gt;_&lt;)&quot;')
    ];
  },
  expect : [true, false, true]
}, {
  title  : 'Pot.isNumeric()',
  code   : function() {
    return [
      pot.isNumeric(123),
      pot.isNumeric('1e8'),
      pot.isNumeric('10px')
    ];
  },
  expect : [true, true, false]
}, {
  title  : 'Pot.isInt()',
  code   : function() {
    return [
      pot.isInt(0.1205562),
      pot.isInt(1.5),
      pot.isInt(12345)
    ];
  },
  expect : [false, false, true]
}, {
  title  : 'Pot.isBuiltinMethod()',
  code   : function() {
    return [
      pot.isBuiltinMethod((function() {})),
      pot.isBuiltinMethod(Array.prototype.slice)
    ];
  },
  expect : [false, true]
}, {
  title  : 'Pot.getFunctionCode()',
  code   : function() {
    return [
      pot.getFunctionCode(function() { return 'hoge'; }).replace(/^\s*[(]+\s*|\s*[)]+\s*$/g, ''),
      pot.getFunctionCode('function() { return 1; }'),
      pot.getFunctionCode(1),
      pot.getFunctionCode(false),
      pot.getFunctionCode(true),
      pot.getFunctionCode(null),
      pot.getFunctionCode(void 0),
      pot.getFunctionCode({}),
      pot.getFunctionCode(new Function('return 1')).replace(/^\s*[(]+\s*|\s*[)]+\s*$/g, '')
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
      pot.isWords(' '),
      pot.isWords('abc'),
      pot.isWords('\u307b\u3052'),
      pot.isWords('\r\n'),
      pot.isWords(' \n'),
      pot.isWords(' abc'),
      pot.isWords('abc '),
      pot.isWords('_'),
      pot.isWords(false),
      pot.isWords(true),
      pot.isWords(void 0),
      pot.isWords({}),
      pot.isWords(['ABC']),
      pot.isWords('$hoge'),
      pot.isWords('$_')
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
      pot.isNL('abc'),
      pot.isNL(' '),
      pot.isNL('\n'),
      pot.isNL('\r'),
      pot.isNL('\r\n'),
      pot.isNL('\nhoge'),
      pot.isNL('\r \n'),
      pot.isNL('\r\n\r\n'),
      pot.isNL('\u2028\u2029'),
      pot.isNL(null),
      pot.isNL(void 0),
      pot.isNL(false),
      pot.isNL(true),
      pot.isNL(new String('\n')),
      pot.isNL({}),
      pot.isNL(['\n'])
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
      "use strict";
      var a = 1, b = 0.5, c = String(1), $d = /'\/'/g;
      return $d.test(c) ? a : b;
    };
    return pot.tokenize(hoge);
  },
  expect : [
    'function', '(', ')', '{', '\n',
      '"use strict"', ';', '\n',
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
      "use strict";
      var a = 1, b = 0.5, c = String(1), $d = /'\/'/g;
      return $d.test(c) ? a : b;
    };
    return pot.joinTokens(pot.tokenize(hoge));
  },
  expect : 'function(){\n' +
    '"use strict";\n' +
    'var a=1,b=0.5,c=String(1),$d=/\'\\/\'/g;\n' +
    'return $d.test(c)?a:b;\n' +
  '}'
}, {
  title  : 'Pot.hasReturn()',
  code   : function() {
    return [
      pot.hasReturn(function() {
        return 'hoge';
      }),
      pot.hasReturn(function() {
        var hoge = 1;
      }),
      pot.hasReturn(function return_test(return1, return$2) {
        /* dummy comment: return 'hoge'; */
        var $return = 'return(1)' ? (function(a) {
          if (a) {
            return true;
          }
          return false;
        })(/return true/) : "return false";
      }),
      pot.hasReturn(function() {
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
    pot.override(Hoge, 'addHoge', function(inherits, args) {
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
    return pot.getErrorMessage(new Error('ErrorMessage'));
  },
  expect : 'ErrorMessage'
}, {
  title  : 'Pot.createConstructor()',
  code   : function() {
    var result = [];
    var Hoge = pot.createConstructor('Hoge', {
      init : function(a, b, c) {
        this.value = a + b + c;
      },
      getHoge : function() {
        return 'hogehoge';
      }
    });
    result.push(new Hoge(1, 2, 3).value); // 6
    result.push(new Hoge().getHoge());    // 'hogehoge'

    var Fuga = pot.createConstructor({
      value : 1,
      addValue : function(v) {
        this.value += v;
        return this;
      },
      getValue : function() {
        return this.value;
      }
    }, function(a, b, c) {
      this.value += a + b + c;
    });
    result.push(new Fuga(1, 2, 3).value); // 7
    result.push(new Fuga(1, 2, 3).addValue(10).getValue()); // 17

    var Piyo = pot.createConstructor('Piyo', {
      initialize : function(a, b, c) {
        this.value = a + b + c;
      },
      getValue : function() {
        return this.value;
      }
    }, 'initialize');
    result.push(new Piyo(10, 20, 30).getValue()); // 60
    return result;
  },
  expect : [6, 'hogehoge', 7, 17, 60]
}, {
  title  : 'Pot.Plugin methods',
  code   : function() {
    var results = [];
    pot.addPlugin('myFunc', function(msg) {
      return 'myFunc: ' + msg;
    });
    results.push(pot.myFunc('Hello!'));
    results.push(pot.hasPlugin('myFunc'));
    pot.addPlugin('myFunc2', function(a, b) {
      return a + b;
    });
    results.push(pot.myFunc2(1, 2));
    results.push(pot.addPlugin('myFunc', function() {}));
    results.push(pot.listPlugin());
    results.push(pot.removePlugin('myFunc'));
    results.push(pot.hasPlugin('myFunc'));
    results.push(pot.listPlugin());
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
    pot.addPlugin({
      foo : function() { return 'foo!'; },
      bar : function() { return 'bar!'; },
      baz : function() { return 'baz!'; }
    });
    results.push(pot.foo() + pot.bar() + pot.baz());
    pot.addPlugin('hoge', function() { return 'hoge!'; });
    var newHoge = function() { return 'NewHoge!' };
    results.push(pot.addPlugin('hoge', newHoge));
    results.push(pot.addPlugin('hoge', newHoge, true));
    results.push(pot.hoge());
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
    pot.addPlugin('myToArray', toArray);
    var results = [];
    results.push(pot.myToArray('abc'));
    return pot.myToArray.deferred('abc').then(function(res) {
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
    results.push(pot.trim(string));
    pot.addPlugin('trim', function(s) {
      return s.replace(/^ +| +$/g, '');
    });
    results.push(pot.trim(string));
    pot.removePlugin('trim');
    results.push(pot.trim(string));
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
      pot.range(1, 5),
      pot.range('a', 'f'),
      pot.range({begin: 0, end: 100, step: 25})
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
      pot.indexOf(arr, 2),
      pot.indexOf(arr, 7),
      pot.indexOf(obj, 2),
      pot.indexOf(obj, 7)
    ];
  },
  expect : [0, -1, 'a', -1]
}, {
  title  : 'Pot.lastIndexOf()',
  code   : function() {
    var arr = [2, 5, 9, 2];
    var obj = {a: 2, b: 5, c: 9, d: 2};
    return [
      pot.lastIndexOf(arr, 2),
      pot.lastIndexOf(arr, 7),
      pot.lastIndexOf(arr, 2, 3),
      pot.lastIndexOf(arr, 2, 2),
      pot.lastIndexOf(arr, 2, -2),
      pot.lastIndexOf(obj, 2),
      pot.lastIndexOf(obj, 7),
      pot.lastIndexOf(obj, 2, 'd'),
      pot.lastIndexOf(obj, 2, 'c')
    ];
  },
  expect : [3, -1, 3, 0, 0, 'd', -1, 'd', 'a']
}, {
  title  : 'Pot.serializeToJSON()',
  code   : function() {
    var obj = {foo: '"1"', bar: 2, baz: null};
    return pot.serializeToJSON(obj);
  },
  expect : '{"foo":"\\"1\\"","bar":2,"baz":null}'
}, {
  title  : 'Pot.parseFromJSON()',
  code   : function() {
    var data = '{"foo":"FOO\\u0020\\"1\\"","bar":2,"baz":null}';
    return pot.parseFromJSON(data);
  },
  expect : {foo: 'FOO "1"', bar: 2, baz: null}
}, {
  title  : 'Pot.serializeToQueryString()',
  code   : function() {
    var obj = {foo: 1, bar: 'bar2', baz: null}
    return pot.serializeToQueryString(obj);
  },
  expect : 'foo=1&bar=bar2&baz='
}, {
  title  : 'Pot.serializeToQueryString() for Array',
  code   : function() {
    var obj = {foo: 'bar', baz: ['qux', 'quux'], corge: ''};
    return pot.serializeToQueryString(obj);
  },
  expect : 'foo=bar&baz%5B%5D=qux&baz%5B%5D=quux&corge='
}, {
  title  : 'Pot.parseFromQueryString()',
  code   : function() {
    var queryString = 'foo=1&bar=bar2&baz=%7B3%7D';
    return pot.parseFromQueryString(queryString, true);
  },
  expect : {foo: '1', bar: 'bar2', baz: '{3}'}
}, {
  title  : 'Pot.parseFromQueryString() for Array',
  code   : function() {
    var queryString = 'foo=bar&baz[]=qux&baz[]=quux&corge=';
    return pot.parseFromQueryString(queryString, true);
  },
  expect : {foo: 'bar', baz: ['qux', 'quux'], corge: ''}
}, {
  title  : 'Pot.parseFromQueryString() for Array Strict',
  code   : function() {
    var queryString = 'foo=bar&baz%5B%5D=qux&baz%5B%5D=quux&corge=';
    return pot.parseFromQueryString(queryString, true);
  },
  expect : {foo: 'bar', baz: ['qux', 'quux'], corge: ''}
}, {
  title  : 'Pot.parseFromQueryString() for Array with Items',
  code   : function() {
    var queryString = 'foo=bar&baz%5B%5D=qux&baz%5B%5D=quux&corge=';
    return pot.parseFromQueryString(queryString);
  },
  expect : [['foo', 'bar'], ['baz', 'qux'], ['baz', 'quux'], ['corge', '']]
}, {
  title  : 'Pot.urlEncode()',
  code   : function() {
    return pot.urlEncode('(a+b)*c=?');
  },
  expect : '(a%2Bb)*c%3D%3F'
}, {
  title  : 'Pot.urlDecode()',
  code   : function() {
    return pot.urlDecode('(a%2Bb)*c+%3D+%3F');
  },
  expect : '(a+b)*c = ?'
}, {
  title  : 'Pot.parseURI()',
  code   : function() {
    return pot.parseURI(
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
      pot.buildURI('http://www.example.com/', {
        foo : '{foo}',
        bar : '{bar}'
      }),
      pot.buildURI('http://www.example.com/test?a=1', [
        ['prototype',    '{foo}'],
        ['__iterator__', '{bar}'],
      ]),
      pot.buildURI('http://www.example.com/test?a=1', 'b=2&c=3'),
      pot.buildURI({
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
      pot.buildURI(pot.parseURI('http://user:pass@host:8000/path/to/file.ext?arg=value#fragment')),
      pot.buildURI({
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
    results.push(pot.resolveRelativeURI(
      'C:/path/to/foo/bar/../hoge.ext'
    ));
    results.push(pot.resolveRelativeURI(
      'C:/path/to/../../hoge.ext'
    ));
    results.push(pot.resolveRelativeURI(
      'C:/path/to/../../../../././../../hoge.ext'
    ));
    results.push(pot.resolveRelativeURI(
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
      pot.getExt('foo.html'),
      pot.getExt('C:\\foo\\bar\\baz.tmp.txt'),
      pot.getExt('http://www.example.com/file.html?q=hoge.js'),
      pot.getExt('http://www.example.com/?output=hoge.xml#fuga.piyo'),
      pot.getExt('http://www.example.com/?q=hoge'),
      pot.getExt('http://www.example.com/http%3A%2F%2Fwww.example.com%2Ffoo%2Ejs')
    ];
  },
  expect : [
    'html', 'txt', 'html', 'xml', '', 'js'
  ]
}, {
  title  : 'Pot.toDataURI()',
  code   : function() {
    return [
      pot.toDataURI('Hello World!', 'text/plain', false, 'UTF-8', false),
      pot.toDataURI('Hello World!', 'text/plain', true, 'UTF-8', false),
      pot.toDataURI({
        data     : 'Hello World!',
        mimeType : 'html',
        base64   : true
      }),
      pot.toDataURI({
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
  title  : 'Pot.dump()',
  code   : function() {
    var reg = /^[a-z]+$/g;
    var err = new Error('error!');
    var str = new String('hello');
    var arr = [1, 2, 3, {a: 4, b: 5, c: true}, false, null];
    var obj = {
      key1 : 'val1',
      key2 : 'val2',
      arr  : arr,
      arr2 : arr,
      strs : [str, str],
      err  : err,
      err2 : err,
      reg1 : reg,
      reg2 : reg,
      reg3 : reg
    };
    obj.obj = obj;
    return pot.dump(obj);
  },
  expect : '#0 {key1: "val1", key2: "val2", ' +
           'arr: #3 [1, 2, 3, {a: 4, b: 5, c: true}, ' +
           'false, null], arr2: #3, ' +
           'strs: [#5 (new String("hello")), #5], ' +
           'err: #6 (new Error("error!")), ' +
           'err2: #6, reg1: #8 (new RegExp(/^[a-z]+$/g)), ' +
           'reg2: #8, reg3: #8, obj: #0}'
}, {
  title  : 'Pot.forEach() with Array',
  code   : function() {
    var s = '';
    pot.forEach([1, 2, 3], function(val, i, array) {
      s += val;
    });
    return s;
  },
  expect : '123'
}, {
  title  : 'Pot.forEach() with Object',
  code   : function() {
    var s = '';
    pot.forEach({foo: 1, bar: 2, baz: 3}, function(val, key, obj) {
      s += key + val + ';';
    });
    return s;
  },
  expect : 'foo1;bar2;baz3;'
}, {
  title  : 'Pot.Deferred.forEach() with Array',
  code   : function() {
    var s = '';
    return pot.Deferred.forEach([1, 2, 3], function(val, i) {
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
    return pot.Deferred.forEach({foo: 1, bar: 2, baz: 3}, function(val, key) {
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
    var d = new pot.Deferred();
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
    var d = new pot.Deferred();
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
    pot.repeat(10, function(i) {
      a.push(i);
    });
    return a;
  },
  expect : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}, {
  title  : 'Pot.repeat() with Object',
  code   : function() {
    var a = [];
    pot.repeat({begin: 0, end: 100, step: 20}, function(i) {
      a.push(i);
    });
    return a;
  },
  expect : [0, 20, 40, 60, 80]
}, {
  title  : 'Pot.Deferred.repeat() with Number',
  code   : function() {
    var a = [];
    return pot.Deferred.repeat(10, function(i) {
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
    return pot.Deferred.repeat({begin: 0, end: 100, step: 20}, function(i) {
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
    var d = new pot.Deferred();
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
    var d = new pot.Deferred();
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
    pot.forEver(function(i) {
      s += i + ':' + a;
      if (s.length > 50) {
        throw pot.StopIteration;
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
    return pot.Deferred.forEver(function(i) {
      s += i + ':' + a;
      if (s.length > 50) {
        throw pot.StopIteration;
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
    var d = new pot.Deferred();
    return d.forEver(function(i) {
      s += i + ':' + a;
      if (s.length > 50) {
        throw pot.StopIteration;
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
    var iter = new pot.Iter();
    iter.next = (function() {
      var i = 0;
      var end = 10;
      return function() {
        if (i >= end) {
          throw pot.StopIteration;
        }
        return i++;
      };
    })();
    pot.iterate(iter, function(i) {
      results.push(i);
    });
    return results;
  },
  expect : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}, {
  title  : 'Pot.Deferred.iterate()',
  code   : function() {
    var results = [];
    var iter = new pot.Iter();
    iter.next = (function() {
      var i = 0;
      var end = 10;
      return function() {
        if (i >= end) {
          throw pot.StopIteration;
        }
        return i++;
      };
    })();
    return pot.Deferred.iterate(iter, function(i) {
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
    var iter = new pot.Iter();
    iter.next = (function() {
      var i = 0;
      var end = 10;
      return function() {
        if (i >= end) {
          throw pot.StopIteration;
        }
        return i++;
      };
    })();
    var d = new pot.Deferred();
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
    var iter = pot.toIter(arr);
    var results = [];
    pot.iterate(iter, function(i) {
      results.push(i * 100);
    });
    return results.join('+');
  },
  expect : '100+200+300+400+500'
}, {
  title  : 'Pot.items() with Array',
  code   : function() {
    return pot.items(['foo', 'bar', 'baz']);
  },
  expect : [[0, 'foo'], [1, 'bar'], [2, 'baz']]
}, {
  title  : 'Pot.items() with Object',
  code   : function() {
    return pot.items({foo: 1, bar: 2, baz: 3});
  },
  expect : [['foo', 1], ['bar', 2], ['baz', 3]]
}, {
  title  : 'Pot.Deferred.items() with Array',
  code   : function() {
    return pot.Deferred.items(['foo', 'bar', 'baz']);
  },
  expect : [[0, 'foo'], [1, 'bar'], [2, 'baz']]
}, {
  title  : 'Pot.Deferred.items() with Object',
  code   : function() {
    return pot.Deferred.items({foo: 1, bar: 2, baz: 3});
  },
  expect : [['foo', 1], ['bar', 2], ['baz', 3]]
}, {
  title  : 'Pot.Deferred.items() with Array on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.items().begin(['foo', 'bar', 'baz']);
  },
  expect : [[0, 'foo'], [1, 'bar'], [2, 'baz']]
}, {
  title  : 'Pot.Deferred.items() with Object on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.items().begin({foo: 1, bar: 2, baz: 3});
  },
  expect : [['foo', 1], ['bar', 2], ['baz', 3]]
}, {
  title  : 'Pot.items() with callback',
  code   : function() {
    return pot.items({foo: 1, bar: 2, baz: 3}, function(item) {
      return [item[0] + '::' + item[1]];
    });
  },
  expect : [['foo::1'], ['bar::2'], ['baz::3']]
}, {
  title  : 'Pot.Deferred.items() with callback',
  code   : function() {
    return pot.Deferred.items({foo: 1, bar: 2, baz: 3}, function(item) {
      return [item[0] + '::' + item[1]];
    });
  },
  expect : [['foo::1'], ['bar::2'], ['baz::3']]
}, {
  title  : 'Pot.Deferred.items() with callback on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.items(function(item) {
      return [item[0] + '::' + item[1]];
    }).begin({foo: 1, bar: 2, baz: 3});
  },
  expect : [['foo::1'], ['bar::2'], ['baz::3']]
}, {
  title  : 'Pot.zip()',
  code   : function() {
    return pot.zip([[1, 2, 3], [4, 5, 6]]);
  },
  expect : [[1, 4], [2, 5], [3, 6]]
}, {
  title  : 'Pot.zip() for other length',
  code   : function() {
    return pot.zip([[1, 2, 3], [1, 2, 3, 4, 5]]);
  },
  expect : [[1, 1], [2, 2], [3, 3]]
}, {
  title  : 'Pot.zip() with callback',
  code   : function() {
    return pot.zip([[1, 2, 3], [4, 5, 6]], function(items) {
      return items[0] + items[1];
    });
  },
  expect : [5, 7, 9]
}, {
  title  : 'Pot.Deferred.zip()',
  code   : function() {
    return pot.Deferred.zip([[1, 2, 3], [4, 5, 6]]);
  },
  expect : [[1, 4], [2, 5], [3, 6]]
}, {
  title  : 'Pot.Deferred.zip() with callback',
  code   : function() {
    return pot.zip([[1, 2, 3], [4, 5, 6]], function(items) {
      return items[0] + items[1];
    });
  },
  expect : [5, 7, 9]
}, {
  title  : 'Pot.Deferred.zip() on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.zip().begin([[1, 2, 3], [4, 5, 6]]);
  },
  expect : [[1, 4], [2, 5], [3, 6]]
}, {
  title  : 'Pot.Deferred.zip() with callback on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.zip(function(items) {
      return items[0] + items[1];
    }).begin([[1, 2, 3], [4, 5, 6]]);
  },
  expect : [5, 7, 9]
}, {
  title  : 'Pot.map() with Array',
  code   : function() {
    var words = ['foot', 'goose', 'moose'];
    return pot.map(words, function(val) {
      return val.replace(/o/g, 'e');
    });
  },
  expect : ['feet', 'geese', 'meese']
}, {
  title  : 'Pot.map() with Object',
  code   : function() {
    var words = {A: 'foot', B: 'goose', C: 'moose'};
    return pot.map(words, function(val) {
      return val.replace(/o/g, 'e');
    });
  },
  expect : {A: 'feet', B: 'geese', C: 'meese'}
}, {
  title  : 'Pot.Deferred.map() with Array',
  code   : function() {
    var words = ['foot', 'goose', 'moose'];
    return pot.Deferred.map(words, function(val) {
      return val.replace(/o/g, 'e');
    });
  },
  expect : ['feet', 'geese', 'meese']
}, {
  title  : 'Pot.Deferred.map() with Object',
  code   : function() {
    var words = {A: 'foot', B: 'goose', C: 'moose'};
    return pot.Deferred.map(words, function(val) {
      return val.replace(/o/g, 'e');
    });
  },
  expect : {A: 'feet', B: 'geese', C: 'meese'}
}, {
  title  : 'Pot.Deferred.map() with Array on chain',
  code   : function() {
    var words = ['foot', 'goose', 'moose'];
    var d = new pot.Deferred();
    return d.map(function(val) {
      return val.replace(/o/g, 'e');
    }).begin(words);
  },
  expect : ['feet', 'geese', 'meese']
}, {
  title  : 'Pot.Deferred.map() with Object on chain',
  code   : function() {
    var words = {A: 'foot', B: 'goose', C: 'moose'};
    var d = new pot.Deferred();
    return d.map(function(val) {
      return val.replace(/o/g, 'e');
    }).begin(words);
  },
  expect : {A: 'feet', B: 'geese', C: 'meese'}
}, {
  title  : 'Pot.filter() with Array',
  code   : function() {
    return pot.filter([12, 5, 8, 130, 45], function(val) {
      return (val >= 10);
    });
  },
  expect : [12, 130, 45]
}, {
  title  : 'Pot.filter() with Object',
  code   : function() {
    return pot.filter({A: 12, B: 5, C: 8, D: 130, E: 45}, function(val) {
      return (val >= 10);
    });
  },
  expect : {A: 12, D: 130, E: 45}
}, {
  title  : 'Pot.Deferred.filter() with Array',
  code   : function() {
    return pot.Deferred.filter([12, 5, 8, 130, 45], function(val) {
      return (val >= 10);
    });
  },
  expect : [12, 130, 45]
}, {
  title  : 'Pot.Deferred.filter() with Object',
  code   : function() {
    return pot.Deferred.filter({A: 12, B: 5, C: 8, D: 130, E: 45}, function(val) {
      return (val >= 10);
    });
  },
  expect : {A: 12, D: 130, E: 45}
}, {
  title  : 'Pot.Deferred.filter() with Array on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.filter(function(val) {
      return (val >= 10);
    }).begin([12, 5, 8, 130, 45]);
  },
  expect : [12, 130, 45]
}, {
  title  : 'Pot.Deferred.filter() with Object on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.filter(function(val) {
      return (val >= 10);
    }).begin({A: 12, B: 5, C: 8, D: 130, E: 45});
  },
  expect : {A: 12, D: 130, E: 45}
}, {
  title  : 'Pot.reduce() with Array',
  code   : function() {
    return pot.reduce([1, 2, 3, 4, 5], function(a, b) {
      return a + b;
    });
  },
  expect : 15
}, {
  title  : 'Pot.reduce() with Object',
  code   : function() {
    return pot.reduce({A: 1, B: 2, C: 3, D: 4, E: 5}, function(a, b) {
      return a + b;
    });
  },
  expect : 15
}, {
  title  : 'Pot.Deferred.reduce() with Array',
  code   : function() {
    return pot.Deferred.reduce([1, 2, 3, 4, 5], function(a, b) {
      return a + b;
    });
  },
  expect : 15
}, {
  title  : 'Pot.Deferred.reduce() with Object',
  code   : function() {
    return pot.Deferred.reduce({A: 1, B: 2, C: 3, D: 4, E: 5}, function(a, b) {
      return a + b;
    });
  },
  expect : 15
}, {
  title  : 'Pot.Deferred.reduce() with Array on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.reduce(function(a, b) {
      return a + b;
    }).begin([1, 2, 3, 4, 5]);
  },
  expect : 15
}, {
  title  : 'Pot.Deferred.reduce() with Object on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.reduce(function(a, b) {
      return a + b;
    }).begin({A: 1, B: 2, C: 3, D: 4, E: 5});
  },
  expect : 15
}, {
  title  : 'Pot.every() with Array',
  code   : function() {
    return pot.every([12, 54, 18, 130, 45], function(val) {
      return (val >= 10);
    });
  },
  expect : true
}, {
  title  : 'Pot.every() with Object',
  code   : function() {
    return pot.every({A: 12, B: 54, C: 18, D: 130, E: 45}, function(val) {
      return (val >= 10);
    });
  },
  expect : true
}, {
  title  : 'Pot.Deferred.every() with Array',
  code   : function() {
    return pot.Deferred.every([12, 54, 18, 130, 45], function(val) {
      return (val >= 10);
    });
  },
  expect : true
}, {
  title  : 'Pot.Deferred.every() with Object',
  code   : function() {
    return pot.Deferred.every({A: 12, B: 54, C: 18, D: 130, E: 45}, function(val) {
      return (val >= 10);
    });
  },
  expect : true
}, {
  title  : 'Pot.Deferred.every() with Array on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.every(function(val) {
      return (val >= 10);
    }).begin([12, 54, 18, 130, 45]);
  },
  expect : true
}, {
  title  : 'Pot.Deferred.every() with Object on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.every(function(val) {
      return (val >= 10);
    }).begin({A: 12, B: 54, C: 18, D: 130, E: 45});
  },
  expect : true
}, {
  title  : 'Pot.some() with Array',
  code   : function() {
    return pot.some([12, 5, 8, 1, 5], function(val) {
      return (val >= 10);
    });
  },
  expect : true
}, {
  title  : 'Pot.some() with Object',
  code   : function() {
    return pot.some({A: 12, B: 5, C: 8, D: 1, E: 5}, function(val) {
      return (val >= 10);
    });
  },
  expect : true
}, {
  title  : 'Pot.Deferred.some() with Array',
  code   : function() {
    return pot.Deferred.some([12, 5, 8, 1, 5], function(val) {
      return (val >= 10);
    });
  },
  expect : true
}, {
  title  : 'Pot.Deferred.some() with Object',
  code   : function() {
    return pot.Deferred.some({A: 12, B: 5, C: 8, D: 1, E: 5}, function(val) {
      return (val >= 10);
    });
  },
  expect : true
}, {
  title  : 'Pot.Deferred.some() with Array on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.some(function(val) {
      return (val >= 10);
    }).begin([12, 5, 8, 1, 5]);
  },
  expect : true
}, {
  title  : 'Pot.Deferred.some() with Object on chain',
  code   : function() {
    var d = new pot.Deferred();
    return d.some(function(val) {
      return (val >= 10);
    }).begin({A: 12, B: 5, C: 8, D: 1, E: 5});
  },
  expect : true
}, {
  title  : 'Pot.Deferred.prototype.then()',
  code   : function() {
    var d = new pot.Deferred();
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
    var d = new pot.Deferred();
    d.then(function() {
      throw new Error('TestError');
    }).rescue(function(err) {
      return pot.typeOf(err);
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
    var d = new pot.Deferred();
    d.then(function() {
      throw 'TestError';
    }).ensure(function(err) {
      return pot.typeOf(err);
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
    return (new pot.Deferred()).then(function(val) {
      return val * 100;
    }).begin(1);
  },
  expect : 100
}, {
  title  : 'Pot.Deferred.prototype.raise()',
  code   : function() {
    var d = new pot.Deferred();
    return d.then(function(res) {
      return [false];
    }).rescue(function(err) {
      return [true];
    }).raise('RaiseError');
  },
  expect : [true]
}, {
  title  : 'Pot.Deferred.prototype.end()',
  code   : function() {
    var n = 0;
    var d = new pot.Deferred();
    d.then(function() {
      n = 1;
    }).then(function() {
      n = 2;
    }).begin();
    d.end();
    d.then(function() {
      n = 'Help me!';
    });
    return pot.wait(1).then(function() {
      return n;
    });
  },
  expect : 2
}, {
  title  : 'Pot.Deferred.prototype.wait()',
  code   : function() {
    var t = Date.now();
    var d = new pot.Deferred();
    return d.then(function() {
      return 1;
    }).wait(0.2).then(function(res) {
      return res + 1;
    }).wait(0.5).then(function(res) {
      return res + 1;
    }).wait(0.3).then(function(res) {
      return [res, Date.now() - t >= 1000];
    }).begin();
  },
  expect : [3, true]
}, {
  title  : 'Pot.Deferred.prototype.till()',
  code   : function() {
    var d = new pot.Deferred();
    var time;
    var limit = 1000;
    return d.then(function() {
      time = pot.now();
    }).till(function() {
      if (pot.now() - time < limit) {
        return false;
      } else {
        return true;
      }
    }).then(function() {
      if (pot.now() - time >= limit) {
        return true;
      }
      return false;
    }).begin();
  },
  expect : true
}, {
  title  : 'Pot.Deferred.prototype.cancel()',
  code   : function() {
    var n = 0;
    var d = new pot.Deferred();
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
    return pot.wait(1).then(function() {
      return n;
    });
  },
  expect : 0
}, {
  title  : 'Pot.Deferred.prototype.cancel() in chain',
  code   : function() {
    var n = 0;
    var d = new pot.Deferred();
    d.then(function() {
      n = 1;
    }).then(function(res) {
      n = 2;
    }).then(function(res) {
      this.cancel();
    }).then(function(res) {
      n = 999;
    }).begin();
    return pot.wait(1).then(function() {
      return n;
    });
  },
  expect : 2
}, {
  title  : 'Pot.Deferred.prototype.canceller()',
  code   : function() {
    var r = [];
    var d = new pot.Deferred();
    d.canceller(function() {
      r.push('canceller(1)');
    }).canceller(function() {
      r.push('canceller(2)');
    }).then(function() {
      r.push('start chain');
    });
    d.cancel();
    return pot.wait(1).then(function() {
      return r;
    });
  },
  expect : ['canceller(1)', 'canceller(2)']
}, {
  title  : 'Pot.Deferred.prototype.speed()',
  code   : function() {
    var now = pot.now();
    var d = new pot.Deferred();
    return d.then(function() {
      return 'speed: slow';
    }).speed('slow').then(function() {
      return 'speed: 10 ms.';
    }).speed(10).then(function() {
      return pot.now() - now >= 10;
    }).then(function(res) {
      return res;
    }).begin();
  },
  expect : true
}, {
  title  : 'Pot.Deferred.prototype.async() with synchronous',
  code   : function() {
    var value = null;
    var d = new pot.Deferred();
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
    var d = new pot.Deferred();
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
    var d = new pot.Deferred();
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
    var d = new pot.Deferred();
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
    var d = new pot.Deferred();
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
    var d = new pot.Deferred();
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
    return pot.succeed('foo').then(function(res) {
      return res + 'bar';
    });
  },
  expect : 'foobar'
}, {
  title  : 'Pot.Deferred.failure()',
  code   : function() {
    return pot.failure('TestError').then(function(res) {
      return '(success)';
    }, function(err) {
      return '(failure)';
    });
  },
  expect : '(failure)'
}, {
  title  : 'Pot.Deferred.wait()',
  code   : function() {
    return pot.wait(1).then(function() {
      return pot.wait(0.5, 'foo').then(function(res) {
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
    var start = Date.now();
    var time = 1000;
    return pot.till(function() {
      if (Date.now() - start < time) {
        return false;
      } else {
        return true;
      }
    }).then(function() {
      return Date.now() - start >= 1000;
    });
  },
  expect : true
}, {
  title  : 'Pot.Deferred.begin()',
  code   : function() {
    return pot.begin(function() {
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
    return pot.flush(function() {
      var d = new pot.Deferred();
      d.then(function() {
        return 'foo';
      });
      return pot.flush(d).then(function(res) {
        return res + 'bar';
      }).then(function(res) {
        return pot.flush('baz').then(function(r) {
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
    var d = new pot.Deferred();
    d.then(function() {
      return 'Deferred';
    }).begin();
    var value = 'Hello';
    return pot.maybeDeferred(d).then(function(r1) {
      return pot.maybeDeferred(value).then(function(r2) {
        var dfd = pot.begin(function() {
          return '!';
        });
        return pot.maybeDeferred(dfd).then(function(r3) {
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
    return pot.callLater(1, function() {
      msg = 'Called after 1 seconds.';
    }).then(function() {
      return msg;
    });
  },
  expect : 'Called after 1 seconds.'
}, {
  title  : 'Pot.Deferred.callLazy()',
  code   : function() {
    var msg = '';
    return pot.callLazy(function() {
      msg = 'lazy';
    }).then(function() {
      return msg;
    });
  },
  expect : 'lazy'
}, {
  title  : 'Pot.Deferred.isFired()',
  code   : function() {
    var d = new pot.Deferred();
    if (pot.isFired(d)) {
      return false;
    }
    d.then(function() {
      return 'hoge';
    });
    if (pot.isFired(d)) {
      return false;
    }
    d.begin();
    return pot.isFired(d);
  },
  expect : true
}, {
  title  : 'Pot.Deferred.lastResult()',
  code   : function() {
    var d = new pot.Deferred({ async : false });
    d.then(function() {
      return 'foo';
    }).then(function(res) {
      return 'bar';
    }).then(function(res) {
      return 'baz';
    }).begin();
    return pot.lastResult(d);
  },
  expect : 'baz'
}, {
  title  : 'Pot.Deferred.register()',
  code   : function() {
    pot.register('add', function(args) {
      return args.inputs[0] + args.results[0];
    });
    var d = new pot.Deferred();
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
    pot.register('add', function(args) {
      return args.inputs[0] + args.results[0];
    });
    var d = new pot.Deferred();
    return d.then(function() {
      return 100;
    }).add(50).then(function(res) {
      pot.unregister('add');
      var dfd = new pot.Deferred();
      return [dfd.add, res];
    }).begin();
  },
  expect : [(void 0), 150]
}, {
  title  : 'Pot.Deferred.deferrize() for synchronous function',
  code   : function() {
    var toCharCode = pot.deferrize(function(string) {
      var chars = [], i, len = string.length;
      for (i = 0; i < len; i++) {
        chars.push(string.charCodeAt(i));
      }
      return chars;
    });
    var string = 'abcdef';
    return pot.begin(function() {
      return toCharCode(string).then(function(result) {
        return result;
      });
    });
  },
  expect : [97, 98, 99, 100, 101, 102]
}, {
  title  : 'Pot.Deferred.parallel() with Array',
  code   : function() {
    return pot.parallel([
      pot.begin(function() {
        return 'foo';
      }),
      function() {
        return pot.succeed().then(function() {
          return pot.wait(1).then(function() {
            return 'bar';
          });
        });
      },
      (new pot.Deferred()).then(function() {
        return 'baz';
      }).begin()
    ]).then(function(values) {
      return values;
    });
  },
  expect : ['foo', 'bar', 'baz']
}, {
  title  : 'Pot.Deferred.parallel() with Object',
  code   : function() {
    return pot.parallel({
      foo : function() {
        return 1;
      },
      bar : (new pot.Deferred()).then(function() {
        return pot.begin(function() {
          return pot.wait(1).then(function() {
            return pot.succeed(2);
          });
        });
      }),
      baz : function() {
        var d = new pot.Deferred();
        return d.async(false).then(function() {
          return 3;
        }).begin();
      }
    }).then(function(values) {
      return values;
    });
  },
  expect : {foo: 1, baz: 3, bar: 2}
}, {
  title  : 'Pot.Deferred.chain()',
  code   : function() {
    var result = 0;
    var deferred = pot.chain(
      function() {
        return pot.wait(0.1).then(function() {
          result++;
        });
      },
      function(res) {
        throw new Error('TestChainError');
      },
      function rescue(err) {
        result++;
      },
      function(res) {
        return pot.succeed(res).then(function(val) {
          result++;
        });
      },
      {
        foo : function(res) {
          result++;
        },
        bar : function(res) {
          return pot.begin(function() {
            result++;
          });
        }
      },
      function(res) {
        result++;
      },
      [
        function(res) {
          return pot.wait(0.1).then(function() {
            result++;
          });
        },
        function(res) {
          return pot.begin(function() {
            return pot.succeed().then(function(val) {
              result++;
            });
          });
        }
      ]
    );
    return deferred.then(function() {
      return result;
    });
  },
  expect : 8
}, {
  title : 'A simple Deferred chain',
  code  : function() {
    var d = new pot.Deferred();
    return d.then(function() {
      return 1;
    }).begin();
  },
  expect : 1
}, {
  title : 'Nested Deferred chain',
  code  : function() {
    var d = new pot.Deferred();
    return d.then(function() {
      var dd = new pot.Deferred();
      return dd.then(function() {
        return 2;
      }).begin();
    }).begin();
  },
  expect : 2
}, {
  title : 'Deferred callback with FileReader',
  code  : function() {
    return pot.begin(function() {
      if (pot.System.hasFileReader && pot.System.createBlob) {
        var fl = new FileReader();
        fl.readAsText(pot.createBlob('hoge'));
        return fl;
      } else {
        return 'hoge';
      }
    });
  },
  expect : 'hoge'
}, {
  title : 'Iterate with specific speed for synchronous',
  code  : function() {
    var array = ['foo', 'bar', 'baz'];
    var object = {a: 1, b: 2, c: 3, d: 4, e: 5};
    var result = [];
    pot.forEver.ninja(function() {
      pot.forEach.ninja(object, function(val, key) {
        pot.repeat.ninja(array.length, function(i) {
          var value = [];
          var iter = new pot.Iter();
          iter.next = (function() {
            var n = 0;
            return function() {
              if (n >= 5) {
                throw pot.StopIteration;
              }
              return n++;
            };
          })();
          pot.iterate.ninja(iter, function(j) {
            value[j] = [array[i], key, val];
          });
          value = pot.filter.ninja(pot.map.rapid(value, function(v) {
            return pot.items.fast(pot.zip.ninja(v, function(item) {
              return item.slice(0, 2);
            }), function(item) {
              return item[item.length - 1];
            }).shift().join('');
          }), function(item) {
            return item && item.length && /a/.test(item);
          });
          if (!value || !value.length) {
            throw pot.StopIteration;
          }
          if (!pot.some(value, function(item) {
            return /f/.test(item);
          })) {
            value.push(10);
          }
          if (pot.every(value, function(item) {
            return /o/.test(item);
          })) {
            value.push(20);
          }
          value = pot.reduce.fast(value, function(a, b) {
            return a + ':' + b;
          });
          result.push(value);
        });
      });
      throw pot.StopIteration;
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
    return pot.Deferred.forEach.fast(object, function(val, key) {
      return pot.Deferred.repeat.fast(array.length, function(i) {
        result.push([array[i], key, val]);
      });
    }).then(function() {
      return pot.Deferred.zip.fast(result, function(item) {
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
    var d = new pot.Deferred();
    return d.then(function() {
      return object;
    }).forEach.fast(function(val, key) {
      var dd = new pot.Deferred();
      return dd.repeat.fast(function(i) {
        result.push([array[i], key, val]);
      }).then(function() {
        return result;
      }).begin(array.length);
    }).then(function() {
      return result;
    }).zip.fast(function(item) {
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
    return pot.begin(function() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }).forEach(function(value) {
      return pot.begin(function() {
        var d = new pot.Deferred();
        return d.then(function() {
          if (value > 5) {
            throw pot.StopIteration;
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
    return pot.begin(function() {
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
    var d = new pot.Deferred();
    var worker = new pot.Workeroid(function(data) {
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
    var d = new pot.Deferred();
    var worker = new pot.Workeroid(function(data) {
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
    var d = new pot.Deferred();
    var worker = new pot.Workeroid(function() {
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
    var d = new pot.Deferred();
    var worker = new pot.Workeroid(function() {
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
  title  : 'Pot.ArrayBufferoid Basic',
  code   : function() {
    var result = [];
    var buffer = new pot.ArrayBufferoid();
    var i = 0;
    buffer[i++] = 255;
    buffer[i++] = 254;
    buffer.push(253);
    buffer.push(252);
    result.push(buffer.getUint16(0, true));
    result.push(buffer.size());
    var arrayBuffer = buffer.toArrayBuffer();
    var uint8Array = buffer.toUint8Array();
    result.push(uint8Array[0]);
    buffer.seek(0);
    var data1 = buffer.read(1);
    result.push(data1[0]);
    result.push(buffer.tell());
    var data2 = buffer.read(2);
    result.push(data2[0], data2[1]);
    buffer.seek(0);
    buffer.write([100, 101]);
    result.push(buffer[0], buffer[1], buffer[2], buffer[3]);
    return result;
  },
  expect : [
    65279, 4, 255, 255, 1, 254, 253, 100, 101, 253, 252
  ]
}, {
  title  : 'Pot.ArrayBufferoid with Iterate',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([1, 2, 3, 4]);
    var uint8Array = buffer.map(function(val) {
      return val + 100;
    }).toUint8Array();
    return uint8Array[0];
  },
  expect : 101
}, {
  title  : 'Pot.ArrayBufferoid to TypedArray',
  code   : function() {
    if (pot.System.hasTypedArray) {
      return [
        pot.isTypedArray(pot.ArrayBufferoid.toArrayBuffer(10)),
        pot.ArrayBufferoid.toInt8Array([0xFF])[0] === new Int8Array([0xFF])[0],
        pot.ArrayBufferoid.toUint8Array([0xFF])[0] === new Uint8Array([0xFF])[0],
        pot.System.hasUint8ClampedArray ?
          (pot.ArrayBufferoid.toUint8ClampedArray([0xFF])[0] === new Uint8ClampedArray([0xFF])[0]) :
          (pot.ArrayBufferoid.toUint8ClampedArray([0xFF])[0] === [0xFF][0]),
        pot.ArrayBufferoid.toInt16Array([0xFFFF])[0] === new Int16Array([0xFFFF])[0],
        pot.ArrayBufferoid.toUint16Array([0xFFFF])[0] === new Uint16Array([0xFFFF])[0],
        pot.ArrayBufferoid.toInt32Array([0xFFFFFFFF])[0] === new Int32Array([0xFFFFFFFF])[0],
        pot.ArrayBufferoid.toUint32Array([0xFFFFFFFF])[0] === new Uint32Array([0xFFFFFFFF])[0],
        pot.ArrayBufferoid.toFloat32Array([Math.pow(2, 48)])[0] === new Float32Array([Math.pow(2, 48)])[0],
        pot.ArrayBufferoid.toFloat64Array([Math.pow(2, 48)])[0] === new Float64Array([Math.pow(2, 48)])[0]
      ];
    } else {
      return [
        true, true, true, true, true, true, true, true, true, true
      ];
    }
  },
  expect : [
    true, true, true, true, true, true, true, true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.size() and push()',
  code   : function() {
    var result = [];
    var buffer = new pot.ArrayBufferoid();
    var i = 0;
    result.push(buffer.size());
    buffer[i++] = 10;
    result.push(buffer.size());
    buffer[i++] = 20;
    result.push(buffer.size());
    buffer[i++] = 30;
    result.push(buffer.size());
    buffer.push(40);
    result.push(buffer.size());
    buffer.push(50, 60);
    result.push(buffer.size());
    buffer.unshift(1);
    result.push(buffer.size());
    buffer[buffer.size()] = 70;
    result.push(buffer.size());
    buffer[buffer.size()] = 80;
    result.push(buffer.size());
    return result;
  },
  expect : [0, 1, 2, 3, 4, 6, 7, 8, 9]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.join()',
  code   : function() {
    return [
      (new pot.ArrayBufferoid([1, 2, 3, 4, 5])).join(''),
      (new pot.ArrayBufferoid([1, 2, 3, 4, 5])).join('-'),
      (new pot.ArrayBufferoid([1])).join(''),
      (new pot.ArrayBufferoid([1])).join('1'),
    ];
  },
  expect : ['12345', '1-2-3-4-5', '1', '1']
}, {
  title  : 'Pot.ArrayBufferoid.prototype.pop()',
  code   : function() {
    var result = [];
    var buffer = new pot.ArrayBufferoid([1, 2, 3, 4, 5]);
    result.push(buffer.pop());
    result.push(buffer.size());
    result.push(buffer.pop());
    buffer.push(10);
    result.push(buffer.size());
    result.push(buffer.pop());
    return result;
  },
  expect : [5, 4, 4, 4, 10]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.shift()',
  code   : function() {
    var result = [];
    var buffer = new pot.ArrayBufferoid([1, 2, 3, 4, 5]);
    result.push(buffer.shift());
    result.push(buffer.size());
    result.push(buffer.shift());
    buffer.unshift(10);
    result.push(buffer.size());
    result.push(buffer.shift());
    return result;
  },
  expect : [1, 4, 2, 4, 10]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.unshift()',
  code   : function() {
    var result = [];
    var buffer = new pot.ArrayBufferoid();
    result.push(buffer.size());
    buffer.unshift(1);
    result.push(buffer[0]);
    buffer.unshift(2);
    buffer.unshift(3);
    result.push(buffer[0]);
    buffer.unshift(4);
    result.push(buffer.size());
    result.push(buffer[0]);
    buffer.unshift(6);
    result.push(buffer[0]);
    return result;
  },
  expect : [0, 1, 3, 4, 4, 6]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.reverse()',
  code   : function() {
    return [
      (new pot.ArrayBufferoid([1, 2, 3, 4, 5])).reverse().toArray(),
      (new pot.ArrayBufferoid([1, 2, 3, 4])).reverse().toArray(),
      (new pot.ArrayBufferoid([1, 2, 3])).reverse().toArray(),
      (new pot.ArrayBufferoid([1, 2])).reverse().toArray(),
      (new pot.ArrayBufferoid([1])).reverse().toArray()
    ];
  },
  expect : [
    [5, 4, 3, 2, 1],
    [4, 3, 2, 1],
    [3, 2, 1],
    [2, 1],
    [1]
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.sort()',
  code   : function() {
    return [
      (new pot.ArrayBufferoid([5, 4, 3, 2, 1])).sort().toArray(),
      (new pot.ArrayBufferoid([4, 3, 2, 1])).sort().toArray(),
      (new pot.ArrayBufferoid([3, 2, 1])).sort().toArray(),
      (new pot.ArrayBufferoid([2, 1])).sort().toArray(),
      (new pot.ArrayBufferoid([1])).sort().toArray(),
      (new pot.ArrayBufferoid([1, 2, 3, 4, 5])).sort(function(a, b) {
        return a > b ? -1 :
               a < b ?  1 : 0;
      }).toArray()
    ];
  },
  expect : [
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4],
    [1, 2, 3],
    [1, 2],
    [1],
    [5, 4, 3, 2, 1]
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.concat()',
  code   : function() {
    return [
      new pot.ArrayBufferoid([1, 2, 3]).concat([4, 5, 6], [7, 8, 9]).toArray(),
      new pot.ArrayBufferoid([1, 2]).concat([3, 4], [5, 6]).toArray(),
      new pot.ArrayBufferoid([1]).concat([2], [3]).toArray(),
      new pot.ArrayBufferoid([]).concat([1], [2]).toArray(),
      new pot.ArrayBufferoid([]).concat([1, 2]).toArray(),
      new pot.ArrayBufferoid([]).concat([1]).toArray(),
      new pot.ArrayBufferoid([1]).concat([2]).toArray(),
      new pot.ArrayBufferoid([1]).concat([2], [3]).toArray()
    ]
  },
  expect : [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3],
    [1, 2],
    [1, 2],
    [1],
    [1, 2],
    [1, 2, 3]
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.slice()',
  code   : function() {
    return [
      new pot.ArrayBufferoid([1, 2, 3]).slice(0).toArray(),
      new pot.ArrayBufferoid([1, 2, 3]).slice(0, -1).toArray(),
      new pot.ArrayBufferoid([1, 2, 3]).slice(1).toArray(),
      new pot.ArrayBufferoid([1, 2, 3]).slice(-1).toArray()
    ];
  },
  expect : [
    [1, 2, 3],
    [1, 2],
    [2, 3],
    [3]
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.splice()',
  code   : function() {
    var result = [];
    var buffer = new pot.ArrayBufferoid([1, 2, 3]);
    result.push(buffer.splice(0, 1).toArray());
    result.push(buffer.toArray());
    buffer = new pot.ArrayBufferoid([1, 2, 3]);
    result.push(buffer.splice(0, buffer.size()).toArray());
    result.push(buffer.toArray());
    buffer = new pot.ArrayBufferoid([1, 2, 3]);
    result.push(buffer.splice(-1, 1).toArray());
    result.push(buffer.toArray());
    return result;
  },
  expect : [
    [1],
    [2, 3],
    [1, 2, 3],
    [],
    [3],
    [1, 2]
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.indexOf()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([2, 5, 9, 5, 1]);
    return [
      buffer.indexOf(2),
      buffer.indexOf(7),
      buffer.indexOf(5, 3)
    ];
  },
  expect : [
    0, -1, 3
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.lastIndexOf()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([2, 5, 9, 2, 1]);
    return [
      buffer.lastIndexOf(2),
      buffer.lastIndexOf(7),
      buffer.lastIndexOf(2, 3),
      buffer.lastIndexOf(2, 2),
      buffer.lastIndexOf(2, -3),
      buffer.lastIndexOf(2, -2)
    ];
  },
  expect : [3, -1, 3, 0, 0, 3]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.filter()',
  code   : function() {
    return new pot.ArrayBufferoid([12, 5, 8, 130, 44]).filter(function(value, index) {
      return (value >= 10);
    }).toArray();
  },
  expect : [12, 130, 44]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.forEach()',
  code   : function() {
    var result = 0;
    new pot.ArrayBufferoid([1, 2, 3]).forEach(function(value, i) {
      result += value;
    });
    return result;
  },
  expect : 6
}, {
  title  : 'Pot.ArrayBufferoid.prototype.map()',
  code   : function() {
    return new pot.ArrayBufferoid([1, 2, 3]).map(function(value, i) {
      return value + 100;
    }).toArray();
  },
  expect : [101, 102, 103]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.reduce()',
  code   : function() {
    return new pot.ArrayBufferoid([1, 2, 3]).reduce(function(a, b) {
      return a + b;
    });
  },
  expect : 6
}, {
  title  : 'Pot.ArrayBufferoid.prototype.every()',
  code   : function() {
    function isBigEnough(value, index, array) {
      return (value >= 10);
    }
    var buf1 = new pot.ArrayBufferoid([12, 5, 8, 130, 44]);
    var result1 = buf1.every(isBigEnough);
    var buf2 = new pot.ArrayBufferoid([12, 54, 18, 130, 44]);
    var result2 = buf2.every(isBigEnough);
    return [result1, result2];
  },
  expect : [false, true]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.some()',
  code   : function() {
    function isBigEnough(value, index, array) {
      return (value >= 10);
    }
    var result1 = new pot.ArrayBufferoid([2, 5, 8, 1, 4]).some(isBigEnough);
    var result2 = new pot.ArrayBufferoid([12, 5, 8, 1, 4]).some(isBigEnough);
    return [result1, result2];
  },
  expect : [false, true]
}, {
  title  : 'Pot.ArrayBufferoid.prototype to TypedArray',
  code   : function() {
    if (pot.System.hasTypedArray) {
      return [
        pot.isTypedArray(pot.ArrayBufferoid.toArrayBuffer(10)),
        new pot.ArrayBufferoid([0xFF]).toInt8Array()[0] === new Int8Array([0xFF])[0],
        new pot.ArrayBufferoid([0xFF]).toUint8Array()[0] === new Uint8Array([0xFF])[0],
        pot.System.hasUint8ClampedArray ?
          (new pot.ArrayBufferoid([0xFF]).toUint8ClampedArray()[0] === new Uint8ClampedArray([0xFF])[0]) :
          (new pot.ArrayBufferoid([0xFF]).toUint8ClampedArray()[0] === [0xFF][0]),
        new pot.ArrayBufferoid([0xFFFF]).toInt16Array()[0] === new Int16Array([0xFFFF])[0],
        new pot.ArrayBufferoid([0xFFFF]).toUint16Array()[0] === new Uint16Array([0xFFFF])[0],
        new pot.ArrayBufferoid([0xFFFFFFFF]).toInt32Array()[0] === new Int32Array([0xFFFFFFFF])[0],
        new pot.ArrayBufferoid([0xFFFFFFFF]).toUint32Array()[0] === new Uint32Array([0xFFFFFFFF])[0],
        new pot.ArrayBufferoid([Math.pow(2, 48)]).toFloat32Array()[0] === new Float32Array([Math.pow(2, 48)])[0],
        new pot.ArrayBufferoid([Math.pow(2, 48)]).toFloat64Array()[0] === new Float64Array([Math.pow(2, 48)])[0]
      ];
    } else {
      return [
        true, true, true, true, true, true, true, true, true, true
      ];
    }
  },
  expect : [
    true, true, true, true, true, true, true, true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.getInt8()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([0xFF, 0xFE, 0xFD, 0xFC, 0xFA, 0x00, 0xBA, 0x01]);
    function equal(a, b) {
      return (a === b);
    }
    return [
      equal(buffer.getInt8(0), -1),
      equal(buffer.getInt8(1), -2),
      equal(buffer.getInt8(2), -3),
      equal(buffer.getInt8(3), -4),
      equal(buffer.getInt8(4), -6),
      equal(buffer.getInt8(5), 0),
      equal(buffer.getInt8(6), -70),
      equal(buffer.getInt8(7), 1),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(0, true),
        -1
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(0, false),
        -1
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(1, true),
        -2
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(1, false),
        -2
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(2, true),
        -3
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(2, false),
        -3
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(3, true),
        -4
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(3, false),
        -4
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(4, true),
        -6
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt8(4, false),
        -6
      )
    ];
  },
  expect : [
    true, true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.getUint8()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([0xFF, 0xFE, 0xFD, 0xFC, 0xFA, 0x00, 0xBA, 0x01]);
    function equal(a, b) {
      return (a === b);
    }
    return [
      equal(buffer.getUint8(0), 255),
      equal(buffer.getUint8(1), 254),
      equal(buffer.getUint8(2), 253),
      equal(buffer.getUint8(3), 252),
      equal(buffer.getUint8(4), 250),
      equal(buffer.getUint8(5), 0),
      equal(buffer.getUint8(6), 186),
      equal(buffer.getUint8(7), 1),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(0, true),
        255
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(0, false),
        255
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(1, true),
        254
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(1, false),
        254
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(2, true),
        253
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(2, false),
        253
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(3, true),
        252
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(3, false),
        252
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(4, true),
        250
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(4, false),
        250
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(5, true),
        0
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint8(5, false),
        0
      )
    ];
  },
  expect : [
    true, true, true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.getInt16()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([0xFF, 0xFE, 0xFD, 0xFC, 0xFA, 0x00, 0xBA, 0x01]);
    function equal(a, b) {
      return (a === b);
    }
    return [
      equal(buffer.getInt16(0), -257),
      equal(buffer.getInt16(1), -514),
      equal(buffer.getInt16(2), -771),
      equal(buffer.getInt16(3), -1284),
      equal(buffer.getInt16(4), 250),
      equal(buffer.getInt16(5), -17920),
      equal(buffer.getInt16(6), 442),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(0, true),
        -257
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(0, false),
        -2
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(1, true),
        -514
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(1, false),
        -259
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(2, true),
        -771
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(2, false),
        -516
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(3, true),
        -1284
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(3, false),
        -774
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(4, true),
        250
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(4, false),
        -1536
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(5, true),
        -17920
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt16(5, false),
        186
      )
    ];
  },
  expect : [
    true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true,
    true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.getUint16()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([0xFF, 0xFE, 0xFD, 0xFC, 0xFA, 0x00, 0xBA, 0x01]);
    function equal(a, b) {
      return (a === b);
    }
    return [
      equal(buffer.getUint16(0), 65279),
      equal(buffer.getUint16(1), 65022),
      equal(buffer.getUint16(2), 64765),
      equal(buffer.getUint16(3), 64252),
      equal(buffer.getUint16(4), 250),
      equal(buffer.getUint16(5), 47616),
      equal(buffer.getUint16(6), 442),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(0, true),
        65279
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(0, false),
        65534
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(1, true),
        65022
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(1, false),
        65277
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(2, true),
        64765
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(2, false),
        65020
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(3, true),
        64252
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(3, false),
        64762
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(4, true),
        250
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(4, false),
        64000
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(5, true),
        47616
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint16(5, false),
        186
      )
    ];
  },
  expect : [
    true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true,
    true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.getUint32()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([0xFF, 0xFE, 0xFD, 0xFC, 0xFA, 0x00, 0xBA, 0x01]);
    function equal(a, b) {
      return (a === b);
    }
    return [
      equal(buffer.getUint32(0), 4244504319),
      equal(buffer.getUint32(1), 4210884094),
      equal(buffer.getUint32(2), 16448765),
      equal(buffer.getUint32(3), 3120626428),
      equal(buffer.getUint32(4), 28967162),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(0, true),
        4244504319
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(0, false),
        4294901244
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(1, true),
        4210884094
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(1, false),
        4278058234
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(2, true),
        16448765
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(2, false),
        4261214720
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(3, true),
        3120626428
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(3, false),
        4244242618
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(4, true),
        28967162
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getUint32(4, false),
        4194351617
      )
    ];
  },
  expect : [
    true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.getInt32()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([0xFF, 0xFE, 0xFD, 0xFC, 0xFA, 0x00, 0xBA, 0x01]);
    function equal(a, b) {
      return (a === b);
    }
    return [
      equal(buffer.getInt32(0), -50462977),
      equal(buffer.getInt32(1), -84083202),
      equal(buffer.getInt32(2), 16448765),
      equal(buffer.getInt32(3), -1174340868),
      equal(buffer.getInt32(4), 28967162),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(0, true),
        -50462977
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(0, false),
        -66052
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(1, true),
        -84083202
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(1, false),
        -16909062
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(2, true),
        16448765
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(2, false),
        -33752576
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(3, true),
        -1174340868
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(3, false),
        -50724678
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(4, true),
        28967162
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xfe, 0xfd, 0xfc, 0xfa, 0x00, 0xba, 0x01]).getInt32(4, false),
        -100615679
      )
    ];
  },
  expect : [
    true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.getFloat32()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([0xFF, 0xFE, 0xFD, 0xFC, 0xFA, 0x00, 0xBA, 0x01]);
    function equal(a, b) {
      return (a === b);
    }
    return [
      equal(buffer.getFloat32(0), -1.055058432344064e+37),
      equal(buffer.getFloat32(1), -6.568051909668895e+35),
      equal(buffer.getFloat32(2), 2.30496291345398e-38),
      equal(buffer.getFloat32(3), -0.0004920212086290121),
      equal(buffer.getFloat32(4), 6.832701044000979e-38),
      equal(
        new pot.ArrayBufferoid([0x7f, 0x80, 0x00, 0x00]).getFloat32(0, true),
        4.609571298396486e-41
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0x80, 0x00, 0x00]).getFloat32(0, true),
        4.627507918739843e-41
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x00, 0x00, 0x00]).getFloat32(0, true),
        0
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0x80, 0x00, 0x01]).getFloat32(0, true),
        2.3602437174820547e-38
      ),
      equal(
        new pot.ArrayBufferoid([0x7f, 0x80, 0x00, 0x00]).getFloat32(0, false),
        Infinity
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0x80, 0x00, 0x00]).getFloat32(0, false),
        -Infinity
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x00, 0x00, 0x00]).getFloat32(0, false),
        0
      ),
      isNaN(new pot.ArrayBufferoid([0xff, 0x80, 0x00, 0x01]).getFloat32(0, false))
    ];
  },
  expect : [
    true, true, true, true, true, true, true, true,
    true, true, true, true, true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.prototype.getFloat64()',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([0xFF, 0xFE, 0xFD, 0xFC, 0xFA, 0x00, 0xBA, 0x01]);
    function equal(a, b) {
      return (a === b);
    }
    return [
      equal(buffer.getFloat64(0), 2.426842827241402e-300),
      equal(
        new pot.ArrayBufferoid([0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, true),
        3.0418e-319
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, true),
        3.04814e-319
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, true),
        0
      ),
      equal(
        new pot.ArrayBufferoid([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, true),
        6.3e-322
      ),
      equal(
        new pot.ArrayBufferoid([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, true),
        3.03865e-319
      ),
      equal(
        new pot.ArrayBufferoid([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]).getFloat64(0, true),
        7.291122019655968e-304
      ),
      equal(
        new pot.ArrayBufferoid([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02]).getFloat64(0, true),
        4.778309726801735e-299
      ),
      equal(
        new pot.ArrayBufferoid([0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, true),
        3.16e-322
      ),
      equal(
        new pot.ArrayBufferoid([0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, true),
        9.5e-322
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]).getFloat64(0, true),
        7.291122019556398e-304
      ),
      isNaN(
        new pot.ArrayBufferoid([0x00, 0x0f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]).getFloat64(0, true)
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, true),
        2.0237e-320
      ),
      isNaN(
        new pot.ArrayBufferoid([0x7f, 0xef, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]).getFloat64(0, true)
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]).getFloat64(0, true),
        7.291122019656279e-304
      ),
      equal(
        new pot.ArrayBufferoid([0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, false),
        Infinity
      ),
      equal(
        new pot.ArrayBufferoid([0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, false),
        -Infinity
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, false),
        0
      ),
      equal(
        new pot.ArrayBufferoid([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, false),
        0
      ),
      equal(
        new pot.ArrayBufferoid([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, false),
        1
      ),
      equal(
        new pot.ArrayBufferoid([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]).getFloat64(0, false),
        1.0000000000000002
      ),
      equal(
        new pot.ArrayBufferoid([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02]).getFloat64(0, false),
        1.0000000000000004
      ),
      equal(
        new pot.ArrayBufferoid([0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, false),
        2
      ),
      equal(
        new pot.ArrayBufferoid([0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, false),
        -2
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]).getFloat64(0, false),
        5e-324
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x0f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]).getFloat64(0, false),
        2.225073858507201e-308
      ),
      equal(
        new pot.ArrayBufferoid([0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).getFloat64(0, false),
        2.2250738585072014e-308
      ),
      equal(
        new pot.ArrayBufferoid([0x7f, 0xef, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]).getFloat64(0, false),
        1.7976931348623157e+308
      ),
      isNaN(
        new pot.ArrayBufferoid([0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]).getFloat64(0, false)
      )
    ];
  },
  expect : [
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true
  ]
}, {
  title  : 'Pot.ArrayBufferoid.copyBuffer()',
  code   : function() {
    var result = [];
    var arr = [1, 2, 3];
    var copyArr = pot.ArrayBufferoid.copyBuffer(arr);
    copyArr[0] = 100;
    result.push(arr[0] === 1);
    var buffer = new pot.ArrayBufferoid([1, 2, 3]);
    var copyBuffer = pot.ArrayBufferoid.copyBuffer(buffer);
    copyBuffer[0] = 100;
    result.push(buffer[0] === 1);
    if (pot.System.hasTypedArray) {
      var uint8Array = new Uint8Array([1, 2, 3]);
      var copyArrayBuffer = pot.ArrayBufferoid.copyBuffer(uint8Array);
      var copyUint8Array = new Uint8Array(copyArrayBuffer);
      copyUint8Array[0] = 100;
      result.push(uint8Array[0] === 1);
    } else {
      result.push(true);
    }
    return result;
  },
  expect : [true, true, true]
}, {
  title  : 'Pot.ArrayBufferoid.copyBuffer() and ArrayBuffer',
  code   : function() {
    var result = [];
    if (pot.System.hasTypedArray) {
      var buffer = new ArrayBuffer(10);
      var view1 = new Uint8Array(buffer);
      var view2 = new Uint8Array(buffer);
      view1[0] = 10;
      view2[1] = 20;
      result.push(view1[0]);
      result.push(view2[0]);
      result.push(view1[1]);
      result.push(view2[1]);
      var copy = new Uint8Array(pot.ArrayBufferoid.copyBuffer(buffer));
      copy[1] = 100;
      result.push(copy[0]);
      result.push(copy[1]);
      result.push(view1[0]);
      result.push(view1[1]);
      result.push(view2[0]);
      result.push(view2[1]);
    } else {
      result = [10, 10, 20, 20, 10, 100, 10, 20, 10, 20];
    }
    return result;
  },
  expect : [10, 10, 20, 20, 10, 100, 10, 20, 10, 20]
}, {
  title  : 'Pot.ArrayBufferoid.binaryToBuffer() and bufferToBinary()',
  code   : function() {
    var string = 'abc';
    var buffer = pot.ArrayBufferoid.binaryToBuffer(string);
    var result = pot.ArrayBufferoid.bufferToBinary(buffer);
    return [
      result === string,
      buffer[0] === 'a'.charCodeAt(0),
      buffer[1] === 'b'.charCodeAt(0)
    ];
  },
  expect : [true, true, true]
}, {
  title  : 'Pot.ArrayBufferoid.binaryToBuffer()',
  code   : function() {
    var string = 'abc123';
    var buffer = pot.ArrayBufferoid.binaryToBuffer(string);
    return buffer.toArray();
  },
  expect : [97, 98, 99, 49, 50, 51]
}, {
  title  : 'Pot.ArrayBufferoid.binaryToBuffer.deferred()',
  code   : function() {
    var s = 'abc123';
    return pot.ArrayBufferoid.binaryToBuffer.deferred(s).then(function(res) {
      return res.toArray();
    });
  },
  expect : [97, 98, 99, 49, 50, 51]
}, {
  title  : 'Pot.ArrayBufferoid.bufferToBinary()',
  code   : function() {
    var result = [];
    if (pot.System.hasTypedArray) {
      var view = new Uint8Array([0x61, 0x62, 0x63]);
      result.push(pot.ArrayBufferoid.bufferToBinary(view));
    } else {
      result.push('abc');
    }
    var buffer = new pot.ArrayBufferoid([0x61, 0x62, 0x63]);
    result.push(pot.ArrayBufferoid.bufferToBinary(buffer));
    return result;
  },
  expect : ['abc', 'abc']
}, {
  title  : 'Pot.ArrayBufferoid.bufferToBinary.deferred()',
  code   : function() {
    var result = [], view;
    if (pot.System.hasTypedArray) {
      view = new Uint8Array([0x61, 0x62, 0x63]);
    } else {
      view = [0x61, 0x62, 0x63];
    }
    var buffer = new pot.ArrayBufferoid([0x61, 0x62, 0x63]);
    return pot.ArrayBufferoid.bufferToBinary.deferred(view).then(function(res) {
      result.push(res);
      return pot.ArrayBufferoid.bufferToBinary.deferred(buffer).then(function(res) {
        result.push(res);
        return result;
      });
    });
  },
  expect : ['abc', 'abc']
}, {
  title  : 'Pot.ArrayBufferoid.bufferToString() and stringToBuffer()',
  code   : function() {
    var s = 'hoge\u307b\u3052';
    var buffer = pot.ArrayBufferoid.stringToBuffer(s);
    var string = pot.ArrayBufferoid.bufferToString(buffer);
    return [
      buffer.toArray(),
      (s === string),
      s.length < buffer.size()
    ];
  },
  expect : [
    [104, 111, 103, 101, 227, 129, 187, 227, 129, 146],
    true,
    true
  ]
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
    var handler1 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a, b);
    });
    pot.signal(obj, 'push', 0, 1);
    var handler2 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a * 10, b * 10);
    });
    pot.signal(obj, 'push', 2, 0);
    pot.detach(handler1);
    var handler3 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a * 100, b * 100);
    });
    pot.signal(obj, 'push', 0, 3);
    pot.detach(handler2);
    pot.detach(handler3);
    pot.signal(obj, 'push', 4, 5);
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
    var handler1 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a, b);
    });
    var handler2 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a * 10, b * 10);
    });
    var handler3 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a * 100, b * 100);
    });
    pot.signal(obj, 'push', 1, 0);
    pot.detachAll(obj);
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
    var handler1 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a, b);
    });
    var handler2 = pot.attachBefore(obj, 'push', function(a, b) {
      obj.method(a * 10, b * 10);
    });
    pot.signal(obj, 'push', 1, 0);
    pot.detachAll(obj);
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
    var handler1 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a, b);
    });
    var handler2 = pot.attachAfter(obj, 'push', function(a, b) {
      obj.method(a * 10, b * 10);
    });
    pot.signal(obj, 'push', 1, 0);
    pot.detachAll(obj);
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
    var handler1 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a, b);
    });
    var handler2 = pot.attachBefore.once(obj, 'push', function(a, b) {
      obj.method(a * 10, b * 10);
    });
    pot.signal(obj, 'push', 1, 0);
    pot.signal(obj, 'push', 0, 2);
    pot.detachAll(obj);
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
    var handler1 = pot.attach(obj, 'push', function(a, b) {
      obj.method(a, b);
    });
    var handler2 = pot.attachAfter.once(obj, 'push', function(a, b) {
      obj.method(a * 10, b * 10);
    });
    pot.signal(obj, 'push', 1, 0);
    pot.signal(obj, 'push', 0, 2);
    pot.detachAll(obj);
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
    pot.attachPropBefore(obj, 'method', function(a, b) {
      value.push(a + b);
    });
    pot.attachPropBefore(obj, 'method', function(a, b) {
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
    pot.attachPropAfter(obj, 'method', function(a, b) {
      value.push(a + b);
    });
    pot.attachPropAfter(obj, 'method', function(a, b) {
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
    pot.attachPropBefore.once(obj, 'method', function(a, b) {
      value.push(a + b);
    });
    pot.attachPropBefore.once(obj, 'method', function(a, b) {
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
    pot.attachPropAfter.once(obj, 'method', function(a, b) {
      value.push(a + b);
    });
    pot.attachPropAfter.once(obj, 'method', function(a, b) {
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
    return [
      pot.hashCode('abc'),
      pot.hashCode('\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052')
    ]
  },
  expect : [
    96354,
    743630871
  ]
}, {
  title  : 'Pot.hashCode() for Array',
  code   : function() {
    // '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052'
    var unicode = [
      12371, 12435, 12395, 12385, 12399, 12290,
      12411, 12370, 12411, 12370
    ];
    return [
      pot.hashCode([0x61, 0x62, 0x63]),
      pot.hashCode(unicode)
    ]
  },
  expect : [
    96354,
    743630871
  ]
}, {
  title  : 'Pot.md5()',
  code   : function() {
    return [
      pot.md5('apple'),
      pot.md5('\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052')
    ];
  },
  expect : [
    '1f3870be274f6c49b3e31a0c6728957f',
    '0def7430d26eae1150d04d6d512f943f'
  ]
}, {
  title  : 'Pot.md5() for Array',
  code   : function() {
    // UTF-8: '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052'
    var utf8 = [
      227, 129, 147, 227, 130, 147,
      227, 129, 171, 227, 129, 161,
      227, 129, 175, 227, 128, 130,
      227, 129, 187, 227, 129, 146,
      227, 129, 187, 227, 129, 146
    ];
    return [
      pot.md5([0x61, 0x70, 0x70, 0x6C, 0x65]),
      pot.md5(utf8)
    ]
  },
  expect : [
    '1f3870be274f6c49b3e31a0c6728957f',
    '0def7430d26eae1150d04d6d512f943f'
  ]
}, {
  title  : 'Pot.md5.deferred()',
  code   : function() {
    var result = [];
    return pot.md5.deferred('apple').then(function(res) {
      result.push(res);
      return pot.md5.deferred('\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052').then(function(res) {
        result.push(res);
        return result;
      });
    });
  },
  expect : [
    '1f3870be274f6c49b3e31a0c6728957f',
    '0def7430d26eae1150d04d6d512f943f'
  ]
}, {
  title  : 'Pot.md5.deferred() for Array',
  code   : function() {
    var result = [];
    var apple = [0x61, 0x70, 0x70, 0x6C, 0x65];
    // UTF-8: '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052'
    var utf8 = [
      227, 129, 147, 227, 130, 147,
      227, 129, 171, 227, 129, 161,
      227, 129, 175, 227, 128, 130,
      227, 129, 187, 227, 129, 146,
      227, 129, 187, 227, 129, 146
    ];
    return pot.md5.deferred(apple).then(function(res) {
      result.push(res);
      return pot.md5.deferred(utf8).then(function(res) {
        result.push(res);
        return result;
      });
    });
  },
  expect : [
    '1f3870be274f6c49b3e31a0c6728957f',
    '0def7430d26eae1150d04d6d512f943f'
  ]
}, {
  title  : 'Pot.crc32()',
  code   : function() {
    return [
      pot.crc32('abc123'),
      pot.crc32('\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052')
    ];
  },
  expect : [
    -821904548,
    2135320280
  ]
}, {
  title  : 'Pot.crc32() for Array',
  code   : function() {
    // UTF-8: '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052'
    var utf8 = [
      227, 129, 147, 227, 130, 147,
      227, 129, 171, 227, 129, 161,
      227, 129, 175, 227, 128, 130,
      227, 129, 187, 227, 129, 146,
      227, 129, 187, 227, 129, 146
    ];
    return [
      pot.crc32([0x61, 0x62, 0x63, 0x31, 0x32, 0x33]),
      pot.crc32(utf8)
    ];
  },
  expect : [
    -821904548,
    2135320280
  ]
}, {
  title  : 'Pot.sha1()',
  code   : function() {
    return [
      pot.sha1('apple'),
      pot.sha1('\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052')
    ]
  },
  expect : [
    'd0be2dc421be4fcd0172e5afceea3970e2f3d940',
    '8a4d3af190bc0b0d55635c2350f37c38d9ea755f'
  ]
}, {
  title  : 'Pot.sha1() for Array',
  code   : function() {
    // UTF-8: '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052'
    var utf8 = [
      227, 129, 147, 227, 130, 147,
      227, 129, 171, 227, 129, 161,
      227, 129, 175, 227, 128, 130,
      227, 129, 187, 227, 129, 146,
      227, 129, 187, 227, 129, 146
    ];
    return [
      pot.sha1([0x61, 0x70, 0x70, 0x6C, 0x65]),
      pot.sha1(utf8)
    ]
  },
  expect : [
    'd0be2dc421be4fcd0172e5afceea3970e2f3d940',
    '8a4d3af190bc0b0d55635c2350f37c38d9ea755f'
  ]
}, {
  title  : 'Pot.sha1.deferred()',
  code   : function() {
    var result = [];
    return pot.sha1.deferred('apple').then(function(res) {
      result.push(res);
      return pot.sha1.deferred('\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052').then(function(res) {
        result.push(res);
        return result;
      });
    });
  },
  expect : [
    'd0be2dc421be4fcd0172e5afceea3970e2f3d940',
    '8a4d3af190bc0b0d55635c2350f37c38d9ea755f'
  ]
}, {
  title  : 'Pot.sha1.deferred() for Array',
  code   : function() {
    var result = [];
    var apple = [0x61, 0x70, 0x70, 0x6C, 0x65];
    // UTF-8: '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052'
    var utf8 = [
      227, 129, 147, 227, 130, 147,
      227, 129, 171, 227, 129, 161,
      227, 129, 175, 227, 128, 130,
      227, 129, 187, 227, 129, 146,
      227, 129, 187, 227, 129, 146
    ];
    return pot.sha1.deferred(apple).then(function(res) {
      result.push(res);
      return pot.sha1.deferred(utf8).then(function(res) {
        result.push(res);
        return result;
      });
    });
  },
  expect : [
    'd0be2dc421be4fcd0172e5afceea3970e2f3d940',
    '8a4d3af190bc0b0d55635c2350f37c38d9ea755f'
  ]
}, {
  title  : 'Pot.Arc4',
  code   : function() {
    var arc4 = new pot.Arc4();
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
    var arc4 = new pot.Arc4();
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
    var hash = new pot.Hash();
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
    results.push(pot.merge(array1, array2));
    results.push(pot.merge([], 1, 2, 'foo', {bar: 3}));
    var obj1 = {foo: 1, bar: 2};
    var obj2 = {baz: 3};
    results.push(pot.merge(obj1, obj2));
    results.push(pot.merge({}, {foo: 1}, {bar: 2}));
    var s1 = 'foo';
    var s2 = 'bar';
    results.push(pot.merge(s1, s2));
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
      pot.unique(
        [1, 2, 3, 4, 5, 3, 5, 'a', 3, 'b', 'a', 'c', 2, 5]
      ),
      pot.unique(
        [5, 7, 8, 3, 6, 1, 7, 2, 3, 8, 4, 2, 9, 5]
      ),
      pot.unique(
        ['1', 1, '2', 2, 0, '0', '', null, false, (void 0)],
        true
      ),
      pot.unique(
        ['abc', 'ABC', 'Foo', 'bar', 'foO', 'BaR'],
        false, true
      ),
      pot.unique(
        {a: 1, b: 2, c: 3, d: 1, e: 3, f: 2}
      ),
      pot.unique(
        {foo: 1, bar: 2, FOo: 3, Bar: '1', baZ: '2'},
        true, true
      ),
      pot.unique(
        {a: 1, b: 2, c: 3, d: '1', e: '3', f: 5},
        true
      ),
      pot.unique('abcABCabc-----foobarBaZ'),
      pot.unique('abcABCabc-----foobarBaZ', true, true),
      pot.unique([
        1, 1,  [123],  10,
        [123], {a: 5}, 10,
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
    [1, [123], 10, {a: 5}]
  ]
}, {
  title  : 'Pot.flatten()',
  code   : function() {
    return pot.flatten([
      1, 2, 3, [4, 5, 6, [7, 8, [9], 10], 11], 12
    ]);
  },
  expect : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}, {
  title  : 'Pot.alphanumSort()',
  code   : function() {
    return [
      pot.alphanumSort([
        'a10', 'a2', 'a100', 'a1', 'a12'
      ]),
      pot.alphanumSort([
        {v: 'a10'}, {v: 'a2'}, {v: 'a100'}, {v: 'a1'}
      ], function(item) {
        return item.v;
      })
    ];
  },
  expect : [
    ['a1', 'a2', 'a10', 'a12', 'a100'],
    [{v: 'a1'}, {v: 'a2'}, {v: 'a10'}, {v: 'a100'}]
  ]
}, {
  title  : 'Pot.clone()',
  code   : function() {
    var obj1 = {key: 'value'};
    var obj2 = pot.clone(obj1);
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
    pot.callLater(0, hoge.sayHoge);
    pot.callLater(0, pot.bind(hoge.sayHoge, hoge));
    Hoge.prototype.sayHoges = function(msg) {
      var value = this.msg ? this.msg + msg : null;
      results.push(value);
    };
    pot.callLater(0, hoge.sayHoges);
    pot.callLater(0, pot.bind(hoge.sayHoges, hoge, 'Hi!'));
    return pot.wait(1).then(function() {
      return results;
    });
  },
  expect : [(void 0), 'Hello Hoge!', null, 'Hello Hoge!Hi!']
}, {
  title  : 'Pot.partial()',
  code   : function() {
    var add = function(a, b) {
      return a + b;
    }
    var add2 = pot.partial(add, 2);
    return add2(5);
  },
  expect : 7
}, {
  title  : 'Pot.keys()',
  code   : function() {
    var results = [];
    var obj = {foo: 1, bar: 2, baz: 3};
    results.push(pot.keys(obj));
    var array = [10, 20, 30, 40, 50];
    results.push(pot.keys(array));
    delete array[2];
    results.push(pot.keys(array));
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
    results.push(pot.values(obj));
    var array = ['foo', 'bar', 'baz'];
    results.push(pot.values(array));
    delete array[1];
    results.push(pot.values(array));
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
    results.push(pot.tuple(array));
    var array = [['foo', 1, 'bar', 2], {baz: 3}, ['A', 4, 'B']];
    results.push(pot.tuple(array));
    var array = [['A', 1], ['B', 2], ['C', 3]];
    var func = function(key, val) {
      return ['[' + key + ']', '{' + val + '}'];
    };
    results.push(pot.tuple(array, func));
    var array = [['prototype', 1], ['__iterator__', 2], ['__proto__', 3]];
    results.push(pot.tuple(array, new pot.Hash()).toJSON());
    var array = [['A', 1], ['B', 2], ['C', 3]];
    var func = function(key, val) {
      return '(' + key + ':' + val + ')';
    };
    results.push(pot.tuple(array, func, []));
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
    results.push(pot.unzip([[1, 4], [2, 5], [3, 6]]));
    results.push(pot.unzip([[{a: 1}, {d: 4}], [{b: 2}, {e: 5}], [{c: 3}, {f: 6}]]));
    var callback = function(a, b, c) { return a + b + c; };
    results.push(pot.unzip([[1, 4], [2, 5], [3, 6]], callback));
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
    results.push(pot.pairs('key', 'value'));
    results.push(pot.pairs('key1', 'value1', 'key2', 'value2'));
    results.push(pot.pairs('key'));
    results.push(pot.pairs(['key', 'value']));
    results.push(pot.pairs('key1', 1, ['key2', 2], 'key3', 3));
    results.push(pot.pairs(['a', 1, ['b', 2, [{c: 3}, 'd', 4]]]));
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
    results.push(pot.count({a: 1, b: 2, c: 3}));
    results.push(pot.count({}));
    results.push(pot.count([1, 2, 3, 4, 5]));
    results.push(pot.count([]));
    results.push(pot.count(new Object('foo', 'bar', 'baz')));
    results.push(pot.count(new Array(100)));
    results.push(pot.count(null));
    results.push(pot.count((void 0)));
    results.push(pot.count('hoge'));
    results.push(pot.count(''));
    results.push(pot.count(new String('hoge')));
    results.push(pot.count(100));
    results.push(pot.count(0));
    results.push(pot.count(-1));
    results.push(pot.count((function() {})));
    var f = function() {};
    f.foo = 1;
    f.bar = 2;
    results.push(pot.count(f));
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
      pot.first({a: 1, b: 2, c: 3}),
      pot.first({}),
      pot.first([1, 2, 3, 4, 5]),
      pot.first([]),
      pot.first({a: 'foo', b: 'bar'}),
      pot.first(new Array(100)),
      pot.first(null),
      pot.first((void 0)),
      pot.first('hoge'),
      pot.first(''),
      pot.first(new String('hoge')),
      pot.first(123),
      pot.first(0),
      pot.first(-123)
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
      pot.firstKey({a: 1, b: 2, c: 3}),
      pot.firstKey({}),
      pot.firstKey([1, 2, 3, 4, 5]),
      pot.firstKey([]),
      pot.firstKey({a: 'foo', b: 'bar'}),
      pot.firstKey(new Array(100)),
      pot.firstKey(null),
      pot.firstKey((void 0)),
      pot.firstKey('hoge'),
      pot.firstKey(''),
      pot.firstKey(new String('hoge')),
      pot.firstKey(123),
      pot.firstKey(0),
      pot.firstKey(-123)
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
      pot.last({a: 1, b: 2, c: 3}),
      pot.last({}),
      pot.last([1, 2, 3, 4, 5]),
      pot.last([]),
      pot.last({a: 'foo', b: 'bar'}),
      pot.last(new Array(100)),
      pot.last(null),
      pot.last((void 0)),
      pot.last('hoge'),
      pot.last(''),
      pot.last(new String('hoge')),
      pot.last(123),
      pot.last(0),
      pot.last(-123)
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
      pot.lastKey({a: 1, b: 2, c: 3}),
      pot.lastKey({}),
      pot.lastKey([1, 2, 3, 4, 5]),
      pot.lastKey([]),
      pot.lastKey({a: 'foo', b: 'bar'}),
      pot.lastKey(new Array(100)),
      pot.lastKey(null),
      pot.lastKey((void 0)),
      pot.lastKey('hoge'),
      pot.lastKey(''),
      pot.lastKey(new String('hoge')),
      pot.lastKey(123),
      pot.lastKey(0),
      pot.lastKey(-123)
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
    results.push(pot.contains(obj, 20));
    results.push(pot.contains(obj, 50));
    var arr = [10, 20, 30, 'foo', 'bar'];
    results.push(pot.contains(arr, 20));
    results.push(pot.contains(arr, 75));
    results.push(pot.contains(arr, 'foo'));
    results.push(pot.contains(arr, 'FOO'));
    var str = 'foobarbaz';
    results.push(pot.contains(str, 'A'));
    results.push(pot.contains(str, 'foo'));
    results.push(pot.contains(str, '123'));
    var num = 12345;
    results.push(pot.contains(num, 1));
    results.push(pot.contains(num, 45));
    results.push(pot.contains(num, 7));
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
      pot.remove('foo bar baz', 'o'),
      pot.remove('foo bar baz', 'bar'),
      pot.remove([1, 2, 3, 4, 5], 2),
      pot.remove([1, 2, 3, 4, 5], '3'),
      pot.remove([1, 2, 3, 4, 5], '3', true),
      pot.remove({A: 1, B: 2, C: 3}, 2),
      pot.remove({A: 1, B: 2, C: 3}, '3'),
      pot.remove({A: 1, B: 2, C: 3}, '3', true),
      pot.remove(1234512345, 2),
      pot.remove(1234512345, 123)
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
      pot.removeAll('foo bar baz', 'o'),
      pot.removeAll('foo bar baz', 'ba'),
      pot.removeAll([1, 2, 3, 1, 2], 2),
      pot.removeAll([1, 2, 3, 1, 2], '2'),
      pot.removeAll([1, 2, 3, 1, 2], '2', true),
      pot.removeAll({A: 1, B: 2, C: 2}, 2),
      pot.removeAll({A: 1, B: 2, C: 2}, '2'),
      pot.removeAll({A: 1, B: 2, C: 2}, '2', true),
      pot.removeAll(1234512345, 2),
      pot.removeAll(1234512345, 123)
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
      pot.removeAt('foo bar baz', 2),
      pot.removeAt('foo bar baz', 2, 5),
      pot.removeAt('foo bar baz', 100),
      pot.removeAt([1, 2, 3, 4, 5], 2),
      pot.removeAt([1, 2, 3, 4, 5], 2, 2),
      pot.removeAt([1, 2, 3, 4, 5], -1, 5),
      pot.removeAt({A: 1, B: 2, C: 3}, 2),
      pot.removeAt({A: 1, B: 2, C: 3}, 1, 5),
      pot.removeAt({A: 1, B: 2, C: 3}, 5),
      pot.removeAt(1234512345, 2),
      pot.removeAt(1234512345, 2, 3),
      pot.removeAt(-1234512345, 2, 3)
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
    results.push(pot.equals(obj1, obj2));
    results.push(pot.equals(obj1, obj3));
    var obj4 = {};
    var obj5 = {};
    results.push(pot.equals(obj4, obj5));
    var arr1 = [1, 2, 3];
    var arr2 = [1, 2, 3];
    var arr3 = [1, 2, 10];
    results.push(pot.equals(arr1, arr2));
    results.push(pot.equals(arr1, arr3));
    var arr4 = [];
    var arr5 = [];
    results.push(pot.equals(arr4, arr5));
    var cmp = function(a, b) {
      return a == b ||
        String(a).toLowerCase() == String(b).toLowerCase();
    };
    var arr6 = [1, 2, 'foo', 'bar'];
    var arr7 = ['1', 2, 'FOO', 'baR'];
    results.push(pot.equals(arr6, arr7, cmp));
    var func1 = (function() {});
    var func2 = (function() {});
    var func3 = (function() { return this; });
    results.push(pot.equals(func1, func2));
    results.push(pot.equals(func1, func3));
    var date1 = new Date();
    var date2 = new Date(date1.getTime());
    var date3 = new Date(date1.getTime() + 100);
    results.push(pot.equals(date1, date2));
    results.push(pot.equals(date1, date3));
    var str1 = 'foobarbaz';
    var str2 = 'foobarbaz';
    var str3 = 'hoge';
    results.push(pot.equals(str1, str2));
    results.push(pot.equals(str1, str3));
    var num1 = 12345;
    var num2 = 12345;
    var num3 = 12345.455512;
    var num4 = 12345.443556;
    var num5 = 12345.443556999;
    results.push(pot.equals(num1, num2));
    results.push(pot.equals(num1, num3));
    results.push(pot.equals(num3, num4));
    results.push(pot.equals(num4, num5));
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
      pot.reverse({foo: 1, bar: 2, baz: 3}),
      pot.reverse([1, 2, 3, 4, 5]),
      pot.reverse('123abc')
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
    return pot.flip({foo: 'A', bar: 'B', baz: 'C'});
  },
  expect : {A: 'foo', B: 'bar', C: 'baz'}
}, {
  title  : 'Pot.shuffle()',
  code   : function() {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var ash = pot.shuffle(arr);
    while (arr[0] === ash[0]) {
      ash = pot.shuffle(arr);
    }
    var num = 123456789;
    var nsh = pot.shuffle(num);
    while (num == nsh) {
      nsh = pot.shuffle(num);
    }
    var dbl = -123456789.0839893;
    var dsh = pot.shuffle(dbl);
    while (dbl == dsh) {
      dsh = pot.shuffle(dbl);
    }
    var obj = {a: 1, b: 2, c: 3, d: 4, e: 5};
    var osh = pot.shuffle(obj);
    while (pot.first(obj) == pot.first(osh)) {
      osh = pot.shuffle(obj);
    }
    var str = 'abcdef12345';
    var ssh = pot.shuffle(str);
    while (str == ssh) {
      ssh = pot.shuffle(str);
    }
    return !pot.equals(arr, ash) && arr.length === ash.length &&
           num !== nsh && String(num).length === String(nsh).length &&
           dbl !== dsh &&
           /^-\d+[.]\d+$/.test(dbl) && /^-\d+[.]\d+$/.test(dsh) &&
           !pot.equals(obj, osh) && pot.count(obj) === pot.count(osh) &&
           str !== ssh && str.length === ssh.length;
  },
  expect : true
}, {
  title  : 'Pot.fill()',
  code   : function() {
    return [
      pot.fill([1, 2], 3, 5),
      pot.fill([], null, 3),
      pot.fill('foo', 'o', 10),
      pot.fill('', 'hoge', 5),
      pot.fill({}, 2, 5),
      pot.fill({a: 1, b: 2, c: 3}, null),
      pot.fill(100, 5, 10)
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
      pot.implode({color: 'blue', margin: '5px'}, ':', ';', true),
      pot.implode('+', {a: 1, b: 2, c: 3}, '*'),
      pot.implode('>>', {a: 1, b: 2, c: 3}, '^', '==?')
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
    var result = pot.explode(string, ':', ';');
    results.push(result);
    var string = 'foo=1&bar=2&baz=3';
    var result = pot.explode(string, {delimiter: '=', separator: '&'});
    results.push(result);
    var string = 'A : 1, B:2, C: 3;';
    var result = pot.explode(string, {
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
      pot.glue([1, 2, 3, 4, 5]),
      pot.glue('foo', 'bar', 'baz'),
      pot.glue(1, [2, 3, ['foo']], ['bar', 'baz'])
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
    pot.clearObject(obj);
    results.push(obj);
    var arr = [1, 2, 3, 4, 5];
    pot.clearObject(arr);
    results.push(arr);
    return results;
  },
  expect : [{}, []]
}, {
  title  : 'Pot.date()',
  code   : function() {
    var result = pot.date('Y-m-d H:i:s');
    return /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(result);
  },
  expect : true
}, {
  title  : 'Pot.prettyDate()',
  code   : function() {
    return [
      /[a-z]/.test(pot.prettyDate('Fri Mar 16 2012 00:42:50 GMT+0900')),
      pot.prettyDate(new Date().getTime() + 10),
      pot.prettyDate(new Date().getTime() - 1000 * 60 - 10),
      pot.prettyDate(new Date().getTime() - 1000 * 60 * 60 - 10),
      pot.prettyDate(new Date().getTime() - 1000 * 60 * 60 * 24 - 10),
      pot.prettyDate(new Date().getTime() - 1000 * 60 * 60 * 24 * 7 - 10),
      pot.prettyDate(new Date().getTime() + 1000 * 60 + 10),
      pot.prettyDate(new Date().getTime() + 1000 * 60 * 60 + 10),
      pot.prettyDate(new Date().getTime() + 1000 * 60 * 60 * 24 + 10),
      pot.prettyDate(new Date().getTime() + 1000 * 60 * 60 * 24 * 7 + 10)
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
    var r = pot.rand(0, 1);
    results.push( r === 0 || r === 1 );
    results.push( pot.rand(5, 5) );
    r = pot.rand(10, 1);
    results.push( r >= 1 && r <= 10 );
    r = pot.rand(2.5, 5.75);
    results.push( /^\d\.\d{0,2}$/.test(r) );
    r = pot.rand(1, 1.8765);
    results.push( /^\d\.\d{0,4}$/.test(r) );
    return results;
  },
  expect : [true, 5, true, true, true]
}, {
  title  : 'Pot.rand.alpha()',
  code   : function() {
    var r1 = pot.rand.alpha();
    var r2 = pot.rand.alpha(8);
    return [
      /^[a-zA-Z]+$/.test(r1),
      /^[a-zA-Z]{8}$/.test(r2)
    ];
  },
  expect : [true, true]
}, {
  title  : 'Pot.rand.alpha.lower()',
  code   : function() {
    var r1 = pot.rand.alpha.lower();
    var r2 = pot.rand.alpha.lower(8);
    return [
      /^[a-z]+$/.test(r1),
      /^[a-z]{8}$/.test(r2)
    ];
  },
  expect : [true, true]
}, {
  title  : 'Pot.rand.alpha.upper()',
  code   : function() {
    var r1 = pot.rand.alpha.upper();
    var r2 = pot.rand.alpha.upper(8);
    return [
      /^[A-Z]+$/.test(r1),
      /^[A-Z]{8}$/.test(r2)
    ];
  },
  expect : [true, true]
}, {
  title  : 'Pot.rand.alnum()',
  code   : function() {
    var r1 = pot.rand.alnum();
    var r2 = pot.rand.alnum(8);
    var r3 = pot.rand.alnum(10, true);
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
    var r1 = pot.rand.alnum.lower();
    var r2 = pot.rand.alnum.lower(8);
    var r3 = pot.rand.alnum.lower(10, true);
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
    var r1 = pot.rand.alnum.upper();
    var r2 = pot.rand.alnum.upper(8);
    var r3 = pot.rand.alnum.upper(10, true);
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
    var r1 = pot.rand.color();
    var r2 = pot.rand.color(true);
    return [
      /^[a-fA-F0-9]{6}$/.test(r1),
      /^#[a-fA-F0-9]{6}$/.test(r2)
    ];
  },
  expect : [true, true]
}, {
  title  : 'Pot.rand.color.lower()',
  code   : function() {
    var r1 = pot.rand.color.lower();
    var r2 = pot.rand.color.lower(true);
    return [
      /^[a-f0-9]{6}$/.test(r1),
      /^#[a-f0-9]{6}$/.test(r2)
    ];
  },
  expect : [true, true]
}, {
  title  : 'Pot.rand.color.upper()',
  code   : function() {
    var r1 = pot.rand.color.upper();
    var r2 = pot.rand.color.upper(true);
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
      r = pot.rand.caseOf(s);
    } while (s === r);
    return s !== r && s.length === r.length;
  },
  expect : true
}, {
  title  : 'Pot.limit()',
  code   : function() {
    return [
      pot.limit(5, 10, 50),
      pot.limit(80, 10, 50),
      pot.limit(5, 2, 8),
      pot.limit(-5, -10, -50),
      pot.limit(-80, -10, -50),
      pot.limit('F', 'A', 'C'),
      pot.limit('b', 'a', 'z'),
      pot.limit(1, 2, 4, 5, 10, 20),
      pot.limit(100, 2, 4, 5, 10, 20)
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
    results.push(pot.convertToBase(value, 16, 10));
    var value = '9223372036854775807';
    results.push(pot.convertToBase(value, 10, 16));
    var value = '11010100010011011010011101111' +
                '10110011001101101100111001101';
    results.push(pot.convertToBase(value, 2, 62));
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
      var x = pot.compareVersions(a, b);
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
      pot.compareVersions('8.2.5rc', '8.2.5a'),
      pot.compareVersions('8.2.50', '8.2.52'),
      pot.compareVersions('5.3.0-dev', '5.3.0'),
      pot.compareVersions('4.1.0.52', '4.01.0.51'),
      pot.compareVersions('1.01a', '1.01'),
      pot.compareVersions('1.0.0', '1.0.00'),
      pot.compareVersions('2.1.0', '2.0.0', '<'),
      pot.compareVersions('2.1.0', '2.0.0', '>'),
      pot.compareVersions('2.1.0a', '2.1.0a', '==')
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
    return pot.escapeHTML('(>_<)/"< Hello World!');
  },
  expect : '(&gt;_&lt;)/&quot;&lt; Hello World!'
}, {
  title  : 'Pot.unescapeHTML()',
  code   : function() {
    return pot.unescapeHTML('(&gt;_&lt;)/&quot;&lt; Hello World!');
  },
  expect : '(>_<)/"< Hello World!'
}, {
  title  : 'Pot.escapeXPathText()',
  code   : function() {
    var results = [];
    var text = '"] | /foo/bar/baz | .["';
    var expr = '//*[@class=' + pot.escapeXPathText(text) + ']';
    results.push(expr);
    text = 'hoge-class';
    expr = '//*[@class=' + pot.escapeXPathText(text) + ']';
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
    var file = pot.escapeAppleScriptString('\u30fe("\u309d\u03c9\u30fb")\uff89"');
    var command = [
      'tell application "Finder"',
      '  get exists of file "' + file + '" of desktop',
      'end tell'
    ].join('\n');
    return command;
  },
  expect : [
    'tell application "Finder"',
    '  get exists of file "\u30fe(\\"\u309d\u03c9\u30fb\\")\uff89\\"" of desktop',
    'end tell'
  ].join('\n')
}, {
  title  : 'Pot.escapeString()',
  code   : function() {
    var result = 'id="' + pot.escapeString('foo"bar"') + '"';
    return result;
  },
  expect : 'id="foo\\"bar\\""'
}, {
  title  : 'Pot.unescapeString()',
  code   : function() {
    var result = pot.unescapeString('foo=\\"bar\\"');
    return result;
  },
  expect : 'foo="bar"'
}, {
  title  : 'Pot.escapeFileName()',
  code   : function() {
    var fileName = '\uff9f\uff65*:.\uff61..\uff61.:*\uff65\uff9f(file)\uff9f\uff65*:.\uff61. .\uff61.:*\uff65\uff9f\uff65*';
    var escaped = pot.escapeFileName(fileName);
    return escaped;
  },
  expect : '\uff9f\uff65_:.\uff61..\uff61.:_\uff65\uff9f(file)\uff9f\uff65_:.\uff61. .\uff61.:_\uff65\uff9f\uff65_'
}, {
  title  : 'Pot.escapeSequence()',
  code   : function() {
    var string = '\u307b\u3052abc ("\uff57")';
    return pot.escapeSequence(string);
  },
  expect : '\\u307b\\u3052abc\\u0020(\\"\\uff57\\")'
}, {
  title  : 'Pot.unescapeSequence()',
  code   : function() {
    var string = '\\u307b\\u3052abc\\u0020(\\"\\uff57\\")';
    return pot.unescapeSequence(string);
  },
  expect : '\u307b\u3052abc ("\uff57")'
}, {
  title  : 'Pot.utf8Encode() and Pot.utf8Decode()',
  code   : function() {
    var result = [];
    var s = 'abc123\u3042\u3044\u3046\u3048\u304a';
    var e = pot.utf8Encode(s);
    var d = pot.utf8Decode(e);
    result.push(s === d && s !== e);
    var string = 'hoge\u307b\u3052';
    var encoded = pot.utf8Encode(string);
    var decoded = pot.utf8Decode(encoded);
    var toCharCode = function(s) {
      return pot.map(s.split(''), function(c) {
        return c.charCodeAt(0);
      });
    };
    result.push(pot.toCharCode(encoded));
    result.push(decoded);
    result.push(decoded === string);
    return result;
  },
  expect : [
    true,
    [104, 111, 103, 101, 227, 129, 187, 227, 129, 146],
    'hoge\u307b\u3052',
    true
  ]
}, {
  title  : 'Pot.utf8ByteOf()',
  code   : function() {
    var string = 'abc123\u3042\u3044\u3046\u3048\u304a';
    var length = string.length;
    var byteSize = pot.utf8ByteOf(string);
    return string +
        ' : length = ' + length +
        ', byteSize = ' + byteSize;
  },
  expect : 'abc123\u3042\u3044\u3046\u3048\u304a : length = 11, byteSize = 21'
}, {
  title  : 'Pot.base64Encode() and Pot.base64Decode()',
  code   : function() {
    var string = 'Hello World.';
    var encoded = pot.base64Encode(string);
    var decoded = pot.base64Decode(encoded);
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
  title  : 'Pot.base64Encode() and Pot.base64Decode() with TypedArray',
  code   : function() {
    var data = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46];
    var string = pot.ArrayBufferoid.bufferToString(data);
    var bytes;
    if (pot.System.hasTypedArray) {
      bytes = new Uint8Array(data);
    } else {
      bytes = data;
    }
    var encoded = pot.base64Encode(bytes);
    var decoded = pot.base64Decode(encoded);
    return [
      encoded,
      decoded === string
    ];
  },
  expect : [
    'SGVsbG8gV29ybGQu',
    true
  ]
}, {
  title  : 'Pot.base64Encode() and Pot.base64Decode() with Pot.ArrayBufferoid',
  code   : function() {
    var buffer = new pot.ArrayBufferoid([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46]);
    var string = pot.ArrayBufferoid.bufferToString(buffer);
    var encoded = pot.base64Encode(buffer);
    var decoded = pot.base64Decode(encoded);
    return [
      encoded,
      decoded === string
    ];
  },
  expect : [
    'SGVsbG8gV29ybGQu',
    true
  ]
}, {
  title  : 'Pot.convertEncodingToUnicode() from SJIS, EUC-JP, UTF-8',
  code   : function() {
    var result = [];
    var unicode = '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052';
    var sjis = [
      130, 177, 130, 241, 130, 201,
      130, 191, 130, 205, 129, 66,
      130, 217, 130, 176, 130, 217,
      130, 176
    ];
    var eucjp = [
      164, 179, 164, 243, 164, 203,
      164, 193, 164, 207, 161, 163,
      164, 219, 164, 178, 164, 219,
      164, 178
    ];
    var utf8 = [
      227, 129, 147, 227, 130, 147,
      227, 129, 171, 227, 129, 161,
      227, 129, 175, 227, 128, 130,
      227, 129, 187, 227, 129, 146,
      227, 129, 187, 227, 129, 146
    ];
    return pot.convertEncodingToUnicode(sjis, 'Shift_JIS').then(function(res) {
      result.push(res);
    }).then(function() {
      return pot.convertEncodingToUnicode(eucjp, 'EUC-JP').then(function(res) {
        result.push(res);
      });
    }).then(function() {
      return pot.convertEncodingToUnicode(utf8, 'UTF-8').then(function(res) {
        result.push(res);
      });
    }).rescue(function(err) {
      result.push(unicode, unicode, unicode);
    }).ensure(function() {
      return result;
    });
  },
  expect : [
    '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052',
    '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052',
    '\u3053\u3093\u306b\u3061\u306f\u3002\u307b\u3052\u307b\u3052'
  ]
}, {
  title  : 'Pot.base64Encode() and Pot.base64Decode() with Deferred',
  code   : function() {
    var string = 'Hello World.';
    return pot.base64Encode.deferred(string).then(function(encoded) {
      return pot.base64Decode.deferred.slow(encoded).then(function(decoded) {
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
    var string = '\uff9f+\uff61:.o\uff65\uff9f\uff65\u2523\u00a8\uff77\u2523\u00a8\uff77\u2606\uff65\uff9f\uff65';
    var encoded = pot.base64URLEncode(string);
    var decoded = pot.base64URLDecode(encoded);
    var decoded2 = pot.base64Decode(encoded);
    return [
      encoded,
      string === decoded && string !== encoded && decoded === decoded2
    ];
  },
  expect : [
    '776fK--9oToub--9pe--n--9peKUo8Ko77234pSjwqjvvbfimIbvvaXvvp_vvaU=',
    true
  ]
}, {
  title  : 'Pot.base64URLEncode() and Pot.base64URLDecode() with Deferred',
  code   : function() {
    var string = '\uff9f+\uff61:.o\uff65\uff9f\uff65\u2523\u00a8\uff77\u2523\u00a8\uff77\u2606\uff65\uff9f\uff65';
    return pot.base64URLEncode.deferred.slow(string).then(function(encoded) {
      return pot.base64URLDecode.deferred(encoded).then(function(decoded) {
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
  title  : 'Pot.base64Decode.asBuffer()',
  code   : function() {
    var result = [];
    var toArray = function(a) {
      var r = [];
      for (var i = 0, len = a.length; i < len; i++) {
        r.push(a[i]);
      }
      return r;
    };
    var b64string = 'SGVsbG8gV29ybGQu';
    var buffer = pot.base64Decode.asBuffer(b64string);
    result.push(toArray(buffer));
    result.push(pot.ArrayBufferoid.bufferToString(buffer));
    var base64String = '776fK++9oToub++9pe++n++9peKUo8Ko' +
                       '77234pSjwqjvvbfimIbvvaXvvp/vvaU=';
    var buffer2 = pot.base64Decode.asBuffer(base64String);
    result.push(toArray(buffer2));
    result.push(pot.ArrayBufferoid.bufferToString(buffer2));
    return result;
  },
  expect : [
    [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46],
    'Hello World.',
    [239, 190, 159,  43, 239, 189, 161,  58,  46, 111,
     239, 189, 165, 239, 190, 159, 239, 189, 165, 226,
     148, 163, 194, 168, 239, 189, 183, 226, 148, 163,
     194, 168, 239, 189, 183, 226, 152, 134, 239, 189,
     165, 239, 190, 159, 239, 189, 165],
    '\uff9f+\uff61:.o\uff65\uff9f\uff65\u2523\u00a8\uff77\u2523\u00a8\uff77\u2606\uff65\uff9f\uff65'
  ]
}, {
  title  : 'Pot.base64Decode.deferredAsBuffer()',
  code   : function() {
    var result = [];
    var toArray = function(a) {
      var r = [];
      for (var i = 0, len = a.length; i < len; i++) {
        r.push(a[i]);
      }
      return r;
    };
    var b64string = 'SGVsbG8gV29ybGQu';
    return pot.base64Decode.deferredAsBuffer(b64string).then(function(res) {
      result.push(toArray(res));
      result.push(pot.ArrayBufferoid.bufferToString(res));
      var base64String = '776fK++9oToub++9pe++n++9peKUo8Ko' +
                         '77234pSjwqjvvbfimIbvvaXvvp/vvaU=';
      return pot.base64Decode.deferredAsBuffer(base64String).then(function(res) {
        result.push(toArray(res));
        result.push(pot.ArrayBufferoid.bufferToString(res));
        return result;
      });
    });
  },
  expect : [
    [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46],
    'Hello World.',
    [239, 190, 159,  43, 239, 189, 161,  58,  46, 111,
     239, 189, 165, 239, 190, 159, 239, 189, 165, 226,
     148, 163, 194, 168, 239, 189, 183, 226, 148, 163,
     194, 168, 239, 189, 183, 226, 152, 134, 239, 189,
     165, 239, 190, 159, 239, 189, 165],
    '\uff9f+\uff61:.o\uff65\uff9f\uff65\u2523\u00a8\uff77\u2523\u00a8\uff77\u2606\uff65\uff9f\uff65'
  ]
}, {
  title  : 'Pot.base64URLDecode.asBuffer()',
  code   : function() {
    var result = [];
    var toArray = function(a) {
      var r = [];
      for (var i = 0, len = a.length; i < len; i++) {
        r.push(a[i]);
      }
      return r;
    };
    var b64string = 'SGVsbG8gV29ybGQu';
    var buffer = pot.base64URLDecode.asBuffer(b64string);
    result.push(toArray(buffer));
    result.push(pot.ArrayBufferoid.bufferToString(buffer));
    var base64String = '776fK--9oToub--9pe--n--9peKUo8Ko' +
                       '77234pSjwqjvvbfimIbvvaXvvp_vvaU=';
    var buffer2 = pot.base64URLDecode.asBuffer(base64String);
    result.push(toArray(buffer2));
    result.push(pot.ArrayBufferoid.bufferToString(buffer2));
    return result;
  },
  expect : [
    [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46],
    'Hello World.',
    [239, 190, 159,  43, 239, 189, 161,  58,  46, 111,
     239, 189, 165, 239, 190, 159, 239, 189, 165, 226,
     148, 163, 194, 168, 239, 189, 183, 226, 148, 163,
     194, 168, 239, 189, 183, 226, 152, 134, 239, 189,
     165, 239, 190, 159, 239, 189, 165],
    '\uff9f+\uff61:.o\uff65\uff9f\uff65\u2523\u00a8\uff77\u2523\u00a8\uff77\u2606\uff65\uff9f\uff65'
  ]
}, {
  title  : 'Pot.base64URLDecode.deferredAsBuffer()',
  code   : function() {
    var result = [];
    var toArray = function(a) {
      var r = [];
      for (var i = 0, len = a.length; i < len; i++) {
        r.push(a[i]);
      }
      return r;
    };
    var b64string = 'SGVsbG8gV29ybGQu';
    return pot.base64URLDecode.deferredAsBuffer(b64string).then(function(res) {
      result.push(toArray(res));
      result.push(pot.ArrayBufferoid.bufferToString(res));
      var base64String = '776fK--9oToub--9pe--n--9peKUo8Ko' +
                         '77234pSjwqjvvbfimIbvvaXvvp_vvaU=';
      return pot.base64URLDecode.deferredAsBuffer(base64String).then(function(res) {
        result.push(toArray(res));
        result.push(pot.ArrayBufferoid.bufferToString(res));
        return result;
      });
    });
  },
  expect : [
    [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 46],
    'Hello World.',
    [239, 190, 159,  43, 239, 189, 161,  58,  46, 111,
     239, 189, 165, 239, 190, 159, 239, 189, 165, 226,
     148, 163, 194, 168, 239, 189, 183, 226, 148, 163,
     194, 168, 239, 189, 183, 226, 152, 134, 239, 189,
     165, 239, 190, 159, 239, 189, 165],
    '\uff9f+\uff61:.o\uff65\uff9f\uff65\u2523\u00a8\uff77\u2523\u00a8\uff77\u2606\uff65\uff9f\uff65'
  ]
}, {
  title  : 'Pot.alphamericStringEncode() and Pot.alphamericStringDecode()',
  code   : function() {
    var string  = 'Hello Hello foooooooo baaaaaaaar';
    var encoded = pot.alphamericStringEncode(string);
    var decoded = pot.alphamericStringDecode(encoded);
    var string2  = 'Hello Hello \u3053\u3093\u306b\u3061\u306f\u3001\u3053\u3093\u306b\u3061\u306f\u3001\u306b\u3083\u30fc\u306b\u3083\u30fc';
    var encoded2 = pot.alphamericStringEncode(string2);
    var decoded2 = pot.alphamericStringDecode(encoded2);
    var bytesS = pot.utf8ByteOf(string2);
    var bytesE = pot.utf8ByteOf(encoded2);
    var bytesD = pot.utf8ByteOf(decoded2);
    return [
      encoded,
      string === decoded && string.length > encoded.length,
      encoded2,
      string2 === decoded2 && pot.utf8ByteOf(string2) > pot.utf8ByteOf(encoded2)
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
    return pot.alphamericStringEncode.deferred(string).then(function(res) {
      encoded = res;
      return pot.alphamericStringDecode.deferred(encoded);
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
      pot.format('#1 + #2 + #3', 10, 20, 30),
      pot.format('J#1v#1#2 ECMA#2', 'a', 'Script')
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
    results.push(pot.sprintf('There are %d monkeys in the %s.', num, place));
    var n =  43951789;
    var u = -43951789;
    var c = 65;
    results.push(pot.sprintf("%%b = '%b'", n));
    results.push(pot.sprintf("%%c = '%c'", c));
    results.push(pot.sprintf("%%d = '%d'", n));
    results.push(pot.sprintf("%%e = '%e'", n));
    results.push(pot.sprintf("%%u = '%u'", n));
    results.push(pot.sprintf("%%u = '%u'", u));
    results.push(pot.sprintf("%%f = '%f'", n));
    results.push(pot.sprintf("%%o = '%o'", n));
    results.push(pot.sprintf("%%s = '%s'", n));
    results.push(pot.sprintf("%%x = '%x'", n));
    results.push(pot.sprintf("%%X = '%X'", n));
    results.push(pot.sprintf("%%+d = '%+d'", n));
    results.push(pot.sprintf("%%+d = '%+d'", u));
    results.push(pot.sprintf("%%a = '%a'", n));
    results.push(pot.sprintf("%%A = '%A'", n));
    var date  = new Date();
    var year  = date.getFullYear();
    var month = date.getMonth() + 1;
    var day   = date.getDate();
    var isoDate = pot.sprintf('%04d-%02d-%02d', year, month, day);
    results.push(isoDate);
    var s = 'monkey';
    var t = 'many monkeys';
    results.push(pot.sprintf("[%s]",      s));
    results.push(pot.sprintf("[%10s]",    s));
    results.push(pot.sprintf("[%-10s]",   s));
    results.push(pot.sprintf("[%010s]",   s));
    results.push(pot.sprintf("[%'#10s]",  s));
    results.push(pot.sprintf("[%10.10s]", t));
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
    pot.date('Y-m-d'),
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
    return pot.getExtByMimeType('application/javascript');
  },
  expect : 'js'
}, {
  title  : 'Pot.getMimeTypeByExt()',
  code   : function() {
    return pot.getMimeTypeByExt('js');
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
    var rs = new pot.ReplaceSaver(string, pattern, reserve);
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
      if (pot.chr(i) !== String.fromCharCode(i)) {
        ok = false;
        break;
      }
    }
    return [
      ok,
      pot.chr(97),
      pot.chr(97, 98, 99),
      pot.chr([
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
    return pot.ord('Hello');
  },
  expect : 72
}, {
  title  : 'Pot.ltrim()',
  code   : function() {
    return [
      pot.ltrim(' hoge  '),
      pot.ltrim('a cba', 'ac')
    ];
  },
  expect : ['hoge  ', ' cba']
}, {
  title  : 'Pot.rtrim()',
  code   : function() {
    return [
      pot.rtrim(' hoge  '),
      pot.rtrim('abc a', 'ac')
    ];
  },
  expect : [' hoge', 'abc ']
}, {
  title  : 'Pot.strip()',
  code   : function() {
    return [
      pot.strip('   Hello  World ! \r\n.'),
      pot.strip('foo looooooooool', 'o')
    ];
  },
  expect : ['HelloWorld!.', 'f ll']
}, {
  title  : 'Pot.indent()',
  code   : function() {
    var s1 = 'foo bar baz';
    var s2 = 'foo\nbar\nbaz';
    return [
      pot.indent(s1),
      pot.indent(s1, 4),
      pot.indent(s1, 1, '\t'),
      pot.indent(s2, 1, '\t')
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
      pot.unindent(s1),
      pot.unindent(s1, 4),
      pot.unindent(s1, 1, '\t'),
      pot.unindent(s2, 1, '\t')
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
      pot.normalizeSpace('Hello  \r\n  World  \r\n  \t !'),
      pot.normalizeSpace('foo       bar     baz', '+')
    ];
  },
  expect : ['Hello World !', 'foo+bar+baz']
}, {
  title  : 'Pot.splitBySpace()',
  code   : function() {
    var s = '  Hello  \r\n  World  \r\n  \t !  ';
    return pot.splitBySpace(s);
  },
  expect : ['Hello', 'World', '!']
}, {
  title  : 'Pot.canonicalizeNL()',
  code   : function() {
    var string = 'foo\r\nbar\rbaz\n';
    return pot.canonicalizeNL(string);
  },
  expect : 'foo\nbar\nbaz\n'
}, {
  title  : 'Pot.wrap()',
  code   : function() {
    var s = 'hoge';
    return [
      pot.wrap(s, '"'),
      pot.wrap(s, ['(', ')']),
      pot.wrap(s, '()') + pot.wrap(s, '[]')
    ];
  },
  expect : ['"hoge"', '(hoge)', '(hoge)[hoge]']
}, {
  title  : 'Pot.unwrap()',
  code   : function() {
    return [
      pot.unwrap('"hoge"', '"'),
      pot.unwrap('(hoge)', ['(', ')']),
      pot.unwrap(pot.unwrap('(L(hoge)R)', '()'), ['L(', ')R'])
    ];
  },
  expect : ['hoge', 'hoge', 'hoge']
}, {
  title  : 'Pot.startsWith()',
  code   : function() {
    return [
      pot.startsWith('foo bar baz', 'foo'),
      pot.startsWith('bar foo foo bar baz foo', 'foo'),
      pot.startsWith('FoO bar foo foo bar baz foo', 'foo', true)
    ];
  },
  expect : [true, false, true]
}, {
  title  : 'Pot.endsWith()',
  code   : function() {
    return [
      pot.endsWith('foo bar baz', 'baz'),
      pot.endsWith('foo bar baz foo bar', 'foo'),
      pot.endsWith('bar foo foo bar baz FOo', 'foo', true)
    ];
  },
  expect : [true, false, true]
}, {
  title  : 'Pot.lower()',
  code   : function() {
    return pot.lower('Hello World!');
  },
  expect : 'hello world!'
}, {
  title  : 'Pot.upper()',
  code   : function() {
    return pot.upper('Hello World!');
  },
  expect : 'HELLO WORLD!'
}, {
  title  : 'Pot.camelize()',
  code   : function() {
    return pot.camelize('font-size');
  },
  expect : 'fontSize'
}, {
  title  : 'Pot.hyphenize()',
  code   : function() {
    return pot.hyphenize('fontSize');
  },
  expect : 'font-size'
}, {
  title  : 'Pot.underscore()',
  code   : function() {
    return pot.underscore('rawInput');
  },
  expect : 'raw_input'
}, {
  title  : 'Pot.extract()',
  code   : function() {
    return [
      pot.extract('foo:bar', /:(\w+)$/),
      pot.extract('foo:bar', /^:(\w+)/),
      pot.extract('foo.html', /(foo|bar)\.([^.]+)$/, 2),
      pot.extract('foobar', 'foo'),
      pot.extract('foobar', 'fo+')
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
      pot.inc('99'),
      pot.inc('a0'),
      pot.inc('Az'),
      pot.inc('zz')
    ];
  },
  expect : ['100', 'a1', 'Ba', 'aaa']
}, {
  title  : 'Pot.dec()',
  code   : function() {
    return [
      pot.dec('100'),
      pot.dec('a1'),
      pot.dec('Ba'),
      pot.dec('aaa')
    ];
  },
  expect : ['99', 'a0', 'Az', 'zz']
}, {
  title  : 'Pot.br()',
  code   : function() {
    var results = [];
    var string = '1. foo.\n2. bar.\n3. baz.';
    results.push(pot.br(string));
    string = ' - foo.\n - bar.\n - baz.';
    results.push(pot.br(string, true));
    string = '<ul><li>foo<br />fooo</li><li>bar\nbaaar</li></ul>';
    results.push(pot.br(string));
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
    return pot.trim(pot.stripTags(html));
  },
  expect : 'Hoge foo bar baz'
}, {
  title  : 'Pot.truncate()',
  code   : function() {
    var results = [];
    var string = 'Helloooooooooo Wooooooooorld!! Hellooooo Woooooorld!!';
    results.push(pot.truncate(string, 10));
    string = 'foooooooo baaaaaaaaar baaaaaaaaaaz';
    results.push(pot.truncate(string, 16, '...more'));
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
    results.push(pot.truncateMiddle(string, 15));
    string = 'foooooooo baaaaaaaaar baaaaaaaaaaz';
    results.push(pot.truncateMiddle(string, 18, '(...)'));
    return results;
  },
  expect : [
    'Helloo...orld!!',
    'foooooo(...)aaaaaz'
  ]
}, {
  title  : 'Pot.toCharCode()',
  code   : function() {
    var result = [];
    var string = 'foo bar \u307b\u3052';
    result.push(pot.toCharCode(string));
    var string2 = 'abc';
    result.push(pot.toCharCode(string2, function(code) {
      return code.toString(16);
    }));
    return result;
  },
  expect : [
    [102, 111, 111, 32, 98, 97, 114, 32, 12411, 12370],
    ['61', '62', '63']
  ]
}, {
  title  : 'Pot.toHankakuCase()',
  code   : function() {
    return pot.toHankakuCase('\uff28\uff45\uff4c\uff4c\uff4f \uff37\uff4f\uff52\uff4c\uff44\uff01 \uff11\uff12\uff13\uff14\uff15');
  },
  expect : 'Hello World! 12345'
}, {
  title  : 'Pot.toZenkakuCase()',
  code   : function() {
    return pot.toZenkakuCase('Hello World! 12345');
  },
  expect : '\uff28\uff45\uff4c\uff4c\uff4f \uff37\uff4f\uff52\uff4c\uff44\uff01 \uff11\uff12\uff13\uff14\uff15'
}, {
  title  : 'Pot.toHanSpaceCase()',
  code   : function() {
    return pot.toHanSpaceCase(' \u3000hoge\u3000 ');
  },
  expect : '  hoge  '
}, {
  title  : 'Pot.toZenSpaceCase()',
  code   : function() {
    return pot.toZenSpaceCase('  hoge  ');
  },
  expect : '\u3000\u3000hoge\u3000\u3000'
}, {
  title  : 'Pot.toHiraganaCase()',
  code   : function() {
    return pot.toHiraganaCase('\u30dc\u30dd\u30f4\u30a1\u30a2\u30a3\u30a4\u30a5\u30a6\u30a7\u30a8\u30a9\u30aa');
  },
  expect : '\u307c\u307d\u3046\u309b\u3041\u3042\u3043\u3044\u3045\u3046\u3047\u3048\u3049\u304a'
}, {
  title  : 'Pot.toKatakanaCase()',
  code   : function() {
    return pot.toKatakanaCase('\u307c\u307d\u3046\u309b\u3041\u3042\u3043\u3044\u3045\u3046\u3047\u3048\u3049\u304a');
  },
  expect : '\u30dc\u30dd\u30f4\u30a1\u30a2\u30a3\u30a4\u30a5\u30a6\u30a7\u30a8\u30a9\u30aa'
}, {
  title  : 'Pot.toHankanaCase()',
  code   : function() {
    return pot.toHankanaCase('\u30dc\u30dd\u30f4\u30a1\u30a2\u30a3\u30a4\u30a5\u30a6\u30a7\u30a8\u30a9\u30aa');
  },
  expect : '\uff8e\uff9e\uff8e\uff9f\uff73\uff9e\uff67\uff71\uff68\uff72\uff69\uff73\uff6a\uff74\uff6b\uff75'
}, {
  title  : 'Pot.toZenkanaCase()',
  code   : function() {
    return pot.toZenkanaCase('\uff8e\uff9e\uff8e\uff9f\uff73\uff9e\uff67\uff71\uff68\uff72\uff69\uff73\uff6a\uff74\uff6b\uff75');
  },
  expect : '\u30dc\u30dd\u30f4\u30a1\u30a2\u30a3\u30a4\u30a5\u30a6\u30a7\u30a8\u30a9\u30aa'
}];


describe('Pot.js', function() {
  before(function(done) {
    done();
  });

  tests.forEach(function(test) {
    describe(test.title, function() {
      it('test', function(done) {
        pot.maybeDeferred(test.code()).then(function(res) {
          assert.deepEqual(res, test.expect);
          done();
        });
      });
    });
  });
});

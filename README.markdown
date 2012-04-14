Pot.js
========

**Pot.js / PotLite.js** :  
Pot.js is an implemental utility library that can execute JavaScript without burdening the CPU.

Pot.js / PotLite.js implements practical tendency as a substitution utility library.  
That includes asynchronous methods as "Deferred" for solution to heavy process.  
That is fully ECMAScript compliant.


**Pot.js** is a JavaScript library that can be performed without causing stress to the UI and
the CPU load by using easy loop iteration functions.

With respect to load, you can implement a particular application without requiring the programmer to be aware of.

Pot.js is built around the asynchronous processing and iterator with Deferred.
**Pot.Deferred** is a Deferred object like MochiKit (or JSDeferred like).  
That makes it possible to various iterations (forEach, filter, map, reduce, zip, repeat, some etc.).

Moreover, Pot.js is an utility library that handles string processes with various algorithms,
and it has the *Signal* object that can write like aspect-oriented (AOP),  
and it has the Event object for DOM listener,
and treats it the File API for HTML5. etc.

And, Pot.js never pollute the prototype of the global objects.

We only define the '*Pot*' object in the global scope basically.  
You can use Pot.js with other available libraries without fear of conflict.

Pot.js is a cross-browser library that works on a Web browser,
Node.js, userscript (Greasemonkey, Scriptish) XUL, or (Firefox Add-ons) etc.

**PotLite.js** is a light version that extracts only the part of
asynchronous processing (Deferred etc.) has been implemented in Pot.js.


Install
========
Will work with common ways.

    <script type="text/javascript" src="pot.min.js"></script>
    <!-- or -->
    <script type="text/javascript" src="potlite.min.js"></script>

For Node.js.

    // Example to define Pot object on Node.js.
    var Pot = require('./pot.min.js');
    Pot.debug(Pot.VERSION);
    
    Pot.Deferred.begin(function() {
        Pot.debug('Hello World!');
    }).then(function() {
        // ...
    })
    // ...

Example of Greasemonkey (userscript).

    // ==UserScript==
    // ...
    // @require  https://github.com/polygonplanet/Pot.js/raw/master/pot.min.js
    // ...
    // ==/UserScript==
    Pot.Deferred.begin(function() {
        var url = 'http://www.example.com/data.json';
        return Pot.request(url).then(function(res) {
            return Pot.parseFromJSON(res.responseText);
        });
    }).then(function(res) {
        Pot.debug(res);
        // do something...
    });
    //...

As for jQuery plugin.

    // Run after loading with jQuery.
    Pot.deferrizejQueryAjax();
    
    // Ajax-based functions will return with Pot.Deferred object instance.
    $.getJSON('/hoge.json').then(function(data) {
        alert(data.results[0].text);
    }).rescue(function(err) {
        alert('Error! ' + err);
    }).ensure(function() {
        return someNextProcess();
    });

    // Will added 'deferred' method for effects etc
    //  that convert to Deferred functions.
    $('div#hoge').deferred('hide', 'slow').then(function() {
        // (...Do something after hide() method completed.)
    });

Compatibility
========
Pot.js / PotLite.js works with the following web browsers.

  * Mozilla Firefox *
  * Internet Explorer 6+
  * Safari *
  * Opera *
  * Google Chrome *

And, it also designed for operate in following environments.

  * Greasemonkey (userscript)
  * Mozilla Firefox Add-On (on XUL)
  * Node.js
  * Other non-browser environment

Test Run
========

  * [Pot.js - Test Run][Pot.js_TestRun]
  * [PotLite.js - Test Run][PotLite.js_TestRun]


License
========
Dual licensed under the MIT and GPL v2 licenses.    
Copyright &copy; 2012 polygon planet

Documentation And Reference
========

  * **[Pot.js + PotLite.js - Document and Reference][Reference]**  
  * JSDoc Document
      * [Pot.js - JsDoc Reference - Index][Pot_JSDoc]
      * [PotLite.js - JsDoc Reference - Index][PotLite_JSDoc]


Example
========
Example:   
A simple iterate and Deferred object usage with asynchronous and synchronous.

    // This example uses globalize for short function name.
    Pot.globalize();
    
    begin(function() {
        debug('BEGIN example');
    }).then(function() {
        // A simple HTTP request
        //  that even works on Node.js (non-browser).
        return request('pot.js.example.json', {
            mimeType : 'application/json'
        }).ensure(function(res) {
            if (isError(res)) {
                return {
                    foo : 'fooError',
                    bar : 'barError',
                    baz : 'bazError'
                };
            } else {
                debug(res.responseText);
                // e.g., responseText = {
                //         foo: 'fooValue',
                //         bar: 'barValue',
                //         baz: 'bazValue'
                //       }
                return parseFromJSON(res.responseText);
            }
            // Iterate on chain by "forEach" method.
        }).forEach(function(val, key) {
            debug(key + ' : ' + val); // foo : fooValue ... etc.
            
            // Executed in one second intervals.
            return wait(1);
            
            // Wait 0.5 seconds
            //  and set the speed to slow between each chains.
        }).wait(0.5).speed('slow').then(function(res) {
            var s = '', keys = [];
            
            // Iterate by "forEach" method on synchronous.
            forEach(res, function(val, key) {
                s += key;
                keys.push(key);
            });
            keys.push(s);
            return keys;
            
            // Like (Destructuring-Assignment)
        }).then(function(foo, bar, baz, all) {
            debug('foo = ' + foo); // foo = 'foo'
            debug('bar = ' + bar); // bar = 'bar'
            debug('baz = ' + baz); // baz = 'baz'
            debug('all = ' + all); // all = 'foobarbaz'
            
            return [foo, bar, baz];
            
            // Iterate by "map" method at a slower speed.
        }).map.doze(function(val) {
            debug('in map.doze(val) : ' + val);
            
            return val + '!';
            
        }).then(function(res) {
            debug(res); // ['foo!', 'bar!', 'baz!']
            
            var d = new Deferred();
            return d.then(function() {
                // Generate an error for testing.
                throw new Error('TestError');
                
            }).then(function() {
                // This callback chain never executed
                //  because occured the error.
                debug('Help me!!');
                
            }).rescue(function(err) {
                // Catch the error.
                debug(err); // (Error: TestError)
                
            }).then(function() {
                // And, continue the callback chain.
                
                // Iterate by "reduce" method on asynchronous.
                return Deferred.reduce(res, function(a, b) {
                    return a + b;
                }).then(function(result) {
                    return result;
                });
            }).begin(); // Begin the callback chain.
            
        }).wait(2).then(function(res) {
            
            debug(res); // 'foo!bar!baz!'
            
            // Iterate by "filter" method on synchronous.
            return filter(res.split('!'), function(val) {
                return val && val.length;
            });
        });
        
    }).then(function(result) {
        debug(result); // ['foo', 'bar', 'baz']
        debug('END example');
        
    }).end(); // Chain can be closed by the "end" method on any.

Refer document if you want to need more example and usage.  
  
**[Pot.js + PotLite.js - Document and Reference][Reference]**  





[Pot_JSDoc]: http://polygonplanet.github.com/Pot.js/jsdoc/index.html "Pot.js - JsDoc Reference - Index"

[PotLite_JSDoc]: http://polygonplanet.github.com/Pot.js/jsdoc/potlite/index.html "PotLite.js - JsDoc Reference - Index"

[Reference]: http://polygonplanet.github.com/Pot.js/ "Pot.js + PotLite.js - Document and Reference"

[Pot.js_TestRun]: http://polygonplanet.github.com/Pot.js/pot.test.html "Pot.js - Test Run - JavaScript Utility Library"

[PotLite.js_TestRun]: http://polygonplanet.github.com/Pot.js/potlite.test.html "PotLite.js - Test Run - JavaScript Async Library"




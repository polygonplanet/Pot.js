Pot.js
========

**Pot.js / PotLite.js** :  
JavaScript utility library for asynchronous processing with Deferred.

Pot.js / PotLite.js implements practical tendency as a substitution utility library.  
That includes asynchronous methods as "Deferred" for solution to heavy process.  
That is fully ECMAScript compliant.

Install
========
Will work with common ways.

    <script type="text/javascript" src="potlite.min.js"></script>

For Node.js.

    // Example to define Pot object on Node.js.
    var Pot = require('./potlite.js').Pot;
    Pot.debug(Pot.VERSION);
    
    Pot.Deferred.begin(function() {
        Pot.debug('Hello Deferred!');
    }).then(function() {...})
    // ...


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
        // (Do something after hide() method completed.)
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

License
========
Dual licensed under the MIT and GPL v2 licenses.    
Copyright &copy; 2011 polygon planet

Documentation And Reference
========
Currently available stable library is PotLite.js.    
That is limited with asynchronous processing as lightweight version of Pot.js.

  * **[Pot.js/PotLite.js - Document and Reference (Japanese)][Documentation_JA]**  
  * JSDoc Document
      * Pot.js (yet incomplete)
      * [PotLite.js - JsDoc Reference - Index][PotLite_JSDoc]






[PotLite_JSDoc]: http://polygonplanet.github.com/Pot.js/jsdoc/potlite/index.html "PotLite.js - JsDoc Reference - Index"

[Documentation_JA]: http://polygonplanet.github.com/Pot.js/index.html "Pot.js + PotLite.js - Document and Reference (Japanese)"


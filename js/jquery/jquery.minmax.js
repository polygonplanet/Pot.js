/* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-*
 *
 * minmax:
 *
 *  Make IE5+/win support CSS min/max-width/height
 *  For jQuery plugin modified.
 *  Version: 1.00, 2010-11-18
 *  Author: polygon planet <polygon.planet@gmail.com>
 *
 * *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-*
 *
 *  Usage:
 *   Just insert in your HTML page to the script after the jQuery required.
 *   <script type="text/javascript" src="jquery.js"></script>
 *   <script type="text/javascript" src="jquery.minmax.js"></script>
 *
 * *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-*
 *
 *  original base by:
 *   version 1.0, 08-Aug-2003
 *   written by Andrew Clover <and@doxdesk.com>, use freely
 *  The original source code is available at the following link.
 *   http://www.doxdesk.com/software/js/minmax.html
 *
 * *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-* *-*
**/

/*@cc_on
@if (@_win32 && @_jscript_version>4)

;(function($, undefined){

  $.minmax = {};

  var elements,
      id = 'jq-MinMax-Spy-' + (new Date).getTime(),
      props = {
        minWidth: 'min-width',
        maxWidth: 'max-width',
        minHeight: 'min-height',
        maxHeight: 'max-height'
      },
      fontsize = 0,
      // Request re-layout at next available moment
      delaying = false,
      scanner,
      elementMaps = [],
      scanDelay = 500;
  
  // check for font size changes
  $.minmax.checkFont = function() {
    var fs = $('#' + id).get(0).offsetHeight;
    if (fontsize != fs && fontsize != 0) {
      delayout();
    }
    fontsize = fs;
    return '5em';
  };
  
  scan();
  scanner = window.setInterval(scan, scanDelay);
  $(window).load(function(){ stop() });
  
  // Binding. Called on all new elements. If <body>, initialise; check all
  // elements for minmax properties
  function bind(el) {
    var i, spy, ms, st = el.style, cs = el.currentStyle;
    
    if (elements === undefined) {
      // initialise when body element has turned up, but only on IE
      if (!document.body || !document.body.currentStyle) {
        return;
      }
      elements = [];
      $(window).resize(function(){ delayout() });
      // make font size listener
      spy = $('<div/>').
        attr({ id: id }).
        css({
          position: 'absolute',
          visibility: 'hidden',
          fontSize: 'xx-large',
          height: '5em',
          top: '-5em',
          left: 0
        }
      );
      if (spy.get(0).style.setExpression) {
        spy.get(0).style.setExpression('width', 'jQuery.minmax.checkFont()');
        $('body').prepend(spy);
      }
    }
    // transform hyphenated properties the browser has not caught to camelCase
    $.each(props, function(camel, hyphen){
      if (cs[hyphen]) {
        st[camel] = cs[hyphen];
      }
    });
    // add element with properties to list, store optimal size values
    $.each(props, function(camel, hyphen){
      ms = cs[camel];
      if (isNot(ms, 'auto', 'none', '0', '')) {
        st.jqMinMaxWidth = cs.width;
        st.jqMinMaxHeight = cs.height;
        elements[elements.length] = el;
        // will need a layout later
        delayout();
        return false;
      }
    });
  }

  // Layout. Called after window and font size-change. Go through elements we
  // picked out earlier and set their size to the minimum,
  // maximum and optimum, choosing whichever is appropriate

  function delayout() {
    if (delaying) {
      return;
    }
    delaying = true;
    window.setTimeout(layout, 0);
  }

  function stopDelaying() {
    delaying = false;
  }

  function layout() {
    window.setTimeout(stopDelaying, 100);
    var i, el, st, cs, size, inRange;
    for (i = elements.length; i-- > 0;) {
      el = elements[i];
      st = el.style;
      cs = el.currentStyle;
      // horizontal size bounding
      st.width = st.jqMinMaxWidth;
      size = el.offsetWidth;
      inRange = true;
      if (inRange && isNot(cs.minWidth, '0', 'auto', '')) {
        st.width = cs.minWidth;
        inRange = (el.offsetWidth < size);
      }
      if (inRange && isNot(cs.maxWidth, 'none', 'auto', '')) {
        st.width = cs.maxWidth;
        inRange = (el.offsetWidth > size);
      }
      if (inRange) {
        st.width = st.jqMinMaxWidth;
      }
      // vertical size bounding
      st.height = st.jqMinMaxHeight;
      size = el.offsetHeight;
      inRange = true;
      if (inRange && isNot(cs.minHeight, '0', 'auto', '')) {
        st.height = cs.minHeight;
        inRange = (el.offsetHeight < size);
      }
      if (inRange && isNot(cs.maxHeight, 'none', 'auto', '')) {
        st.height = cs.maxHeight;
        inRange = (el.offsetHeight > size);
      }
      if (inRange) {
        st.height = st.jqMinMaxHeight;
      }
    }
  }

  // Scanning. Check document every so often until it has finished loading.
  // Do nothing until <body> arrives, then call main init.
  // Pass any new elements found on each scan to be bound

  function scan() {
    var i, j, has, el;
    for (i = 0; i < document.all.length; i++) {
      el = document.all[i];
      has = false;
      for (j = 0; j < elementMaps.length; j++) {
        if (elementMaps[j] === el) {
          has = true;
          break;
        }
      }
      if (!has) {
        elementMaps.push(el);
        bind(el);
      }
    }
  }

  function stop() {
    window.clearInterval(scanner);
    scan();
  }

  function isNot(){
    var args = Array.prototype.slice.call(arguments, 0),
        i = 0, o = args[i++], r = false;
    if (o) {
      r = true;
      while (i < args.length) {
        if (o == args[i++]) {
          r = false;
          break;
        }
      }
    }
    return r;
  }

})(jQuery);

@end @*/

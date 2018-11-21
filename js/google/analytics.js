/*!
 * Google Analytics - Custom Script
 *
 * Version 1.21, 2014-09-27 polygon planet <polygon.planet.aqua@gmail.com>
 * Licensed under the MIT license.
 */

(function() {
  'use strict';

  init();


  function init() {
    var id = getId();
    if (!id) {
      throw new Error('Cannot get analytics id.');
    }

    appendScript(id);
  }


  function appendScript(id) {
    window['GoogleAnalyticsObject'] = 'ga';
    window.ga = window.ga || function() {
      (window.ga.q = window.ga.q || []).push(arguments);
    };
    window.ga.l = +new Date();
    var script = document.createElement('script');
    var first = document.getElementsByTagName('script')[0];
    script.async = true;
    script.src = '//www.google-analytics.com/analytics.js';
    first.parentNode.insertBefore(script, first);

    window.ga('create', id, 'auto');
    window.ga('send', 'pageview');
  }


  function getId() {
    var scripts = document.getElementsByTagName('script');
    var query = '';
    var script, src, query;

    for (var i = 0, len = scripts.length; i < len; i++) {
      script = scripts[i];
      if (script && script.src) {
        src = '' + script.src;
        if (/analytics/i.test(src)) {
          query = src.split('?').pop();
          break;
        }
      }
    }

    var m = query.match(/(UA(?:-\d+)+)/i);
    return m && m[1].toUpperCase() || '';
  }


  function forEach(object, callback, context) {
    var i, len = object.length;

    if (typeof len === 'number') {
      for (i = 0; i < len; i++) {
        if (callback.call(context, object[i], i, object) === false) {
          break;
        }
      }
    } else {
      for (i in object) {
        if (callback.call(context, object[i], i, object) === false) {
          break;
        }
      }
    }
    return object;
  }

}());

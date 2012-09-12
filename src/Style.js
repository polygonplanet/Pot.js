//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Style.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * CSS utilities.
   *
   * @name  Pot.Style
   * @type  Object
   * @class
   * @static
   * @public
   */
  Style : {}
});

update(Pot.Style, {
  /**
   * @lends Pot.Style
   */
  /**
   * @const
   * @ignore
   */
  NAME : 'Style',
  /**
   * Return the string representation of object.
   *
   * @return {String}  The string representation of object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  toString : PotToString,
  /**
   * Exclude the following css properties to add px
   *
   * @private
   * @ignore
   */
  NumberTypes : {
    fillOpacity : true,
    fontWeight  : true,
    lineHeight  : true,
    opacity     : true,
    orphans     : true,
    widows      : true,
    zIndex      : true,
    zoom        : true
  },
  /**
   * Normalize float css property.
   * Add in properties whose names you wish to fix before
   *   setting or getting the value.
   *
   * @private
   * @ignore
   */
  PropMaps : (function() {
    var maps = {}, p;
    maps.dir = {
      'float' : PotBrowser.msie ? 'styleFloat' : 'cssFloat'
    };
    maps.raw = {};
    for (p in maps.dir) {
      maps.raw[maps.dir[p]] = p;
    }
    maps.ref = {
      /**@ignore*/
      whiteSpace : function(elem, key, val) {
        if (/pre-?wrap/i.test(val)) {
          return {
            /**@ignore*/
            get : function() {
              return Pot.Style.getStyle(elem, key);
            },
            /**@ignore*/
            set : function() {
              return Pot.Style.setPreWrap(elem);
            }
          };
        } else {
          return {
            /**@ignore*/
            get : function() {
              return Pot.Style.getStyle(elem, key);
            },
            /**@ignore*/
            set : function() {
              return Pot.Style.setStyle(elem, key, val);
            }
          };
        }
      },
      /**@ignore*/
      opacity : function(elem, key, val) {
        return {
          /**@ignore*/
          get : function() {
            return Pot.Style.getOpacity(elem, key);
          },
          /**@ignore*/
          set : function() {
            return Pot.Style.setOpacity(elem, val);
          }
        }
      }
    };
    return maps;
  }()),
  /**
   * @lends Pot.Style
   */
  /**
   * Get or set the element's style.
   *
   *
   * @param  {Element}        elem  The target element node.
   * @param  {String|Object}  name  Get the style if you pass a string.
   *                                Set each styles if you pass an object.
   * @param  {String|*}             The value to set.
   * @return {*}                    Return the obtained style value,
   *                                  or if you set the value then
   *                                  will return the element.
   * @type   Function
   * @function
   * @static
   * @public
   */
  css : function(elem, name, value) {
    var result, args = arguments;
    each(arrayize(elem), function(el) {
      if (isElement(el) && name != null) {
        switch (args.length) {
          case 0:
          case 1:
              break;
          case 2:
              if (isObject(name)) {
                result = Pot.Style.setStyle(el, name);
              } else {
                result = Pot.Style.getStyle(el, name);
              }
              break;
          default:
              result = Pot.Style.setStyle(el, name, value);
        }
      }
    });
    return result;
  },
  /**
   * Get the computed style value of a node.
   *
   * @param  {Element}  elem   Element to get style of.
   * @param  {String}   prop   Property to get (camel-case).
   * @return {String}          Style value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getComputedStyle : function(elem, prop) {
    var result = '', doc, styles;
    doc = Pot.DOM.getOwnerDocument(elem);
    if (doc.defaultView && doc.defaultView.getComputedStyle) {
      styles = doc.defaultView.getComputedStyle(elem, null);
      if (styles) {
        result = styles[prop] || styles.getPropertyValue(prop) || '';
      }
    }
    return result;
  },
  /**
   * Gets the cascaded style value of a node, or null.
   *
   * @param  {Element}  elem   Element to get style of.
   * @param  {String}   style  Property to get (camel-case).
   * @return {String}          Style value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getCascadedStyle : function(elem, style) {
    return (elem && elem.currentStyle) ?
      (elem.currentStyle[style] || '') : '';
  },
  /**
   * Get the style value.
   *
   * @param  {Element}  elem       Element to get style of.
   * @param  {String}   styleName  Property to get.
   * @return {String}              Style value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getStyle : update(function(elem, styleName) {
    var result = '', me = Pot.Style.getStyle, style, camel, dir, raw, ref;
    dir = Pot.Style.PropMaps.dir;
    raw = Pot.Style.PropMaps.raw;
    ref = Pot.Style.PropMaps.ref;
    if (elem) {
      style = stringify(styleName);
      camel = Pot.Text.camelize(style);
      if (camel in ref) {
        result = ref[camel](elem, style).get();
      } else {
        result = me.find(elem, style) ||
          (style in dir && me.find(elem, dir[style])) ||
          (style in raw && me.find(elem, raw[style])) || '';
      }
    }
    return result;
  }, {
    /**@ignore*/
    find : function(elem, style) {
      var c, camel;
      c = (~style.indexOf('-'));
      camel = c ? Pot.Text.camelize(style) : style;
      return Pot.Style.getComputedStyle(elem, style)  || (c &&
             Pot.Style.getComputedStyle(elem, camel)) ||
             Pot.Style.getCascadedStyle(elem, style)  || (c &&
             Pot.Style.getCascadedStyle(elem, camel)) ||
             elem.style[camel] || '';
    }
  }),
  /**
   * Set the style value.
   *
   * @param  {Element}         elem    Element to set style of.
   * @param  {String|Object}   name    Style name string or
   *                                     key-value object.
   * @param  {String|*}       (value)  Style value.
   * @return {Boolean}                 Success or failure.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setStyle : function(elem, name, value) {
    var result = false, args = arguments, styles = {}, dir, ref;
    switch (args.length) {
      case 0:
      case 1:
          return false;
      case 2:
          if (isObject(name)) {
            styles = name;
          } else {
            return false;
          }
          break;
      default:
          styles[stringify(name)] = value;
    }
    if (isElement(elem)) {
      dir = Pot.Style.PropMaps.dir;
      ref = Pot.Style.PropMaps.ref;
      each.quick(styles, function(v, k) {
        var key = stringify(k), val = v;
        if (~key.indexOf('-')) {
          key = Pot.Text.camelize(key);
        }
        if (key in dir) {
          key = dir[key];
        }
        if ((isNumber(val) || !/[^\d.]/.test(val)) &&
            !(key in Pot.Style.NumberTypes)) {
          val = Pot.Style.pxize(val);
        }
        if (key in ref) {
          try {
            ref[key](elem, key, val).set();
            result = true;
            return;
          } catch (e) {}
        }
        try {
          elem.style[key] = val;
          result = true;
        } catch (e) {}
      });
    }
    return result;
  },
  /**
   * Gets the opacity of a node.
   *
   * @param  {Element}        el     Element whose opacity has to be found.
   * @return {Number|String}         Opacity between 0 and 1 or
   *                                   an empty string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getOpacity : function(el) {
    var result, style, match, re;
    if (el) {
      style = el.style;
      if ('opacity' in style) {
        result = style.opacity - 0;
      } else if ('MozOpacity' in style) {
        result = style.MozOpacity - 0;
      } else if ('filter' in style) {
        re = /alpha\s*[(]\s*opacity\s*=\s*([\d.]+)\s*[)]/i;
        match = stringify(style.filter).match(re);
        if (match) {
          result = String(match[1] / 100) - 0;
        }
      }
    }
    return result;
  },
  /**
   * Sets the opacity of a node.
   *
   * @param  {Element}         el      Elements whose opacity has to be set.
   * @param  {Number|String}  alpha    Opacity between 0 and 1 or
   *                                     an empty string to clear the opacity.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setOpacity : function(el, alpha) {
    var style;
    if (el) {
      style = el.style;
      if ('opacity' in style) {
        style.opacity = alpha;
      } else if ('MozOpacity' in style) {
        style.MozOpacity = alpha;
      } else if ('filter' in style) {
        if (isNumeric(alpha)) {
          style.filter = 'alpha(opacity=' + (alpha * 100) + ')';
        } else {
          style.filter = '';
        }
      }
    }
  },
  /**
   * Sets 'white-space: pre-wrap' for a node.
   *
   * There are as many ways of specifying pre-wrap as there are browsers.
   * <pre>
   * CSS3/IE8: white-space: pre-wrap;
   * Mozilla:  white-space: -moz-pre-wrap;
   * Opera:    white-space: -o-pre-wrap;
   * IE6/7:    white-space: pre; word-wrap: break-word;
   * </pre>
   *
   * @param  {Element}   el   Element to enable pre-wrap for.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setPreWrap : function(el) {
    var style;
    if (el) {
      style = el.style;
      if (PotBrowser.msie &&
          Pot.Complex.compareVersions(PotBrowser.msie.version, '8', '<')
      ) {
        style.whiteSpace = 'pre';
        style.wordWrap   = 'break-word';
      } else if (PotBrowser.mozilla) {
        style.whiteSpace = '-moz-pre-wrap';
      } else {
        style.whiteSpace = 'pre-wrap';
      }
    }
  },
  /**
   * Check whether the element is shown.
   *
   *
   * @param  {Element}        elem  The target element node.
   * @return {*}                    Return whether the element is shown.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isShown : function(elem) {
    return isElement(elem) &&
           Pot.Style.getStyle(elem, 'display') != 'none';
  },
  /**
   * Check whether the element is visible.
   *
   *
   * @param  {Element}        elem  The target element node.
   * @return {*}                    Return whether the element is visible.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isVisible : function(elem) {
    return isElement(elem) &&
           Pot.Style.getStyle(elem, 'visibility') != 'hidden';
  },
  /**
   * Add 'px' suffix to integer value.
   *
   * @param  {String|Number}   value    The numeric value.
   * @param  {Boolean}         round    Whether to round the nearest integer.
   * @return {String}                   The string value for the property.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  pxize : function(value, round) {
    var n = (isNumeric(value) ? value : numeric(value)) - 0;
    if (round) {
      n = Math.round(n);
    }
    return n + 'px';
  },
  /**
   * Gets the height and width and position of an element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @return {Object}             Object with
   *                                width/height/left/top properties.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSizePos : function(elem) {
    var result, x, y, w, h, org, style;
    //XXX: Implements "Rect", "Box", "Coordinate" constructors.
    result = {
      left   : null,
      top    : null,
      width  : null,
      height : null
    };
    if (!elem || !isNodeLike(elem)) {
      return result;
    }
    style = elem.style;
    if (!Pot.Style.isShown(elem) ||
        ((elem.offsetParent == null ||
         (elem.offsetWidth  == 0 && elem.offsetHeight == 0)) &&
         Pot.DOM.tagNameOf(elem) !== 'body')
    ) {
      org = {
        display    : style.display,
        visibility : style.visibility,
        position   : style.position
      };
      style.visibility = 'hidden';
      style.position   = 'absolute';
      style.display    = 'inline';
    }
    x = elem.offsetLeft   || style.pixelLeft   || 0;
    y = elem.offsetTop    || style.pixelTop    || 0;
    w = elem.offsetWidth  || style.pixelWidth  || 0;
    h = elem.offsetHeight || style.pixelHeight || 0;
    if (org) {
      style.display    = org.display;
      style.position   = org.position;
      style.visibility = org.visibility;
    }
    result.left   = x - 0;
    result.top    = y - 0;
    result.width  = w - 0;
    result.height = h - 0;
    return result;
  },
  /**
   * Gets the height and width of an element.
   *
   * @param  {Element}   elem    Element to get width of.
   * @param  {Boolean}  (extra)  Whether include margin.
   * @return {Object}            Object with width/height properties.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  getPixelSize : function(elem, extra) {
    var result = {}, maps;
    result.width  = null;
    result.height = null;
    if (isElement(elem)) {
      maps = {
        Width : {
          Left  : 1,
          Right : 1
        },
        Height : {
          Top    : 1,
          Bottom : 1
        }
      };
      each(maps, function(map, key) {
        var value = elem['offset' + key];
        if (value > 0) {
          each(map, function(n, ax) {
            if (!extra) {
              value -= parseFloat(
                Pot.Style.getStyle(elem, 'padding' + ax)
              ) || 0;
            }
            if (extra) {
              value += parseFloat(
                Pot.Style.getStyle(elem, 'margin' + ax)
              ) || 0;
            } else {
              value -= parseFloat(
                Pot.Style.getStyle(elem, 'border' + ax + 'Width')
              ) || 0;
            }
          });
        } else {
          // Fall back to computed then uncomputed css if necessary
          value = Pot.Style.getStyle(elem, key);
          if (value < 0 || value == null) {
            value = elem.style[key] || 0;
          }
          value = parseFloat(value) || 0;
          if (extra) {
            each(map, function(n, ax) {
              value += parseFloat(
                Pot.Style.getStyle(elem, 'padding' + ax)
              ) || 0;
              value += parseFloat(
                Pot.Style.getStyle(elem, 'margin' + ax)
              ) || 0;
            });
          }
        }
        result[Pot.Text.lower(key)] = Pot.Style.pxize(value);
      });
    }
    return result;
  },
  /**
   * Sets the width and height to the element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @param  {Number}     width   Specify width.
   * @param  {Number}     height  Specify height.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  setSize : function(elem, width, height) {
    var size = {};
    if (isObject(width)) {
      size = width;
    } else {
      size.width  = width;
      size.height = height;
    }
    Pot.Style.setWidth(elem, size.width);
    Pot.Style.setHeight(elem, size.height);
  },
  /**
   * Gets the width to the element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @return {Number}             Object width.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getWidth : function(elem, extra) {
    var size = Pot.Style.getPixelSize(elem, extra);
    return size.width;
  },
  /**
   * Gets the width to the element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @param  {Number}     height  Specify width.
   * @return {Number}             Object width.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  getHeight : function(elem, extra) {
    var size = Pot.Style.getPixelSize(elem, extra);
    return size.height;
  },
  /**
   * Sets the width to the element.
   *
   * @param  {Element}    elem    Element to get width of.
   * @param  {Number}     width   Specify width.
   * @return {Number}             Object width.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  setWidth : function(elem, width) {
    if (elem) {
      Pot.Style.setStyle(elem, {
        width : width
      });
    }
  },
  /**
   * Sets the height to the element.
   *
   * @param  {Element}    elem    Element to get height of.
   * @param  {Number}     width   Specify height.
   * @return {Number}             Object height.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  setHeight : function(elem, height) {
    if (elem) {
      Pot.Style.setStyle(elem, {
        height : height
      });
    }
  },
  /**
   * Gets the resize size.
   *
   * @param  {Number} orgWidth    Original width.
   * @param  {Number} orgHeight   Original height.
   * @param  {Number} maxWidth    Maximum width.
   * @param  {(Number)} (maxHeight)   (Optional) Maximum height.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  getResizeSize : function(orgWidth, orgHeight, maxWidth, maxHeight) {
    var result, percent, ratioX, ratioY;
    if (maxHeight == null) {
      maxHeight = maxWidth;
      if (orgHeight > maxHeight) {
        percent = maxHeight / orgHeight * 100;
      } else {
        percent = 100;
      }
    } else if (maxWidth == null) {
      maxWidth = maxHeight;
      if (orgWidth > maxWidth) {
        percent = maxWidth / orgWidth * 100;
      } else {
        percent = 100;
      }
    } else {
      if (orgWidth > maxWidth) {
        ratioX = maxWidth / orgWidth * 100;
      } else {
        ratioX = 100;
      }
      if (orgHeight > maxHeight) {
        ratioY = maxHeight / orgHeight * 100;
      } else {
        ratioY = 100;
      }
      if (ratioX < ratioY) {
        percent = ratioX;
      } else if (ratioX > ratioY) {
        percent = ratioY;
      } else {
        percent = 0;
      }
    }
    if (percent === 0) {
      result = {
        width  : maxWidth,
        height : maxHeight
      };
    } else {
      result = {
        width  : Math.round(orgWidth  * percent / 100),
        height : Math.round(orgHeight * percent / 100)
      };
    }
    return result;
  }
});

// Update Pot object.
Pot.update({
  css           : Pot.Style.css,
  getStyle      : Pot.Style.getStyle,
  setStyle      : Pot.Style.setStyle,
  isShown       : Pot.Style.isShown,
  isVisible     : Pot.Style.isVisible,
  pxize         : Pot.Style.pxize,
  getSizePos    : Pot.Style.getSizePos,
  getPixelSize  : Pot.Style.getPixelSize,
  setSize       : Pot.Style.setSize,
  getWidth      : Pot.Style.getWidth,
  setWidth      : Pot.Style.setWidth,
  getHeight     : Pot.Style.getHeight,
  setHeight     : Pot.Style.setHeight,
  getResizeSize : Pot.Style.getResizeSize
});

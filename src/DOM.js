//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of DOM.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * DOM utilities.
   *
   * @name Pot.DOM
   * @type Function
   * @function
   * @class
   * @static
   * @public
   */
  DOM : function() {
    return Pot.currentDocument();
  }
});

// Update DOM methods.
(function(DOM, isWindow, isDocument, isString,
                isObject, isArray, isArrayLike) {

update(DOM, {
  /**
   * @lends Pot.DOM
   */
  /**
   * The name of Pot.DOM.
   *
   * @type String
   * @static
   * @private
   * @const
   * @ignore
   */
  NAME : 'DOM',
  /**
   * toString.
   *
   * @return {String}     The string representation of object.
   * @type Function
   * @function
   * @static
   * @public
   */
  toString : Pot.toString,
  /**
   * Enumeration for DOM node types (for reference)
   *
   * @link http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247
   * @enum {Number}
   * @static
   * @const
   * @public
   */
  NodeType : {
    ELEMENT_NODE                : 1,
    ATTRIBUTE_NODE              : 2,
    TEXT_NODE                   : 3,
    CDATA_SECTION_NODE          : 4,
    ENTITY_REFERENCE_NODE       : 5,
    ENTITY_NODE                 : 6,
    PROCESSING_INSTRUCTION_NODE : 7,
    COMMENT_NODE                : 8,
    DOCUMENT_NODE               : 9,
    DOCUMENT_TYPE_NODE          : 10,
    DOCUMENT_FRAGMENT_NODE      : 11,
    NOTATION_NODE               : 12
  },
  /**
   * Enumeration for DOM XPath result types (for reference)
   *
   * @link http://www.w3.org/TR/DOM-Level-3-XPath/ecma-script-binding.html
   * @enum {Number}
   * @static
   * @const
   * @public
   */
  XPathResult : {
    ANY_TYPE                     : 0,
    NUMBER_TYPE                  : 1,
    STRING_TYPE                  : 2,
    BOOLEAN_TYPE                 : 3,
    UNORDERED_NODE_ITERATOR_TYPE : 4,
    ORDERED_NODE_ITERATOR_TYPE   : 5,
    UNORDERED_NODE_SNAPSHOT_TYPE : 6,
    ORDERED_NODE_SNAPSHOT_TYPE   : 7,
    ANY_UNORDERED_NODE_TYPE      : 8,
    FIRST_ORDERED_NODE_TYPE      : 9
  },
  /**
   * Mapping the attribute names for access to property.
   *
   * @type Object
   * @static
   * @const
   */
  AttrMaps : (function() {
    var maps = {}, p;
    maps.dir = {
      'for'         : 'htmlFor',
      'class'       : 'className',
      'readonly'    : 'readOnly',
      'maxlength'   : 'maxLength',
      'cellpadding' : 'cellPadding',
      'cellspacing' : 'cellSpacing',
      'rowspan'     : 'rowSpan',
      'colspan'     : 'colSpan',
      'tabindex'    : 'tabIndex',
      'usemap'      : 'useMap',
      'frameborder' : 'frameBorder',
      'valign'      : 'vAlign',
      'checked'     : 'defaultChecked',
      'bgcolor'     : 'bgColor'
    };
    maps.raw = {};
    for (p in maps.dir) {
      maps.raw[maps.dir[p]] = p;
    }
    return maps;
  })(),
  /**
   * Detect Window object.
   *
   * @param  {Document|Element|Node|*}   x  The target object.
   * @return {Window|undefined}             Result of detected object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  detectWindow : (function() {
    /**@ignore*/
    function detect(o) {
      try {
        return (isWindow(o.window) && o.window) ||
               (isWindow(o.contentWindow) && o.contentWindow) ||
               (isWindow(o.defaultView) && o.defaultView) ||
               (isWindow(o.parentWindow) && o.parentWindow) ||
               (isWindow(o.top) && o.top) ||
               (isWindow(o.content) && o.content);
      } catch (e) {}
    }
    return function(x) {
      var win, doc;
      if (x) {
        if (isWindow(x)) {
          win = x;
        } else {
          try {
            win = detect(x);
            if (!isWindow(win)) {
              doc = DOM.detectDocument(x);
              if (doc) {
                win = detect(doc);
              }
            }
          } catch (e) {}
        }
      }
      return win;
    };
  })(),
  /**
   * Detect Document object.
   *
   * @param  {Window|Element|Node|*}   x  The target object.
   * @return {Document|undefined}         Result of detected object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  detectDocument : function(x) {
    var doc;
    if (x) {
      if (isDocument(x)) {
        doc = x;
      } else {
        try {
          doc = (x.ownerDocument || x.document ||
                (x.content && x.content.document));
        } catch (e) {}
      }
    }
    return doc;
  },
  /**
   * Returns the owner document for a node.
   *
   * @param  {Node|Window|Element}  node  The node to get the document for.
   * @return {Document}                   The document owning the node.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getOwnerDocument : function(node) {
    return node != null &&
      ((node.nodeType == DOM.NodeType.DOCUMENT_NODE) ? node :
       (node.ownerDocument || node.document || DOM.detectDocument(node)));
  },
  /**
   * Alias for getElementById.
   *
   * @param  {String|Element}    id     Element ID or a DOM node.
   * @param  {Element|Document}  (doc)  (Optional) A context node.
   * @return {Element}                  The element with the given ID,
   *                                      or the node passed in.
   * @type   Function
   * @function
   * @static
   * @public
   */
  byId : function(id, doc) {
    return isString(id) ?
      (doc || Pot.currentDocument()).getElementById(id) : id;
  },
  /**
   * Get the element(s) by simple CSS selector expression.
   * If .querySelector is available then will use it.
   *
   * @example
   *   var elem;
   *   elem = getElement('#foo');
   *   // @results  elem = Element e.g. <div id="foo"/>
   *   elem = getElement('.bar');
   *   // @results  elem = Element e.g. <div class="bar"/>
   *   elem = getElement('span.bar');
   *   // @results  elem = Element e.g. <span class="bar"/>
   *   elem = getElement('textarea');
   *   // @results  elem = Element e.g. <textarea>...</textarea>
   *   elem = getElement('[name="foo"]');
   *   // @results  elem = Element e.g. <div name="foo"/>
   *   elem = getElement('input[type="text"]');
   *   // @results  elem = Element e.g. <input type="text"/>
   *   elem = getElement('[action]');
   *   // @results  elem = Element e.g. <form action="..."/>
   *   elem = getElement('<div/>');
   *   // @results  elem = new Element e.g. <div/>
   *   elem = getElement('<div name="foo">Hello foo.</div>');
   *   // @results  elem = new Element e.g. <div name="foo">Hello foo.</div>
   *   elem = getElement('*');
   *   // @results  elem = All Elements, but will be returned first item.
   *   //                              e.g. <html lang="ja"/>
   *   // Multiple:
   *   var elems;
   *   elems = getElement('#foo, .bar, *[name="baz"]', document, true);
   *   // @results
   *   //   elems = [<div id="foo"/>, <div class="bar"/>, <div name="baz"/>]
   *   elems = getElement('*', getElement('div#foo'), true);
   *   // @results
   *   //   elems = Return all childNodes in <div id="foo">...</div>
   *
   *
   * @param  {String}            selector   The simple CSS selector.
   * @param  {Document|Element}  (context)  The target context or element.
   * @param  {Boolean}           (multi)    Whether to get the
   *                                          multiple elements.
   *                                        Default is single mode.
   * @return {Array|Element}                The result element(s).
   * @type   Function
   * @function
   * @static
   * @public
   */
  getElement : (function() {
    // http://www.w3.org/TR/css3-selectors/
    // http://www.w3.org/TR/REC-html40/types.html#type-name
    // ID and NAME tokens must begin with a letter ([A-Za-z])
    // and may be followed by any number of letters,
    // digits ([0-9]), hyphens ("-"), underscores ("_"),
    // colons (":"), and periods (".").
    /**@ignore*/
    var PATTERNS = (function() {
      var
      ident = '[\\w\\u00C0-\\uFFFF-]',
      space = '[\\s\\u00A0]',
      /**@ignore*/
      re = function() {
        return new RegExp(arrayize(arguments).join(''));
      };
      /**@ignore*/
      return {
        /**@ignore*/
        TAG : {
          /**@ignore*/
          re   : re('^([*]|', ident, '+)'),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            o.tag = m[1];
            return byTag(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        ID : {
          /**@ignore*/
          re   : re('^#(', ident, '+)'),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            return byId(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        CLASS : {
          /**@ignore*/
          re   : re('^[.](', ident, '+)'),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            return byClass(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        NAME : {
          /**@ignore*/
          re   : re('^\\[', space, '*name', space,
                    '*=', space,
                    '*["\']*(', ident, '+)[\'"]*', space,
                    '*\\]'
                 ),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            return byName(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        ATTR : {
          /**@ignore*/
          re   : re('^\\[', space, '*(', ident, '+)', space,
                    '*([~*|^$!]?=|)', space,
                    '*["\']?(.*?(?=["\'])|[^\'"[\\]]*)[\'"]?', space,
                    '*\\]'
                 ),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            if (m[2]) {
              return byAttr(o, m[1], m[2], m[3], doc, multi);
            } else {
              return byAttr(o, m[1], null, null, doc, multi);
            }
          }
        },
        /**@ignore*/
        PSEUDO : {
          /**@ignore*/
          re   : re('^::?((?:[()]|', ident, ')+)'),
          /**@ignore*/
          func : function(o, m, doc, multi) {
            return byPseudo(o, m[1], doc, multi);
          }
        },
        /**@ignore*/
        RELATIVE : {
          /**@ignore*/
          re   : re('^', space, '*((?:', space, '+|[>+~])',
                    '(?=', space, '*(?:', ident, '|[*#.[\\]:])))',
                    space, '*'
                 ),
          func : function(o, m, doc, multi) {
            o.relative = trim(m[1]) || ' ';
            o.relFirst = true;
          }
        },
        /**@ignore*/
        SPLIT  : re(space, '*,+', space, '*'),
        /**@ignore*/
        SPACES : re(space, '+'),
        /**@ignore*/
        QUOTES : /"[^"]*?"|'[^']*?'/g,
        /**@ignore*/
        PARSE_ORDER : {
          TAG      : 1,
          ID       : 2,
          CLASS    : 3,
          NAME     : 4,
          ATTR     : 5,
          PSEUDO   : 6,
          RELATIVE : 7
        }
      };
    })();
    /**@ignore*/
    function normalizeElements(elems) {
      var r = [], i, j, len, dups = [];
      len = elems && elems.length;
      if (len) {
        for (i = 0; i < len; i++) {
          for (j = i + 1; j < len; j++) {
            if (elems[i] === elems[j]) {
              dups[j] = i;
            }
          }
          if (elems[i] && !(i in dups)) {
            r[r.length] = elems[i];
          }
        }
      }
      return r;
    }
    /**@ignore*/
    function searchReplace(o, re, sel, doc, multi) {
      var m = sel.match(re.re), result;
      if (m && m[0]) {
        sel = sel.replace(m[0], '');
        result = re.func(o, m, doc, multi);
        if (o.relative) {
          if (!o.relFirst) {
            if (multi) {
              o.relments = result ? arrayize(result) : [];
            } else {
              o.relments = (result && result[0]) || result || null;
            }
            o.relmDone = true;
          }
        } else {
          if (multi) {
            o.elements = result ? arrayize(result) : [];
          } else {
            o.elements = (result && result[0]) || result || null;
          }
          o.elemDone = true;
        }
      }
      return sel;
    }
    /**@ignore*/
    function getCurrentElements(o) {
      var result;
      if (o.relmDone) {
        result = o.relments;
      } else if (o.elemDone) {
        result = o.elements;
      } else {
        return false;
      }
      return result ? arrayize(result) : [];
    }
    /**@ignore*/
    function selectRelative(o, doc, multi) {
      var result = [], parents, childs, child, i, j, len, plen, node, has;
      parents = arrayize(o.elements);
      plen = parents.length;
      if (o.relments) {
        childs = arrayize(o.relments);
        len = childs.length;
        for (i = 0; i < len; i++) {
          child = childs[i];
          node = child;
          has = false;
          try {
            switch (o.relative) {
              case ' ':
                  while ((node = node.parentNode)) {
                    for (j = 0; j < plen; j++) {
                      if (parents[j] === node) {
                        has = true;
                        break;
                      }
                    }
                    if (has) {
                      break;
                    }
                  }
                  break;
              case '>':
                  node = node.parentNode;
                  for (j = 0; j < plen; j++) {
                    if (parents[j] === node) {
                      has = true;
                      break;
                    }
                  }
                  break;
              case '+':
                  while ((node = node.previousSibling)) {
                    if (node.nodeType == DOM.NodeType.ELEMENT_NODE) {
                      for (j = 0; j < plen; j++) {
                        if (parents[j] === node) {
                          has = true;
                          break;
                        }
                      }
                      break;
                    }
                  }
                  break;
              case '~':
                  while ((node = node.previousSibling)) {
                    if (node.nodeType == DOM.NodeType.ELEMENT_NODE) {
                      for (j = 0; j < plen; j++) {
                        if (parents[j] === node) {
                          has = true;
                          break;
                        }
                      }
                      if (has) {
                        break;
                      }
                    }
                  }
                  break;
              default:
                  has = false;
                  break;
            }
          } catch (e) {
            has = false;
          }
          if (has) {
            result[result.length] = child;
          }
        }
      }
      if (multi) {
        o.elements = result || [];
      } else {
        o.elements = (result && result[0]) || null;
      }
    }
    /**@ignore*/
    function getAll(o, doc, multi) {
      var result, context, elems;
      context = doc || Pot.currentDocument();
      o.tag = o.tag || '*';
      elems = getCurrentElements(o);
      if (elems === false) {
        if (context.getElementsByTagName) {
          result = context.getElementsByTagName(o.tag);
        } else if (context.querySelectorAll) {
          result = context.querySelectorAll(o.tag);
        } else {
          result = [];
        }
      } else {
        result = elems;
      }
      if (!result || !result.length) {
        result = [];
      }
      result = arrayize(result);
      if (multi) {
        return result;
      } else {
        return (result && result[0]) || null;
      }
    }
    /**@ignore*/
    function byId(o, id, doc, multi) {
      var result, context, elems, elem, i, len;
      if (!id) {
        return multi ? [] : null;
      }
      context = doc || Pot.currentDocument();
      elems = getCurrentElements(o);
      if (elems === false) {
        result = context.getElementById(id);
      } else if (elems && elems.length) {
        result = null;
        len = elems.length;
        for (i = 0; i < len; i++) {
          elem = elems[i];
          if (elem &&
              (elem.id == id || DOM.getAttr(elem, 'id') == id)) {
            result = elem;
            break;
          }
        }
      }
      if (!result) {
        return multi ? [] : null;
      }
      if (multi) {
        return result ? [result] : [];
      } else {
        return result || null;
      }
    }
    /**@ignore*/
    function byTag(o, tag, doc, multi) {
      var result, elems, context, tagName, elem, i, len;
      o.tag = tag || o.tag || '*';
      context = doc || Pot.currentDocument();
      elems = getCurrentElements(o);
      if (elems === false) {
        if (!o.tag || o.tag === '*') {
          result = getAll(o, context, multi);
        } else {
          result = context.getElementsByTagName(o.tag);
        }
      } else if (elems && elems.length) {
        if (!o.tag || o.tag === '*') {
          result = elems;
        } else {
          tagName = stringify(o.tag).toLowerCase();
          result = [];
          len = elems.length;
          for (i = 0; i < len; i++) {
            elem = elems[i];
            if (elem && DOM.tagNameOf(elem) === tagName) {
              result[result.length] = elem;
            }
          }
        }
      }
      if (multi) {
        if (isArrayLike(result)) {
          result = (result && result.length) ? arrayize(result) : [];
        } else {
          result = result ? arrayize(result) : [];
        }
      } else {
        if (isArrayLike(result)) {
          result = ((result && result.length) ? result[0] : null) || null;
        } else {
          result = result || null;
        }
      }
      return result;
    }
    /**@ignore*/
    function byName(o, name, doc, multi) {
      var result, elems, context, elem, i, len;
      if (!name) {
        return multi ? [] : null;
      }
      context = doc || Pot.currentDocument();
      elems = getCurrentElements(o);
      if (elems === false) {
        result = context.getElementsByName(name);
      } else {
        result = [];
        len = elems.length;
        for (i = 0; i < len; i++) {
          elem = elems[i];
          if (elem &&
              (elem.name == name || DOM.getAttr(elem, 'name') == name)) {
            result[result.length] = elem;
          }
        }
      }
      if (multi) {
        if (isArrayLike(result)) {
          result = (result && result.length) ? arrayize(result) : [];
        } else {
          result = result ? arrayize(result) : [];
        }
      } else {
        if (isArrayLike(result)) {
          result = ((result && result.length) ? result[0] : null) || null;
        } else {
          result = result || null;
        }
      }
      return result;
    }
    /**@ignore*/
    function byClass(o, name, doc, multi) {
      var r = [], re, elems, elem, i, len;
      if (!name) {
        return multi ? [] : null;
      }
      re = PATTERNS.SPACES;
      elems = getCurrentElements(o);
      if (elems === false) {
        elems = getAll(o, doc, multi);
      }
      elems = arrayize(elems);
      len = elems.length;
      for (i = 0; i < len; i++) {
        elem = elems[i];
        if (elem && elem.className && (elem.className == name ||
            Pot.Struct.contains(elem.className.split(re), name))) {
          if (multi) {
            r[r.length] = elem;
          } else {
            r = elem || null;
            break;
          }
        }
      }
      return r;
    }
    /**@ignore*/
    function byAttr(o, name, op, value, doc, multi) {
      var result = [], attr, elems, node, selector, tagName, dir, raw,
          elem, i, len, has, aval;
      if (!name) {
        return multi ? [] : null;
      }
      node = doc || Pot.currentDocument();
      dir = DOM.AttrMaps.dir;
      raw = DOM.AttrMaps.raw;
      elems = getCurrentElements(o);
      if (elems === false) {
        if (node.querySelectorAll) {
          attr = raw[name] || name;
          if (op != null) {
            selector = '*[' + attr + op +
                        '"' + Pot.Sanitizer.escapeString(value) + '"]';
          } else {
            selector = '*[' + attr + ']';
          }
          if (multi) {
            result = node.querySelectorAll(selector);
            if (!result || !result.length) {
              result = [];
            } else {
              result = arrayize(result);
            }
          } else {
            result = node.querySelector(selector) || null;
          }
          return result;
        }
        elems = getAll(o, node, multi);
      }
      elems = arrayize(elems);
      len = elems.length;
      for (i = 0; i < len; i++) {
        elem = elems[i];
        has = false;
        if (Pot.isElement(elem)) {
          if (op != null) {
            aval = DOM.getAttr(elem, name);
            switch (op) {
              case '=':
                  has = (aval == value);
                  break;
              case '~=':
                  has = new RegExp(
                          '(?:^|\\s)' + rescape(value) + '(?:\\s|$)'
                        ).test(aval);
                  break;
              case '|=':
                  has = (aval == value ||
                         String(aval).indexOf(value + '-') === 0);
                  break;
              case '^=':
                  has = Pot.Text.startsWith(aval, value);
                  break;
              case '$=':
                  has = Pot.Text.endsWith(aval, value);
                  break;
              case '*=':
                  has = Pot.Struct.contains(aval, value);
                  break;
              case '!=':
                  has = (aval != value);
                  break;
              default:
                  has = false;
                  break;
            }
          } else {
            has = DOM.hasAttr(elem, name);
          }
          if (has) {
            if (multi) {
              result[result.length] = elem;
            } else {
              result = elem || null;
              break;
            }
          }
        }
      }
      if (!multi && isArrayLike(result)) {
        if (result && result.length) {
          result = result.shift() || null;
        } else {
          result = null;
        }
      }
      return result;
    }
    /**@ignore*/
    function byPseudo(o, op, doc, multi) {
      var result = [], elems, context, elem, i, len,
          node, parent, count, ok, attr, type, name,
          pseudo = stringify(op, true).toLowerCase();
      if (!pseudo) {
        return multi ? [] : null;
      }
      context = doc || Pot.currentDocument();
      elems = getCurrentElements(o);
      if (elems === false) {
        elems = getAll(o, context, multi);
      }
      elems = arrayize(elems);
      len = elems.length;
      for (i = 0; i < len; i++) {
        elem = elems[i];
        node = elem;
        try {
          switch (pseudo) {
            case 'first-child':
                while ((node = node.previousSibling)) {
                  if (node.nodeType == DOM.NodeType.ELEMENT_NODE) {
                    throw false;
                  }
                }
                break;
            case 'last-child':
                while ((node = node.nextSibling)) {
                  if (node.nodeType == DOM.NodeType.ELEMENT_NODE) {
                    throw false;
                  }
                }
                break;
            case 'even':
                parent = elem.parentNode;
                if (parent) {
                  count = 0;
                  node = parent.firstChild;
                  for (; node; node = node.nextSibling) {
                    if (node.nodeType == DOM.NodeType.ELEMENT_NODE &&
                        count++ % 2 === 0 && node === elem
                    ) {
                      ok = true;
                      break;
                    }
                  }
                }
                if (!ok) {
                  throw false;
                }
                break;
            case 'odd':
                parent = elem.parentNode;
                if (parent) {
                  count = 0;
                  node = parent.firstChild;
                  for (; node; node = node.nextSibling) {
                    if (node.nodeType == DOM.NodeType.ELEMENT_NODE &&
                        count++ % 2 === 1 && node === elem
                    ) {
                      ok = true;
                      break;
                    }
                  }
                }
                if (!ok) {
                  throw false;
                }
                break;
            case 'focus':
                if (elem === elem.ownerDocument.activeElement) {
                  break;
                }
                throw false;
            case 'enabled':
                if (elem.disabled || elem.type == 'hidden') {
                  throw false;
                }
                break;
            case 'disabled':
                if (!elem.disabled) {
                  throw false;
                }
                break;
            case 'checked':
                if (elem.checked) {
                  break;
                }
                throw false;
            case 'selected':
                if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
                }
                if (elem.selected) {
                  break;
                }
                throw false;
            case 'parent':
                if (!elem.firstChild) {
                  throw false;
                }
                break;
            case 'empty':
                if (elem.firstChild) {
                  throw false;
                }
                break;
            case 'header':
                if (!/h\d/i.test(elem.nodeName)) {
                  throw false;
                }
                break;
            case 'text':
                attr = elem.getAttribute('type');
                type = elem.type;
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'text' === type && (attr === type || attr == null)) {
                  break;
                }
                throw false;
            case 'radio':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'radio' === elem.type) {
                  break;
                }
                throw false;
            case 'checkbox':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'checkbox' === elem.type) {
                  break;
                }
                throw false;
            case 'file':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'file' === elem.type) {
                  break;
                }
                throw false;
            case 'password':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'password' === elem.type) {
                  break;
                }
                throw false;
            case 'submit':
                name = elem.nodeName.toLowerCase();
                if ((name === 'input' || name === 'button') &&
                    'submit' === elem.type) {
                  break;
                }
                throw false;
            case 'image':
                if (elem.nodeName.toLowerCase() === 'input' &&
                    'image' === elem.type) {
                  break;
                }
                throw false;
            case 'reset':
                name = elem.nodeName.toLowerCase();
                if ((name === 'input' || name === 'button') &&
                    'reset' === elem.type) {
                  break;
                }
                throw false;
            case 'button':
                name = elem.nodeName.toLowerCase();
                if ((name === 'input' && 'button' === elem.type) ||
                    name === 'button') {
                  break;
                }
                throw false;
            case 'input':
                name = elem.nodeName;
                if (/^(?:input|select|textarea|button)$/i.test(name)) {
                  break;
                }
                throw false;
            default:
                throw false;
          }
          result[result.length] = elem;
        } catch (e) {}
        if (!multi && result && result.length) {
          result = result.shift() || null;
          break;
        }
      }
      return result || null;
    }
    /**@ignore*/
    function getElementsBySelector(selector, context, multi, options) {
      var result = [], mark, cc, quotes = [], rep, doc,
          i, len, parts, part, query, o,
          j, q, qlen, regexp,
          beforePart, prevPart, key, k, qLen, qt, regex,
          s = stringify(selector, true);
      if (!s) {
        return null;
      }
      doc = DOM.getOwnerDocument(context) || Pot.currentDocument();
      context || (context = doc);
      if (!selector || !isString(selector)) {
        return multi ? [] : null;
      }
      mark = '';
      do {
        do {
          cc = (Math.random() * 0x7F) >>> 0;
        } while (cc === 0x2C);
        mark += String.fromCharCode(0, cc, 1);
      } while (~s.indexOf(mark));
      /**@ignore*/
      rep = function(m) {
        var markLen = mark + (quotes.length + 1) + mark;
        quotes[quotes.length] = {
          match : m,
          mark  : markLen
        };
        return markLen;
      };
      s = s.replace(PATTERNS.QUOTES, rep);
      parts = s.split(PATTERNS.SPLIT);
      len = parts.length;
      for (i = 0; i < len; i++) {
        part = parts[i];
        o = {
          tag      : '*',
          elements : null,
          relments : null,
          relative : null,
          relFirst : false,
          elemDone : false,
          relmDone : false
        };
        if (options && options.elements) {
          o.elements = normalizeElements(arrayize(options.elements));
          o.elemDone = true;
        }
        part = trim(part);
        if (part) {
          try {
            query = part;
            qlen = quotes.length;
            for (j = 0; j < qlen; j++) {
              q = quotes[j];
              regexp = new RegExp(rescape(q.mark));
              if (regexp.test(query)) {
                query = query.replace(regexp, q.match);
              }
            }
            if (multi && doc.querySelectorAll) {
              o.elements = Pot.Collection.merge(
                o.elements ? arrayize(o.elements) : [],
                arrayize(doc.querySelectorAll(query))
              );
            } else if (!multi && doc.querySelector) {
              o.elements = doc.querySelector(query) || null;
              throw Pot.StopIteration;
            }
          } catch (ex) {
            if (ex == Pot.StopIteration) {
              break;
            }
            do {
              beforePart = part;
              if (o.relFirst) {
                o.relFirst = false;
                o.elemDone = false;
              }
              for (key in PATTERNS.PARSE_ORDER) {
                if (part) {
                  if (key === 'ATTR') {
                    qLen = quotes.length;
                    for (k = 0; k < qLen; k++) {
                      qt = quotes[k];
                      regex = new RegExp(rescape(qt.mark));
                      if (regex.test(part)) {
                        part = part.replace(regex, qt.match);
                        quotes.splice(k, 1);
                      }
                    }
                  }
                  do {
                    prevPart = part;
                    part = searchReplace(
                      o, PATTERNS[key], part, context, multi
                    );
                  } while (prevPart !== part && part && trim(part));
                }
              }
              if (o.relative && !o.relFirst) {
                selectRelative(o, context, multi);
                o.relative = o.relments = null;
                o.relmDone = false;
                o.elemDone = true;
              }
            } while (beforePart !== part && part && trim(part));
          }
        }
        if (multi) {
          result = Pot.Collection.merge(result, arrayize(o.elements));
        } else {
          result = o.elements || null;
          break;
        }
      }
      if (multi) {
        result = normalizeElements(result);
      } else {
        if (isArrayLike(result)) {
          result = result[0] || null;
        } else {
          result = result || null;
        }
      }
      return result;
    }
    return update(function(selector, context, multi) {
      return getElementsBySelector(selector, context, multi);
    }, {
      /**@ignore*/
      find : function(elements, selector, context, multi) {
        var options = {
          elements : elements
        };
        return getElementsBySelector(selector, context, multi, options);
      }
    })
  })(),
  /**
   * A shortcut of getElement() method as multiple mode.
   * Get the elements by simple CSS selector expression.
   * If .querySelectorAll is available then will use it.
   *
   * @example
   *   var elems;
   *   elems = getElement('#foo, .bar, *[@name="baz"]', document, true);
   *   // @results
   *   //   elems = [<div id="foo"/>, <div class="bar"/>, <div name="baz"/>]
   *   elems = getElement('*', getElement('div#foo'), true);
   *   // @results
   *   //   elems = Return all childNodes in <div id="foo">...</div>
   *
   *
   * @see    Pot.DOM.getElement
   *
   * @param  {String}            selector   The simple CSS selector.
   * @param  {Document|Element}  (context)  The target context or element.
   * @return {Array}                        The result elements as an Array.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getElements : function(selector, context) {
    return DOM.getElement(selector, context, true);
  },
  /**
   * Check whether the argument object is Window.
   *
   * @see Pot.isWindow
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isWindow : isWindow,
  /**
   * Check whether the argument object is Document.
   *
   * @see Pot.isDocument
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isDocument : isDocument,
  /**
   * Check whether the argument object is Element.
   *
   * @see Pot.isElement
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isElement : Pot.isElement,
  /**
   * Check whether the argument object like Node.
   *
   * @see Pot.isNodeLike
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isNodeLike : Pot.isNodeLike,
  /**
   * Check whether the argument object is NodeList.
   *
   * @see Pot.isNodeList
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isNodeList : Pot.isNodeList,
  /**
   * Check whether the argument object is XHTML Document.
   *
   * @param  {Document}  doc  The input document object.
   * @return {Boolean}        Whether `doc` is XHTML.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isXHTML : function(doc) {
    try {
      return doc != null && doc.documentElement != null &&
             doc.documentElement.tagName !== 'HTML' &&
             doc.createElement('p').tagName === 'p';
    } catch (e) {}
    return false;
  },
  /**
   * Check whether the argument object is XML Document.
   *
   * @param  {Document}  doc  The input document object.
   * @return {Boolean}        Whether `doc` is XML.
   *
   * @type   Function
   * @function
   * @static
   * @public
   */
  isXML : function(doc) {
    var context = (doc ?
      (doc.ownerDocument || doc.document || doc) : {}).documentElement;
    return context ? context.nodeName !== 'HTML' : false;
  },
  /**
   * Get the tagname of element as lower-case string.
   *
   *
   * @example
   *   var elem = document.getElementsByTagName('*')[15];
   *   if (tagNameOf(elem) === 'div') {
   *     // do something
   *   }
   *
   *
   * @param  {Element}  elem  The target element node.
   * @return {String}         The result of tagname.
   * @type   Function
   * @function
   * @static
   * @public
   */
  tagNameOf : function(elem) {
    return elem ? stringify(elem.tagName).toLowerCase() : '';
  },
  /**
   * Get or set the element's attributes.
   *
   *
   * @param  {Element}        elem  The target element node.
   * @param  {String|Object}  name  Get the attribute if you pass a string.
   *                                Set each attributes if you pass an object.
   * @param  {String|*}             The value to set.
   * @return {*}                    Return the obtained attribute value,
   *                                  or if you set the value then
   *                                  will return the element.
   * @type   Function
   * @function
   * @static
   * @public
   */
  attr : function(elem, name, value) {
    var result, args = arguments;
    each(arrayize(elem), function(el) {
      if (Pot.isElement(el) && name != null) {
        switch (args.length) {
          case 0:
          case 1:
              break;
          case 2:
              if (isObject(name)) {
                result = DOM.setAttr(el, name);
              } else {
                result = DOM.getAttr(el, name);
              }
              break;
          case 3:
          default:
              result = DOM.setAttr(el, name, value);
              break;
        }
      }
    });
    return result;
  },
  /**
   * Get the node value.
   *
   * @param  {Element}   elem  The input node.
   * @return {String|*}        The result value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getValue : function(elem) {
    var result, value;
    if (elem) {
      switch (DOM.tagNameOf(elem)) {
        case 'option':
            value = elem.attributes && elem.attributes.value;
            if (!value || value.specified) {
              result = elem.value;
            } else {
              result = elem.text;
            }
            break;
        case 'select':
        default:
            result = elem.value;
            break;
      }
      if (isString(result)) {
        result = result.replace(/\r/g, '');
      }
    }
    return stringify(result);
  },
  /**
   * Set the value to element.
   *
   * @param  {Element}  elem   The input element.
   * @param  {*}        value  The value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setValue : function(elem, value) {
    var val;
    if (Pot.isElement(elem)) {
      elem.value = stringify(value, false);
    }
    return elem;
  },
  /**
   * Get the HTML string from element.
   *
   * @param  {Element}  elem  The target element.
   * @return {String}         The result HTML string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getHTMLString : function(elem) {
    var result;
    if (Pot.isElement(elem)) {
      try {
        result = elem.innerHTML;
      } catch (e) {}
    }
    return stringify(result);
  },
  /**
   * Set the HTML string to the element.
   *
   * @param  {Element}   elem   The input element.
   * @param  {String|*}  value  The value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setHTMLString : function(elem, value) {
    var html;
    if (Pot.isElement(elem)) {
      html = stringify(value);
      try {
        elem.innerHTML = html;
        if (elem.innerHTML != html) {
          throw html;
        }
      } catch (e) {
        try {
          DOM.removeChilds(elem);
          DOM.appendChilds(elem, value);
        } catch (e) {}
      }
    }
    return elem;
  },
  /**
   * Get the outer HTML string to the element.
   *
   * @param  {Element}   elem   The input element.
   * @return {String}           The value of result.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getOuterHTML : function(elem) {
    var result, doc, div;
    if (Pot.isElement(elem)) {
      if ('outerHTML' in elem) {
        result = elem.outerHTML;
      } else {
        doc = DOM.getOwnerDocument(elem);
        div = doc.createElement('div');
        div.appendChild(elem.cloneNode(true));
        result = div.innerHTML;
      }
    }
    return stringify(result);
  },
  /**
   * Set the outer HTML string to the element.
   *
   * @param  {Element}   elem   The input element.
   * @param  {String|*}  value  The value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setOuterHTML : function(elem, value) {
    var doc, range, done, html;
    if (Pot.isElement(elem)) {
      value = stringify(value);
      if ('outerHTML' in elem) {
        try {
          elem.outerHTML = value;
          done = true;
        } catch (e) {
          done = false;
        }
      }
      if (!done) {
        try {
          doc = DOM.getOwnerDocument(elem);
          range = doc.createRange();
          range.setStartBefore(elem);
          elem.parentNode.replaceChild(
            range.createContextualFragment(value),
            elem
          );
        } catch (e) {}
      }
    }
    return elem;
  },
  /**
   * Get the text content string from element.
   *
   * @param  {Element}  elem  The target element.
   * @return {String}         The result text content string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getTextContent : update(function(elem) {
    var result, me = arguments.callee, buffer;
    if (Pot.isElement(elem)) {
      try {
        if (Pot.Browser.msie &&
            Pot.Complex.compareVersions(Pot.Browser.msie.version, '9', '<') &&
            ('innerText' in elem)
        ) {
          result = Pot.Text.canonicalizeNL(elem.innerText);
        } else {
          buffer = [];
          me.getTextValue(elem, buffer, true);
          result = buffer.join('');
        }
        if (!result) {
          result = stringify(elem.textContent || elem.innerText, true) || '';
        }
        each(me.NORMALIZE_MAPS, function(map) {
          result = result.replace(map.by, map.to);
        });
        if (/\S/.test(result)) {
          result = trim(result);
        }
      } catch (e) {}
    }
    return stringify(result);
  }, {
    /**
     * @type Array
     * @private
     * @ignore
     */
    NORMALIZE_MAPS : [{
      by : /[\u0009\u0020][\xAD][\u0009\u0020]/g,
      to : ' '
    }, {
      by : /[\xAD]/g,
      to : ''
    }, {
      by : /[\u200B]/g,
      to : ''
    }, {
      by : /[\u0009\u0020\u00A0]+/g,
      to : ' '
    }],
    /**
     * @type {Object}
     * @private
     * @ignore
     */
    IGNORE_TAGS : {
      SCRIPT : 1,
      STYLE  : 1,
      HEAD   : 1,
      IFRAME : 1,
      OBJECT : 1
    },
    /**
     * @type {Object}
     * @private
     * @ignore
     */
    PREDEFINED_TAGS : {
      IMG : ' ',
      BR  : '\n'
    },
    getTextValue : function(node, buffer, normalizeSpace) {
      var that = DOM.getTextContent, value, nodeName, child;
      nodeName = Pot.Text.upper(node.nodeName);
      if (!(nodeName in that.IGNORE_TAGS)) {
        if (node.nodeType == DOM.NodeType.TEXT_NODE) {
          value = stringify(node.nodeValue, true);
          if (normalizeSpace) {
            buffer[buffer.length] = value.replace(/\r\n|\r|\n/g, '');
          } else {
            buffer[buffer.length] = value;
          }
        } else if (nodeName in that.PREDEFINED_TAGS) {
          buffer[buffer.length] = that.PREDEFINED_TAGS[nodeName];
        } else {
          child = node.firstChild;
          while (child) {
            that.getTextValue(child, buffer, normalizeSpace);
            child = child.nextSibling;
          }
        }
      }
    }
  }),
  /**
   * Set the Text content string to the element.
   *
   * @param  {Element}   elem   The input element.
   * @param  {String|*}  value  The value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setTextContent : function(elem, value) {
    var text, doc;
    if (Pot.isElement(elem)) {
      try {
        text = stringify(value);
        if ('textContent' in elem) {
          elem.textContent = text;
        } else if (elem.firstChild &&
                  elem.firstChild.nodeType == DOM.NodeType.TEXT_NODE) {
          while (elem.lastChild != elem.firstChild) {
            elem.removeChild(elem.lastChild);
          }
          elem.firstChild.data = text;
        } else {
          DOM.removeChilds(elem);
          doc = DOM.getOwnerDocument(elem);
          elem.appendChild(doc.createTextNode(text));
        }
      } catch (e) {}
    }
    return elem;
  },
  /**
   * Get the selection object.
   *
   * @param  {Document|Window|Element|*}  context  The input context.
   * @return {Selection|*}                         The Selection object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSelectionObject : function(context) {
    var result, sel, target, doc;
    target = context || Pot.currentWindow();
    if (target) {
      if (target.getSelection) {
        sel = target.getSelection();
      } else if (target.rangeCount) {
        sel = target;
      } else {
        doc = DOM.getOwnerDocument(target);
        if (doc) {
          try {
            sel = doc.documentElement.getSelection();
          } catch (e) {
            try {
              sel = doc.defaultView.getSelection();
            } catch (e) {}
          }
        }
      }
      if (sel && sel.rangeCount && !sel.isCollapsed) {
        result = sel;
      }
    }
    return result;
  },
  /**
   * Get the selection contents.
   *
   * @param  {Window|Document|Node|*}  context  The input context.
   * @return {Object}                           The result contents.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSelectionContents : function(context) {
    var result, sel;
    sel = DOM.getSelectionObject(context);
    if (sel) {
      result = sel.getRangeAt(0).cloneContents();
    }
    return result;
  },
  /**
   * Get the selection text.
   *
   * @param  {Window|Document|Node|*}  context  The input context.
   * @return {String}                           The selection text.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSelectionText : function(context) {
    var result = '', sel;
    sel = DOM.getSelectionObject(context);
    if (sel) {
      result = sel.toString();
    }
    return stringify(result);
  },
  /**
   * Get the selection HTML string.
   *
   * @param  {Window|Document|Node|*}  context  The input context.
   * @return {String}                           The selection HTML.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getSelectionHTML : function(context) {
    var result = '', sel, node, doc;
    sel = DOM.getSelectionContents(context);
    doc = DOM.getOwnerDocument(sel);
    if (sel && doc) {
      node = doc.createElement('div');
      node.appendChild(sel);
      result = node.innerHTML;
    }
    return stringify(result);
  },
  /**
   * Coerce to any DOM Node from argument value.
   *
   * @param  {Node|*}  node  The input node.
   * @return {Node|*}        The coerced node.
   * @type   Function
   * @function
   * @static
   * @public
   */
  coerceToNode : function(node) {
    var type;
    if (!node) {
      return node;
    }
    type = Pot.typeOf(node);
    switch (type) {
      case 'number':
      case 'boolean':
      case 'string':
          return Pot.currentDocument().createTextNode(node.toString());
      default:
          break;
    }
    return node;
  },
  /**
   * Remove the element(s) from DOM tree.
   *
   * @param  {Element}  elem  The input elemenet(s).
   * @return {Element}        Returns `elem`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  removeElement : function(elem) {
    var node = DOM.coerceToNode(elem);
    if (node) {
      if (isArrayLike(node)) {
        each(node, function(n) {
          try {
            n.parentNode.removeChild(n);
          } catch (e) {}
        });
      } else {
        try {
          node.parentNode.removeChild(node);
        } catch (e) {}
      }
    }
    return node;
  },
  /**
   * Appends all the child nodes on a DOM node.
   *
   * @param  {Node|Element}  parent  The target parent node.
   * @param  {Node|...Node}  (...)   Nodes to append children from.
   * @return {Node}                  Return the last child node appended.
   * @type   Function
   * @function
   * @static
   * @public
   */
  appendChilds : function(parent/*[, ...childs]*/) {
    var result, childs, args = arrayize(arguments, 1),
        i, j, len, child, chs, n, c;
    if (!parent || !parent.appendChild || args.length === 0) {
      return null;
    }
    if (args.length === 1) {
      childs = arrayize(args[0]);
    } else {
      childs = args;
    }
    len = childs.length;
    for (i = 0; i < len; i++) {
      child = DOM.coerceToNode(childs[i]);
      if (child) {
        try {
          result = parent.appendChild(child);
        } catch (e) {
          chs = child.childNodes;
          if (chs && chs.length) {
            n = chs.length;
            for (j = 0; j < n; j++) {
              c = DOM.coerceToNode(chs[j]);
              if (c) {
                result = parent.appendChild(c);
              }
            }
          }
        }
      }
    }
    return result;
  },
  /**
   * Prepends all the child nodes on a DOM node.
   *
   * @param  {Node|Element}  parent  The target parent node.
   * @param  {Node|...Node}  (...)   Nodes to prepend children from.
   * @return {Node}                  Return the last child node prepended.
   * @type   Function
   * @function
   * @static
   * @public
   */
  prependChilds : function(parent/*[, ...childs]*/) {
    var result, childs, args = arrayize(arguments, 1),
        i, j, len, child, chs, n, c;
    if (!parent || !parent.insertBefore || args.length === 0) {
      return null;
    }
    if (args.length === 1) {
      childs = arrayize(args[0]);
    } else {
      childs = args;
    }
    len = childs.length;
    for (i = 0; i < len; i++) {
      child = DOM.coerceToNode(childs[i]);
      if (child) {
        try {
          result = parent.insertBefore(child, parent.firstChild);
        } catch (e) {
          chs = child.childNodes;
          if (chs && chs.length) {
            n = chs.length;
            for (j = 0; j < n; j++) {
              c = DOM.coerceToNode(chs[j]);
              if (c) {
                result = parent.insertBefore(c, parent.firstChild);
              }
            }
          }
        }
      }
    }
    return result;
  },
  /**
   * Removes all the child nodes on a DOM node.
   *
   * @param  {Node|Element}  node  Node to remove children from.
   * @return {Node|Element}        Returns `node`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  removeChilds : function(node) {
    var child;
    while ((child = node.firstChild)) {
      node.removeChild(child);
    }
    return node;
  },
  /**
   * Get the attribute value.
   *
   * @param  {Element}  node  The target element.
   * @param  {String}   name  The attribute name.
   * @return {String|*}       The arrtibute value.
   * @type   Function
   * @function
   * @static
   * @public
   */
  getAttr : function(node, name) {
    var result = null, dir, raw;
    if (!node) {
      return result;
    }
    dir = DOM.AttrMaps.dir;
    raw = DOM.AttrMaps.raw;
    switch (name) {
      case 'style':
          result = (node.style != null && node.style.cssText) ||
                    (node.getAttribute && node.getAttribute(name)) || null;
          break;
      case 'class':
          result = node.className;
          break;
      case 'for':
          result = node.htmlFor;
          break;
      default:
          try {
            result = node.getAttribute(name) ||
                (name in dir &&
                  (node[dir[name]] || node.getAttribute(dir[name]))) ||
                (name in raw &&
                  (node[raw[name]] || node.getAttribute(raw[name]))) || null;
          } catch (e) {
            result = null;
          }
          break;
    }
    return result;
  },
  /**
   * Set the attribute value(s).
   *
   * @param  {Element}        node   The target element.
   * @param  {String|Object}  name   The attribute name or
   *                                    key-value object.
   * @param  {String|*}      (value) The attribute value to set.
   * @type   Function
   * @function
   * @static
   * @public
   */
  setAttr : function(node, name, value) {
    var args = arguments, attrs = {}, dir, raw;
    if (!node) {
      return false;
    }
    if (args.length >= 3) {
      attrs[name] = value;
    } else {
      attrs = name;
    }
    if (!isObject(attrs)) {
      if (isString(name)) {
        attrs[name] = '';
      } else {
        return false;
      }
    }
    dir = DOM.AttrMaps.dir;
    raw = DOM.AttrMaps.raw;
    each(attrs, function(val, key) {
      try {
        if (key == 'style') {
          if (isObject(val)) {
            each(val, function(v, k) {
              Pot.Style.setStyle(node, k, v);
            });
          } else {
            node.style.cssText = val;
          }
        } else if (key == 'class') {
          node.className = val;
        } else if (key == 'for') {
          node.htmlFor = val;
        } else if (key in dir || key in raw) {
          if (key in dir) {
            node.setAttribute(dir[key], val);
            if (!node.hasAttribute(dir[key])) {
              node.setAttribute(key, val);
            }
          } else {
            node.setAttribute(raw[key], val);
            if (!node.hasAttribute(raw[key])) {
              node.setAttribute(key, val);
            }
          }
        } else {
          node[key] = val;
          if (node[key] != val) {
            node.setAttribute(key, val);
          }
        }
      } catch (e) {}
    });
    return true;
  },
  /**
   * Check whether the attribute is exist.
   *
   * @param  {Element}  node  The target element.
   * @param  {String}   name  The attribute name.
   * @return {Boolean}        Whether the attribute is exist.
   * @type   Function
   * @function
   * @static
   * @public
   */
  hasAttr : function(node, name) {
    var result = false, dir, raw;
    if (!node) {
      return result;
    }
    dir = DOM.AttrMaps.dir;
    raw = DOM.AttrMaps.raw;
    if (node.hasAttribute) {
      try {
        result = node.hasAttribute(name) ||
          (name in dir && node.hasAttribute(dir[name])) ||
          (name in raw && node.hasAttribute(raw[name]));
      } catch (e) {
        result = false;
      }
    } else {
      try {
        result = node.getAttribute(name) != null ||
          (name in dir && node.getAttribute(dir[name]) != null) ||
          (name in raw && node.getAttribute(raw[name]) != null);
      } catch (e) {
        result = false;
      }
    }
    return result;
  },
  /**
   * Remove the attribute.
   *
   * @param  {Element}  node  The target element.
   * @param  {String}   name  The attribute name.
   * @type   Function
   * @function
   * @static
   * @public
   */
  removeAttr : function(node, name) {
    var elem, removals, dir, raw;
    if (!node) {
      return false;
    }
    dir = DOM.AttrMaps.dir;
    raw = DOM.AttrMaps.raw;
    elem = node.ownerElement || node;
    removals = [
      name && name in dir && dir[name],
      name && name in raw && raw[name],
      name || node.name || node
    ];
    each(removals, function(removal) {
      try {
        elem.removeAttribute(removal);
        if (elem.hasAttribute(removal)) {
          throw elem;
        }
      } catch (e) {
        try {
          elem.removeAttributeNode(removal);
        } catch (e) {}
        try {
          elem.removeAttributeNode(elem.getAttributeNode());
        } catch (e) {}
      }
    });
  },
  /**
   * Add the class name to the element.
   *
   * @param  {Element}  elem  The target element.
   * @param  {String}   name  The class name.
   * @return {Element}        Returns `elem`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  addClass : function(elem, name) {
    var names, value, sp;
    if (Pot.isElement(elem) && name && isString(name)) {
      names = Pot.Text.splitBySpace(name);
      if (!elem.className && names.length === 1) {
        elem.className = names.join(sp);
      } else {
        value = Pot.Text.wrap(elem.className, sp);
        each(names, function(n) {
          if (n && !~value.indexOf(Pot.Text.wrap(n, sp))) {
            value += n + sp;
          }
        });
        elem.className = trim(Pot.Text.normalizeSpace(value));
      }
    }
    return elem;
  },
  /**
   * Remove the class name from the element.
   *
   * @param  {Element}  elem  The target element.
   * @param  {String}   name  The class name to remove.
   * @return                  Returns `elem`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  removeClass : function(elem, name) {
    var names, value, sp;
    if (Pot.isElement(elem) && elem.className) {
      if (name === undefined) {
        elem.className = '';
      } else if (name && isString(name)) {
        sp = ' ';
        names = Pot.Text.splitBySpace(name);
        value = Pot.Text.wrap(
          Pot.Text.splitBySpace(elem.className).join(sp), sp);
        each(names, function(n) {
          if (n) {
            value = value.split(Pot.Text.wrap(n, sp)).join(sp);
          }
        });
        elem.className = trim(Pot.Text.normalizeSpace(value));
      }
    }
    return elem;
  },
  /**
   * Check whether the class name is exist.
   *
   * @param  {Element}  elem  The target element.
   * @param  {String}   name  The class name.
   * @return {Boolean}        Whether the class name is exist.
   * @type   Function
   * @function
   * @static
   * @public
   */
  hasClass : function(elem, name) {
    var result = false, sp = ' ', subject;
    if (Pot.isElement(elem) && elem.className && name) {
      subject = Pot.Text.wrap(name, sp);
      if (~(Pot.Text.wrap(
            Pot.Text.normalizeSpace(elem.className),
              sp).indexOf(subject)
           )
      ) {
        result = true;
      }
    }
    return result;
  },
  /**
   * Toggle the specified class name.
   *
   * @param  {Element}  elem  The target element.
   * @param  {String}   name  The class name to toggle.
   * @return {Element}        Returns `elem`.
   * @type   Function
   * @function
   * @static
   * @public
   */
  toggleClass : function(elem, name) {
    if (Pot.isElement(elem) && elem.className && name) {
      if (DOM.hasClass(elem, name)) {
        DOM.removeClass(elem, name);
      } else {
        DOM.addClass(elem, name);
      }
    }
    return elem;
  },
  /**
   * Creates an XML document object.
   *
   * @param  {String}   (rootTagName)  (Optional) The root tag name.
   * @param  {String}   (namespaceURI) (Optional) Namespace URI of
   *                                     the document element.
   * @return {Document}                Return the new document.
   * @type   Function
   * @function
   * @static
   * @public
   */
  createDocument : function(rootTagName, namespaceURI) {
    var doc, context, tag, uri;
    tag = stringify(rootTagName);
    uri = stringify(namespaceURI);
    if (uri && !tag) {
      tag = buildSerial(DOM, '');
    }
    context = Pot.currentDocument();
    if (context.implementation &&
        context.implementation.createHTMLDocument) {
      doc = context.implementation.createHTMLDocument('');
    } else if (context.implementation &&
              context.implementation.createDocument) {
      doc = context.implementation.createDocument(uri, tag, null);
    } else if (Pot.System.hasActiveXObject) {
      doc = DOM.createMSXMLDocument();
      if (doc && tag) {
        doc.appendChild(doc.createNode(
          DOM.NodeType.ELEMENT_NODE, tag, uri));
      }
    }
    return doc;
  },
  /**
   * Serialize an element object or subtree to string.
   *
   * @param  {Document|Element}  doc   The document or the root node of
   *                                     the subtree.
   * @return {String}                  The serialized XML/HTML string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  serializeToString : function(doc) {
    var result = '';
    if (doc) {
      if (typeof XMLSerializer !== 'undefined') {
        result = new XMLSerializer().serializeToString(doc);
      } else {
        result = doc.xml || doc.responseXML || doc.outerHTML ||
          (doc.documentElement &&
            (doc.documentElement.xml || doc.documentElement.outerHTML)) ||
          (doc.body &&
            (doc.body.xml || doc.body.outerHTML)) ||
          doc.innerHTML ||
            (doc.documentElement && doc.documentElement.innerHTML) ||
            (doc.body && doc.body.innerHTML) || '';
      }
    }
    return result;
  },
  /**
   * Parse the HTML/XML string and convert to the document object.
   *
   * @param  {String}   string    The target text.
   * @return {Document}           XML/HTML document from the text.
   * @type   Function
   * @function
   * @static
   * @public
   */
  parseFromString : function(string) {
    var doc;
    if (typeof DOMParser !== 'undefined') {
      doc = new DOMParser().parseFromString(string, 'application/xml');
    } else if (Pot.System.hasActiveXObject) {
      doc = DOM.createMSXMLDocument();
      doc.loadXML(string);
    }
    return doc;
  },
  /**
   * Evaluate the XPath expression and select the result node.
   *
   * @param  {String}            exp      The XPath expression.
   * @param  {Document|Element} (context) The conetxt object. e.g. document.
   * @param  {Boolean}          (all)     Whether to make multiple selections.
   * @param  {Boolean}          (asis)    Whether to return the results as is.
   * @return {Array|Element}              Return the selected node(s).
   * @type   Function
   * @function
   * @static
   * @public
   */
  evaluate : update(function(exp, context, all, asis) {
    var doc, expr, xresult = null, result, i, len,
        me = arguments.callee,
        item, evaluator, defaultPrefix;
    context || (context = Pot.currentDocument());
    expr = stringify(exp);
    doc = DOM.getOwnerDocument(context);
    if (Pot.System.hasActiveXObject) {
      // Use JavaScript-XPath library in IE.
      // http://coderepos.org/share/wiki/JavaScript-XPath
      if (!doc.evaluate && Pot.currentDocument().evaluate) {
        doc.evaluate = Pot.currentDocument().evaluate;
      }
      if (!doc.evaluate) {
        //TODO: To be able to get the actual node by MSXML XPath.
        try {
          doc = DOM.createMSXMLDocument();
          doc.loadXML(DOM.serializeToString(context));
          doc.setProperty('SelectionLanguage', 'XPath');
          xresult = (doc.documentElement || doc).selectNodes(expr) || [];
          if (!all) {
            return asis ? xresult[0] : me.suitablize(xresult[0]);
          }
          result = [];
          len = xresult.length;
          for (i = 0; i < len; i++) {
            result[result.length] = asis ? xresult[i] :
              me.suitablize(xresult[i]);
          }
          return result;
        } catch (e) {
          return null;
        }
      }
    }
    defaultPrefix = null;
    if (DOM.isXHTML(doc)) {
      defaultPrefix = '__default__';
      expr = me.addDefaultPrefix(expr, defaultPrefix);
    }
    try {
      /**@ignore*/
      evaluator = function(type) {
        /**@ignore*/
        var resolver = function(prefix) {
          return context.lookupNamespaceURI(
            (prefix === defaultPrefix) ? null : prefix
          ) || doc.documentElement && doc.documentElement.namespaceURI || '';
        };
        return doc.evaluate(expr, context, resolver, type, null);
      };
      xresult = evaluator(DOM.XPathResult.ANY_TYPE);
    } catch (e) {
      /**@ignore*/
      evaluator = function(type) {
        try {
          return expr.evaluate(context, type, null);
        } catch (ex) {
          return expr.evaluate(doc, type, null);
        }
      };
      try {
        expr = doc.createExpression(expr, function(prefix) {
          try {
            return doc.createNSResolver(
              context.documentElement ||
              context).lookupNamespaceURI(prefix) ||
              context.namespaceURI || doc.documentElement.namespaceURI || '';
          } catch (er) {
            return false;
          }
        });
        if (!expr || !expr.evaluate) {
          throw expr;
        }
      } catch (e) {
        expr = doc.createExpression(expr, {
          /**@ignore*/
          lookupNamespaceURI : function(prefix) {
            switch (String(prefix).toLowerCase()) {
              case 'xul'   : return XUL_NS_URI;
              case 'html'  : return HTML_NS_URI;
              case 'xhtml' : return XHTML_NS_URI;
              default      : return '';
            }
          }
        });
      }
    }
    if (xresult === null) {
      xresult = evaluator(DOM.XPathResult.ANY_TYPE);
    }
    switch (xresult.resultType) {
      case DOM.XPathResult.NUMBER_TYPE:
          result = xresult.numberValue;
          break;
      case DOM.XPathResult.STRING_TYPE:
          result = xresult.stringValue;
          break;
      case DOM.XPathResult.BOOLEAN_TYPE:
          result = xresult.booleanValue;
          break;
      case DOM.XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
          if (!all) {
            item = xresult.iterateNext();
            result = asis ? item : me.suitablize(item);
            break;
          }
          xresult = evaluator(DOM.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
          result = [];
          len = xresult.snapshotLength;
          for (i = 0; i < len; i++) {
            item = xresult.snapshotItem(i);
            result[result.length] = asis ? item : me.suitablize(item);
          }
          break;
      default:
          result = null;
          break;
    }
    return result;
  }, {
    /**@ignore*/
    suitablize : function(node) {
      if (node) {
        switch (node.nodeType) {
          case DOM.NodeType.ELEMENT_NODE:
              return node;
          case DOM.NodeType.ATTRIBUTE_NODE:
          case DOM.NodeType.TEXT_NODE:
              return node.textContent || node.innerText || node.value || node;
          default:
              return node;
        }
      }
    },
    /**
     * Add prefix to name-test that has not prefix in XPath expression.
     *
     * e.g.    '//body[@class = "foo"]/p'
     *      -> '//prefix:body[@class = "foo"]/prefix:p'
     *
     * via:
     *   http://gist.github.com/184276
     *   http://nanto.asablo.jp/blog/2008/12/11/4003371
     *
     * @private
     * @ignore
     */
    addDefaultPrefix : function(xpath, prefix) {
      var tokenPattern, tokenType, replacer,
          TERM = 1, OPERATOR = 2, MODIFIER = 3;
      tokenPattern = new RegExp(
            '(' + '[A-Za-z_\\u00C0-\\uFFFD][-.\\w\\u00B7-\\uFFFD]*' +
            '|' + '[*]' +
            ')' +                            // 1 identifier
            '\\s*' +
            '(::?|[(])?' +                   // 2 suffix
        '|' +
                '(' + '".*?"' +              // 3 term
                '|' + "'.*?'" +
                '|' + '\\d+(?:[.]\\d*)?' +
                '|' + '[.](?:[.]|\\d+)?' +
                '|' + '[)\\]]' +
                ')' +
            '|' +
                '(' + '//?' +                // 4 operator
                '|' + '!=' +
                '|' + '[<>]=?' +
                '|' + '[([|,=+-]' +
                ')' +
            '|' +
                '([@$])',                    // 5 modifier
      'g');
      tokenType = OPERATOR;
      prefix += ':';
      /**@ignore*/
      replacer = function(token, identifier, suffix,
                          term, operator, modifier) {
        if (suffix) {
          tokenType =
            (suffix === ':' ||
            (suffix === '::' && (identifier === 'attribute' ||
                                 identifier === 'namespace'))) ?
            MODIFIER : OPERATOR;
        } else if (identifier) {
          if (tokenType === OPERATOR && identifier !== '*') {
            token = prefix + token;
          }
          tokenType = (tokenType === TERM) ? OPERATOR : TERM;
        } else {
          tokenType = term ? TERM : operator ? OPERATOR : MODIFIER;
        }
        return token;
      };
      return xpath.replace(tokenPattern, replacer);
    }
  }),
  /**
   * Convert HTML string to HTML Document object.
   *
   * @param  {String}  htmlString   A subject HTML string.
   * @param  {Object}  (context)    (Optional) A context object.
   *                                  e.g. document.
   * @return {Object}               Return the HTML Document object.
   * @type   Function
   * @function
   * @static
   * @public
   */
  convertToHTMLDocument : update(function(htmlString, context) {
    var me = arguments.callee, doc, html, patterns, xsl, xsltp, range;
    patterns = {
      remove : [
        /<\s*!\s*DOCTYPE[^>]*>/gi,
        /<\s*html\b[^>]*>/gi,
        /<\s*\/\s*html\s*>[\s\S]*/gi
      ]
    };
    html = stringify(htmlString);
    each(patterns.remove, function(re) {
      html = html.replace(re, '');
    });
    xsl = Pot.DOM.parseFromString(
      '<' + '?xml version="1.0"?' + '>' +
      '<stylesheet version="1.0" xmlns="' + XSL_NS_URI + '">' +
        '<output method="html" />' +
      '</stylesheet>'
    );
    if (Pot.System.hasActiveXObject) {
      doc = new ActiveXObject('htmlfile');
      doc.open();
      doc.write(html);
      doc.close();
    } else {
      try {
        doc = context || Pot.currentDocument();
        xsltp = new XSLTProcessor();
        xsltp.importStylesheet(xsl);
        doc = xsltp.transformToDocument(
          doc.implementation.createDocument('', '', null)
        );
        doc.appendChild(doc.createElement('html'));
        range = doc.createRange();
        range.selectNodeContents(doc.documentElement);
        doc.documentElement.appendChild(range.createContextualFragment(html));
      } catch (e) {
        try {
          doc = me.createHTMLDocumentFromString(html);
        } catch (e) {}
      }
    }
    return doc;
  }, {
    /**
     * A helper function for convertToHTMLDocument.
     *
     * from: Taberareloo lib.
     * original: http://gist.github.com/198443
     *
     * @private
     * @ignore
     */
    createHTMLDocumentFromString : function(srcString) {
      var doc, context, range, fragment, headElements, child, head, body;
      context = Pot.currentDocument();
      doc = DOM.createDocument('html');
      range = context.createRange();
      range.selectNodeContents(doc.documentElement);
      fragment = range.createContextualFragment(srcString);
      headElements = {
        title   : true,
        meta    : true,
        link    : true,
        script  : true,
        style   : true,
        object  : false,
        base    : true,
        isindex : false
      };
      try {
        head = doc.getElementsByTagName('head')[0];
        if (!head) {
          throw head;
        }
      } catch (e) {
        head = doc.createElement('head');
      }
      try {
        body = doc.getElementsByTagName('body')[0];
        if (!body) {
          throw body;
        }
      } catch (e) {
        body = doc.createElement('body');
      }
      HEADING: {
        while ((child = fragment.firstChild)) {
          switch (child.nodeType) {
            case DOM.NodeType.ELEMENT_NODE:
                if (!headElements[Pot.Text.lower(child.nodeName)]) {
                  break HEADING;
                }
                break;
            case DOM.NodeType.TEXT_NODE:
                if (/\S/.test(child.nodeValue)) {
                  break HEADING;
                }
                break;
            default:
                break;
          }
          head.appendChild(child);
        }
      }
      body.appendChild(fragment);
      doc.documentElement.appendChild(head);
      doc.documentElement.appendChild(body);
      return doc;
    }
  }),
  /**
   * Convert to a HTML string from DOM document object.
   *
   * from: Taberareloo lib.
   * via: http://nanto.asablo.jp/blog/2010/02/05/4858761
   *
   * @param  {Document|Node}  context  The input context.
   * @param  {Boolean}        (safe)   Whether sanitize the HTML nodes,
   *                                     for safely.
   * @return {String}                  The result HTML string.
   * @type   Function
   * @function
   * @static
   * @public
   */
  convertToHTMLString : update(function(context, safe) {
    var result, me = arguments.callee, node, doc, root,
        range, uniqid, fragment, re, tag;
    if (!context || (context.getRangeAt && context.isCollapsed)) {
      return '';
    }
    doc = isDocument(context) ? context : Pot.currentDocument();
    tag = buildSerial(DOM, 'tag');
    uniqid = buildSerial(DOM, 'uid');
    re = new RegExp('</?(?:' + uniqid + '|' + tag + ')\\b[^>]*>', 'gi');
    if (context.getRangeAt) {
      range = context.getRangeAt(0);
      node = range.cloneContents();
      root = range.commonAncestorContainer.cloneNode(false);
    } else {
      range = null;
      node = context.cloneNode(true);
      if (!node) {
        node = context.documentElement &&
              context.documentElement.cloneNode(true) ||
              context.body && context.body.cloneNode(true);
      }
      root = null;
    }
    if (!root || root.nodeType != DOM.NodeType.ELEMENT_NODE) {
      try {
        root = node.ownerDocument.createElement(tag);
      } catch (e) {
        root = doc.createElement(tag);
      }
    }
    DOM.appendChilds(root, node);
    if (safe) {
      try {
        each([{
          elems : DOM.evaluate(
            'descendant::*[contains(",' +
            me.UNSAFE_ELEMENTS +
            ',",concat(",",local-name(.),","))]',
            root, true
          ),
          method : DOM.removeElement
        }, {
          elems : DOM.evaluate(
            'descendant::*/@*[not(contains(",' +
            me.SAFE_ATTRIBUTES +
            ',",concat(",",local-name(.),",")))]',
            root, true, true
          ),
          method : DOM.removeAttr
        }, {
          elems : DOM.evaluate(
            'descendant-or-self::a',
            root, true
          ),
          method : me.resetter.href
        }, {
          elems : DOM.evaluate(
            'descendant-or-self::*' +
            '[contains(" img embed ",concat(" ",local-name(.)," "))]',
            root, true
          ),
          method : me.resetter.src
        }, {
          elems : DOM.evaluate(
            'descendant-or-self::object',
            root, true
          ),
          method : me.resetter.data
        }], function(item) {
          each(item.elems || [], item.method);
        });
      } catch (e) {
        if (typeof toStaticHTML !== 'undefined') {
          try {
            root.innerHTML = toStaticHTML(root.innerHTML);
          } catch (e) {}
        }
      }
    }
    fragment = doc.createDocumentFragment();
    result = fragment.appendChild(doc.createElement(uniqid));
    DOM.appendChilds(result, root);
    return trim(DOM.serializeToString(result)).replace(re, '');
  }, {
    /**@ignore*/
    UNSAFE_ELEMENTS :
      'frame,script,style,frame,iframe',
    /**@ignore*/
    SAFE_ATTRIBUTES :
      'action,cellpadding,cellspacing,checked,cite,clear,' +
      'cols,colspan,content,coords,enctype,face,for,href,' +
      'label,method,name,nohref,nowrap,rel,rows,rowspan,'  +
      'shape,span,src,style,title,target,type,usemap,value',
    // resolve relative path
    /**@ignore*/
    resetter : (function(o) {
      each(['href', 'data', 'src'], function(attr) {
        /**@ignore*/
        o[attr] = function(elem) {
          if (elem && DOM.hasAttr(elem, attr)) {
            elem[attr] = elem[attr];
          }
        };
      });
      return o;
    })({})
  }),
  /**
   * Get the MSXML Document object.
   *
   * @private
   * @ignore
   */
  createMSXMLDocument : function(count) {
    var result;
    if (Pot.System.hasActiveXObject) {
      each([
        'Msxml2.DOMDocument.3.0',
        'Msxml2.DOMDocument.6.0',
        'Microsoft.XMLDOM.1.0',
        'Microsoft.XMLDOM',
        'Msxml2.DOMDocument.5.0',
        'Msxml2.DOMDocument.4.0',
        'MSXML2.DOMDocument',
        'MSXML.DOMDocument'
      ], function(prog) {
        try {
          result = new ActiveXObject(prog);
        } catch (e) {}
        if (result) {
          if (count == null || count-- <= 0) {
            throw Pot.StopIteration;
          }
        }
      });
      if (result) {
        result.async = false;
        // Prevent potential vulnerabilities exposed by MSXML2, see
        // http://b/1707300 and http://wiki/Main/ISETeamXMLAttacks for details.
        result.resolveExternals = false;
        result.validateOnParse = false;
        try {
          // IE6 or IE7 that are on XP SP2 or earlier without MSXML updates.
          // See http://msdn.microsoft.com/en-us/library/ms766391(VS.85).aspx
          result.setProperty('ProhibitDTD', true);
          result.setProperty('MaxXMLSize', 2 * 1024);
          result.setProperty('MaxElementDepth', 256);
        } catch (e) {}
      }
    }
    return result;
  }
});
})(Pot.DOM,
   Pot.isWindow, Pot.isDocument, Pot.isString,
   Pot.isObject, Pot.isArray, Pot.isArrayLike);

// Update Pot object.
Pot.update({
  detectWindow          : Pot.DOM.detectWindow,
  detectDocument        : Pot.DOM.detectDocument,
  getOwnerDocument      : Pot.DOM.getOwnerDocument,
  getElement            : Pot.DOM.getElement,
  getElements           : Pot.DOM.getElements,
  isXHTML               : Pot.DOM.isXHTML,
  isXML                 : Pot.DOM.isXML,
  tagNameOf             : Pot.DOM.tagNameOf,
  getNodeValue          : Pot.DOM.getValue,
  setNodeValue          : Pot.DOM.setValue,
  getHTMLString         : Pot.DOM.getHTMLString,
  setHTMLString         : Pot.DOM.setHTMLString,
  getOuterHTML          : Pot.DOM.getOuterHTML,
  setOuterHTML          : Pot.DOM.setOuterHTML,
  getTextContent        : Pot.DOM.getTextContent,
  setTextContent        : Pot.DOM.setTextContent,
  getSelectionObject    : Pot.DOM.getSelectionObject,
  getSelectionContents  : Pot.DOM.getSelectionContents,
  getSelectionText      : Pot.DOM.getSelectionText,
  getSelectionHTML      : Pot.DOM.getSelectionHTML,
  coerceToNode          : Pot.DOM.coerceToNode,
  removeElement         : Pot.DOM.removeElement,
  appendChilds          : Pot.DOM.appendChilds,
  prependChilds         : Pot.DOM.prependChilds,
  removeChilds          : Pot.DOM.removeChilds,
  getAttr               : Pot.DOM.getAttr,
  setAttr               : Pot.DOM.setAttr,
  hasAttr               : Pot.DOM.hasAttr,
  removeAttr            : Pot.DOM.removeAttr,
  addClass              : Pot.DOM.addClass,
  removeClass           : Pot.DOM.removeClass,
  hasClass              : Pot.DOM.hasClass,
  toggleClass           : Pot.DOM.toggleClass,
  serializeToXMLString  : Pot.DOM.serializeToString,
  parseFromXMLString    : Pot.DOM.parseFromString,
  evaluate              : Pot.DOM.evaluate,
  attr                  : Pot.DOM.attr,
  convertToHTMLDocument : Pot.DOM.convertToHTMLDocument,
  convertToHTMLString   : Pot.DOM.convertToHTMLString
});

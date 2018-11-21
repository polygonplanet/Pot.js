/*!
 * Floating Menu 1.03 - jQuery plugin
 *
 * Copyright (c) 2011 polygon planet (polygon.planet[*]gmail.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 *  and GPL v2 (GPL-LICENSE.txt) licenses.
 *
 * Built for jQuery library
 * http://jquery.com/
 */
(function($) {

var defaults = {
  container : null,
  footer    : null,
  triggers  : {}
},
FixScroller = function(index, targets, options) {
  var that = this, win = $(window), p;
  p = this.options = $.extend({}, defaults, options || {});
  $.extend(p, {
    targets : $(targets),
    target  : $(targets).eq(index).css({position : 'fixed'}),
    index   : index,
    win     : win
  });
  $.extend(p, {
    baseTop      : p.target.offset().top - win.scrollTop(),
    margin       : {
      top        : parseInt(p.target.css('marginTop'))    || 0,
      bottom     : parseInt(p.target.css('marginBottom')) || 0
    },
    targetHeight : p.target.outerHeight(),
    container    : p.container ? $(p.container) : that.getContainer(),
    footer       : p.footer    ? $(p.footer)    : null
  });
  $.extend(p, {
    containerBottom : p.container.offset().top  +
                      p.container.outerHeight() -
                      (p.footer && p.footer.outerHeight() || 0),
    baseLeft        : (p.target.offset().left -
                      parseInt(p.target.css('marginLeft'))) -
                      p.container.offset().left - win.scrollLeft(),
    defaultCursor   : p.target.css('cursor') || 'default'
  });
  this.bootEvent();
};

$.extend(FixScroller.prototype, {
  hoveringTargets : [],
  getContainer : function() {
    var p = this.options, co, parents = p.target.parents();
    parents.each(function(index) {
      var height = p.targetHeight + p.margin.top + p.margin.bottom;
      if (parents.eq(index).outerHeight() > height) {
        co = parents.eq(index);
        return false;
      }
    });
    return co || $('body');
  },
  setPos : (function() {
    var lock = false, nextTop = 0, prevTop = 0,
        prevScrollTop = 0, upGain = 0, scrollGain = 0;
    return function(first, evt, isScroll, deltaY) {
      var that = this, p = this.options,
          scrollTop, orgScrollTop, diff = 0, downTop,
          bottomTop, isUp, done, slow, gain, isDelta;
      p.targetHeight = p.target.outerHeight();
      scrollTop = orgScrollTop = p.win.scrollTop();
      if (first !== -1) {
        gain = Math.abs(scrollTop - prevScrollTop);
        if (prevScrollTop !== 0 &&
            (scrollGain === 0 ||
              (scrollGain > gain && gain > 0)
            )
        ) {
          scrollGain = gain;
        }
      }
      if (deltaY) {
        isDelta = true;
        if (first !== -1) {
          scrollTop -= (deltaY * (Math.max(20, scrollGain) || 120));
        }
      }
      isUp = (prevScrollTop > scrollTop);
      if (p.win.height() < p.targetHeight) {
        diff = p.targetHeight - p.win.height() +
                p.margin.top + p.margin.bottom;
      }
      downTop = p.baseTop - p.margin.top - scrollTop;
      if (first && scrollTop > 0) {
        diff += 1;
      }
      if (first === -1) {
        nextTop = prevTop;
      } else if (downTop + diff - upGain >= 0) {
        // At the top.
        nextTop = Math.max(downTop, p.baseTop - p.margin.top - orgScrollTop);
      } else {
        bottomTop = p.containerBottom - (
          scrollTop    + p.targetHeight +
          p.margin.top + p.margin.bottom
        );
        if (bottomTop + diff <= 0) {
          // At the bottom.
          nextTop = Math.min(bottomTop, p.containerBottom - (
            orgScrollTop + p.targetHeight +
            p.margin.top + p.margin.bottom
          ));
        } else {
          if (isDelta) {
            if (isUp) {
              if (scrollTop > p.target.offset().top) {
                upGain += (prevScrollTop - scrollTop) *
                          (isDelta ? 1.275 : 0.532);
                slow = true;
              }
            } else {
              upGain -= (scrollTop - prevScrollTop) *
                        (isDelta ? 1.275 : 0.532);
              slow = true;
            }
            upGain = Math.max(0, Math.min(diff, upGain));
            nextTop = Math.min(
              Math.min(bottomTop, p.containerBottom - (
                orgScrollTop + p.targetHeight +
                p.margin.top + p.margin.bottom
              )),
              Math.max(
                Math.max(downTop, p.baseTop - p.margin.top - orgScrollTop),
                -diff + upGain
              )
            );
          } else {
            nextTop = -diff + upGain;
          }
        }
      }
      if (prevTop !== nextTop) {
        if (first === -1) {
          prevScrollTop = orgScrollTop + 1;
        } else {
          done = true;
        }
      }
      if (done) {
        (function() {
          var next = nextTop;
          if (lock) {
            setTimeout(arguments.callee, 10);
            return;
          }
          if (slow) {
            lock = true;
            p.target.animate({
              top : next
            }, 50, 'swing', function() {
              lock = false;
            });
          } else {
            lock = true;
            p.target.css({top : next});
            lock = false;
          }
          prevTop = nextTop;
        })();
      }
      if (!first && isScroll && isDelta) {
        $(window).scrollTop(prevScrollTop);
      } else {
        prevScrollTop = scrollTop;
      }
      that.setLeftPos();
    };
  })(),
  setLeftPos : function() {
    var p = this.options;
    p.target.css({
      left : p.container.offset().left + p.baseLeft - p.win.scrollLeft()
    });
  },
  cursorInTarget : function() {
    var hovers = this.hoveringTargets, exists = false,
        i, len = hovers.length, elem;
    if (len) {
      this.options.target.each(function() {
        elem = $(this).get(0);
        for (i = 0; i < len; i++) {
          if (hovers[i] === elem) {
            exists = true;
            return false;
          }
        }
      });
    }
    return exists;
  },
  onMouseOver : function(elem) {
    var hovers = this.hoveringTargets,
        exists = false, i, len = hovers.length;
    for (i = 0; i < len; i++) {
      if (hovers[i] === elem) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      hovers[hovers.length] = elem;
    }
    $(elem).css({cursor : 'n-resize'});
  },
  onMouseOut : function(elem) {
    var hovers = this.hoveringTargets,
        index = -1, i, len = hovers.length;
    for (i = 0; i < len; i++) {
      if (hovers[i] === elem) {
        index = i;
        break;
      }
    }
    if (~index) {
      hovers.splice(index, 1);
    }
    $(elem).css({cursor : this.options.defaultCursor});
  },
  bootEvent : function() {
    var that = this, p = this.options;
    this.setPos(true);
    p.target.mouseover(function() {
      that.onMouseOver.call(that, $(this).get(0));
    }).mouseout(function() {
      that.onMouseOut.call(that, $(this).get(0));
    });
    p.win.mousewheel(function(ev, delta, deltaX, deltaY) {
      if (delta != 0 && deltaY != 0 && that.cursorInTarget()) {
        that.setPos(false, ev, true, deltaY);
        try {
          ev.preventDefault();
          ev.stopPropagation();
        } catch (e) {}
        return false;
      }
    }).scroll(function(ev) {
      if (!that.cursorInTarget()) {
        that.setPos(false, ev, true);
      }
    }).resize(function(ev) {
      that.setPos(false, ev, false);
    });
    if (p.callback) {
      p.callback(this);
    }
    $.each(p.triggers || {}, function(type, expr) {
      if (type && expr) {
        $(expr).bind(type, function() {
          setTimeout(function() {
            that.setPos();
          }, 200);
        });
      }
    });
  }
});

$.fn.floatingMenu = function(options) {
  var that = this, key = 'data-jq-floating-menu-fix-scroller';
  if ($.browser.msie || $(window).width() < 800) {
    return this;
  } else {
    return this.each(function(index) {
      var target = that.eq(index), fs = target.data(key);
      if (!fs) {
        fs = new FixScroller(index, target, options);
      }
      target.data(key, fs);
    });
  }
};

/*!
 * jQuery.mousewheel.js 3.0.6
 * Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 */
(function(types, i) {

if ($.fn.mousewheel && $.fn.unmousewheel) {
  return;
}

types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
  for (i = types.length; i;) {
    $.event.fixHooks[types[--i]] = $.event.mouseHooks;
  }
}

$.event.special.mousewheel = {
  setup : function() {
    var i;
    if (this.addEventListener) {
      for (i = types.length; i;) {
        this.addEventListener(types[--i], handler, false);
      }
    } else {
      this.onmousewheel = handler;
    }
  },
  teardown : function() {
    var i;
    if (this.removeEventListener) {
      for (i = types.length; i;) {
        this.removeEventListener(types[--i], handler, false);
      }
    } else {
      this.onmousewheel = null;
    }
  }
};

$.fn.extend({
  mousewheel : function(fn) {
    return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
  },
  unmousewheel : function(fn) {
    return this.unbind('mousewheel', fn);
  }
});

function handler(event) {
  var orgEvent = event || window.event,
      args = Array.prototype.slice.call(arguments, 1),
      delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
  event = $.event.fix(orgEvent);
  event.type = 'mousewheel';
  if (orgEvent.wheelDelta) {
    delta = orgEvent.wheelDelta / 120;
  }
  if (orgEvent.detail) {
    delta = -orgEvent.detail / 3;
  }
  deltaY = delta;
  if (orgEvent.axis != null && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
    deltaY = 0;
    deltaX = -1 * delta;
  }
  if (orgEvent.wheelDeltaY != null) {
    deltaY = orgEvent.wheelDeltaY / 120;
  }
  if (orgEvent.wheelDeltaX != null) {
    deltaX = -1 * orgEvent.wheelDeltaX / 120;
  }
  args.unshift(event, delta, deltaX, deltaY);
  return ($.event.dispatch || $.event.handle).apply(this, args);
}

})();
})(jQuery);

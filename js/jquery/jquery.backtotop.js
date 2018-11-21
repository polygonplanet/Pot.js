/*
 * Scroll/Back to Top button
 *
 * license: MIT
 */
$(document).ready(function() {
'use strict';

var backToTop = $('<div>')
  .addClass('back-to-top')
  .text('Back to Top')
  .css({
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    width: '100px',
    height: '40px',
    background: 'rgba(255, 64, 64, 0.7)',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '3',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: 'verdana,sans-serif',
    cursor: 'pointer',
    zIndex: '9999',
    userSelect: 'none'
  })
  .hide()
  .on('hover', function() {
    $(this).css({
      background: 'rgba(255, 16, 16, 0.8)',
      color: 'rgba(255, 255, 64, 0.8)'
    });
  }, function() {
    $(this).css({
      background: 'rgba(255, 64, 64, 0.7)',
      color: 'rgba(255, 255, 255, 0.9)'
    });
  })
  .on('click', function() {
    $('html,body').animate({
      scrollTop: 0
    }, 800);
    return false;
  })
  .appendTo('body');


var Game = function(self, stage) {
  this.self = self;
  this.stage = $(stage);
};

Game.prototype = {
  mx: 0,
  my: 0,
  scope: 50,
  speed: 22,
  interval: 13,
  ready: false,
  starting: false,
  hovering: false,
  effecting: false,
  stageOffset: null,
  binded: false,
  score: null,
  startTime: 0,
  exposed: false,
  startWithHover: false,
  moved: false,
  movedCourses: null,

  start: function() {
    var that = this;
    this.starting = true;
    this.movedCourses = {};
    this.stageOffset = this.stage.offset();

    if (!this.binded) {
      this.onMouseMove = this.onMouseMove.bind(this);

      this.self.hide = function() {
        var hide_ = that.self.hide;
        return function() {
          that.onHide();
          return hide_.apply(that.self, arguments);
        };
      }();

      this.self.show = function() {
        var show_ = that.self.show;
        return function() {
          that.onShow();
          return show_.apply(that.self, arguments);
        };
      }();

      this.self.on('click', function() {
        that.score = that.getScore();

        $(this)
          .show()
          .text('CLEAR!')
          .fadeOut('slow')
          .promise().then(function() {
            that.stage.css({
              textAlign: 'center'
            }).text('').append(
              $('<h1>').css({
                marginTop: Math.floor($(window).height() * 0.4)
              }).text('GAME OVER')
            ).append(
              $('<p>').text('score: ' + that.score)
            ).append(
              $('<div>').css({
                margin: 5
              }).append(
                $('<button>').attr({
                  type: 'button',
                  title: 'Continue'
                }).css({
                  cursor: 'pointer'
                }).text('Continue').on('click', function() {
                  window.location.reload();
                })
              )
            );
          });

        that.over();
      })
      .on('mouseover', function() {
        if (!that.startWithHover && that.startTime &&
            Date.now() - that.startTime < 300) {
          that.startWithHover = true;

          var course = (Math.random() * 10 > 5) ? 'left' : 'top';
          that.move(course);
          setTimeout(function() {
            that.move(course);
          }, that.interval);
        }
      })
      .hover(function() {
        that.hovering = true;
      }, function() {
        that.hovering = false;
      });
      this.binded = true;
    }
    $(document).on('mousemove', this.onMouseMove);
    this.ready = true;
    this.action();
  },
  over: function() {
    this.starting = false;
    $(document).off('mousemove', this.onMouseMove);
  },
  end: function() {
    this.over();
  },
  show: function() {
    if (this.ready) {
      this.onShow();
      return this.self.show();
    }
    return this.hide();
  },
  hide: function() {
    this.onHide();
    return this.self.hide();
  },
  getScore: function() {
    var endTime = Date.now();
    var time = endTime - this.startTime;
    var point = 2000 / time * 100;
    var score = Math.min(100, Math.max(0, Math.floor(point)));
    return score;
  },
  action: function() {
    var nop = {};
    return function() {
      var that = this;
      var d = $.Deferred();

      if (this.starting) {
        d.then(function() {
          if (that.self.is(':visible')) {
            that.appeal();
            that.updateScope();
            that.updateSpeed();
            if (that.isApproaching()) {
              return that.move(that.getCourse());
            }
          }
          return nop;
        }).then(function(res) {
          setTimeout(function() {
            that.action();
          }, (res === nop) ? that.interval : 0);
        });
        d.resolve();
      }
    };
  }(),
  onShow: function() {
    if (!this.exposed) {
      this.exposed = true;
      this.startTime = Date.now();
    }
  },
  onHide: function() {
  },
  onMouseMove: function(ev) {
    this.mx = ev.clientX;
    this.my = ev.clientY;
  },
  getCurrent: function() {
    var pos = this.self.position();
    return {
      top: pos.top,
      left: pos.left,
      width: this.self.width(),
      height: this.self.height()
    };
  },
  move: function(course) {
    var that = this;
    var d = $.Deferred();
    var c = this.getCurrent();
    var o;

    switch (course) {
      case 'top': o = { top: c.top - c.height }; break;
      case 'right': o = { left: c.left + c.width }; break;
      case 'bottom': o = { top: c.top + c.height }; break;
      case 'left': o = { left: c.left - c.width }; break;
    }

    var css = {};
    for (var p in o) {
      if (o.hasOwnProperty(p)) {
        css[p] = Math.floor(o[p]) + 'px';
        this.movedCourses[p] = true;
      }
    }

    if (!this.moved) {
      this.self.css(css);

      if ('top' in this.movedCourses &&
          'left' in this.movedCourses) {
        this.moved = true;
      }
      d.resolve();
    } else {
      this.self.animate(css, this.speed).promise().then(function() {
        d.resolve();
      });
    }
    return d.promise();
  },
  
  canMove: function(course) {
    var c = this.getCurrent();
    var s = this.scope;

    switch (course) {
      case 'top':
          return c.top > c.height + s;
      case 'right':
          return c.left < this.stage.width() - c.width - s;
      case 'bottom':
          return c.top < $(window).height() - c.height - s;
      case 'left':
          return c.left > s;
    }
    return false;
  },
  getCourse: function() {
    var courses = [];
    var c = this.getCurrent();

    if ((this.my > c.top + c.height ||
         this.mx < c.left ||
         this.mx > c.left + c.width) && this.canMove('top')) {
      courses.push('top');
    }

    if ((this.my < c.top ||
         this.mx < c.left ||
         this.mx > c.left + c.width) && this.canMove('bottom')) {
      courses.push('bottom');
    }

    if ((this.mx > c.left + c.width ||
         this.my < c.top ||
         this.my > c.top + c.height) && this.canMove('left')) {
      courses.push('left');
    }

    if ((this.mx < c.left ||
         this.my < c.top ||
         this.my > c.top + c.height) && this.canMove('right')) {
      courses.push('right');
    }

    return this.getRandomValue(courses);
  },
  isApproaching: function() {
    var c = this.getCurrent();
    var s = this.scope;

    if (this.my + s < c.top ||
        this.my - s > c.top + c.height ||
        this.mx + s < c.left ||
        this.mx - s > c.left + c.width) {
      return false;
    }
    return true;
  },
  getTime: function() {
    return Date.now() - this.startTime;
  },
  getRandomValue: function(arr) {
    var i = Math.round(Math.random() * (arr.length - 1));
    return arr[i];
  },
  getRandomInt: function(n) {
    return Math.floor(Math.random() * n);
  },
  getSpeedByTime: function(time) {
    var min = 12;
    var max = 100;
    var n = ~~Math.sqrt(time) + min;
    var r = ((time >> 1) % (max - min)) + min;
    if (~~(Math.random() * r) === 1) {
      n += max - min;
    }
    var speed = this.getRandomInt(n);
    return ((speed >> 1) % (max - min)) + min;
  },
  updateSpeed: function() {
    var time = this.getTime();
    var prev = this.speed;
    var speed = this.getSpeedByTime(time);
    if (speed >= 50 && prev >= 50) {
      speed = 22;
    }
    if (this.effecting) {
      speed = (speed % 20) + 2;
    }
    this.speed = speed;
  },
  updateScope: function() {
    var threshold = 50;
    var time = this.getTime();
    var extra = this.getRandomInt(time / 100);
    if (time > 20000) {
      extra = this.getRandomInt(10);
    } else {
      var d = threshold * 2 - extra;
      extra = Math.max(0, Math.min(threshold, d));
    }
    if (this.effecting) {
      extra += 30;
    }
    this.scope = threshold + this.getRandomInt(extra);
  },
  effect: function(style) {
    var that = this;
    var d = $.Deferred();
    var start = style.speed || 1000;
    var end = Math.round((style.speed || 1000) * 0.8);
    var css = {
      start: {},
      end: {},
      finish: {}
    };
    for (var p in style) {
      if (p !== 'speed' && style.hasOwnProperty(p)) {
        if (p === 'step') {
          start = {
            step: style[p],
            duration: start
          };
          end = {
            step: style[p],
            duration: end
          };
        } else if (p === 'finish') {
          css.finish = style[p];
        } else {
          css.start[p] = style[p].start;
          css.end[p] = style[p].end;
          css.finish[p] = style[p].finish;
        }
      }
    }
    
    this.self.animate(css.start, start).promise().then(function() {
      setTimeout(function() {
        that.self.animate(css.end, end).promise().then(function() {
          if (typeof css.finish === 'function') {
            css.finish.call(that);
          } else {
            that.self.css(css.finish);
          }
          d.resolve();
        });
      }, 2500);
    });
    return d.promise();
  },
  appeal: function() {
    var timerId;
    var lastTime;
    var prevText;
    var messages = [
      'Click me!',
      'Here I am!'
    ];
    var styles = [{
      background: 'rgba(255, 160, 255, 0.5)',
      color: 'rgba(255, 92, 160, 0.9)'
    }, {
      background: 'rgba(183, 221, 147, 0.7)',
      color: 'rgba(92, 64, 255, 0.9)'
    }, {
      background: 'rgba(244, 150, 216, 0.7)',
      color: 'rgba(255, 64, 92, 0.9)'
    }];

    return function() {
      var that = this;

      if (!timerId && this.moved && !this.hovering &&
         (!lastTime || Date.now() - lastTime > 3000) &&
         ~~(Math.random() * Math.round(7000 / this.interval)) === 1) {

        prevText = this.self.text();
        this.self.text(this.getRandomValue(messages))
                 .css(this.getRandomValue(styles));

        timerId = setTimeout(function() {
          if (that.score === null) {
            that.self.text(prevText).css({
              color: '',
              background: ''
            });
          }
          lastTime = Date.now();
          timerId = null;
        }, 2000);
      } else {
        this.appealStyle();
      }
    };
  }(),
  appealStyle: function() {
    var lastTime;
    var styles = [{
      borderRadius: {
        start: '50px',
        end: '-=1px',
        finish: ''
      },
      speed: 500
    }, {
      opacity: {
        start: 0.2,
        end: 1,
        finish: 1
      },
      speed: 500
    }, {
      borderSpacing: {
        start: -360,
        end: -360,
        finish: ''
      },
      step: function(now, fx) {
        var val = 'rotate(' + now + 'deg)';
        $(this).css({
          WebkitTransform: val,
          MozTransform: val,
          transform: val
        });
      },
      finish: function() {
        this.self.css({
          borderSpacing: '',
          WebkitTransform: '',
          MozTransform: '',
          transform: ''
        });
      },
      speed: 300
    }];

    return function() {
      var that = this;

      if (this.moved && !this.hovering &&
         (!lastTime || Date.now() - lastTime > 3000) &&
         ~~(Math.random() * Math.round(3000 / this.interval)) === 1
      ) {
        var style = this.getRandomValue(styles);
        this.effecting = true;
        this.effect(style).then(function() {
          lastTime = Date.now();
          that.effecting = true;
        });
      }
    };
  }()
};


var game = new Game(backToTop, 'body');

$(window).on('scroll', function() {
  if ($(this).scrollTop() < 10) {
    game.hide();
  } else {
    game.show();
  }
});

game.start();

});

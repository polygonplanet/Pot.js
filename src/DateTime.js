//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of DateTime.
Pot.update({
  /**
   * @lends Pot
   */
  /**
   * DateTime utilities.
   *
   * @param  {*}       x  The timestamp.
   * @return {Number}     The timestamp at that time.
   *
   * @name Pot.DateTime
   * @type Function
   * @class
   * @function
   * @static
   * @public
   */
  DateTime : function(x) {
    return +new Date(x);
  }
});

update(Pot.DateTime, {
  /**
   * @lends Pot.DateTime
   */
  /**
   * Get the current time as milliseconds.
   *
   *
   * @example
   *   var time = now(); // equals (new Date()).getTime();
   *   debug(time); // 1323446177282
   *
   *
   * @return {Number} Return the current time as milliseconds.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  now : now,
  /**
   * Get the current UNIX timestamp.
   *
   * @return {Number} Return the current UNIX timestamp.
   *
   * @type  Function
   * @function
   * @static
   * @public
   */
  time : function() {
    return Math.round(now() / 1000);
  },
  /**
   * Return the formatted date.
   *
   * That works the same as PHP's date function probably.
   * (Refer the manual.)
   * @link http://php.net/function.date
   *
   * Use a backslash '\\' if escape the next character.
   *
   * <pre>
   * ------------------------------------------------
   * Extended formats:
   *   - J : Japanese weekday (日 ～ 土)
   *   - o : Old Japanese Month (霜月, 水無月, etc.)
   * ------------------------------------------------
   * </pre>
   *
   *
   * @example
   *   var result = Pot.DateTime.format('Y-m-d H:i:s');
   *   debug(result);
   *   // @results '2011-06-07 01:25:17'
   *
   *
   * @example
   *   var result = Pot.DateTime.format('Y/m/d (J) H:i [\\o=o]');
   *   debug(result);
   *   // @results '2011/06/08 (水) 11:30 [o=水無月]'
   *
   *
   * @example
   *   var result = Pot.DateTime.format(Pot.DateTime.format.RFC2822);
   *   debug(result);
   *   // @results 'Wed, 08 Jun 2011 02:34:21 +0900'
   *
   *
   * @param  {String}          format   A format string. (e.g. 'Y-m-d').
   * @param  {Date|Number|*}   (date)   (Optional) The specific timestamp.
   * @return {String}                   Return the formatted date string.
   *
   * @name  Pot.DateTime.format
   * @type  Function
   * @class
   * @function
   * @static
   * @public
   */
  format : (function() {
    /**
     * @private
     * @ignore
     */
    var DateTimeFormatter = function() {};
    update(DateTimeFormatter, {
      /**
       * @private
       * @ignore
       */
      TIMEZONE_MAPS : {
        GMT  :   0,               // Greenwich Mean
        UTC  :   0,               // Universal (Coordinated)
        WET  :   0,               // Western European
        WAT  :  -1 * 3600,        // West Africa
        AT   :  -2 * 3600,        // Azores
        NFT  :  -3 * 3600 - 1800, // Newfoundland
        AST  :  -4 * 3600,        // Atlantic Standard
        EST  :  -5 * 3600,        // Eastern Standard
        CST  :  -6 * 3600,        // Central Standard
        MST  :  -7 * 3600,        // Mountain Standard
        PST  :  -8 * 3600,        // Pacific Standard
        YST  :  -9 * 3600,        // Yukon Standard
        HST  : -10 * 3600,        // Hawaii Standard
        CAT  : -10 * 3600,        // Central Alaska
        AHST : -10 * 3600,        // Alaska-Hawaii Standard
        NT   : -11 * 3600,        // Nome
        IDLW : -12 * 3600,        // International Date Line West
        CET  :  +1 * 3600,        // Central European
        MET  :  +1 * 3600,        // Middle European
        MEWT :  +1 * 3600,        // Middle European Winter
        SWT  :  +1 * 3600,        // Swedish Winter
        FWT  :  +1 * 3600,        // French Winter
        EET  :  +2 * 3600,        // Eastern Europe, USSR Zone 1
        BT   :  +3 * 3600,        // Baghdad, USSR Zone 2
        IT   :  +3 * 3600 + 1800, // Iran
        ZP4  :  +4 * 3600,        // USSR Zone 3
        ZP5  :  +5 * 3600,        // USSR Zone 4
        IST  :  +5 * 3600 + 1800, // Indian Standard
        ZP6  :  +6 * 3600,        // USSR Zone 5
        SST  :  +7 * 3600,        // South Sumatra, USSR Zone 6
        WAST :  +7 * 3600,        // West Australian Standard
        JT   :  +7 * 3600 + 1800, // Java
        CCT  :  +8 * 3600,        // China Coast, USSR Zone 7
        JST  :  +9 * 3600,        // Japan Standard, USSR Zone 8
        CAST :  +9 * 3600 + 1800, // Central Australian Standard
        EAST : +10 * 3600,        // Eastern Australian Standard
        GST  : +10 * 3600,        // Guam Standard, USSR Zone 9
        NZT  : +12 * 3600,        // New Zealand
        NZST : +12 * 3600,        // New Zealand Standard
        IDLE : +12 * 3600         // International Date Line East
      },
      /**
       * @private
       * @ignore
       */
      WEEK : {
        en : [
          'Sunday',    'Monday',   'Tuesday',
          'Wednesday', 'Thursday', 'Friday',  'Saturday'
        ],
        ja : [
          '\u65e5', // 日
          '\u6708', // 月
          '\u706b', // 火
          '\u6c34', // 水
          '\u6728', // 木
          '\u91d1', // 金
          '\u571f'  // 土
        ]
      },
      /**
       * @private
       * @ignore
       */
      MONTH : {
        en : [
          'January',   'February', 'March',    'April',
          'May',       'June',     'July',     'August',
          'September', 'October',  'November', 'December'
        ],
        ja : [
          '\u7766\u6708',       // 睦月
          '\u5982\u6708',       // 如月
          '\u5f25\u751f',       // 弥生
          '\u536f\u6708',       // 卯月
          '\u7690\u6708',       // 皐月
          '\u6c34\u7121\u6708', // 水無月
          '\u6587\u6708',       // 文月
          '\u8449\u6708',       // 葉月
          '\u9577\u6708',       // 長月
          '\u795e\u7121\u6708', // 神無月
          '\u971c\u6708',       // 霜月
          '\u5e2b\u8d70'        // 師走
        ]
      },
      /**
       * @private
       * @ignore
       */
      DATE_SUFFIX : [
        'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
        'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'
      ],
      /**
       * @private
       * @ignore
       */
      TRANSLATE_PATTERN : /(?:\\.|[a-zA-Z])/g
    });
    DateTimeFormatter.prototype = update(DateTimeFormatter.prototype, {
      /**
       * @private
       * @ignore
       */
      format : function(pattern, date) {
        var result = '', that = this, t, fm, d, o, tr, isString = Pot.isString;
        if (!isString(pattern)) {
          t = pattern;
          pattern = date;
          date = t;
        }
        fm = stringify(pattern);
        if (Pot.isDate(date)) {
          d = date;
        } else if (Pot.isNumeric(date) || (date && isString(date))) {
          d = new Date(date);
        } else {
          d = new Date();
        }
        if (fm) {
          o = {
            self     : d,
            year     : d.getFullYear(),
            month    : d.getMonth(),
            date     : d.getDate(),
            day      : d.getDay(),
            hours    : d.getHours(),
            minutes  : d.getMinutes(),
            seconds  : d.getSeconds(),
            mseconds : d.getMilliseconds(),
            timezone : d.getTimezoneOffset(),
            time     : d.getTime()
          };
          /**@ignore*/
          tr = function(m) {
            return that.translate(m, o);
          };
          result = fm.replace(DateTimeFormatter.TRANSLATE_PATTERN, tr);
        }
        return result;
      },
      /**
       * @private
       * @ignore
       */
      translate : function(c, d) {
        switch (c.charAt(0)) {
            case '\\': return c.charAt(1);
            case 'A': return this.meridiem(d.hours).toUpperCase();
            case 'a': return this.meridiem(d.hours);
            case 'c': return this.format(Pot.DateTime.format.ATOM);
            case 'D': return DateTimeFormatter.WEEK.en[d.day].substr(0, 3);
            case 'd': return this.padding(d.date);
            case 'F': return DateTimeFormatter.MONTH.en[d.month];
            case 'G': return d.hours;
            case 'g': return this.to12Hour(d.hours);
            case 'H': return this.padding(d.hours);
            case 'h': return this.padding(this.to12Hour(d.hours));
            case 'i': return this.padding(d.minutes);
            case 'J': return DateTimeFormatter.WEEK.ja[d.day];
            case 'j': return d.date;
            case 'L': return String(this.isLeapYear(d.year) ? 1 : 0);
            case 'l': return DateTimeFormatter.WEEK.en[d.day];
            case 'M': return DateTimeFormatter.MONTH.en[d.month].substr(0, 3);
            case 'm': return this.padding(d.month + 1);
            case 'N': return this.isoDay(d.day);
            case 'n': return d.month + 1;
            case 'o': return DateTimeFormatter.MONTH.ja[d.month];
            case 'O': return this.getTimezone(d.timezone);
            case 'P': return this.getTimezone(d.timezone, true);
            case 'r': return this.format(Pot.DateTime.format.RFC2822);
            case 'S': return DateTimeFormatter.DATE_SUFFIX[d.date - 1];
            case 's': return this.padding(d.seconds);
            case 'T': return this.getTimezoneName(d.timezone);
            case 't': return this.lastDayOfMonth(d.self);
            case 'U': return Math.round(d.time / 1000);
            case 'u': return this.padding(d.mseconds, 6);
            case 'w': return d.day;
            case 'Y': return d.year;
            case 'y': return d.year.toString().substr(2, 2);
            case 'z': return this.countDate(d.year, d.month, d.date);
            case 'Z': return this.getTimezoneSec(d.timezone);
            default : break;
        }
        return c;
      },
      /**
       * @private
       * @ignore
       */
      padding : function(n, size, ch) {
        var s = String(n), len = (size || 2) - 0, c = String(ch || 0);
        while (s.length < len) {
          s = c + s;
        }
        return s;
      },
      /**
       * @private
       * @ignore
       */
      to12Hour : function(hours) {
        return (hours > 12) ? hours - 12 : hours;
      },
      /**
       * @private
       * @ignore
       */
      meridiem : function(hours) {
        return (((hours - 0) < 12) ? 'a' : 'p') + 'm';
      },
      /**
       * @private
       * @ignore
       */
      isoDay : function(day) {
        return ((day - 0) === 0) ? '7' : day;
      },
      /**
       * @private
       * @ignore
       */
      lastDayOfMonth : function(date) {
        var t = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        t.setTime(t.getTime() - 1);
        return t.getDate();
      },
      /**
       * @private
       * @ignore
       */
      isLeapYear : function(year) {
        var d = new Date(year, 0, 1), sum = 0, i;
        for (i = 0; i < 12; i++) {
          d.setMonth(i);
          sum += this.lastDayOfMonth(d);
        }
        return sum != 365;
      },
      /**
       * @private
       * @ignore
       */
      countDate : function(year, month, date) {
        var d = new Date(year, 0, 1), sum = -1, i, max = (month - 0);
        for (i = 0; i < max; i++) {
          d.setMonth(i);
          sum += this.lastDayOfMonth(d);
        }
        return sum + date;
      },
      /**
       * @private
       * @ignore
       */
      getTimezone : function(offset, colon) {
        var o = (offset - 0) || 0,
            a = Math.abs(o),
            sign = (o < 0) ? '+' : '-';
        return [
          sign,
          this.padding(Math.floor(a / 60)),
          colon ? ':' : '',
          this.padding(a % 60)
        ].join('');
      },
      /**
       * @private
       * @ignore
       */
      getTimezoneSec : function(offset) {
        var o = (offset - 0) || 0;
        return ((o < 0) ? '' : '-') + Math.abs(o * 60);
      },
      /**
       * @private
       * @ignore
       */
      getTimezoneName : function(offset) {
        var result, name,
            maps = DateTimeFormatter.TIMEZONE_MAPS;
            def = maps[1],
            o = (offset - 0) || 0;
            time = Math.floor(-o / 60 * 3600);
        if (time === 0) {
          result = def;
        } else {
          for (name in maps) {
            if (maps[name] === time) {
              result = name;
              break;
            }
          }
        }
        return result || def;
      }
    });
    return update(function(/*format[, date]*/) {
      var d = new DateTimeFormatter();
      return d.format.apply(d, arguments);
    }, {
      /**
       * @lends Pot.DateTime.format
       */
      /**
       * A constant string of the date format for ATOM.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      ATOM : 'Y-m-d\\TH:i:sP',
      /**
       * A constant string of the date format for COOKIE.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      COOKIE : 'l, d-M-y H:i:s T',
      /**
       * A constant string of the date format for ISO8601.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      ISO8601 : 'Y-m-d\\TH:i:sO',
      /**
       * A constant string of the date format for RFC822.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC822 : 'D, d M y H:i:s O',
      /**
       * A constant string of the date format for RFC850.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC850 : 'l, d-M-y H:i:s T',
      /**
       * A constant string of the date format for RFC1036.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC1036 : 'D, d M y H:i:s O',
      /**
       * A constant string of the date format for RFC1123.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC1123 : 'D, d M Y H:i:s O',
      /**
       * A constant string of the date format for RFC2822.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC2822 : 'D, d M Y H:i:s O',
      /**
       * A constant string of the date format for RFC3339.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RFC3339 : 'Y-m-d\\TH:i:sP',
      /**
       * A constant string of the date format for RSS.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      RSS : 'D, d M Y H:i:s O',
      /**
       * A constant string of the date format for W3C.
       *
       * @type  String
       * @const
       * @static
       * @public
       */
      W3C : 'Y-m-d\\TH:i:sP'
    });
  }())
});

// Update Pot object.
Pot.update({
  time : Pot.DateTime.time,
  date : Pot.DateTime.format
});

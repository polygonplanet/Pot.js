//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Debug.
Pot.update({
  /**
   * @lends Pot.Debug
   */
  /**
   * Debugging utilities.
   *
   * @name Pot.Debug
   * @type Object
   * @class
   * @static
   * @public
   */
  Debug : {}
});

update(Pot.Debug, {
  /**
   * @lends Pot.Debug
   */
  /**
   * Output to the console using log function for debug.
   *
   *
   * @example
   *   debug('hoge'); // hoge
   *
   *
   * @param  {*}  msg  A log message, or variable.
   *
   * @type Function
   * @function
   * @public
   * @static
   */
  debug : debug
});

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// Definition of Mozilla XPCOM interfaces/methods.

Pot.update({
  /**
   * @lends Pot
   */
  /**
   * XPCOM utilities.
   *
   * @name Pot.XPCOM
   * @type Object
   * @class
   * @static
   * @public
   */
  XPCOM : {}
});

update(Pot.XPCOM, {
  /**
   * @lends Pot.XPCOM
   */
  /**
   * Evaluate JavaScript code in the sandbox.
   *
   * @param  {String}  code   The expression.
   * @param  {String}  url    The sandbox URL.
   * @return {*}              Return the result of expression.
   * @type Function
   * @function
   * @public
   * @static
   */
  evalInSandbox : function(code, url) {
    var result, re, src;
    if (PotSystem.hasComponents) {
      if (!Cu) {
        PotSystem.isWaitable = PotSystem.hasComponents = false;
        return;
      }
      re = /^[\s;]*|[\s;]*$/g;
      src = stringify(code).replace(re, '');
      result = Cu.evalInSandbox(src, Cu.Sandbox(url));
    }
    return result;
  },
  /**
   * Wait until condition is true on the thread in non-blocking.
   * If true returned, waiting state will end.
   *
   * @param  {Function|*}  cond  A function or value as condition.
   * @based  Tombloo Lib
   * @type Function
   * @function
   * @public
   * @static
   */
  throughout : function(cond) {
    var thread;
    if (PotSystem.hasComponents) {
      try {
        thread = Cc['@mozilla.org/thread-manager;1']
                .getService(Ci.nsIThreadManager).mainThread;
      } catch (e) {
        PotSystem.isWaitable = PotSystem.hasComponents = false;
      }
      if (thread && PotSystem.hasComponents) {
        do {
          thread.processNextEvent(true);
        } while (cond && !cond());
      }
    }
  },
  /**
   * Get a browser window that was active last.
   *
   * @return {Window}       Return the browser window.
   * @type Function
   * @function
   * @public
   * @static
   */
  getMostRecentWindow : function() {
    var cwin;
    if (PotSystem.hasComponents) {
      try {
        cwin = Cc['@mozilla.org/appshell/window-mediator;1']
              .getService(Ci.nsIWindowMediator)
              .getMostRecentWindow('navigator:browser');
      } catch (e) {
        PotSystem.isWaitable = PotSystem.hasComponents = false;
      }
    }
    return cwin;
  },
  /**
   * Get the specific XUL Window.
   *
   * @param  {String}  uri  The target URI to get.
   *                        Will be the browser window if omitted.
   * @return {Object}       XULWindow.
   * @type Function
   * @function
   * @public
   * @static
   */
  getChromeWindow : function(uri) {
    var result, win, wins, pref;
    if (!PotSystem.hasComponents) {
      return;
    }
    pref = uri || 'chrome://browser/content/browser.xul';
    try {
      wins = Cc['@mozilla.org/appshell/window-mediator;1']
            .getService(Ci.nsIWindowMediator)
            .getXULWindowEnumerator(null);
    } catch (e) {
      PotSystem.isWaitable = PotSystem.hasComponents = false;
      return;
    }
    while (wins.hasMoreElements()) {
      try {
        win = wins.getNext()
            .QueryInterface(Ci.nsIXULWindow).docShell
            .QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindow);
        if (win && win.location &&
            (win.location.href == pref || win.location == pref)) {
          result = win;
          break;
        }
      } catch (e) {}
    }
    return result;
  }
});

// Update Pot object.
Pot.update({
  evalInSandbox       : Pot.XPCOM.evalInSandbox,
  throughout          : Pot.XPCOM.throughout,
  getMostRecentWindow : Pot.XPCOM.getMostRecentWindow,
  getChromeWindow     : Pot.XPCOM.getChromeWindow
});

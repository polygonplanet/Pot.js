/**
 * Pot.js - Run Test - Pot.Workeroid
 *
 * @description
 *  Run Test for Pot.js - Workeroid
 *
 * @description
 *  JavaScriptライブラリPot.js用のテストスクリプト
 *
 */

function bar() {
  return 'bar';
}

onmessage = function(ev) {
  postMessage(ev.data + bar());
};

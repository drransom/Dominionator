(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

// Function based on function by David Walsh: http://davidwalsh.name/css-animation-callback
function whichTransitionEvent() {
  var t,
      el = document.createElement("fakeelement");

  var transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd",
    "MSTransition"    : "MSAnimationEnd"
  };

  for (t in transitions){
    if (el.style[t] !== undefined){
      return transitions[t];
    }
  }
}

var transitionEvent = whichTransitionEvent();

D.addTransitionEvent = function(el, callback) {
  D.createSelfDestroyingListener(el, transitionEvent, callback);
};

D.createSelfDestroyingListener = function(el, transitionEvent, callback) {
  var func = function (event) {
    debugger;
    callback(event);
    el.removeEventListener(transitionEvent);
  };
  el.addEventListener(transitionEvent, func);
};


})();

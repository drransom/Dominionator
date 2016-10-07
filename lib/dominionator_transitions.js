;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

// Function based on function by David Walsh: http://davidwalsh.name/css-animation-callback
function whichTransitionEvent() {
  let el = document.createElement("fakeelement");

  let transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd",
    "MSTransition"    : "MSAnimationEnd"
  };

  for (let t in transitions){
    if (el.style[t] !== undefined){
      return transitions[t];
    }
  }
}

let transitionEvent = whichTransitionEvent();

D.addTransitionEvent = function(el, callback) {
  D.createSelfDestroyingListener(el, transitionEvent, callback);
};

D.createSelfDestroyingListener = function(el, transitionEvent, callback) {
  let func = function(event) {
    callback(event);
    el.removeEventListener(transitionEvent, func);
  };
  el.addEventListener(transitionEvent, func);
};


})();

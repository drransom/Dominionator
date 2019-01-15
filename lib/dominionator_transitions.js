class Transitions() {

// Function based on function by David Walsh: http://davidwalsh.name/css-animation-callback
  static whichTransitionEvent() {
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

  static addTransitionEvent (el, callback) {
    Transitions.createSelfDestroyingListener(el, Transitions.whichTransitionEvent(), callback);
  }

  static createSelfDestroyingListener (el, transitionEvent, callback) {
    let func = function(event) {
      callback(event);
      el.removeEventListener(transitionEvent, func);
    };
    el.addEventListener(transitionEvent, func);
  }
};

export {Transitions};

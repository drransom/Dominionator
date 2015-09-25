;(function() {
"use strict";

if (window.Domionator === undefined) {
  window.Dominionator = {};
}

var D = Dominionator;

D.titleCase = function (e){var t=/^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;return e.replace(/([^\W_]+[^\s-]*) */g,function(e,n,r,i){return r>0&&r+n.length!==i.length&&n.search(t)>-1&&i.charAt(r-2)!==":"&&i.charAt(r-1).search(/[^\s-]/)<0?e.toLowerCase():n.substr(1).search(/[A-Z]|\../)>-1?e:e.charAt(0).toUpperCase()+e.substr(1)})};

D.htmlize = function(str) {
  return str.replace(' ', '-').toLowerCase();
};

D.htmlToTitleCase = function (str) {
  return D.titleCase(str.replace('-', ' '));
};

D.removeClass = function (el, className) {
  if (el.classList && className) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

D.hidden = function(direction) {
  switch (direction) {
    case "left":
      return "slideLeft";
    case "center":
      return "hideCenter";
    default:
      return "";
  }
};

D.addClass = function(el, classNames) {
  var className, args;
  if (typeof classNames !== 'string') {
    args = D.flatten(arguments);
  } else {
    args = arguments;
  }
  for (var i = 1; i < args.length; i++) {
    className = args[i];
    if (el.classList && className) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }
};

D.flatten = function(array) {
  var newArray = [];
  function recurse(array) {
    Array.prototype.forEach.call(array, function(element) {
      if (element && element instanceof Array) {
        recurse(element);
      } else {
        newArray.push(element);
      }
    });
  }
  recurse(array);
  return newArray;
};

D.inherit = (function(NewClass, OldClass) {
  function Surrogate() {}
  return function (NewClass, OldClass) {
    Surrogate.prototype = OldClass.prototype;
    NewClass.prototype = new Surrogate();
    NewClass.prototype.constructor = OldClass;
  };
})();

D.optionsFormToArray = function(form) {
  var optionsArray = [];
  Array.prototype.forEach.call(form.elements, function (element) {
    optionsArray.push(element.value);
  });
  return optionsArray;
};

D.otherIndexOfValue = function(nodes, value, index) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].value === value && i != index) {
      return i;
    }
  }
  throw "index not found";
};

D.where = function(array, parameters) {
  var matchFunction = D.paramsMatch(parameters);
  return array.filter(matchFunction);
};

D.find = function(array, callback) {
  for (var i = 0; i < array.length; i++) {
    if (callback(array[i])) {
      return array[i];
    }
  }
};

D.findWhere = function(array, parameters) {
  var matchFunction = D.paramsMatch(parameters);
  return D.find(array, matchFunction);
};

D.paramsMatch = function(object) {
  return function (element) {
    for (var property in object) {
      if (object.hasOwnProperty(property) &&
          object[property] !== element[property]) {
        return false;
      }
    }
    return true;
  };
};

D.findIndex = function(array, element) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === element) {
      return i;
    }
  }
  return -1;
};

D.reject = function(array, callback) {
  var rejectFunction = function(element) {
    return !callback(element);
  };
  return array.filter(rejectFunction);
};

D.shuffle = function(array) {
  var randomIndex, currentVal, newArray = array.slice();
  for (var i = newArray.length - 1; i > 0; i--) {
    randomIndex = Math.floor(Math.random() * i);
    currentVal = newArray[i];
    newArray[i] = newArray[randomIndex];
    newArray[randomIndex] = currentVal;
  }
  return newArray;
};

D.createDOMElement = function(options) {
  var property, element = document.createElement(options.type);
  for (property in options.attributes) {
    element[property] = options.attributes[property];
  }

  for (property in options.nonStandardAttributes) {
    element.setAttribute(property, options.nonStandardAttributes[property]);
  }

  if (options.classes) {
    D.addClass(element, options.classes);
  }

  return element;
};

})();

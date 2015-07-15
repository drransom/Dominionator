;(function() {
"use strict";

if (window.Domionator === undefined) {
  window.Dominionator = {};
}

var D = Dominionator;

D.titleCase = function (e){var t=/^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;return e.replace(/([^\W_]+[^\s-]*) */g,function(e,n,r,i){return r>0&&r+n.length!==i.length&&n.search(t)>-1&&i.charAt(r-2)!==":"&&i.charAt(r-1).search(/[^\s-]/)<0?e.toLowerCase():n.substr(1).search(/[A-Z]|\../)>-1?e:e.charAt(0).toUpperCase()+e.substr(1)})};

D.htmlize = function (str) {
  return str.replace(' ', '-').toLowerCase();
};

D.htmlToTitleCase = function htmlToTitleCase (str) {
  return D.titleCase(str.replace('-', ' '));
};

D.removeClass = function removeClass (el, className) {
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

D.addClass = function addClass (el, className) {
  if (el.classList && className) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
};

D.inherit = (function (NewClass, OldClass) {
  function Surrogate() {}
  return function (NewClass, OldClass) {
    Surrogate.prototype = OldClass.prototype;
    NewClass.prototype = new Surrogate();
    NewClass.prototype.constructor = OldClass;
  };
})();

D.optionsFormToArray = function (form) {
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

})();

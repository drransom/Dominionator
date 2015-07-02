(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.titleCase = function titleCase(e){var t=/^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;return e.replace(/([^\W_]+[^\s-]*) */g,function(e,n,r,i){return r>0&&r+n.length!==i.length&&n.search(t)>-1&&i.charAt(r-2)!==":"&&i.charAt(r-1).search(/[^\s-]/)<0?e.toLowerCase():n.substr(1).search(/[A-Z]|\../)>-1?e:e.charAt(0).toUpperCase()+e.substr(1)})};

Dominionator.htmlize = function htmlize (str) {
  return str.replace(' ', '-').toLowerCase();
};

Dominionator.htmlToTitleCase = function htmlToTitleCase (str) {
  return Dominionator.titleCase(str.replace('-', ' '));
};

Dominionator.removeClass = function removeClass (el, className) {
  if (el.classList && className) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

Dominionator.addClass = function addClass (el, className) {
  if (el.classList && className) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
};

})();

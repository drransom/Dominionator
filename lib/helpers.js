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

Dominionator.inherit = function (NewClass, OldClass) {
  function Surrogate() {}
  Surrogate.prototype = OldClass.prototype;
  NewClass.prototype = new Surrogate();
};

//credit for this one goes to JSFiddle http://jsfiddle.net/c8j6x/

Dominionator.serializeOptions = function(form) {
    if (!form || form.nodeName !== "FORM") {
        return;
    }
    var i, j, q = [];
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue;
        }
        switch (form.elements[i].nodeName) {
        case 'INPUT':
            switch (form.elements[i].type) {
            case 'text':
            case 'hidden':
            case 'password':
            case 'button':
            case 'reset':
            case 'submit':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'checkbox':
            case 'radio':
                if (form.elements[i].checked) {
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                }
                break;
            }
            break;
        case 'file':
            break;
        case 'TEXTAREA':
            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
            break;
        case 'SELECT':
            switch (form.elements[i].type) {
            case 'select-one':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'select-multiple':
                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                    if (form.elements[i].options[j].selected) {
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                    }
                }
                break;
            }
            break;
        case 'BUTTON':
            switch (form.elements[i].type) {
            case 'reset':
            case 'submit':
            case 'button':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            }
            break;
        }
    }
    data = q.join("&");
    alert(q.join("&"));
};

Dominionator.optionsFormToArray = function (form) {
  var optionsArray = [];
  Array.prototype.forEach.call(form.elements, function (element) {
    optionsArray.push(element.value);
  });
  return optionsArray;
};

})();

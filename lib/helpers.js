class Helpers {

static titleCase(e){let t=/^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;return e.replace(/([^\W_]+[^\s-]*) */g,function(e,n,r,i){return r>0&&r+n.length!==i.length&&n.search(t)>-1&&i.charAt(r-2)!==":"&&i.charAt(r-1).search(/[^\s-]/)<0?e.toLowerCase():n.substr(1).search(/[A-Z]|\../)>-1?e:e.charAt(0).toUpperCase()+e.substr(1)})};

static htmlize(str) {
  return str.replace(' ', '-').toLowerCase();
};

static htmlToTitleCase(str) {
  return titleCase(str.replace('-', ' '));
};

static removeClass(el, className) {
  if (el.classList && className) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

static hidden(direction) {
  switch (direction) {
    case "left":
      return "slideLeft";
    case "center":
      return "hideCenter";
    default:
      return "";
  }
};

static addClass(el, classNames) {
  let className, args;
  if (typeof classNames !== 'string') {
    args = Helpers.flatten(arguments);
  } else {
    args = arguments;
  }
  for (let i = 1; i < args.length; i++) {
    className = args[i];
    if (el.classList && className) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }
};

static flatten(array) {
  let newArray = [];
  function recurse(array) {
    for (let element of array) {
      if (element && element instanceof Array) {
        recurse(element);
      } else {
        newArray.push(element);
      }
    }
  }
  recurse(array);
  return newArray;
};

static optionsFormToArray(form) {
  let optionsArray = [];
  Array.prototype.forEach.call(form.elements, function (element) {
    optionsArray.push(element.value);
  });
  return optionsArray;
}

static otherIndexOfValue(nodes, value, index) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].value === value && i != index) {
      return i;
    }
  }
  throw "index not found";
}

static where(array, parameters) {
  let matchFunction = Helpers.paramsMatch(parameters);
  return array.filter(matchFunction);
}

static find(array, callback) {
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i])) {
      return array[i];
    }
  }
}

static findWhere(array, parameters) {
  let matchFunction = Helpers.paramsMatch(parameters);
  return Helpers.find(array, matchFunction);
}

static paramsMatch(object) {
  return function (element) {
    for (let property in object) {
      if (object.hasOwnProperty(property) &&
          object[property] !== element[property]) {
        return false;
      }
    }
    return true;
  };
}

static findIndex(array, element) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) {
      return i;
    }
  }
  return -1;
}

static reject(array, callback) {
  let rejectFunction = function(element) {
    return !callback(element);
  };
  return array.filter(rejectFunction);
}

static shuffle(array) {
  let randomIndex, currentVal, newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    randomIndex = Math.floor(Math.random() * i);
    currentVal = newArray[i];
    newArray[i] = newArray[randomIndex];
    newArray[randomIndex] = currentVal;
  }
  return newArray;
}

static createDOMElement(options) {
  let property, element = document.createElement(options.type);
  for (property in options.attributes) {
    element[property] = options.attributes[property];
  }

  for (property in options.nonStandardAttributes) {
    element.setAttribute(property, options.nonStandardAttributes[property]);
  }

  if (options.classes) {
    Helpers.addClass(element, options.classes);
  }

  return element;
}
};

export {Helpers};

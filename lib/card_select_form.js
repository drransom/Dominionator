(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

var D = Dominionator;

var cardSelectForm = function(options) {
  this.selector = options.selector;
  this.cardList = this.selector.cardList;
  this.el = options.el;
  this.shouldSetIncludeExclude = true;
  this.liObjects = [];
  this.liObjectsBySetName = {};
  this.domObjectsById = {};
};

if (D.CardSelectForm) {
  cardSelectForm.prototype = D.CardSelectForm.prototype;
}

D.CardSelectForm = cardSelectForm;

var CardSelectForm = D.CardSelectForm;

CardSelectForm.prototype.initializeForm = function() {
  this.el.innerHTML = JST.cardForm( { sets: this.cardList.sets.sort() } );
  this.setListItems();
  this.setLiListeners();
};

CardSelectForm.prototype.setListItems = function() {
  var lis = this.el.getElementsByClassName('select-li');
  var newLi;
  for (var i = 0; i < lis.length; i++) {
    newLi = new D.CardSelectLi(lis[i]);
    this.liObjects.push(newLi);
    newLi.setObjectById(this.domObjectsById);
    this.liObjectsBySetName[newLi.setName] = newLi;
  }
};

CardSelectForm.prototype.setLiListeners = function() {
  var li, selectForm = this;
  this.el.addEventListener('change', function (event) {
    var targetNode = event.target;
    var targetLi = selectForm.getDomObjectByTarget(targetNode).liObject;
    for (var i = 0; i < selectForm.liObjects.length; i++) {
      li = selectForm.liObjects[i];
      if (li === targetLi) {
        switch (targetNode) {
          case li.minOption:
            selectForm.validateMax(li);
            li.validateIncludeExclude();
            break;
          case li.maxOption:
            selectForm.validateMin(li);
            li.validateIncludeExclude();
            break;
          case li.includeOption:
            selectForm.includeSet(li);
            break;
          case li.excludeOption:
            selectForm.excludeSet(li);
            break;
          }
        }
      }
    }
  );
};

CardSelectForm.prototype.getDomObjectByTarget = function (target) {
  return this.domObjectsById[target.id];
};

CardSelectForm.prototype.setSubmitListener = function() {
  var selectForm = this;
  this.el.addEventListener('submit', function (event) {
    event.preventDefault();
    var min = selectForm.findMinMax("min");
    var max = selectForm.findMinMax("max");
    var alchemy_min_3 = selectForm.checkAlchemyCondition();
    selectForm.selector.createNewGame({ min: min, max: max, alchemy_min_3: alchemy_min_3});
  });
};

// CardSelectForm.prototype.setIncludeExcludeListeners = function () {
//   var selectForm = this;
//   this.el.addEventListener('change', function (event) {
//     var target = event.target;
//     if (target.value && target.value === 'include') {
//       selectForm.includeSet(event.target.name);
//     } else if (target.value && target. value === 'exclude') {
//       selectForm.excludeSet(event.target.name);
//     }
//   });
// };
//
// CardSelectForm.prototype.setMinMaxListeners = function() {
//   var selectForm = this;
//   var minOptiones = document.getElementsByClassName('min-option');
//   var maxOptiones = document.getElementsByClassName('max-option');
//   this.setMinmaxOptiones(minOptiones, maxOptiones);
//   this.el.addEventListener('change', function (event) {
//     var target = event.target;
//     if (Array.prototype.indexOf.call(minOptiones, target) >= 0) {
//       selectForm.validateMax(event.target);
//     } else if (Array.prototype.indexOf.call(maxOptiones, target) >= 0) {
//       selectForm.validateMin(event.target);
//     }
//   });
// };
//
// CardSelectForm.prototype.setMinmaxOptiones = function (minOptiones, maxOptiones) {
//   for (var i = 0; i < minOptiones.length; i++) {
//     minOptiones[i].maxOption = maxOptiones[i];
//     maxOptiones[i].minOption = minOptiones[i];
//   }
// };

CardSelectForm.prototype.validateMax = function (li) {
  if (parseInt(li.maxOption.value) < parseInt(li.minOption.value)) {
    li.maxOption.value = li.minOption.value;
  }
};

CardSelectForm.prototype.validateMin = function (li) {
  if (parseInt(li.minOption.value) > parseInt(li.maxOption.value)) {
    li.minOption.value = li.maxOption.value;
  }
};

CardSelectForm.prototype.includeSet = function (li) {
  if (this.shouldSetIncludeExclude) {
    this.shouldSetIncludeExclude = false;
    this.excludeAllExcept(li);
  }
  this.changeSetInclusion("include", li);
};

CardSelectForm.prototype.excludeSet = function (li) {
  if (this.shouldSetIncludeExclude) {
    this.shouldSetIncludeExclude = false;
    this.includeAllExcept(li);
  }
  this.changeSetInclusion("exclude", li);
};

CardSelectForm.prototype.includeAll = function () {
  var includeButtons = document.querySelectorAll('input[name=include-checkbox]');
  Array.prototype.forEach.call(includeButtons, function(includeButton) {
    this.includeSet(includeButton.setName);
  }.bind(this));
};

CardSelectForm.prototype.changeSetInclusion = function (includeExclude, li) {
  var htmlizedName, minOption, minValue, maxOption, maxValue, includeOption,
      excludeOption;
  htmlizedName = D.htmlize(li.setName);
  minOption = li.minOption;
  minValue = parseInt(minOption.value);
  maxOption = li.maxOption;
  maxValue = parseInt(maxOption.value);
  if (includeExclude === "include") {
    includeOption = li.includeOption;
    includeOption.checked = true;
    maxOption.value = maxValue || 10;
  } else {
    excludeOption = li.excludeOption;
    excludeOption.checked = true;
    maxOption.value = 0;
    minOption.value = 0;
  }
};

CardSelectForm.prototype.includeAllExcept = function (li) {
  this.liObjects.forEach(function(otherLi) {
    if (li != otherLi) {
      this.includeSet(otherLi);
    }
  }.bind(this));
};

CardSelectForm.prototype.excludeAllExcept = function (li) {
  this.liObjects.forEach(function(otherLi) {
    if (otherLi != li) {
      this.excludeSet(otherLi);
    }
  }.bind(this));
};

CardSelectForm.prototype.findMinMax = function (minOrMax) {
  var id, value, result = {};
  this.cardList.sets.forEach(function(set) {
    id = D.htmlize(set) + "-" + minOrMax;
    result[set] = document.getElementById(id).value;
  });
  return result;
};

})();

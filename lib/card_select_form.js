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
};

if (D.CardSelectForm) {
  cardSelectForm.prototype = D.CardSelectForm.prototype;
}

D.CardSelectForm = cardSelectForm;

var CardSelectForm = D.CardSelectForm;

CardSelectForm.prototype.initializeForm = function() {
  this.el.innerHTML = JST.cardForm( { sets: this.cardList.sets.sort() } );
  this.setSubmitListener();
  this.setIncludeExcludeListeners();
  this.setMinMaxListeners();
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

CardSelectForm.prototype.setIncludeExcludeListeners = function () {
  var selectForm = this;
  this.el.addEventListener('change', function (event) {
    var target = event.target;
    if (target.value && target.value === 'include') {
      selectForm.includeSet(event.target.name);
    } else if (target.value && target. value === 'exclude') {
      selectForm.excludeSet(event.target.name);
    }
  });
};

CardSelectForm.prototype.setMinMaxListeners = function() {
  var selectForm = this;
  this.el.addEventListener('change', function (event) {
    var target = event.target;
  });
};

CardSelectForm.prototype.includeSet = function (setName) {
  if (this.shouldSetIncludeExclude) {
    this.shouldSetIncludeExclude = false;
    this.excludeAllExcept(setName);
  }
  this.changeSetInclusion("include", setName);
};

CardSelectForm.prototype.excludeSet = function (setName) {
  if (this.shouldSetIncludeExclude) {
    this.shouldSetIncludeExclude = false;
    this.includeAllExcept(setName);
  }
  this.changeSetInclusion("exclude", setName);
};

CardSelectForm.prototype.includeAll = function () {
  var includeButtons = document.querySelectorAll('input[name=include-checkbox]');
  Array.prototype.forEach.call(includeButtons, function(includeButton) {
    this.includeSet(includeButton.setName);
  }.bind(this));
};

CardSelectForm.prototype.changeSetInclusion = function (includeExclude, setName) {
  var htmlizedName, minOption, maxOption, minValue, maxValue, button;
  htmlizedName = D.htmlize(setName);
  minOption = document.getElementById(htmlizedName + '-min');
  minValue = parseInt(minOption.value);
  maxOption = document.getElementById(htmlizedName + '-max');
  maxValue = parseInt(maxOption.value);
  if (includeExclude === "include") {
    button = document.getElementById(JST.includeId(setName));
    button.checked = true;
    maxOption.value = maxValue || 10;
  } else {
    button = document.getElementById(JST.excludeId(setName));
    button.checked = true;
    maxOption.value = 0;
    minOption.value = 0;
  }
};

CardSelectForm.prototype.includeAllExcept = function (setName) {
  this.cardList.sets.forEach(function(set) {
    if (setName != set) {
      this.includeSet(set);
    }
  }.bind(this));
};

CardSelectForm.prototype.excludeAllExcept = function (setName) {
  this.cardList.sets.forEach(function(set) {
    if (setName != set) {
      this.excludeSet(set);
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

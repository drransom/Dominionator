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
};

if (D.CardSelectForm) {
  cardSelectForm.prototype = D.CardSelectForm.prototype;
}

D.CardSelectForm = cardSelectForm;

var CardSelectForm = D.CardSelectForm;

CardSelectForm.prototype.initializeForm = function() {
  this.el.innerHTML = JST.cardForm( { sets: this.cardList.sets.sort() } );
  this.setSubmitListener();
  this.setExcludeListeners();
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

CardSelectForm.prototype.setExcludeListeners = function () {
  var excludeButtons = document.querySelectorAll('input[name=exclude-checkbox]');
  var selectForm = this;
  for (var i = 0; i < excludeButtons.length; i++) {
    excludeButtons[i].addEventListener('change', function (event) {
      var target = event.target;
      if (target.checked) {
        selectForm.excludeSet(event.target.value);
      } else {
        selectForm.includeSet(event.target.value);
      }
    });
  }
  selectForm.setAlchemyConditionListener();
};

CardSelectForm.prototype.changeSetExclusion = function (options) {
  var disabled, htmlizedName, minOption, maxOption, max;
  max = options.max;
  if (options.disabled === undefined) {
    disabled = !max;
  } else {
    disabled = options.disabled;
  }
  htmlizedName = D.htmlize(options.setName);
  minOption = document.getElementById(htmlizedName + '-min');
  maxOption = document.getElementById(htmlizedName + '-max');
  minOption.disabled = disabled;
  maxOption.disabled = disabled;
  CardSelectForm.resetValue(minOption, 0);
  CardSelectForm.resetValue(maxOption, max);
};

CardSelectForm.prototype.includeSet = function (setName, options) {
  var disabled, max;
  options = options || {};
  max = options.max || 10;
  if (options.disabled === undefined) {
    disabled = false;
  } else {
    disabled = options.disabled;
  }
  this.changeSetExclusion({setName: setName, max: max, disabled: disabled});
};

CardSelectForm.prototype.excludeSet = function (setName) {
  this.changeSetExclusion({setName: setName, max: 0});
  this.updateAlchemyBox(setName, false);
};

CardSelectForm.prototype.findMinMax = function (minOrMax) {
  var id, value, result = {};
  this.cardList.sets.forEach(function(set) {
    id = D.htmlize(set) + "-" + minOrMax;
    result[set] = document.getElementById(id).value;
  });
  return result;
};

CardSelectForm.resetValue = function (optionList, value) {
  var currentNode;
  for (var i = 0; i < optionList.childNodes.length; i++) {
    currentNode = optionList.childNodes[i];
    if (parseInt(currentNode.value) === value) {
      currentNode.selected = true;
      return;
    }
  }
};

})();

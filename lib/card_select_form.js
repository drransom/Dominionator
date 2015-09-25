;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};

var D = Dominionator;

D.CardSelectForm = function(options) {
  this.selector = options.selector;
  this.cardList = this.selector.cardList;
  this.el = options.el;
  this.shouldSetIncludeExclude = true;
  this.liObjects = [];
  this.liObjectsBySetName = {};
  this.domObjectsById = {};
};

var CardSelectForm = D.CardSelectForm;

CardSelectForm.prototype.initializeForm = function() {
  this.createForm();
  this.setLiListeners();
  this.setSubmitListener();
};

CardSelectForm.prototype.createForm = function() {
  this.createHeader();
  this.setListItems();
  this.createInputBox();
};

CardSelectForm.prototype.createHeader = function() {
  var header = D.createDOMElement('div', {
    innerHTML: "<span class='dominionator-min-max-column'>Min</span>\
    <span class='dominionator-set-column'>Set</span>\
    <span class='dominionator-min-max-column'>Max</span>\
    <span class='dominionator-include-exclude-column'>Include</span>\
    <span class='dominionator-include-exclude-column'>Exclude</span>"
  });
  D.addClass(header, 'select-form-header');
  this.el.appendChild(header);
};

CardSelectForm.prototype.setListItems = function() {
  var newLi, alchemyCheckboxLi;
  var ul = document.createElement('ul');
  D.addClass(ul, 'dominionator-select-ul');
  this.el.appendChild(ul);
  this.cardList.sets.sort().forEach(function(setName) {
    newLi = new D.CardSelectLi(setName);
    this.liObjects.push(newLi);
    ul.appendChild(newLi.el);
    if (newLi.alchemyCheckboxLi) {
      alchemyCheckboxLi = newLi.alchemyCheckboxLi;
    }
  }.bind(this));
  ul.appendChild(alchemyCheckboxLi);
};

CardSelectForm.prototype.createInputBox = function() {
  var submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('value', 'New Set');
  D.addClass(submitButton, 'dominionator-submit-button');
  this.el.appendChild(submitButton);
};

CardSelectForm.prototype.setLiListeners = function() {
  var li, selectForm = this;
  this.el.addEventListener('change', function (event) {
    var targetNode = event.target;
    var targetLi = targetNode.selectLi;
    targetLi.validateInput(targetNode, selectForm);
  });
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
    selectForm.selector.createNewGame({ minBySet: min, maxBySet: max, alchemy_min_3: alchemy_min_3});
  });
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
  li.changeSetInclusion(includeExclude);
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

;(function() {
'use strict';

window.Dominionator = window.Dominionator || {};

var D = Dominionator;

D.NewGameForm = function(options) {
  this.selector = options.selector;
  this.cardList = this.selector.cardList;
  this.el = options.el;
  this.shouldSetIncludeExclude = true;
  this.liObjects = [];
  this.liObjectsBySetName = {};
  this.domObjectsById = {};
};

var NewGameForm = D.NewGameForm;

NewGameForm.prototype.initializeForm = function() {
  this.createForm();
  this.setLiListeners();
  this.setSubmitListener();
};

NewGameForm.prototype.createForm = function() {
  this.createHeader();
  this.setListItems();
  this.createInputBox();
};

NewGameForm.prototype.createHeader = function() {
  var header = D.createDOMElement({
    type: 'div',
    attributes: {
      innerHTML: "<span class='dominionator-min-max-column'>Min</span>\
      <span class='dominionator-set-column'>Set</span>\
      <span class='dominionator-min-max-column'>Max</span>\
      <span class='dominionator-include-exclude-column'>Include</span>\
      <span class='dominionator-include-exclude-column'>Exclude</span>"
    }
  });
  D.addClass(header, 'select-form-header');
  this.el.appendChild(header);
};

NewGameForm.prototype.setListItems = function() {
  var newLi, alchemyCheckboxLi;
  var ul = D.createDOMElement({
    type: 'ul',
    classes: ['dominionator-select-ul']
  });
  this.liObjects = [];

  this.cardList.sets.sort().forEach(function(setName) {
    newLi = new D.CardSelectLi(setName);
    this.liObjects.push(newLi);
    ul.appendChild(newLi.el);
    if (newLi.alchemyCheckboxLi) {
      alchemyCheckboxLi = newLi.alchemyCheckboxLi;
    }
  }.bind(this));

  ul.appendChild(alchemyCheckboxLi);
  this.el.appendChild(ul);
};

NewGameForm.prototype.createInputBox = function() {
  var submitButton = D.createDOMElement({
    type: 'input',
    classes: ['dominionator-submit-button'],
    attributes: { 'type': 'submit', 'value': 'New Set' }
  });
  this.el.appendChild(submitButton);
};

NewGameForm.prototype.setLiListeners = function() {
  var li, selectForm = this;
  this.el.addEventListener('change', function (event) {
    var targetNode = event.target;
    var targetLi = targetNode.selectLi;
    targetLi.validateInput(targetNode, selectForm);
  });
};

NewGameForm.prototype.getDomObjectByTarget = function (target) {
  return this.domObjectsById[target.id];
};

NewGameForm.prototype.setSubmitListener = function() {
  var selectForm = this;
  this.el.addEventListener('submit', function (event) {
    event.preventDefault();
    var min = selectForm.findMinMax("min");
    var max = selectForm.findMinMax("max");
    var alchemy_min_3 = selectForm.checkAlchemyCondition();
    selectForm.selector.createNewGame({ minBySet: min, maxBySet: max, alchemy_min_3: alchemy_min_3});
  });
};

NewGameForm.prototype.includeSet = function (li) {
  if (this.shouldSetIncludeExclude) {
    this.shouldSetIncludeExclude = false;
    this.excludeAllExcept(li);
  }
  this.changeSetInclusion("include", li);
};

NewGameForm.prototype.excludeSet = function (li) {
  if (this.shouldSetIncludeExclude) {
    this.shouldSetIncludeExclude = false;
    this.includeAllExcept(li);
  }
  this.changeSetInclusion("exclude", li);
};

NewGameForm.prototype.includeAll = function () {
  var includeButtons = document.querySelectorAll('input[name=include-checkbox]');
  Array.prototype.forEach.call(includeButtons, function(includeButton) {
    this.includeSet(includeButton.setName);
  }.bind(this));
};

NewGameForm.prototype.changeSetInclusion = function (includeExclude, li) {
  li.changeSetInclusion(includeExclude);
};

NewGameForm.prototype.includeAllExcept = function (li) {
  this.liObjects.forEach(function(otherLi) {
    if (li != otherLi) {
      this.includeSet(otherLi);
    }
  }.bind(this));
};

NewGameForm.prototype.excludeAllExcept = function (li) {
  this.liObjects.forEach(function(otherLi) {
    if (otherLi != li) {
      this.excludeSet(otherLi);
    }
  }.bind(this));
};

NewGameForm.prototype.findMinMax = function (minOrMax) {
  var id, value, result = {};
  this.cardList.sets.forEach(function(set) {
    id = D.htmlize(set) + "-" + minOrMax;
    result[set] = document.getElementById(id).value;
  });
  return result;
};

})();

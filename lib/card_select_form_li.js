;(function() {

"use strict";

window.Dominionator = window.Dominionator || {};

var D = Dominionator;

D.CardSelectLi = function(setName) {
  this.setName = setName;
  this.createNode();
  this.createSelectBoxes();
  this.createIncludeExcludeBoxes();
  this.createAlchemyOptionBox();
  this.lastMin = 0;
  this.lastMax = 10;
};

var CardSelectLi = D.CardSelectLi;

CardSelectLi.prototype.createNode = function() {
  this.el = document.createElement('li');
  D.addClass(this.el, 'dominionator-select-li');
  this.el.setAttribute('id', 'dominionator-' + D.htmlize(this.setName) + '-id');
  this.groupNode = document.createElement('div');
  D.addClass(this.groupNode, 'group');
  this.el.appendChild(this.groupNode);
};

CardSelectLi.prototype.createSelectBoxes = function() {
  var minSpan, maxSpan, nameElement;
  this.minOption = this.createSelectOption("min");
  this.minOption.selectLi = this;
  minSpan = this.wrapSelector(this.minOption);
  this.maxOption = this.createSelectOption("max");
  this.maxOption.selectLi = this;
  maxSpan = this.wrapSelector(this.maxOption);
  nameElement = this.createNameElement();
  this.groupNode.appendChild(minSpan);
  this.groupNode.appendChild(nameElement);
  this.groupNode.appendChild(maxSpan);
};

CardSelectLi.prototype.createNameElement = function() {
  var nameElement = document.createElement('span');
  D.addClass(nameElement, 'dominionator-set-name');
  D.addClass(nameElement, 'dominionator-set-column');
  nameElement.innerText = (this.setName + " ");
  return nameElement;
};

CardSelectLi.prototype.createSelectOption = function(minOrMax) {
  var option;
  var optionClass = minOrMax + '-option';
  var selector = document.createElement('select');
  selector.setAttribute('id', D.htmlize(this.setName) +
                         "-" + minOrMax);
  D.addClass(selector, 'dominionator-option');
  for (var i = 0; i <= 10; i++) {
    option = document.createElement('option');
    option.setAttribute('value', i);
    option.innerText = i;
    selector.appendChild(option);
  }
  selector.value = ((minOrMax === 'min') ? 0 : 10);
  return selector;
};

CardSelectLi.prototype.wrapSelector = function(selector) {
  var span = document.createElement('span');
  D.addClass(span, 'dominionator-min-max-column');
  span.appendChild(selector);
  return span;
};

CardSelectLi.prototype.validateIncludeExclude = function() {
  if (!parseInt(this.maxOption.value) && this.includeOption.checked) {
    this.excludeOption.checked = true;
  } else if (parseInt(this.maxOption.value) && this.excludeOption.checked) {
    this.includeOption.checked = true;
  }
};

CardSelectLi.prototype.validateInput = function(targetNode, selectForm) {
  this.hasBeenSet = true;
  switch (targetNode) {
    case this.minOption:
      this.validateMax();
      this.rememberInput();
      this.validateIncludeExclude();
      break;
    case this.maxOption:
      this.validateMin();
      this.rememberInput();
      this.validateIncludeExclude();
      break;
    case this.includeOption:
      selectForm.includeSet(this);
      break;
    case this.excludeOption:
      selectForm.excludeSet(this);
      break;
    case this.alchemyCheckbox:
      this.validateAlchemy(selectForm);
  }
};

CardSelectLi.prototype.validateMax = function() {
  if (parseInt(this.maxOption.value) < parseInt(this.minOption.value)) {
    this.maxOption.value = this.minOption.value;
  }
};

CardSelectLi.prototype.validateMin = function() {
  if (parseInt(this.minOption.value) > parseInt(this.maxOption.value)) {
    this.minOption.value = this.maxOption.value;
  }
  this.validateUncheckAlchemy();
};

CardSelectLi.prototype.rememberInput = function() {
  this.lastMin = parseInt(this.minOption.value);
  this.lastMax = parseInt(this.maxOption.value);
};

CardSelectLi.prototype.changeSetInclusion = function(includeExclude) {
  if (includeExclude === "include") {
    this.includeOption.checked = true;
    this.minOption.value = this.lastMin;
    this.maxOption.value = parseInt(this.maxOption.value) || this.lastMax;
  } else {
    this.excludeOption.checked = true;
    this.maxOption.value = 0;
    this.minOption.value = 0;
  }
};

CardSelectLi.prototype.createIncludeExcludeBoxes = function() {
  var includeBoxLabel = this.createIncludeExclude('include');
  var excludeBoxLabel = this.createIncludeExclude('exclude');
  this.groupNode.appendChild(includeBoxLabel);
  this.groupNode.appendChild(excludeBoxLabel);
};

CardSelectLi.prototype.createIncludeExclude = function(includeExclude) {
  var id = "dominionator-" + D.htmlize(this.setName) + "-" + includeExclude;
  var buttonLabel = document.createElement('div');
  D.addClass(buttonLabel, 'dominionator-option');
  D.addClass(buttonLabel, 'dominionator-include-exclude-column');
  var input = document.createElement('input');
  input.setAttribute('type', 'radio');
  input.setAttribute('class', includeExclude + "-radio");
  input.setAttribute('name', this.setName);
  input.setAttribute('value', includeExclude);
  input.setAttribute('id', id);
  input.selectLi = this;
  this[includeExclude + 'Option'] = input;
  buttonLabel.appendChild(input);
  return buttonLabel;
};

})();

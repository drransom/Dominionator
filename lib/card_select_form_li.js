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
  this.el = D.createDOMElement({
    type: 'li',
    classes: ['dominionator-select-li'],
    attributes: {id: 'dominionator-' + D.htmlize(this.setName) + '-id'}
  });
  this.groupNode = D.createDOMElement({ type: 'div', classes: ['group']});
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
  return D.createDOMElement({
    type: 'span',
    classes: ['dominionator-set-name', 'dominionator-set-column'],
    attributes: { innerText: this.setName + ' ' }
  });
};

CardSelectLi.prototype.createSelectOption = function(minOrMax) {
  var option;
  var optionClass = minOrMax + '-option';
  var selector = D.createDOMElement({
    type: 'select',
    classes: ['dominionator-option'],
    attributes: {
      id: D.htmlize(this.setName) + "-" + minOrMax,
      value: (minOrMax === 'min') ? 0 : 10
    }
  });
  for (var i = 0; i <= 10; i++) {
    option = D.createDOMElement({
      type: 'option',
      attributes: {value: i, innerText: i}
    });
    selector.appendChild(option);
  }
  return selector;
};

CardSelectLi.prototype.wrapSelector = function(selector) {
  var span = D.createDOMElement({
    type: 'span',
    classes: ['dominionator-min-max-column']
  });
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
  var buttonLabel = D.createDOMElement({
    type: 'div',
    classes: ['dominionator-option', 'dominionator-include-exclude-column']
  });
  var input = D.createDOMElement({
    type: 'input',
    classes: [includeExclude + "-radio"],
    attributes: {
      type: 'radio',
      name: this.setName,
      value: includeExclude,
      id: id,
      selectLi: this
    }
  });
  this[includeExclude + 'Option'] = input;
  buttonLabel.appendChild(input);
  return buttonLabel;
};

})();

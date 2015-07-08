(function() {

"use strict";

window.Dominionator = window.Dominionator || {};

var D = Dominionator;

Dominionator.FormElement = function (node, liObject) {
  this.id = node.id;
  this.node = node;
  this.liObject = liObject;
  this.hasBeenSet = false;
};

var FormElement = D.FormElement;

var cardSelectLi = function (setName) {
  this.setName = setName;
  this.createNode();
  this.createSelectBoxes();
  this.createIncludeExcludeBoxes();
  this.createAlchemyOptionBox();
  this.lastMin = 0;
  this.lastMax = 10;
};

if (D.CardSelectLi) {
  cardSelectLi.prototype = D.CardSelectLi.prototype;
}

D.CardSelectLi = cardSelectLi;

var CardSelectLi = D.CardSelectLi;

CardSelectLi.prototype.createNode = function() {
  this.node = document.createElement('li');
  D.addClass(this.node, 'select-li');
  this.node.setAttribute('id', 'dominionator-' + D.htmlize(this.setName) + '-id');
  this.groupNode = document.createElement('div');
  D.addClass(this.groupNode, 'group');
  this.node.appendChild(this.groupNode);
};

CardSelectLi.prototype.createSelectBoxes = function() {
  this.minOption = this.createSelectOption("min");
  this.minOption.selectLi = this;
  this.maxOption = this.createSelectOption("max");
  this.maxOption.selectLi = this;
  var nameElement = document.createTextNode(this.setName);
  this.groupNode.appendChild(this.minOption);
  this.groupNode.appendChild(nameElement);
  this.groupNode.appendChild(this.maxOption);
};

CardSelectLi.prototype.createSelectOption = function (minOrMax) {
  var option;
  var optionClass = minOrMax + '-option';
  var selector = document.createElement('select');
  selector.setAttribute('id', Dominionator.htmlize(this.setName) +
                         "-" + minOrMax);
  for (var i = 0; i <= 10; i++) {
    option = document.createElement('option');
    option.setAttribute('value', i);
    option.innerHTML = i;
    selector.appendChild(option);
  }
  selector.value = ((minOrMax === 'min') ? 0 : 10);
  return selector;
};

CardSelectLi.prototype.setObjectById = function (object) {
  this.getElements().forEach(function(element) {
    object[element.id] = element;
  }.bind(this));
};

CardSelectLi.prototype.getElements = function () {
  var elements = [this.minOption, this.maxOption, this.includeOption,
                  this.excludeOption];
  if (this.alchemyCheckbox) {
    elements.push(this.alchemyCheckbox);
  }
  var nodes = [];
  elements.forEach(function(element) {
    nodes.push(new D.FormElement(element, this));
  }.bind(this));
  return nodes;
};

CardSelectLi.prototype.validateIncludeExclude = function () {
  if (!parseInt(this.maxOption.value) && this.includeOption.checked) {
    this.excludeOption.checked = true;
  } else if (parseInt(this.maxOption.value) && this.excludeOption.checked) {
    this.includeOption.checked = true;
  }
};

CardSelectLi.prototype.validateInput = function (targetNode, selectForm) {
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
  }
};

CardSelectLi.prototype.validateMax = function () {
  if (parseInt(this.maxOption.value) < parseInt(this.minOption.value)) {
    this.maxOption.value = this.minOption.value;
  }
};

CardSelectLi.prototype.validateMin = function () {
  if (parseInt(this.minOption.value) > parseInt(this.maxOption.value)) {
    this.minOption.value = this.maxOption.value;
  }
};

CardSelectLi.prototype.rememberInput = function () {
  this.lastMin = parseInt(this.minOption.value);
  this.lastMax = parseInt(this.maxOption.value);
};

CardSelectLi.prototype.changeSetInclusion = function (includeExclude) {
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

CardSelectLi.prototype.createIncludeExclude = function (includeExclude) {
  var id = "dominionator-" + Dominionator.htmlize(this.setName) + "-" + includeExclude;
  var buttonLabel = document.createElement('label');
  buttonLabel.setAttribute('for', id);
  var input = document.createElement('input');
  input.setAttribute('type', 'radio');
  input.setAttribute('class', includeExclude + "-radio");
  input.setAttribute('name', this.setName);
  input.setAttribute('value', includeExclude);
  input.setAttribute('id', id);
  input.selectLi = this;
  this[includeExclude + 'Option'] = input;
  buttonLabel.appendChild(input);
  buttonLabel.appendChild(document.createTextNode(D.htmlToTitleCase(includeExclude)));
  return buttonLabel;
};

})();

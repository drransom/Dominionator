(function() {

window.Dominionator = window.Dominionator || {};

var D = Dominionator;

Dominionator.FormElement = function (node, liObject) {
  this.id = node.id;
  this.node = node;
  this.liObject = liObject;
  this.hasBeenSet = false;
};

var FormElement = D.FormElement;

D.CardSelectLi = function (li) {
  this.li = li;
  this.lastMin = 0;
  this.lastMax = 10;
  this.assignNodesToLi();
};


var CardSelectLi = D.CardSelectLi;


CardSelectLi.prototype.assignNodesToLi = function () {
  this.setName = D.htmlToTitleCase(this.li.getAttribute('data-dominion-set'));
  this.minOption = this.li.getElementsByClassName('min-option')[0];
  this.maxOption = this.li.getElementsByClassName('max-option')[0];
  this.includeOption = this.li.getElementsByClassName('include-radio')[0];
  this.excludeOption = this.li.getElementsByClassName('exclude-radio')[0];
  this.alchemyCheckbox = this.li.getElementsByClassName('alchemy-condition-checkbox')[0];
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

})();

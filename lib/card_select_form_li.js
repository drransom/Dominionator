(function() {

window.Dominionator = window.Dominionator || {};

var D = Dominionator;

Dominionator.FormElement = function (node, liObject) {
  this.id = node.id;
  this.node = node;
  this.liObject = liObject;
};

var FormElement = D.FormElement;

D.CardSelectLi = function (li) {
  this.li = li;
  this.assignNodesToLi();
  this.assignLiToNodes();
};

D.CardSelectLi.setAttribute = function(attribute, value) {
  this.node[attribute] = value;
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

CardSelectLi.prototype.assignLiToNodes = function () {
  this.minOption.li = this;
  this.maxOption.li = this;
  this.includeOption.li = this;
  this.excludeOption.li = this;
  if (this.alchemyCheckbox) {
    this.alchemyCheckbox.li = this;
  }
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


})();

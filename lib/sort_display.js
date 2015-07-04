(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.SortDisplay = function (cardSelector) {
  this.cardSelector = cardSelector;
  this.template = JST.sortBoxes;
  this.el = document.getElementById('sort-form');
  this.properties = [['name', 'Card Name'], ['set', 'Set Name'],
                    ['cost', 'Cost']];
  this.currentProperties = ['name', 'set', 'cost'];
  this.setListeners();
  this.sortOrder = [];
};

var SortDisplay = Dominionator.SortDisplay;

SortDisplay.prototype.render = function () {
  this.el.innerHTML = this.template({sortProperties: this.properties});

};

SortDisplay.prototype.setListeners = function () {
  this.el.addEventListener('change', this.updateSort());
};

SortDisplay.prototype.updateSort = function() {
  var sortDisplay = this;
  return function (event) {
    var sortOptions = Dominionator.optionsFormToArray(event.target.form);
    var indexOfCurrent = Array.prototype.indexOf.call(sortDisplay.el.elements, event.target);
    var otherIndex = Dominionator.otherIndexOfValue(sortDisplay.el.elements,
                                                   event.target.value,
                                                   indexOfCurrent);
    sortDisplay.swapDisplayedProperties(indexOfCurrent, otherIndex);
    sortDisplay.cardSelector.updateSort(sortOptions);
  };

};

SortDisplay.prototype.swapDisplayedProperties = function (index1, index2) {
  var elements = this.el.elements;
  var value1 = this.currentProperties[index1];
  elements[index2].value = value1;
  this.currentProperties[index2] = value1;
  this.currentProperties[index1] = elements[index1].value;
};

SortDisplay.prototype.pullSortOrder = function() {
  return this.currentProperties;
};



})();

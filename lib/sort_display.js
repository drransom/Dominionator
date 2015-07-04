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
  var selector = this.cardSelector;
  return function (event) {
    var sortOptions = Dominionator.optionsFormToArray(event.target.form);
    sortOptions.push("name");
    selector.updateSort(sortOptions);
  };

};




})();

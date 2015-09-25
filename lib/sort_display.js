;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.SortDisplay = function(cardSelector) {
  this.cardSelector = cardSelector;
  this.el = document.getElementById('dominionator-sort-form');
  this.properties = [['name', 'Card Name'], ['set', 'Set Name'],
                    ['cost', 'Cost']];
  this.currentProperties = ['name', 'set', 'cost'];
  this.setListeners();
  this.sortOrder = [];
};

var SortDisplay = D.SortDisplay;

SortDisplay.prototype.render = function() {
  var list = this.createUl();
  this.constructListItems(list);
};

SortDisplay.prototype.createUl = function() {
  var list = D.createDOMElement({
    type: 'ul',
    attributes: { id: 'dominionator-sort-boxes' }
  });
  this.el.appendChild(list);
  return list;
};

SortDisplay.prototype.constructListItems = function(list) {
  var li, selectBox;
  for (var i = 0; i < 3; i++) {
    li = SortDisplay.createLi(i);
    selectBox = this.createSelectBox(i);
    li.appendChild(selectBox);
    list.appendChild(li);
  }
};

SortDisplay.createLi = function(num) {
  var li = document.createElement('li');
  var div = D.createDOMElement({
    type: 'div',
    attributes: {innerText: num ? 'then by' : 'Sort by:' }
  });
  li.appendChild(div);
  return li;
};

SortDisplay.prototype.createSelectBox = function(num) {
  var option;
  var select = D.createDOMElement({
    type: 'select',
    attributes: { id: 'dominionator-sort-' + num }
  });
  // select.setAttribute('id', 'dominionator-sort-' + num);
  for (var i = 0; i < this.properties.length; i++) {
    option = D.createDOMElement({
      type: 'option',
      attributes: {
        value: this.properties[i][0],
        innerText: this.properties[i][1]
      }
    });
    // option.setAttribute('value', this.properties[i][0]);
    if (num === i) {
      option.setAttribute('selected', true);
    }
    // option.innerHTML = this.properties[i][1];
    select.appendChild(option);
  }
  return select;
};

SortDisplay.prototype.setListeners = function() {
  this.el.addEventListener('change', this.updateSort());
};

SortDisplay.prototype.updateSort = function() {
  var sortDisplay = this;
  return function(event) {
    var sortOptions = D.optionsFormToArray(event.target.form);
    var indexOfCurrent = Array.prototype.indexOf.call(sortDisplay.el.elements, event.target);
    var otherIndex = D.otherIndexOfValue(sortDisplay.el.elements,
                                                   event.target.value,
                                                   indexOfCurrent);
    sortDisplay.swapDisplayedProperties(indexOfCurrent, otherIndex);
    sortDisplay.cardSelector.updateSort(sortOptions);
  };

};

SortDisplay.prototype.swapDisplayedProperties = function(index1, index2) {
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

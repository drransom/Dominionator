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
  var list = this.createUl();
  this.constructListItems(list);
};

SortDisplay.prototype.createUl = function() {
  var list = document.createElement('ul');
  list.setAttribute('id', 'dominionator-sort-boxes');
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
  var div = document.createElement('div');
  div.innerHTML = (num ? "then by:" : "Sort by:");
  li.appendChild(div);
  return li;
};

SortDisplay.prototype.createSelectBox = function(num) {
  var option, select = document.createElement('select');
  select.setAttribute('id', 'dominionator-sort-' + num);
  for (var i = 0; i < this.properties.length; i++) {
    option = document.createElement('option');
    option.setAttribute('value', this.properties[i][0]);
    if (num === i) {
      option.setAttribute('selected', true);
    }
    option.innerHTML = this.properties[i][1];
    select.appendChild(option);
  }
  return select;
};

var sortTemplateString = "\
  <ul id='dominionatr-sort-boxes'>\
    <% for (var i = 0; i < 3; i++) { %>\
      <li><div><%= JST.sortText(i) %></div>\
      <select id='sort-<%= i %>'>\
        <% for (var j = 0; j < sortProperties.length; j++) { %>\
          <option value='<%= sortProperties[j][0] %>' <%= JST.selectedText(i, j) %>>\
          <%= sortProperties[j][1] %></option>\
        <% } %>\
      </select></li>\
    <% } %>\
  </ul>";


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

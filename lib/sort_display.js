import {Helpers} from './helpers.js';

class SortDisplay {
  constructor(cardSelector) {
    this.cardSelector = cardSelector;
    this.el = document.getElementById('dominionator-sort-form');
    this.properties = [['name', 'Card Name'], ['set', 'Set Name'],
                      ['cost', 'Cost']];
    this.currentProperties = ['name', 'set', 'cost'];
    this.setListeners();
    this.sortOrder = [];
  }


  render() {
    let list = this.createUl();
    this.constructListItems(list);
  }

  createUl() {
    let list = Helpers.createDOMElement({
      type: 'ul',
      attributes: { id: 'dominionator-sort-boxes' }
    });
    this.el.appendChild(list);
    return list;
  };

  constructListItems(list) {
    let li, selectBox;
    for (let i = 0; i < 3; i++) {
      li = SortDisplay.createLi(i);
      selectBox = this.createSelectBox(i);
      li.appendChild(selectBox);
      list.appendChild(li);
    }
  };

  static createLi(num) {
    let li = document.createElement('li');
    let div = Helpers.createDOMElement({
      type: 'div',
      attributes: {innerText: num ? 'then by' : 'Sort by:' }
    });
    li.appendChild(div);
    return li;
  }

  createSelectBox(num) {
    let option;
    let select = Helpers.createDOMElement({
      type: 'select',
      attributes: { id: 'dominionator-sort-' + num }
    });
    // select.setAttribute('id', 'dominionator-sort-' + num);
    for (let i = 0; i < this.properties.length; i++) {
      option = Helpers.createDOMElement({
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
  }

  setListeners() {
    this.el.addEventListener('change', this.updateSort());
  }

  updateSort() {
    let sortDisplay = this;
    return function(event) {
      let sortOptions = Helpers.optionsFormToArray(event.target.form);
      let indexOfCurrent = Array.prototype.indexOf.call(sortDisplay.el.elements, event.target);
      let otherIndex = Helpers.otherIndexOfValue(sortDisplay.el.elements,
                                                     event.target.value,
                                                     indexOfCurrent);
      sortDisplay.swapDisplayedProperties(indexOfCurrent, otherIndex);
      sortDisplay.cardSelector.updateSort(sortOptions);
    };

  }

  swapDisplayedProperties(index1, index2) {
    let elements = this.el.elements;
    let value1 = this.currentProperties[index1];
    elements[index2].value = value1;
    this.currentProperties[index2] = value1;
    this.currentProperties[index1] = elements[index1].value;
  }

  pullSortOrder() {
    return this.currentProperties;
  }
};

export {SortDisplay};

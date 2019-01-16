import {Helpers} from './helpers.js';
window.Dominionator = window.Dominionator || {};

var D = Dominionator;

class CardSelectLi {
  constructor(setName) {
    this.setName = setName;
    this.createNode();
    this.createSelectBoxes();
    this.createIncludeExcludeBoxes();
    this.createAlchemyOptionBox();
    this.lastMin = 0;
    this.lastMax = 10;
  }

  createNode() {
    this.el = Helpers.createDOMElement({
      type: 'li',
      classes: ['dominionator-select-li'],
      attributes: {id: 'dominionator-' + Helpers.htmlize(this.setName) + '-id'}
    });
    this.groupNode = Helpers.createDOMElement({ type: 'div', classes: ['group']});
    this.el.appendChild(this.groupNode);
  }

  createSelectBoxes() {
    this.minOption = this.createSelectOption("min");
    this.minOption.selectLi = this;
    let minSpan = this.wrapSelector(this.minOption);
    this.maxOption = this.createSelectOption("max");
    this.maxOption.selectLi = this;
    let maxSpan = this.wrapSelector(this.maxOption);
    let nameElement = this.createNameElement();
    this.groupNode.appendChild(minSpan);
    this.groupNode.appendChild(nameElement);
    this.groupNode.appendChild(maxSpan);
  }

  createNameElement() {
    return Helpers.createDOMElement({
      type: 'span',
      classes: ['dominionator-set-name', 'dominionator-set-column'],
      attributes: { innerText: this.setName + ' ' }
    });
  }

  createSelectOption(minOrMax) {
    let optionClass = minOrMax + '-option';
    let selector = Helpers.createDOMElement({
      type: 'select',
      classes: ['dominionator-option'],
      attributes: { id: Helpers.htmlize(this.setName) + '-' + minOrMax }
    });
    for (let i = 0; i <= 10; i++) {
      let option = Helpers.createDOMElement({
        type: 'option',
        attributes: {innerText: i}
      });
      selector.appendChild(option);
    }
    selector.value = (minOrMax === 'min') ? 0 : 10;
    return selector;
  }

  wrapSelector(selector) {
    let span = Helpers.createDOMElement({
      type: 'span',
      classes: ['dominionator-min-max-column']
    });
    span.appendChild(selector);
    return span;
  }

  validateIncludeExclude() {
    if (!parseInt(this.maxOption.value) && this.includeOption.checked) {
      this.excludeOption.checked = true;
    } else if (parseInt(this.maxOption.value) && this.excludeOption.checked) {
      this.includeOption.checked = true;
    }
  }

  validateInput(targetNode, selectForm) {
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
  }

  validateMax() {
    if (parseInt(this.maxOption.value) < parseInt(this.minOption.value)) {
      this.maxOption.value = this.minOption.value;
    }
  }

  validateMin() {
    if (parseInt(this.minOption.value) > parseInt(this.maxOption.value)) {
      this.minOption.value = this.maxOption.value;
    }
    this.validateUncheckAlchemy();
  }

  rememberInput() {
    this.lastMin = parseInt(this.minOption.value);
    this.lastMax = parseInt(this.maxOption.value);
  }

  changeSetInclusion(includeExclude) {
    if (includeExclude === "include") {
      this.includeOption.checked = true;
      this.minOption.value = this.lastMin;
      this.maxOption.value = parseInt(this.maxOption.value) || this.lastMax;
    } else {
      this.excludeOption.checked = true;
      this.maxOption.value = 0;
      this.minOption.value = 0;
    }
  }

  createIncludeExcludeBoxes() {
    let includeBoxLabel = this.createIncludeExclude('include');
    let excludeBoxLabel = this.createIncludeExclude('exclude');
    this.groupNode.appendChild(includeBoxLabel);
    this.groupNode.appendChild(excludeBoxLabel);
  }

  createIncludeExclude(includeExclude) {
    let id = "dominionator-" + Helpers.htmlize(this.setName) + "-" + includeExclude;
    let buttonLabel = Helpers.createDOMElement({
      type: 'div',
      classes: ['dominionator-option', 'dominionator-include-exclude-column']
    });
    let input = Helpers.createDOMElement({
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
  }

  createAlchemyOptionBox() {
    if (this.setName === "Alchemy") {
      let id = 'dominionator-alchemy-condition-checkbox';
      let newLi = Helpers.createDOMElement({
        type: 'li',
        classes: ['alchemy-condition-li']
      });
      let label = Helpers.createDOMElement({
        type: 'label',
        attributes: {
          for: id,
          innerText: "Require at least three Alchemy cards if any are chosen."
        }
      });
      let input = Helpers.createDOMElement({
        type: 'input',
        classes: [id],
        attributes: {
          type: 'checkbox',
          id: id,
          selectLi: this
        }
      });
      label.insertBefore(input, label.firstChild);
      newLi.appendChild(label);
      this.alchemyCheckbox = input;
      this.alchemyCheckboxLi = newLi;
    }
  };

  validateAlchemy() {
    let max = parseInt(this.maxOption.value);
    if (this.alchemyCheckbox.checked && max) {
      this.maxOption.value = Math.max(max, 3);
      this.rememberInput();
    }
  };

  validateUncheckAlchemy() {
    if (this.alchemyCheckbox && parseInt(this.maxOption.value) < 3) {
      this.alchemyCheckbox.checked = false;
    }
  };
};

D.CarSelectLi = CardSelectLi;
export {CardSelectLi};

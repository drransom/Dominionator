window.Dominionator = window.Dominionator || {};

var D = Dominionator;

class NewGameForm {
  constructor(options) {
    this.selector = options.selector;
    this.cardList = this.selector.cardList;
    this.el = options.el;
    this.shouldSetIncludeExclude = true;
    this.liObjects = [];
    this.liObjectsBySetName = {};
    this.domObjectsById = {};
  }

  initializeForm() {
    this.createForm();
    this.setLiListeners();
    this.setSubmitListener();
  }

  createForm() {
    this.createHeader();
    this.setListItems();
    this.createInputBox();
  }

  createHeader() {
    let header = D.createDOMElement({
      type: 'div',
      attributes: {
        innerHTML: "<span class='dominionator-min-max-column'>Min</span>\
        <span class='dominionator-set-column'>Set</span>\
        <span class='dominionator-min-max-column'>Max</span>\
        <span class='dominionator-include-exclude-column'>Include</span>\
        <span class='dominionator-include-exclude-column'>Exclude</span>"
      }
    });
    D.addClass(header, 'select-form-header');
    this.el.appendChild(header);
  }

  setListItems() {
    let alchemyCheckboxLi;
    let ul = D.createDOMElement({
      type: 'ul',
      classes: ['dominionator-select-ul', 'standard-left-margin-padding']
    });
    this.liObjects = [];
    this.el.appendChild(ul);

    this.cardList.sets.sort().forEach((setName) => {
      let newLi = new D.CardSelectLi(setName);
      this.liObjects.push(newLi);
      ul.appendChild(newLi.el);
      if (newLi.alchemyCheckboxLi) {
        alchemyCheckboxLi = newLi.alchemyCheckboxLi;
      }
    });

    ul.appendChild(alchemyCheckboxLi);
  }

  createInputBox() {
    let submitButton = D.createDOMElement({
      type: 'input',
      classes: ['dominionator-submit-button'],
      attributes: { 'type': 'submit', 'value': 'New Set' }
    });
    this.el.appendChild(submitButton);
  }

  setLiListeners() {
    var selectForm = this;
    this.el.addEventListener('change', (event) => {
      var targetNode = event.target;
      var targetLi = targetNode.selectLi;
      targetLi.validateInput(targetNode, selectForm);
    });
  }

  getDomObjectByTarget(target) {
    return this.domObjectsById[target.id];
  }

  setSubmitListener() {
    let selectForm = this;
    this.el.addEventListener('submit', (event) => {
      event.preventDefault();
      let min = selectForm.findMinMax("min");
      let max = selectForm.findMinMax("max");
      let alchemy_min_3 = selectForm.checkAlchemyCondition();
      selectForm.selector.createNewGame({ minBySet: min, maxBySet: max, alchemy_min_3: alchemy_min_3});
    });
  }

  includeSet(li) {
    if (this.shouldSetIncludeExclude) {
      this.shouldSetIncludeExclude = false;
      this.excludeAllExcept(li);
    }
    this.changeSetInclusion("include", li);
  }

  excludeSet(li) {
    if (this.shouldSetIncludeExclude) {
      this.shouldSetIncludeExclude = false;
      this.includeAllExcept(li);
    }
    this.changeSetInclusion("exclude", li);
  }

  includeAll() {
    let includeButtons = document.querySelectorAll('input[name=include-checkbox]');
    Array.prototype.forEach.call(includeButtons, (includeButton) => {
      this.includeSet(includeButton.setName);
    });
  }

  changeSetInclusion(includeExclude, li) {
    li.changeSetInclusion(includeExclude);
  }

  includeAllExcept(li) {
    this.liObjects.forEach((otherLi) => {
      if (li != otherLi) {
        this.includeSet(otherLi);
      }
    });
  }

  excludeAllExcept(li) {
    this.liObjects.forEach((otherLi) => {
      if (otherLi != li) {
        this.excludeSet(otherLi);
      }
    });
  }

  findMinMax(minOrMax) {
    let result = {};
    this.cardList.sets.forEach((set) => {
      let id = D.htmlize(set) + "-" + minOrMax;
      result[set] = document.getElementById(id).value;
    });
    return result;
  }
};

Dominionator.NewGameForm = NewGameForm;
export { NewGameForm };

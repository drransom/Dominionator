import {Helpers} from './helpers.js';
import {Transitions} from './dominionator_transitions.js';

class CardDisplay{
  constructor(options) {
    this.card = options.card;
    this.gameDisplay = options.gameDisplay;
    this.selector = options.selector;
    if (this.card.isPotionCard()) {
      this.potionImg = options.potionImg.cloneNode();
    }
    this.constructNode();
    this.attachDisplayToNodes();
    this.card.setDisplay(this);
  }
  idHtml() {
    return "dominionator-card-" + this.card.id;
  }

  nameIdHtml() {
    return "dominionator-card-name-" + this.card.id;
  }

  constructNode() {
    var li  = Helpers.createDOMElement({
      type: 'li',
      attributes: {id: this.idHtml()}
    });
    this.el = li;

    this.createTextSpan();
    this.el.appendChild(this.textSpanElement);
    this.createCardAttributes();

    this.vetoButtonElement = this.createVetoButton();
    this.el.appendChild(this.vetoButtonElement);

    this.hide({default: true});
  }

  createTextSpan() {
    this.textSpanElement = Helpers.createDOMElement({
      type: 'span',
      classes: ['dominionator-card-name'],
      attributes: {
        id: this.nameIdHtml(),
        innerHTML: this.selector.constructCardName(this.card)
      }
    });
  }

  createCardAttributes() {
    this.addCost();
    this.el.insertAdjacentHTML('beforeend',
      "<span class='dominionator-set-name'>" + this.card.set + "</span>");
  }

  addCost() {
    let costSpanElement = document.createElement('span');
    this.addNumCost(costSpanElement);
    this.addPotionCost(costSpanElement);
    this.el.appendChild(costSpanElement);
  }

  addNumCost(costSpanElement) {
    let costString;
    if (!this.card.hasCost()) {
      return;
    }
    if (this.card.hasZeroCost()) {
      costString = "0";
    } else {
      let coinCost = this.card.getCoinCost();
      let debtCost = this.card.getDebtCost();
      costString = "";
      if (coinCost) {
        costString += coinCost;
      }
      if (costString && debtCost) {
        costString += " ";
      }
      if (debtCost) {
        costString += debtCost + 'D';
      }
    }

    let costElement = Helpers.createDOMElement({
      type: 'span',
      attributes: {innerText: costString},
      classes: ['dominionator-card-cost-num']
    });

    if (!this.card.isPotionCard()) {
      Helpers.addClass(costElement, 'dominionator-card-cost-num-no-img');
    }

    costSpanElement.appendChild(costElement);
  }

  addPotionCost(costSpanElement) {
    if (this.card.isPotionCard()) {
      if (this.card.getCoinCost() === 0) {
        Helpers.addClass(this.potionImg, 'dominionator-potion-img-no-text');
      }
      costSpanElement.appendChild(this.potionImg);
    }
  }

  createVetoButton() {
    return Helpers.createDOMElement({
      type: 'button',
      classes: ['veto-button', 'dominionator-veto'],
      attributes: {
        id: 'dominionator-veto-button-' + this.card.id,
        innerText: 'Veto'
      }
    });
  }

  attachDisplayToNodes() {
    this.textSpanElement.cardDisplay = this;
    this.vetoButtonElement.cardDisplay = this;
    this.card.cardDisplay = this;
  }

  updateDisplay(game) {
    this.updateHiddenStatus(game);
    if (!this.isHidden) {
      this.textSpanElement.innerHTML = this.constructCardHTML(game);
    }
  }

  constructCardHTML(game) {
    let text = this.card.constructCardName(game);
    if (this.card.hasExtraCards()) {
      text += '<br><small>(with ' + this.card.extraPile + ')</small>';
    }
    return text;
  }

  hide(options) {
    if (!this.isHidden && options && options.default !== undefined &&
        !options.default) {
      this.slideRight();
    } else {
      this.slideLeft();
    }
    this.isHidden = true;
  }

  unhide(options) {
    if ((this.isHidden || this.isHidden === undefined) && options &&
        options.default !== undefined && !options.default) {
      this.unhideRight();
    } else {
      this.removeHiddenClasses();
    }
    this.isHidden = false;
  }

  unhideRight() {
    let display = this;
    this.teleportRight();
    window.setTimeout(() => { display.removeHiddenClasses(); }, 100);
  }

  removeHiddenClasses() {
    Helpers.removeClass(this.el, "slideLeft");
    Helpers.removeClass(this.el, "slideRight");
  }

  teleportLeft() {
    this.teleport("left");
  }

  teleportRight(callback) {
    this.teleport("right");
  }

  teleport(direction) {
    Helpers.addClass(this.el, "noMove");
    Helpers.removeClass(this.el, (direction === "right" ? "slideLeft" : "slideRight"));
    Helpers.addClass(this.el, (direction === "right" ? "slideRight" : "slideLeft"));
    Helpers.removeClass(this.el, "noMove");
  }

  slideLeft() {
    Helpers.removeClass(this.el, "slideRight");
    Helpers.removeClass(this.el, "noMove");
    Helpers.addClass(this.el, "slideLeft");
  }

  slideRight() {
    let el = this.el;
    Transitions.addTransitionEvent(el, this.teleportLeft.bind(this));
    Helpers.removeClass(el, "slideLeft");
    Helpers.removeClass(el, "noMove");
    Helpers.addClass(el, "slideRight");
  }

  processRemoval(options) {
    this.hide(options);
  }

  updateHiddenStatus(game) {
    if (game.includesCard(this.card)) {
      this.unhide({default: true});
    } else if (!this.isHidden) {
      this.hide({default: false});
    } else {
      this.hide({default: true});
    }
  }
}

export {CardDisplay};

;(function() {
'use strict';

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.CardDisplay = class CardDisplay{
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
    var li  = D.createDOMElement({
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
    this.textSpanElement = D.createDOMElement({
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
    var costSpanElement = document.createElement('span');
    this.addNumCost(costSpanElement);
    this.addPotionCost(costSpanElement);
    this.el.appendChild(costSpanElement);
  }

  addNumCost(costSpanElement) {
    var costString;
    if (!this.card.hasCost()) {
      return;
    }
    if (this.card.hasZeroCost()) {
      costString = "0";
    } else {
      var coinCost = this.card.getCoinCost();
      var debtCost = this.card.getDebtCost();
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
    var costElement = D.createDOMElement({
      type: 'span',
      attributes: {innerText: costString},
      classes: ['dominionator-card-cost-num']
    });

    if (!this.card.isPotionCard()) {
      D.addClass(costElement, 'dominionator-card-cost-num-no-img');
    }

    costSpanElement.appendChild(costElement);
  }

  addPotionCost(costSpanElement) {
    if (this.card.isPotionCard()) {
      if (this.card.getCoinCost() === 0) {
        D.addClass(this.potionImg, 'dominionator-potion-img-no-text');
      }
      costSpanElement.appendChild(this.potionImg);
    }
  }

  createVetoButton() {
    var buttonElement = D.createDOMElement({
      type: 'button',
      classes: ['veto-button', 'dominionator-veto'],
      attributes: {
        id: 'dominionator-veto-button-' + this.card.id,
        innerText: 'Veto'
      }
    });
    return buttonElement;
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
    var text = this.card.constructCardName(game);
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
    var display = this;
    this.teleportRight();
    window.setTimeout(function () {
        display.removeHiddenClasses();
      },
      100
    );
  }

  removeHiddenClasses() {
    D.removeClass(this.el, "slideLeft");
    D.removeClass(this.el, "slideRight");
  }

  teleportLeft() {
    this.teleport("left");
  }

  teleportRight(callback) {
    this.teleport("right");
  }

  teleport(direction) {
    D.addClass(this.el, "noMove");
    D.removeClass(this.el, (direction === "right" ? "slideLeft" : "slideRight"));
    D.addClass(this.el, (direction === "right" ? "slideRight" : "slideLeft"));
    D.removeClass(this.el, "noMove");
  }

  slideLeft() {
    D.removeClass(this.el, "slideRight");
    D.removeClass(this.el, "noMove");
    D.addClass(this.el, "slideLeft");
  }

  slideRight() {
    var el = this.el;
    D.addTransitionEvent(el, this.teleportLeft.bind(this));
    D.removeClass(this.el, "slideLeft");
    D.removeClass(this.el, "noMove");
    D.addClass(this.el, "slideRight");
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

var CardDisplay = D.CardDisplay;

})();

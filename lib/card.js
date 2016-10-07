;(function() {
"use strict";
window.Dominionator = window.Dominionator || {};
let D = Dominionator;

Dominionator.Card = class Card {
  constructor(object) {
    for (let property of Object.keys(object)) {
      this.setProperty(object, property);
    }
    this.cost = new D.Cost(object);
  }

  static constructCard(object) {
    if (object.set === "Alchemy") {
      return new D.AlchemyCard(object);
    } else {
      return new Card(object);
    }
  }

  static constructProperty(object, property) {
    let value, currentVal = object[property];
    if (currentVal === 'N') {
      value = false;
    } else if (currentVal === 'Y') {
      value = true;
    } else if (property === 'name') {
      value = D.titleCase(currentVal);
    } else {
      value = currentVal;
    }
    return value;
  }

  setProperty(object, property) {
    if (property !== 'cost'
        && property !== 'debtCost'
        && property !== 'potionCost') {
      this[property] = Card.constructProperty(object, property);
    }
  }

  isPotionCard() {
    return this.cost.potion;
  }

  compareCost(otherCard) {
    return this.cost.compareCost(otherCard.cost);
  }

  costString() {
    return this.cost.costString();
  }

  getCoinCost() {
    return this.cost.coinCost;
  }

  getDebtCost() {
    return this.cost.debtCost;
  }

  hasZeroCost() {
    return this.cost.isZero();
  }

  kingdomCompare(otherCard, kingdom) {
    if (this.set === kingdom) {
      if (otherCard.kingdom === kingdom) {
        return 0;
      } else {
        return 1;
      }
    } else if (otherCard.kingdom === kingdom) {
      return -1;
    } else {
      return 0;
    }
  }

  processRemoval(game) {
    this.checkAndRemoveYoungWitchAndBane(game);
    this.cardDisplay.processRemoval({default: false});
  }

  constructCardName(game) {
    game = game || {};
    let name = this.name;
    if (this === game.bane) {
      name += " (bane)";
    }
    return name;
  }

  hasExtraCards() {
    return (this.extraPile && this.extraPile != 'Bane');
  }

  hide(options) {
    this.cardDisplay.hide(options);
  }

  unhide(options) {
    this.cardDisplay.unhide(options);
  }

  addToSelected(options) {
    this.unhide(options.direction);
    options.selectedCards.push(this);
  }

  setDisplay(cardDisplay) {
    this.cardDisplay = cardDisplay;
  }

  el() {
    return this.cardDisplay.el;
  }

  updateCardDisplay(game) {
    this.cardDisplay.updateDisplay(game);
  }

  hasCost() {
    return !this.cost.isNull();
  }
};
})();

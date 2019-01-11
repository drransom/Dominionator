window.Dominionator = window.Dominionator || {};
let D = Dominionator;

class Card {
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

  processUnveto(game) {
    this.unhide({default: false});
    this.checkYoungWitchUnveto(game);
    this.updateCardDisplay(game);
  };

  removeThroughUnveto(game) {
    this.hide({default: true});
    this.checkToRemoveBane(game);
  }

  checkAndRemoveYoungWitchAndBane(game) {
    if (this.isYoungWitch()) {
      game.removeBaneCard();
    } else if (this === game.bane) {
      game.addReplacementBaneCard();
      game.currentCards.push(this);
    }
  };

  isYoungWitch() {
    return (this.name === "Young Witch");
  };

  meetsBaneCost() {
    return !this.isPotionCard() && this.cost.getCoinCost() >= 2 && this.cost.getCoinCost() <= 3;
  };

  checkYoungWitchUnveto(game) {
    if (this.isYoungWitch()) {
      game.unvetoBane();
    }
  };

  checkToRemoveBane(game) {
    if (this.isYoungWitch()) {
      game.removeBaneCard(true);
    }
  }
};
export { Card };

;(function() {
  "use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.Card = function(object) {
  var value, currentVal, property;
  for (property in object) {
    if (object.hasOwnProperty(property)) {
      this[property] = Card.constructProperty(object, property);
    }
  }
};

var Card = D.Card;

Card.constructCard = function(object) {
  if (object.set === "Alchemy") {
    return new D.AlchemyCard(object);
  } else {
    return new Card(object);
  }
};

Card.constructProperty = function(object, property) {
  var value, currentVal = object[property];
  if (currentVal === 'N') {
    value = false;
  } else if (currentVal === 'Y') {
    value = true;
  } else if (property === 'cost') {
    value = new D.Cost(object.cost);
  } else if (property === 'name') {
    value = D.titleCase(currentVal);
  } else {
    value = currentVal;
  }
  return value;
};

Card.prototype.isPotionCard = function() {
  return this.cost.potion;
};


Card.prototype.compareCost = function(otherCard) {
  return this.cost.compareCost(otherCard.cost);
};

Card.prototype.costString = function() {
  return this.cost.costString();
};

Card.prototype.kingdomCompare = function(otherCard, kingdom) {
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
};

Card.prototype.processRemoval = function(game) {
  this.checkAndRemoveYoungWitchAndBane(game);
  this.cardDisplay.processRemoval({default: false});
};

Card.prototype.constructCardName = function(game) {
  game = game || {};
  var name = this.name;
  if (this.extraPile && this.extraPile != "Bane") {
    name += " (with " + this.extraPile + ")";
  }
  if (this === game.bane) {
    name += " (bane)";
  }
  return name;
};

Card.prototype.hide = function(options) {
  this.cardDisplay.hide(options);
};

Card.prototype.unhide = function(options) {
  this.cardDisplay.unhide(options);
};

Card.prototype.addToSelected = function(options) {
  this.unhide(options.direction);
  options.selectedCards.push(this);
};

Card.prototype.setDisplay = function(cardDisplay) {
  this.cardDisplay = cardDisplay;
};

Card.prototype.node = function() {
  return this.cardDisplay.node;
};

Card.prototype.updateCardDisplay = function(game) {
  this.cardDisplay.updateDisplay(game);
};

})();

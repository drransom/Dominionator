(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

var card = function  (object) {
  var value, currentVal;
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      this[property] = Card.constructProperty(object, property);
    }
  }
};

if (Dominionator.Card) {
  var surrogate = Dominionator.Card;
  card.prototype = surrogate.prototype;
}

Dominionator.Card = card;
var Card = Dominionator.Card;

Card.constructCard = function (object) {
  if (object.set === "Alchemy") {
    return new Dominionator.AlchemyCard(object);
  } else {
    return new Card(object);
  }
};

Card.prototype.isPotionCard = function () {
  return this.cost.potion;
};

Card.prototype.idHtml = function () {
  return "domininionator-card-" + this.id;
};

Card.prototype.nameIdHtml = function () {
  return "dominionator-card-name-" + this.id;
};

Card.constructProperty = function(object, property) {
  var value, currentVal = object[property];
  if (currentVal === 'N') {
    value = false;
  } else if (currentVal === 'Y') {
    value = true;
  } else if (property === 'cost') {
    value = new Dominionator.Cost(object.cost);
  } else if (property === 'name') {
    value = Dominionator.titleCase(currentVal);
  } else {
    value = currentVal;
  }
  return value;
};

Card.prototype.compareCost = function(otherCard) {
  return this.cost.compareCost(otherCard.cost);
};

Card.prototype.costString = function () {
  return this.cost.costString();
};

Card.prototype.kingdomCompare = function (otherCard, kingdom) {
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

Card.prototype.processRemoval = function (game) {
  this.checkAndRemoveYoungWitchAndBane(game);
  this.hide();
};

Card.prototype.constructCardName = function (game) {
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

Card.prototype.hide = function () {
  this.bane = false;
  this.hidden = "slideLeft";
};

Card.prototype.unhide = function () {
  this.hidden = "";
};

Card.prototype.addToSelected = function (options) {
  this.bane = options.bane || false;
  this.unhide();
  options.selectedCards.push(this);
};

Card.prototype.setDisplay = function (cardDisplay) {
  this.cardDisplay = cardDisplay;
};

Card.prototype.template = function() {
  return this.cardDisplay.template();
};

Card.prototype.node = function() {
  return this.cardDisplay.node;
};

Card.prototype.updateCardDisplay = function(game) {
  this.cardDisplay.updateDisplay(game);
};

})();

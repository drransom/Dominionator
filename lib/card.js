(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.Card = function (object) {
  var value, currentVal;
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      this[property] = Card.constructProperty(object, property);
    }
  }
};

var Card = Dominionator.Card;

Card.prototype.isPotionCard = function () {
  return this.cost.potion;
};

Card.prototype.idHtml = function () {
  return "card-" + this.id;
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

Card.prototype.meetsBaneCost = function () {
  return !this.isPotionCard() && this.cost.num >= 3 && this.cost.num <= 4;
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

Card.prototype.isYoungWitch = function () {
  return (this.name === "Young Witch");
};

Card.prototype.processRemoval = function (cardSelector) {
  if (this.isYoungWitch()) {
    cardSelector.removeBaneCard();
  } else if (this.bane) {
    this.bane = false;
    cardSelector.addBaneCard();
    cardSelector.currentCards.push(this);
  }

};


})();

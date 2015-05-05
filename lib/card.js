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

})();

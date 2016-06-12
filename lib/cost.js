;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.Cost = function(object) {
  this.coinCost = object.cost === "N" ? null : object.cost;
  this.potion = object.potionCost ? "P" : "";
  this.debtCost = object.debtCost === "N" ? null : object.debtCost;
};

var Cost = D.Cost;

Cost.prototype.compareCost = function(other) {
  thisNumCost = Math.max([this.coinCost, this.debtCost]);
  otherNumCost = Math.max([other.coinCost, other.debtCost]);
  if (thisNumCost > otherNumCost) {
    return 1;
  } else if (thisNumCost == otherNumCost) {
    return this.compareByPotion(other);
  } else {
    return -1;
  }
};

Cost.prototype.compareByPotion = function(other) {
  if (this.potion === other.potion) {
    return 0;
  } else if (this.potion) {
    return 1;  //potion cards are more expensive
  } else {
    return -1;
  }
};

Cost.prototype.costString = function() {
  var debtString = this.debtCost ? "" + this.debtString + "D" : "";
  if (this.isNull()) {
    return "";
  }
  if (!this.coinCost && !this.debtCost && this.potion) {
    return this.potion;
  } else {
    return "" + this.coinCost + debtString + this.potion;
  }
};

Cost.prototype.getDebtCost = function() {
  return this.debtCost === null ? 0 : this.debtCost;
}

Cost.prototype.getCoinCost = function() {
  return this.coinCost === null ? 0 : this.coinCost;
}

Cost.prototype.isZero = function() {
  return !this.isNull()
      && !this.getCoinCost()
      && !this.getDebtCost()
      && !this.potion;
}

Cost.prototype.isNull = function() {
  return this.coinCost === null
      && this.debtCost === null
      && this.potion === '';
};

})();

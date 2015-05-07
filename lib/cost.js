(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.Cost = function (num) {
  this.num = Math.floor(num);
  if (num - this.num > 0) {
    this.potion = "P";
  } else {
    this.potion = "";
  }
};

var Cost = Dominionator.Cost;

Cost.prototype.compareCost = function (other) {
  if (this.num > other.num) {
    return 1;
  } else if (this.num == other.num) {
    return 0;
  } else {
    return -1;
  }
};

Cost.prototype.costString = function () {
  if (!this.num && this.potion) {
    return this.potion;
  } else {
    return "" + this.num + this.potion;
  }
};

})();

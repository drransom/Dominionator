(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.Cost = function (num, potion) {
  this.num = num;
  if (potion) {
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
return "" + this.num + this.potion;
};

})();

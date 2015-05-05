(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.CardSelector = function () {
  this.cardList = new Dominionator.CardList();
  this.cardList.initializeCards();
};

var CardSelector = Dominionator.CardSelector;

CardSelector.prototype.selectCards = function (options) {
  this.cardList.selectCards(options);
};

})();

//This contains functions for selecting cards that have strange rules.
//Right now the only card that meets this condition is the Young Witch
//and the associated Bane cards.

(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

if (Dominionator.CardList === undefined) {
  Dominionator.CardList = function() {};
}

var CardList = Dominionator.CardList;

CardList.prototype.processSpecialCases = function() {
  this.processYoungWitch();
};

CardList.prototype.processYoungWitch = function() {
  if (this.kingdomCards.length <= this.maxCards &&
      _.findWhere(this.kingdomCards, {name: "Young Witch"}) &&
      !_.findWhere(this.kingdomCards, {bane: true})) {
    this.addBaneCard();
  }
};

CardList.prototype.addReplacementBaneCard = function () {
  this.maxCards -=1;
  this.addBaneCard();
};

CardList.prototype.addBaneCard = function() {
  var counter = 0, card;
  while (counter < 200) {
    card = this.selectRandomCard();
    if (this.isValidKingdomCard(card) && card.meetsBaneCost()) {
      card.addToSelected({selectedCards: this.kingdomCards, bane: true});
      this.maxCards += 1;
      break;
    } else {
      counter += 1;
      this.currentCards.unshift(card);
      if (counter >= 200) {
        throw "unable to find cards satsifying conditions";
      }
    }
  }
};

})();

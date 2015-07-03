(function() {
"use strict";

//contains rules for the alchemy expansion
if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

if (Dominionator.CardList === undefined) {
  Dominionator.CardList = function() {};
}

if (Dominionator.Card === undefined) {
  Dominionator.Card = function() {};
}

var CardList = Dominionator.CardList, Card = Dominionator.Card;

CardList.prototype.alchemyConditionMet = function () {
  var numAlchemy = this.numAlchemyCards();
  return (numAlchemy >=3 && numAlchemy <= 5);
};

CardList.prototype.numAlchemyCards = function () {
  return _.select(this.kingdomCards, {set: "Alchemy"}).length;
};

Dominionator.AlchemyCard = function() {

};

})();

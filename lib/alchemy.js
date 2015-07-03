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

if (Dominionator.CardSelector === undefined) {
  Dominionator.CardSelector = function() {};
}

var CardList = Dominionator.CardList;
var Card = Dominionator.Card;

CardList.prototype.alchemyConditionMet = function () {
  var numAlchemy = this.numAlchemyCards();
  return (numAlchemy >=3 && numAlchemy <= 5);
};

CardList.prototype.numAlchemyCards = function () {
  return _.select(this.kingdomCards, {set: "Alchemy"}).length;
};

Dominionator.AlchemyCard = function(object) {
  Card.apply(this, arguments);
};

var AlchemyCard = Dominionator.AlchemyCard;

Dominionator.inherit(AlchemyCard, Card);

AlchemyCard.prototype.addToSelected = function(options) {
  Card.prototype.addToSelected.call(this, options);
};

JST.alchemyButton = function(setName) {
  if (setName === "Alchemy") {
    return "<label><input type='checkbox' name='alchemy-condition-checkbox'> \
      0 or 3-5 Alchemy cards</label>";
  } else {
    return "";
  }
};



})();

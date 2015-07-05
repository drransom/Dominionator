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

if (Dominionator.Game === undefined) {
  Dominionator.Game = function() {};
}

if (Dominionator.CardSelectForm === undefined) {
  Dominionator.CardSelectForm = function() {};
}

var CardList = Dominionator.CardList;
var Card = Dominionator.Card;
var Game = Dominionator.Game;
var CardSelector = Dominionator.CardSelector;
var CardSelectForm = Dominionator.CardSelectForm;

Game.prototype.alchemyConditionMet = function () {
  var numAlchemy = this.numAlchemyCards();
  return (numAlchemy >= 3 && numAlchemy <= 4);
};

Game.prototype.needsMoreAlchemy = function () {
  var numAlchemy = this.numAlchemyCards();
  return (this.alchemy_min_3 && numAlchemy < 3 &&
    this.maxCards - this.numAlchemyCards() >= 2);
};

Game.prototype.numAlchemyCards = function () {
  return _.select(this.kingdomCards, {set: "Alchemy"}).length;
};

Dominionator.AlchemyCard = function(object) {
  Card.apply(this, arguments);
};

var AlchemyCard = Dominionator.AlchemyCard;

Dominionator.inherit(AlchemyCard, Card);

AlchemyCard.prototype.addToSelected = function(options) {
  var game = options.game;
  Card.prototype.addToSelected.call(this, options);
  if (options.game.needsMoreAlchemy()) {
    if (game.min.Alchemy <=3 ) {
      game.min.Alchemy = 3;
    }
    game.selectnCardsFromSet("Alchemy", 3);
  }
};

JST.alchemyButton = function(setName) {
  if (setName === "Alchemy") {
    return "<label><input type='checkbox' id='alchemy-condition-checkbox'> \
      Require at least 3 Alchemy cards if any are present</label>";
  } else {
    return "";
  }
};

CardSelectForm.prototype.updateAlchemyBox = function(setName, bool) {
  var alchemyBox = document.getElementById('alchemy-condition-checkbox');
  if (setName === "Alchemy") {
    alchemyBox.checked = bool;
  }
};

CardSelectForm.prototype.setAlchemyConditionListener = function () {
  var alchemyBox = document.getElementById('alchemy-condition-checkbox');
  var selector = this;
  alchemyBox.addEventListener('change', function (event) {
    var target = event.target;
    var excludeBox = document.getElementById('alchemy-exclude');
    if (target.checked) {
      selector.includeSet("Alchemy");
      excludeBox.checked = false;
    } else if (!excludeBox.checked) {
      selector.includeSet("Alchemy");
    }
  });
};

CardSelectForm.prototype.checkAlchemyCondition = function () {
  return document.getElementById('alchemy-condition-checkbox').checked;
};

})();

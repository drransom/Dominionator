(function() {
"use strict";

//contains rules for the alchemy expansion
if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

var D = Dominionator;

if (D.CardList === undefined) {
  D.CardList = function() {};
}

if (D.Card === undefined) {
  D.Card = function() {};
}

if (D.CardSelector === undefined) {
  D.CardSelector = function() {};
}

if (D.Game === undefined) {
  D.Game = function() {};
}

if (D.CardSelectForm === undefined) {
  D.CardSelectForm = function() {};
}

var CardList = D.CardList;
var Card = D.Card;
var Game = D.Game;
var CardSelector = D.CardSelector;
var CardSelectForm = D.CardSelectForm;

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

D.AlchemyCard = function(object) {
  Card.call(this, object);
};

var AlchemyCard = D.AlchemyCard;

D.inherit(AlchemyCard, Card);

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
    alchemyBox.node.checked = bool;
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

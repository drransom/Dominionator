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

D.CardSelectLi = D.CardSelectLi || function () {};

var CardList = D.CardList;
var Card = D.Card;
var Game = D.Game;
var CardSelector = D.CardSelector;
var CardSelectForm = D.CardSelectForm;
var CardSelectLi = D.CardSelectLi;

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

CardSelectForm.prototype.updateAlchemyBox = function(setName, bool) {
  var alchemyBox = document.getElementById('dominionator-alchemy-condition-checkbox');
  if (setName === "Alchemy") {
    alchemyBox.node.checked = bool;
  }
};

CardSelectForm.prototype.setAlchemyConditionListener = function () {
  var alchemyBox = document.getElementById('dominionator-alchemy-condition-checkbox');
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
  return document.getElementById('dominionator-alchemy-condition-checkbox').checked;
};

CardSelectLi.prototype.createAlchemyOptionBox = function () {
  if (this.setName === "Alchemy") {
    var id = 'dominionator-alchemy-condition-checkbox';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    D.addClass(input, id);
    input.setAttribute('id', id);
    input.selectLi = this;
    label.appendChild(input);
    label.appendChild(document.createTextNode("Require at least three Alchemy\
        cards if any are present."));
    this.groupNode.appendChild(label);
    this.alchemyCheckbox = input;
  }
};

CardSelectLi.prototype.validateAlchemy = function () {
  var max = parseInt(this.maxOption.value);
  if (this.alchemyCheckbox.checked && max) {
    this.maxOption.value = Math.max(max, 3);
    this.rememberInput();
  }
};

CardSelectLi.prototype.validateUncheckAlchemy = function() {
  if (parseInt(this.maxOption.value) < 3) {
    this.alchemyCheckbox.checked = false;
  }
};

})();

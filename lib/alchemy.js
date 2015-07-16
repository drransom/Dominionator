;(function() {
"use strict";

//contains rules for the alchemy expansion
window.Dominionator = window.Dominionator || {};

var D = Dominionator,
    CardList = D.CardList,
    Card = D.Card,
    Game = D.Game,
    CardSelector = D.CardSelector,
    CardSelectForm = D.CardSelectForm,
    CardSelectLi = D.CardSelectLi;

Game.prototype.alchemyConditionMet = function() {
  var numAlchemy = this.numAlchemyCards();
  return (numAlchemy >= 3 && numAlchemy <= 4);
};

Game.prototype.needsMoreAlchemy = function() {
  var numAlchemy = this.numAlchemyCards();
  return (this.alchemy_min_3 && numAlchemy < 3 &&
    this.maxCards - this.numAlchemyCards() >= 2);
};

Game.prototype.numAlchemyCards = function() {
  return D.where(this.kingdomCards, {set: "Alchemy"}).length;
};

Game.prototype.hasPotionCard = function() {
  return D.find(this.kingdomCards,function(card) {
    return card.isPotionCard();
  });
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
    if (game.minBySet.Alchemy <=3 ) {
      game.minBySet.Alchemy = 3;
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

CardSelectForm.prototype.setAlchemyConditionListener = function() {
  var alchemyBox = document.getElementById('dominionator-alchemy-condition-checkbox');
  var selector = this;
  alchemyBox.addEventListener('change', function(event) {
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

CardSelectForm.prototype.checkAlchemyCondition = function() {
  return document.getElementById('dominionator-alchemy-condition-checkbox').checked;
};

CardSelectLi.prototype.createAlchemyOptionBox = function() {
  if (this.setName === "Alchemy") {
    var id = 'dominionator-alchemy-condition-checkbox';
    var newLi = document.createElement('li');
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
    newLi.appendChild(label);
    this.alchemyCheckbox = input;
    this.alchemyCheckboxLi = newLi;
  }
};

CardSelectLi.prototype.validateAlchemy = function() {
  var max = parseInt(this.maxOption.value);
  if (this.alchemyCheckbox.checked && max) {
    this.maxOption.value = Math.max(max, 3);
    this.rememberInput();
  }
};

CardSelectLi.prototype.validateUncheckAlchemy = function() {
  if (this.alchemyCheckbox && parseInt(this.maxOption.value) < 3) {
    this.alchemyCheckbox.checked = false;
  }
};

})();

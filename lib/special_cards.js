//This contains functions for selecting cards that have strange rules.
//Right now the only card that meets this condition is the Young Witch
//and the associated Bane cards.

(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

if (Dominionator.Game === undefined) {
  Dominionator.Game = function() {};
}

if (Dominionator.Card === undefined) {
  Dominionator.Card = function () {};
}

var Game = Dominionator.Game;
var Card = Dominionator.Card;

Game.prototype.processSpecialCases = function() {
  this.processYoungWitch();
};

Game.prototype.processYoungWitch = function() {
  if (this.kingdomCards.length <= this.maxCards &&
      _.findWhere(this.kingdomCards, {name: "Young Witch"}) &&
      !this.bane) {
    this.addBaneCard();
  }
};

Game.prototype.addReplacementBaneCard = function () {
  this.maxCards -=1;
  this.addBaneCard();
};

Game.prototype.addBaneCard = function() {
  var counter = 0, card;
  while (counter < 200) {
    card = this.selectRandomCard();
    if (this.isValidKingdomCard(card) && card.meetsBaneCost()) {
      this.addBaneToKingdom({card: card, reverse: false});
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

Game.prototype.addBaneToKingdom = function(options) {
  options.card.addToSelected({selectedCards: this.kingdomCards,
                              reverse: options.reverse});
  this.bane = options.card;
  this.maxCards += 1;
};

Game.prototype.unvetoBane = function() {
  if (this.lastBane) {
    this.addBaneToKingdom({card: this.lastBane, reverse: true});
    this.lastBane = false;
  }
};

Game.prototype.removeBaneCard = function(reverse) {
  var index = _.findIndex(this.kingdomCards, this.bane);
  if (index >= 0) {
    this.bane.hide(reverse);
    this.kingdomCards.splice(index, 1);
    this.currentCards.push(this.bane); //allows card to be reselected as non-bane
    this.lastBane = this.bane;
    this.bane = false;
    this.maxCards -= 1;
  }
};

Card.prototype.checkAndRemoveYoungWitchAndBane = function (game) {
  if (this.isYoungWitch()) {
    game.removeBaneCard();
  } else if (this === game.bane) {
    game.addReplacementBaneCard();
    game.currentCards.push(this);
  }
};

Card.prototype.isYoungWitch = function () {
  return (this.name === "Young Witch");
};

Card.prototype.meetsBaneCost = function () {
  return !this.isPotionCard() && this.cost.num >= 3 && this.cost.num <= 4;
};

Card.prototype.checkYoungWitchUnveto = function(game) {
  if (this.isYoungWitch()) {
    game.unvetoBane();
  }
};

Card.prototype.checkToRemoveBane = function(game) {
  if (this.isYoungWitch()) {
    game.removeBaneCard(true);
  }
};

})();

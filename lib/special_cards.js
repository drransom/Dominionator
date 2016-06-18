//This contains functions for selecting cards that have strange rules.
//Right now the only card that meets this condition is the Young Witch
//and the associated Bane cards.

;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator, Game = D.Game, Card = D.Card;

Game.prototype.processSpecialCases = function() {
  this.processYoungWitch();
};

Game.prototype.processYoungWitch = function() {
  if (this.kingdomCards.length <= this.maxCards &&
      !this.kingdomCards.every(function(card) {
        return !card.isYoungWitch();
      }) &&
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
      this.addBaneToKingdom({card: card, direction: "left"});
      break;
    } else {
      counter += 1;
      this.currentCards.unshift(card);
      if (counter >= 200) {
        debugger;
        throw "unable to find cards satsifying conditions";
      }
    }
  }
};

Game.prototype.addBaneToKingdom = function(options) {
  options.card.addToSelected({selectedCards: this.kingdomCards,
                              direction: options.direction});
  this.bane = options.card;
  this.bane.updateCardDisplay(this);
  this.maxCards += 1;
};

Game.prototype.unvetoBane = function() {
  if (this.lastBane) {
    this.addBaneToKingdom({card: this.lastBane, direction: "right"});
    this.lastBane = false;
  }
};

Game.prototype.removeBaneCard = function(direction) {
  var index = D.findIndex(this.kingdomCards, this.bane);
  if (index >= 0) {
    this.bane.hide(direction);
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
  return !this.isPotionCard() && this.cost.getCoinCost() >= 2 && this.cost.getCoinCost() <= 3;
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

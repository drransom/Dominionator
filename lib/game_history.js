(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.GameHistory = function(game) {
  this.kingdomCards = Dominionator.GameHistory.convertCards(game.kingdomCards);
  this.events = Dominionator.GameHistory.convertCards(game.events);
  this.vetoed = Dominionator.GameHistory.convertCards(game.vetoed);
  this.bane = game.bane ? game.bane.name : false;
  this.maxCards = game.maxCards;
  this.platCol = game.platCol;
  this.shelters = game.shelters;
};

var GameHistory = Dominionator.GameHistory;

GameHistory.convertCards = function (cards) {
  var nameArray = [];
  cards.forEach(function(card) {
    nameArray.push(card.name);
  });
  return nameArray;
};


})();

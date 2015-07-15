;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.GameHistory = function(game) {
  this.kingdomCards = D.GameHistory.convertCards(game.kingdomCards);
  this.events = D.GameHistory.convertCards(game.events);
  this.vetoed = D.GameHistory.convertCards(game.vetoed);
  this.currentCards = D.GameHistory.convertCards(game.currentCards);
  this.bane = game.bane ? game.bane.name : false;
  this.maxCards = game.maxCards;
  this.platCol = game.platCol;
  this.shelters = game.shelters;
  this.maxBySet = game.maxBySet;
  this.minBySet = game.minBySet;
};

var GameHistory = D.GameHistory;

GameHistory.convertCards = function (cards) {
  var nameArray = [];
  cards.forEach(function(card) {
    nameArray.push(card.name);
  });
  return nameArray;
};

})();

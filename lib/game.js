;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.Game = class Game {
  constructor(cardList, alchemy_min_3, gameDisplay, gameId) {
    this.cardList = cardList;
    this.alchemy_min_3 = alchemy_min_3 || false;
    this.sets = this.cardList.sets;
    this.byName = {};
    this.maxCards = 10;
    this.gameDisplay = gameDisplay;
    this.rejectedCards = [];
    this.id = gameId;
  }

  constructCurrentCards() {
    this.currentCards = [];
    let sets = this.options.sets || this.cardList.sets;
    this.setMinMax();

    for (let i = 0; i < sets.length; i++) {
      this.currentCards = this.currentCards.concat(this.cardList[sets[i]]);
    }

    if (this.options.banned) {
      banned_cards = this.constructCardsByName(this.options.banned);
      this.currentCards = D.reject(this.currentCards, function(card) {
        return (D.findWhere(banned_cards, {name: card.name }) !== undefined);
      });
    }
  }

  constructCardsByName(card_names) {
    var game = this;
    return card_names.map(function(name) {
      return game.byName[name];
    });
  }

  selectCards(options) {
    options = options || {};
    this.selectRandomCards(options);
  }

  selectRandomCards(options) {
    this.options = options || {};
    if (this.options.chooseEvents === undefined) {
      this.options.chooseEvents = true;
    }
    this.constructCurrentCards();
    this.selectKingdomCards(this.options.chooseEvents);
    this.selectSheltersPlatCol();
  }

};

var Game = D.Game;

Game.prototype.includesCondition = function(condition) {
  for (var i = 0; i < this.kingdomCards.length; i++) {
    if (this.kingdomCards[i][condition]) {
      return true;
    }
  }
  return false;
};

Game.prototype.includesRuins = function() {
  return this.includesCondition("ruins");
};

Game.prototype.includesSpoils = function() {
  return this.includesCondition("spoils");
};


Game.countBySet = function(cardArray, setName) {
  return cardArray.reduce(function(previousValue, currentValue, index, array) {
    return previousValue + (currentValue.set === setName ? 1 : 0);
  }, 0);
};

Game.prototype.setMinMax = function() {
  this.options.minBySet = this.options.minBySet || {};
  this.options.maxBySet = this.options.maxBySet || {};
  this.minBySet = {};
  this.maxBySet = {};
  this.sets.forEach (function(set) {
    this.minBySet[set] = this.options.minBySet[set] || 0;
    this.maxBySet[set] = this.options.maxBySet[set] || 11;
    if (this.maxBySet[set] < this.minBySet[set]) {
      this.maxBySet[set] = 11;
    }
  }.bind(this));
};

Game.convertFromHistory = function(options) {
  var cardList = options.cardList;
  var newGame = new Game(cardList);
  var gameState = options.gameState;
  newGame.kingdomCards = cardList.findCardsByName(gameState.kingdomCards);
  newGame.eventsAndLandmarks = cardList.findCardsByName(gameState.eventsAndLandmarks);
  newGame.vetoed = cardList.findCardsByName(gameState.vetoed);
  newGame.currentCards = cardList.findCardsByName(gameState.currentCards);
  newGame.bane = cardList.findOneCardByName(gameState.bane);
  newGame.maxCards = parseInt(gameState.maxCards);
  newGame.platCol = gameState.platCol;
  newGame.shelters = gameState.shelters;
  newGame.maxBySet = gameState.maxBySet;
  newGame.minBySet = gameState.minBySet;
  newGame.id = gameState.id;
  newGame.gameDisplay = options.gameDisplay;
  return newGame;
};

Game.prototype.eventClass = function() {
  return (this.eventsAndLandmarks.length > 0) ? "" : D.hidden();
};

Game.prototype.landmarkClass = function() {
  return (this.eventsAndLandmarks.length > 0) ? "" : D.hidden();
}

Game.prototype.includesCard = function(card) {
  return this.kingdomCards.indexOf(card) >= 0 ||
         this.eventsAndLandmarks.indexOf(card) >= 0;
};

D.NullGame = function(cardList) {
  this.kingdomCards = [];
  this.eventsAndLandmarks = [];
  this.vetoed = [];
  this.platCol = false;
  this.shelters = false;
};

var NullGame = D.NullGame;

D.inherit(NullGame, Game);

NullGame.prototype.includesRuins = function() { return false; };
NullGame.prototype.includesSpoils = function() { return false; };
NullGame.prototype.eventClass = function() { return "slideLeft"; };

})();

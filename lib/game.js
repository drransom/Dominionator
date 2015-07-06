(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

var game = function game (cardList, alchemy_min_3) {
  this.cardList = cardList;
  this.alchemy_min_3 = alchemy_min_3 || false;
  this.sets = this.cardList.sets;
  this.byName = {};
  this.maxCards = 10;
};


if (Dominionator.Game) {
  var surrogate = Dominionator.Game;
  var prototype = surrogate.prototype;
  game.prototype = prototype;
}

Dominionator.Game = game;
var Game = Dominionator.Game;

Game.prototype.constructCurrentCards = function() {
  this.currentCards = [];
  var sets = this.options.sets || this.cardList.sets;
  this.setMinMax();

  for (var i = 0; i < sets.length; i++) {
    this.currentCards = this.currentCards.concat(this.cardList[sets[i]]);
  }

  if (this.options.banned) {
    banned_cards = this.constructCardsByName(this.options.banned);
    this.currentCards = _.reject(this.currentCards, function (card) {
      return (_.findWhere(banned_cards, {name: card.name }) !== undefined);
    });
  }
};

Game.prototype.constructCardsByName = function (card_names) {
  return _.map(card_names, function (name) {
    return this.byName[name];
  }.bind(this));
};

Game.prototype.selectCards = function (options) {
  options = options || {};
  this.selectRandomCards(options);
};

Game.prototype.selectRandomCards = function (options) {
  this.options = options || {};
  if (this.options.chooseEvents === undefined) {
    this.options.chooseEvents = true;
  }
  this.constructCurrentCards();
  this.selectKingdomCards(this.options.chooseEvents);
  this.selectSheltersPlatCol();
};

Game.prototype.includesCondition = function (condition) {
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


Game.countBySet = function (cardArray, setName) {
  return _.inject(cardArray, function (memo, card) {
    return memo + (card.set === setName ? 1 : 0);
  }, 0);
};

Game.prototype.setMinMax = function() {
  this.options.min = this.options.min || {};
  this.options.max = this.options.max || {};
  this.min = {};
  this.max = {};
  this.sets.forEach (function (set) {
    this.min[set] = this.options.min[set] || 0;
    this.max[set] = this.options.max[set] || 11;
    if (this.max[set] < this.min[set]) {
      this.max[set] = 11;
    }
  }.bind(this));
};

Game.convertFromHistory = function(object, cardList) {
  var newGame = new Game(cardList);
  newGame.kingdomCards = cardList.findCardsByName(object.kingdomCards);
  newGame.events = cardList.findCardsByName(object.events);
  newGame.vetoed = cardList.findCardsByName(object.vetoed);
  newGame.bane = cardList.findOneCardByName(object.bane);
  newGame.maxCards = parseInt(object.maxCards);
  cardList.updateHiddenStatus(newGame);
  return newGame;
};

Dominionator.Game.eventClass = function() {
  return (this.events.length > 0) ? "" : Dominionator.hidden();
};

Dominionator.NullGame = function (cardList) {
  this.kingdomCards = [];
  this.events = [];
  this.vetoed = [];
  this.platCol = false;
  this.shelters = false;
};

var NullGame = Dominionator.NullGame;

Dominionator.inherit(NullGame, Game);

NullGame.prototype.includesRuins = function() { return false; };
NullGame.prototype.includesSpoils = function() { return false; };
NullGame.prototype.eventClass = function() { return "slideLeft"; };

})();

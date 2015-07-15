// This contains files relating to the process of selecting kingdom cards.

;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator, CardList = D.CardList, Game = D.Game;

Game.prototype.selectKingdomCards = function (chooseEvents) {
  this.kingdomCards = [];
  this.events = [];
  this.vetoed = [];
  this.updateKingdomCards(chooseEvents);
};

Game.prototype.updateKingdomCards = function (chooseEvents) {
  chooseEvents = chooseEvents || false;
  this.currentCards = _.shuffle(this.currentCards);
  this.selectCardsFromEachSet(this.minBySet, chooseEvents);
  while (this.kingdomCards.length < this.maxCards && this.currentCards.length > 0) {
    this.trySelectOneCard(chooseEvents);
  }
  this.processSpecialCases();
};

Game.prototype.selectCardsFromEachSet = function(setHash, chooseEvents) {
  var currentSet, set, i;
  for (set in setHash) {
    if (setHash[set] !== 0) {
      this.selectnCardsFromSet(set, setHash[set], chooseEvents);
    }
  }
};

Game.prototype.selectnCardsFromSet = function (setName, numCards, chooseEvents) {
  var currentSet, currentKigdomEvents, otherCards, rejectedCards, events, card;
  currentSet = _.shuffle(_.where(this.currentCards, {set: setName}));
  rejectedCards = [];
  otherCards = _.reject(this.currentCards,
    function (card) { return (card.set === setName); });
  while (currentSet.length > 0 &&
         (numCards - this.numCardsInSet(setName) > 0) &&
         this.kingdomCards.length < 10) {
    card = currentSet.pop();
    if (this.isValidKingdomCard(card)) {
      card.addToSelected({selectedCards: this.kingdomCards, game: this});
    } else if (this.isValidEvent(card) && chooseEvents &&
        (!otherCards.length ||
          Math.random() < (currentSet.length / otherCards.length))) {
      card.addToSelected({selectedCards: this.events});
    } else {
      rejectedCards.push(card);
    }
  }
  this.currentCards = _.shuffle(currentSet.concat(otherCards).concat(rejectedCards));
};

Game.prototype.numCardsInSet = function (setName) {
  return _.where(this.kingdomCards, {set: setName}).length;
};

Game.prototype.trySelectOneCard = function (chooseEvents) {
  var card = this.currentCards.pop();
  if (chooseEvents && this.isValidEvent(card)) {
    card.addToSelected({selectedCards: this.events});
  } else if (this.isValidKingdomCard(card)) {
    card.addToSelected({selectedCards: this.kingdomCards, game: this});
  } else {
    this.currentCards.unshift(card);
  }
};

Game.prototype.isValidEvent = function (card) {
  return card.isEvent && !this.isVetoedCard(card) &&
         (this.events.length < 2) && this.events.indexOf(card) < 0 &&
         Game.countBySet(this.kingdomCards.concat(this.events), card.set) < this.maxBySet[card.set];
};

Game.prototype.isValidKingdomCard = function (card) {
  return !card.isEvent && !this.isVetoedCard(card) &&
         this.kingdomCards.indexOf(card) < 0 &&
         Game.countBySet(this.kingdomCards.concat(this.events), card.set) < this.maxBySet[card.set];
};

Game.prototype.selectSheltersPlatCol = function() {
  this.shelters = this.selectShelters(this.options);
  this.platCol = this.selectPlatCol(this.options);
};

Game.prototype.selectRandomCard = function() {
  return this.currentCards.pop();
};

Game.prototype.selectShelters = function() {
  if (this.options.shelters === undefined) {
    var pctDarkAges = Game.countBySet(this.kingdomCards, "Dark Ages")/10;
    return Math.random() <= pctDarkAges;
  } else {
    return this.options.shelters;
  }
};

Game.prototype.selectPlatCol = function() {
  if (this.options.platCol === undefined) {
    var pctProsperity = Game.countBySet(this.kingdomCards, "Prosperity")/10;
    return Math.random() <= pctProsperity;
  } else {
    return this.options.platCol;
  }
};

})();

// This contains functions relating to the process of selecting kingdom cards.
;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
let D = Dominionator, CardList = D.CardList, Game = D.Game;

Game.prototype.selectKingdomCards = function(chooseEvents) {
  this.kingdomCards = [];
  this.eventsAndLandmarks = [];
  this.vetoed = [];
  this.updateKingdomCards(chooseEvents);
};

Game.prototype.updateKingdomCards = function(chooseEvents) {
  chooseEvents = chooseEvents || false;
  this.currentCards = D.shuffle(this.currentCards);
  this.selectCardsFromEachSet(this.minBySet, chooseEvents);
  while (this.kingdomCards.length < this.maxCards && this.currentCards.length > 0) {
    this.trySelectOneCard(chooseEvents);
  }
  this.processSpecialCases();
  this.currentCards = this.currentCards.concat(this.rejectedCards);
  this.rejectedCards = [];
};

Game.prototype.selectCardsFromEachSet = function(setHash, chooseEvents) {
  for (let set in setHash) {
    if (parseInt(setHash[set]) !== 0) {
      this.selectnCardsFromSet(set, setHash[set], chooseEvents);
    }
  }
};

Game.prototype.selectnCardsFromSet = function(setName, numCards, chooseEvents) {
  let currentSet = D.shuffle(D.where(this.currentCards, {set: setName}));
  let rejectedCards = [];
  let otherCards = D.reject(this.currentCards,
     (card) => (card.set === setName));
  while (currentSet.length > 0 &&
         (numCards - this.numCardsInSet(setName) > 0) &&
         this.kingdomCards.length < 10) {
    let card = currentSet.pop();
    if (this.isValidKingdomCard(card)) {
      card.addToSelected({selectedCards: this.kingdomCards, game: this});
    } else if (this.isValidEventOrLandmark(card, chooseEvents) &&
        (!otherCards.length ||
          Math.random() < (currentSet.length / otherCards.length))) {
      let cardArray;
      if (card.isEvent || card.isLandmark) {
        cardArray = this.eventsAndLandmarks;
      }
      card.addToSelected({selectedCards: cardArray});
    } else {
      rejectedCards.push(card);
    }
  }
  this.currentCards = D.shuffle(currentSet.concat(otherCards).concat(rejectedCards));
};

Game.prototype.numCardsInSet = function(setName) {
  return D.where(this.kingdomCards, {set: setName}).length;
};

Game.prototype.trySelectOneCard = function(chooseEvents) {
  let card = this.currentCards.pop();
  if (this.isValidEventOrLandmark(card, chooseEvents)) {
    card.addToSelected({selectedCards: this.eventsAndLandmarks});
  } else if (this.isValidKingdomCard(card)) {
    card.addToSelected({selectedCards: this.kingdomCards, game: this});
  } else {
    this.rejectedCards.push(card);
  }
};

Game.prototype.isValidEventOrLandmark = function(card, chooseEvents) {
  if (card.isEvent && !chooseEvents) {
    return false;
  } else if (this.eventsAndLandmarks.length >= 2) {
    return false;
  } else return this.isValidEvent(card) || this.isValidLandmark(card);
};

Game.prototype.isValidEvent = function(card) {
  return card.isEvent && !this.isVetoedCard(card) &&
         this.eventsAndLandmarks.indexOf(card) < 0 &&
         Game.countBySet(this.allCardsInGame(), card.set) < this.maxBySet[card.set];
};

Game.prototype.isValidKingdomCard = function(card) {
  return card.isKingdomCard && !this.isVetoedCard(card) &&
         this.kingdomCards.indexOf(card) < 0 &&
         Game.countBySet(this.allCardsInGame(), card.set) < this.maxBySet[card.set];
};

Game.prototype.isValidLandmark = function(card) {
  return card.isLandmark && !this.isVetoedCard(card) &&
         this.eventsAndLandmarks.indexOf(card) < 0 &&
         Game.countBySet(this.allCardsInGame(), card.set) < this.maxBySet[card.set];
};

Game.prototype.allCardsInGame = function() {
  return this.kingdomCards.concat(this.eventsAndLandmarks);
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
    let pctDarkAges = Game.countBySet(this.kingdomCards, "Dark Ages")/10;
    return Math.random() <= pctDarkAges;
  } else {
    return this.options.shelters;
  }
};

Game.prototype.selectPlatCol = function() {
  if (this.options.platCol === undefined) {
    let pctProsperity = Game.countBySet(this.kingdomCards, "Prosperity")/10;
    return Math.random() <= pctProsperity;
  } else {
    return this.options.platCol;
  }
};

})();

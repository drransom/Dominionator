// This contains files relating to the process of selecting kingdom cards.

(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

if (Dominionator.CardList === undefined) {
  Dominionator.CardList = function () {};
}

var CardList = Dominionator.CardList;

CardList.prototype.selectKingdomCards = function (chooseEvents) {
  this.kingdomCards = [];
  this.events = [];
  this.vetoed = [];
  this.updateKingdomCards(chooseEvents);
};

CardList.prototype.updateKingdomCards = function (chooseEvents) {
  chooseEvents = chooseEvents || false;
  this.currentCards = _.shuffle(this.currentCards);
  this.selectCardsFromEachSet(this.min, chooseEvents);
  while (this.kingdomCards.length < this.maxCards && this.currentCards.length > 0) {
    this.trySelectOneCard(chooseEvents);
  }
  this.processSpecialCases();
};

CardList.prototype.selectCardsFromEachSet = function(setHash, chooseEvents) {
  var currentSet, set, i;
  for (set in setHash) {
    if (setHash[set] !== 0) {
      this.selectnCardsFromSet(set, setHash[set], chooseEvents);
    }
  }
};

CardList.prototype.selectnCardsFromSet = function (set, numCards, chooseEvents) {
  var currentSet, currentKigdomEvents, otherCards, events, counter = 0, card, currentNum;
  currentNum = _.where(this.kingdomCards, {set: set}).length;
  currentSet = _.shuffle(_.where(this.currentCards, {set: set}));
  otherCards = _.reject(this.currentCards,
    function (card) { return (card.set === set); });
  while (currentSet.length > 0 && counter < (numCards - currentNum) &&
         this.kingdomCards.length < 10) {
    card = currentSet.pop();
    if (this.isValidKingdomCard(card)) {
      counter += 1;
      card.addToSelected({selectedCards: this.kingdomCards});
    } else if (this.isValidEvent(card) && chooseEvents &&
        (!otherCards.length ||
          Math.random() < (currentSet.length / otherCards.length))) {
      card.addToSelected({selectedCards: this.events});
    }
  }
  this.currentCards = _.shuffle(currentSet.concat(otherCards));
};

CardList.prototype.trySelectOneCard = function (chooseEvents) {
  var card = this.currentCards.pop();
  if (chooseEvents && this.isValidEvent(card)) {
    card.addToSelected({selectedCards: this.events});
  } else if (this.isValidKingdomCard(card)) {
    card.addToSelected({selectedCards: this.kingdomCards});
  }
};

CardList.prototype.isValidEvent = function (card) {
  return card.isEvent && !this.isVetoedCard(card) &&
         (this.events.length < 2) && this.events.indexOf(card) < 0;
};

CardList.prototype.isValidKingdomCard = function (card) {
  return !card.isEvent && !this.isVetoedCard(card) &&
         this.kingdomCards.indexOf(card) < 0 &&
         CardList.countBySet(this.kingdomCards, card.set) < this.max[card.set];
};

CardList.prototype.selectSheltersPlatCol = function() {
  this.shelters = this.selectShelters(this.options);
  this.platCol = this.selectPlatCol(this.options);
};

CardList.prototype.selectRandomCard = function() {
  return this.currentCards.pop();
};

CardList.prototype.selectShelters = function() {
  if (this.options.shelters === undefined) {
    var pctDarkAges = CardList.countBySet(this.kingdomCards, "Dark Ages")/10;
    return Math.random() <= pctDarkAges;
  } else {
    return this.options.shelters;
  }
};

CardList.prototype.selectPlatCol = function() {
  if (this.options.platCol === undefined) {
    var pctProsperity = CardList.countBySet(this.kingdomCards, "Prosperity")/10;
    return Math.random() <= pctProsperity;
  } else {
    return this.options.platCol;
  }
};

})();

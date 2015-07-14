(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

var D = Dominionator;

D.Game = D.Game || function() {};
var Game = D.Game;

D.CardDisplay = D.CardDisplay || function() {};
var CardDisplay = D.CardDisplay;

Game.prototype.isVetoedCard = function (card) {
  return this.vetoed.indexOf(card) >= 0;
};

Game.prototype.veto = function (card) {
  var index;
  if (!card.isEvent) {
    index = this.kingdomCards.indexOf(card);
    if (index >= 0) {
      this.vetoCardByIndex(index);
      this.updateKingdomCards();
    }
  } else if ((index = this.events.indexOf(card)) >= 0) {
    this.vetoAndReplaceEventByIndex(index);
  }
};

Game.prototype.vetoCardByIndex = function (index, array) {
  array = array || this.kingdomCards;
  var removedCard = array[index];
  array.splice(index, 1);
  this.vetoed.push(removedCard);
  removedCard.processRemoval(this);
};

Game.prototype.vetoAndReplaceEventByIndex = function (index) {
  this.vetoCardByIndex(index, this.events);
  this.addNewEvent();
};

Game.prototype.addNewEvent = function () {
  var newEvent, events = _.where(this.currentCards, {isEvent: true});
  var otherCards = _.where(this.currentCards, {isEvent: false});
  while (events.length > 0) {
    newEvent = events.pop();
    if (this.isValidEvent(newEvent)) {
      newEvent.addToSelected({selectedCards: this.events});
      break;
    }
  }
  this.currentCards = _.shuffle(otherCards.concat(events));
};

Game.prototype.removeBaneCard = function () {
  var index = _.findIndex(this.kingdomCards, this.bane);
  if (index >= 0) {
    this.bane.hide();
    this.kingdomCards.splice(index, 1);
    this.currentCards.push(this.bane); //allows card to be reselected as non-bane
    this.bane = false;
    this.maxCards -= 1;
  }
};

CardDisplay.prototype.prepareVeto = function() {
  this.slideRight();
};



})();

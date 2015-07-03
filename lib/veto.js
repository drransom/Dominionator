(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

if (Dominionator.Game === undefined) {
  Dominionator.Game = function () {};
}

var Game = Dominionator.Game;

Game.prototype.isVetoedCard = function (card) {
  return this.vetoed.indexOf(card) >= 0;
};

Game.prototype.veto = function (cardId) {
  var index = _.findIndex(this.kingdomCards, {id: cardId});
  if (index >= 0) {
    this.vetoCardByIndex(index);
    this.updateKingdomCards();
  } else if ((index = _.findIndex(this.events, {id: cardId})) >= 0) {
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
  var card, index = _.findIndex(this.kingdomCards, {bane: true});
  if (index >= 0) {
    card = this.kingdomCards[index];
    card.hide();
    this.kingdomCards.splice(index, 1);
    this.currentCards.push(card); //allows card to be reselected as non-bane
    this.maxCards -= 1;
  }
};
})();

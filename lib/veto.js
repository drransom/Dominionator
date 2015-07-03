(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

if (Dominionator.CardList === undefined) {
  Dominionator.CardList = function () {};
}

var CardList = Dominionator.CardList;

CardList.prototype.isVetoedCard = function (card) {
  return this.vetoed.indexOf(card) >= 0;
};

CardList.prototype.veto = function (cardId) {
  var index = _.findIndex(this.kingdomCards, {id: cardId});
  if (index >= 0) {
    this.vetoCardByIndex(index);
    this.updateKingdomCards();
  } else if ((index = _.findIndex(this.events, {id: cardId})) >= 0) {
    this.vetoed.push(this.events[index]);
    this.removeAndReplaceEvent(index);
  }
};

CardList.prototype.vetoCardByIndex = function (index, array) {
  array = array || this.kingdomCards;
  var removedCard = array[index];
  array.splice(index, 1);
  this.vetoed.push(removedCard);
  removedCard.processRemoval(this);
};

CardList.prototype.removeAndReplaceEventByIndex = function (index) {
  this.vetoCardByIndex(index, this.events);
  this.addNewEvent();
};

CardList.prototype.addNewEvent = function () {
  var newEvent, events = _.where(this.currentCards, {isEvent: true});
  var otherCards = _.where(this.currentCards, {isEvent: false});
  while (events.length > 0) {
    newEvent = events.pop();
    if (this.isValidEvent(newEvent)) {
      this.events.push(newEvent);
      break;
    }
  }
  this.currentCards = _.shuffle(otherCards.concat(events));
};

CardList.prototype.removeBaneCard = function () {
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

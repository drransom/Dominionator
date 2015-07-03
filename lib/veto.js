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
    this.removeCardByIndex(index);
    this.updateKingdomCards();
  } else if ((index = _.findIndex(this.events, {id: cardId})) >= 0) {
    this.vetoed.push(this.events[index].name);
    this.removeAndReplaceEvent(index);
  }
};

CardList.prototype.removeCardByIndex = function (index) {
  var removedCard = this.kingdomCards[index];
  this.vetoed.push(removedCard);
  this.kingdomCards.splice(index, 1);
  removedCard.processRemoval(this);
};

CardList.prototype.removeAndReplaceEvent = function (index) {
  this.events[index].hide();
  this.events.splice(index, 1);
  this.addNewEvent();
};

CardList.prototype.addNewEvent = function () {
  var newEvent, count = 0, events = _.where(this.currentCards, {isEvent: true});
  var otherCards = _.where(this.currentCards, {isEvent: false});
  while (count < 30) {
    count += 1;
    newEvent = events.pop();
    if (this.isValidEvent(newEvent)) {
      this.events.push(newEvent);
      break;
    }
  }
  this.currentCards = _.shuffle(otherCards.concat(events));
};

CardList.prototype.removeBaneCard = function () {
  var index = _.findIndex(this.kingdomCards, {bane: true});
  if (index >= 0) {
    var card = this.kingdomCards[index];
    card.hide();
    this.kingdomCards.splice(index, 1);
    this.currentCards.push(card); //allows card to be reselected as non-bane
    this.maxCards -= 1;
  }
};
})();

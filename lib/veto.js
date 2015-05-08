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
  return this.vetoed.indexOf(card.name) >= 0;
};

CardList.prototype.veto = function (cardName) {
  var removedCard, index = _.findIndex(this.kingdomCards, {name: cardName});
  if (index >= 0) {
    this.vetoed.push(cardName);
    removedCard = this.kingdomCards[index];
    this.kingdomCards.splice(index, 1);
    if (removedCard.name === "Young Witch") {
      this.removeBaneCard();
    }
    if (removedCard.bane) {
      removedCard.bane = false;
      this.addBaneCard();
    }
    this.updateKingdomCards();
  } else if ((index = _.findIndex(this.events, {name: cardName})) >= 0) {
    this.vetoed.push(cardName);
    this.removeAndReplaceEvent(index);
  }
};

CardList.prototype.removeAndReplaceEvent = function (index) {
  this.events.splice(index, 1);
  this.addNewEvent();
};

CardList.prototype.addNewEvent = function () {
  var newEvent, count = 0, events = _.where(this.currentCards, {isEvent: true});
  while (count < 30) {
    count += 1;
    newEvent = _.sample(events);
    if (this.isValidEvent(newEvent)) {
      this.events.push(newEvent);
      break;
    }
  }
};

CardList.prototype.removeBaneCard = function () {
  var index = _.findIndex(this.kingdomCards, {bane: true});
  if (index >= 0) {
    card = this.kingdomCards[i];
    card.bane = false;
    this.kingdomCards.splice(index, 1);
  }
};
})();

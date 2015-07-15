;(function() {
  "use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.Game = D.Game || function() {};
var Game = D.Game;

D.CardDisplay = D.CardDisplay || function() {};
var CardDisplay = D.CardDisplay;

D.Card = D.Card || function() {};
var Card = D.Card;

Game.prototype.isVetoedCard = function (card) {
  return this.vetoed.indexOf(card) >= 0;
};

Game.prototype.veto = function (card) {
  var index;
  if (!card.isEvent) {
    index = this.kingdomCards.indexOf(card);
    if (index >= 0) {
      this.gameDisplay.updateVetoDisplay("kingdom");
      this.vetoCardByIndex(index);
      this.updateKingdomCards();
    }
  } else if ((index = this.events.indexOf(card)) >= 0) {
    this.gameDisplay.updateVetoDisplay("event");
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

Game.prototype.unveto = function() {
  var unvetoedCard = this.vetoed.pop();
  var lastCardAdded = this.getLastCardAdded(unvetoedCard);
  if (lastCardAdded === this.bane) {
    this.bane = unvetoedCard;
    this.lastBane = false;
  }
  this.removeCardThroughUnveto(lastCardAdded);
  this.readdCard(unvetoedCard);
};

Game.prototype.getLastCardAdded = function(unvetoedCard) {
  if (unvetoedCard.isEvent) {
    return this.events.pop();
  } else {
    return this.kingdomCards.pop();
  }
};

Game.prototype.readdCard = function(card) {
  if (card.isEvent) {
    this.events.push(card);
  } else {
    this.kingdomCards.push(card);
  }
  card.processUnveto(this);
};

Game.prototype.removeCardThroughUnveto = function(card) {
  this.currentCards.push(card);
  card.removeThroughUnveto(this);
};

Card.prototype.processUnveto = function(game) {
  this.unhide("right");
  this.checkYoungWitchUnveto(game);
  this.updateCardDisplay(game);
};

Card.prototype.removeThroughUnveto = function(game) {
  this.hide("left");
  this.checkToRemoveBane(game);
};


})();

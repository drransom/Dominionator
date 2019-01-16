import {Game} from './game.js';
import {Helpers} from './helpers.js';
;(function() {
  "use strict";

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
  } else if ((index = this.eventsAndLandmarks.indexOf(card)) >= 0) {
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
  this.vetoCardByIndex(index, this.eventsAndLandmarks);
  this.addNewEvent();
};

Game.prototype.addNewEvent = function() {
  this.addNewEventOrLandmark('events');
  // var newEvent, events = Helpers.where(this.currentCards, {isEvent: true});
  // var otherCards = Helpers.where(this.currentCards, {isEvent: false});
  // while (events.length > 0) {
  //   newEvent = events.pop();
  //   if (this.isValidEvent(newEvent)) {
  //     newEvent.addToSelected({selectedCards: this.eventsAndLandmarks});
  //     break;
  //   }
  // }
  // this.currentCards = Helpers.shuffle(otherCards.concat(events));
};

Game.prototype.addNewLandmark = function() {
  this.addNewEventOrLandmark('landmarks');
};

Game.prototype.addNewEventOrLandmark = function(typeToUse) {
  var newCard, possibleCards, trueOption, falseOption, validationFunction;
  if (typeToUse === 'events') {
    trueOption = {isEvent: true};
    falseOption = {isEvent: false};
    validationFunction = this.isValidEvent;
  } else if (typeToUse === 'landmarks') {
    trueOption = {isLandmark: true};
    falseOption = {isLandmark: false};
    validationFunction = this.isValidLandmark;
  }
  if (typeToUse) {
    possibleCards = Helpers.where(this.currentCards, trueOption);
    otherCards = Helpers.where(this.currentCards, falseOption);
    while (possibleCards.length > 0) {
      newCard = possibleCards.pop();
      if (validationFunction(newCard)) {
        newCard.addToSelected({selectedCards: this[typeToUse]});
        break;
      }
    }
    this.currentCards = Helpers.shuffle(otherCards.concat(possibleCards));
  }
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
    return this.eventsAndLandmarks.pop();
  } else {
    return this.kingdomCards.pop();
  }
};

Game.prototype.readdCard = function(card) {
  if (card.isEvent) {
    this.eventsAndLandmarks.push(card);
  } else {
    this.kingdomCards.push(card);
  }
  card.processUnveto(this);
};

Game.prototype.removeCardThroughUnveto = function(card) {
  this.currentCards.push(card);
  card.removeThroughUnveto(this);
};

})();

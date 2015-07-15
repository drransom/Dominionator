;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.CardList = function() {
  this.byName = {};
  this.sets = [];
};

var CardList = D.CardList;

CardList.prototype.initializeCards = function(callback) {
  var request = new XMLHttpRequest();
  var callbackFunction = this.loadCardsFunction(callback);
  request.addEventListener("load", callbackFunction, false);
  request.open("GET", 'dominion_cards.csv', true);
  request.send();
};

CardList.prototype.loadCardsFunction = function(callback) {
  var list = this;
  return function(response) {
    Papa.parse(response.currentTarget.response, {
      header: true,
      dynamicTyping: true,
      complete: function(papaResponse) {
        for (var i = 0; i < papaResponse.data.length; i++) {
          list.loadOneCard(papaResponse.data[i]);
        }
        list.constructAllCards();
        callback.call();
      }
    });
  };
};

CardList.prototype.loadOneCard = function(array) {
  var card = D.Card.constructCard(array);
  if (!card.name) {
    return;
  } else if (this[card.set] === undefined) {
    this[card.set] = [card];
    this.sets.push(card.set);
  } else {
    this[card.set].push(card);
  }
  this.byName[card.name] = card;
};

CardList.prototype.constructAllCards = function() {
  this.allCards = [];
  this.sets.forEach(function(setName) {
    this.allCards = this.allCards.concat(this[setName]);
  }.bind(this));
};


CardList.prototype.resetKingdom = function() {
  this.resetCards(this.allCards);
};

CardList.prototype.resetCards = function(array) {
  if (array) {
    array.forEach(function(card) {
      card.hide({default: true});
    });
  }
};

CardList.prototype.sortKingdomCards = function(properties) {
  this.allCards = D.Sorter.sortByProperties(this.allCards, properties);
};

CardList.prototype.findOneCardByName = function(name) {
  if (name) {
    return D
    .findWhere(this.allCards, {name: name});
  } else {
    return false;
  }
};

CardList.prototype.findCardsByName = function(names) {
  var cards = [];
  names.forEach(function(name) {
    cards.push(this.findOneCardByName(name));
  }.bind(this));
  return cards;
};

CardList.prototype.updateHiddenStatus = function(game) {
  this.allCards.forEach (function(card) {
    if (game.kingdomCards.indexOf(card) >= 0 || game.events.indexOf(card) >= 0) {
      card.unhide();
    } else {
      card.hide({default: true});
    }
  }.bind(this));
};

CardList.prototype.hideNotInKingdom = function(game) {
  if (game.kingdomCards.indexOf(card) < 0 && game.events.indexOf(card) < 0) {
    card.hide({default: true});
  }
};

CardList.prototype.displayInKingdom = function(game) {
  if (game.kingdomCards.indefOf(card) >= 0 || game.events.indexOf(card) >= 0) {
    card.unhide();
  }
};

})();

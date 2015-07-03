(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.CardList = function () {
  this.byName = {};
  this.sets = [];
};

var CardList = Dominionator.CardList;

CardList.prototype.initializeCards = function (callback) {
  var request = new XMLHttpRequest();
  var callbackFunction = this.loadCardsFunction(callback);
  request.addEventListener("load", callbackFunction, false);
  request.open("GET", 'dominion_cards.csv', true);
  request.send();
};

CardList.prototype.loadCardsFunction = function (callback) {
  var list = this;
  return function (response) {
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

CardList.prototype.loadOneCard = function (array) {
  var card = Dominionator.Card.constructCard(array);
  card.hide();
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

CardList.prototype.sortKingdomCards = function (properties) {
  this.allCards = CardList.sortByProperties(this.allCards, properties);
};


CardList.sortByProperties = function (cards, properties) {
  var sorter = CardList.constructSorter(properties);
  return cards.sort(sorter);
};

CardList.constructSorter = function (properties, kingdomName) {
  return function (card1, card2) {
    var result;
    for (var i = 0; i < properties.length; i++) {
      result = CardList.compareProperty(card1, card2, properties[i], kingdomName);
      if (result) {
        return result;
      }
    }
    return 0;
  };
};

CardList.compareProperty = function (card1, card2, property, kingdomName) {
  if (property === 'cost') {
    return card1.compareCost(card2);
  } else if (property === 'moveKingdomToFront') {
    return card1.kingdomCompare(card2, kingdomName);
  } else if (card1[property] > card2[property]) {
      return 1;
  } else if (card1[property] < card2[property]) {
    return -1;
  } else {
    return 0;
  }
};

CardList.prototype.resetKingdom = function () {
  this.resetCards(this.allCards);
};

CardList.prototype.resetCards = function (array) {
  if (array) {
    array.forEach(function (card) {
      card.hide();
    });
  }
};


})();

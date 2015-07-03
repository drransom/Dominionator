(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.CardList = function () {
  this.byName = {};
  this.sets = [];
  this.maxCards = 10;
};

var CardList = Dominionator.CardList;

CardList.prototype.constructCurrentCards = function() {
  this.currentCards = [];
  var sets = this.options.sets || this.sets;
  this.setMinMax();

  for (var i = 0; i < sets.length; i++) {
    this.currentCards = this.currentCards.concat(this[sets[i]]);
  }

  this.allCards = this.currentCards.slice();

  if (this.options.banned) {
    banned_cards = this.constructCardsByName(this.options.banned);
    this.currentCards = _.reject(this.currentCards, function (card) {
      return (_.findWhere(banned_cards, {name: card.name }) !== undefined);
    });
  }
};

CardList.prototype.constructCardsByName = function (card_names) {
  return _.map(card_names, function (name) {
    return this.byName[name];
  }.bind(this));
};

CardList.prototype.selectRandomCards = function (options) {
  this.options = options || {};
  this.constructCurrentCards();
  this.selectKingdomCards();
  this.selectSheltersPlatCol();
};

CardList.prototype.includesCondition = function (condition) {
  for (var i = 0; i < this.kingdomCards.length; i++) {
    if (this.kingdomCards[i][condition]) {
      return true;
    }
  }
  return false;
};

CardList.prototype.includesRuins = function() {
  return this.includesCondition("ruins");
};

CardList.prototype.includesSpoils = function() {
  return this.includesCondition("spoils");
};


CardList.countBySet = function (cardArray, setName) {
  return _.inject(cardArray, function (memo, card) {
    return memo + (card.set === setName ? 1 : 0);
  }, 0);
};

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

CardList.prototype.setMinMax = function() {
  this.options.min = this.options.min || {};
  this.options.max = this.options.max || {};
  this.min = {};
  this.max = {};
  this.sets.forEach (function (set) {
    this.min[set] = this.options.min[set] || 0;
    this.max[set] = this.options.max[set] || 11;
    if (this.max[set] < this.min[set]) {
      this.max[set] = 11;
    }
  }.bind(this));
};

CardList.prototype.resetKingdom = function () {
  this.resetCards(this.kingdomCards);
  this.resetCards(this.events);
};

CardList.prototype.resetCards = function (array) {
  if (array) {
    array.forEach(function (card) {
      card.hide();
    });
  }
};


})();

(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.CardList = function () {
  this.byName = {};
  this.sets = [];
  this.conditions = {};
};

var CardList = Dominionator.CardList;


CardList.prototype.constructCurrentCards = function(options) {
  options = options || {};
  this.currentCards = [];
  var sets = options.sets || this.sets;

  for (var i = 0; i < sets.length; i++) {
    this.currentCards = this.currentCards.concat(this[sets[i]]);
  }

  if (options.banned) {
    banned_cards = this.constructCardsByName(options.banned);
    this.currentCards = _.reject(this.currentCards, function (card) {
      return (_.findWhere(banned_cards, {name: card.name }) !== undefined);
    });
  }

  CardList.prototype.constructCardsByName = function (card_names) {
    return _.map(card_names, function (name) {
      return this.byName[name];
    }.bind(this));
  };
};

CardList.prototype.selectRandomCards = function(options) {
  options = options || {};
  this.constructCurrentCards(options);
  this.selectKingdomCards(options);
  this.selectSheltersPlatCol(options);
};

CardList.prototype.selectKingdomCards = function(options) {
  var counter = 0, card;
  this.kingdomCards = [];
  this.events = [];
  while (this.kingdomCards.length < 10 && counter < 100) {
    card = this.selectRandomCard();
    if (this.isValidEvent(card)) {
      this.events.push(card);
    } else if (this.isValidKingdomCard(card)) {
      card.bane = false;
      this.kingdomCards.push(card);
      counter += 1;
      if (counter >= 100) {
        throw "unable to find cards satisfying conditions";
      }
    }
  }
  this.processSpecialCases(options);
};

CardList.prototype.isValidEvent = function (card) {
  return card.isEvent &&
    this.events.length < 2 &&
    this.events.indexOf(card) < 0;
};

CardList.prototype.isValidKingdomCard = function (card, options) {
  return !this.isEvent && this.kingdomCards.indexOf(card) < 0;
};

CardList.prototype.selectSheltersPlatCol = function (options) {
  options = options || {};
  this.shelters = this.selectShelters(options);
  this.platCol = this.selectPlatCol(options);
};

CardList.prototype.selectRandomCard = function (options) {
  return  _.sample(this.currentCards);
};

CardList.prototype.selectShelters = function(options) {
  var pctDarkAges = CardList.countBySet(this.kingdomCards, "Dark Ages")/10;
  return Math.random() <= pctDarkAges;
};

CardList.prototype.selectPlatCol = function(options) {
  var pctProsperity = CardList.countBySet(this.kingdomCards, "Prosperity")/10;
  return Math.random() <= pctProsperity;
};

CardList.prototype.processSpecialCases = function(options) {
  options = options || {};
  this.processYoungWitch(options);
};

CardList.prototype.processYoungWitch = function(options) {
  if (_.findWhere(this.kingdomCards, {name: "Young Witch"})) {
    this.addBaneCard(options);
  }
};

CardList.prototype.addBaneCard = function(options) {
  options = options || {};
  var counter = 0, card;
  while (counter < 100) {
    card = this.selectRandomCard();
    if (this.isValidKingdomCard(card, options) && card.meetsBaneCost()) {
      card.bane = true;
      this.kingdomCards.push(card);
      break;
    } else {
      counter += 1;
      if (counter >= 100) {
        throw "unable to find cards satsifying conditions";
      }
    }
  }
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
  this.includesCondition("ruins");
};

CardList.prototype.includesSpoils = function() {
  this.includesCondition("spoils");
};


CardList.countBySet = function (cardArray, setName) {
  return _.inject(cardArray, function (memo, card) {
    return memo + (card.set === setName ? 1 : 0);
  }, 0);
};

CardList.prototype.initializeCards = function () {
  var request = new XMLHttpRequest();
  request.addEventListener("load", this.loadCards.bind(this), false);
  request.open("GET", 'dominion_cards.csv', true);
  request.send();
};

CardList.prototype.loadCards = function (response) {
  var list = this;
  Papa.parse(response.currentTarget.response, {
    header: true,
    dynamicTyping: true,
    complete: function(papaResponse) {
      for (var i = 0; i < papaResponse.data.length; i++) {
        list.addCard(papaResponse.data[i]);
      }
    }
  });
};

CardList.prototype.addCard = function (array) {
  var card = new Dominionator.Card(array);
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
  this.kingdomCards = CardList.sortByProperties(this.kingdomCards, properties);
};

CardList.sortByProperties = function (cards, properties) {
  var sorter = CardList.constructSorter(properties);
  return cards.sort(sorter);
};

CardList.constructSorter = function (properties) {
  return function (card1, card2) {
    var result;
    for (var i = 0; i < properties.length; i++) {
      result = CardList.compareProperty(card1, card2, properties[i]);
      if (result) {
        return result;
      }
    }
    return 0;
  };
};

CardList.compareProperty = function (card1, card2, property) {
  if (property === 'cost') {
    return card1.compareCost(card2);
  } else if (card1[property] > card2[property]) {
      return 1;
  } else if (card1[property] < card2[property]) {
    return -1;
  } else {
    return 0;
  }
};

})();

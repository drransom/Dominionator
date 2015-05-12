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
  this.setMinMax(options);

  for (var i = 0; i < sets.length; i++) {
    this.currentCards = this.currentCards.concat(this[sets[i]]);
  }

  if (options.banned) {
    banned_cards = this.constructCardsByName(options.banned);
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

CardList.prototype.selectRandomCards = function(options) {
  options = options || {};
  this.constructCurrentCards(options);
  this.selectKingdomCards(options);
  this.selectSheltersPlatCol(options);
};

CardList.prototype.selectKingdomCards = function(options) {
  options = options || {};
  var counter = 0;
  this.kingdomCards = [];
  this.events = [];
  this.vetoed = [];
  this.updateKingdomCards(options);
};

CardList.prototype.updateKingdomCards = function (options) {
  this.currentCards = _.shuffle(this.currentCards);
  options = options || {};
  if (options.minSets) {
    this.selectCardsFromSets(options.minSets);
  }
  while (this.kingdomCards.length < 10 && this.currentCards.length > 0) {
    this.trySelectOneCard(options);
  }
  this.processSpecialCases(options);
};

CardList.prototype.selectCardsFromSets = function(setHash) {
  var currentSet, set, i;
  for (set in setHash) {
    this.selectnCardsFromSet(set, setHash[set]);
  }
};

CardList.prototype.selectnCardsFromSet = function (set, numCards) {
  var currentKingdom, events, counter = 0, card, currentNum;
  currentNum = _.where(this.kingdomCards, {set: set}).length;
  currentKingdom = _.shuffle(_.where(cardArray, {isEvent: false }));
  events = _.where(this[set], {isEvent: true});
  while (currentKingdom.length > 0 && counter < (numCards - currentNum) &&
         this.kingdomCards.length < 10) {
    card = currentKingdom.pop();
    if (this.isValidKingdomCard(card)) {
      counter += 1;
      this.kingdomCards.push(card);
    }
  }
  this.currentCards += this.currentCards.concat(currentKingdom).concat(events);
};

CardList.prototype.trySelectOneCard = function (options) {
  var card = this.currentCards.pop();
  options = options || {};
  if (this.isValidEvent(card) && !options.noEvent) {
    this.events.push(card);
  } else if (this.isValidKingdomCard(card)) {
    card.bane = false;
    this.kingdomCards.push(card);
  }
};

CardList.prototype.isValidEvent = function (card) {
  return card.isEvent && !this.isVetoedCard(card) &&
         this.events.length < 2 && this.events.indexOf(card) < 0;
};

CardList.prototype.isValidKingdomCard = function (card, options) {
  return !card.isEvent && !this.isVetoedCard(card) &&
         this.kingdomCards.indexOf(card) < 0 &&
         CardList.countBySet(this.kingdomCards, card.set) < this.max[card.set];
};

CardList.prototype.selectSheltersPlatCol = function (options) {
  options = options || {};
  this.shelters = this.selectShelters(options);
  this.platCol = this.selectPlatCol(options);
};

CardList.prototype.selectRandomCard = function (options) {
  return  this.currentCards.pop();
};

CardList.prototype.selectShelters = function(options) {
  options = options || {};
  if (options.shelters === undefined) {
    var pctDarkAges = CardList.countBySet(this.kingdomCards, "Dark Ages")/10;
    return Math.random() <= pctDarkAges;
  } else {
    return options.shelters;
  }
};

CardList.prototype.selectPlatCol = function(options) {
  options = options || {};
  if (options.platCol === undefined) {
    var pctProsperity = CardList.countBySet(this.kingdomCards, "Prosperity")/10;
    return Math.random() <= pctProsperity;
  } else {
    return options.platCol;
  }
};

CardList.prototype.processSpecialCases = function(options) {
  options = options || {};
  this.processYoungWitch(options);
};

CardList.prototype.processYoungWitch = function(options) {
  if (this.kingdomCards.length <= 10 &&
      _.findWhere(this.kingdomCards, {name: "Young Witch"})) {
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
      this.currentCards.unshift(card);
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

CardList.prototype.sortCurrentByKingdom = function (kingdomName) {
  var sorter = CardList.compareConstructSorter([0], kingdomName);
  this.currentCards = this.currentCards.sort(sorter);
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

CardList.prototype.setMinMax = function(options) {
  options = options || {};
  options.min = options.min || {};
  options.max = options.max || {};
  this.min = {};
  this.max = {};
  this.sets.forEach (function (set) {
    this.min[set] = options.min[set] || 0;
    this.max[set] = options.max[set] || 11;
  }.bind(this));
};

})();

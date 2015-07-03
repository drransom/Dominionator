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

CardList.prototype.selectKingdomCards = function () {
  var counter = 0;
  this.kingdomCards = [];
  this.events = [];
  this.vetoed = [];
  this.updateKingdomCards(true);
};

CardList.prototype.updateKingdomCards = function (chooseEvents) {
  chooseEvents = chooseEvents || false;
  this.currentCards = _.shuffle(this.currentCards);
  this.selectCardsFromEachSet(this.min, chooseEvents);
  while (this.kingdomCards.length < this.maxCards && this.currentCards.length > 0) {
    this.trySelectOneCard(chooseEvents);
  }
  this.processSpecialCases();
};

CardList.prototype.selectCardsFromEachSet = function(setHash, chooseEvents) {
  var currentSet, set, i;
  for (set in setHash) {
    if (setHash[set] !== 0) {
      this.selectnCardsFromSet(set, setHash[set], chooseEvents);
    }
  }
};

CardList.prototype.selectnCardsFromSet = function (set, numCards, chooseEvents) {
  var currentSet, currentKigdomEvents, otherCards, events, counter = 0, card, currentNum;
  currentNum = _.where(this.kingdomCards, {set: set}).length;
  currentSet = _.shuffle(_.where(this.currentCards, {set: set}));
  otherCards = _.reject(this.currentCards,
    function (card) { return (card.set === set); });
  while (currentSet.length > 0 && counter < (numCards - currentNum) &&
         this.kingdomCards.length < 10) {
    card = currentSet.pop();
    if (this.isValidKingdomCard(card)) {
      counter += 1;
      card.addToKindgom({kingdomCards: this.kingdomCards});
    } else if (this.isValidEvent(card) && chooseEvents &&
        (!otherCards.length ||
          Math.random() < (currentSet.length / otherCards.length))) {
      this.events.push(card);
    }
  }
  this.currentCards = _.shuffle(currentSet.concat(otherCards));
};

CardList.prototype.trySelectOneCard = function (chooseEvents) {
  var card = this.currentCards.pop();
  if (chooseEvents && this.isValidEvent(card)) {
    this.events.push(card);
  } else if (this.isValidKingdomCard(card)) {
    card.addToKingdom({kingdomCards: this.kingdomCards});
  }
};

CardList.prototype.isValidEvent = function (card) {
  return card.isEvent && !this.isVetoedCard(card) &&
         this.events.length < 2 && this.events.indexOf(card) < 0;
};

CardList.prototype.isValidKingdomCard = function (card) {
  return !card.isEvent && !this.isVetoedCard(card) &&
         this.kingdomCards.indexOf(card) < 0 &&
         CardList.countBySet(this.kingdomCards, card.set) < this.max[card.set];
};

CardList.prototype.selectSheltersPlatCol = function() {
  this.shelters = this.selectShelters(this.options);
  this.platCol = this.selectPlatCol(this.options);
};

CardList.prototype.selectRandomCard = function() {
  return this.currentCards.pop();
};

CardList.prototype.selectShelters = function() {
  if (this.options.shelters === undefined) {
    var pctDarkAges = CardList.countBySet(this.kingdomCards, "Dark Ages")/10;
    return Math.random() <= pctDarkAges;
  } else {
    return this.options.shelters;
  }
};

CardList.prototype.selectPlatCol = function() {
  if (this.options.platCol === undefined) {
    var pctProsperity = CardList.countBySet(this.kingdomCards, "Prosperity")/10;
    return Math.random() <= pctProsperity;
  } else {
    return this.options.platCol;
  }
};

CardList.prototype.processSpecialCases = function() {
  this.processYoungWitch();
};

CardList.prototype.processYoungWitch = function() {
  if (this.kingdomCards.length <= this.maxCards &&
      _.findWhere(this.kingdomCards, {name: "Young Witch"}) &&
      !_.findWhere(this.kingdomCards, {bane: true})) {
    this.addBaneCard();
  }
};

CardList.prototype.addReplacementBaneCard = function () {
  this.maxCards -=1;
  this.addBaneCard();
};

CardList.prototype.addBaneCard = function() {
  var counter = 0, card;
  while (counter < 100) {
    card = this.selectRandomCard();
    if (this.isValidKingdomCard(card) && card.meetsBaneCost()) {
      card.bane = true;
      card.unhide();
      this.kingdomCards.push(card);
      this.maxCards += 1;
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
          list.addCard(papaResponse.data[i]);
        }
        callback.call();
      }
    });
  };
};

CardList.prototype.addCard = function (array) {
  var card = new Dominionator.Card(array);
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

CardList.prototype.alchemyConditionMet = function () {
  var numAlchemy = this.numAlchemyCards();
  return (numAlchemy >=3 && numAlchemy <= 5);
};

CardList.prototype.numAlchemyCards = function () {
  return _.select(this.kingdomCards, {set: "Alchemy"}).length;
};

CardList.prototype.resetKingdom = function () {
  if (this.kingdomCards) {
    this.kingdomCards.forEach(function (card) {
      card.hide();
    });
  }
};


})();

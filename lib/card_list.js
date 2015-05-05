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
  this.constructCurrentCards(options);
  this.kingdomCards = _.sample(this.currentCards, 10);
  this.shelters = this.selectShelters(options);
  this.platCol = this.selectPlatCol(options);
};

CardList.prototype.selectShelters = function(options) {
  var pctDarkAges = Dominionator.CardList.countBySet(this.kingdomCards, "Dark Ages");
  return Math.random() <= pctDarkAges;
};

CardList.prototype.selectPlatCol = function(options) {
  var pctProsperity = Dominionator.CardList.countBySet(this.kingdomCards, "Prosperity");
  return Math.random() <= pctProsperity;
};

CardList.countBySet = function (cardArray, setName) {
  return _.inject(cardArray, function (memo, card) {
    return memo + (card.set === setName ? 1 : 0);
  }, 0);
};

Dominionator.InitializeCards = function () {
  var request = new XMLHttpRequest();
  request.addEventListener("load", Dominionator.LoadCards, false);
  request.open("GET", 'dominion_cards.csv', true);
  request.send();
};

Dominionator.LoadCards = function (response) {
  Papa.parse(response.currentTarget.response, {
    header: true,
    dynamicTyping: true,
    complete: function(papaResponse) {
      Dominionator.allCards = new Dominionator.CardList();
      for (var i = 0; i < papaResponse.data.length; i++) {
        Dominionator.allCards.addCard(new Dominionator.Card(papaResponse.data[i]));
      }
    }
  });
};

CardList.prototype.addCard = function (array) {
  var card = new Dominionator.Card(array);
  if (this[card.set] === undefined) {
    this[card.set] = [card];
    this.sets.push(card.set);
  } else {
    this[card.set].push(card);
  }
  this.byName[card.name] = card;
};

})();
